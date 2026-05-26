import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet.js';

// ─── Same retry helper ───
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

// ─────────────────────────────────────────────────────────────
// POST - Create new Quotation
// ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { quotation, items, charges } = await request.json();

    if (!quotation?.customerName) {
      return NextResponse.json({ success: false, error: 'Customer name required' }, { status: 400 });
    }
    if (!quotation?.quotationNo) {
      return NextResponse.json({ success: false, error: 'Quotation number required' }, { status: 400 });
    }

    // Same 16 columns as Challans_Data
    const quotationRow = [
      quotation.quotationNo,                        // A
      quotation.customerName || '',                 // B
      quotation.customerPhone || '',                // C
      quotation.customerAddress || '',              // D
      quotation.vehicleNo || '',                    // E
      quotation.poNumber || '',                     // F
      quotation.gstCustomerName || '',              // G
      quotation.quotationDate || '',                // H
      quotation.deliveryNote || '',                 // I
      (quotation.quotationTotal || 0).toFixed(2),   // J
      quotation.status || 'Pending',                // K
      quotation.hidePrice ? 'TRUE' : 'FALSE',       // L
      (quotation.gstRate || 0).toFixed(2),          // M
      (quotation.gstAmount || 0).toFixed(2),        // N
      (quotation.subtotal || 0).toFixed(2),         // O
      (quotation.chargesTotal || 0).toFixed(2),     // P
    ];

    await appendWithRetry('Quotations_Data!A2', [quotationRow]);

    // Items - same structure as Challan_Items
    const regularItems = (items || []).filter(it => !it.isCharge && it.product);
    const itemRows = regularItems.map(it => [
      quotation.quotationNo,
      it.product || '',
      it.unit || '',
      it.quantity || it.sentQty || '',
      it.rate || '',
      (it.amount || 0).toFixed(2),
      (it.calculatedQty || 0).toFixed(3),
      (it.orderedQty || 0).toFixed(3),
      (it.sentQty || it.pieces || 0).toString(),
      it.size || '',
      it.lengthDisplay || '',
    ]);
    if (itemRows.length > 0) await appendWithRetry('Quotation_Items!A2', itemRows);

    // Charges - same structure as Challan_Charges
    const validCharges = (charges || []).filter(ch => (ch.name || ch.chargeName) && ch.amount > 0);
    const chargeRows = validCharges.map(ch => [
      quotation.quotationNo,
      ch.name || ch.chargeName || '',
      (ch.amount || 0).toFixed(2),
      ch.type || ch.chargeType || 'custom',
      ch.unit || 'Per Piece',
      (ch.quantity || 0).toString(),
      (ch.rate || 0).toString(),
    ]);
    if (chargeRows.length > 0) await appendWithRetry('Quotation_Charges!A2', chargeRows);

    return NextResponse.json({
      success: true,
      message: 'Quotation created',
      quotationNo: quotation.quotationNo
    });
  } catch (error) {
    console.error('POST /quotations error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// GET - Fetch all Quotations
// ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [quotRes, itemsRes, chargesRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Quotations_Data!A2:P' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Quotation_Items!A2:K' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Quotation_Charges!A2:G' }),
    ]);

    const quotRows = quotRes.data.values || [];
    const itemRows = itemsRes.data.values || [];
    const chargeRows = chargesRes.data.values || [];

    // Build items map
    const itemsMap = {};
    itemRows.forEach(row => {
      if (!row || !row[0]) return;
      const quotNo = row[0].trim();
      if (!itemsMap[quotNo]) itemsMap[quotNo] = [];
      itemsMap[quotNo].push({
        product: row[1] || '',
        unit: row[2] || '',
        quantity: row[3] || '',
        rate: parseFloat(row[4]) || 0,
        amount: parseFloat(row[5]) || 0,
        calculatedQty: parseFloat(row[6]) || 0,
        orderedQty: parseFloat(row[7]) || 0,
        sentQty: parseFloat(row[8]) || 0,
        size: row[9] || '',
        lengthDisplay: row[10] || '',
        isCharge: false,
      });
    });

    // Build charges map
    const chargesMap = {};
    chargeRows.forEach(row => {
      if (!row || !row[0]) return;
      const quotNo = row[0].trim();
      if (!chargesMap[quotNo]) chargesMap[quotNo] = [];
      chargesMap[quotNo].push({
        name: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        type: row[3] || 'custom',
        unit: row[4] || 'Per Piece',
        quantity: parseFloat(row[5]) || 0,
        rate: parseFloat(row[6]) || 0,
      });
    });

    const quotations = quotRows.map(row => {
      if (!row || !row[0]) return null;
      const quotNo = row[0].trim();
      return {
        quotationNo: quotNo,
        customerName: row[1] || '',
        customerPhone: row[2] || '',
        customerAddress: row[3] || '',
        vehicleNo: row[4] || '',
        poNumber: row[5] || '',
        gstCustomerName: row[6] || '',
        quotationDate: row[7] || '',
        deliveryNote: row[8] || '',
        quotationTotal: parseFloat(row[9]) || 0,
        status: row[10] || 'Pending',
        hidePrice: row[11]?.toString().toLowerCase() === 'true',
        gstRate: parseFloat(row[12]) || 0,
        gstAmount: parseFloat(row[13]) || 0,
        subtotal: parseFloat(row[14]) || 0,
        chargesTotal: parseFloat(row[15]) || 0,
        items: itemsMap[quotNo] || [],
        charges: chargesMap[quotNo] || [],
      };
    }).filter(Boolean);

    quotations.sort((a, b) => new Date(b.quotationDate) - new Date(a.quotationDate));

    return NextResponse.json({ success: true, data: quotations, total: quotations.length });
  } catch (error) {
    console.error('GET /quotations error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// PUT - Update existing Quotation
// ─────────────────────────────────────────────────────────────
export async function PUT(request) {
  try {
    const { quotation, items, charges } = await request.json();

    if (!quotation?.quotationNo) {
      return NextResponse.json({ success: false, error: 'Quotation number required' }, { status: 400 });
    }

    const quotationNo = quotation.quotationNo;

    // Find row in Quotations_Data
    const quotRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Quotations_Data!A2:P',
    });
    const quotRows = quotRes.data.values || [];
    let rowIndex = -1;
    quotRows.forEach((row, idx) => {
      if (row[0]?.trim() === quotationNo) rowIndex = idx;
    });

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, error: 'Quotation not found' }, { status: 404 });
    }

    // Update main row
    const actualRow = rowIndex + 2;
    const quotationRow = [
      quotation.quotationNo,
      quotation.customerName || '',
      quotation.customerPhone || '',
      quotation.customerAddress || '',
      quotation.vehicleNo || '',
      quotation.poNumber || '',
      quotation.gstCustomerName || '',
      quotation.quotationDate || '',
      quotation.deliveryNote || '',
      (quotation.quotationTotal || 0).toFixed(2),
      quotation.status || 'Pending',
      quotation.hidePrice ? 'TRUE' : 'FALSE',
      (quotation.gstRate || 0).toFixed(2),
      (quotation.gstAmount || 0).toFixed(2),
      (quotation.subtotal || 0).toFixed(2),
      (quotation.chargesTotal || 0).toFixed(2),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Quotations_Data!A${actualRow}:P${actualRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [quotationRow] },
    });

    // Delete old items and charges
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });

    const deleteRowsFromSheet = async (sheetName, matchNo) => {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:A`,
      });
      const rows = res.data.values || [];
      const sheet = sheetMeta.data.sheets.find(s => s.properties.title === sheetName);
      if (!sheet) return;
      const indices = [];
      rows.forEach((r, idx) => {
        if (r[0]?.trim() === matchNo) indices.push(idx);
      });
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

    await deleteRowsFromSheet('Quotation_Items', quotationNo);
    await deleteRowsFromSheet('Quotation_Charges', quotationNo);

    // Add new items
    const regularItems = (items || []).filter(it => !it.isCharge && it.product);
    const itemRows = regularItems.map(it => [
      quotationNo,
      it.product || '',
      it.unit || '',
      it.quantity || it.sentQty || '',
      it.rate || '',
      (it.amount || 0).toFixed(2),
      (it.calculatedQty || 0).toFixed(3),
      (it.orderedQty || 0).toFixed(3),
      (it.sentQty || it.pieces || 0).toString(),
      it.size || '',
      it.lengthDisplay || '',
    ]);
    if (itemRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Quotation_Items!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: itemRows },
      });
    }

    // Add new charges
    const validCharges = (charges || []).filter(ch => (ch.name || ch.chargeName) && ch.amount > 0);
    const chargeRows = validCharges.map(ch => [
      quotationNo,
      ch.name || ch.chargeName || '',
      (ch.amount || 0).toFixed(2),
      ch.type || ch.chargeType || 'custom',
      ch.unit || 'Per Piece',
      (ch.quantity || 0).toString(),
      (ch.rate || 0).toString(),
    ]);
    if (chargeRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Quotation_Charges!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: chargeRows },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Quotation ${quotationNo} updated`,
      quotationNo
    });
  } catch (error) {
    console.error('PUT /quotations error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE - Delete Quotation
// ─────────────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const { quotationNo } = await request.json();
    if (!quotationNo) {
      return NextResponse.json({ success: false, error: 'quotationNo required' }, { status: 400 });
    }

    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });

    const deleteRowsFromSheet = async (sheetName) => {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:A`,
      });
      const rows = res.data.values || [];
      const sheet = sheetMeta.data.sheets.find(s => s.properties.title === sheetName);
      if (!sheet) return;
      const indices = [];
      rows.forEach((r, idx) => {
        if (r[0]?.trim() === quotationNo) indices.push(idx);
      });
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

    await deleteRowsFromSheet('Quotations_Data');
    await deleteRowsFromSheet('Quotation_Items');
    await deleteRowsFromSheet('Quotation_Charges');

    return NextResponse.json({ success: true, message: `Quotation ${quotationNo} deleted` });
  } catch (error) {
    console.error('DELETE /quotations error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}