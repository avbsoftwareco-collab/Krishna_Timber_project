

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

//     // ════════════════════════════════════════
//     // 1. Fetch Challans
//     // ════════════════════════════════════════
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

//     // ════════════════════════════════════════
//     // 2. Fetch Returns
//     // ════════════════════════════════════════
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

//     // ════════════════════════════════════════
//     // 3. Fetch Return Items
//     // ════════════════════════════════════════
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

//     // ════════════════════════════════════════
//     // 4. Fetch Payments
//     // ════════════════════════════════════════
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

//     // ════════════════════════════════════════
//     // 5. Fetch OLD Amount Ledger (✅ with date)
//     // ════════════════════════════════════════
//     let oldAmount = 0;
//     let oldAmountDate = ''; // ✅ NEW - C column ki date
//     try {
//       const oldLedgerRes = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range: 'OLD_Amount_Ledger!A2:C',
//       });
//       const oldLedgerRows = oldLedgerRes.data.values || [];

//       oldLedgerRows.forEach(row => {
//         if (!row || !row[0]) return;
//         const rowName = row[0].toString().trim().toLowerCase();
//         if (rowName === normalizedCustomer) {
//           oldAmount += parseFloat(row[1]) || 0;

//           // ✅ Pickup latest date from C column
//           if (row[2]) {
//             const currentDate = row[2].toString().trim();
//             if (!oldAmountDate) {
//               oldAmountDate = currentDate;
//             } else {
//               try {
//                 if (new Date(currentDate) > new Date(oldAmountDate)) {
//                   oldAmountDate = currentDate;
//                 }
//               } catch (e) {
//                 // If date parsing fails, keep current
//               }
//             }
//           }
//         }
//       });
//     } catch (err) {
//       console.warn('OLD_Amount_Ledger sheet error:', err.message);
//     }

//     // ════════════════════════════════════════
//     // 6. Build Ledger
//     // ════════════════════════════════════════
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

//     // ════════════════════════════════════════
//     // 7. Totals
//     // ════════════════════════════════════════
//     const totalBulkPayments = paymentMap['bulk'] || 0;

//     const totalPaymentsAll =
//       ledger.reduce((s, r) => s + r.payments, 0) + totalBulkPayments;

//     const totalBilled = ledger.reduce((s, r) => s + r.amount, 0);
//     const totalReturns = ledger.reduce((s, r) => s + r.returns, 0);

//     const totalDue = oldAmount + totalBilled - totalReturns - totalPaymentsAll;

//     const totals = {
//       totalBilled,
//       totalReturns,
//       totalPayments: totalPaymentsAll,
//       totalDue,
//       oldAmount,
//     };

//     paymentTransactions.sort(
//       (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
//     );

//     // ════════════════════════════════════════
//     // 8. Return Response (✅ with oldAmountDate)
//     // ════════════════════════════════════════
//     return NextResponse.json({
//       success: true,
//       data: {
//         ledger,
//         totals,
//         payments: paymentTransactions,
//         returns: returnsList,
//         oldAmount,
//         oldAmountDate,  // ✅ NEW - C column ki date
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








import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet.js';

// ════════════════════════════════════════
// DATE PARSER - Koi bhi format ko DD-MM-YYYY mein convert kare
// ════════════════════════════════════════
function parseSheetDate(value) {
  if (!value) return '';
  const val = value.toString().trim();

  // 1. Google Sheets Serial Number (e.g., 45123)
  if (/^\d{4,5}$/.test(val)) {
    const serial = parseInt(val);
    const date = new Date((serial - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      const dd = String(date.getUTCDate()).padStart(2, '0');
      const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
      const yyyy = date.getUTCFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  }

  // 2. DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }

  // 3. DD-MM-YYYY (already correct)
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(val)) {
    const [d, m, y] = val.split('-');
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }

  // 4. YYYY-MM-DD (ISO format from input[type=date])
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const dateObj = new Date(val);
    if (!isNaN(dateObj.getTime())) {
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  }

  // 5. MM/DD/YYYY (US format fallback)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
    const dateObj = new Date(val);
    if (!isNaN(dateObj.getTime())) {
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  }

  // 6. Any other parseable date
  const dateObj = new Date(val);
  if (!isNaN(dateObj.getTime())) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  return val;
}

// ════════════════════════════════════════
// DD-MM-YYYY ko Date object mein convert (sorting ke liye)
// ════════════════════════════════════════
function ddmmyyyyToDate(dateStr) {
  if (!dateStr) return new Date(0);
  const val = dateStr.toString().trim();

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [d, m, y] = val.split('-');
    return new Date(`${y}-${m}-${d}`);
  }

  // DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
  }

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    return new Date(val);
  }

  // Serial number
  if (/^\d{4,5}$/.test(val)) {
    return new Date((parseInt(val) - 25569) * 86400 * 1000);
  }

  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

// ════════════════════════════════════════
// YYYY-MM-DD to DD-MM-YYYY (input date convert)
// ════════════════════════════════════════
function isoToDDMMYYYY(isoDate) {
  if (!isoDate) return '';
  const val = isoDate.toString().trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const [y, m, d] = val.split('T')[0].split('-');
    return `${d}-${m}-${y}`;
  }
  return parseSheetDate(val);
}

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

    // ════════════════════════════════════════
    // 1. Fetch Challans
    // ════════════════════════════════════════
    const challansRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Challans_Data!A2:P',
    });
    const challanRows = challansRes.data.values || [];

    const customerChallans = challanRows
      .filter(row => row[1]?.toString().trim().toLowerCase() === normalizedCustomer)
      .map(row => ({
        challanNo: row[0]?.toString().trim() || '',
        date: parseSheetDate(row[7]),
        amount: parseFloat(row[9]) || 0,
      }));

    const challanNos = new Set(customerChallans.map(c => c.challanNo));

    // ════════════════════════════════════════
    // 2. Fetch Returns
    // ════════════════════════════════════════
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
      const returnDate = parseSheetDate(row[4]);

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

    // ════════════════════════════════════════
    // 3. Fetch Return Items
    // ════════════════════════════════════════
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

    returnsList.sort((a, b) => ddmmyyyyToDate(b.returnDate) - ddmmyyyyToDate(a.returnDate));

    // ════════════════════════════════════════
    // 4. Fetch Payments (✅ FIXED with parseSheetDate)
    // ════════════════════════════════════════
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
        const paymentDate = parseSheetDate(row[4]); // ✅ FIXED

        paymentMap[challanNo] = (paymentMap[challanNo] || 0) + amount;

        paymentTransactions.push({
          paymentId: row[0] || '',
          challanNo: row[1]?.toString().trim() || '',
          amount,
          paymentDate, // ✅ DD-MM-YYYY format
          mode: row[5] || '',
          notes: row[6] || '',
        });
      });
    } catch (err) {
      console.warn('Payments sheet error:', err.message);
    }

    // ════════════════════════════════════════
    // 5. Fetch OLD Amount Ledger (✅ with date)
    // ════════════════════════════════════════
    let oldAmount = 0;
    let oldAmountDate = '';
    try {
      const oldLedgerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'OLD_Amount_Ledger!A2:C',
      });
      const oldLedgerRows = oldLedgerRes.data.values || [];

      oldLedgerRows.forEach(row => {
        if (!row || !row[0]) return;
        const rowName = row[0].toString().trim().toLowerCase();
        if (rowName === normalizedCustomer) {
          oldAmount += parseFloat(row[1]) || 0;
          if (row[2]) {
            const currentDate = parseSheetDate(row[2].toString().trim());
            if (!oldAmountDate) {
              oldAmountDate = currentDate;
            } else {
              try {
                if (ddmmyyyyToDate(currentDate) > ddmmyyyyToDate(oldAmountDate)) {
                  oldAmountDate = currentDate;
                }
              } catch (e) {}
            }
          }
        }
      });
    } catch (err) {
      console.warn('OLD_Amount_Ledger sheet error:', err.message);
    }

    // ════════════════════════════════════════
    // 6. Build Ledger
    // ════════════════════════════════════════
    const ledger = customerChallans
      .map(ch => {
        const returns = returnMap[ch.challanNo] || 0;
        const paymentsReceived = paymentMap[ch.challanNo] || 0;
        const due = ch.amount - returns - paymentsReceived;
        return {
          challanNo: ch.challanNo,
          date: ch.date, // ✅ Already DD-MM-YYYY
          amount: ch.amount,
          returns,
          payments: paymentsReceived,
          due,
        };
      })
      .sort((a, b) => ddmmyyyyToDate(a.date) - ddmmyyyyToDate(b.date));

    // ════════════════════════════════════════
    // 7. Totals
    // ════════════════════════════════════════
    const totalBulkPayments = paymentMap['bulk'] || 0;
    const totalPaymentsAll =
      ledger.reduce((s, r) => s + r.payments, 0) + totalBulkPayments;
    const totalBilled = ledger.reduce((s, r) => s + r.amount, 0);
    const totalReturns = ledger.reduce((s, r) => s + r.returns, 0);
    const totalDue = oldAmount + totalBilled - totalReturns - totalPaymentsAll;

    const totals = {
      totalBilled,
      totalReturns,
      totalPayments: totalPaymentsAll,
      totalDue,
      oldAmount,
    };

    paymentTransactions.sort(
      (a, b) => ddmmyyyyToDate(b.paymentDate) - ddmmyyyyToDate(a.paymentDate)
    );

    // ════════════════════════════════════════
    // 8. Return Response
    // ════════════════════════════════════════
    return NextResponse.json({
      success: true,
      data: {
        ledger,
        totals,
        payments: paymentTransactions,
        returns: returnsList,
        oldAmount,
        oldAmountDate,
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