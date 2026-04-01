
import { NextResponse } from "next/server";
import { sheets, spreadsheetId, drive } from "../../config/googleSheet";
import { Readable } from "stream";

// ─── jsPDF Setup ────────────────────────────────────────
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable").default || require("jspdf-autotable");

// ─── Helpers ────────────────────────────────────────────
const cleanText = (text) => {
  return (text || "N/A").toString().trim().replace(/[^a-zA-Z0-9\s-/.,&@#()%₹:]/g, "");
};

const getColumnLetter = (index) => {
  let letter = "";
  let tempIndex = index;
  while (tempIndex >= 0) {
    letter = String.fromCharCode((tempIndex % 26) + 65) + letter;
    tempIndex = Math.floor(tempIndex / 26) - 1;
  }
  return letter;
};



function generatePDF(selectedItems, INDENT_NUMBER_3) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Borders & Header
  doc.setDrawColor(139, 90, 43); doc.setLineWidth(1.5); doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  doc.setDrawColor(200, 162, 100); doc.setLineWidth(0.5); doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setTextColor(89, 60, 20);
  doc.setFontSize(22); doc.setFont("helvetica", "bold");
  doc.text("Krishna Timber", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(139, 90, 43);
  doc.text("Wood & Hardware Supplier", pageWidth / 2, 27, { align: "center" });

  doc.setDrawColor(139, 90, 43); doc.setLineWidth(0.8);
  doc.line(30, 31, pageWidth - 30, 31);

  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(139, 90, 43);
  doc.text("Purchase Order", pageWidth / 2, 42, { align: "center" });

  doc.setTextColor(0, 0, 0);

  // Info Section
  const firstItem = selectedItems[0];
  const indentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");

  doc.setFillColor(250, 245, 235); doc.setDrawColor(200, 162, 100);
  doc.roundedRect(12, 49, pageWidth - 24, 32, 2, 2, "FD");

  doc.setFontSize(9);
  // Left Column
  doc.setFont("helvetica", "bold"); doc.setTextColor(89, 60, 20);
  doc.text("Supplier:", 16, 57); doc.setFont("helvetica", "normal"); doc.setTextColor(0,0,0); doc.text(cleanText(firstItem.Supplier_Name), 38, 57);
  doc.text("Firm:", 16, 63); doc.text(cleanText(firstItem.Supplier_Firm), 38, 63);
  doc.text("Address:", 16, 69); const addr = cleanText(firstItem.Address); doc.text(addr.length > 45 ? addr.substring(0,45)+"..." : addr, 38, 69);
  doc.text("Contact:", 16, 75); doc.text(cleanText(firstItem.Contact_Number), 38, 75);

  // Right Column
  doc.setFont("helvetica", "bold"); doc.setTextColor(89, 60, 20);
  doc.text("PO No:", 125, 57); doc.setFont("helvetica", "normal"); doc.setTextColor(0,0,0); doc.text(INDENT_NUMBER_3, 152, 57);
  doc.text("PO Date:", 125, 63); doc.text(indentDate, 152, 63);
  doc.text("Req No:", 125, 69); doc.text(cleanText(firstItem.Req_No), 152, 69);
  doc.text("GST No:", 125, 75); doc.text(cleanText(firstItem.GST_Number), 152, 75);

  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(89, 60, 20);
  doc.text("Item Details", 16, 90);

  // Updated Table
  const tableBody = selectedItems.map((item) => [
    cleanText(item.UID),
    cleanText(item.Material_Name),
    cleanText(item.Brand_Name),
    cleanText(item.Quantity),
    cleanText(item.Unit_Name),
    cleanText(item.Rate_5 || "0"),
    cleanText(item.CGST_5 || "0"),
    cleanText(item.SGST_5 || "0"),
    cleanText(item.IGST_5 || "0"),
    cleanText(item.FINAL_RATE_5 || "0"),
    cleanText(item.TOTAL_VALUE_5 || "0"),
  ]);

  const grandTotal = selectedItems.reduce((sum, item) => sum + (parseFloat(item.TOTAL_VALUE_5) || 0), 0);
console.log("")
  const leftMargin = 12;
  const rightMargin = 12;

  autoTable(doc, {
    head: [["UID", "Material Name", "Brand", "Qty", "Unit", "Rate", "CGST", "SGST", "IGST", "Final Rate", "Total Value"]],
    body: tableBody,
    startY: 94,
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 2, halign: "center", lineColor: [200, 162, 100] },
    headStyles: { fillColor: [139, 90, 43], textColor: [255,255,255], fontStyle: "bold", fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 35 },
      2: { cellWidth: 32 },
      3: { cellWidth: 10 },
      4: { cellWidth: 12 },
      5: { cellWidth: 15 },
      6: { cellWidth: 12 },
      7: { cellWidth: 12 },
      8: { cellWidth: 12 },
      9: { cellWidth: 15 },
      10: { cellWidth: 20 },
    },
    alternateRowStyles: { fillColor: [250, 245, 235] },
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: "auto",
    showFoot: "lastPage",
    foot: [[
      {
        content: "Grand Total",
        colSpan: 10,
        styles: {
          halign: "right",
          fontStyle: "bold",
          fontSize: 8,
          fillColor: [220, 240, 255],   // Light Blue background (jo aapne pichhle message mein maanga tha)
          textColor: [0, 0, 0]          // Black Text
        }
      },
      {
        content: grandTotal.toFixed(2),
        styles: {
          halign: "center",
          fontStyle: "bold",
          fontSize: 8,
          fillColor: [220, 240, 255],   // Light Blue background
          textColor: [0, 0, 0]          // Black Text
        }
      }
    ]]
  });

  // Transport Section
  const tableEndY = doc.lastAutoTable?.finalY || 160;
  let currentY = tableEndY + 8;

  const hasTransport = selectedItems.some(item => item.Is_Transport_Required && item.Is_Transport_Required !== "N/A" && item.Is_Transport_Required !== "");

  if (hasTransport) {
    doc.setFillColor(250, 245, 235); doc.setDrawColor(200, 162, 100);
    doc.roundedRect(12, currentY, pageWidth - 24, 20, 2, 2, "FD");

    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(89, 60, 20);
    doc.text("Transport Details", 16, currentY + 6);

    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(0, 0, 0);
    doc.text(`Transport Required: ${cleanText(firstItem.Is_Transport_Required)}`, 16, currentY + 12);
    doc.text(`Expected Transport Charge: ${cleanText(firstItem.Expected_Transport_Charge)}`, 16, currentY + 17);
    doc.text(`Freight Charge: ${cleanText(firstItem.Freight_Charge)}`, 105, currentY + 12);
    doc.text(`Expected Freight Charge: ${cleanText(firstItem.Expected_Freight_Charge)}`, 105, currentY + 17);
  }

  // Footer
  const footerY = Math.max(currentY + 25, pageHeight - 50);
  doc.setDrawColor(139, 90, 43); doc.setLineWidth(0.3);
  doc.line(20, footerY + 10, 80, footerY + 10); doc.text("Prepared By", 38, footerY + 16);
  doc.line(pageWidth - 80, footerY + 10, pageWidth - 20, footerY + 10); doc.text("Approved By", pageWidth - 62, footerY + 16);

  doc.setFontSize(7); doc.setTextColor(150, 150, 150);
  doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, pageWidth / 2, pageHeight - 12, { align: "center" });

  return doc.output("datauristring");
}


// ─── GET: Fetch Data from A to AA ───────────────────────
export async function GET() {
  try {
    const sheetName = "Purchase_FMS";

    const lastRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID || spreadsheetId,
      range: `${sheetName}!A7:A`,
      majorDimension: "COLUMNS",
    });

    let lastRow = 7;
    if (lastRowResponse.data.values && lastRowResponse.data.values[0]) {
      const colAValues = lastRowResponse.data.values[0];
      for (let i = colAValues.length - 1; i >= 0; i--) {
        if (colAValues[i] && colAValues[i].toString().trim() !== "") {
          lastRow = 7 + i;
          break;
        }
      }
    }

    const range = `${sheetName}!A7:AA${lastRow}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID || spreadsheetId,
      range,
    });

    const rows = response.data.values || [];

    if (rows.length <= 1) {
      return NextResponse.json({
        success: false,
        message: "No data found in Purchase_FMS sheet",
        data: [],
      }, { status: 404 });
    }

    const headers = rows[0];

    const data = rows.slice(1).map((row, index) => {
      const rowData = {};
      headers.forEach((header, colIndex) => {
        rowData[header] = row[colIndex] || "";
      });
      rowData._rowNumber = 7 + index;
      return rowData;
    });

    return NextResponse.json({
      success: true,
      message: "Data fetched successfully from Purchase_FMS",
      totalRecords: data.length,
      headers,
      data,
      fetchedRange: range,
    });
  } catch (error) {
    console.error("Error fetching Purchase_FMS data:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data from Purchase_FMS",
      error: error.message,
    }, { status: 500 });
  }
}

// ─── POST: Update + Generate PDF + Upload to Drive ───────
export async function POST(request) {
  try {
    const body = await request.json();
    const { UIDs, STATUS_3, REMARK_3 } = body;

    console.log("Received request:", { UIDs, STATUS_3, REMARK_3 });

    if (!UIDs?.length || !Array.isArray(UIDs) || typeof STATUS_3 !== "string" || !STATUS_3.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: "UIDs and STATUS_3 are required",
        received: { UIDs, STATUS_3 }
      }, { status: 400 });
    }

    // IMPORTANT: Get data from the correct starting row
    // Your data starts from row 7, so we need to get from row 7 onwards
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID || spreadsheetId,
      range: "Purchase_FMS!A7:AG", // Get up to AG column
    });

    const rows = getResponse.data.values || [];
    if (!rows.length) {
      return NextResponse.json({ success: false, error: "No data found" }, { status: 404 });
    }

    const headerRow = rows[0].map(c => (c || "").trim());
    console.log("Headers found:", headerRow);
    
    const uidIndex = headerRow.indexOf("UID");
    if (uidIndex === -1) {
      return NextResponse.json({ success: false, error: "UID column not found" }, { status: 400 });
    }

    const columnIndices = {};
    headerRow.forEach((h, i) => { 
      columnIndices[h] = i; 
    });

    // Data rows start from index 1 (after header)
    const dataRows = rows.slice(1);
    const selectedItems = [];
    const rowNumbers = []; // Store actual sheet row numbers
    
    console.log(`Total data rows found: ${dataRows.length}`);
    console.log(`Looking for UIDs: ${UIDs.join(", ")}`);

    // Find rows for each UID
    for (const uid of UIDs) {
      const rowIndex = dataRows.findIndex(r => {
        const cellValue = r[uidIndex]?.toString().trim();
        return cellValue === uid.trim();
      });
      
      console.log(`Searching for UID ${uid}: found at index ${rowIndex}`);
      
      if (rowIndex === -1) {
        return NextResponse.json({ 
          success: false, 
          error: `UID not found: ${uid}` 
        }, { status: 404 });
      }

      // CRITICAL: Actual row number in sheet
      // rows[0] is header at row 7
      // dataRows[0] is first data row at row 8
      // So actual row number = 7 + 1 (header) + rowIndex
      const actualRowNumber = 7 + 1 + rowIndex;
      rowNumbers.push(actualRowNumber);
      
      console.log(`UID ${uid} found at data row index ${rowIndex}, actual sheet row: ${actualRowNumber}`);

      const row = dataRows[rowIndex];
      const getVal = (name) => {
        const idx = columnIndices[name];
        return idx !== undefined ? (row[idx] || "").trim() : "N/A";
      };

      selectedItems.push({
        UID: getVal("UID"),
        Req_No: getVal("Req No"),
        Supplier_Name: getVal("Suplier Name"),
        Supplier_Firm: getVal("suplier Firm"),
        Address: getVal("Address"),
        Contact_Number: getVal("Contact Number"),
        Brand_Name: getVal("Brand name"),
        Material_Name: getVal("Material Name"),
        SKU_Code: getVal("SKU Code"),
        Quantity: getVal("Quantity"),
        Unit_Name: getVal("Unit Name"),
        Rate_5: getVal("Rate 5"),
        CGST_5: getVal("CGST 5"),
        SGST_5: getVal("SGST 5"),
        IGST_5: getVal("IGST 5"),
        FINAL_RATE_5: getVal("FINAL RATE 5"),
        TOTAL_VALUE_5: getVal("TOTAL VALUE 5"),
        GST_Number: getVal("GST Number"),
        Is_Transport_Required: getVal("Is Transport Required"),
        Expected_Transport_Charge: getVal("Expected Transport charge"),
        Freight_Charge: getVal("Frighet Charge"),
        Expected_Freight_Charge: getVal("Expected Frighet Charge"),
      });
    }

    console.log("Selected items:", selectedItems.map(item => ({ UID: item.UID, Material: item.Material_Name })));
    console.log("Row numbers to update:", rowNumbers);

    // Generate Indent Number
    // AD column is index 29 (since A=0, B=1, etc.)
    const AD_COL_INDEX = 29;
    let nextNum = 1;
    
    // Check existing PO numbers from AD column in data rows
    const existingPONumbers = dataRows
      .map(r => r[AD_COL_INDEX] || "")
      .filter(v => v.startsWith("PO-"))
      .map(v => parseInt(v.replace("PO-", ""), 10))
      .filter(n => !isNaN(n));
    
    if (existingPONumbers.length > 0) {
      nextNum = Math.max(...existingPONumbers) + 1;
    }
    
    const INDENT_NUMBER_3 = `PO-${nextNum.toString().padStart(3, "0")}`;
    const REMARK_3_final = REMARK_3 || "N/A";

    console.log("Generated PO Number:", INDENT_NUMBER_3);

    // Generate PDF
    const pdfDataUri = generatePDF(selectedItems, INDENT_NUMBER_3);
    const base64Data = pdfDataUri.replace(/^data:application\/pdf(?:;[^,]+)?;base64,/, "");

    // Upload to Google Drive
    let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    let validFolderId = folderId;
    let isFolderValid = false;

    try {
      if (folderId) {
        await drive.files.get({ fileId: folderId, fields: "id,name", supportsAllDrives: true });
        isFolderValid = true;
        validFolderId = folderId;
      }
    } catch (error) {
      console.log("Folder not found or invalid, will create new folder");
      try {
        const newFolder = await drive.files.create({
          resource: { 
            name: `KrishnaTimber_POs_${new Date().getFullYear()}`, 
            mimeType: "application/vnd.google-apps.folder" 
          },
          fields: "id", 
          supportsAllDrives: true
        });
        validFolderId = newFolder.data.id;
        isFolderValid = true;
        console.log("Created new folder with ID:", validFolderId);
      } catch (e) { 
        console.error("Folder creation error:", e); 
      }
    }

    const pdfBuffer = Buffer.from(base64Data, "base64");
    const fileName = `KT_PO_${INDENT_NUMBER_3}_${Date.now()}.pdf`;
    
    const file = await drive.files.create({
      resource: {
        name: fileName,
        parents: isFolderValid ? [validFolderId] : [],
        mimeType: "application/pdf"
      },
      media: { 
        mimeType: "application/pdf", 
        body: Readable.from(pdfBuffer) 
      },
      fields: "id,webViewLink",
      supportsAllDrives: true,
    });

    const pdfUrl = file.data.webViewLink;
    console.log("PDF uploaded, URL:", pdfUrl);
    
    // Make file publicly accessible
    try {
      await drive.permissions.create({ 
        fileId: file.data.id, 
        requestBody: { role: "reader", type: "anyone" }, 
        supportsAllDrives: true 
      });
    } catch (permError) {
      console.log("Permission error (non-critical):", permError.message);
    }

    // ============ DIRECT COLUMN UPDATES USING FIXED COLUMN POSITIONS ============
    // AD column = index 29 (STATUS 3)
    // AF column = index 31 (INDENT NUMBER 3)  
    // AG column = index 32 (PDF URL 3)
    
    const updateData = [];
    
    for (let i = 0; i < rowNumbers.length; i++) {
      const rowNum = rowNumbers[i];
      
      console.log(`Preparing updates for row ${rowNum} (UID: ${UIDs[i]})`);
      
      // Update STATUS 3 in AD column (index 29)
      const adColLetter = getColumnLetter(29);
      updateData.push({
        range: `Purchase_FMS!${adColLetter}${rowNum}`,
        values: [[STATUS_3]]
      });
      console.log(`  → STATUS 3 at ${adColLetter}${rowNum} = ${STATUS_3}`);
      
      // Update INDENT NUMBER 3 in AF column (index 31)
      const afColLetter = getColumnLetter(31);
      updateData.push({
        range: `Purchase_FMS!${afColLetter}${rowNum}`,
        values: [[INDENT_NUMBER_3]]
      });
      console.log(`  → INDENT NUMBER 3 at ${afColLetter}${rowNum} = ${INDENT_NUMBER_3}`);
      
      // Update PDF URL 3 in AG column (index 32)
      const agColLetter = getColumnLetter(32);
      updateData.push({
        range: `Purchase_FMS!${agColLetter}${rowNum}`,
        values: [[pdfUrl]]
      });
      console.log(`  → PDF URL 3 at ${agColLetter}${rowNum} = ${pdfUrl}`);
      
      // Also update REMARK if column exists
      const remarkIndex = columnIndices["Remark"];
      if (remarkIndex !== undefined) {
        const remarkColLetter = getColumnLetter(remarkIndex);
        updateData.push({
          range: `Purchase_FMS!${remarkColLetter}${rowNum}`,
          values: [[REMARK_3_final]]
        });
        console.log(`  → Remark at ${remarkColLetter}${rowNum} = ${REMARK_3_final}`);
      }
    }

    // Execute batch update
    if (updateData.length > 0) {
      console.log(`\nExecuting batch update with ${updateData.length} updates for rows: ${rowNumbers.join(", ")}`);
      try {
        const batchResponse = await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: process.env.SPREADSHEET_ID || spreadsheetId,
          resource: { 
            valueInputOption: "RAW", 
            data: updateData 
          }
        });
        console.log("✅ Sheet updated successfully!");
        console.log("Updated ranges:", updateData.map(u => u.range));
        
        return NextResponse.json({
          success: true,
          message: "Purchase Order generated and sheet updated successfully",
          pdfUrl,
          indentNumber: INDENT_NUMBER_3,
          updatedRows: rowNumbers,
          updatedUIDs: UIDs,
          updatedColumns: {
            "STATUS 3 (AD)": STATUS_3,
            "INDENT NUMBER 3 (AF)": INDENT_NUMBER_3,
            "PDF URL 3 (AG)": pdfUrl,
            "Remark": REMARK_3_final
          }
        });
      } catch (updateError) {
        console.error("Batch update error:", updateError);
        throw new Error(`Failed to update sheet: ${updateError.message}`);
      }
    } else {
      console.warn("No updates to perform");
      return NextResponse.json({ 
        success: false, 
        error: "No updates to perform" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}