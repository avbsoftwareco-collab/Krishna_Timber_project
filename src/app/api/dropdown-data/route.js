import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../config/googleSheet';

// GET: Fetch Dropdown Data from Dropdown_data sheet
export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Dropdown_data!A2:F', // A=Material Type, B=Category, C=Sub Category, D=Material Name, E=Unit, F=SKU Code
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No products found',
      });
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

    // Filter out empty rows
    const validProducts = products.filter(p => p.materialName);

    return NextResponse.json({
      success: true,
      data: validProducts,
      total: validProducts.length,
    });

  } catch (error) {
    console.error('GET /dropdown-data error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}