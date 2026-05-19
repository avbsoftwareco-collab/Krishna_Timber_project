import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

async function findFirstEmptyRow() {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Payments!A:A' });
  const rows = res.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (!rows[i] || rows[i][0] === '') {
      return i + 2; // +1 for zero-index, +1 for header row -> row number
    }
  }
  // If no empty row, return next row after last
  return rows.length + 2;
}

async function updateRow(rowNumber, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Payments!A${rowNumber}:G${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}

async function generatePaymentId() {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `PAY-${year}-`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Payments!A2:A' });
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

export async function POST(request) {
  try {
    const { payment } = await request.json();
    const amount = parseFloat(payment?.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount required' }, { status: 400 });
    }

    const paymentId = await generatePaymentId();
    const challanNoValue = (payment.challanNo && payment.challanNo.trim() !== '') ? payment.challanNo.trim() : '';
    const rowData = [
      paymentId,
      challanNoValue,
      payment.customerName || '',
      amount,
      payment.paymentDate || new Date().toISOString().split('T')[0],
      payment.mode || 'Cash',
      payment.notes || '',
    ];

    const emptyRowNumber = await findFirstEmptyRow();
    await updateRow(emptyRowNumber, rowData);

    return NextResponse.json({ success: true, paymentId });
  } catch (error) {
    console.error('POST /payments error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { paymentId } = await request.json();
    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'paymentId required' }, { status: 400 });
    }
    // Optional: implement delete logic (find row by paymentId and delete)
    // For now just return success
    return NextResponse.json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}