


import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet.js';

// ── Payment ID Generator ──────────────────────────────────────────────
async function generatePaymentId() {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `PAY-${year}-`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Payments!A2:A',
  });

  const rows = res.data.values || [];
  let maxNum = 0;

  for (const row of rows) {
    const id = row[0] || '';
    if (id.startsWith(prefix)) {
      const numPart = id.replace(prefix, '');
      const num = parseInt(numPart, 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }

  const nextNum = (maxNum + 1).toString().padStart(4, '0');
  return `${prefix}${nextNum}`;
}

// ── GET - Sari Payments Fetch Karo ───────────────────────────────────
export async function GET() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Payments!A2:G',
    });

    const rows = res.data.values || [];

    const payments = rows
      .filter(row => row && row[0]) // empty rows skip
      .map(row => ({
        paymentId:    row[0] || '',
        challanNo:    row[1] || '',
        customerName: row[2] || '',
        amount:       parseFloat(row[3]) || 0,
        paymentDate:  row[4] || '',
        mode:         row[5] || 'Cash',
        notes:        row[6] || '',
      }));

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('GET /payments error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ── POST - Naya Payment Add Karo ─────────────────────────────────────
export async function POST(request) {
  try {
    const { payment } = await request.json();
    const amount = parseFloat(payment?.amount);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment data required' },
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount required' },
        { status: 400 }
      );
    }

    const paymentId = await generatePaymentId();
    const challanNo = payment.challanNo?.trim() || '';

    const rowData = [
      paymentId,
      challanNo,
      payment.customerName || '',
      amount,
      payment.paymentDate || new Date().toISOString().split('T')[0],
      payment.mode        || 'Cash',
      payment.notes       || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Payments!A:G',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [rowData] },
    });

    return NextResponse.json({ success: true, paymentId });
  } catch (error) {
    console.error('POST /payments error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ── DELETE - Payment Delete Karo ──────────────────────────────────────
export async function DELETE(request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'paymentId required' },
        { status: 400 }
      );
    }

    // Step 1: Sari rows fetch karo
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Payments!A2:A',
    });

    const rows = res.data.values || [];

    // Step 2: Row index dhundo
    const rowIndex = rows.findIndex(
      row => row[0]?.trim() === paymentId.trim()
    );

    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Step 3: Sheet ID lo
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetMeta.data.sheets?.find(
      s => s.properties.title === 'Payments'
    );

    if (!sheet) {
      return NextResponse.json(
        { success: false, error: 'Payments sheet not found' },
        { status: 404 }
      );
    }

    const sheetId = sheet.properties.sheetId;
    const actualRow = rowIndex + 1; // 0-indexed + header row offset

    // Step 4: Row delete karo
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: actualRow,    // 0-indexed
                endIndex:   actualRow + 1,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /payments error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}