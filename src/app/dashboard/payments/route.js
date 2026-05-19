import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

async function appendWithRetry(range, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId, range, valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

export async function POST(request) {
  try {
    const { payment } = await request.json();
    if (!payment?.challanNo || !payment?.amount) {
      return NextResponse.json({ success: false, error: 'challanNo and amount required' });
    }
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    const row = [
      paymentId,
      payment.challanNo,
      payment.customerName || '',
      payment.amount,
      payment.paymentDate || new Date().toISOString().split('T')[0],
      payment.mode || 'Cash',
      payment.notes || '',
    ];
    await appendWithRetry('Payments!A2', [row]);
    return NextResponse.json({ success: true, paymentId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerName = searchParams.get('customerName');
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Payments!A2:G' });
    let rows = res.data.values || [];
    let payments = rows.map(row => ({
      paymentId: row[0],
      challanNo: row[1],
      customerName: row[2],
      amount: parseFloat(row[3]) || 0,
      paymentDate: row[4],
      mode: row[5],
      notes: row[6],
    }));
    if (customerName) {
      payments = payments.filter(p => p.customerName.toLowerCase() === customerName.toLowerCase());
    }
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// DELETE function can be added later if needed