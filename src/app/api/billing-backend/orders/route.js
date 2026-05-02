
// // app/api/billing-backend/orders/route.js
// import { NextResponse } from 'next/server';
// import { sheets, spreadsheetId } from '../../config/googleSheet';

// // ══════════════════════════════════════════════════════════════════════
// // Sheet 1: Orders_Data (Ek order = Ek row)
// // A=orderNo, B=customerName, C=customerPhone, D=customerAddress,
// // E=orderDate, F=poNumber, G=gstCustomerName, H=gstRate,
// // I=subtotal, J=tax, K=total, L=status, M=notes
// //
// // Sheet 2: Order_Items (Ek item = Ek row, proper columns)
// // A=orderNo, B=product, C=skuCode, D=materialType, E=category,
// // F=subCategory, G=unit, H=size, I=lengthFeet, J=lengthInches,
// // K=quantity(pieces), L=calculatedQty, M=rate, N=amount, O=isWood
// // ══════════════════════════════════════════════════════════════════════

// async function appendWithRetry(range, values, retries = 3) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       await sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range,
//         valueInputOption: 'RAW',
//         requestBody: { values },
//       });
//       return;
//     } catch (e) {
//       if (i === retries - 1) throw e;
//       await new Promise(r => setTimeout(r, 1500));
//     }
//   }
// }

// // ── GET ───────────────────────────────────────────────────────────────
// export async function GET() {
//   try {
//     const [ordersRes, itemsRes] = await Promise.all([
//       sheets.spreadsheets.values.get({ spreadsheetId, range: 'Orders_Data!A2:M' }),
//       sheets.spreadsheets.values.get({ spreadsheetId, range: 'Order_Items!A2:O' }),
//     ]);

//     const orderRows = ordersRes.data.values || [];
//     const itemRows  = itemsRes.data.values  || [];

//     // Items map by orderNo
//     const itemsMap = {};
//     itemRows.forEach(row => {
//       const orderNo = row[0] || '';
//       if (!orderNo) return;
//       if (!itemsMap[orderNo]) itemsMap[orderNo] = [];
//       itemsMap[orderNo].push({
//         product:       row[1]  || '',
//         skuCode:       row[2]  || '',
//         materialType:  row[3]  || '',
//         category:      row[4]  || '',
//         subCategory:   row[5]  || '',
//         unit:          row[6]  || '',
//         size:          row[7]  || '',
//         lengthFeet:    row[8]  || '',
//         lengthInches:  row[9]  || '',
//         quantity:      parseFloat(row[10]) || 0,
//         calculatedQty: parseFloat(row[11]) || 0,
//         rate:          parseFloat(row[12]) || 0,
//         amount:        parseFloat(row[13]) || 0,
//         isWood:        row[14] === 'true',
//       });
//     });

//     const orders = orderRows.map(row => ({
//       orderNo:         row[0]  || '',
//       customerName:    row[1]  || '',
//       customerPhone:   row[2]  || '',
//       customerAddress: row[3]  || '',
//       orderDate:       row[4]  || '',
//       poNumber:        row[5]  || '',
//       gstCustomerName: row[6]  || '',
//       gstRate:         parseFloat(row[7])  || 0,
//       subtotal:        parseFloat(row[8])  || 0,
//       tax:             parseFloat(row[9])  || 0,
//       total:           parseFloat(row[10]) || 0,
//       status:          row[11] || 'Active',
//       notes:           row[12] || '',
//       items:           itemsMap[row[0]] || [],
//     }));

//     orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

//     return NextResponse.json({ success: true, data: orders, total: orders.length });
//   } catch (error) {
//     console.error('GET /orders error:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // ── POST ──────────────────────────────────────────────────────────────
// export async function POST(request) {
//   try {
//     const { order, items } = await request.json();

//     if (!order?.customerName) {
//       return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
//     }
//     if (!items?.length) {
//       return NextResponse.json({ success: false, error: 'At least one item required' }, { status: 400 });
//     }

//     // Duplicate check
//     const existing = await sheets.spreadsheets.values.get({
//       spreadsheetId, range: 'Orders_Data!A2:A',
//     });
//     const existingNos = (existing.data.values || []).flat();
//     if (existingNos.includes(order.orderNo)) {
//       return NextResponse.json({ success: false, error: 'Order number already exists' }, { status: 409 });
//     }

//     // Orders_Data — 1 row
//     const orderRow = [
//       order.orderNo,
//       order.customerName,
//       order.customerPhone    || '',
//       order.customerAddress  || '',
//       order.orderDate,
//       order.poNumber         || '',
//       order.gstCustomerName  || '',
//       order.gstRate          || 0,
//       order.subtotal,
//       order.tax,
//       order.total,
//       order.status           || 'Active',
//       order.notes            || '',
//     ];

//     // Order_Items — multiple rows, proper columns
//     const itemRows = items.map(it => [
//       order.orderNo,              // A
//       it.product       || '',     // B
//       it.skuCode       || '',     // C
//       it.materialType  || '',     // D
//       it.category      || '',     // E
//       it.subCategory   || '',     // F
//       it.unit          || '',     // G
//       it.size          || '',     // H
//       it.lengthFeet    || '',     // I
//       it.lengthInches  || '',     // J
//       it.quantity      || 0,      // K
//       it.calculatedQty || 0,      // L
//       it.rate          || 0,      // M
//       it.amount        || 0,      // N
//       String(it.isWood || false), // O
//     ]);

//     await appendWithRetry('Orders_Data!A2', [orderRow]);
//     await appendWithRetry('Order_Items!A2', itemRows);

//     return NextResponse.json({
//       success: true,
//       message: 'Order created successfully',
//       orderNo: order.orderNo,
//     });
//   } catch (error) {
//     console.error('POST /orders error:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // ── PATCH (status-only OR full edit) ──────────────────────────────────
// export async function PATCH(request) {
//   try {
//     const body = await request.json();
//     const { orderNo, status, order, items } = body;

//     if (!orderNo) {
//       return NextResponse.json({ success: false, error: 'orderNo required' }, { status: 400 });
//     }

//     // ── Find order row ──
//     const ordersRes = await sheets.spreadsheets.values.get({
//       spreadsheetId, range: 'Orders_Data!A2:A',
//     });
//     const orderRows = ordersRes.data.values || [];
//     const orderRowIdx = orderRows.findIndex(r => r[0] === orderNo);

//     if (orderRowIdx === -1) {
//       return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
//     }

//     const orderSheetRow = orderRowIdx + 2; // 1-indexed + header

//     // ── STATUS ONLY UPDATE ──
//     if (status && !order) {
//       await sheets.spreadsheets.values.update({
//         spreadsheetId,
//         range: `Orders_Data!L${orderSheetRow}`,
//         valueInputOption: 'RAW',
//         requestBody: { values: [[status]] },
//       });
//       return NextResponse.json({
//         success: true,
//         message: `Order ${orderNo} status → ${status}`,
//       });
//     }

//     // ── FULL EDIT UPDATE ──
//     if (order && items) {
//       // Step 1: Update Orders_Data row
//       const updatedOrderRow = [
//         orderNo,
//         order.customerName,
//         order.customerPhone    || '',
//         order.customerAddress  || '',
//         order.orderDate,
//         order.poNumber         || '',
//         order.gstCustomerName  || '',
//         order.gstRate          || 0,
//         order.subtotal,
//         order.tax,
//         order.total,
//         order.status           || 'Active',
//         order.notes            || '',
//       ];

//       await sheets.spreadsheets.values.update({
//         spreadsheetId,
//         range: `Orders_Data!A${orderSheetRow}:M${orderSheetRow}`,
//         valueInputOption: 'RAW',
//         requestBody: { values: [updatedOrderRow] },
//       });

//       // Step 2: Delete old items from Order_Items
//       const itemsRes = await sheets.spreadsheets.values.get({
//         spreadsheetId, range: 'Order_Items!A2:A',
//       });
//       const allItemRows = itemsRes.data.values || [];

//       // Find all row indices for this orderNo
//       const itemRowIndices = [];
//       allItemRows.forEach((r, idx) => {
//         if (r[0] === orderNo) itemRowIndices.push(idx);
//       });

//       // Clear old item rows
//       if (itemRowIndices.length > 0) {
//         const clearRequests = itemRowIndices.map(idx => ({
//           range: `Order_Items!A${idx + 2}:O${idx + 2}`,
//         }));

//         // Batch clear
//         for (const req of clearRequests) {
//           await sheets.spreadsheets.values.clear({
//             spreadsheetId,
//             range: req.range,
//           });
//         }
//       }

//       // Step 3: Append new items
//       const newItemRows = items.map(it => [
//         orderNo,
//         it.product       || '',
//         it.skuCode       || '',
//         it.materialType  || '',
//         it.category      || '',
//         it.subCategory   || '',
//         it.unit          || '',
//         it.size          || '',
//         it.lengthFeet    || '',
//         it.lengthInches  || '',
//         it.quantity      || 0,
//         it.calculatedQty || 0,
//         it.rate          || 0,
//         it.amount        || 0,
//         String(it.isWood || false),
//       ]);

//       if (newItemRows.length > 0) {
//         await appendWithRetry('Order_Items!A2', newItemRows);
//       }

//       return NextResponse.json({
//         success: true,
//         message: `Order ${orderNo} updated successfully`,
//       });
//     }

//     return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
//   } catch (error) {
//     console.error('PATCH /orders error:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



//////




// app/api/billing-backend/orders/route.js
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

// ══════════════════════════════════════════════════════════════════════
// Sheet 1: Orders_Data (Ek order = Ek row)
// A=orderNo, B=customerName, C=customerPhone, D=customerAddress,
// E=orderDate, F=poNumber, G=gstCustomerName, H=gstRate,
// I=subtotal, J=tax, K=total, L=status, M=notes
//
// Sheet 2: Order_Items (Ek item = Ek row)
// A=orderNo,    B=product,      C=skuCode,     D=materialType,
// E=category,   F=subCategory,  G=unit,        H=size,
// I=lengthFeet, J=lengthInches, K=quantity,    L=calculatedQty,
// M=rate,       N=amount,       O=isWood,
// P=width,      Q=thickness     ← ✅ NEW — yahi fix hai
// ══════════════════════════════════════════════════════════════════════

async function appendWithRetry(range, values, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId, range, valueInputOption: 'RAW',
        requestBody: { values },
      });
      return;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

// ── GET ───────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [ordersRes, itemsRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Orders_Data!A2:M' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Order_Items!A2:Q' }), // ✅ A2:Q (upto column Q)
    ]);

    const orderRows = ordersRes.data.values || [];
    const itemRows  = itemsRes.data.values  || [];

    const itemsMap = {};
    itemRows.forEach(row => {
      const orderNo = row[0] || '';
      if (!orderNo) return;
      if (!itemsMap[orderNo]) itemsMap[orderNo] = [];
      itemsMap[orderNo].push({
        product:       row[1]  || '',
        skuCode:       row[2]  || '',
        materialType:  row[3]  || '',
        category:      row[4]  || '',
        subCategory:   row[5]  || '',
        unit:          row[6]  || '',
        size:          row[7]  || '',
        lengthFeet:    row[8]  || '',
        lengthInches:  row[9]  || '',
        quantity:      parseFloat(row[10]) || 0,
        calculatedQty: parseFloat(row[11]) || 0,
        rate:          parseFloat(row[12]) || 0,
        amount:        parseFloat(row[13]) || 0,
        isWood:        row[14] === 'true',
        width:         parseFloat(row[15]) || 0,  // ✅ P column
        thickness:     parseFloat(row[16]) || 0,  // ✅ Q column
      });
    });

    const orders = orderRows.map(row => ({
      orderNo:         row[0]  || '',
      customerName:    row[1]  || '',
      customerPhone:   row[2]  || '',
      customerAddress: row[3]  || '',
      orderDate:       row[4]  || '',
      poNumber:        row[5]  || '',
      gstCustomerName: row[6]  || '',
      gstRate:         parseFloat(row[7])  || 0,
      subtotal:        parseFloat(row[8])  || 0,
      tax:             parseFloat(row[9])  || 0,
      total:           parseFloat(row[10]) || 0,
      status:          row[11] || 'Active',
      notes:           row[12] || '',
      items:           itemsMap[row[0]] || [],
    }));

    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    return NextResponse.json({ success: true, data: orders, total: orders.length });
  } catch (error) {
    console.error('GET /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { order, items } = await request.json();

    if (!order?.customerName)
      return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
    if (!items?.length)
      return NextResponse.json({ success: false, error: 'At least one item required' }, { status: 400 });

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Orders_Data!A2:A',
    });
    const existingNos = (existing.data.values || []).flat();
    if (existingNos.includes(order.orderNo))
      return NextResponse.json({ success: false, error: 'Order already exists' }, { status: 409 });

    const orderRow = [
      order.orderNo, order.customerName,
      order.customerPhone   || '',
      order.customerAddress || '',
      order.orderDate,
      order.poNumber        || '',
      order.gstCustomerName || '',
      order.gstRate         || 0,
      order.subtotal, order.tax, order.total,
      order.status          || 'Active',
      order.notes           || '',
    ];

    // ✅ width + thickness save ho rahe hain ab
    const itemRows = items.map(it => [
      order.orderNo,
      it.product       || '',   // B
      it.skuCode       || '',   // C
      it.materialType  || '',   // D
      it.category      || '',   // E
      it.subCategory   || '',   // F
      it.unit          || '',   // G
      it.size          || '',   // H
      it.lengthFeet    || '',   // I
      it.lengthInches  || '',   // J
      it.quantity      || 0,    // K
      it.calculatedQty || 0,    // L
      it.rate          || 0,    // M
      it.amount        || 0,    // N
      String(it.isWood || false), // O
      it.width         || 0,    // P ✅
      it.thickness     || 0,    // Q ✅
    ]);

    await appendWithRetry('Orders_Data!A2', [orderRow]);
    await appendWithRetry('Order_Items!A2', itemRows);

    return NextResponse.json({ success: true, message: 'Order created', orderNo: order.orderNo });
  } catch (error) {
    console.error('POST /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PATCH ─────────────────────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderNo, status, order, items } = body;

    if (!orderNo)
      return NextResponse.json({ success: false, error: 'orderNo required' }, { status: 400 });

    const ordersRes = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Orders_Data!A2:A',
    });
    const orderRows   = ordersRes.data.values || [];
    const orderRowIdx = orderRows.findIndex(r => r[0] === orderNo);

    if (orderRowIdx === -1)
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    const orderSheetRow = orderRowIdx + 2;

    // ── STATUS ONLY ──
    if (status && !order) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Orders_Data!L${orderSheetRow}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[status]] },
      });
      return NextResponse.json({ success: true, message: `Status → ${status}` });
    }

    // ── FULL EDIT ──
    if (order && items) {
      const updatedOrderRow = [
        orderNo, order.customerName,
        order.customerPhone   || '',
        order.customerAddress || '',
        order.orderDate,
        order.poNumber        || '',
        order.gstCustomerName || '',
        order.gstRate         || 0,
        order.subtotal, order.tax, order.total,
        order.status          || 'Active',
        order.notes           || '',
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Orders_Data!A${orderSheetRow}:M${orderSheetRow}`,
        valueInputOption: 'RAW',
        requestBody: { values: [updatedOrderRow] },
      });

      // Find + clear old items
      const itemsRes = await sheets.spreadsheets.values.get({
        spreadsheetId, range: 'Order_Items!A2:A',
      });
      const allItemRows    = itemsRes.data.values || [];
      const itemRowIndices = [];
      allItemRows.forEach((r, idx) => { if (r[0] === orderNo) itemRowIndices.push(idx); });

      for (const idx of itemRowIndices) {
        await sheets.spreadsheets.values.clear({
          spreadsheetId,
          range: `Order_Items!A${idx + 2}:Q${idx + 2}`, // ✅ clear upto Q
        });
      }

      // Append new items with width + thickness
      const newItemRows = items.map(it => [
        orderNo,
        it.product       || '',
        it.skuCode       || '',
        it.materialType  || '',
        it.category      || '',
        it.subCategory   || '',
        it.unit          || '',
        it.size          || '',
        it.lengthFeet    || '',
        it.lengthInches  || '',
        it.quantity      || 0,
        it.calculatedQty || 0,
        it.rate          || 0,
        it.amount        || 0,
        String(it.isWood || false),
        it.width         || 0,  // P ✅
        it.thickness     || 0,  // Q ✅
      ]);

      if (newItemRows.length > 0)
        await appendWithRetry('Order_Items!A2', newItemRows);

      return NextResponse.json({ success: true, message: `Order ${orderNo} updated` });
    }

    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
  } catch (error) {
    console.error('PATCH /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}