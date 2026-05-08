// app/api/billing-backend/challans/route.js
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

// ── Sheet names ──────────────────────────────────────────────────────────────
// Sheet: Challans_Data  → Columns: A=challanNo, B=orderNo, C=customerName,
//   D=challanDate, E=deliveryNote, F=challanTotal, G=status
//
// Sheet: Challan_Items  → Columns: A=challanNo, B=orderNo, C=product, D=unit,
//   E=orderedQty, F=sentQty, G=rate, H=amount

// ── GET: Fetch all challans with items ────────────────────────────────────────
export async function GET() {
  try {
    const [challansRes, itemsRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challans_Data!A2:G' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challan_Items!A2:H' }),
    ]);

    const challanRows = challansRes.data.values || [];
    const itemRows    = itemsRes.data.values    || [];

    // Build items map keyed by challanNo
    const itemsMap = {};
    itemRows.forEach(row => {
      const challanNo = row[0];
      if (!itemsMap[challanNo]) itemsMap[challanNo] = [];
      itemsMap[challanNo].push({
        product:    row[2] || '',
        unit:       row[3] || '',
        orderedQty: parseFloat(row[4]) || 0,
        sentQty:    parseFloat(row[5]) || 0,
        rate:       parseFloat(row[6]) || 0,
        amount:     parseFloat(row[7]) || 0,
      });
    });

    const challans = challanRows.map(row => ({
      challanNo:    row[0] || '',
      orderNo:      row[1] || '',
      customerName: row[2] || '',
      challanDate:  row[3] || '',
      deliveryNote: row[4] || '',
      challanTotal: parseFloat(row[5]) || 0,
      status:       row[6] || 'Delivered',
      items:        itemsMap[row[0]] || [],
    }));

    // Sort newest first
    challans.sort((a, b) => new Date(b.challanDate) - new Date(a.challanDate));

    return NextResponse.json({ success: true, data: challans, total: challans.length });
  } catch (error) {
    console.error('GET /challans error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Create new challan ──────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { challan, items } = await request.json();

    if (!challan?.orderNo) {
      return NextResponse.json({ success: false, error: 'Order reference required' }, { status: 400 });
    }
    if (!items?.length) {
      return NextResponse.json({ success: false, error: 'At least one item required' }, { status: 400 });
    }

    // Only save items with sentQty > 0
    const validItems = items.filter(it => parseFloat(it.sentQty) > 0);
    if (validItems.length === 0) {
      return NextResponse.json({ success: false, error: 'No items with quantity > 0' }, { status: 400 });
    }

    const challanRow = [
      challan.challanNo,
      challan.orderNo,
      challan.customerName  || '',
      challan.challanDate,
      challan.deliveryNote  || '',
      challan.challanTotal.toFixed(2),
      challan.status || 'Delivered',
    ];

    const itemRows = validItems.map(it => [
      challan.challanNo,
      challan.orderNo,
      it.product    || '',
      it.unit       || '',
      it.orderedQty || 0,
      it.sentQty,
      it.rate,
      it.amount || (it.sentQty * it.rate),
    ]);

    // Also update inventory sold qty
    // This calls the existing inventory update if you have it
    // You can add inventory deduction logic here if needed

    async function appendWithRetry(range, values, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          await sheets.spreadsheets.values.append({
            spreadsheetId, range,
            valueInputOption: 'RAW',
            requestBody: { values },
          });
          return;
        } catch (e) {
          if (i === retries - 1) throw e;
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }

    await appendWithRetry('Challans_Data!A2', [challanRow]);
    await appendWithRetry('Challan_Items!A2', itemRows);

    return NextResponse.json({
      success: true,
      message: 'Challan created successfully',
      challanNo: challan.challanNo,
    });
  } catch (error) {
    console.error('POST /challans error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



// app/api/billing-backend/challans/route.js — Add this DELETE handler

export async function DELETE(request) {
  try {
    const { challanNo } = await request.json();

    if (!challanNo) {
      return NextResponse.json(
        { success: false, error: 'challanNo required' },
        { status: 400 }
      );
    }

    // ── Delete from Challans_Data ──
    const challansRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Challans_Data!A2:H',
    });
    const challanRows = challansRes.data.values || [];
    const challanIdx = challanRows.findIndex(r => r[0] === challanNo);

    if (challanIdx !== -1) {
      // Get sheet ID for Challans_Data
      const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
      const challansSheet = sheetMeta.data.sheets.find(
        s => s.properties.title === 'Challans_Data'
      );

      if (challansSheet) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: challansSheet.properties.sheetId,
                  dimension: 'ROWS',
                  startIndex: challanIdx + 1, // +1 for header
                  endIndex: challanIdx + 2,
                },
              },
            }],
          },
        });
      }
    }

    // ── Delete from Challan_Items ──
    const itemsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Challan_Items!A2:H',
    });
    const itemRows = itemsRes.data.values || [];

    // Find all item row indices matching this challanNo (reverse order)
    const itemIndices = [];
    itemRows.forEach((r, idx) => {
      if (r[0] === challanNo) itemIndices.push(idx);
    });

    if (itemIndices.length > 0) {
      const sheetMeta2 = await sheets.spreadsheets.get({ spreadsheetId });
      const itemsSheet = sheetMeta2.data.sheets.find(
        s => s.properties.title === 'Challan_Items'
      );

      if (itemsSheet) {
        // Delete in reverse order so indices don't shift
        const requests = itemIndices
          .reverse()
          .map(idx => ({
            deleteDimension: {
              range: {
                sheetId: itemsSheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: idx + 1,
                endIndex: idx + 2,
              },
            },
          }));

        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Challan ${challanNo} deleted`,
    });
  } catch (error) {
    console.error('DELETE /challans error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}




//////////   TRY /////////


