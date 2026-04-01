
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Printer, Search, CheckCircle, Eye, AlertTriangle, Download, Loader2, RefreshCw } from 'lucide-react';

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '0755-4275577',
  gstin: '23XXXXX1234X1ZX',
};

const TAX_RATE = 0.18;

function generateUID() {
  return 'ITEM-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function generateBillNo(existingBills) {
  const year = new Date().getFullYear();
  const count = (existingBills || []).filter(b => b.id.startsWith(`KT-${year}`)).length + 1;
  return `KT-${year}-${String(count).padStart(3, '0')}`;
}

const emptyItem = () => ({
  uid: generateUID(),
  skuCode: '',
  product: '',
  unit: '',
  quantity: '',
  rate: '',
  amount: 0,
  materialType: '',
});

// ─── Number to Words (Indian) ────────────────────────────────────────────────
function numberToWords(num) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (num === 0) return 'Zero';
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
    if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + convert(n%100) : '');
    if (n < 100000) return convert(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + convert(n%1000) : '');
    if (n < 10000000) return convert(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + convert(n%100000) : '');
    return convert(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + convert(n%10000000) : '');
  }
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  let result = convert(intPart) + ' Rupees';
  if (decPart > 0) result += ' and ' + convert(decPart) + ' Paise';
  result += ' Only';
  return result;
}

// ─── Professional Print HTML ─────────────────────────────────────────────────
// const getPrintHTML = (bill, items) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <title>Invoice ${bill.id} — ${SHOP_INFO.name}</title>
// <style>
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
//   *{box-sizing:border-box;margin:0;padding:0}
//   body{font-family:'Inter',sans-serif;background:#fff;color:#1a1a2e;font-size:13px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   .page{max-width:794px;margin:0 auto;padding:0}
//   .header-band{background:linear-gradient(135deg,#7c3f00 0%,#b35900 50%,#d4700a 100%);padding:32px 40px 28px;position:relative;overflow:hidden}
//   .header-band::before{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.06)}
//   .header-inner{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1}
//   .shop-name{font-family:'Playfair Display',serif;font-size:26px;color:#fff;letter-spacing:-0.5px;line-height:1.1}
//   .shop-tagline{font-size:10px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-top:4px}
//   .shop-contact{margin-top:12px;font-size:11px;color:rgba(255,255,255,0.85);line-height:1.7}
//   .invoice-badge{text-align:right}
//   .invoice-label{font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:3px}
//   .invoice-num{font-family:'Playfair Display',serif;font-size:28px;color:#ffd580;margin-top:2px}
//   .invoice-date{font-size:11px;color:rgba(255,255,255,0.75);margin-top:6px}
//   .gstin-badge{display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:3px 10px;font-size:10px;color:rgba(255,255,255,0.8);margin-top:5px;letter-spacing:0.5px}
//   .body{padding:0 40px 32px}
//   .meta-row{display:flex;gap:0;margin-top:28px;margin-bottom:24px;border:1.5px solid #e8d5b0;border-radius:10px;overflow:hidden}
//   .bill-to{flex:1;padding:16px 20px;background:#fffdf7}
//   .ship-meta{width:200px;padding:16px 20px;background:#fdf6ec;border-left:1.5px solid #e8d5b0}
//   .meta-label{font-size:9px;font-weight:700;color:#b35900;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
//   .cust-name{font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:3px}
//   .cust-detail{font-size:11px;color:#666;line-height:1.6}
//   .meta-row-item{display:flex;justify-content:space-between;font-size:11px;margin-bottom:5px}
//   .meta-row-item span:first-child{color:#888}
//   .meta-row-item span:last-child{font-weight:600;color:#333}
//   .table-wrap{margin-bottom:24px}
//   table{width:100%;border-collapse:collapse}
//   thead tr{background:linear-gradient(135deg,#7c3f00,#b35900)}
//   th{padding:11px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#fff;text-align:left}
//   th:last-child,th.right{text-align:right}
//   tbody tr{border-bottom:1px solid #f0e6d3}
//   tbody tr:nth-child(even){background:#fffdf9}
//   tbody tr:last-child{border-bottom:2px solid #d4700a}
//   td{padding:10px 14px;font-size:12px;color:#2d2d2d;vertical-align:top}
//   td.right{text-align:right}
//   td.center{text-align:center}
//   .item-name{font-weight:600;color:#1a1a2e}
//   .item-sku{font-size:10px;color:#999;margin-top:1px}
//   .sr{color:#aaa;font-size:11px}
//   .bottom-section{display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;gap:20px}
//   .amount-words-box{flex:1;background:#fffdf7;border:1.5px solid #e8d5b0;border-radius:8px;padding:12px 16px}
//   .aw-label{font-size:9px;font-weight:700;color:#b35900;text-transform:uppercase;letter-spacing:2px;margin-bottom:5px}
//   .aw-text{font-size:11px;color:#444;font-weight:600;font-style:italic;line-height:1.5}
//   .totals-box{width:240px}
//   .tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#555;border-bottom:1px solid #f0e6d3}
//   .tot-row:last-child{border-bottom:none}
//   .tot-final{display:flex;justify-content:space-between;padding:11px 16px;background:linear-gradient(135deg,#7c3f00,#b35900);border-radius:8px;margin-top:8px}
//   .tot-final span:first-child{font-size:12px;font-weight:700;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:1px}
//   .tot-final span:last-child{font-size:17px;font-weight:800;color:#fff}
//   .gst-section{margin-top:20px;border:1.5px solid #e8d5b0;border-radius:8px;overflow:hidden}
//   .gst-header{background:#f9f0e3;padding:8px 14px;font-size:9px;font-weight:700;color:#b35900;text-transform:uppercase;letter-spacing:2px}
//   .gst-table{width:100%;border-collapse:collapse}
//   .gst-table th{background:#f3e8d5;padding:7px 14px;font-size:10px;color:#8b4513;font-weight:600;text-align:left}
//   .gst-table td{padding:7px 14px;font-size:11px;color:#444;border-top:1px solid #f0e6d3}
//   .divider{height:2px;background:linear-gradient(90deg,#d4700a,#ffd580,#d4700a);margin:24px 0;border-radius:2px}
//   .footer-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px}
//   .footer-note{font-size:10px;color:#999;max-width:340px;line-height:1.6}
//   .sig-section{text-align:right}
//   .sig-line{width:180px;border-top:1.5px solid #ccc;margin-bottom:6px;margin-left:auto}
//   .sig-label{font-size:10px;color:#888}
//   .stamp-area{display:inline-block;border:2px dashed #d4700a;border-radius:8px;padding:6px 20px;font-size:10px;color:#d4700a;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:8px}
//   .thankyou{text-align:center;margin-top:20px;padding:12px;background:linear-gradient(135deg,#fffdf7,#fdf0dc);border-radius:8px;border:1px solid #e8d5b0}
//   .thankyou p{font-size:12px;color:#7c3f00;font-weight:600}
//   .thankyou small{font-size:10px;color:#aaa;display:block;margin-top:2px}
//   @media print{body{padding:0}.page{max-width:100%}}
// </style>
// </head>
// <body>
// <div class="page">
//   <div class="header-band">
//     <div class="header-inner">
//       <div>
//         <div class="shop-name">${SHOP_INFO.name}</div>
//         <div class="shop-tagline">Quality Wood & Plywoods since est.</div>
//         <div class="shop-contact">${SHOP_INFO.address}<br>${SHOP_INFO.phone}</div>
//         <div class="gstin-badge">GSTIN: ${SHOP_INFO.gstin}</div>
//       </div>
//       <div class="invoice-badge">
//         <div class="invoice-label">Tax Invoice</div>
//         <div class="invoice-num">${bill.id}</div>
//         <div class="invoice-date">Date: ${new Date(bill.date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div>
//       </div>
//     </div>
//   </div>
//   <div class="body">
//     <div class="meta-row">
//       <div class="bill-to">
//         <div class="meta-label">Bill To</div>
//         <div class="cust-name">${bill.customer}</div>
//         <div class="cust-detail">${bill.phone ? bill.phone + '<br>' : ''}${bill.address || ''}</div>
//       </div>
//       <div class="ship-meta">
//         <div class="meta-label">Invoice Details</div>
//         <div class="meta-row-item"><span>Invoice No</span><span>${bill.id}</span></div>
//         <div class="meta-row-item"><span>Date</span><span>${new Date(bill.date).toLocaleDateString('en-IN')}</span></div>
//         <div class="meta-row-item"><span>Items</span><span>${items.length}</span></div>
//         <div class="meta-row-item"><span>GST</span><span>${bill.includeGST ? '18% Incl.' : 'N/A'}</span></div>
//         <div class="meta-row-item"><span>Status</span><span style="color:#d4700a;font-weight:700">${bill.status || 'Pending'}</span></div>
//       </div>
//     </div>
//     <div class="table-wrap">
//       <table>
//         <thead><tr>
//           <th style="width:40px">#</th><th>Item Description</th>
//           <th style="width:55px;text-align:center">Unit</th><th style="width:65px;text-align:center">Qty</th>
//           <th style="width:90px;text-align:right">Rate</th><th style="width:100px;text-align:right">Amount</th>
//         </tr></thead>
//         <tbody>
//           ${items.map((it, i) => `<tr>
//             <td class="sr">${i+1}</td>
//             <td>
//               <div class="item-name">${it.product || it.itemName}</div>
//               ${it.skuCode ? `<div class="item-sku">SKU: ${it.skuCode}</div>` : ''}
//             </td>
//             <td class="center" style="color:#666">${it.unit}</td>
//             <td class="center" style="font-weight:600">${it.quantity}</td>
//             <td class="right" style="color:#555">${parseFloat(it.rate).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
//             <td class="right" style="font-weight:700;color:#1a1a2e">${(it.amount||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
//           </tr>`).join('')}
//         </tbody>
//       </table>
//     </div>
//     <div class="bottom-section">
//       <div class="amount-words-box">
//         <div class="aw-label">Amount in Words</div>
//         <div class="aw-text">${numberToWords(bill.total || 0)}</div>
//       </div>
//       <div class="totals-box">
//         <div class="tot-row"><span>Subtotal</span><span>₹${(bill.subtotal||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
//         ${bill.includeGST ? `
//         <div class="tot-row"><span>CGST (9%)</span><span>₹${((bill.tax||0)/2).toFixed(2)}</span></div>
//         <div class="tot-row"><span>SGST (9%)</span><span>₹${((bill.tax||0)/2).toFixed(2)}</span></div>` : ''}
//         <div class="tot-row"><span>Discount</span><span>₹0.00</span></div>
//         <div class="tot-final">
//           <span>Total</span>
//           <span>₹${(bill.total||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span>
//         </div>
//       </div>
//     </div>
//     ${bill.includeGST ? `
//     <div class="gst-section" style="margin-top:20px">
//       <div class="gst-header">GST Tax Breakup</div>
//       <table class="gst-table">
//         <thead><tr><th>Taxable Amount</th><th>CGST Rate</th><th>CGST Amt</th><th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th></tr></thead>
//         <tbody><tr>
//           <td>₹${(bill.subtotal||0).toFixed(2)}</td><td>9%</td><td>₹${((bill.tax||0)/2).toFixed(2)}</td>
//           <td>9%</td><td>₹${((bill.tax||0)/2).toFixed(2)}</td><td style="font-weight:700;color:#b35900">₹${(bill.tax||0).toFixed(2)}</td>
//         </tr></tbody>
//       </table>
//     </div>` : ''}
//     ${bill.notes ? `<div style="margin-top:18px;background:#fffdf7;border:1.5px solid #e8d5b0;border-radius:8px;padding:12px 16px;font-size:11px;color:#555"><strong style="color:#b35900">Notes / Terms:</strong> ${bill.notes}</div>` : ''}
//     <div class="divider"></div>
//     <div class="footer-row">
//       <div class="footer-note">Goods once sold will not be taken back.<br>Payment due on receipt of invoice.<br>Subject to Bhopal jurisdiction only.</div>
//       <div class="sig-section">
//         <div class="stamp-area">For ${SHOP_INFO.name}</div>
//         <div class="sig-line" style="margin-top:30px"></div>
//         <div class="sig-label">Authorized Signatory</div>
//       </div>
//     </div>
//     <div class="footer-row" style="margin-top:12px">
//       <div><div class="sig-line" style="margin-left:0;margin-bottom:6px"></div><div class="sig-label">Customer Signature</div></div>
//     </div>
//     <div class="thankyou">
//       <p>Thank you for your business!</p>
//       <small>Please visit again — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</small>
//     </div>
//   </div>
// </div>
// </body>
// </html>`;


//////

// ─── Professional Print HTML (B&W Optimized Challan) ─────────────────────────
const getPrintHTML = (bill, items) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Invoice ${bill.id} — ${SHOP_INFO.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    background: #fff;
    color: #000;
    font-size: 12px;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .page {
    max-width: 210mm; /* A4 width */
    margin: 0 auto;
    padding: 15mm;
    background: #fff;
  }
  
  /* Header Section */
  .header {
    border: 2px solid #000;
    padding: 12px 16px;
    margin-bottom: 12px;
  }
  
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 10px;
    border-bottom: 1px solid #000;
    margin-bottom: 8px;
  }
  
  .shop-info h1 {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  
  .shop-info p {
    font-size: 10px;
    line-height: 1.5;
    margin-bottom: 2px;
  }
  
  .invoice-box {
    text-align: right;
    border: 2px solid #000;
    padding: 8px 12px;
    min-width: 180px;
  }
  
  .invoice-label {
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }
  
  .invoice-number {
    font-size: 16px;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    margin: 4px 0;
  }
  
  .invoice-date {
    font-size: 9px;
    margin-top: 3px;
  }
  
  .gstin-row {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    font-weight: bold;
  }
  
  /* Customer Details */
  .customer-section {
    border: 2px solid #000;
    margin-bottom: 12px;
  }
  
  .customer-header {
    background: #000;
    color: #fff;
    padding: 5px 10px;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .customer-body {
    display: flex;
    border-top: 1px solid #000;
  }
  
  .bill-to, .ship-to {
    flex: 1;
    padding: 10px 12px;
  }
  
  .bill-to {
    border-right: 1px solid #000;
  }
  
  .section-label {
    font-size: 8px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
    text-decoration: underline;
  }
  
  .customer-name {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 3px;
  }
  
  .customer-detail {
    font-size: 10px;
    line-height: 1.5;
  }
  
  .meta-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    font-size: 9px;
  }
  
  .meta-grid .label {
    font-weight: bold;
  }
  
  /* Items Table */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    border: 2px solid #000;
  }
  
  .items-table thead {
    background: #000;
    color: #fff;
  }
  
  .items-table th {
    padding: 7px 8px;
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: left;
    border-right: 1px solid #fff;
  }
  
  .items-table th:last-child {
    border-right: none;
  }
  
  .items-table th.center { text-align: center; }
  .items-table th.right { text-align: right; }
  
  .items-table tbody tr {
    border-bottom: 1px solid #000;
  }
  
  .items-table tbody tr:last-child {
    border-bottom: 2px solid #000;
  }
  
  .items-table td {
    padding: 6px 8px;
    font-size: 11px;
    vertical-align: top;
    border-right: 1px solid #ddd;
  }
  
  .items-table td:last-child {
    border-right: none;
  }
  
  .items-table td.center { text-align: center; }
  .items-table td.right { text-align: right; }
  
  .sr-no {
    font-weight: bold;
    color: #666;
  }
  
  .item-name {
    font-weight: bold;
    margin-bottom: 2px;
  }
  
  .item-sku {
    font-size: 9px;
    color: #666;
  }
  
  .amount-value {
    font-weight: bold;
    font-size: 11px;
  }
  
  /* Totals Section */
  .totals-section {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .amount-words {
    flex: 1;
    border: 2px solid #000;
    padding: 10px 12px;
  }
  
  .aw-label {
    font-size: 8px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  
  .aw-text {
    font-size: 11px;
    font-weight: bold;
    font-style: italic;
    line-height: 1.5;
  }
  
  .totals-box {
    width: 240px;
    border: 2px solid #000;
  }
  
  .tot-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;
    font-size: 11px;
    border-bottom: 1px solid #ddd;
  }
  
  .tot-row:last-child {
    border-bottom: none;
  }
  
  .tot-row .label {
    font-weight: normal;
  }
  
  .tot-row .value {
    font-weight: bold;
  }
  
  .tot-final {
    background: #000;
    color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .tot-final .amount {
    font-size: 15px;
  }
  
  /* GST Breakup */
  .gst-section {
    border: 2px solid #000;
    margin-bottom: 12px;
  }
  
  .gst-header {
    background: #000;
    color: #fff;
    padding: 5px 10px;
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .gst-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gst-table th {
    background: #f0f0f0;
    padding: 6px 8px;
    font-size: 9px;
    font-weight: bold;
    text-align: left;
    border-bottom: 1px solid #000;
    border-right: 1px solid #ddd;
  }
  
  .gst-table th:last-child {
    border-right: none;
  }
  
  .gst-table td {
    padding: 6px 8px;
    font-size: 10px;
    border-right: 1px solid #ddd;
  }
  
  .gst-table td:last-child {
    border-right: none;
    font-weight: bold;
  }
  
  /* Notes Section */
  .notes-section {
    border: 2px solid #000;
    padding: 10px 12px;
    margin-bottom: 12px;
    font-size: 10px;
    line-height: 1.6;
  }
  
  .notes-label {
    font-weight: bold;
    margin-bottom: 4px;
    text-decoration: underline;
  }
  
  /* Footer Section */
  .footer-section {
    border: 2px solid #000;
    padding: 10px 12px;
  }
  
  .footer-grid {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  
  .terms-box {
    flex: 1;
    font-size: 9px;
    line-height: 1.6;
  }
  
  .terms-box strong {
    display: block;
    margin-bottom: 4px;
    font-size: 10px;
    text-decoration: underline;
  }
  
  .signature-box {
    width: 200px;
    text-align: center;
  }
  
  .company-stamp {
    border: 2px dashed #000;
    padding: 8px 16px;
    margin-bottom: 30px;
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .sig-line {
    width: 100%;
    border-top: 1px solid #000;
    margin-bottom: 5px;
  }
  
  .sig-label {
    font-size: 9px;
    font-weight: bold;
  }
  
  .customer-signature {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed #000;
  }
  
  .customer-signature .sig-line {
    width: 200px;
  }
  
  /* Thank You Box */
  .thankyou-box {
    border: 2px solid #000;
    padding: 10px;
    margin-top: 12px;
    text-align: center;
  }
  
  .thankyou-box p {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 3px;
  }
  
  .thankyou-box small {
    font-size: 9px;
  }
  
  /* Print Styles */
  @media print {
    body {
      padding: 0;
    }
    .page {
      max-width: 100%;
      padding: 10mm;
    }
    .no-print {
      display: none !important;
    }
  }
  
  @page {
    size: A4;
    margin: 10mm;
  }
</style>
</head>
<body>
<div class="page">
  
  <!-- HEADER -->
  <div class="header">
    <div class="header-top">
      <div class="shop-info">
        <h1>${SHOP_INFO.name}</h1>
        <p>${SHOP_INFO.address}</p>
        <p>Phone: ${SHOP_INFO.phone}</p>
      </div>
      <div class="invoice-box">
        <div class="invoice-label">Tax Invoice</div>
        <div class="invoice-number">${bill.id}</div>
        <div class="invoice-date">Date: ${new Date(bill.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}</div>
      </div>
    </div>
    <div class="gstin-row">
      <span>GSTIN: ${SHOP_INFO.gstin}</span>
      <span>PAN: XXXXX1234X</span>
    </div>
  </div>
  
  <!-- CUSTOMER DETAILS -->
  <div class="customer-section">
    <div class="customer-header">Customer & Invoice Details</div>
    <div class="customer-body">
      <div class="bill-to">
        <div class="section-label">Bill To</div>
        <div class="customer-name">${bill.customer}</div>
        <div class="customer-detail">
          ${bill.phone ? 'Phone: ' + bill.phone + '<br>' : ''}
          ${bill.address || ''}
        </div>
      </div>
      <div class="ship-to">
        <div class="section-label">Invoice Information</div>
        <div class="meta-grid">
          <span class="label">Invoice No:</span><span>${bill.id}</span>
          <span class="label">Date:</span><span>${new Date(bill.date).toLocaleDateString('en-IN')}</span>
          <span class="label">Total Items:</span><span>${items.length}</span>
          <span class="label">Payment:</span><span>${bill.status || 'Pending'}</span>
          <span class="label">GST:</span><span>${bill.includeGST ? '18% Included' : 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th>Item Description</th>
        <th class="center" style="width: 50px;">Unit</th>
        <th class="center" style="width: 60px;">Qty</th>
        <th class="right" style="width: 80px;">Rate (₹)</th>
        <th class="right" style="width: 90px;">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item, index) => `
        <tr>
          <td class="sr-no center">${index + 1}</td>
          <td>
            <div class="item-name">${item.product || item.itemName}</div>
            ${item.skuCode ? `<div class="item-sku">SKU: ${item.skuCode}</div>` : ''}
          </td>
          <td class="center">${item.unit}</td>
          <td class="center"><strong>${item.quantity}</strong></td>
          <td class="right">${parseFloat(item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
          <td class="right amount-value">${(item.amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <!-- TOTALS SECTION -->
  <div class="totals-section">
    <div class="amount-words">
      <div class="aw-label">Amount in Words</div>
      <div class="aw-text">${numberToWords(bill.total || 0)}</div>
    </div>
    <div class="totals-box">
      <div class="tot-row">
        <span class="label">Subtotal:</span>
        <span class="value">₹${(bill.subtotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
      </div>
      ${bill.includeGST ? `
      <div class="tot-row">
        <span class="label">CGST @ 9%:</span>
        <span class="value">₹${((bill.tax || 0) / 2).toFixed(2)}</span>
      </div>
      <div class="tot-row">
        <span class="label">SGST @ 9%:</span>
        <span class="value">₹${((bill.tax || 0) / 2).toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="tot-row">
        <span class="label">Discount:</span>
        <span class="value">₹0.00</span>
      </div>
      <div class="tot-final">
        <span>GRAND TOTAL</span>
        <span class="amount">₹${(bill.total || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
      </div>
    </div>
  </div>
  
  <!-- GST BREAKUP (if applicable) -->
  ${bill.includeGST ? `
  <div class="gst-section">
    <div class="gst-header">GST Tax Breakup</div>
    <table class="gst-table">
      <thead>
        <tr>
          <th>Taxable Amount</th>
          <th>CGST Rate</th>
          <th>CGST Amount</th>
          <th>SGST Rate</th>
          <th>SGST Amount</th>
          <th>Total Tax</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>₹${(bill.subtotal || 0).toFixed(2)}</td>
          <td>9%</td>
          <td>₹${((bill.tax || 0) / 2).toFixed(2)}</td>
          <td>9%</td>
          <td>₹${((bill.tax || 0) / 2).toFixed(2)}</td>
          <td>₹${(bill.tax || 0).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  ` : ''}
  
  <!-- NOTES (if any) -->
  ${bill.notes ? `
  <div class="notes-section">
    <div class="notes-label">Notes / Special Instructions:</div>
    <div>${bill.notes}</div>
  </div>
  ` : ''}
  
  <!-- FOOTER: TERMS & SIGNATURE -->
  <div class="footer-section">
    <div class="footer-grid">
      <div class="terms-box">
        <strong>Terms & Conditions:</strong>
        • Goods once sold will not be taken back or exchanged.<br>
        • Payment is due on receipt of invoice.<br>
        • Interest @ 18% p.a. will be charged on overdue amounts.<br>
        • All disputes subject to Bhopal jurisdiction only.<br>
        • E. & O.E. (Errors and Omissions Excepted)
      </div>
      <div class="signature-box">
        <div class="company-stamp">For ${SHOP_INFO.name}</div>
        <div class="sig-line"></div>
        <div class="sig-label">Authorized Signatory</div>
      </div>
    </div>
    <div class="customer-signature">
      <div style="display:flex; justify-content:space-between; align-items:flex-end;">
        <div style="text-align:left;">
          <div class="sig-line" style="width:180px;"></div>
          <div class="sig-label">Customer Signature</div>
        </div>
        <div style="text-align:right; font-size:9px;">
          Received goods in good condition
        </div>
      </div>
    </div>
  </div>
  
  <!-- THANK YOU -->
  <div class="thankyou-box">
    <p>Thank You for Your Business!</p>
    <small>Please visit again — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</small>
  </div>
  
</div>
</body>
</html>
`;



// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function BillingPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]       = useState('bills');
  const [bills, setBillsState]          = useState([]);
  const [allBillItems, setAllBillItems] = useState([]);
  const [inventory, setInventory]       = useState([]);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [previewBill, setPreviewBill]   = useState(null);

  const [customerName, setCustomerName]       = useState('');
  const [customerPhone, setCustomerPhone]     = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [billDate, setBillDate]   = useState(new Date().toISOString().split('T')[0]);
  const [billItems, setBillItems] = useState([emptyItem()]);
  const [notes, setNotes]         = useState('');
  const [billSaved, setBillSaved] = useState(false);
  const [includeGST, setIncludeGST]     = useState(false);
  const [currentBillNo, setCurrentBillNo] = useState('');

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState(null);

  // ── Fetch all data from APIs ───────────────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [billsRes, billItemsRes, inventoryRes] = await Promise.all([
        fetch('/api/billing-backend/bills'),
        fetch('/api/billing-backend/bill_items'),
        fetch('/api/inventory'),
      ]);

      const billsData     = await billsRes.json();
      const billItemsData = await billItemsRes.json();
      const inventoryData = await inventoryRes.json();

      const loadedBills = billsData.success ? billsData.data : [];
      setBillsState(loadedBills);
      setAllBillItems(billItemsData.success ? billItemsData.data : []);

      // Inventory data format: { materialType, materialName, unit, totalReceivedQty, totalSoldQty, currentStock }
      // Yahan hum skuCode nahi rakhte kyunki inventory sheet mein nahi hai
      // But dropdown mein materialName dikhega
      const invItems = inventoryData.success
        ? inventoryData.data.map((item, idx) => ({
            id: idx + 1,
            materialType: item.materialType || '',
            name: item.materialName || '',
            unit: item.unit || '',
            stock: parseFloat(item.currentStock || 0),
            totalReceived: parseFloat(item.totalReceivedQty || 0),
            totalSold: parseFloat(item.totalSoldQty || 0),
          }))
        : [];
      setInventory(invItems);
      setCurrentBillNo(generateBillNo(loadedBills));
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Data load karne mein error aaya. Refresh karein.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ── Item helpers ───────────────────────────────────────────────────────────
  const addItem = () => setBillItems(p => [...p, emptyItem()]);

  const removeItem = (uid) => {
    if (billItems.length === 1) return;
    setBillItems(p => p.filter(i => i.uid !== uid));
  };

  const updateItem = (uid, field, value) => {
    setBillItems(prev => prev.map(item => {
      if (item.uid !== uid) return item;
      const updated = { ...item, [field]: value };

      // Jab dropdown se inventory item select ho
      if (field === 'inventoryId') {
        const found = inventory.find(p => p.id === Number(value));
        if (found) {
          updated.product      = found.name;
          updated.unit         = found.unit;
          updated.materialType = found.materialType;
          updated.inventoryId  = found.id;
          // Rate blank rahega — user khud bharega
        }
      }

      updated.amount = parseFloat(updated.quantity || 0) * parseFloat(updated.rate || 0);
      return updated;
    }));
  };

  const subtotal = billItems.reduce((s, i) => s + (i.amount || 0), 0);
  const tax      = includeGST ? subtotal * TAX_RATE : 0;
  const total    = subtotal + tax;

  // ── Generate Bill → API call ───────────────────────────────────────────────
  const handleGenerateBill = async () => {
    if (!customerName || subtotal === 0) return;
    setSaving(true);
    setError(null);

    const validItems = billItems.filter(i => i.product && i.quantity);
    const newBill = {
      id: currentBillNo, customer: customerName, phone: customerPhone,
      address: customerAddress, date: billDate, subtotal, tax, total,
      notes, includeGST, status: 'Pending', itemCount: validItems.length,
      createdAt: new Date().toISOString(),
    };
    const newItemRows = validItems.map(item => ({
      uid:          item.uid,
      billNo:       currentBillNo,
      skuCode:      item.skuCode || '',
      itemName:     item.product,
      unit:         item.unit,
      quantity:     parseFloat(item.quantity),
      rate:         parseFloat(item.rate),
      amount:       item.amount,
      materialType: item.materialType || '',
      date:         billDate,
    }));

    try {
      const res = await fetch('/api/billing-backend/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bill: newBill, items: newItemRows }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || 'Bill save fail');
        setSaving(false);
        return;
      }

      // Refresh data from server
      await fetchAllData();
      setPreviewBill({ ...newBill, items: validItems });
      setBillSaved(true);
    } catch (err) {
      console.error('Bill save error:', err);
      setError('Bill save karne mein error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCustomerName(''); setCustomerPhone(''); setCustomerAddress('');
    setBillDate(new Date().toISOString().split('T')[0]);
    setBillItems([emptyItem()]); setNotes(''); setBillSaved(false); setIncludeGST(false);
    setCurrentBillNo(generateBillNo(bills));
  };

  const getItemsForBill = (billNo) => allBillItems.filter(row => row.billNo === billNo);

  // ── Print ──────────────────────────────────────────────────────────────────
  const handlePrint = (bill) => {
    const b     = bill || previewBill;
    const items = b.items || getItemsForBill(b.id);
    if (!b) return;
    const win = window.open('', '_blank');
    win.document.write(getPrintHTML(b, items));
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);
  };

  // ── Download HTML ──────────────────────────────────────────────────────────
  const handleSaveInvoice = (bill) => {
    const b     = bill || previewBill;
    const items = b.items || getItemsForBill(b.id);
    if (!b) return;
    const html = getPrintHTML(b, items);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Invoice-${b.id}-${b.customer.replace(/\s+/g,'-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Filter bills ───────────────────────────────────────────────────────────
  const filteredBills = bills.filter(b => {
    const ms  = b.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const mst = filterStatus === 'All' || b.status === filterStatus;
    return ms && mst;
  });

  // ── Update status via API ──────────────────────────────────────────────────
  const updateBillStatus = async (id, status) => {
    // Optimistic
    setBillsState(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    try {
      const res = await fetch('/api/billing-backend/bills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId: id, status }),
      });
      const result = await res.json();
      if (!result.success) await fetchAllData(); // revert
    } catch {
      await fetchAllData(); // revert
    }
  };

  const lowStockItems = inventory.filter(i => i.stock <= 5);

  const statusColor = (s) => {
    if (s === 'Paid')    return 'bg-green-100 text-green-700';
    if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-gray-500 text-sm">Data load ho raha hai...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="animate-fade-in">
      <style jsx global>{`
        @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Billing & Inventory</h2>
          <p className="text-gray-500 text-sm mt-1">{SHOP_INFO.name}</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={fetchAllData} title="Refresh"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          {[
            { key: 'bills',     label: 'All Bills' },
            { key: 'itemlog',   label: 'Item Log' },
            { key: 'inventory', label: 'Inventory' },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setBillSaved(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.key ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab.label}
              {tab.key === 'inventory' && lowStockItems.length > 0 &&
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">{lowStockItems.length}</span>}
            </button>
          ))}
          <button onClick={() => { setActiveTab('create'); resetForm(); }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> New Bill
          </button>
        </div>
      </div>

      {/* ═══ ALL BILLS ═══ */}
      {activeTab === 'bills' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Bills',   value: bills.length,                                                         color: 'text-gray-800',   bg: 'bg-white' },
              { label: 'Paid',          value: bills.filter(b=>b.status==='Paid').length,                             color: 'text-green-600',  bg: 'bg-green-50' },
              { label: 'Pending',       value: bills.filter(b=>b.status==='Pending').length,                          color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Total Revenue', value: `₹${bills.reduce((s,b)=>s+(b.total||0),0).toLocaleString('en-IN')}`, color: 'text-amber-700',  bg: 'bg-amber-50' },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-xl p-4 border border-gray-100 shadow-sm`}>
                <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                  placeholder="Customer ya Bill No se search..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
              </div>
              <div className="flex gap-2">
                {['All','Paid','Pending','Draft'].map(s => (
                  <button key={s} onClick={()=>setFilterStatus(s)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
                      ${filterStatus===s ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bill No</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Items</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBills.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400 text-sm">Koi bill nahi mila</td></tr>
                  )}
                  {filteredBills.map((bill, i) => (
                    <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-5 py-3 text-sm font-mono font-medium text-amber-600">{bill.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-700 font-medium">{bill.customer}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(bill.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {getItemsForBill(bill.id).length} items
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-gray-800 text-right">
                        ₹{(bill.total||0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <select value={bill.status} onChange={e=>updateBillStatus(bill.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer outline-none ${statusColor(bill.status)}`}>
                          <option>Pending</option><option>Paid</option><option>Draft</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={()=>setPreviewBill({...bill, items: getItemsForBill(bill.id)})}
                            className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors" title="View">
                            <Eye className="w-4 h-4"/>
                          </button>
                          <button onClick={()=>handlePrint({...bill, items: getItemsForBill(bill.id)})}
                            className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Print">
                            <Printer className="w-4 h-4"/>
                          </button>
                          <button onClick={()=>handleSaveInvoice({...bill, items: getItemsForBill(bill.id)})}
                            className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Download">
                            <Download className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ITEM LOG ═══ */}
      {activeTab === 'itemlog' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Item Log</strong> — Har item ki row. Bill No se pata chalega ki ek order mein kya tha.
            Total rows: <strong>{allBillItems.length}</strong>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-amber-600 uppercase">Bill No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allBillItems.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Koi item log nahi — pehle bill banao</td></tr>
                  )}
                  {[...allBillItems].reverse().map((row, i) => (
                    <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-amber-700">{row.billNo}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs font-mono">{row.skuCode || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-800 font-medium">{row.itemName}</td>
                      <td className="px-4 py-2.5 text-gray-600">{row.quantity}</td>
                      <td className="px-4 py-2.5 text-gray-500">{row.unit}</td>
                      <td className="px-4 py-2.5 text-gray-700 text-right">₹{parseFloat(row.rate).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 font-semibold text-gray-800 text-right">
                        ₹{(row.amount||0).toLocaleString('en-IN',{minimumFractionDigits:2})}
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">
                        {row.date ? new Date(row.date).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ INVENTORY ═══ */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0"/>
              <p className="text-sm text-red-700">
                <strong>{lowStockItems.length} items</strong> ka stock kam hai:&nbsp;
                {lowStockItems.map(i=>i.name).join(', ')}
              </p>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-amber-800 uppercase">Item Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-amber-800 uppercase">Category</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-amber-800 uppercase">Unit</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-amber-800 uppercase">Received</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-amber-800 uppercase">Sold</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-amber-800 uppercase">Current Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Inventory khali hai</td></tr>
                  )}
                  {inventory.map((item, i) => (
                    <tr key={i} className={`hover:bg-amber-50/30 transition-colors ${item.stock <= 5 ? 'bg-red-50/40' : ''}`}>
                      <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
                      <td className="px-5 py-3 text-gray-500">{item.materialType}</td>
                      <td className="px-5 py-3 text-gray-500">{item.unit}</td>
                      <td className="px-5 py-3 text-center text-blue-600 font-semibold">{item.totalReceived}</td>
                      <td className="px-5 py-3 text-center text-orange-600 font-semibold">{item.totalSold}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-bold text-base ${item.stock <= 5 ? 'text-red-600' : item.stock <= 15 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {item.stock}
                        </span>
                        {item.stock <= 5  && <span className="ml-2 text-xs text-red-500 font-medium">Low</span>}
                        {item.stock > 5 && item.stock <= 15 && <span className="ml-2 text-xs text-yellow-600">Medium</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CREATE BILL ═══ */}
      {activeTab === 'create' && !billSaved && (
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">New Bill</h3>
              <p className="text-gray-500 text-sm mt-1">Items add karo, Google Sheet mein save hoga + inventory update hoga</p>
            </div>
            <span className="text-sm font-mono text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              {currentBillNo}
            </span>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center text-xs font-bold text-amber-700">1</span>
              Customer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Customer Name *</label>
                <input value={customerName} onChange={e=>setCustomerName(e.target.value)}
                  placeholder="Customer ka naam"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone</label>
                <input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Address</label>
                <textarea value={customerAddress} onChange={e=>setCustomerAddress(e.target.value)}
                  placeholder="Customer address..." rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Bill Date</label>
                <input type="date" value={billDate} onChange={e=>setBillDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="gst" checked={includeGST} onChange={e=>setIncludeGST(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"/>
                <label htmlFor="gst" className="text-sm font-medium text-gray-700 cursor-pointer">
                  GST (18%) include karein
                </label>
              </div>
            </div>
          </div>

          {/* Items Table — Inventory Dropdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center text-xs font-bold text-amber-700">2</span>
              Items / Saman
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700">#</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700">Product (Inventory se)</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700 w-16">Unit</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700 w-20">Qty</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700 w-24">Rate (₹)</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-amber-700 w-24">Amount</th>
                    <th className="px-3 py-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {billItems.map((item, idx) => (
                    <tr key={item.uid}>
                      <td className="px-3 py-2 text-xs text-gray-400 font-medium">{idx + 1}</td>
                      <td className="px-3 py-2 min-w-[200px]">
                        <select value={item.inventoryId || ''} onChange={e=>updateItem(item.uid,'inventoryId',e.target.value)}
                          className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                          <option value="">-- Item chunein --</option>
                          {inventory.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {p.materialType} (Stock: {p.stock} {p.unit})
                            </option>
                          ))}
                        </select>
                        {item.product && (
                          <p className="text-xs text-gray-400 mt-1 pl-1">{item.materialType}</p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input value={item.unit} readOnly
                          className="w-full px-2 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500"/>
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" value={item.quantity}
                          onChange={e=>updateItem(item.uid,'quantity',e.target.value)}
                          placeholder="0"
                          className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"/>
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" value={item.rate}
                          onChange={e=>updateItem(item.uid,'rate',e.target.value)}
                          placeholder="₹"
                          className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"/>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{(item.amount||0).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={()=>removeItem(item.uid)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addItem}
              className="mt-4 flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium">
              <Plus className="w-4 h-4"/> Item Add Karo
            </button>
            <div className="mt-5 border-t border-gray-100 pt-4 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {includeGST && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (18%)</span><span className="font-medium">₹{tax.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-200 pt-2">
                  <span>Total</span><span className="text-amber-700">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes + Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="text-sm font-medium text-gray-700 block mb-2">Notes / Terms</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)}
              placeholder="Koi additional note..." rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"/>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={()=>setActiveTab('bills')}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleGenerateBill}
              disabled={!customerName || subtotal === 0 || saving}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin"/> Sheet mein save ho raha hai...</>
              ) : (
                <><CheckCircle className="w-4 h-4"/> Bill Generate Karo</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ═══ BILL SAVED + PREVIEW ═══ */}
      {activeTab === 'create' && billSaved && previewBill && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600"/>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Bill Save Ho Gaya!</h3>
                <p className="text-gray-500 text-sm">
                  {previewBill.id} — {previewBill.items?.length} items — ₹{(previewBill.total||0).toLocaleString('en-IN')}
                </p>
                <p className="text-green-600 text-xs font-medium mt-0.5">
                  Google Sheet mein save + Inventory update done
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button onClick={resetForm}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">
                New Bill
              </button>
              <button onClick={()=>handleSaveInvoice(previewBill)}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all">
                <Download className="w-4 h-4"/> Save Invoice
              </button>
              <button onClick={()=>handlePrint(previewBill)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg">
                <Printer className="w-4 h-4"/> Print / PDF
              </button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-amber-100">
              <div>
                <h1 className="text-xl font-bold text-gray-800">{SHOP_INFO.name}</h1>
                <p className="text-xs text-gray-500 mt-1">{SHOP_INFO.address}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Invoice</p>
                <p className="text-lg font-bold font-mono text-amber-700">{previewBill.id}</p>
                <p className="text-xs text-gray-500">{new Date(previewBill.date).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="mb-4 text-sm">
              <p className="font-bold text-gray-800">{previewBill.customer}</p>
              {previewBill.phone   && <p className="text-gray-500">{previewBill.phone}</p>}
              {previewBill.address && <p className="text-gray-500">{previewBill.address}</p>}
            </div>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="bg-amber-600 text-white">
                  <th className="px-3 py-2 text-left text-xs rounded-l-lg">#</th>
                  <th className="px-3 py-2 text-left text-xs">Item</th>
                  <th className="px-3 py-2 text-center text-xs">Qty</th>
                  <th className="px-3 py-2 text-right text-xs">Rate</th>
                  <th className="px-3 py-2 text-right text-xs rounded-r-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {previewBill.items?.map((item, i) => (
                  <tr key={i} className={i%2===0?'bg-gray-50':'bg-white'}>
                    <td className="px-3 py-2 text-xs text-gray-400">{i+1}</td>
                    <td className="px-3 py-2 text-gray-800">{item.product}</td>
                    <td className="px-3 py-2 text-center text-gray-600">{item.quantity} {item.unit}</td>
                    <td className="px-3 py-2 text-right text-gray-600">₹{parseFloat(item.rate).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-800">₹{(item.amount||0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-56 space-y-1.5 bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>₹{(previewBill.subtotal||0).toLocaleString('en-IN')}</span>
                </div>
                {previewBill.includeGST && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (18%)</span><span>₹{(previewBill.tax||0).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-1.5">
                  <span>Total</span><span className="text-amber-700">₹{(previewBill.total||0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PREVIEW MODAL ═══ */}
      {previewBill && activeTab !== 'create' && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-2">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-amber-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-amber-900">{previewBill.id}</h2>
              <div className="flex gap-2">
                <button onClick={()=>handleSaveInvoice(previewBill)}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  <Download className="w-4 h-4"/> Save
                </button>
                <button onClick={()=>handlePrint(previewBill)}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  <Printer className="w-4 h-4"/> Print
                </button>
                <button onClick={()=>setPreviewBill(null)}
                  className="p-2 hover:bg-amber-100 rounded-full text-gray-600 text-lg leading-none">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-sm">
                <p className="font-bold text-gray-800 text-base">{previewBill.customer}</p>
                {previewBill.phone   && <p className="text-gray-500">{previewBill.phone}</p>}
                {previewBill.address && <p className="text-gray-500">{previewBill.address}</p>}
                <p className="text-gray-400 text-xs mt-1">{new Date(previewBill.date).toLocaleDateString('en-IN')}</p>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="bg-amber-50">
                  <th className="px-3 py-2 text-left text-xs text-amber-700">#</th>
                  <th className="px-3 py-2 text-left text-xs text-amber-700">Item</th>
                  <th className="px-3 py-2 text-center text-xs text-amber-700">Qty</th>
                  <th className="px-3 py-2 text-right text-xs text-amber-700">Amount</th>
                </tr></thead>
                <tbody>
                  {(previewBill.items||[]).map((it, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-xs text-gray-400">{i+1}</td>
                      <td className="px-3 py-2.5 text-gray-800 font-medium">{it.itemName || it.product}</td>
                      <td className="px-3 py-2.5 text-center text-gray-600">{it.quantity} {it.unit}</td>
                      <td className="px-3 py-2.5 text-right font-semibold">₹{(it.amount||0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <span className="text-base font-bold text-amber-700">
                  Total: ₹{(previewBill.total||0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}