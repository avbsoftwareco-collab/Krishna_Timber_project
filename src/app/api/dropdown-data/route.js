// app/api/dropdown-data/route.js

// ✅ Production caching disable karo
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../config/googleSheet';

const normalizeText = v => String(v || '').trim();

const makeKey = (p) =>
  [
    normalizeText(p.materialType || 'Custom'),
    normalizeText(p.category || 'Custom'),
    normalizeText(p.subCategory || ''),
    normalizeText(p.materialName || ''),
    normalizeText(p.unit || 'Pcs'),
  ].join('|').toLowerCase();

// ✅ Single call mein saara data fetch karo - fastest approach
async function fetchAllDropdownData() {
  try {
    console.log('Fetching all dropdown data...');

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A2:F5000', // ✅ 2000+ rows ke liye enough
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    });

    const rows = response.data.values || [];
    console.log(`Total rows fetched from sheet: ${rows.length}`);
    return rows;

  } catch (error) {
    console.error('Error fetching dropdown data:', error.message);
    throw error;
  }
}

// ✅ SKU Generator
async function generateUniqueSku() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!F2:F5000',
    });

    const existingSkus = response.data.values?.flat()
      .filter(sku => sku && sku.toString().trim() !== '') || [];

    const existingNumbers = existingSkus
      .map(sku => {
        const match = sku.toString().match(/SKU_(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);

    const maxNumber = existingNumbers.length > 0
      ? Math.max(...existingNumbers)
      : 1000;

    return `SKU_${String(maxNumber + 1).padStart(4, '0')}`;
  } catch (error) {
    console.error('SKU generation error:', error.message);
    // Fallback SKU with timestamp
    return `SKU_${Date.now().toString().slice(-6)}`;
  }
}

// ✅ Rows ko products mein convert karo
function rowsToProducts(rows) {
  const products = [];
  let id = 1;

  for (const row of rows) {
    // Empty row skip karo
    if (!row || row.length === 0) continue;

    const materialName = row[3]?.toString().trim();

    // materialName nahi hai to skip
    if (!materialName) continue;

    products.push({
      id: id++,
      materialType: row[0]?.toString().trim() || '',
      category: row[1]?.toString().trim() || '',
      subCategory: row[2]?.toString().trim() || '',
      materialName: materialName,
      unit: row[4]?.toString().trim() || 'CFT',
      skuCode: row[5]?.toString().trim() || '',
    });
  }

  return products;
}

// ============================================
// ✅ GET - Saara data fetch karo
// ============================================
export async function GET() {
  try {
    console.log('GET /dropdown-data called');

    const rows = await fetchAllDropdownData();

    if (rows.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: true,
          data: [],
          message: 'No products found',
          total: 0,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }

    const products = rowsToProducts(rows);

    console.log(`Valid products: ${products.length}`);

    // ✅ Debug - material type wise count log karo
    const typeCount = {};
    products.forEach(p => {
      const type = p.materialType || 'Unknown';
      if (!typeCount[type]) typeCount[type] = 0;
      typeCount[type]++;
    });
    console.log('Products per material type:', typeCount);

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: products,
        total: products.length,
        debug: {
          totalRowsFetched: rows.length,
          validProducts: products.length,
          perMaterialType: typeCount,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // ✅ Cache bilkul nahi
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );

  } catch (error) {
    console.error('GET /dropdown-data error:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}




// ============================================
// ✅ First Empty Row Finder
// ============================================
async function findFirstEmptyRow() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A2:A5000', // Row 2 se start (Row 1 = Header)
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    const rows = response.data.values || [];
    
    console.log(`Total rows with data in column A: ${rows.length}`);

    // ✅ Pehli empty row dhundho
    for (let i = 0; i < rows.length; i++) {
      const cellValue = rows[i]?.[0]?.toString().trim();
      
      if (!cellValue) {
        // +2 isliye: i=0 means row 2 (header skip), 0-indexed to 1-indexed
        const emptyRowNumber = i + 2;
        console.log(`First empty row found at: ${emptyRowNumber}`);
        return emptyRowNumber;
      }
    }

    // Agar koi empty row nahi mili to next row return karo
    const nextRow = rows.length + 2;
    console.log(`No empty row found, next row: ${nextRow}`);
    return nextRow;

  } catch (error) {
    console.error('Error finding empty row:', error.message);
    throw error;
  }
}

// ============================================
// ✅ POST - Products add karo
// ============================================


export async function POST(request) {
  try {
    const body = await request.json();
    const incomingProducts = Array.isArray(body.products)
      ? body.products
      : body.product ? [body.product] : [];

    if (!incomingProducts.length) {
      return NextResponse.json({ success: true, data: [], added: 0 });
    }

    // Existing data fetch karo
    const rows = await fetchAllDropdownData();
    const existingMap = new Map();

    rows.forEach(row => {
      if (row[3] && row[3].toString().trim() !== '') {
        const item = {
          materialType: row[0]?.toString().trim() || '',
          category: row[1]?.toString().trim() || '',
          subCategory: row[2]?.toString().trim() || '',
          materialName: row[3]?.toString().trim() || '',
          unit: row[4]?.toString().trim() || 'Pcs',
          skuCode: row[5]?.toString().trim() || '',
        };
        existingMap.set(makeKey(item), item);
      }
    });

    const newRows = [];
    const savedProducts = [];

    for (const raw of incomingProducts) {
      const product = {
        materialType: normalizeText(raw.materialType) || 'Custom',
        category: normalizeText(raw.category) || 'Custom',
        subCategory: normalizeText(raw.subCategory),
        materialName: normalizeText(raw.materialName),
        unit: normalizeText(raw.unit) || 'Pcs',
        skuCode: normalizeText(raw.skuCode),
      };

      if (!product.materialName) continue;

      const key = makeKey(product);
      const existing = existingMap.get(key);

      if (existing) {
        savedProducts.push(existing);
        continue;
      }

      if (!product.skuCode) {
        product.skuCode = await generateUniqueSku();
      }

      newRows.push([
        product.materialType,
        product.category,
        product.subCategory,
        product.materialName,
        product.unit,
        product.skuCode,
      ]);

      existingMap.set(key, product);
      savedProducts.push(product);
    }

    // ✅ Pehli empty row dhundho aur wahan se data daalo
    if (newRows.length > 0) {
      
      // 🔍 Step 1: Pehli empty row find karo
      const startRow = await findFirstEmptyRow();
      const endRow = startRow + newRows.length - 1;
      
      // 📝 Step 2: Exact range banao - jaise A5:F7
      const targetRange = `Dropdown_data!A${startRow}:F${endRow}`;
      
      console.log(`Writing ${newRows.length} rows to range: ${targetRange}`);

      // ✅ Step 3: UPDATE use karo (append nahi) - exact position pe likhega
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: targetRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: { 
          values: newRows 
        },
      });
      
      console.log(`✅ Successfully added ${newRows.length} products starting from row ${startRow}`);
    }

    return NextResponse.json({
      success: true,
      data: savedProducts,
      added: newRows.length,
    });

  } catch (error) {
    console.error('POST /dropdown-data error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}




// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const incomingProducts = Array.isArray(body.products)
//       ? body.products
//       : body.product ? [body.product] : [];

//     if (!incomingProducts.length) {
//       return NextResponse.json({ success: true, data: [], added: 0 });
//     }

//     // Existing data fetch karo
//     const rows = await fetchAllDropdownData();
//     const existingMap = new Map();

//     rows.forEach(row => {
//       if (row[3] && row[3].toString().trim() !== '') {
//         const item = {
//           materialType: row[0]?.toString().trim() || '',
//           category: row[1]?.toString().trim() || '',
//           subCategory: row[2]?.toString().trim() || '',
//           materialName: row[3]?.toString().trim() || '',
//           unit: row[4]?.toString().trim() || 'Pcs',
//           skuCode: row[5]?.toString().trim() || '',
//         };
//         existingMap.set(makeKey(item), item);
//       }
//     });

//     const newRows = [];
//     const savedProducts = [];

//     for (const raw of incomingProducts) {
//       const product = {
//         materialType: normalizeText(raw.materialType) || 'Custom',
//         category: normalizeText(raw.category) || 'Custom',
//         subCategory: normalizeText(raw.subCategory),
//         materialName: normalizeText(raw.materialName),
//         unit: normalizeText(raw.unit) || 'Pcs',
//         skuCode: normalizeText(raw.skuCode),
//       };

//       if (!product.materialName) continue;

//       const key = makeKey(product);
//       const existing = existingMap.get(key);

//       if (existing) {
//         savedProducts.push(existing);
//         continue;
//       }

//       if (!product.skuCode) {
//         product.skuCode = await generateUniqueSku();
//       }

//       newRows.push([
//         product.materialType,
//         product.category,
//         product.subCategory,
//         product.materialName,
//         product.unit,
//         product.skuCode,
//       ]);

//       existingMap.set(key, product);
//       savedProducts.push(product);
//     }

//     // ✅ Append karo - next empty row mein automatically
//     if (newRows.length > 0) {
//       await sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range: 'Dropdown_data!A:F',
//         valueInputOption: 'USER_ENTERED',
//         insertDataOption: 'INSERT_ROWS',
//         requestBody: { values: newRows },
//       });
//       console.log(`Added ${newRows.length} new products`);
//     }

//     return NextResponse.json({
//       success: true,
//       data: savedProducts,
//       added: newRows.length,
//     });

//   } catch (error) {
//     console.error('POST /dropdown-data error:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message,
//     }, { status: 500 });
//   }
// }