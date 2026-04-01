




// app/api/purchase/requirement/dropdown/route.js
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../../config/googleSheet';

export async function GET(request) {
  try {
    console.log("✅ Dropdown API called");

    // BatchGet se dono sheets ek saath fetch kar rahe hain
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetId,
      ranges: [
        'Dropdown_data!A2:F',     // Materials data (SKU, Category, Name, Size, Unit, Grade)
        'Dropdown_data!J2:R'      // Suppliers data (Supplier Name, Firm, GST, Address, Contact, Brand Name)
      ],
    });

    const [materialRows, supplierRows] = response.data.valueRanges || [[], []];

    // ==================== Materials Data ====================
    const fullData = (materialRows.values || [])
      .map((row) => ({
        skuCode: row[0] || '',
        materialCategory: row[1] || '',
        materialName: row[2] || '',
        size: row[3] || '',
        unit: row[4] || '',
        materialGrade: row[5] || '',
      }))
      .filter(item => item.materialCategory && item.materialName);

    // ==================== Suppliers Data ====================
    const suppliers = (supplierRows.values || [])
      .map((row) => ({
        supplierName: row[0] || '',     // Column J
        supplierFirm: row[1] || '',     // Column K  ← yeh dropdown mein dikhna chahiye
        gstNumber: row[2] || '',        // Column L
        address: row[3] || '',          // Column M
        contactNumber: row[4] || '',    // Column N
        brandName: row[8] || '',        // Column R (agar brand bhi chahiye)
      }))
      .filter(item => item.supplierFirm);   // empty rows filter

    console.log(`📊 Materials fetched: ${fullData.length} | Suppliers fetched: ${suppliers.length}`);

    return NextResponse.json({
      success: true,
      data: {
        fullData,      // ← materials ke liye (purana wala)
        suppliers      // ← naya suppliers array
      }
    });

  } catch (error) {
    console.error("❌ Dropdown API Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch data from Google Sheet"
    }, { status: 500 });
  }
}