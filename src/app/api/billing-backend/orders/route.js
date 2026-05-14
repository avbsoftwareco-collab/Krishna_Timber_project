


// app/api/billing-backend/orders/route.js
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
// Orders_Data: A=orderNo, B=customerName, C=customerPhone, D=customerAddress,
//              E=vehicleNo, F=orderDate, G=subtotal, H=chargesTotal,
//              I=tax, J=total, K=status, L=gstRate, M=notes,
//              N=poNumber, O=gstCustomerName, P=hidePrice, Q=includeGST
//
// Order_Items: A=orderNo, B=product, C=unit, D=quantity, E=rate,
//              F=amount, G=calculatedQty, H=lengthFeet, I=lengthInches,
//              J=size, K=specification, L=materialType, M=category,
//              N=subCategory, O=skuCode, P=isWood, Q=isSheet,
//              R=areaPerPiece, S=width, T=thickness, U=lengthDisplay
//
// Order_Charges: A=orderNo, B=uid, C=chargeName, D=chargeType,
//                E=unit, F=quantity, G=rate, H=amount
// ─────────────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const { order, items, charges } = await request.json();

    console.log('=== BACKEND POST ORDER ===');
    console.log('Received order:', JSON.stringify(order, null, 2));

    if (!order?.customerName) {
      return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
    }

    const regularItems = (items || []).filter(it => !it.isCharge && it.product);
    const validCharges = (charges || []).filter(ch => ch.chargeName && ch.amount > 0);

    // Orders_Data - 17 columns (A to Q)
    const orderRow = [
      order.orderNo        || '',               // A
      order.customerName   || '',               // B
      order.customerPhone  || '',               // C
      order.customerAddress|| '',               // D
      order.vehicleNo      || '',               // E ✅
      order.orderDate      || '',               // F
      (order.subtotal      || 0).toFixed(2),    // G
      (order.chargesTotal  || 0).toFixed(2),    // H
      (order.tax           || 0).toFixed(2),    // I
      (order.total         || 0).toFixed(2),    // J
      order.status         || 'Active',         // K
      (order.gstRate       || 0).toFixed(2),    // L
      order.notes          || '',               // M
      order.poNumber       || '',               // N
      order.gstCustomerName|| '',               // O
      order.hidePrice  ? 'TRUE' : 'FALSE',      // P
      order.includeGST ? 'TRUE' : 'FALSE',      // Q
    ];

    await appendWithRetry('Orders_Data!A2', [orderRow]);
    console.log('✓ Order saved to Orders_Data, vehicleNo:', orderRow[4]);

    // Order_Items - 21 columns (A to U)
    const itemRows = regularItems.map(it => [
      order.orderNo,                             // A
      it.product        || '',                   // B
      it.unit           || '',                   // C
      it.quantity       || '',                   // D
      it.rate           || '',                   // E
      (it.amount        || 0).toFixed(2),        // F
      (it.calculatedQty || 0).toFixed(3),        // G
      it.lengthFeet     || '',                   // H
      it.lengthInches   || '',                   // I
      it.size           || '',                   // J
      it.specification  || '',                   // K
      it.materialType   || '',                   // L
      it.category       || '',                   // M
      it.subCategory    || '',                   // N
      it.skuCode        || '',                   // O
      it.isWood  ? 'TRUE' : 'FALSE',             // P
      it.isSheet ? 'TRUE' : 'FALSE',             // Q
      it.areaPerPiece   || '',                   // R
      it.width          || '',                   // S
      it.thickness      || '',                   // T
      it.lengthDisplay  || '',                   // U
    ]);

    if (itemRows.length > 0) {
      await appendWithRetry('Order_Items!A2', itemRows);
      console.log(`✓ ${itemRows.length} items saved to Order_Items`);
    }

    // Order_Charges - 8 columns (A to H)
    const chargeRows = validCharges.map(ch => [
      order.orderNo,                                                              // A
      ch.uid || (Date.now() + '-' + Math.random().toString(36).slice(2, 7)),     // B
      ch.chargeName  || '',                                                       // C
      ch.chargeType  || 'custom',                                                 // D
      ch.unit        || 'Per Piece',                                              // E
      ch.quantity    || '',                                                       // F
      ch.rate        || '',                                                       // G
      (ch.amount     || 0).toFixed(2),                                           // H
    ]);

    if (chargeRows.length > 0) {
      await appendWithRetry('Order_Charges!A2', chargeRows);
      console.log(`✓ ${chargeRows.length} charges saved to Order_Charges`);
    }

    return NextResponse.json({ success: true, message: 'Order created successfully', orderNo: order.orderNo });

  } catch (error) {
    console.error('POST /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── GET ───────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [ordersRes, itemsRes, chargesRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Orders_Data!A2:Q' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Order_Items!A2:U' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Order_Charges!A2:H' }),
    ]);

    const orderRows  = ordersRes.data.values  || [];
    const itemRows   = itemsRes.data.values   || [];
    const chargeRows = chargesRes.data.values || [];

    // Items map
    const itemsMap = {};
    itemRows.forEach(row => {
      if (!row || row.length < 2) return;
      const orderNo = row[0]?.trim();
      if (!orderNo) return;
      if (!itemsMap[orderNo]) itemsMap[orderNo] = [];
      itemsMap[orderNo].push({
        product:      row[1]  || '',
        unit:         row[2]  || '',
        quantity:     row[3]  || '',
        rate:         row[4]  || '',
        amount:       parseFloat(row[5])  || 0,
        calculatedQty:parseFloat(row[6])  || 0,
        isCharge:     false,
        lengthFeet:   row[7]  || '',
        lengthInches: row[8]  || '',
        size:         row[9]  || '',
        specification:row[10] || '',
        materialType: row[11] || '',
        category:     row[12] || '',
        subCategory:  row[13] || '',
        skuCode:      row[14] || '',
        isWood:       row[15]?.toString().toLowerCase() === 'true',
        isSheet:      row[16]?.toString().toLowerCase() === 'true',
        areaPerPiece: row[17] ? parseFloat(row[17]) : null,
        width:        parseFloat(row[18]) || 0,
        thickness:    parseFloat(row[19]) || 0,
        lengthDisplay:row[20] || '',
      });
    });

    // Charges map
    const chargesMap = {};
    chargeRows.forEach(row => {
      if (!row || row.length < 2) return;
      const orderNo = row[0]?.trim();
      if (!orderNo) return;
      if (!chargesMap[orderNo]) chargesMap[orderNo] = [];
      chargesMap[orderNo].push({
        uid:        row[1] || '',
        chargeName: row[2] || '',
        chargeType: row[3] || 'custom',
        unit:       row[4] || 'Per Piece',
        quantity:   row[5] || '',
        rate:       row[6] || '',
        amount:     parseFloat(row[7]) || 0,
      });
    });

    // Orders
    const orders = orderRows.map(row => {
      if (!row || !row[0]) return null;
      const orderNo = row[0].trim();
      return {
        orderNo,
        customerName:    row[1]  || '',
        customerPhone:   row[2]  || '',
        customerAddress: row[3]  || '',
        vehicleNo:       row[4]  || '',   // E ✅
        orderDate:       row[5]  || '',
        subtotal:        parseFloat(row[6])  || 0,
        chargesTotal:    parseFloat(row[7])  || 0,
        tax:             parseFloat(row[8])  || 0,
        total:           parseFloat(row[9])  || 0,
        status:          row[10] || 'Active',
        gstRate:         parseFloat(row[11]) || 0,
        notes:           row[12] || '',
        poNumber:        row[13] || '',
        gstCustomerName: row[14] || '',
        hidePrice:       row[15]?.toString().toLowerCase() === 'true',
        includeGST:      row[16]?.toString().toLowerCase() === 'true',
        items:           itemsMap[orderNo]   || [],
        charges:         chargesMap[orderNo] || [],
      };
    }).filter(Boolean);

    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    return NextResponse.json({ success: true, data: orders, total: orders.length });

  } catch (error) {
    console.error('GET /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PATCH ─────────────────────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderNo, status } = body;

    if (!orderNo) {
      return NextResponse.json({ success: false, error: 'orderNo required' }, { status: 400 });
    }

    const ordersRes = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Orders_Data!A2:Q',
    });
    const rows = ordersRes.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] && row[0].trim() === orderNo);

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const sheetRow = rowIndex + 2;

    // Status only update
    if (status && !body.order) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Orders_Data!K${sheetRow}`,   // K = status column
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[status]] },
      });
      return NextResponse.json({ success: true, message: 'Status updated' });
    }

    // Full order update
    if (body.order && body.items) {
      const o = body.order;
      const updatedOrderRow = [
        orderNo,
        o.customerName    || '',
        o.customerPhone   || '',
        o.customerAddress || '',
        o.vehicleNo       || '',               // E ✅
        o.orderDate       || '',
        (o.subtotal       || 0).toFixed(2),
        (o.chargesTotal   || 0).toFixed(2),
        (o.tax            || 0).toFixed(2),
        (o.total          || 0).toFixed(2),
        o.status          || 'Active',
        (o.gstRate        || 0).toFixed(2),
        o.notes           || '',
        o.poNumber        || '',
        o.gstCustomerName || '',
        o.hidePrice  ? 'TRUE' : 'FALSE',
        o.includeGST ? 'TRUE' : 'FALSE',
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Orders_Data!A${sheetRow}:Q${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [updatedOrderRow] },
      });

      // Delete old items for this order
      const itemsRes = await sheets.spreadsheets.values.get({
        spreadsheetId, range: 'Order_Items!A2:A',
      });
      const allItemRows = itemsRes.data.values || [];
      const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
      const itemsSheet = sheetMeta.data.sheets.find(s => s.properties.title === 'Order_Items');

      if (itemsSheet) {
        const indicesToDelete = [];
        allItemRows.forEach((r, idx) => { if (r[0]?.trim() === orderNo) indicesToDelete.push(idx); });
        // Delete in reverse order to keep indices valid
        for (const idx of indicesToDelete.reverse()) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{
                deleteDimension: {
                  range: {
                    sheetId: itemsSheet.properties.sheetId,
                    dimension: 'ROWS',
                    startIndex: idx + 1,
                    endIndex: idx + 2,
                  },
                },
              }],
            },
          });
        }
      }

      // Append new items
      const regularItems = (body.items || []).filter(it => !it.isCharge && it.product);
      const newItemRows = regularItems.map(it => [
        orderNo,
        it.product        || '',
        it.unit           || '',
        it.quantity       || '',
        it.rate           || '',
        (it.amount        || 0).toFixed(2),
        (it.calculatedQty || 0).toFixed(3),
        it.lengthFeet     || '',
        it.lengthInches   || '',
        it.size           || '',
        it.specification  || '',
        it.materialType   || '',
        it.category       || '',
        it.subCategory    || '',
        it.skuCode        || '',
        it.isWood  ? 'TRUE' : 'FALSE',
        it.isSheet ? 'TRUE' : 'FALSE',
        it.areaPerPiece   || '',
        it.width          || '',
        it.thickness      || '',
        it.lengthDisplay  || '',
      ]);

      if (newItemRows.length > 0) {
        await appendWithRetry('Order_Items!A2', newItemRows);
      }

      // Delete old charges and append new ones
      const chargesRes = await sheets.spreadsheets.values.get({
        spreadsheetId, range: 'Order_Charges!A2:A',
      });
      const allChargeRows = chargesRes.data.values || [];
      const chargesSheet = sheetMeta.data.sheets.find(s => s.properties.title === 'Order_Charges');

      if (chargesSheet) {
        const chargeIndicesToDelete = [];
        allChargeRows.forEach((r, idx) => { if (r[0]?.trim() === orderNo) chargeIndicesToDelete.push(idx); });
        for (const idx of chargeIndicesToDelete.reverse()) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{
                deleteDimension: {
                  range: {
                    sheetId: chargesSheet.properties.sheetId,
                    dimension: 'ROWS',
                    startIndex: idx + 1,
                    endIndex: idx + 2,
                  },
                },
              }],
            },
          });
        }
      }

      const validCharges = (body.charges || []).filter(ch => ch.chargeName && ch.amount > 0);
      const newChargeRows = validCharges.map(ch => [
        orderNo,
        ch.uid || (Date.now() + '-' + Math.random().toString(36).slice(2, 7)),
        ch.chargeName  || '',
        ch.chargeType  || 'custom',
        ch.unit        || 'Per Piece',
        ch.quantity    || '',
        ch.rate        || '',
        (ch.amount     || 0).toFixed(2),
      ]);

      if (newChargeRows.length > 0) {
        await appendWithRetry('Order_Charges!A2', newChargeRows);
      }

      return NextResponse.json({ success: true, message: `Order ${orderNo} updated` });
    }

    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });

  } catch (error) {
    console.error('PATCH /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const { orderNo } = await request.json();

    if (!orderNo) {
      return NextResponse.json({ success: false, error: 'orderNo required' }, { status: 400 });
    }

    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });

    const deleteRowsFromSheet = async (sheetName, colRange) => {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId, range: `${sheetName}!A2:A`,
      });
      const rows = res.data.values || [];
      const sheet = sheetMeta.data.sheets.find(s => s.properties.title === sheetName);
      if (!sheet) return;
      const indices = [];
      rows.forEach((r, idx) => { if (r[0]?.trim() === orderNo) indices.push(idx); });
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

    await deleteRowsFromSheet('Orders_Data');
    await deleteRowsFromSheet('Order_Items');
    await deleteRowsFromSheet('Order_Charges');

    return NextResponse.json({ success: true, message: `Order ${orderNo} deleted` });

  } catch (error) {
    console.error('DELETE /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}