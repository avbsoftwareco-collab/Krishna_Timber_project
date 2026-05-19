import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerName = searchParams.get('customerName');

    // 1. Fetch all challans (A to P)
    const challansRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Challans_Data!A2:P' });
    const challanRows = challansRes.data.values || [];
    const challans = challanRows.map(row => ({
      challanNo: row[0],
      customerName: row[1],
      challanTotal: parseFloat(row[9]) || 0,      // column J = challanTotal
      challanDate: row[7],                        // column H = challanDate
    })).filter(c => c.customerName);

    // 2. Fetch all returns
    const returnsRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Return_Data!A2:I' });
    const returnRows = returnsRes.data.values || [];
    const returns = returnRows.map(row => ({
      returnNo: row[0],
      challanNo: row[1],
      customerName: row[3],
      returnTotal: parseFloat(row[5]) || 0,
    })).filter(r => r.customerName);

    // 3. Fetch all payments
    let payments = [];
    try {
      const paymentsRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Payments!A2:G' });
      const paymentRows = paymentsRes.data.values || [];
      payments = paymentRows.map(row => ({
        paymentId: row[0],
        challanNo: row[1],
        customerName: row[2],
        amount: parseFloat(row[3]) || 0,
      })).filter(p => p.customerName);
    } catch (err) {
      // Payments sheet might not exist yet – ignore
      console.warn('Payments sheet not found, continuing without payments');
    }

    // Group by customer
    const customersMap = new Map();

    challans.forEach(ch => {
      const cust = ch.customerName;
      if (!customersMap.has(cust)) {
        customersMap.set(cust, { totalBilled: 0, totalReturns: 0, totalPayments: 0, challans: [] });
      }
      const entry = customersMap.get(cust);
      entry.totalBilled += ch.challanTotal;
      entry.challans.push({ challanNo: ch.challanNo, amount: ch.challanTotal, date: ch.challanDate });
    });

    returns.forEach(ret => {
      const cust = ret.customerName;
      if (customersMap.has(cust)) {
        customersMap.get(cust).totalReturns += ret.returnTotal;
      } else {
        customersMap.set(cust, { totalBilled: 0, totalReturns: ret.returnTotal, totalPayments: 0, challans: [] });
      }
    });

    payments.forEach(pay => {
      const cust = pay.customerName;
      if (customersMap.has(cust)) {
        customersMap.get(cust).totalPayments += pay.amount;
      } else {
        customersMap.set(cust, { totalBilled: 0, totalReturns: 0, totalPayments: pay.amount, challans: [] });
      }
    });

    // Prepare response
    const customers = Array.from(customersMap.entries()).map(([name, data]) => ({
      customerName: name,
      totalBilled: data.totalBilled,
      totalReturns: data.totalReturns,
      netBilled: data.totalBilled - data.totalReturns,
      totalPayments: data.totalPayments,
      outstanding: (data.totalBilled - data.totalReturns) - data.totalPayments,
      challans: data.challans.sort((a,b) => new Date(a.date) - new Date(b.date)),
    }));

    const result = customerName ? customers.filter(c => c.customerName.toLowerCase() === customerName.toLowerCase()) : customers;

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('GET /customer-summary error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}