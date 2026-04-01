import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

// ─── GET: Saari bills fetch karo ─────────────────────────────────────────────
export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'bills!A2:M',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, data: [], count: 0 });
    }

    const data = rows
      .filter((row) => row[0] && row[0].trim() !== '')
      .map((row) => ({
        id:         row[0]?.trim()  || '',
        customer:   row[1]?.trim()  || '',
        phone:      row[2]?.trim()  || '',
        address:    row[3]?.trim()  || '',
        date:       row[4]?.trim()  || '',
        subtotal:   parseFloat(row[5]  || 0),
        tax:        parseFloat(row[6]  || 0),
        total:      parseFloat(row[7]  || 0),
        includeGST: row[8]?.trim() === 'true',
        status:     row[9]?.trim()  || 'Pending',
        itemCount:  parseInt(row[10]   || 0),
        notes:      row[11]?.trim() || '',
        createdAt:  row[12]?.trim() || '',
      }));

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('GET /api/bills error:', error);
    return NextResponse.json(
      { success: false, message: 'Bills fetch fail', error: error.message },
      { status: 500 }
    );
  }
}

// ─── POST: Naya bill → bills sheet + bill_items sheet + inventory update ──────
export async function POST(request) {
  try {
    const { bill, items } = await request.json();

    if (!bill || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Bill aur items dono required hain' },
        { status: 400 }
      );
    }

    // ── 1) BILLS sheet mein append ────────────────────────────────────────────
    // Columns: A=billNo B=customer C=phone D=address E=date F=subtotal
    //          G=tax H=total I=includeGST J=status K=itemCount L=notes M=createdAt
    const billRow = [
      bill.id,
      bill.customer,
      bill.phone    || '',
      bill.address  || '',
      bill.date,
      bill.subtotal,
      bill.tax,
      bill.total,
      String(bill.includeGST),
      bill.status   || 'Pending',
      bill.itemCount,
      bill.notes    || '',
      bill.createdAt || new Date().toISOString(),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'bills!A:M',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [billRow] },
    });

    // ── 2) BILL_ITEMS sheet mein append ──────────────────────────────────────
    // Columns: A=billNo B=skuCode C=itemName D=unit E=quantity
    //          F=rate G=amount H=materialType I=date
    const itemRows = items.map((item) => [
      bill.id,
      item.skuCode       || '',
      item.itemName      || item.product || '',
      item.unit          || '',
      item.quantity,
      item.rate,
      item.amount,
      item.materialType  || '',
      bill.date,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'bill_items!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: itemRows },
    });

    // ── 3) INVENTORY sheet update ────────────────────────────────────────────
    // inventory columns: A=materialType B=materialName C=unit
    //                    D=totalReceivedQty E=totalSoldQty F=currentStock
    // Match karte hain materialName (col B) se
    const invResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'inventory!A2:F',
    });
    const invRows = invResponse.data.values || [];

    for (const item of items) {
      const itemName = (item.itemName || item.product || '').trim().toLowerCase();
      if (!itemName) continue;

      const rowIndex = invRows.findIndex(
        (row) => (row[1] || '').trim().toLowerCase() === itemName
      );

      if (rowIndex === -1) {
        console.log(`⚠ Inventory mein nahi mila: "${item.itemName || item.product}"`);
        continue;
      }

      const sheetRow     = rowIndex + 2; // header + 0-index
      const currentSold  = parseFloat(invRows[rowIndex][4] || 0);
      const currentStock = parseFloat(invRows[rowIndex][5] || 0);
      const qtySold      = parseFloat(item.quantity || 0);

      const newSold  = currentSold + qtySold;
      const newStock = Math.max(0, currentStock - qtySold);

      // E column = totalSoldQty
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `inventory!E${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[newSold]] },
      });

      // F column = currentStock
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `inventory!F${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[newStock]] },
      });

      console.log(`✅ Inventory: "${itemName}" → sold ${currentSold}→${newSold}, stock ${currentStock}→${newStock}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Bill saved, items logged, inventory updated!',
      billId: bill.id,
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/bills error:', error);
    return NextResponse.json(
      { success: false, message: 'Bill save fail', error: error.message },
      { status: 500 }
    );
  }
}

// ─── PATCH: Bill status update ───────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const { billId, status } = await request.json();

    if (!billId || !status) {
      return NextResponse.json(
        { success: false, message: 'billId aur status dono chahiye' },
        { status: 400 }
      );
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'bills!A2:M',
    });

    const rows     = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0]?.trim() === billId);

    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Bill nahi mili' },
        { status: 404 }
      );
    }

    // J column = status (10th column)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `bills!J${rowIndex + 2}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[status]] },
    });

    return NextResponse.json({
      success: true,
      message: `Bill ${billId} status → "${status}"`,
    });

  } catch (error) {
    console.error('PATCH /api/bills error:', error);
    return NextResponse.json(
      { success: false, message: 'Status update fail', error: error.message },
      { status: 500 }
    );
  }
}