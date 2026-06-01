


// import { NextResponse } from 'next/server';
// import { sheets, spreadsheetId } from '../../config/googleSheet.js';

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const customerName = searchParams.get('customerName');

//     if (!customerName) {
//       return NextResponse.json(
//         { success: false, error: 'customerName required' },
//         { status: 400 }
//       );
//     }

//     const normalizedCustomer = customerName.toLowerCase().trim();

//     // 1. Fetch Challans
//     const challansRes = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: 'Challans_Data!A2:P',
//     });
//     const challanRows = challansRes.data.values || [];

//     const customerChallans = challanRows
//       .filter(row => row[1]?.toString().trim().toLowerCase() === normalizedCustomer)
//       .map(row => ({
//         challanNo: row[0]?.toString().trim() || '',
//         date: row[7] || '',
//         amount: parseFloat(row[9]) || 0,
//       }));

//     const challanNos = new Set(customerChallans.map(c => c.challanNo));

//     // 2. Fetch Returns (Return_Data!A2:I)
//     const returnsRes = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: 'Return_Data!A2:I',
//     });
//     const returnRows = returnsRes.data.values || [];

//     const returnMap = {};
//     const returnsList = [];

//     returnRows.forEach(row => {
//       if (!row || !row[0]) return;

//       const rowChallanNo = row[1]?.toString().trim() || '';
//       const rowCustomerName = row[3]?.toString().trim().toLowerCase() || '';
//       const returnTotal = parseFloat(row[5]) || 0;
//       const returnDate = row[4] || '';

//       const matchByChallan = challanNos.has(rowChallanNo);
//       const matchByCustomer = rowCustomerName === normalizedCustomer;

//       if (matchByChallan || matchByCustomer) {
//         if (rowChallanNo) {
//           returnMap[rowChallanNo] = (returnMap[rowChallanNo] || 0) + returnTotal;
//         }
//         returnsList.push({
//           returnNo: row[0]?.toString().trim() || '',
//           challanNo: rowChallanNo,
//           returnDate,
//           returnTotal,
//           reason: row[6] || '',
//           notes: row[7] || '',
//           status: row[8] || 'Returned',
//         });
//       }
//     });

//     // 3. Fetch Return Items
//     let returnItemsRes;
//     try {
//       returnItemsRes = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range: 'Return_Items!A2:K',
//       });
//     } catch (e) {
//       returnItemsRes = { data: { values: [] } };
//     }
//     const returnItemRows = returnItemsRes.data.values || [];

//     const returnItemsMap = {};
//     returnItemRows.forEach(row => {
//       if (!row || !row[0]) return;
//       const rNo = row[0].toString().trim();
//       if (!returnItemsMap[rNo]) returnItemsMap[rNo] = [];
//       returnItemsMap[rNo].push({
//         product: row[2] || '',
//         unit: row[3] || '',
//         returnQty: parseFloat(row[4]) || 0,
//         returnPcs: parseFloat(row[5]) || 0,
//         rate: parseFloat(row[6]) || 0,
//         returnAmount: parseFloat(row[7]) || 0,
//         reason: row[8] || '',
//         size: row[9] || '',
//         lengthDisplay: row[10] || '',
//       });
//     });

//     returnsList.forEach(r => {
//       r.items = returnItemsMap[r.returnNo] || [];
//     });

//     returnsList.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));

//     // 4. Fetch Payments
//     let paymentMap = {};
//     let paymentTransactions = [];

//     try {
//       const paymentsRes = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range: 'Payments!A2:G',
//       });
//       const paymentRows = paymentsRes.data.values || [];

//       paymentRows.forEach(row => {
//         const rowCustomer = row[2]?.toString().trim().toLowerCase() || '';
//         if (rowCustomer !== normalizedCustomer) return;

//         const challanNo = row[1]?.toString().trim() || 'bulk';
//         const amount = parseFloat(row[3]) || 0;

//         paymentMap[challanNo] = (paymentMap[challanNo] || 0) + amount;

//         paymentTransactions.push({
//           paymentId: row[0] || '',
//           challanNo: row[1]?.toString().trim() || '',
//           amount,
//           paymentDate: row[4] || '',
//           mode: row[5] || '',
//           notes: row[6] || '',
//         });
//       });
//     } catch (err) {
//       console.warn('Payments sheet error:', err.message);
//     }

//     // 5. Build Ledger
//     const ledger = customerChallans
//       .map(ch => {
//         const returns = returnMap[ch.challanNo] || 0;
//         const paymentsReceived = paymentMap[ch.challanNo] || 0;
//         const due = ch.amount - returns - paymentsReceived;
//         return {
//           challanNo: ch.challanNo,
//           date: ch.date,
//           amount: ch.amount,
//           returns,
//           payments: paymentsReceived,
//           due,
//         };
//       })
//       .sort((a, b) => new Date(a.date) - new Date(b.date));

//     // 6. Totals
//     const totalBulkPayments = paymentMap['bulk'] || 0;

//     const totals = {
//       totalBilled: ledger.reduce((s, r) => s + r.amount, 0),
//       totalReturns: ledger.reduce((s, r) => s + r.returns, 0),
//       totalPayments: ledger.reduce((s, r) => s + r.payments, 0) + totalBulkPayments,
//       totalDue: ledger.reduce((s, r) => s + r.due, 0) - totalBulkPayments,
//     };

//     paymentTransactions.sort(
//       (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
//     );

//     return NextResponse.json({
//       success: true,
//       data: {
//         ledger,
//         totals,
//         payments: paymentTransactions,
//         returns: returnsList,
//       },
//     });
//   } catch (error) {
//     console.error('Ledger API error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }




///////////




import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerName = searchParams.get('customerName');

    if (!customerName) {
      return NextResponse.json(
        { success: false, error: 'customerName required' },
        { status: 400 }
      );
    }

    const normalizedCustomer = customerName.toLowerCase().trim();

    // 1. Fetch Challans
    const challansRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Challans_Data!A2:P',
    });
    const challanRows = challansRes.data.values || [];

    const customerChallans = challanRows
      .filter(row => row[1]?.toString().trim().toLowerCase() === normalizedCustomer)
      .map(row => ({
        challanNo: row[0]?.toString().trim() || '',
        date: row[7] || '',
        amount: parseFloat(row[9]) || 0,
      }));

    const challanNos = new Set(customerChallans.map(c => c.challanNo));

    // 2. Fetch Returns
    const returnsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Return_Data!A2:I',
    });
    const returnRows = returnsRes.data.values || [];

    const returnMap = {};
    const returnsList = [];

    returnRows.forEach(row => {
      if (!row || !row[0]) return;

      const rowChallanNo = row[1]?.toString().trim() || '';
      const rowCustomerName = row[3]?.toString().trim().toLowerCase() || '';
      const returnTotal = parseFloat(row[5]) || 0;
      const returnDate = row[4] || '';

      const matchByChallan = challanNos.has(rowChallanNo);
      const matchByCustomer = rowCustomerName === normalizedCustomer;

      if (matchByChallan || matchByCustomer) {
        if (rowChallanNo) {
          returnMap[rowChallanNo] = (returnMap[rowChallanNo] || 0) + returnTotal;
        }
        returnsList.push({
          returnNo: row[0]?.toString().trim() || '',
          challanNo: rowChallanNo,
          returnDate,
          returnTotal,
          reason: row[6] || '',
          notes: row[7] || '',
          status: row[8] || 'Returned',
        });
      }
    });

    // 3. Fetch Return Items
    let returnItemsRes;
    try {
      returnItemsRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Return_Items!A2:K',
      });
    } catch (e) {
      returnItemsRes = { data: { values: [] } };
    }
    const returnItemRows = returnItemsRes.data.values || [];

    const returnItemsMap = {};
    returnItemRows.forEach(row => {
      if (!row || !row[0]) return;
      const rNo = row[0].toString().trim();
      if (!returnItemsMap[rNo]) returnItemsMap[rNo] = [];
      returnItemsMap[rNo].push({
        product: row[2] || '',
        unit: row[3] || '',
        returnQty: parseFloat(row[4]) || 0,
        returnPcs: parseFloat(row[5]) || 0,
        rate: parseFloat(row[6]) || 0,
        returnAmount: parseFloat(row[7]) || 0,
        reason: row[8] || '',
        size: row[9] || '',
        lengthDisplay: row[10] || '',
      });
    });

    returnsList.forEach(r => {
      r.items = returnItemsMap[r.returnNo] || [];
    });

    returnsList.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));

    // 4. Fetch Payments
    let paymentMap = {};
    let paymentTransactions = [];

    try {
      const paymentsRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Payments!A2:G',
      });
      const paymentRows = paymentsRes.data.values || [];

      paymentRows.forEach(row => {
        const rowCustomer = row[2]?.toString().trim().toLowerCase() || '';
        if (rowCustomer !== normalizedCustomer) return;

        const challanNo = row[1]?.toString().trim() || 'bulk';
        const amount = parseFloat(row[3]) || 0;

        paymentMap[challanNo] = (paymentMap[challanNo] || 0) + amount;

        paymentTransactions.push({
          paymentId: row[0] || '',
          challanNo: row[1]?.toString().trim() || '',
          amount,
          paymentDate: row[4] || '',
          mode: row[5] || '',
          notes: row[6] || '',
        });
      });
    } catch (err) {
      console.warn('Payments sheet error:', err.message);
    }

    // 5. Fetch OLD Amount Ledger
    let oldAmount = 0;
    try {
      const oldLedgerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'OLD_Amount_Ledger!A2:B',
      });
      const oldLedgerRows = oldLedgerRes.data.values || [];

      oldLedgerRows.forEach(row => {
        if (!row || !row[0]) return;
        const rowName = row[0].toString().trim().toLowerCase();
        if (rowName === normalizedCustomer) {
          oldAmount += parseFloat(row[1]) || 0;
        }
      });
    } catch (err) {
      console.warn('OLD_Amount_Ledger sheet error:', err.message);
    }

    // 6. Build Ledger
    const ledger = customerChallans
      .map(ch => {
        const returns = returnMap[ch.challanNo] || 0;
        const paymentsReceived = paymentMap[ch.challanNo] || 0;
        const due = ch.amount - returns - paymentsReceived;
        return {
          challanNo: ch.challanNo,
          date: ch.date,
          amount: ch.amount,
          returns,
          payments: paymentsReceived,
          due,
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 7. Totals
    const totalBulkPayments = paymentMap['bulk'] || 0;

    // Total payments including bulk
    const totalPaymentsAll =
      ledger.reduce((s, r) => s + r.payments, 0) + totalBulkPayments;

    // Outstanding = oldAmount + newBilled - returns - payments
    const totalBilled = ledger.reduce((s, r) => s + r.amount, 0);
    const totalReturns = ledger.reduce((s, r) => s + r.returns, 0);

    // We need to figure out how much of payments go toward old amount
    // Simple approach: all payments reduce total outstanding (old + new)
    // outstanding = oldAmount + totalBilled - totalReturns - totalPaymentsAll
    const totalDue = oldAmount + totalBilled - totalReturns - totalPaymentsAll;

    const totals = {
      totalBilled,
      totalReturns,
      totalPayments: totalPaymentsAll,
      totalDue,
      oldAmount,
    };

    paymentTransactions.sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
    );

    return NextResponse.json({
      success: true,
      data: {
        ledger,
        totals,
        payments: paymentTransactions,
        returns: returnsList,
        oldAmount,
      },
    });
  } catch (error) {
    console.error('Ledger API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}