
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Plus, Trash2, Printer, Search, CheckCircle, Eye, AlertTriangle, Download, Loader2, RefreshCw } from 'lucide-react';

// const SHOP_INFO = {
//   name: 'Krishna Timber & Plywoods',
//   address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
//   phone: '0755-4275577',
//   gstin: '23XXXXX1234X1ZX',
// };

// const TAX_RATE = 0.18;

// function generateUID() {
//   return 'ITEM-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
// }

// function generateBillNo(existingBills) {
//   const year = new Date().getFullYear();
//   const count = (existingBills || []).filter(b => b.id.startsWith(`KT-${year}`)).length + 1;
//   return `KT-${year}-${String(count).padStart(3, '0')}`;
// }

// const emptyItem = () => ({
//   uid: generateUID(),
//   skuCode: '',
//   product: '',
//   unit: '',
//   quantity: '',
//   rate: '',
//   amount: 0,
//   materialType: '',
// });

// // ─── Number to Words (Indian) ────────────────────────────────────────────────
// function numberToWords(num) {
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
//     'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
//   if (num === 0) return 'Zero';
//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
//     if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + convert(n%100) : '');
//     if (n < 100000) return convert(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + convert(n%1000) : '');
//     if (n < 10000000) return convert(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + convert(n%100000) : '');
//     return convert(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + convert(n%10000000) : '');
//   }
//   const intPart = Math.floor(num);
//   const decPart = Math.round((num - intPart) * 100);
//   let result = convert(intPart) + ' Rupees';
//   if (decPart > 0) result += ' and ' + convert(decPart) + ' Paise';
//   result += ' Only';
//   return result;
// }

// // ─── Professional Print HTML ─────────────────────────────────────────────────
// // const getPrintHTML = (bill, items) => `
// // <!DOCTYPE html>
// // <html lang="en">
// // <head>
// // <meta charset="UTF-8"/>
// // <title>Invoice ${bill.id} — ${SHOP_INFO.name}</title>
// // <style>
// //   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
// //   *{box-sizing:border-box;margin:0;padding:0}
// //   body{font-family:'Inter',sans-serif;background:#fff;color:#1a1a2e;font-size:13px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// //   .page{max-width:794px;margin:0 auto;padding:0}
// //   .header-band{background:linear-gradient(135deg,#7c3f00 0%,#b35900 50%,#d4700a 100%);padding:32px 40px 28px;position:relative;overflow:hidden}
// //   .header-band::before{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.06)}
// //   .header-inner{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1}
// //   .shop-name{font-family:'Playfair Display',serif;font-size:26px;color:#fff;letter-spacing:-0.5px;line-height:1.1}
// //   .shop-tagline{font-size:10px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-top:4px}
// //   .shop-contact{margin-top:12px;font-size:11px;color:rgba(255,255,255,0.85);line-height:1.7}
// //   .invoice-badge{text-align:right}
// //   .invoice-label{font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:3px}
// //   .invoice-num{font-family:'Playfair Display',serif;font-size:28px;color:#ffd580;margin-top:2px}
// //   .invoice-date{font-size:11px;color:rgba(255,255,255,0.75);margin-top:6px}
// //   .gstin-badge{display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:3px 10px;font-size:10px;color:rgba(255,255,255,0.8);margin-top:5px;letter-spacing:0.5px}
// //   .body{padding:0 40px 32px}
// //   .meta-row{display:flex;gap:0;margin-top:28px;margin-bottom:24px;border:1.5px solid #e8d5b0;border-radius:10px;overflow:hidden}
// //   .bill-to{flex:1;padding:16px 20px;background:#fffdf7}
// //   .ship-meta{width:200px;padding:16px 20px;background:#fdf6ec;border-left:1.5px solid #e8d5b0}
// //   .meta-label{font-size:9px;font-weight:700;color:#b35900;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
// //   .cust-name{font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:3px}
// //   .cust-detail{font-size:11px;color:#666;line-height:1.6}
// //   .meta-row-item{display:flex;justify-content:space-between;font-size:11px;margin-bottom:5px}
// //   .meta-row-item span:first-child{color:#888}
// //   .meta-row-item span:last-child{font-weight:600;color:#333}
// //   .table-wrap{margin-bottom:24px}
// //   table{width:100%;border-collapse:collapse}
// //   thead tr{background:linear-gradient(135deg,#7c3f00,#b35900)}
// //   th{padding:11px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#fff;text-align:left}
// //   th:last-child,th.right{text-align:right}
// //   tbody tr{border-bottom:1px solid #f0e6d3}
// //   tbody tr:nth-child(even){background:#fffdf9}
// //   tbody tr:last-child{border-bottom:2px solid #d4700a}
// //   td{padding:10px 14px;font-size:12px;color:#2d2d2d;vertical-align:top}
// //   td.right{text-align:right}
// //   td.center{text-align:center}
// //   .item-name{font-weight:600;color:#1a1a2e}
// //   .item-sku{font-size:10px;color:#999;margin-top:1px}
// //   .sr{color:#aaa;font-size:11px}
// //   .bottom-section{display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;gap:20px}
// //   .amount-words-box{flex:1;background:#fffdf7;border:1.5px solid #e8d5b0;border-radius:8px;padding:12px 16px}
// //   .aw-label{font-size:9px;font-weight:700;color:#b35900;text-transform:uppercase;letter-spacing:2px;margin-bottom:5px}
// //   .aw-text{font-size:11px;color:#444;font-weight:600;font-style:italic;line-height:1.5}
// //   .totals-box{width:240px}
// //   .tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#555;border-bottom:1px solid #f0e6d3}
// //   .tot-row:last-child{border-bottom:none}
// //   .tot-final{display:flex;justify-content:space-between;padding:11px 16px;background:linear-gradient(135deg,#7c3f00,#b35900);border-radius:8px;margin-top:8px}
// //   .tot-final span:first-child{font-size:12px;font-weight:700;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:1px}
// //   .tot-final span:last-child{font-size:17px;font-weight:800;color:#fff}
// //   .gst-section{margin-top:20px;border:1.5px solid #e8d5b0;border-radius:8px;overflow:hidden}
// //   .gst-header{background:#f9f0e3;padding:8px 14px;font-size:9px;font-weight:700;color:#b35900;text-transform:uppercase;letter-spacing:2px}
// //   .gst-table{width:100%;border-collapse:collapse}
// //   .gst-table th{background:#f3e8d5;padding:7px 14px;font-size:10px;color:#8b4513;font-weight:600;text-align:left}
// //   .gst-table td{padding:7px 14px;font-size:11px;color:#444;border-top:1px solid #f0e6d3}
// //   .divider{height:2px;background:linear-gradient(90deg,#d4700a,#ffd580,#d4700a);margin:24px 0;border-radius:2px}
// //   .footer-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px}
// //   .footer-note{font-size:10px;color:#999;max-width:340px;line-height:1.6}
// //   .sig-section{text-align:right}
// //   .sig-line{width:180px;border-top:1.5px solid #ccc;margin-bottom:6px;margin-left:auto}
// //   .sig-label{font-size:10px;color:#888}
// //   .stamp-area{display:inline-block;border:2px dashed #d4700a;border-radius:8px;padding:6px 20px;font-size:10px;color:#d4700a;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:8px}
// //   .thankyou{text-align:center;margin-top:20px;padding:12px;background:linear-gradient(135deg,#fffdf7,#fdf0dc);border-radius:8px;border:1px solid #e8d5b0}
// //   .thankyou p{font-size:12px;color:#7c3f00;font-weight:600}
// //   .thankyou small{font-size:10px;color:#aaa;display:block;margin-top:2px}
// //   @media print{body{padding:0}.page{max-width:100%}}
// // </style>
// // </head>
// // <body>
// // <div class="page">
// //   <div class="header-band">
// //     <div class="header-inner">
// //       <div>
// //         <div class="shop-name">${SHOP_INFO.name}</div>
// //         <div class="shop-tagline">Quality Wood & Plywoods since est.</div>
// //         <div class="shop-contact">${SHOP_INFO.address}<br>${SHOP_INFO.phone}</div>
// //         <div class="gstin-badge">GSTIN: ${SHOP_INFO.gstin}</div>
// //       </div>
// //       <div class="invoice-badge">
// //         <div class="invoice-label">Tax Invoice</div>
// //         <div class="invoice-num">${bill.id}</div>
// //         <div class="invoice-date">Date: ${new Date(bill.date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div>
// //       </div>
// //     </div>
// //   </div>
// //   <div class="body">
// //     <div class="meta-row">
// //       <div class="bill-to">
// //         <div class="meta-label">Bill To</div>
// //         <div class="cust-name">${bill.customer}</div>
// //         <div class="cust-detail">${bill.phone ? bill.phone + '<br>' : ''}${bill.address || ''}</div>
// //       </div>
// //       <div class="ship-meta">
// //         <div class="meta-label">Invoice Details</div>
// //         <div class="meta-row-item"><span>Invoice No</span><span>${bill.id}</span></div>
// //         <div class="meta-row-item"><span>Date</span><span>${new Date(bill.date).toLocaleDateString('en-IN')}</span></div>
// //         <div class="meta-row-item"><span>Items</span><span>${items.length}</span></div>
// //         <div class="meta-row-item"><span>GST</span><span>${bill.includeGST ? '18% Incl.' : 'N/A'}</span></div>
// //         <div class="meta-row-item"><span>Status</span><span style="color:#d4700a;font-weight:700">${bill.status || 'Pending'}</span></div>
// //       </div>
// //     </div>
// //     <div class="table-wrap">
// //       <table>
// //         <thead><tr>
// //           <th style="width:40px">#</th><th>Item Description</th>
// //           <th style="width:55px;text-align:center">Unit</th><th style="width:65px;text-align:center">Qty</th>
// //           <th style="width:90px;text-align:right">Rate</th><th style="width:100px;text-align:right">Amount</th>
// //         </tr></thead>
// //         <tbody>
// //           ${items.map((it, i) => `<tr>
// //             <td class="sr">${i+1}</td>
// //             <td>
// //               <div class="item-name">${it.product || it.itemName}</div>
// //               ${it.skuCode ? `<div class="item-sku">SKU: ${it.skuCode}</div>` : ''}
// //             </td>
// //             <td class="center" style="color:#666">${it.unit}</td>
// //             <td class="center" style="font-weight:600">${it.quantity}</td>
// //             <td class="right" style="color:#555">${parseFloat(it.rate).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
// //             <td class="right" style="font-weight:700;color:#1a1a2e">${(it.amount||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
// //           </tr>`).join('')}
// //         </tbody>
// //       </table>
// //     </div>
// //     <div class="bottom-section">
// //       <div class="amount-words-box">
// //         <div class="aw-label">Amount in Words</div>
// //         <div class="aw-text">${numberToWords(bill.total || 0)}</div>
// //       </div>
// //       <div class="totals-box">
// //         <div class="tot-row"><span>Subtotal</span><span>₹${(bill.subtotal||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
// //         ${bill.includeGST ? `
// //         <div class="tot-row"><span>CGST (9%)</span><span>₹${((bill.tax||0)/2).toFixed(2)}</span></div>
// //         <div class="tot-row"><span>SGST (9%)</span><span>₹${((bill.tax||0)/2).toFixed(2)}</span></div>` : ''}
// //         <div class="tot-row"><span>Discount</span><span>₹0.00</span></div>
// //         <div class="tot-final">
// //           <span>Total</span>
// //           <span>₹${(bill.total||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span>
// //         </div>
// //       </div>
// //     </div>
// //     ${bill.includeGST ? `
// //     <div class="gst-section" style="margin-top:20px">
// //       <div class="gst-header">GST Tax Breakup</div>
// //       <table class="gst-table">
// //         <thead><tr><th>Taxable Amount</th><th>CGST Rate</th><th>CGST Amt</th><th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th></tr></thead>
// //         <tbody><tr>
// //           <td>₹${(bill.subtotal||0).toFixed(2)}</td><td>9%</td><td>₹${((bill.tax||0)/2).toFixed(2)}</td>
// //           <td>9%</td><td>₹${((bill.tax||0)/2).toFixed(2)}</td><td style="font-weight:700;color:#b35900">₹${(bill.tax||0).toFixed(2)}</td>
// //         </tr></tbody>
// //       </table>
// //     </div>` : ''}
// //     ${bill.notes ? `<div style="margin-top:18px;background:#fffdf7;border:1.5px solid #e8d5b0;border-radius:8px;padding:12px 16px;font-size:11px;color:#555"><strong style="color:#b35900">Notes / Terms:</strong> ${bill.notes}</div>` : ''}
// //     <div class="divider"></div>
// //     <div class="footer-row">
// //       <div class="footer-note">Goods once sold will not be taken back.<br>Payment due on receipt of invoice.<br>Subject to Bhopal jurisdiction only.</div>
// //       <div class="sig-section">
// //         <div class="stamp-area">For ${SHOP_INFO.name}</div>
// //         <div class="sig-line" style="margin-top:30px"></div>
// //         <div class="sig-label">Authorized Signatory</div>
// //       </div>
// //     </div>
// //     <div class="footer-row" style="margin-top:12px">
// //       <div><div class="sig-line" style="margin-left:0;margin-bottom:6px"></div><div class="sig-label">Customer Signature</div></div>
// //     </div>
// //     <div class="thankyou">
// //       <p>Thank you for your business!</p>
// //       <small>Please visit again — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</small>
// //     </div>
// //   </div>
// // </div>
// // </body>
// // </html>`;


// //////

// // ─── Professional Print HTML (B&W Optimized Challan) ─────────────────────────
// const getPrintHTML = (bill, items) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <title>Invoice ${bill.id} — ${SHOP_INFO.name}</title>
// <style>
//   * { box-sizing: border-box; margin: 0; padding: 0; }
  
//   body {
//     font-family: 'Arial', 'Helvetica', sans-serif;
//     background: #fff;
//     color: #000;
//     font-size: 12px;
//     line-height: 1.4;
//     -webkit-print-color-adjust: exact;
//     print-color-adjust: exact;
//   }
  
//   .page {
//     max-width: 210mm; /* A4 width */
//     margin: 0 auto;
//     padding: 15mm;
//     background: #fff;
//   }
  
//   /* Header Section */
//   .header {
//     border: 2px solid #000;
//     padding: 12px 16px;
//     margin-bottom: 12px;
//   }
  
//   .header-top {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     padding-bottom: 10px;
//     border-bottom: 1px solid #000;
//     margin-bottom: 8px;
//   }
  
//   .shop-info h1 {
//     font-size: 20px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     margin-bottom: 4px;
//   }
  
//   .shop-info p {
//     font-size: 10px;
//     line-height: 1.5;
//     margin-bottom: 2px;
//   }
  
//   .invoice-box {
//     text-align: right;
//     border: 2px solid #000;
//     padding: 8px 12px;
//     min-width: 180px;
//   }
  
//   .invoice-label {
//     font-size: 9px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     margin-bottom: 2px;
//   }
  
//   .invoice-number {
//     font-size: 16px;
//     font-weight: bold;
//     font-family: 'Courier New', monospace;
//     margin: 4px 0;
//   }
  
//   .invoice-date {
//     font-size: 9px;
//     margin-top: 3px;
//   }
  
//   .gstin-row {
//     display: flex;
//     justify-content: space-between;
//     font-size: 9px;
//     font-weight: bold;
//   }
  
//   /* Customer Details */
//   .customer-section {
//     border: 2px solid #000;
//     margin-bottom: 12px;
//   }
  
//   .customer-header {
//     background: #000;
//     color: #fff;
//     padding: 5px 10px;
//     font-size: 10px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }
  
//   .customer-body {
//     display: flex;
//     border-top: 1px solid #000;
//   }
  
//   .bill-to, .ship-to {
//     flex: 1;
//     padding: 10px 12px;
//   }
  
//   .bill-to {
//     border-right: 1px solid #000;
//   }
  
//   .section-label {
//     font-size: 8px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     margin-bottom: 5px;
//     text-decoration: underline;
//   }
  
//   .customer-name {
//     font-size: 13px;
//     font-weight: bold;
//     margin-bottom: 3px;
//   }
  
//   .customer-detail {
//     font-size: 10px;
//     line-height: 1.5;
//   }
  
//   .meta-grid {
//     display: grid;
//     grid-template-columns: auto 1fr;
//     gap: 4px 8px;
//     font-size: 9px;
//   }
  
//   .meta-grid .label {
//     font-weight: bold;
//   }
  
//   /* Items Table */
//   .items-table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-bottom: 12px;
//     border: 2px solid #000;
//   }
  
//   .items-table thead {
//     background: #000;
//     color: #fff;
//   }
  
//   .items-table th {
//     padding: 7px 8px;
//     font-size: 9px;
//     font-weight: bold;
//     text-transform: uppercase;
//     text-align: left;
//     border-right: 1px solid #fff;
//   }
  
//   .items-table th:last-child {
//     border-right: none;
//   }
  
//   .items-table th.center { text-align: center; }
//   .items-table th.right { text-align: right; }
  
//   .items-table tbody tr {
//     border-bottom: 1px solid #000;
//   }
  
//   .items-table tbody tr:last-child {
//     border-bottom: 2px solid #000;
//   }
  
//   .items-table td {
//     padding: 6px 8px;
//     font-size: 11px;
//     vertical-align: top;
//     border-right: 1px solid #ddd;
//   }
  
//   .items-table td:last-child {
//     border-right: none;
//   }
  
//   .items-table td.center { text-align: center; }
//   .items-table td.right { text-align: right; }
  
//   .sr-no {
//     font-weight: bold;
//     color: #666;
//   }
  
//   .item-name {
//     font-weight: bold;
//     margin-bottom: 2px;
//   }
  
//   .item-sku {
//     font-size: 9px;
//     color: #666;
//   }
  
//   .amount-value {
//     font-weight: bold;
//     font-size: 11px;
//   }
  
//   /* Totals Section */
//   .totals-section {
//     display: flex;
//     gap: 12px;
//     margin-bottom: 12px;
//   }
  
//   .amount-words {
//     flex: 1;
//     border: 2px solid #000;
//     padding: 10px 12px;
//   }
  
//   .aw-label {
//     font-size: 8px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     margin-bottom: 5px;
//   }
  
//   .aw-text {
//     font-size: 11px;
//     font-weight: bold;
//     font-style: italic;
//     line-height: 1.5;
//   }
  
//   .totals-box {
//     width: 240px;
//     border: 2px solid #000;
//   }
  
//   .tot-row {
//     display: flex;
//     justify-content: space-between;
//     padding: 6px 12px;
//     font-size: 11px;
//     border-bottom: 1px solid #ddd;
//   }
  
//   .tot-row:last-child {
//     border-bottom: none;
//   }
  
//   .tot-row .label {
//     font-weight: normal;
//   }
  
//   .tot-row .value {
//     font-weight: bold;
//   }
  
//   .tot-final {
//     background: #000;
//     color: #fff;
//     display: flex;
//     justify-content: space-between;
//     padding: 8px 12px;
//     font-size: 12px;
//     font-weight: bold;
//   }
  
//   .tot-final .amount {
//     font-size: 15px;
//   }
  
//   /* GST Breakup */
//   .gst-section {
//     border: 2px solid #000;
//     margin-bottom: 12px;
//   }
  
//   .gst-header {
//     background: #000;
//     color: #fff;
//     padding: 5px 10px;
//     font-size: 9px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }
  
//   .gst-table {
//     width: 100%;
//     border-collapse: collapse;
//   }
  
//   .gst-table th {
//     background: #f0f0f0;
//     padding: 6px 8px;
//     font-size: 9px;
//     font-weight: bold;
//     text-align: left;
//     border-bottom: 1px solid #000;
//     border-right: 1px solid #ddd;
//   }
  
//   .gst-table th:last-child {
//     border-right: none;
//   }
  
//   .gst-table td {
//     padding: 6px 8px;
//     font-size: 10px;
//     border-right: 1px solid #ddd;
//   }
  
//   .gst-table td:last-child {
//     border-right: none;
//     font-weight: bold;
//   }
  
//   /* Notes Section */
//   .notes-section {
//     border: 2px solid #000;
//     padding: 10px 12px;
//     margin-bottom: 12px;
//     font-size: 10px;
//     line-height: 1.6;
//   }
  
//   .notes-label {
//     font-weight: bold;
//     margin-bottom: 4px;
//     text-decoration: underline;
//   }
  
//   /* Footer Section */
//   .footer-section {
//     border: 2px solid #000;
//     padding: 10px 12px;
//   }
  
//   .footer-grid {
//     display: flex;
//     justify-content: space-between;
//     gap: 20px;
//   }
  
//   .terms-box {
//     flex: 1;
//     font-size: 9px;
//     line-height: 1.6;
//   }
  
//   .terms-box strong {
//     display: block;
//     margin-bottom: 4px;
//     font-size: 10px;
//     text-decoration: underline;
//   }
  
//   .signature-box {
//     width: 200px;
//     text-align: center;
//   }
  
//   .company-stamp {
//     border: 2px dashed #000;
//     padding: 8px 16px;
//     margin-bottom: 30px;
//     font-size: 9px;
//     font-weight: bold;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }
  
//   .sig-line {
//     width: 100%;
//     border-top: 1px solid #000;
//     margin-bottom: 5px;
//   }
  
//   .sig-label {
//     font-size: 9px;
//     font-weight: bold;
//   }
  
//   .customer-signature {
//     margin-top: 12px;
//     padding-top: 12px;
//     border-top: 1px dashed #000;
//   }
  
//   .customer-signature .sig-line {
//     width: 200px;
//   }
  
//   /* Thank You Box */
//   .thankyou-box {
//     border: 2px solid #000;
//     padding: 10px;
//     margin-top: 12px;
//     text-align: center;
//   }
  
//   .thankyou-box p {
//     font-size: 12px;
//     font-weight: bold;
//     margin-bottom: 3px;
//   }
  
//   .thankyou-box small {
//     font-size: 9px;
//   }
  
//   /* Print Styles */
//   @media print {
//     body {
//       padding: 0;
//     }
//     .page {
//       max-width: 100%;
//       padding: 10mm;
//     }
//     .no-print {
//       display: none !important;
//     }
//   }
  
//   @page {
//     size: A4;
//     margin: 10mm;
//   }
// </style>
// </head>
// <body>
// <div class="page">
  
//   <!-- HEADER -->
//   <div class="header">
//     <div class="header-top">
//       <div class="shop-info">
//         <h1>${SHOP_INFO.name}</h1>
//         <p>${SHOP_INFO.address}</p>
//         <p>Phone: ${SHOP_INFO.phone}</p>
//       </div>
//       <div class="invoice-box">
//         <div class="invoice-label">Tax Invoice</div>
//         <div class="invoice-number">${bill.id}</div>
//         <div class="invoice-date">Date: ${new Date(bill.date).toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: 'short',
//           year: 'numeric'
//         })}</div>
//       </div>
//     </div>
//     <div class="gstin-row">
//       <span>GSTIN: ${SHOP_INFO.gstin}</span>
//       <span>PAN: XXXXX1234X</span>
//     </div>
//   </div>
  
//   <!-- CUSTOMER DETAILS -->
//   <div class="customer-section">
//     <div class="customer-header">Customer & Invoice Details</div>
//     <div class="customer-body">
//       <div class="bill-to">
//         <div class="section-label">Bill To</div>
//         <div class="customer-name">${bill.customer}</div>
//         <div class="customer-detail">
//           ${bill.phone ? 'Phone: ' + bill.phone + '<br>' : ''}
//           ${bill.address || ''}
//         </div>
//       </div>
//       <div class="ship-to">
//         <div class="section-label">Invoice Information</div>
//         <div class="meta-grid">
//           <span class="label">Invoice No:</span><span>${bill.id}</span>
//           <span class="label">Date:</span><span>${new Date(bill.date).toLocaleDateString('en-IN')}</span>
//           <span class="label">Total Items:</span><span>${items.length}</span>
//           <span class="label">Payment:</span><span>${bill.status || 'Pending'}</span>
//           <span class="label">GST:</span><span>${bill.includeGST ? '18% Included' : 'N/A'}</span>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <!-- ITEMS TABLE -->
//   <table class="items-table">
//     <thead>
//       <tr>
//         <th style="width: 30px;">#</th>
//         <th>Item Description</th>
//         <th class="center" style="width: 50px;">Unit</th>
//         <th class="center" style="width: 60px;">Qty</th>
//         <th class="right" style="width: 80px;">Rate (₹)</th>
//         <th class="right" style="width: 90px;">Amount (₹)</th>
//       </tr>
//     </thead>
//     <tbody>
//       ${items.map((item, index) => `
//         <tr>
//           <td class="sr-no center">${index + 1}</td>
//           <td>
//             <div class="item-name">${item.product || item.itemName}</div>
//             ${item.skuCode ? `<div class="item-sku">SKU: ${item.skuCode}</div>` : ''}
//           </td>
//           <td class="center">${item.unit}</td>
//           <td class="center"><strong>${item.quantity}</strong></td>
//           <td class="right">${parseFloat(item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
//           <td class="right amount-value">${(item.amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
//         </tr>
//       `).join('')}
//     </tbody>
//   </table>
  
//   <!-- TOTALS SECTION -->
//   <div class="totals-section">
//     <div class="amount-words">
//       <div class="aw-label">Amount in Words</div>
//       <div class="aw-text">${numberToWords(bill.total || 0)}</div>
//     </div>
//     <div class="totals-box">
//       <div class="tot-row">
//         <span class="label">Subtotal:</span>
//         <span class="value">₹${(bill.subtotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
//       </div>
//       ${bill.includeGST ? `
//       <div class="tot-row">
//         <span class="label">CGST @ 9%:</span>
//         <span class="value">₹${((bill.tax || 0) / 2).toFixed(2)}</span>
//       </div>
//       <div class="tot-row">
//         <span class="label">SGST @ 9%:</span>
//         <span class="value">₹${((bill.tax || 0) / 2).toFixed(2)}</span>
//       </div>
//       ` : ''}
//       <div class="tot-row">
//         <span class="label">Discount:</span>
//         <span class="value">₹0.00</span>
//       </div>
//       <div class="tot-final">
//         <span>GRAND TOTAL</span>
//         <span class="amount">₹${(bill.total || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
//       </div>
//     </div>
//   </div>
  
//   <!-- GST BREAKUP (if applicable) -->
//   ${bill.includeGST ? `
//   <div class="gst-section">
//     <div class="gst-header">GST Tax Breakup</div>
//     <table class="gst-table">
//       <thead>
//         <tr>
//           <th>Taxable Amount</th>
//           <th>CGST Rate</th>
//           <th>CGST Amount</th>
//           <th>SGST Rate</th>
//           <th>SGST Amount</th>
//           <th>Total Tax</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>₹${(bill.subtotal || 0).toFixed(2)}</td>
//           <td>9%</td>
//           <td>₹${((bill.tax || 0) / 2).toFixed(2)}</td>
//           <td>9%</td>
//           <td>₹${((bill.tax || 0) / 2).toFixed(2)}</td>
//           <td>₹${(bill.tax || 0).toFixed(2)}</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
//   ` : ''}
  
//   <!-- NOTES (if any) -->
//   ${bill.notes ? `
//   <div class="notes-section">
//     <div class="notes-label">Notes / Special Instructions:</div>
//     <div>${bill.notes}</div>
//   </div>
//   ` : ''}
  
//   <!-- FOOTER: TERMS & SIGNATURE -->
//   <div class="footer-section">
//     <div class="footer-grid">
//       <div class="terms-box">
//         <strong>Terms & Conditions:</strong>
//         • Goods once sold will not be taken back or exchanged.<br>
//         • Payment is due on receipt of invoice.<br>
//         • Interest @ 18% p.a. will be charged on overdue amounts.<br>
//         • All disputes subject to Bhopal jurisdiction only.<br>
//         • E. & O.E. (Errors and Omissions Excepted)
//       </div>
//       <div class="signature-box">
//         <div class="company-stamp">For ${SHOP_INFO.name}</div>
//         <div class="sig-line"></div>
//         <div class="sig-label">Authorized Signatory</div>
//       </div>
//     </div>
//     <div class="customer-signature">
//       <div style="display:flex; justify-content:space-between; align-items:flex-end;">
//         <div style="text-align:left;">
//           <div class="sig-line" style="width:180px;"></div>
//           <div class="sig-label">Customer Signature</div>
//         </div>
//         <div style="text-align:right; font-size:9px;">
//           Received goods in good condition
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <!-- THANK YOU -->
//   <div class="thankyou-box">
//     <p>Thank You for Your Business!</p>
//     <small>Please visit again — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</small>
//   </div>
  
// </div>
// </body>
// </html>
// `;



// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function BillingPage() {
//   // ── State ──────────────────────────────────────────────────────────────────
//   const [activeTab, setActiveTab]       = useState('bills');
//   const [bills, setBillsState]          = useState([]);
//   const [allBillItems, setAllBillItems] = useState([]);
//   const [inventory, setInventory]       = useState([]);
//   const [searchQuery, setSearchQuery]   = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [previewBill, setPreviewBill]   = useState(null);

//   const [customerName, setCustomerName]       = useState('');
//   const [customerPhone, setCustomerPhone]     = useState('');
//   const [customerAddress, setCustomerAddress] = useState('');
//   const [billDate, setBillDate]   = useState(new Date().toISOString().split('T')[0]);
//   const [billItems, setBillItems] = useState([emptyItem()]);
//   const [notes, setNotes]         = useState('');
//   const [billSaved, setBillSaved] = useState(false);
//   const [includeGST, setIncludeGST]     = useState(false);
//   const [currentBillNo, setCurrentBillNo] = useState('');

//   const [loading, setLoading]   = useState(true);
//   const [saving, setSaving]     = useState(false);
//   const [error, setError]       = useState(null);

//   // ── Fetch all data from APIs ───────────────────────────────────────────────
//   const fetchAllData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [billsRes, billItemsRes, inventoryRes] = await Promise.all([
//         fetch('/api/billing-backend/bills'),
//         fetch('/api/billing-backend/bill_items'),
//         fetch('/api/inventory'),
//       ]);

//       const billsData     = await billsRes.json();
//       const billItemsData = await billItemsRes.json();
//       const inventoryData = await inventoryRes.json();

//       const loadedBills = billsData.success ? billsData.data : [];
//       setBillsState(loadedBills);
//       setAllBillItems(billItemsData.success ? billItemsData.data : []);

//       // Inventory data format: { materialType, materialName, unit, totalReceivedQty, totalSoldQty, currentStock }
//       // Yahan hum skuCode nahi rakhte kyunki inventory sheet mein nahi hai
//       // But dropdown mein materialName dikhega
//       const invItems = inventoryData.success
//         ? inventoryData.data.map((item, idx) => ({
//             id: idx + 1,
//             materialType: item.materialType || '',
//             name: item.materialName || '',
//             unit: item.unit || '',
//             stock: parseFloat(item.currentStock || 0),
//             totalReceived: parseFloat(item.totalReceivedQty || 0),
//             totalSold: parseFloat(item.totalSoldQty || 0),
//           }))
//         : [];
//       setInventory(invItems);
//       setCurrentBillNo(generateBillNo(loadedBills));
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Data load karne mein error aaya. Refresh karein.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);

//   // ── Item helpers ───────────────────────────────────────────────────────────
//   const addItem = () => setBillItems(p => [...p, emptyItem()]);

//   const removeItem = (uid) => {
//     if (billItems.length === 1) return;
//     setBillItems(p => p.filter(i => i.uid !== uid));
//   };

//   const updateItem = (uid, field, value) => {
//     setBillItems(prev => prev.map(item => {
//       if (item.uid !== uid) return item;
//       const updated = { ...item, [field]: value };

//       // Jab dropdown se inventory item select ho
//       if (field === 'inventoryId') {
//         const found = inventory.find(p => p.id === Number(value));
//         if (found) {
//           updated.product      = found.name;
//           updated.unit         = found.unit;
//           updated.materialType = found.materialType;
//           updated.inventoryId  = found.id;
//           // Rate blank rahega — user khud bharega
//         }
//       }

//       updated.amount = parseFloat(updated.quantity || 0) * parseFloat(updated.rate || 0);
//       return updated;
//     }));
//   };

//   const subtotal = billItems.reduce((s, i) => s + (i.amount || 0), 0);
//   const tax      = includeGST ? subtotal * TAX_RATE : 0;
//   const total    = subtotal + tax;

//   // ── Generate Bill → API call ───────────────────────────────────────────────
//   const handleGenerateBill = async () => {
//     if (!customerName || subtotal === 0) return;
//     setSaving(true);
//     setError(null);

//     const validItems = billItems.filter(i => i.product && i.quantity);
//     const newBill = {
//       id: currentBillNo, customer: customerName, phone: customerPhone,
//       address: customerAddress, date: billDate, subtotal, tax, total,
//       notes, includeGST, status: 'Pending', itemCount: validItems.length,
//       createdAt: new Date().toISOString(),
//     };
//     const newItemRows = validItems.map(item => ({
//       uid:          item.uid,
//       billNo:       currentBillNo,
//       skuCode:      item.skuCode || '',
//       itemName:     item.product,
//       unit:         item.unit,
//       quantity:     parseFloat(item.quantity),
//       rate:         parseFloat(item.rate),
//       amount:       item.amount,
//       materialType: item.materialType || '',
//       date:         billDate,
//     }));

//     try {
//       const res = await fetch('/api/billing-backend/bills', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ bill: newBill, items: newItemRows }),
//       });

//       const result = await res.json();

//       if (!result.success) {
//         setError(result.message || 'Bill save fail');
//         setSaving(false);
//         return;
//       }

//       // Refresh data from server
//       await fetchAllData();
//       setPreviewBill({ ...newBill, items: validItems });
//       setBillSaved(true);
//     } catch (err) {
//       console.error('Bill save error:', err);
//       setError('Bill save karne mein error. Try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetForm = () => {
//     setCustomerName(''); setCustomerPhone(''); setCustomerAddress('');
//     setBillDate(new Date().toISOString().split('T')[0]);
//     setBillItems([emptyItem()]); setNotes(''); setBillSaved(false); setIncludeGST(false);
//     setCurrentBillNo(generateBillNo(bills));
//   };

//   const getItemsForBill = (billNo) => allBillItems.filter(row => row.billNo === billNo);

//   // ── Print ──────────────────────────────────────────────────────────────────
//   const handlePrint = (bill) => {
//     const b     = bill || previewBill;
//     const items = b.items || getItemsForBill(b.id);
//     if (!b) return;
//     const win = window.open('', '_blank');
//     win.document.write(getPrintHTML(b, items));
//     win.document.close();
//     setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);
//   };

//   // ── Download HTML ──────────────────────────────────────────────────────────
//   const handleSaveInvoice = (bill) => {
//     const b     = bill || previewBill;
//     const items = b.items || getItemsForBill(b.id);
//     if (!b) return;
//     const html = getPrintHTML(b, items);
//     const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href     = url;
//     a.download = `Invoice-${b.id}-${b.customer.replace(/\s+/g,'-')}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   // ── Filter bills ───────────────────────────────────────────────────────────
//   const filteredBills = bills.filter(b => {
//     const ms  = b.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 b.id?.toLowerCase().includes(searchQuery.toLowerCase());
//     const mst = filterStatus === 'All' || b.status === filterStatus;
//     return ms && mst;
//   });

//   // ── Update status via API ──────────────────────────────────────────────────
//   const updateBillStatus = async (id, status) => {
//     // Optimistic
//     setBillsState(prev => prev.map(b => b.id === id ? { ...b, status } : b));
//     try {
//       const res = await fetch('/api/billing-backend/bills', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ billId: id, status }),
//       });
//       const result = await res.json();
//       if (!result.success) await fetchAllData(); // revert
//     } catch {
//       await fetchAllData(); // revert
//     }
//   };

//   const lowStockItems = inventory.filter(i => i.stock <= 5);

//   const statusColor = (s) => {
//     if (s === 'Paid')    return 'bg-green-100 text-green-700';
//     if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
//     return 'bg-gray-100 text-gray-600';
//   };

//   // ── Loading ────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
//           <p className="text-gray-500 text-sm">Data load ho raha hai...</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════════════════
//   return (
//     <div className="animate-fade-in">
//       <style jsx global>{`
//         @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         .animate-fade-in { animation: fade-in 0.3s ease-out; }
//       `}</style>

//       {/* Error Banner */}
//       {error && (
//         <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
//           <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
//           <p className="text-sm text-red-700 flex-1">{error}</p>
//           <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
//         </div>
//       )}

//       {/* ── HEADER ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Billing & Inventory</h2>
//           <p className="text-gray-500 text-sm mt-1">{SHOP_INFO.name}</p>
//         </div>
//         <div className="flex gap-2 flex-wrap items-center">
//           <button onClick={fetchAllData} title="Refresh"
//             className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
//             <RefreshCw className="w-4 h-4" />
//           </button>
//           {[
//             { key: 'bills',     label: 'All Bills' },
//             { key: 'itemlog',   label: 'Item Log' },
//             { key: 'inventory', label: 'Inventory' },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => { setActiveTab(tab.key); setBillSaved(false); }}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
//                 ${activeTab === tab.key ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
//               {tab.label}
//               {tab.key === 'inventory' && lowStockItems.length > 0 &&
//                 <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">{lowStockItems.length}</span>}
//             </button>
//           ))}
//           <button onClick={() => { setActiveTab('create'); resetForm(); }}
//             className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all">
//             <Plus className="w-4 h-4" /> New Bill
//           </button>
//         </div>
//       </div>

//       {/* ═══ ALL BILLS ═══ */}
//       {activeTab === 'bills' && (
//         <div className="space-y-5">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {[
//               { label: 'Total Bills',   value: bills.length,                                                         color: 'text-gray-800',   bg: 'bg-white' },
//               { label: 'Paid',          value: bills.filter(b=>b.status==='Paid').length,                             color: 'text-green-600',  bg: 'bg-green-50' },
//               { label: 'Pending',       value: bills.filter(b=>b.status==='Pending').length,                          color: 'text-yellow-600', bg: 'bg-yellow-50' },
//               { label: 'Total Revenue', value: `₹${bills.reduce((s,b)=>s+(b.total||0),0).toLocaleString('en-IN')}`, color: 'text-amber-700',  bg: 'bg-amber-50' },
//             ].map((c, i) => (
//               <div key={i} className={`${c.bg} rounded-xl p-4 border border-gray-100 shadow-sm`}>
//                 <p className="text-xs text-gray-500 font-medium">{c.label}</p>
//                 <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
//                 <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
//                   placeholder="Customer ya Bill No se search..."
//                   className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
//               </div>
//               <div className="flex gap-2">
//                 {['All','Paid','Pending','Draft'].map(s => (
//                   <button key={s} onClick={()=>setFilterStatus(s)}
//                     className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
//                       ${filterStatus===s ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bill No</th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Date</th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Items</th>
//                     <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
//                     <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
//                     <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredBills.length === 0 && (
//                     <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400 text-sm">Koi bill nahi mila</td></tr>
//                   )}
//                   {filteredBills.map((bill, i) => (
//                     <tr key={i} className="hover:bg-amber-50/50 transition-colors">
//                       <td className="px-5 py-3 text-sm font-mono font-medium text-amber-600">{bill.id}</td>
//                       <td className="px-5 py-3 text-sm text-gray-700 font-medium">{bill.customer}</td>
//                       <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">
//                         {new Date(bill.date).toLocaleDateString('en-IN')}
//                       </td>
//                       <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">
//                         {getItemsForBill(bill.id).length} items
//                       </td>
//                       <td className="px-5 py-3 text-sm font-bold text-gray-800 text-right">
//                         ₹{(bill.total||0).toLocaleString('en-IN')}
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <select value={bill.status} onChange={e=>updateBillStatus(bill.id, e.target.value)}
//                           className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer outline-none ${statusColor(bill.status)}`}>
//                           <option>Pending</option><option>Paid</option><option>Draft</option>
//                         </select>
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <div className="flex items-center justify-center gap-1.5">
//                           <button onClick={()=>setPreviewBill({...bill, items: getItemsForBill(bill.id)})}
//                             className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors" title="View">
//                             <Eye className="w-4 h-4"/>
//                           </button>
//                           <button onClick={()=>handlePrint({...bill, items: getItemsForBill(bill.id)})}
//                             className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Print">
//                             <Printer className="w-4 h-4"/>
//                           </button>
//                           <button onClick={()=>handleSaveInvoice({...bill, items: getItemsForBill(bill.id)})}
//                             className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Download">
//                             <Download className="w-4 h-4"/>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ ITEM LOG ═══ */}
//       {activeTab === 'itemlog' && (
//         <div className="space-y-4">
//           <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
//             <strong>Item Log</strong> — Har item ki row. Bill No se pata chalega ki ek order mein kya tha.
//             Total rows: <strong>{allBillItems.length}</strong>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-amber-600 uppercase">Bill No</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item Name</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Qty</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Rate</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {allBillItems.length === 0 && (
//                     <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Koi item log nahi — pehle bill banao</td></tr>
//                   )}
//                   {[...allBillItems].reverse().map((row, i) => (
//                     <tr key={i} className="hover:bg-amber-50/30 transition-colors">
//                       <td className="px-4 py-2.5 font-mono text-xs font-semibold text-amber-700">{row.billNo}</td>
//                       <td className="px-4 py-2.5 text-gray-500 text-xs font-mono">{row.skuCode || '—'}</td>
//                       <td className="px-4 py-2.5 text-gray-800 font-medium">{row.itemName}</td>
//                       <td className="px-4 py-2.5 text-gray-600">{row.quantity}</td>
//                       <td className="px-4 py-2.5 text-gray-500">{row.unit}</td>
//                       <td className="px-4 py-2.5 text-gray-700 text-right">₹{parseFloat(row.rate).toLocaleString('en-IN')}</td>
//                       <td className="px-4 py-2.5 font-semibold text-gray-800 text-right">
//                         ₹{(row.amount||0).toLocaleString('en-IN',{minimumFractionDigits:2})}
//                       </td>
//                       <td className="px-4 py-2.5 text-gray-400 text-xs">
//                         {row.date ? new Date(row.date).toLocaleDateString('en-IN') : '—'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ INVENTORY ═══ */}
//       {activeTab === 'inventory' && (
//         <div className="space-y-4">
//           {lowStockItems.length > 0 && (
//             <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
//               <AlertTriangle className="w-5 h-5 text-red-500 shrink-0"/>
//               <p className="text-sm text-red-700">
//                 <strong>{lowStockItems.length} items</strong> ka stock kam hai:&nbsp;
//                 {lowStockItems.map(i=>i.name).join(', ')}
//               </p>
//             </div>
//           )}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-amber-50">
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-amber-800 uppercase">Item Name</th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-amber-800 uppercase">Category</th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-amber-800 uppercase">Unit</th>
//                     <th className="px-5 py-3 text-center text-xs font-semibold text-amber-800 uppercase">Received</th>
//                     <th className="px-5 py-3 text-center text-xs font-semibold text-amber-800 uppercase">Sold</th>
//                     <th className="px-5 py-3 text-center text-xs font-semibold text-amber-800 uppercase">Current Stock</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {inventory.length === 0 && (
//                     <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Inventory khali hai</td></tr>
//                   )}
//                   {inventory.map((item, i) => (
//                     <tr key={i} className={`hover:bg-amber-50/30 transition-colors ${item.stock <= 5 ? 'bg-red-50/40' : ''}`}>
//                       <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
//                       <td className="px-5 py-3 text-gray-500">{item.materialType}</td>
//                       <td className="px-5 py-3 text-gray-500">{item.unit}</td>
//                       <td className="px-5 py-3 text-center text-blue-600 font-semibold">{item.totalReceived}</td>
//                       <td className="px-5 py-3 text-center text-orange-600 font-semibold">{item.totalSold}</td>
//                       <td className="px-5 py-3 text-center">
//                         <span className={`font-bold text-base ${item.stock <= 5 ? 'text-red-600' : item.stock <= 15 ? 'text-yellow-600' : 'text-green-600'}`}>
//                           {item.stock}
//                         </span>
//                         {item.stock <= 5  && <span className="ml-2 text-xs text-red-500 font-medium">Low</span>}
//                         {item.stock > 5 && item.stock <= 15 && <span className="ml-2 text-xs text-yellow-600">Medium</span>}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ CREATE BILL ═══ */}
//       {activeTab === 'create' && !billSaved && (
//         <div className="max-w-4xl mx-auto space-y-5">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-xl font-bold text-gray-800">New Bill</h3>
//               <p className="text-gray-500 text-sm mt-1">Items add karo, Google Sheet mein save hoga + inventory update hoga</p>
//             </div>
//             <span className="text-sm font-mono text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
//               {currentBillNo}
//             </span>
//           </div>

//           {/* Customer Details */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <span className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center text-xs font-bold text-amber-700">1</span>
//               Customer Details
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">Customer Name *</label>
//                 <input value={customerName} onChange={e=>setCustomerName(e.target.value)}
//                   placeholder="Customer ka naam"
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone</label>
//                 <input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)}
//                   placeholder="+91 XXXXX XXXXX"
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
//               </div>
//               <div className="sm:col-span-2">
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">Address</label>
//                 <textarea value={customerAddress} onChange={e=>setCustomerAddress(e.target.value)}
//                   placeholder="Customer address..." rows={2}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"/>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">Bill Date</label>
//                 <input type="date" value={billDate} onChange={e=>setBillDate(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
//               </div>
//               <div className="flex items-center gap-3 pt-5">
//                 <input type="checkbox" id="gst" checked={includeGST} onChange={e=>setIncludeGST(e.target.checked)}
//                   className="w-4 h-4 accent-amber-600 cursor-pointer"/>
//                 <label htmlFor="gst" className="text-sm font-medium text-gray-700 cursor-pointer">
//                   GST (18%) include karein
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Items Table — Inventory Dropdown */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <span className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center text-xs font-bold text-amber-700">2</span>
//               Items / Saman
//             </h3>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-amber-50">
//                     <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700">#</th>
//                     <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700">Product (Inventory se)</th>
//                     <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700 w-16">Unit</th>
//                     <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700 w-20">Qty</th>
//                     <th className="px-3 py-2.5 text-left text-xs font-semibold text-amber-700 w-24">Rate (₹)</th>
//                     <th className="px-3 py-2.5 text-right text-xs font-semibold text-amber-700 w-24">Amount</th>
//                     <th className="px-3 py-2.5 w-8"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {billItems.map((item, idx) => (
//                     <tr key={item.uid}>
//                       <td className="px-3 py-2 text-xs text-gray-400 font-medium">{idx + 1}</td>
//                       <td className="px-3 py-2 min-w-[200px]">
//                         <select value={item.inventoryId || ''} onChange={e=>updateItem(item.uid,'inventoryId',e.target.value)}
//                           className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
//                           <option value="">-- Item chunein --</option>
//                           {inventory.map(p => (
//                             <option key={p.id} value={p.id}>
//                               {p.name} — {p.materialType} (Stock: {p.stock} {p.unit})
//                             </option>
//                           ))}
//                         </select>
//                         {item.product && (
//                           <p className="text-xs text-gray-400 mt-1 pl-1">{item.materialType}</p>
//                         )}
//                       </td>
//                       <td className="px-3 py-2">
//                         <input value={item.unit} readOnly
//                           className="w-full px-2 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500"/>
//                       </td>
//                       <td className="px-3 py-2">
//                         <input type="number" min="0" value={item.quantity}
//                           onChange={e=>updateItem(item.uid,'quantity',e.target.value)}
//                           placeholder="0"
//                           className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"/>
//                       </td>
//                       <td className="px-3 py-2">
//                         <input type="number" min="0" value={item.rate}
//                           onChange={e=>updateItem(item.uid,'rate',e.target.value)}
//                           placeholder="₹"
//                           className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"/>
//                       </td>
//                       <td className="px-3 py-2 text-right">
//                         <span className="text-sm font-semibold text-gray-800">
//                           ₹{(item.amount||0).toLocaleString('en-IN')}
//                         </span>
//                       </td>
//                       <td className="px-3 py-2 text-center">
//                         <button onClick={()=>removeItem(item.uid)}
//                           className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors">
//                           <Trash2 className="w-4 h-4"/>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button onClick={addItem}
//               className="mt-4 flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium">
//               <Plus className="w-4 h-4"/> Item Add Karo
//             </button>
//             <div className="mt-5 border-t border-gray-100 pt-4 flex justify-end">
//               <div className="w-64 space-y-2">
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
//                 </div>
//                 {includeGST && (
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>GST (18%)</span><span className="font-medium">₹{tax.toFixed(0)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-200 pt-2">
//                   <span>Total</span><span className="text-amber-700">₹{total.toLocaleString('en-IN')}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Notes + Actions */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
//             <label className="text-sm font-medium text-gray-700 block mb-2">Notes / Terms</label>
//             <textarea value={notes} onChange={e=>setNotes(e.target.value)}
//               placeholder="Koi additional note..." rows={2}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"/>
//           </div>
//           <div className="flex justify-end gap-3">
//             <button onClick={()=>setActiveTab('bills')}
//               className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">
//               Cancel
//             </button>
//             <button onClick={handleGenerateBill}
//               disabled={!customerName || subtotal === 0 || saving}
//               className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
//               {saving ? (
//                 <><Loader2 className="w-4 h-4 animate-spin"/> Sheet mein save ho raha hai...</>
//               ) : (
//                 <><CheckCircle className="w-4 h-4"/> Bill Generate Karo</>
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ═══ BILL SAVED + PREVIEW ═══ */}
//       {activeTab === 'create' && billSaved && previewBill && (
//         <div className="max-w-3xl mx-auto space-y-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-green-600"/>
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">Bill Save Ho Gaya!</h3>
//                 <p className="text-gray-500 text-sm">
//                   {previewBill.id} — {previewBill.items?.length} items — ₹{(previewBill.total||0).toLocaleString('en-IN')}
//                 </p>
//                 <p className="text-green-600 text-xs font-medium mt-0.5">
//                   Google Sheet mein save + Inventory update done
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2 flex-wrap justify-end">
//               <button onClick={resetForm}
//                 className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">
//                 New Bill
//               </button>
//               <button onClick={()=>handleSaveInvoice(previewBill)}
//                 className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all">
//                 <Download className="w-4 h-4"/> Save Invoice
//               </button>
//               <button onClick={()=>handlePrint(previewBill)}
//                 className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg">
//                 <Printer className="w-4 h-4"/> Print / PDF
//               </button>
//             </div>
//           </div>

//           {/* Preview Card */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//             <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-amber-100">
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">{SHOP_INFO.name}</h1>
//                 <p className="text-xs text-gray-500 mt-1">{SHOP_INFO.address}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-gray-500">Invoice</p>
//                 <p className="text-lg font-bold font-mono text-amber-700">{previewBill.id}</p>
//                 <p className="text-xs text-gray-500">{new Date(previewBill.date).toLocaleDateString('en-IN')}</p>
//               </div>
//             </div>
//             <div className="mb-4 text-sm">
//               <p className="font-bold text-gray-800">{previewBill.customer}</p>
//               {previewBill.phone   && <p className="text-gray-500">{previewBill.phone}</p>}
//               {previewBill.address && <p className="text-gray-500">{previewBill.address}</p>}
//             </div>
//             <table className="w-full text-sm mb-4">
//               <thead>
//                 <tr className="bg-amber-600 text-white">
//                   <th className="px-3 py-2 text-left text-xs rounded-l-lg">#</th>
//                   <th className="px-3 py-2 text-left text-xs">Item</th>
//                   <th className="px-3 py-2 text-center text-xs">Qty</th>
//                   <th className="px-3 py-2 text-right text-xs">Rate</th>
//                   <th className="px-3 py-2 text-right text-xs rounded-r-lg">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewBill.items?.map((item, i) => (
//                   <tr key={i} className={i%2===0?'bg-gray-50':'bg-white'}>
//                     <td className="px-3 py-2 text-xs text-gray-400">{i+1}</td>
//                     <td className="px-3 py-2 text-gray-800">{item.product}</td>
//                     <td className="px-3 py-2 text-center text-gray-600">{item.quantity} {item.unit}</td>
//                     <td className="px-3 py-2 text-right text-gray-600">₹{parseFloat(item.rate).toLocaleString('en-IN')}</td>
//                     <td className="px-3 py-2 text-right font-semibold text-gray-800">₹{(item.amount||0).toLocaleString('en-IN')}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="flex justify-end">
//               <div className="w-56 space-y-1.5 bg-gray-50 rounded-xl p-3">
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Subtotal</span><span>₹{(previewBill.subtotal||0).toLocaleString('en-IN')}</span>
//                 </div>
//                 {previewBill.includeGST && (
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>GST (18%)</span><span>₹{(previewBill.tax||0).toFixed(0)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-1.5">
//                   <span>Total</span><span className="text-amber-700">₹{(previewBill.total||0).toLocaleString('en-IN')}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ PREVIEW MODAL ═══ */}
//       {previewBill && activeTab !== 'create' && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-2">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b bg-amber-50 rounded-t-2xl">
//               <h2 className="text-lg font-bold text-amber-900">{previewBill.id}</h2>
//               <div className="flex gap-2">
//                 <button onClick={()=>handleSaveInvoice(previewBill)}
//                   className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
//                   <Download className="w-4 h-4"/> Save
//                 </button>
//                 <button onClick={()=>handlePrint(previewBill)}
//                   className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
//                   <Printer className="w-4 h-4"/> Print
//                 </button>
//                 <button onClick={()=>setPreviewBill(null)}
//                   className="p-2 hover:bg-amber-100 rounded-full text-gray-600 text-lg leading-none">✕</button>
//               </div>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="text-sm">
//                 <p className="font-bold text-gray-800 text-base">{previewBill.customer}</p>
//                 {previewBill.phone   && <p className="text-gray-500">{previewBill.phone}</p>}
//                 {previewBill.address && <p className="text-gray-500">{previewBill.address}</p>}
//                 <p className="text-gray-400 text-xs mt-1">{new Date(previewBill.date).toLocaleDateString('en-IN')}</p>
//               </div>
//               <table className="w-full text-sm">
//                 <thead><tr className="bg-amber-50">
//                   <th className="px-3 py-2 text-left text-xs text-amber-700">#</th>
//                   <th className="px-3 py-2 text-left text-xs text-amber-700">Item</th>
//                   <th className="px-3 py-2 text-center text-xs text-amber-700">Qty</th>
//                   <th className="px-3 py-2 text-right text-xs text-amber-700">Amount</th>
//                 </tr></thead>
//                 <tbody>
//                   {(previewBill.items||[]).map((it, i) => (
//                     <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
//                       <td className="px-3 py-2.5 text-xs text-gray-400">{i+1}</td>
//                       <td className="px-3 py-2.5 text-gray-800 font-medium">{it.itemName || it.product}</td>
//                       <td className="px-3 py-2.5 text-center text-gray-600">{it.quantity} {it.unit}</td>
//                       <td className="px-3 py-2.5 text-right font-semibold">₹{(it.amount||0).toLocaleString('en-IN')}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-end pt-2 border-t border-gray-100">
//                 <span className="text-base font-bold text-amber-700">
//                   Total: ₹{(previewBill.total||0).toLocaleString('en-IN')}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


////// new try ////


'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Printer, Search, CheckCircle, Eye,
  AlertTriangle, Loader2, RefreshCw,
  X, TruckIcon, Receipt, ArrowRight
} from 'lucide-react';

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '0755-4275577',
  gstin: '23XXXXX1234X1ZX',
};
const TAX_RATE = 0.18;
function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

function numberToWords(num) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (num === 0) return 'Zero';
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10?' '+ones[n%10]:'');
    if (n < 1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+convert(n%100):'');
    if (n < 100000) return convert(Math.floor(n/1000))+' Thousand'+(n%1000?' '+convert(n%1000):'');
    if (n < 10000000) return convert(Math.floor(n/100000))+' Lakh'+(n%100000?' '+convert(n%100000):'');
    return convert(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+convert(n%10000000):'');
  }
  const i=Math.floor(num), d=Math.round((num-i)*100);
  return convert(i)+' Rupees'+(d>0?' and '+convert(d)+' Paise':'')+' Only';
}

const PRINT_SHARED_CSS = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;color:#000;background:#fff;-webkit-print-color-adjust:exact}.page{max-width:210mm;margin:0 auto;padding:15mm}.hdr{border:2px solid #000;padding:12px 16px;margin-bottom:10px}.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid #000;margin-bottom:8px}h1{font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:3px}.box{border:2px solid #000;padding:8px 12px;text-align:right;min-width:170px}.gr{display:flex;justify-content:space-between;font-size:9px;font-weight:bold}.sec{border:2px solid #000;margin-bottom:10px}.sh{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}.cb{display:flex}.bt,.st{flex:1;padding:10px 12px}.bt{border-right:1px solid #000}.lbl{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;text-decoration:underline}.cn{font-size:13px;font-weight:bold;margin-bottom:3px}.cd{font-size:10px;line-height:1.5}.mg{display:grid;grid-template-columns:auto 1fr;gap:3px 8px;font-size:9px}.mg .ml{font-weight:bold}table{width:100%;border-collapse:collapse;border:2px solid #000;margin-bottom:10px}thead tr{background:#000;color:#fff}th{padding:7px 8px;font-size:9px;font-weight:bold;text-transform:uppercase;text-align:left;border-right:1px solid #fff}th:last-child{border-right:none}th.r{text-align:right}th.c{text-align:center}tbody tr{border-bottom:1px solid #000}td{padding:6px 8px;font-size:11px;border-right:1px solid #ddd}td:last-child{border-right:none}td.r{text-align:right}td.c{text-align:center}.tots{display:flex;gap:12px;margin-bottom:10px}.aw{flex:1;border:2px solid #000;padding:10px 12px}.awl{font-size:8px;font-weight:bold;text-transform:uppercase;margin-bottom:4px}.awt{font-size:11px;font-weight:bold;font-style:italic}.tb{width:220px;border:2px solid #000}.tr_{display:flex;justify-content:space-between;padding:5px 12px;font-size:11px;border-bottom:1px solid #ddd}.tf{background:#000;color:#fff;display:flex;justify-content:space-between;padding:7px 12px;font-size:12px;font-weight:bold}.ftr{border:2px solid #000;padding:10px 12px}.fg{display:flex;justify-content:space-between;gap:20px}.terms{flex:1;font-size:9px;line-height:1.7}.sig{width:190px;text-align:center}.stamp{border:2px dashed #000;padding:7px 14px;margin-bottom:28px;font-size:9px;font-weight:bold;text-transform:uppercase}.sl{width:100%;border-top:1px solid #000;margin-bottom:5px}.slbl{font-size:9px;font-weight:bold}.ty{border:2px solid #000;padding:8px;margin-top:10px;text-align:center}@media print{.page{padding:10mm}}@page{size:A4;margin:10mm}`;

const getChallanPrintHTML = (order, challan) => `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_SHARED_CSS}</style></head><body><div class="page"><div class="hdr"><div class="hdr-top"><div><h1>${SHOP_INFO.name}</h1><p style="font-size:10px">${SHOP_INFO.address}</p><p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p></div><div class="box"><div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Delivery Challan</div><div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">${challan.challanNo}</div><div style="font-size:9px">Date: ${new Date(challan.challanDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div><div style="font-size:9px;margin-top:2px">Ref: ${order.orderNo}</div></div></div><div class="gr"><span>GSTIN: ${SHOP_INFO.gstin}</span><span>PAN: XXXXX1234X</span></div></div><div class="sec"><div class="sh">Customer Details</div><div class="cb"><div class="bt"><div class="lbl">Bill To</div><div class="cn">${order.customerName}</div><div class="cd">${order.customerPhone?'Phone: '+order.customerPhone+'<br>':''}${order.customerAddress||''}</div></div><div class="st"><div class="lbl">Challan Info</div><div class="mg"><span class="ml">Challan No:</span><span>${challan.challanNo}</span><span class="ml">Date:</span><span>${new Date(challan.challanDate).toLocaleDateString('en-IN')}</span><span class="ml">Order Ref:</span><span>${order.orderNo}</span><span class="ml">Note:</span><span>${challan.deliveryNote||'—'}</span></div></div></div></div><table><thead><tr><th style="width:30px">#</th><th>Item</th><th class="r" style="width:60px">Ordered</th><th class="r" style="width:60px">Sent</th><th class="c" style="width:45px">Unit</th><th class="r" style="width:80px">Rate (₹)</th><th class="r" style="width:90px">Amount (₹)</th></tr></thead><tbody>${challan.items.map((it,i)=>`<tr><td class="c">${i+1}</td><td><strong>${it.product}</strong></td><td class="r">${it.orderedQty}</td><td class="r"><strong>${it.sentQty}</strong></td><td class="c">${it.unit}</td><td class="r">${parseFloat(it.rate).toLocaleString('en-IN',{minimumFractionDigits:2})}</td><td class="r"><strong>${(it.sentQty*it.rate).toLocaleString('en-IN',{minimumFractionDigits:2})}</strong></td></tr>`).join('')}</tbody></table><div class="tots"><div class="aw"><div class="awl">Amount in Words</div><div class="awt">${numberToWords(challan.items.reduce((s,it)=>s+(it.sentQty*it.rate),0))}</div></div><div class="tb"><div class="tr_"><span>Subtotal:</span><span>₹${challan.items.reduce((s,it)=>s+(it.sentQty*it.rate),0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div><div class="tf"><span>CHALLAN TOTAL</span><span>₹${challan.items.reduce((s,it)=>s+(it.sentQty*it.rate),0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div></div></div><div class="ftr"><div class="fg"><div class="terms"><strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>• Goods dispatched will not be returned without prior approval.<br>• Verify items on receipt; report discrepancies within 24 hours.<br>• This is a delivery challan — not a tax invoice.<br>• All disputes subject to Bhopal jurisdiction only.</div><div class="sig"><div class="stamp">For ${SHOP_INFO.name}</div><div class="sl"></div><div class="slbl">Authorized Signatory</div></div></div><div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end"><div><div class="sl" style="width:180px"></div><div class="slbl">Customer Signature</div></div><div style="font-size:9px">Received goods in good condition</div></div></div><div class="ty"><strong>Delivery Challan — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div></div></body></html>`;

const getBillPrintHTML = (order, challans) => {
  const m={};
  challans.forEach(ch=>ch.items.forEach(it=>{
    if(!m[it.product]) m[it.product]={product:it.product,unit:it.unit,rate:it.rate,totalSentQty:0,totalAmount:0};
    m[it.product].totalSentQty+=it.sentQty; m[it.product].totalAmount+=it.sentQty*it.rate;
  }));
  const li=Object.values(m), sub=li.reduce((s,i)=>s+i.totalAmount,0), tax=order.includeGST?sub*TAX_RATE:0, total=sub+tax;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice INV-${order.orderNo}</title><style>${PRINT_SHARED_CSS}.cref{border:2px solid #000;padding:8px 12px;margin-bottom:10px;font-size:10px}.gst-s{border:2px solid #000;margin-bottom:10px}.gst-h{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase}.gst-t{width:100%;border-collapse:collapse}.gst-t th{background:#f0f0f0;padding:6px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #000;border-right:1px solid #ddd}.gst-t td{padding:6px 8px;font-size:10px;border-right:1px solid #ddd}</style></head><body><div class="page"><div class="hdr"><div class="hdr-top"><div><h1>${SHOP_INFO.name}</h1><p style="font-size:10px">${SHOP_INFO.address}</p><p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p></div><div class="box"><div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Tax Invoice</div><div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">INV-${order.orderNo}</div><div style="font-size:9px">Date: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div></div></div><div class="gr"><span>GSTIN: ${SHOP_INFO.gstin}</span><span>PAN: XXXXX1234X</span></div></div><div class="sec"><div class="sh">Customer & Invoice Details</div><div class="cb"><div class="bt"><div class="lbl">Bill To</div><div class="cn">${order.customerName}</div><div class="cd">${order.customerPhone?'Phone: '+order.customerPhone+'<br>':''}${order.customerAddress||''}</div></div><div class="st"><div class="lbl">Invoice Information</div><div class="mg"><span class="ml">Order No:</span><span>${order.orderNo}</span><span class="ml">Challans:</span><span>${challans.map(c=>c.challanNo).join(', ')}</span><span class="ml">Items:</span><span>${li.length}</span><span class="ml">GST:</span><span>${order.includeGST?'18% Included':'N/A'}</span></div></div></div></div><div class="cref"><strong>Challan References: </strong>${challans.map(c=>`${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}</div><table><thead><tr><th style="width:30px">#</th><th>Item</th><th class="c" style="width:50px">Unit</th><th class="r" style="width:60px">Qty</th><th class="r" style="width:80px">Rate (₹)</th><th class="r" style="width:90px">Amount (₹)</th></tr></thead><tbody>${li.map((it,i)=>`<tr><td class="c">${i+1}</td><td><strong>${it.product}</strong></td><td class="c">${it.unit}</td><td class="r"><strong>${it.totalSentQty}</strong></td><td class="r">${parseFloat(it.rate).toLocaleString('en-IN',{minimumFractionDigits:2})}</td><td class="r"><strong>${it.totalAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</strong></td></tr>`).join('')}</tbody></table><div class="tots"><div class="aw"><div class="awl">Amount in Words</div><div class="awt">${numberToWords(total)}</div></div><div class="tb"><div class="tr_"><span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>${order.includeGST?`<div class="tr_"><span>CGST @ 9%:</span><span>₹${(tax/2).toFixed(2)}</span></div><div class="tr_"><span>SGST @ 9%:</span><span>₹${(tax/2).toFixed(2)}</span></div>`:''}<div class="tr_"><span>Discount:</span><span>₹0.00</span></div><div class="tf"><span>GRAND TOTAL</span><span>₹${total.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div></div></div>${order.includeGST?`<div class="gst-s"><div class="gst-h">GST Tax Breakup</div><table class="gst-t"><thead><tr><th>Taxable</th><th>CGST Rate</th><th>CGST Amt</th><th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th></tr></thead><tbody><tr><td>₹${sub.toFixed(2)}</td><td>9%</td><td>₹${(tax/2).toFixed(2)}</td><td>9%</td><td>₹${(tax/2).toFixed(2)}</td><td><strong>₹${tax.toFixed(2)}</strong></td></tr></tbody></table></div>`:''}<div class="ftr"><div class="fg"><div class="terms"><strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>• Goods once sold will not be taken back or exchanged.<br>• Payment due on receipt of invoice.<br>• Interest @ 18% p.a. on overdue amounts.<br>• All disputes subject to Bhopal jurisdiction only.<br>• E. & O.E.</div><div class="sig"><div class="stamp">For ${SHOP_INFO.name}</div><div class="sl"></div><div class="slbl">Authorized Signatory</div></div></div><div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end"><div><div class="sl" style="width:180px"></div><div class="slbl">Customer Signature</div></div><div style="font-size:9px">Received goods in good condition</div></div></div><div class="ty"><strong>Thank You for Your Business! — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div></div></body></html>`;
};

const apiGet   = url       => fetch(url).then(r=>r.json());
const apiPost  = (url, b)  => fetch(url,{method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
const apiPatch = (url, b)  => fetch(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());

export default function OrderChallanBilling() {
  const [activeTab, setActiveTab]     = useState('orders');
  const [orders, setOrders]           = useState([]);
  const [challans, setChallans]       = useState([]);
  const [inventory, setInventory]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [showOrderForm, setShowOrderForm]     = useState(false);
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [selectedOrder, setSelectedOrder]     = useState(null);

  const [orderForm, setOrderForm] = useState({
    customerName:'', customerPhone:'', customerAddress:'',
    orderDate: new Date().toISOString().split('T')[0], includeGST: false, notes:'',
  });
  const [orderItems, setOrderItems] = useState([
    { uid:uid(), product:'', unit:'', quantity:'', rate:'', amount:0, inventoryId:'' }
  ]);
  const [challanDate, setChallanDate]   = useState(new Date().toISOString().split('T')[0]);
  const [challanItems, setChallanItems] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [od, cd, inv] = await Promise.all([
        apiGet('/api/billing-backend/orders'),
        apiGet('/api/billing-backend/challans'),
        apiGet('/api/inventory'),
      ]);
      setOrders(od.success ? od.data : []);
      setChallans(cd.success ? cd.data : []);
      setInventory(inv.success
        ? inv.data.map((it,i)=>({id:i+1,materialType:it.materialType||'',name:it.materialName||'',unit:it.unit||'',stock:parseFloat(it.currentStock||0)}))
        : []);
    } catch { setError('Data load nahi hua. Refresh karein.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(()=>{ fetchData(); },[fetchData]);

  const addOrderItem    = () => setOrderItems(p=>[...p,{uid:uid(),product:'',unit:'',quantity:'',rate:'',amount:0,inventoryId:''}]);
  const removeOrderItem = id => { if(orderItems.length===1) return; setOrderItems(p=>p.filter(i=>i.uid!==id)); };
  const updateOrderItem = (id,field,val) => setOrderItems(prev=>prev.map(item=>{
    if(item.uid!==id) return item;
    const u={...item,[field]:val};
    if(field==='inventoryId'){const f=inventory.find(p=>p.id===Number(val));if(f){u.product=f.name;u.unit=f.unit;u.inventoryId=f.id;}}
    u.amount=parseFloat(u.quantity||0)*parseFloat(u.rate||0);
    return u;
  }));
  const orderSubtotal = orderItems.reduce((s,i)=>s+(i.amount||0),0);

  const genOrderNo  = () => { const y=new Date().getFullYear(),px=`ORD-${y}-`;const max=orders.filter(o=>o.orderNo?.startsWith(px)).reduce((m,o)=>{const n=parseInt(o.orderNo?.replace(px,'')||'0');return n>m?n:m;},0);return `${px}${String(max+1).padStart(4,'0')}`; };
  const genChallanNo= () => { const y=new Date().getFullYear(),px=`CHL-${y}-`;const max=challans.filter(c=>c.challanNo?.startsWith(px)).reduce((m,c)=>{const n=parseInt(c.challanNo?.replace(px,'')||'0');return n>m?n:m;},0);return `${px}${String(max+1).padStart(4,'0')}`; };

  const handleSubmitOrder = async () => {
    if(!orderForm.customerName||orderSubtotal===0) return;
    setSaving(true); setError(null);
    try {
      const orderNo=genOrderNo(), validItems=orderItems.filter(i=>i.product&&i.quantity);
      const tax=orderForm.includeGST?orderSubtotal*TAX_RATE:0;
      const r=await apiPost('/api/billing-backend/orders',{order:{...orderForm,orderNo,subtotal:orderSubtotal,tax,total:orderSubtotal+tax,status:'Active'},items:validItems});
      if(!r.success){setError(r.message||'Order save fail');return;}
      await fetchData();
      setShowOrderForm(false);
      setOrderForm({customerName:'',customerPhone:'',customerAddress:'',orderDate:new Date().toISOString().split('T')[0],includeGST:false,notes:''});
      setOrderItems([{uid:uid(),product:'',unit:'',quantity:'',rate:'',amount:0,inventoryId:''}]);
    } catch {setError('Order save error.');} finally {setSaving(false);}
  };

  const openChallanForm = order => {
    setSelectedOrder(order);
    const sm={};
    challans.filter(c=>c.orderNo===order.orderNo).forEach(ch=>ch.items.forEach(it=>{sm[it.product]=(sm[it.product]||0)+it.sentQty;}));
    setChallanItems((order.items||[]).map(it=>({uid:uid(),product:it.product||it.itemName,unit:it.unit,rate:it.rate,orderedQty:parseFloat(it.quantity||0),alreadySent:parseFloat(sm[it.product||it.itemName]||0),sentQty:Math.max(0,parseFloat(it.quantity||0)-parseFloat(sm[it.product||it.itemName]||0))})));
    setChallanDate(new Date().toISOString().split('T')[0]);
    setDeliveryNote('');
    setShowChallanForm(true);
  };

  const handleSubmitChallan = async () => {
    const valid=challanItems.filter(i=>parseFloat(i.sentQty)>0);
    if(!valid.length){setError('Kam se kam ek item ki qty daalo.');return;}
    setSaving(true); setError(null);
    try {
      const challanNo=genChallanNo(), challanTotal=valid.reduce((s,it)=>s+(parseFloat(it.sentQty||0)*it.rate),0);
      const payload={challan:{challanNo,orderNo:selectedOrder.orderNo,customerName:selectedOrder.customerName,challanDate,deliveryNote,challanTotal,status:'Delivered'},items:valid.map(it=>({product:it.product,unit:it.unit,orderedQty:it.orderedQty,sentQty:parseFloat(it.sentQty),rate:it.rate,amount:parseFloat(it.sentQty)*it.rate}))};
      const r=await apiPost('/api/billing-backend/challans',payload);
      if(!r.success){setError(r.message||'Challan save fail');return;}
      const allC=[...challans.filter(c=>c.orderNo===selectedOrder.orderNo)];
      const tsm={};
      [...allC,{items:valid.map(it=>({product:it.product,sentQty:parseFloat(it.sentQty)}))}].forEach(ch=>ch.items.forEach(it=>{tsm[it.product]=(tsm[it.product]||0)+it.sentQty;}));
      const done=(selectedOrder.items||[]).every(oi=>(tsm[oi.product||oi.itemName]||0)>=parseFloat(oi.quantity||0));
      if(done) await apiPatch('/api/billing-backend/orders',{orderNo:selectedOrder.orderNo,status:'Completed'});
      const win=window.open('','_blank');
      win.document.write(getChallanPrintHTML(selectedOrder,{...payload.challan,items:payload.items}));
      win.document.close(); setTimeout(()=>{win.focus();win.print();win.close();},600);
      await fetchData(); setShowChallanForm(false);
    } catch {setError('Challan save error.');} finally {setSaving(false);}
  };

  const printFinalBill = order => { const oc=challans.filter(c=>c.orderNo===order.orderNo);const win=window.open('','_blank');win.document.write(getBillPrintHTML(order,oc));win.document.close();setTimeout(()=>{win.focus();win.print();win.close();},600); };
  const markBilled     = async orderNo => { await apiPatch('/api/billing-backend/orders',{orderNo,status:'Billed'});await fetchData();setShowBillPreview(false); };

  const getOrderChallans    = orderNo => challans.filter(c=>c.orderNo===orderNo);
  const getDeliveryProgress = order => {
    const sm={};
    challans.filter(c=>c.orderNo===order.orderNo).forEach(ch=>ch.items.forEach(it=>{sm[it.product]=(sm[it.product]||0)+it.sentQty;}));
    const items=order.items||[]; if(!items.length) return 0;
    const tot=items.reduce((s,it)=>s+parseFloat(it.quantity||0),0);
    const sent=items.reduce((s,it)=>s+Math.min(parseFloat(it.quantity||0),sm[it.product||it.itemName]||0),0);
    return tot>0?Math.round((sent/tot)*100):0;
  };

  const filteredOrders = orders.filter(o=>{
    const ms=o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())||o.orderNo?.toLowerCase().includes(searchQuery.toLowerCase());
    const mst=filterStatus==='All'||o.status===filterStatus;
    return ms&&mst;
  });

  const STATUS = {
    Active:    {bg:'#fef3c7',color:'#92400e',dot:'#d97706'},
    Completed: {bg:'#dcfce7',color:'#166534',dot:'#22c55e'},
    Billed:    {bg:'#dbeafe',color:'#1e40af',dot:'#3b82f6'},
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96 flex-col gap-3">
      <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
      <p className="text-gray-400 text-sm">Data load ho raha hai...</p>
    </div>
  );

  return (
    <div>
      <style jsx global>{`
        @keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        .kt-in{animation:kt-in .28s ease-out}

        /* ── inputs ── */
        .kt-input{width:100%;padding:9px 13px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;background:#fff;color:#111827;outline:none;transition:border-color .14s,box-shadow .14s}
        .kt-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}
        .kt-input[readonly]{background:#f9fafb;color:#9ca3af}

        /* ── buttons ── */
        .btn-amber{padding:9px 20px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 6px rgba(180,83,9,.28)}
        .btn-amber:hover{background:linear-gradient(135deg,#92400e,#b45309);box-shadow:0 4px 14px rgba(180,83,9,.38);transform:translateY(-1px)}
        .btn-amber:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .btn-white{padding:9px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:#374151;display:inline-flex;align-items:center;gap:6px;transition:all .14s}
        .btn-white:hover{background:#f9fafb;border-color:#d1d5db}
        .btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .14s}
        .btn-green:hover{opacity:.9}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:#9ca3af}
        .icon-btn:hover{background:#f3f4f6;color:#374151}

        /* ── cards ── */
        .kt-card{background:#fff;border:1px solid #f0f0f0;border-radius:16px;box-shadow:0 1px 5px rgba(0,0,0,.05)}
        .kt-inset{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}

        /* ── tabs ── */
        .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:#6b7280}
        .kt-tab.active{background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;box-shadow:0 1px 4px rgba(217,119,6,.18)}
        .kt-tab:hover:not(.active){background:#f9fafb;color:#374151}

        /* ── table ── */
        .kt-tbl{width:100%;border-collapse:collapse}
        .kt-tbl thead tr{background:linear-gradient(135deg,#7c3f00,#b45309)}
        .kt-tbl thead th{padding:10px 13px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#fff;text-align:left}
        .kt-tbl thead th.r{text-align:right}
        .kt-tbl thead th.c{text-align:center}
        .kt-tbl tbody tr{border-bottom:1px solid #f3f4f6;transition:background .1s}
        .kt-tbl tbody tr:nth-child(even){background:#fffdf8}
        .kt-tbl tbody tr:hover{background:#fffbec}
        .kt-tbl tbody td{padding:9px 13px;font-size:13px;color:#374151}
        .kt-tbl tbody td.r{text-align:right}
        .kt-tbl tbody td.c{text-align:center}

        /* ── overlay / modal ── */
        .kt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.44);z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:32px 16px;backdrop-filter:blur(3px)}
        .kt-modal{background:#fff;border-radius:22px;border:1px solid #e5e7eb;width:100%;max-width:740px;margin:auto;box-shadow:0 24px 64px rgba(0,0,0,.18)}
        .kt-mhead{padding:20px 26px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#fffbf2 0%,#fff 100%);border-radius:22px 22px 0 0}
        .kt-mbody{padding:24px 26px}
        .kt-mfoot{padding:16px 26px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:8px;background:#fafafa;border-radius:0 0 22px 22px}

        /* ── progress ── */
        .prog-track{height:6px;background:#fde68a;border-radius:4px;overflow:hidden}
        .prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#d97706,#fbbf24);transition:width .5s ease}
        .prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}

        /* ── misc ── */
        .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .sec-label{font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}
        .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
        .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
        .total-box{border-radius:12px;padding:14px 18px;border:1px solid}
      `}</style>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-700 flex-1">{error}</span>
          <button className="icon-btn" onClick={()=>setError(null)}><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{SHOP_INFO.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="icon-btn" onClick={fetchData}><RefreshCw className="w-4 h-4" /></button>
          <button className={`kt-tab ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}>Orders</button>
          <button className={`kt-tab ${activeTab==='challans'?'active':''}`} onClick={()=>setActiveTab('challans')}>Challans</button>
          <button className="btn-amber" onClick={()=>setShowOrderForm(true)}><Plus className="w-4 h-4"/>New Order</button>
        </div>
      </div>

      {/* ── Workflow strip ── */}
      <div className="kt-card mb-6 overflow-hidden">
        <div style={{background:'linear-gradient(135deg,#7c3f00,#d97706)',padding:'14px 24px',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          {[
            {n:'1',label:'Order',desc:'Customer requirement',bg:'#fef3c7',col:'#92400e'},
            {n:'2',label:'Challan',desc:'Partial delivery ok',bg:'#fde68a',col:'#78350f'},
            {n:'3',label:'Bill',desc:'Final invoice',bg:'#fbbf24',col:'#451a03'},
          ].map((s,i,a)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="step-dot" style={{background:s.bg,color:s.col}}>{s.n}</div>
                <div>
                  <p style={{fontWeight:700,fontSize:13,color:'#fff',margin:0,lineHeight:1.2}}>{s.label}</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,.65)',margin:0}}>{s.desc}</p>
                </div>
              </div>
              {i<a.length-1&&<ArrowRight style={{width:14,height:14,color:'rgba(255,255,255,.4)',margin:'0 6px'}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* ════ ORDERS TAB ════ */}
      {activeTab==='orders' && (
        <div className="space-y-5 kt-in">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:'Total Orders', value:orders.length,                                              bg:'#fff',    color:'#111827'},
              {label:'Active',       value:orders.filter(o=>o.status==='Active').length,               bg:'#fffbeb', color:'#92400e'},
              {label:'Completed',   value:orders.filter(o=>o.status==='Completed').length,            bg:'#f0fdf4', color:'#166534'},
              {label:'Total Value', value:`₹${orders.reduce((s,o)=>s+(o.total||0),0).toLocaleString('en-IN')}`, bg:'#fef3c7', color:'#7c3f00'},
            ].map((c,i)=>(
              <div key={i} className="kt-card p-4" style={{background:c.bg}}>
                <p className="text-xs font-medium text-gray-400 mb-1">{c.label}</p>
                <p className="text-xl font-bold" style={{color:c.color}}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Search + filter */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1" style={{minWidth:200}}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"/>
              <input className="kt-input" style={{paddingLeft:36}} placeholder="Customer ya Order No..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
            </div>
            <div className="flex gap-1.5">
              {['All','Active','Completed','Billed'].map(s=>(
                <button key={s} onClick={()=>setFilterStatus(s)}
                  className={`kt-tab ${filterStatus===s?'active':''}`} style={{padding:'8px 14px',fontSize:12}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-3">
            {filteredOrders.length===0 && (
              <div className="kt-card p-14 text-center">
                <div style={{width:56,height:56,borderRadius:16,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                  <Receipt style={{width:28,height:28,color:'#d97706'}}/>
                </div>
                <p className="text-gray-400 text-sm">Koi order nahi — "New Order" se shuru karo</p>
              </div>
            )}
            {filteredOrders.map((order,i)=>{
              const progress=getDeliveryProgress(order);
              const st=STATUS[order.status]||STATUS.Active;
              const oc=getOrderChallans(order.orderNo);
              return (
                <div key={i} className="kt-card p-5 kt-in">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-sm font-bold" style={{color:'#b45309'}}>{order.orderNo}</span>
                        <span className="status-pill" style={{background:st.bg,color:st.color}}>
                          <span className="status-dot" style={{background:st.dot}}/>
                          {order.status}
                        </span>
                        {order.includeGST && <span className="status-pill" style={{background:'#eff6ff',color:'#1d4ed8'}}>GST</span>}
                      </div>
                      <p className="font-bold text-gray-800 text-base mb-1 truncate">{order.customerName}</p>
                      <p className="text-xs text-gray-400">
                        {order.customerPhone && `${order.customerPhone} · `}
                        {new Date(order.orderDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                        &nbsp;·&nbsp;{(order.items||[]).length} items
                        &nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(order.total||0).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      {/* Progress */}
                      <div style={{width:168}}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-gray-400">Delivery</span>
                          <span className="text-xs font-bold" style={{color:progress===100?'#16a34a':'#d97706'}}>{progress}%</span>
                        </div>
                        <div className="prog-track">
                          <div className={`prog-fill ${progress===100?'done':''}`} style={{width:`${progress}%`}}/>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">{oc.length} challan{oc.length!==1?'s':''}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap justify-end">
                        {order.status!=='Billed' && (
                          <button className="btn-white" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>openChallanForm(order)}>
                            <TruckIcon className="w-3.5 h-3.5"/>Challan
                          </button>
                        )}
                        {(order.status==='Completed'||order.status==='Billed') && (
                          <button className="btn-amber" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{setSelectedOrder(order);setShowBillPreview(true);}}>
                            <Receipt className="w-3.5 h-3.5"/>Final Bill
                          </button>
                        )}
                        {order.status==='Active'&&progress>0 && (
                          <button className="icon-btn" onClick={()=>{setSelectedOrder(order);setShowBillPreview(true);}}>
                            <Eye className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════ CHALLANS TAB ════ */}
      {activeTab==='challans' && (
        <div className="space-y-3 kt-in">
          {challans.length===0 && (
            <div className="kt-card p-14 text-center">
              <div style={{width:56,height:56,borderRadius:16,background:'#fef9ec',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                <TruckIcon style={{width:28,height:28,color:'#d97706'}}/>
              </div>
              <p className="text-gray-400 text-sm">Koi challan nahi — order pe "Challan" click karo</p>
            </div>
          )}
          {[...challans].reverse().map((ch,i)=>(
            <div key={i} className="kt-card p-4 kt-in">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-sm font-bold" style={{color:'#b45309'}}>{ch.challanNo}</span>
                    <span className="text-xs text-gray-400">→ <strong className="text-gray-600">{ch.orderNo}</strong></span>
                    <span className="status-pill" style={{background:'#dcfce7',color:'#166534'}}>
                      <span className="status-dot" style={{background:'#22c55e'}}/>Delivered
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800">{ch.customerName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(ch.challanDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                    &nbsp;·&nbsp;{(ch.items||[]).length} items
                    &nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(ch.challanTotal||0).toLocaleString('en-IN')}</span>
                    {ch.deliveryNote&&` · ${ch.deliveryNote}`}
                  </p>
                </div>
                <button className="btn-white" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{
                  const order=orders.find(o=>o.orderNo===ch.orderNo);
                  if(order){const w=window.open('','_blank');w.document.write(getChallanPrintHTML(order,ch));w.document.close();setTimeout(()=>{w.focus();w.print();w.close();},600);}
                }}>
                  <Printer className="w-3.5 h-3.5"/>Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════ NEW ORDER MODAL ════ */}
      {showOrderForm && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in">
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{background:'#fef3c7',color:'#92400e'}}>1</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base m-0">New Order</h3>
                  <p className="text-xs text-gray-400 m-0">Customer ki requirement darz karo</p>
                </div>
              </div>
              <button className="icon-btn" onClick={()=>setShowOrderForm(false)}><X className="w-4 h-4"/></button>
            </div>
            <div className="kt-mbody space-y-6">
              {/* Customer */}
              <div>
                <p className="sec-label">Customer Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Customer Name *</label>
                    <input className="kt-input" placeholder="Naam dalein" value={orderForm.customerName} onChange={e=>setOrderForm(p=>({...p,customerName:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label>
                    <input className="kt-input" placeholder="+91 XXXXX XXXXX" value={orderForm.customerPhone} onChange={e=>setOrderForm(p=>({...p,customerPhone:e.target.value}))}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Address</label>
                    <textarea className="kt-input" rows={2} style={{resize:'none'}} placeholder="Delivery address..." value={orderForm.customerAddress} onChange={e=>setOrderForm(p=>({...p,customerAddress:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Order Date</label>
                    <input type="date" className="kt-input" value={orderForm.orderDate} onChange={e=>setOrderForm(p=>({...p,orderDate:e.target.value}))}/>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id="gst-c" checked={orderForm.includeGST} onChange={e=>setOrderForm(p=>({...p,includeGST:e.target.checked}))} style={{width:15,height:15,accentColor:'#d97706',cursor:'pointer'}}/>
                    <label htmlFor="gst-c" className="text-sm text-gray-700 cursor-pointer">GST (18%) include karein</label>
                  </div>
                </div>
              </div>
              {/* Items */}
              <div>
                <p className="sec-label">Items Required</p>
                <div className="kt-inset">
                  <table className="kt-tbl">
                    <thead><tr>
                      <th style={{width:28}}>#</th>
                      <th>Product</th>
                      <th style={{width:70}}>Unit</th>
                      <th className="r" style={{width:70}}>Qty</th>
                      <th className="r" style={{width:90}}>Rate (₹)</th>
                      <th className="r" style={{width:90}}>Amount</th>
                      <th style={{width:36}}></th>
                    </tr></thead>
                    <tbody>
                      {orderItems.map((item,idx)=>(
                        <tr key={item.uid}>
                          <td className="c text-gray-400 text-xs">{idx+1}</td>
                          <td style={{minWidth:180}}>
                            <select className="kt-input" style={{padding:'7px 9px',fontSize:12}} value={item.inventoryId||''} onChange={e=>updateOrderItem(item.uid,'inventoryId',e.target.value)}>
                              <option value="">-- Item chunein --</option>
                              {inventory.map(p=><option key={p.id} value={p.id}>{p.name} (Stock:{p.stock} {p.unit})</option>)}
                            </select>
                          </td>
                          <td><input className="kt-input" style={{padding:'7px 9px',fontSize:12,background:'#f9fafb',color:'#9ca3af'}} value={item.unit} readOnly/></td>
                          <td><input type="number" min="0" className="kt-input" style={{padding:'7px 9px',fontSize:12,textAlign:'right'}} placeholder="0" value={item.quantity} onChange={e=>updateOrderItem(item.uid,'quantity',e.target.value)}/></td>
                          <td><input type="number" min="0" className="kt-input" style={{padding:'7px 9px',fontSize:12,textAlign:'right'}} placeholder="₹" value={item.rate} onChange={e=>updateOrderItem(item.uid,'rate',e.target.value)}/></td>
                          <td className="r font-semibold text-gray-800 text-sm">₹{(item.amount||0).toLocaleString('en-IN')}</td>
                          <td className="c"><button className="icon-btn" onClick={()=>removeOrderItem(item.uid)}><Trash2 className="w-3 h-3 text-red-400"/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addOrderItem} style={{marginTop:10,display:'flex',alignItems:'center',gap:5,fontSize:13,color:'#d97706',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>
                  <Plus className="w-3 h-3"/>Item Add Karo
                </button>
              </div>
              {/* Total */}
              <div className="flex justify-end">
                <div className="total-box" style={{width:226,background:'#fffbeb',borderColor:'#fde68a'}}>
                  <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>Subtotal</span><span>₹{orderSubtotal.toLocaleString('en-IN')}</span></div>
                  {orderForm.includeGST && <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>GST (18%)</span><span>₹{(orderSubtotal*TAX_RATE).toFixed(0)}</span></div>}
                  <div className="flex justify-between font-bold text-base border-t border-amber-200 pt-2" style={{color:'#7c3f00'}}><span>Total</span><span>₹{(orderSubtotal*(orderForm.includeGST?1+TAX_RATE:1)).toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={()=>setShowOrderForm(false)}>Cancel</button>
              <button className="btn-amber" disabled={!orderForm.customerName||orderSubtotal===0||saving} onClick={handleSubmitOrder}>
                {saving?<><Loader2 className="w-4 h-4 animate-spin"/>Save ho raha hai...</>:<><CheckCircle className="w-4 h-4"/>Order Save Karo</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ CHALLAN FORM MODAL ════ */}
      {showChallanForm && selectedOrder && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in">
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{background:'#fde68a',color:'#78350f'}}>2</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base m-0">Delivery Challan</h3>
                  <p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
                </div>
              </div>
              <button className="icon-btn" onClick={()=>setShowChallanForm(false)}><X className="w-4 h-4"/></button>
            </div>
            <div className="kt-mbody space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Challan Date</label>
                  <input type="date" className="kt-input" value={challanDate} onChange={e=>setChallanDate(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Delivery Note <span className="text-gray-300">(optional)</span></label>
                  <input className="kt-input" placeholder="e.g. Part 1 of 2, Vehicle no..." value={deliveryNote} onChange={e=>setDeliveryNote(e.target.value)}/>
                </div>
              </div>
              <div>
                <p className="sec-label">Sirf jo bhej rahe ho utni qty daalo</p>
                <div className="kt-inset">
                  <table className="kt-tbl">
                    <thead><tr>
                      <th>Product</th>
                      <th className="r" style={{width:72}}>Ordered</th>
                      <th className="r" style={{width:80}}>Sent Before</th>
                      <th className="r" style={{width:80}}>Remaining</th>
                      <th className="r" style={{width:100}}>Sending Now</th>
                    </tr></thead>
                    <tbody>
                      {challanItems.map(it=>{
                        const rem=it.orderedQty-it.alreadySent;
                        return (
                          <tr key={it.uid}>
                            <td className="font-medium">{it.product} <span className="text-xs text-gray-400">({it.unit})</span></td>
                            <td className="r text-gray-600">{it.orderedQty}</td>
                            <td className="r font-semibold" style={{color:'#d97706'}}>{it.alreadySent||'—'}</td>
                            <td className="r font-bold" style={{color:rem<=0?'#16a34a':'#111827'}}>{rem<=0?'✓ Done':rem}</td>
                            <td style={{minWidth:90}}>
                              <input type="number" min="0" max={rem} className="kt-input"
                                style={{padding:'6px 9px',fontSize:12,textAlign:'right',background:rem<=0?'#f9fafb':undefined}}
                                value={it.sentQty} disabled={rem<=0}
                                onChange={e=>setChallanItems(prev=>prev.map(x=>x.uid===it.uid?{...x,sentQty:parseFloat(e.target.value)||0}:x))}/>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="total-box" style={{minWidth:210,background:'#fffbeb',borderColor:'#fde68a'}}>
                  <div className="flex justify-between font-bold text-base" style={{color:'#7c3f00'}}>
                    <span>Challan Total</span>
                    <span>₹{challanItems.reduce((s,it)=>s+(parseFloat(it.sentQty||0)*it.rate),0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs px-4 py-2.5 rounded-xl" style={{background:'#fef9ec',color:'#92400e',border:'1px solid #fde68a'}}>
                Save ke baad automatically print/PDF window khulegr
              </div>
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={()=>setShowChallanForm(false)}>Cancel</button>
              <button className="btn-amber" disabled={saving} onClick={handleSubmitChallan}>
                {saving?<><Loader2 className="w-4 h-4 animate-spin"/>Save ho raha hai...</>:<><TruckIcon className="w-4 h-4"/>Challan Save & Print</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ FINAL BILL MODAL ════ */}
      {showBillPreview && selectedOrder && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in" style={{maxWidth:660}}>
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{background:'#dcfce7',color:'#166534'}}>3</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base m-0">Final Invoice</h3>
                  <p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
                </div>
              </div>
              <button className="icon-btn" onClick={()=>setShowBillPreview(false)}><X className="w-4 h-4"/></button>
            </div>
            <div className="kt-mbody">
              {(()=>{
                const oc=challans.filter(c=>c.orderNo===selectedOrder.orderNo);
                const m={};
                oc.forEach(ch=>ch.items.forEach(it=>{if(!m[it.product])m[it.product]={product:it.product,unit:it.unit,rate:it.rate,totalSentQty:0,totalAmount:0};m[it.product].totalSentQty+=it.sentQty;m[it.product].totalAmount+=it.sentQty*it.rate;}));
                const li=Object.values(m), sub=li.reduce((s,i)=>s+i.totalAmount,0), tax=selectedOrder.includeGST?sub*TAX_RATE:0, total=sub+tax;
                return (
                  <div className="space-y-4">
                    <div className="text-xs px-4 py-2.5 rounded-xl" style={{background:'#fef3c7',color:'#78350f',border:'1px solid #fde68a'}}>
                      <span className="font-bold">Challans: </span>
                      {oc.length?oc.map(c=>`${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | '):'Koi challan nahi abhi'}
                    </div>
                    <div className="kt-inset">
                      <table className="kt-tbl">
                        <thead><tr>
                          <th style={{width:28}}>#</th>
                          <th>Product</th>
                          <th style={{width:50}}>Unit</th>
                          <th className="r" style={{width:70}}>Qty</th>
                          <th className="r" style={{width:80}}>Rate</th>
                          <th className="r" style={{width:90}}>Amount</th>
                        </tr></thead>
                        <tbody>
                          {li.map((it,i)=>(
                            <tr key={i}>
                              <td className="c text-gray-400 text-xs">{i+1}</td>
                              <td className="font-medium">{it.product}</td>
                              <td className="c text-gray-400">{it.unit}</td>
                              <td className="r font-semibold">{it.totalSentQty}</td>
                              <td className="r text-gray-500 text-xs">₹{parseFloat(it.rate).toLocaleString('en-IN')}</td>
                              <td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end">
                      <div className="total-box" style={{width:226,background:'#f0fdf4',borderColor:'#bbf7d0'}}>
                        <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN')}</span></div>
                        {selectedOrder.includeGST&&<div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>GST (18%)</span><span>₹{tax.toFixed(0)}</span></div>}
                        <div className="flex justify-between font-bold text-base border-t border-green-200 pt-2" style={{color:'#166534'}}><span>Grand Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={()=>setShowBillPreview(false)}>Close</button>
              {selectedOrder.status!=='Billed'&&<button className="btn-white" onClick={()=>printFinalBill(selectedOrder)}><Printer className="w-4 h-4"/>Print Preview</button>}
              {selectedOrder.status==='Completed'&&(
                <button className="btn-green" onClick={()=>{printFinalBill(selectedOrder);markBilled(selectedOrder.orderNo);}}>
                  <Receipt className="w-4 h-4"/>Generate & Mark Billed
                </button>
              )}
              {selectedOrder.status==='Billed'&&(
                <button className="btn-amber" onClick={()=>printFinalBill(selectedOrder)}>
                  <Printer className="w-4 h-4"/>Reprint Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}