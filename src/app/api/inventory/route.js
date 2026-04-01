import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../api/config/googleSheet';

export async function GET() {
  try {
    // Read data from Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'inventory!A2:F', // A2 se utha rahe hain matlab header automatically skip ho gaya
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: 'No data found' },
        { status: 404 }
      );
    }

    // 🔥 MAIN FIX YAHAN HAI 🔥
    // 1. Pehle faltu / khali rows ko delete (filter) karo
    const validRows = rows.filter((row) => {
      // Check karte hain ki Row mein Material Type (row[0]) ya Material Name (row[1]) khali toh nahi hai
      const hasMaterialType = row[0] && row[0].trim() !== '';
      const hasMaterialName = row[1] && row[1].trim() !== '';
      
      // Agar dono mein se kuch bhi likha hai, toh hi row ko accept karo
      return hasMaterialType || hasMaterialName;
    });

    // 2. Ab sirf sahi rows ko object mein convert karo
    // (Aapne slice(1) lagaya tha, usko hata diya warna sheet ka pehla valid data delete ho jayega)
    const data = validRows.map((row) => ({
      materialType: row[0]?.trim() || '',
      materialName: row[1]?.trim() || '',
      unit: row[2]?.trim() || '',
      totalReceivedQty: row[3]?.trim() || '0',
      totalSoldQty: row[4]?.trim() || '0',
      currentStock: row[5]?.trim() || '0',
    }));

    return NextResponse.json(
      {
        success: true,
        data: data,
        count: data.length, // Ab count bhi ekdum sahi aayega
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}