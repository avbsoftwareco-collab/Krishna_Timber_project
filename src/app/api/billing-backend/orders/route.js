// app/api/billing-backend/orders/route.js
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

// ── Sheet names ──────────────────────────────────────────────────────────────
// Sheet: Orders_Data   → Columns: A=orderNo, B=customerName, C=customerPhone,
//   D=customerAddress, E=orderDate, F=items(JSON), G=subtotal, H=tax,
//   I=total, J=status, K=includeGST, L=notes
//
// Sheet: Order_Items   → Columns: A=orderNo, B=product, C=unit,
//   D=quantity, E=rate, F=amount, G=materialType

// ── GET: Fetch all orders with their items ────────────────────────────────────
export async function GET() {
  try {
    const [ordersRes, itemsRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Orders_Data!A2:L' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Order_Items!A2:G' }),
    ]);

    const orderRows = ordersRes.data.values || [];
    const itemRows  = itemsRes.data.values  || [];

    // Build items map keyed by orderNo
    const itemsMap = {};
    itemRows.forEach(row => {
      const orderNo = row[0];
      if (!itemsMap[orderNo]) itemsMap[orderNo] = [];
      itemsMap[orderNo].push({
        product:      row[1] || '',
        unit:         row[2] || '',
        quantity:     parseFloat(row[3]) || 0,
        rate:         parseFloat(row[4]) || 0,
        amount:       parseFloat(row[5]) || 0,
        materialType: row[6] || '',
      });
    });

    const orders = orderRows.map(row => ({
      orderNo:         row[0]  || '',
      customerName:    row[1]  || '',
      customerPhone:   row[2]  || '',
      customerAddress: row[3]  || '',
      orderDate:       row[4]  || '',
      subtotal:        parseFloat(row[6]) || 0,
      tax:             parseFloat(row[7]) || 0,
      total:           parseFloat(row[8]) || 0,
      status:          row[9]  || 'Active',
      includeGST:      row[10] === 'true',
      notes:           row[11] || '',
      items:           itemsMap[row[0]] || [],
    }));

    // Sort newest first
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    return NextResponse.json({ success: true, data: orders, total: orders.length });
  } catch (error) {
    console.error('GET /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Create new order ────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { order, items } = await request.json();

    if (!order?.customerName) {
      return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
    }
    if (!items?.length) {
      return NextResponse.json({ success: false, error: 'At least one item required' }, { status: 400 });
    }

    // Check duplicate order number
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Orders_Data!A2:A',
    });
    const existingNos = existing.data.values?.flat() || [];
    if (existingNos.includes(order.orderNo)) {
      return NextResponse.json({ success: false, error: 'Order number already exists' }, { status: 409 });
    }

    // Save order row
    const orderRow = [
      order.orderNo,
      order.customerName,
      order.customerPhone  || '',
      order.customerAddress || '',
      order.orderDate,
      '',                            // items JSON (not used — separate sheet)
      order.subtotal.toFixed(2),
      order.tax.toFixed(2),
      order.total.toFixed(2),
      order.status || 'Active',
      String(order.includeGST || false),
      order.notes || '',
    ];

    // Save item rows
    const itemRows = items.map(it => [
      order.orderNo,
      it.product || '',
      it.unit    || '',
      it.quantity,
      it.rate,
      it.amount  || (it.quantity * it.rate),
      it.materialType || '',
    ]);

    // Retry helper
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

    await appendWithRetry('Orders_Data!A2', [orderRow]);
    if (itemRows.length > 0) {
      await appendWithRetry('Order_Items!A2', itemRows);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderNo: order.orderNo,
    });
  } catch (error) {
    console.error('POST /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PATCH: Update order status ────────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const { orderNo, status } = await request.json();
    if (!orderNo || !status) {
      return NextResponse.json({ success: false, error: 'orderNo and status required' }, { status: 400 });
    }

    // Find the row number of this order
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Orders_Data!A2:A',
    });
    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(r => r[0] === orderNo);

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Row index in sheet = rowIndex + 2 (1-indexed + header)
    const sheetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Orders_Data!J${sheetRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[status]] },
    });

    return NextResponse.json({ success: true, message: `Order ${orderNo} status updated to ${status}` });
  } catch (error) {
    console.error('PATCH /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}