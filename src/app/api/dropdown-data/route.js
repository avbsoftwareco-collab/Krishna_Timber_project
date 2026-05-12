
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

// Function to find first empty row
async function findFirstEmptyRow() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A:A',
    });
    
    const rows = response.data.values || [];
    console.log('Total rows in column A:', rows.length);
    
    // Start from row 2 (index 1 in array, because row 1 is header)
    for (let i = 1; i <= rows.length + 1; i++) {
      const cellValue = rows[i - 1]?.[0];
      const isEmpty = !cellValue || cellValue.toString().trim() === '';
      
      console.log(`Row ${i + 1}: Value = "${cellValue}", IsEmpty = ${isEmpty}`);
      
      if (isEmpty) {
        console.log(`✅ Found empty row at: ${i + 1}`);
        return i + 1; // Return sheet row number (1-based)
      }
    }
    
    // If no empty row found, add at the end
    const newRow = rows.length + 2;
    console.log(`No empty row found, adding at: ${newRow}`);
    return newRow;
  } catch (error) {
    console.error('Error finding empty row:', error);
    return null;
  }
}


// Function to find last row that has ANY data in columns A-F
async function findLastUsedRow() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A:F',
    });
    
    const rows = response.data.values || [];
    
    let lastNonEmptyRow = 1; // header row
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Check if ANY column from A to F has data
      const hasAnyData = row && row.some(cell => cell && cell.toString().trim() !== '');
      
      if (hasAnyData) {
        lastNonEmptyRow = i + 1; // Convert to sheet row number (1-based)
        console.log(`Row ${lastNonEmptyRow} has data:`, row);
      }
    }
    
    const nextEmptyRow = lastNonEmptyRow + 1;
    console.log(`Last row with data: ${lastNonEmptyRow}, Next empty row: ${nextEmptyRow}`);
    
    return nextEmptyRow;
  } catch (error) {
    console.error('Error finding last used row:', error);
    return null;
  }
}

// Alternative: Clean the sheet first (optional - remove partial rows)
async function cleanupPartialRows() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A:F',
    });
    
    const rows = response.data.values || [];
    const rowsToClear = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // If row has some data but not complete (missing materialName which is column D)
      const hasData = row && row.some(cell => cell && cell.toString().trim() !== '');
      const hasMaterialName = row && row[3] && row[3].toString().trim() !== '';
      
      if (hasData && !hasMaterialName) {
        // This is a partial/invalid row, mark for clearing
        rowsToClear.push(i + 1);
      }
    }
    
    // Clear partial rows
    for (const rowNum of rowsToClear) {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `Dropdown_data!A${rowNum}:F${rowNum}`,
      });
      console.log(`Cleared partial row: ${rowNum}`);
    }
    
    return rowsToClear.length;
  } catch (error) {
    console.error('Error cleaning partial rows:', error);
    return 0;
  }
}






async function generateUniqueSku(materialName) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Dropdown_data!F:F',
  });
  
  // Filter out empty values and get valid SKUs
  const existingSkus = response.data.values?.flat().filter(sku => sku && sku.toString().trim() !== '') || [];
  
  const existingNumbers = existingSkus
    .map(sku => {
      const match = sku.toString().match(/SKU_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);
  
  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1000; // Start from 1000 if no SKUs
  const newNumber = maxNumber + 1;
  
  return `SKU_${String(newNumber).padStart(4, '0')}`;
}

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A2:F',
    });
    const rows = response.data.values || [];
    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: [], message: 'No products found' });
    }
    const products = rows.map((row, index) => ({
      id: index + 1,
      materialType: row[0] || '',
      category: row[1] || '',
      subCategory: row[2] || '',
      materialName: row[3] || '',
      unit: row[4] || 'CFT',
      skuCode: row[5] || '',
    }));
    const validProducts = products.filter(p => p.materialName);
    return NextResponse.json({ success: true, data: validProducts, total: validProducts.length });
  } catch (error) {
    console.error('GET /dropdown-data error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const incomingProducts = Array.isArray(body.products)
      ? body.products
      : body.product ? [body.product] : [];

    if (!incomingProducts.length) {
      return NextResponse.json({ success: true, data: [], added: 0 });
    }

    // Optional: Clean up partial rows first
    await cleanupPartialRows();

    const existingResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A2:F',
    });
    const existingRows = existingResponse.data.values || [];
    const existingMap = new Map();
    existingRows.forEach(row => {
      // Only consider rows that have materialName (column D)
      if (row[3] && row[3].toString().trim() !== '') {
        const item = {
          materialType: row[0] || '',
          category: row[1] || '',
          subCategory: row[2] || '',
          materialName: row[3] || '',
          unit: row[4] || 'Pcs',
          skuCode: row[5] || '',
        };
        existingMap.set(makeKey(item), item);
      }
    });

    const rowsToUpdate = [];
    const savedProducts = [];

    // Get next available row after last data row
    let currentRow = await findLastUsedRow();
    
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
        product.skuCode = await generateUniqueSku(product.materialName);
      }
      
      if (currentRow) {
        rowsToUpdate.push({
          rowIndex: currentRow,
          values: [
            product.materialType,
            product.category,
            product.subCategory,
            product.materialName,
            product.unit,
            product.skuCode,
          ]
        });
        currentRow++; // Move to next row for next product
        console.log(`Will add product at row ${currentRow - 1}`);
      }

      existingMap.set(key, product);
      savedProducts.push(product);
    }

    // Batch update all rows
    for (const update of rowsToUpdate) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Dropdown_data!A${update.rowIndex}:F${update.rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [update.values] },
      });
    }

    return NextResponse.json({
      success: true,
      data: savedProducts,
      added: rowsToUpdate.length,
    });
  } catch (error) {
    console.error('POST /dropdown-data error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}