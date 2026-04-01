import { NextResponse } from 'next/server';
import { sheets, spreadsheetId, serviceAccountEmail } from '../config/googleSheet';
import { jsPDF } from 'jspdf';
import { v2 as cloudinary } from 'cloudinary';

// ============ CLOUDINARY CONFIG ============
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============ PDF GENERATOR FUNCTION ============
function generateInvoicePDF(billData) {
  const { bill, items } = billData;

  const doc = new jsPDF();

  // Colors
  const primaryColor = [180, 83, 9];
  const darkColor = [31, 41, 55];
  const lightColor = [107, 114, 128];

  // ========== HEADER ==========
  doc.setFillColor(...primaryColor);
  doc.roundedRect(15, 15, 18, 18, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('KT', 19, 27);

  doc.setTextColor(...darkColor);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Krishna Timber', 38, 22);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Wood & Timber Supplier', 38, 29);

  doc.setTextColor(...lightColor);
  doc.setFontSize(9);
  doc.text('Indore, Madhya Pradesh', 15, 42);
  doc.text('GSTIN: 23XXXXX1234X1ZX', 15, 48);
  doc.text('Phone: +91 98765 43210', 15, 54);

  // ========== INVOICE BOX ==========
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(140, 15, 55, 25, 3, 3, 'F');

  doc.setTextColor(...lightColor);
  doc.setFontSize(8);
  doc.text('INVOICE', 157, 22);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(bill.billNumber, 148, 32);

  doc.setTextColor(...lightColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const formattedDate = new Date(bill.billDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Date: ${formattedDate}`, 145, 48);

  // ========== DIVIDER LINE ==========
  doc.setDrawColor(229, 231, 235);
  doc.line(15, 62, 195, 62);

  // ========== BILL TO SECTION ==========
  doc.setTextColor(...lightColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', 15, 72);

  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(bill.customerName, 15, 80);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...lightColor);

  let yPos = 87;
  if (bill.customerPhone) {
    doc.text(`Phone: ${bill.customerPhone}`, 15, yPos);
    yPos += 6;
  }
  if (bill.customerAddress) {
    const addressLines = doc.splitTextToSize(`Address: ${bill.customerAddress}`, 80);
    doc.text(addressLines, 15, yPos);
    yPos += addressLines.length * 5;
  }

  // ========== ITEMS TABLE ==========
  const tableStartY = yPos + 10;
  const tableX = 15;
  const tableWidth = 180;
  const rowHeight = 10;
  const colWidths = [12, 68, 22, 22, 28, 28];

  // Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(tableX, tableStartY, tableWidth, rowHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  let headerX = tableX;
  const headers = ['#', 'Product', 'Qty', 'Unit', 'Rate', 'Amount'];
  headers.forEach((header, i) => {
    doc.text(header, headerX + 3, tableStartY + 7);
    headerX += colWidths[i];
  });

  // Table Rows
  let currentY = tableStartY + rowHeight;
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');

  items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(tableX, currentY, tableWidth, rowHeight, 'F');
    }

    doc.setDrawColor(229, 231, 235);
    doc.rect(tableX, currentY, tableWidth, rowHeight, 'S');

    let cellX = tableX;
    const rowData = [
      String(index + 1),
      item.product ? item.product.substring(0, 28) : '',
      String(item.quantity || 0),
      item.unit || '',
      `Rs.${parseFloat(item.rate || 0).toLocaleString('en-IN')}`,
      `Rs.${parseFloat(item.amount || 0).toLocaleString('en-IN')}`
    ];

    doc.setFontSize(9);
    rowData.forEach((data, i) => {
      doc.text(data, cellX + 3, currentY + 7);
      cellX += colWidths[i];
    });

    currentY += rowHeight;
  });

  // Table outer border
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.5);
  doc.rect(tableX, tableStartY, tableWidth, (items.length + 1) * rowHeight, 'S');
  doc.setLineWidth(0.2);

  // ========== TOTALS SECTION ==========
  const totalsY = currentY + 15;

  doc.setFillColor(249, 250, 251);
  doc.roundedRect(120, totalsY, 75, 50, 3, 3, 'F');

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(120, totalsY, 75, 50, 3, 3, 'S');
  doc.setLineWidth(0.2);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightColor);

  // Subtotal
  doc.text('Subtotal:', 125, totalsY + 12);
  doc.setTextColor(...darkColor);
  doc.text(`Rs.${parseFloat(bill.subtotal || 0).toLocaleString('en-IN')}`, 190, totalsY + 12, { align: 'right' });

  // GST
  doc.setTextColor(...lightColor);
  doc.text('GST (18%):', 125, totalsY + 24);
  doc.setTextColor(...darkColor);
  doc.text(`Rs.${parseFloat(bill.tax || 0).toLocaleString('en-IN')}`, 190, totalsY + 24, { align: 'right' });

  // Divider line
  doc.setDrawColor(209, 213, 219);
  doc.line(125, totalsY + 32, 190, totalsY + 32);

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text('Total:', 125, totalsY + 44);
  doc.setTextColor(...primaryColor);
  doc.text(`Rs.${parseFloat(bill.total || 0).toLocaleString('en-IN')}`, 190, totalsY + 44, { align: 'right' });

  // ========== PAYMENT STATUS ==========
  const statusY = totalsY;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  const status = bill.status || 'Draft';
  if (status === 'Paid') {
    doc.setFillColor(34, 197, 94);
  } else if (status === 'Pending') {
    doc.setFillColor(234, 179, 8);
  } else {
    doc.setFillColor(156, 163, 175);
  }
  doc.setTextColor(255, 255, 255);
  doc.roundedRect(15, statusY, 35, 10, 2, 2, 'F');
  doc.text(status.toUpperCase(), 20, statusY + 7);

  // ========== NOTES SECTION ==========
  let notesEndY = totalsY + 55;
  if (bill.notes) {
    const notesY = totalsY + 60;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(15, notesY, 100, 25, 3, 3, 'F');

    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES', 20, notesY + 8);

    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(bill.notes, 90);
    doc.text(noteLines.slice(0, 2), 20, notesY + 16);

    notesEndY = notesY + 30;
  }

  // ========== BANK DETAILS ==========
  const bankY = Math.max(notesEndY + 5, totalsY + 60);
  if (bankY < 250) {
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, bankY, 100, 30, 3, 3, 'F');

    doc.setTextColor(...darkColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('BANK DETAILS', 20, bankY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightColor);
    doc.text('Bank: State Bank of India', 20, bankY + 16);
    doc.text('A/C No: XXXX XXXX 1234', 20, bankY + 22);
    doc.text('IFSC: SBIN0001234', 20, bankY + 28);
  }

  // ========== FOOTER ==========
  const pageHeight = doc.internal.pageSize.height;

  doc.setDrawColor(229, 231, 235);
  doc.line(15, pageHeight - 30, 195, pageHeight - 30);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for your business!', 105, pageHeight - 22, { align: 'center' });

  doc.setTextColor(...lightColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Krishna Timber, Indore MP | Phone: +91 98765 43210', 105, pageHeight - 15, { align: 'center' });
  doc.text('Terms: Payment due within 15 days.', 105, pageHeight - 10, { align: 'center' });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

// ============ UPLOAD PDF TO CLOUDINARY ============
async function uploadPDFToCloudinary(pdfBuffer, fileName) {
  try {
    console.log('Uploading PDF to Cloudinary...');

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'krishna-timber-invoices',
          public_id: fileName,
          format: 'pdf',
          access_mode: 'public',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(pdfBuffer);
    });

    console.log('PDF uploaded to Cloudinary:', result.secure_url);

    // Google Docs Viewer se kisi bhi browser me PDF open hoga
    const viewLink = `https://docs.google.com/viewer?url=${encodeURIComponent(result.secure_url)}&embedded=true`;
    // Direct download link
    const downloadLink = result.secure_url;

    return {
      fileId: result.public_id,
      viewLink: viewLink,
      downloadLink: downloadLink,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error(`PDF upload failed: ${error.message}`);
  }
}

// ============ GET - Fetch All Bills ============
export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Invoice_Data!A2:L',
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        bills: [],
        message: 'No bills found',
      });
    }

    const bills = rows.map(row => {
      let items = [];
      try {
        items = JSON.parse(row[5] || '[]');
      } catch (e) {
        items = [];
      }

      return {
        billNumber: row[0] || '',
        customerName: row[1] || '',
        customerPhone: row[2] || '',
        customerAddress: row[3] || '',
        billDate: row[4] || '',
        items: items,
        subtotal: parseFloat(row[6]) || 0,
        tax: parseFloat(row[7]) || 0,
        total: parseFloat(row[8]) || 0,
        status: row[9] || 'Draft',
        notes: row[10] || '',
        invoicePDF: row[11] || '',
        itemsCount: items.length,
      };
    });

    bills.sort((a, b) => new Date(b.billDate) - new Date(a.billDate));

    return NextResponse.json({
      success: true,
      bills,
      totalBills: bills.length,
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

// ============ POST - Create New Bill with PDF ============
export async function POST(request) {
  try {
    const { bill, items } = await request.json();

    // Validation
    if (!bill || !bill.customerName) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Generate Bill Number
    const existingBills = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Invoice_Data!A2:A',
    });

    const existingBillNumbers = existingBills.data.values?.flat() || [];
    const currentYear = new Date().getFullYear();
    const prefix = `KT-${currentYear}-`;

    const currentYearBills = existingBillNumbers
      .filter(num => num && num.startsWith(prefix))
      .map(num => {
        const match = num.match(/KT-\d{4}-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

    const maxNumber = currentYearBills.length > 0 ? Math.max(...currentYearBills) : 0;
    const newNumber = String(maxNumber + 1).padStart(4, '0');
    const billNumber = `${prefix}${newNumber}`;

    if (existingBillNumbers.includes(billNumber)) {
      return NextResponse.json(
        { success: false, error: 'Bill number already exists' },
        { status: 409 }
      );
    }

    // Calculate Totals
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const completeBill = {
      ...bill,
      billNumber,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      billDate: bill.billDate || new Date().toISOString().split('T')[0],
    };

    // Generate PDF
    console.log('Generating PDF for bill:', billNumber);
    const pdfBuffer = generateInvoicePDF({ bill: completeBill, items });

    // Upload PDF to Cloudinary
    console.log('Uploading PDF to Cloudinary...');
    const pdfUpload = await uploadPDFToCloudinary(pdfBuffer, billNumber);
    console.log('PDF uploaded successfully:', pdfUpload.viewLink);

    // Save to Google Sheet
    const itemsJSON = JSON.stringify(items);

    const billRow = [
      billNumber,
      completeBill.customerName,
      completeBill.customerPhone || '',
      completeBill.customerAddress || '',
      completeBill.billDate,
      itemsJSON,
      completeBill.subtotal,
      completeBill.tax,
      completeBill.total,
      completeBill.status || 'Pending',
      completeBill.notes || '',
      pdfUpload.viewLink,
    ];

    // Retry logic for ECONNRESET / network issues
    let retries = 3;
    while (retries > 0) {
      try {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Invoice_Data!A2',
          valueInputOption: 'RAW',
          requestBody: {
            values: [billRow],
          },
        });
        break;
      } catch (sheetError) {
        retries--;
        if (retries === 0) throw sheetError;
        console.log(`Sheet append failed, retrying... (${retries} attempts left)`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bill created successfully',
      billNumber: billNumber,
      invoicePDF: pdfUpload.viewLink,
      downloadPDF: pdfUpload.downloadLink,
      data: {
        billNumber,
        customerName: completeBill.customerName,
        subtotal: completeBill.subtotal,
        tax: completeBill.tax,
        total: completeBill.total,
        itemsCount: items.length,
        status: completeBill.status || 'Pending',
      }
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create bill' },
      { status: 500 }
    );
  }
}

