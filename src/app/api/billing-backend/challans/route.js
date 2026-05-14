// app/api/billing-backend/challans/route.js
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

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

// ── POST ─────────────────────────────────────────────────────────────
// Challans_Data:  A=challanNo, B=orderNo, C=customerName, D=challanDate,
//                 E=deliveryNote, F=challanTotal, G=status, H=hidePrice
//
// Challan_Items:  A=challanNo, B=product, C=unit, D=quantity, E=rate,
//                 F=amount, G=calculatedQty, H=orderedQty, I=sentQty,
//                 J=size, K=lengthDisplay
//
// Challan_Charges: A=challanNo, B=name, C=amount, D=type
// ─────────────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const { challan, items, charges } = await request.json();

    console.log('=== BACKEND POST CHALLAN ===');
    console.log('Received challan:', JSON.stringify(challan, null, 2));

    // ✅ FIXED: challan.customerName check (not order.customerName)
    if (!challan?.customerName) {
      return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
    }
    if (!challan?.challanNo) {
      return NextResponse.json({ success: false, error: 'Challan number required' }, { status: 400 });
    }

    // Challans_Data - 8 columns (A to H)
    const challanRow = [
      challan.challanNo    || '',                      // A
      challan.orderNo      || '',                      // B
      challan.customerName || '',                      // C
      challan.challanDate  || '',                      // D
      challan.deliveryNote || '',                      // E
      (challan.challanTotal|| 0).toFixed(2),           // F
      challan.status       || 'Delivered',             // G
      challan.hidePrice ? 'TRUE' : 'FALSE',            // H
    ];

    await appendWithRetry('Challans_Data!A2', [challanRow]);
    console.log('✓ Challan saved to Challans_Data');

    // Challan_Items - 11 columns (A to K)
    const regularItems = (items || []).filter(it => !it.isCharge && it.product);
    const itemRows = regularItems.map(it => [
      challan.challanNo,                               // A
      it.product       || '',                          // B
      it.unit          || '',                          // C
      it.quantity      || it.sentQty || '',            // D
      it.rate          || '',                          // E
      (it.amount       || 0).toFixed(2),               // F
      (it.calculatedQty|| 0).toFixed(3),               // G
      (it.orderedQty   || 0).toFixed(3),               // H
      (it.sentQty      || it.pieces || 0).toString(),  // I
      it.size          || '',                          // J
      it.lengthDisplay || '',                          // K
    ]);

    if (itemRows.length > 0) {
      await appendWithRetry('Challan_Items!A2', itemRows);
      console.log(`✓ ${itemRows.length} items saved to Challan_Items`);
    }

    // Challan_Charges - 4 columns (A to D)
    const validCharges = (charges || []).filter(ch => (ch.name || ch.chargeName) && ch.amount > 0);
    const chargeRows = validCharges.map(ch => [
      challan.challanNo,                               // A
      ch.name || ch.chargeName || '',                  // B
      (ch.amount || 0).toFixed(2),                     // C
      ch.type || ch.chargeType || 'custom',            // D
    ]);

    if (chargeRows.length > 0) {
      await appendWithRetry('Challan_Charges!A2', chargeRows);
      console.log(`✓ ${chargeRows.length} charges saved to Challan_Charges`);
    }

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

// ── GET ───────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [challansRes, itemsRes, chargesRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challans_Data!A2:H' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challan_Items!A2:K' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challan_Charges!A2:D' }),
    ]);

    const challanRows = challansRes.data.values || [];
    const itemRows    = itemsRes.data.values    || [];
    const chargeRows  = chargesRes.data.values  || [];

    // Items map
    const itemsMap = {};
    itemRows.forEach(row => {
      if (!row || !row[0]) return;
      const challanNo = row[0].trim();
      if (!itemsMap[challanNo]) itemsMap[challanNo] = [];
      itemsMap[challanNo].push({
        product:      row[1]  || '',
        unit:         row[2]  || '',
        quantity:     row[3]  || '',
        rate:         parseFloat(row[4])  || 0,
        amount:       parseFloat(row[5])  || 0,
        calculatedQty:parseFloat(row[6])  || 0,
        orderedQty:   parseFloat(row[7])  || 0,
        sentQty:      parseFloat(row[8])  || 0,
        size:         row[9]  || '',
        lengthDisplay:row[10] || '',
        isCharge:     false,
      });
    });

    // Charges map
    const chargesMap = {};
    chargeRows.forEach(row => {
      if (!row || !row[0]) return;
      const challanNo = row[0].trim();
      if (!chargesMap[challanNo]) chargesMap[challanNo] = [];
      chargesMap[challanNo].push({
        name:   row[1] || '',
        amount: parseFloat(row[2]) || 0,
        type:   row[3] || 'custom',
      });
    });

    // Challans
    const challans = challanRows.map(row => {
      if (!row || !row[0]) return null;
      const challanNo = row[0].trim();
      return {
        challanNo,
        orderNo:      row[1] || '',
        customerName: row[2] || '',
        challanDate:  row[3] || '',
        deliveryNote: row[4] || '',
        challanTotal: parseFloat(row[5]) || 0,
        status:       row[6] || 'Delivered',
        hidePrice:    row[7]?.toString().toLowerCase() === 'true',
        items:        itemsMap[challanNo]   || [],
        charges:      chargesMap[challanNo] || [],
      };
    }).filter(Boolean);

    challans.sort((a, b) => new Date(b.challanDate) - new Date(a.challanDate));
    return NextResponse.json({ success: true, data: challans, total: challans.length });

  } catch (error) {
    console.error('GET /challans error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────
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