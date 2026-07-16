// 'use client';

// import { useState, useEffect, useRef, Fragment } from 'react';
// import {
//   Loader2, PlusCircle, Search, ChevronDown,
//   ChevronUp, Download, Calendar, Eye, EyeOff,
// } from 'lucide-react';

// const LIGHT = {
//   maroon: '#7B1E1E', cream: '#FBF6F0', creamDark: '#F0E6DA',
//   textDark: '#2a1010', textMuted: '#6b5454', borderSoft: '#E8DCC8',
//   cardBg: '#ffffff', pageBg: '#FBF6F0', successColor: '#166534',
//   errorColor: '#dc2626', overlayBg: 'rgba(0,0,0,0.5)',
//   hoverBg: '#F0E6DA', inputBg: '#ffffff',
// };

// const DARK = {
//   maroon: '#e8a0a0', cream: '#1a1a2e', creamDark: '#2a2a45',
//   textDark: '#f0e8e8', textMuted: '#a89999', borderSoft: '#3a3a55',
//   cardBg: '#1e1e35', pageBg: '#0f0f1e', successColor: '#4ade80',
//   errorColor: '#fca5a5', overlayBg: 'rgba(0,0,0,0.7)',
//   hoverBg: '#2a2a45', inputBg: '#222240',
// };

// const SHOP_INFO = {
//   name: 'Krishna Timber & Plywoods',
//   address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
//   phone: '9826700196',
//   phone2: '9826275577',
//   gstin: '23ADCPC2098K1ZQ',
// };

// // ══════════════════════════════════════════════════════════
// // DATE UTILS
// // ══════════════════════════════════════════════════════════
// function formatDateDisplay(dateStr) {
//   if (!dateStr) return '—';
//   const val = dateStr.toString().trim();
//   if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
//     const [d, m, y] = val.split('-');
//     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     return `${d}-${months[parseInt(m) - 1]}-${y}`;
//   }
//   if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
//     const [d, m, y] = val.split('/');
//     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     return `${d.padStart(2,'0')}-${months[parseInt(m) - 1]}-${y}`;
//   }
//   if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
//     const dateObj = new Date(val);
//     if (!isNaN(dateObj.getTime())) {
//       return dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
//     }
//   }
//   return val;
// }

// function formatDateShort(dateStr) {
//   if (!dateStr) return { day: '—', year: '' };
//   const val = dateStr.toString().trim();
//   if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
//     const [d, m, y] = val.split('-');
//     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     return { day: `${d} ${months[parseInt(m) - 1]}`, year: y };
//   }
//   if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
//     const dateObj = new Date(val);
//     if (!isNaN(dateObj.getTime())) {
//       return {
//         day: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
//         year: dateObj.getFullYear().toString(),
//       };
//     }
//   }
//   return { day: val, year: '' };
// }

// function ddmmyyyyToDate(dateStr) {
//   if (!dateStr) return new Date(0);
//   const val = dateStr.toString().trim();
//   if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
//     const [d, m, y] = val.split('-');
//     return new Date(`${y}-${m}-${d}`);
//   }
//   if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
//     const [d, m, y] = val.split('/');
//     return new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
//   }
//   if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
//     return new Date(val);
//   }
//   const d = new Date(val);
//   return isNaN(d.getTime()) ? new Date(0) : d;
// }

// // ══════════════════════════════════════════════════════════
// // PRINT CSS
// // ══════════════════════════════════════════════════════════
// const PRINT_CSS = `
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// .page-wrapper{width:210mm;min-height:297mm;margin:10px auto;background:#fff;box-shadow:0 0 10px rgba(0,0,0,0.1);display:flex;flex-direction:column;page-break-after:always;}
// .page-wrapper:last-child{page-break-after:auto;margin-bottom:10px;}
// .page-content{padding:0;flex:1;display:flex;flex-direction:column;}
// .action-bar{display:flex;gap:12px;justify-content:center;padding:14px 20px;background:linear-gradient(135deg,#FBF6F0,#F0E6DA);border-bottom:2px solid #E8DCC8;}
// .action-btn{padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;letter-spacing:0.3px;}
// .btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
// .btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff}
// .btn-close{background:#fff;color:#333;border:1px solid #ddd}
// .ktp-header{background:#fff;color:#000;padding:14px 24px 12px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #000;}
// .ktp-logo-circle{width:80px;height:80px;border-radius:50%;border:3px solid #000;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
// .ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
// .ktp-header-center{flex:1;text-align:center}
// .ktp-brand-name{font-size:54px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;letter-spacing:1px;color:#7B1E1E;}
// .ktp-brand-sub{font-size:26px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:4px;margin-top:4px;color:#000;}
// .ktp-brand-addr{font-size:12.5px;margin-top:8px;letter-spacing:0.2px;font-weight:600;white-space:nowrap;color:#000;}
// .ktp-header-right-space{width:80px;flex-shrink:0}
// .ktp-meta{display:flex;justify-content:space-between;align-items:flex-start;border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:7px 18px;background:#fff;}
// .ktp-meta-left{display:flex;flex-direction:column;gap:2px}
// .ktp-since{font-size:11.5px;font-style:italic;color:#555;font-weight:500}
// .ktp-gstin{font-size:13.5px;font-weight:bold;color:#000;letter-spacing:0.5px}
// .ktp-dc-box{text-align:right}
// .ktp-dc-title{font-size:20px;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:2px;padding:2px 12px;display:inline-block;}
// .ktp-dc-details{font-size:13px;margin-top:3px;color:#000;font-weight:500}
// .ktp-info{padding:8px 14px;background:#fff;border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;}
// .old-amount-box{border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:8px 18px;background:#FFFBEB;display:flex;justify-content:space-between;align-items:center;}
// .old-amount-label{font-size:13px;font-weight:700;color:#92400E;line-height:1.4;}
// .old-amount-date{font-size:10px;font-weight:500;color:#B45309;font-style:italic;display:block;margin-top:2px;}
// .old-amount-value{font-size:15px;font-weight:bold;color:#92400E;}
// .ktp-table-wrap{border-left:2px solid #000;border-right:2px solid #000;flex:1;display:flex;flex-direction:column;}
// table.items{width:100%;border-collapse:collapse;flex:1;height:100%;}
// table.items thead tr{background:#fff !important;}
// table.items th{padding:8px 10px;font-size:13px;font-weight:bold;color:#000;text-align:center;border-right:1.5px solid #000;border-bottom:2px solid #000;border-top:1.5px solid #000;text-transform:uppercase;letter-spacing:0.5px;background:#fff;}
// table.items th:last-child{border-right:none}
// table.items th.tl{text-align:left}
// table.items tbody{height:100%;}
// table.items tbody tr{border-bottom:1px solid #000}
// table.items tbody tr:nth-child(even){background:#FAFAFA}
// table.items tbody tr:nth-child(odd){background:#fff}
// table.items tbody tr.return-row{background:#FEF2F2!important}
// table.items tbody tr.payment-row{background:#F0FDF4!important}
// table.items tbody tr.old-row{background:#FFFBEB!important}
// table.items td{padding:5px 8px;font-size:12.5px;border-right:1px solid #000;vertical-align:middle;line-height:1.3;color:#000;font-weight:500}
// table.items td:last-child{border-right:none}
// table.items td.r{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;}
// table.items td.c{text-align:center}
// table.items .item-detail{font-size:11px;color:#444;font-style:italic;font-weight:400;display:inline !important;}
// table.items .spacer-row{height:100%;}
// table.items .spacer-row td{height:auto!important;border-right:1px solid #000;border-bottom:none!important;}
// table.items .spacer-row td:last-child{border-right:none!important;}
// .ktp-continued{padding:12px;text-align:center;font-size:12px;color:#666;font-style:italic;border:2px solid #000;background:#fff;margin-bottom:20px;}
// .ktp-footer{border:2px solid #000;display:flex;background:#fff;padding:10px 18px;justify-content:space-between;page-break-inside:avoid;margin-bottom:20px;}
// .ktp-footer-left{flex:1;font-size:11px;color:#000;font-weight:700;}
// .ktp-footer-right{text-align:right;font-size:12px;font-weight:bold;color:#000;}
// @media print{
// html,body{margin:0!important;padding:0!important;background:#fff!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
// .action-bar{display:none!important}
// .page-wrapper{width:195mm!important;height:282mm!important;min-height:282mm!important;max-height:282mm!important;margin:0!important;padding:0!important;box-shadow:none!important;page-break-after:always!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;}
// .page-wrapper:last-child{page-break-after:auto!important;}
// .page-content{height:282mm!important;min-height:282mm!important;max-height:282mm!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;}
// .ktp-table-wrap{flex:1!important;border-left:2px solid #000!important;border-right:2px solid #000!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;}
// table.items{height:100%!important;flex:1!important;}
// table.items tbody{height:100%!important;}
// table.items .spacer-row{height:100%!important;}
// table.items .spacer-row td{height:100%!important;border-bottom:none!important;}
// *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important;}
// .ktp-header{background:#fff!important;border-bottom:2px solid #000!important;}
// .ktp-brand-name{color:#7B1E1E!important;}
// .ktp-meta{border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;background:#fff!important;}
// .ktp-info{border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;background:#fff!important;}
// .old-amount-box{background:#FFFBEB!important;border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;}
// .ktp-footer{border:2px solid #000!important;page-break-inside:avoid!important;margin-bottom:22px!important;}
// .ktp-continued{border:2px solid #000!important;background:#fff!important;margin-bottom:22px!important;}
// table.items thead tr{background:#fff!important;}
// table.items th{background:#fff!important;color:#000!important;border-right:1.5px solid #000!important;border-bottom:2px solid #000!important;border-top:1.5px solid #000!important;}
// table.items th:last-child{border-right:none!important;}
// table.items td{border-right:1px solid #000!important;}
// table.items td:last-child{border-right:none!important;}
// table.items tbody tr{border-bottom:1px solid #000!important;page-break-inside:avoid;break-inside:avoid;}
// table.items tbody tr.return-row{background:#FEF2F2!important;}
// table.items tbody tr.payment-row{background:#F0FDF4!important;}
// table.items tbody tr.old-row{background:#FFFBEB!important;}
// .ktp-logo-circle{border:3px solid #000!important;}
// }
// @page{size:A4;margin:5mm 5mm 5mm 5mm;}
// `;

// // ══════════════════════════════════════════════════════════
// // PDF GENERATOR
// // ══════════════════════════════════════════════════════════
// function getCustomerLedgerPrintHTML(
//   customerName, transactions, totals, fromDate, toDate, oldAmount, oldAmountDate
// ) {
//   const periodLabel =
//     fromDate || toDate
//       ? `${fromDate || 'Start'} → ${toDate || 'Today'}`
//       : 'All Transactions';

//   const oldAmountDateLabel = formatDateDisplay(oldAmountDate);

//   // Old balance row (only first page)
//   const oldRowHTML = oldAmount > 0
//     ? `<tr class="old-row">
//         <td class="c">${oldAmountDateLabel !== '—' ? oldAmountDateLabel : '—'}</td>
//         <td class="tl">
//           <span style="color:#92400E;font-weight:700;font-size:10px;">🕐 OLD BALANCE</span><br/>
//           Opening Balance
//           ${oldAmountDateLabel !== '—' ? `<br/><span style="font-size:9px;color:#B45309;font-style:italic;">As on ${oldAmountDateLabel}</span>` : ''}
//         </td>
//         <td class="r" style="color:#92400E;font-weight:700;">₹${oldAmount.toFixed(2)}</td>
//         <td class="r">—</td>
//         <td class="r">—</td>
//         <td class="r"><strong style="color:#92400E;">₹${oldAmount.toFixed(2)}</strong></td>
//       </tr>`
//     : '';

//   // Build all transaction rows
//   const allRows = transactions.map(t => {
//     let rowClass = '';
//     let typeLabel = '';
//     let typeColor = '';
//     if (t.type === 'return') {
//       rowClass = 'return-row'; typeLabel = 'RETURN'; typeColor = '#B91C1C';
//     } else if (t.type === 'payment') {
//       rowClass = 'payment-row'; typeLabel = 'PAYMENT'; typeColor = '#166534';
//     } else {
//       typeLabel = 'CHALLAN'; typeColor = '#000';
//     }

//     return `
//     <tr class="${rowClass}">
//       <td class="c">${formatDateDisplay(t.date)}</td>
//       <td class="tl">
//         <span style="color:${typeColor};font-weight:700;font-size:10px;">${typeLabel}</span><br/>
//         ${t.refDisplay || ''}
//       </td>
//       <td class="r">${t.billedAmount ? '₹' + t.billedAmount.toFixed(2) : '—'}</td>
//       <td class="r" style="color:#B91C1C;font-weight:${t.returnAmount ? '700' : '400'}">
//         ${t.returnAmount ? '-₹' + t.returnAmount.toFixed(2) : '—'}
//       </td>
//       <td class="r" style="color:#166534;font-weight:${t.paymentAmount ? '700' : '400'}">
//         ${t.paymentAmount ? '₹' + t.paymentAmount.toFixed(2) : '—'}
//       </td>
//       <td class="r"><strong>₹${t.runningBalance.toFixed(2)}</strong></td>
//     </tr>`;
//   });

//   // ✅ Totals row with proper Balance column
//   const totalRow = `
//     <tr style="background:#f0e6da;font-weight:bold;border-top:2px solid #000;">
//       <td colspan="2" class="tl" style="font-size:13px;color:#000;padding:8px 10px;">TOTALS</td>
//       <td class="r" style="color:#000;font-size:13px;padding:8px 10px;">
//         <strong>₹${totals.totalBilled.toFixed(2)}</strong>
//       </td>
//       <td class="r" style="color:#B91C1C;font-size:13px;padding:8px 10px;">
//         ${totals.totalReturns > 0 ? '-₹' + totals.totalReturns.toFixed(2) : '—'}
//       </td>
//       <td class="r" style="color:#166534;font-size:13px;padding:8px 10px;">
//         ${totals.totalPayments > 0 ? '₹' + totals.totalPayments.toFixed(2) : '—'}
//       </td>
//       <td class="r" style="font-size:14px;color:${totals.outstanding > 0 ? '#B91C1C' : '#166534'};background:#fff3cd;padding:8px 10px;">
//         <strong>₹${totals.outstanding.toFixed(2)}</strong>
//       </td>
//     </tr>`;

//   const oldAmountSection = oldAmount > 0
//     ? `<div class="old-amount-box">
//         <div>
//           <span class="old-amount-label">🕐 Previous Outstanding (Old Balance)</span>
//           ${oldAmountDateLabel !== '—' ? `<span class="old-amount-date">As on ${oldAmountDateLabel}</span>` : ''}
//         </div>
//         <span class="old-amount-value">₹${oldAmount.toFixed(2)}</span>
//       </div>`
//     : '';

//   // ✅ Better pagination - test with your data (17 entries)
//   // First page: header + meta + old box + table header = takes ~90mm
//   // Each row = ~9mm
//   // Footer = ~25mm
//   // Available for rows in first page = ~155mm / 9mm = 17 rows
//   // Other pages: header + meta + table header = ~75mm
//   // Available = ~180mm / 9mm = 20 rows
  
//   const FIRST_PAGE_ITEMS = oldAmount > 0 ? 16 : 18;
//   const OTHER_PAGE_ITEMS = 22;
//   const LAST_PAGE_ITEMS = 18; // Reduced kyunki totals + footer bhi hai

//   // Smart pagination
//   const pages = [];
//   let remaining = [...allRows];

//   if (remaining.length === 0) {
//     pages.push([]);
//   } else if (remaining.length <= FIRST_PAGE_ITEMS) {
//     // Sab first page pe
//     pages.push(remaining);
//   } else {
//     // First page fill
//     pages.push(remaining.slice(0, FIRST_PAGE_ITEMS));
//     remaining = remaining.slice(FIRST_PAGE_ITEMS);

//     // Middle pages
//     while (remaining.length > LAST_PAGE_ITEMS) {
//       pages.push(remaining.slice(0, OTHER_PAGE_ITEMS));
//       remaining = remaining.slice(OTHER_PAGE_ITEMS);
//     }

//     // Last page
//     if (remaining.length > 0) {
//       pages.push(remaining);
//     }
//   }

//   // Header (repeats on every page)
//   const headerHTML = `
//     <div class="ktp-header">
//       <div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP"/></div>
//       <div class="ktp-header-center">
//         <div class="ktp-brand-name">Krishna</div>
//         <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
//         <div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div>
//       </div>
//       <div class="ktp-header-right-space"></div>
//     </div>
//     <div class="ktp-meta">
//       <div class="ktp-meta-left">
//         <div class="ktp-since">Chhabra's Since 1979</div>
//         <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
//       </div>
//       <div class="ktp-dc-box">
//         <div class="ktp-dc-title">CUSTOMER LEDGER</div>
//         <div class="ktp-dc-details">Customer: <strong>${customerName}</strong></div>
//         <div class="ktp-dc-details">Period: <strong>${periodLabel}</strong></div>
//       </div>
//     </div>`;

//   const tableHeader = `
//     <thead><tr>
//       <th style="width:75px">Date</th>
//       <th class="tl">Type / Reference</th>
//       <th style="width:95px">Billed</th>
//       <th style="width:95px">Return</th>
//       <th style="width:95px">Payment</th>
//       <th style="width:105px">Balance</th>
//     </tr></thead>`;

//   // Build each page
//   const pagesHTML = pages.map((pageRows, pageIdx) => {
//     const isFirstPage = pageIdx === 0;
//     const isLastPage = pageIdx === pages.length - 1;

//     const showOldBox = isFirstPage ? oldAmountSection : '';
//     const showOldRow = isFirstPage ? oldRowHTML : '';
//     const showTotalRow = isLastPage ? totalRow : '';

//     const spacerRow = `<tr class="spacer-row"><td colspan="6">&nbsp;</td></tr>`;

//     const footerHTML = isLastPage
//       ? `<div class="ktp-footer">
//           <div class="ktp-footer-left">Certified that the above particulars are true and correct.</div>
//           <div class="ktp-footer-right">For Krishna Timber &amp; Plywoods<br/>Authorised Signatory</div>
//         </div>`
//       : `<div class="ktp-continued">Continued on next page... (Page ${pageIdx + 1} of ${pages.length})</div>`;

//     return `<div class="page-wrapper"><div class="page-content">
//       ${headerHTML}
//       ${showOldBox}
//       <div class="ktp-table-wrap">
//         <table class="items">
//           ${tableHeader}
//           <tbody>${showOldRow}${pageRows.join('')}${showTotalRow}${spacerRow}</tbody>
//         </table>
//       </div>
//       ${footerHTML}
//     </div></div>`;
//   }).join('');

//   return `<!DOCTYPE html>
// <html><head><meta charset="UTF-8"/>
// <title>Ledger - ${customerName}</title>
// <style>${PRINT_CSS}</style></head><body>
//   <div class="action-bar">
//     <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//     <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
//     <button class="action-btn btn-close" onclick="window.close()">✕ Close</button>
//   </div>
//   ${pagesHTML}
//   <script>
//     function savePDF(){
//       var ab=document.querySelector('.action-bar');
//       if(ab)ab.style.display='none';
//       window.print();
//       setTimeout(function(){if(ab)ab.style.display='flex';},1200);
//     }
//   </script>
// </body></html>`;
// }

// // ══════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════
// export default function CustomerLedger() {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [customerInput, setCustomerInput] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   const [ledger, setLedger] = useState([]);
//   const [paymentsList, setPaymentsList] = useState([]);
//   const [returnsList, setReturnsList] = useState([]);
//   const [totals, setTotals] = useState(null);
//   const [oldAmount, setOldAmount] = useState(0);
//   const [oldAmountDate, setOldAmountDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   const [expandedReturn, setExpandedReturn] = useState(null);

//   const T = darkMode ? DARK : LIGHT;

//   const [filterFrom, setFilterFrom] = useState('');
//   const [filterTo, setFilterTo] = useState('');
//   const [filterActive, setFilterActive] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentNotes, setPaymentNotes] = useState('');
//   const [saving, setSaving] = useState(false);

//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [bulkAmount, setBulkAmount] = useState('');
//   const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);
//   const [bulkMode, setBulkMode] = useState('Cash');
//   const [bulkNotes, setBulkNotes] = useState('');
//   const [bulkSaving, setBulkSaving] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem('ktp-dark-mode');
//     if (saved === 'true') setDarkMode(true);
//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = e => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setShowDropdown(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const res = await fetch('/api/billing-backend/challans');
//       const data = await res.json();
//       if (data.success && Array.isArray(data.data)) {
//         const unique = [...new Map(data.data.map(c => [c.customerName, c])).values()];
//         setCustomers(unique);
//         setFilteredCustomers(unique);
//       } else {
//         setCustomers([]);
//         setFilteredCustomers([]);
//       }
//     } catch {
//       setCustomers([]);
//       setFilteredCustomers([]);
//     }
//   };

//   const fetchLedger = async customer => {
//     if (!customer) return;
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `/api/billing-backend/customer-ledger?customerName=${encodeURIComponent(customer)}`
//       );
//       const data = await res.json();
//       if (data.success && data.data) {
//         setLedger(Array.isArray(data.data.ledger) ? data.data.ledger : []);
//         setPaymentsList(Array.isArray(data.data.payments) ? data.data.payments : []);
//         setReturnsList(Array.isArray(data.data.returns) ? data.data.returns : []);
//         setTotals(data.data.totals || null);
//         setOldAmount(data.data.oldAmount || 0);
//         setOldAmountDate(data.data.oldAmountDate || '');
//       } else {
//         setLedger([]); setPaymentsList([]); setReturnsList([]);
//         setTotals(null); setOldAmount(0); setOldAmountDate('');
//       }
//     } catch {
//       setLedger([]); setPaymentsList([]); setReturnsList([]);
//       setTotals(null); setOldAmount(0); setOldAmountDate('');
//     }
//     setLoading(false);
//   };

//   const isInRange = dateStr => {
//     if (!filterFrom && !filterTo) return true;
//     const d = ddmmyyyyToDate(dateStr);
//     d.setHours(0, 0, 0, 0);
//     if (filterFrom) {
//       const f = new Date(filterFrom);
//       f.setHours(0, 0, 0, 0);
//       if (d < f) return false;
//     }
//     if (filterTo) {
//       const t = new Date(filterTo);
//       t.setHours(23, 59, 59, 999);
//       if (d > t) return false;
//     }
//     return true;
//   };

//   const applyFilter = () => {
//     if (!filterFrom && !filterTo) {
//       alert('Please select at least one date.');
//       return;
//     }
//     setFilterActive(true);
//   };

//   const clearFilter = () => {
//     setFilterFrom('');
//     setFilterTo('');
//     setFilterActive(false);
//   };

//   const filteredLedger = filterActive ? ledger.filter(r => isInRange(r.date)) : ledger;
//   const filteredPaymentsList = filterActive ? paymentsList.filter(p => isInRange(p.paymentDate)) : paymentsList;
//   const filteredReturnsList = filterActive ? returnsList.filter(r => isInRange(r.returnDate)) : returnsList;

//   // ✅ FIXED: filteredTotals calculate from actual data
//   const filteredTotals = (() => {
//     if (!filterActive) return totals;
//     const totalBilled = filteredLedger.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
//     const totalReturns = filteredReturnsList.reduce((s, r) => s + (parseFloat(r.returnTotal) || 0), 0);
//     const totalPayments = filteredPaymentsList.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
//     const totalDue = oldAmount + totalBilled - totalReturns - totalPayments;
//     return { totalBilled, totalReturns, totalPayments, totalDue, oldAmount };
//   })();

//   const buildTimeline = () => {
//     const entries = [];

//     filteredLedger.forEach(ch => {
//       entries.push({
//         id: `ch-${ch.challanNo}`,
//         type: 'challan',
//         date: ch.date,
//         ref: ch.challanNo,
//         billedAmount: parseFloat(ch.amount) || 0,
//         returnAmount: 0,
//         paymentAmount: 0,
//         returns: ch.returns,
//         payments: ch.payments,
//         due: ch.due,
//         raw: ch,
//       });
//     });

//     filteredReturnsList.forEach(r => {
//       entries.push({
//         id: `rt-${r.returnNo}`,
//         type: 'return',
//         date: r.returnDate,
//         ref: r.returnNo,
//         billedAmount: 0,
//         returnAmount: parseFloat(r.returnTotal) || 0,
//         paymentAmount: 0,
//         reason: r.reason,
//         challanNo: r.challanNo,
//         items: r.items || [],
//         raw: r,
//       });
//     });

//     filteredPaymentsList.forEach(p => {
//       entries.push({
//         id: `py-${p.paymentId}`,
//         type: 'payment',
//         date: p.paymentDate,
//         ref: p.paymentId,
//         billedAmount: 0,
//         returnAmount: 0,
//         paymentAmount: parseFloat(p.amount) || 0,
//         mode: p.mode,
//         notes: p.notes,
//         challanNo: p.challanNo,
//         raw: p,
//       });
//     });

//     entries.sort((a, b) => ddmmyyyyToDate(a.date) - ddmmyyyyToDate(b.date));

//     let balance = oldAmount;
//     return entries.map(e => {
//       balance += e.billedAmount - e.returnAmount - e.paymentAmount;
//       return { ...e, runningBalance: balance };
//     });
//   };

//   const timeline = buildTimeline();

//   const handleCustomerInputChange = e => {
//     const val = e.target.value;
//     setCustomerInput(val);
//     setSelectedCustomer('');
//     setFilteredCustomers(
//       customers.filter(c => c.customerName.toLowerCase().includes(val.toLowerCase()))
//     );
//     setShowDropdown(true);
//   };

//   const selectCustomer = customerName => {
//     setCustomerInput(customerName);
//     setSelectedCustomer(customerName);
//     setShowDropdown(false);
//     clearFilter();
//     fetchLedger(customerName);
//   };

//   const openPaymentModal = challan => {
//     if (!challan?.challanNo) {
//       alert('Error: Challan number missing.');
//       return;
//     }
//     setSelectedChallan(challan);
//     setPaymentAmount('');
//     setPaymentDate(new Date().toISOString().split('T')[0]);
//     setPaymentMode('Cash');
//     setPaymentNotes('');
//     setShowModal(true);
//   };

//   const recordPayment = async () => {
//     if (!selectedChallan?.challanNo) { alert('Challan number missing'); return; }
//     const amount = parseFloat(paymentAmount);
//     if (isNaN(amount) || amount <= 0) { alert('Enter valid amount'); return; }
//     setSaving(true);
//     try {
//       const res = await fetch('/api/billing-backend/payments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           payment: {
//             challanNo: selectedChallan.challanNo,
//             customerName: selectedCustomer,
//             amount,
//             paymentDate,
//             mode: paymentMode,
//             notes: paymentNotes,
//           },
//         }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.error);
//       alert(`✅ Payment recorded for ${selectedChallan.challanNo}`);
//       setShowModal(false);
//       fetchLedger(selectedCustomer);
//     } catch (err) {
//       alert('Error: ' + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const recordBulkPayment = async () => {
//     if (!selectedCustomer) { alert('Select a customer first'); return; }
//     const amount = parseFloat(bulkAmount);
//     if (isNaN(amount) || amount <= 0) { alert('Enter valid amount'); return; }
//     setBulkSaving(true);
//     try {
//       const res = await fetch('/api/billing-backend/payments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           payment: {
//             challanNo: '',
//             customerName: selectedCustomer,
//             amount,
//             paymentDate: bulkDate,
//             mode: bulkMode,
//             notes: `Bulk - ${bulkNotes || ''}`,
//           },
//         }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.error);
//       alert(`✅ Bulk payment of ₹${amount} recorded`);
//       setShowBulkModal(false);
//       setBulkAmount('');
//       setBulkNotes('');
//       fetchLedger(selectedCustomer);
//     } catch (err) {
//       alert('Error: ' + err.message);
//     } finally {
//       setBulkSaving(false);
//     }
//   };

//   // ✅ COMPLETELY FIXED downloadLedgerPDF
//   const downloadLedgerPDF = () => {
//     if (!selectedCustomer) { alert('No customer selected'); return; }
    
//     const srcLedger = filterActive ? filteredLedger : ledger;
//     const srcPayments = filterActive ? filteredPaymentsList : paymentsList;
//     const srcReturns = filterActive ? filteredReturnsList : returnsList;

//     if (!srcLedger.length && !srcPayments.length && !srcReturns.length && !oldAmount) {
//       alert('No data available.');
//       return;
//     }

//     console.log('=== PDF DEBUG ===');
//     console.log('Challans:', srcLedger.length);
//     console.log('Returns:', srcReturns.length);
//     console.log('Payments:', srcPayments.length);
//     console.log('Old Amount:', oldAmount);

//     let allEntries = [];
    
//     // Challan entries
//     srcLedger.forEach(ch => {
//       allEntries.push({
//         date: ch.date,
//         type: 'challan',
//         refDisplay: ch.challanNo,
//         billedAmount: parseFloat(ch.amount) || 0,
//         returnAmount: 0,
//         paymentAmount: 0,
//       });
//     });
    
//     // Return entries
//     srcReturns.forEach(r => {
//       const amt = parseFloat(r.returnTotal) || 0;
//       if (amt > 0) {
//         allEntries.push({
//           date: r.returnDate,
//           type: 'return',
//           refDisplay: r.returnNo,
//           billedAmount: 0,
//           returnAmount: amt,
//           paymentAmount: 0,
//         });
//       }
//     });
    
//     // Payment entries
//     srcPayments.forEach(p => {
//       const amt = parseFloat(p.amount) || 0;
//       if (amt > 0) {
//         allEntries.push({
//           date: p.paymentDate,
//           type: 'payment',
//           refDisplay: p.paymentId || `Payment ${p.mode || ''}`,
//           billedAmount: 0,
//           returnAmount: 0,
//           paymentAmount: amt,
//         });
//       }
//     });

//     console.log('Total entries:', allEntries.length);

//     // Sort by date
//     allEntries.sort((a, b) => ddmmyyyyToDate(a.date) - ddmmyyyyToDate(b.date));

//     // Running balance
//     let balance = oldAmount;
//     const transactions = allEntries.map(entry => {
//       balance += entry.billedAmount - entry.returnAmount - entry.paymentAmount;
//       return { ...entry, runningBalance: balance };
//     });

//     // ✅ Calculate totals from actual entries (NOT from state)
//     const totalBilled = allEntries.reduce((s, e) => s + e.billedAmount, 0);
//     const totalReturns = allEntries.reduce((s, e) => s + e.returnAmount, 0);
//     const totalPayments = allEntries.reduce((s, e) => s + e.paymentAmount, 0);
//     const outstanding = oldAmount + totalBilled - totalReturns - totalPayments;

//     const totalsForPDF = {
//       totalBilled,
//       totalReturns,
//       totalPayments,
//       outstanding,
//     };

//     console.log('Totals:', totalsForPDF);

//     const fromLabel = filterActive && filterFrom ? formatDateDisplay(filterFrom) : '';
//     const toLabel = filterActive && filterTo ? formatDateDisplay(filterTo) : '';

//     const html = getCustomerLedgerPrintHTML(
//       selectedCustomer,
//       transactions,
//       totalsForPDF,
//       fromLabel,
//       toLabel,
//       oldAmount,
//       oldAmountDate
//     );
    
//     const win = window.open('', '_blank');
//     win.document.write(html);
//     win.document.close();
//   };

//   const inputStyle = {
//     width: '100%', padding: '9px 12px', borderRadius: 10,
//     border: `1.5px solid ${T.borderSoft}`, background: T.inputBg,
//     color: T.textDark, fontSize: 14, outline: 'none',
//   };
//   const labelStyle = {
//     display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600,
//     color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px',
//   };

//   const typeBadge = type => {
//     if (type === 'challan')
//       return { icon: '📦', label: 'CHALLAN', bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' };
//     if (type === 'return')
//       return { icon: '🔄', label: 'RETURN', bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' };
//     if (type === 'payment')
//       return { icon: '💸', label: 'PAYMENT', bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' };
//     return { icon: '📄', label: 'ENTRY', bg: '#F9FAFB', color: '#374151', border: '#E5E7EB' };
//   };

//   if (loading && !ledger.length && !paymentsList.length && !returnsList.length) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', padding: 40, background: T.pageBg }}>
//         <Loader2 className="animate-spin" size={40} style={{ color: T.maroon }} />
//       </div>
//     );
//   }

//   const oldAmountDateFormatted = formatDateDisplay(oldAmountDate);

//   return (
//     <div style={{ background: T.pageBg, minHeight: '100vh', padding: 20 }}>
//       <h1 style={{ color: T.maroon, marginBottom: 20 }}>Customer Ledger</h1>

//       {/* Customer Search */}
//       <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
//         <div style={{ position: 'relative', flex: 1, minWidth: 250 }} ref={dropdownRef}>
//           <div style={{ position: 'relative' }}>
//             <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
//             <input
//               type="text" value={customerInput}
//               onChange={handleCustomerInputChange}
//               onFocus={() => setShowDropdown(true)}
//               placeholder="Type customer name..."
//               style={{ ...inputStyle, paddingLeft: 34 }}
//             />
//           </div>
//           {showDropdown && filteredCustomers.length > 0 && (
//             <div style={{
//               position: 'absolute', top: '100%', left: 0, right: 0,
//               background: T.cardBg, border: `1px solid ${T.borderSoft}`,
//               borderRadius: 12, maxHeight: 250, overflowY: 'auto', zIndex: 10, marginTop: 4,
//             }}>
//               {filteredCustomers.map(c => (
//                 <div key={c.customerName} onClick={() => selectCustomer(c.customerName)}
//                   style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${T.borderSoft}`, color: T.textDark }}
//                   onMouseEnter={e => (e.currentTarget.style.background = T.hoverBg)}
//                   onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//                 >
//                   {c.customerName}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {selectedCustomer && (
//           <>
//             <button onClick={() => setShowBulkModal(true)}
//               style={{
//                 background: T.maroon, color: '#fff', padding: '9px 16px',
//                 borderRadius: 10, border: 'none', cursor: 'pointer',
//                 display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600,
//               }}
//             >
//               <PlusCircle size={16} /> Bulk Payment
//             </button>
//             <button onClick={downloadLedgerPDF}
//               style={{
//                 background: T.maroon, color: '#fff', padding: '9px 16px',
//                 borderRadius: 10, border: 'none', cursor: 'pointer',
//                 display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600,
//               }}
//             >
//               <Download size={16} /> Download PDF
//             </button>
//           </>
//         )}
//       </div>

//       {/* Date Filter */}
//       {selectedCustomer && (
//         <div style={{
//           background: T.cardBg,
//           border: `1.5px solid ${filterActive ? T.maroon : T.borderSoft}`,
//           borderRadius: 16, padding: '16px 20px', marginBottom: 24,
//           boxShadow: filterActive ? `0 0 0 3px ${T.maroon}22` : 'none',
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
//             <Calendar size={18} style={{ color: T.maroon }} />
//             <span style={{ fontWeight: 700, color: T.textDark, fontSize: 15 }}>Date Range Filter</span>
//             {filterActive && (
//               <span style={{
//                 marginLeft: 8, fontSize: 11, fontWeight: 700,
//                 background: T.maroon, color: '#fff', padding: '2px 10px', borderRadius: 20,
//               }}>ACTIVE</span>
//             )}
//           </div>
//           <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
//             <div style={{ flex: 1, minWidth: 160 }}>
//               <label style={labelStyle}>From Date</label>
//               <input type="date" value={filterFrom}
//                 onChange={e => { setFilterFrom(e.target.value); setFilterActive(false); }}
//                 style={inputStyle}
//               />
//             </div>
//             <div style={{ flex: 1, minWidth: 160 }}>
//               <label style={labelStyle}>To Date</label>
//               <input type="date" value={filterTo}
//                 onChange={e => { setFilterTo(e.target.value); setFilterActive(false); }}
//                 style={inputStyle}
//               />
//             </div>
//             <div style={{ display: 'flex', gap: 10, paddingBottom: 1 }}>
//               <button onClick={applyFilter}
//                 style={{
//                   padding: '9px 22px', borderRadius: 10, border: 'none',
//                   background: T.maroon, color: '#fff', fontWeight: 700,
//                   fontSize: 14, cursor: 'pointer',
//                   display: 'inline-flex', alignItems: 'center', gap: 6,
//                 }}
//               >
//                 <Search size={15} /> Apply
//               </button>
//               {filterActive && (
//                 <button onClick={clearFilter}
//                   style={{
//                     padding: '9px 18px', borderRadius: 10,
//                     border: `1.5px solid ${T.borderSoft}`,
//                     background: T.creamDark, color: T.textDark,
//                     fontWeight: 600, fontSize: 14, cursor: 'pointer',
//                   }}
//                 >Clear</button>
//               )}
//             </div>
//           </div>
//           {filterActive && (
//             <div style={{
//               marginTop: 12, padding: '8px 14px', borderRadius: 10,
//               background: `${T.maroon}12`, border: `1px solid ${T.maroon}33`,
//               fontSize: 13, color: T.textDark,
//             }}>
//               📅 Showing from{' '}
//               <strong>{filterFrom ? formatDateDisplay(filterFrom) : 'beginning'}</strong>
//               {' '}to{' '}
//               <strong>{filterTo ? formatDateDisplay(filterTo) : 'today'}</strong>
//               &nbsp;·&nbsp;
//               <span style={{ color: T.maroon, fontWeight: 700 }}>
//                 {filteredLedger.length} challan(s), {filteredReturnsList.length} return(s), {filteredPaymentsList.length} payment(s)
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* OLD AMOUNT CARD */}
//       {selectedCustomer && oldAmount > 0 && (
//         <div style={{
//           background: darkMode ? '#2a1f00' : '#FFFBEB',
//           border: `2px solid #F59E0B`, borderRadius: 16,
//           padding: '16px 20px', marginBottom: 20,
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           flexWrap: 'wrap', gap: 12, boxShadow: '0 2px 8px rgba(245,158,11,0.15)',
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//             <div style={{
//               width: 48, height: 48, borderRadius: '50%', background: '#F59E0B',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: 22, flexShrink: 0,
//             }}>🕐</div>
//             <div>
//               <div style={{
//                 fontSize: 12, fontWeight: 700, color: '#92400E',
//                 textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2,
//               }}>Previous Outstanding (Old Balance)</div>
//               <div style={{ fontSize: 12, color: '#B45309', fontStyle: 'italic' }}>
//                 {oldAmountDateFormatted !== '—' ? (
//                   <>📅 As on <strong>{oldAmountDateFormatted}</strong></>
//                 ) : (
//                   'Amount carried forward from before current billing system'
//                 )}
//               </div>
//             </div>
//           </div>
//           <div style={{ textAlign: 'right' }}>
//             <div style={{ fontSize: 28, fontWeight: 'bold', color: '#92400E', letterSpacing: '-0.5px' }}>
//               ₹{oldAmount.toFixed(2)}
//             </div>
//             <div style={{ fontSize: 11, color: '#B45309', marginTop: 2 }}>Included in total outstanding</div>
//           </div>
//         </div>
//       )}

//       {/* Summary Cards */}
//       {selectedCustomer && filteredTotals && (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
//           {[
//             { label: 'Total Billed', value: filteredTotals.totalBilled, color: T.textDark, prefix: '', bg: T.cardBg },
//             { label: 'Total Returns', value: filteredTotals.totalReturns, color: '#B91C1C', prefix: filteredTotals.totalReturns > 0 ? '-' : '', bg: darkMode ? '#2a1515' : '#FEF2F2', border: '#FECACA' },
//             { label: 'Total Paid', value: filteredTotals.totalPayments, color: T.successColor, prefix: '', bg: darkMode ? '#0a2a15' : '#F0FDF4', border: '#BBF7D0' },
//             {
//               label: 'Outstanding', value: filteredTotals.totalDue,
//               color: (filteredTotals.totalDue || 0) > 0 ? '#B91C1C' : T.successColor,
//               prefix: '', bg: T.cardBg,
//               note: oldAmount > 0 ? `Includes ₹${oldAmount.toFixed(0)} old balance` : '',
//             },
//           ].map(card => (
//             <div key={card.label} style={{
//               background: card.bg, padding: 16, borderRadius: 16,
//               border: `1px solid ${card.border || T.borderSoft}`,
//             }}>
//               <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{card.label}</div>
//               <div style={{ fontSize: 24, fontWeight: 'bold', color: card.color }}>
//                 {card.prefix}₹{(card.value || 0).toFixed(2)}
//               </div>
//               {card.note && (
//                 <div style={{ fontSize: 10, color: '#92400E', marginTop: 4, fontStyle: 'italic' }}>{card.note}</div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Timeline Table */}
//       {selectedCustomer && (timeline.length > 0 || oldAmount > 0) && (
//         <div style={{ marginBottom: 32 }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
//             <h2 style={{ margin: 0, color: T.textDark, fontSize: 18 }}>
//               📒 Account Statement
//               <span style={{ fontSize: 13, fontWeight: 400, color: T.textMuted, marginLeft: 10 }}>
//                 ({timeline.length} entries{oldAmount > 0 ? ' + opening balance' : ''})
//               </span>
//             </h2>
//           </div>

//           <div style={{
//             background: T.cardBg, borderRadius: 16, overflow: 'hidden',
//             border: `1px solid ${T.borderSoft}`,
//           }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ background: T.maroon, color: '#fff' }}>
//                   <th style={{ padding: '12px 10px', textAlign: 'center', width: 90, fontSize: 12 }}>DATE</th>
//                   <th style={{ padding: '12px 10px', textAlign: 'left', fontSize: 12 }}>TYPE / REFERENCE</th>
//                   <th style={{ padding: '12px 10px', textAlign: 'right', width: 110, fontSize: 12 }}>BILLED (₹)</th>
//                   <th style={{ padding: '12px 10px', textAlign: 'right', width: 110, fontSize: 12 }}>RETURN (₹)</th>
//                   <th style={{ padding: '12px 10px', textAlign: 'right', width: 110, fontSize: 12 }}>PAYMENT (₹)</th>
//                   <th style={{ padding: '12px 10px', textAlign: 'right', width: 120, fontSize: 12 }}>BALANCE (₹)</th>
//                   <th style={{ padding: '12px 10px', textAlign: 'center', width: 80, fontSize: 12 }}>ACTION</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Opening Balance Row */}
//                 {oldAmount > 0 && (
//                   <tr style={{ background: darkMode ? '#2a1f00' : '#FFFBEB', borderBottom: `1px solid #F59E0B` }}>
//                     <td style={{ padding: '10px 10px', textAlign: 'center', fontSize: 13, color: '#92400E' }}>
//                       {oldAmountDate ? (() => {
//                         const ds = formatDateShort(oldAmountDate);
//                         return (
//                           <>
//                             <div style={{ fontSize: 13, fontWeight: 600 }}>{ds.day}</div>
//                             <div style={{ fontSize: 10, opacity: 0.7 }}>{ds.year}</div>
//                           </>
//                         );
//                       })() : (
//                         <>
//                           <div style={{ fontSize: 18 }}>🕐</div>
//                           <div style={{ fontSize: 9, marginTop: 2 }}>OPENING</div>
//                         </>
//                       )}
//                     </td>
//                     <td style={{ padding: '10px 10px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                         <span style={{
//                           display: 'inline-flex', alignItems: 'center', gap: 4,
//                           padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
//                           background: '#FFFBEB', color: '#92400E', border: '1px solid #F59E0B',
//                           letterSpacing: '0.5px',
//                         }}>🕐 OLD BALANCE</span>
//                         <span style={{ fontWeight: 600, color: '#92400E', fontSize: 14 }}>Previous Outstanding</span>
//                       </div>
//                       <div style={{ fontSize: 11, color: '#B45309', marginTop: 2, paddingLeft: 2, fontStyle: 'italic' }}>
//                         {oldAmountDateFormatted !== '—'
//                           ? `📅 Balance as on ${oldAmountDateFormatted}`
//                           : 'Balance carried forward from old records'
//                         }
//                       </div>
//                     </td>
//                     <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#92400E' }}>
//                       ₹{oldAmount.toFixed(2)}
//                     </td>
//                     <td style={{ padding: '10px 10px', textAlign: 'right', color: T.textMuted }}>—</td>
//                     <td style={{ padding: '10px 10px', textAlign: 'right', color: T.textMuted }}>—</td>
//                     <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: 15, fontWeight: 'bold', color: '#92400E' }}>
//                       ₹{oldAmount.toFixed(2)}
//                     </td>
//                     <td style={{ padding: '10px 10px' }} />
//                   </tr>
//                 )}

//                 {/* Timeline Rows */}
//                 {timeline.map((entry, idx) => {
//                   const badge = typeBadge(entry.type);
//                   const isReturn = entry.type === 'return';
//                   const isPayment = entry.type === 'payment';
//                   const isChallan = entry.type === 'challan';
//                   const isExpanded = expandedReturn === entry.id;

//                   const rowBg = isReturn
//                     ? darkMode ? '#2a151520' : '#FEF2F2'
//                     : isPayment
//                     ? darkMode ? '#0a2a1520' : '#F0FDF4'
//                     : idx % 2 === 0 ? T.cardBg : darkMode ? T.creamDark : '#FAFAFA';

//                   const ds = formatDateShort(entry.date);

//                   return (
//                     <Fragment key={entry.id}>
//                       <tr style={{
//                         borderBottom: `1px solid ${T.borderSoft}`,
//                         background: rowBg, transition: 'background 0.15s',
//                       }}>
//                         <td style={{ padding: '10px 10px', textAlign: 'center', fontSize: 13, color: T.textMuted }}>
//                           <div style={{ fontWeight: 600 }}>{ds.day}</div>
//                           <div style={{ fontSize: 10, opacity: 0.7 }}>{ds.year}</div>
//                         </td>
//                         <td style={{ padding: '10px 10px' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                             <span style={{
//                               display: 'inline-flex', alignItems: 'center', gap: 4,
//                               padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
//                               background: badge.bg, color: badge.color,
//                               border: `1px solid ${badge.border}`, letterSpacing: '0.5px',
//                             }}>
//                               {badge.icon} {badge.label}
//                             </span>
//                             <span style={{
//                               fontWeight: 600, color: T.textDark, fontSize: 14, fontFamily: 'monospace',
//                             }}>
//                               {entry.ref}
//                             </span>
//                           </div>
//                           {isPayment && entry.raw && (
//                             <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, paddingLeft: 2 }}>
//                               {entry.raw.challanNo ? `Challan: ${entry.raw.challanNo}` : 'Bulk Payment'}
//                               {entry.mode ? ` · ${entry.mode}` : ''}
//                               {entry.notes ? ` · ${entry.notes}` : ''}
//                             </div>
//                           )}
//                           {isReturn && entry.challanNo && (
//                             <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, paddingLeft: 2 }}>
//                               Challan: {entry.challanNo}
//                               {entry.reason ? ` · ${entry.reason}` : ''}
//                             </div>
//                           )}
//                           {isChallan && entry.raw && (entry.raw.returns > 0 || entry.raw.payments > 0) && (
//                             <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, paddingLeft: 2 }}>
//                               {entry.raw.returns > 0 ? `Return: -₹${entry.raw.returns.toFixed(0)}` : ''}
//                               {entry.raw.returns > 0 && entry.raw.payments > 0 ? ' · ' : ''}
//                               {entry.raw.payments > 0 ? `Paid: ₹${entry.raw.payments.toFixed(0)}` : ''}
//                               {entry.raw.due > 0 ? ` · Due: ₹${entry.raw.due.toFixed(0)}` : ''}
//                             </div>
//                           )}
//                         </td>
//                         <td style={{
//                           padding: '10px 10px', textAlign: 'right', fontSize: 14,
//                           fontWeight: entry.billedAmount ? 600 : 400,
//                           color: entry.billedAmount ? T.textDark : T.textMuted,
//                         }}>
//                           {entry.billedAmount ? `₹${entry.billedAmount.toFixed(2)}` : '—'}
//                         </td>
//                         <td style={{
//                           padding: '10px 10px', textAlign: 'right', fontSize: 14,
//                           fontWeight: entry.returnAmount ? 700 : 400,
//                           color: entry.returnAmount ? '#B91C1C' : T.textMuted,
//                         }}>
//                           {entry.returnAmount ? `-₹${entry.returnAmount.toFixed(2)}` : '—'}
//                         </td>
//                         <td style={{
//                           padding: '10px 10px', textAlign: 'right', fontSize: 14,
//                           fontWeight: entry.paymentAmount ? 700 : 400,
//                           color: entry.paymentAmount ? T.successColor : T.textMuted,
//                         }}>
//                           {entry.paymentAmount ? `₹${entry.paymentAmount.toFixed(2)}` : '—'}
//                         </td>
//                         <td style={{
//                           padding: '10px 10px', textAlign: 'right', fontSize: 15, fontWeight: 'bold',
//                           color: entry.runningBalance > 0 ? '#B91C1C' : T.successColor,
//                         }}>
//                           ₹{entry.runningBalance.toFixed(2)}
//                         </td>
//                         <td style={{ padding: '10px 10px', textAlign: 'center' }}>
//                           {isChallan && entry.raw?.due > 0 && (
//                             <button onClick={() => openPaymentModal(entry.raw)}
//                               style={{
//                                 background: T.maroon, color: '#fff', border: 'none',
//                                 borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
//                                 fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3,
//                               }}
//                             >
//                               <PlusCircle size={12} /> Pay
//                             </button>
//                           )}
//                           {isReturn && entry.items?.length > 0 && (
//                             <button onClick={() => setExpandedReturn(isExpanded ? null : entry.id)}
//                               style={{
//                                 background: 'transparent', color: '#B91C1C',
//                                 border: `1px solid #FECACA`, borderRadius: 8,
//                                 padding: '5px 10px', cursor: 'pointer', fontSize: 11,
//                                 display: 'inline-flex', alignItems: 'center', gap: 3,
//                               }}
//                             >
//                               {isExpanded ? <EyeOff size={12} /> : <Eye size={12} />}
//                               {isExpanded ? 'Hide' : 'Items'}
//                             </button>
//                           )}
//                         </td>
//                       </tr>

//                       {/* Expanded Return Items */}
//                       {isReturn && isExpanded && entry.items?.length > 0 && (
//                         <tr>
//                           <td colSpan={7} style={{ padding: 0, background: darkMode ? '#1a1020' : '#FFF5F5' }}>
//                             <div style={{ padding: '12px 20px 12px 40px' }}>
//                               <div style={{ fontSize: 12, fontWeight: 700, color: '#B91C1C', marginBottom: 8 }}>
//                                 📋 Returned Items — {entry.ref}
//                               </div>
//                               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
//                                 <thead>
//                                   <tr>
//                                     {['#', 'Product', 'Size', 'Qty', 'Rate', 'Amount'].map(h => (
//                                       <th key={h} style={{
//                                         padding: '6px 8px',
//                                         textAlign: ['Qty', 'Rate', 'Amount'].includes(h) ? 'right' : h === '#' ? 'center' : 'left',
//                                         borderBottom: `1px solid #FECACA`, color: '#B91C1C', fontWeight: 600,
//                                       }}>{h}</th>
//                                     ))}
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {entry.items.map((item, i) => (
//                                     <tr key={i} style={{ borderBottom: `1px solid ${darkMode ? '#3a2030' : '#FEE2E2'}` }}>
//                                       <td style={{ padding: '5px 8px', textAlign: 'center', color: T.textMuted }}>{i + 1}</td>
//                                       <td style={{ padding: '5px 8px', fontWeight: 600, color: T.textDark }}>
//                                         {item.product}
//                                         {item.lengthDisplay && item.lengthDisplay !== "0'-0\"" && (
//                                           <span style={{ fontSize: 10, color: T.textMuted, marginLeft: 4 }}>({item.lengthDisplay})</span>
//                                         )}
//                                       </td>
//                                       <td style={{ padding: '5px 8px', color: T.textMuted }}>{item.size || '—'}</td>
//                                       <td style={{ padding: '5px 8px', textAlign: 'right', color: '#B91C1C', fontWeight: 600 }}>
//                                         {parseFloat(item.returnQty).toFixed(3)} {item.unit}
//                                         {item.returnPcs && parseFloat(item.returnPcs) !== parseFloat(item.returnQty) && (
//                                           <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 400, marginTop: 2 }}>
//                                             ({parseFloat(item.returnPcs)} pcs)
//                                           </div>
//                                         )}
//                                       </td>
//                                       <td style={{ padding: '5px 8px', textAlign: 'right', color: T.textDark }}>
//                                         ₹{parseFloat(item.rate).toLocaleString()}
//                                       </td>
//                                       <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#B91C1C' }}>
//                                         -₹{parseFloat(item.returnAmount).toFixed(2)}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </Fragment>
//                   );
//                 })}
//               </tbody>

//               <tfoot>
//                 <tr style={{ background: T.creamDark, borderTop: `2px solid ${T.maroon}` }}>
//                   <td colSpan={2} style={{ padding: '12px 10px', fontWeight: 'bold', color: T.textDark, fontSize: 14 }}>
//                     TOTALS
//                     {oldAmount > 0 && (
//                       <span style={{ fontSize: 11, fontWeight: 400, color: '#92400E', marginLeft: 8, fontStyle: 'italic' }}>
//                         (incl. ₹{oldAmount.toFixed(0)} old balance{oldAmountDateFormatted !== '—' ? ` as on ${oldAmountDateFormatted}` : ''})
//                       </span>
//                     )}
//                   </td>
//                   <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: T.textDark }}>
//                     ₹{(filteredTotals?.totalBilled || 0).toFixed(2)}
//                   </td>
//                   <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: '#B91C1C' }}>
//                     {(filteredTotals?.totalReturns || 0) > 0 ? `-₹${(filteredTotals?.totalReturns || 0).toFixed(2)}` : '—'}
//                   </td>
//                   <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: T.successColor }}>
//                     {(filteredTotals?.totalPayments || 0) > 0 ? `₹${(filteredTotals?.totalPayments || 0).toFixed(2)}` : '—'}
//                   </td>
//                   <td style={{
//                     padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 16,
//                     color: (filteredTotals?.totalDue || 0) > 0 ? '#B91C1C' : T.successColor,
//                     background: '#fff3cd',
//                   }}>
//                     ₹{(filteredTotals?.totalDue || 0).toFixed(2)}
//                   </td>
//                   <td />
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* No Data */}
//       {selectedCustomer && timeline.length === 0 && oldAmount === 0 && !loading && (
//         <div style={{
//           textAlign: 'center', padding: 60, background: T.cardBg, borderRadius: 16, color: T.textMuted,
//         }}>
//           <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
//           <p style={{ fontSize: 16, fontWeight: 600 }}>No transactions found</p>
//           <p style={{ fontSize: 13, marginTop: 4 }}>
//             {filterActive ? 'Try changing the date range.' : 'This customer has no challans, returns or payments.'}
//           </p>
//         </div>
//       )}

//       {/* Per-Challan Payment Modal */}
//       {showModal && selectedChallan && (
//         <div
//           style={{
//             position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//           onClick={() => setShowModal(false)}
//         >
//           <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }}
//             onClick={e => e.stopPropagation()}
//           >
//             <h3 style={{ marginBottom: 16, color: T.textDark }}>
//               Record Payment for {selectedChallan.challanNo}
//             </h3>
//             {[
//               { label: 'Amount (₹)', el: <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={inputStyle} /> },
//               { label: 'Date', el: <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={inputStyle} /> },
//               { label: 'Mode', el: (
//                 <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={inputStyle}>
//                   <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
//                 </select>
//               )},
//               { label: 'Notes', el: <input type="text" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} style={inputStyle} placeholder="Optional" /> },
//             ].map(f => (
//               <div key={f.label} style={{ marginBottom: 14 }}>
//                 <label style={labelStyle}>{f.label}</label>
//                 {f.el}
//               </div>
//             ))}
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
//               <button onClick={() => setShowModal(false)}
//                 style={{
//                   padding: '8px 18px', background: T.creamDark,
//                   border: `1px solid ${T.borderSoft}`, borderRadius: 8,
//                   cursor: 'pointer', color: T.textDark,
//                 }}
//               >Cancel</button>
//               <button onClick={recordPayment} disabled={saving}
//                 style={{
//                   padding: '8px 18px', background: T.maroon, color: '#fff',
//                   border: 'none', borderRadius: 8, cursor: 'pointer',
//                   display: 'inline-flex', alignItems: 'center', gap: 6,
//                 }}
//               >
//                 {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Payment'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk Payment Modal */}
//       {showBulkModal && selectedCustomer && (
//         <div
//           style={{
//             position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//           onClick={() => setShowBulkModal(false)}
//         >
//           <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }}
//             onClick={e => e.stopPropagation()}
//           >
//             <h3 style={{ marginBottom: 16, color: T.textDark }}>
//               Bulk Payment for {selectedCustomer}
//             </h3>
//             {[
//               { label: 'Amount (₹)', el: <input type="number" value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} style={inputStyle} /> },
//               { label: 'Date', el: <input type="date" value={bulkDate} onChange={e => setBulkDate(e.target.value)} style={inputStyle} /> },
//               { label: 'Mode', el: (
//                 <select value={bulkMode} onChange={e => setBulkMode(e.target.value)} style={inputStyle}>
//                   <option>Cash</option><option>Cheque</option><option>RTGS</option>
//                   <option>NEFT</option><option>UPI</option><option>Bank Transfer</option>
//                 </select>
//               )},
//               { label: 'Notes', el: <input type="text" value={bulkNotes} onChange={e => setBulkNotes(e.target.value)} style={inputStyle} placeholder="Remark" /> },
//             ].map(f => (
//               <div key={f.label} style={{ marginBottom: 14 }}>
//                 <label style={labelStyle}>{f.label}</label>
//                 {f.el}
//               </div>
//             ))}
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
//               <button onClick={() => setShowBulkModal(false)}
//                 style={{
//                   padding: '8px 18px', background: T.creamDark,
//                   border: `1px solid ${T.borderSoft}`, borderRadius: 8,
//                   cursor: 'pointer', color: T.textDark,
//                 }}
//               >Cancel</button>
//               <button onClick={recordBulkPayment} disabled={bulkSaving}
//                 style={{
//                   padding: '8px 18px', background: T.maroon, color: '#fff',
//                   border: 'none', borderRadius: 8, cursor: 'pointer',
//                   display: 'inline-flex', alignItems: 'center', gap: 6,
//                 }}
//               >
//                 {bulkSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Bulk Payment'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import {
  Loader2, PlusCircle, Search, ChevronDown,
  ChevronUp, Download, Calendar, Eye, EyeOff,
} from 'lucide-react';

const LIGHT = {
  maroon: '#7B1E1E', cream: '#FBF6F0', creamDark: '#F0E6DA',
  textDark: '#2a1010', textMuted: '#6b5454', borderSoft: '#E8DCC8',
  cardBg: '#ffffff', pageBg: '#FBF6F0', successColor: '#166534',
  errorColor: '#dc2626', overlayBg: 'rgba(0,0,0,0.5)',
  hoverBg: '#F0E6DA', inputBg: '#ffffff',
};

const DARK = {
  maroon: '#e8a0a0', cream: '#1a1a2e', creamDark: '#2a2a45',
  textDark: '#f0e8e8', textMuted: '#a89999', borderSoft: '#3a3a55',
  cardBg: '#1e1e35', pageBg: '#0f0f1e', successColor: '#4ade80',
  errorColor: '#fca5a5', overlayBg: 'rgba(0,0,0,0.7)',
  hoverBg: '#2a2a45', inputBg: '#222240',
};

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '9826700196',
  phone2: '9826275577',
  gstin: '23ADCPC2098K1ZQ',
};

// ══════════════════════════════════════════════════════════
// DATE UTILS
// ══════════════════════════════════════════════════════════
function formatDateDisplay(dateStr) {
  if (!dateStr) return '—';
  const val = dateStr.toString().trim();
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [d, m, y] = val.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d}-${months[parseInt(m) - 1]}-${y}`;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.padStart(2,'0')}-${months[parseInt(m) - 1]}-${y}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const dateObj = new Date(val);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
  return val;
}

function formatDateShort(dateStr) {
  if (!dateStr) return { day: '—', year: '' };
  const val = dateStr.toString().trim();
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [d, m, y] = val.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return { day: `${d} ${months[parseInt(m) - 1]}`, year: y };
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const dateObj = new Date(val);
    if (!isNaN(dateObj.getTime())) {
      return {
        day: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        year: dateObj.getFullYear().toString(),
      };
    }
  }
  return { day: val, year: '' };
}

function ddmmyyyyToDate(dateStr) {
  if (!dateStr) return new Date(0);
  const val = dateStr.toString().trim();
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [d, m, y] = val.split('-');
    return new Date(`${y}-${m}-${d}`);
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    return new Date(val);
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

// ══════════════════════════════════════════════════════════
// PRINT CSS - Aapka original + Auto page-break fix
// ══════════════════════════════════════════════════════════
const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page-wrapper{width:210mm;min-height:297mm;margin:10px auto;background:#fff;box-shadow:0 0 10px rgba(0,0,0,0.1);display:flex;flex-direction:column;}
.page-content{padding:0;flex:1;display:flex;flex-direction:column;}
.action-bar{display:flex;gap:12px;justify-content:center;padding:14px 20px;background:linear-gradient(135deg,#FBF6F0,#F0E6DA);border-bottom:2px solid #E8DCC8;}
.action-btn{padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;letter-spacing:0.3px;}
.btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
.btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff}
.btn-close{background:#fff;color:#333;border:1px solid #ddd}
.ktp-header{background:#fff;color:#000;padding:14px 24px 12px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #000;}
.ktp-logo-circle{width:80px;height:80px;border-radius:50%;border:3px solid #000;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
.ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:54px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;letter-spacing:1px;color:#7B1E1E;}
.ktp-brand-sub{font-size:26px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:4px;margin-top:4px;color:#000;}
.ktp-brand-addr{font-size:12.5px;margin-top:8px;letter-spacing:0.2px;font-weight:600;white-space:nowrap;color:#000;}
.ktp-header-right-space{width:80px;flex-shrink:0}
.ktp-meta{display:flex;justify-content:space-between;align-items:flex-start;border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:7px 18px;background:#fff;}
.ktp-meta-left{display:flex;flex-direction:column;gap:2px}
.ktp-since{font-size:11.5px;font-style:italic;color:#555;font-weight:500}
.ktp-gstin{font-size:13.5px;font-weight:bold;color:#000;letter-spacing:0.5px}
.ktp-dc-box{text-align:right}
.ktp-dc-title{font-size:20px;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:2px;padding:2px 12px;display:inline-block;}
.ktp-dc-details{font-size:13px;margin-top:3px;color:#000;font-weight:500}
.ktp-info{padding:8px 14px;background:#fff;border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;}
.old-amount-box{border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:8px 18px;background:#FFFBEB;display:flex;justify-content:space-between;align-items:center;}
.old-amount-label{font-size:13px;font-weight:700;color:#92400E;line-height:1.4;}
.old-amount-date{font-size:10px;font-weight:500;color:#B45309;font-style:italic;display:block;margin-top:2px;}
.old-amount-value{font-size:15px;font-weight:bold;color:#92400E;}
.ktp-table-wrap{border-left:2px solid #000;border-right:2px solid #000;flex:1;}
table.items{width:100%;border-collapse:collapse}
table.items thead{display:table-header-group;}
table.items thead tr{background:#fff !important;}
table.items th{padding:9px 10px;font-size:14px;font-weight:bold;color:#000;text-align:center;border-right:1.5px solid #000;border-bottom:2px solid #000;border-top:1.5px solid #000;text-transform:uppercase;letter-spacing:0.5px;background:#fff;}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #000;page-break-inside:avoid !important;break-inside:avoid !important;}
table.items tbody tr:nth-child(even){background:#FAFAFA}
table.items tbody tr:nth-child(odd){background:#fff}
table.items tbody tr.return-row{background:#FEF2F2!important}
table.items tbody tr.payment-row{background:#F0FDF4!important}
table.items tbody tr.old-row{background:#FFFBEB!important}
table.items tbody tr.totals-row{page-break-inside:avoid !important;break-inside:avoid !important;}
table.items td{padding:7px 10px;font-size:15.5px;border-right:1px solid #000;vertical-align:top;line-height:1.4;color:#000;font-weight:500}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
table.items td.c{text-align:center}
table.items .item-detail{font-size:13px;color:#444;font-style:italic;font-weight:400;display:inline !important;}
.ktp-footer{border:2px solid #000;display:flex;background:#fff;padding:12px 18px;justify-content:space-between;page-break-inside:avoid !important;break-inside:avoid !important;}
.ktp-footer-left{flex:1;font-size:11px;color:#000;font-weight:700;}
.ktp-footer-right{text-align:right;font-size:12px;font-weight:bold;color:#000;}
@media print{
html,body{margin:0!important;padding:0!important;background:#fff!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
.action-bar{display:none!important}
.page-wrapper{width:195mm!important;margin:0!important;padding:0!important;box-shadow:none!important;}
*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important;}

/* ✅ AUTO PAGE BREAK - Ye 3 rules important hain */
table.items thead{display:table-header-group !important;}
table.items tbody tr{page-break-inside:avoid !important;break-inside:avoid !important;}
.ktp-footer{page-break-inside:avoid !important;break-inside:avoid !important;}

.ktp-header{background:#fff!important;border-bottom:2px solid #000!important;}
.ktp-brand-name{color:#7B1E1E!important;}
.ktp-meta{border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;background:#fff!important;}
.ktp-info{border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;background:#fff!important;}
.old-amount-box{background:#FFFBEB!important;border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;}
.ktp-table-wrap{border-left:2px solid #000!important;border-right:2px solid #000!important;}
.ktp-footer{border:2px solid #000!important;}
table.items thead tr{background:#fff!important;}
table.items th{background:#fff!important;color:#000!important;border-right:1.5px solid #000!important;border-bottom:2px solid #000!important;border-top:1.5px solid #000!important;font-size:14px!important;}
table.items th:last-child{border-right:none!important;}
table.items td{border-right:1px solid #000!important;font-size:15.5px!important;padding:7px 10px!important;line-height:1.4!important;}
table.items td:last-child{border-right:none!important;}
table.items tbody tr{border-bottom:1px solid #000!important;}
table.items tbody tr.return-row{background:#FEF2F2!important;}
table.items tbody tr.payment-row{background:#F0FDF4!important;}
table.items tbody tr.old-row{background:#FFFBEB!important;}
.ktp-logo-circle{border:3px solid #000!important;}
}
@page{size:A4;margin:5mm 10mm 10mm 5mm;}
`;

// ══════════════════════════════════════════════════════════
// PDF GENERATOR - Aapka original code
// ══════════════════════════════════════════════════════════
function getCustomerLedgerPrintHTML(
  customerName, transactions, totals, fromDate, toDate, oldAmount, oldAmountDate
) {
  const periodLabel =
    fromDate || toDate
      ? `${fromDate || 'Start'} → ${toDate || 'Today'}`
      : 'All Transactions';

  const oldAmountDateLabel = formatDateDisplay(oldAmountDate);

  const oldRow = oldAmount > 0
    ? `<tr class="old-row">
        <td class="c">${oldAmountDateLabel !== '—' ? oldAmountDateLabel : '—'}</td>
        <td class="tl">
          <span style="color:#92400E;font-weight:700;font-size:11px;">🕐 OLD BALANCE</span><br/>
          Opening Balance (Previous Outstanding)
          ${oldAmountDateLabel !== '—' ? `<br/><span style="font-size:10px;color:#B45309;font-style:italic;">As on ${oldAmountDateLabel}</span>` : ''}
        </td>
        <td class="r" style="color:#92400E;font-weight:700;">₹${oldAmount.toFixed(2)}</td>
        <td class="r">—</td>
        <td class="r">—</td>
        <td class="r"><strong style="color:#92400E;">₹${oldAmount.toFixed(2)}</strong></td>
      </tr>`
    : '';

  const rows = transactions.map(t => {
    let rowClass = '';
    let typeLabel = '';
    let typeColor = '';
    if (t.type === 'return') {
      rowClass = 'return-row'; typeLabel = 'RETURN'; typeColor = '#B91C1C';
    } else if (t.type === 'payment') {
      rowClass = 'payment-row'; typeLabel = 'PAYMENT'; typeColor = '#166534';
    } else {
      typeLabel = 'CHALLAN'; typeColor = '#000';
    }

    return `
    <tr class="${rowClass}">
      <td class="c">${formatDateDisplay(t.date)}</td>
      <td class="tl">
        <span style="color:${typeColor};font-weight:700;font-size:11px;">${typeLabel}</span><br/>
        ${t.refDisplay || ''}
      </td>
      <td class="r">${t.billedAmount ? '₹' + t.billedAmount.toFixed(2) : '—'}</td>
      <td class="r" style="color:#B91C1C;font-weight:${t.returnAmount ? '700' : '400'}">
        ${t.returnAmount ? '-₹' + t.returnAmount.toFixed(2) : '—'}
      </td>
      <td class="r" style="color:#166534;font-weight:${t.paymentAmount ? '700' : '400'}">
        ${t.paymentAmount ? '₹' + t.paymentAmount.toFixed(2) : '—'}
      </td>
      <td class="r"><strong>₹${t.runningBalance.toFixed(2)}</strong></td>
    </tr>`;
  }).join('');

  const totalRow = `
    <tr class="totals-row" style="background:#f0e6da;font-weight:bold;border-top:2px solid #000;">
      <td colspan="2" class="tl" style="font-size:14px;color:#000;"><strong>TOTALS</strong></td>
      <td class="r" style="color:#000;"><strong>₹${totals.totalBilled.toFixed(2)}</strong></td>
      <td class="r" style="color:#B91C1C;">
        ${totals.totalReturns > 0 ? '<strong>-₹' + totals.totalReturns.toFixed(2) + '</strong>' : '—'}
      </td>
      <td class="r" style="color:#166534;">
        ${totals.totalPayments > 0 ? '<strong>₹' + totals.totalPayments.toFixed(2) + '</strong>' : '—'}
      </td>
      <td class="r" style="font-size:15px;color:${totals.outstanding > 0 ? '#B91C1C' : '#166534'};background:#fff3cd;">
        <strong>₹${totals.outstanding.toFixed(2)}</strong>
      </td>
    </tr>`;

  const oldAmountSection = oldAmount > 0
    ? `<div class="old-amount-box">
        <div>
          <span class="old-amount-label">🕐 Previous Outstanding (Old Balance)</span>
          ${oldAmountDateLabel !== '—' ? `<span class="old-amount-date">As on ${oldAmountDateLabel}</span>` : ''}
        </div>
        <span class="old-amount-value">₹${oldAmount.toFixed(2)}</span>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<title>Ledger - ${customerName}</title>
<style>${PRINT_CSS}</style></head><body>
  <div class="action-bar">
    <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
    <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
    <button class="action-btn btn-close" onclick="window.close()">✕ Close</button>
  </div>
  <div class="page-wrapper"><div class="page-content">
    <div class="ktp-header">
      <div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP"/></div>
      <div class="ktp-header-center">
        <div class="ktp-brand-name">Krishna</div>
        <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
        <div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div>
      </div>
      <div class="ktp-header-right-space"></div>
    </div>
    <div class="ktp-meta">
      <div class="ktp-meta-left">
        <div class="ktp-since">Chhabra's Since 1979</div>
        <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
      </div>
      <div class="ktp-dc-box">
        <div class="ktp-dc-title">CUSTOMER LEDGER</div>
        <div class="ktp-dc-details">Customer: <strong>${customerName}</strong></div>
        <div class="ktp-dc-details">Period: <strong>${periodLabel}</strong></div>
      </div>
    </div>
    ${oldAmountSection}
    <div class="ktp-table-wrap">
      <table class="items">
        <thead><tr>
          <th style="width:85px">Date</th>
          <th class="tl">Type / Reference</th>
          <th style="width:100px">Billed</th>
          <th style="width:100px">Return</th>
          <th style="width:100px">Payment</th>
          <th style="width:110px">Balance</th>
        </tr></thead>
        <tbody>${oldRow}${rows}${totalRow}</tbody>
      </table>
    </div>
    <div class="ktp-footer">
      <div class="ktp-footer-left">Certified that the above particulars are true and correct.</div>
      <div class="ktp-footer-right">For Krishna Timber &amp; Plywoods<br/>Authorised Signatory</div>
    </div>
  </div></div>
  <script>
    function savePDF(){
      var ab=document.querySelector('.action-bar');
      if(ab)ab.style.display='none';
      window.print();
      setTimeout(function(){if(ab)ab.style.display='flex';},1200);
    }
  </script>
</body></html>`;
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function CustomerLedger() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerInput, setCustomerInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [ledger, setLedger] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [returnsList, setReturnsList] = useState([]);
  const [totals, setTotals] = useState(null);
  const [oldAmount, setOldAmount] = useState(0);
  const [oldAmountDate, setOldAmountDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [expandedReturn, setExpandedReturn] = useState(null);

  const T = darkMode ? DARK : LIGHT;

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterActive, setFilterActive] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkMode, setBulkMode] = useState('Cash');
  const [bulkNotes, setBulkNotes] = useState('');
  const [bulkSaving, setBulkSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ktp-dark-mode');
    if (saved === 'true') setDarkMode(true);
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/billing-backend/challans');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const unique = [...new Map(data.data.map(c => [c.customerName, c])).values()];
        setCustomers(unique);
        setFilteredCustomers(unique);
      } else {
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch {
      setCustomers([]);
      setFilteredCustomers([]);
    }
  };

  const fetchLedger = async customer => {
    if (!customer) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/billing-backend/customer-ledger?customerName=${encodeURIComponent(customer)}`
      );
      const data = await res.json();
      if (data.success && data.data) {
        setLedger(Array.isArray(data.data.ledger) ? data.data.ledger : []);
        setPaymentsList(Array.isArray(data.data.payments) ? data.data.payments : []);
        setReturnsList(Array.isArray(data.data.returns) ? data.data.returns : []);
        setTotals(data.data.totals || null);
        setOldAmount(data.data.oldAmount || 0);
        setOldAmountDate(data.data.oldAmountDate || '');
      } else {
        setLedger([]); setPaymentsList([]); setReturnsList([]);
        setTotals(null); setOldAmount(0); setOldAmountDate('');
      }
    } catch {
      setLedger([]); setPaymentsList([]); setReturnsList([]);
      setTotals(null); setOldAmount(0); setOldAmountDate('');
    }
    setLoading(false);
  };

  const isInRange = dateStr => {
    if (!filterFrom && !filterTo) return true;
    const d = ddmmyyyyToDate(dateStr);
    d.setHours(0, 0, 0, 0);
    if (filterFrom) {
      const f = new Date(filterFrom);
      f.setHours(0, 0, 0, 0);
      if (d < f) return false;
    }
    if (filterTo) {
      const t = new Date(filterTo);
      t.setHours(23, 59, 59, 999);
      if (d > t) return false;
    }
    return true;
  };

  const applyFilter = () => {
    if (!filterFrom && !filterTo) {
      alert('Please select at least one date.');
      return;
    }
    setFilterActive(true);
  };

  const clearFilter = () => {
    setFilterFrom('');
    setFilterTo('');
    setFilterActive(false);
  };

  const filteredLedger = filterActive ? ledger.filter(r => isInRange(r.date)) : ledger;
  const filteredPaymentsList = filterActive ? paymentsList.filter(p => isInRange(p.paymentDate)) : paymentsList;
  const filteredReturnsList = filterActive ? returnsList.filter(r => isInRange(r.returnDate)) : returnsList;

  const filteredTotals = (() => {
    if (!filterActive) return totals;
    const totalBilled = filteredLedger.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const totalReturns = filteredReturnsList.reduce((s, r) => s + (parseFloat(r.returnTotal) || 0), 0);
    const totalPayments = filteredPaymentsList.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    const totalDue = oldAmount + totalBilled - totalReturns - totalPayments;
    return { totalBilled, totalReturns, totalPayments, totalDue, oldAmount };
  })();

  const buildTimeline = () => {
    const entries = [];

    filteredLedger.forEach(ch => {
      entries.push({
        id: `ch-${ch.challanNo}`,
        type: 'challan',
        date: ch.date,
        ref: ch.challanNo,
        billedAmount: parseFloat(ch.amount) || 0,
        returnAmount: 0,
        paymentAmount: 0,
        returns: ch.returns,
        payments: ch.payments,
        due: ch.due,
        raw: ch,
      });
    });

    filteredReturnsList.forEach(r => {
      entries.push({
        id: `rt-${r.returnNo}`,
        type: 'return',
        date: r.returnDate,
        ref: r.returnNo,
        billedAmount: 0,
        returnAmount: parseFloat(r.returnTotal) || 0,
        paymentAmount: 0,
        reason: r.reason,
        challanNo: r.challanNo,
        items: r.items || [],
        raw: r,
      });
    });

    filteredPaymentsList.forEach(p => {
      entries.push({
        id: `py-${p.paymentId}`,
        type: 'payment',
        date: p.paymentDate,
        ref: p.paymentId,
        billedAmount: 0,
        returnAmount: 0,
        paymentAmount: parseFloat(p.amount) || 0,
        mode: p.mode,
        notes: p.notes,
        challanNo: p.challanNo,
        raw: p,
      });
    });

    entries.sort((a, b) => ddmmyyyyToDate(a.date) - ddmmyyyyToDate(b.date));

    let balance = oldAmount;
    return entries.map(e => {
      balance += e.billedAmount - e.returnAmount - e.paymentAmount;
      return { ...e, runningBalance: balance };
    });
  };

  const timeline = buildTimeline();

  const handleCustomerInputChange = e => {
    const val = e.target.value;
    setCustomerInput(val);
    setSelectedCustomer('');
    setFilteredCustomers(
      customers.filter(c => c.customerName.toLowerCase().includes(val.toLowerCase()))
    );
    setShowDropdown(true);
  };

  const selectCustomer = customerName => {
    setCustomerInput(customerName);
    setSelectedCustomer(customerName);
    setShowDropdown(false);
    clearFilter();
    fetchLedger(customerName);
  };

  const openPaymentModal = challan => {
    if (!challan?.challanNo) {
      alert('Error: Challan number missing.');
      return;
    }
    setSelectedChallan(challan);
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMode('Cash');
    setPaymentNotes('');
    setShowModal(true);
  };

  const recordPayment = async () => {
    if (!selectedChallan?.challanNo) { alert('Challan number missing'); return; }
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) { alert('Enter valid amount'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/billing-backend/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment: {
            challanNo: selectedChallan.challanNo,
            customerName: selectedCustomer,
            amount,
            paymentDate,
            mode: paymentMode,
            notes: paymentNotes,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert(`✅ Payment recorded for ${selectedChallan.challanNo}`);
      setShowModal(false);
      fetchLedger(selectedCustomer);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const recordBulkPayment = async () => {
    if (!selectedCustomer) { alert('Select a customer first'); return; }
    const amount = parseFloat(bulkAmount);
    if (isNaN(amount) || amount <= 0) { alert('Enter valid amount'); return; }
    setBulkSaving(true);
    try {
      const res = await fetch('/api/billing-backend/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment: {
            challanNo: '',
            customerName: selectedCustomer,
            amount,
            paymentDate: bulkDate,
            mode: bulkMode,
            notes: `Bulk - ${bulkNotes || ''}`,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert(`✅ Bulk payment of ₹${amount} recorded`);
      setShowBulkModal(false);
      setBulkAmount('');
      setBulkNotes('');
      fetchLedger(selectedCustomer);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setBulkSaving(false);
    }
  };

  const downloadLedgerPDF = () => {
    if (!selectedCustomer) { alert('No customer selected'); return; }
    
    const srcLedger = filterActive ? filteredLedger : ledger;
    const srcPayments = filterActive ? filteredPaymentsList : paymentsList;
    const srcReturns = filterActive ? filteredReturnsList : returnsList;

    if (!srcLedger.length && !srcPayments.length && !srcReturns.length && !oldAmount) {
      alert('No data available.');
      return;
    }

    let allEntries = [];
    
    srcLedger.forEach(ch => {
      allEntries.push({
        date: ch.date,
        type: 'challan',
        refDisplay: ch.challanNo,
        billedAmount: parseFloat(ch.amount) || 0,
        returnAmount: 0,
        paymentAmount: 0,
      });
    });
    
    srcReturns.forEach(r => {
      const amt = parseFloat(r.returnTotal) || 0;
      if (amt > 0) {
        allEntries.push({
          date: r.returnDate,
          type: 'return',
          refDisplay: r.returnNo,
          billedAmount: 0,
          returnAmount: amt,
          paymentAmount: 0,
        });
      }
    });
    
    srcPayments.forEach(p => {
      const amt = parseFloat(p.amount) || 0;
      if (amt > 0) {
        allEntries.push({
          date: p.paymentDate,
          type: 'payment',
          refDisplay: p.paymentId || `Payment ${p.mode || ''}`,
          billedAmount: 0,
          returnAmount: 0,
          paymentAmount: amt,
        });
      }
    });

    allEntries.sort((a, b) => ddmmyyyyToDate(a.date) - ddmmyyyyToDate(b.date));

    let balance = oldAmount;
    const transactions = allEntries.map(entry => {
      balance += entry.billedAmount - entry.returnAmount - entry.paymentAmount;
      return { ...entry, runningBalance: balance };
    });

    const totalBilled = allEntries.reduce((s, e) => s + e.billedAmount, 0);
    const totalReturns = allEntries.reduce((s, e) => s + e.returnAmount, 0);
    const totalPayments = allEntries.reduce((s, e) => s + e.paymentAmount, 0);
    const outstanding = oldAmount + totalBilled - totalReturns - totalPayments;

    const totalsForPDF = {
      totalBilled,
      totalReturns,
      totalPayments,
      outstanding,
    };

    const fromLabel = filterActive && filterFrom ? formatDateDisplay(filterFrom) : '';
    const toLabel = filterActive && filterTo ? formatDateDisplay(filterTo) : '';

    const html = getCustomerLedgerPrintHTML(
      selectedCustomer,
      transactions,
      totalsForPDF,
      fromLabel,
      toLabel,
      oldAmount,
      oldAmountDate
    );
    
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1.5px solid ${T.borderSoft}`, background: T.inputBg,
    color: T.textDark, fontSize: 14, outline: 'none',
  };
  const labelStyle = {
    display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600,
    color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  const typeBadge = type => {
    if (type === 'challan')
      return { icon: '📦', label: 'CHALLAN', bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' };
    if (type === 'return')
      return { icon: '🔄', label: 'RETURN', bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' };
    if (type === 'payment')
      return { icon: '💸', label: 'PAYMENT', bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' };
    return { icon: '📄', label: 'ENTRY', bg: '#F9FAFB', color: '#374151', border: '#E5E7EB' };
  };

  if (loading && !ledger.length && !paymentsList.length && !returnsList.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40, background: T.pageBg }}>
        <Loader2 className="animate-spin" size={40} style={{ color: T.maroon }} />
      </div>
    );
  }

  const oldAmountDateFormatted = formatDateDisplay(oldAmountDate);

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', padding: 20 }}>
      <h1 style={{ color: T.maroon, marginBottom: 20 }}>Customer Ledger</h1>

      <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }} ref={dropdownRef}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input
              type="text" value={customerInput}
              onChange={handleCustomerInputChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Type customer name..."
              style={{ ...inputStyle, paddingLeft: 34 }}
            />
          </div>
          {showDropdown && filteredCustomers.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: T.cardBg, border: `1px solid ${T.borderSoft}`,
              borderRadius: 12, maxHeight: 250, overflowY: 'auto', zIndex: 10, marginTop: 4,
            }}>
              {filteredCustomers.map(c => (
                <div key={c.customerName} onClick={() => selectCustomer(c.customerName)}
                  style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${T.borderSoft}`, color: T.textDark }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {c.customerName}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCustomer && (
          <>
            <button onClick={() => setShowBulkModal(true)}
              style={{
                background: T.maroon, color: '#fff', padding: '9px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600,
              }}
            >
              <PlusCircle size={16} /> Bulk Payment
            </button>
            <button onClick={downloadLedgerPDF}
              style={{
                background: T.maroon, color: '#fff', padding: '9px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600,
              }}
            >
              <Download size={16} /> Download PDF
            </button>
          </>
        )}
      </div>

      {selectedCustomer && (
        <div style={{
          background: T.cardBg,
          border: `1.5px solid ${filterActive ? T.maroon : T.borderSoft}`,
          borderRadius: 16, padding: '16px 20px', marginBottom: 24,
          boxShadow: filterActive ? `0 0 0 3px ${T.maroon}22` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Calendar size={18} style={{ color: T.maroon }} />
            <span style={{ fontWeight: 700, color: T.textDark, fontSize: 15 }}>Date Range Filter</span>
            {filterActive && (
              <span style={{
                marginLeft: 8, fontSize: 11, fontWeight: 700,
                background: T.maroon, color: '#fff', padding: '2px 10px', borderRadius: 20,
              }}>ACTIVE</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={labelStyle}>From Date</label>
              <input type="date" value={filterFrom}
                onChange={e => { setFilterFrom(e.target.value); setFilterActive(false); }}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={labelStyle}>To Date</label>
              <input type="date" value={filterTo}
                onChange={e => { setFilterTo(e.target.value); setFilterActive(false); }}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, paddingBottom: 1 }}>
              <button onClick={applyFilter}
                style={{
                  padding: '9px 22px', borderRadius: 10, border: 'none',
                  background: T.maroon, color: '#fff', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <Search size={15} /> Apply
              </button>
              {filterActive && (
                <button onClick={clearFilter}
                  style={{
                    padding: '9px 18px', borderRadius: 10,
                    border: `1.5px solid ${T.borderSoft}`,
                    background: T.creamDark, color: T.textDark,
                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}
                >Clear</button>
              )}
            </div>
          </div>
          {filterActive && (
            <div style={{
              marginTop: 12, padding: '8px 14px', borderRadius: 10,
              background: `${T.maroon}12`, border: `1px solid ${T.maroon}33`,
              fontSize: 13, color: T.textDark,
            }}>
              📅 Showing from{' '}
              <strong>{filterFrom ? formatDateDisplay(filterFrom) : 'beginning'}</strong>
              {' '}to{' '}
              <strong>{filterTo ? formatDateDisplay(filterTo) : 'today'}</strong>
              &nbsp;·&nbsp;
              <span style={{ color: T.maroon, fontWeight: 700 }}>
                {filteredLedger.length} challan(s), {filteredReturnsList.length} return(s), {filteredPaymentsList.length} payment(s)
              </span>
            </div>
          )}
        </div>
      )}

      {selectedCustomer && oldAmount > 0 && (
        <div style={{
          background: darkMode ? '#2a1f00' : '#FFFBEB',
          border: `2px solid #F59E0B`, borderRadius: 16,
          padding: '16px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, boxShadow: '0 2px 8px rgba(245,158,11,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#F59E0B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>🕐</div>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#92400E',
                textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2,
              }}>Previous Outstanding (Old Balance)</div>
              <div style={{ fontSize: 12, color: '#B45309', fontStyle: 'italic' }}>
                {oldAmountDateFormatted !== '—' ? (
                  <>📅 As on <strong>{oldAmountDateFormatted}</strong></>
                ) : (
                  'Amount carried forward from before current billing system'
                )}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#92400E', letterSpacing: '-0.5px' }}>
              ₹{oldAmount.toFixed(2)}
            </div>
            <div style={{ fontSize: 11, color: '#B45309', marginTop: 2 }}>Included in total outstanding</div>
          </div>
        </div>
      )}

      {selectedCustomer && filteredTotals && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Billed', value: filteredTotals.totalBilled, color: T.textDark, prefix: '', bg: T.cardBg },
            { label: 'Total Returns', value: filteredTotals.totalReturns, color: '#B91C1C', prefix: filteredTotals.totalReturns > 0 ? '-' : '', bg: darkMode ? '#2a1515' : '#FEF2F2', border: '#FECACA' },
            { label: 'Total Paid', value: filteredTotals.totalPayments, color: T.successColor, prefix: '', bg: darkMode ? '#0a2a15' : '#F0FDF4', border: '#BBF7D0' },
            {
              label: 'Outstanding', value: filteredTotals.totalDue,
              color: (filteredTotals.totalDue || 0) > 0 ? '#B91C1C' : T.successColor,
              prefix: '', bg: T.cardBg,
              note: oldAmount > 0 ? `Includes ₹${oldAmount.toFixed(0)} old balance` : '',
            },
          ].map(card => (
            <div key={card.label} style={{
              background: card.bg, padding: 16, borderRadius: 16,
              border: `1px solid ${card.border || T.borderSoft}`,
            }}>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: card.color }}>
                {card.prefix}₹{(card.value || 0).toFixed(2)}
              </div>
              {card.note && (
                <div style={{ fontSize: 10, color: '#92400E', marginTop: 4, fontStyle: 'italic' }}>{card.note}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedCustomer && (timeline.length > 0 || oldAmount > 0) && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, color: T.textDark, fontSize: 18 }}>
              📒 Account Statement
              <span style={{ fontSize: 13, fontWeight: 400, color: T.textMuted, marginLeft: 10 }}>
                ({timeline.length} entries{oldAmount > 0 ? ' + opening balance' : ''})
              </span>
            </h2>
          </div>

          <div style={{
            background: T.cardBg, borderRadius: 16, overflow: 'hidden',
            border: `1px solid ${T.borderSoft}`,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: T.maroon, color: '#fff' }}>
                  <th style={{ padding: '12px 10px', textAlign: 'center', width: 90, fontSize: 12 }}>DATE</th>
                  <th style={{ padding: '12px 10px', textAlign: 'left', fontSize: 12 }}>TYPE / REFERENCE</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right', width: 110, fontSize: 12 }}>BILLED (₹)</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right', width: 110, fontSize: 12 }}>RETURN (₹)</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right', width: 110, fontSize: 12 }}>PAYMENT (₹)</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right', width: 120, fontSize: 12 }}>BALANCE (₹)</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center', width: 80, fontSize: 12 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {oldAmount > 0 && (
                  <tr style={{ background: darkMode ? '#2a1f00' : '#FFFBEB', borderBottom: `1px solid #F59E0B` }}>
                    <td style={{ padding: '10px 10px', textAlign: 'center', fontSize: 13, color: '#92400E' }}>
                      {oldAmountDate ? (() => {
                        const ds = formatDateShort(oldAmountDate);
                        return (
                          <>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{ds.day}</div>
                            <div style={{ fontSize: 10, opacity: 0.7 }}>{ds.year}</div>
                          </>
                        );
                      })() : (
                        <>
                          <div style={{ fontSize: 18 }}>🕐</div>
                          <div style={{ fontSize: 9, marginTop: 2 }}>OPENING</div>
                        </>
                      )}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: '#FFFBEB', color: '#92400E', border: '1px solid #F59E0B',
                          letterSpacing: '0.5px',
                        }}>🕐 OLD BALANCE</span>
                        <span style={{ fontWeight: 600, color: '#92400E', fontSize: 14 }}>Previous Outstanding</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#B45309', marginTop: 2, paddingLeft: 2, fontStyle: 'italic' }}>
                        {oldAmountDateFormatted !== '—'
                          ? `📅 Balance as on ${oldAmountDateFormatted}`
                          : 'Balance carried forward from old records'
                        }
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#92400E' }}>
                      ₹{oldAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', color: T.textMuted }}>—</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', color: T.textMuted }}>—</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: 15, fontWeight: 'bold', color: '#92400E' }}>
                      ₹{oldAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 10px' }} />
                  </tr>
                )}

                {timeline.map((entry, idx) => {
                  const badge = typeBadge(entry.type);
                  const isReturn = entry.type === 'return';
                  const isPayment = entry.type === 'payment';
                  const isChallan = entry.type === 'challan';
                  const isExpanded = expandedReturn === entry.id;

                  const rowBg = isReturn
                    ? darkMode ? '#2a151520' : '#FEF2F2'
                    : isPayment
                    ? darkMode ? '#0a2a1520' : '#F0FDF4'
                    : idx % 2 === 0 ? T.cardBg : darkMode ? T.creamDark : '#FAFAFA';

                  const ds = formatDateShort(entry.date);

                  return (
                    <Fragment key={entry.id}>
                      <tr style={{
                        borderBottom: `1px solid ${T.borderSoft}`,
                        background: rowBg, transition: 'background 0.15s',
                      }}>
                        <td style={{ padding: '10px 10px', textAlign: 'center', fontSize: 13, color: T.textMuted }}>
                          <div style={{ fontWeight: 600 }}>{ds.day}</div>
                          <div style={{ fontSize: 10, opacity: 0.7 }}>{ds.year}</div>
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                              background: badge.bg, color: badge.color,
                              border: `1px solid ${badge.border}`, letterSpacing: '0.5px',
                            }}>
                              {badge.icon} {badge.label}
                            </span>
                            <span style={{
                              fontWeight: 600, color: T.textDark, fontSize: 14, fontFamily: 'monospace',
                            }}>
                              {entry.ref}
                            </span>
                          </div>
                          {isPayment && entry.raw && (
                            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, paddingLeft: 2 }}>
                              {entry.raw.challanNo ? `Challan: ${entry.raw.challanNo}` : 'Bulk Payment'}
                              {entry.mode ? ` · ${entry.mode}` : ''}
                              {entry.notes ? ` · ${entry.notes}` : ''}
                            </div>
                          )}
                          {isReturn && entry.challanNo && (
                            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, paddingLeft: 2 }}>
                              Challan: {entry.challanNo}
                              {entry.reason ? ` · ${entry.reason}` : ''}
                            </div>
                          )}
                          {isChallan && entry.raw && (entry.raw.returns > 0 || entry.raw.payments > 0) && (
                            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, paddingLeft: 2 }}>
                              {entry.raw.returns > 0 ? `Return: -₹${entry.raw.returns.toFixed(0)}` : ''}
                              {entry.raw.returns > 0 && entry.raw.payments > 0 ? ' · ' : ''}
                              {entry.raw.payments > 0 ? `Paid: ₹${entry.raw.payments.toFixed(0)}` : ''}
                              {entry.raw.due > 0 ? ` · Due: ₹${entry.raw.due.toFixed(0)}` : ''}
                            </div>
                          )}
                        </td>
                        <td style={{
                          padding: '10px 10px', textAlign: 'right', fontSize: 14,
                          fontWeight: entry.billedAmount ? 600 : 400,
                          color: entry.billedAmount ? T.textDark : T.textMuted,
                        }}>
                          {entry.billedAmount ? `₹${entry.billedAmount.toFixed(2)}` : '—'}
                        </td>
                        <td style={{
                          padding: '10px 10px', textAlign: 'right', fontSize: 14,
                          fontWeight: entry.returnAmount ? 700 : 400,
                          color: entry.returnAmount ? '#B91C1C' : T.textMuted,
                        }}>
                          {entry.returnAmount ? `-₹${entry.returnAmount.toFixed(2)}` : '—'}
                        </td>
                        <td style={{
                          padding: '10px 10px', textAlign: 'right', fontSize: 14,
                          fontWeight: entry.paymentAmount ? 700 : 400,
                          color: entry.paymentAmount ? T.successColor : T.textMuted,
                        }}>
                          {entry.paymentAmount ? `₹${entry.paymentAmount.toFixed(2)}` : '—'}
                        </td>
                        <td style={{
                          padding: '10px 10px', textAlign: 'right', fontSize: 15, fontWeight: 'bold',
                          color: entry.runningBalance > 0 ? '#B91C1C' : T.successColor,
                        }}>
                          ₹{entry.runningBalance.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                          {isChallan && entry.raw?.due > 0 && (
                            <button onClick={() => openPaymentModal(entry.raw)}
                              style={{
                                background: T.maroon, color: '#fff', border: 'none',
                                borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                                fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              <PlusCircle size={12} /> Pay
                            </button>
                          )}
                          {isReturn && entry.items?.length > 0 && (
                            <button onClick={() => setExpandedReturn(isExpanded ? null : entry.id)}
                              style={{
                                background: 'transparent', color: '#B91C1C',
                                border: `1px solid #FECACA`, borderRadius: 8,
                                padding: '5px 10px', cursor: 'pointer', fontSize: 11,
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}
                            >
                              {isExpanded ? <EyeOff size={12} /> : <Eye size={12} />}
                              {isExpanded ? 'Hide' : 'Items'}
                            </button>
                          )}
                        </td>
                      </tr>

                      {isReturn && isExpanded && entry.items?.length > 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0, background: darkMode ? '#1a1020' : '#FFF5F5' }}>
                            <div style={{ padding: '12px 20px 12px 40px' }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#B91C1C', marginBottom: 8 }}>
                                📋 Returned Items — {entry.ref}
                              </div>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                  <tr>
                                    {['#', 'Product', 'Size', 'Qty', 'Rate', 'Amount'].map(h => (
                                      <th key={h} style={{
                                        padding: '6px 8px',
                                        textAlign: ['Qty', 'Rate', 'Amount'].includes(h) ? 'right' : h === '#' ? 'center' : 'left',
                                        borderBottom: `1px solid #FECACA`, color: '#B91C1C', fontWeight: 600,
                                      }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.items.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${darkMode ? '#3a2030' : '#FEE2E2'}` }}>
                                      <td style={{ padding: '5px 8px', textAlign: 'center', color: T.textMuted }}>{i + 1}</td>
                                      <td style={{ padding: '5px 8px', fontWeight: 600, color: T.textDark }}>
                                        {item.product}
                                        {item.lengthDisplay && item.lengthDisplay !== "0'-0\"" && (
                                          <span style={{ fontSize: 10, color: T.textMuted, marginLeft: 4 }}>({item.lengthDisplay})</span>
                                        )}
                                      </td>
                                      <td style={{ padding: '5px 8px', color: T.textMuted }}>{item.size || '—'}</td>
                                      <td style={{ padding: '5px 8px', textAlign: 'right', color: '#B91C1C', fontWeight: 600 }}>
                                        {parseFloat(item.returnQty).toFixed(3)} {item.unit}
                                        {item.returnPcs && parseFloat(item.returnPcs) !== parseFloat(item.returnQty) && (
                                          <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 400, marginTop: 2 }}>
                                            ({parseFloat(item.returnPcs)} pcs)
                                          </div>
                                        )}
                                      </td>
                                      <td style={{ padding: '5px 8px', textAlign: 'right', color: T.textDark }}>
                                        ₹{parseFloat(item.rate).toLocaleString()}
                                      </td>
                                      <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#B91C1C' }}>
                                        -₹{parseFloat(item.returnAmount).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>

              <tfoot>
                <tr style={{ background: T.creamDark, borderTop: `2px solid ${T.maroon}` }}>
                  <td colSpan={2} style={{ padding: '12px 10px', fontWeight: 'bold', color: T.textDark, fontSize: 14 }}>
                    TOTALS
                    {oldAmount > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 400, color: '#92400E', marginLeft: 8, fontStyle: 'italic' }}>
                        (incl. ₹{oldAmount.toFixed(0)} old balance{oldAmountDateFormatted !== '—' ? ` as on ${oldAmountDateFormatted}` : ''})
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: T.textDark }}>
                    ₹{(filteredTotals?.totalBilled || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: '#B91C1C' }}>
                    {(filteredTotals?.totalReturns || 0) > 0 ? `-₹${(filteredTotals?.totalReturns || 0).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 14, color: T.successColor }}>
                    {(filteredTotals?.totalPayments || 0) > 0 ? `₹${(filteredTotals?.totalPayments || 0).toFixed(2)}` : '—'}
                  </td>
                  <td style={{
                    padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: 16,
                    color: (filteredTotals?.totalDue || 0) > 0 ? '#B91C1C' : T.successColor,
                    background: '#fff3cd',
                  }}>
                    ₹{(filteredTotals?.totalDue || 0).toFixed(2)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {selectedCustomer && timeline.length === 0 && oldAmount === 0 && !loading && (
        <div style={{
          textAlign: 'center', padding: 60, background: T.cardBg, borderRadius: 16, color: T.textMuted,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No transactions found</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            {filterActive ? 'Try changing the date range.' : 'This customer has no challans, returns or payments.'}
          </p>
        </div>
      )}

      {showModal && selectedChallan && (
        <div
          style={{
            position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowModal(false)}
        >
          <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16, color: T.textDark }}>
              Record Payment for {selectedChallan.challanNo}
            </h3>
            {[
              { label: 'Amount (₹)', el: <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={inputStyle} /> },
              { label: 'Date', el: <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={inputStyle} /> },
              { label: 'Mode', el: (
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={inputStyle}>
                  <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
                </select>
              )},
              { label: 'Notes', el: <input type="text" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} style={inputStyle} placeholder="Optional" /> },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{f.label}</label>
                {f.el}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 18px', background: T.creamDark,
                  border: `1px solid ${T.borderSoft}`, borderRadius: 8,
                  cursor: 'pointer', color: T.textDark,
                }}
              >Cancel</button>
              <button onClick={recordPayment} disabled={saving}
                style={{
                  padding: '8px 18px', background: T.maroon, color: '#fff',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && selectedCustomer && (
        <div
          style={{
            position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowBulkModal(false)}
        >
          <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16, color: T.textDark }}>
              Bulk Payment for {selectedCustomer}
            </h3>
            {[
              { label: 'Amount (₹)', el: <input type="number" value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} style={inputStyle} /> },
              { label: 'Date', el: <input type="date" value={bulkDate} onChange={e => setBulkDate(e.target.value)} style={inputStyle} /> },
              { label: 'Mode', el: (
                <select value={bulkMode} onChange={e => setBulkMode(e.target.value)} style={inputStyle}>
                  <option>Cash</option><option>Cheque</option><option>RTGS</option>
                  <option>NEFT</option><option>UPI</option><option>Bank Transfer</option>
                </select>
              )},
              { label: 'Notes', el: <input type="text" value={bulkNotes} onChange={e => setBulkNotes(e.target.value)} style={inputStyle} placeholder="Remark" /> },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{f.label}</label>
                {f.el}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setShowBulkModal(false)}
                style={{
                  padding: '8px 18px', background: T.creamDark,
                  border: `1px solid ${T.borderSoft}`, borderRadius: 8,
                  cursor: 'pointer', color: T.textDark,
                }}
              >Cancel</button>
              <button onClick={recordBulkPayment} disabled={bulkSaving}
                style={{
                  padding: '8px 18px', background: T.maroon, color: '#fff',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                {bulkSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Bulk Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}