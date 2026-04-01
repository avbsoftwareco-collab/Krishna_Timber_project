import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

// ─── GET: Saare bill items fetch karo ────────────────────────────────────────
// bill_items columns: A=billNo B=skuCode C=itemName D=unit E=quantity
//                     F=rate G=amount H=materialType I=date
export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'bill_items!A2:I',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, data: [], count: 0 });
    }

    const data = rows
      .filter((row) => row[0] && row[0].trim() !== '')
      .map((row) => ({
        billNo:       row[0]?.trim()  || '',
        skuCode:      row[1]?.trim()  || '',
        itemName:     row[2]?.trim()  || '',
        unit:         row[3]?.trim()  || '',
        quantity:     parseFloat(row[4] || 0),
        rate:         parseFloat(row[5] || 0),
        amount:       parseFloat(row[6] || 0),
        materialType: row[7]?.trim()  || '',
        date:         row[8]?.trim()  || '',
      }));

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('GET /api/bill-items error:', error);
    return NextResponse.json(
      { success: false, message: 'Bill items fetch fail', error: error.message },
      { status: 500 }
    );
  }
}