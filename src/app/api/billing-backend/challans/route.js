
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

export async function POST(request) {
  try {
    const { challan, items, charges } = await request.json();

    console.log('Received challan data:', JSON.stringify(challan, null, 2)); // Debug

    if (!challan?.customerName) {
      return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
    }
    if (!challan?.challanNo) {
      return NextResponse.json({ success: false, error: 'Challan number required' }, { status: 400 });
    }

    // Columns A to P (16 columns) – orderNo removed
    const challanRow = [
      challan.challanNo,                         // A
      challan.customerName || '',                // B
      challan.customerPhone || '',               // C ✅
      challan.customerAddress || '',             // D ✅
      challan.vehicleNo || '',                   // E ✅
      challan.poNumber || '',                    // F ✅
      challan.gstCustomerName || '',             // G ✅
      challan.challanDate || '',                 // H
      challan.deliveryNote || '',                // I
      (challan.challanTotal || 0).toFixed(2),    // J
      challan.status || 'Delivered',             // K
      challan.hidePrice ? 'TRUE' : 'FALSE',      // L
      (challan.gstRate || 0).toFixed(2),         // M
      (challan.gstAmount || 0).toFixed(2),       // N
      (challan.subtotal || 0).toFixed(2),        // O
      (challan.chargesTotal || 0).toFixed(2),    // P
    ];

    await appendWithRetry('Challans_Data!A2', [challanRow]);
    console.log('✓ Challan saved with all fields');

    // Items (unchanged)
    const regularItems = (items || []).filter(it => !it.isCharge && it.product);
    const itemRows = regularItems.map(it => [
      challan.challanNo,
      it.product || '',
      it.unit || '',
      it.quantity || it.sentQty || '',
      it.rate || '',
      (it.amount || 0).toFixed(2),
      (it.calculatedQty || 0).toFixed(3),
      (it.orderedQty || 0).toFixed(3),
      (it.sentQty || it.pieces || 0).toString(),
      it.size || '',
      it.lengthDisplay || '',
    ]);
    if (itemRows.length > 0) await appendWithRetry('Challan_Items!A2', itemRows);

    // Charges (unchanged)
    const validCharges = (charges || []).filter(ch => (ch.name || ch.chargeName) && ch.amount > 0);
    const chargeRows = validCharges.map(ch => [
      challan.challanNo,
      ch.name || ch.chargeName || '',
      (ch.amount || 0).toFixed(2),
      ch.type || ch.chargeType || 'custom',
      ch.unit || 'Per Piece',
      (ch.quantity || 0).toString(),
      (ch.rate || 0).toString(),
    ]);
    if (chargeRows.length > 0) await appendWithRetry('Challan_Charges!A2', chargeRows);

    return NextResponse.json({ success: true, message: 'Challan created', challanNo: challan.challanNo });
  } catch (error) {
    console.error('POST /challans error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [challansRes, itemsRes, chargesRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challans_Data!A2:P' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challan_Items!A2:K' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challan_Charges!A2:G' }),
    ]);

    const challanRows = challansRes.data.values || [];
    const itemRows = itemsRes.data.values || [];
    const chargeRows = chargesRes.data.values || [];

    const itemsMap = {};
    itemRows.forEach(row => {
      if (!row || !row[0]) return;
      const challanNo = row[0].trim();
      if (!itemsMap[challanNo]) itemsMap[challanNo] = [];
      itemsMap[challanNo].push({
        product: row[1] || '',
        unit: row[2] || '',
        quantity: row[3] || '',
        rate: parseFloat(row[4]) || 0,
        amount: parseFloat(row[5]) || 0,
        calculatedQty: parseFloat(row[6]) || 0,
        orderedQty: parseFloat(row[7]) || 0,
        sentQty: parseFloat(row[8]) || 0,
        size: row[9] || '',
        lengthDisplay: row[10] || '',
        isCharge: false,
      });
    });

    const chargesMap = {};
    chargeRows.forEach(row => {
      if (!row || !row[0]) return;
      const challanNo = row[0].trim();
      if (!chargesMap[challanNo]) chargesMap[challanNo] = [];
      chargesMap[challanNo].push({
        name: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        type: row[3] || 'custom',
        unit: row[4] || 'Per Piece',
        quantity: parseFloat(row[5]) || 0,
        rate: parseFloat(row[6]) || 0,
      });
    });

    const challans = challanRows.map(row => {
      if (!row || !row[0]) return null;
      const challanNo = row[0].trim();
      return {
        challanNo,
        customerName: row[1] || '',
        customerPhone: row[2] || '',
        customerAddress: row[3] || '',
        vehicleNo: row[4] || '',
        poNumber: row[5] || '',
        gstCustomerName: row[6] || '',
        challanDate: row[7] || '',
        deliveryNote: row[8] || '',
        challanTotal: parseFloat(row[9]) || 0,
        status: row[10] || 'Delivered',
        hidePrice: row[11]?.toString().toLowerCase() === 'true',
        gstRate: parseFloat(row[12]) || 0,
        gstAmount: parseFloat(row[13]) || 0,
        subtotal: parseFloat(row[14]) || 0,
        chargesTotal: parseFloat(row[15]) || 0,
        items: itemsMap[challanNo] || [],
        charges: chargesMap[challanNo] || [],
      };
    }).filter(Boolean);

    challans.sort((a, b) => new Date(b.challanDate) - new Date(a.challanDate));
    return NextResponse.json({ success: true, data: challans, total: challans.length });
  } catch (error) {
    console.error('GET /challans error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE unchanged (same as before)
export async function DELETE(request) {
  try {
    const { challanNo } = await request.json();
    if (!challanNo) {
      return NextResponse.json({ success: false, error: 'challanNo required' }, { status: 400 });
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
      rows.forEach((r, idx) => { if (r[0]?.trim() === challanNo) indices.push(idx); });
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
    await deleteRowsFromSheet('Challans_Data');
    await deleteRowsFromSheet('Challan_Items');
    await deleteRowsFromSheet('Challan_Charges');
    return NextResponse.json({ success: true, message: `Challan ${challanNo} deleted` });
  } catch (error) {
    console.error('DELETE /challans error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}