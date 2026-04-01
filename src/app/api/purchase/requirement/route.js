
import { NextResponse } from 'next/server';
import { sheets, spreadsheetId } from '../../config/googleSheet';

export async function POST(request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [body];

    if (items.length === 0) {
      return NextResponse.json({ success: false, message: 'No items provided' }, { status: 400 });
    }

    const timestamp = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).format(new Date()).replace(',', '');

    const reqNo = await generateReqNo();
    const nextUID = await generateNextUID();

    // Duplicate check for Req No
    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Purchase_FMS!C8:C',
    });
    const existingReqNos = (checkResponse.data.values || []).flat().filter(Boolean);
    if (existingReqNos.includes(reqNo)) {
      return NextResponse.json({ success: false, message: `Req No ${reqNo} already exists.` }, { status: 409 });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // COLUMN MAPPING (A → AB)
    //
    // A  Timestamp          → auto
    // B  UID                → auto
    // C  Req No             → auto
    // D  Supplier Name      → body.supplierName
    // E  Supplier Firm      → body.supplierFirm
    // F  Address            → body.address
    // G  Contact Number     → body.contactNumber
    // H  Brand Name         → body.brandName
    // I  Material Category  → items[].materialCategory
    // J  Material Name      → items[].materialName
    // K  Material Type/Grade→ items[].materialType
    // L  SKU Code           → items[].skuCode
    // M  Quantity           → items[].quantity
    // N  Unit Name          → items[].unitName
    // O  Rate               → items[].rate
    // P  GST Type           → items[].gstType (cgst_sgst / igst)
    // Q  GST %              → items[].gstPercent
    // R  CGST %             → items[].cgst (auto-calculated)
    // S  SGST %             → items[].sgst (auto-calculated)
    // T  IGST %             → items[].igst (auto-calculated)
    // U  Final Rate         → calculated
    // V  Total Value        → calculated
    // W  GST Number         → body.gstNumber
    // X  Is Transport Req.  → body.isTransportRequired
    // Y  Exp. Transport Ch. → body.expectedTransportCharge
    // Z  Freight Charge     → body.freightCharge
    // AA Exp. Freight Ch.   → body.expectedFreightCharge
    // AB Required Days      → body.requiredDays
    // AC Remark             → items[].remark
    // ══════════════════════════════════════════════════════════════════════════

    const rowsToAppend = items.map((item, index) => {
      const rate = parseFloat(item.rate) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const gstPercent = parseFloat(item.gstPercent) || 0;
      const gstType = item.gstType || 'cgst_sgst';

      // Calculate GST split based on type
      let cgst = 0, sgst = 0, igst = 0;
      if (gstType === 'cgst_sgst') {
        cgst = gstPercent / 2;
        sgst = gstPercent / 2;
      } else {
        igst = gstPercent;
      }

      // Calculate final values
      const gstAmount = rate * (gstPercent / 100);
      const finalRate = rate + gstAmount;
      const totalValue = quantity * finalRate;

      return [
        timestamp,                                      // A  Timestamp
        (nextUID + index).toString(),                   // B  UID
        reqNo,                                          // C  Req No
        body.supplierName || '',                        // D  Supplier Name
        body.supplierFirm || '',                        // E  Supplier Firm
        body.address || '',                             // F  Address
        body.contactNumber || '',                       // G  Contact Number
        body.brandName || '',                           // H  Brand Name
        item.materialCategory || '',                    // I  Material Category
        item.materialName || '',                        // J  Material Name
        item.materialType || '',                        // K  Material Type/Grade
        item.skuCode || '',                             // L  SKU Code
        quantity.toString(),                            // M  Quantity
        item.unitName || '',                            // N  Unit Name
        rate.toFixed(2),                                // O  Rate
        // gstPercent.toFixed(2),                          // Q  GST %
        cgst.toFixed(2),                                // R  CGST %
        sgst.toFixed(2),                                // S  SGST %
        igst.toFixed(2),                                // T  IGST %
        finalRate.toFixed(2),                           // U  Final Rate
        totalValue.toFixed(2),                          // V  Total Value
        body.gstNumber || '',                           // W  GST Number
        body.isTransportRequired || 'No',               // X  Is Transport Required
        body.expectedTransportCharge || '',             // Y  Expected Transport Charge
        body.freightCharge || '',                       // Z  Freight Charge
        body.expectedFreightCharge || '',               // AA Expected Freight Charge
        body.requiredDays || '',                        // AB Required Days
        item.remark || '',                              // AC Remark
      ];
    });

    // Calculate grand total for response
    const grandTotal = items.reduce((sum, item) => {
      const rate = parseFloat(item.rate) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const gstPercent = parseFloat(item.gstPercent) || 0;
      const finalRate = rate * (1 + gstPercent / 100);
      return sum + (quantity * finalRate);
    }, 0);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Purchase_FMS!A8:AC8',
      valueInputOption: 'RAW',
      requestBody: { values: rowsToAppend },
    });

    return NextResponse.json({
      success: true,
      message: `${items.length} item${items.length > 1 ? 's' : ''} added successfully`,
      data: {
        timestamp,
        reqNo,
        uid: items.length === 1
          ? nextUID.toString()
          : `${nextUID} to ${nextUID + items.length - 1}`,
        totalItems: items.length,
        grandTotal: grandTotal.toFixed(2),
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ POST Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}

// ────────────────────────────── Generate Req No ──────────────────────────────
async function generateReqNo() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Purchase_FMS!C8:C',
    });
    const rows = res.data.values || [];
    if (rows.length === 0) return 'REQ-001';
    const last = rows[rows.length - 1][0];
    const match = last?.match(/REQ-(\d+)/);
    if (match) {
      const next = parseInt(match[1]) + 1;
      return `REQ-${String(next).padStart(3, '0')}`;
    }
    return 'REQ-001';
  } catch (e) {
    return `REQ-${Date.now().toString().slice(-6)}`;
  }
}

// ────────────────────────────── Generate Next UID ────────────────────────────
async function generateNextUID() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Purchase_FMS!B8:B',
    });

    const uids = (res.data.values || []).flat().filter(Boolean);

    if (uids.length === 0) return 1;

    let maxNum = 0;
    uids.forEach((uid) => {
      const num = parseInt(uid);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    });

    return maxNum + 1;
  } catch (e) {
    console.error("UID generation error:", e);
    return Date.now();
  }
}