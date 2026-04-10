

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import {
//   Plus, Trash2, Printer, Search, CheckCircle, Eye,
//   AlertTriangle, Loader2, RefreshCw,
//   X, TruckIcon, Receipt, ArrowRight, EyeOff
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

// // ✅ Unit Options
// const UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];

// function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

// function parseWoodDimensions(name) {
//   if (!name) return null;
//   const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
//   if (match) {
//     let width = parseFloat(match[1]);
//     let thickness = match[2];
    
//     if (thickness.includes('½')) thickness = parseFloat(thickness.replace('½', '')) + 0.5 || 0.5;
//     else if (thickness.includes('¼')) thickness = parseFloat(thickness.replace('¼', '')) + 0.25 || 0.25;
//     else if (thickness.includes('¾')) thickness = parseFloat(thickness.replace('¾', '')) + 0.75 || 0.75;
//     else thickness = parseFloat(thickness);
    
//     return { width, thickness };
//   }
//   return null;
// }

// function calculateCFT(width, thickness, lengthFeet, lengthInches, qty) {
//   const totalLengthFeet = parseFloat(lengthFeet || 0) + (parseFloat(lengthInches || 0) / 12);
//   const cft = (width * thickness * totalLengthFeet * qty) / 144;
//   return Math.round(cft * 1000) / 1000;
// }

// function numberToWords(num) {
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
//   if (num === 0) return 'Zero';
//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n/10)] + (n%10?' '+ones[n%10]:'');
//     if (n < 1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+convert(n%100):'');
//     if (n < 100000) return convert(Math.floor(n/1000))+' Thousand'+(n%1000?' '+convert(n%1000):'');
//     if (n < 10000000) return convert(Math.floor(n/100000))+' Lakh'+(n%100000?' '+convert(n%100000):'');
//     return convert(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+convert(n%10000000):'');
//   }
//   const i=Math.floor(num), d=Math.round((num-i)*100);
//   return convert(i)+' Rupees'+(d>0?' and '+convert(d)+' Paise':'')+' Only';
// }

// const PRINT_SHARED_CSS = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;color:#000;background:#fff;-webkit-print-color-adjust:exact}.page{max-width:210mm;margin:0 auto;padding:15mm}.hdr{border:2px solid #000;padding:12px 16px;margin-bottom:10px}.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid #000;margin-bottom:8px}h1{font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:3px}.box{border:2px solid #000;padding:8px 12px;text-align:right;min-width:170px}.gr{display:flex;justify-content:space-between;font-size:9px;font-weight:bold}.sec{border:2px solid #000;margin-bottom:10px}.sh{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}.cb{display:flex}.bt,.st{flex:1;padding:10px 12px}.bt{border-right:1px solid #000}.lbl{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;text-decoration:underline}.cn{font-size:13px;font-weight:bold;margin-bottom:3px}.cd{font-size:10px;line-height:1.5}.mg{display:grid;grid-template-columns:auto 1fr;gap:3px 8px;font-size:9px}.mg .ml{font-weight:bold}table{width:100%;border-collapse:collapse;border:2px solid #000;margin-bottom:10px}thead tr{background:#000;color:#fff}th{padding:7px 8px;font-size:9px;font-weight:bold;text-transform:uppercase;text-align:left;border-right:1px solid #fff}th:last-child{border-right:none}th.r{text-align:right}th.c{text-align:center}tbody tr{border-bottom:1px solid #000}td{padding:6px 8px;font-size:11px;border-right:1px solid #ddd}td:last-child{border-right:none}td.r{text-align:right}td.c{text-align:center}.tots{display:flex;gap:12px;margin-bottom:10px}.aw{flex:1;border:2px solid #000;padding:10px 12px}.awl{font-size:8px;font-weight:bold;text-transform:uppercase;margin-bottom:4px}.awt{font-size:11px;font-weight:bold;font-style:italic}.tb{width:220px;border:2px solid #000}.tr_{display:flex;justify-content:space-between;padding:5px 12px;font-size:11px;border-bottom:1px solid #ddd}.tf{background:#000;color:#fff;display:flex;justify-content:space-between;padding:7px 12px;font-size:12px;font-weight:bold}.ftr{border:2px solid #000;padding:10px 12px}.fg{display:flex;justify-content:space-between;gap:20px}.terms{flex:1;font-size:9px;line-height:1.7}.sig{width:190px;text-align:center}.stamp{border:2px dashed #000;padding:7px 14px;margin-bottom:28px;font-size:9px;font-weight:bold;text-transform:uppercase}.sl{width:100%;border-top:1px solid #000;margin-bottom:5px}.slbl{font-size:9px;font-weight:bold}.ty{border:2px solid #000;padding:8px;margin-top:10px;text-align:center}@media print{.page{padding:10mm}}@page{size:A4;margin:10mm}`;

// const getChallanPrintHTML = (order, challan, hidePrice = false) => {
//   const challanTotal = challan.items.reduce((s, it) => s + (parseFloat(it.sentQty || 0) * parseFloat(it.rate || 0)), 0);
  
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_SHARED_CSS}</style></head><body><div class="page">
//   <div class="hdr">
//     <div class="hdr-top">
//       <div>
//         <h1>${SHOP_INFO.name}</h1>
//         <p style="font-size:10px">${SHOP_INFO.address}</p>
//         <p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p>
//       </div>
//       <div class="box">
//         <div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Delivery Challan</div>
//         <div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">${challan.challanNo}</div>
//         <div style="font-size:9px">Date: ${new Date(challan.challanDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
//         <div style="font-size:9px;margin-top:2px">Ref: ${order.orderNo}</div>
//       </div>
//     </div>
//     <div class="gr">
//       <span>GSTIN: ${SHOP_INFO.gstin}</span>
//       <span>PAN: XXXXX1234X</span>
//     </div>
//   </div>
  
//   <div class="sec">
//     <div class="sh">Customer Details</div>
//     <div class="cb">
//       <div class="bt">
//         <div class="lbl">Bill To</div>
//         <div class="cn">${order.customerName}</div>
//         <div class="cd">${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br>' : ''}${order.customerAddress || ''}</div>
//       </div>
//       <div class="st">
//         <div class="lbl">Challan Info</div>
//         <div class="mg">
//           <span class="ml">Challan No:</span><span>${challan.challanNo}</span>
//           <span class="ml">Date:</span><span>${new Date(challan.challanDate).toLocaleDateString('en-IN')}</span>
//           <span class="ml">Order Ref:</span><span>${order.orderNo}</span>
//           <span class="ml">Note:</span><span>${challan.deliveryNote || '—'}</span>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <table>
//     <thead>
//       <tr>
//         <th style="width:30px">#</th>
//         <th>Item</th>
//         <th class="c" style="width:70px">Size</th>
//         <th class="c" style="width:60px">Length</th>
//         <th class="r" style="width:50px">Pcs</th>
//         <th class="r" style="width:50px">CFT</th>
//         <th class="c" style="width:55px">Unit</th>
//         ${!hidePrice ? '<th class="r" style="width:70px">Rate (₹)</th><th class="r" style="width:80px">Amount (₹)</th>' : ''}
//       </tr>
//     </thead>
//     <tbody>
//       ${challan.items.map((it, i) => `
//         <tr>
//           <td class="c">${i + 1}</td>
//           <td><strong>${it.product}</strong></td>
//           <td class="c">${it.size || '—'}</td>
//           <td class="c">${it.lengthDisplay || '—'}</td>
//           <td class="r">${it.sentQty}</td>
//           <td class="r">${it.cft ? parseFloat(it.cft).toFixed(3) : '—'}</td>
//           <td class="c">${it.unit}</td>
//           ${!hidePrice ? `<td class="r">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//           <td class="r"><strong>${(parseFloat(it.sentQty || 0) * parseFloat(it.rate || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>` : ''}
//         </tr>
//       `).join('')}
//     </tbody>
//   </table>
  
//   ${!hidePrice ? `
//   <div class="tots">
//     <div class="aw">
//       <div class="awl">Amount in Words</div>
//       <div class="awt">${numberToWords(challanTotal)}</div>
//     </div>
//     <div class="tb">
//       <div class="tr_"><span>Subtotal:</span><span>₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//       <div class="tf"><span>CHALLAN TOTAL</span><span>₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//     </div>
//   </div>
//   ` : '<div style="text-align:center;padding:20px;border:2px solid #000;margin-bottom:10px;font-weight:bold;">DELIVERY CHALLAN - FOR GOODS REFERENCE ONLY</div>'}
  
//   <div class="ftr">
//     <div class="fg">
//       <div class="terms">
//         <strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>
//         • Goods dispatched will not be returned without prior approval.<br>
//         • Verify items on receipt; report discrepancies within 24 hours.<br>
//         • This is a delivery challan — not a tax invoice.<br>
//         • All disputes subject to Bhopal jurisdiction only.
//       </div>
//       <div class="sig">
//         <div class="stamp">For ${SHOP_INFO.name}</div>
//         <div class="sl"></div>
//         <div class="slbl">Authorized Signatory</div>
//       </div>
//     </div>
//     <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end">
//       <div>
//         <div class="sl" style="width:180px"></div>
//         <div class="slbl">Customer Signature</div>
//       </div>
//       <div style="font-size:9px">Received goods in good condition</div>
//     </div>
//   </div>
  
//   <div class="ty"><strong>Delivery Challan — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div>
// </div></body></html>`;
// };

// const getBillPrintHTML = (order, challans) => {
//   const m = {};
//   challans.forEach(ch => ch.items.forEach(it => {
//     if (!m[it.product]) m[it.product] = { product: it.product, unit: it.unit, rate: it.rate, totalSentQty: 0, totalAmount: 0, size: it.size, cft: 0 };
//     m[it.product].totalSentQty += parseFloat(it.sentQty || 0);
//     m[it.product].totalAmount += parseFloat(it.sentQty || 0) * parseFloat(it.rate || 0);
//     m[it.product].cft += parseFloat(it.cft || 0);
//   }));
  
//   const li = Object.values(m);
//   const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//   const gstRate = order.gstRate || 0;
//   const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
//   const total = sub + tax;
  
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice INV-${order.orderNo}</title><style>${PRINT_SHARED_CSS}
//   .cref{border:2px solid #000;padding:8px 12px;margin-bottom:10px;font-size:10px}
//   .gst-s{border:2px solid #000;margin-bottom:10px}
//   .gst-h{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase}
//   .gst-t{width:100%;border-collapse:collapse}
//   .gst-t th{background:#f0f0f0;padding:6px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #000;border-right:1px solid #ddd}
//   .gst-t td{padding:6px 8px;font-size:10px;border-right:1px solid #ddd}
//   </style></head><body><div class="page">
  
//   <div class="hdr">
//     <div class="hdr-top">
//       <div>
//         <h1>${SHOP_INFO.name}</h1>
//         <p style="font-size:10px">${SHOP_INFO.address}</p>
//         <p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p>
//       </div>
//       <div class="box">
//         <div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Tax Invoice</div>
//         <div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">INV-${order.orderNo}</div>
//         <div style="font-size:9px">Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
//       </div>
//     </div>
//     <div class="gr">
//       <span>GSTIN: ${SHOP_INFO.gstin}</span>
//       <span>PAN: XXXXX1234X</span>
//     </div>
//   </div>
  
//   <div class="sec">
//     <div class="sh">Customer & Invoice Details</div>
//     <div class="cb">
//       <div class="bt">
//         <div class="lbl">Bill To</div>
//         <div class="cn">${order.customerName}</div>
//         <div class="cd">${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br>' : ''}${order.customerAddress || ''}</div>
//       </div>
//       <div class="st">
//         <div class="lbl">Invoice Information</div>
//         <div class="mg">
//           <span class="ml">Order No:</span><span>${order.orderNo}</span>
//           <span class="ml">Challans:</span><span>${challans.map(c => c.challanNo).join(', ')}</span>
//           <span class="ml">Items:</span><span>${li.length}</span>
//           <span class="ml">GST:</span><span>${gstRate > 0 ? gstRate + '% Included' : 'N/A'}</span>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <div class="cref"><strong>Challan References: </strong>${challans.map(c => `${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}</div>
  
//   <table>
//     <thead>
//       <tr>
//         <th style="width:30px">#</th>
//         <th>Item</th>
//         <th class="c" style="width:55px">Unit</th>
//         <th class="r" style="width:50px">Qty</th>
//         <th class="r" style="width:50px">CFT</th>
//         <th class="r" style="width:70px">Rate (₹)</th>
//         <th class="r" style="width:80px">Amount (₹)</th>
//       </tr>
//     </thead>
//     <tbody>
//       ${li.map((it, i) => `
//         <tr>
//           <td class="c">${i + 1}</td>
//           <td><strong>${it.product}</strong></td>
//           <td class="c">${it.unit}</td>
//           <td class="r"><strong>${it.totalSentQty}</strong></td>
//           <td class="r">${it.cft ? it.cft.toFixed(3) : '—'}</td>
//           <td class="r">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//           <td class="r"><strong>${it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
//         </tr>
//       `).join('')}
//     </tbody>
//   </table>
  
//   <div class="tots">
//     <div class="aw">
//       <div class="awl">Amount in Words</div>
//       <div class="awt">${numberToWords(total)}</div>
//     </div>
//     <div class="tb">
//       <div class="tr_"><span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//       ${gstRate > 0 ? `
//         <div class="tr_"><span>CGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span></div>
//         <div class="tr_"><span>SGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span></div>
//       ` : ''}
//       <div class="tr_"><span>Discount:</span><span>₹0.00</span></div>
//       <div class="tf"><span>GRAND TOTAL</span><span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
//     </div>
//   </div>
  
//   ${gstRate > 0 ? `
//   <div class="gst-s">
//     <div class="gst-h">GST Tax Breakup</div>
//     <table class="gst-t">
//       <thead>
//         <tr>
//           <th>Taxable</th>
//           <th>CGST Rate</th>
//           <th>CGST Amt</th>
//           <th>SGST Rate</th>
//           <th>SGST Amt</th>
//           <th>Total Tax</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>₹${sub.toFixed(2)}</td>
//           <td>${gstRate / 2}%</td>
//           <td>₹${(tax / 2).toFixed(2)}</td>
//           <td>${gstRate / 2}%</td>
//           <td>₹${(tax / 2).toFixed(2)}</td>
//           <td><strong>₹${tax.toFixed(2)}</strong></td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
//   ` : ''}
  
//   <div class="ftr">
//     <div class="fg">
//       <div class="terms">
//         <strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>
//         • Goods once sold will not be taken back or exchanged.<br>
//         • Payment due on receipt of invoice.<br>
//         • Interest @ 18% p.a. on overdue amounts.<br>
//         • All disputes subject to Bhopal jurisdiction only.<br>
//         • E. & O.E.
//       </div>
//       <div class="sig">
//         <div class="stamp">For ${SHOP_INFO.name}</div>
//         <div class="sl"></div>
//         <div class="slbl">Authorized Signatory</div>
//       </div>
//     </div>
//     <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end">
//       <div>
//         <div class="sl" style="width:180px"></div>
//         <div class="slbl">Customer Signature</div>
//       </div>
//       <div style="font-size:9px">Received goods in good condition</div>
//     </div>
//   </div>
  
//   <div class="ty"><strong>Thank You for Your Business! — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div>
// </div></body></html>`;
// };

// const apiGet = async (url) => {
//   try {
//     const res = await fetch(url);
//     if (!res.ok) return { success: false, data: [] };
//     return await res.json();
//   } catch (err) {
//     console.error(`API Error ${url}:`, err);
//     return { success: false, data: [] };
//   }
// };

// const apiPost = async (url, body) => {
//   try {
//     const res = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     });
//     return await res.json();
//   } catch (err) {
//     return { success: false, error: err.message };
//   }
// };

// const apiPatch = async (url, body) => {
//   try {
//     const res = await fetch(url, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     });
//     return await res.json();
//   } catch (err) {
//     return { success: false, error: err.message };
//   }
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
//   const [filterStatus, setFilterStatus] = useState('All');

//   const [selectedMaterialType, setSelectedMaterialType] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');

//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [showChallanForm, setShowChallanForm] = useState(false);
//   const [showBillPreview, setShowBillPreview] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [orderForm, setOrderForm] = useState({
//     customerName: '', customerPhone: '', customerAddress: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     gstRate: 0,
//     notes: '',
//   });

//   const [orderItems, setOrderItems] = useState([{
//     uid: uid(),
//     product: '',
//     unit: 'CFT',
//     lengthFeet: '',
//     lengthInches: '',
//     quantity: '',
//     rate: '',
//     amount: 0,
//     skuCode: '',
//     isWood: false,
//     width: 0,
//     thickness: 0,
//     cft: 0,
//     size: '',
//     materialType: '',
//     category: '',
//     subCategory: '',
//   }]);

//   const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
//   const [challanItems, setChallanItems] = useState([]);
//   const [deliveryNote, setDeliveryNote] = useState('');
//   const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const ordersRes = await apiGet('/api/billing-backend/orders');
//       setOrders(ordersRes.success ? ordersRes.data || [] : []);

//       const challansRes = await apiGet('/api/billing-backend/challans');
//       setChallans(challansRes.success ? challansRes.data || [] : []);

//       const productsRes = await apiGet('/api/dropdown-data');
//       if (productsRes.success && productsRes.data) {
//         setProducts(productsRes.data);
//       } else {
//         setProducts([]);
//       }
//     } catch (err) {
//       console.error('FetchData Error:', err);
//       setError('Data load mein problem');
//     }

//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const materialTypes = [...new Set(products.map(p => p.materialType).filter(Boolean))];
  
//   const categories = [...new Set(
//     products
//       .filter(p => !selectedMaterialType || p.materialType === selectedMaterialType)
//       .map(p => p.category)
//       .filter(Boolean)
//   )];
  
//   const subCategories = [...new Set(
//     products
//       .filter(p => 
//         (!selectedMaterialType || p.materialType === selectedMaterialType) &&
//         (!selectedCategory || p.category === selectedCategory)
//       )
//       .map(p => p.subCategory)
//       .filter(Boolean)
//   )];

//   const filteredProducts = products.filter(p => {
//     if (selectedMaterialType && p.materialType !== selectedMaterialType) return false;
//     if (selectedCategory && p.category !== selectedCategory) return false;
//     if (selectedSubCategory && p.subCategory !== selectedSubCategory) return false;
//     return true;
//   });

//   const isWoodMaterial = (item) => {
//     if (!item) return false;
//     const materialType = (item.materialType || '').toLowerCase();
//     const category = (item.category || '').toLowerCase();
    
//     return materialType.includes('timber') ||
//       materialType.includes('wood') ||
//       category.includes('teak') ||
//       category.includes('pine') ||
//       category.includes('sal');
//   };

//   const addOrderItem = () => setOrderItems(p => [...p, {
//     uid: uid(), product: '', unit: 'CFT', lengthFeet: '', lengthInches: '',
//     quantity: '', rate: '', amount: 0, skuCode: '', isWood: false,
//     width: 0, thickness: 0, cft: 0, size: '', materialType: '', category: '', subCategory: '',
//   }]);

//   const removeOrderItem = id => {
//     if (orderItems.length === 1) return;
//     setOrderItems(p => p.filter(i => i.uid !== id));
//   };

//   // ✅ Updated: Unit separately changeable
//   const updateOrderItem = (id, field, val) => setOrderItems(prev => prev.map(item => {
//     if (item.uid !== id) return item;
//     const u = { ...item, [field]: val };

//     // When product selected
//     if (field === 'skuCode') {
//       const f = products.find(p => p.skuCode === val);
//       if (f) {
//         u.product = f.materialName;
//         u.unit = f.unit || 'CFT'; // Default unit from sheet
//         u.skuCode = f.skuCode;
//         u.materialType = f.materialType;
//         u.category = f.category;
//         u.subCategory = f.subCategory;
//         u.isWood = isWoodMaterial(f);

//         const dims = parseWoodDimensions(f.materialName);
//         if (dims) {
//           u.width = dims.width;
//           u.thickness = dims.thickness;
//           u.size = `${dims.width}×${dims.thickness}"`;
//         } else {
//           u.width = 0;
//           u.thickness = 0;
//           u.size = '';
//         }
//       }
//     }

//     // Calculate CFT and amount
//     if (u.isWood && u.width && u.thickness) {
//       u.cft = calculateCFT(u.width, u.thickness, u.lengthFeet, u.lengthInches, u.quantity || 1);
//       u.amount = u.cft * parseFloat(u.rate || 0);
//     } else {
//       u.amount = parseFloat(u.quantity || 0) * parseFloat(u.rate || 0);
//     }

//     return u;
//   }));

//   const orderSubtotal = orderItems.reduce((s, i) => s + (i.amount || 0), 0);
//   const orderTax = orderForm.gstRate > 0 ? orderSubtotal * (orderForm.gstRate / 100) : 0;
//   const orderTotal = orderSubtotal + orderTax;

//   const genOrderNo = () => {
//     const y = new Date().getFullYear();
//     const px = `ORD-${y}-`;
//     const max = orders.filter(o => o.orderNo?.startsWith(px)).reduce((m, o) => {
//       const n = parseInt(o.orderNo?.replace(px, '') || '0');
//       return n > m ? n : m;
//     }, 0);
//     return `${px}${String(max + 1).padStart(4, '0')}`;
//   };

//   const genChallanNo = () => {
//     const y = new Date().getFullYear();
//     const px = `CHL-${y}-`;
//     const max = challans.filter(c => c.challanNo?.startsWith(px)).reduce((m, c) => {
//       const n = parseInt(c.challanNo?.replace(px, '') || '0');
//       return n > m ? n : m;
//     }, 0);
//     return `${px}${String(max + 1).padStart(4, '0')}`;
//   };

//   const handleSubmitOrder = async () => {
//     if (!orderForm.customerName || orderSubtotal === 0) {
//       setError('Customer name aur items required hain');
//       return;
//     }
//     setSaving(true);
//     setError(null);
//     try {
//       const orderNo = genOrderNo();
//       const validItems = orderItems.filter(i => i.product && (i.quantity || i.cft));

//       const r = await apiPost('/api/billing-backend/orders', {
//         order: {
//           ...orderForm,
//           orderNo,
//           subtotal: orderSubtotal,
//           tax: orderTax,
//           total: orderTotal,
//           status: 'Active'
//         },
//         items: validItems.map(it => ({
//           ...it,
//           lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
//         }))
//       });

//       if (!r.success) {
//         setError(r.message || r.error || 'Order save fail');
//         return;
//       }

//       await fetchData();
//       setShowOrderForm(false);
//       resetOrderForm();
//     } catch (err) {
//       setError('Order save error: ' + err.message);
//     }
//     finally { setSaving(false); }
//   };

//   const resetOrderForm = () => {
//     setOrderForm({
//       customerName: '', customerPhone: '', customerAddress: '',
//       orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: ''
//     });
//     setOrderItems([{
//       uid: uid(), product: '', unit: 'CFT', lengthFeet: '', lengthInches: '',
//       quantity: '', rate: '', amount: 0, skuCode: '', isWood: false,
//       width: 0, thickness: 0, cft: 0, size: '', materialType: '', category: '', subCategory: ''
//     }]);
//     setSelectedMaterialType('');
//     setSelectedCategory('');
//     setSelectedSubCategory('');
//   };

//   const openChallanForm = order => {
//     setSelectedOrder(order);
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => {
//       sm[it.product] = (sm[it.product] || 0) + parseFloat(it.sentQty || 0);
//     }));

//     setChallanItems((order.items || []).map(it => ({
//       uid: uid(),
//       product: it.product || it.itemName,
//       unit: it.unit,
//       rate: parseFloat(it.rate || 0),
//       orderedQty: parseFloat(it.quantity || it.cft || 0),
//       alreadySent: parseFloat(sm[it.product || it.itemName] || 0),
//       sentQty: Math.max(0, parseFloat(it.quantity || it.cft || 0) - parseFloat(sm[it.product || it.itemName] || 0)),
//       size: it.size || '',
//       lengthFeet: it.lengthFeet || '',
//       lengthInches: it.lengthInches || '',
//       lengthDisplay: it.lengthDisplay || '',
//       cft: parseFloat(it.cft || 0),
//       isWood: it.isWood || false,
//     })));

//     setChallanDate(new Date().toISOString().split('T')[0]);
//     setDeliveryNote('');
//     setHidePriceOnChallan(false);
//     setShowChallanForm(true);
//   };

//   const handleSubmitChallan = async () => {
//     const valid = challanItems.filter(i => parseFloat(i.sentQty) > 0);
//     if (!valid.length) { setError('Kam se kam ek item ki qty daalo.'); return; }
//     setSaving(true);
//     setError(null);
//     try {
//       const challanNo = genChallanNo();
//       const challanTotal = valid.reduce((s, it) => s + (parseFloat(it.sentQty || 0) * parseFloat(it.rate || 0)), 0);

//       const payload = {
//         challan: {
//           challanNo,
//           orderNo: selectedOrder.orderNo,
//           customerName: selectedOrder.customerName,
//           challanDate,
//           deliveryNote,
//           challanTotal,
//           status: 'Delivered',
//           hidePrice: hidePriceOnChallan,
//         },
//         items: valid.map(it => ({
//           product: it.product,
//           unit: it.unit,
//           orderedQty: it.orderedQty,
//           sentQty: parseFloat(it.sentQty),
//           rate: it.rate,
//           amount: parseFloat(it.sentQty) * it.rate,
//           size: it.size,
//           lengthDisplay: it.lengthDisplay,
//           cft: it.cft,
//         }))
//       };

//       const r = await apiPost('/api/billing-backend/challans', payload);
//       if (!r.success) { setError(r.message || r.error || 'Challan save fail'); return; }

//       const allC = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//       const tsm = {};
//       [...allC, { items: valid.map(it => ({ product: it.product, sentQty: parseFloat(it.sentQty) })) }]
//         .forEach(ch => ch.items?.forEach(it => { tsm[it.product] = (tsm[it.product] || 0) + parseFloat(it.sentQty || 0); }));
//       const done = (selectedOrder.items || []).every(oi =>
//         (tsm[oi.product || oi.itemName] || 0) >= parseFloat(oi.quantity || oi.cft || 0)
//       );
//       if (done) await apiPatch('/api/billing-backend/orders', { orderNo: selectedOrder.orderNo, status: 'Completed' });

//       const win = window.open('', '_blank');
//       win.document.write(getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan));
//       win.document.close();
//       setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);

//       await fetchData();
//       setShowChallanForm(false);
//     } catch (err) {
//       setError('Challan save error: ' + err.message);
//     }
//     finally { setSaving(false); }
//   };

//   const printFinalBill = order => {
//     const oc = challans.filter(c => c.orderNo === order.orderNo);
//     const win = window.open('', '_blank');
//     win.document.write(getBillPrintHTML(order, oc));
//     win.document.close();
//     setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);
//   };

//   const markBilled = async orderNo => {
//     await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Billed' });
//     await fetchData();
//     setShowBillPreview(false);
//   };

//   const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);

//   const getDeliveryProgress = order => {
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => {
//       sm[it.product] = (sm[it.product] || 0) + parseFloat(it.sentQty || 0);
//     }));
//     const items = order.items || [];
//     if (!items.length) return 0;
//     const tot = items.reduce((s, it) => s + parseFloat(it.quantity || it.cft || 0), 0);
//     const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.quantity || it.cft || 0), sm[it.product || it.itemName] || 0), 0);
//     return tot > 0 ? Math.round((sent / tot) * 100) : 0;
//   };

//   const filteredOrders = orders.filter(o => {
//     const ms = o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       o.orderNo?.toLowerCase().includes(searchQuery.toLowerCase());
//     const mst = filterStatus === 'All' || o.status === filterStatus;
//     return ms && mst;
//   });

//   const STATUS = {
//     Active: { bg: '#fef3c7', color: '#92400e', dot: '#d97706' },
//     Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
//     Billed: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-96 flex-col gap-3">
//       <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
//       <p className="text-gray-400 text-sm">Data load ho raha hai...</p>
//     </div>
//   );

//   return (
//     <div>
//       <style jsx global>{`
//         @keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
//         .kt-in{animation:kt-in .28s ease-out}
//         .kt-input{width:100%;padding:9px 13px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;background:#fff;color:#111827;outline:none;transition:border-color .14s,box-shadow .14s}
//         .kt-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}
//         .kt-input[readonly]{background:#f9fafb;color:#9ca3af}
//         .kt-input-sm{padding:7px 10px;font-size:12px}
//         .btn-amber{padding:9px 20px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 6px rgba(180,83,9,.28)}
//         .btn-amber:hover{background:linear-gradient(135deg,#92400e,#b45309);box-shadow:0 4px 14px rgba(180,83,9,.38);transform:translateY(-1px)}
//         .btn-amber:disabled{opacity:.5;cursor:not-allowed;transform:none}
//         .btn-white{padding:9px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:#374151;display:inline-flex;align-items:center;gap:6px;transition:all .14s}
//         .btn-white:hover{background:#f9fafb;border-color:#d1d5db}
//         .btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .14s}
//         .btn-green:hover{opacity:.9}
//         .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:#9ca3af}
//         .icon-btn:hover{background:#f3f4f6;color:#374151}
//         .kt-card{background:#fff;border:1px solid #f0f0f0;border-radius:16px;box-shadow:0 1px 5px rgba(0,0,0,.05)}
//         .kt-inset{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
//         .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:#6b7280}
//         .kt-tab.active{background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;box-shadow:0 1px 4px rgba(217,119,6,.18)}
//         .kt-tab:hover:not(.active){background:#f9fafb;color:#374151}
//         .kt-tbl{width:100%;border-collapse:collapse}
//         .kt-tbl thead tr{background:linear-gradient(135deg,#7c3f00,#b45309)}
//         .kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}
//         .kt-tbl thead th.r{text-align:right}
//         .kt-tbl thead th.c{text-align:center}
//         .kt-tbl tbody tr{border-bottom:1px solid #f3f4f6;transition:background .1s}
//         .kt-tbl tbody tr:nth-child(even){background:#fffdf8}
//         .kt-tbl tbody tr:hover{background:#fffbec}
//         .kt-tbl tbody td{padding:10px;font-size:13px;color:#374151;vertical-align:middle}
//         .kt-tbl tbody td.r{text-align:right}
//         .kt-tbl tbody td.c{text-align:center}
//         .kt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.44);z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}
        
//         /* ✅ Wider Modal */
//         .kt-modal{background:#fff;border-radius:22px;border:1px solid #e5e7eb;width:100%;max-width:1200px;margin:auto;box-shadow:0 24px 64px rgba(0,0,0,.18)}
//         .kt-modal-lg{max-width:1200px}
        
//         .kt-mhead{padding:20px 26px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#fffbf2 0%,#fff 100%);border-radius:22px 22px 0 0}
//         .kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto}
//         .kt-mfoot{padding:16px 26px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:8px;background:#fafafa;border-radius:0 0 22px 22px}
//         .prog-track{height:6px;background:#fde68a;border-radius:4px;overflow:hidden}
//         .prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#d97706,#fbbf24);transition:width .5s ease}
//         .prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}
//         .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
//         .sec-label{font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}
//         .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
//         .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
//         .total-box{border-radius:12px;padding:14px 18px;border:1px solid}
//         .wood-info{background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-top:12px}
//         .length-group{display:flex;gap:4px;align-items:center}
//         .length-input{width:50px!important;text-align:center}
//         .filter-row{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
//         .filter-select{flex:1;min-width:180px}
        
//         /* ✅ Better table spacing */
//         .order-items-table{min-width:1100px}
//         .order-items-table td select,
//         .order-items-table td input{
//           min-height:38px;
//         }
//       `}</style>

//       {/* Error */}
//       {error && (
//         <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
//           <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
//           <span className="text-sm text-red-700 flex-1">{error}</span>
//           <button className="icon-btn" onClick={() => setError(null)}><X className="w-3 h-3" /></button>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
//           <p className="text-gray-400 text-sm mt-0.5">{SHOP_INFO.name}</p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <button className="icon-btn" onClick={fetchData} title="Refresh"><RefreshCw className="w-4 h-4" /></button>
//           <button className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
//           <button className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`} onClick={() => setActiveTab('challans')}>Challans</button>
//           <button className="btn-amber" onClick={() => setShowOrderForm(true)}><Plus className="w-4 h-4" />New Order</button>
//         </div>
//       </div>

//       {/* Workflow strip */}
//       <div className="kt-card mb-6 overflow-hidden">
//         <div style={{ background: 'linear-gradient(135deg,#7c3f00,#d97706)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           {[
//             { n: '1', label: 'Order', desc: 'Customer requirement', bg: '#fef3c7', col: '#92400e' },
//             { n: '2', label: 'Challan', desc: 'Partial delivery ok', bg: '#fde68a', col: '#78350f' },
//             { n: '3', label: 'Bill', desc: 'Final invoice', bg: '#fbbf24', col: '#451a03' },
//           ].map((s, i, a) => (
//             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <div className="step-dot" style={{ background: s.bg, color: s.col }}>{s.n}</div>
//                 <div>
//                   <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: 0, lineHeight: 1.2 }}>{s.label}</p>
//                   <p style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', margin: 0 }}>{s.desc}</p>
//                 </div>
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
//             {[
//               { label: 'Total Orders', value: orders.length, bg: '#fff', color: '#111827' },
//               { label: 'Active', value: orders.filter(o => o.status === 'Active').length, bg: '#fffbeb', color: '#92400e' },
//               { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, bg: '#f0fdf4', color: '#166534' },
//               { label: 'Products', value: products.length, bg: '#fef3c7', color: '#7c3f00' },
//             ].map((c, i) => (
//               <div key={i} className="kt-card p-4" style={{ background: c.bg }}>
//                 <p className="text-xs font-medium text-gray-400 mb-1">{c.label}</p>
//                 <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <div className="relative flex-1" style={{ minWidth: 200 }}>
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
//               <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Customer ya Order No..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//             </div>
//             <div className="flex gap-1.5">
//               {['All', 'Active', 'Completed', 'Billed'].map(s => (
//                 <button key={s} onClick={() => setFilterStatus(s)}
//                   className={`kt-tab ${filterStatus === s ? 'active' : ''}`} style={{ padding: '8px 14px', fontSize: 12 }}>
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-3">
//             {filteredOrders.length === 0 && (
//               <div className="kt-card p-14 text-center">
//                 <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
//                   <Receipt style={{ width: 28, height: 28, color: '#d97706' }} />
//                 </div>
//                 <p className="text-gray-400 text-sm">Koi order nahi — "New Order" se shuru karo</p>
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
//                         <span className="font-mono text-sm font-bold" style={{ color: '#b45309' }}>{order.orderNo}</span>
//                         <span className="status-pill" style={{ background: st.bg, color: st.color }}>
//                           <span className="status-dot" style={{ background: st.dot }} />
//                           {order.status}
//                         </span>
//                         {(order.gstRate > 0 || order.includeGST) && (
//                           <span className="status-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
//                             GST {order.gstRate || 18}%
//                           </span>
//                         )}
//                       </div>
//                       <p className="font-bold text-gray-800 text-base mb-1 truncate">{order.customerName}</p>
//                       <p className="text-xs text-gray-400">
//                         {order.customerPhone && `${order.customerPhone} · `}
//                         {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                         &nbsp;·&nbsp;{(order.items || []).length} items
//                         &nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(order.total) || 0).toLocaleString('en-IN')}</span>
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end gap-3 shrink-0">
//                       <div style={{ width: 168 }}>
//                         <div className="flex justify-between mb-1.5">
//                           <span className="text-xs text-gray-400">Delivery</span>
//                           <span className="text-xs font-bold" style={{ color: progress === 100 ? '#16a34a' : '#d97706' }}>{progress}%</span>
//                         </div>
//                         <div className="prog-track">
//                           <div className={`prog-fill ${progress === 100 ? 'done' : ''}`} style={{ width: `${progress}%` }} />
//                         </div>
//                         <p className="text-xs text-gray-400 mt-1 text-right">{oc.length} challan{oc.length !== 1 ? 's' : ''}</p>
//                       </div>
//                       <div className="flex gap-2 flex-wrap justify-end">
//                         {order.status !== 'Billed' && (
//                           <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => openChallanForm(order)}>
//                             <TruckIcon className="w-3.5 h-3.5" />Challan
//                           </button>
//                         )}
//                         {(order.status === 'Completed' || order.status === 'Billed') && (
//                           <button className="btn-amber" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { setSelectedOrder(order); setShowBillPreview(true); }}>
//                             <Receipt className="w-3.5 h-3.5" />Final Bill
//                           </button>
//                         )}
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
//           {challans.length === 0 && (
//             <div className="kt-card p-14 text-center">
//               <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
//                 <TruckIcon style={{ width: 28, height: 28, color: '#d97706' }} />
//               </div>
//               <p className="text-gray-400 text-sm">Koi challan nahi — order pe "Challan" click karo</p>
//             </div>
//           )}
//           {[...challans].reverse().map((ch, i) => (
//             <div key={i} className="kt-card p-4 kt-in">
//               <div className="flex items-center justify-between flex-wrap gap-3">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1.5">
//                     <span className="font-mono text-sm font-bold" style={{ color: '#b45309' }}>{ch.challanNo}</span>
//                     <span className="text-xs text-gray-400">→ <strong className="text-gray-600">{ch.orderNo}</strong></span>
//                     <span className="status-pill" style={{ background: '#dcfce7', color: '#166534' }}>
//                       <span className="status-dot" style={{ background: '#22c55e' }} />Delivered
//                     </span>
//                     {ch.hidePrice && (
//                       <span className="status-pill" style={{ background: '#fef3c7', color: '#92400e' }}>
//                         <EyeOff className="w-3 h-3" /> Hidden
//                       </span>
//                     )}
//                   </div>
//                   <p className="font-semibold text-gray-800">{ch.customerName}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     {new Date(ch.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                     &nbsp;·&nbsp;{(ch.items || []).length} items
//                     {!ch.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(ch.challanTotal) || 0).toLocaleString('en-IN')}</span></>}
//                   </p>
//                 </div>
//                 <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => {
//                   const order = orders.find(o => o.orderNo === ch.orderNo);
//                   if (order) {
//                     const w = window.open('', '_blank');
//                     w.document.write(getChallanPrintHTML(order, ch, ch.hidePrice));
//                     w.document.close();
//                     setTimeout(() => { w.focus(); w.print(); w.close(); }, 600);
//                   }
//                 }}>
//                   <Printer className="w-3.5 h-3.5" />Print
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ✅ NEW ORDER MODAL - WIDER with Separate Unit Dropdown */}
//       {showOrderForm && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-modal-lg kt-in">
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: '#fef3c7', color: '#92400e' }}>1</div>
//                 <div>
//                   <h3 className="font-bold text-gray-800 text-lg m-0">New Order</h3>
//                   <p className="text-xs text-gray-400 m-0">Customer ki requirement darz karo</p>
//                 </div>
//               </div>
//               <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X className="w-5 h-5" /></button>
//             </div>
            
//             <div className="kt-mbody space-y-6">
//               {/* Customer Details */}
//               <div>
//                 <p className="sec-label">Customer Details</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Customer Name *</label>
//                     <input className="kt-input" placeholder="Naam dalein" value={orderForm.customerName} onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label>
//                     <input className="kt-input" placeholder="+91 XXXXX XXXXX" value={orderForm.customerPhone} onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Order Date</label>
//                     <input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">GST Rate</label>
//                     <select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm(p => ({ ...p, gstRate: parseFloat(e.target.value) }))}>
//                       {GST_OPTIONS.map(opt => (
//                         <option key={opt.value} value={opt.value}>{opt.label}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="sm:col-span-4">
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Address</label>
//                     <textarea className="kt-input" rows={2} style={{ resize: 'none' }} placeholder="Delivery address..." value={orderForm.customerAddress} onChange={e => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))} />
//                   </div>
//                 </div>
//               </div>

//               {/* Product Filter Dropdowns */}
//               <div>
//                 <p className="sec-label">Filter Products (Optional)</p>
//                 <div className="filter-row">
//                   <div className="filter-select">
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Material Type</label>
//                     <select 
//                       className="kt-input kt-input-sm" 
//                       value={selectedMaterialType} 
//                       onChange={e => {
//                         setSelectedMaterialType(e.target.value);
//                         setSelectedCategory('');
//                         setSelectedSubCategory('');
//                       }}
//                     >
//                       <option value="">All Material Types</option>
//                       {materialTypes.map(mt => (
//                         <option key={mt} value={mt}>{mt}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="filter-select">
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Category</label>
//                     <select 
//                       className="kt-input kt-input-sm" 
//                       value={selectedCategory} 
//                       onChange={e => {
//                         setSelectedCategory(e.target.value);
//                         setSelectedSubCategory('');
//                       }}
//                     >
//                       <option value="">All Categories</option>
//                       {categories.map(cat => (
//                         <option key={cat} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="filter-select">
//                     <label className="text-xs font-medium text-gray-500 block mb-1.5">Sub Category</label>
//                     <select 
//                       className="kt-input kt-input-sm" 
//                       value={selectedSubCategory} 
//                       onChange={e => setSelectedSubCategory(e.target.value)}
//                     >
//                       <option value="">All Sub Categories</option>
//                       {subCategories.map(sc => (
//                         <option key={sc} value={sc}>{sc}</option>
//                       ))}
//                     </select>
//                   </div>
//                   {(selectedMaterialType || selectedCategory || selectedSubCategory) && (
//                     <button 
//                       className="btn-white" 
//                       style={{ alignSelf: 'flex-end', marginBottom: 0 }}
//                       onClick={() => {
//                         setSelectedMaterialType('');
//                         setSelectedCategory('');
//                         setSelectedSubCategory('');
//                       }}
//                     >
//                       <X className="w-3 h-3" /> Clear
//                     </button>
//                   )}
//                 </div>
//                 <p className="text-xs text-amber-600 font-medium">{filteredProducts.length} products available</p>
//               </div>

//               {/* ✅ Items Table - Separate Unit Column */}
//               <div>
//                 <p className="sec-label">Items (Wood ke liye Length Feet + Inches daalo)</p>
//                 <div className="kt-inset">
//                   <div className="overflow-x-auto">
//                     <table className="kt-tbl order-items-table">
//                       <thead>
//                         <tr>
//                           <th style={{ width: 35 }}>#</th>
//                           <th style={{ minWidth: 280 }}>Product</th>
//                           <th style={{ width: 90 }}>Unit</th>
//                           <th style={{ width: 65 }}>Size</th>
//                           <th style={{ width: 140 }}>Length (ft-in)</th>
//                           <th className="c" style={{ width: 65 }}>Pcs</th>
//                           <th className="r" style={{ width: 70 }}>CFT</th>
//                           <th className="r" style={{ width: 90 }}>Rate (₹)</th>
//                           <th className="r" style={{ width: 100 }}>Amount</th>
//                           <th style={{ width: 40 }}></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {orderItems.map((item, idx) => (
//                           <tr key={item.uid}>
//                             <td className="c text-gray-400 font-medium">{idx + 1}</td>
                            
//                             {/* ✅ Product Dropdown - Only Name */}
//                             <td>
//                               <select 
//                                 className="kt-input kt-input-sm" 
//                                 value={item.skuCode || ''} 
//                                 onChange={e => updateOrderItem(item.uid, 'skuCode', e.target.value)}
//                               >
//                                 <option value="">-- Select Product --</option>
//                                 {filteredProducts.map(p => (
//                                   <option key={p.skuCode} value={p.skuCode}>
//                                     {p.materialName}
//                                   </option>
//                                 ))}
//                               </select>
//                               {item.product && (
//                                 <p className="text-xs text-gray-400 mt-1 truncate" title={`${item.materialType} → ${item.category}`}>
//                                   SKU: {item.skuCode}
//                                 </p>
//                               )}
//                             </td>
                            
//                             {/* ✅ Separate Unit Dropdown */}
//                             <td>
//                               <select 
//                                 className="kt-input kt-input-sm"
//                                 value={item.unit || 'CFT'} 
//                                 onChange={e => updateOrderItem(item.uid, 'unit', e.target.value)}
//                               >
//                                 {UNIT_OPTIONS.map(u => (
//                                   <option key={u} value={u}>{u}</option>
//                                 ))}
//                               </select>
//                             </td>
                            
//                             {/* Size */}
//                             <td className="c text-sm font-medium text-amber-700">
//                               {item.size || '—'}
//                             </td>
                            
//                             {/* Length (Feet - Inches) */}
//                             <td>
//                               {item.isWood ? (
//                                 <div className="length-group">
//                                   <input
//                                     type="number"
//                                     min="0"
//                                     className="kt-input kt-input-sm length-input"
//                                     placeholder="Ft"
//                                     value={item.lengthFeet}
//                                     onChange={e => updateOrderItem(item.uid, 'lengthFeet', e.target.value)}
//                                   />
//                                   <span className="text-gray-400 text-xs font-medium">ft</span>
//                                   <input
//                                     type="number"
//                                     min="0"
//                                     max="11"
//                                     className="kt-input kt-input-sm length-input"
//                                     placeholder="In"
//                                     value={item.lengthInches}
//                                     onChange={e => updateOrderItem(item.uid, 'lengthInches', e.target.value)}
//                                   />
//                                   <span className="text-gray-400 text-xs font-medium">in</span>
//                                 </div>
//                               ) : (
//                                 <span className="text-gray-300 text-xs">N/A</span>
//                               )}
//                             </td>
                            
//                             {/* Quantity/Pieces */}
//                             <td>
//                               <input
//                                 type="number"
//                                 min="1"
//                                 className="kt-input kt-input-sm"
//                                 style={{ textAlign: 'center' }}
//                                 placeholder="Qty"
//                                 value={item.quantity}
//                                 onChange={e => updateOrderItem(item.uid, 'quantity', e.target.value)}
//                               />
//                             </td>
                            
//                             {/* CFT */}
//                             <td className="r font-bold text-amber-700">
//                               {item.isWood && item.cft ? item.cft.toFixed(3) : '—'}
//                             </td>
                            
//                             {/* Rate */}
//                             <td>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 className="kt-input kt-input-sm"
//                                 style={{ textAlign: 'right' }}
//                                 placeholder="₹ Rate"
//                                 value={item.rate}
//                                 onChange={e => updateOrderItem(item.uid, 'rate', e.target.value)}
//                               />
//                             </td>
                            
//                             {/* Amount */}
//                             <td className="r font-bold text-gray-800">
//                               ₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                             </td>
                            
//                             {/* Delete */}
//                             <td className="c">
//                               <button className="icon-btn" onClick={() => removeOrderItem(item.uid)}>
//                                 <Trash2 className="w-4 h-4 text-red-400" />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <button onClick={addOrderItem} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#d97706', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
//                   <Plus className="w-4 h-4" />Add More Item
//                 </button>

//                 {/* Wood CFT Info */}
//                 <div className="wood-info">
//                   <p className="text-xs font-semibold text-amber-800 mb-1">🪵 Wood CFT Calculation:</p>
//                   <p className="text-xs text-amber-700">CFT = (Width × Thickness × Length × Qty) ÷ 144</p>
//                   <p className="text-xs text-amber-600 mt-1">Example: 3×1¼" wood, 12ft 6in, 10 pcs = 3.26 CFT</p>
//                 </div>
//               </div>

//               {/* Total Section */}
//               <div className="flex justify-end">
//                 <div className="total-box" style={{ width: 280, background: '#fffbeb', borderColor: '#fde68a' }}>
//                   <div className="flex justify-between text-sm text-gray-600 mb-2">
//                     <span>Subtotal</span>
//                     <span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                   </div>
//                   {orderForm.gstRate > 0 && (
//                     <div className="flex justify-between text-sm text-gray-600 mb-2">
//                       <span>GST ({orderForm.gstRate}%)</span>
//                       <span className="font-semibold">₹{orderTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between font-bold text-lg border-t border-amber-300 pt-2 mt-2" style={{ color: '#7c3f00' }}>
//                     <span>Total</span>
//                     <span>₹{orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
//               <button className="btn-amber" disabled={!orderForm.customerName || orderSubtotal === 0 || saving} onClick={handleSubmitOrder}>
//                 {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Save Order</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHALLAN FORM MODAL */}
//       {showChallanForm && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 900 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: '#fde68a', color: '#78350f' }}>2</div>
//                 <div>
//                   <h3 className="font-bold text-gray-800 text-base m-0">Delivery Challan</h3>
//                   <p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
//                 </div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div>
//                   <label className="text-xs font-medium text-gray-500 block mb-1.5">Challan Date</label>
//                   <input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium text-gray-500 block mb-1.5">Delivery Note</label>
//                   <input className="kt-input" placeholder="e.g. Part 1, Vehicle no..." value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} />
//                 </div>
//                 <div className="flex items-center gap-3 pt-5">
//                   <input
//                     type="checkbox"
//                     id="hide-price"
//                     checked={hidePriceOnChallan}
//                     onChange={e => setHidePriceOnChallan(e.target.checked)}
//                     style={{ width: 18, height: 18, accentColor: '#d97706', cursor: 'pointer' }}
//                   />
//                   <label htmlFor="hide-price" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
//                     <EyeOff className="w-4 h-4 text-amber-600" />
//                     Hide Price on Challan
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 <p className="sec-label">Items to Deliver</p>
//                 <div className="kt-inset">
//                   <div className="overflow-x-auto">
//                     <table className="kt-tbl">
//                       <thead><tr>
//                         <th>Product</th>
//                         <th className="c" style={{ width: 70 }}>Unit</th>
//                         <th className="c" style={{ width: 60 }}>Size</th>
//                         <th className="c" style={{ width: 70 }}>Length</th>
//                         <th className="r" style={{ width: 70 }}>Ordered</th>
//                         <th className="r" style={{ width: 70 }}>Sent</th>
//                         <th className="r" style={{ width: 70 }}>Remaining</th>
//                         <th className="r" style={{ width: 100 }}>Sending Now</th>
//                       </tr></thead>
//                       <tbody>
//                         {challanItems.map(it => {
//                           const rem = it.orderedQty - it.alreadySent;
//                           return (
//                             <tr key={it.uid}>
//                               <td className="font-medium">{it.product}</td>
//                               <td className="c text-xs text-gray-500">{it.unit}</td>
//                               <td className="c text-xs text-gray-500">{it.size || '—'}</td>
//                               <td className="c text-xs text-gray-500">{it.lengthDisplay || '—'}</td>
//                               <td className="r text-gray-600">{it.orderedQty}</td>
//                               <td className="r font-semibold" style={{ color: '#d97706' }}>{it.alreadySent || '—'}</td>
//                               <td className="r font-bold" style={{ color: rem <= 0 ? '#16a34a' : '#111827' }}>{rem <= 0 ? '✓ Done' : rem.toFixed(3)}</td>
//                               <td>
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   max={rem}
//                                   step="0.001"
//                                   className="kt-input"
//                                   style={{ padding: '8px 10px', fontSize: 13, textAlign: 'right', background: rem <= 0 ? '#f9fafb' : undefined }}
//                                   value={it.sentQty}
//                                   disabled={rem <= 0}
//                                   onChange={e => setChallanItems(prev => prev.map(x => x.uid === it.uid ? { ...x, sentQty: parseFloat(e.target.value) || 0 } : x))}
//                                 />
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {!hidePriceOnChallan && (
//                 <div className="flex justify-end">
//                   <div className="total-box" style={{ minWidth: 220, background: '#fffbeb', borderColor: '#fde68a' }}>
//                     <div className="flex justify-between font-bold text-base" style={{ color: '#7c3f00' }}>
//                       <span>Challan Total</span>
//                       <span>₹{challanItems.reduce((s, it) => s + (parseFloat(it.sentQty || 0) * parseFloat(it.rate || 0)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {hidePriceOnChallan && (
//                 <div className="text-xs px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
//                   <EyeOff className="w-4 h-4" />
//                   Price will be hidden on printed challan
//                 </div>
//               )}
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
//               <button className="btn-amber" disabled={saving} onClick={handleSubmitChallan}>
//                 {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><TruckIcon className="w-4 h-4" />Save & Print Challan</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FINAL BILL MODAL */}
//       {showBillPreview && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 750 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: '#dcfce7', color: '#166534' }}>3</div>
//                 <div>
//                   <h3 className="font-bold text-gray-800 text-base m-0">Final Invoice</h3>
//                   <p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
//                 </div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowBillPreview(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody">
//               {(() => {
//                 const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//                 const m = {};
//                 oc.forEach(ch => ch.items?.forEach(it => {
//                   if (!m[it.product]) m[it.product] = { product: it.product, unit: it.unit, rate: it.rate, totalSentQty: 0, totalAmount: 0, cft: 0 };
//                   m[it.product].totalSentQty += parseFloat(it.sentQty || 0);
//                   m[it.product].totalAmount += parseFloat(it.sentQty || 0) * parseFloat(it.rate || 0);
//                   m[it.product].cft += parseFloat(it.cft || 0);
//                 }));
//                 const li = Object.values(m);
//                 const sub = li.reduce((s, i) => s + i.totalAmount, 0);
//                 const gstRate = selectedOrder.gstRate || 0;
//                 const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
//                 const total = sub + tax;

//                 return (
//                   <div className="space-y-4">
//                     <div className="text-xs px-4 py-2.5 rounded-xl" style={{ background: '#fef3c7', color: '#78350f', border: '1px solid #fde68a' }}>
//                       <span className="font-bold">Challans: </span>
//                       {oc.length ? oc.map(c => `${c.challanNo}`).join(', ') : 'Koi challan nahi'}
//                     </div>
//                     <div className="kt-inset">
//                       <table className="kt-tbl">
//                         <thead><tr>
//                           <th style={{ width: 30 }}>#</th>
//                           <th>Product</th>
//                           <th className="c" style={{ width: 60 }}>Unit</th>
//                           <th className="r" style={{ width: 60 }}>Qty</th>
//                           <th className="r" style={{ width: 60 }}>CFT</th>
//                           <th className="r" style={{ width: 80 }}>Rate</th>
//                           <th className="r" style={{ width: 100 }}>Amount</th>
//                         </tr></thead>
//                         <tbody>
//                           {li.map((it, i) => (
//                             <tr key={i}>
//                               <td className="c text-gray-400 text-xs">{i + 1}</td>
//                               <td className="font-medium">{it.product}</td>
//                               <td className="c text-gray-500">{it.unit}</td>
//                               <td className="r font-semibold">{it.totalSentQty}</td>
//                               <td className="r text-amber-700">{it.cft ? it.cft.toFixed(3) : '—'}</td>
//                               <td className="r text-gray-500">₹{parseFloat(it.rate || 0).toLocaleString('en-IN')}</td>
//                               <td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="flex justify-end">
//                       <div className="total-box" style={{ width: 260, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
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
//               <button className="btn-white" onClick={() => printFinalBill(selectedOrder)}><Printer className="w-4 h-4" />Print</button>
//               {selectedOrder.status === 'Completed' && (
//                 <button className="btn-green" onClick={() => { printFinalBill(selectedOrder); markBilled(selectedOrder.orderNo); }}>
//                   <Receipt className="w-4 h-4" />Generate & Mark Billed
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





///////




'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Trash2, Printer, Search, CheckCircle, Eye,
  AlertTriangle, Loader2, RefreshCw,
  X, TruckIcon, Receipt, ArrowRight, EyeOff, ChevronDown
} from 'lucide-react';

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '0755-4275577',
  gstin: '23XXXXX1234X1ZX',
};

const GST_OPTIONS = [
  { value: 0, label: 'No GST' },
  { value: 5, label: 'GST 5%' },
  { value: 12, label: 'GST 12%' },
  { value: 18, label: 'GST 18%' },
];

const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];

function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

function parseWoodDimensions(name) {
  if (!name) return null;
  const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
  if (match) {
    let width = parseFloat(match[1]);
    let thickness = match[2];
    
    if (thickness.includes('½')) thickness = parseFloat(thickness.replace('½', '')) + 0.5 || 0.5;
    else if (thickness.includes('¼')) thickness = parseFloat(thickness.replace('¼', '')) + 0.25 || 0.25;
    else if (thickness.includes('¾')) thickness = parseFloat(thickness.replace('¾', '')) + 0.75 || 0.75;
    else thickness = parseFloat(thickness);
    
    return { width, thickness };
  }
  return null;
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
      case 'CFT':
        calculatedQty = (width * thickness * totalLengthFeet * qty) / 144;
        break;
      case 'RFT':
        calculatedQty = totalLengthFeet * qty;
        break;
      case 'SQFT':
        calculatedQty = (width * totalLengthFeet * qty) / 12;
        break;
      case 'Per Piece':
        calculatedQty = qty;
        break;
      default:
        calculatedQty = qty;
    }
  }

  return {
    calculatedQty: Math.round(calculatedQty * 1000) / 1000,
    amount: Math.round(calculatedQty * rate * 100) / 100
  };
}

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

// ✅ Searchable Dropdown Component
function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Search...', 
  displayKey = null,
  valueKey = null,
  renderOption = null,
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Get display value
  const getDisplayValue = (opt) => {
    if (typeof opt === 'string') return opt;
    if (displayKey) return opt[displayKey];
    return opt.label || opt.name || opt.value || '';
  };

  // Get actual value
  const getValue = (opt) => {
    if (typeof opt === 'string') return opt;
    if (valueKey) return opt[valueKey];
    return opt.value || opt;
  };

  // Filter options based on search
  const filteredOptions = options.filter(opt => {
    const display = getDisplayValue(opt).toLowerCase();
    const val = String(getValue(opt)).toLowerCase();
    const searchLower = search.toLowerCase();
    return display.includes(searchLower) || val.includes(searchLower);
  });

  // Find selected option display
  const selectedDisplay = options.find(opt => getValue(opt) === value);
  const displayText = selectedDisplay ? getDisplayValue(selectedDisplay) : '';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightIndex]) {
          handleSelect(filteredOptions[highlightIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
    }
  };

  const handleSelect = (opt) => {
    onChange(getValue(opt));
    setIsOpen(false);
    setSearch('');
    setHighlightIndex(0);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setHighlightIndex(0);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`searchable-select ${className}`}>
      <div className="ss-input-wrap">
        <input
          ref={inputRef}
          type="text"
          className="ss-input"
          placeholder={value ? '' : placeholder}
          value={isOpen ? search : displayText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="ss-icons">
          {value && !disabled && (
            <button type="button" className="ss-clear" onClick={handleClear}>
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`ss-arrow ${isOpen ? 'open' : ''}`} />
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="ss-dropdown">
          {filteredOptions.length === 0 ? (
            <div className="ss-no-results">No results found</div>
          ) : (
            <div className="ss-options">
              {filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`ss-option ${highlightIndex === idx ? 'highlighted' : ''} ${getValue(opt) === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                >
                  {renderOption ? renderOption(opt) : getDisplayValue(opt)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ✅ Product Searchable Select with rich display
function ProductSearchableSelect({ products, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);

  const filteredProducts = products.filter(p => {
    const searchLower = search.toLowerCase();
    return (
      p.materialName?.toLowerCase().includes(searchLower) ||
      p.skuCode?.toLowerCase().includes(searchLower) ||
      p.category?.toLowerCase().includes(searchLower) ||
      p.subCategory?.toLowerCase().includes(searchLower)
    );
  });

  const selectedProduct = products.find(p => p.skuCode === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredProducts[highlightIndex]) {
          onChange(filteredProducts[highlightIndex].skuCode);
          setIsOpen(false);
          setSearch('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
    }
  };

  const handleSelect = (product) => {
    onChange(product.skuCode);
    setIsOpen(false);
    setSearch('');
    setHighlightIndex(0);
  };

  return (
    <div ref={wrapperRef} className="searchable-select product-select">
      <div className="ss-input-wrap">
        <Search className="ss-search-icon" />
        <input
          type="text"
          className="ss-input with-icon"
          placeholder={selectedProduct ? '' : '🔍 Search product, SKU...'}
          value={isOpen ? search : (selectedProduct?.materialName || '')}
          onChange={(e) => { setSearch(e.target.value); setHighlightIndex(0); if (!isOpen) setIsOpen(true); }}
          onFocus={() => { setIsOpen(true); setSearch(''); }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="ss-icons">
          {value && !disabled && (
            <button type="button" className="ss-clear" onClick={(e) => { e.stopPropagation(); onChange(''); setSearch(''); setIsOpen(false); }}>
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`ss-arrow ${isOpen ? 'open' : ''}`} />
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="ss-dropdown product-dropdown">
          <div className="ss-dropdown-header">
            <span>{filteredProducts.length} products found</span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="ss-no-results">
              <Search className="w-5 h-5 text-gray-300 mb-2" />
              <p>No products match "{search}"</p>
            </div>
          ) : (
            <div className="ss-options">
              {filteredProducts.slice(0, 50).map((p, idx) => (
                <div
                  key={p.skuCode}
                  className={`ss-option product-option ${highlightIndex === idx ? 'highlighted' : ''} ${p.skuCode === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(p)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                >
                  <div className="product-option-main">
                    <span className="product-name">{p.materialName}</span>
                    <span className="product-sku">{p.skuCode}</span>
                  </div>
                  <div className="product-option-sub">
                    <span className="product-cat">{p.materialType}</span>
                    <span className="product-sep">›</span>
                    <span className="product-cat">{p.category}</span>
                    {p.subCategory && <>
                      <span className="product-sep">›</span>
                      <span className="product-cat">{p.subCategory}</span>
                    </>}
                    <span className="product-unit">{p.unit}</span>
                  </div>
                </div>
              ))}
              {filteredProducts.length > 50 && (
                <div className="ss-more">+{filteredProducts.length - 50} more results...</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PRINT_SHARED_CSS = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;color:#000;background:#fff;-webkit-print-color-adjust:exact}.page{max-width:210mm;margin:0 auto;padding:15mm}.hdr{border:2px solid #000;padding:12px 16px;margin-bottom:10px}.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid #000;margin-bottom:8px}h1{font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:3px}.box{border:2px solid #000;padding:8px 12px;text-align:right;min-width:170px}.gr{display:flex;justify-content:space-between;font-size:9px;font-weight:bold}.sec{border:2px solid #000;margin-bottom:10px}.sh{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}.cb{display:flex}.bt,.st{flex:1;padding:10px 12px}.bt{border-right:1px solid #000}.lbl{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;text-decoration:underline}.cn{font-size:13px;font-weight:bold;margin-bottom:3px}.cd{font-size:10px;line-height:1.5}.mg{display:grid;grid-template-columns:auto 1fr;gap:3px 8px;font-size:9px}.mg .ml{font-weight:bold}table{width:100%;border-collapse:collapse;border:2px solid #000;margin-bottom:10px}thead tr{background:#000;color:#fff}th{padding:7px 8px;font-size:9px;font-weight:bold;text-transform:uppercase;text-align:left;border-right:1px solid #fff}th:last-child{border-right:none}th.r{text-align:right}th.c{text-align:center}tbody tr{border-bottom:1px solid #000}td{padding:6px 8px;font-size:11px;border-right:1px solid #ddd}td:last-child{border-right:none}td.r{text-align:right}td.c{text-align:center}.tots{display:flex;gap:12px;margin-bottom:10px}.aw{flex:1;border:2px solid #000;padding:10px 12px}.awl{font-size:8px;font-weight:bold;text-transform:uppercase;margin-bottom:4px}.awt{font-size:11px;font-weight:bold;font-style:italic}.tb{width:220px;border:2px solid #000}.tr_{display:flex;justify-content:space-between;padding:5px 12px;font-size:11px;border-bottom:1px solid #ddd}.tf{background:#000;color:#fff;display:flex;justify-content:space-between;padding:7px 12px;font-size:12px;font-weight:bold}.ftr{border:2px solid #000;padding:10px 12px}.fg{display:flex;justify-content:space-between;gap:20px}.terms{flex:1;font-size:9px;line-height:1.7}.sig{width:190px;text-align:center}.stamp{border:2px dashed #000;padding:7px 14px;margin-bottom:28px;font-size:9px;font-weight:bold;text-transform:uppercase}.sl{width:100%;border-top:1px solid #000;margin-bottom:5px}.slbl{font-size:9px;font-weight:bold}.ty{border:2px solid #000;padding:8px;margin-top:10px;text-align:center}@media print{.page{padding:10mm}}@page{size:A4;margin:10mm}`;

const getChallanPrintHTML = (order, challan, hidePrice = false) => {
  const challanTotal = challan.items.reduce((s, it) => s + (parseFloat(it.amount || 0)), 0);
  
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_SHARED_CSS}</style></head><body><div class="page">
  <div class="hdr">
    <div class="hdr-top">
      <div>
        <h1>${SHOP_INFO.name}</h1>
        <p style="font-size:10px">${SHOP_INFO.address}</p>
        <p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p>
      </div>
      <div class="box">
        <div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Delivery Challan</div>
        <div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">${challan.challanNo}</div>
        <div style="font-size:9px">Date: ${new Date(challan.challanDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
        <div style="font-size:9px;margin-top:2px">Ref: ${order.orderNo}</div>
      </div>
    </div>
    <div class="gr">
      <span>GSTIN: ${SHOP_INFO.gstin}</span>
      <span>PAN: XXXXX1234X</span>
    </div>
  </div>
  
  <div class="sec">
    <div class="sh">Customer Details</div>
    <div class="cb">
      <div class="bt">
        <div class="lbl">Bill To</div>
        <div class="cn">${order.customerName}</div>
        <div class="cd">${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br>' : ''}${order.customerAddress || ''}</div>
      </div>
      <div class="st">
        <div class="lbl">Challan Info</div>
        <div class="mg">
          <span class="ml">Challan No:</span><span>${challan.challanNo}</span>
          <span class="ml">Date:</span><span>${new Date(challan.challanDate).toLocaleDateString('en-IN')}</span>
          <span class="ml">Order Ref:</span><span>${order.orderNo}</span>
          <span class="ml">Note:</span><span>${challan.deliveryNote || '—'}</span>
        </div>
      </div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th style="width:30px">#</th>
        <th>Item</th>
        <th class="c" style="width:70px">Size</th>
        <th class="c" style="width:60px">Length</th>
        <th class="r" style="width:50px">Pcs</th>
        <th class="r" style="width:60px">Calc Qty</th>
        <th class="c" style="width:55px">Unit</th>
        ${!hidePrice ? '<th class="r" style="width:70px">Rate (₹)</th><th class="r" style="width:80px">Amount (₹)</th>' : ''}
      </tr>
    </thead>
    <tbody>
      ${challan.items.map((it, i) => `
        <tr>
          <td class="c">${i + 1}</td>
          <td><strong>${it.product}</strong></td>
          <td class="c">${it.size || '—'}</td>
          <td class="c">${it.lengthDisplay || '—'}</td>
          <td class="r">${it.pieces || it.sentQty}</td>
          <td class="r">${it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty}</td>
          <td class="c">${it.unit}</td>
          ${!hidePrice ? `<td class="r">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="r"><strong>${(parseFloat(it.amount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>` : ''}
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  ${!hidePrice ? `
  <div class="tots">
    <div class="aw">
      <div class="awl">Amount in Words</div>
      <div class="awt">${numberToWords(challanTotal)}</div>
    </div>
    <div class="tb">
      <div class="tr_"><span>Subtotal:</span><span>₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
      <div class="tf"><span>CHALLAN TOTAL</span><span>₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
    </div>
  </div>
  ` : '<div style="text-align:center;padding:20px;border:2px solid #000;margin-bottom:10px;font-weight:bold;">DELIVERY CHALLAN - FOR GOODS REFERENCE ONLY</div>'}
  
  <div class="ftr">
    <div class="fg">
      <div class="terms">
        <strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>
        • Goods dispatched will not be returned without prior approval.<br>
        • Verify items on receipt; report discrepancies within 24 hours.<br>
        • This is a delivery challan — not a tax invoice.<br>
        • All disputes subject to Bhopal jurisdiction only.
      </div>
      <div class="sig">
        <div class="stamp">For ${SHOP_INFO.name}</div>
        <div class="sl"></div>
        <div class="slbl">Authorized Signatory</div>
      </div>
    </div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <div class="sl" style="width:180px"></div>
        <div class="slbl">Customer Signature</div>
      </div>
      <div style="font-size:9px">Received goods in good condition</div>
    </div>
  </div>
  
  <div class="ty"><strong>Delivery Challan — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div>
</div></body></html>`;
};

const getBillPrintHTML = (order, challans) => {
  const m = {};
  challans.forEach(ch => ch.items.forEach(it => {
    if (!m[it.product]) m[it.product] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, pieces: 0 };
    m[it.product].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0);
    m[it.product].totalAmount += parseFloat(it.amount || 0);
    m[it.product].pieces += parseFloat(it.pieces || it.sentQty || 0);
  }));
  
  const li = Object.values(m);
  const sub = li.reduce((s, i) => s + i.totalAmount, 0);
  const gstRate = order.gstRate || 0;
  const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
  const total = sub + tax;
  
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice INV-${order.orderNo}</title><style>${PRINT_SHARED_CSS}
  .cref{border:2px solid #000;padding:8px 12px;margin-bottom:10px;font-size:10px}
  .gst-s{border:2px solid #000;margin-bottom:10px}
  .gst-h{background:#000;color:#fff;padding:5px 10px;font-size:9px;font-weight:bold;text-transform:uppercase}
  .gst-t{width:100%;border-collapse:collapse}
  .gst-t th{background:#f0f0f0;padding:6px 8px;font-size:9px;font-weight:bold;text-align:left;border-bottom:1px solid #000;border-right:1px solid #ddd}
  .gst-t td{padding:6px 8px;font-size:10px;border-right:1px solid #ddd}
  </style></head><body><div class="page">
  
  <div class="hdr">
    <div class="hdr-top">
      <div>
        <h1>${SHOP_INFO.name}</h1>
        <p style="font-size:10px">${SHOP_INFO.address}</p>
        <p style="font-size:10px">Phone: ${SHOP_INFO.phone}</p>
      </div>
      <div class="box">
        <div style="font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">Tax Invoice</div>
        <div style="font-size:15px;font-weight:bold;font-family:'Courier New',monospace;margin:3px 0">INV-${order.orderNo}</div>
        <div style="font-size:9px">Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      </div>
    </div>
    <div class="gr">
      <span>GSTIN: ${SHOP_INFO.gstin}</span>
      <span>PAN: XXXXX1234X</span>
    </div>
  </div>
  
  <div class="sec">
    <div class="sh">Customer & Invoice Details</div>
    <div class="cb">
      <div class="bt">
        <div class="lbl">Bill To</div>
        <div class="cn">${order.customerName}</div>
        <div class="cd">${order.customerPhone ? 'Phone: ' + order.customerPhone + '<br>' : ''}${order.customerAddress || ''}</div>
      </div>
      <div class="st">
        <div class="lbl">Invoice Information</div>
        <div class="mg">
          <span class="ml">Order No:</span><span>${order.orderNo}</span>
          <span class="ml">Challans:</span><span>${challans.map(c => c.challanNo).join(', ')}</span>
          <span class="ml">Items:</span><span>${li.length}</span>
          <span class="ml">GST:</span><span>${gstRate > 0 ? gstRate + '% Included' : 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
  
  <div class="cref"><strong>Challan References: </strong>${challans.map(c => `${c.challanNo} (${new Date(c.challanDate).toLocaleDateString('en-IN')})`).join(' | ')}</div>
  
  <table>
    <thead>
      <tr>
        <th style="width:30px">#</th>
        <th>Item</th>
        <th class="c" style="width:55px">Unit</th>
        <th class="r" style="width:55px">Pcs</th>
        <th class="r" style="width:65px">Total Qty</th>
        <th class="r" style="width:70px">Rate (₹)</th>
        <th class="r" style="width:80px">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${li.map((it, i) => `
        <tr>
          <td class="c">${i + 1}</td>
          <td><strong>${it.product}</strong></td>
          <td class="c">${it.unit}</td>
          <td class="r">${it.pieces}</td>
          <td class="r"><strong>${it.totalQty.toFixed(3)}</strong></td>
          <td class="r">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="r"><strong>${it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="tots">
    <div class="aw">
      <div class="awl">Amount in Words</div>
      <div class="awt">${numberToWords(total)}</div>
    </div>
    <div class="tb">
      <div class="tr_"><span>Subtotal:</span><span>₹${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
      ${gstRate > 0 ? `
        <div class="tr_"><span>CGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span></div>
        <div class="tr_"><span>SGST @ ${gstRate / 2}%:</span><span>₹${(tax / 2).toFixed(2)}</span></div>
      ` : ''}
      <div class="tr_"><span>Discount:</span><span>₹0.00</span></div>
      <div class="tf"><span>GRAND TOTAL</span><span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
    </div>
  </div>
  
  ${gstRate > 0 ? `
  <div class="gst-s">
    <div class="gst-h">GST Tax Breakup</div>
    <table class="gst-t">
      <thead>
        <tr>
          <th>Taxable</th>
          <th>CGST Rate</th>
          <th>CGST Amt</th>
          <th>SGST Rate</th>
          <th>SGST Amt</th>
          <th>Total Tax</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>₹${sub.toFixed(2)}</td>
          <td>${gstRate / 2}%</td>
          <td>₹${(tax / 2).toFixed(2)}</td>
          <td>${gstRate / 2}%</td>
          <td>₹${(tax / 2).toFixed(2)}</td>
          <td><strong>₹${tax.toFixed(2)}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
  ` : ''}
  
  <div class="ftr">
    <div class="fg">
      <div class="terms">
        <strong style="display:block;margin-bottom:3px;font-size:10px;text-decoration:underline">Terms & Conditions:</strong>
        • Goods once sold will not be taken back or exchanged.<br>
        • Payment due on receipt of invoice.<br>
        • Interest @ 18% p.a. on overdue amounts.<br>
        • All disputes subject to Bhopal jurisdiction only.<br>
        • E. & O.E.
      </div>
      <div class="sig">
        <div class="stamp">For ${SHOP_INFO.name}</div>
        <div class="sl"></div>
        <div class="slbl">Authorized Signatory</div>
      </div>
    </div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #000;display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <div class="sl" style="width:180px"></div>
        <div class="slbl">Customer Signature</div>
      </div>
      <div style="font-size:9px">Received goods in good condition</div>
    </div>
  </div>
  
  <div class="ty"><strong>Thank You for Your Business! — ${SHOP_INFO.name} | ${SHOP_INFO.phone}</strong></div>
</div></body></html>`;
};

const apiGet = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return { success: false, data: [] };
    return await res.json();
  } catch (err) {
    console.error(`API Error ${url}:`, err);
    return { success: false, data: [] };
  }
};

const apiPost = async (url, body) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const apiPatch = async (url, body) => {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
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
  const [filterStatus, setFilterStatus] = useState('All');

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderForm, setOrderForm] = useState({
    customerName: '', customerPhone: '', customerAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    gstRate: 0,
    notes: '',
  });

  const [orderItems, setOrderItems] = useState([createEmptyItem()]);

  const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
  const [challanItems, setChallanItems] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);

  function createEmptyItem() {
    return {
      uid: uid(),
      product: '',
      unit: '',
      lengthFeet: '',
      lengthInches: '',
      quantity: '',
      rate: '',
      amount: 0,
      calculatedQty: 0,
      skuCode: '',
      isWood: false,
      width: 0,
      thickness: 0,
      size: '',
      materialType: '',
      category: '',
      subCategory: '',
      filterMaterialType: '',
      filterCategory: '',
      filterSubCategory: '',
    };
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ordersRes = await apiGet('/api/billing-backend/orders');
      setOrders(ordersRes.success ? ordersRes.data || [] : []);

      const challansRes = await apiGet('/api/billing-backend/challans');
      setChallans(challansRes.success ? challansRes.data || [] : []);

      const productsRes = await apiGet('/api/dropdown-data');
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('FetchData Error:', err);
      setError('Data load mein problem');
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isWoodMaterial = (item) => {
    if (!item) return false;
    const materialType = (item.materialType || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    
    return materialType.includes('timber') ||
      materialType.includes('wood') ||
      materialType.includes('lakdi') ||
      category.includes('teak') ||
      category.includes('sagwan') ||
      category.includes('pine') ||
      category.includes('sal');
  };

  // Get filtered products for row
  const getFilteredProductsForRow = (item) => {
    return products.filter(p => {
      if (item.filterMaterialType && p.materialType !== item.filterMaterialType) return false;
      if (item.filterCategory && p.category !== item.filterCategory) return false;
      if (item.filterSubCategory && p.subCategory !== item.filterSubCategory) return false;
      return true;
    });
  };

  const getAllMaterialTypes = () => [...new Set(products.map(p => p.materialType).filter(Boolean))];
  
  const getCategoriesFor = (materialType) => {
    return [...new Set(
      products
        .filter(p => !materialType || p.materialType === materialType)
        .map(p => p.category)
        .filter(Boolean)
    )];
  };
  
  const getSubCategoriesFor = (materialType, category) => {
    return [...new Set(
      products
        .filter(p => 
          (!materialType || p.materialType === materialType) &&
          (!category || p.category === category)
        )
        .map(p => p.subCategory)
        .filter(Boolean)
    )];
  };

  const addOrderItem = () => setOrderItems(p => [...p, createEmptyItem()]);

  const removeOrderItem = id => {
    if (orderItems.length === 1) return;
    setOrderItems(p => p.filter(i => i.uid !== id));
  };

  const updateOrderItem = (id, field, val) => setOrderItems(prev => prev.map(item => {
    if (item.uid !== id) return item;
    const u = { ...item, [field]: val };

    if (field === 'filterMaterialType') {
      u.filterCategory = '';
      u.filterSubCategory = '';
    }
    if (field === 'filterCategory') {
      u.filterSubCategory = '';
    }

    if (field === 'skuCode') {
      const f = products.find(p => p.skuCode === val);
      if (f) {
        u.product = f.materialName;
        u.skuCode = f.skuCode;
        u.materialType = f.materialType;
        u.category = f.category;
        u.subCategory = f.subCategory;
        u.isWood = isWoodMaterial(f);

        if (u.isWood) {
          u.unit = 'CFT';
          const dims = parseWoodDimensions(f.materialName);
          if (dims) {
            u.width = dims.width;
            u.thickness = dims.thickness;
            u.size = `${dims.width}×${dims.thickness}"`;
          } else {
            u.width = 0;
            u.thickness = 0;
            u.size = '';
          }
        } else {
          u.unit = f.unit || 'Pcs';
          u.width = 0;
          u.thickness = 0;
          u.size = '';
          u.lengthFeet = '';
          u.lengthInches = '';
        }
      }
    }

    const calc = calculateByUnit(u);
    u.calculatedQty = calc.calculatedQty;
    u.amount = calc.amount;

    return u;
  }));

  const orderSubtotal = orderItems.reduce((s, i) => s + (i.amount || 0), 0);
  const orderTax = orderForm.gstRate > 0 ? orderSubtotal * (orderForm.gstRate / 100) : 0;
  const orderTotal = orderSubtotal + orderTax;

  const genOrderNo = () => {
    const y = new Date().getFullYear();
    const px = `ORD-${y}-`;
    const max = orders.filter(o => o.orderNo?.startsWith(px)).reduce((m, o) => {
      const n = parseInt(o.orderNo?.replace(px, '') || '0');
      return n > m ? n : m;
    }, 0);
    return `${px}${String(max + 1).padStart(4, '0')}`;
  };

  const genChallanNo = () => {
    const y = new Date().getFullYear();
    const px = `CHL-${y}-`;
    const max = challans.filter(c => c.challanNo?.startsWith(px)).reduce((m, c) => {
      const n = parseInt(c.challanNo?.replace(px, '') || '0');
      return n > m ? n : m;
    }, 0);
    return `${px}${String(max + 1).padStart(4, '0')}`;
  };

  const handleSubmitOrder = async () => {
    if (!orderForm.customerName || orderSubtotal === 0) {
      setError('Customer name aur items required hain');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const orderNo = genOrderNo();
      const validItems = orderItems.filter(i => i.product && (i.quantity || i.calculatedQty));

      const r = await apiPost('/api/billing-backend/orders', {
        order: {
          ...orderForm,
          orderNo,
          subtotal: orderSubtotal,
          tax: orderTax,
          total: orderTotal,
          status: 'Active'
        },
        items: validItems.map(it => ({
          ...it,
          lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
        }))
      });

      if (!r.success) {
        setError(r.message || r.error || 'Order save fail');
        return;
      }

      await fetchData();
      setShowOrderForm(false);
      resetOrderForm();
    } catch (err) {
      setError('Order save error: ' + err.message);
    }
    finally { setSaving(false); }
  };

  const resetOrderForm = () => {
    setOrderForm({
      customerName: '', customerPhone: '', customerAddress: '',
      orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: ''
    });
    setOrderItems([createEmptyItem()]);
  };

  const openChallanForm = order => {
    setSelectedOrder(order);
    const sm = {};
    challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => {
      sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0);
    }));

    setChallanItems((order.items || []).map(it => ({
      uid: uid(),
      product: it.product || it.itemName,
      unit: it.unit,
      rate: parseFloat(it.rate || 0),
      orderedQty: parseFloat(it.calculatedQty || it.quantity || 0),
      alreadySent: parseFloat(sm[it.product || it.itemName] || 0),
      sendingPcs: '',
      sendingQty: 0,
      size: it.size || '',
      lengthFeet: it.lengthFeet || '',
      lengthInches: it.lengthInches || '',
      lengthDisplay: it.lengthDisplay || '',
      isWood: it.isWood || false,
      width: it.width || 0,
      thickness: it.thickness || 0,
    })));

    setChallanDate(new Date().toISOString().split('T')[0]);
    setDeliveryNote('');
    setHidePriceOnChallan(false);
    setShowChallanForm(true);
  };

  const updateChallanItem = (itemUid, field, value) => {
    setChallanItems(prev => prev.map(it => {
      if (it.uid !== itemUid) return it;
      const updated = { ...it, [field]: value };
      
      if (field === 'sendingPcs' && it.isWood) {
        const pcs = parseFloat(value || 0);
        const calc = calculateByUnit({
          ...updated,
          quantity: pcs
        });
        updated.sendingQty = calc.calculatedQty;
      } else if (field === 'sendingPcs') {
        updated.sendingQty = parseFloat(value || 0);
      }
      
      return updated;
    }));
  };

  const handleSubmitChallan = async () => {
    const valid = challanItems.filter(i => parseFloat(i.sendingPcs) > 0);
    if (!valid.length) { setError('Kam se kam ek item ki qty daalo.'); return; }
    setSaving(true);
    setError(null);
    try {
      const challanNo = genChallanNo();
      const challanTotal = valid.reduce((s, it) => s + (parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0)), 0);

      const payload = {
        challan: {
          challanNo,
          orderNo: selectedOrder.orderNo,
          customerName: selectedOrder.customerName,
          challanDate,
          deliveryNote,
          challanTotal,
          status: 'Delivered',
          hidePrice: hidePriceOnChallan,
        },
        items: valid.map(it => ({
          product: it.product,
          unit: it.unit,
          orderedQty: it.orderedQty,
          pieces: parseFloat(it.sendingPcs),
          sentQty: parseFloat(it.sendingPcs),
          calculatedQty: it.sendingQty,
          rate: it.rate,
          amount: it.sendingQty * it.rate,
          size: it.size,
          lengthDisplay: it.lengthDisplay,
        }))
      };

      const r = await apiPost('/api/billing-backend/challans', payload);
      if (!r.success) { setError(r.message || r.error || 'Challan save fail'); return; }

      const allC = challans.filter(c => c.orderNo === selectedOrder.orderNo);
      const tsm = {};
      [...allC, { items: valid.map(it => ({ product: it.product, calculatedQty: it.sendingQty })) }]
        .forEach(ch => ch.items?.forEach(it => { 
          tsm[it.product] = (tsm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); 
        }));
      const done = (selectedOrder.items || []).every(oi =>
        (tsm[oi.product || oi.itemName] || 0) >= parseFloat(oi.calculatedQty || oi.quantity || 0)
      );
      if (done) await apiPatch('/api/billing-backend/orders', { orderNo: selectedOrder.orderNo, status: 'Completed' });

      const win = window.open('', '_blank');
      win.document.write(getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan));
      win.document.close();
      setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);

      await fetchData();
      setShowChallanForm(false);
    } catch (err) {
      setError('Challan save error: ' + err.message);
    }
    finally { setSaving(false); }
  };

  const printFinalBill = order => {
    const oc = challans.filter(c => c.orderNo === order.orderNo);
    const win = window.open('', '_blank');
    win.document.write(getBillPrintHTML(order, oc));
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);
  };

  const markBilled = async orderNo => {
    await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Billed' });
    await fetchData();
    setShowBillPreview(false);
  };

  const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);

  const getDeliveryProgress = order => {
    const sm = {};
    challans.filter(c => c.orderNo === order.orderNo).forEach(ch => ch.items?.forEach(it => {
      sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0);
    }));
    const items = order.items || [];
    if (!items.length) return 0;
    const tot = items.reduce((s, it) => s + parseFloat(it.calculatedQty || it.quantity || 0), 0);
    const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.calculatedQty || it.quantity || 0), sm[it.product || it.itemName] || 0), 0);
    return tot > 0 ? Math.round((sent / tot) * 100) : 0;
  };

  const filteredOrders = orders.filter(o => {
    const ms = o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNo?.toLowerCase().includes(searchQuery.toLowerCase());
    const mst = filterStatus === 'All' || o.status === filterStatus;
    return ms && mst;
  });

  const STATUS = {
    Active: { bg: '#fef3c7', color: '#92400e', dot: '#d97706' },
    Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    Billed: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
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
        .kt-input{width:100%;padding:9px 13px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;background:#fff;color:#111827;outline:none;transition:border-color .14s,box-shadow .14s}
        .kt-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}
        .kt-input[readonly]{background:#f9fafb;color:#6b7280;cursor:not-allowed}
        .kt-input-sm{padding:7px 10px;font-size:12px}
        .btn-amber{padding:9px 20px;background:linear-gradient(135deg,#b45309,#d97706);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 6px rgba(180,83,9,.28)}
        .btn-amber:hover{background:linear-gradient(135deg,#92400e,#b45309);box-shadow:0 4px 14px rgba(180,83,9,.38);transform:translateY(-1px)}
        .btn-amber:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .btn-white{padding:9px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:#374151;display:inline-flex;align-items:center;gap:6px;transition:all .14s}
        .btn-white:hover{background:#f9fafb;border-color:#d1d5db}
        .btn-green{padding:9px 18px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .14s}
        .btn-green:hover{opacity:.9}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:#9ca3af}
        .icon-btn:hover{background:#f3f4f6;color:#374151}
        .kt-card{background:#fff;border:1px solid #f0f0f0;border-radius:16px;box-shadow:0 1px 5px rgba(0,0,0,.05)}
        .kt-inset{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
        .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:#6b7280}
        .kt-tab.active{background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;box-shadow:0 1px 4px rgba(217,119,6,.18)}
        .kt-tab:hover:not(.active){background:#f9fafb;color:#374151}
        .kt-tbl{width:100%;border-collapse:collapse}
        .kt-tbl thead tr{background:linear-gradient(135deg,#7c3f00,#b45309)}
        .kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}
        .kt-tbl thead th.r{text-align:right}
        .kt-tbl thead th.c{text-align:center}
        .kt-tbl tbody tr{border-bottom:1px solid #f3f4f6;transition:background .1s}
        .kt-tbl tbody tr:nth-child(even){background:#fffdf8}
        .kt-tbl tbody tr:hover{background:#fffbec}
        .kt-tbl tbody td{padding:10px;font-size:13px;color:#374151;vertical-align:top}
        .kt-tbl tbody td.r{text-align:right}
        .kt-tbl tbody td.c{text-align:center}
        .kt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.44);z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}
        .kt-modal{background:#fff;border-radius:22px;border:1px solid #e5e7eb;width:100%;max-width:1300px;margin:auto;box-shadow:0 24px 64px rgba(0,0,0,.18)}
        .kt-mhead{padding:20px 26px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#fffbf2 0%,#fff 100%);border-radius:22px 22px 0 0}
        .kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto}
        .kt-mfoot{padding:16px 26px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:8px;background:#fafafa;border-radius:0 0 22px 22px}
        .prog-track{height:6px;background:#fde68a;border-radius:4px;overflow:hidden}
        .prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#d97706,#fbbf24);transition:width .5s ease}
        .prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}
        .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .sec-label{font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}
        .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
        .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
        .total-box{border-radius:12px;padding:14px 18px;border:1px solid}
        .length-group{display:flex;gap:4px;align-items:center}
        .length-input{width:50px!important;text-align:center}
        
        /* Item Row Styles */
        .item-row{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;transition:all .2s}
        .item-row:hover{border-color:#fde68a;background:#fffbf5}
        .item-row-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
        .item-row-num{width:28px;height:28px;border-radius:8px;background:#fef3c7;color:#92400e;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px}
        .unit-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}
        .wood-badge{background:#dcfce7;color:#166534}
        .hardware-badge{background:#e0e7ff;color:#3730a3}
        .calc-display{background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:10px;margin-top:10px}
        .filter-row-inline{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap}
        .product-select-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}
        
        /* ✅ Searchable Select Styles */
        .searchable-select{position:relative;width:100%}
        .ss-input-wrap{position:relative;display:flex;align-items:center}
        .ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;background:#fff;color:#111827;outline:none;transition:all .15s}
        .ss-input:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.12)}
        .ss-input.with-icon{padding-left:32px}
        .ss-search-icon{position:absolute;left:10px;width:14px;height:14px;color:#9ca3af;pointer-events:none}
        .ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}
        .ss-clear{width:18px;height:18px;border-radius:50%;background:#f3f4f6;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .15s}
        .ss-clear:hover{background:#e5e7eb;color:#374151}
        .ss-arrow{width:14px;height:14px;color:#9ca3af;transition:transform .2s}
        .ss-arrow.open{transform:rotate(180deg)}
        
        .ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.12);z-index:200;max-height:280px;overflow:hidden;animation:ss-drop .15s ease}
        @keyframes ss-drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        
        .ss-dropdown-header{padding:8px 12px;background:#fef3c7;border-bottom:1px solid #fde68a;font-size:11px;color:#92400e;font-weight:600}
        .ss-options{max-height:240px;overflow-y:auto}
        .ss-option{padding:10px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid #f3f4f6}
        .ss-option:last-child{border-bottom:none}
        .ss-option:hover,.ss-option.highlighted{background:#fffbeb}
        .ss-option.selected{background:#fef3c7}
        .ss-no-results{padding:20px;text-align:center;color:#9ca3af;font-size:13px}
        .ss-more{padding:10px 12px;text-align:center;color:#d97706;font-size:12px;font-weight:500;background:#fffbeb}
        
        /* Product dropdown specific */
        .product-dropdown{max-height:350px}
        .product-dropdown .ss-options{max-height:300px}
        .product-option{padding:10px 12px}
        .product-option-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
        .product-name{font-weight:600;color:#111827;font-size:13px}
        .product-sku{font-size:11px;color:#d97706;font-family:monospace;background:#fef3c7;padding:2px 6px;border-radius:4px}
        .product-option-sub{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
        .product-cat{font-size:11px;color:#6b7280}
        .product-sep{color:#d1d5db;font-size:10px}
        .product-unit{font-size:10px;color:#fff;background:#d97706;padding:2px 6px;border-radius:4px;margin-left:auto}
      `}</style>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-700 flex-1">{error}</span>
          <button className="icon-btn" onClick={() => setError(null)}><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{SHOP_INFO.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="icon-btn" onClick={fetchData} title="Refresh"><RefreshCw className="w-4 h-4" /></button>
          <button className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`} onClick={() => setActiveTab('challans')}>Challans</button>
          <button className="btn-amber" onClick={() => setShowOrderForm(true)}><Plus className="w-4 h-4" />New Order</button>
        </div>
      </div>

      {/* Workflow strip */}
      <div className="kt-card mb-6 overflow-hidden">
        <div style={{ background: 'linear-gradient(135deg,#7c3f00,#d97706)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { n: '1', label: 'Order', desc: 'Customer requirement', bg: '#fef3c7', col: '#92400e' },
            { n: '2', label: 'Challan', desc: 'Partial delivery ok', bg: '#fde68a', col: '#78350f' },
            { n: '3', label: 'Bill', desc: 'Final invoice', bg: '#fbbf24', col: '#451a03' },
          ].map((s, i, a) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="step-dot" style={{ background: s.bg, color: s.col }}>{s.n}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: 0, lineHeight: 1.2 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
              {i < a.length - 1 && <ArrowRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,.4)', margin: '0 6px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-5 kt-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Orders', value: orders.length, bg: '#fff', color: '#111827' },
              { label: 'Active', value: orders.filter(o => o.status === 'Active').length, bg: '#fffbeb', color: '#92400e' },
              { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, bg: '#f0fdf4', color: '#166534' },
              { label: 'Products', value: products.length, bg: '#fef3c7', color: '#7c3f00' },
            ].map((c, i) => (
              <div key={i} className="kt-card p-4" style={{ background: c.bg }}>
                <p className="text-xs font-medium text-gray-400 mb-1">{c.label}</p>
                <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Customer ya Order No..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-1.5">
              {['All', 'Active', 'Completed', 'Billed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`kt-tab ${filterStatus === s ? 'active' : ''}`} style={{ padding: '8px 14px', fontSize: 12 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 && (
              <div className="kt-card p-14 text-center">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Receipt style={{ width: 28, height: 28, color: '#d97706' }} />
                </div>
                <p className="text-gray-400 text-sm">Koi order nahi — "New Order" se shuru karo</p>
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
                        <span className="font-mono text-sm font-bold" style={{ color: '#b45309' }}>{order.orderNo}</span>
                        <span className="status-pill" style={{ background: st.bg, color: st.color }}>
                          <span className="status-dot" style={{ background: st.dot }} />
                          {order.status}
                        </span>
                        {(order.gstRate > 0 || order.includeGST) && (
                          <span className="status-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                            GST {order.gstRate || 18}%
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 text-base mb-1 truncate">{order.customerName}</p>
                      <p className="text-xs text-gray-400">
                        {order.customerPhone && `${order.customerPhone} · `}
                        {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        &nbsp;·&nbsp;{(order.items || []).length} items
                        &nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(order.total) || 0).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div style={{ width: 168 }}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-gray-400">Delivery</span>
                          <span className="text-xs font-bold" style={{ color: progress === 100 ? '#16a34a' : '#d97706' }}>{progress}%</span>
                        </div>
                        <div className="prog-track">
                          <div className={`prog-fill ${progress === 100 ? 'done' : ''}`} style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">{oc.length} challan{oc.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {order.status !== 'Billed' && (
                          <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => openChallanForm(order)}>
                            <TruckIcon className="w-3.5 h-3.5" />Challan
                          </button>
                        )}
                        {(order.status === 'Completed' || order.status === 'Billed') && (
                          <button className="btn-amber" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { setSelectedOrder(order); setShowBillPreview(true); }}>
                            <Receipt className="w-3.5 h-3.5" />Final Bill
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

      {/* CHALLANS TAB */}
      {activeTab === 'challans' && (
        <div className="space-y-3 kt-in">
          {challans.length === 0 && (
            <div className="kt-card p-14 text-center">
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef9ec', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <TruckIcon style={{ width: 28, height: 28, color: '#d97706' }} />
              </div>
              <p className="text-gray-400 text-sm">Koi challan nahi — order pe "Challan" click karo</p>
            </div>
          )}
          {[...challans].reverse().map((ch, i) => (
            <div key={i} className="kt-card p-4 kt-in">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-sm font-bold" style={{ color: '#b45309' }}>{ch.challanNo}</span>
                    <span className="text-xs text-gray-400">→ <strong className="text-gray-600">{ch.orderNo}</strong></span>
                    <span className="status-pill" style={{ background: '#dcfce7', color: '#166534' }}>
                      <span className="status-dot" style={{ background: '#22c55e' }} />Delivered
                    </span>
                    {ch.hidePrice && (
                      <span className="status-pill" style={{ background: '#fef3c7', color: '#92400e' }}>
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800">{ch.customerName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(ch.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    &nbsp;·&nbsp;{(ch.items || []).length} items
                    {!ch.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold text-gray-600">₹{(parseFloat(ch.challanTotal) || 0).toLocaleString('en-IN')}</span></>}
                  </p>
                </div>
                <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => {
                  const order = orders.find(o => o.orderNo === ch.orderNo);
                  if (order) {
                    const w = window.open('', '_blank');
                    w.document.write(getChallanPrintHTML(order, ch, ch.hidePrice));
                    w.document.close();
                    setTimeout(() => { w.focus(); w.print(); w.close(); }, 600);
                  }
                }}>
                  <Printer className="w-3.5 h-3.5" />Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ NEW ORDER MODAL with Searchable Dropdowns */}
      {showOrderForm && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in">
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{ background: '#fef3c7', color: '#92400e' }}>1</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg m-0">New Order</h3>
                  <p className="text-xs text-gray-400 m-0">Type to search - fast item selection</p>
                </div>
              </div>
              <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X className="w-5 h-5" /></button>
            </div>
            
            <div className="kt-mbody space-y-6">
              {/* Customer Details */}
              <div>
                <p className="sec-label">Customer Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Customer Name *</label>
                    <input className="kt-input" placeholder="Naam dalein" value={orderForm.customerName} onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label>
                    <input className="kt-input" placeholder="+91 XXXXX XXXXX" value={orderForm.customerPhone} onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Order Date</label>
                    <input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">GST Rate</label>
                    <select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm(p => ({ ...p, gstRate: parseFloat(e.target.value) }))}>
                      {GST_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">Address</label>
                    <textarea className="kt-input" rows={2} style={{ resize: 'none' }} placeholder="Delivery address..." value={orderForm.customerAddress} onChange={e => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* ✅ Items with Searchable Dropdowns */}
              <div>
                <p className="sec-label">Items (Click or type to search - fast selection)</p>
                
                {orderItems.map((item, idx) => {
                  const rowProducts = getFilteredProductsForRow(item);
                  const rowCategories = getCategoriesFor(item.filterMaterialType);
                  const rowSubCategories = getSubCategoriesFor(item.filterMaterialType, item.filterCategory);
                  
                  return (
                    <div key={item.uid} className="item-row">
                      <div className="item-row-header">
                        <div className="flex items-center gap-3">
                          <div className="item-row-num">{idx + 1}</div>
                          {item.isWood ? (
                            <span className="unit-badge wood-badge">🪵 Wood Item</span>
                          ) : item.product ? (
                            <span className="unit-badge hardware-badge">🔧 Hardware/Other</span>
                          ) : null}
                        </div>
                        <button className="icon-btn" onClick={() => removeOrderItem(item.uid)} disabled={orderItems.length === 1}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      
                      {/* ✅ Searchable Filter Row */}
                      <div className="filter-row-inline">
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <SearchableSelect
                            options={getAllMaterialTypes()}
                            value={item.filterMaterialType}
                            onChange={(val) => updateOrderItem(item.uid, 'filterMaterialType', val)}
                            placeholder="🔍 Material Type..."
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <SearchableSelect
                            options={rowCategories}
                            value={item.filterCategory}
                            onChange={(val) => updateOrderItem(item.uid, 'filterCategory', val)}
                            placeholder="🔍 Category..."
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <SearchableSelect
                            options={rowSubCategories}
                            value={item.filterSubCategory}
                            onChange={(val) => updateOrderItem(item.uid, 'filterSubCategory', val)}
                            placeholder="🔍 Sub Category..."
                          />
                        </div>
                        <span className="text-xs text-amber-600 font-medium self-center whitespace-nowrap">
                          {rowProducts.length} items
                        </span>
                      </div>

                      {/* Product Selection Box */}
                      <div className="product-select-box">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                          {/* ✅ Product Searchable Dropdown */}
                          <div className="md:col-span-2">
                            <label className="text-xs font-medium text-gray-500 block mb-1.5">Product *</label>
                            <ProductSearchableSelect
                              products={rowProducts}
                              value={item.skuCode}
                              onChange={(val) => updateOrderItem(item.uid, 'skuCode', val)}
                            />
                          </div>

                          {/* Unit */}
                          <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1.5">Unit</label>
                            {item.isWood ? (
                              <select 
                                className="kt-input kt-input-sm"
                                value={item.unit}
                                onChange={e => updateOrderItem(item.uid, 'unit', e.target.value)}
                              >
                                {WOOD_UNIT_OPTIONS.map(u => (
                                  <option key={u} value={u}>{u}</option>
                                ))}
                              </select>
                            ) : (
                              <input 
                                className="kt-input kt-input-sm" 
                                value={item.unit || 'Pcs'} 
                                readOnly 
                              />
                            )}
                          </div>

                          {/* Size (for wood) */}
                          {item.isWood && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 block mb-1.5">Size</label>
                              <input className="kt-input kt-input-sm" value={item.size || '—'} readOnly />
                            </div>
                          )}

                          {/* Length (for wood) */}
                          {item.isWood && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 block mb-1.5">Length</label>
                              <div className="length-group">
                                <input
                                  type="number"
                                  min="0"
                                  className="kt-input kt-input-sm length-input"
                                  placeholder="Ft"
                                  value={item.lengthFeet}
                                  onChange={e => updateOrderItem(item.uid, 'lengthFeet', e.target.value)}
                                />
                                <span className="text-gray-400 text-xs">ft</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="11"
                                  className="kt-input kt-input-sm length-input"
                                  placeholder="In"
                                  value={item.lengthInches}
                                  onChange={e => updateOrderItem(item.uid, 'lengthInches', e.target.value)}
                                />
                                <span className="text-gray-400 text-xs">in</span>
                              </div>
                            </div>
                          )}

                          {/* Quantity/Pieces */}
                          <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1.5">
                              {item.isWood ? 'Pieces' : 'Qty'}
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="kt-input kt-input-sm"
                              placeholder={item.isWood ? 'Pcs' : 'Qty'}
                              value={item.quantity}
                              onChange={e => updateOrderItem(item.uid, 'quantity', e.target.value)}
                            />
                          </div>

                          {/* Rate */}
                          <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1.5">Rate (₹/{item.unit || 'Unit'})</label>
                            <input
                              type="number"
                              min="0"
                              className="kt-input kt-input-sm"
                              placeholder="₹ Rate"
                              value={item.rate}
                              onChange={e => updateOrderItem(item.uid, 'rate', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Calculation Display */}
                        {item.product && (
                          <div className="calc-display">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <div className="text-xs text-amber-800">
                                {item.isWood ? (
                                  <>
                                    <strong>Calculation ({item.unit}):</strong>{' '}
                                    {item.unit === 'CFT' && `(${item.width} × ${item.thickness} × ${(parseFloat(item.lengthFeet || 0) + parseFloat(item.lengthInches || 0)/12).toFixed(2)}' × ${item.quantity || 0}) ÷ 144`}
                                    {item.unit === 'RFT' && `${(parseFloat(item.lengthFeet || 0) + parseFloat(item.lengthInches || 0)/12).toFixed(2)}' × ${item.quantity || 0} pcs`}
                                    {item.unit === 'SQFT' && `(${item.width}" × ${(parseFloat(item.lengthFeet || 0) + parseFloat(item.lengthInches || 0)/12).toFixed(2)}' × ${item.quantity || 0}) ÷ 12`}
                                    {item.unit === 'Per Piece' && `${item.quantity || 0} pieces`}
                                    {' = '}
                                    <strong className="text-amber-900">{item.calculatedQty.toFixed(3)} {item.unit}</strong>
                                  </>
                                ) : (
                                  <>
                                    <strong>Qty:</strong> {item.quantity || 0} {item.unit}
                                  </>
                                )}
                              </div>
                              <div className="text-base font-bold text-amber-900">
                                Amount: ₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button onClick={addOrderItem} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#d97706', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <Plus className="w-4 h-4" />Add Another Item
                </button>
              </div>

              {/* Total Section */}
              <div className="flex justify-end">
                <div className="total-box" style={{ width: 300, background: '#fffbeb', borderColor: '#fde68a' }}>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {orderForm.gstRate > 0 && (
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>GST ({orderForm.gstRate}%)</span>
                      <span className="font-semibold">₹{orderTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-amber-300 pt-2 mt-2" style={{ color: '#7c3f00' }}>
                    <span>Total</span>
                    <span>₹{orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="kt-mfoot">
              <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
              <button className="btn-amber" disabled={!orderForm.customerName || orderSubtotal === 0 || saving} onClick={handleSubmitOrder}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Save Order</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHALLAN FORM MODAL */}
      {showChallanForm && selectedOrder && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in" style={{ maxWidth: 950 }}>
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{ background: '#fde68a', color: '#78350f' }}>2</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base m-0">Delivery Challan</h3>
                  <p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="kt-mbody space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Challan Date</label>
                  <input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Delivery Note</label>
                  <input className="kt-input" placeholder="e.g. Part 1, Vehicle no..." value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input
                    type="checkbox"
                    id="hide-price"
                    checked={hidePriceOnChallan}
                    onChange={e => setHidePriceOnChallan(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#d97706', cursor: 'pointer' }}
                  />
                  <label htmlFor="hide-price" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-amber-600" />
                    Hide Price on Challan
                  </label>
                </div>
              </div>

              <div>
                <p className="sec-label">Items to Deliver</p>
                <div className="kt-inset">
                  <div className="overflow-x-auto">
                    <table className="kt-tbl">
                      <thead><tr>
                        <th>Product</th>
                        <th className="c" style={{ width: 70 }}>Unit</th>
                        <th className="c" style={{ width: 60 }}>Size</th>
                        <th className="c" style={{ width: 70 }}>Length</th>
                        <th className="r" style={{ width: 80 }}>Ordered</th>
                        <th className="r" style={{ width: 80 }}>Sent</th>
                        <th className="r" style={{ width: 80 }}>Remaining</th>
                        <th className="r" style={{ width: 90 }}>Sending Pcs</th>
                        <th className="r" style={{ width: 90 }}>Calc Qty</th>
                      </tr></thead>
                      <tbody>
                        {challanItems.map(it => {
                          const rem = it.orderedQty - it.alreadySent;
                          return (
                            <tr key={it.uid}>
                              <td className="font-medium">
                                {it.product}
                                {it.isWood && <span className="unit-badge wood-badge ml-2">🪵</span>}
                              </td>
                              <td className="c text-xs text-gray-500">{it.unit}</td>
                              <td className="c text-xs text-gray-500">{it.size || '—'}</td>
                              <td className="c text-xs text-gray-500">{it.lengthDisplay || '—'}</td>
                              <td className="r text-gray-600">{it.orderedQty.toFixed(3)}</td>
                              <td className="r font-semibold" style={{ color: '#d97706' }}>{it.alreadySent ? it.alreadySent.toFixed(3) : '—'}</td>
                              <td className="r font-bold" style={{ color: rem <= 0.001 ? '#16a34a' : '#111827' }}>{rem <= 0.001 ? '✓ Done' : rem.toFixed(3)}</td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  className="kt-input"
                                  style={{ padding: '8px 10px', fontSize: 13, textAlign: 'right', background: rem <= 0.001 ? '#f9fafb' : undefined }}
                                  placeholder={it.isWood ? 'Pcs' : 'Qty'}
                                  value={it.sendingPcs}
                                  disabled={rem <= 0.001}
                                  onChange={e => updateChallanItem(it.uid, 'sendingPcs', e.target.value)}
                                />
                              </td>
                              <td className="r font-bold text-amber-700">
                                {it.sendingQty ? it.sendingQty.toFixed(3) : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {!hidePriceOnChallan && (
                <div className="flex justify-end">
                  <div className="total-box" style={{ minWidth: 240, background: '#fffbeb', borderColor: '#fde68a' }}>
                    <div className="flex justify-between font-bold text-base" style={{ color: '#7c3f00' }}>
                      <span>Challan Total</span>
                      <span>₹{challanItems.reduce((s, it) => s + (parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}

              {hidePriceOnChallan && (
                <div className="text-xs px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                  <EyeOff className="w-4 h-4" />
                  Price will be hidden on printed challan
                </div>
              )}
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
              <button className="btn-amber" disabled={saving} onClick={handleSubmitChallan}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><TruckIcon className="w-4 h-4" />Save & Print Challan</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL BILL MODAL */}
      {showBillPreview && selectedOrder && (
        <div className="kt-overlay">
          <div className="kt-modal kt-in" style={{ maxWidth: 800 }}>
            <div className="kt-mhead">
              <div className="flex items-center gap-3">
                <div className="step-dot" style={{ background: '#dcfce7', color: '#166534' }}>3</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base m-0">Final Invoice</h3>
                  <p className="text-xs text-gray-400 m-0">{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setShowBillPreview(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="kt-mbody">
              {(() => {
                const oc = challans.filter(c => c.orderNo === selectedOrder.orderNo);
                const m = {};
                oc.forEach(ch => ch.items?.forEach(it => {
                  if (!m[it.product]) m[it.product] = { product: it.product, unit: it.unit, rate: it.rate, totalQty: 0, totalAmount: 0, pieces: 0 };
                  m[it.product].totalQty += parseFloat(it.calculatedQty || it.sentQty || 0);
                  m[it.product].totalAmount += parseFloat(it.amount || 0);
                  m[it.product].pieces += parseFloat(it.pieces || it.sentQty || 0);
                }));
                const li = Object.values(m);
                const sub = li.reduce((s, i) => s + i.totalAmount, 0);
                const gstRate = selectedOrder.gstRate || 0;
                const tax = gstRate > 0 ? sub * (gstRate / 100) : 0;
                const total = sub + tax;

                return (
                  <div className="space-y-4">
                    <div className="text-xs px-4 py-2.5 rounded-xl" style={{ background: '#fef3c7', color: '#78350f', border: '1px solid #fde68a' }}>
                      <span className="font-bold">Challans: </span>
                      {oc.length ? oc.map(c => `${c.challanNo}`).join(', ') : 'Koi challan nahi'}
                    </div>
                    <div className="kt-inset">
                      <table className="kt-tbl">
                        <thead><tr>
                          <th style={{ width: 30 }}>#</th>
                          <th>Product</th>
                          <th className="c" style={{ width: 60 }}>Unit</th>
                          <th className="r" style={{ width: 55 }}>Pcs</th>
                          <th className="r" style={{ width: 70 }}>Total Qty</th>
                          <th className="r" style={{ width: 80 }}>Rate</th>
                          <th className="r" style={{ width: 100 }}>Amount</th>
                        </tr></thead>
                        <tbody>
                          {li.map((it, i) => (
                            <tr key={i}>
                              <td className="c text-gray-400 text-xs">{i + 1}</td>
                              <td className="font-medium">{it.product}</td>
                              <td className="c text-gray-500">{it.unit}</td>
                              <td className="r">{it.pieces}</td>
                              <td className="r font-semibold text-amber-700">{it.totalQty.toFixed(3)}</td>
                              <td className="r text-gray-500">₹{parseFloat(it.rate || 0).toLocaleString('en-IN')}</td>
                              <td className="r font-bold">₹{it.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end">
                      <div className="total-box" style={{ width: 280, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                        <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                        {gstRate > 0 && <div className="flex justify-between text-sm text-gray-500 mb-1.5"><span>GST ({gstRate}%)</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
                        <div className="flex justify-between font-bold text-base border-t border-green-200 pt-2" style={{ color: '#166534' }}><span>Grand Total</span><span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="kt-mfoot">
              <button className="btn-white" onClick={() => setShowBillPreview(false)}>Close</button>
              <button className="btn-white" onClick={() => printFinalBill(selectedOrder)}><Printer className="w-4 h-4" />Print</button>
              {selectedOrder.status === 'Completed' && (
                <button className="btn-green" onClick={() => { printFinalBill(selectedOrder); markBilled(selectedOrder.orderNo); }}>
                  <Receipt className="w-4 h-4" />Generate & Mark Billed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}