// app/api/billing-backend/returns/route.js
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet.js';

async function appendWithRetry(range, values, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
      return;
    } catch (e) {
      console.error(`Append retry ${i + 1} failed:`, e.message);
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

// ── POST - Create Return ──
export async function POST(request) {
  try {
    const { returnData, items } = await request.json();

    if (!returnData?.challanNo) {
      return NextResponse.json({ success: false, error: 'Challan number required' }, { status: 400 });
    }
    if (!returnData?.returnNo) {
      return NextResponse.json({ success: false, error: 'Return number required' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one return item required' }, { status: 400 });
    }

    // Return_Data row - 9 columns (A to I)
    const returnRow = [
      returnData.returnNo || '',           // A
      returnData.challanNo || '',          // B
      returnData.orderNo || '',            // C
      returnData.customerName || '',       // D
      returnData.returnDate || new Date().toISOString().split('T')[0], // E
      (returnData.returnTotal || 0).toFixed(2), // F
      returnData.reason || '',             // G
      returnData.notes || '',              // H
      returnData.status || 'Returned',     // I
    ];

    await appendWithRetry('Return_Data!A2', [returnRow]);
    console.log('✓ Return saved to Return_Data');

    // Return_Items rows - 11 columns (A to K)
    const itemRows = items
      .filter(it => parseFloat(it.returnQty || 0) > 0)
      .map(it => [
        returnData.returnNo,               // A
        returnData.challanNo,              // B
        it.product || '',                  // C
        it.unit || '',                     // D
        (it.returnQty || 0).toString(),    // E
        (it.returnPcs || 0).toString(),    // F
        (it.rate || 0).toString(),         // G
        (it.returnAmount || 0).toFixed(2), // H
        it.reason || returnData.reason || '', // I
        it.size || '',                     // J
        it.lengthDisplay || '',            // K
      ]);

    if (itemRows.length > 0) {
      await appendWithRetry('Return_Items!A2', itemRows);
      console.log(`✓ ${itemRows.length} return items saved`);
    }

    return NextResponse.json({
      success: true,
      message: 'Return created successfully',
      returnNo: returnData.returnNo,
    });
  } catch (error) {
    console.error('POST /returns error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── GET - Fetch All Returns ──
export async function GET() {
  try {
    const [returnsRes, itemsRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Return_Data!A2:I' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Return_Items!A2:K' }),
    ]);

    const returnRows = returnsRes.data.values || [];
    const itemRows = itemsRes.data.values || [];

    // Items map
    const itemsMap = {};
    itemRows.forEach(row => {
      if (!row || !row[0]) return;
      const returnNo = row[0].trim();
      if (!itemsMap[returnNo]) itemsMap[returnNo] = [];
      itemsMap[returnNo].push({
        returnNo: row[0] || '',
        challanNo: row[1] || '',
        product: row[2] || '',
        unit: row[3] || '',
        returnQty: parseFloat(row[4]) || 0,
        returnPcs: parseFloat(row[5]) || 0,
        rate: parseFloat(row[6]) || 0,
        returnAmount: parseFloat(row[7]) || 0,
        reason: row[8] || '',
        size: row[9] || '',
        lengthDisplay: row[10] || '',
      });
    });

    const returns = returnRows.map(row => {
      if (!row || !row[0]) return null;
      const returnNo = row[0].trim();
      return {
        returnNo,
        challanNo: row[1] || '',
        orderNo: row[2] || '',
        customerName: row[3] || '',
        returnDate: row[4] || '',
        returnTotal: parseFloat(row[5]) || 0,
        reason: row[6] || '',
        notes: row[7] || '',
        status: row[8] || 'Returned',
        items: itemsMap[returnNo] || [],
      };
    }).filter(Boolean);

    returns.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));

    return NextResponse.json({ success: true, data: returns, total: returns.length });
  } catch (error) {
    console.error('GET /returns error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE ──
export async function DELETE(request) {
  try {
    const { returnNo } = await request.json();
    if (!returnNo) {
      return NextResponse.json({ success: false, error: 'returnNo required' }, { status: 400 });
    }

    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });

    const deleteRowsFromSheet = async (sheetName) => {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId, range: `${sheetName}!A2:A`,
      });
      const rows = res.data.values || [];
      const sheet = sheetMeta.data.sheets.find(s => s.properties.title === sheetName);
      if (!sheet) return;
      const indices = [];
      rows.forEach((r, idx) => { if (r[0]?.trim() === returnNo) indices.push(idx); });
      for (const idx of indices.reverse()) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  dimension: 'ROWS',
                  startIndex: idx + 1,
                  endIndex: idx + 2,
                },
              },
            }],
          },
        });
      }
    };

    await deleteRowsFromSheet('Return_Data');
    await deleteRowsFromSheet('Return_Items');

    return NextResponse.json({ success: true, message: `Return ${returnNo} deleted` });
  } catch (error) {
    console.error('DELETE /returns error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}