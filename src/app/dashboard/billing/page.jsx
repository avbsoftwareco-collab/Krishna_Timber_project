
// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Trash2, Printer, Search, CheckCircle,
//   AlertTriangle, Loader2, RefreshCw, Download, Eye,
//   X, TruckIcon, Receipt, ArrowRight, EyeOff, ChevronDown, Edit2
// } from 'lucide-react';
// const SHOP_INFO = {
//   name: 'Krishna Timber & Plywoods',
//   address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
//   phone: '0755-4275577',
//   gstin: '23XXXXX1234X1ZX',
// };
// const GST_OPTIONS = [
//   { value: 0, label: 'No GST' },
//   { value: 5, label: 'GST 5%' },
//   { value: 12, label: 'GST 12%' },
//   { value: 18, label: 'GST 18%' },
// ];
// const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];
// function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }
// function parseWoodDimensions(name) {
//   if (!name) return null;
//   const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
//   if (!match) return null;
//   let width = parseFloat(match[1]);
//   let thickness = match[2];
//   if (thickness.includes('½')) thickness = parseFloat(thickness.replace('½', '')) + 0.5 || 0.5;
//   else if (thickness.includes('¼')) thickness = parseFloat(thickness.replace('¼', '')) + 0.25 || 0.25;
//   else if (thickness.includes('¾')) thickness = parseFloat(thickness.replace('¾', '')) + 0.75 || 0.75;
//   else thickness = parseFloat(thickness);
//   return { width, thickness };
// }
// function calculateByUnit(item) {
//   const qty = parseFloat(item.quantity || 0);
//   const rate = parseFloat(item.rate || 0);
//   const width = parseFloat(item.width || 0);
//   const thickness = parseFloat(item.thickness || 0);
//   const totalLengthFeet = parseFloat(item.lengthFeet || 0) + (parseFloat(item.lengthInches || 0) / 12);
//   let calculatedQty = qty;
//   if (item.isWood) {
//     switch (item.unit) {
//       case 'CFT': calculatedQty = (width * thickness * totalLengthFeet * qty) / 144; break;
//       case 'RFT': calculatedQty = totalLengthFeet * qty; break;
//       case 'SQFT': calculatedQty = (width * totalLengthFeet * qty) / 12; break;
//       case 'Per Piece': calculatedQty = qty; break;
//       default: calculatedQty = qty;
//     }
//   }
//   return {
//     calculatedQty: Math.round(calculatedQty * 1000) / 1000,
//     amount: Math.round(calculatedQty * rate * 100) / 100,
//   };
// }
// function rebuildItemForEdit(savedItem) {
//   const item = {
//     uid: uid(), product: savedItem.product || '', unit: savedItem.unit || '',
//     lengthFeet: savedItem.lengthFeet || '', lengthInches: savedItem.lengthInches || '',
//     quantity: savedItem.quantity || '', rate: savedItem.rate || '',
//     amount: savedItem.amount || 0, calculatedQty: savedItem.calculatedQty || 0,
//     skuCode: savedItem.skuCode || '', isWood: savedItem.isWood || false,
//     width: parseFloat(savedItem.width || 0), thickness: parseFloat(savedItem.thickness || 0),
//     size: savedItem.size || '', materialType: savedItem.materialType || '',
//     category: savedItem.category || '', subCategory: savedItem.subCategory || '',
//   };
//   if (item.isWood && (!item.width || !item.thickness)) {
//     const dims = parseWoodDimensions(item.product);
//     if (dims) { item.width = dims.width; item.thickness = dims.thickness; if (!item.size) item.size = `${dims.width}×${dims.thickness}"`; }
//   }
//   const calc = calculateByUnit(item);
//   item.calculatedQty = calc.calculatedQty;
//   item.amount = calc.amount;
//   return item;
// }
// function numberToWords(num) {
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
//   if (num === 0) return 'Zero';
//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:'');
//     if (n < 1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+convert(n%100):'');
//     if (n < 100000) return convert(Math.floor(n/1000))+' Thousand'+(n%1000?' '+convert(n%1000):'');
//     if (n < 10000000) return convert(Math.floor(n/100000))+' Lakh'+(n%100000?' '+convert(n%100000):'');
//     return convert(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+convert(n%10000000):'');
//   }
//   const i=Math.floor(num),d=Math.round((num-i)*100);
//   return convert(i)+' Rupees'+(d>0?' and '+convert(d)+' Paise':'')+' Only';
// }
// function SearchableSelect({ options, value, onChange, placeholder='Search...', disabled=false }) {
//   const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
//   const filtered=options.filter(o=>(typeof o==='string'?o:o.label||o).toLowerCase().includes(search.toLowerCase()));
//   const getVal=o=>typeof o==='string'?o:o.value??o.label??o;const getDisp=o=>typeof o==='string'?o:o.label??o.value??o;
//   const selDisp=options.find(o=>getVal(o)===value);
//   useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
//   const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(getVal(filtered[hiIdx]));setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
//   return(<div ref={wrapRef} className="searchable-select"><div className="ss-input-wrap"><input type="text" className="ss-input" placeholder={value?'':placeholder} value={isOpen?search:(selDisp?getDisp(selDisp):'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown">{filtered.length===0?<div className="ss-no-results">No results</div>:<div className="ss-options">{filtered.map((o,idx)=>(<div key={idx} className={`ss-option ${hiIdx===idx?'highlighted':''} ${getVal(o)===value?'selected':''}`} onClick={()=>{onChange(getVal(o));setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)}>{getDisp(o)}</div>))}</div>}</div>}</div>);
// }
// function ProductSearchableSelect({ products, value, onChange, disabled=false }) {
//   const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
//   const filtered=products.filter(p=>{const s=search.toLowerCase();return p.materialName?.toLowerCase().includes(s)||p.skuCode?.toLowerCase().includes(s)||p.category?.toLowerCase().includes(s)||p.subCategory?.toLowerCase().includes(s);});
//   const selected=products.find(p=>p.skuCode===value);
//   useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
//   const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(filtered[hiIdx].skuCode);setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
//   return(<div ref={wrapRef} className="searchable-select product-select"><div className="ss-input-wrap"><Search className="ss-search-icon"/><input type="text" className="ss-input with-icon" placeholder={selected?'':'🔍 Search product...'} value={isOpen?search:(selected?.materialName||'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown product-dropdown"><div className="ss-dropdown-header"><span>{filtered.length} products</span></div>{filtered.length===0?<div className="ss-no-results">No match</div>:<div className="ss-options">{filtered.slice(0,50).map((p,idx)=>(<div key={p.skuCode} className={`ss-option product-option ${hiIdx===idx?'highlighted':''} ${p.skuCode===value?'selected':''}`} onClick={()=>{onChange(p.skuCode);setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)}><div className="product-option-main"><span className="product-name">{p.materialName}</span><span className="product-sku">{p.skuCode}</span></div><div className="product-option-sub"><span className="product-cat">{p.materialType}</span><span className="product-sep">›</span><span className="product-cat">{p.category}</span>{p.subCategory&&<><span className="product-sep">›</span><span className="product-cat">{p.subCategory}</span></>}<span className="product-unit">{p.unit}</span></div></div>))}{filtered.length>50&&<div className="ss-more">+{filtered.length-50} more...</div>}</div>}</div>}</div>);
// }
// // ─── Print CSS ───────────────────────────────────────────────────────
// const PRINT_CSS=`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;color:#000;background:#fff;-webkit-print-color-adjust:exact}.page{max-width:210mm;margin:0 auto;padding:15mm}.hdr{border:2px solid #000;padding:12px 16px;margin-bottom:10px}.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid #000;margin-bottom:8px}h1{font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:3px}.box{border:2px solid #000;padding:8px 12px;text-align:right;min-width:170px}.gr{display:flex;justify-content:space-between;font-size:9px;font-weight:bold}.sec{border:2px solid #000;margin-bottom:10px}.sh{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}.cb{display:flex}.bt,.st{flex:1;padding:10px 12px}.bt{border-right:1px solid #000}.lbl{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;text-decoration:underline}.cn{font-size:13px;font-weight:bold;margin-bottom:3px}.cd{font-size:10px;line-height:1.5}.mg{display:grid;grid-template-columns:auto 1fr;gap:3px 8px;font-size:9px}.mg .ml{font-weight:bold}table{width:100%;border-collapse:collapse;border:2px solid #000;margin-bottom:10px}thead tr{background:#000;color:#fff}th{padding:7px 8px;font-size:9px;font-weight:bold;text-transform:uppercase;text-align:left;border-right:1px solid #fff}th:last-child{border-right:none}th.r{text-align:right}th.c{text-align:center}tbody tr{border-bottom:1px solid #000}td{padding:6px 8px;font-size:11px;border-right:1px solid #ddd}td:last-child{border-right:none}td.r{text-align:right}td.c{text-align:center}.tots{display:flex;gap:12px;margin-bottom:10px}.aw{flex:1;border:2px solid #000;padding:10px 12px}.awl{font-size:8px;font-weight:bold;text-transform:uppercase;margin-bottom:4px}.awt{font-size:11px;font-weight:bold;font-style:italic}.tb{width:220px;border:2px solid #000}.tr_{display:flex;justify-content:space-between;padding:5px 12px;font-size:11px;border-bottom:1px solid #ddd}.tf{background:#000;color:#fff;display:flex;justify-content:space-between;padding:7px 12px;font-size:12px;font-weight:bold}.ftr{border:2px solid #000;padding:10px 12px}.fg{display:flex;justify-content:space-between;gap:20px}.terms{flex:1;font-size:9px;line-height:1.7}.sig{width:190px;text-align:center}.stamp{border:2px dashed #000;padding:7px 14px;margin-bottom:28px;font-size:9px;font-weight:bold;text-transform:uppercase}.sl{width:100%;border-top:1px solid #000;margin-bottom:5px}.slbl{font-size:9px;font-weight:bold}.ty{border:2px solid #000;padding:8px;margin-top:10px;text-align:center}.no-print{display:block}@media print{.page{padding:10mm}.no-print{display:none!important}}@page{size:A4;margin:10mm}`;

// // ✅ UPDATED: buildItemDesc — unit REMOVED from description (unit goes in Qty column)
// const buildItemDesc = (it) => {
//   let name = `<strong>${it.product}</strong>`;
//   let details = [];
//   if (it.size) details.push(it.size);
//   const ld = it.lengthDisplay || '';
//   if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
//   // ❌ unit removed from here — now shown in Qty column
//   if (details.length) name += `<br><span style="font-size:9px;color:#555">${details.join(' · ')}</span>`;
//   return name;
// };

// // ✅ UPDATED: Challan print — Qty column shows "value UNIT" (e.g. "12.345 CFT")
// const getChallanPrintHTML = (order, challan, hidePrice = false) => {
//   const challanTotal = challan.items.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
//   const poLine = order.poNumber ? `<span class="ml">PO No:</span><span>${order.poNumber}</span>` : '';
//   const gstLine = order.gstCustomerName ? `<span class="ml">GST Party:</span><span>${order.gstCustomerName}</span>` : '';
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}
// .action-bar{display:flex;gap:10px;justify-content:center;padding:15px;background:#f8f8f8;border-radius:10px;margin-bottom:15px}
// .action-btn{padding:10px 24px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .15s}
// .btn-print{background:#b45309;color:#fff}.btn-print:hover{background:#92400e}
// .btn-save{background:#1d4ed8;color:#fff}.btn-save:hover{background:#1e40af}
// </style></head><body><div class="page">
// <div class="action-bar no-print">
//   <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//   <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
// </div>
// <div class="hdr"><div class="hdr-top"><div><h1>${SHOP_INFO.name}</h1><p style="font-size:10px">${SHOP_INFO.address}</p><p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p></div><div class="box"><div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Delivery Challan</div><div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">${challan.challanNo}</div><div style="font-size:9px">Date: ${new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div><div style="font-size:9px;margin-top:2px">Ref: ${order.orderNo}</div></div></div><div class="gr"><span>GSTIN: ${SHOP_INFO.gstin}</span><span>PAN: XXXXX1234X</span></div></div>
// <div class="sec"><div class="sh">Customer Details</div><div class="cb"><div class="bt"><div class="lbl">Bill To</div><div class="cn">${order.customerName}</div><div class="cd">${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br>' : ''}${order.customerAddress || ''}</div></div><div class="st"><div class="lbl">Challan Info</div><div class="mg"><span class="ml">Challan No:</span><span>${challan.challanNo}</span><span class="ml">Date:</span><span>${new Date(challan.challanDate).toLocaleDateString('en-IN')}</span><span class="ml">Order Ref:</span><span>${order.orderNo}</span>${poLine}${gstLine}<span class="ml">Note:</span><span>${challan.deliveryNote || '—'}</span></div></div></div></div>
// <table><thead><tr><th style="width:30px">#</th><th>Item Description</th>${!hidePrice ? '<th class="r" style="width:100px">Qty</th><th class="r" style="width:80px">Rate (₹)</th><th class="r" style="width:100px">Amount (₹)</th>' : '<th class="r" style="width:100px">Qty</th>'}</tr></thead><tbody>${challan.items.map((it, i) => {
//     // ✅ Qty column: value + unit together
//     const qtyVal = it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty;
//     const qtyWithUnit = it.unit ? `${qtyVal} <span style="font-size:9px;color:#555">${it.unit}</span>` : qtyVal;
//     return `<tr><td class="c">${i + 1}</td><td>${buildItemDesc(it)}</td>${!hidePrice
//       ? `<td class="r">${qtyWithUnit}</td><td class="r">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td><td class="r"><strong>${parseFloat(it.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>`
//       : `<td class="r">${qtyWithUnit}</td>`
//     }</tr>`;
//   }).join('')}</tbody></table>
// ${!hidePrice ? `<div class="tots"><div class="aw"><div class="awl">Amount in Words</div><div class="awt">${numberToWords(challanTotal)}</div></div><div class="tb"><div class="tr_"><span>Subtotal:</span><span>₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div><div class="tf"><span>CHALLAN TOTAL</span><span>₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div></div></div>` : '<div style="text-align:center;padding:20px;border:2px solid #000;margin-bottom:10px;font-weight:bold;">DELIVERY CHALLAN — FOR GOODS REFERENCE ONLY</div>'}
// <div class="ftr"><div class="fg"><div class="terms"><strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>• Goods dispatched will not be returned without prior approval.<br>• Verify items on receipt; report discrepancies within 24 hours.<br>• This is a delivery challan — not a tax invoice.<br>• All disputes subject to Bhopal jurisdiction only.</div><div class="sig"><div class="stamp">For ${SHOP_INFO.name}</div><div class="sl"></div><div class="slbl">Authorized Signatory</div></div></div><div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end"><div><div class="sl" style="width:180px"></div><div class="slbl">Customer Signature</div></div><div style="font-size:9px">Received goods in good condition</div></div></div>
// <div class="ty"><strong>Delivery Challan — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div>
// </div>
// <script>
// function savePDF(){
//   document.querySelector('.action-bar').style.display='none';
//   window.print();
//   setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);
// }
// </script>
// </body></html>`;
// };

// // ✅ UPDATED: Bill print — Qty column shows "value UNIT" (e.g. "45.678 CFT")
// const getBillPrintHTML = (order, chs) => {
//   const m = {};
//   chs.forEach(ch => ch.items?.forEach(it => {
//     const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || '');
//     if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' };
//     m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0);
//     m[key].totalAmount += parseFloat(it.amount || 0);
//   }));
//   const li = Object.values(m); const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//   const gstRate = order.gstRate || 0; const tax = gstRate > 0 ? sub * (gstRate / 100) : 0; const total = sub + tax;
//   const poRow = order.poNumber ? `<span class="ml">PO No:</span><span>${order.poNumber}</span>` : '';
//   const gstRow = order.gstCustomerName ? `<span class="ml">GST Party:</span><span>${order.gstCustomerName}</span>` : '';
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice INV-${order.orderNo}</title><style>${PRINT_CSS}
// .action-bar{display:flex;gap:10px;justify-content:center;padding:15px;background:#f8f8f8;border-radius:10px;margin-bottom:15px}
// .action-btn{padding:10px 24px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .15s}
// .btn-print{background:#b45309;color:#fff}.btn-print:hover{background:#92400e}
// .btn-save{background:#1d4ed8;color:#fff}.btn-save:hover{background:#1e40af}
// .gst-s{border:2px solid #000;margin-bottom:10px}.gst-h{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase}.gst-t{width:100%;border-collapse:collapse}.gst-t th{background:#f0f0f0;padding:6px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #000;border-right:1px solid #ddd}.gst-t td{padding:6px 8px;font-size:10px;border-right:1px solid #ddd}
// </style></head><body><div class="page">
// <div class="action-bar no-print">
//   <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//   <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
// </div>
// <div class="hdr"><div class="hdr-top"><div><h1>${SHOP_INFO.name}</h1><p style="font-size:10px">${SHOP_INFO.address}</p><p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p></div><div class="box"><div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Tax Invoice</div><div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">INV-${order.orderNo}</div><div style="font-size:9px">Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div></div></div><div class="gr"><span>GSTIN: ${SHOP_INFO.gstin}</span><span>PAN: XXXXX1234X</span></div></div>
// <div class="sec"><div class="sh">Customer & Invoice Details</div><div class="cb"><div class="bt"><div class="lbl">Bill To</div><div class="cn">${order.customerName}</div><div class="cd">${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br>' : ''}${order.customerAddress || ''}</div>${order.gstCustomerName ? `<div style="margin-top:6px;font-size:10px;font-weight:bold;">GST Party: ${order.gstCustomerName}</div>` : ''}</div><div class="st"><div class="lbl">Invoice Information</div><div class="mg"><span class="ml">Order No:</span><span>${order.orderNo}</span>${poRow}${gstRow}<span class="ml">Challans:</span><span>${chs.map(c => c.challanNo).join(', ')}</span><span class="ml">GST:</span><span>${gstRate > 0 ? gstRate + '% Included' : 'N/A'}</span></div></div></div></div>
// <div style="border:2px solid #000;padding:8px 12px;margin-bottom:10px;font-size:10px"><strong>Challan Ref: </strong>${chs.map(c => `${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}</div>
// <table><thead><tr><th style="width:30px">#</th><th>Item Description</th><th class="r" style="width:100px">Qty</th><th class="r" style="width:80px">Rate (₹)</th><th class="r" style="width:100px">Amount (₹)</th></tr></thead><tbody>${li.map((it, i) => {
//     const desc = buildItemDesc(it);
//     // ✅ Qty column: value + unit together
//     const qtyWithUnit = it.unit
//       ? `<strong>${it.totalQty.toFixed(3)}</strong> <span style="font-size:9px;color:#555">${it.unit}</span>`
//       : `<strong>${it.totalQty.toFixed(3)}</strong>`;
//     return `<tr><td class="c">${i + 1}</td><td>${desc}</td><td class="r">${qtyWithUnit}</td><td class="r">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td><td class="r"><strong>${it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td></tr>`;
//   }).join('')}</tbody></table>
// <div class="tots"><div class="aw"><div class="awl">Amount in Words</div><div class="awt">${numberToWords(total)}</div></div><div class="tb"><div class="tr_"><span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>${gstRate > 0 ? `<div class="tr_"><span>CGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span></div><div class="tr_"><span>SGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span></div>` : ''}<div class="tr_"><span>Discount:</span><span>₹0.00</span></div><div class="tf"><span>GRAND TOTAL</span><span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div></div></div>
// ${gstRate > 0 ? `<div class="gst-s"><div class="gst-h">GST Tax Breakup</div><table class="gst-t"><thead><tr><th>Taxable</th><th>CGST Rate</th><th>CGST Amt</th><th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th></tr></thead><tbody><tr><td>₹${sub.toFixed(2)}</td><td>${gstRate / 2}%</td><td>₹${(tax / 2).toFixed(2)}</td><td>${gstRate / 2}%</td><td>₹${(tax / 2).toFixed(2)}</td><td><strong>₹${tax.toFixed(2)}</strong></td></tr></tbody></table></div>` : ''}
// <div class="ftr"><div class="fg"><div class="terms"><strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>• Goods once sold will not be taken back.<br>• Payment due on receipt.<br>• Interest @ 18% p.a. on overdue.<br>• All disputes subject to Bhopal jurisdiction.<br>• E. & O.E.</div><div class="sig"><div class="stamp">For ${SHOP_INFO.name}</div><div class="sl"></div><div class="slbl">Authorized Signatory</div></div></div><div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end"><div><div class="sl" style="width:180px"></div><div class="slbl">Customer Signature</div></div><div style="font-size:9px">Received goods in good condition</div></div></div>
// <div class="ty"><strong>Thank You! — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div>
// </div>
// <script>
// function savePDF(){
//   document.querySelector('.action-bar').style.display='none';
//   window.print();
//   setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);
// }
// </script>
// </body></html>`;
// };
// const apiGet=async url=>{try{const r=await fetch(url);if(!r.ok)return{success:false,data:[]};return r.json();}catch{return{success:false,data:[]};}};
// const apiPost=async(url,body)=>{try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();}catch(e){return{success:false,error:e.message};}};
// const apiPatch=async(url,body)=>{try{const r=await fetch(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();}catch(e){return{success:false,error:e.message};}};
// const openPDFView = (html) => {
//   const win = window.open('', '_blank');
//   win.document.write(html);
//   win.document.close();
// };
// const openPDFPrint = (html) => {
//   const win = window.open('', '_blank');
//   win.document.write(html);
//   win.document.close();
//   setTimeout(() => { win.focus(); win.print(); }, 600);
// };
// export default function OrderChallanBilling() {
//   const [activeTab,setActiveTab]=useState('orders');
//   const [orders,setOrders]=useState([]);
//   const [challans,setChallans]=useState([]);
//   const [products,setProducts]=useState([]);
//   const [loading,setLoading]=useState(true);
//   const [saving,setSaving]=useState(false);
//   const [error,setError]=useState(null);
//   const [searchQuery,setSearchQuery]=useState('');
//   const [filterStatus,setFilterStatus]=useState('All');
//   const [showOrderForm,setShowOrderForm]=useState(false);
//   const [isEditMode,setIsEditMode]=useState(false);
//   const [editingOrder,setEditingOrder]=useState(null);
//   const [showChallanForm,setShowChallanForm]=useState(false);
//   const [showBillPreview,setShowBillPreview]=useState(false);
//   const [selectedOrder,setSelectedOrder]=useState(null);
//   const [showChallanSuccess,setShowChallanSuccess]=useState(false);
//   const [lastChallanHTML,setLastChallanHTML]=useState('');
//   const [lastChallanNo,setLastChallanNo]=useState('');
//   const [orderForm,setOrderForm]=useState({customerName:'',customerPhone:'',customerAddress:'',orderDate:new Date().toISOString().split('T')[0],gstRate:0,notes:'',poNumber:'',gstCustomerName:''});
//   const [orderGroups,setOrderGroups]=useState([createEmptyGroup()]);
//   const [challanDate,setChallanDate]=useState(new Date().toISOString().split('T')[0]);
//   const [challanItems,setChallanItems]=useState([]);
//   const [deliveryNote,setDeliveryNote]=useState('');
//   const [hidePriceOnChallan,setHidePriceOnChallan]=useState(false);
//   function createEmptyItem(ov={}){return{uid:uid(),product:'',unit:'',lengthFeet:'',lengthInches:'',quantity:'',rate:'',amount:0,calculatedQty:0,skuCode:'',isWood:false,width:0,thickness:0,size:'',materialType:'',category:'',subCategory:'',...ov};}
//   function createEmptyGroup(){return{groupId:uid(),filterMaterialType:'',filterCategory:'',filterSubCategory:'',items:[createEmptyItem()]};}
//   const getAllOrderItems=()=>orderGroups.flatMap(g=>g.items.map(item=>({...item,filterMaterialType:g.filterMaterialType,filterCategory:g.filterCategory,filterSubCategory:g.filterSubCategory})));
//   const orderSubtotal=getAllOrderItems().reduce((s,i)=>s+(i.amount||0),0);
//   const orderTax=orderForm.gstRate>0?orderSubtotal*(orderForm.gstRate/100):0;
//   const orderTotal=orderSubtotal+orderTax;
//   const fetchData=useCallback(async()=>{setLoading(true);setError(null);try{const [oR,cR,pR]=await Promise.all([apiGet('/api/billing-backend/orders'),apiGet('/api/billing-backend/challans'),apiGet('/api/dropdown-data')]);setOrders(oR.success?oR.data||[]:[]);setChallans(cR.success?cR.data||[]:[]);setProducts(pR.success&&pR.data?pR.data:[]);}catch{setError('Data load problem');}setLoading(false);},[]);
//   useEffect(()=>{fetchData();},[fetchData]);
//   const isWoodMaterial=item=>{if(!item)return false;const mt=(item.materialType||'').toLowerCase();const cat=(item.category||'').toLowerCase();return mt.includes('timber')||mt.includes('wood')||mt.includes('lakdi')||cat.includes('teak')||cat.includes('sagwan')||cat.includes('pine')||cat.includes('sal');};
//   const getFilteredProductsForGroup=g=>products.filter(p=>{if(g.filterMaterialType&&p.materialType!==g.filterMaterialType)return false;if(g.filterCategory&&p.category!==g.filterCategory)return false;if(g.filterSubCategory&&p.subCategory!==g.filterSubCategory)return false;return true;});
//   const getAllMaterialTypes=()=>[...new Set(products.map(p=>p.materialType).filter(Boolean))];
//   const getCategoriesFor=mt=>[...new Set(products.filter(p=>!mt||p.materialType===mt).map(p=>p.category).filter(Boolean))];
//   const getSubCategoriesFor=(mt,cat)=>[...new Set(products.filter(p=>(!mt||p.materialType===mt)&&(!cat||p.category===cat)).map(p=>p.subCategory).filter(Boolean))];
//   const updateGroupFilter=(gid,field,val)=>{setOrderGroups(prev=>prev.map(g=>{if(g.groupId!==gid)return g;const u={...g,[field]:val};if(field==='filterMaterialType'){u.filterCategory='';u.filterSubCategory='';}if(field==='filterCategory'){u.filterSubCategory='';}return u;}));};
//   const addItemToGroup=gid=>{setOrderGroups(prev=>prev.map(g=>g.groupId!==gid?g:{...g,items:[...g.items,createEmptyItem()]}));};
//   const removeItemFromGroup=(gid,iuid)=>{setOrderGroups(prev=>prev.map(g=>{if(g.groupId!==gid||g.items.length===1)return g;return{...g,items:g.items.filter(i=>i.uid!==iuid)};}));};
//   const removeGroup=gid=>{if(orderGroups.length===1)return;setOrderGroups(prev=>prev.filter(g=>g.groupId!==gid));};
//   const addNewGroup=()=>setOrderGroups(prev=>[...prev,createEmptyGroup()]);
//   const updateGroupItem=(gid,iuid,field,val)=>{setOrderGroups(prev=>prev.map(g=>{if(g.groupId!==gid)return g;return{...g,items:g.items.map(item=>{if(item.uid!==iuid)return item;const u={...item,[field]:val};if(field==='skuCode'){const f=products.find(p=>p.skuCode===val);if(f){u.product=f.materialName;u.skuCode=f.skuCode;u.materialType=f.materialType;u.category=f.category;u.subCategory=f.subCategory;u.isWood=isWoodMaterial(f);if(u.isWood){u.unit='CFT';const dims=parseWoodDimensions(f.materialName);if(dims){u.width=dims.width;u.thickness=dims.thickness;u.size=`${dims.width}×${dims.thickness}"`;}else{u.width=0;u.thickness=0;u.size='';}}else{u.unit=f.unit||'Pcs';u.width=0;u.thickness=0;u.size='';u.lengthFeet='';u.lengthInches='';}}}const calc=calculateByUnit(u);u.calculatedQty=calc.calculatedQty;u.amount=calc.amount;return u;})};})
//   );};
//   const genOrderNo=()=>{const y=new Date().getFullYear(),px=`ORD-${y}-`;const max=orders.filter(o=>o.orderNo?.startsWith(px)).reduce((m,o)=>{const n=parseInt(o.orderNo?.replace(px,'')||'0');return n>m?n:m;},0);return`${px}${String(max+1).padStart(4,'0')}`;};
//   const genChallanNo=()=>{const y=new Date().getFullYear(),px=`CHL-${y}-`;const max=challans.filter(c=>c.challanNo?.startsWith(px)).reduce((m,c)=>{const n=parseInt(c.challanNo?.replace(px,'')||'0');return n>m?n:m;},0);return`${px}${String(max+1).padStart(4,'0')}`;};
//   const openEditOrder=order=>{setIsEditMode(true);setEditingOrder(order);setOrderForm({customerName:order.customerName||'',customerPhone:order.customerPhone||'',customerAddress:order.customerAddress||'',orderDate:order.orderDate||new Date().toISOString().split('T')[0],gstRate:order.gstRate||0,notes:order.notes||'',poNumber:order.poNumber||'',gstCustomerName:order.gstCustomerName||''});const savedItems=order.items||[];if(savedItems.length===0){setOrderGroups([createEmptyGroup()]);}else{const groupMap={};savedItems.forEach(it=>{const key=it.materialType||'Other';if(!groupMap[key])groupMap[key]=[];groupMap[key].push(rebuildItemForEdit(it));});setOrderGroups(Object.entries(groupMap).map(([mt,items])=>({groupId:uid(),filterMaterialType:mt==='Other'?'':mt,filterCategory:items[0]?.category||'',filterSubCategory:items[0]?.subCategory||'',items})));}setShowOrderForm(true);};
//   const resetOrderForm=()=>{setOrderForm({customerName:'',customerPhone:'',customerAddress:'',orderDate:new Date().toISOString().split('T')[0],gstRate:0,notes:'',poNumber:'',gstCustomerName:''});setOrderGroups([createEmptyGroup()]);setIsEditMode(false);setEditingOrder(null);};
//   const handleSubmitOrder=async()=>{if(!orderForm.customerName||orderSubtotal===0){setError('Customer name aur items required');return;}setSaving(true);setError(null);try{const validItems=getAllOrderItems().filter(i=>i.product&&(i.quantity||i.calculatedQty)).map(it=>({...it,lengthDisplay:it.isWood?`${it.lengthFeet||0}'-${it.lengthInches||0}"`:''}));if(isEditMode&&editingOrder){const r=await apiPatch('/api/billing-backend/orders',{orderNo:editingOrder.orderNo,order:{...orderForm,orderNo:editingOrder.orderNo,subtotal:orderSubtotal,tax:orderTax,total:orderTotal,status:editingOrder.status,includeGST:orderForm.gstRate>0},items:validItems});if(!r.success){setError(r.error||'Edit fail');return;}}else{const orderNo=genOrderNo();const r=await apiPost('/api/billing-backend/orders',{order:{...orderForm,orderNo,subtotal:orderSubtotal,tax:orderTax,total:orderTotal,status:'Active',includeGST:orderForm.gstRate>0},items:validItems});if(!r.success){setError(r.error||'Save fail');return;}}await fetchData();setShowOrderForm(false);resetOrderForm();}catch(err){setError('Error: '+err.message);}finally{setSaving(false);}};
//   const openChallanForm=order=>{setSelectedOrder(order);const sm={};challans.filter(c=>c.orderNo===order.orderNo).forEach(ch=>ch.items?.forEach(it=>{sm[it.product]=(sm[it.product]||0)+parseFloat(it.calculatedQty||it.sentQty||0);}));setChallanItems((order.items||[]).map(it=>({uid:uid(),product:it.product,unit:it.unit,rate:parseFloat(it.rate||0),orderedQty:parseFloat(it.calculatedQty||it.quantity||0),alreadySent:parseFloat(sm[it.product]||0),sendingPcs:'',sendingQty:0,size:it.size||'',lengthFeet:it.lengthFeet||'',lengthInches:it.lengthInches||'',lengthDisplay:it.isWood?`${it.lengthFeet||0}'-${it.lengthInches||0}"`:'',isWood:it.isWood||false,width:it.width||0,thickness:it.thickness||0})));setChallanDate(new Date().toISOString().split('T')[0]);setDeliveryNote('');setHidePriceOnChallan(false);setShowChallanForm(true);};
//   const updateChallanItem=(iuid,field,value)=>{setChallanItems(prev=>prev.map(it=>{if(it.uid!==iuid)return it;const u={...it,[field]:value};if(field==='sendingPcs'){const pcs=parseFloat(value||0);u.sendingQty=it.isWood?calculateByUnit({...u,quantity:pcs}).calculatedQty:pcs;}return u;}));};
//   const handleSubmitChallan=async()=>{
//     const valid=challanItems.filter(i=>parseFloat(i.sendingPcs)>0);
//     if(!valid.length){setError('Kam se kam ek item ki qty daalo');return;}
//     setSaving(true);setError(null);
//     try{
//       const challanNo=genChallanNo();
//       const challanTotal=valid.reduce((s,it)=>s+parseFloat(it.sendingQty||0)*parseFloat(it.rate||0),0);
//       const payload={challan:{challanNo,orderNo:selectedOrder.orderNo,customerName:selectedOrder.customerName,challanDate,deliveryNote,challanTotal,status:'Delivered',hidePrice:hidePriceOnChallan},items:valid.map(it=>({product:it.product,unit:it.unit,orderedQty:it.orderedQty,pieces:parseFloat(it.sendingPcs),sentQty:parseFloat(it.sendingPcs),calculatedQty:it.sendingQty,rate:it.rate,amount:it.sendingQty*it.rate,size:it.size,lengthDisplay:it.lengthDisplay}))};
//       const r=await apiPost('/api/billing-backend/challans',payload);
//       if(!r.success){setError(r.error||'Challan fail');return;}
//       const allC=challans.filter(c=>c.orderNo===selectedOrder.orderNo);const tsm={};
//       [...allC,{items:valid.map(it=>({product:it.product,calculatedQty:it.sendingQty}))}].forEach(ch=>ch.items?.forEach(it=>{tsm[it.product]=(tsm[it.product]||0)+parseFloat(it.calculatedQty||it.sentQty||0);}));
//       const done=(selectedOrder.items||[]).every(oi=>(tsm[oi.product]||0)>=parseFloat(oi.calculatedQty||oi.quantity||0));
//       if(done)await apiPatch('/api/billing-backend/orders',{orderNo:selectedOrder.orderNo,status:'Completed'});
//       const html = getChallanPrintHTML(selectedOrder,{...payload.challan,items:payload.items},hidePriceOnChallan);
//       setLastChallanHTML(html);
//       setLastChallanNo(challanNo);
//       await fetchData();
//       setShowChallanForm(false);
//       setShowChallanSuccess(true);
//     }catch(err){setError('Error: '+err.message);}finally{setSaving(false);}
//   };
//   const getOrderChallans=orderNo=>challans.filter(c=>c.orderNo===orderNo);
//   const getDeliveryProgress=order=>{const sm={};challans.filter(c=>c.orderNo===order.orderNo).forEach(ch=>ch.items?.forEach(it=>{sm[it.product]=(sm[it.product]||0)+parseFloat(it.calculatedQty||it.sentQty||0);}));const items=order.items||[];if(!items.length)return 0;const tot=items.reduce((s,it)=>s+parseFloat(it.calculatedQty||it.quantity||0),0);const sent=items.reduce((s,it)=>s+Math.min(parseFloat(it.calculatedQty||it.quantity||0),sm[it.product]||0),0);return tot>0?Math.round((sent/tot)*100):0;};
//   const markBilled=async orderNo=>{await apiPatch('/api/billing-backend/orders',{orderNo,status:'Billed'});await fetchData();setShowBillPreview(false);};
//   const filteredOrders=orders.filter(o=>{const ms=o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())||o.orderNo?.toLowerCase().includes(searchQuery.toLowerCase());const mst=filterStatus==='All'||o.status===filterStatus;return ms&&mst;});
//   const STATUS={Active:{bg:'#fef3c7',color:'#92400e',dot:'#d97706'},Completed:{bg:'#dcfce7',color:'#166534',dot:'#22c55e'},Billed:{bg:'#dbeafe',color:'#1e40af',dot:'#3b82f6'}};
//   if(loading)return(<div className="flex items-center justify-center min-h-96 flex-col gap-3"><Loader2 className="w-7 h-7 text-amber-600 animate-spin"/><p className="text-gray-400 text-sm">Loading...</p></div>);
//   return(
//     <div>
//       <style jsx global>{`
// @keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}.kt-in{animation:kt-in .28s ease-out}.kt-input{width:100%;padding:9px 13px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;background:#fff;color:#111827;outline:none;transition:border-color .14s,box-shadow .14s}.kt-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}.kt-input[readonly]{background:#f9fafb;color:#6b7280;cursor:not-allowed}.kt-input-sm{padding:7px 10px;font-size:12px}.btn-amber{padding:9px 20px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 6px rgba(180,83,9,.28)}.btn-amber:hover{background:linear-gradient(135deg,#92400e,#b45309);transform:translateY(-1px)}.btn-amber:disabled{opacity:.5;cursor:not-allowed;transform:none}.btn-white{padding:9px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:#374151;display:inline-flex;align-items:center;gap:6px;transition:all .14s}.btn-white:hover{background:#f9fafb;border-color:#d1d5db}.btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}.btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}.btn-blue:hover{opacity:.9}.btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}.icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:#9ca3af}.icon-btn:hover{background:#f3f4f6;color:#374151}.kt-card{background:#fff;border:1px solid #f0f0f0;border-radius:16px;box-shadow:0 1px 5px rgba(0,0,0,.05)}.kt-inset{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}.kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:#6b7280}.kt-tab.active{background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e}.kt-tab:hover:not(.active){background:#f9fafb;color:#374151}.kt-tbl{width:100%;border-collapse:collapse}.kt-tbl thead tr{background:linear-gradient(135deg,#7c3f00,#b45309)}.kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}.kt-tbl thead th.r{text-align:right}.kt-tbl thead th.c{text-align:center}.kt-tbl tbody tr{border-bottom:1px solid #f3f4f6;transition:background .1s}.kt-tbl tbody tr:nth-child(even){background:#fffdf8}.kt-tbl tbody tr:hover{background:#fffbec}.kt-tbl tbody td{padding:10px;font-size:13px;color:#374151;vertical-align:top}.kt-tbl tbody td.r{text-align:right}.kt-tbl tbody td.c{text-align:center}.kt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.44);z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}.kt-modal{background:#fff;border-radius:22px;border:1px solid #e5e7eb;width:100%;max-width:1300px;margin:auto;box-shadow:0 24px 64px rgba(0,0,0,.18);overflow:visible}.kt-mhead{padding:20px 26px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#fffbf2 0%,#fff 100%);border-radius:22px 22px 0 0}.kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto;overflow-x:visible}.kt-mfoot{padding:16px 26px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:8px;background:#fafafa;border-radius:0 0 22px 22px}.prog-track{height:6px;background:#fde68a;border-radius:4px;overflow:hidden}.prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#d97706,#fbbf24);transition:width .5s ease}.prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}.sec-label{font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}.status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}.status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}.total-box{border-radius:12px;padding:14px 18px;border:1px solid}.length-group{display:flex;gap:4px;align-items:center}.length-input{width:50px!important;text-align:center}.material-group{border:2px solid #e5e7eb;border-radius:16px;margin-bottom:16px;overflow:visible;transition:border-color .2s}.material-group:hover{border-color:#fde68a}.material-group-header{background:linear-gradient(135deg,#fffbf2,#fef3c7);padding:14px 18px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.material-group-label{display:flex;align-items:center;gap:10px}.material-group-num{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}.material-group-title{font-size:14px;font-weight:700;color:#7c3f00}.material-group-subtitle{font-size:11px;color:#92400e;margin-top:2px}.material-group-filters{display:flex;gap:8px;flex:1;flex-wrap:wrap;min-width:300px}.material-group-body{padding:18px 20px;overflow:visible}.material-group-footer{padding:10px 18px;border-top:1px dashed #fde68a;background:#fffdf8;display:flex;justify-content:space-between;align-items:center}.item-subrow{background:#fff;border:1px solid #f3f4f6;border-radius:10px;padding:14px;margin-bottom:10px;transition:all .2s;position:relative;overflow:visible}.item-subrow:hover{border-color:#fde68a;background:#fffbf5}.item-subrow:last-child{margin-bottom:0}.item-subrow-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.item-subrow-num{width:24px;height:24px;border-radius:6px;background:#fef3c7;color:#92400e;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px}.unit-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}.wood-badge{background:#dcfce7;color:#166534}.hardware-badge{background:#e0e7ff;color:#3730a3}.calc-display{background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:10px;margin-top:10px}.btn-add-inner{padding:7px 14px;background:#fff;border:1px dashed #d97706;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;color:#d97706;display:inline-flex;align-items:center;gap:5px;transition:all .15s}.btn-add-inner:hover{background:#fffbeb;border-style:solid}.btn-add-outer{padding:10px 20px;background:#fff;border:2px dashed #e5e7eb;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:#6b7280;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s;width:100%}.btn-add-outer:hover{background:#f9fafb;border-color:#d97706;color:#d97706}.searchable-select{position:relative;width:100%}.ss-input-wrap{position:relative;display:flex;align-items:center}.ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;background:#fff;color:#111827;outline:none;transition:all .15s}.ss-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}.ss-input.with-icon{padding-left:32px}.ss-search-icon{position:absolute;left:10px;width:14px;height:14px;color:#9ca3af;pointer-events:none}.ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}.ss-clear{width:18px;height:18px;border-radius:50%;background:#f3f4f6;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280}.ss-clear:hover{background:#e5e7eb;color:#374151}.ss-arrow{width:14px;height:14px;color:#9ca3af;transition:transform .2s}.ss-arrow.open{transform:rotate(180deg)}.ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.15);z-index:9999;max-height:320px;overflow:hidden;animation:ss-drop .15s ease}@keyframes ss-drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.ss-dropdown-header{padding:8px 12px;background:#fef3c7;border-bottom:1px solid #fde68a;font-size:11px;color:#92400e;font-weight:600}.ss-options{max-height:260px;overflow-y:auto}.ss-option{padding:10px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid #f3f4f6}.ss-option:last-child{border-bottom:none}.ss-option:hover,.ss-option.highlighted{background:#fffbeb}.ss-option.selected{background:#fef3c7}.ss-no-results{padding:20px;text-align:center;color:#9ca3af;font-size:13px}.ss-more{padding:10px 12px;text-align:center;color:#d97706;font-size:12px;font-weight:500;background:#fffbeb}.product-dropdown{max-height:400px}.product-dropdown .ss-options{max-height:340px}.product-option{padding:10px 12px}.product-option-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.product-name{font-weight:600;color:#111827;font-size:13px}.product-sku{font-size:11px;color:#d97706;font-family:monospace;background:#fef3c7;padding:2px 6px;border-radius:4px}.product-option-sub{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.product-cat{font-size:11px;color:#6b7280}.product-sep{color:#d1d5db;font-size:10px}.product-unit{font-size:10px;color:#fff;background:#d97706;padding:2px 6px;border-radius:4px;margin-left:auto}.edit-badge{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600}
// .success-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#dcfce7,#bbf7d0);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
//       `}</style>
//       {error&&<div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3"><AlertTriangle className="w-4 h-4 text-red-500 shrink-0"/><span className="text-sm text-red-700 flex-1">{error}</span><button className="icon-btn" onClick={()=>setError(null)}><X className="w-3 h-3"/></button></div>}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><div><h2 className="text-2xl font-bold text-gray-800">Order Management</h2><p className="text-gray-400 text-sm mt-0.5">{SHOP_INFO.name}</p></div><div className="flex items-center gap-2 flex-wrap"><button className="icon-btn" onClick={fetchData}><RefreshCw className="w-4 h-4"/></button><button className={`kt-tab ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}>Orders</button><button className={`kt-tab ${activeTab==='challans'?'active':''}`} onClick={()=>setActiveTab('challans')}>Challans</button><button className="btn-amber" onClick={()=>{resetOrderForm();setShowOrderForm(true);}}><Plus className="w-4 h-4"/>New Order</button></div></div>
//       <div className="kt-card mb-6 overflow-hidden"><div style={{background:'linear-gradient(135deg,#7c3f00,#d97706)',padding:'14px 24px',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>{[{n:'1',label:'Order',desc:'Customer requirement',bg:'#fef3c7',col:'#92400e'},{n:'2',label:'Challan',desc:'Partial delivery',bg:'#fde68a',col:'#78350f'},{n:'3',label:'Bill',desc:'Final invoice',bg:'#fbbf24',col:'#451a03'}].map((s,i,a)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:8}}><div style={{display:'flex',alignItems:'center',gap:8}}><div className="step-dot" style={{background:s.bg,color:s.col}}>{s.n}</div><div><p style={{fontWeight:700,fontSize:13,color:'#fff',margin:0}}>{s.label}</p><p style={{fontSize:11,color:'rgba(255,255,255,.65)',margin:0}}>{s.desc}</p></div></div>{i<a.length-1&&<ArrowRight style={{width:14,height:14,color:'rgba(255,255,255,.4)',margin:'0 6px'}}/>}</div>))}</div></div>
//       {/* ORDERS TAB */}
//       {activeTab==='orders'&&(<div className="space-y-5 kt-in"><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[{label:'Total',value:orders.length,bg:'#fff',color:'#111827'},{label:'Active',value:orders.filter(o=>o.status==='Active').length,bg:'#fffbeb',color:'#92400e'},{label:'Completed',value:orders.filter(o=>o.status==='Completed').length,bg:'#f0fdf4',color:'#166534'},{label:'Products',value:products.length,bg:'#fef3c7',color:'#7c3f00'}].map((c,i)=>(<div key={i} className="kt-card p-4" style={{background:c.bg}}><p className="text-xs font-medium text-gray-400 mb-1">{c.label}</p><p className="text-xl font-bold" style={{color:c.color}}>{c.value}</p></div>))}</div><div className="flex gap-3 flex-wrap"><div className="relative flex-1" style={{minWidth:200}}><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"/><input className="kt-input" style={{paddingLeft:36}} placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/></div><div className="flex gap-1.5">{['All','Active','Completed','Billed'].map(s=>(<button key={s} onClick={()=>setFilterStatus(s)} className={`kt-tab ${filterStatus===s?'active':''}`} style={{padding:'8px 14px',fontSize:12}}>{s}</button>))}</div></div><div className="space-y-3">{filteredOrders.length===0&&<div className="kt-card p-14 text-center"><div style={{width:56,height:56,borderRadius:16,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><Receipt style={{width:28,height:28,color:'#d97706'}}/></div><p className="text-gray-400 text-sm">Koi order nahi</p></div>}{filteredOrders.map((order,i)=>{const progress=getDeliveryProgress(order);const st=STATUS[order.status]||STATUS.Active;const oc=getOrderChallans(order.orderNo);return(<div key={i} className="kt-card p-5 kt-in"><div className="flex items-start justify-between gap-4 flex-wrap"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-2 flex-wrap"><span className="font-mono text-sm font-bold" style={{color:'#b45309'}}>{order.orderNo}</span><span className="status-pill" style={{background:st.bg,color:st.color}}><span className="status-dot" style={{background:st.dot}}/>{order.status}</span>{order.gstRate>0&&<span className="status-pill" style={{background:'#eff6ff',color:'#1d4ed8'}}>GST {order.gstRate}%</span>}{order.poNumber&&<span className="edit-badge">PO: {order.poNumber}</span>}{order.gstCustomerName&&<span className="status-pill" style={{background:'#f3e8ff',color:'#6b21a8'}}>GST: {order.gstCustomerName}</span>}</div><p className="font-bold text-gray-800 text-base mb-1 truncate">{order.customerName}</p><p className="text-xs text-gray-400">{order.customerPhone&&`${order.customerPhone} · `}{new Date(order.orderDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}&nbsp;·&nbsp;{(order.items||[]).length} items&nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(order.total)||0).toLocaleString('en-IN')}</span></p></div><div className="flex flex-col items-end gap-3 shrink-0"><div style={{width:168}}><div className="flex justify-between mb-1.5"><span className="text-xs text-gray-400">Delivery</span><span className="text-xs font-bold" style={{color:progress===100?'#16a34a':'#d97706'}}>{progress}%</span></div><div className="prog-track"><div className={`prog-fill ${progress===100?'done':''}`} style={{width:`${progress}%`}}/></div><p className="text-xs text-gray-400 mt-1 text-right">{oc.length} challan{oc.length!==1?'s':''}</p></div><div className="flex gap-2 flex-wrap justify-end">{order.status!=='Billed'&&<button className="btn-blue" onClick={()=>openEditOrder(order)}><Edit2 className="w-3.5 h-3.5"/>Edit</button>}{order.status!=='Billed'&&<button className="btn-white" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>openChallanForm(order)}><TruckIcon className="w-3.5 h-3.5"/>Challan</button>}{(order.status==='Completed'||order.status==='Billed')&&<button className="btn-amber" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{setSelectedOrder(order);setShowBillPreview(true);}}><Receipt className="w-3.5 h-3.5"/>Final Bill</button>}</div></div></div></div>);})}</div></div>)}
//       {/* CHALLANS TAB */}
//       {activeTab==='challans'&&(<div className="space-y-3 kt-in">{challans.length===0&&<div className="kt-card p-14 text-center"><div style={{width:56,height:56,borderRadius:16,background:'#fef9ec',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><TruckIcon style={{width:28,height:28,color:'#d97706'}}/></div><p className="text-gray-400 text-sm">Koi challan nahi</p></div>}{[...challans].reverse().map((ch,i)=>(<div key={i} className="kt-card p-4 kt-in"><div className="flex items-center justify-between flex-wrap gap-3"><div><div className="flex items-center gap-2 mb-1.5 flex-wrap"><span className="font-mono text-sm font-bold" style={{color:'#b45309'}}>{ch.challanNo}</span><span className="text-xs text-gray-400">→ <strong className="text-gray-600">{ch.orderNo}</strong></span><span className="status-pill" style={{background:'#dcfce7',color:'#166534'}}><span className="status-dot" style={{background:'#22c55e'}}/>Delivered</span>{ch.hidePrice&&<span className="status-pill" style={{background:'#fef3c7',color:'#92400e'}}><EyeOff className="w-3 h-3"/>Hidden</span>}</div><p className="font-semibold text-gray-800">{ch.customerName}</p><p className="text-xs text-gray-400 mt-0.5">{new Date(ch.challanDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}&nbsp;·&nbsp;{(ch.items||[]).length} items{!ch.hidePrice&&<>&nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(ch.challanTotal)||0).toLocaleString('en-IN')}</span></>}</p></div><div className="flex gap-2"><button className="btn-white" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{const order=orders.find(o=>o.orderNo===ch.orderNo);if(order)openPDFView(getChallanPrintHTML(order,ch,ch.hidePrice));}}><Eye className="w-3.5 h-3.5"/>View</button><button className="btn-amber" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{const order=orders.find(o=>o.orderNo===ch.orderNo);if(order)openPDFPrint(getChallanPrintHTML(order,ch,ch.hidePrice));}}><Printer className="w-3.5 h-3.5"/>Print</button></div></div></div>))}</div>)}
//       {/* ORDER FORM MODAL */}
//       {showOrderForm&&(<div className="kt-overlay"><div className="kt-modal kt-in"><div className="kt-mhead"><div className="flex items-center gap-3"><div className="step-dot" style={{background:isEditMode?'#dbeafe':'#fef3c7',color:isEditMode?'#1e40af':'#92400e'}}>{isEditMode?<Edit2 className="w-3.5 h-3.5"/>:'1'}</div><div><h3 className="font-bold text-gray-800 text-lg m-0">{isEditMode?`Edit — ${editingOrder?.orderNo}`:'New Order'}</h3><p className="text-xs text-gray-400 m-0">{isEditMode?'Update':'Group items by material'}</p></div></div><button className="icon-btn" onClick={()=>{setShowOrderForm(false);resetOrderForm();}}><X className="w-5 h-5"/></button></div><div className="kt-mbody space-y-6"><div><p className="sec-label">Customer Details</p><div className="grid grid-cols-1 sm:grid-cols-4 gap-3"><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Customer Name *</label><input className="kt-input" value={orderForm.customerName} onChange={e=>setOrderForm(p=>({...p,customerName:e.target.value}))}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label><input className="kt-input" value={orderForm.customerPhone} onChange={e=>setOrderForm(p=>({...p,customerPhone:e.target.value}))}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Date</label><input type="date" className="kt-input" value={orderForm.orderDate} onChange={e=>setOrderForm(p=>({...p,orderDate:e.target.value}))}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">GST</label><select className="kt-input" value={orderForm.gstRate} onChange={e=>setOrderForm(p=>({...p,gstRate:parseFloat(e.target.value)}))}>{GST_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">PO Number</label><input className="kt-input" value={orderForm.poNumber} onChange={e=>setOrderForm(p=>({...p,poNumber:e.target.value}))}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">GST Customer</label><input className="kt-input" value={orderForm.gstCustomerName} onChange={e=>setOrderForm(p=>({...p,gstCustomerName:e.target.value}))}/></div><div className="sm:col-span-2"><label className="text-xs font-medium text-gray-500 block mb-1.5">Address</label><textarea className="kt-input" rows={2} style={{resize:'none'}} value={orderForm.customerAddress} onChange={e=>setOrderForm(p=>({...p,customerAddress:e.target.value}))}/></div></div></div><div><p className="sec-label">Items</p>{orderGroups.map((group,gIdx)=>{const gp=getFilteredProductsForGroup(group);const gc=getCategoriesFor(group.filterMaterialType);const gsc=getSubCategoriesFor(group.filterMaterialType,group.filterCategory);const gt=group.items.reduce((s,i)=>s+(i.amount||0),0);return(<div key={group.groupId} className="material-group kt-in"><div className="material-group-header"><div className="material-group-label"><div className="material-group-num">{gIdx+1}</div><div><div className="material-group-title">{group.filterMaterialType||'Select Material'}{group.filterCategory&&` › ${group.filterCategory}`}</div><div className="material-group-subtitle">{group.items.length} items · {gp.length} available</div></div></div>{orderGroups.length>1&&<button className="icon-btn" onClick={()=>removeGroup(group.groupId)}><Trash2 className="w-4 h-4 text-red-400"/></button>}</div><div style={{padding:'12px 18px',background:'#fefdf5',borderBottom:'1px solid #f3f4f6'}}><div className="material-group-filters"><div style={{flex:1,minWidth:160}}><label className="text-xs font-medium text-gray-500 block mb-1">Material</label><SearchableSelect options={getAllMaterialTypes()} value={group.filterMaterialType} onChange={v=>updateGroupFilter(group.groupId,'filterMaterialType',v)} placeholder="🔍"/></div><div style={{flex:1,minWidth:160}}><label className="text-xs font-medium text-gray-500 block mb-1">Category</label><SearchableSelect options={gc} value={group.filterCategory} onChange={v=>updateGroupFilter(group.groupId,'filterCategory',v)} placeholder="🔍"/></div><div style={{flex:1,minWidth:160}}><label className="text-xs font-medium text-gray-500 block mb-1">Sub Cat</label><SearchableSelect options={gsc} value={group.filterSubCategory} onChange={v=>updateGroupFilter(group.groupId,'filterSubCategory',v)} placeholder="🔍"/></div></div></div><div className="material-group-body">{group.items.map((item,itemIdx)=>(<div key={item.uid} className="item-subrow"><div className="item-subrow-header"><div className="flex items-center gap-3"><div className="item-subrow-num">{itemIdx+1}</div>{item.isWood?<span className="unit-badge wood-badge">🪵 Wood</span>:item.product?<span className="unit-badge hardware-badge">🔧</span>:null}{item.product&&<span className="text-xs font-semibold text-gray-600">{item.product}</span>}</div><button className="icon-btn" onClick={()=>removeItemFromGroup(group.groupId,item.uid)} disabled={group.items.length===1}><Trash2 className="w-3.5 h-3.5 text-red-400"/></button></div><div className="grid grid-cols-1 md:grid-cols-6 gap-3"><div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 block mb-1.5">Product *</label><ProductSearchableSelect products={gp} value={item.skuCode} onChange={v=>updateGroupItem(group.groupId,item.uid,'skuCode',v)}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Unit</label>{item.isWood?<select className="kt-input kt-input-sm" value={item.unit} onChange={e=>updateGroupItem(group.groupId,item.uid,'unit',e.target.value)}>{WOOD_UNIT_OPTIONS.map(u=><option key={u}>{u}</option>)}</select>:<input className="kt-input kt-input-sm" value={item.unit||'Pcs'} readOnly/>}</div>{item.isWood&&<div><label className="text-xs font-medium text-gray-500 block mb-1.5">Size</label><input className="kt-input kt-input-sm" value={item.size||'—'} readOnly/></div>}{item.isWood&&<div><label className="text-xs font-medium text-gray-500 block mb-1.5">Length</label><div className="length-group"><input type="number" min="0" className="kt-input kt-input-sm length-input" value={item.lengthFeet} onChange={e=>updateGroupItem(group.groupId,item.uid,'lengthFeet',e.target.value)}/><span className="text-gray-400 text-xs">ft</span><input type="number" min="0" max="11" className="kt-input kt-input-sm length-input" value={item.lengthInches} onChange={e=>updateGroupItem(group.groupId,item.uid,'lengthInches',e.target.value)}/><span className="text-gray-400 text-xs">in</span></div></div>}<div><label className="text-xs font-medium text-gray-500 block mb-1.5">{item.isWood?'Pcs':'Qty'}</label><input type="number" min="1" className="kt-input kt-input-sm" value={item.quantity} onChange={e=>updateGroupItem(group.groupId,item.uid,'quantity',e.target.value)}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Rate</label><input type="number" min="0" className="kt-input kt-input-sm" value={item.rate} onChange={e=>updateGroupItem(group.groupId,item.uid,'rate',e.target.value)}/></div></div>{item.product&&<div className="calc-display"><div className="flex justify-between items-center flex-wrap gap-2"><div className="text-xs text-amber-800">{item.isWood?<><strong>{item.unit}:</strong> {item.calculatedQty.toFixed(3)} {item.unit}</>:<><strong>Qty:</strong> {item.quantity||0}</>}</div><div className="text-base font-bold text-amber-900">₹{(item.amount||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</div></div></div>}</div>))}</div><div className="material-group-footer"><button className="btn-add-inner" onClick={()=>addItemToGroup(group.groupId)}><Plus className="w-3.5 h-3.5"/>Add Item</button><div className="text-sm font-bold" style={{color:'#7c3f00'}}>₹{gt.toLocaleString('en-IN',{minimumFractionDigits:2})}</div></div></div>)})}<button className="btn-add-outer" onClick={addNewGroup}><Plus className="w-4 h-4"/>Add New Group</button></div><div className="flex justify-end"><div className="total-box" style={{width:300,background:'#fffbeb',borderColor:'#fde68a'}}><div className="flex justify-between text-sm text-gray-600 mb-2"><span>Subtotal</span><span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>{orderForm.gstRate>0&&<div className="flex justify-between text-sm text-gray-600 mb-2"><span>GST ({orderForm.gstRate}%)</span><span className="font-semibold">₹{orderTax.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>}<div className="flex justify-between font-bold text-lg border-t border-amber-300 pt-2 mt-2" style={{color:'#7c3f00'}}><span>Total</span><span>₹{orderTotal.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div></div></div></div><div className="kt-mfoot"><button className="btn-white" onClick={()=>{setShowOrderForm(false);resetOrderForm();}}>Cancel</button><button className="btn-amber" disabled={!orderForm.customerName||orderSubtotal===0||saving} onClick={handleSubmitOrder}>{saving?<><Loader2 className="w-4 h-4 animate-spin"/>Saving...</>:isEditMode?<><CheckCircle className="w-4 h-4"/>Update</>:<><CheckCircle className="w-4 h-4"/>Save</>}</button></div></div></div>)}
//       {/* CHALLAN FORM */}
//       {showChallanForm&&selectedOrder&&(<div className="kt-overlay"><div className="kt-modal kt-in" style={{maxWidth:950}}><div className="kt-mhead"><div className="flex items-center gap-3"><div className="step-dot" style={{background:'#fde68a',color:'#78350f'}}>2</div><div><h3 className="font-bold text-gray-800 text-base m-0">Delivery Challan</h3><p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p></div></div><button className="icon-btn" onClick={()=>setShowChallanForm(false)}><X className="w-4 h-4"/></button></div><div className="kt-mbody space-y-4"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Date</label><input type="date" className="kt-input" value={challanDate} onChange={e=>setChallanDate(e.target.value)}/></div><div><label className="text-xs font-medium text-gray-500 block mb-1.5">Note</label><input className="kt-input" value={deliveryNote} onChange={e=>setDeliveryNote(e.target.value)}/></div><div className="flex items-center gap-3 pt-5"><input type="checkbox" id="hp" checked={hidePriceOnChallan} onChange={e=>setHidePriceOnChallan(e.target.checked)} style={{width:18,height:18,accentColor:'#d97706'}}/><label htmlFor="hp" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2"><EyeOff className="w-4 h-4 text-amber-600"/>Hide Price</label></div></div>{(selectedOrder.poNumber||selectedOrder.gstCustomerName)&&<div className="flex gap-3 flex-wrap">{selectedOrder.poNumber&&<div className="text-xs px-3 py-2 rounded-lg" style={{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe'}}><strong>PO:</strong> {selectedOrder.poNumber}</div>}{selectedOrder.gstCustomerName&&<div className="text-xs px-3 py-2 rounded-lg" style={{background:'#f3e8ff',color:'#6b21a8',border:'1px solid #e9d5ff'}}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}</div>}<div><p className="sec-label">Items</p><div className="kt-inset"><div className="overflow-x-auto"><table className="kt-tbl"><thead><tr><th>Item Description</th><th className="c" style={{width:55}}>Unit</th><th className="r" style={{width:80}}>Ordered</th><th className="r" style={{width:80}}>Sent</th><th className="r" style={{width:80}}>Left</th><th className="r" style={{width:90}}>Sending</th><th className="r" style={{width:90}}>Calc Qty</th></tr></thead><tbody>{challanItems.map(it=>{const rem=it.orderedQty-it.alreadySent;return(<tr key={it.uid}><td className="font-medium">{it.product}{it.isWood&&<><span className="unit-badge wood-badge ml-2">🪵</span>{(it.size||it.lengthDisplay)&&<div className="text-xs text-gray-400 mt-1">{[it.size,it.lengthDisplay].filter(Boolean).join(' · ')}</div>}</>}</td><td className="c text-xs text-gray-500">{it.unit}</td><td className="r text-gray-600">{it.orderedQty.toFixed(3)}</td><td className="r font-semibold" style={{color:'#d97706'}}>{it.alreadySent?it.alreadySent.toFixed(3):'—'}</td><td className="r font-bold" style={{color:rem<=0.001?'#16a34a':'#111827'}}>{rem<=0.001?'✓':rem.toFixed(3)}</td><td><input type="number" min="0" className="kt-input" style={{padding:'8px',fontSize:13,textAlign:'right',background:rem<=0.001?'#f9fafb':undefined}} value={it.sendingPcs} disabled={rem<=0.001} onChange={e=>updateChallanItem(it.uid,'sendingPcs',e.target.value)}/></td><td className="r font-bold text-amber-700">{it.sendingQty?it.sendingQty.toFixed(3):'—'}</td></tr>);})}</tbody></table></div></div></div>{!hidePriceOnChallan&&<div className="flex justify-end"><div className="total-box" style={{minWidth:240,background:'#fffbeb',borderColor:'#fde68a'}}><div className="flex justify-between font-bold text-base" style={{color:'#7c3f00'}}><span>Total</span><span>₹{challanItems.reduce((s,it)=>s+parseFloat(it.sendingQty||0)*parseFloat(it.rate||0),0).toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div></div></div>}</div><div className="kt-mfoot"><button className="btn-white" onClick={()=>setShowChallanForm(false)}>Cancel</button><button className="btn-amber" disabled={saving} onClick={handleSubmitChallan}>{saving?<><Loader2 className="w-4 h-4 animate-spin"/>Saving...</>:<><CheckCircle className="w-4 h-4"/>Save Challan</>}</button></div></div></div>)}
//       {/* CHALLAN SUCCESS MODAL */}
//       {showChallanSuccess&&(
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{maxWidth:480}}>
//             <div className="kt-mbody" style={{textAlign:'center',padding:'40px 30px'}}>
//               <div className="success-icon">
//                 <CheckCircle style={{width:32,height:32,color:'#16a34a'}}/>
//               </div>
//               <h3 style={{fontSize:20,fontWeight:700,color:'#111827',marginBottom:6}}>Challan Created!</h3>
//               <p style={{fontSize:14,color:'#6b7280',marginBottom:6}}>{lastChallanNo}</p>
//               <p style={{fontSize:13,color:'#9ca3af',marginBottom:28}}>Ab aap view, print ya save kar sakte hain</p>
//               <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
//                 <button className="btn-teal" onClick={()=>{ openPDFView(lastChallanHTML); }}>
//                   <Eye className="w-4 h-4"/>View PDF
//                 </button>
//                 <button className="btn-amber" onClick={()=>{ openPDFPrint(lastChallanHTML); }}>
//                   <Printer className="w-4 h-4"/>Print
//                 </button>
//                 <button className="btn-blue" style={{padding:'9px 18px',fontSize:13}} onClick={()=>{
//                   const win = window.open('','_blank');
//                   const cleanHTML = lastChallanHTML.replace(/<div class="action-bar no-print">[\s\S]*?<\/div>/, '');
//                   win.document.write(cleanHTML);
//                   win.document.close();
//                   setTimeout(()=>{win.focus();win.print();},600);
//                 }}>
//                   <Download className="w-4 h-4"/>Save PDF
//                 </button>
//               </div>
//             </div>
//             <div className="kt-mfoot" style={{justifyContent:'center'}}>
//               <button className="btn-white" onClick={()=>setShowChallanSuccess(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* FINAL BILL */}
//       {showBillPreview&&selectedOrder&&(<div className="kt-overlay"><div className="kt-modal kt-in" style={{maxWidth:800}}><div className="kt-mhead"><div className="flex items-center gap-3"><div className="step-dot" style={{background:'#dcfce7',color:'#166534'}}>3</div><div><h3 className="font-bold text-gray-800 text-base m-0">Final Invoice</h3><p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo}</p></div></div><button className="icon-btn" onClick={()=>setShowBillPreview(false)}><X className="w-4 h-4"/></button></div><div className="kt-mbody">{(()=>{const oc=challans.filter(c=>c.orderNo===selectedOrder.orderNo);const m={};oc.forEach(ch=>ch.items?.forEach(it=>{const key=it.product+'|'+(it.size||'')+'|'+(it.lengthDisplay||'');if(!m[key])m[key]={product:it.product,unit:it.unit,rate:it.rate,totalQty:0,totalAmount:0,size:it.size||'',lengthDisplay:it.lengthDisplay||''};m[key].totalQty+=parseFloat(it.calculatedQty||it.sentQty||0);m[key].totalAmount+=parseFloat(it.amount||0);}));const li=Object.values(m);const sub=li.reduce((s,i)=>s+i.totalAmount,0);const gstRate=selectedOrder.gstRate||0;const tax=gstRate>0?sub*(gstRate/100):0;const total=sub+tax;return(<div className="space-y-4"><div className="flex gap-3 flex-wrap"><div className="text-xs px-4 py-2.5 rounded-xl flex-1" style={{background:'#fef3c7',color:'#78350f',border:'1px solid #fde68a'}}><strong>Challans: </strong>{oc.length?oc.map(c=>c.challanNo).join(', '):'None'}</div>{selectedOrder.poNumber&&<div className="text-xs px-3 py-2.5 rounded-xl" style={{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe'}}><strong>PO:</strong> {selectedOrder.poNumber}</div>}{selectedOrder.gstCustomerName&&<div className="text-xs px-3 py-2.5 rounded-xl" style={{background:'#f3e8ff',color:'#6b21a8',border:'1px solid #e9d5ff'}}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}</div><div className="kt-inset"><table className="kt-tbl"><thead><tr><th style={{width:30}}>#</th><th>Item Description</th><th className="r" style={{width:80}}>Qty</th><th className="r" style={{width:80}}>Rate</th><th className="r" style={{width:100}}>Amount</th></tr></thead><tbody>{li.map((it,i)=>(<tr key={i}><td className="c text-gray-400 text-xs">{i+1}</td><td className="font-medium">{it.product}{(it.size||it.lengthDisplay)&&<div className="text-xs text-gray-400 mt-0.5">{[it.size,it.lengthDisplay].filter(x=>x&&x!=="0'-0\"").join(' · ')}</div>}</td><td className="r font-semibold text-amber-700">{it.totalQty.toFixed(3)} <span className="text-xs text-gray-400">{it.unit}</span></td><td className="r text-gray-500">₹{parseFloat(it.rate||0).toLocaleString('en-IN')}</td><td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr>))}</tbody></table></div><div className="flex justify-end"><div className="total-box" style={{width:280,background:'#f0fdf4',borderColor:'#bbf7d0'}}><div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>{gstRate>0&&<div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>GST ({gstRate}%)</span><span>₹{tax.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>}<div className="flex justify-between font-bold text-base border-t border-green-200 pt-2" style={{color:'#166534'}}><span>Grand Total</span><span>₹{total.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div></div></div></div>);})()}</div>
//       <div className="kt-mfoot">
//         <button className="btn-white" onClick={()=>setShowBillPreview(false)}>Close</button>
//         <button className="btn-teal" onClick={()=>{const oc=challans.filter(c=>c.orderNo===selectedOrder.orderNo);openPDFView(getBillPrintHTML(selectedOrder,oc));}}><Eye className="w-4 h-4"/>View</button>
//         <button className="btn-amber" onClick={()=>{const oc=challans.filter(c=>c.orderNo===selectedOrder.orderNo);openPDFPrint(getBillPrintHTML(selectedOrder,oc));}}><Printer className="w-4 h-4"/>Print</button>
//         <button className="btn-blue" style={{padding:'9px 18px',fontSize:13}} onClick={()=>{const oc=challans.filter(c=>c.orderNo===selectedOrder.orderNo);const html=getBillPrintHTML(selectedOrder,oc).replace(/<div class="action-bar no-print">[\s\S]*?<\/div>/,'');const win=window.open('','_blank');win.document.write(html);win.document.close();setTimeout(()=>{win.focus();win.print();},600);}}><Download className="w-4 h-4"/>Save PDF</button>
//         {selectedOrder.status==='Completed'&&<button className="btn-green" onClick={()=>{const oc=challans.filter(c=>c.orderNo===selectedOrder.orderNo);openPDFPrint(getBillPrintHTML(selectedOrder,oc));markBilled(selectedOrder.orderNo);}}><Receipt className="w-4 h-4"/>Mark Billed</button>}
//       </div></div></div>)}
//     </div>
//   );
// }




///// final  same to same Client challan photo  ////



// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Trash2, Printer, Search, CheckCircle,
//   AlertTriangle, Loader2, RefreshCw, Download, Eye,
//   X, TruckIcon, Receipt, ArrowRight, EyeOff, ChevronDown, Edit2
// } from 'lucide-react';

// const SHOP_INFO = {
//   name: 'Krishna Timber & Plywoods',
//   address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
//   phone: '9826700196',
//   gstin: '23ADCPC2098K1ZQ',
// };

// const GST_OPTIONS = [
//   { value: 0, label: 'No GST' },
//   { value: 5, label: 'GST 5%' },
//   { value: 12, label: 'GST 12%' },
//   { value: 18, label: 'GST 18%' },
// ];

// const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];

// function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

// function parseWoodDimensions(name) {
//   if (!name) return null;
//   const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
//   if (!match) return null;
//   let width = parseFloat(match[1]);
//   let thickness = match[2];
//   if (thickness.includes('½')) thickness = parseFloat(thickness.replace('½', '')) + 0.5 || 0.5;
//   else if (thickness.includes('¼')) thickness = parseFloat(thickness.replace('¼', '')) + 0.25 || 0.25;
//   else if (thickness.includes('¾')) thickness = parseFloat(thickness.replace('¾', '')) + 0.75 || 0.75;
//   else thickness = parseFloat(thickness);
//   return { width, thickness };
// }

// function calculateByUnit(item) {
//   const qty = parseFloat(item.quantity || 0);
//   const rate = parseFloat(item.rate || 0);
//   const width = parseFloat(item.width || 0);
//   const thickness = parseFloat(item.thickness || 0);
//   const totalLengthFeet = parseFloat(item.lengthFeet || 0) + (parseFloat(item.lengthInches || 0) / 12);
//   let calculatedQty = qty;
//   if (item.isWood) {
//     switch (item.unit) {
//       case 'CFT': calculatedQty = (width * thickness * totalLengthFeet * qty) / 144; break;
//       case 'RFT': calculatedQty = totalLengthFeet * qty; break;
//       case 'SQFT': calculatedQty = (width * totalLengthFeet * qty) / 12; break;
//       case 'Per Piece': calculatedQty = qty; break;
//       default: calculatedQty = qty;
//     }
//   }
//   return {
//     calculatedQty: Math.round(calculatedQty * 1000) / 1000,
//     amount: Math.round(calculatedQty * rate * 100) / 100,
//   };
// }

// function rebuildItemForEdit(savedItem) {
//   const item = {
//     uid: uid(), product: savedItem.product || '', unit: savedItem.unit || '',
//     lengthFeet: savedItem.lengthFeet || '', lengthInches: savedItem.lengthInches || '',
//     quantity: savedItem.quantity || '', rate: savedItem.rate || '',
//     amount: savedItem.amount || 0, calculatedQty: savedItem.calculatedQty || 0,
//     skuCode: savedItem.skuCode || '', isWood: savedItem.isWood || false,
//     width: parseFloat(savedItem.width || 0), thickness: parseFloat(savedItem.thickness || 0),
//     size: savedItem.size || '', materialType: savedItem.materialType || '',
//     category: savedItem.category || '', subCategory: savedItem.subCategory || '',
//   };
//   if (item.isWood && (!item.width || !item.thickness)) {
//     const dims = parseWoodDimensions(item.product);
//     if (dims) { item.width = dims.width; item.thickness = dims.thickness; if (!item.size) item.size = `${dims.width}×${dims.thickness}"`; }
//   }
//   const calc = calculateByUnit(item);
//   item.calculatedQty = calc.calculatedQty;
//   item.amount = calc.amount;
//   return item;
// }

// function numberToWords(num) {
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
//   if (num === 0) return 'Zero';
//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:'');
//     if (n < 1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+convert(n%100):'');
//     if (n < 100000) return convert(Math.floor(n/1000))+' Thousand'+(n%1000?' '+convert(n%1000):'');
//     if (n < 10000000) return convert(Math.floor(n/100000))+' Lakh'+(n%100000?' '+convert(n%100000):'');
//     return convert(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+convert(n%10000000):'');
//   }
//   const i=Math.floor(num),d=Math.round((num-i)*100);
//   return convert(i)+' Rupees'+(d>0?' and '+convert(d)+' Paise':'')+' Only';
// }

// function SearchableSelect({ options, value, onChange, placeholder='Search...', disabled=false }) {
//   const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
//   const filtered=options.filter(o=>(typeof o==='string'?o:o.label||o).toLowerCase().includes(search.toLowerCase()));
//   const getVal=o=>typeof o==='string'?o:o.value??o.label??o;const getDisp=o=>typeof o==='string'?o:o.label??o.value??o;
//   const selDisp=options.find(o=>getVal(o)===value);
//   useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
//   const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(getVal(filtered[hiIdx]));setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
//   return(<div ref={wrapRef} className="searchable-select"><div className="ss-input-wrap"><input type="text" className="ss-input" placeholder={value?'':placeholder} value={isOpen?search:(selDisp?getDisp(selDisp):'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown">{filtered.length===0?<div className="ss-no-results">No results</div>:<div className="ss-options">{filtered.map((o,idx)=>(<div key={idx} className={`ss-option ${hiIdx===idx?'highlighted':''} ${getVal(o)===value?'selected':''}`} onClick={()=>{onChange(getVal(o));setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)}>{getDisp(o)}</div>))}</div>}</div>}</div>);
// }

// function ProductSearchableSelect({ products, value, onChange, disabled=false }) {
//   const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
//   const filtered=products.filter(p=>{const s=search.toLowerCase();return p.materialName?.toLowerCase().includes(s)||p.skuCode?.toLowerCase().includes(s)||p.category?.toLowerCase().includes(s)||p.subCategory?.toLowerCase().includes(s);});
//   const selected=products.find(p=>p.skuCode===value);
//   useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
//   const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(filtered[hiIdx].skuCode);setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
//   return(<div ref={wrapRef} className="searchable-select product-select"><div className="ss-input-wrap"><Search className="ss-search-icon"/><input type="text" className="ss-input with-icon" placeholder={selected?'':'🔍 Search product...'} value={isOpen?search:(selected?.materialName||'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown product-dropdown"><div className="ss-dropdown-header"><span>{filtered.length} products</span></div>{filtered.length===0?<div className="ss-no-results">No match</div>:<div className="ss-options">{filtered.slice(0,50).map((p,idx)=>(<div key={p.skuCode} className={`ss-option product-option ${hiIdx===idx?'highlighted':''} ${p.skuCode===value?'selected':''}`} onClick={()=>{onChange(p.skuCode);setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)}><div className="product-option-main"><span className="product-name">{p.materialName}</span><span className="product-sku">{p.skuCode}</span></div><div className="product-option-sub"><span className="product-cat">{p.materialType}</span><span className="product-sep">›</span><span className="product-cat">{p.category}</span>{p.subCategory&&<><span className="product-sep">›</span><span className="product-cat">{p.subCategory}</span></>}<span className="product-unit">{p.unit}</span></div></div>))}{filtered.length>50&&<div className="ss-more">+{filtered.length-50} more...</div>}</div>}</div>}</div>);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PRINT CSS — KTP Maroon Theme, B&W Print Safe
// // ─────────────────────────────────────────────────────────────────────────────
// const PRINT_CSS = `
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:Arial,sans-serif;font-size:11px;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// .page{max-width:195mm;margin:0 auto;padding:8mm 10mm}

// /* ── ACTION BAR (screen only) ── */
// .action-bar{display:flex;gap:10px;justify-content:center;padding:12px;background:#f5f0f0;border-radius:10px;margin-bottom:16px;border:1px solid #ddd}
// .action-btn{padding:9px 22px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
// .btn-print{background:#7B1E1E;color:#fff}.btn-print:hover{background:#5a1515}
// .btn-save{background:#1d4ed8;color:#fff}.btn-save:hover{background:#1e40af}

// /* ── HEADER BANNER ── */
// .ktp-header{
//   background:#7B1E1E;
//   color:#fff;
//   padding:10px 16px 9px;
//   border:2px solid #7B1E1E;
//   display:flex;
//   align-items:center;
//   gap:14px;
// }
// .ktp-logo-circle{
//   width:52px;height:52px;border-radius:50%;
//   border:2.5px solid #fff;
//   background:#fff;
//   display:flex;align-items:center;justify-content:center;
//   flex-shrink:0;
// }
// .ktp-logo-text{
//   font-size:17px;font-weight:900;color:#7B1E1E;
//   font-family:Georgia,serif;letter-spacing:1px;
// }
// .ktp-header-center{flex:1;text-align:center}
// .ktp-brand-name{
//   font-size:30px;font-style:italic;font-weight:bold;
//   font-family:Georgia,serif;color:#fff;line-height:1;
// }
// .ktp-brand-sub{
//   font-size:14px;font-family:Georgia,serif;
//   color:#f5d0d0;letter-spacing:2px;margin-top:1px;
// }
// .ktp-brand-addr{font-size:8.5px;color:#fde8e8;margin-top:4px;letter-spacing:0.3px}

// /* ── META ROW: GSTIN + since + DC label ── */
// .ktp-meta{
//   display:flex;justify-content:space-between;align-items:center;
//   border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
//   border-bottom:1.5px solid #7B1E1E;
//   padding:5px 10px;background:#fff;
// }
// .ktp-meta-left{display:flex;flex-direction:column;gap:1px}
// .ktp-since{font-size:8.5px;color:#555;font-style:italic}
// .ktp-gstin{font-size:10px;font-weight:bold;color:#7B1E1E;text-decoration:underline}
// .ktp-dc-box{text-align:right}
// .ktp-dc-title{font-size:14px;font-weight:bold;color:#7B1E1E;letter-spacing:2px;text-transform:uppercase}

// /* ── INFO SECTION (No, Date, Vehicle, Name, Address) ── */
// .ktp-info{
//   border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
//   border-bottom:1.5px solid #7B1E1E;
//   padding:7px 10px;background:#fff;
// }
// .ktp-info-row1{display:flex;gap:20px;margin-bottom:5px;flex-wrap:wrap}
// .ktp-info-row2{display:flex;gap:10px;margin-bottom:4px;flex-wrap:wrap}
// .ktp-info-row3{display:flex;gap:10px;flex-wrap:wrap}
// .ktp-field{display:flex;align-items:baseline;gap:4px}
// .ktp-field-label{font-size:9.5px;font-weight:bold;white-space:nowrap;color:#000}
// .ktp-field-value{
//   font-size:10px;border-bottom:1px solid #888;
//   padding-bottom:1px;min-width:80px;
// }
// .ktp-field-value.wide{min-width:200px}
// .ktp-field-value.medium{min-width:130px}

// /* ── ITEMS TABLE ── */
// .ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:none}
// table.items{width:100%;border-collapse:collapse;border-top:1.5px solid #7B1E1E;border-bottom:none}
// table.items thead tr{background:#7B1E1E}
// table.items th{
//   padding:6px 7px;font-size:9px;font-weight:bold;
//   text-transform:uppercase;color:#fff;text-align:center;
//   border-right:1px solid rgba(255,255,255,0.25);
//   letter-spacing:0.5px;
// }
// table.items th:last-child{border-right:none}
// table.items th.tl{text-align:left}
// table.items tbody tr{border-bottom:1px solid #c09090}
// table.items tbody tr:nth-child(even){background:#fdf7f7}
// table.items td{
//   padding:4px 7px;font-size:10.5px;
//   border-right:1px solid #c09090;
//   vertical-align:top;min-height:20px;
// }
// table.items td:last-child{border-right:none}
// table.items td.r{text-align:right}
// table.items td.c{text-align:center}
// table.items .erow td{height:20px;padding:3px 7px}

// /* ── FOOTER BAND ── */
// .ktp-footer{
//   border:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;
//   display:flex;background:#fff;
// }
// .ktp-footer-left{
//   flex:1;padding:8px 12px;
//   border-right:1.5px solid #7B1E1E;
//   font-size:9px;line-height:1.8;
// }
// .ktp-footer-cert{font-size:9px;margin-bottom:6px;color:#333}
// .ktp-footer-sig{font-size:11px;font-style:italic;font-weight:bold;font-family:Georgia,serif;color:#7B1E1E}
// .ktp-footer-right{width:200px;display:flex;flex-direction:column}
// .ktp-total-row{
//   display:flex;justify-content:space-between;align-items:center;
//   padding:5px 10px;border-bottom:1px solid #c09090;font-size:10px;
// }
// .ktp-total-row.grand{
//   background:#7B1E1E;color:#fff;font-size:11px;font-weight:bold;
// }
// .ktp-total-label{font-weight:600}
// .ktp-total-val{font-weight:bold}
// .ktp-sig-row{
//   display:flex;justify-content:flex-end;align-items:flex-end;
//   padding:5px 10px;border-bottom:1px solid #c09090;font-size:9px;
//   flex:1;
// }
// .ktp-eoe{
//   border-top:1px solid #c09090;
//   padding:4px 10px;font-size:8.5px;color:#555;font-style:italic;
// }

// /* ── AMOUNT IN WORDS ── */
// .ktp-words{
//   border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
//   border-top:1.5px solid #7B1E1E;
//   padding:5px 10px;font-size:9.5px;background:#fff;
// }
// .ktp-words-label{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#7B1E1E;margin-bottom:2px}
// .ktp-words-text{font-style:italic;font-weight:600}

// /* ── GST TABLE ── */
// .ktp-gst-section{border:2px solid #7B1E1E;margin-top:10px}
// .ktp-gst-head{background:#7B1E1E;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}
// .ktp-gst-table{width:100%;border-collapse:collapse}
// .ktp-gst-table th{background:#f5eaea;padding:5px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #c09090;border-right:1px solid #ddd}
// .ktp-gst-table td{padding:5px 8px;font-size:10px;border-right:1px solid #ddd}

// /* ── TERMS (Bill) ── */
// .ktp-terms-section{
//   border:2px solid #7B1E1E;border-top:none;
//   display:flex;
// }
// .ktp-terms-left{flex:1;padding:8px 12px;border-right:1.5px solid #c09090}
// .ktp-terms-title{font-size:8.5px;font-weight:bold;text-transform:uppercase;text-decoration:underline;margin-bottom:4px;color:#000}
// .ktp-terms-list{font-size:8.5px;line-height:1.8;color:#333}
// .ktp-terms-right{width:200px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:10px}
// .ktp-stamp-box{border:2px dashed #7B1E1E;padding:6px 12px;margin-bottom:24px;font-size:9px;font-weight:bold;text-transform:uppercase;color:#7B1E1E;text-align:center}
// .ktp-sig-line{width:100%;border-top:1px solid #000;margin-bottom:4px}
// .ktp-sig-label{font-size:8.5px;font-weight:bold;text-align:center}

// /* ── THANK YOU STRIP ── */
// .ktp-thankyou{
//   border:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;
//   padding:6px;text-align:center;
//   font-size:10px;font-weight:bold;color:#7B1E1E;
//   background:#fff8f8;
// }

// /* ── PRINT MEDIA: B&W safe ── */
// @media print{
//   .action-bar{display:none!important}
//   body{font-size:10px}
//   .page{padding:6mm 8mm}
//   /* All colored backgrounds become white, borders become black */
//   .ktp-header{
//     background:#000!important;
//     -webkit-print-color-adjust:exact;
//     print-color-adjust:exact;
//   }
//   table.items thead tr{
//     background:#000!important;
//     -webkit-print-color-adjust:exact;
//     print-color-adjust:exact;
//   }
//   table.items th{color:#fff!important}
//   .ktp-total-row.grand{
//     background:#000!important;color:#fff!important;
//     -webkit-print-color-adjust:exact;
//     print-color-adjust:exact;
//   }
//   .ktp-gst-head{background:#000!important;color:#fff!important}
//   /* Ensure all text is black */
//   .ktp-gstin,.ktp-dc-title,.ktp-footer-sig,.ktp-stamp-box,.ktp-thankyou{color:#000!important}
//   table.items tbody tr:nth-child(even){background:#fff!important}
//   .ktp-gst-table th{background:#f0f0f0!important}
//   .ktp-words{border-color:#000}
// }
// @page{size:A4;margin:8mm}
// `;

// // ─────────────────────────────────────────────────────────────────────────────
// // BUILD ITEM DESCRIPTION (unit removed — shown in Qty column)
// // ─────────────────────────────────────────────────────────────────────────────
// const buildItemDesc = (it) => {
//   let name = `<strong>${it.product}</strong>`;
//   let details = [];
//   if (it.size) details.push(it.size);
//   const ld = it.lengthDisplay || '';
//   if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
//   if (details.length) name += `<br><span style="font-size:8.5px;color:#555">${details.join(' · ')}</span>`;
//   return name;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // KTP LOGO SVG (inline, used in print header)
// // ─────────────────────────────────────────────────────────────────────────────
// const KTP_LOGO_SVG = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="38" height="38">
//   <circle cx="30" cy="30" r="28" fill="none" stroke="#7B1E1E" stroke-width="3"/>
//   <text x="30" y="40" text-anchor="middle" font-size="22" font-weight="900" font-family="Georgia,serif" fill="#7B1E1E">KTP</text>
// </svg>`;

// // ─────────────────────────────────────────────────────────────────────────────
// // CHALLAN PRINT HTML
// // ─────────────────────────────────────────────────────────────────────────────
// const getChallanPrintHTML = (order, challan, hidePrice = false) => {
//   const challanTotal = challan.items.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
//   const poLine = order.poNumber ? `<div class="ktp-field"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
//   const gstLine = order.gstCustomerName ? `<div class="ktp-field"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';

//   // Blank filler rows so table always has at least 12 rows (looks like physical pad)
//   const itemRows = challan.items.map((it, i) => {
//     const qtyVal = it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty;
//     const qtyWithUnit = it.unit ? `${qtyVal} <span style="font-size:8.5px;color:#555">${it.unit}</span>` : qtyVal;
//     return `<tr>
//       <td class="c" style="width:32px">${i + 1}</td>
//       <td>${buildItemDesc(it)}</td>
//       ${!hidePrice
//         ? `<td class="r" style="width:90px">${qtyWithUnit}</td>
//            <td class="r" style="width:75px">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//            <td class="r" style="width:90px"><strong>${parseFloat(it.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>`
//         : `<td class="r" style="width:90px">${qtyWithUnit}</td>`
//       }
//     </tr>`;
//   });

//   const totalRows = Math.max(0, 12 - challan.items.length);
//   const emptyRows = Array(totalRows).fill(`<tr class="erow"><td></td><td></td>${!hidePrice ? '<td></td><td></td><td></td>' : '<td></td>'}</tr>`);

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
// <title>Challan ${challan.challanNo}</title>
// <style>${PRINT_CSS}</style></head><body>
// <div class="page">

//   <div class="action-bar">
//     <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//     <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
//   </div>

//   <!-- HEADER BANNER -->
//   <div class="ktp-header">
//     <div class="ktp-logo-circle">${KTP_LOGO_SVG}</div>
//     <div class="ktp-header-center">
//       <div class="ktp-brand-name">Krishna</div>
//       <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
//       <div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}</div>
//     </div>
//   </div>

//   <!-- META ROW -->
//   <div class="ktp-meta">
//     <div class="ktp-meta-left">
//       <div class="ktp-since">Chhabra's Since 1979</div>
//       <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
//     </div>
//     <div class="ktp-dc-box">
//       <div class="ktp-dc-title">Delivery Challan</div>
//       <div style="font-size:9px;color:#555;margin-top:2px;">
//         No.: <strong style="color:#000">${challan.challanNo}</strong>
//         &nbsp;&nbsp;&nbsp;
//         Date: <strong style="color:#000">${new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
//       </div>
//     </div>
//   </div>

//   <!-- CONSIGNEE INFO -->
//   <div class="ktp-info">
//     <div class="ktp-info-row1">
//       <div class="ktp-field">
//         <span class="ktp-field-label">CONSIGNOR (Details of Receiver)</span>
//       </div>
//     </div>
//     <div class="ktp-info-row2">
//       <div class="ktp-field">
//         <span class="ktp-field-label">Name:</span>
//         <span class="ktp-field-value wide">${order.customerName}</span>
//       </div>
//       <div class="ktp-field">
//         <span class="ktp-field-label">Vehicle No.:</span>
//         <span class="ktp-field-value medium">&nbsp;</span>
//       </div>
//     </div>
//     <div class="ktp-info-row3">
//       <div class="ktp-field">
//         <span class="ktp-field-label">Address:</span>
//         <span class="ktp-field-value" style="min-width:300px">${order.customerAddress || '&nbsp;'}</span>
//       </div>
//     </div>
//     ${(order.customerPhone || order.poNumber || order.gstCustomerName) ? `
//     <div class="ktp-info-row3" style="margin-top:5px">
//       ${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}
//       ${poLine}
//       ${gstLine}
//       <div class="ktp-field"><span class="ktp-field-label">Ref Order:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>
//       ${challan.deliveryNote ? `<div class="ktp-field"><span class="ktp-field-label">Note:</span><span class="ktp-field-value medium">${challan.deliveryNote}</span></div>` : ''}
//     </div>` : ''}
//   </div>

//   <!-- ITEMS TABLE -->
//   <div class="ktp-table-wrap">
//     <table class="items">
//       <thead>
//         <tr>
//           <th style="width:32px">S.No.</th>
//           <th class="tl">Description of Goods</th>
//           ${!hidePrice
//             ? `<th style="width:90px">Qty</th>
//                <th style="width:75px">Rate (₹)</th>
//                <th style="width:90px">Total (₹)</th>`
//             : `<th style="width:90px">Qty</th>`
//           }
//         </tr>
//       </thead>
//       <tbody>
//         ${itemRows.join('')}
//         ${emptyRows.join('')}
//       </tbody>
//     </table>
//   </div>

//   <!-- AMOUNT IN WORDS -->
//   ${!hidePrice ? `
//   <div class="ktp-words">
//     <div class="ktp-words-label">Amount in Words</div>
//     <div class="ktp-words-text">${numberToWords(challanTotal)}</div>
//   </div>` : ''}

//   <!-- FOOTER -->
//   <div class="ktp-footer">
//     <div class="ktp-footer-left">
//       <div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div>
//       <div class="ktp-footer-sig">For : Krishna Timber &amp; Plywoods</div>
//       <div style="margin-top:20px;font-size:8.5px;color:#555">
//         • Goods dispatched will not be returned without prior approval.<br/>
//         • Verify items on receipt; report discrepancies within 24 hours.<br/>
//         • This is a delivery challan — not a tax invoice.<br/>
//         • All disputes subject to Bhopal jurisdiction only.
//       </div>
//       <div style="margin-top:14px;display:flex;align-items:flex-end;gap:10px;">
//         <div>
//           <div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div>
//           <div style="font-size:8.5px;font-weight:bold">Customer Signature</div>
//         </div>
//         <div style="font-size:8.5px;color:#555;margin-bottom:4px">Received goods in good condition</div>
//       </div>
//     </div>
//     <div class="ktp-footer-right">
//       ${!hidePrice ? `
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Freight</span>
//         <span class="ktp-total-val">&nbsp;</span>
//       </div>
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Total Taxable Amt ₹</span>
//         <span class="ktp-total-val">${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//       <div class="ktp-total-row grand">
//         <span>Challan/Invoice Total ₹</span>
//         <span>${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>` : `
//       <div style="padding:12px 10px;font-size:9px;text-align:center;color:#7B1E1E;font-weight:bold;">
//         DELIVERY CHALLAN<br/>FOR GOODS REFERENCE ONLY
//       </div>`}
//       <div class="ktp-sig-row">
//         <div style="text-align:center">
//           <div style="width:120px;border-top:1px solid #000;margin-bottom:3px"></div>
//           <div style="font-size:8.5px;font-weight:bold">Authorised Signatory</div>
//         </div>
//       </div>
//       <div class="ktp-eoe">E. &amp; O.E.</div>
//     </div>
//   </div>

//   <div class="ktp-thankyou">
//     Krishna Timber &amp; Plywoods &nbsp;|&nbsp; ${SHOP_INFO.phone} &nbsp;|&nbsp; ${SHOP_INFO.address}
//   </div>

// </div>
// <script>
// function savePDF(){
//   document.querySelector('.action-bar').style.display='none';
//   window.print();
//   setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);
// }
// </script>
// </body></html>`;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // BILL / INVOICE PRINT HTML
// // ─────────────────────────────────────────────────────────────────────────────
// const getBillPrintHTML = (order, chs) => {
//   const m = {};
//   chs.forEach(ch => ch.items?.forEach(it => {
//     const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || '');
//     if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' };
//     m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0);
//     m[key].totalAmount += parseFloat(it.amount || 0);
//   }));
//   const li = Object.values(m);
//   const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//   const gstRate = order.gstRate || 0;
//   const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
//   const total = sub + tax;

//   const itemRows = li.map((it, i) => {
//     const desc = buildItemDesc(it);
//     const qtyWithUnit = it.unit
//       ? `<strong>${it.totalQty.toFixed(3)}</strong> <span style="font-size:8.5px;color:#555">${it.unit}</span>`
//       : `<strong>${it.totalQty.toFixed(3)}</strong>`;
//     return `<tr>
//       <td class="c" style="width:32px">${i + 1}</td>
//       <td>${desc}</td>
//       <td class="r" style="width:90px">${qtyWithUnit}</td>
//       <td class="r" style="width:75px">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//       <td class="r" style="width:95px"><strong>${it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
//     </tr>`;
//   });

//   const totalRows = Math.max(0, 10 - li.length);
//   const emptyRows = Array(totalRows).fill(`<tr class="erow"><td></td><td></td><td></td><td></td><td></td></tr>`);

//   const poRow = order.poNumber ? `<div class="ktp-field" style="margin-top:4px"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
//   const gstRow = order.gstCustomerName ? `<div class="ktp-field" style="margin-top:4px"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
// <title>Invoice INV-${order.orderNo}</title>
// <style>${PRINT_CSS}</style></head><body>
// <div class="page">

//   <div class="action-bar">
//     <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//     <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
//   </div>

//   <!-- HEADER BANNER -->
//   <div class="ktp-header">
//     <div class="ktp-logo-circle">${KTP_LOGO_SVG}</div>
//     <div class="ktp-header-center">
//       <div class="ktp-brand-name">Krishna</div>
//       <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
//       <div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}</div>
//     </div>
//   </div>

//   <!-- META ROW -->
//   <div class="ktp-meta">
//     <div class="ktp-meta-left">
//       <div class="ktp-since">Chhabra's Since 1979</div>
//       <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
//     </div>
//     <div class="ktp-dc-box">
//       <div class="ktp-dc-title">Tax Invoice</div>
//       <div style="font-size:9px;color:#555;margin-top:2px;">
//         No.: <strong style="color:#000">INV-${order.orderNo}</strong>
//         &nbsp;&nbsp;&nbsp;
//         Date: <strong style="color:#000">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
//       </div>
//     </div>
//   </div>

//   <!-- CUSTOMER INFO -->
//   <div class="ktp-info">
//     <div class="ktp-info-row2">
//       <div class="ktp-field">
//         <span class="ktp-field-label">Bill To:</span>
//         <span class="ktp-field-value wide"><strong>${order.customerName}</strong></span>
//       </div>
//       ${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}
//     </div>
//     ${order.customerAddress ? `<div class="ktp-info-row3" style="margin-top:4px"><div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value" style="min-width:280px">${order.customerAddress}</span></div></div>` : ''}
//     <div class="ktp-info-row3" style="margin-top:5px;flex-wrap:wrap;gap:10px">
//       <div class="ktp-field"><span class="ktp-field-label">Order No:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>
//       ${poRow}${gstRow}
//       <div class="ktp-field"><span class="ktp-field-label">Challans:</span><span class="ktp-field-value" style="min-width:180px">${chs.map(c => c.challanNo).join(', ')}</span></div>
//       ${gstRate > 0 ? `<div class="ktp-field"><span class="ktp-field-label">GST:</span><span class="ktp-field-value medium">${gstRate}% Included</span></div>` : ''}
//     </div>
//   </div>

//   <!-- ITEMS TABLE -->
//   <div class="ktp-table-wrap">
//     <table class="items">
//       <thead>
//         <tr>
//           <th style="width:32px">S.No.</th>
//           <th class="tl">Description of Goods</th>
//           <th style="width:90px">Qty</th>
//           <th style="width:75px">Rate (₹)</th>
//           <th style="width:95px">Amount (₹)</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${itemRows.join('')}
//         ${emptyRows.join('')}
//       </tbody>
//     </table>
//   </div>

//   <!-- AMOUNT IN WORDS + TOTALS -->
//   <div class="ktp-words" style="display:flex;justify-content:space-between;align-items:flex-start">
//     <div style="flex:1">
//       <div class="ktp-words-label">Amount in Words</div>
//       <div class="ktp-words-text">${numberToWords(total)}</div>
//     </div>
//     <div style="border-left:1.5px solid #c09090;padding-left:12px;min-width:200px">
//       <div class="ktp-total-row" style="padding:4px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//       ${gstRate > 0 ? `
//       <div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>CGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span>
//       </div>
//       <div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>SGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span>
//       </div>` : ''}
//       <div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>Discount:</span><span>₹0.00</span>
//       </div>
//       <div style="margin-top:4px;background:#7B1E1E;color:#fff;padding:5px 8px;display:flex;justify-content:space-between;font-size:11px;font-weight:bold;border-radius:2px">
//         <span>Grand Total</span><span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//     </div>
//   </div>

//   ${gstRate > 0 ? `
//   <!-- GST BREAKUP -->
//   <div class="ktp-gst-section">
//     <div class="ktp-gst-head">GST Tax Breakup</div>
//     <table class="ktp-gst-table">
//       <thead><tr>
//         <th>Taxable Amt</th><th>CGST Rate</th><th>CGST Amt</th>
//         <th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th>
//       </tr></thead>
//       <tbody><tr>
//         <td>₹${sub.toFixed(2)}</td>
//         <td>${gstRate / 2}%</td><td>₹${(tax / 2).toFixed(2)}</td>
//         <td>${gstRate / 2}%</td><td>₹${(tax / 2).toFixed(2)}</td>
//         <td><strong>₹${tax.toFixed(2)}</strong></td>
//       </tr></tbody>
//     </table>
//   </div>` : ''}

//   <!-- TERMS + SIGNATURE -->
//   <div class="ktp-terms-section">
//     <div class="ktp-terms-left">
//       <div class="ktp-terms-title">Terms &amp; Conditions:</div>
//       <div class="ktp-terms-list">
//         • Goods once sold will not be taken back.<br/>
//         • Payment due on receipt of invoice.<br/>
//         • Interest @ 18% p.a. on overdue amounts.<br/>
//         • All disputes subject to Bhopal jurisdiction.<br/>
//         • Challan Ref: ${chs.map(c => `${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}
//       </div>
//       <div style="margin-top:18px;display:flex;align-items:flex-end;gap:10px">
//         <div>
//           <div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div>
//           <div style="font-size:8.5px;font-weight:bold">Customer Signature</div>
//         </div>
//         <div style="font-size:8.5px;color:#555;margin-bottom:4px">Received goods in good condition</div>
//       </div>
//     </div>
//     <div class="ktp-terms-right">
//       <div class="ktp-stamp-box">For ${SHOP_INFO.name}</div>
//       <div class="ktp-sig-line"></div>
//       <div class="ktp-sig-label">Authorised Signatory</div>
//     </div>
//   </div>

//   <div class="ktp-thankyou">
//     Thank You for your business! &nbsp;|&nbsp; Krishna Timber &amp; Plywoods &nbsp;|&nbsp; ${SHOP_INFO.phone}
//   </div>

// </div>
// <script>
// function savePDF(){
//   document.querySelector('.action-bar').style.display='none';
//   window.print();
//   setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);
// }
// </script>
// </body></html>`;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // API HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
// const apiGet = async url => { try { const r = await fetch(url); if (!r.ok) return { success: false, data: [] }; return r.json(); } catch { return { success: false, data: [] }; } };
// const apiPost = async (url, body) => { try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
// const apiPatch = async (url, body) => { try { const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };

// const openPDFView = (html) => { const win = window.open('', '_blank'); win.document.write(html); win.document.close(); };
// const openPDFPrint = (html) => { const win = window.open('', '_blank'); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); };

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// export default function OrderChallanBilling() {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [orders, setOrders] = useState([]);
//   const [challans, setChallans] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingOrder, setEditingOrder] = useState(null);
//   const [showChallanForm, setShowChallanForm] = useState(false);
//   const [showBillPreview, setShowBillPreview] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showChallanSuccess, setShowChallanSuccess] = useState(false);
//   const [lastChallanHTML, setLastChallanHTML] = useState('');
//   const [lastChallanNo, setLastChallanNo] = useState('');
//   const [orderForm, setOrderForm] = useState({ customerName: '', customerPhone: '', customerAddress: '', orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '', poNumber: '', gstCustomerName: '' });
//   const [orderGroups, setOrderGroups] = useState([createEmptyGroup()]);
//   const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
//   const [challanItems, setChallanItems] = useState([]);
//   const [deliveryNote, setDeliveryNote] = useState('');
//   const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);

//   function createEmptyItem(ov = {}) { return { uid: uid(), product: '', unit: '', lengthFeet: '', lengthInches: '', quantity: '', rate: '', amount: 0, calculatedQty: 0, skuCode: '', isWood: false, width: 0, thickness: 0, size: '', materialType: '', category: '', subCategory: '', ...ov }; }
//   function createEmptyGroup() { return { groupId: uid(), filterMaterialType: '', filterCategory: '', filterSubCategory: '', items: [createEmptyItem()] }; }
//   const getAllOrderItems = () => orderGroups.flatMap(g => g.items.map(item => ({ ...item, filterMaterialType: g.filterMaterialType, filterCategory: g.filterCategory, filterSubCategory: g.filterSubCategory })));
//   const orderSubtotal = getAllOrderItems().reduce((s, i) => s + (i.amount || 0), 0);
//   const orderTax = orderForm.gstRate > 0 ? orderSubtotal * (orderForm.gstRate / 100) : 0;
//   const orderTotal = orderSubtotal + orderTax;

//   const fetchData = useCallback(async () => {
//     setLoading(true); setError(null);
//     try {
//       const [oR, cR, pR] = await Promise.all([apiGet('/api/billing-backend/orders'), apiGet('/api/billing-backend/challans'), apiGet('/api/dropdown-data')]);
//       setOrders(oR.success ? oR.data || [] : []);
//       setChallans(cR.success ? cR.data || [] : []);
//       setProducts(pR.success && pR.data ? pR.data : []);
//     } catch { setError('Data load problem'); }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const isWoodMaterial = item => { if (!item) return false; const mt = (item.materialType || '').toLowerCase(); const cat = (item.category || '').toLowerCase(); return mt.includes('timber') || mt.includes('wood') || mt.includes('lakdi') || cat.includes('teak') || cat.includes('sagwan') || cat.includes('pine') || cat.includes('sal'); };
//   const getFilteredProductsForGroup = g => products.filter(p => { if (g.filterMaterialType && p.materialType !== g.filterMaterialType) return false; if (g.filterCategory && p.category !== g.filterCategory) return false; if (g.filterSubCategory && p.subCategory !== g.filterSubCategory) return false; return true; });
//   const getAllMaterialTypes = () => [...new Set(products.map(p => p.materialType).filter(Boolean))];
//   const getCategoriesFor = mt => [...new Set(products.filter(p => !mt || p.materialType === mt).map(p => p.category).filter(Boolean))];
//   const getSubCategoriesFor = (mt, cat) => [...new Set(products.filter(p => (!mt || p.materialType === mt) && (!cat || p.category === cat)).map(p => p.subCategory).filter(Boolean))];
//   const updateGroupFilter = (gid, field, val) => { setOrderGroups(prev => prev.map(g => { if (g.groupId !== gid) return g; const u = { ...g, [field]: val }; if (field === 'filterMaterialType') { u.filterCategory = ''; u.filterSubCategory = ''; } if (field === 'filterCategory') { u.filterSubCategory = ''; } return u; })); };
//   const addItemToGroup = gid => { setOrderGroups(prev => prev.map(g => g.groupId !== gid ? g : { ...g, items: [...g.items, createEmptyItem()] })); };
//   const removeItemFromGroup = (gid, iuid) => { setOrderGroups(prev => prev.map(g => { if (g.groupId !== gid || g.items.length === 1) return g; return { ...g, items: g.items.filter(i => i.uid !== iuid) }; })); };
//   const removeGroup = gid => { if (orderGroups.length === 1) return; setOrderGroups(prev => prev.filter(g => g.groupId !== gid)); };
//   const addNewGroup = () => setOrderGroups(prev => [...prev, createEmptyGroup()]);

//   const updateGroupItem = (gid, iuid, field, val) => {
//     setOrderGroups(prev => prev.map(g => {
//       if (g.groupId !== gid) return g;
//       return {
//         ...g, items: g.items.map(item => {
//           if (item.uid !== iuid) return item;
//           const u = { ...item, [field]: val };
//           if (field === 'skuCode') {
//             const f = products.find(p => p.skuCode === val);
//             if (f) {
//               u.product = f.materialName; u.skuCode = f.skuCode; u.materialType = f.materialType;
//               u.category = f.category; u.subCategory = f.subCategory; u.isWood = isWoodMaterial(f);
//               if (u.isWood) {
//                 u.unit = 'CFT';
//                 const dims = parseWoodDimensions(f.materialName);
//                 if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
//                 else { u.width = 0; u.thickness = 0; u.size = ''; }
//               } else { u.unit = f.unit || 'Pcs'; u.width = 0; u.thickness = 0; u.size = ''; u.lengthFeet = ''; u.lengthInches = ''; }
//             }
//           }
//           const calc = calculateByUnit(u); u.calculatedQty = calc.calculatedQty; u.amount = calc.amount;
//           return u;
//         })
//       };
//     }));
//   };

//   const genOrderNo = () => { const y = new Date().getFullYear(), px = `ORD-${y}-`; const max = orders.filter(o => o.orderNo?.startsWith(px)).reduce((m, o) => { const n = parseInt(o.orderNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0); return `${px}${String(max + 1).padStart(4, '0')}`; };
//   const genChallanNo = () => { const y = new Date().getFullYear(), px = `CHL-${y}-`; const max = challans.filter(c => c.challanNo?.startsWith(px)).reduce((m, c) => { const n = parseInt(c.challanNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0); return `${px}${String(max + 1).padStart(4, '0')}`; };

//   const openEditOrder = order => {
//     setIsEditMode(true); setEditingOrder(order);
//     setOrderForm({ customerName: order.customerName || '', customerPhone: order.customerPhone || '', customerAddress: order.customerAddress || '', orderDate: order.orderDate || new Date().toISOString().split('T')[0], gstRate: order.gstRate || 0, notes: order.notes || '', poNumber: order.poNumber || '', gstCustomerName: order.gstCustomerName || '' });
//     const savedItems = order.items || [];
//     if (savedItems.length === 0) { setOrderGroups([createEmptyGroup()]); }
//     else {
//       const groupMap = {};
//       savedItems.forEach(it => { const key = it.materialType || 'Other'; if (!groupMap[key]) groupMap[key] = []; groupMap[key].push(rebuildItemForEdit(it)); });
//       setOrderGroups(Object.entries(groupMap).map(([mt, items]) => ({ groupId: uid(), filterMaterialType: mt === 'Other' ? '' : mt, filterCategory: items[0]?.category || '', filterSubCategory: items[0]?.subCategory || '', items })));
//     }
//     setShowOrderForm(true);
//   };

//   const resetOrderForm = () => { setOrderForm({ customerName: '', customerPhone: '', customerAddress: '', orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '', poNumber: '', gstCustomerName: '' }); setOrderGroups([createEmptyGroup()]); setIsEditMode(false); setEditingOrder(null); };

//   const handleSubmitOrder = async () => {
//     if (!orderForm.customerName || orderSubtotal === 0) { setError('Customer name aur items required'); return; }
//     setSaving(true); setError(null);
//     try {
//       const validItems = getAllOrderItems().filter(i => i.product && (i.quantity || i.calculatedQty)).map(it => ({ ...it, lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '' }));
//       if (isEditMode && editingOrder) {
//         const r = await apiPatch('/api/billing-backend/orders', { orderNo: editingOrder.orderNo, order: { ...orderForm, orderNo: editingOrder.orderNo, subtotal: orderSubtotal, tax: orderTax, total: orderTotal, status: editingOrder.status, includeGST: orderForm.gstRate > 0 }, items: validItems });
//         if (!r.success) { setError(r.error || 'Edit fail'); return; }
//       } else {
//         const orderNo = genOrderNo();
//         const r = await apiPost('/api/billing-backend/orders', { order: { ...orderForm, orderNo, subtotal: orderSubtotal, tax: orderTax, total: orderTotal, status: 'Active', includeGST: orderForm.gstRate > 0 }, items: validItems });
//         if (!r.success) { setError(r.error || 'Save fail'); return; }
//       }
//       await fetchData(); setShowOrderForm(false); resetOrderForm();
//     } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
//   };

//   const openChallanForm = order => {
//     setSelectedOrder(order);
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//     setChallanItems((order.items || []).map(it => ({ uid: uid(), product: it.product, unit: it.unit, rate: parseFloat(it.rate || 0), orderedQty: parseFloat(it.calculatedQty || it.quantity || 0), alreadySent: parseFloat(sm[it.product] || 0), sendingPcs: '', sendingQty: 0, size: it.size || '', lengthFeet: it.lengthFeet || '', lengthInches: it.lengthInches || '', lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '', isWood: it.isWood || false, width: it.width || 0, thickness: it.thickness || 0 })));
//     setChallanDate(new Date().toISOString().split('T')[0]);
//     setDeliveryNote('');
//     setHidePriceOnChallan(false);
//     setShowChallanForm(true);
//   };

//   const updateChallanItem = (iuid, field, value) => {
//     setChallanItems(prev => prev.map(it => {
//       if (it.uid !== iuid) return it;
//       const u = { ...it, [field]: value };
//       if (field === 'sendingPcs') { const pcs = parseFloat(value || 0); u.sendingQty = it.isWood ? calculateByUnit({ ...u, quantity: pcs }).calculatedQty : pcs; }
//       return u;
//     }));
//   };

//   const handleSubmitChallan = async () => {
//     const valid = challanItems.filter(i => parseFloat(i.sendingPcs) > 0);
//     if (!valid.length) { setError('Kam se kam ek item ki qty daalo'); return; }
//     setSaving(true); setError(null);
//     try {
//       const challanNo = genChallanNo();
//       const challanTotal = valid.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0);
//       const payload = {
//         challan: { challanNo, orderNo: selectedOrder.orderNo, customerName: selectedOrder.customerName, challanDate, deliveryNote, challanTotal, status: 'Delivered', hidePrice: hidePriceOnChallan },
//         items: valid.map(it => ({ product: it.product, unit: it.unit, orderedQty: it.orderedQty, pieces: parseFloat(it.sendingPcs), sentQty: parseFloat(it.sendingPcs), calculatedQty: it.sendingQty, rate: it.rate, amount: it.sendingQty * it.rate, size: it.size, lengthDisplay: it.lengthDisplay }))
//       };
//       const r = await apiPost('/api/billing-backend/challans', payload);
//       if (!r.success) { setError(r.error || 'Challan fail'); return; }
//       const allC = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//       const tsm = {};
//       [...allC, { items: valid.map(it => ({ product: it.product, calculatedQty: it.sendingQty })) }].forEach(ch => ch.items?.forEach(it => { tsm[it.product] = (tsm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//       const done = (selectedOrder.items || []).every(oi => (tsm[oi.product] || 0) >= parseFloat(oi.calculatedQty || oi.quantity || 0));
//       if (done) await apiPatch('/api/billing-backend/orders', { orderNo: selectedOrder.orderNo, status: 'Completed' });
//       const html = getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan);
//       setLastChallanHTML(html);
//       setLastChallanNo(challanNo);
//       await fetchData();
//       setShowChallanForm(false);
//       setShowChallanSuccess(true);
//     } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
//   };

//   const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);
//   const getDeliveryProgress = order => {
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//     const items = order.items || []; if (!items.length) return 0;
//     const tot = items.reduce((s, it) => s + parseFloat(it.calculatedQty || it.quantity || 0), 0);
//     const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.calculatedQty || it.quantity || 0), sm[it.product] || 0), 0);
//     return tot > 0 ? Math.round((sent / tot) * 100) : 0;
//   };

//   const markBilled = async orderNo => { await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Billed' }); await fetchData(); setShowBillPreview(false); };
//   const filteredOrders = orders.filter(o => { const ms = o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.orderNo?.toLowerCase().includes(searchQuery.toLowerCase()); const mst = filterStatus === 'All' || o.status === filterStatus; return ms && mst; });
//   const STATUS = { Active: { bg: '#fef3c7', color: '#92400e', dot: '#d97706' }, Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e' }, Billed: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' } };

//   if (loading) return (<div className="flex items-center justify-center min-h-96 flex-col gap-3"><Loader2 className="w-7 h-7 text-amber-600 animate-spin" /><p className="text-gray-400 text-sm">Loading...</p></div>);

//   return (
//     <div>
//       <style jsx global>{`
// @keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}.kt-in{animation:kt-in .28s ease-out}.kt-input{width:100%;padding:9px 13px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;background:#fff;color:#111827;outline:none;transition:border-color .14s,box-shadow .14s}.kt-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}.kt-input[readonly]{background:#f9fafb;color:#6b7280;cursor:not-allowed}.kt-input-sm{padding:7px 10px;font-size:12px}.btn-amber{padding:9px 20px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 6px rgba(180,83,9,.28)}.btn-amber:hover{background:linear-gradient(135deg,#92400e,#b45309);transform:translateY(-1px)}.btn-amber:disabled{opacity:.5;cursor:not-allowed;transform:none}.btn-white{padding:9px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:#374151;display:inline-flex;align-items:center;gap:6px;transition:all .14s}.btn-white:hover{background:#f9fafb;border-color:#d1d5db}.btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}.btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}.btn-blue:hover{opacity:.9}.btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}.icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:#9ca3af}.icon-btn:hover{background:#f3f4f6;color:#374151}.kt-card{background:#fff;border:1px solid #f0f0f0;border-radius:16px;box-shadow:0 1px 5px rgba(0,0,0,.05)}.kt-inset{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}.kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:#6b7280}.kt-tab.active{background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e}.kt-tab:hover:not(.active){background:#f9fafb;color:#374151}.kt-tbl{width:100%;border-collapse:collapse}.kt-tbl thead tr{background:linear-gradient(135deg,#7c3f00,#b45309)}.kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}.kt-tbl thead th.r{text-align:right}.kt-tbl thead th.c{text-align:center}.kt-tbl tbody tr{border-bottom:1px solid #f3f4f6;transition:background .1s}.kt-tbl tbody tr:nth-child(even){background:#fffdf8}.kt-tbl tbody tr:hover{background:#fffbec}.kt-tbl tbody td{padding:10px;font-size:13px;color:#374151;vertical-align:top}.kt-tbl tbody td.r{text-align:right}.kt-tbl tbody td.c{text-align:center}.kt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.44);z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}.kt-modal{background:#fff;border-radius:22px;border:1px solid #e5e7eb;width:100%;max-width:1300px;margin:auto;box-shadow:0 24px 64px rgba(0,0,0,.18);overflow:visible}.kt-mhead{padding:20px 26px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#fffbf2 0%,#fff 100%);border-radius:22px 22px 0 0}.kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto;overflow-x:visible}.kt-mfoot{padding:16px 26px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:8px;background:#fafafa;border-radius:0 0 22px 22px}.prog-track{height:6px;background:#fde68a;border-radius:4px;overflow:hidden}.prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#d97706,#fbbf24);transition:width .5s ease}.prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}.sec-label{font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}.status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}.status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}.total-box{border-radius:12px;padding:14px 18px;border:1px solid}.length-group{display:flex;gap:4px;align-items:center}.length-input{width:50px!important;text-align:center}.material-group{border:2px solid #e5e7eb;border-radius:16px;margin-bottom:16px;overflow:visible;transition:border-color .2s}.material-group:hover{border-color:#fde68a}.material-group-header{background:linear-gradient(135deg,#fffbf2,#fef3c7);padding:14px 18px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.material-group-label{display:flex;align-items:center;gap:10px}.material-group-num{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}.material-group-title{font-size:14px;font-weight:700;color:#7c3f00}.material-group-subtitle{font-size:11px;color:#92400e;margin-top:2px}.material-group-filters{display:flex;gap:8px;flex:1;flex-wrap:wrap;min-width:300px}.material-group-body{padding:18px 20px;overflow:visible}.material-group-footer{padding:10px 18px;border-top:1px dashed #fde68a;background:#fffdf8;display:flex;justify-content:space-between;align-items:center}.item-subrow{background:#fff;border:1px solid #f3f4f6;border-radius:10px;padding:14px;margin-bottom:10px;transition:all .2s;position:relative;overflow:visible}.item-subrow:hover{border-color:#fde68a;background:#fffbf5}.item-subrow:last-child{margin-bottom:0}.item-subrow-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.item-subrow-num{width:24px;height:24px;border-radius:6px;background:#fef3c7;color:#92400e;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px}.unit-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}.wood-badge{background:#dcfce7;color:#166534}.hardware-badge{background:#e0e7ff;color:#3730a3}.calc-display{background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:10px;margin-top:10px}.btn-add-inner{padding:7px 14px;background:#fff;border:1px dashed #d97706;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;color:#d97706;display:inline-flex;align-items:center;gap:5px;transition:all .15s}.btn-add-inner:hover{background:#fffbeb;border-style:solid}.btn-add-outer{padding:10px 20px;background:#fff;border:2px dashed #e5e7eb;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:#6b7280;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s;width:100%}.btn-add-outer:hover{background:#f9fafb;border-color:#d97706;color:#d97706}.searchable-select{position:relative;width:100%}.ss-input-wrap{position:relative;display:flex;align-items:center}.ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;background:#fff;color:#111827;outline:none;transition:all .15s}.ss-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}.ss-input.with-icon{padding-left:32px}.ss-search-icon{position:absolute;left:10px;width:14px;height:14px;color:#9ca3af;pointer-events:none}.ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}.ss-clear{width:18px;height:18px;border-radius:50%;background:#f3f4f6;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280}.ss-clear:hover{background:#e5e7eb;color:#374151}.ss-arrow{width:14px;height:14px;color:#9ca3af;transition:transform .2s}.ss-arrow.open{transform:rotate(180deg)}.ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.15);z-index:9999;max-height:320px;overflow:hidden;animation:ss-drop .15s ease}@keyframes ss-drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.ss-dropdown-header{padding:8px 12px;background:#fef3c7;border-bottom:1px solid #fde68a;font-size:11px;color:#92400e;font-weight:600}.ss-options{max-height:260px;overflow-y:auto}.ss-option{padding:10px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid #f3f4f6}.ss-option:last-child{border-bottom:none}.ss-option:hover,.ss-option.highlighted{background:#fffbeb}.ss-option.selected{background:#fef3c7}.ss-no-results{padding:20px;text-align:center;color:#9ca3af;font-size:13px}.ss-more{padding:10px 12px;text-align:center;color:#d97706;font-size:12px;font-weight:500;background:#fffbeb}.product-dropdown{max-height:400px}.product-dropdown .ss-options{max-height:340px}.product-option{padding:10px 12px}.product-option-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.product-name{font-weight:600;color:#111827;font-size:13px}.product-sku{font-size:11px;color:#d97706;font-family:monospace;background:#fef3c7;padding:2px 6px;border-radius:4px}.product-option-sub{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.product-cat{font-size:11px;color:#6b7280}.product-sep{color:#d1d5db;font-size:10px}.product-unit{font-size:10px;color:#fff;background:#d97706;padding:2px 6px;border-radius:4px;margin-left:auto}.edit-badge{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600}
// .success-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#dcfce7,#bbf7d0);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
//       `}</style>

//       {error && <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3"><AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /><span className="text-sm text-red-700 flex-1">{error}</span><button className="icon-btn" onClick={() => setError(null)}><X className="w-3 h-3" /></button></div>}

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div><h2 className="text-2xl font-bold text-gray-800">Order Management</h2><p className="text-gray-400 text-sm mt-0.5">{SHOP_INFO.name}</p></div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <button className="icon-btn" onClick={fetchData}><RefreshCw className="w-4 h-4" /></button>
//           <button className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
//           <button className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`} onClick={() => setActiveTab('challans')}>Challans</button>
//           <button className="btn-amber" onClick={() => { resetOrderForm(); setShowOrderForm(true); }}><Plus className="w-4 h-4" />New Order</button>
//         </div>
//       </div>

//       <div className="kt-card mb-6 overflow-hidden">
//         <div style={{ background: 'linear-gradient(135deg,#7c3f00,#d97706)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           {[{ n: '1', label: 'Order', desc: 'Customer requirement', bg: '#fef3c7', col: '#92400e' }, { n: '2', label: 'Challan', desc: 'Partial delivery', bg: '#fde68a', col: '#78350f' }, { n: '3', label: 'Bill', desc: 'Final invoice', bg: '#fbbf24', col: '#451a03' }].map((s, i, a) => (
//             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <div className="step-dot" style={{ background: s.bg, color: s.col }}>{s.n}</div>
//                 <div><p style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: 0 }}>{s.label}</p><p style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', margin: 0 }}>{s.desc}</p></div>
//               </div>
//               {i < a.length - 1 && <ArrowRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,.4)', margin: '0 6px' }} />}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ORDERS TAB */}
//       {activeTab === 'orders' && (
//         <div className="space-y-5 kt-in">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[{ label: 'Total', value: orders.length, bg: '#fff', color: '#111827' }, { label: 'Active', value: orders.filter(o => o.status === 'Active').length, bg: '#fffbeb', color: '#92400e' }, { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, bg: '#f0fdf4', color: '#166534' }, { label: 'Products', value: products.length, bg: '#fef3c7', color: '#7c3f00' }].map((c, i) => (
//               <div key={i} className="kt-card p-4" style={{ background: c.bg }}><p className="text-xs font-medium text-gray-400 mb-1">{c.label}</p><p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p></div>
//             ))}
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             <div className="relative flex-1" style={{ minWidth: 200 }}><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" /><input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
//             <div className="flex gap-1.5">{['All', 'Active', 'Completed', 'Billed'].map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`kt-tab ${filterStatus === s ? 'active' : ''}`} style={{ padding: '8px 14px', fontSize: 12 }}>{s}</button>))}</div>
//           </div>
//           <div className="space-y-3">
//             {filteredOrders.length === 0 && <div className="kt-card p-14 text-center"><div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Receipt style={{ width: 28, height: 28, color: '#d97706' }} /></div><p className="text-gray-400 text-sm">Koi order nahi</p></div>}
//             {filteredOrders.map((order, i) => {
//               const progress = getDeliveryProgress(order);
//               const st = STATUS[order.status] || STATUS.Active;
//               const oc = getOrderChallans(order.orderNo);
//               return (
//                 <div key={i} className="kt-card p-5 kt-in">
//                   <div className="flex items-start justify-between gap-4 flex-wrap">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         <span className="font-mono text-sm font-bold" style={{ color: '#b45309' }}>{order.orderNo}</span>
//                         <span className="status-pill" style={{ background: st.bg, color: st.color }}><span className="status-dot" style={{ background: st.dot }} />{order.status}</span>
//                         {order.gstRate > 0 && <span className="status-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>GST {order.gstRate}%</span>}
//                         {order.poNumber && <span className="edit-badge">PO: {order.poNumber}</span>}
//                         {order.gstCustomerName && <span className="status-pill" style={{ background: '#f3e8ff', color: '#6b21a8' }}>GST: {order.gstCustomerName}</span>}
//                       </div>
//                       <p className="font-bold text-gray-800 text-base mb-1 truncate">{order.customerName}</p>
//                       <p className="text-xs text-gray-400">{order.customerPhone && `${order.customerPhone} · `}{new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}&nbsp;·&nbsp;{(order.items || []).length} items&nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(order.total) || 0).toLocaleString('en-IN')}</span></p>
//                     </div>
//                     <div className="flex flex-col items-end gap-3 shrink-0">
//                       <div style={{ width: 168 }}>
//                         <div className="flex justify-between mb-1.5"><span className="text-xs text-gray-400">Delivery</span><span className="text-xs font-bold" style={{ color: progress === 100 ? '#16a34a' : '#d97706' }}>{progress}%</span></div>
//                         <div className="prog-track"><div className={`prog-fill ${progress === 100 ? 'done' : ''}`} style={{ width: `${progress}%` }} /></div>
//                         <p className="text-xs text-gray-400 mt-1 text-right">{oc.length} challan{oc.length !== 1 ? 's' : ''}</p>
//                       </div>
//                       <div className="flex gap-2 flex-wrap justify-end">
//                         {order.status !== 'Billed' && <button className="btn-blue" onClick={() => openEditOrder(order)}><Edit2 className="w-3.5 h-3.5" />Edit</button>}
//                         {order.status !== 'Billed' && <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => openChallanForm(order)}><TruckIcon className="w-3.5 h-3.5" />Challan</button>}
//                         {(order.status === 'Completed' || order.status === 'Billed') && <button className="btn-amber" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { setSelectedOrder(order); setShowBillPreview(true); }}><Receipt className="w-3.5 h-3.5" />Final Bill</button>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* CHALLANS TAB */}
//       {activeTab === 'challans' && (
//         <div className="space-y-3 kt-in">
//           {challans.length === 0 && <div className="kt-card p-14 text-center"><div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><TruckIcon style={{ width: 28, height: 28, color: '#d97706' }} /></div><p className="text-gray-400 text-sm">Koi challan nahi</p></div>}
//           {[...challans].reverse().map((ch, i) => (
//             <div key={i} className="kt-card p-4 kt-in">
//               <div className="flex items-center justify-between flex-wrap gap-3">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//                     <span className="font-mono text-sm font-bold" style={{ color: '#b45309' }}>{ch.challanNo}</span>
//                     <span className="text-xs text-gray-400">→ <strong className="text-gray-600">{ch.orderNo}</strong></span>
//                     <span className="status-pill" style={{ background: '#dcfce7', color: '#166534' }}><span className="status-dot" style={{ background: '#22c55e' }} />Delivered</span>
//                     {ch.hidePrice && <span className="status-pill" style={{ background: '#fef3c7', color: '#92400e' }}><EyeOff className="w-3 h-3" />Hidden</span>}
//                   </div>
//                   <p className="font-semibold text-gray-800">{ch.customerName}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">{new Date(ch.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}&nbsp;·&nbsp;{(ch.items || []).length} items{!ch.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(ch.challanTotal) || 0).toLocaleString('en-IN')}</span></>}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { const order = orders.find(o => o.orderNo === ch.orderNo); if (order) openPDFView(getChallanPrintHTML(order, ch, ch.hidePrice)); }}><Eye className="w-3.5 h-3.5" />View</button>
//                   <button className="btn-amber" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { const order = orders.find(o => o.orderNo === ch.orderNo); if (order) openPDFPrint(getChallanPrintHTML(order, ch, ch.hidePrice)); }}><Printer className="w-3.5 h-3.5" />Print</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ORDER FORM MODAL */}
//       {showOrderForm && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in">
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: isEditMode ? '#dbeafe' : '#fef3c7', color: isEditMode ? '#1e40af' : '#92400e' }}>{isEditMode ? <Edit2 className="w-3.5 h-3.5" /> : '1'}</div>
//                 <div><h3 className="font-bold text-gray-800 text-lg m-0">{isEditMode ? `Edit — ${editingOrder?.orderNo}` : 'New Order'}</h3><p className="text-xs text-gray-400 m-0">{isEditMode ? 'Update' : 'Group items by material'}</p></div>
//               </div>
//               <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X className="w-5 h-5" /></button>
//             </div>
//             <div className="kt-mbody space-y-6">
//               <div>
//                 <p className="sec-label">Customer Details</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                   <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Customer Name *</label><input className="kt-input" value={orderForm.customerName} onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label><input className="kt-input" value={orderForm.customerPhone} onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Date</label><input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium text-gray-500 block mb-1.5">GST</label><select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm(p => ({ ...p, gstRate: parseFloat(e.target.value) }))}>{GST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
//                   <div><label className="text-xs font-medium text-gray-500 block mb-1.5">PO Number</label><input className="kt-input" value={orderForm.poNumber} onChange={e => setOrderForm(p => ({ ...p, poNumber: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium text-gray-500 block mb-1.5">GST Customer</label><input className="kt-input" value={orderForm.gstCustomerName} onChange={e => setOrderForm(p => ({ ...p, gstCustomerName: e.target.value }))} /></div>
//                   <div className="sm:col-span-2"><label className="text-xs font-medium text-gray-500 block mb-1.5">Address</label><textarea className="kt-input" rows={2} style={{ resize: 'none' }} value={orderForm.customerAddress} onChange={e => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))} /></div>
//                 </div>
//               </div>
//               <div>
//                 <p className="sec-label">Items</p>
//                 {orderGroups.map((group, gIdx) => {
//                   const gp = getFilteredProductsForGroup(group);
//                   const gc = getCategoriesFor(group.filterMaterialType);
//                   const gsc = getSubCategoriesFor(group.filterMaterialType, group.filterCategory);
//                   const gt = group.items.reduce((s, i) => s + (i.amount || 0), 0);
//                   return (
//                     <div key={group.groupId} className="material-group kt-in">
//                       <div className="material-group-header">
//                         <div className="material-group-label">
//                           <div className="material-group-num">{gIdx + 1}</div>
//                           <div><div className="material-group-title">{group.filterMaterialType || 'Select Material'}{group.filterCategory && ` › ${group.filterCategory}`}</div><div className="material-group-subtitle">{group.items.length} items · {gp.length} available</div></div>
//                         </div>
//                         {orderGroups.length > 1 && <button className="icon-btn" onClick={() => removeGroup(group.groupId)}><Trash2 className="w-4 h-4 text-red-400" /></button>}
//                       </div>
//                       <div style={{ padding: '12px 18px', background: '#fefdf5', borderBottom: '1px solid #f3f4f6' }}>
//                         <div className="material-group-filters">
//                           <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium text-gray-500 block mb-1">Material</label><SearchableSelect options={getAllMaterialTypes()} value={group.filterMaterialType} onChange={v => updateGroupFilter(group.groupId, 'filterMaterialType', v)} placeholder="🔍" /></div>
//                           <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium text-gray-500 block mb-1">Category</label><SearchableSelect options={gc} value={group.filterCategory} onChange={v => updateGroupFilter(group.groupId, 'filterCategory', v)} placeholder="🔍" /></div>
//                           <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium text-gray-500 block mb-1">Sub Cat</label><SearchableSelect options={gsc} value={group.filterSubCategory} onChange={v => updateGroupFilter(group.groupId, 'filterSubCategory', v)} placeholder="🔍" /></div>
//                         </div>
//                       </div>
//                       <div className="material-group-body">
//                         {group.items.map((item, itemIdx) => (
//                           <div key={item.uid} className="item-subrow">
//                             <div className="item-subrow-header">
//                               <div className="flex items-center gap-3">
//                                 <div className="item-subrow-num">{itemIdx + 1}</div>
//                                 {item.isWood ? <span className="unit-badge wood-badge">🪵 Wood</span> : item.product ? <span className="unit-badge hardware-badge">🔧</span> : null}
//                                 {item.product && <span className="text-xs font-semibold text-gray-600">{item.product}</span>}
//                               </div>
//                               <button className="icon-btn" onClick={() => removeItemFromGroup(group.groupId, item.uid)} disabled={group.items.length === 1}><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//                               <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 block mb-1.5">Product *</label><ProductSearchableSelect products={gp} value={item.skuCode} onChange={v => updateGroupItem(group.groupId, item.uid, 'skuCode', v)} /></div>
//                               <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Unit</label>{item.isWood ? <select className="kt-input kt-input-sm" value={item.unit} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>{WOOD_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}</select> : <input className="kt-input kt-input-sm" value={item.unit || 'Pcs'} readOnly />}</div>
//                               {item.isWood && <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Size</label><input className="kt-input kt-input-sm" value={item.size || '—'} readOnly /></div>}
//                               {item.isWood && <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Length</label><div className="length-group"><input type="number" min="0" className="kt-input kt-input-sm length-input" value={item.lengthFeet} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthFeet', e.target.value)} /><span className="text-gray-400 text-xs">ft</span><input type="number" min="0" max="11" className="kt-input kt-input-sm length-input" value={item.lengthInches} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthInches', e.target.value)} /><span className="text-gray-400 text-xs">in</span></div></div>}
//                               <div><label className="text-xs font-medium text-gray-500 block mb-1.5">{item.isWood ? 'Pcs' : 'Qty'}</label><input type="number" min="1" className="kt-input kt-input-sm" value={item.quantity} onChange={e => updateGroupItem(group.groupId, item.uid, 'quantity', e.target.value)} /></div>
//                               <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Rate</label><input type="number" min="0" className="kt-input kt-input-sm" value={item.rate} onChange={e => updateGroupItem(group.groupId, item.uid, 'rate', e.target.value)} /></div>
//                             </div>
//                             {item.product && <div className="calc-display"><div className="flex justify-between items-center flex-wrap gap-2"><div className="text-xs text-amber-800">{item.isWood ? <><strong>{item.unit}:</strong> {item.calculatedQty.toFixed(3)} {item.unit}</> : <><strong>Qty:</strong> {item.quantity || 0}</>}</div><div className="text-base font-bold text-amber-900">₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div></div></div>}
//                           </div>
//                         ))}
//                       </div>
//                       <div className="material-group-footer">
//                         <button className="btn-add-inner" onClick={() => addItemToGroup(group.groupId)}><Plus className="w-3.5 h-3.5" />Add Item</button>
//                         <div className="text-sm font-bold" style={{ color: '#7c3f00' }}>₹{gt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <button className="btn-add-outer" onClick={addNewGroup}><Plus className="w-4 h-4" />Add New Group</button>
//               </div>
//               <div className="flex justify-end">
//                 <div className="total-box" style={{ width: 300, background: '#fffbeb', borderColor: '#fde68a' }}>
//                   <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Subtotal</span><span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                   {orderForm.gstRate > 0 && <div className="flex justify-between text-sm text-gray-600 mb-2"><span>GST ({orderForm.gstRate}%)</span><span className="font-semibold">₹{orderTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
//                   <div className="flex justify-between font-bold text-lg border-t border-amber-300 pt-2 mt-2" style={{ color: '#7c3f00' }}><span>Total</span><span>₹{orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                 </div>
//               </div>
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
//               <button className="btn-amber" disabled={!orderForm.customerName || orderSubtotal === 0 || saving} onClick={handleSubmitOrder}>{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : isEditMode ? <><CheckCircle className="w-4 h-4" />Update</> : <><CheckCircle className="w-4 h-4" />Save</>}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHALLAN FORM */}
//       {showChallanForm && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 950 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: '#fde68a', color: '#78350f' }}>2</div>
//                 <div><h3 className="font-bold text-gray-800 text-base m-0">Delivery Challan</h3><p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p></div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Date</label><input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} /></div>
//                 <div><label className="text-xs font-medium text-gray-500 block mb-1.5">Note</label><input className="kt-input" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} /></div>
//                 <div className="flex items-center gap-3 pt-5"><input type="checkbox" id="hp" checked={hidePriceOnChallan} onChange={e => setHidePriceOnChallan(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#d97706' }} /><label htmlFor="hp" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2"><EyeOff className="w-4 h-4 text-amber-600" />Hide Price</label></div>
//               </div>
//               {(selectedOrder.poNumber || selectedOrder.gstCustomerName) && <div className="flex gap-3 flex-wrap">{selectedOrder.poNumber && <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}><strong>PO:</strong> {selectedOrder.poNumber}</div>}{selectedOrder.gstCustomerName && <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' }}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}</div>}
//               <div>
//                 <p className="sec-label">Items</p>
//                 <div className="kt-inset">
//                   <div className="overflow-x-auto">
//                     <table className="kt-tbl">
//                       <thead><tr><th>Item Description</th><th className="c" style={{ width: 55 }}>Unit</th><th className="r" style={{ width: 80 }}>Ordered</th><th className="r" style={{ width: 80 }}>Sent</th><th className="r" style={{ width: 80 }}>Left</th><th className="r" style={{ width: 90 }}>Sending</th><th className="r" style={{ width: 90 }}>Calc Qty</th></tr></thead>
//                       <tbody>
//                         {challanItems.map(it => {
//                           const rem = it.orderedQty - it.alreadySent;
//                           return (
//                             <tr key={it.uid}>
//                               <td className="font-medium">{it.product}{it.isWood && <><span className="unit-badge wood-badge ml-2">🪵</span>{(it.size || it.lengthDisplay) && <div className="text-xs text-gray-400 mt-1">{[it.size, it.lengthDisplay].filter(Boolean).join(' · ')}</div>}</>}</td>
//                               <td className="c text-xs text-gray-500">{it.unit}</td>
//                               <td className="r text-gray-600">{it.orderedQty.toFixed(3)}</td>
//                               <td className="r font-semibold" style={{ color: '#d97706' }}>{it.alreadySent ? it.alreadySent.toFixed(3) : '—'}</td>
//                               <td className="r font-bold" style={{ color: rem <= 0.001 ? '#16a34a' : '#111827' }}>{rem <= 0.001 ? '✓' : rem.toFixed(3)}</td>
//                               <td><input type="number" min="0" className="kt-input" style={{ padding: '8px', fontSize: 13, textAlign: 'right', background: rem <= 0.001 ? '#f9fafb' : undefined }} value={it.sendingPcs} disabled={rem <= 0.001} onChange={e => updateChallanItem(it.uid, 'sendingPcs', e.target.value)} /></td>
//                               <td className="r font-bold text-amber-700">{it.sendingQty ? it.sendingQty.toFixed(3) : '—'}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               {!hidePriceOnChallan && <div className="flex justify-end"><div className="total-box" style={{ minWidth: 240, background: '#fffbeb', borderColor: '#fde68a' }}><div className="flex justify-between font-bold text-base" style={{ color: '#7c3f00' }}><span>Total</span><span>₹{challanItems.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div></div></div>}
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
//               <button className="btn-amber" disabled={saving} onClick={handleSubmitChallan}>{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Save Challan</>}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHALLAN SUCCESS MODAL */}
//       {showChallanSuccess && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 480 }}>
//             <div className="kt-mbody" style={{ textAlign: 'center', padding: '40px 30px' }}>
//               <div className="success-icon"><CheckCircle style={{ width: 32, height: 32, color: '#16a34a' }} /></div>
//               <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Challan Created!</h3>
//               <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>{lastChallanNo}</p>
//               <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 28 }}>Ab aap view, print ya save kar sakte hain</p>
//               <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
//                 <button className="btn-teal" onClick={() => { openPDFView(lastChallanHTML); }}><Eye className="w-4 h-4" />View PDF</button>
//                 <button className="btn-amber" onClick={() => { openPDFPrint(lastChallanHTML); }}><Printer className="w-4 h-4" />Print</button>
//                 <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => { const win = window.open('', '_blank'); const cleanHTML = lastChallanHTML.replace(/<div class="action-bar">[\s\S]*?<\/div>/, ''); win.document.write(cleanHTML); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); }}><Download className="w-4 h-4" />Save PDF</button>
//               </div>
//             </div>
//             <div className="kt-mfoot" style={{ justifyContent: 'center' }}>
//               <button className="btn-white" onClick={() => setShowChallanSuccess(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FINAL BILL */}
//       {showBillPreview && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 800 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: '#dcfce7', color: '#166534' }}>3</div>
//                 <div><h3 className="font-bold text-gray-800 text-base m-0">Final Invoice</h3><p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo}</p></div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowBillPreview(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody">
//               {(() => {
//                 const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//                 const m = {};
//                 oc.forEach(ch => ch.items?.forEach(it => { const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || ''); if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' }; m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0); m[key].totalAmount += parseFloat(it.amount || 0); }));
//                 const li = Object.values(m);
//                 const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//                 const gstRate = selectedOrder.gstRate || 0;
//                 const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
//                 const total = sub + tax;
//                 return (
//                   <div className="space-y-4">
//                     <div className="flex gap-3 flex-wrap">
//                       <div className="text-xs px-4 py-2.5 rounded-xl flex-1" style={{ background: '#fef3c7', color: '#78350f', border: '1px solid #fde68a' }}><strong>Challans: </strong>{oc.length ? oc.map(c => c.challanNo).join(', ') : 'None'}</div>
//                       {selectedOrder.poNumber && <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}><strong>PO:</strong> {selectedOrder.poNumber}</div>}
//                       {selectedOrder.gstCustomerName && <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' }}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}
//                     </div>
//                     <div className="kt-inset">
//                       <table className="kt-tbl">
//                         <thead><tr><th style={{ width: 30 }}>#</th><th>Item Description</th><th className="r" style={{ width: 80 }}>Qty</th><th className="r" style={{ width: 80 }}>Rate</th><th className="r" style={{ width: 100 }}>Amount</th></tr></thead>
//                         <tbody>
//                           {li.map((it, i) => (
//                             <tr key={i}>
//                               <td className="c text-gray-400 text-xs">{i + 1}</td>
//                               <td className="font-medium">{it.product}{(it.size || it.lengthDisplay) && <div className="text-xs text-gray-400 mt-0.5">{[it.size, it.lengthDisplay].filter(x => x && x !== "0'-0\"").join(' · ')}</div>}</td>
//                               <td className="r font-semibold text-amber-700">{it.totalQty.toFixed(3)} <span className="text-xs text-gray-400">{it.unit}</span></td>
//                               <td className="r text-gray-500">₹{parseFloat(it.rate || 0).toLocaleString('en-IN')}</td>
//                               <td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="flex justify-end">
//                       <div className="total-box" style={{ width: 280, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
//                         <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                         {gstRate > 0 && <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>GST ({gstRate}%)</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
//                         <div className="flex justify-between font-bold text-base border-t border-green-200 pt-2" style={{ color: '#166534' }}><span>Grand Total</span><span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => setShowBillPreview(false)}>Close</button>
//               <button className="btn-teal" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFView(getBillPrintHTML(selectedOrder, oc)); }}><Eye className="w-4 h-4" />View</button>
//               <button className="btn-amber" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFPrint(getBillPrintHTML(selectedOrder, oc)); }}><Printer className="w-4 h-4" />Print</button>
//               <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); const html = getBillPrintHTML(selectedOrder, oc).replace(/<div class="action-bar">[\s\S]*?<\/div>/, ''); const win = window.open('', '_blank'); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); }}><Download className="w-4 h-4" />Save PDF</button>
//               {selectedOrder.status === 'Completed' && <button className="btn-green" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFPrint(getBillPrintHTML(selectedOrder, oc)); markBilled(selectedOrder.orderNo); }}><Receipt className="w-4 h-4" />Mark Billed</button>}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



////////// client ki pasand ki UI /////////////////






// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Trash2, Printer, Search, CheckCircle,
//   AlertTriangle, Loader2, RefreshCw, Download, Eye,
//   X, TruckIcon, Receipt, ArrowRight, EyeOff, ChevronDown, Edit2
// } from 'lucide-react';

// const SHOP_INFO = {
//   name: 'Krishna Timber & Plywoods',
//   address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
//   phone: '9826700196',
//   gstin: '23ADCPC2098K1ZQ',
// };

// const GST_OPTIONS = [
//   { value: 0, label: 'No GST' },
//   { value: 5, label: 'GST 5%' },
//   { value: 12, label: 'GST 12%' },
//   { value: 18, label: 'GST 18%' },
// ];

// const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];

// // ─────────────────────────────────────────────────────────────────────────────
// // THEME PALETTE — Maroon + Off-White (matches physical challan)
// // ─────────────────────────────────────────────────────────────────────────────
// const THEME = {
//   maroon: '#7B1E1E',
//   maroonDark: '#5a1515',
//   maroonLight: '#9a2828',
//   cream: '#FBF6F0',         // off-white background
//   creamLight: '#FFFBF5',    // lighter cream for hover
//   creamDark: '#F0E6DA',     // border tint
//   accent: '#FDF8F2',        // very light cream for stripes
//   textDark: '#2a1010',
//   textMuted: '#6b5454',
//   borderSoft: '#E8DCC8',
// };

// function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

// function parseWoodDimensions(name) {
//   if (!name) return null;
//   const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
//   if (!match) return null;
//   let width = parseFloat(match[1]);
//   let thickness = match[2];
//   if (thickness.includes('½')) thickness = parseFloat(thickness.replace('½', '')) + 0.5 || 0.5;
//   else if (thickness.includes('¼')) thickness = parseFloat(thickness.replace('¼', '')) + 0.25 || 0.25;
//   else if (thickness.includes('¾')) thickness = parseFloat(thickness.replace('¾', '')) + 0.75 || 0.75;
//   else thickness = parseFloat(thickness);
//   return { width, thickness };
// }

// function calculateByUnit(item) {
//   const qty = parseFloat(item.quantity || 0);
//   const rate = parseFloat(item.rate || 0);
//   const width = parseFloat(item.width || 0);
//   const thickness = parseFloat(item.thickness || 0);
//   const totalLengthFeet = parseFloat(item.lengthFeet || 0) + (parseFloat(item.lengthInches || 0) / 12);
//   let calculatedQty = qty;
//   if (item.isWood) {
//     switch (item.unit) {
//       case 'CFT': calculatedQty = (width * thickness * totalLengthFeet * qty) / 144; break;
//       case 'RFT': calculatedQty = totalLengthFeet * qty; break;
//       case 'SQFT': calculatedQty = (width * totalLengthFeet * qty) / 12; break;
//       case 'Per Piece': calculatedQty = qty; break;
//       default: calculatedQty = qty;
//     }
//   }
//   return {
//     calculatedQty: Math.round(calculatedQty * 1000) / 1000,
//     amount: Math.round(calculatedQty * rate * 100) / 100,
//   };
// }

// function rebuildItemForEdit(savedItem) {
//   const item = {
//     uid: uid(), product: savedItem.product || '', unit: savedItem.unit || '',
//     lengthFeet: savedItem.lengthFeet || '', lengthInches: savedItem.lengthInches || '',
//     quantity: savedItem.quantity || '', rate: savedItem.rate || '',
//     amount: savedItem.amount || 0, calculatedQty: savedItem.calculatedQty || 0,
//     skuCode: savedItem.skuCode || '', isWood: savedItem.isWood || false,
//     width: parseFloat(savedItem.width || 0), thickness: parseFloat(savedItem.thickness || 0),
//     size: savedItem.size || '', materialType: savedItem.materialType || '',
//     category: savedItem.category || '', subCategory: savedItem.subCategory || '',
//   };
//   if (item.isWood && (!item.width || !item.thickness)) {
//     const dims = parseWoodDimensions(item.product);
//     if (dims) { item.width = dims.width; item.thickness = dims.thickness; if (!item.size) item.size = `${dims.width}×${dims.thickness}"`; }
//   }
//   const calc = calculateByUnit(item);
//   item.calculatedQty = calc.calculatedQty;
//   item.amount = calc.amount;
//   return item;
// }

// function numberToWords(num) {
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
//   if (num === 0) return 'Zero';
//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:'');
//     if (n < 1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+convert(n%100):'');
//     if (n < 100000) return convert(Math.floor(n/1000))+' Thousand'+(n%1000?' '+convert(n%1000):'');
//     if (n < 10000000) return convert(Math.floor(n/100000))+' Lakh'+(n%100000?' '+convert(n%100000):'');
//     return convert(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+convert(n%10000000):'');
//   }
//   const i=Math.floor(num),d=Math.round((num-i)*100);
//   return convert(i)+' Rupees'+(d>0?' and '+convert(d)+' Paise':'')+' Only';
// }

// function SearchableSelect({ options, value, onChange, placeholder='Search...', disabled=false }) {
//   const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
//   const filtered=options.filter(o=>(typeof o==='string'?o:o.label||o).toLowerCase().includes(search.toLowerCase()));
//   const getVal=o=>typeof o==='string'?o:o.value??o.label??o;const getDisp=o=>typeof o==='string'?o:o.label??o.value??o;
//   const selDisp=options.find(o=>getVal(o)===value);
//   useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
//   const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(getVal(filtered[hiIdx]));setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
//   return(<div ref={wrapRef} className="searchable-select"><div className="ss-input-wrap"><input type="text" className="ss-input" placeholder={value?'':placeholder} value={isOpen?search:(selDisp?getDisp(selDisp):'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown">{filtered.length===0?<div className="ss-no-results">No results</div>:<div className="ss-options">{filtered.map((o,idx)=>(<div key={idx} className={`ss-option ${hiIdx===idx?'highlighted':''} ${getVal(o)===value?'selected':''}`} onClick={()=>{onChange(getVal(o));setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)}>{getDisp(o)}</div>))}</div>}</div>}</div>);
// }

// function ProductSearchableSelect({ products, value, onChange, disabled=false }) {
//   const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
//   const filtered=products.filter(p=>{const s=search.toLowerCase();return p.materialName?.toLowerCase().includes(s)||p.skuCode?.toLowerCase().includes(s)||p.category?.toLowerCase().includes(s)||p.subCategory?.toLowerCase().includes(s);});
//   const selected=products.find(p=>p.skuCode===value);
//   useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
//   const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(filtered[hiIdx].skuCode);setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
//   return(<div ref={wrapRef} className="searchable-select product-select"><div className="ss-input-wrap"><Search className="ss-search-icon"/><input type="text" className="ss-input with-icon" placeholder={selected?'':'🔍 Search product...'} value={isOpen?search:(selected?.materialName||'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown product-dropdown"><div className="ss-dropdown-header"><span>{filtered.length} products</span></div>{filtered.length===0?<div className="ss-no-results">No match</div>:<div className="ss-options">{filtered.slice(0,50).map((p,idx)=>(<div key={p.skuCode} className={`ss-option product-option ${hiIdx===idx?'highlighted':''} ${p.skuCode===value?'selected':''}`} onClick={()=>{onChange(p.skuCode);setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)}><div className="product-option-main"><span className="product-name">{p.materialName}</span><span className="product-sku">{p.skuCode}</span></div><div className="product-option-sub"><span className="product-cat">{p.materialType}</span><span className="product-sep">›</span><span className="product-cat">{p.category}</span>{p.subCategory&&<><span className="product-sep">›</span><span className="product-cat">{p.subCategory}</span></>}<span className="product-unit">{p.unit}</span></div></div>))}{filtered.length>50&&<div className="ss-more">+{filtered.length-50} more...</div>}</div>}</div>}</div>);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PRINT CSS — Professional Maroon Theme (matches challan pad)
// // ─────────────────────────────────────────────────────────────────────────────
// const PRINT_CSS = `
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:Arial,sans-serif;font-size:11px;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// .page{max-width:195mm;margin:0 auto;padding:8mm 10mm}

// .action-bar{display:flex;gap:10px;justify-content:center;padding:12px;background:#FBF6F0;border-radius:10px;margin-bottom:16px;border:1px solid #E8DCC8}
// .action-btn{padding:9px 22px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
// .btn-print{background:#7B1E1E;color:#fff}.btn-print:hover{background:#5a1515}
// .btn-save{background:#5a1515;color:#fff}.btn-save:hover{background:#3d0d0d}

// .ktp-header{
//   background:#7B1E1E;color:#fff;padding:10px 16px 9px;
//   border:2px solid #7B1E1E;display:flex;align-items:center;gap:14px;
// }
// .ktp-logo-circle{width:52px;height:52px;border-radius:50%;border:2.5px solid #fff;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
// .ktp-logo-text{font-size:17px;font-weight:900;color:#7B1E1E;font-family:Georgia,serif;letter-spacing:1px}
// .ktp-header-center{flex:1;text-align:center}
// .ktp-brand-name{font-size:30px;font-style:italic;font-weight:bold;font-family:Georgia,serif;color:#fff;line-height:1}
// .ktp-brand-sub{font-size:14px;font-family:Georgia,serif;color:#f5d0d0;letter-spacing:2px;margin-top:1px}
// .ktp-brand-addr{font-size:8.5px;color:#fde8e8;margin-top:4px;letter-spacing:0.3px}

// .ktp-meta{display:flex;justify-content:space-between;align-items:center;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:5px 10px;background:#FBF6F0}
// .ktp-meta-left{display:flex;flex-direction:column;gap:1px}
// .ktp-since{font-size:8.5px;color:#6b5454;font-style:italic}
// .ktp-gstin{font-size:10px;font-weight:bold;color:#7B1E1E;text-decoration:underline}
// .ktp-dc-box{text-align:right}
// .ktp-dc-title{font-size:14px;font-weight:bold;color:#7B1E1E;letter-spacing:2px;text-transform:uppercase}

// .ktp-info{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:7px 10px;background:#FBF6F0}
// .ktp-info-row1{display:flex;gap:20px;margin-bottom:5px;flex-wrap:wrap}
// .ktp-info-row2{display:flex;gap:10px;margin-bottom:4px;flex-wrap:wrap}
// .ktp-info-row3{display:flex;gap:10px;flex-wrap:wrap}
// .ktp-field{display:flex;align-items:baseline;gap:4px}
// .ktp-field-label{font-size:9.5px;font-weight:bold;white-space:nowrap;color:#2a1010}
// .ktp-field-value{font-size:10px;border-bottom:1px solid #888;padding-bottom:1px;min-width:80px}
// .ktp-field-value.wide{min-width:200px}
// .ktp-field-value.medium{min-width:130px}

// .ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:none}
// table.items{width:100%;border-collapse:collapse;border-top:1.5px solid #7B1E1E;border-bottom:none}
// table.items thead tr{background:#7B1E1E}
// table.items th{padding:6px 7px;font-size:9px;font-weight:bold;text-transform:uppercase;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,0.25);letter-spacing:0.5px}
// table.items th:last-child{border-right:none}
// table.items th.tl{text-align:left}
// table.items tbody tr{border-bottom:1px solid #c09090}
// table.items tbody tr:nth-child(even){background:#FDF8F2}
// table.items tbody tr:nth-child(odd){background:#FBF6F0}
// table.items td{padding:4px 7px;font-size:10.5px;border-right:1px solid #c09090;vertical-align:top;min-height:20px}
// table.items td:last-child{border-right:none}
// table.items td.r{text-align:right}
// table.items td.c{text-align:center}
// table.items .erow td{height:20px;padding:3px 7px}

// .ktp-footer{border:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;display:flex;background:#FBF6F0}
// .ktp-footer-left{flex:1;padding:8px 12px;border-right:1.5px solid #7B1E1E;font-size:9px;line-height:1.8}
// .ktp-footer-cert{font-size:9px;margin-bottom:6px;color:#2a1010}
// .ktp-footer-sig{font-size:11px;font-style:italic;font-weight:bold;font-family:Georgia,serif;color:#7B1E1E}
// .ktp-footer-right{width:200px;display:flex;flex-direction:column}
// .ktp-total-row{display:flex;justify-content:space-between;align-items:center;padding:5px 10px;border-bottom:1px solid #c09090;font-size:10px}
// .ktp-total-row.grand{background:#7B1E1E;color:#fff;font-size:11px;font-weight:bold}
// .ktp-total-label{font-weight:600}
// .ktp-total-val{font-weight:bold}
// .ktp-sig-row{display:flex;justify-content:flex-end;align-items:flex-end;padding:5px 10px;border-bottom:1px solid #c09090;font-size:9px;flex:1}
// .ktp-eoe{border-top:1px solid #c09090;padding:4px 10px;font-size:8.5px;color:#6b5454;font-style:italic}

// .ktp-words{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;padding:5px 10px;font-size:9.5px;background:#FBF6F0}
// .ktp-words-label{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#7B1E1E;margin-bottom:2px}
// .ktp-words-text{font-style:italic;font-weight:600}

// .ktp-gst-section{border:2px solid #7B1E1E;margin-top:10px}
// .ktp-gst-head{background:#7B1E1E;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}
// .ktp-gst-table{width:100%;border-collapse:collapse}
// .ktp-gst-table th{background:#F0E6DA;padding:5px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #c09090;border-right:1px solid #ddd}
// .ktp-gst-table td{padding:5px 8px;font-size:10px;border-right:1px solid #ddd;background:#FBF6F0}

// .ktp-terms-section{border:2px solid #7B1E1E;border-top:none;display:flex;background:#FBF6F0}
// .ktp-terms-left{flex:1;padding:8px 12px;border-right:1.5px solid #c09090}
// .ktp-terms-title{font-size:8.5px;font-weight:bold;text-transform:uppercase;text-decoration:underline;margin-bottom:4px;color:#2a1010}
// .ktp-terms-list{font-size:8.5px;line-height:1.8;color:#2a1010}
// .ktp-terms-right{width:200px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:10px}
// .ktp-stamp-box{border:2px dashed #7B1E1E;padding:6px 12px;margin-bottom:24px;font-size:9px;font-weight:bold;text-transform:uppercase;color:#7B1E1E;text-align:center}
// .ktp-sig-line{width:100%;border-top:1px solid #000;margin-bottom:4px}
// .ktp-sig-label{font-size:8.5px;font-weight:bold;text-align:center}

// .ktp-thankyou{border:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;padding:6px;text-align:center;font-size:10px;font-weight:bold;color:#7B1E1E;background:#FDF8F2}

// @media print{
//   .action-bar{display:none!important}
//   body{font-size:10px}
//   .page{padding:6mm 8mm}
//   .ktp-header{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   table.items thead tr{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   table.items th{color:#fff!important}
//   .ktp-total-row.grand{background:#000!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   .ktp-gst-head{background:#000!important;color:#fff!important}
//   .ktp-gstin,.ktp-dc-title,.ktp-footer-sig,.ktp-stamp-box,.ktp-thankyou{color:#000!important}
//   table.items tbody tr:nth-child(even),table.items tbody tr:nth-child(odd){background:#fff!important}
//   .ktp-gst-table th{background:#f0f0f0!important}
//   .ktp-words,.ktp-info,.ktp-meta,.ktp-footer,.ktp-gst-table td,.ktp-terms-section,.ktp-thankyou{background:#fff!important}
//   .ktp-words{border-color:#000}
// }
// @page{size:A4;margin:8mm}
// `;

// const buildItemDesc = (it) => {
//   let name = `<strong>${it.product}</strong>`;
//   let details = [];
//   if (it.size) details.push(it.size);
//   const ld = it.lengthDisplay || '';
//   if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
//   if (details.length) name += `<br><span style="font-size:8.5px;color:#6b5454">${details.join(' · ')}</span>`;
//   return name;
// };

// const KTP_LOGO_SVG = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="38" height="38">
//   <circle cx="30" cy="30" r="28" fill="none" stroke="#7B1E1E" stroke-width="3"/>
//   <text x="30" y="40" text-anchor="middle" font-size="22" font-weight="900" font-family="Georgia,serif" fill="#7B1E1E">KTP</text>
// </svg>`;

// const getChallanPrintHTML = (order, challan, hidePrice = false) => {
//   const challanTotal = challan.items.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
//   const poLine = order.poNumber ? `<div class="ktp-field"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
//   const gstLine = order.gstCustomerName ? `<div class="ktp-field"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';

//   const itemRows = challan.items.map((it, i) => {
//     const qtyVal = it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty;
//     const qtyWithUnit = it.unit ? `${qtyVal} <span style="font-size:8.5px;color:#6b5454">${it.unit}</span>` : qtyVal;
//     return `<tr>
//       <td class="c" style="width:32px">${i + 1}</td>
//       <td>${buildItemDesc(it)}</td>
//       ${!hidePrice
//         ? `<td class="r" style="width:90px">${qtyWithUnit}</td>
//            <td class="r" style="width:75px">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//            <td class="r" style="width:90px"><strong>${parseFloat(it.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>`
//         : `<td class="r" style="width:90px">${qtyWithUnit}</td>`
//       }
//     </tr>`;
//   });

//   const totalRows = Math.max(0, 12 - challan.items.length);
//   const emptyRows = Array(totalRows).fill(`<tr class="erow"><td></td><td></td>${!hidePrice ? '<td></td><td></td><td></td>' : '<td></td>'}</tr>`);

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
// <title>Challan ${challan.challanNo}</title>
// <style>${PRINT_CSS}</style></head><body>
// <div class="page">

//   <div class="action-bar">
//     <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//     <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
//   </div>

//   <div class="ktp-header">
//     <div class="ktp-logo-circle">${KTP_LOGO_SVG}</div>
//     <div class="ktp-header-center">
//       <div class="ktp-brand-name">Krishna</div>
//       <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
//       <div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}</div>
//     </div>
//   </div>

//   <div class="ktp-meta">
//     <div class="ktp-meta-left">
//       <div class="ktp-since">Chhabra's Since 1979</div>
//       <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
//     </div>
//     <div class="ktp-dc-box">
//       <div class="ktp-dc-title">Delivery Challan</div>
//       <div style="font-size:9px;color:#6b5454;margin-top:2px;">
//         No.: <strong style="color:#2a1010">${challan.challanNo}</strong>
//         &nbsp;&nbsp;&nbsp;
//         Date: <strong style="color:#2a1010">${new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
//       </div>
//     </div>
//   </div>

//   <div class="ktp-info">
//     <div class="ktp-info-row1">
//       <div class="ktp-field">
//         <span class="ktp-field-label">CONSIGNOR (Details of Receiver)</span>
//       </div>
//     </div>
//     <div class="ktp-info-row2">
//       <div class="ktp-field">
//         <span class="ktp-field-label">Name:</span>
//         <span class="ktp-field-value wide">${order.customerName}</span>
//       </div>
//       <div class="ktp-field">
//         <span class="ktp-field-label">Vehicle No.:</span>
//         <span class="ktp-field-value medium">&nbsp;</span>
//       </div>
//     </div>
//     <div class="ktp-info-row3">
//       <div class="ktp-field">
//         <span class="ktp-field-label">Address:</span>
//         <span class="ktp-field-value" style="min-width:300px">${order.customerAddress || '&nbsp;'}</span>
//       </div>
//     </div>
//     ${(order.customerPhone || order.poNumber || order.gstCustomerName) ? `
//     <div class="ktp-info-row3" style="margin-top:5px">
//       ${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}
//       ${poLine}
//       ${gstLine}
//       <div class="ktp-field"><span class="ktp-field-label">Ref Order:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>
//       ${challan.deliveryNote ? `<div class="ktp-field"><span class="ktp-field-label">Note:</span><span class="ktp-field-value medium">${challan.deliveryNote}</span></div>` : ''}
//     </div>` : ''}
//   </div>

//   <div class="ktp-table-wrap">
//     <table class="items">
//       <thead>
//         <tr>
//           <th style="width:32px">S.No.</th>
//           <th class="tl">Description of Goods</th>
//           ${!hidePrice
//             ? `<th style="width:90px">Qty</th>
//                <th style="width:75px">Rate (₹)</th>
//                <th style="width:90px">Total (₹)</th>`
//             : `<th style="width:90px">Qty</th>`
//           }
//         </tr>
//       </thead>
//       <tbody>
//         ${itemRows.join('')}
//         ${emptyRows.join('')}
//       </tbody>
//     </table>
//   </div>

//   ${!hidePrice ? `
//   <div class="ktp-words">
//     <div class="ktp-words-label">Amount in Words</div>
//     <div class="ktp-words-text">${numberToWords(challanTotal)}</div>
//   </div>` : ''}

//   <div class="ktp-footer">
//     <div class="ktp-footer-left">
//       <div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div>
//       <div class="ktp-footer-sig">For : Krishna Timber &amp; Plywoods</div>
//       <div style="margin-top:20px;font-size:8.5px;color:#6b5454">
//         • Goods dispatched will not be returned without prior approval.<br/>
//         • Verify items on receipt; report discrepancies within 24 hours.<br/>
//         • This is a delivery challan — not a tax invoice.<br/>
//         • All disputes subject to Bhopal jurisdiction only.
//       </div>
//       <div style="margin-top:14px;display:flex;align-items:flex-end;gap:10px;">
//         <div>
//           <div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div>
//           <div style="font-size:8.5px;font-weight:bold">Customer Signature</div>
//         </div>
//         <div style="font-size:8.5px;color:#6b5454;margin-bottom:4px">Received goods in good condition</div>
//       </div>
//     </div>
//     <div class="ktp-footer-right">
//       ${!hidePrice ? `
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Freight</span>
//         <span class="ktp-total-val">&nbsp;</span>
//       </div>
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Total Taxable Amt ₹</span>
//         <span class="ktp-total-val">${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//       <div class="ktp-total-row grand">
//         <span>Challan/Invoice Total ₹</span>
//         <span>${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>` : `
//       <div style="padding:12px 10px;font-size:9px;text-align:center;color:#7B1E1E;font-weight:bold;">
//         DELIVERY CHALLAN<br/>FOR GOODS REFERENCE ONLY
//       </div>`}
//       <div class="ktp-sig-row">
//         <div style="text-align:center">
//           <div style="width:120px;border-top:1px solid #000;margin-bottom:3px"></div>
//           <div style="font-size:8.5px;font-weight:bold">Authorised Signatory</div>
//         </div>
//       </div>
//       <div class="ktp-eoe">E. &amp; O.E.</div>
//     </div>
//   </div>

//   <div class="ktp-thankyou">
//     Krishna Timber &amp; Plywoods &nbsp;|&nbsp; ${SHOP_INFO.phone} &nbsp;|&nbsp; ${SHOP_INFO.address}
//   </div>

// </div>
// <script>
// function savePDF(){
//   document.querySelector('.action-bar').style.display='none';
//   window.print();
//   setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);
// }
// </script>
// </body></html>`;
// };

// const getBillPrintHTML = (order, chs) => {
//   const m = {};
//   chs.forEach(ch => ch.items?.forEach(it => {
//     const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || '');
//     if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' };
//     m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0);
//     m[key].totalAmount += parseFloat(it.amount || 0);
//   }));
//   const li = Object.values(m);
//   const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//   const gstRate = order.gstRate || 0;
//   const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
//   const total = sub + tax;

//   const itemRows = li.map((it, i) => {
//     const desc = buildItemDesc(it);
//     const qtyWithUnit = it.unit
//       ? `<strong>${it.totalQty.toFixed(3)}</strong> <span style="font-size:8.5px;color:#6b5454">${it.unit}</span>`
//       : `<strong>${it.totalQty.toFixed(3)}</strong>`;
//     return `<tr>
//       <td class="c" style="width:32px">${i + 1}</td>
//       <td>${desc}</td>
//       <td class="r" style="width:90px">${qtyWithUnit}</td>
//       <td class="r" style="width:75px">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//       <td class="r" style="width:95px"><strong>${it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
//     </tr>`;
//   });

//   const totalRows = Math.max(0, 10 - li.length);
//   const emptyRows = Array(totalRows).fill(`<tr class="erow"><td></td><td></td><td></td><td></td><td></td></tr>`);

//   const poRow = order.poNumber ? `<div class="ktp-field" style="margin-top:4px"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
//   const gstRow = order.gstCustomerName ? `<div class="ktp-field" style="margin-top:4px"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
// <title>Invoice INV-${order.orderNo}</title>
// <style>${PRINT_CSS}</style></head><body>
// <div class="page">

//   <div class="action-bar">
//     <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
//     <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
//   </div>

//   <div class="ktp-header">
//     <div class="ktp-logo-circle">${KTP_LOGO_SVG}</div>
//     <div class="ktp-header-center">
//       <div class="ktp-brand-name">Krishna</div>
//       <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
//       <div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}</div>
//     </div>
//   </div>

//   <div class="ktp-meta">
//     <div class="ktp-meta-left">
//       <div class="ktp-since">Chhabra's Since 1979</div>
//       <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
//     </div>
//     <div class="ktp-dc-box">
//       <div class="ktp-dc-title">Tax Invoice</div>
//       <div style="font-size:9px;color:#6b5454;margin-top:2px;">
//         No.: <strong style="color:#2a1010">INV-${order.orderNo}</strong>
//         &nbsp;&nbsp;&nbsp;
//         Date: <strong style="color:#2a1010">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
//       </div>
//     </div>
//   </div>

//   <div class="ktp-info">
//     <div class="ktp-info-row2">
//       <div class="ktp-field">
//         <span class="ktp-field-label">Bill To:</span>
//         <span class="ktp-field-value wide"><strong>${order.customerName}</strong></span>
//       </div>
//       ${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}
//     </div>
//     ${order.customerAddress ? `<div class="ktp-info-row3" style="margin-top:4px"><div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value" style="min-width:280px">${order.customerAddress}</span></div></div>` : ''}
//     <div class="ktp-info-row3" style="margin-top:5px;flex-wrap:wrap;gap:10px">
//       <div class="ktp-field"><span class="ktp-field-label">Order No:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>
//       ${poRow}${gstRow}
//       <div class="ktp-field"><span class="ktp-field-label">Challans:</span><span class="ktp-field-value" style="min-width:180px">${chs.map(c => c.challanNo).join(', ')}</span></div>
//       ${gstRate > 0 ? `<div class="ktp-field"><span class="ktp-field-label">GST:</span><span class="ktp-field-value medium">${gstRate}% Included</span></div>` : ''}
//     </div>
//   </div>

//   <div class="ktp-table-wrap">
//     <table class="items">
//       <thead>
//         <tr>
//           <th style="width:32px">S.No.</th>
//           <th class="tl">Description of Goods</th>
//           <th style="width:90px">Qty</th>
//           <th style="width:75px">Rate (₹)</th>
//           <th style="width:95px">Amount (₹)</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${itemRows.join('')}
//         ${emptyRows.join('')}
//       </tbody>
//     </table>
//   </div>

//   <div class="ktp-words" style="display:flex;justify-content:space-between;align-items:flex-start">
//     <div style="flex:1">
//       <div class="ktp-words-label">Amount in Words</div>
//       <div class="ktp-words-text">${numberToWords(total)}</div>
//     </div>
//     <div style="border-left:1.5px solid #c09090;padding-left:12px;min-width:200px">
//       <div class="ktp-total-row" style="padding:4px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//       ${gstRate > 0 ? `
//       <div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>CGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span>
//       </div>
//       <div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>SGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span>
//       </div>` : ''}
//       <div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between">
//         <span>Discount:</span><span>₹0.00</span>
//       </div>
//       <div style="margin-top:4px;background:#7B1E1E;color:#fff;padding:5px 8px;display:flex;justify-content:space-between;font-size:11px;font-weight:bold;border-radius:2px">
//         <span>Grand Total</span><span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//     </div>
//   </div>

//   ${gstRate > 0 ? `
//   <div class="ktp-gst-section">
//     <div class="ktp-gst-head">GST Tax Breakup</div>
//     <table class="ktp-gst-table">
//       <thead><tr>
//         <th>Taxable Amt</th><th>CGST Rate</th><th>CGST Amt</th>
//         <th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th>
//       </tr></thead>
//       <tbody><tr>
//         <td>₹${sub.toFixed(2)}</td>
//         <td>${gstRate / 2}%</td><td>₹${(tax / 2).toFixed(2)}</td>
//         <td>${gstRate / 2}%</td><td>₹${(tax / 2).toFixed(2)}</td>
//         <td><strong>₹${tax.toFixed(2)}</strong></td>
//       </tr></tbody>
//     </table>
//   </div>` : ''}

//   <div class="ktp-terms-section">
//     <div class="ktp-terms-left">
//       <div class="ktp-terms-title">Terms &amp; Conditions:</div>
//       <div class="ktp-terms-list">
//         • Goods once sold will not be taken back.<br/>
//         • Payment due on receipt of invoice.<br/>
//         • Interest @ 18% p.a. on overdue amounts.<br/>
//         • All disputes subject to Bhopal jurisdiction.<br/>
//         • Challan Ref: ${chs.map(c => `${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}
//       </div>
//       <div style="margin-top:18px;display:flex;align-items:flex-end;gap:10px">
//         <div>
//           <div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div>
//           <div style="font-size:8.5px;font-weight:bold">Customer Signature</div>
//         </div>
//         <div style="font-size:8.5px;color:#6b5454;margin-bottom:4px">Received goods in good condition</div>
//       </div>
//     </div>
//     <div class="ktp-terms-right">
//       <div class="ktp-stamp-box">For ${SHOP_INFO.name}</div>
//       <div class="ktp-sig-line"></div>
//       <div class="ktp-sig-label">Authorised Signatory</div>
//     </div>
//   </div>

//   <div class="ktp-thankyou">
//     Thank You for your business! &nbsp;|&nbsp; Krishna Timber &amp; Plywoods &nbsp;|&nbsp; ${SHOP_INFO.phone}
//   </div>

// </div>
// <script>
// function savePDF(){
//   document.querySelector('.action-bar').style.display='none';
//   window.print();
//   setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);
// }
// </script>
// </body></html>`;
// };

// const apiGet = async url => { try { const r = await fetch(url); if (!r.ok) return { success: false, data: [] }; return r.json(); } catch { return { success: false, data: [] }; } };
// const apiPost = async (url, body) => { try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
// const apiPatch = async (url, body) => { try { const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };

// const openPDFView = (html) => { const win = window.open('', '_blank'); win.document.write(html); win.document.close(); };
// const openPDFPrint = (html) => { const win = window.open('', '_blank'); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); };

// // ─────────────────────────────────────────────────────────────────────────────
// // SORT HELPER — Latest first (by createdAt / orderDate / challanDate / orderNo)
// // ─────────────────────────────────────────────────────────────────────────────
// const sortLatestFirst = (items, dateField) => {
//   return [...items].sort((a, b) => {
//     // Try createdAt / updatedAt first (most accurate)
//     const aTime = a.createdAt || a.updatedAt || a[dateField] || '';
//     const bTime = b.createdAt || b.updatedAt || b[dateField] || '';
//     if (aTime && bTime) {
//       const diff = new Date(bTime).getTime() - new Date(aTime).getTime();
//       if (diff !== 0) return diff;
//     }
//     // Fallback: compare order/challan numbers (numeric suffix descending)
//     const aNo = parseInt((a.orderNo || a.challanNo || '').split('-').pop()) || 0;
//     const bNo = parseInt((b.orderNo || b.challanNo || '').split('-').pop()) || 0;
//     return bNo - aNo;
//   });
// };

// export default function OrderChallanBilling() {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [orders, setOrders] = useState([]);
//   const [challans, setChallans] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [challanSearchQuery, setChallanSearchQuery] = useState(''); // ✅ new
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingOrder, setEditingOrder] = useState(null);
//   const [showChallanForm, setShowChallanForm] = useState(false);
//   const [showBillPreview, setShowBillPreview] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showChallanSuccess, setShowChallanSuccess] = useState(false);
//   const [lastChallanHTML, setLastChallanHTML] = useState('');
//   const [lastChallanNo, setLastChallanNo] = useState('');
//   const [orderForm, setOrderForm] = useState({ customerName: '', customerPhone: '', customerAddress: '', orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '', poNumber: '', gstCustomerName: '' });
//   const [orderGroups, setOrderGroups] = useState([createEmptyGroup()]);
//   const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
//   const [challanItems, setChallanItems] = useState([]);
//   const [deliveryNote, setDeliveryNote] = useState('');
//   const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);

//   function createEmptyItem(ov = {}) { return { uid: uid(), product: '', unit: '', lengthFeet: '', lengthInches: '', quantity: '', rate: '', amount: 0, calculatedQty: 0, skuCode: '', isWood: false, width: 0, thickness: 0, size: '', materialType: '', category: '', subCategory: '', ...ov }; }
//   function createEmptyGroup() { return { groupId: uid(), filterMaterialType: '', filterCategory: '', filterSubCategory: '', items: [createEmptyItem()] }; }
//   const getAllOrderItems = () => orderGroups.flatMap(g => g.items.map(item => ({ ...item, filterMaterialType: g.filterMaterialType, filterCategory: g.filterCategory, filterSubCategory: g.filterSubCategory })));
//   const orderSubtotal = getAllOrderItems().reduce((s, i) => s + (i.amount || 0), 0);
//   const orderTax = orderForm.gstRate > 0 ? orderSubtotal * (orderForm.gstRate / 100) : 0;
//   const orderTotal = orderSubtotal + orderTax;

//   const fetchData = useCallback(async () => {
//     setLoading(true); setError(null);
//     try {
//       const [oR, cR, pR] = await Promise.all([apiGet('/api/billing-backend/orders'), apiGet('/api/billing-backend/challans'), apiGet('/api/dropdown-data')]);
//       setOrders(oR.success ? oR.data || [] : []);
//       setChallans(cR.success ? cR.data || [] : []);
//       setProducts(pR.success && pR.data ? pR.data : []);
//     } catch { setError('Data load problem'); }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const isWoodMaterial = item => { if (!item) return false; const mt = (item.materialType || '').toLowerCase(); const cat = (item.category || '').toLowerCase(); return mt.includes('timber') || mt.includes('wood') || mt.includes('lakdi') || cat.includes('teak') || cat.includes('sagwan') || cat.includes('pine') || cat.includes('sal'); };
//   const getFilteredProductsForGroup = g => products.filter(p => { if (g.filterMaterialType && p.materialType !== g.filterMaterialType) return false; if (g.filterCategory && p.category !== g.filterCategory) return false; if (g.filterSubCategory && p.subCategory !== g.filterSubCategory) return false; return true; });
//   const getAllMaterialTypes = () => [...new Set(products.map(p => p.materialType).filter(Boolean))];
//   const getCategoriesFor = mt => [...new Set(products.filter(p => !mt || p.materialType === mt).map(p => p.category).filter(Boolean))];
//   const getSubCategoriesFor = (mt, cat) => [...new Set(products.filter(p => (!mt || p.materialType === mt) && (!cat || p.category === cat)).map(p => p.subCategory).filter(Boolean))];
//   const updateGroupFilter = (gid, field, val) => { setOrderGroups(prev => prev.map(g => { if (g.groupId !== gid) return g; const u = { ...g, [field]: val }; if (field === 'filterMaterialType') { u.filterCategory = ''; u.filterSubCategory = ''; } if (field === 'filterCategory') { u.filterSubCategory = ''; } return u; })); };
//   const addItemToGroup = gid => { setOrderGroups(prev => prev.map(g => g.groupId !== gid ? g : { ...g, items: [...g.items, createEmptyItem()] })); };
//   const removeItemFromGroup = (gid, iuid) => { setOrderGroups(prev => prev.map(g => { if (g.groupId !== gid || g.items.length === 1) return g; return { ...g, items: g.items.filter(i => i.uid !== iuid) }; })); };
//   const removeGroup = gid => { if (orderGroups.length === 1) return; setOrderGroups(prev => prev.filter(g => g.groupId !== gid)); };
//   const addNewGroup = () => setOrderGroups(prev => [...prev, createEmptyGroup()]);

//   const updateGroupItem = (gid, iuid, field, val) => {
//     setOrderGroups(prev => prev.map(g => {
//       if (g.groupId !== gid) return g;
//       return {
//         ...g, items: g.items.map(item => {
//           if (item.uid !== iuid) return item;
//           const u = { ...item, [field]: val };
//           if (field === 'skuCode') {
//             const f = products.find(p => p.skuCode === val);
//             if (f) {
//               u.product = f.materialName; u.skuCode = f.skuCode; u.materialType = f.materialType;
//               u.category = f.category; u.subCategory = f.subCategory; u.isWood = isWoodMaterial(f);
//               if (u.isWood) {
//                 u.unit = 'CFT';
//                 const dims = parseWoodDimensions(f.materialName);
//                 if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
//                 else { u.width = 0; u.thickness = 0; u.size = ''; }
//               } else { u.unit = f.unit || 'Pcs'; u.width = 0; u.thickness = 0; u.size = ''; u.lengthFeet = ''; u.lengthInches = ''; }
//             }
//           }
//           const calc = calculateByUnit(u); u.calculatedQty = calc.calculatedQty; u.amount = calc.amount;
//           return u;
//         })
//       };
//     }));
//   };

//   const genOrderNo = () => { const y = new Date().getFullYear(), px = `ORD-${y}-`; const max = orders.filter(o => o.orderNo?.startsWith(px)).reduce((m, o) => { const n = parseInt(o.orderNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0); return `${px}${String(max + 1).padStart(4, '0')}`; };
//   const genChallanNo = () => { const y = new Date().getFullYear(), px = `CHL-${y}-`; const max = challans.filter(c => c.challanNo?.startsWith(px)).reduce((m, c) => { const n = parseInt(c.challanNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0); return `${px}${String(max + 1).padStart(4, '0')}`; };

//   const openEditOrder = order => {
//     setIsEditMode(true); setEditingOrder(order);
//     setOrderForm({ customerName: order.customerName || '', customerPhone: order.customerPhone || '', customerAddress: order.customerAddress || '', orderDate: order.orderDate || new Date().toISOString().split('T')[0], gstRate: order.gstRate || 0, notes: order.notes || '', poNumber: order.poNumber || '', gstCustomerName: order.gstCustomerName || '' });
//     const savedItems = order.items || [];
//     if (savedItems.length === 0) { setOrderGroups([createEmptyGroup()]); }
//     else {
//       const groupMap = {};
//       savedItems.forEach(it => { const key = it.materialType || 'Other'; if (!groupMap[key]) groupMap[key] = []; groupMap[key].push(rebuildItemForEdit(it)); });
//       setOrderGroups(Object.entries(groupMap).map(([mt, items]) => ({ groupId: uid(), filterMaterialType: mt === 'Other' ? '' : mt, filterCategory: items[0]?.category || '', filterSubCategory: items[0]?.subCategory || '', items })));
//     }
//     setShowOrderForm(true);
//   };

//   const resetOrderForm = () => { setOrderForm({ customerName: '', customerPhone: '', customerAddress: '', orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '', poNumber: '', gstCustomerName: '' }); setOrderGroups([createEmptyGroup()]); setIsEditMode(false); setEditingOrder(null); };

//   const handleSubmitOrder = async () => {
//     if (!orderForm.customerName || orderSubtotal === 0) { setError('Customer name aur items required'); return; }
//     setSaving(true); setError(null);
//     try {
//       const validItems = getAllOrderItems().filter(i => i.product && (i.quantity || i.calculatedQty)).map(it => ({ ...it, lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '' }));
//       if (isEditMode && editingOrder) {
//         const r = await apiPatch('/api/billing-backend/orders', { orderNo: editingOrder.orderNo, order: { ...orderForm, orderNo: editingOrder.orderNo, subtotal: orderSubtotal, tax: orderTax, total: orderTotal, status: editingOrder.status, includeGST: orderForm.gstRate > 0 }, items: validItems });
//         if (!r.success) { setError(r.error || 'Edit fail'); return; }
//       } else {
//         const orderNo = genOrderNo();
//         const r = await apiPost('/api/billing-backend/orders', { order: { ...orderForm, orderNo, subtotal: orderSubtotal, tax: orderTax, total: orderTotal, status: 'Active', includeGST: orderForm.gstRate > 0 }, items: validItems });
//         if (!r.success) { setError(r.error || 'Save fail'); return; }
//       }
//       await fetchData(); setShowOrderForm(false); resetOrderForm();
//     } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
//   };

//   const openChallanForm = order => {
//     setSelectedOrder(order);
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//     setChallanItems((order.items || []).map(it => ({ uid: uid(), product: it.product, unit: it.unit, rate: parseFloat(it.rate || 0), orderedQty: parseFloat(it.calculatedQty || it.quantity || 0), alreadySent: parseFloat(sm[it.product] || 0), sendingPcs: '', sendingQty: 0, size: it.size || '', lengthFeet: it.lengthFeet || '', lengthInches: it.lengthInches || '', lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '', isWood: it.isWood || false, width: it.width || 0, thickness: it.thickness || 0 })));
//     setChallanDate(new Date().toISOString().split('T')[0]);
//     setDeliveryNote('');
//     setHidePriceOnChallan(false);
//     setShowChallanForm(true);
//   };

//   const updateChallanItem = (iuid, field, value) => {
//     setChallanItems(prev => prev.map(it => {
//       if (it.uid !== iuid) return it;
//       const u = { ...it, [field]: value };
//       if (field === 'sendingPcs') { const pcs = parseFloat(value || 0); u.sendingQty = it.isWood ? calculateByUnit({ ...u, quantity: pcs }).calculatedQty : pcs; }
//       return u;
//     }));
//   };

//   const handleSubmitChallan = async () => {
//     const valid = challanItems.filter(i => parseFloat(i.sendingPcs) > 0);
//     if (!valid.length) { setError('Kam se kam ek item ki qty daalo'); return; }
//     setSaving(true); setError(null);
//     try {
//       const challanNo = genChallanNo();
//       const challanTotal = valid.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0);
//       const payload = {
//         challan: { challanNo, orderNo: selectedOrder.orderNo, customerName: selectedOrder.customerName, challanDate, deliveryNote, challanTotal, status: 'Delivered', hidePrice: hidePriceOnChallan },
//         items: valid.map(it => ({ product: it.product, unit: it.unit, orderedQty: it.orderedQty, pieces: parseFloat(it.sendingPcs), sentQty: parseFloat(it.sendingPcs), calculatedQty: it.sendingQty, rate: it.rate, amount: it.sendingQty * it.rate, size: it.size, lengthDisplay: it.lengthDisplay }))
//       };
//       const r = await apiPost('/api/billing-backend/challans', payload);
//       if (!r.success) { setError(r.error || 'Challan fail'); return; }
//       const allC = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//       const tsm = {};
//       [...allC, { items: valid.map(it => ({ product: it.product, calculatedQty: it.sendingQty })) }].forEach(ch => ch.items?.forEach(it => { tsm[it.product] = (tsm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//       const done = (selectedOrder.items || []).every(oi => (tsm[oi.product] || 0) >= parseFloat(oi.calculatedQty || oi.quantity || 0));
//       if (done) await apiPatch('/api/billing-backend/orders', { orderNo: selectedOrder.orderNo, status: 'Completed' });
//       const html = getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan);
//       setLastChallanHTML(html);
//       setLastChallanNo(challanNo);
//       await fetchData();
//       setShowChallanForm(false);
//       setShowChallanSuccess(true);
//     } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
//   };

//   const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);
//   const getDeliveryProgress = order => {
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//     const items = order.items || []; if (!items.length) return 0;
//     const tot = items.reduce((s, it) => s + parseFloat(it.calculatedQty || it.quantity || 0), 0);
//     const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.calculatedQty || it.quantity || 0), sm[it.product] || 0), 0);
//     return tot > 0 ? Math.round((sent / tot) * 100) : 0;
//   };

//   const markBilled = async orderNo => { await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Billed' }); await fetchData(); setShowBillPreview(false); };

//   // ✅ Latest first + filters/search for ORDERS
//   const filteredOrders = sortLatestFirst(
//     orders.filter(o => {
//       const q = searchQuery.toLowerCase();
//       const ms = !q
//         || o.customerName?.toLowerCase().includes(q)
//         || o.orderNo?.toLowerCase().includes(q)
//         || o.customerPhone?.toLowerCase().includes(q)
//         || o.poNumber?.toLowerCase().includes(q)
//         || o.gstCustomerName?.toLowerCase().includes(q);
//       const mst = filterStatus === 'All' || o.status === filterStatus;
//       return ms && mst;
//     }),
//     'orderDate'
//   );

//   // ✅ Latest first + search for CHALLANS
//   const filteredChallans = sortLatestFirst(
//     challans.filter(ch => {
//       const q = challanSearchQuery.toLowerCase();
//       if (!q) return true;
//       return ch.challanNo?.toLowerCase().includes(q)
//         || ch.orderNo?.toLowerCase().includes(q)
//         || ch.customerName?.toLowerCase().includes(q)
//         || ch.deliveryNote?.toLowerCase().includes(q);
//     }),
//     'challanDate'
//   );

//   const STATUS = {
//     Active: { bg: '#FBF6F0', color: '#7B1E1E', dot: '#9a2828', border: '#E8DCC8' },
//     Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e', border: '#bbf7d0' },
//     Billed: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6', border: '#bfdbfe' }
//   };

//   if (loading) return (<div className="flex items-center justify-center min-h-96 flex-col gap-3"><Loader2 className="w-7 h-7 animate-spin" style={{ color: THEME.maroon }} /><p className="text-sm" style={{ color: THEME.textMuted }}>Loading...</p></div>);

//   return (
//     <div style={{ background: THEME.cream, minHeight: '100vh', padding: '20px' }}>
//       <style jsx global>{`
// @keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
// .kt-in{animation:kt-in .28s ease-out}

// .kt-input{width:100%;padding:9px 13px;border:1px solid ${THEME.borderSoft};border-radius:10px;font-size:13px;background:#fff;color:${THEME.textDark};outline:none;transition:border-color .14s,box-shadow .14s}
// .kt-input:focus{border-color:${THEME.maroon};box-shadow:0 0 0 3px rgba(123,30,30,.12)}
// .kt-input[readonly]{background:${THEME.cream};color:${THEME.textMuted};cursor:not-allowed}
// .kt-input-sm{padding:7px 10px;font-size:12px}

// .btn-maroon{padding:9px 20px;background:linear-gradient(135deg,${THEME.maroonDark},${THEME.maroon});color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 8px rgba(123,30,30,.28)}
// .btn-maroon:hover{background:linear-gradient(135deg,#3d0d0d,${THEME.maroonDark});transform:translateY(-1px);box-shadow:0 4px 12px rgba(123,30,30,.35)}
// .btn-maroon:disabled{opacity:.5;cursor:not-allowed;transform:none}

// .btn-white{padding:9px 18px;background:#fff;border:1px solid ${THEME.borderSoft};border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:${THEME.textDark};display:inline-flex;align-items:center;gap:6px;transition:all .14s}
// .btn-white:hover{background:${THEME.creamLight};border-color:${THEME.maroon};color:${THEME.maroon}}

// .btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}

// .btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
// .btn-blue:hover{opacity:.9}

// .btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}

// .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:${THEME.textMuted}}
// .icon-btn:hover{background:${THEME.creamDark};color:${THEME.maroon}}

// .kt-card{background:#fff;border:1px solid ${THEME.borderSoft};border-radius:16px;box-shadow:0 1px 5px rgba(123,30,30,.05)}
// .kt-inset{background:#fff;border:1px solid ${THEME.borderSoft};border-radius:12px;overflow:hidden}

// .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:${THEME.textMuted}}
// .kt-tab.active{background:linear-gradient(135deg,${THEME.maroon},${THEME.maroonLight});color:#fff;box-shadow:0 2px 6px rgba(123,30,30,.28)}
// .kt-tab:hover:not(.active){background:${THEME.creamDark};color:${THEME.maroon}}

// .kt-tbl{width:100%;border-collapse:collapse}
// .kt-tbl thead tr{background:linear-gradient(135deg,${THEME.maroonDark},${THEME.maroon})}
// .kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}
// .kt-tbl thead th.r{text-align:right}
// .kt-tbl thead th.c{text-align:center}
// .kt-tbl tbody tr{border-bottom:1px solid ${THEME.borderSoft};transition:background .1s}
// .kt-tbl tbody tr:nth-child(even){background:${THEME.accent}}
// .kt-tbl tbody tr:hover{background:${THEME.creamLight}}
// .kt-tbl tbody td{padding:10px;font-size:13px;color:${THEME.textDark};vertical-align:top}
// .kt-tbl tbody td.r{text-align:right}
// .kt-tbl tbody td.c{text-align:center}

// .kt-overlay{position:fixed;inset:0;background:rgba(42,16,16,.5);z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}
// .kt-modal{background:#fff;border-radius:22px;border:1px solid ${THEME.borderSoft};width:100%;max-width:1300px;margin:auto;box-shadow:0 24px 64px rgba(42,16,16,.22);overflow:visible}
// .kt-mhead{padding:20px 26px;border-bottom:1px solid ${THEME.borderSoft};display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,${THEME.cream} 0%,#fff 100%);border-radius:22px 22px 0 0}
// .kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto;overflow-x:visible}
// .kt-mfoot{padding:16px 26px;border-top:1px solid ${THEME.borderSoft};display:flex;justify-content:flex-end;gap:8px;background:${THEME.accent};border-radius:0 0 22px 22px}

// .prog-track{height:6px;background:${THEME.creamDark};border-radius:4px;overflow:hidden}
// .prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,${THEME.maroonDark},${THEME.maroonLight});transition:width .5s ease}
// .prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}

// .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}

// .sec-label{font-size:11px;font-weight:600;color:${THEME.textMuted};text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}

// .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}
// .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}

// .total-box{border-radius:12px;padding:14px 18px;border:1px solid}
// .length-group{display:flex;gap:4px;align-items:center}
// .length-input{width:50px!important;text-align:center}

// .material-group{border:2px solid ${THEME.borderSoft};border-radius:16px;margin-bottom:16px;overflow:visible;transition:border-color .2s;background:#fff}
// .material-group:hover{border-color:${THEME.maroonLight}}
// .material-group-header{background:linear-gradient(135deg,${THEME.cream},${THEME.creamDark});padding:14px 18px;border-bottom:1px solid ${THEME.borderSoft};display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
// .material-group-label{display:flex;align-items:center;gap:10px}
// .material-group-num{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,${THEME.maroonDark},${THEME.maroon});color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
// .material-group-title{font-size:14px;font-weight:700;color:${THEME.maroon}}
// .material-group-subtitle{font-size:11px;color:${THEME.textMuted};margin-top:2px}
// .material-group-filters{display:flex;gap:8px;flex:1;flex-wrap:wrap;min-width:300px}
// .material-group-body{padding:18px 20px;overflow:visible}
// .material-group-footer{padding:10px 18px;border-top:1px dashed ${THEME.borderSoft};background:${THEME.accent};display:flex;justify-content:space-between;align-items:center}

// .item-subrow{background:#fff;border:1px solid ${THEME.borderSoft};border-radius:10px;padding:14px;margin-bottom:10px;transition:all .2s;position:relative;overflow:visible}
// .item-subrow:hover{border-color:${THEME.maroonLight};background:${THEME.creamLight}}
// .item-subrow:last-child{margin-bottom:0}
// .item-subrow-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
// .item-subrow-num{width:24px;height:24px;border-radius:6px;background:${THEME.cream};color:${THEME.maroon};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;border:1px solid ${THEME.borderSoft}}

// .unit-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}
// .wood-badge{background:#dcfce7;color:#166534}
// .hardware-badge{background:#e0e7ff;color:#3730a3}

// .calc-display{background:${THEME.cream};border:1px solid ${THEME.borderSoft};border-radius:8px;padding:10px;margin-top:10px}

// .btn-add-inner{padding:7px 14px;background:#fff;border:1px dashed ${THEME.maroon};border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;color:${THEME.maroon};display:inline-flex;align-items:center;gap:5px;transition:all .15s}
// .btn-add-inner:hover{background:${THEME.cream};border-style:solid}

// .btn-add-outer{padding:10px 20px;background:#fff;border:2px dashed ${THEME.borderSoft};border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:${THEME.textMuted};display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s;width:100%}
// .btn-add-outer:hover{background:${THEME.creamLight};border-color:${THEME.maroon};color:${THEME.maroon}}

// .searchable-select{position:relative;width:100%}
// .ss-input-wrap{position:relative;display:flex;align-items:center}
// .ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid ${THEME.borderSoft};border-radius:8px;font-size:13px;background:#fff;color:${THEME.textDark};outline:none;transition:all .15s}
// .ss-input:focus{border-color:${THEME.maroon};box-shadow:0 0 0 3px rgba(123,30,30,.12)}
// .ss-input.with-icon{padding-left:32px}
// .ss-search-icon{position:absolute;left:10px;width:14px;height:14px;color:${THEME.textMuted};pointer-events:none}
// .ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}
// .ss-clear{width:18px;height:18px;border-radius:50%;background:${THEME.creamDark};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${THEME.textMuted}}
// .ss-clear:hover{background:${THEME.maroon};color:#fff}
// .ss-arrow{width:14px;height:14px;color:${THEME.textMuted};transition:transform .2s}
// .ss-arrow.open{transform:rotate(180deg)}
// .ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid ${THEME.borderSoft};border-radius:10px;box-shadow:0 10px 40px rgba(42,16,16,.18);z-index:9999;max-height:320px;overflow:hidden;animation:ss-drop .15s ease}
// @keyframes ss-drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
// .ss-dropdown-header{padding:8px 12px;background:${THEME.cream};border-bottom:1px solid ${THEME.borderSoft};font-size:11px;color:${THEME.maroon};font-weight:600}
// .ss-options{max-height:260px;overflow-y:auto}
// .ss-option{padding:10px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid ${THEME.accent}}
// .ss-option:last-child{border-bottom:none}
// .ss-option:hover,.ss-option.highlighted{background:${THEME.creamLight}}
// .ss-option.selected{background:${THEME.cream}}
// .ss-no-results{padding:20px;text-align:center;color:${THEME.textMuted};font-size:13px}
// .ss-more{padding:10px 12px;text-align:center;color:${THEME.maroon};font-size:12px;font-weight:500;background:${THEME.creamLight}}
// .product-dropdown{max-height:400px}
// .product-dropdown .ss-options{max-height:340px}
// .product-option{padding:10px 12px}
// .product-option-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
// .product-name{font-weight:600;color:${THEME.textDark};font-size:13px}
// .product-sku{font-size:11px;color:${THEME.maroon};font-family:monospace;background:${THEME.cream};padding:2px 6px;border-radius:4px}
// .product-option-sub{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
// .product-cat{font-size:11px;color:${THEME.textMuted}}
// .product-sep{color:${THEME.borderSoft};font-size:10px}
// .product-unit{font-size:10px;color:#fff;background:${THEME.maroon};padding:2px 6px;border-radius:4px;margin-left:auto}

// .edit-badge{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600}
// .success-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#dcfce7,#bbf7d0);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
//       `}</style>

//       {error && <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3"><AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /><span className="text-sm text-red-700 flex-1">{error}</span><button className="icon-btn" onClick={() => setError(null)}><X className="w-3 h-3" /></button></div>}

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold" style={{ color: THEME.maroon }}>Order Management</h2>
//           <p className="text-sm mt-0.5" style={{ color: THEME.textMuted }}>{SHOP_INFO.name}</p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <button className="icon-btn" onClick={fetchData}><RefreshCw className="w-4 h-4" /></button>
//           <button className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
//           <button className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`} onClick={() => setActiveTab('challans')}>Challans</button>
//           <button className="btn-maroon" onClick={() => { resetOrderForm(); setShowOrderForm(true); }}><Plus className="w-4 h-4" />New Order</button>
//         </div>
//       </div>

//       {/* WORKFLOW BANNER */}
//       <div className="kt-card mb-6 overflow-hidden">
//         <div style={{ background: `linear-gradient(135deg,${THEME.maroonDark},${THEME.maroon})`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           {[
//             { n: '1', label: 'Order', desc: 'Customer requirement' },
//             { n: '2', label: 'Challan', desc: 'Partial delivery' },
//             { n: '3', label: 'Bill', desc: 'Final invoice' }
//           ].map((s, i, a) => (
//             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <div className="step-dot" style={{ background: '#fff', color: THEME.maroon }}>{s.n}</div>
//                 <div>
//                   <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: 0 }}>{s.label}</p>
//                   <p style={{ fontSize: 11, color: 'rgba(255,255,255,.75)', margin: 0 }}>{s.desc}</p>
//                 </div>
//               </div>
//               {i < a.length - 1 && <ArrowRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,.5)', margin: '0 6px' }} />}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ORDERS TAB */}
//       {activeTab === 'orders' && (
//         <div className="space-y-5 kt-in">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[
//               { label: 'Total', value: orders.length, color: THEME.maroon },
//               { label: 'Active', value: orders.filter(o => o.status === 'Active').length, color: THEME.maroon },
//               { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: '#166534' },
//               { label: 'Products', value: products.length, color: THEME.maroonDark }
//             ].map((c, i) => (
//               <div key={i} className="kt-card p-4">
//                 <p className="text-xs font-medium mb-1" style={{ color: THEME.textMuted }}>{c.label}</p>
//                 <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             <div className="relative flex-1" style={{ minWidth: 200 }}>
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: THEME.textMuted }} />
//               <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search by order no, customer, phone, PO..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//               {searchQuery && <button className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn" style={{ width: 22, height: 22 }} onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>}
//             </div>
//             <div className="flex gap-1.5">{['All', 'Active', 'Completed', 'Billed'].map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`kt-tab ${filterStatus === s ? 'active' : ''}`} style={{ padding: '8px 14px', fontSize: 12 }}>{s}</button>))}</div>
//           </div>
//           <div className="space-y-3">
//             {filteredOrders.length === 0 && (
//               <div className="kt-card p-14 text-center">
//                 <div style={{ width: 56, height: 56, borderRadius: 16, background: THEME.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
//                   <Receipt style={{ width: 28, height: 28, color: THEME.maroon }} />
//                 </div>
//                 <p className="text-sm" style={{ color: THEME.textMuted }}>{searchQuery ? 'Koi match nahi mila' : 'Koi order nahi'}</p>
//               </div>
//             )}
//             {filteredOrders.map((order, i) => {
//               const progress = getDeliveryProgress(order);
//               const st = STATUS[order.status] || STATUS.Active;
//               const oc = getOrderChallans(order.orderNo);
//               return (
//                 <div key={i} className="kt-card p-5 kt-in">
//                   <div className="flex items-start justify-between gap-4 flex-wrap">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         <span className="font-mono text-sm font-bold" style={{ color: THEME.maroon }}>{order.orderNo}</span>
//                         <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}><span className="status-dot" style={{ background: st.dot }} />{order.status}</span>
//                         {order.gstRate > 0 && <span className="status-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>GST {order.gstRate}%</span>}
//                         {order.poNumber && <span className="edit-badge">PO: {order.poNumber}</span>}
//                         {order.gstCustomerName && <span className="status-pill" style={{ background: '#f3e8ff', color: '#6b21a8' }}>GST: {order.gstCustomerName}</span>}
//                       </div>
//                       <p className="font-bold text-base mb-1 truncate" style={{ color: THEME.textDark }}>{order.customerName}</p>
//                       <p className="text-xs" style={{ color: THEME.textMuted }}>
//                         {order.customerPhone && `${order.customerPhone} · `}
//                         {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}&nbsp;·&nbsp;{(order.items || []).length} items&nbsp;·&nbsp;
//                         <span className="font-semibold" style={{ color: THEME.maroon }}>₹{(parseFloat(order.total) || 0).toLocaleString('en-IN')}</span>
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end gap-3 shrink-0">
//                       <div style={{ width: 168 }}>
//                         <div className="flex justify-between mb-1.5">
//                           <span className="text-xs" style={{ color: THEME.textMuted }}>Delivery</span>
//                           <span className="text-xs font-bold" style={{ color: progress === 100 ? '#16a34a' : THEME.maroon }}>{progress}%</span>
//                         </div>
//                         <div className="prog-track"><div className={`prog-fill ${progress === 100 ? 'done' : ''}`} style={{ width: `${progress}%` }} /></div>
//                         <p className="text-xs mt-1 text-right" style={{ color: THEME.textMuted }}>{oc.length} challan{oc.length !== 1 ? 's' : ''}</p>
//                       </div>
//                       <div className="flex gap-2 flex-wrap justify-end">
//                         {order.status !== 'Billed' && <button className="btn-blue" onClick={() => openEditOrder(order)}><Edit2 className="w-3.5 h-3.5" />Edit</button>}
//                         {order.status !== 'Billed' && <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => openChallanForm(order)}><TruckIcon className="w-3.5 h-3.5" />Challan</button>}
//                         {(order.status === 'Completed' || order.status === 'Billed') && <button className="btn-maroon" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { setSelectedOrder(order); setShowBillPreview(true); }}><Receipt className="w-3.5 h-3.5" />Final Bill</button>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* CHALLANS TAB */}
//       {activeTab === 'challans' && (
//         <div className="space-y-3 kt-in">
//           {/* ✅ Search bar for challans */}
//           <div className="relative" style={{ maxWidth: 500 }}>
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: THEME.textMuted }} />
//             <input
//               className="kt-input"
//               style={{ paddingLeft: 36 }}
//               placeholder="Search by challan no, order no, customer..."
//               value={challanSearchQuery}
//               onChange={e => setChallanSearchQuery(e.target.value)}
//             />
//             {challanSearchQuery && <button className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn" style={{ width: 22, height: 22 }} onClick={() => setChallanSearchQuery('')}><X className="w-3 h-3" /></button>}
//           </div>
//           <p className="text-xs" style={{ color: THEME.textMuted }}>{filteredChallans.length} challan{filteredChallans.length !== 1 ? 's' : ''} {challanSearchQuery && `matching "${challanSearchQuery}"`}</p>

//           {filteredChallans.length === 0 && (
//             <div className="kt-card p-14 text-center">
//               <div style={{ width: 56, height: 56, borderRadius: 16, background: THEME.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
//                 <TruckIcon style={{ width: 28, height: 28, color: THEME.maroon }} />
//               </div>
//               <p className="text-sm" style={{ color: THEME.textMuted }}>{challanSearchQuery ? 'Koi match nahi mila' : 'Koi challan nahi'}</p>
//             </div>
//           )}
//           {filteredChallans.map((ch, i) => (
//             <div key={i} className="kt-card p-4 kt-in">
//               <div className="flex items-center justify-between flex-wrap gap-3">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//                     <span className="font-mono text-sm font-bold" style={{ color: THEME.maroon }}>{ch.challanNo}</span>
//                     <span className="text-xs" style={{ color: THEME.textMuted }}>→ <strong style={{ color: THEME.textDark }}>{ch.orderNo}</strong></span>
//                     <span className="status-pill" style={{ background: '#dcfce7', color: '#166534' }}><span className="status-dot" style={{ background: '#22c55e' }} />Delivered</span>
//                     {ch.hidePrice && <span className="status-pill" style={{ background: THEME.cream, color: THEME.maroon, borderColor: THEME.borderSoft }}><EyeOff className="w-3 h-3" />Hidden</span>}
//                   </div>
//                   <p className="font-semibold" style={{ color: THEME.textDark }}>{ch.customerName}</p>
//                   <p className="text-xs mt-0.5" style={{ color: THEME.textMuted }}>
//                     {new Date(ch.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}&nbsp;·&nbsp;{(ch.items || []).length} items
//                     {!ch.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold" style={{ color: THEME.maroon }}>₹{(parseFloat(ch.challanTotal) || 0).toLocaleString('en-IN')}</span></>}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { const order = orders.find(o => o.orderNo === ch.orderNo); if (order) openPDFView(getChallanPrintHTML(order, ch, ch.hidePrice)); }}><Eye className="w-3.5 h-3.5" />View</button>
//                   <button className="btn-maroon" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { const order = orders.find(o => o.orderNo === ch.orderNo); if (order) openPDFPrint(getChallanPrintHTML(order, ch, ch.hidePrice)); }}><Printer className="w-3.5 h-3.5" />Print</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ORDER FORM MODAL */}
//       {showOrderForm && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in">
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: isEditMode ? '#dbeafe' : THEME.cream, color: isEditMode ? '#1e40af' : THEME.maroon, border: `2px solid ${isEditMode ? '#bfdbfe' : THEME.borderSoft}` }}>{isEditMode ? <Edit2 className="w-3.5 h-3.5" /> : '1'}</div>
//                 <div><h3 className="font-bold text-lg m-0" style={{ color: THEME.textDark }}>{isEditMode ? `Edit — ${editingOrder?.orderNo}` : 'New Order'}</h3><p className="text-xs m-0" style={{ color: THEME.textMuted }}>{isEditMode ? 'Update' : 'Group items by material'}</p></div>
//               </div>
//               <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X className="w-5 h-5" /></button>
//             </div>
//             <div className="kt-mbody space-y-6">
//               <div>
//                 <p className="sec-label">Customer Details</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                   <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Customer Name *</label><input className="kt-input" value={orderForm.customerName} onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Phone</label><input className="kt-input" value={orderForm.customerPhone} onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Date</label><input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>GST</label><select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm(p => ({ ...p, gstRate: parseFloat(e.target.value) }))}>{GST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
//                   <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>PO Number</label><input className="kt-input" value={orderForm.poNumber} onChange={e => setOrderForm(p => ({ ...p, poNumber: e.target.value }))} /></div>
//                   <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>GST Customer</label><input className="kt-input" value={orderForm.gstCustomerName} onChange={e => setOrderForm(p => ({ ...p, gstCustomerName: e.target.value }))} /></div>
//                   <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Address</label><textarea className="kt-input" rows={2} style={{ resize: 'none' }} value={orderForm.customerAddress} onChange={e => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))} /></div>
//                 </div>
//               </div>
//               <div>
//                 <p className="sec-label">Items</p>
//                 {orderGroups.map((group, gIdx) => {
//                   const gp = getFilteredProductsForGroup(group);
//                   const gc = getCategoriesFor(group.filterMaterialType);
//                   const gsc = getSubCategoriesFor(group.filterMaterialType, group.filterCategory);
//                   const gt = group.items.reduce((s, i) => s + (i.amount || 0), 0);
//                   return (
//                     <div key={group.groupId} className="material-group kt-in">
//                       <div className="material-group-header">
//                         <div className="material-group-label">
//                           <div className="material-group-num">{gIdx + 1}</div>
//                           <div><div className="material-group-title">{group.filterMaterialType || 'Select Material'}{group.filterCategory && ` › ${group.filterCategory}`}</div><div className="material-group-subtitle">{group.items.length} items · {gp.length} available</div></div>
//                         </div>
//                         {orderGroups.length > 1 && <button className="icon-btn" onClick={() => removeGroup(group.groupId)}><Trash2 className="w-4 h-4 text-red-400" /></button>}
//                       </div>
//                       <div style={{ padding: '12px 18px', background: THEME.accent, borderBottom: `1px solid ${THEME.borderSoft}` }}>
//                         <div className="material-group-filters">
//                           <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium block mb-1" style={{ color: THEME.textMuted }}>Material</label><SearchableSelect options={getAllMaterialTypes()} value={group.filterMaterialType} onChange={v => updateGroupFilter(group.groupId, 'filterMaterialType', v)} placeholder="🔍" /></div>
//                           <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium block mb-1" style={{ color: THEME.textMuted }}>Category</label><SearchableSelect options={gc} value={group.filterCategory} onChange={v => updateGroupFilter(group.groupId, 'filterCategory', v)} placeholder="🔍" /></div>
//                           <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium block mb-1" style={{ color: THEME.textMuted }}>Sub Cat</label><SearchableSelect options={gsc} value={group.filterSubCategory} onChange={v => updateGroupFilter(group.groupId, 'filterSubCategory', v)} placeholder="🔍" /></div>
//                         </div>
//                       </div>
//                       <div className="material-group-body">
//                         {group.items.map((item, itemIdx) => (
//                           <div key={item.uid} className="item-subrow">
//                             <div className="item-subrow-header">
//                               <div className="flex items-center gap-3">
//                                 <div className="item-subrow-num">{itemIdx + 1}</div>
//                                 {item.isWood ? <span className="unit-badge wood-badge">🪵 Wood</span> : item.product ? <span className="unit-badge hardware-badge">🔧</span> : null}
//                                 {item.product && <span className="text-xs font-semibold" style={{ color: THEME.textDark }}>{item.product}</span>}
//                               </div>
//                               <button className="icon-btn" onClick={() => removeItemFromGroup(group.groupId, item.uid)} disabled={group.items.length === 1}><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//                               <div className="md:col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Product *</label><ProductSearchableSelect products={gp} value={item.skuCode} onChange={v => updateGroupItem(group.groupId, item.uid, 'skuCode', v)} /></div>
//                               <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Unit</label>{item.isWood ? <select className="kt-input kt-input-sm" value={item.unit} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>{WOOD_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}</select> : <input className="kt-input kt-input-sm" value={item.unit || 'Pcs'} readOnly />}</div>
//                               {item.isWood && <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Size</label><input className="kt-input kt-input-sm" value={item.size || '—'} readOnly /></div>}
//                               {item.isWood && <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Length</label><div className="length-group"><input type="number" min="0" className="kt-input kt-input-sm length-input" value={item.lengthFeet} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthFeet', e.target.value)} /><span className="text-xs" style={{ color: THEME.textMuted }}>ft</span><input type="number" min="0" max="11" className="kt-input kt-input-sm length-input" value={item.lengthInches} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthInches', e.target.value)} /><span className="text-xs" style={{ color: THEME.textMuted }}>in</span></div></div>}
//                               <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>{item.isWood ? 'Pcs' : 'Qty'}</label><input type="number" min="1" className="kt-input kt-input-sm" value={item.quantity} onChange={e => updateGroupItem(group.groupId, item.uid, 'quantity', e.target.value)} /></div>
//                               <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Rate</label><input type="number" min="0" className="kt-input kt-input-sm" value={item.rate} onChange={e => updateGroupItem(group.groupId, item.uid, 'rate', e.target.value)} /></div>
//                             </div>
//                             {item.product && <div className="calc-display"><div className="flex justify-between items-center flex-wrap gap-2"><div className="text-xs" style={{ color: THEME.maroon }}>{item.isWood ? <><strong>{item.unit}:</strong> {item.calculatedQty.toFixed(3)} {item.unit}</> : <><strong>Qty:</strong> {item.quantity || 0}</>}</div><div className="text-base font-bold" style={{ color: THEME.maroon }}>₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div></div></div>}
//                           </div>
//                         ))}
//                       </div>
//                       <div className="material-group-footer">
//                         <button className="btn-add-inner" onClick={() => addItemToGroup(group.groupId)}><Plus className="w-3.5 h-3.5" />Add Item</button>
//                         <div className="text-sm font-bold" style={{ color: THEME.maroon }}>₹{gt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <button className="btn-add-outer" onClick={addNewGroup}><Plus className="w-4 h-4" />Add New Group</button>
//               </div>
//               <div className="flex justify-end">
//                 <div className="total-box" style={{ width: 300, background: THEME.cream, borderColor: THEME.borderSoft }}>
//                   <div className="flex justify-between text-sm mb-2" style={{ color: THEME.textDark }}><span>Subtotal</span><span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                   {orderForm.gstRate > 0 && <div className="flex justify-between text-sm mb-2" style={{ color: THEME.textDark }}><span>GST ({orderForm.gstRate}%)</span><span className="font-semibold">₹{orderTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
//                   <div className="flex justify-between font-bold text-lg pt-2 mt-2" style={{ color: THEME.maroon, borderTop: `1px solid ${THEME.borderSoft}` }}><span>Total</span><span>₹{orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                 </div>
//               </div>
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
//               <button className="btn-maroon" disabled={!orderForm.customerName || orderSubtotal === 0 || saving} onClick={handleSubmitOrder}>{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : isEditMode ? <><CheckCircle className="w-4 h-4" />Update</> : <><CheckCircle className="w-4 h-4" />Save</>}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHALLAN FORM */}
//       {showChallanForm && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 950 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: THEME.cream, color: THEME.maroon, border: `2px solid ${THEME.borderSoft}` }}>2</div>
//                 <div><h3 className="font-bold text-base m-0" style={{ color: THEME.textDark }}>Delivery Challan</h3><p className="text-xs m-0" style={{ color: THEME.textMuted }}>{selectedOrder.orderNo} — {selectedOrder.customerName}</p></div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Date</label><input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} /></div>
//                 <div><label className="text-xs font-medium block mb-1.5" style={{ color: THEME.textMuted }}>Note</label><input className="kt-input" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} /></div>
//                 <div className="flex items-center gap-3 pt-5"><input type="checkbox" id="hp" checked={hidePriceOnChallan} onChange={e => setHidePriceOnChallan(e.target.checked)} style={{ width: 18, height: 18, accentColor: THEME.maroon }} /><label htmlFor="hp" className="text-sm cursor-pointer flex items-center gap-2" style={{ color: THEME.textDark }}><EyeOff className="w-4 h-4" style={{ color: THEME.maroon }} />Hide Price</label></div>
//               </div>
//               {(selectedOrder.poNumber || selectedOrder.gstCustomerName) && <div className="flex gap-3 flex-wrap">{selectedOrder.poNumber && <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}><strong>PO:</strong> {selectedOrder.poNumber}</div>}{selectedOrder.gstCustomerName && <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' }}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}</div>}
//               <div>
//                 <p className="sec-label">Items</p>
//                 <div className="kt-inset">
//                   <div className="overflow-x-auto">
//                     <table className="kt-tbl">
//                       <thead><tr><th>Item Description</th><th className="c" style={{ width: 55 }}>Unit</th><th className="r" style={{ width: 80 }}>Ordered</th><th className="r" style={{ width: 80 }}>Sent</th><th className="r" style={{ width: 80 }}>Left</th><th className="r" style={{ width: 90 }}>Sending</th><th className="r" style={{ width: 90 }}>Calc Qty</th></tr></thead>
//                       <tbody>
//                         {challanItems.map(it => {
//                           const rem = it.orderedQty - it.alreadySent;
//                           return (
//                             <tr key={it.uid}>
//                               <td className="font-medium">{it.product}{it.isWood && <><span className="unit-badge wood-badge ml-2">🪵</span>{(it.size || it.lengthDisplay) && <div className="text-xs mt-1" style={{ color: THEME.textMuted }}>{[it.size, it.lengthDisplay].filter(Boolean).join(' · ')}</div>}</>}</td>
//                               <td className="c text-xs" style={{ color: THEME.textMuted }}>{it.unit}</td>
//                               <td className="r" style={{ color: THEME.textDark }}>{it.orderedQty.toFixed(3)}</td>
//                               <td className="r font-semibold" style={{ color: THEME.maroon }}>{it.alreadySent ? it.alreadySent.toFixed(3) : '—'}</td>
//                               <td className="r font-bold" style={{ color: rem <= 0.001 ? '#16a34a' : THEME.textDark }}>{rem <= 0.001 ? '✓' : rem.toFixed(3)}</td>
//                               <td><input type="number" min="0" className="kt-input" style={{ padding: '8px', fontSize: 13, textAlign: 'right', background: rem <= 0.001 ? THEME.cream : undefined }} value={it.sendingPcs} disabled={rem <= 0.001} onChange={e => updateChallanItem(it.uid, 'sendingPcs', e.target.value)} /></td>
//                               <td className="r font-bold" style={{ color: THEME.maroon }}>{it.sendingQty ? it.sendingQty.toFixed(3) : '—'}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               {!hidePriceOnChallan && <div className="flex justify-end"><div className="total-box" style={{ minWidth: 240, background: THEME.cream, borderColor: THEME.borderSoft }}><div className="flex justify-between font-bold text-base" style={{ color: THEME.maroon }}><span>Total</span><span>₹{challanItems.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div></div></div>}
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
//               <button className="btn-maroon" disabled={saving} onClick={handleSubmitChallan}>{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Save Challan</>}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHALLAN SUCCESS MODAL */}
//       {showChallanSuccess && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 480 }}>
//             <div className="kt-mbody" style={{ textAlign: 'center', padding: '40px 30px' }}>
//               <div className="success-icon"><CheckCircle style={{ width: 32, height: 32, color: '#16a34a' }} /></div>
//               <h3 style={{ fontSize: 20, fontWeight: 700, color: THEME.textDark, marginBottom: 6 }}>Challan Created!</h3>
//               <p style={{ fontSize: 14, color: THEME.maroon, marginBottom: 6, fontWeight: 600 }}>{lastChallanNo}</p>
//               <p style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 28 }}>Ab aap view, print ya save kar sakte hain</p>
//               <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
//                 <button className="btn-teal" onClick={() => { openPDFView(lastChallanHTML); }}><Eye className="w-4 h-4" />View PDF</button>
//                 <button className="btn-maroon" onClick={() => { openPDFPrint(lastChallanHTML); }}><Printer className="w-4 h-4" />Print</button>
//                 <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => { const win = window.open('', '_blank'); const cleanHTML = lastChallanHTML.replace(/<div class="action-bar">[\s\S]*?<\/div>/, ''); win.document.write(cleanHTML); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); }}><Download className="w-4 h-4" />Save PDF</button>
//               </div>
//             </div>
//             <div className="kt-mfoot" style={{ justifyContent: 'center' }}>
//               <button className="btn-white" onClick={() => setShowChallanSuccess(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FINAL BILL */}
//       {showBillPreview && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 800 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: '#dcfce7', color: '#166534' }}>3</div>
//                 <div><h3 className="font-bold text-base m-0" style={{ color: THEME.textDark }}>Final Invoice</h3><p className="text-xs m-0" style={{ color: THEME.textMuted }}>{selectedOrder.orderNo}</p></div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowBillPreview(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody">
//               {(() => {
//                 const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//                 const m = {};
//                 oc.forEach(ch => ch.items?.forEach(it => { const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || ''); if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' }; m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0); m[key].totalAmount += parseFloat(it.amount || 0); }));
//                 const li = Object.values(m);
//                 const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//                 const gstRate = selectedOrder.gstRate || 0;
//                 const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
//                 const total = sub + tax;
//                 return (
//                   <div className="space-y-4">
//                     <div className="flex gap-3 flex-wrap">
//                       <div className="text-xs px-4 py-2.5 rounded-xl flex-1" style={{ background: THEME.cream, color: THEME.maroon, border: `1px solid ${THEME.borderSoft}` }}><strong>Challans: </strong>{oc.length ? oc.map(c => c.challanNo).join(', ') : 'None'}</div>
//                       {selectedOrder.poNumber && <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}><strong>PO:</strong> {selectedOrder.poNumber}</div>}
//                       {selectedOrder.gstCustomerName && <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' }}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}
//                     </div>
//                     <div className="kt-inset">
//                       <table className="kt-tbl">
//                         <thead><tr><th style={{ width: 30 }}>#</th><th>Item Description</th><th className="r" style={{ width: 80 }}>Qty</th><th className="r" style={{ width: 80 }}>Rate</th><th className="r" style={{ width: 100 }}>Amount</th></tr></thead>
//                         <tbody>
//                           {li.map((it, i) => (
//                             <tr key={i}>
//                               <td className="c text-xs" style={{ color: THEME.textMuted }}>{i + 1}</td>
//                               <td className="font-medium">{it.product}{(it.size || it.lengthDisplay) && <div className="text-xs mt-0.5" style={{ color: THEME.textMuted }}>{[it.size, it.lengthDisplay].filter(x => x && x !== "0'-0\"").join(' · ')}</div>}</td>
//                               <td className="r font-semibold" style={{ color: THEME.maroon }}>{it.totalQty.toFixed(3)} <span className="text-xs" style={{ color: THEME.textMuted }}>{it.unit}</span></td>
//                               <td className="r" style={{ color: THEME.textMuted }}>₹{parseFloat(it.rate || 0).toLocaleString('en-IN')}</td>
//                               <td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="flex justify-end">
//                       <div className="total-box" style={{ width: 280, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
//                         <div className="flex justify-between text-sm mb-1.5" style={{ color: THEME.textMuted }}><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                         {gstRate > 0 && <div className="flex justify-between text-sm mb-1.5" style={{ color: THEME.textMuted }}><span>GST ({gstRate}%)</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
//                         <div className="flex justify-between font-bold text-base border-t border-green-200 pt-2" style={{ color: '#166534' }}><span>Grand Total</span><span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => setShowBillPreview(false)}>Close</button>
//               <button className="btn-teal" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFView(getBillPrintHTML(selectedOrder, oc)); }}><Eye className="w-4 h-4" />View</button>
//               <button className="btn-maroon" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFPrint(getBillPrintHTML(selectedOrder, oc)); }}><Printer className="w-4 h-4" />Print</button>
//               <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); const html = getBillPrintHTML(selectedOrder, oc).replace(/<div class="action-bar">[\s\S]*?<\/div>/, ''); const win = window.open('', '_blank'); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); }}><Download className="w-4 h-4" />Save PDF</button>
//               {selectedOrder.status === 'Completed' && <button className="btn-green" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFPrint(getBillPrintHTML(selectedOrder, oc)); markBilled(selectedOrder.orderNo); }}><Receipt className="w-4 h-4" />Mark Billed</button>}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Trash2, Printer, Search, CheckCircle,
  AlertTriangle, Loader2, RefreshCw, Download, Eye,
  X, TruckIcon, Receipt, ArrowRight, EyeOff, ChevronDown, Edit2
} from 'lucide-react';

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '9826700196',
  gstin: '23ADCPC2098K1ZQ',
};

const GST_OPTIONS = [
  { value: 0, label: 'No GST' },
  { value: 5, label: 'GST 5%' },
  { value: 12, label: 'GST 12%' },
  { value: 18, label: 'GST 18%' },
];

const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];

// ─────────────────────────────────────────────────────────────────────────────
// LIGHT + DARK THEME PALETTES
// ─────────────────────────────────────────────────────────────────────────────
const LIGHT = {
  maroon: '#7B1E1E',
  maroonDark: '#5a1515',
  maroonLight: '#9a2828',
  cream: '#FBF6F0',
  creamLight: '#FFFBF5',
  creamDark: '#F0E6DA',
  accent: '#FDF8F2',
  textDark: '#2a1010',
  textMuted: '#6b5454',
  borderSoft: '#E8DCC8',
  cardBg: '#ffffff',
  pageBg: '#FBF6F0',
  inputBg: '#ffffff',
  hoverBg: '#F0E6DA',
  modalBg: '#ffffff',
  overlayBg: 'rgba(42,16,16,0.5)',
  shadow: 'rgba(123,30,30,0.05)',
  shadowStrong: 'rgba(123,30,30,0.18)',
  tableEven: '#FDF8F2',
  tableHover: '#FFFBF5',
  successBg: '#dcfce7',
  successColor: '#166534',
  successBorder: '#bbf7d0',
  infoBg: '#dbeafe',
  infoColor: '#1e40af',
  infoBorder: '#bfdbfe',
  errorBg: '#fef2f2',
  errorBorder: '#fecaca',
  errorColor: '#dc2626',
  purpleBg: '#f3e8ff',
  purpleColor: '#6b21a8',
  purpleBorder: '#e9d5ff',
};

const DARK = {
  maroon: '#e8a0a0',
  maroonDark: '#c47070',
  maroonLight: '#f0b8b8',
  cream: '#1a1a2e',
  creamLight: '#222240',
  creamDark: '#2a2a45',
  accent: '#1e1e35',
  textDark: '#f0e8e8',
  textMuted: '#a89999',
  borderSoft: '#3a3a55',
  cardBg: '#1e1e35',
  pageBg: '#0f0f1e',
  inputBg: '#222240',
  hoverBg: '#2a2a45',
  modalBg: '#1e1e35',
  overlayBg: 'rgba(0,0,0,0.65)',
  shadow: 'rgba(0,0,0,0.3)',
  shadowStrong: 'rgba(0,0,0,0.5)',
  tableEven: '#1a1a2e',
  tableHover: '#222240',
  successBg: '#052e16',
  successColor: '#4ade80',
  successBorder: '#166534',
  infoBg: '#172554',
  infoColor: '#93c5fd',
  infoBorder: '#1e40af',
  errorBg: '#450a0a',
  errorBorder: '#7f1d1d',
  errorColor: '#fca5a5',
  purpleBg: '#2e1065',
  purpleColor: '#c4b5fd',
  purpleBorder: '#6b21a8',
};

function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

function parseWoodDimensions(name) {
  if (!name) return null;
  const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
  if (!match) return null;
  let width = parseFloat(match[1]);
  let thickness = match[2];
  if (thickness.includes('½')) thickness = parseFloat(thickness.replace('½', '')) + 0.5 || 0.5;
  else if (thickness.includes('¼')) thickness = parseFloat(thickness.replace('¼', '')) + 0.25 || 0.25;
  else if (thickness.includes('¾')) thickness = parseFloat(thickness.replace('¾', '')) + 0.75 || 0.75;
  else thickness = parseFloat(thickness);
  return { width, thickness };
}

function calculateByUnit(item) {
  const qty = parseFloat(item.quantity || 0);
  const rate = parseFloat(item.rate || 0);
  const width = parseFloat(item.width || 0);
  const thickness = parseFloat(item.thickness || 0);
  const totalLengthFeet = parseFloat(item.lengthFeet || 0) + (parseFloat(item.lengthInches || 0) / 12);
  let calculatedQty = qty;
  if (item.isWood) {
    switch (item.unit) {
      case 'CFT': calculatedQty = (width * thickness * totalLengthFeet * qty) / 144; break;
      case 'RFT': calculatedQty = totalLengthFeet * qty; break;
      case 'SQFT': calculatedQty = (width * totalLengthFeet * qty) / 12; break;
      case 'Per Piece': calculatedQty = qty; break;
      default: calculatedQty = qty;
    }
  }
  return {
    calculatedQty: Math.round(calculatedQty * 1000) / 1000,
    amount: Math.round(calculatedQty * rate * 100) / 100,
  };
}

function rebuildItemForEdit(savedItem) {
  const item = {
    uid: uid(), product: savedItem.product || '', unit: savedItem.unit || '',
    lengthFeet: savedItem.lengthFeet || '', lengthInches: savedItem.lengthInches || '',
    quantity: savedItem.quantity || '', rate: savedItem.rate || '',
    amount: savedItem.amount || 0, calculatedQty: savedItem.calculatedQty || 0,
    skuCode: savedItem.skuCode || '', isWood: savedItem.isWood || false,
    width: parseFloat(savedItem.width || 0), thickness: parseFloat(savedItem.thickness || 0),
    size: savedItem.size || '', materialType: savedItem.materialType || '',
    category: savedItem.category || '', subCategory: savedItem.subCategory || '',
  };
  if (item.isWood && (!item.width || !item.thickness)) {
    const dims = parseWoodDimensions(item.product);
    if (dims) { item.width = dims.width; item.thickness = dims.thickness; if (!item.size) item.size = `${dims.width}×${dims.thickness}"`; }
  }
  const calc = calculateByUnit(item);
  item.calculatedQty = calc.calculatedQty;
  item.amount = calc.amount;
  return item;
}

function numberToWords(num) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (num === 0) return 'Zero';
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:'');
    if (n < 1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+convert(n%100):'');
    if (n < 100000) return convert(Math.floor(n/1000))+' Thousand'+(n%1000?' '+convert(n%1000):'');
    if (n < 10000000) return convert(Math.floor(n/100000))+' Lakh'+(n%100000?' '+convert(n%100000):'');
    return convert(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+convert(n%10000000):'');
  }
  const i=Math.floor(num),d=Math.round((num-i)*100);
  return convert(i)+' Rupees'+(d>0?' and '+convert(d)+' Paise':'')+' Only';
}

function SearchableSelect({ options, value, onChange, placeholder='Search...', disabled=false, T }) {
  const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
  const filtered=options.filter(o=>(typeof o==='string'?o:o.label||o).toLowerCase().includes(search.toLowerCase()));
  const getVal=o=>typeof o==='string'?o:o.value??o.label??o;const getDisp=o=>typeof o==='string'?o:o.label??o.value??o;
  const selDisp=options.find(o=>getVal(o)===value);
  useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(getVal(filtered[hiIdx]));setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
  return(<div ref={wrapRef} className="searchable-select"><div className="ss-input-wrap"><input type="text" className="ss-input" placeholder={value?'':placeholder} value={isOpen?search:(selDisp?getDisp(selDisp):'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled} style={{background:T?.inputBg,color:T?.textDark,borderColor:T?.borderSoft}}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}} style={{background:T?.creamDark,color:T?.textMuted}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`} style={{color:T?.textMuted}}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown" style={{background:T?.cardBg,borderColor:T?.borderSoft}}>{filtered.length===0?<div className="ss-no-results" style={{color:T?.textMuted}}>No results</div>:<div className="ss-options">{filtered.map((o,idx)=>(<div key={idx} className={`ss-option ${hiIdx===idx?'highlighted':''} ${getVal(o)===value?'selected':''}`} onClick={()=>{onChange(getVal(o));setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)} style={{color:T?.textDark,borderColor:T?.accent}}>{getDisp(o)}</div>))}</div>}</div>}</div>);
}

function ProductSearchableSelect({ products, value, onChange, disabled=false, T }) {
  const [isOpen,setIsOpen]=useState(false);const [search,setSearch]=useState('');const [hiIdx,setHiIdx]=useState(0);const wrapRef=useRef(null);
  const filtered=products.filter(p=>{const s=search.toLowerCase();return p.materialName?.toLowerCase().includes(s)||p.skuCode?.toLowerCase().includes(s)||p.category?.toLowerCase().includes(s)||p.subCategory?.toLowerCase().includes(s);});
  const selected=products.find(p=>p.skuCode===value);
  useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setIsOpen(false);setSearch('');}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  const handleKey=e=>{if(!isOpen){if(e.key==='ArrowDown'||e.key==='Enter'){setIsOpen(true);e.preventDefault();}return;}if(e.key==='ArrowDown'){e.preventDefault();setHiIdx(p=>Math.min(p+1,filtered.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setHiIdx(p=>Math.max(p-1,0));}else if(e.key==='Enter'){e.preventDefault();if(filtered[hiIdx]){onChange(filtered[hiIdx].skuCode);setIsOpen(false);setSearch('');}}else if(e.key==='Escape'){setIsOpen(false);setSearch('');}};
  return(<div ref={wrapRef} className="searchable-select product-select"><div className="ss-input-wrap"><Search className="ss-search-icon" style={{color:T?.textMuted}}/><input type="text" className="ss-input with-icon" placeholder={selected?'':'🔍 Search product...'} value={isOpen?search:(selected?.materialName||'')} onChange={e=>{setSearch(e.target.value);setHiIdx(0);if(!isOpen)setIsOpen(true);}} onFocus={()=>{setIsOpen(true);setSearch('');}} onKeyDown={handleKey} disabled={disabled} style={{background:T?.inputBg,color:T?.textDark,borderColor:T?.borderSoft}}/><div className="ss-icons">{value&&!disabled&&<button type="button" className="ss-clear" onClick={e=>{e.stopPropagation();onChange('');setSearch('');setIsOpen(false);}} style={{background:T?.creamDark,color:T?.textMuted}}><X className="w-3 h-3"/></button>}<ChevronDown className={`ss-arrow ${isOpen?'open':''}`} style={{color:T?.textMuted}}/></div></div>{isOpen&&!disabled&&<div className="ss-dropdown product-dropdown" style={{background:T?.cardBg,borderColor:T?.borderSoft}}><div className="ss-dropdown-header" style={{background:T?.cream,borderColor:T?.borderSoft,color:T?.maroon}}><span>{filtered.length} products</span></div>{filtered.length===0?<div className="ss-no-results" style={{color:T?.textMuted}}>No match</div>:<div className="ss-options">{filtered.slice(0,50).map((p,idx)=>(<div key={p.skuCode} className={`ss-option product-option ${hiIdx===idx?'highlighted':''} ${p.skuCode===value?'selected':''}`} onClick={()=>{onChange(p.skuCode);setIsOpen(false);setSearch('');setHiIdx(0);}} onMouseEnter={()=>setHiIdx(idx)} style={{color:T?.textDark,borderColor:T?.accent}}><div className="product-option-main"><span className="product-name" style={{color:T?.textDark}}>{p.materialName}</span><span className="product-sku" style={{color:T?.maroon,background:T?.cream}}>{p.skuCode}</span></div><div className="product-option-sub"><span className="product-cat" style={{color:T?.textMuted}}>{p.materialType}</span><span className="product-sep" style={{color:T?.borderSoft}}>›</span><span className="product-cat" style={{color:T?.textMuted}}>{p.category}</span>{p.subCategory&&<><span className="product-sep" style={{color:T?.borderSoft}}>›</span><span className="product-cat" style={{color:T?.textMuted}}>{p.subCategory}</span></>}<span className="product-unit" style={{background:T?.maroon}}>{p.unit}</span></div></div>))}{filtered.length>50&&<div className="ss-more" style={{color:T?.maroon,background:T?.creamLight}}>+{filtered.length-50} more...</div>}</div>}</div>}</div>);
}

// ─── PRINT CSS (always light — print doesn't use dark mode) ───
const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:11px;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:195mm;margin:0 auto;padding:8mm 10mm}
.action-bar{display:flex;gap:10px;justify-content:center;padding:12px;background:#FBF6F0;border-radius:10px;margin-bottom:16px;border:1px solid #E8DCC8}
.action-btn{padding:9px 22px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
.btn-print{background:#7B1E1E;color:#fff}.btn-print:hover{background:#5a1515}
.btn-save{background:#5a1515;color:#fff}.btn-save:hover{background:#3d0d0d}
.ktp-header{background:#7B1E1E;color:#fff;padding:10px 16px 9px;border:2px solid #7B1E1E;display:flex;align-items:center;gap:14px}
.ktp-logo-circle{width:52px;height:52px;border-radius:50%;border:2.5px solid #fff;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ktp-logo-text{font-size:17px;font-weight:900;color:#7B1E1E;font-family:Georgia,serif;letter-spacing:1px}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:30px;font-style:italic;font-weight:bold;font-family:Georgia,serif;color:#fff;line-height:1}
.ktp-brand-sub{font-size:14px;font-family:Georgia,serif;color:#f5d0d0;letter-spacing:2px;margin-top:1px}
.ktp-brand-addr{font-size:8.5px;color:#fde8e8;margin-top:4px;letter-spacing:0.3px}
.ktp-meta{display:flex;justify-content:space-between;align-items:center;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:5px 10px;background:#FBF6F0}
.ktp-meta-left{display:flex;flex-direction:column;gap:1px}
.ktp-since{font-size:8.5px;color:#6b5454;font-style:italic}
.ktp-gstin{font-size:10px;font-weight:bold;color:#7B1E1E;text-decoration:underline}
.ktp-dc-box{text-align:right}
.ktp-dc-title{font-size:14px;font-weight:bold;color:#7B1E1E;letter-spacing:2px;text-transform:uppercase}
.ktp-info{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:7px 10px;background:#FBF6F0}
.ktp-info-row1{display:flex;gap:20px;margin-bottom:5px;flex-wrap:wrap}
.ktp-info-row2{display:flex;gap:10px;margin-bottom:4px;flex-wrap:wrap}
.ktp-info-row3{display:flex;gap:10px;flex-wrap:wrap}
.ktp-field{display:flex;align-items:baseline;gap:4px}
.ktp-field-label{font-size:9.5px;font-weight:bold;white-space:nowrap;color:#2a1010}
.ktp-field-value{font-size:10px;border-bottom:1px solid #888;padding-bottom:1px;min-width:80px}
.ktp-field-value.wide{min-width:200px}
.ktp-field-value.medium{min-width:130px}
.ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:none}
table.items{width:100%;border-collapse:collapse;border-top:1.5px solid #7B1E1E;border-bottom:none}
table.items thead tr{background:#7B1E1E}
table.items th{padding:6px 7px;font-size:9px;font-weight:bold;text-transform:uppercase;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,0.25);letter-spacing:0.5px}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #c09090}
table.items tbody tr:nth-child(even){background:#FDF8F2}
table.items tbody tr:nth-child(odd){background:#FBF6F0}
table.items td{padding:4px 7px;font-size:10.5px;border-right:1px solid #c09090;vertical-align:top;min-height:20px}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right}
table.items td.c{text-align:center}
table.items .erow td{height:20px;padding:3px 7px}
.ktp-footer{border:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;display:flex;background:#FBF6F0}
.ktp-footer-left{flex:1;padding:8px 12px;border-right:1.5px solid #7B1E1E;font-size:9px;line-height:1.8}
.ktp-footer-cert{font-size:9px;margin-bottom:6px;color:#2a1010}
.ktp-footer-sig{font-size:11px;font-style:italic;font-weight:bold;font-family:Georgia,serif;color:#7B1E1E}
.ktp-footer-right{width:200px;display:flex;flex-direction:column}
.ktp-total-row{display:flex;justify-content:space-between;align-items:center;padding:5px 10px;border-bottom:1px solid #c09090;font-size:10px}
.ktp-total-row.grand{background:#7B1E1E;color:#fff;font-size:11px;font-weight:bold}
.ktp-total-label{font-weight:600}
.ktp-total-val{font-weight:bold}
.ktp-sig-row{display:flex;justify-content:flex-end;align-items:flex-end;padding:5px 10px;border-bottom:1px solid #c09090;font-size:9px;flex:1}
.ktp-eoe{border-top:1px solid #c09090;padding:4px 10px;font-size:8.5px;color:#6b5454;font-style:italic}
.ktp-words{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;padding:5px 10px;font-size:9.5px;background:#FBF6F0}
.ktp-words-label{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#7B1E1E;margin-bottom:2px}
.ktp-words-text{font-style:italic;font-weight:600}
.ktp-gst-section{border:2px solid #7B1E1E;margin-top:10px}
.ktp-gst-head{background:#7B1E1E;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}
.ktp-gst-table{width:100%;border-collapse:collapse}
.ktp-gst-table th{background:#F0E6DA;padding:5px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #c09090;border-right:1px solid #ddd}
.ktp-gst-table td{padding:5px 8px;font-size:10px;border-right:1px solid #ddd;background:#FBF6F0}
.ktp-terms-section{border:2px solid #7B1E1E;border-top:none;display:flex;background:#FBF6F0}
.ktp-terms-left{flex:1;padding:8px 12px;border-right:1.5px solid #c09090}
.ktp-terms-title{font-size:8.5px;font-weight:bold;text-transform:uppercase;text-decoration:underline;margin-bottom:4px;color:#2a1010}
.ktp-terms-list{font-size:8.5px;line-height:1.8;color:#2a1010}
.ktp-terms-right{width:200px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:10px}
.ktp-stamp-box{border:2px dashed #7B1E1E;padding:6px 12px;margin-bottom:24px;font-size:9px;font-weight:bold;text-transform:uppercase;color:#7B1E1E;text-align:center}
.ktp-sig-line{width:100%;border-top:1px solid #000;margin-bottom:4px}
.ktp-sig-label{font-size:8.5px;font-weight:bold;text-align:center}
.ktp-thankyou{border:2px solid #7B1E1E;border-top:1.5px solid #7B1E1E;padding:6px;text-align:center;font-size:10px;font-weight:bold;color:#7B1E1E;background:#FDF8F2}
@media print{
  .action-bar{display:none!important}
  body{font-size:10px}
  .page{padding:6mm 8mm}
  .ktp-header{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  table.items thead tr{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  table.items th{color:#fff!important}
  .ktp-total-row.grand{background:#000!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .ktp-gst-head{background:#000!important;color:#fff!important}
  .ktp-gstin,.ktp-dc-title,.ktp-footer-sig,.ktp-stamp-box,.ktp-thankyou{color:#000!important}
  table.items tbody tr:nth-child(even),table.items tbody tr:nth-child(odd){background:#fff!important}
  .ktp-gst-table th{background:#f0f0f0!important}
  .ktp-words,.ktp-info,.ktp-meta,.ktp-footer,.ktp-gst-table td,.ktp-terms-section,.ktp-thankyou{background:#fff!important}
  .ktp-words{border-color:#000}
}
@page{size:A4;margin:8mm}
`;

const buildItemDesc = (it) => {
  let name = `<strong>${it.product}</strong>`;
  let details = [];
  if (it.size) details.push(it.size);
  const ld = it.lengthDisplay || '';
  if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
  if (details.length) name += `<br><span style="font-size:8.5px;color:#6b5454">${details.join(' · ')}</span>`;
  return name;
};

const KTP_LOGO_SVG = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="38" height="38">
  <circle cx="30" cy="30" r="28" fill="none" stroke="#7B1E1E" stroke-width="3"/>
  <text x="30" y="40" text-anchor="middle" font-size="22" font-weight="900" font-family="Georgia,serif" fill="#7B1E1E">KTP</text>
</svg>`;

const getChallanPrintHTML = (order, challan, hidePrice = false) => {
  const challanTotal = challan.items.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
  const poLine = order.poNumber ? `<div class="ktp-field"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
  const gstLine = order.gstCustomerName ? `<div class="ktp-field"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';
  const itemRows = challan.items.map((it, i) => {
    const qtyVal = it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty;
    const qtyWithUnit = it.unit ? `${qtyVal} <span style="font-size:8.5px;color:#6b5454">${it.unit}</span>` : qtyVal;
    return `<tr><td class="c" style="width:32px">${i + 1}</td><td>${buildItemDesc(it)}</td>${!hidePrice?`<td class="r" style="width:90px">${qtyWithUnit}</td><td class="r" style="width:75px">${parseFloat(it.rate||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td><td class="r" style="width:90px"><strong>${parseFloat(it.amount||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</strong></td>`:`<td class="r" style="width:90px">${qtyWithUnit}</td>`}</tr>`;
  });
  const totalRows = Math.max(0, 12 - challan.items.length);
  const emptyRows = Array(totalRows).fill(`<tr class="erow"><td></td><td></td>${!hidePrice?'<td></td><td></td><td></td>':'<td></td>'}</tr>`);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}</style></head><body><div class="page"><div class="action-bar"><button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button><button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button></div><div class="ktp-header"><div class="ktp-logo-circle">${KTP_LOGO_SVG}</div><div class="ktp-header-center"><div class="ktp-brand-name">Krishna</div><div class="ktp-brand-sub">Timber &amp; Plywoods</div><div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}</div></div></div><div class="ktp-meta"><div class="ktp-meta-left"><div class="ktp-since">Chhabra's Since 1979</div><div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div></div><div class="ktp-dc-box"><div class="ktp-dc-title">Delivery Challan</div><div style="font-size:9px;color:#6b5454;margin-top:2px;">No.: <strong style="color:#2a1010">${challan.challanNo}</strong>&nbsp;&nbsp;&nbsp;Date: <strong style="color:#2a1010">${new Date(challan.challanDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</strong></div></div></div><div class="ktp-info"><div class="ktp-info-row1"><div class="ktp-field"><span class="ktp-field-label">CONSIGNOR (Details of Receiver)</span></div></div><div class="ktp-info-row2"><div class="ktp-field"><span class="ktp-field-label">Name:</span><span class="ktp-field-value wide">${order.customerName}</span></div><div class="ktp-field"><span class="ktp-field-label">Vehicle No.:</span><span class="ktp-field-value medium">&nbsp;</span></div></div><div class="ktp-info-row3"><div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value" style="min-width:300px">${order.customerAddress||'&nbsp;'}</span></div></div>${(order.customerPhone||order.poNumber||order.gstCustomerName)?`<div class="ktp-info-row3" style="margin-top:5px">${order.customerPhone?`<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>`:''}${poLine}${gstLine}<div class="ktp-field"><span class="ktp-field-label">Ref Order:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>${challan.deliveryNote?`<div class="ktp-field"><span class="ktp-field-label">Note:</span><span class="ktp-field-value medium">${challan.deliveryNote}</span></div>`:''}</div>`:''}</div><div class="ktp-table-wrap"><table class="items"><thead><tr><th style="width:32px">S.No.</th><th class="tl">Description of Goods</th>${!hidePrice?`<th style="width:90px">Qty</th><th style="width:75px">Rate (₹)</th><th style="width:90px">Total (₹)</th>`:`<th style="width:90px">Qty</th>`}</tr></thead><tbody>${itemRows.join('')}${emptyRows.join('')}</tbody></table></div>${!hidePrice?`<div class="ktp-words"><div class="ktp-words-label">Amount in Words</div><div class="ktp-words-text">${numberToWords(challanTotal)}</div></div>`:''}<div class="ktp-footer"><div class="ktp-footer-left"><div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div><div class="ktp-footer-sig">For : Krishna Timber &amp; Plywoods</div><div style="margin-top:20px;font-size:8.5px;color:#6b5454">• Goods dispatched will not be returned without prior approval.<br/>• Verify items on receipt; report discrepancies within 24 hours.<br/>• This is a delivery challan — not a tax invoice.<br/>• All disputes subject to Bhopal jurisdiction only.</div><div style="margin-top:14px;display:flex;align-items:flex-end;gap:10px;"><div><div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div><div style="font-size:8.5px;font-weight:bold">Customer Signature</div></div><div style="font-size:8.5px;color:#6b5454;margin-bottom:4px">Received goods in good condition</div></div></div><div class="ktp-footer-right">${!hidePrice?`<div class="ktp-total-row"><span class="ktp-total-label">Freight</span><span class="ktp-total-val">&nbsp;</span></div><div class="ktp-total-row"><span class="ktp-total-label">Total Taxable Amt ₹</span><span class="ktp-total-val">${challanTotal.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div><div class="ktp-total-row grand"><span>Challan/Invoice Total ₹</span><span>${challanTotal.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>`:`<div style="padding:12px 10px;font-size:9px;text-align:center;color:#7B1E1E;font-weight:bold;">DELIVERY CHALLAN<br/>FOR GOODS REFERENCE ONLY</div>`}<div class="ktp-sig-row"><div style="text-align:center"><div style="width:120px;border-top:1px solid #000;margin-bottom:3px"></div><div style="font-size:8.5px;font-weight:bold">Authorised Signatory</div></div></div><div class="ktp-eoe">E. &amp; O.E.</div></div></div><div class="ktp-thankyou">Krishna Timber &amp; Plywoods &nbsp;|&nbsp; ${SHOP_INFO.phone} &nbsp;|&nbsp; ${SHOP_INFO.address}</div></div><script>function savePDF(){document.querySelector('.action-bar').style.display='none';window.print();setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);}</script></body></html>`;
};

const getBillPrintHTML = (order, chs) => {
  const m = {};
  chs.forEach(ch => ch.items?.forEach(it => {
    const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || '');
    if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' };
    m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0);
    m[key].totalAmount += parseFloat(it.amount || 0);
  }));
  const li = Object.values(m);
  const sub = li.reduce((s, i) => s + i.totalAmount, 0);
  const gstRate = order.gstRate || 0;
  const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
  const total = sub + tax;
  const itemRows = li.map((it, i) => {
    const desc = buildItemDesc(it);
    const qtyWithUnit = it.unit ? `<strong>${it.totalQty.toFixed(3)}</strong> <span style="font-size:8.5px;color:#6b5454">${it.unit}</span>` : `<strong>${it.totalQty.toFixed(3)}</strong>`;
    return `<tr><td class="c" style="width:32px">${i+1}</td><td>${desc}</td><td class="r" style="width:90px">${qtyWithUnit}</td><td class="r" style="width:75px">${parseFloat(it.rate||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td><td class="r" style="width:95px"><strong>${it.totalAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</strong></td></tr>`;
  });
  const totalRows = Math.max(0, 10 - li.length);
  const emptyRows = Array(totalRows).fill(`<tr class="erow"><td></td><td></td><td></td><td></td><td></td></tr>`);
  const poRow = order.poNumber ? `<div class="ktp-field" style="margin-top:4px"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
  const gstRow = order.gstCustomerName ? `<div class="ktp-field" style="margin-top:4px"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice INV-${order.orderNo}</title><style>${PRINT_CSS}</style></head><body><div class="page"><div class="action-bar"><button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button><button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button></div><div class="ktp-header"><div class="ktp-logo-circle">${KTP_LOGO_SVG}</div><div class="ktp-header-center"><div class="ktp-brand-name">Krishna</div><div class="ktp-brand-sub">Timber &amp; Plywoods</div><div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}</div></div></div><div class="ktp-meta"><div class="ktp-meta-left"><div class="ktp-since">Chhabra's Since 1979</div><div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div></div><div class="ktp-dc-box"><div class="ktp-dc-title">Tax Invoice</div><div style="font-size:9px;color:#6b5454;margin-top:2px;">No.: <strong style="color:#2a1010">INV-${order.orderNo}</strong>&nbsp;&nbsp;&nbsp;Date: <strong style="color:#2a1010">${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</strong></div></div></div><div class="ktp-info"><div class="ktp-info-row2"><div class="ktp-field"><span class="ktp-field-label">Bill To:</span><span class="ktp-field-value wide"><strong>${order.customerName}</strong></span></div>${order.customerPhone?`<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>`:''}</div>${order.customerAddress?`<div class="ktp-info-row3" style="margin-top:4px"><div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value" style="min-width:280px">${order.customerAddress}</span></div></div>`:''}<div class="ktp-info-row3" style="margin-top:5px;flex-wrap:wrap;gap:10px"><div class="ktp-field"><span class="ktp-field-label">Order No:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>${poRow}${gstRow}<div class="ktp-field"><span class="ktp-field-label">Challans:</span><span class="ktp-field-value" style="min-width:180px">${chs.map(c=>c.challanNo).join(', ')}</span></div>${gstRate>0?`<div class="ktp-field"><span class="ktp-field-label">GST:</span><span class="ktp-field-value medium">${gstRate}% Included</span></div>`:''}</div></div><div class="ktp-table-wrap"><table class="items"><thead><tr><th style="width:32px">S.No.</th><th class="tl">Description of Goods</th><th style="width:90px">Qty</th><th style="width:75px">Rate (₹)</th><th style="width:95px">Amount (₹)</th></tr></thead><tbody>${itemRows.join('')}${emptyRows.join('')}</tbody></table></div><div class="ktp-words" style="display:flex;justify-content:space-between;align-items:flex-start"><div style="flex:1"><div class="ktp-words-label">Amount in Words</div><div class="ktp-words-text">${numberToWords(total)}</div></div><div style="border-left:1.5px solid #c09090;padding-left:12px;min-width:200px"><div class="ktp-total-row" style="padding:4px 0;font-size:10px;border:none;display:flex;justify-content:space-between"><span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>${gstRate>0?`<div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between"><span>CGST @ ${gstRate/2}%:</span><span>₹${(tax/2).toFixed(2)}</span></div><div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between"><span>SGST @ ${gstRate/2}%:</span><span>₹${(tax/2).toFixed(2)}</span></div>`:''}<div class="ktp-total-row" style="padding:3px 0;font-size:10px;border:none;display:flex;justify-content:space-between"><span>Discount:</span><span>₹0.00</span></div><div style="margin-top:4px;background:#7B1E1E;color:#fff;padding:5px 8px;display:flex;justify-content:space-between;font-size:11px;font-weight:bold;border-radius:2px"><span>Grand Total</span><span>₹${total.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div></div></div>${gstRate>0?`<div class="ktp-gst-section"><div class="ktp-gst-head">GST Tax Breakup</div><table class="ktp-gst-table"><thead><tr><th>Taxable Amt</th><th>CGST Rate</th><th>CGST Amt</th><th>SGST Rate</th><th>SGST Amt</th><th>Total Tax</th></tr></thead><tbody><tr><td>₹${sub.toFixed(2)}</td><td>${gstRate/2}%</td><td>₹${(tax/2).toFixed(2)}</td><td>${gstRate/2}%</td><td>₹${(tax/2).toFixed(2)}</td><td><strong>₹${tax.toFixed(2)}</strong></td></tr></tbody></table></div>`:''}<div class="ktp-terms-section"><div class="ktp-terms-left"><div class="ktp-terms-title">Terms &amp; Conditions:</div><div class="ktp-terms-list">• Goods once sold will not be taken back.<br/>• Payment due on receipt of invoice.<br/>• Interest @ 18% p.a. on overdue amounts.<br/>• All disputes subject to Bhopal jurisdiction.<br/>• Challan Ref: ${chs.map(c=>`${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}</div><div style="margin-top:18px;display:flex;align-items:flex-end;gap:10px"><div><div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div><div style="font-size:8.5px;font-weight:bold">Customer Signature</div></div><div style="font-size:8.5px;color:#6b5454;margin-bottom:4px">Received goods in good condition</div></div></div><div class="ktp-terms-right"><div class="ktp-stamp-box">For ${SHOP_INFO.name}</div><div class="ktp-sig-line"></div><div class="ktp-sig-label">Authorised Signatory</div></div></div><div class="ktp-thankyou">Thank You for your business! &nbsp;|&nbsp; Krishna Timber &amp; Plywoods &nbsp;|&nbsp; ${SHOP_INFO.phone}</div></div><script>function savePDF(){document.querySelector('.action-bar').style.display='none';window.print();setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);}</script></body></html>`;
};

const apiGet = async url => { try { const r = await fetch(url); if (!r.ok) return { success: false, data: [] }; return r.json(); } catch { return { success: false, data: [] }; } };
const apiPost = async (url, body) => { try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
const apiPatch = async (url, body) => { try { const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };

const openPDFView = (html) => { const win = window.open('', '_blank'); win.document.write(html); win.document.close(); };
const openPDFPrint = (html) => { const win = window.open('', '_blank'); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); };

const sortLatestFirst = (items, dateField) => {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt || a.updatedAt || a[dateField] || '';
    const bTime = b.createdAt || b.updatedAt || b[dateField] || '';
    if (aTime && bTime) {
      const diff = new Date(bTime).getTime() - new Date(aTime).getTime();
      if (diff !== 0) return diff;
    }
    const aNo = parseInt((a.orderNo || a.challanNo || '').split('-').pop()) || 0;
    const bNo = parseInt((b.orderNo || b.challanNo || '').split('-').pop()) || 0;
    return bNo - aNo;
  });
};

export default function OrderChallanBilling() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [challans, setChallans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [challanSearchQuery, setChallanSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showChallanSuccess, setShowChallanSuccess] = useState(false);
  const [lastChallanHTML, setLastChallanHTML] = useState('');
  const [lastChallanNo, setLastChallanNo] = useState('');
  const [orderForm, setOrderForm] = useState({ customerName: '', customerPhone: '', customerAddress: '', orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '', poNumber: '', gstCustomerName: '' });
  const [orderGroups, setOrderGroups] = useState([createEmptyGroup()]);
  const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
  const [challanItems, setChallanItems] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);

  // ─── DARK MODE — synced with layout via localStorage ───
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Read initial value
    const saved = localStorage.getItem('ktp-dark-mode');
    if (saved === 'true') setDarkMode(true);

    // Listen for changes from layout toggle
    const handleStorage = (e) => {
      if (e.key === 'ktp-dark-mode') {
        setDarkMode(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);

    // Also poll for same-tab changes (storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      const current = localStorage.getItem('ktp-dark-mode') === 'true';
      setDarkMode(prev => prev !== current ? current : prev);
    }, 300);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Active theme
  const T = darkMode ? DARK : LIGHT;

  function createEmptyItem(ov = {}) { return { uid: uid(), product: '', unit: '', lengthFeet: '', lengthInches: '', quantity: '', rate: '', amount: 0, calculatedQty: 0, skuCode: '', isWood: false, width: 0, thickness: 0, size: '', materialType: '', category: '', subCategory: '', ...ov }; }
  function createEmptyGroup() { return { groupId: uid(), filterMaterialType: '', filterCategory: '', filterSubCategory: '', items: [createEmptyItem()] }; }
  const getAllOrderItems = () => orderGroups.flatMap(g => g.items.map(item => ({ ...item, filterMaterialType: g.filterMaterialType, filterCategory: g.filterCategory, filterSubCategory: g.filterSubCategory })));
  const orderSubtotal = getAllOrderItems().reduce((s, i) => s + (i.amount || 0), 0);
  const orderTax = orderForm.gstRate > 0 ? orderSubtotal * (orderForm.gstRate / 100) : 0;
  const orderTotal = orderSubtotal + orderTax;

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [oR, cR, pR] = await Promise.all([apiGet('/api/billing-backend/orders'), apiGet('/api/billing-backend/challans'), apiGet('/api/dropdown-data')]);
      setOrders(oR.success ? oR.data || [] : []);
      setChallans(cR.success ? cR.data || [] : []);
      setProducts(pR.success && pR.data ? pR.data : []);
    } catch { setError('Data load problem'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isWoodMaterial = item => { if (!item) return false; const mt = (item.materialType || '').toLowerCase(); const cat = (item.category || '').toLowerCase(); return mt.includes('timber') || mt.includes('wood') || mt.includes('lakdi') || cat.includes('teak') || cat.includes('sagwan') || cat.includes('pine') || cat.includes('sal'); };
  const getFilteredProductsForGroup = g => products.filter(p => { if (g.filterMaterialType && p.materialType !== g.filterMaterialType) return false; if (g.filterCategory && p.category !== g.filterCategory) return false; if (g.filterSubCategory && p.subCategory !== g.filterSubCategory) return false; return true; });
  const getAllMaterialTypes = () => [...new Set(products.map(p => p.materialType).filter(Boolean))];
  const getCategoriesFor = mt => [...new Set(products.filter(p => !mt || p.materialType === mt).map(p => p.category).filter(Boolean))];
  const getSubCategoriesFor = (mt, cat) => [...new Set(products.filter(p => (!mt || p.materialType === mt) && (!cat || p.category === cat)).map(p => p.subCategory).filter(Boolean))];
  const updateGroupFilter = (gid, field, val) => { setOrderGroups(prev => prev.map(g => { if (g.groupId !== gid) return g; const u = { ...g, [field]: val }; if (field === 'filterMaterialType') { u.filterCategory = ''; u.filterSubCategory = ''; } if (field === 'filterCategory') { u.filterSubCategory = ''; } return u; })); };
  const addItemToGroup = gid => { setOrderGroups(prev => prev.map(g => g.groupId !== gid ? g : { ...g, items: [...g.items, createEmptyItem()] })); };
  const removeItemFromGroup = (gid, iuid) => { setOrderGroups(prev => prev.map(g => { if (g.groupId !== gid || g.items.length === 1) return g; return { ...g, items: g.items.filter(i => i.uid !== iuid) }; })); };
  const removeGroup = gid => { if (orderGroups.length === 1) return; setOrderGroups(prev => prev.filter(g => g.groupId !== gid)); };
  const addNewGroup = () => setOrderGroups(prev => [...prev, createEmptyGroup()]);

  const updateGroupItem = (gid, iuid, field, val) => {
    setOrderGroups(prev => prev.map(g => {
      if (g.groupId !== gid) return g;
      return {
        ...g, items: g.items.map(item => {
          if (item.uid !== iuid) return item;
          const u = { ...item, [field]: val };
          if (field === 'skuCode') {
            const f = products.find(p => p.skuCode === val);
            if (f) {
              u.product = f.materialName; u.skuCode = f.skuCode; u.materialType = f.materialType;
              u.category = f.category; u.subCategory = f.subCategory; u.isWood = isWoodMaterial(f);
              if (u.isWood) {
                u.unit = 'CFT';
                const dims = parseWoodDimensions(f.materialName);
                if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
                else { u.width = 0; u.thickness = 0; u.size = ''; }
              } else { u.unit = f.unit || 'Pcs'; u.width = 0; u.thickness = 0; u.size = ''; u.lengthFeet = ''; u.lengthInches = ''; }
            }
          }
          const calc = calculateByUnit(u); u.calculatedQty = calc.calculatedQty; u.amount = calc.amount;
          return u;
        })
      };
    }));
  };

  const genOrderNo = () => { const y = new Date().getFullYear(), px = `ORD-${y}-`; const max = orders.filter(o => o.orderNo?.startsWith(px)).reduce((m, o) => { const n = parseInt(o.orderNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0); return `${px}${String(max + 1).padStart(4, '0')}`; };
  const genChallanNo = () => { const y = new Date().getFullYear(), px = `CHL-${y}-`; const max = challans.filter(c => c.challanNo?.startsWith(px)).reduce((m, c) => { const n = parseInt(c.challanNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0); return `${px}${String(max + 1).padStart(4, '0')}`; };

  const openEditOrder = order => {
    setIsEditMode(true); setEditingOrder(order);
    setOrderForm({ customerName: order.customerName || '', customerPhone: order.customerPhone || '', customerAddress: order.customerAddress || '', orderDate: order.orderDate || new Date().toISOString().split('T')[0], gstRate: order.gstRate || 0, notes: order.notes || '', poNumber: order.poNumber || '', gstCustomerName: order.gstCustomerName || '' });
    const savedItems = order.items || [];
    if (savedItems.length === 0) { setOrderGroups([createEmptyGroup()]); }
    else {
      const groupMap = {};
      savedItems.forEach(it => { const key = it.materialType || 'Other'; if (!groupMap[key]) groupMap[key] = []; groupMap[key].push(rebuildItemForEdit(it)); });
      setOrderGroups(Object.entries(groupMap).map(([mt, items]) => ({ groupId: uid(), filterMaterialType: mt === 'Other' ? '' : mt, filterCategory: items[0]?.category || '', filterSubCategory: items[0]?.subCategory || '', items })));
    }
    setShowOrderForm(true);
  };

  const resetOrderForm = () => { setOrderForm({ customerName: '', customerPhone: '', customerAddress: '', orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '', poNumber: '', gstCustomerName: '' }); setOrderGroups([createEmptyGroup()]); setIsEditMode(false); setEditingOrder(null); };

  const handleSubmitOrder = async () => {
    if (!orderForm.customerName || orderSubtotal === 0) { setError('Customer name aur items required'); return; }
    setSaving(true); setError(null);
    try {
      const validItems = getAllOrderItems().filter(i => i.product && (i.quantity || i.calculatedQty)).map(it => ({ ...it, lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '' }));
      if (isEditMode && editingOrder) {
        const r = await apiPatch('/api/billing-backend/orders', { orderNo: editingOrder.orderNo, order: { ...orderForm, orderNo: editingOrder.orderNo, subtotal: orderSubtotal, tax: orderTax, total: orderTotal, status: editingOrder.status, includeGST: orderForm.gstRate > 0 }, items: validItems });
        if (!r.success) { setError(r.error || 'Edit fail'); return; }
      } else {
        const orderNo = genOrderNo();
        const r = await apiPost('/api/billing-backend/orders', { order: { ...orderForm, orderNo, subtotal: orderSubtotal, tax: orderTax, total: orderTotal, status: 'Active', includeGST: orderForm.gstRate > 0 }, items: validItems });
        if (!r.success) { setError(r.error || 'Save fail'); return; }
      }
      await fetchData(); setShowOrderForm(false); resetOrderForm();
    } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
  };

  const openChallanForm = order => {
    setSelectedOrder(order);
    const sm = {};
    challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
    setChallanItems((order.items || []).map(it => ({ uid: uid(), product: it.product, unit: it.unit, rate: parseFloat(it.rate || 0), orderedQty: parseFloat(it.calculatedQty || it.quantity || 0), alreadySent: parseFloat(sm[it.product] || 0), sendingPcs: '', sendingQty: 0, size: it.size || '', lengthFeet: it.lengthFeet || '', lengthInches: it.lengthInches || '', lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '', isWood: it.isWood || false, width: it.width || 0, thickness: it.thickness || 0 })));
    setChallanDate(new Date().toISOString().split('T')[0]);
    setDeliveryNote('');
    setHidePriceOnChallan(false);
    setShowChallanForm(true);
  };

  const updateChallanItem = (iuid, field, value) => {
    setChallanItems(prev => prev.map(it => {
      if (it.uid !== iuid) return it;
      const u = { ...it, [field]: value };
      if (field === 'sendingPcs') { const pcs = parseFloat(value || 0); u.sendingQty = it.isWood ? calculateByUnit({ ...u, quantity: pcs }).calculatedQty : pcs; }
      return u;
    }));
  };

  const handleSubmitChallan = async () => {
    const valid = challanItems.filter(i => parseFloat(i.sendingPcs) > 0);
    if (!valid.length) { setError('Kam se kam ek item ki qty daalo'); return; }
    setSaving(true); setError(null);
    try {
      const challanNo = genChallanNo();
      const challanTotal = valid.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0);
      const payload = {
        challan: { challanNo, orderNo: selectedOrder.orderNo, customerName: selectedOrder.customerName, challanDate, deliveryNote, challanTotal, status: 'Delivered', hidePrice: hidePriceOnChallan },
        items: valid.map(it => ({ product: it.product, unit: it.unit, orderedQty: it.orderedQty, pieces: parseFloat(it.sendingPcs), sentQty: parseFloat(it.sendingPcs), calculatedQty: it.sendingQty, rate: it.rate, amount: it.sendingQty * it.rate, size: it.size, lengthDisplay: it.lengthDisplay }))
      };
      const r = await apiPost('/api/billing-backend/challans', payload);
      if (!r.success) { setError(r.error || 'Challan fail'); return; }
      const allC = challans.filter(c => c.orderNo === selectedOrder.orderNo);
      const tsm = {};
      [...allC, { items: valid.map(it => ({ product: it.product, calculatedQty: it.sendingQty })) }].forEach(ch => ch.items?.forEach(it => { tsm[it.product] = (tsm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
      const done = (selectedOrder.items || []).every(oi => (tsm[oi.product] || 0) >= parseFloat(oi.calculatedQty || oi.quantity || 0));
      if (done) await apiPatch('/api/billing-backend/orders', { orderNo: selectedOrder.orderNo, status: 'Completed' });
      const html = getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan);
      setLastChallanHTML(html);
      setLastChallanNo(challanNo);
      await fetchData();
      setShowChallanForm(false);
      setShowChallanSuccess(true);
    } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
  };

  const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);
  const getDeliveryProgress = order => {
    const sm = {};
    challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
    const items = order.items || []; if (!items.length) return 0;
    const tot = items.reduce((s, it) => s + parseFloat(it.calculatedQty || it.quantity || 0), 0);
    const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.calculatedQty || it.quantity || 0), sm[it.product] || 0), 0);
    return tot > 0 ? Math.round((sent / tot) * 100) : 0;
  };

  const markBilled = async orderNo => { await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Billed' }); await fetchData(); setShowBillPreview(false); };

  const filteredOrders = sortLatestFirst(
    orders.filter(o => {
      const q = searchQuery.toLowerCase();
      const ms = !q || o.customerName?.toLowerCase().includes(q) || o.orderNo?.toLowerCase().includes(q) || o.customerPhone?.toLowerCase().includes(q) || o.poNumber?.toLowerCase().includes(q) || o.gstCustomerName?.toLowerCase().includes(q);
      const mst = filterStatus === 'All' || o.status === filterStatus;
      return ms && mst;
    }),
    'orderDate'
  );

  const filteredChallans = sortLatestFirst(
    challans.filter(ch => {
      const q = challanSearchQuery.toLowerCase();
      if (!q) return true;
      return ch.challanNo?.toLowerCase().includes(q) || ch.orderNo?.toLowerCase().includes(q) || ch.customerName?.toLowerCase().includes(q) || ch.deliveryNote?.toLowerCase().includes(q);
    }),
    'challanDate'
  );

  const STATUS_LIGHT = {
    Active: { bg: '#FBF6F0', color: '#7B1E1E', dot: '#9a2828', border: '#E8DCC8' },
    Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e', border: '#bbf7d0' },
    Billed: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6', border: '#bfdbfe' }
  };
  const STATUS_DARK = {
    Active: { bg: '#2a1a1a', color: '#e8a0a0', dot: '#f0b8b8', border: '#3a3a55' },
    Completed: { bg: '#052e16', color: '#4ade80', dot: '#22c55e', border: '#166534' },
    Billed: { bg: '#172554', color: '#93c5fd', dot: '#3b82f6', border: '#1e40af' }
  };
  const STATUS = darkMode ? STATUS_DARK : STATUS_LIGHT;

  if (loading) return (<div className="flex items-center justify-center min-h-96 flex-col gap-3"><Loader2 className="w-7 h-7 animate-spin" style={{ color: T.maroon }} /><p className="text-sm" style={{ color: T.textMuted }}>Loading...</p></div>);

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <style jsx global>{`
@keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.kt-in{animation:kt-in .28s ease-out}

.kt-input{width:100%;padding:9px 13px;border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;background:${T.inputBg};color:${T.textDark};outline:none;transition:border-color .14s,box-shadow .14s,background-color .3s,color .3s}
.kt-input:focus{border-color:${T.maroon};box-shadow:0 0 0 3px ${darkMode?'rgba(232,160,160,.15)':'rgba(123,30,30,.12)'}}
.kt-input[readonly]{background:${T.cream};color:${T.textMuted};cursor:not-allowed}
.kt-input-sm{padding:7px 10px;font-size:12px}

.btn-maroon{padding:9px 20px;background:linear-gradient(135deg,${T.maroonDark},${T.maroon});color:${darkMode?'#1a1a2e':'#fff'};border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 8px ${T.shadowStrong}}
.btn-maroon:hover{transform:translateY(-1px);box-shadow:0 4px 12px ${T.shadowStrong}}
.btn-maroon:disabled{opacity:.5;cursor:not-allowed;transform:none}

.btn-white{padding:9px 18px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:${T.textDark};display:inline-flex;align-items:center;gap:6px;transition:all .14s}
.btn-white:hover{background:${T.hoverBg};border-color:${T.maroon};color:${T.maroon}}

.btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}

.btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
.btn-blue:hover{opacity:.9}

.btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}

.icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:${T.textMuted}}
.icon-btn:hover{background:${T.hoverBg};color:${T.maroon}}

.kt-card{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:16px;box-shadow:0 1px 5px ${T.shadow};transition:background-color .3s,border-color .3s}
.kt-inset{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:12px;overflow:hidden;transition:background-color .3s}

.kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:${T.textMuted}}
.kt-tab.active{background:linear-gradient(135deg,${darkMode?T.maroonDark:LIGHT.maroon},${T.maroon});color:${darkMode?'#1a1a2e':'#fff'};box-shadow:0 2px 6px ${T.shadowStrong}}
.kt-tab:hover:not(.active){background:${T.hoverBg};color:${T.maroon}}

.kt-tbl{width:100%;border-collapse:collapse}
.kt-tbl thead tr{background:linear-gradient(135deg,${darkMode?'#3a1515':'#5a1515'},${darkMode?'#5a2020':LIGHT.maroon})}
.kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}
.kt-tbl thead th.r{text-align:right}
.kt-tbl thead th.c{text-align:center}
.kt-tbl tbody tr{border-bottom:1px solid ${T.borderSoft};transition:background .1s}
.kt-tbl tbody tr:nth-child(even){background:${T.tableEven}}
.kt-tbl tbody tr:hover{background:${T.tableHover}}
.kt-tbl tbody td{padding:10px;font-size:13px;color:${T.textDark};vertical-align:top}
.kt-tbl tbody td.r{text-align:right}
.kt-tbl tbody td.c{text-align:center}

.kt-overlay{position:fixed;inset:0;background:${T.overlayBg};z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}
.kt-modal{background:${T.modalBg};border-radius:22px;border:1px solid ${T.borderSoft};width:100%;max-width:1300px;margin:auto;box-shadow:0 24px 64px ${T.shadowStrong};overflow:visible;transition:background-color .3s}
.kt-mhead{padding:20px 26px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;background:${darkMode?T.accent:`linear-gradient(135deg,${LIGHT.cream} 0%,#fff 100%)`};border-radius:22px 22px 0 0}
.kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto;overflow-x:visible}
.kt-mfoot{padding:16px 26px;border-top:1px solid ${T.borderSoft};display:flex;justify-content:flex-end;gap:8px;background:${T.accent};border-radius:0 0 22px 22px}

.prog-track{height:6px;background:${T.creamDark};border-radius:4px;overflow:hidden}
.prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,${T.maroonDark},${T.maroonLight});transition:width .5s ease}
.prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}

.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}

.sec-label{font-size:11px;font-weight:600;color:${T.textMuted};text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}

.status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}
.status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}

.total-box{border-radius:12px;padding:14px 18px;border:1px solid}
.length-group{display:flex;gap:4px;align-items:center}
.length-input{width:50px!important;text-align:center}

.material-group{border:2px solid ${T.borderSoft};border-radius:16px;margin-bottom:16px;overflow:visible;transition:border-color .2s,background-color .3s;background:${T.cardBg}}
.material-group:hover{border-color:${T.maroonLight}}
.material-group-header{background:${darkMode?T.accent:`linear-gradient(135deg,${LIGHT.cream},${LIGHT.creamDark})`};padding:14px 18px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.material-group-label{display:flex;align-items:center;gap:10px}
.material-group-num{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,${darkMode?'#5a2020':LIGHT.maroonDark},${darkMode?'#7B1E1E':LIGHT.maroon});color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
.material-group-title{font-size:14px;font-weight:700;color:${T.maroon}}
.material-group-subtitle{font-size:11px;color:${T.textMuted};margin-top:2px}
.material-group-filters{display:flex;gap:8px;flex:1;flex-wrap:wrap;min-width:300px}
.material-group-body{padding:18px 20px;overflow:visible}
.material-group-footer{padding:10px 18px;border-top:1px dashed ${T.borderSoft};background:${T.accent};display:flex;justify-content:space-between;align-items:center}

.item-subrow{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;padding:14px;margin-bottom:10px;transition:all .2s;position:relative;overflow:visible}
.item-subrow:hover{border-color:${T.maroonLight};background:${T.hoverBg}}
.item-subrow:last-child{margin-bottom:0}
.item-subrow-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.item-subrow-num{width:24px;height:24px;border-radius:6px;background:${T.cream};color:${T.maroon};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;border:1px solid ${T.borderSoft}}

.unit-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}
.wood-badge{background:${T.successBg};color:${T.successColor}}
.hardware-badge{background:${T.infoBg};color:${T.infoColor}}

.calc-display{background:${T.cream};border:1px solid ${T.borderSoft};border-radius:8px;padding:10px;margin-top:10px}

.btn-add-inner{padding:7px 14px;background:${T.cardBg};border:1px dashed ${T.maroon};border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;color:${T.maroon};display:inline-flex;align-items:center;gap:5px;transition:all .15s}
.btn-add-inner:hover{background:${T.cream};border-style:solid}

.btn-add-outer{padding:10px 20px;background:${T.cardBg};border:2px dashed ${T.borderSoft};border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:${T.textMuted};display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s;width:100%}
.btn-add-outer:hover{background:${T.hoverBg};border-color:${T.maroon};color:${T.maroon}}

.searchable-select{position:relative;width:100%}
.ss-input-wrap{position:relative;display:flex;align-items:center}
.ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid ${T.borderSoft};border-radius:8px;font-size:13px;background:${T.inputBg};color:${T.textDark};outline:none;transition:all .15s}
.ss-input:focus{border-color:${T.maroon};box-shadow:0 0 0 3px ${darkMode?'rgba(232,160,160,.15)':'rgba(123,30,30,.12)'}}
.ss-input.with-icon{padding-left:32px}
.ss-search-icon{position:absolute;left:10px;width:14px;height:14px;color:${T.textMuted};pointer-events:none}
.ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}
.ss-clear{width:18px;height:18px;border-radius:50%;background:${T.creamDark};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${T.textMuted}}
.ss-clear:hover{background:${T.maroon};color:#fff}
.ss-arrow{width:14px;height:14px;color:${T.textMuted};transition:transform .2s}
.ss-arrow.open{transform:rotate(180deg)}
.ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;box-shadow:0 10px 40px ${T.shadowStrong};z-index:9999;max-height:320px;overflow:hidden;animation:ss-drop .15s ease}
@keyframes ss-drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.ss-dropdown-header{padding:8px 12px;background:${T.cream};border-bottom:1px solid ${T.borderSoft};font-size:11px;color:${T.maroon};font-weight:600}
.ss-options{max-height:260px;overflow-y:auto}
.ss-option{padding:10px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid ${T.accent};color:${T.textDark}}
.ss-option:last-child{border-bottom:none}
.ss-option:hover,.ss-option.highlighted{background:${T.hoverBg}}
.ss-option.selected{background:${T.cream}}
.ss-no-results{padding:20px;text-align:center;color:${T.textMuted};font-size:13px}
.ss-more{padding:10px 12px;text-align:center;color:${T.maroon};font-size:12px;font-weight:500;background:${T.creamLight}}
.product-dropdown{max-height:400px}
.product-dropdown .ss-options{max-height:340px}
.product-option{padding:10px 12px}
.product-option-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.product-name{font-weight:600;color:${T.textDark};font-size:13px}
.product-sku{font-size:11px;color:${T.maroon};font-family:monospace;background:${T.cream};padding:2px 6px;border-radius:4px}
.product-option-sub{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.product-cat{font-size:11px;color:${T.textMuted}}
.product-sep{color:${T.borderSoft};font-size:10px}
.product-unit{font-size:10px;color:#fff;background:${darkMode?'#5a2020':LIGHT.maroon};padding:2px 6px;border-radius:4px;margin-left:auto}

.edit-badge{background:${T.infoBg};color:${T.infoColor};border:1px solid ${T.infoBorder};padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600}
.success-icon{width:64px;height:64px;border-radius:50%;background:${darkMode?'linear-gradient(135deg,#052e16,#166534)':'linear-gradient(135deg,#dcfce7,#bbf7d0)'};display:flex;align-items:center;justify-content:center;margin:0 auto 16px}

select.kt-input{background:${T.inputBg};color:${T.textDark};border-color:${T.borderSoft}}
textarea.kt-input{background:${T.inputBg};color:${T.textDark};border-color:${T.borderSoft}}
      `}</style>

      {error && <div className="mb-4 flex items-center gap-3 rounded-xl p-3" style={{background:T.errorBg,border:`1px solid ${T.errorBorder}`}}><AlertTriangle className="w-4 h-4 shrink-0" style={{color:T.errorColor}} /><span className="text-sm flex-1" style={{color:T.errorColor}}>{error}</span><button className="icon-btn" onClick={() => setError(null)}><X className="w-3 h-3" /></button></div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: T.maroon }}>Order Management</h2>
          <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>{SHOP_INFO.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="icon-btn" onClick={fetchData}><RefreshCw className="w-4 h-4" /></button>
          <button className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`} onClick={() => setActiveTab('challans')}>Challans</button>
          <button className="btn-maroon" onClick={() => { resetOrderForm(); setShowOrderForm(true); }}><Plus className="w-4 h-4" />New Order</button>
        </div>
      </div>

      {/* WORKFLOW BANNER */}
      <div className="kt-card mb-6 overflow-hidden">
        <div style={{ background: `linear-gradient(135deg,${darkMode?'#3a1515':LIGHT.maroonDark},${darkMode?'#5a2020':LIGHT.maroon})`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { n: '1', label: 'Order', desc: 'Customer requirement' },
            { n: '2', label: 'Challan', desc: 'Partial delivery' },
            { n: '3', label: 'Bill', desc: 'Final invoice' }
          ].map((s, i, a) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="step-dot" style={{ background: '#fff', color: darkMode?'#5a2020':LIGHT.maroon }}>{s.n}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.75)', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
              {i < a.length - 1 && <ArrowRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,.5)', margin: '0 6px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-5 kt-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: orders.length, color: T.maroon },
              { label: 'Active', value: orders.filter(o => o.status === 'Active').length, color: T.maroon },
              { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: T.successColor },
              { label: 'Products', value: products.length, color: T.maroonDark }
            ].map((c, i) => (
              <div key={i} className="kt-card p-4">
                <p className="text-xs font-medium mb-1" style={{ color: T.textMuted }}>{c.label}</p>
                <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.textMuted }} />
              <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search by order no, customer, phone, PO..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn" style={{ width: 22, height: 22 }} onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>}
            </div>
            <div className="flex gap-1.5">{['All', 'Active', 'Completed', 'Billed'].map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`kt-tab ${filterStatus === s ? 'active' : ''}`} style={{ padding: '8px 14px', fontSize: 12 }}>{s}</button>))}</div>
          </div>
          <div className="space-y-3">
            {filteredOrders.length === 0 && (
              <div className="kt-card p-14 text-center">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Receipt style={{ width: 28, height: 28, color: T.maroon }} />
                </div>
                <p className="text-sm" style={{ color: T.textMuted }}>{searchQuery ? 'Koi match nahi mila' : 'Koi order nahi'}</p>
              </div>
            )}
            {filteredOrders.map((order, i) => {
              const progress = getDeliveryProgress(order);
              const st = STATUS[order.status] || STATUS.Active;
              const oc = getOrderChallans(order.orderNo);
              return (
                <div key={i} className="kt-card p-5 kt-in">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-sm font-bold" style={{ color: T.maroon }}>{order.orderNo}</span>
                        <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}><span className="status-dot" style={{ background: st.dot }} />{order.status}</span>
                        {order.gstRate > 0 && <span className="status-pill" style={{ background: T.infoBg, color: T.infoColor }}>{`GST ${order.gstRate}%`}</span>}
                        {order.poNumber && <span className="edit-badge">PO: {order.poNumber}</span>}
                        {order.gstCustomerName && <span className="status-pill" style={{ background: T.purpleBg, color: T.purpleColor }}>GST: {order.gstCustomerName}</span>}
                      </div>
                      <p className="font-bold text-base mb-1 truncate" style={{ color: T.textDark }}>{order.customerName}</p>
                      <p className="text-xs" style={{ color: T.textMuted }}>
                        {order.customerPhone && `${order.customerPhone} · `}
                        {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}&nbsp;·&nbsp;{(order.items || []).length} items&nbsp;·&nbsp;
                        <span className="font-semibold" style={{ color: T.maroon }}>₹{(parseFloat(order.total) || 0).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div style={{ width: 168 }}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs" style={{ color: T.textMuted }}>Delivery</span>
                          <span className="text-xs font-bold" style={{ color: progress === 100 ? T.successColor : T.maroon }}>{progress}%</span>
                        </div>
                        <div className="prog-track"><div className={`prog-fill ${progress === 100 ? 'done' : ''}`} style={{ width: `${progress}%` }} /></div>
                        <p className="text-xs mt-1 text-right" style={{ color: T.textMuted }}>{oc.length} challan{oc.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {order.status !== 'Billed' && <button className="btn-blue" onClick={() => openEditOrder(order)}><Edit2 className="w-3.5 h-3.5" />Edit</button>}
                        {order.status !== 'Billed' && <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => openChallanForm(order)}><TruckIcon className="w-3.5 h-3.5" />Challan</button>}
                        {(order.status === 'Completed' || order.status === 'Billed') && <button className="btn-maroon" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { setSelectedOrder(order); setShowBillPreview(true); }}><Receipt className="w-3.5 h-3.5" />Final Bill</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHALLANS TAB */}
      {activeTab === 'challans' && (
        <div className="space-y-3 kt-in">
          <div className="relative" style={{ maxWidth: 500 }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.textMuted }} />
            <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search by challan no, order no, customer..." value={challanSearchQuery} onChange={e => setChallanSearchQuery(e.target.value)} />
            {challanSearchQuery && <button className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn" style={{ width: 22, height: 22 }} onClick={() => setChallanSearchQuery('')}><X className="w-3 h-3" /></button>}
          </div>
          <p className="text-xs" style={{ color: T.textMuted }}>{filteredChallans.length} challan{filteredChallans.length !== 1 ? 's' : ''} {challanSearchQuery && `matching "${challanSearchQuery}"`}</p>
          {filteredChallans.length === 0 && (
            <div className="kt-card p-14 text-center">
              <div style={{ width: 56, height: 56, borderRadius: 16, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <TruckIcon style={{ width: 28, height: 28, color: T.maroon }} />
              </div>
              <p className="text-sm" style={{ color: T.textMuted }}>{challanSearchQuery ? 'Koi match nahi mila' : 'Koi challan nahi'}</p>
            </div>
          )}
          {filteredChallans.map((ch, i) => (
            <div key={i} className="kt-card p-4 kt-in">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-sm font-bold" style={{ color: T.maroon }}>{ch.challanNo}</span>
                    <span className="text-xs" style={{ color: T.textMuted }}>→ <strong style={{ color: T.textDark }}>{ch.orderNo}</strong></span>
                    <span className="status-pill" style={{ background: T.successBg, color: T.successColor }}><span className="status-dot" style={{ background: '#22c55e' }} />Delivered</span>
                    {ch.hidePrice && <span className="status-pill" style={{ background: T.cream, color: T.maroon, borderColor: T.borderSoft }}><EyeOff className="w-3 h-3" />Hidden</span>}
                  </div>
                  <p className="font-semibold" style={{ color: T.textDark }}>{ch.customerName}</p>
                  <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>
                    {new Date(ch.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}&nbsp;·&nbsp;{(ch.items || []).length} items
                    {!ch.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold" style={{ color: T.maroon }}>₹{(parseFloat(ch.challanTotal) || 0).toLocaleString('en-IN')}</span></>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { const order = orders.find(o => o.orderNo === ch.orderNo); if (order) openPDFView(getChallanPrintHTML(order, ch, ch.hidePrice)); }}><Eye className="w-3.5 h-3.5" />View</button>
                  <button className="btn-maroon" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { const order = orders.find(o => o.orderNo === ch.orderNo); if (order) openPDFPrint(getChallanPrintHTML(order, ch, ch.hidePrice)); }}><Printer className="w-3.5 h-3.5" />Print</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDER FORM MODAL */}
      {showOrderForm && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in">
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{ background: isEditMode ? T.infoBg : T.cream, color: isEditMode ? T.infoColor : T.maroon, border: `2px solid ${isEditMode ? T.infoBorder : T.borderSoft}` }}>{isEditMode ? <Edit2 className="w-3.5 h-3.5" /> : '1'}</div>
                <div><h3 className="font-bold text-lg m-0" style={{ color: T.textDark }}>{isEditMode ? `Edit — ${editingOrder?.orderNo}` : 'New Order'}</h3><p className="text-xs m-0" style={{ color: T.textMuted }}>{isEditMode ? 'Update' : 'Group items by material'}</p></div>
              </div>
              <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X className="w-5 h-5" /></button>
            </div>
            <div className="kt-mbody space-y-6">
              <div>
                <p className="sec-label">Customer Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Customer Name *</label><input className="kt-input" value={orderForm.customerName} onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))} /></div>
                  <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Phone</label><input className="kt-input" value={orderForm.customerPhone} onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))} /></div>
                  <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Date</label><input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} /></div>
                  <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>GST</label><select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm(p => ({ ...p, gstRate: parseFloat(e.target.value) }))}>{GST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                  <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>PO Number</label><input className="kt-input" value={orderForm.poNumber} onChange={e => setOrderForm(p => ({ ...p, poNumber: e.target.value }))} /></div>
                  <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>GST Customer</label><input className="kt-input" value={orderForm.gstCustomerName} onChange={e => setOrderForm(p => ({ ...p, gstCustomerName: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Address</label><textarea className="kt-input" rows={2} style={{ resize: 'none' }} value={orderForm.customerAddress} onChange={e => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))} /></div>
                </div>
              </div>
              <div>
                <p className="sec-label">Items</p>
                {orderGroups.map((group, gIdx) => {
                  const gp = getFilteredProductsForGroup(group);
                  const gc = getCategoriesFor(group.filterMaterialType);
                  const gsc = getSubCategoriesFor(group.filterMaterialType, group.filterCategory);
                  const gt = group.items.reduce((s, i) => s + (i.amount || 0), 0);
                  return (
                    <div key={group.groupId} className="material-group kt-in">
                      <div className="material-group-header">
                        <div className="material-group-label">
                          <div className="material-group-num">{gIdx + 1}</div>
                          <div><div className="material-group-title">{group.filterMaterialType || 'Select Material'}{group.filterCategory && ` › ${group.filterCategory}`}</div><div className="material-group-subtitle">{group.items.length} items · {gp.length} available</div></div>
                        </div>
                        {orderGroups.length > 1 && <button className="icon-btn" onClick={() => removeGroup(group.groupId)}><Trash2 className="w-4 h-4 text-red-400" /></button>}
                      </div>
                      <div style={{ padding: '12px 18px', background: T.accent, borderBottom: `1px solid ${T.borderSoft}` }}>
                        <div className="material-group-filters">
                          <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium block mb-1" style={{ color: T.textMuted }}>Material</label><SearchableSelect options={getAllMaterialTypes()} value={group.filterMaterialType} onChange={v => updateGroupFilter(group.groupId, 'filterMaterialType', v)} placeholder="🔍" T={T} /></div>
                          <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium block mb-1" style={{ color: T.textMuted }}>Category</label><SearchableSelect options={gc} value={group.filterCategory} onChange={v => updateGroupFilter(group.groupId, 'filterCategory', v)} placeholder="🔍" T={T} /></div>
                          <div style={{ flex: 1, minWidth: 160 }}><label className="text-xs font-medium block mb-1" style={{ color: T.textMuted }}>Sub Cat</label><SearchableSelect options={gsc} value={group.filterSubCategory} onChange={v => updateGroupFilter(group.groupId, 'filterSubCategory', v)} placeholder="🔍" T={T} /></div>
                        </div>
                      </div>
                      <div className="material-group-body">
                        {group.items.map((item, itemIdx) => (
                          <div key={item.uid} className="item-subrow">
                            <div className="item-subrow-header">
                              <div className="flex items-center gap-3">
                                <div className="item-subrow-num">{itemIdx + 1}</div>
                                {item.isWood ? <span className="unit-badge wood-badge">🪵 Wood</span> : item.product ? <span className="unit-badge hardware-badge">🔧</span> : null}
                                {item.product && <span className="text-xs font-semibold" style={{ color: T.textDark }}>{item.product}</span>}
                              </div>
                              <button className="icon-btn" onClick={() => removeItemFromGroup(group.groupId, item.uid)} disabled={group.items.length === 1}><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                              <div className="md:col-span-2"><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Product *</label><ProductSearchableSelect products={gp} value={item.skuCode} onChange={v => updateGroupItem(group.groupId, item.uid, 'skuCode', v)} T={T} /></div>
                              <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Unit</label>{item.isWood ? <select className="kt-input kt-input-sm" value={item.unit} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>{WOOD_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}</select> : <input className="kt-input kt-input-sm" value={item.unit || 'Pcs'} readOnly />}</div>
                              {item.isWood && <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Size</label><input className="kt-input kt-input-sm" value={item.size || '—'} readOnly /></div>}
                              {item.isWood && <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Length</label><div className="length-group"><input type="number" min="0" className="kt-input kt-input-sm length-input" value={item.lengthFeet} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthFeet', e.target.value)} /><span className="text-xs" style={{ color: T.textMuted }}>ft</span><input type="number" min="0" max="11" className="kt-input kt-input-sm length-input" value={item.lengthInches} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthInches', e.target.value)} /><span className="text-xs" style={{ color: T.textMuted }}>in</span></div></div>}
                              <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>{item.isWood ? 'Pcs' : 'Qty'}</label><input type="number" min="1" className="kt-input kt-input-sm" value={item.quantity} onChange={e => updateGroupItem(group.groupId, item.uid, 'quantity', e.target.value)} /></div>
                              <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Rate</label><input type="number" min="0" className="kt-input kt-input-sm" value={item.rate} onChange={e => updateGroupItem(group.groupId, item.uid, 'rate', e.target.value)} /></div>
                            </div>
                            {item.product && <div className="calc-display"><div className="flex justify-between items-center flex-wrap gap-2"><div className="text-xs" style={{ color: T.maroon }}>{item.isWood ? <><strong>{item.unit}:</strong> {item.calculatedQty.toFixed(3)} {item.unit}</> : <><strong>Qty:</strong> {item.quantity || 0}</>}</div><div className="text-base font-bold" style={{ color: T.maroon }}>₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div></div></div>}
                          </div>
                        ))}
                      </div>
                      <div className="material-group-footer">
                        <button className="btn-add-inner" onClick={() => addItemToGroup(group.groupId)}><Plus className="w-3.5 h-3.5" />Add Item</button>
                        <div className="text-sm font-bold" style={{ color: T.maroon }}>₹{gt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  );
                })}
                <button className="btn-add-outer" onClick={addNewGroup}><Plus className="w-4 h-4" />Add New Group</button>
              </div>
              <div className="flex justify-end">
                <div className="total-box" style={{ width: 300, background: T.cream, borderColor: T.borderSoft }}>
                  <div className="flex justify-between text-sm mb-2" style={{ color: T.textDark }}><span>Subtotal</span><span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                  {orderForm.gstRate > 0 && <div className="flex justify-between text-sm mb-2" style={{ color: T.textDark }}><span>GST ({orderForm.gstRate}%)</span><span className="font-semibold">₹{orderTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2" style={{ color: T.maroon, borderTop: `1px solid ${T.borderSoft}` }}><span>Total</span><span>₹{orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                </div>
              </div>
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
              <button className="btn-maroon" disabled={!orderForm.customerName || orderSubtotal === 0 || saving} onClick={handleSubmitOrder}>{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : isEditMode ? <><CheckCircle className="w-4 h-4" />Update</> : <><CheckCircle className="w-4 h-4" />Save</>}</button>
            </div>
          </div>
        </div>
      )}

      {/* CHALLAN FORM */}
      {showChallanForm && selectedOrder && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in" style={{ maxWidth: 950 }}>
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{ background: T.cream, color: T.maroon, border: `2px solid ${T.borderSoft}` }}>2</div>
                <div><h3 className="font-bold text-base m-0" style={{ color: T.textDark }}>Delivery Challan</h3><p className="text-xs m-0" style={{ color: T.textMuted }}>{selectedOrder.orderNo} — {selectedOrder.customerName}</p></div>
              </div>
              <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="kt-mbody space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Date</label><input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} /></div>
                <div><label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Note</label><input className="kt-input" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} /></div>
                <div className="flex items-center gap-3 pt-5"><input type="checkbox" id="hp" checked={hidePriceOnChallan} onChange={e => setHidePriceOnChallan(e.target.checked)} style={{ width: 18, height: 18, accentColor: darkMode?'#e8a0a0':LIGHT.maroon }} /><label htmlFor="hp" className="text-sm cursor-pointer flex items-center gap-2" style={{ color: T.textDark }}><EyeOff className="w-4 h-4" style={{ color: T.maroon }} />Hide Price</label></div>
              </div>
              {(selectedOrder.poNumber || selectedOrder.gstCustomerName) && <div className="flex gap-3 flex-wrap">{selectedOrder.poNumber && <div className="text-xs px-3 py-2 rounded-lg" style={{ background: T.infoBg, color: T.infoColor, border: `1px solid ${T.infoBorder}` }}><strong>PO:</strong> {selectedOrder.poNumber}</div>}{selectedOrder.gstCustomerName && <div className="text-xs px-3 py-2 rounded-lg" style={{ background: T.purpleBg, color: T.purpleColor, border: `1px solid ${T.purpleBorder}` }}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}</div>}
              <div>
                <p className="sec-label">Items</p>
                <div className="kt-inset">
                  <div className="overflow-x-auto">
                    <table className="kt-tbl">
                      <thead><tr><th>Item Description</th><th className="c" style={{ width: 55 }}>Unit</th><th className="r" style={{ width: 80 }}>Ordered</th><th className="r" style={{ width: 80 }}>Sent</th><th className="r" style={{ width: 80 }}>Left</th><th className="r" style={{ width: 90 }}>Sending</th><th className="r" style={{ width: 90 }}>Calc Qty</th></tr></thead>
                      <tbody>
                        {challanItems.map(it => {
                          const rem = it.orderedQty - it.alreadySent;
                          return (
                            <tr key={it.uid}>
                              <td className="font-medium">{it.product}{it.isWood && <><span className="unit-badge wood-badge ml-2">🪵</span>{(it.size || it.lengthDisplay) && <div className="text-xs mt-1" style={{ color: T.textMuted }}>{[it.size, it.lengthDisplay].filter(Boolean).join(' · ')}</div>}</>}</td>
                              <td className="c text-xs" style={{ color: T.textMuted }}>{it.unit}</td>
                              <td className="r" style={{ color: T.textDark }}>{it.orderedQty.toFixed(3)}</td>
                              <td className="r font-semibold" style={{ color: T.maroon }}>{it.alreadySent ? it.alreadySent.toFixed(3) : '—'}</td>
                              <td className="r font-bold" style={{ color: rem <= 0.001 ? T.successColor : T.textDark }}>{rem <= 0.001 ? '✓' : rem.toFixed(3)}</td>
                              <td><input type="number" min="0" className="kt-input" style={{ padding: '8px', fontSize: 13, textAlign: 'right', background: rem <= 0.001 ? T.cream : undefined }} value={it.sendingPcs} disabled={rem <= 0.001} onChange={e => updateChallanItem(it.uid, 'sendingPcs', e.target.value)} /></td>
                              <td className="r font-bold" style={{ color: T.maroon }}>{it.sendingQty ? it.sendingQty.toFixed(3) : '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {!hidePriceOnChallan && <div className="flex justify-end"><div className="total-box" style={{ minWidth: 240, background: T.cream, borderColor: T.borderSoft }}><div className="flex justify-between font-bold text-base" style={{ color: T.maroon }}><span>Total</span><span>₹{challanItems.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div></div></div>}
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
              <button className="btn-maroon" disabled={saving} onClick={handleSubmitChallan}>{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Save Challan</>}</button>
            </div>
          </div>
        </div>
      )}

      {/* CHALLAN SUCCESS */}
      {showChallanSuccess && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in" style={{ maxWidth: 480 }}>
            <div className="kt-mbody" style={{ textAlign: 'center', padding: '40px 30px' }}>
              <div className="success-icon"><CheckCircle style={{ width: 32, height: 32, color: T.successColor }} /></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: T.textDark, marginBottom: 6 }}>Challan Created!</h3>
              <p style={{ fontSize: 14, color: T.maroon, marginBottom: 6, fontWeight: 600 }}>{lastChallanNo}</p>
              <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>Ab aap view, print ya save kar sakte hain</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-teal" onClick={() => { openPDFView(lastChallanHTML); }}><Eye className="w-4 h-4" />View PDF</button>
                <button className="btn-maroon" onClick={() => { openPDFPrint(lastChallanHTML); }}><Printer className="w-4 h-4" />Print</button>
                <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => { const win = window.open('', '_blank'); const cleanHTML = lastChallanHTML.replace(/<div class="action-bar">[\s\S]*?<\/div>/, ''); win.document.write(cleanHTML); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); }}><Download className="w-4 h-4" />Save PDF</button>
              </div>
            </div>
            <div className="kt-mfoot" style={{ justifyContent: 'center' }}>
              <button className="btn-white" onClick={() => setShowChallanSuccess(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL BILL */}
      {showBillPreview && selectedOrder && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in" style={{ maxWidth: 800 }}>
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{ background: T.successBg, color: T.successColor }}>3</div>
                <div><h3 className="font-bold text-base m-0" style={{ color: T.textDark }}>Final Invoice</h3><p className="text-xs m-0" style={{ color: T.textMuted }}>{selectedOrder.orderNo}</p></div>
              </div>
              <button className="icon-btn" onClick={() => setShowBillPreview(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="kt-mbody">
              {(() => {
                const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo);
                const m = {};
                oc.forEach(ch => ch.items?.forEach(it => { const key = it.product + '|' + (it.size || '') + '|' + (it.lengthDisplay || ''); if (!m[key]) m[key] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, size: it.size || '', lengthDisplay: it.lengthDisplay || '' }; m[key].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0); m[key].totalAmount += parseFloat(it.amount || 0); }));
                const li = Object.values(m);
                const sub = li.reduce((s, i) => s + i.totalAmount, 0);
                const gstRate = selectedOrder.gstRate || 0;
                const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
                const total = sub + tax;
                return (
                  <div className="space-y-4">
                    <div className="flex gap-3 flex-wrap">
                      <div className="text-xs px-4 py-2.5 rounded-xl flex-1" style={{ background: T.cream, color: T.maroon, border: `1px solid ${T.borderSoft}` }}><strong>Challans: </strong>{oc.length ? oc.map(c => c.challanNo).join(', ') : 'None'}</div>
                      {selectedOrder.poNumber && <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: T.infoBg, color: T.infoColor, border: `1px solid ${T.infoBorder}` }}><strong>PO:</strong> {selectedOrder.poNumber}</div>}
                      {selectedOrder.gstCustomerName && <div className="text-xs px-3 py-2.5 rounded-xl" style={{ background: T.purpleBg, color: T.purpleColor, border: `1px solid ${T.purpleBorder}` }}><strong>GST:</strong> {selectedOrder.gstCustomerName}</div>}
                    </div>
                    <div className="kt-inset">
                      <table className="kt-tbl">
                        <thead><tr><th style={{ width: 30 }}>#</th><th>Item Description</th><th className="r" style={{ width: 80 }}>Qty</th><th className="r" style={{ width: 80 }}>Rate</th><th className="r" style={{ width: 100 }}>Amount</th></tr></thead>
                        <tbody>
                          {li.map((it, i) => (
                            <tr key={i}>
                              <td className="c text-xs" style={{ color: T.textMuted }}>{i + 1}</td>
                              <td className="font-medium">{it.product}{(it.size || it.lengthDisplay) && <div className="text-xs mt-0.5" style={{ color: T.textMuted }}>{[it.size, it.lengthDisplay].filter(x => x && x !== "0'-0\"").join(' · ')}</div>}</td>
                              <td className="r font-semibold" style={{ color: T.maroon }}>{it.totalQty.toFixed(3)} <span className="text-xs" style={{ color: T.textMuted }}>{it.unit}</span></td>
                              <td className="r" style={{ color: T.textMuted }}>₹{parseFloat(it.rate || 0).toLocaleString('en-IN')}</td>
                              <td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end">
                      <div className="total-box" style={{ width: 280, background: T.successBg, borderColor: T.successBorder }}>
                        <div className="flex justify-between text-sm mb-1.5" style={{ color: T.textMuted }}><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                        {gstRate > 0 && <div className="flex justify-between text-sm mb-1.5" style={{ color: T.textMuted }}><span>GST ({gstRate}%)</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
                        <div className="flex justify-between font-bold text-base pt-2" style={{ color: T.successColor, borderTop: `1px solid ${T.successBorder}` }}><span>Grand Total</span><span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={() => setShowBillPreview(false)}>Close</button>
              <button className="btn-teal" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFView(getBillPrintHTML(selectedOrder, oc)); }}><Eye className="w-4 h-4" />View</button>
              <button className="btn-maroon" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFPrint(getBillPrintHTML(selectedOrder, oc)); }}><Printer className="w-4 h-4" />Print</button>
              <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); const html = getBillPrintHTML(selectedOrder, oc).replace(/<div class="action-bar">[\s\S]*?<\/div>/, ''); const win = window.open('', '_blank'); win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 600); }}><Download className="w-4 h-4" />Save PDF</button>
              {selectedOrder.status === 'Completed' && <button className="btn-green" onClick={() => { const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo); openPDFPrint(getBillPrintHTML(selectedOrder, oc)); markBilled(selectedOrder.orderNo); }}><Receipt className="w-4 h-4" />Mark Billed</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}