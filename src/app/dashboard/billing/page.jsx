
// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Trash2, Printer, Search, CheckCircle,
//   AlertTriangle, Loader2, RefreshCw, Download, Eye,
//   X, TruckIcon, ArrowRight, EyeOff, ChevronDown, Edit2, Wrench
// } from 'lucide-react';

// const SHOP_INFO = {
//   name: 'Krishna Timber & Plywoods',
//   address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
//   phone: '9826700196',
//   phone2: '9826275577',
//   gstin: '23ADCPC2098K1ZQ',
// };

// const GST_OPTIONS = [
//   { value: 0, label: 'No GST' },
//   { value: 5, label: 'GST 5%' },
//   { value: 12, label: 'GST 12%' },
//   { value: 18, label: 'GST 18%' },
// ];

// const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];
// const HARDWARE_UNIT_OPTIONS = ['Pcs', 'Pkt', 'Set', 'Dozen', 'Box', 'Kg', 'Meter'];
// const CUSTOM_UNIT_OPTIONS = ['Pcs', 'CFT', 'RFT', 'SQFT', 'Per Piece', 'Kg', 'Meter', 'Box', 'Set', 'Pkt', 'Dozen'];

// const CHARGE_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece', 'Lump Sum'];

// const CHARGE_TYPES = [
//   { value: 'labour', label: 'Labour Charges', icon: '👷' },
//   { value: 'installation', label: 'Installation Charges', icon: '🔧' },
//   { value: 'planing', label: 'Planing Charges', icon: '🪚' },
//   { value: 'transport', label: 'Transport Charges', icon: '🚛' },
//   { value: 'custom', label: 'Custom Charge', icon: '📋' },
// ];

// const LIGHT = {
//   maroon: '#7B1E1E', maroonDark: '#5a1515', maroonLight: '#9a2828',
//   cream: '#FBF6F0', creamLight: '#FFFBF5', creamDark: '#F0E6DA',
//   accent: '#FDF8F2', textDark: '#2a1010', textMuted: '#6b5454',
//   borderSoft: '#E8DCC8', cardBg: '#ffffff', pageBg: '#FBF6F0',
//   inputBg: '#ffffff', hoverBg: '#F0E6DA', modalBg: '#ffffff',
//   overlayBg: 'rgba(42,16,16,0.5)', shadow: 'rgba(123,30,30,0.05)',
//   shadowStrong: 'rgba(123,30,30,0.18)', tableEven: '#FDF8F2',
//   tableHover: '#FFFBF5', successBg: '#dcfce7', successColor: '#166534',
//   successBorder: '#bbf7d0', infoBg: '#dbeafe', infoColor: '#1e40af',
//   infoBorder: '#bfdbfe', errorBg: '#fef2f2', errorBorder: '#fecaca',
//   errorColor: '#dc2626', purpleBg: '#f3e8ff', purpleColor: '#6b21a8',
//   purpleBorder: '#e9d5ff', amberBg: '#fef3c7', amberColor: '#92400e',
//   amberBorder: '#fde68a',
// };

// const DARK = {
//   maroon: '#e8a0a0', maroonDark: '#c47070', maroonLight: '#f0b8b8',
//   cream: '#1a1a2e', creamLight: '#222240', creamDark: '#2a2a45',
//   accent: '#1e1e35', textDark: '#f0e8e8', textMuted: '#a89999',
//   borderSoft: '#3a3a55', cardBg: '#1e1e35', pageBg: '#0f0f1e',
//   inputBg: '#222240', hoverBg: '#2a2a45', modalBg: '#1e1e35',
//   overlayBg: 'rgba(0,0,0,0.65)', shadow: 'rgba(0,0,0,0.3)',
//   shadowStrong: 'rgba(0,0,0,0.5)', tableEven: '#1a1a2e',
//   tableHover: '#222240', successBg: '#052e16', successColor: '#4ade80',
//   successBorder: '#166534', infoBg: '#172554', infoColor: '#93c5fd',
//   infoBorder: '#1e40af', errorBg: '#450a0a', errorBorder: '#7f1d1d',
//   errorColor: '#fca5a5', purpleBg: '#2e1065', purpleColor: '#c4b5fd',
//   purpleBorder: '#6b21a8', amberBg: '#451a03', amberColor: '#fbbf24',
//   amberBorder: '#92400e',
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

// function calculateChargeAmount(charge) {
//   const qty = parseFloat(charge.quantity || 0);
//   const rate = parseFloat(charge.rate || 0);
//   switch (charge.unit) {
//     case 'Lump Sum': return Math.round(rate * 100) / 100;
//     default: return Math.round(qty * rate * 100) / 100;
//   }
// }

// function rebuildItemForEdit(savedItem) {
//   const item = {
//     uid: uid(), 
//     product: savedItem.product || '', 
//     unit: savedItem.unit || '',
//     lengthFeet: savedItem.lengthFeet || '', 
//     lengthInches: savedItem.lengthInches || '',
//     quantity: savedItem.quantity || '', 
//     rate: savedItem.rate || '',
//     amount: savedItem.amount || 0, 
//     calculatedQty: savedItem.calculatedQty || 0,
//     skuCode: savedItem.skuCode || '', 
//     isWood: savedItem.isWood || false,
//     width: parseFloat(savedItem.width || 0), 
//     thickness: parseFloat(savedItem.thickness || 0),
//     size: savedItem.size || '', 
//     materialType: savedItem.materialType || '',
//     category: savedItem.category || '', 
//     subCategory: savedItem.subCategory || '',
//     specification: savedItem.specification || '',
//   };
  
//   if (item.isWood && (!item.width || !item.thickness)) {
//     const dims = parseWoodDimensions(item.product);
//     if (dims) {
//       item.width = dims.width;
//       item.thickness = dims.thickness;
//       if (!item.size) item.size = `${dims.width}×${dims.thickness}"`;
//     }
//   }
  
//   const calc = calculateByUnit(item);
//   item.calculatedQty = calc.calculatedQty;
//   item.amount = calc.amount;
//   return item;
// }

// function numberToWords(num) {
//   const ones = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
//     'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   if (num === 0) return 'Zero';
//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//     if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
//     if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
//     if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
//     return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
//   }
//   const i = Math.floor(num), d = Math.round((num - i) * 100);
//   return convert(i) + ' Rupees' + (d > 0 ? ' and ' + convert(d) + ' Paise' : '') + ' Only';
// }

// const normalizeText = v => String(v || '').trim();

// const makeDropdownKey = (p) =>
//   [
//     normalizeText(p.materialType || 'Custom'),
//     normalizeText(p.category || 'Custom'),
//     normalizeText(p.subCategory || ''),
//     normalizeText(p.materialName || p.product || ''),
//     normalizeText(p.unit || 'Pcs'),
//   ].join('|').toLowerCase();

// // ========== STABLE SEARCHABLE SELECT ==========
// function SearchableSelect({
//   options,
//   value,
//   onChange,
//   placeholder = 'Search...',
//   disabled = false,
//   allowCustom = false,
//   T,
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputValue, setInputValue] = useState('');
//   const [hiIdx, setHiIdx] = useState(0);
//   const wrapRef = useRef(null);
//   const isSelectingRef = useRef(false);

//   const getVal = o => typeof o === 'string' ? o : o.value ?? o.label ?? o;
//   const getDisp = o => typeof o === 'string' ? o : o.label ?? o.value ?? o;

//   // Sync inputValue when value changes externally
//   useEffect(() => {
//     if (isSelectingRef.current) return;
//     if (!value) {
//       setInputValue('');
//       return;
//     }
//     const match = options.find(o => getVal(o) === value);
//     if (match) setInputValue(getDisp(match));
//     else if (allowCustom) setInputValue(value);
//     else setInputValue('');
//   }, [value, options, allowCustom]);

//   const filtered = options.filter(o =>
//     getDisp(o).toLowerCase().includes((inputValue || '').toLowerCase())
//   );
//   const exactMatch = options.find(o => getDisp(o).toLowerCase() === (inputValue || '').trim().toLowerCase());

//   const commitValue = (val, disp) => {
//     isSelectingRef.current = true;
//     const finalVal = val ?? inputValue ?? '';
//     const finalDisp = disp ?? (typeof finalVal === 'string' ? finalVal : getDisp(finalVal));
//     onChange(finalVal);
//     setInputValue(finalDisp);
//     setIsOpen(false);
//     setHiIdx(0);
//     setTimeout(() => { isSelectingRef.current = false; }, 100);
//   };

//   // Outside click – only close dropdown, don't change value
//   useEffect(() => {
//     const h = e => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target)) {
//         setIsOpen(false);
//         if (value) {
//           const match = options.find(o => getVal(o) === value);
//           if (match) setInputValue(getDisp(match));
//           else if (allowCustom) setInputValue(value);
//         } else {
//           setInputValue('');
//         }
//       }
//     };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, [value, options, allowCustom]);

//   const handleKey = e => {
//     if (!isOpen) {
//       if (e.key === 'ArrowDown' || e.key === 'Enter') { setIsOpen(true); e.preventDefault(); }
//       return;
//     }
//     const totalOptions = filtered.length + (allowCustom && inputValue?.trim() && !exactMatch ? 1 : 0);
//     if (e.key === 'ArrowDown') { e.preventDefault(); setHiIdx(p => Math.min(p + 1, totalOptions - 1)); }
//     else if (e.key === 'ArrowUp') { e.preventDefault(); setHiIdx(p => Math.max(p - 1, 0)); }
//     else if (e.key === 'Enter') {
//       e.preventDefault();
//       if (filtered[hiIdx]) {
//         const opt = filtered[hiIdx];
//         commitValue(getVal(opt), getDisp(opt));
//       } else if (allowCustom) {
//         commitValue(inputValue, inputValue);
//       }
//     }
//     else if (e.key === 'Escape') { setIsOpen(false); }
//   };

//   return (
//     <div ref={wrapRef} className="searchable-select">
//       <div className="ss-input-wrap">
//         <input
//           type="text"
//           className="ss-input"
//           placeholder={placeholder}
//           value={inputValue}
//           onChange={e => {
//             setInputValue(e.target.value);
//             setHiIdx(0);
//             if (!isOpen) setIsOpen(true);
//           }}
//           onFocus={() => setIsOpen(true)}
//           onKeyDown={handleKey}
//           disabled={disabled}
//           style={{ background: T?.inputBg, color: T?.textDark, borderColor: T?.borderSoft }}
//         />
//         <div className="ss-icons">
//           {inputValue && !disabled && (
//             <button
//               type="button"
//               className="ss-clear"
//               onClick={e => {
//                 e.stopPropagation();
//                 setInputValue('');
//                 onChange('');
//                 setIsOpen(false);
//               }}
//               style={{ background: T?.creamDark, color: T?.textMuted }}
//             >
//               <X className="w-3 h-3" />
//             </button>
//           )}
//           <ChevronDown className={`ss-arrow ${isOpen ? 'open' : ''}`} style={{ color: T?.textMuted }} />
//         </div>
//       </div>

//       {isOpen && !disabled && (
//         <div className="ss-dropdown" style={{ background: T?.cardBg, borderColor: T?.borderSoft }}>
//           {filtered.length > 0 && (
//             <div className="ss-options">
//               {filtered.map((o, idx) => (
//                 <div
//                   key={idx}
//                   className={`ss-option ${hiIdx === idx ? 'highlighted' : ''} ${getVal(o) === value ? 'selected' : ''}`}
//                   onClick={() => commitValue(getVal(o), getDisp(o))}
//                   onMouseEnter={() => setHiIdx(idx)}
//                   style={{ color: T?.textDark, borderColor: T?.accent }}
//                 >
//                   {getDisp(o)}
//                 </div>
//               ))}
//             </div>
//           )}

//           {allowCustom && inputValue?.trim() && !exactMatch && (
//             <div
//               className={`ss-option ${hiIdx === filtered.length ? 'highlighted' : ''}`}
//               onClick={() => commitValue(inputValue, inputValue)}
//               onMouseEnter={() => setHiIdx(filtered.length)}
//               style={{
//                 color: T?.maroon,
//                 fontWeight: 600,
//                 borderTop: `1px dashed ${T?.borderSoft}`,
//                 background: T?.cream,
//               }}
//             >
//               ✏️ Use: "{inputValue.trim()}"
//             </div>
//           )}

//           {filtered.length === 0 && !(allowCustom && inputValue?.trim()) && (
//             <div className="ss-no-results" style={{ color: T?.textMuted }}>No results</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// const PRINT_CSS = `
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:Arial,sans-serif;font-size:11px;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// .page{max-width:195mm;margin:0 auto;padding:8mm 10mm}
// .action-bar{display:flex;gap:10px;justify-content:center;padding:12px;background:#FBF6F0;border-radius:10px;margin-bottom:16px;border:1px solid #E8DCC8}
// .action-btn{padding:9px 22px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
// .btn-print{background:#7B1E1E;color:#fff}.btn-print:hover{background:#5a1515}
// .btn-save{background:#5a1515;color:#fff}.btn-save:hover{background:#3d0d0d}
// .ktp-header{background:#7B1E1E;color:#fff;padding:10px 16px 9px;border:2px solid #7B1E1E;display:flex;align-items:center;gap:14px}
// .ktp-logo-circle{width:52px;height:52px;border-radius:50%;border:2.5px solid #fff;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
// .ktp-logo-circle img{width:100%;height:100%;object-fit:cover;border-radius:50%}
// .ktp-header-center{flex:1;text-align:center}
// .ktp-brand-name{font-size:30px;font-style:italic;font-weight:bold;font-family:Georgia,serif;color:#fff;line-height:1}
// .ktp-brand-sub{font-size:14px;font-family:Georgia,serif;font-style:italic;color:#f5d0d0;letter-spacing:2px;margin-top:1px}
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
// tr.charge-row{background:#FEF3C7!important}
// tr.charge-row td{font-style:italic;color:#92400e}
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
// @media print{
//   .action-bar{display:none!important}
//   body{font-size:10px}.page{padding:6mm 8mm}
//   .ktp-header{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   table.items thead tr{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   table.items th{color:#fff!important}
//   .ktp-total-row.grand{background:#000!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   .ktp-gstin,.ktp-dc-title,.ktp-footer-sig{color:#000!important}
//   table.items tbody tr:nth-child(even),table.items tbody tr:nth-child(odd){background:#fff!important}
//   tr.charge-row{background:#FEF3C7!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
//   .ktp-words,.ktp-info,.ktp-meta,.ktp-footer{background:#fff!important}
// }
// @page{size:A4;margin:8mm}
// `;

// const buildItemDesc = (it) => {
//   let name = `<strong>${it.product}</strong>`;
//   let details = [];
  
//   if (it.specification && it.specification.trim()) {
//     details.push(`(${it.specification})`);
//   }
  
//   if (it.size) details.push(it.size);
//   const ld = it.lengthDisplay || '';
//   if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
//   if (details.length) name += `<br><span style="font-size:8.5px;color:#6b5454">${details.join(' · ')}</span>`;
//   return name;
// };

// const getChallanPrintHTML = (order, challan, hidePrice = false) => {
//   const regularItems = (challan.items || []).filter(it => !it.isCharge);
//   const chargeItems = (challan.items || []).filter(it => it.isCharge);
//   const itemsTotal = regularItems.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
//   const chargesTotal = chargeItems.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
//   const challanTotal = itemsTotal + chargesTotal;
//   const poLine = order.poNumber ? `<div class="ktp-field"><span class="ktp-field-label">PO No:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
//   const gstLine = order.gstCustomerName ? `<div class="ktp-field"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';
//   let sno = 0;

//   const itemRows = regularItems.map(it => {
//     sno++;
//     const qtyVal = it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty;
//     const qtyWithUnit = it.unit ? `${qtyVal} <span style="font-size:8.5px;color:#6b5454">${it.unit}</span>` : qtyVal;
//     return `<tr>
//       <td class="c" style="width:32px">${sno}</td>
//       <td>${buildItemDesc({ ...it, specification: it.specification })}</td>
//       ${!hidePrice ? `
//         <td class="r" style="width:90px">${qtyWithUnit}</td>
//         <td class="r" style="width:75px">${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//         <td class="r" style="width:90px"><strong>${parseFloat(it.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
//       ` : `<td class="r" style="width:90px">${qtyWithUnit}</td>`}
//     </tr>`;
//   });

//   const chargeRows = chargeItems.map(ch => {
//     sno++;
//     const icon = ch.chargeIcon || '📋';
//     const unitLabel = ch.unit || 'Per Piece';
//     let qtyDisp, rateDisp, calcExplain;
//     if (unitLabel === 'Lump Sum') {
//       qtyDisp = '—'; 
//       rateDisp = 'Lump Sum'; 
//       calcExplain = 'Fixed Amount';
//     } else {
//       const q = parseFloat(ch.quantity || 0);
//       qtyDisp = `${q} <span style="font-size:8.5px;color:#92400e">${unitLabel}</span>`;
//       rateDisp = parseFloat(ch.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
//       calcExplain = `${q} ${unitLabel} × ₹${ch.rate}`;
//     }
//     return `<tr class="charge-row">
//       <td class="c" style="width:32px">${sno}</td>
//       <td>
//         <strong>${icon} ${ch.product}</strong>
//         <br><span style="font-size:8.5px">${calcExplain}</span>
//         ${ch.chargeDescription ? `<br><span style="font-size:8px;color:#6b5454">${ch.chargeDescription}</span>` : ''}
//       </td>
//       ${!hidePrice ? `
//         <td class="r" style="width:90px">${qtyDisp}</td>
//         <td class="r" style="width:75px">${rateDisp}</td>
//         <td class="r" style="width:90px"><strong>${parseFloat(ch.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
//       ` : `<td class="r" style="width:90px">${qtyDisp}</td>`}
//     </tr>`;
//   });

//   const allRows = [...itemRows, ...chargeRows];
//   const totalRows = Math.max(0, 12 - allRows.length);
//   const emptyRows = Array(totalRows).fill(`<tr class="erow"><tr><td><td>${!hidePrice ? '<td><td><td></td>' : '<td>'}</tr>`);

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}</style></head><body><div class="page">
// <div class="action-bar"><button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button><button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button></div>
// <div class="ktp-header"><div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div><div class="ktp-header-center"><div class="ktp-brand-name">Krishna</div><div class="ktp-brand-sub">Timber &amp; Plywoods</div><div class="ktp-brand-addr">${SHOP_INFO.address}&nbsp;&nbsp;Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div></div></div>
// <div class="ktp-meta"><div class="ktp-meta-left"><div class="ktp-since">Chhabra's Since 1979</div><div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div></div><div class="ktp-dc-box"><div class="ktp-dc-title" style="font-style: italic;">Delivery Challan</div><div style="font-size:9px;color:#6b5454;margin-top:2px;">No.: <strong style="color:#2a1010">${challan.challanNo}</strong>&nbsp;&nbsp;&nbsp;Date: <strong style="color:#2a1010">${new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div></div></div>
// <div class="ktp-info"><div class="ktp-info-row1"><div class="ktp-field"><span class="ktp-field-label">CONSIGNOR (Details of Receiver)</span></div></div><div class="ktp-info-row2"><div class="ktp-field"><span class="ktp-field-label">Name:</span><span class="ktp-field-value wide">${order.customerName}</span></div><div class="ktp-field"><span class="ktp-field-label">Vehicle No.:</span><span class="ktp-field-value medium">&nbsp;</span></div></div><div class="ktp-info-row3"><div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value" style="min-width:300px">${order.customerAddress || '&nbsp;'}</span></div></div>${(order.customerPhone || order.poNumber || order.gstCustomerName) ? `<div class="ktp-info-row3" style="margin-top:5px">${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}${poLine}${gstLine}<div class="ktp-field"><span class="ktp-field-label">Ref Order:</span><span class="ktp-field-value medium">${order.orderNo}</span></div>${challan.deliveryNote ? `<div class="ktp-field"><span class="ktp-field-label">Note:</span><span class="ktp-field-value medium">${challan.deliveryNote}</span></div>` : ''}</div>` : ''}</div>
// <div class="ktp-table-wrap"><table class="items"><thead><tr><th style="width:32px">S.No.</th><th class="tl">Description of Goods</th>${!hidePrice ? `<th style="width:90px">Qty</th><th style="width:75px">Rate (₹)</th><th style="width:90px">Total (₹)</th>` : `<th style="width:90px">Qty</th>`}</tr></thead><tbody>${allRows.join('')}${emptyRows.join('')}</tbody></table></div>
// ${!hidePrice ? `<div class="ktp-words"><div class="ktp-words-label">Amount in Words</div><div class="ktp-words-text">${numberToWords(challanTotal)}</div></div>` : ''}
// <div class="ktp-footer">
//   <div class="ktp-footer-left">
//     <div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div>
//     <div class="ktp-footer-sig">For : Krishna Timber &amp; Plywoods</div>
//     <div style="margin-top:20px;font-size:8.5px;color:#6b5454"> 
//       • Good once sold will not be taken back.<br/>
//       • All disputes subject to Bhopal jurisdiction.
//     </div>
//     <div style="margin-top:14px;display:flex;align-items:flex-end;gap:10px;">
//       <div><div style="width:170px;border-top:1px solid #000;margin-bottom:3px"></div><div style="font-size:8.5px;font-weight:bold">Customer Signature</div></div>
//       <div style="font-size:8.5px;color:#6b5454;margin-bottom:4px">Received goods in good condition</div>
//     </div>
//   </div>
//   <div class="ktp-footer-right">
//     ${!hidePrice ? `<div class="ktp-total-row"><span class="ktp-total-label">Freight</span><span class="ktp-total-val">&nbsp;</span></div><div class="ktp-total-row"><span class="ktp-total-label">Total Taxable Amt ₹</span><span class="ktp-total-val">${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div><div class="ktp-total-row grand"><span>Challan Total ₹</span><span>${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>` : `<div style="padding:12px 10px;font-size:9px;text-align:center;color:#7B1E1E;font-weight:bold;">DELIVERY CHALLAN<br/>FOR GOODS REFERENCE ONLY</div>`}
//     <div class="ktp-sig-row"><div style="text-align:center"><div style="width:120px;border-top:1px solid #000;margin-bottom:3px"></div><div style="font-size:8.5px;font-weight:bold">Authorised Signatory</div></div></div>
//     <div class="ktp-eoe">E. &amp; O.E.</div>
//   </div>
// </div>
// </div><script>function savePDF(){document.querySelector('.action-bar').style.display='none';window.print();setTimeout(()=>{document.querySelector('.action-bar').style.display='flex';},1000);}</script></body></html>`;
// };

// const apiGet = async url => { try { const r = await fetch(url); if (!r.ok) return { success: false, data: [] }; return r.json(); } catch { return { success: false, data: [] }; } };
// const apiPost = async (url, body) => { try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
// const apiPatch = async (url, body) => { try { const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
// const apiDelete = async (url, body) => { try { const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
// const openPDFView = html => { const w = window.open('', '_blank'); w.document.write(html); w.document.close(); };
// const openPDFPrint = html => { const w = window.open('', '_blank'); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 600); };
// const sortLatestFirst = (items, df) => [...items].sort((a, b) => { const aT = a.createdAt || a.updatedAt || a[df] || ''; const bT = b.createdAt || b.updatedAt || b[df] || ''; if (aT && bT) { const d = new Date(bT).getTime() - new Date(aT).getTime(); if (d !== 0) return d; } return (parseInt((b.orderNo || b.challanNo || '').split('-').pop()) || 0) - (parseInt((a.orderNo || a.challanNo || '').split('-').pop()) || 0); });

// export default function OrderChallanBilling() {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [orders, setOrders] = useState([]);
//   const [challans, setChallans] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [challanSearchQuery, setChallanSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingOrder, setEditingOrder] = useState(null);
//   const [showChallanForm, setShowChallanForm] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showChallanSuccess, setShowChallanSuccess] = useState(false);
//   const [lastChallanHTML, setLastChallanHTML] = useState('');
//   const [lastChallanNo, setLastChallanNo] = useState('');
//   const [orderForm, setOrderForm] = useState({
//     customerName: '', customerPhone: '', customerAddress: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     gstRate: 0, notes: '', poNumber: '', gstCustomerName: '', hidePrice: false,
//   });
//   const [orderGroups, setOrderGroups] = useState([createEmptyGroup()]);
//   const [orderCharges, setOrderCharges] = useState([]);
//   const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
//   const [challanItems, setChallanItems] = useState([]);
//   const [deliveryNote, setDeliveryNote] = useState('');
//   const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [addingToSheet, setAddingToSheet] = useState({});

//   useEffect(() => {
//     const s = localStorage.getItem('ktp-dark-mode');
//     if (s === 'true') setDarkMode(true);
//     const h = e => { if (e.key === 'ktp-dark-mode') setDarkMode(e.newValue === 'true'); };
//     window.addEventListener('storage', h);
//     const i = setInterval(() => {
//       const c = localStorage.getItem('ktp-dark-mode') === 'true';
//       setDarkMode(p => p !== c ? c : p);
//     }, 300);
//     return () => { window.removeEventListener('storage', h); clearInterval(i); };
//   }, []);

//   const T = darkMode ? DARK : LIGHT;

//   function createEmptyItem(ov = {}) {
//     return {
//       uid: uid(), 
//       product: '', 
//       unit: '', 
//       lengthFeet: '', 
//       lengthInches: '',
//       quantity: '', 
//       rate: '', 
//       amount: 0, 
//       calculatedQty: 0,
//       skuCode: '', 
//       isWood: false, 
//       width: 0, 
//       thickness: 0,
//       size: '', 
//       materialType: '', 
//       category: '', 
//       subCategory: '',
//       specification: '',
//       ...ov,
//     };
//   }

//   function createEmptyGroup() {
//     return {
//       groupId: uid(),
//       filterMaterialType: '',
//       filterCategory: '',
//       filterSubCategory: '',
//       items: [createEmptyItem()],
//     };
//   }

//   function createEmptyCharge() {
//     return {
//       uid: uid(), chargeType: '', chargeName: '',
//       chargeDescription: '', unit: 'Per Piece',
//       quantity: '', rate: '', amount: 0,
//     };
//   }

//   const getAllOrderItems = () =>
//     orderGroups.flatMap(g =>
//       g.items.map(item => ({
//         ...item,
//         filterMaterialType: g.filterMaterialType,
//         filterCategory: g.filterCategory,
//         filterSubCategory: g.filterSubCategory,
//       }))
//     );

//   const orderSubtotal = getAllOrderItems().reduce((s, i) => s + (i.amount || 0), 0);
//   const chargesSubtotal = orderCharges.reduce((s, c) => s + (c.amount || 0), 0);
//   const orderTax = orderForm.gstRate > 0 ? (orderSubtotal + chargesSubtotal) * (orderForm.gstRate / 100) : 0;
//   const orderTotal = orderSubtotal + chargesSubtotal + orderTax;

//   const fetchData = useCallback(async () => {
//     setLoading(true); setError(null);
//     try {
//       const [oR, cR, pR] = await Promise.all([
//         apiGet('/api/billing-backend/orders'),
//         apiGet('/api/billing-backend/challans'),
//         apiGet('/api/dropdown-data'),
//       ]);
//       setOrders(oR.success ? oR.data || [] : []);
//       setChallans(cR.success ? cR.data || [] : []);
//       setProducts(pR.success && pR.data ? pR.data : []);
//     } catch { setError('Data load problem'); }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const isWoodMaterial = item => {
//     if (!item) return false;
//     const mt = (item.materialType || '').toLowerCase();
//     const cat = (item.category || '').toLowerCase();
//     const name = (item.materialName || item.product || '').toLowerCase();
//     return mt.includes('timber') || mt.includes('wood') || mt.includes('lakdi') ||
//       cat.includes('teak') || cat.includes('sagwan') || cat.includes('pine') ||
//       cat.includes('sal') || name.includes('wood') || name.includes('timber');
//   };

//   const getFilteredProductsForGroup = g =>
//     products.filter(p => {
//       if (g.filterMaterialType && p.materialType !== g.filterMaterialType) return false;
//       if (g.filterCategory && p.category !== g.filterCategory) return false;
//       if (g.filterSubCategory && p.subCategory !== g.filterSubCategory) return false;
//       return true;
//     });

//   const getAllMaterialTypes = () => [...new Set(products.map(p => p.materialType).filter(Boolean))];
//   const getCategoriesFor = mt => [...new Set(products.filter(p => !mt || p.materialType === mt).map(p => p.category).filter(Boolean))];
//   const getSubCategoriesFor = (mt, cat) => [...new Set(products.filter(p => (!mt || p.materialType === mt) && (!cat || p.category === cat)).map(p => p.subCategory).filter(Boolean))];

//   const updateGroupFilter = (gid, field, val) => {
//     setOrderGroups(prev => prev.map(g => {
//       if (g.groupId !== gid) return g;
//       return { ...g, [field]: val };
//     }));
//   };

//   const addItemToGroup = gid => {
//     setOrderGroups(prev => prev.map(g =>
//       g.groupId !== gid ? g : { ...g, items: [...g.items, createEmptyItem()] }
//     ));
//   };

//   const removeItemFromGroup = (gid, iuid) => {
//     setOrderGroups(prev => prev.map(g => {
//       if (g.groupId !== gid || g.items.length === 1) return g;
//       return { ...g, items: g.items.filter(i => i.uid !== iuid) };
//     }));
//   };

//   const removeGroup = gid => {
//     if (orderGroups.length === 1) return;
//     setOrderGroups(prev => prev.filter(g => g.groupId !== gid));
//   };

//   const addNewGroup = () => setOrderGroups(prev => [...prev, createEmptyGroup()]);

//   const updateGroupItem = (gid, iuid, field, val) => {
//     setOrderGroups(prev => prev.map(g => {
//       if (g.groupId !== gid) return g;
//       return {
//         ...g,
//         items: g.items.map(item => {
//           if (item.uid !== iuid) return item;
//           const u = { ...item, [field]: val };

//           if (field === 'skuCode') {
//             const f = products.find(p => p.skuCode === val);
//             if (f) {
//               u.product = f.materialName;
//               u.skuCode = f.skuCode;
//               u.materialType = f.materialType;
//               u.category = f.category;
//               u.subCategory = f.subCategory;
//               u.isWood = isWoodMaterial(f);
//               if (u.isWood) {
//                 u.unit = 'CFT';
//                 const dims = parseWoodDimensions(f.materialName);
//                 if (dims) {
//                   u.width = dims.width;
//                   u.thickness = dims.thickness;
//                   u.size = `${dims.width}×${dims.thickness}"`;
//                 } else {
//                   u.width = 0;
//                   u.thickness = 0;
//                   u.size = '';
//                 }
//               } else {
//                 u.unit = f.unit || 'Pcs';
//                 u.width = 0;
//                 u.thickness = 0;
//                 u.size = '';
//                 u.lengthFeet = '';
//                 u.lengthInches = '';
//               }
//             } else if (!val) {
//               u.product = '';
//               u.skuCode = '';
//             }
//           }

//           if (field === 'customProductName') {
//             if (val && val.trim()) {
//               u.product = val;
//               u.skuCode = '';
//               u.materialType = g.filterMaterialType || u.materialType || 'Custom';
//               u.category = g.filterCategory || u.category || 'Custom';
//               u.subCategory = g.filterSubCategory || u.subCategory || '';
//               u.isWood = /wood|timber|ply|block|flush|door|sagwan|teak|pine|sal|lumber/i.test(val);
              
//               if (!u.unit || u.unit === '') {
//                 u.unit = u.isWood ? 'CFT' : 'Pcs';
//               }

//               if (u.isWood) {
//                 const dims = parseWoodDimensions(val);
//                 if (dims) {
//                   u.width = dims.width;
//                   u.thickness = dims.thickness;
//                   u.size = `${dims.width}×${dims.thickness}"`;
//                 }
//               } else {
//                 u.width = 0;
//                 u.thickness = 0;
//                 u.size = '';
//               }
//             }
//           }

//           if (field === 'specification') {
//             u.specification = val;
//           }
//           if (field === 'unit') u.unit = val;
//           if (field === 'quantity') u.quantity = val;
//           if (field === 'rate') u.rate = val;
//           if (field === 'lengthFeet') u.lengthFeet = val;
//           if (field === 'lengthInches') u.lengthInches = val;

//           const calc = calculateByUnit(u);
//           u.calculatedQty = calc.calculatedQty;
//           u.amount = calc.amount;
//           return u;
//         }),
//       };
//     }));
//   };

//   const addCharge = () => setOrderCharges(prev => [...prev, createEmptyCharge()]);
//   const removeCharge = cuid => setOrderCharges(prev => prev.filter(c => c.uid !== cuid));
//   const updateCharge = (cuid, field, val) => {
//     setOrderCharges(prev => prev.map(c => {
//       if (c.uid !== cuid) return c;
//       const u = { ...c, [field]: val };
//       if (field === 'chargeType') {
//         const ct = CHARGE_TYPES.find(t => t.value === val);
//         if (ct) u.chargeName = ct.label;
//       }
//       if (field === 'unit' && val === 'Lump Sum') { u.quantity = ''; }
//       u.amount = calculateChargeAmount(u);
//       return u;
//     }));
//   };

//   const genOrderNo = () => {
//     const y = new Date().getFullYear(), px = `ORD-${y}-`;
//     const max = orders.filter(o => o.orderNo?.startsWith(px))
//       .reduce((m, o) => { const n = parseInt(o.orderNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0);
//     return `${px}${String(max + 1).padStart(4, '0')}`;
//   };

//   const genChallanNo = () => {
//     const y = new Date().getFullYear(), px = `CHL-${y}-`;
//     const max = challans.filter(c => c.challanNo?.startsWith(px))
//       .reduce((m, c) => { const n = parseInt(c.challanNo?.replace(px, '') || '0'); return n > m ? n : m; }, 0);
//     return `${px}${String(max + 1).padStart(4, '0')}`;
//   };

//   const getExistingChallanForOrder = orderNo => challans.filter(c => c.orderNo === orderNo);

//   const openEditOrder = order => {
//     setIsEditMode(true);
//     setEditingOrder(order);
//     setOrderForm({
//       customerName: order.customerName || '',
//       customerPhone: order.customerPhone || '',
//       customerAddress: order.customerAddress || '',
//       orderDate: order.orderDate || new Date().toISOString().split('T')[0],
//       gstRate: order.gstRate || 0,
//       notes: order.notes || '',
//       poNumber: order.poNumber || '',
//       gstCustomerName: order.gstCustomerName || '',
//       hidePrice: order.hidePrice || false,
//     });

//     const savedItems = order.items || [];
//     const regularItems = savedItems.filter(i => !i.isCharge);
//     const savedCharges = savedItems.filter(i => i.isCharge);

//     if (regularItems.length === 0) {
//       setOrderGroups([createEmptyGroup()]);
//     } else {
//       const gm = {};
//       regularItems.forEach(it => {
//         const k = it.materialType || 'Other';
//         if (!gm[k]) gm[k] = [];
//         gm[k].push(rebuildItemForEdit(it));
//       });
//       setOrderGroups(Object.entries(gm).map(([mt, items]) => ({
//         groupId: uid(),
//         filterMaterialType: mt === 'Other' ? '' : mt,
//         filterCategory: items[0]?.category || '',
//         filterSubCategory: items[0]?.subCategory || '',
//         items,
//       })));
//     }

//     setOrderCharges(savedCharges.map(ch => {
//       const rebuilt = {
//         uid: uid(),
//         chargeType: ch.chargeType || 'custom',
//         chargeName: ch.product || ch.chargeName || '',
//         chargeDescription: ch.chargeDescription || '',
//         unit: ch.unit || 'Per Piece',
//         quantity: ch.quantity || '',
//         rate: ch.rate || '',
//         amount: 0,
//       };
//       rebuilt.amount = calculateChargeAmount(rebuilt);
//       return rebuilt;
//     }));

//     setShowOrderForm(true);
//   };

//   const resetOrderForm = () => {
//     setOrderForm({
//       customerName: '', customerPhone: '', customerAddress: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       gstRate: 0, notes: '', poNumber: '', gstCustomerName: '', hidePrice: false,
//     });
//     setOrderGroups([createEmptyGroup()]);
//     setOrderCharges([]);
//     setIsEditMode(false);
//     setEditingOrder(null);
//   };

//   const handleAddToSheet = async (group, item) => {
//     if (!item.product) {
//       setError('Product name required');
//       return;
//     }
//     if (item.skuCode) {
//       setError('Product already in sheet');
//       return;
//     }
//     setAddingToSheet(prev => ({ ...prev, [item.uid]: true }));
//     try {
//       const productData = {
//         materialType: item.materialType || group.filterMaterialType || 'Custom',
//         category: item.category || group.filterCategory || 'Custom',
//         subCategory: item.subCategory || group.filterSubCategory || '',
//         materialName: item.product,
//         unit: item.unit || (item.isWood ? 'CFT' : 'Pcs'),
//       };
//       const res = await apiPost('/api/dropdown-data', { products: [productData] });
//       if (res.success && res.data && res.data.length) {
//         const newProduct = res.data[0];
//         setProducts(prev => {
//           const exists = prev.some(p => p.skuCode === newProduct.skuCode);
//           return exists ? prev : [...prev, newProduct];
//         });
//         updateGroupItem(group.groupId, item.uid, 'skuCode', newProduct.skuCode);
//         setError(null);
//       } else {
//         setError(res.error || 'Failed to add to sheet');
//       }
//     } catch (err) {
//       setError('Error adding to sheet: ' + err.message);
//     } finally {
//       setAddingToSheet(prev => ({ ...prev, [item.uid]: false }));
//     }
//   };

//   const handleSubmitOrder = async () => {
//     if (!orderForm.customerName || getAllOrderItems().filter(i => i.product).length === 0) {
//       setError('Customer name aur items required');
//       return;
//     }
//     setSaving(true);
//     setError(null);

//     try {
//       let validItems = getAllOrderItems()
//         .filter(i => i.product && (i.quantity || i.calculatedQty))
//         .map(it => ({
//           ...it,
//           lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
//           isCharge: false,
//           specification: it.specification || '',
//         }));

//       const validCharges = orderCharges
//         .filter(c => c.chargeName && c.amount > 0)
//         .map(ch => ({
//           ...ch,
//           product: ch.chargeName,
//           isCharge: true,
//           calculatedQty: ch.unit === 'Lump Sum' ? 1 : parseFloat(ch.quantity || 0),
//           chargeIcon: CHARGE_TYPES.find(t => t.value === ch.chargeType)?.icon || '📋',
//           specification: '',
//         }));

//       const allItems = [...validItems, ...validCharges];

//       let orderNo;
//       let existingChallans = [];

//       if (isEditMode && editingOrder) {
//         orderNo = editingOrder.orderNo;
//         existingChallans = getExistingChallanForOrder(orderNo);
//         const r = await apiPatch('/api/billing-backend/orders', {
//           orderNo,
//           order: {
//             ...orderForm, orderNo,
//             subtotal: orderSubtotal,
//             chargesTotal: chargesSubtotal,
//             tax: orderTax,
//             total: orderTotal,
//             status: editingOrder.status,
//             includeGST: orderForm.gstRate > 0,
//             hidePrice: orderForm.hidePrice,
//           },
//           items: allItems,
//         });
//         if (!r.success) { setError(r.error || 'Edit fail'); setSaving(false); return; }
//         for (const old of existingChallans) {
//           await apiDelete('/api/billing-backend/challans', { challanNo: old.challanNo });
//         }
//       } else {
//         orderNo = genOrderNo();
//         const r = await apiPost('/api/billing-backend/orders', {
//           order: {
//             ...orderForm, orderNo,
//             subtotal: orderSubtotal,
//             chargesTotal: chargesSubtotal,
//             tax: orderTax,
//             total: orderTotal,
//             status: 'Active',
//             includeGST: orderForm.gstRate > 0,
//             hidePrice: orderForm.hidePrice,
//           },
//           items: allItems,
//         });
//         if (!r.success) { setError(r.error || 'Save fail'); setSaving(false); return; }
//       }

//       const challanNo = (isEditMode && existingChallans.length > 0)
//         ? existingChallans[0].challanNo
//         : genChallanNo();
//       const hidePrice = orderForm.hidePrice || false;
//       const challanTotal = hidePrice ? 0 : (orderSubtotal + chargesSubtotal);

//       const challanPayload = {
//         challan: {
//           challanNo, 
//           orderNo,
//           customerName: orderForm.customerName,
//           challanDate: orderForm.orderDate,
//           deliveryNote: orderForm.notes || '',
//           challanTotal, 
//           status: 'Delivered', 
//           hidePrice,
//         },
//         items: allItems.map(it => it.isCharge
//           ? {
//               product: it.product, 
//               unit: it.unit,
//               orderedQty: it.calculatedQty, 
//               sentQty: it.calculatedQty,
//               calculatedQty: it.calculatedQty,
//               rate: parseFloat(it.rate || 0), 
//               amount: it.amount,
//               isCharge: true, 
//               chargeType: it.chargeType,
//               chargeDescription: it.chargeDescription || '',
//               chargeIcon: it.chargeIcon || '📋', 
//               quantity: it.quantity,
//               specification: '',
//             }
//           : {
//               product: it.product, 
//               unit: it.unit,
//               orderedQty: it.calculatedQty || parseFloat(it.quantity || 0),
//               pieces: parseFloat(it.quantity || 0),
//               sentQty: parseFloat(it.quantity || 0),
//               calculatedQty: it.calculatedQty || parseFloat(it.quantity || 0),
//               rate: parseFloat(it.rate || 0),
//               amount: it.amount || 0,
//               size: it.size || '',
//               lengthDisplay: it.lengthDisplay || '',
//               specification: it.specification || '',
//               isCharge: false,
//             }),
//       };

//       await apiPost('/api/billing-backend/challans', challanPayload);

//       const html = getChallanPrintHTML(
//         {
//           orderNo,
//           customerName: orderForm.customerName,
//           customerPhone: orderForm.customerPhone,
//           customerAddress: orderForm.customerAddress,
//           poNumber: orderForm.poNumber,
//           gstCustomerName: orderForm.gstCustomerName,
//         },
//         { ...challanPayload.challan, items: challanPayload.items },
//         hidePrice,
//       );

//       setLastChallanHTML(html);
//       setLastChallanNo(challanNo);

//       await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Completed' });
//       await fetchData();
//       setShowOrderForm(false);
//       resetOrderForm();
//       setShowChallanSuccess(true);
//     } catch (err) {
//       setError('Error: ' + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);

//   const getDeliveryProgress = order => {
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo)
//       .forEach(ch => ch.items?.filter(it => !it.isCharge)
//         .forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//     const items = (order.items || []).filter(i => !i.isCharge);
//     if (!items.length) return 0;
//     const tot = items.reduce((s, it) => s + parseFloat(it.calculatedQty || it.quantity || 0), 0);
//     const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.calculatedQty || it.quantity || 0), sm[it.product] || 0), 0);
//     return tot > 0 ? Math.round((sent / tot) * 100) : 0;
//   };

//   const openChallanForm = order => {
//     setSelectedOrder(order);
//     const sm = {};
//     challans.filter(c => c.orderNo === order.orderNo)
//       .forEach(ch => ch.items?.filter(it => !it.isCharge)
//         .forEach(it => { sm[it.product] = (sm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));
//     setChallanItems((order.items || []).filter(i => !i.isCharge).map(it => ({
//       uid: uid(), product: it.product, unit: it.unit,
//       rate: parseFloat(it.rate || 0),
//       orderedQty: parseFloat(it.calculatedQty || it.quantity || 0),
//       alreadySent: parseFloat(sm[it.product] || 0),
//       sendingPcs: '', sendingQty: 0,
//       size: it.size || '',
//       lengthFeet: it.lengthFeet || '', lengthInches: it.lengthInches || '',
//       lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
//       isWood: it.isWood || false, width: it.width || 0, thickness: it.thickness || 0,
//     })));
//     setChallanDate(new Date().toISOString().split('T')[0]);
//     setDeliveryNote('');
//     setHidePriceOnChallan(order.hidePrice || false);
//     setShowChallanForm(true);
//   };

//   const updateChallanItem = (iuid, field, value) => {
//     setChallanItems(prev => prev.map(it => {
//       if (it.uid !== iuid) return it;
//       const u = { ...it, [field]: value };
//       if (field === 'sendingPcs') {
//         const pcs = parseFloat(value || 0);
//         u.sendingQty = it.isWood ? calculateByUnit({ ...u, quantity: pcs }).calculatedQty : pcs;
//       }
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
//         challan: {
//           challanNo, orderNo: selectedOrder.orderNo,
//           customerName: selectedOrder.customerName,
//           challanDate, deliveryNote, challanTotal,
//           status: 'Delivered', hidePrice: hidePriceOnChallan,
//         },
//         items: valid.map(it => ({
//           product: it.product, unit: it.unit,
//           orderedQty: it.orderedQty, pieces: parseFloat(it.sendingPcs),
//           sentQty: parseFloat(it.sendingPcs),
//           calculatedQty: it.sendingQty,
//           rate: it.rate, amount: it.sendingQty * it.rate,
//           size: it.size, lengthDisplay: it.lengthDisplay, isCharge: false,
//         })),
//       };
//       const r = await apiPost('/api/billing-backend/challans', payload);
//       if (!r.success) { setError(r.error || 'Challan fail'); return; }

//       const allC = challans.filter(c => c.orderNo === selectedOrder.orderNo);
//       const tsm = {};
//       [...allC, { items: valid.map(it => ({ product: it.product, calculatedQty: it.sendingQty })) }]
//         .forEach(ch => ch.items?.filter(it => !it.isCharge)
//           .forEach(it => { tsm[it.product] = (tsm[it.product] || 0) + parseFloat(it.calculatedQty || it.sentQty || 0); }));

//       const done = (selectedOrder.items || []).filter(i => !i.isCharge)
//         .every(oi => (tsm[oi.product] || 0) >= parseFloat(oi.calculatedQty || oi.quantity || 0));
//       if (done) await apiPatch('/api/billing-backend/orders', { orderNo: selectedOrder.orderNo, status: 'Completed' });

//       const html = getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan);
//       setLastChallanHTML(html); setLastChallanNo(challanNo);
//       await fetchData(); setShowChallanForm(false); setShowChallanSuccess(true);
//     } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
//   };

//   const filteredOrders = sortLatestFirst(orders.filter(o => {
//     const q = searchQuery.toLowerCase();
//     const ms = !q || o.customerName?.toLowerCase().includes(q) || o.orderNo?.toLowerCase().includes(q) ||
//       o.customerPhone?.toLowerCase().includes(q) || o.poNumber?.toLowerCase().includes(q);
//     const mst = filterStatus === 'All' || o.status === filterStatus;
//     return ms && mst;
//   }), 'orderDate');

//   const filteredChallans = sortLatestFirst(challans.filter(ch => {
//     const q = challanSearchQuery.toLowerCase();
//     if (!q) return true;
//     return ch.challanNo?.toLowerCase().includes(q) || ch.orderNo?.toLowerCase().includes(q) || ch.customerName?.toLowerCase().includes(q);
//   }), 'challanDate');

//   const STATUS_LIGHT = {
//     Active: { bg: '#FBF6F0', color: '#7B1E1E', dot: '#9a2828', border: '#E8DCC8' },
//     Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e', border: '#bbf7d0' },
//   };
//   const STATUS_DARK = {
//     Active: { bg: '#2a1a1a', color: '#e8a0a0', dot: '#f0b8b8', border: '#3a3a55' },
//     Completed: { bg: '#052e16', color: '#4ade80', dot: '#22c55e', border: '#166534' },
//   };
//   const STATUS = darkMode ? STATUS_DARK : STATUS_LIGHT;

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-96 flex-col gap-3">
//       <Loader2 className="w-7 h-7 animate-spin" style={{ color: T.maroon }} />
//       <p className="text-sm" style={{ color: T.textMuted }}>Loading...</p>
//     </div>
//   );

//   return (
//     <div style={{ background: T.pageBg, minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease' }}>
//       <style jsx global>{`
// @keyframes kt-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}.kt-in{animation:kt-in .28s ease-out}
// .kt-input{width:100%;padding:9px 13px;border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;background:${T.inputBg};color:${T.textDark};outline:none;transition:border-color .14s,box-shadow .14s}.kt-input:focus{border-color:${T.maroon};box-shadow:0 0 0 3px ${darkMode ? 'rgba(232,160,160,.15)' : 'rgba(123,30,30,.12)'}}.kt-input[readonly]{background:${T.cream};color:${T.textMuted};cursor:not-allowed}.kt-input-sm{padding:7px 10px;font-size:12px}
// .btn-maroon{padding:9px 20px;background:linear-gradient(135deg,${T.maroonDark},${T.maroon});color:${darkMode ? '#1a1a2e' : '#fff'};border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .15s;box-shadow:0 2px 8px ${T.shadowStrong}}.btn-maroon:hover{transform:translateY(-1px)}.btn-maroon:disabled{opacity:.5;cursor:not-allowed;transform:none}
// .btn-white{padding:9px 18px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:${T.textDark};display:inline-flex;align-items:center;gap:6px;transition:all .14s}.btn-white:hover{background:${T.hoverBg};border-color:${T.maroon};color:${T.maroon}}
// .btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
// .btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
// .btn-amber{padding:7px 14px;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
// .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .13s;color:${T.textMuted}}.icon-btn:hover{background:${T.hoverBg};color:${T.maroon}}
// .kt-card{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:16px;box-shadow:0 1px 5px ${T.shadow}}.kt-inset{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:12px;overflow:hidden}
// .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;background:transparent;color:${T.textMuted}}.kt-tab.active{background:linear-gradient(135deg,${darkMode ? T.maroonDark : LIGHT.maroon},${T.maroon});color:${darkMode ? '#1a1a2e' : '#fff'};box-shadow:0 2px 6px ${T.shadowStrong}}.kt-tab:hover:not(.active){background:${T.hoverBg};color:${T.maroon}}
// .kt-tbl{width:100%;border-collapse:collapse}.kt-tbl thead tr{background:linear-gradient(135deg,${darkMode ? '#3a1515' : '#5a1515'},${darkMode ? '#5a2020' : LIGHT.maroon})}.kt-tbl thead th{padding:12px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;text-align:left;white-space:nowrap}.kt-tbl thead th.r{text-align:right}.kt-tbl thead th.c{text-align:center}.kt-tbl tbody tr{border-bottom:1px solid ${T.borderSoft};transition:background .1s}.kt-tbl tbody tr:nth-child(even){background:${T.tableEven}}.kt-tbl tbody tr:hover{background:${T.tableHover}}.kt-tbl tbody td{padding:10px;font-size:13px;color:${T.textDark};vertical-align:top}.kt-tbl tbody td.r{text-align:right}.kt-tbl tbody td.c{text-align:center}
// .kt-overlay{position:fixed;inset:0;background:${T.overlayBg};z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 16px;backdrop-filter:blur(3px)}
// .kt-modal{background:${T.modalBg};border-radius:22px;border:1px solid ${T.borderSoft};width:100%;max-width:1300px;margin:auto;box-shadow:0 24px 64px ${T.shadowStrong};overflow:visible}
// .kt-mhead{padding:20px 26px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;background:${darkMode ? T.accent : `linear-gradient(135deg,${LIGHT.cream} 0%,#fff 100%)`};border-radius:22px 22px 0 0}
// .kt-mbody{padding:24px 26px;max-height:75vh;overflow-y:auto;overflow-x:visible}
// .kt-mfoot{padding:16px 26px;border-top:1px solid ${T.borderSoft};display:flex;justify-content:flex-end;gap:8px;background:${T.accent};border-radius:0 0 22px 22px}
// .prog-track{height:6px;background:${T.creamDark};border-radius:4px;overflow:hidden}.prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,${T.maroonDark},${T.maroonLight});transition:width .5s ease}.prog-fill.done{background:linear-gradient(90deg,#16a34a,#22c55e)}
// .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
// .sec-label{font-size:11px;font-weight:600;color:${T.textMuted};text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}
// .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}.status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
// .total-box{border-radius:12px;padding:14px 18px;border:1px solid}
// .length-group{display:flex;gap:4px;align-items:center}.length-input{width:50px!important;text-align:center}
// .material-group{border:2px solid ${T.borderSoft};border-radius:16px;margin-bottom:16px;overflow:visible;background:${T.cardBg}}.material-group:hover{border-color:${T.maroonLight}}
// .material-group-header{background:${darkMode ? T.accent : `linear-gradient(135deg,${LIGHT.cream},${LIGHT.creamDark})`};padding:14px 18px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
// .material-group-label{display:flex;align-items:center;gap:10px}
// .material-group-num{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,${darkMode ? '#5a2020' : LIGHT.maroonDark},${darkMode ? '#7B1E1E' : LIGHT.maroon});color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
// .material-group-title{font-size:14px;font-weight:700;color:${T.maroon}}.material-group-subtitle{font-size:11px;color:${T.textMuted};margin-top:2px}
// .material-group-filters{display:flex;gap:8px;flex:1;flex-wrap:wrap;min-width:300px}
// .material-group-body{padding:18px 20px;overflow:visible}
// .material-group-footer{padding:10px 18px;border-top:1px dashed ${T.borderSoft};background:${T.accent};display:flex;justify-content:space-between;align-items:center}
// .item-subrow{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;padding:14px;margin-bottom:10px;transition:all .2s;position:relative;overflow:visible}.item-subrow:hover{border-color:${T.maroonLight};background:${T.hoverBg}}.item-subrow:last-child{margin-bottom:0}
// .item-subrow-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
// .item-subrow-num{width:24px;height:24px;border-radius:6px;background:${T.cream};color:${T.maroon};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;border:1px solid ${T.borderSoft}}
// .unit-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600}.wood-badge{background:${T.successBg};color:${T.successColor}}.hardware-badge{background:${T.infoBg};color:${T.infoColor}}.custom-badge{background:${T.amberBg};color:${T.amberColor}}
// .calc-display{background:${T.cream};border:1px solid ${T.borderSoft};border-radius:8px;padding:10px;margin-top:10px}
// .btn-add-inner{padding:7px 14px;background:${T.cardBg};border:1px dashed ${T.maroon};border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;color:${T.maroon};display:inline-flex;align-items:center;gap:5px}.btn-add-inner:hover{background:${T.cream};border-style:solid}
// .btn-add-outer{padding:10px 20px;background:${T.cardBg};border:2px dashed ${T.borderSoft};border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:${T.textMuted};display:flex;align-items:center;justify-content:center;gap:6px;width:100%}.btn-add-outer:hover{background:${T.hoverBg};border-color:${T.maroon};color:${T.maroon}}
// .searchable-select{position:relative;width:100%}.ss-input-wrap{position:relative;display:flex;align-items:center}.ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid ${T.borderSoft};border-radius:8px;font-size:13px;background:${T.inputBg};color:${T.textDark};outline:none;transition:all .15s}.ss-input:focus{border-color:${T.maroon};box-shadow:0 0 0 3px ${darkMode ? 'rgba(232,160,160,.15)' : 'rgba(123,30,30,.12)'}}.ss-input.with-icon{padding-left:32px}.ss-search-icon{position:absolute;left:10px;width:14px;height:14px;color:${T.textMuted};pointer-events:none}.ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}.ss-clear{width:18px;height:18px;border-radius:50%;background:${T.creamDark};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${T.textMuted}}.ss-clear:hover{background:${T.maroon};color:#fff}.ss-arrow{width:14px;height:14px;color:${T.textMuted};transition:transform .2s}.ss-arrow.open{transform:rotate(180deg)}.ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;box-shadow:0 10px 40px ${T.shadowStrong};z-index:9999;max-height:320px;overflow:hidden;animation:ss-drop .15s ease}@keyframes ss-drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.ss-dropdown-header{padding:8px 12px;background:${T.cream};border-bottom:1px solid ${T.borderSoft};font-size:11px;color:${T.maroon};font-weight:600}.ss-options{max-height:260px;overflow-y:auto}.ss-option{padding:10px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid ${T.accent};color:${T.textDark}}.ss-option:last-child{border-bottom:none}.ss-option:hover,.ss-option.highlighted{background:${T.hoverBg}}.ss-option.selected{background:${T.cream}}.ss-no-results{padding:20px;text-align:center;color:${T.textMuted};font-size:13px}.ss-more{padding:10px 12px;text-align:center;color:${T.maroon};font-size:12px;font-weight:500;background:${T.creamLight}}.product-dropdown{max-height:400px}.product-dropdown .ss-options{max-height:340px}.product-option{padding:10px 12px}.product-option-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.product-name{font-weight:600;font-size:13px}.product-sku{font-size:11px;color:${T.maroon};font-family:monospace;background:${T.cream};padding:2px 6px;border-radius:4px}.product-option-sub{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.product-cat{font-size:11px;color:${T.textMuted}}.product-sep{color:${T.borderSoft};font-size:10px}.product-unit{font-size:10px;color:#fff;background:${darkMode ? '#5a2020' : LIGHT.maroon};padding:2px 6px;border-radius:4px;margin-left:auto}
// .edit-badge{background:${T.infoBg};color:${T.infoColor};border:1px solid ${T.infoBorder};padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600}
// .success-icon{width:64px;height:64px;border-radius:50%;background:${darkMode ? 'linear-gradient(135deg,#052e16,#166534)' : 'linear-gradient(135deg,#dcfce7,#bbf7d0)'};display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
// select.kt-input{background:${T.inputBg};color:${T.textDark};border-color:${T.borderSoft}}
// textarea.kt-input{background:${T.inputBg};color:${T.textDark};border-color:${T.borderSoft}}
// .hide-price-toggle{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:12px;border:2px solid ${T.borderSoft};cursor:pointer;transition:all .2s;user-select:none}.hide-price-toggle:hover{border-color:${T.maroon}}.hide-price-toggle.active{background:${T.cream};border-color:${T.maroon}}.hide-price-toggle input{width:18px;height:18px;accent-color:${darkMode ? '#e8a0a0' : LIGHT.maroon}}
// .charge-card{background:${T.cardBg};border:2px solid ${T.amberBorder || T.borderSoft};border-radius:12px;padding:14px;margin-bottom:10px;transition:all .2s}.charge-card:hover{border-color:${T.amberColor || '#d97706'}}
// .charge-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;background:${T.amberBg || '#fef3c7'};color:${T.amberColor || '#92400e'}}
// .new-product-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:600;background:${T.amberBg};color:${T.amberColor};border:1px solid ${T.amberBorder}}
//       `}</style>

//       {error && (
//         <div className="mb-4 flex items-center gap-3 rounded-xl p-3"
//           style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}` }}>
//           <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: T.errorColor }} />
//           <span className="text-sm flex-1" style={{ color: T.errorColor }}>{error}</span>
//           <button className="icon-btn" onClick={() => setError(null)}><X className="w-3 h-3" /></button>
//         </div>
//       )}

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold" style={{ color: T.maroon }}>Order & Challan</h2>
//           <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>{SHOP_INFO.name}</p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <button className="icon-btn" onClick={fetchData}><RefreshCw className="w-4 h-4" /></button>
//           <button className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
//           <button className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`} onClick={() => setActiveTab('challans')}>Challans</button>
//           <button className="btn-maroon" onClick={() => { resetOrderForm(); setShowOrderForm(true); }}>
//             <Plus className="w-4 h-4" />New Order
//           </button>
//         </div>
//       </div>

//       <div className="kt-card mb-6 overflow-hidden">
//         <div style={{ background: `linear-gradient(135deg,${darkMode ? '#3a1515' : LIGHT.maroonDark},${darkMode ? '#5a2020' : LIGHT.maroon})`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           {[
//             { n: '1', label: 'New Order', desc: 'Items + Charges' },
//             { n: '2', label: 'Auto Challan', desc: 'Generated on save' },
//             { n: '3', label: 'Print/View', desc: 'Instant challan' },
//           ].map((s, i, a) => (
//             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <div className="step-dot" style={{ background: '#fff', color: darkMode ? '#5a2020' : LIGHT.maroon }}>{s.n}</div>
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

//       {activeTab === 'orders' && (
//         <div className="space-y-5 kt-in">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[
//               { label: 'Total', value: orders.length, color: T.maroon },
//               { label: 'Active', value: orders.filter(o => o.status === 'Active').length, color: T.maroon },
//               { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: T.successColor },
//               { label: 'Products', value: products.length, color: T.maroonDark },
//             ].map((c, i) => (
//               <div key={i} className="kt-card p-4">
//                 <p className="text-xs font-medium mb-1" style={{ color: T.textMuted }}>{c.label}</p>
//                 <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <div className="relative flex-1" style={{ minWidth: 200 }}>
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.textMuted }} />
//               <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search..."
//                 value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//               {searchQuery && (
//                 <button className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn" style={{ width: 22, height: 22 }}
//                   onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
//               )}
//             </div>
//             <div className="flex gap-1.5">
//               {['All', 'Active', 'Completed'].map(s => (
//                 <button key={s} onClick={() => setFilterStatus(s)}
//                   className={`kt-tab ${filterStatus === s ? 'active' : ''}`}
//                   style={{ padding: '8px 14px', fontSize: 12 }}>{s}</button>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-3">
//             {filteredOrders.length === 0 && (
//               <div className="kt-card p-14 text-center">
//                 <TruckIcon style={{ width: 28, height: 28, color: T.maroon, margin: '0 auto 12px' }} />
//                 <p className="text-sm" style={{ color: T.textMuted }}>Koi order nahi</p>
//               </div>
//             )}
//             {filteredOrders.map((order, i) => {
//               const progress = getDeliveryProgress(order);
//               const st = STATUS[order.status] || STATUS.Active;
//               const oc = getOrderChallans(order.orderNo);
//               const hasCharges = (order.items || []).some(it => it.isCharge);
//               return (
//                 <div key={i} className="kt-card p-5 kt-in">
//                   <div className="flex items-start justify-between gap-4 flex-wrap">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         <span className="font-mono text-sm font-bold" style={{ color: T.maroon }}>{order.orderNo}</span>
//                         <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
//                           <span className="status-dot" style={{ background: st.dot }} />{order.status}
//                         </span>
//                         {order.hidePrice && <span className="status-pill" style={{ background: T.cream, color: T.maroon, borderColor: T.borderSoft }}><EyeOff className="w-3 h-3" />Hidden</span>}
//                         {hasCharges && <span className="charge-badge"><Wrench className="w-3 h-3" />Charges</span>}
//                         {order.gstRate > 0 && <span className="status-pill" style={{ background: T.infoBg, color: T.infoColor }}>GST {order.gstRate}%</span>}
//                         {order.poNumber && <span className="edit-badge">PO: {order.poNumber}</span>}
//                       </div>
//                       <p className="font-bold text-base mb-1 truncate" style={{ color: T.textDark }}>{order.customerName}</p>
//                       <p className="text-xs" style={{ color: T.textMuted }}>
//                         {order.customerPhone && `${order.customerPhone} · `}
//                         {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                         &nbsp;·&nbsp;{(order.items || []).filter(i => !i.isCharge).length} items
//                         {!order.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold" style={{ color: T.maroon }}>₹{(parseFloat(order.total) || 0).toLocaleString('en-IN')}</span></>}
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end gap-3 shrink-0">
//                       <div style={{ width: 168 }}>
//                         <div className="flex justify-between mb-1.5">
//                           <span className="text-xs" style={{ color: T.textMuted }}>Delivery</span>
//                           <span className="text-xs font-bold" style={{ color: progress === 100 ? T.successColor : T.maroon }}>{progress}%</span>
//                         </div>
//                         <div className="prog-track"><div className={`prog-fill ${progress === 100 ? 'done' : ''}`} style={{ width: `${progress}%` }} /></div>
//                         <p className="text-xs mt-1 text-right" style={{ color: T.textMuted }}>{oc.length} challan{oc.length !== 1 ? 's' : ''}</p>
//                       </div>
//                       <div className="flex gap-2 flex-wrap justify-end">
//                         <button className="btn-blue" onClick={() => openEditOrder(order)} style={{ fontSize: 12, padding: '6px 12px' }}>
//                           <Edit2 className="w-3.5 h-3.5" />Edit
//                         </button>
//                         <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => openChallanForm(order)}>
//                           <TruckIcon className="w-3.5 h-3.5" />Partial
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {activeTab === 'challans' && (
//         <div className="space-y-3 kt-in">
//           <div className="relative" style={{ maxWidth: 500 }}>
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.textMuted }} />
//             <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search challan..."
//               value={challanSearchQuery} onChange={e => setChallanSearchQuery(e.target.value)} />
//           </div>
//           <p className="text-xs" style={{ color: T.textMuted }}>{filteredChallans.length} challans</p>
//           {filteredChallans.map((ch, i) => (
//             <div key={i} className="kt-card p-4 kt-in">
//               <div className="flex items-center justify-between flex-wrap gap-3">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//                     <span className="font-mono text-sm font-bold" style={{ color: T.maroon }}>{ch.challanNo}</span>
//                     <span className="text-xs" style={{ color: T.textMuted }}>→ <strong style={{ color: T.textDark }}>{ch.orderNo}</strong></span>
//                     <span className="status-pill" style={{ background: T.successBg, color: T.successColor }}>
//                       <span className="status-dot" style={{ background: '#22c55e' }} />Delivered
//                     </span>
//                     {ch.hidePrice && <span className="status-pill" style={{ background: T.cream, color: T.maroon }}><EyeOff className="w-3 h-3" />Hidden</span>}
//                     {(ch.items || []).some(it => it.isCharge) && <span className="charge-badge"><Wrench className="w-3 h-3" />+Charges</span>}
//                   </div>
//                   <p className="font-semibold" style={{ color: T.textDark }}>{ch.customerName}</p>
//                   <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>
//                     {new Date(ch.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                     &nbsp;·&nbsp;{(ch.items || []).length} items
//                     {!ch.hidePrice && <>&nbsp;·&nbsp;<span className="font-semibold" style={{ color: T.maroon }}>₹{(parseFloat(ch.challanTotal) || 0).toLocaleString('en-IN')}</span></>}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="btn-white" style={{ fontSize: 12, padding: '6px 12px' }}
//                     onClick={() => { const o = orders.find(o => o.orderNo === ch.orderNo); if (o) openPDFView(getChallanPrintHTML(o, ch, ch.hidePrice)); }}>
//                     <Eye className="w-3.5 h-3.5" />View
//                   </button>
//                   <button className="btn-maroon" style={{ fontSize: 12, padding: '6px 12px' }}
//                     onClick={() => { const o = orders.find(o => o.orderNo === ch.orderNo); if (o) openPDFPrint(getChallanPrintHTML(o, ch, ch.hidePrice)); }}>
//                     <Printer className="w-3.5 h-3.5" />Print
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showOrderForm && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in">
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: isEditMode ? T.infoBg : T.cream, color: isEditMode ? T.infoColor : T.maroon, border: `2px solid ${isEditMode ? T.infoBorder : T.borderSoft}` }}>
//                   {isEditMode ? <Edit2 className="w-3.5 h-3.5" /> : '1'}
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg m-0" style={{ color: T.textDark }}>{isEditMode ? `Edit — ${editingOrder?.orderNo}` : 'New Order + Challan'}</h3>
//                   <p className="text-xs m-0" style={{ color: T.textMuted }}>{isEditMode ? 'Update & re-generate challan' : 'Save karte hi challan auto-generate hoga'}</p>
//                 </div>
//               </div>
//               <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X className="w-5 h-5" /></button>
//             </div>

//             <div className="kt-mbody space-y-6">
//               <div>
//                 <p className="sec-label">Customer Details</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                   <div>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Customer Name *</label>
//                     <input className="kt-input" value={orderForm.customerName}
//                       onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Phone</label>
//                     <input className="kt-input" value={orderForm.customerPhone}
//                       onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Date</label>
//                     <input type="date" className="kt-input" value={orderForm.orderDate}
//                       onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>GST</label>
//                     <select className="kt-input" value={orderForm.gstRate}
//                       onChange={e => setOrderForm(p => ({ ...p, gstRate: parseFloat(e.target.value) }))}>
//                       {GST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>PO Number</label>
//                     <input className="kt-input" value={orderForm.poNumber}
//                       onChange={e => setOrderForm(p => ({ ...p, poNumber: e.target.value }))} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>GST Customer</label>
//                     <input className="kt-input" value={orderForm.gstCustomerName}
//                       onChange={e => setOrderForm(p => ({ ...p, gstCustomerName: e.target.value }))} />
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Address</label>
//                     <textarea className="kt-input" rows={2} style={{ resize: 'none' }} value={orderForm.customerAddress}
//                       onChange={e => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))} />
//                   </div>
//                 </div>
//               </div>

//               <label className={`hide-price-toggle ${orderForm.hidePrice ? 'active' : ''}`} style={{ maxWidth: 340 }}>
//                 <input type="checkbox" checked={orderForm.hidePrice}
//                   onChange={e => setOrderForm(p => ({ ...p, hidePrice: e.target.checked }))} />
//                 <EyeOff className="w-5 h-5" style={{ color: T.maroon }} />
//                 <div>
//                   <span className="text-sm font-semibold" style={{ color: T.textDark }}>Hide Price on Challan</span>
//                   <p className="text-xs" style={{ color: T.textMuted, margin: 0 }}>
//                     {orderForm.hidePrice ? 'Sirf items, price nahi' : 'Rate aur amount dikhega'}
//                   </p>
//                 </div>
//               </label>

//               <div>
//                 <p className="sec-label">Items</p>

//                 <div className="flex items-center gap-3 mb-4 p-3 rounded-xl"
//                   style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}` }}>
//                   <span style={{ fontSize: 18 }}>💡</span>
//                   <p className="text-xs" style={{ color: T.amberColor }}>
//                     <strong>Naya product?</strong> Product field me seedha type karo. Agar <strong>“Add to Sheet”</strong> button dabaaoge to product master list me save ho jayega, warna sirf is order me hi rahega.
//                   </p>
//                 </div>

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
//                           <div>
//                             <div className="material-group-title">
//                               {group.filterMaterialType || 'Select Material'}{group.filterCategory && ` › ${group.filterCategory}`}
//                             </div>
//                             <div className="material-group-subtitle">{group.items.length} items · {gp.length} available</div>
//                           </div>
//                         </div>
//                         {orderGroups.length > 1 && (
//                           <button className="icon-btn" onClick={() => removeGroup(group.groupId)}>
//                             <Trash2 className="w-4 h-4 text-red-400" />
//                           </button>
//                         )}
//                       </div>

//                       <div style={{ padding: '12px 18px', background: T.accent, borderBottom: `1px solid ${T.borderSoft}` }}>
//                         <div className="material-group-filters">
//                           <div style={{ flex: 1, minWidth: 160 }}>
//                             <label className="text-xs font-medium block mb-1" style={{ color: T.textMuted }}>Material Type</label>
//                             <SearchableSelect
//                               options={getAllMaterialTypes()}
//                               value={group.filterMaterialType}
//                               onChange={v => updateGroupFilter(group.groupId, 'filterMaterialType', v)}
//                               placeholder="Type ya select..."
//                               allowCustom
//                               T={T}
//                             />
//                           </div>
//                           <div style={{ flex: 1, minWidth: 160 }}>
//                             <label className="text-xs font-medium block mb-1" style={{ color: T.textMuted }}>Category</label>
//                             <SearchableSelect
//                               options={gc}
//                               value={group.filterCategory}
//                               onChange={v => updateGroupFilter(group.groupId, 'filterCategory', v)}
//                               placeholder="Type ya select..."
//                               allowCustom
//                               T={T}
//                             />
//                           </div>
//                           <div style={{ flex: 1, minWidth: 160 }}>
//                             <label className="text-xs font-medium block mb-1" style={{ color: T.textMuted }}>Sub Category</label>
//                             <SearchableSelect
//                               key={group.filterCategory}
//                               options={gsc}
//                               value={group.filterSubCategory}
//                               onChange={v => updateGroupFilter(group.groupId, 'filterSubCategory', v)}
//                               placeholder="Type ya select..."
//                               allowCustom
//                               T={T}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="material-group-body">
//                         {group.items.map((item, itemIdx) => (
//                           <div key={item.uid} className="item-subrow">
//                             <div className="item-subrow-header">
//                               <div className="flex items-center gap-3">
//                                 <div className="item-subrow-num">{itemIdx + 1}</div>
//                                 {item.isWood
//                                   ? <span className="unit-badge wood-badge">🪵 Wood</span>
//                                   : item.product && item.skuCode
//                                     ? <span className="unit-badge hardware-badge">🔧 In Sheet</span>
//                                     : item.product
//                                       ? <span className="unit-badge custom-badge">✏️ Custom (Not in Sheet)</span>
//                                       : null
//                                 }
//                                 {item.product && (
//                                   <span className="text-xs font-semibold" style={{ color: T.textDark }}>
//                                     {item.product}
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="flex gap-2">
//                                 {!item.skuCode && item.product && (
//                                   <button
//                                     className="btn-amber"
//                                     style={{ padding: '4px 10px', fontSize: 11 }}
//                                     onClick={() => handleAddToSheet(group, item)}
//                                     disabled={addingToSheet[item.uid]}
//                                   >
//                                     {addingToSheet[item.uid] ? (
//                                       <Loader2 className="w-3 h-3 animate-spin" />
//                                     ) : (
//                                       <Plus className="w-3 h-3" />
//                                     )}
//                                     Add to Sheet
//                                   </button>
//                                 )}
//                                 <button className="icon-btn" onClick={() => removeItemFromGroup(group.groupId, item.uid)}
//                                   disabled={group.items.length === 1}>
//                                   <Trash2 className="w-3.5 h-3.5 text-red-400" />
//                                 </button>
//                               </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
//                               <div className="md:col-span-2">
//                                 <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Product *</label>
//                                 <SearchableSelect
//                                   options={gp.map(p => ({ value: p.skuCode, label: p.materialName }))}
//                                   value={item.skuCode}
//                                   onChange={(selectedVal) => {
//                                     if (!selectedVal) {
//                                       updateGroupItem(group.groupId, item.uid, 'skuCode', '');
//                                       updateGroupItem(group.groupId, item.uid, 'customProductName', '');
//                                     } else {
//                                       const isExisting = gp.some(p => p.skuCode === selectedVal);
//                                       if (isExisting) {
//                                         updateGroupItem(group.groupId, item.uid, 'skuCode', selectedVal);
//                                         updateGroupItem(group.groupId, item.uid, 'customProductName', '');
//                                       } else {
//                                         updateGroupItem(group.groupId, item.uid, 'skuCode', '');
//                                         updateGroupItem(group.groupId, item.uid, 'customProductName', selectedVal);
//                                       }
//                                     }
//                                   }}
//                                   placeholder="Type or select product..."
//                                   allowCustom={true}
//                                   T={T}
//                                 />
//                               </div>

//                               <div>
//                                 <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Unit</label>
//                                 {item.isWood ? (
//                                   <select className="kt-input kt-input-sm" value={item.unit}
//                                     onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
//                                     {WOOD_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
//                                   </select>
//                                 ) : item.skuCode ? (
//                                   <select className="kt-input kt-input-sm" value={item.unit || 'Pcs'}
//                                     onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
//                                     {HARDWARE_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
//                                   </select>
//                                 ) : (
//                                   <select className="kt-input kt-input-sm" value={item.unit || 'Pcs'}
//                                     onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
//                                     {CUSTOM_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
//                                   </select>
//                                 )}
//                               </div>

//                               {item.isWood && (
//                                 <div>
//                                   <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Size</label>
//                                   <input className="kt-input kt-input-sm" value={item.size || '—'} readOnly />
//                                 </div>
//                               )}

//                               {item.isWood && (
//                                 <div>
//                                   <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Length</label>
//                                   <div className="length-group">
//                                     <input type="number" min="0" className="kt-input kt-input-sm length-input"
//                                       value={item.lengthFeet}
//                                       onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthFeet', e.target.value)} />
//                                     <span className="text-xs" style={{ color: T.textMuted }}>ft</span>
//                                     <input type="number" min="0" max="11" className="kt-input kt-input-sm length-input"
//                                       value={item.lengthInches}
//                                       onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthInches', e.target.value)} />
//                                     <span className="text-xs" style={{ color: T.textMuted }}>in</span>
//                                   </div>
//                                 </div>
//                               )}

//                               <div>
//                                 <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>
//                                   {item.isWood ? 'Pcs' : 'Qty'}
//                                 </label>
//                                 <input type="number" min="1" className="kt-input kt-input-sm"
//                                   value={item.quantity}
//                                   onChange={e => updateGroupItem(group.groupId, item.uid, 'quantity', e.target.value)} />
//                               </div>

//                               <div>
//                                 <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Rate</label>
//                                 <input type="number" min="0" className="kt-input kt-input-sm"
//                                   value={item.rate}
//                                   onChange={e => updateGroupItem(group.groupId, item.uid, 'rate', e.target.value)} />
//                               </div>

//                               <div>
//                                 <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>
//                                   Specification
//                                 </label>
//                                 <input 
//                                   type="text" 
//                                   className="kt-input kt-input-sm" 
//                                   placeholder="e.g., 19mm, Teak"
//                                   value={item.specification || ''}
//                                   onChange={e => updateGroupItem(group.groupId, item.uid, 'specification', e.target.value)} 
//                                 />
//                               </div>
//                             </div>

//                             {item.product && !orderForm.hidePrice && (
//                               <div className="calc-display">
//                                 <div className="flex justify-between items-center flex-wrap gap-2">
//                                   <div className="text-xs" style={{ color: T.maroon }}>
//                                     {item.isWood
//                                       ? <><strong>{item.unit}:</strong> {item.calculatedQty.toFixed(3)} {item.unit}</>
//                                       : <><strong>Qty:</strong> {item.quantity || 0}</>
//                                     }
//                                   </div>
//                                   <div className="text-base font-bold" style={{ color: T.maroon }}>
//                                     ₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                             {item.product && orderForm.hidePrice && (
//                               <div className="calc-display">
//                                 <div className="flex justify-between items-center flex-wrap gap-2">
//                                   <div className="text-xs" style={{ color: T.maroon }}>
//                                     {item.isWood
//                                       ? <><strong>{item.unit}:</strong> {item.calculatedQty.toFixed(3)} {item.unit}</>
//                                       : <><strong>Qty:</strong> {item.quantity || 0}</>
//                                     }
//                                   </div>
//                                   <div className="text-xs flex items-center gap-1" style={{ color: T.textMuted }}>
//                                     <EyeOff className="w-3.5 h-3.5" /> Price hidden
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>

//                       <div className="material-group-footer">
//                         <button className="btn-add-inner" onClick={() => addItemToGroup(group.groupId)}>
//                           <Plus className="w-3.5 h-3.5" />Add Item
//                         </button>
//                         {!orderForm.hidePrice && (
//                           <div className="text-sm font-bold" style={{ color: T.maroon }}>
//                             ₹{gt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <button className="btn-add-outer" onClick={addNewGroup}>
//                   <Plus className="w-4 h-4" />Add New Group
//                 </button>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <p className="sec-label" style={{ marginBottom: 0 }}>
//                     <Wrench className="w-4 h-4 inline-block mr-1" style={{ verticalAlign: 'text-bottom' }} />
//                     Additional Charges (Optional)
//                   </p>
//                   <button className="btn-amber" onClick={addCharge}><Plus className="w-3.5 h-3.5" />Add Charge</button>
//                 </div>

//                 {orderCharges.length === 0 && (
//                   <div className="text-center p-6 rounded-xl"
//                     style={{ background: T.accent, border: `1px dashed ${T.borderSoft}` }}>
//                     <p className="text-xs" style={{ color: T.textMuted }}>
//                       Koi additional charge nahi — Labour, Installation, Planing etc. add kar sakte ho
//                     </p>
//                   </div>
//                 )}

//                 {orderCharges.map((charge, cIdx) => {
//                   const ct = CHARGE_TYPES.find(t => t.value === charge.chargeType);
//                   const isLumpSum = charge.unit === 'Lump Sum';
//                   let calcExplain = '';
//                   if (isLumpSum) {
//                     calcExplain = `Lump Sum = ₹${parseFloat(charge.rate || 0).toLocaleString('en-IN')}`;
//                   } else {
//                     const q = parseFloat(charge.quantity || 0);
//                     const r = parseFloat(charge.rate || 0);
//                     calcExplain = `${q} ${charge.unit} × ₹${r.toLocaleString('en-IN')} = ₹${charge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
//                   }
//                   return (
//                     <div key={charge.uid} className="charge-card kt-in">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-2">
//                           <span className="charge-badge">{ct?.icon || '📋'} Charge #{cIdx + 1}</span>
//                           {charge.chargeName && <span className="text-xs font-semibold" style={{ color: T.textDark }}>{charge.chargeName}</span>}
//                         </div>
//                         <button className="icon-btn" onClick={() => removeCharge(charge.uid)}>
//                           <Trash2 className="w-3.5 h-3.5 text-red-400" />
//                         </button>
//                       </div>
//                       <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//                         <div>
//                           <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Charge Type</label>
//                           <select className="kt-input kt-input-sm" value={charge.chargeType}
//                             onChange={e => updateCharge(charge.uid, 'chargeType', e.target.value)}>
//                             <option value="">Select...</option>
//                             {CHARGE_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.icon} {ct.label}</option>)}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Name</label>
//                           <input className="kt-input kt-input-sm" value={charge.chargeName}
//                             onChange={e => updateCharge(charge.uid, 'chargeName', e.target.value)} placeholder="e.g. Labour" />
//                         </div>
//                         <div>
//                           <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Unit</label>
//                           <select className="kt-input kt-input-sm" value={charge.unit}
//                             onChange={e => updateCharge(charge.uid, 'unit', e.target.value)}>
//                             {CHARGE_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
//                           </select>
//                         </div>
//                         {!isLumpSum && (
//                           <div>
//                             <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Qty ({charge.unit})</label>
//                             <input type="number" min="0" step="0.001" className="kt-input kt-input-sm"
//                               value={charge.quantity}
//                               onChange={e => updateCharge(charge.uid, 'quantity', e.target.value)} />
//                           </div>
//                         )}
//                         <div>
//                           <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>
//                             {isLumpSum ? 'Amount (₹)' : `Rate per ${charge.unit} (₹)`}
//                           </label>
//                           <input type="number" min="0" step="0.01" className="kt-input kt-input-sm"
//                             value={charge.rate}
//                             onChange={e => updateCharge(charge.uid, 'rate', e.target.value)}
//                             placeholder={isLumpSum ? 'e.g. 2000' : 'e.g. 50'} />
//                         </div>
//                       </div>
//                       {charge.amount > 0 && !orderForm.hidePrice && (
//                         <div className="calc-display"
//                           style={{ marginTop: 8, background: T.amberBg || T.cream, borderColor: T.amberBorder || T.borderSoft }}>
//                           <div className="flex justify-between items-center">
//                             <span className="text-xs" style={{ color: T.amberColor || T.textMuted }}>{calcExplain}</span>
//                             <span className="text-base font-bold" style={{ color: T.amberColor || T.maroon }}>
//                               ₹{charge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                       {charge.amount > 0 && orderForm.hidePrice && (
//                         <div className="calc-display" style={{ marginTop: 8 }}>
//                           <div className="flex justify-between items-center">
//                             <span className="text-xs" style={{ color: T.textMuted }}>
//                               {isLumpSum ? 'Lump Sum' : `${charge.quantity || 0} ${charge.unit}`}
//                             </span>
//                             <span className="text-xs flex items-center gap-1" style={{ color: T.textMuted }}>
//                               <EyeOff className="w-3.5 h-3.5" /> Price hidden
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {!orderForm.hidePrice && (
//                 <div className="flex justify-end">
//                   <div className="total-box" style={{ width: 320, background: T.cream, borderColor: T.borderSoft }}>
//                     <div className="flex justify-between text-sm mb-2" style={{ color: T.textDark }}>
//                       <span>Materials</span>
//                       <span className="font-semibold">₹{orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                     </div>
//                     {chargesSubtotal > 0 && (
//                       <div className="flex justify-between text-sm mb-2" style={{ color: T.amberColor || T.textDark }}>
//                         <span>⚡ Charges</span>
//                         <span className="font-semibold">₹{chargesSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                       </div>
//                     )}
//                     {orderForm.gstRate > 0 && (
//                       <div className="flex justify-between text-sm mb-2" style={{ color: T.textDark }}>
//                         <span>GST ({orderForm.gstRate}%)</span>
//                         <span className="font-semibold">₹{orderTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between font-bold text-lg pt-2 mt-2"
//                       style={{ color: T.maroon, borderTop: `1px solid ${T.borderSoft}` }}>
//                       <span>Grand Total</span>
//                       <span>₹{orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
//               <button className="btn-maroon"
//                 disabled={!orderForm.customerName || getAllOrderItems().filter(i => i.product).length === 0 || saving}
//                 onClick={handleSubmitOrder}>
//                 {saving
//                   ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
//                   : isEditMode
//                     ? <><CheckCircle className="w-4 h-4" />Update & Re-Generate</>
//                     : <><CheckCircle className="w-4 h-4" />Save & Generate Challan</>
//                 }
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showChallanForm && selectedOrder && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 950 }}>
//             <div className="kt-mhead">
//               <div className="flex items-center gap-3">
//                 <div className="step-dot" style={{ background: T.cream, color: T.maroon, border: `2px solid ${T.borderSoft}` }}>+</div>
//                 <div>
//                   <h3 className="font-bold text-base m-0" style={{ color: T.textDark }}>Additional Challan</h3>
//                   <p className="text-xs m-0" style={{ color: T.textMuted }}>{selectedOrder.orderNo} — {selectedOrder.customerName}</p>
//                 </div>
//               </div>
//               <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X className="w-4 h-4" /></button>
//             </div>
//             <div className="kt-mbody space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div>
//                   <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Date</label>
//                   <input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1.5" style={{ color: T.textMuted }}>Note</label>
//                   <input className="kt-input" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} />
//                 </div>
//                 <div className="flex items-center gap-3 pt-5">
//                   <input type="checkbox" id="hp" checked={hidePriceOnChallan} onChange={e => setHidePriceOnChallan(e.target.checked)}
//                     style={{ width: 18, height: 18, accentColor: darkMode ? '#e8a0a0' : LIGHT.maroon }} />
//                   <label htmlFor="hp" className="text-sm cursor-pointer flex items-center gap-2" style={{ color: T.textDark }}>
//                     <EyeOff className="w-4 h-4" style={{ color: T.maroon }} />Hide Price
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <p className="sec-label">Items</p>
//                 <div className="kt-inset">
//                   <div className="overflow-x-auto">
//                     <table className="kt-tbl">
//                       <thead>
//                         <tr>
//                           <th>Item</th>
//                           <th className="c" style={{ width: 55 }}>Unit</th>
//                           <th className="r" style={{ width: 80 }}>Ordered</th>
//                           <th className="r" style={{ width: 80 }}>Sent</th>
//                           <th className="r" style={{ width: 80 }}>Left</th>
//                           <th className="r" style={{ width: 90 }}>Sending</th>
//                           <th className="r" style={{ width: 90 }}>Calc Qty</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {challanItems.map(it => {
//                           const rem = it.orderedQty - it.alreadySent;
//                           return (
//                             <tr key={it.uid}>
//                               <td className="font-medium">
//                                 {it.product}
//                                 {it.isWood && <span className="unit-badge wood-badge ml-2">🪵</span>}
//                               </td>
//                               <td className="c text-xs" style={{ color: T.textMuted }}>{it.unit}</td>
//                               <td className="r">{it.orderedQty.toFixed(3)}</td>
//                               <td className="r font-semibold" style={{ color: T.maroon }}>{it.alreadySent ? it.alreadySent.toFixed(3) : '—'}</td>
//                               <td className="r font-bold" style={{ color: rem <= 0.001 ? T.successColor : T.textDark }}>
//                                 {rem <= 0.001 ? '✓' : rem.toFixed(3)}
//                               </td>
//                               <td>
//                                 <input type="number" min="0" className="kt-input"
//                                   style={{ padding: '8px', fontSize: 13, textAlign: 'right', background: rem <= 0.001 ? T.cream : undefined }}
//                                   value={it.sendingPcs} disabled={rem <= 0.001}
//                                   onChange={e => updateChallanItem(it.uid, 'sendingPcs', e.target.value)} />
//                               </td>
//                               <td className="r font-bold" style={{ color: T.maroon }}>
//                                 {it.sendingQty ? it.sendingQty.toFixed(3) : '—'}
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
//                   <div className="total-box" style={{ minWidth: 240, background: T.cream, borderColor: T.borderSoft }}>
//                     <div className="flex justify-between font-bold text-base" style={{ color: T.maroon }}>
//                       <span>Total</span>
//                       <span>₹{challanItems.reduce((s, it) => s + parseFloat(it.sendingQty || 0) * parseFloat(it.rate || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="kt-mfoot">
//               <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
//               <button className="btn-maroon" disabled={saving} onClick={handleSubmitChallan}>
//                 {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />Save Challan</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showChallanSuccess && (
//         <div className="kt-overlay">
//           <div className="kt-modal kt-in" style={{ maxWidth: 480 }}>
//             <div className="kt-mbody" style={{ textAlign: 'center', padding: '40px 30px' }}>
//               <div className="success-icon"><CheckCircle style={{ width: 32, height: 32, color: T.successColor }} /></div>
//               <h3 style={{ fontSize: 20, fontWeight: 700, color: T.textDark, marginBottom: 6 }}>Challan Generated!</h3>
//               <p style={{ fontSize: 14, color: T.maroon, marginBottom: 6, fontWeight: 600 }}>{lastChallanNo}</p>
//               <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>Order save ho gaya aur challan ready hai</p>
//               <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
//                 <button className="btn-teal" onClick={() => openPDFView(lastChallanHTML)}><Eye className="w-4 h-4" />View</button>
//                 <button className="btn-maroon" onClick={() => openPDFPrint(lastChallanHTML)}><Printer className="w-4 h-4" />Print</button>
//                 <button className="btn-blue" style={{ padding: '9px 18px', fontSize: 13 }}
//                   onClick={() => { const w = window.open('', '_blank'); w.document.write(lastChallanHTML.replace(/<div class="action-bar">[\s\S]*?<\/div>/, '')); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 600); }}>
//                   <Download className="w-4 h-4" />Save PDF
//                 </button>
//               </div>
//             </div>
//             <div className="kt-mfoot" style={{ justifyContent: 'center' }}>
//               <button className="btn-white" onClick={() => setShowChallanSuccess(false)}>Close</button>
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
  Plus, Trash2, Printer, Search, CheckCircle,
  AlertTriangle, Loader2, RefreshCw, Download, Eye,
  X, TruckIcon, ArrowRight, EyeOff, ChevronDown, Edit2, Wrench
} from 'lucide-react';

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '9826700196',
  phone2: '9826275577',
  gstin: '23ADCPC2098K1ZQ',
};

const GST_OPTIONS = [
  { value: 0, label: 'No GST' },
  { value: 5, label: 'GST 5%' },
  { value: 12, label: 'GST 12%' },
  { value: 18, label: 'GST 18%' },
];

const WOOD_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece'];
const HARDWARE_UNIT_OPTIONS = ['Pcs', 'Pkt', 'Set', 'Dozen', 'Box', 'Kg', 'Meter'];
const CUSTOM_UNIT_OPTIONS = ['Pcs', 'CFT', 'RFT', 'SQFT', 'Per Piece', 'Kg', 'Meter', 'Box', 'Set', 'Pkt', 'Dozen'];
const SHEET_UNIT_OPTIONS = ['SQFT', 'Per Piece', 'Pcs'];
const CHARGE_UNIT_OPTIONS = ['CFT', 'RFT', 'SQFT', 'Per Piece', 'Lump Sum'];

const CHARGE_TYPES = [
  { value: 'labour', label: 'Labour Charges', icon: '👷' },
  { value: 'installation', label: 'Installation Charges', icon: '🔧' },
  { value: 'planing', label: 'Planing Charges', icon: '🪚' },
  { value: 'transport', label: 'Transport Charges', icon: '🚛' },
  { value: 'custom', label: 'Custom Charge', icon: '📋' },
];

const LIGHT = {
  maroon: '#7B1E1E', maroonDark: '#5a1515', maroonLight: '#9a2828',
  cream: '#FBF6F0', creamLight: '#FFFBF5', creamDark: '#F0E6DA',
  accent: '#FDF8F2', textDark: '#2a1010', textMuted: '#6b5454',
  borderSoft: '#E8DCC8', cardBg: '#ffffff', pageBg: '#FBF6F0',
  inputBg: '#ffffff', hoverBg: '#F0E6DA', modalBg: '#ffffff',
  overlayBg: 'rgba(42,16,16,0.5)', shadow: 'rgba(123,30,30,0.05)',
  shadowStrong: 'rgba(123,30,30,0.18)', tableEven: '#FDF8F2',
  tableHover: '#FFFBF5', successBg: '#dcfce7', successColor: '#166534',
  successBorder: '#bbf7d0', infoBg: '#dbeafe', infoColor: '#1e40af',
  infoBorder: '#bfdbfe', errorBg: '#fef2f2', errorBorder: '#fecaca',
  errorColor: '#dc2626', purpleBg: '#f3e8ff', purpleColor: '#6b21a8',
  purpleBorder: '#e9d5ff', amberBg: '#fef3c7', amberColor: '#92400e',
  amberBorder: '#fde68a',
};

const DARK = {
  maroon: '#e8a0a0', maroonDark: '#c47070', maroonLight: '#f0b8b8',
  cream: '#1a1a2e', creamLight: '#222240', creamDark: '#2a2a45',
  accent: '#1e1e35', textDark: '#f0e8e8', textMuted: '#a89999',
  borderSoft: '#3a3a55', cardBg: '#1e1e35', pageBg: '#0f0f1e',
  inputBg: '#222240', hoverBg: '#2a2a45', modalBg: '#1e1e35',
  overlayBg: 'rgba(0,0,0,0.65)', shadow: 'rgba(0,0,0,0.3)',
  shadowStrong: 'rgba(0,0,0,0.5)', tableEven: '#1a1a2e',
  tableHover: '#222240', successBg: '#052e16', successColor: '#4ade80',
  successBorder: '#166534', infoBg: '#172554', infoColor: '#93c5fd',
  infoBorder: '#1e40af', errorBg: '#450a0a', errorBorder: '#7f1d1d',
  errorColor: '#fca5a5', purpleBg: '#2e1065', purpleColor: '#c4b5fd',
  purpleBorder: '#6b21a8', amberBg: '#451a03', amberColor: '#fbbf24',
  amberBorder: '#92400e',
};

function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

// function parseSheetDimensions(name) {
//   if (!name) return null;
  
//   // Match patterns like "87x30", "87 x 33", "87×36", "8x4", "8'x4'" etc.
//   const match = name.match(/(\d+(?:\.\d+)?)\s*['"]?\s*[x×]\s*(\d+(?:\.\d+)?)\s*['"]?/i);
//   if (!match) return null;
  
//   let w = parseFloat(match[1]);
//   let h = parseFloat(match[2]);
  
//   // Determine if values are in inches or feet
//   // Door sizes like 87x30, 84x33 etc are clearly inches (> 12)
//   // Sheet sizes like 8x4, 7x4 are in feet
//   let wFeet, hFeet;
//   let isInches = false;
  
//   if (w > 12 || h > 12) {
//     // Values are in inches - convert to feet for SQFT
//     isInches = true;
//     wFeet = w / 12;
//     hFeet = h / 12;
//   } else {
//     // Values are in feet already
//     wFeet = w;
//     hFeet = h;
//   }
  
//   const areaSqft = wFeet * hFeet;
  
//   // Check for mm thickness like "30mm", "19mm"
//   // But don't confuse with dimension numbers - look for "mm" specifically after a number
//   // that's NOT part of the dimension pattern
//   let thickness = null;
//   const mmMatch = name.match(/(\d+(?:\.\d+)?)\s*mm/i);
//   if (mmMatch) {
//     const mmVal = parseFloat(mmMatch[1]);
//     // Make sure this mm value is not one of our dimensions
//     if (mmVal !== w && mmVal !== h) {
//       thickness = mmVal;
//     }
//   }
  
//   return { 
//     widthFeet: wFeet, 
//     heightFeet: hFeet, 
//     areaPerPiece: Math.round(areaSqft * 1000) / 1000, 
//     thickness, 
//     isInches,
//     widthOrig: w,
//     heightOrig: h
//   };
// }



function parseSheetDimensions(name) {
  if (!name) return null;

  // Step 1: Try to find dimension pattern like "87x30", "8x4", "8'x4'" etc.
  // But first remove thickness patterns like "30mm", "19mm", "25mm" to avoid confusion
  let cleanName = name.replace(/(\d+(?:\.\d+)?)\s*mm/gi, ' ');
  
  // Match dimension patterns: "87x30", "8x4", "8'x4'", "8 x 4" etc.
  const match = cleanName.match(/(\d+(?:\.\d+)?)\s*['"]?\s*[x×]\s*(\d+(?:\.\d+)?)\s*['"]?/i);
  if (!match) return null;

  let w = parseFloat(match[1]);
  let h = parseFloat(match[2]);

  // Determine if values are in inches or feet
  // Door sizes like 87x30, 84x33 = inches (any value > 12 means inches)
  // Sheet/WPC/MDF sizes like 8x4, 7x4 = feet
  let wFeet, hFeet;
  let isInches = false;

  if (w > 12 || h > 12) {
    // Values are in inches
    isInches = true;
    wFeet = w / 12;
    hFeet = h / 12;
  } else {
    // Values are in feet
    wFeet = w;
    hFeet = h;
  }

  const areaSqft = wFeet * hFeet;

  // Extract thickness in mm (from original name, not cleaned)
  let thickness = null;
  const mmMatch = name.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mmMatch) {
    const mmVal = parseFloat(mmMatch[1]);
    // Make sure mm value is not same as one of our dimensions
    if (mmVal !== w && mmVal !== h) {
      thickness = mmVal;
    }
  }

  return {
    widthFeet: Math.round(wFeet * 10000) / 10000,
    heightFeet: Math.round(hFeet * 10000) / 10000,
    areaPerPiece: Math.round(areaSqft * 1000) / 1000,
    thickness,
    isInches,
    widthOrig: w,
    heightOrig: h
  };
}

function isSheetMaterial(name) {
  return /mdf|hdhdr|hdmr|door|wpc|ply|block|flush|laminate|board|sunmica|formica|veneer/i.test(name || '');
}

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

  // Sheet material - SQFT calculation
  if (item.isSheet && item.areaPerPiece && item.unit === 'SQFT') {
    const totalSqft = item.areaPerPiece * qty;
    return { calculatedQty: Math.round(totalSqft * 1000) / 1000, amount: Math.round(totalSqft * rate * 100) / 100 };
  }

  // Sheet material - Per Piece
  if (item.isSheet && (item.unit === 'Per Piece' || item.unit === 'Pcs')) {
    return { calculatedQty: qty, amount: Math.round(qty * rate * 100) / 100 };
  }

  // Wood material (not sheet)
  if (item.isWood && !item.isSheet) {
    const width = parseFloat(item.width || 0);
    const thickness = parseFloat(item.thickness || 0);
    const totalLengthFeet = parseFloat(item.lengthFeet || 0) + (parseFloat(item.lengthInches || 0) / 12);
    let calculatedQty = qty;
    switch (item.unit) {
      case 'CFT': calculatedQty = (width * thickness * totalLengthFeet * qty) / 144; break;
      case 'RFT': calculatedQty = totalLengthFeet * qty; break;
      case 'SQFT': calculatedQty = (width * totalLengthFeet * qty) / 12; break;
      default: calculatedQty = qty;
    }
    return { calculatedQty: Math.round(calculatedQty * 1000) / 1000, amount: Math.round(calculatedQty * rate * 100) / 100 };
  }

  return { calculatedQty: qty, amount: Math.round(qty * rate * 100) / 100 };
}

function calculateChargeAmount(charge) {
  const qty = parseFloat(charge.quantity || 0);
  const rate = parseFloat(charge.rate || 0);
  if (charge.unit === 'Lump Sum') return Math.round(rate * 100) / 100;
  return Math.round(qty * rate * 100) / 100;
}

function rebuildItemForEdit(savedItem) {
  const item = {
    uid: uid(), product: savedItem.product || '', unit: savedItem.unit || '',
    lengthFeet: savedItem.lengthFeet || '', lengthInches: savedItem.lengthInches || '',
    quantity: savedItem.quantity || '', rate: savedItem.rate || '', amount: savedItem.amount || 0,
    calculatedQty: savedItem.calculatedQty || 0, skuCode: savedItem.skuCode || '',
    isWood: savedItem.isWood || false, isSheet: savedItem.isSheet || false,
    width: parseFloat(savedItem.width || 0), thickness: parseFloat(savedItem.thickness || 0),
    size: savedItem.size || '', materialType: savedItem.materialType || '',
    category: savedItem.category || '', subCategory: savedItem.subCategory || '',
    specification: savedItem.specification || '', areaPerPiece: savedItem.areaPerPiece || null,
  };
  if (item.isSheet && !item.areaPerPiece) {
    const dims = parseSheetDimensions(item.product);
    if (dims) { item.areaPerPiece = dims.areaPerPiece; item.width = dims.widthFeet; item.size = `${dims.widthFeet}'×${dims.heightFeet}'`; }
  } else if (item.isWood && !item.isSheet && (!item.width || !item.thickness)) {
    const dims = parseWoodDimensions(item.product);
    if (dims) { item.width = dims.width; item.thickness = dims.thickness; item.size = `${dims.width}×${dims.thickness}"`; }
  }
  // Default unit for sheet
  if (item.isSheet && !item.unit) item.unit = 'SQFT';

  const calc = calculateByUnit(item);
  item.calculatedQty = calc.calculatedQty;
  item.amount = calc.amount;
  return item;
}

function numberToWords(num) {
  if (num === 0 || isNaN(num) || num === undefined || num === null) return 'Zero Rupees Only';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function convert(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }
  const i = Math.floor(num);
  const d = Math.round((num - i) * 100);
  const rupeesPart = convert(i);
  const paisePart = d > 0 ? ' and ' + convert(d) + ' Paise' : '';
  return (rupeesPart ? rupeesPart + ' Rupees' : 'Zero Rupees') + paisePart + ' Only';
}

// ===== FIXED SearchableSelect =====
function SearchableSelect({ options, value, onChange, placeholder = 'Search...', disabled = false, allowCustom = false, T, displayValue = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const wrapRef = useRef(null);
  const isInternalChange = useRef(false);

  const getVal = o => (typeof o === 'string' ? o : o.value ?? o.label ?? o);
  const getDisp = o => (typeof o === 'string' ? o : o.label ?? o.value ?? o);

  // Sync inputValue from props - only when not internal change
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (displayValue !== undefined && displayValue !== null && displayValue !== '') {
      setInputValue(displayValue);
      return;
    }
    if (!value) {
      setInputValue('');
      return;
    }
    const match = options.find(o => getVal(o) === value);
    if (match) {
      setInputValue(getDisp(match));
    } else if (allowCustom) {
      setInputValue(value);
    } else {
      setInputValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, displayValue]);

  const commit = (val, disp) => {
    isInternalChange.current = true;
    setInputValue(disp);
    setIsOpen(false);
    onChange(val);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const filtered = options.filter(o =>
    getDisp(o).toLowerCase().includes((inputValue || '').toLowerCase())
  );
  const exactMatch = options.find(o =>
    getDisp(o).toLowerCase() === (inputValue || '').trim().toLowerCase()
  );

  return (
    <div ref={wrapRef} className="searchable-select">
      <div className="ss-input-wrap">
        <input
          type="text"
          className="ss-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => {
            if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
              setIsOpen(true);
              e.preventDefault();
            }
            if (e.key === 'Escape') setIsOpen(false);
          }}
          disabled={disabled}
          style={{ background: T?.inputBg, color: T?.textDark, borderColor: T?.borderSoft }}
        />
        <div className="ss-icons">
          {inputValue && !disabled && (
            <button type="button" className="ss-clear" onClick={() => commit('', '')}>
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`ss-arrow ${isOpen ? 'open' : ''}`} style={{ color: T?.textMuted }} />
        </div>
      </div>
      {isOpen && !disabled && (
        <div className="ss-dropdown" style={{ background: T?.cardBg, borderColor: T?.borderSoft }}>
          {filtered.map((o, idx) => (
            <div
              key={idx}
              className={`ss-option ${getVal(o) === value ? 'selected' : ''}`}
              onClick={() => commit(getVal(o), getDisp(o))}
              style={{ color: T?.textDark }}
            >
              {getDisp(o)}
            </div>
          ))}
          {allowCustom && inputValue.trim() && !exactMatch && (
            <div
              className="ss-option"
              onClick={() => commit(inputValue.trim(), inputValue.trim())}
              style={{ color: T?.maroon, fontWeight: 600, borderTop: `1px dashed ${T?.borderSoft}` }}
            >
              ✏️ Use: &quot;{inputValue.trim()}&quot;
            </div>
          )}
          {filtered.length === 0 && !(allowCustom && inputValue.trim()) && (
            <div className="ss-no-results" style={{ padding: '10px', color: T?.textMuted, textAlign: 'center' }}>
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========== PROFESSIONAL A4 PRINT CSS - FULL PAGE ==========
const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}

.page-wrapper{
  width:210mm;min-height:297mm;margin:10px auto;background:#fff;
  box-shadow:0 4px 20px rgba(0,0,0,0.15);position:relative;
  display:flex;flex-direction:column;
}
.page-content{
  padding:0;flex:1;display:flex;flex-direction:column;
}

.action-bar{
  display:flex;gap:12px;justify-content:center;padding:14px 20px;
  background:linear-gradient(135deg,#FBF6F0,#F0E6DA);
  border-bottom:2px solid #E8DCC8;
}
.action-btn{
  padding:10px 28px;border:none;border-radius:8px;font-size:14px;
  font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;
  transition:all 0.2s;letter-spacing:0.3px;
}
.btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
.btn-print:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(123,30,30,0.4)}
.btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,0.3)}
.btn-save:hover{transform:translateY(-1px)}
.btn-close{background:#fff;color:#333;border:1px solid #ddd;box-shadow:0 1px 4px rgba(0,0,0,0.1)}

.ktp-header{
  background:linear-gradient(135deg,#5a1515,#7B1E1E,#9a2828);
  color:#fff;padding:16px 24px 14px;
  display:flex;align-items:center;gap:20px;
}
.ktp-logo-circle{
  width:62px;height:62px;border-radius:50%;border:3px solid rgba(255,255,255,0.9);
  background:#fff;display:flex;align-items:center;justify-content:center;
  overflow:hidden;flex-shrink:0;
  box-shadow:0 2px 8px rgba(0,0,0,0.2);
}
.ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:34px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;text-shadow:1px 1px 2px rgba(0,0,0,0.2)}
.ktp-brand-sub{font-size:16px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:3px;opacity:0.95;margin-top:2px}
.ktp-brand-addr{font-size:9.5px;margin-top:6px;opacity:0.85;letter-spacing:0.3px}
.ktp-header-right-space{width:62px;flex-shrink:0}

.ktp-meta{
  display:flex;justify-content:space-between;align-items:center;
  border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
  border-bottom:1.5px solid #7B1E1E;
  padding:6px 16px;background:#FBF6F0;
}
.ktp-meta-left{display:flex;flex-direction:column;gap:1px}
.ktp-since{font-size:9px;font-style:italic;color:#6b5454}
.ktp-gstin{font-size:10.5px;font-weight:bold;color:#7B1E1E;letter-spacing:0.5px}
.ktp-dc-box{text-align:right}
.ktp-dc-title{
  font-size:16px;font-weight:bold;color:#7B1E1E;
  text-transform:uppercase;letter-spacing:2px;
  border:2px solid #7B1E1E;padding:2px 14px;
  display:inline-block;border-radius:4px;
}
.ktp-dc-details{font-size:10px;margin-top:3px;color:#333}

.ktp-info{
  border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
  border-bottom:1.5px solid #7B1E1E;
  padding:10px 16px;background:#fff;
}
.ktp-info-title{
  font-size:9px;font-weight:bold;text-transform:uppercase;
  color:#7B1E1E;letter-spacing:1.5px;margin-bottom:6px;
  border-bottom:1px solid #E8DCC8;padding-bottom:3px;
}
.ktp-info-grid{display:flex;flex-wrap:wrap;gap:6px 20px}
.ktp-field{display:flex;align-items:baseline;gap:5px;margin-bottom:3px}
.ktp-field-label{font-size:9.5px;font-weight:700;white-space:nowrap;color:#333}
.ktp-field-value{
  font-size:10.5px;border-bottom:1px dotted #999;
  padding-bottom:1px;min-width:80px;color:#000;
}
.ktp-field-value.wide{min-width:220px;flex:1}
.ktp-field-value.medium{min-width:140px}

.ktp-table-wrap{
  border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
  flex:1;
}
table.items{width:100%;border-collapse:collapse}
table.items thead tr{background:linear-gradient(135deg,#5a1515,#7B1E1E)}
table.items th{
  padding:7px 8px;font-size:9.5px;font-weight:bold;color:#fff;
  text-align:center;border-right:1px solid rgba(255,255,255,0.2);
  text-transform:uppercase;letter-spacing:0.5px;
}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #ddd}
table.items tbody tr:nth-child(even){background:#FAFAFA}
table.items tbody tr:nth-child(odd){background:#fff}
table.items td{
  padding:5px 8px;font-size:10.5px;
  border-right:1px solid #e0e0e0;vertical-align:top;
}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
table.items td.c{text-align:center}
table.items .item-detail{font-size:8.5px;color:#777;margin-top:1px}
table.items .erow td{height:22px;border-right:1px solid #e0e0e0}
table.items .erow td:last-child{border-right:none}

.ktp-words{
  border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;
  border-top:2px solid #7B1E1E;
  padding:6px 16px;background:#FDF8F2;
}
.ktp-words-label{font-size:8px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:1px}
.ktp-words-text{font-size:10px;font-weight:600;color:#333;margin-top:1px}

.ktp-footer{
  border:2px solid #7B1E1E;border-top:none;
  display:flex;background:#fff;
}
.ktp-footer-left{
  flex:1;padding:10px 16px;
  border-right:2px solid #7B1E1E;
  display:flex;flex-direction:column;justify-content:space-between;
}
.ktp-footer-cert{font-size:9px;color:#555;line-height:1.6}
.ktp-footer-for{font-size:10px;font-weight:bold;color:#7B1E1E;margin-top:6px}
.ktp-footer-terms{font-size:8px;color:#777;margin-top:8px;line-height:1.5}
.ktp-footer-terms li{margin-bottom:2px}
.ktp-sig-area{
  display:flex;justify-content:space-between;align-items:flex-end;
  margin-top:12px;padding-top:6px;
}
.ktp-sig-box{text-align:center}
.ktp-sig-line{width:140px;border-top:1px solid #000;margin-bottom:3px}
.ktp-sig-label{font-size:8px;color:#555}

.ktp-footer-right{
  width:230px;display:flex;flex-direction:column;
}
.ktp-charge-section{border-bottom:1.5px solid #7B1E1E}
.ktp-charge-header{
  padding:5px 12px;font-size:8.5px;font-weight:bold;
  color:#7B1E1E;text-transform:uppercase;letter-spacing:0.5px;
  background:#FDF8F2;border-bottom:1px solid #E8DCC8;
}
.ktp-charge-row{
  display:flex;justify-content:space-between;
  padding:4px 12px;font-size:9.5px;color:#333;
  border-bottom:1px solid #f0e6da;
}
.ktp-charge-row:last-child{border-bottom:none}
.ktp-charge-name{max-width:140px;overflow:hidden;text-overflow:ellipsis}
.ktp-charge-amt{font-weight:600;font-variant-numeric:tabular-nums}

.ktp-total-row{
  display:flex;justify-content:space-between;
  padding:5px 12px;font-size:10px;
  border-bottom:1px solid #E8DCC8;color:#333;
}
.ktp-total-row .ktp-total-label{font-weight:500}
.ktp-total-row .ktp-total-val{font-weight:600;font-variant-numeric:tabular-nums}
.ktp-total-row.grand{
  background:linear-gradient(135deg,#5a1515,#7B1E1E);
  color:#fff;font-size:12px;font-weight:bold;
  border-bottom:none;padding:8px 12px;
}
.ktp-total-row.grand .ktp-total-val{letter-spacing:0.5px}

.ktp-sig-right{
  flex:1;display:flex;flex-direction:column;
  justify-content:flex-end;align-items:center;
  padding:8px 12px;
}
.ktp-sig-right .ktp-sig-line{width:120px;border-top:1px solid #000;margin-bottom:3px}
.ktp-sig-right .ktp-sig-label{font-size:8px;color:#555}

.ktp-eoe{
  padding:3px 12px;font-size:7.5px;color:#999;
  text-align:right;border-top:1px solid #E8DCC8;
  letter-spacing:0.5px;
}

.ktp-no-price-box{
  padding:20px 12px;text-align:center;
  color:#7B1E1E;font-weight:bold;font-size:11px;
  flex:1;display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:4px;
}

@media print{
  body{background:#fff!important}
  .action-bar{display:none!important}
  .page-wrapper{width:100%!important;min-height:100%!important;margin:0!important;box-shadow:none!important}
  .page-content{min-height:100%!important}
  .ktp-header{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  table.items thead tr{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  table.items th{color:#fff!important}
  .ktp-total-row.grand{background:#7B1E1E!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .ktp-charge-header{background:#FDF8F2!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .ktp-table-wrap{flex:1!important}
}
@page{size:A4;margin:4mm 6mm}
`;

const buildItemDesc = (it) => {
  let name = `<strong>${it.product}</strong>`;
  let details = [];
  if (it.specification?.trim()) details.push(`(${it.specification})`);
  if (it.size) details.push(it.size);
  const ld = it.lengthDisplay || '';
  if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
  if (details.length) name += `<br><span class="item-detail">${details.join(' · ')}</span>`;
  return name;
};

function getChallanPrintHTML(order, challan, hidePrice = false, chargesList = []) {
  // Filter ONLY regular items - NO charges in the items table
  const regularItems = (challan.items || []).filter(it => !it.isCharge);
  const itemsTotal = regularItems.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
  const chargesTotal = chargesList.reduce((s, ch) => s + ch.amount, 0);
  const challanTotal = hidePrice ? 0 : (itemsTotal + chargesTotal);

  const poLine = order.poNumber ? `<div class="ktp-field"><span class="ktp-field-label">PO No.:</span><span class="ktp-field-value medium">${order.poNumber}</span></div>` : '';
  const gstLine = order.gstCustomerName ? `<div class="ktp-field"><span class="ktp-field-label">GST Party:</span><span class="ktp-field-value medium">${order.gstCustomerName}</span></div>` : '';

  let sno = 0;
  const itemRows = regularItems.map(it => {
    sno++;
    let qtyVal = it.calculatedQty ? parseFloat(it.calculatedQty).toFixed(3) : it.sentQty;
    let qtyWithUnit = it.unit ? `${qtyVal} ${it.unit}` : qtyVal;

    // For sheets show pieces count too
    if (it.isSheet && it.unit === 'SQFT' && parseFloat(it.sentQty || it.quantity || 0) > 0) {
      const pcs = parseFloat(it.sentQty || it.quantity || 0);
      qtyWithUnit = `${qtyVal} ${it.unit}<br><span class="item-detail">(${pcs} pcs)</span>`;
    }

    return `<tr>
      <td class="c">${sno}</td>
      <td>${buildItemDesc(it)}</td>
      ${!hidePrice ? `
        <td class="r">${qtyWithUnit}</td>
        <td class="r">₹${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td class="r"><strong>₹${parseFloat(it.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
      ` : `<td class="r">${qtyWithUnit}</td>`}
    </tr>`;
  });

  // Calculate empty rows to fill the page
  const minRows = hidePrice ? 18 : 14;
  const emptyCount = Math.max(0, minRows - itemRows.length);
  const colCount = hidePrice ? 3 : 5;
  const emptyRows = Array(emptyCount).fill(0).map(() => {
    let cells = '';
    for (let i = 0; i < colCount; i++) cells += '<td>&nbsp;</td>';
    return `<tr class="erow">${cells}</tr>`;
  });

  // Charges section in footer right - SEPARATE from items table
  let chargesHtml = '';
  if (chargesList.length > 0 && !hidePrice) {
    chargesHtml = `<div class="ktp-charge-section">
      <div class="ktp-charge-header">Additional Charges</div>
      ${chargesList.map(ch => `<div class="ktp-charge-row">
        <span class="ktp-charge-name">${ch.name}</span>
        <span class="ktp-charge-amt">₹${ch.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>`).join('')}
    </div>`;
  }

  let footerRightContent = '';
  if (!hidePrice) {
    footerRightContent = `
      ${chargesHtml}
      <div class="ktp-total-row">
        <span class="ktp-total-label">Items Total</span>
        <span class="ktp-total-val">₹${itemsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      ${chargesTotal > 0 ? `<div class="ktp-total-row">
        <span class="ktp-total-label">Charges Total</span>
        <span class="ktp-total-val">₹${chargesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>` : ''}
      <div class="ktp-total-row grand">
        <span class="ktp-total-label">Grand Total</span>
        <span class="ktp-total-val">₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="ktp-sig-right">
        <div class="ktp-sig-line"></div>
        <div class="ktp-sig-label">Authorised Signatory</div>
      </div>
      <div class="ktp-eoe">E. & O.E.</div>
    `;
  } else {
    footerRightContent = `
      <div class="ktp-no-price-box">
        <div style="font-size:22px;">📋</div>
        <div>DELIVERY CHALLAN</div>
        <div style="font-size:9px;font-weight:normal;color:#999;">For Goods Reference Only</div>
      </div>
      <div class="ktp-sig-right">
        <div class="ktp-sig-line"></div>
        <div class="ktp-sig-label">Authorised Signatory</div>
      </div>
      <div class="ktp-eoe">E. & O.E.</div>
    `;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}</style></head><body>
<div class="action-bar">
  <button class="action-btn btn-print" onclick="window.print()">🖨️ Print Challan</button>
  <button class="action-btn btn-save" onclick="savePDF()">💾 Save as PDF</button>
  <button class="action-btn btn-close" onclick="window.close()">✕ Close</button>
</div>
<div class="page-wrapper">
<div class="page-content">
<div class="ktp-header">
  <div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div>
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
    <div class="ktp-dc-title">Delivery Challan</div>
    <div class="ktp-dc-details">No.: <strong>${challan.challanNo}</strong> &nbsp;&nbsp;&nbsp; Date: <strong>${new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
  </div>
</div>
<div class="ktp-info">
  <div class="ktp-info-title">Consignee Details (Receiver)</div>
  <div class="ktp-info-grid">
    <div class="ktp-field"><span class="ktp-field-label">Name:</span><span class="ktp-field-value wide">${order.customerName}</span></div>
    <div class="ktp-field"><span class="ktp-field-label">Vehicle No.:</span><span class="ktp-field-value medium">${order.vehicleNo || '_______________'}</span></div>
    <div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value wide">${order.customerAddress || '_______________'}</span></div>
    ${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}
    ${poLine}${gstLine}
    <div class="ktp-field"><span class="ktp-field-label">Ref Order:</span><span class="ktp-field-value medium">${order.orderNo || ''}</span></div>
    ${challan.deliveryNote ? `<div class="ktp-field"><span class="ktp-field-label">Note:</span><span class="ktp-field-value medium">${challan.deliveryNote}</span></div>` : ''}
  </div>
</div>
<div class="ktp-table-wrap">
  <table class="items">
    <thead><tr>
      <th style="width:35px">S.No.</th>
      <th class="tl">Description of Goods</th>
      ${!hidePrice ? `<th style="width:95px">Quantity</th><th style="width:80px">Rate</th><th style="width:95px">Amount</th>` : `<th style="width:100px">Quantity</th>`}
    </tr></thead>
    <tbody>${itemRows.join('')}${emptyRows.join('')}</tbody>
  </table>
</div>
${!hidePrice ? `<div class="ktp-words"><div class="ktp-words-label">Amount in Words</div><div class="ktp-words-text">${numberToWords(challanTotal)}</div></div>` : ''}
<div class="ktp-footer">
  <div class="ktp-footer-left">
    <div>
      <div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div>
      <div class="ktp-footer-for">For : Krishna Timber &amp; Plywoods</div>
      <div class="ktp-footer-terms"><ul style="padding-left:12px;">
        <li>Goods once sold will not be taken back or exchanged.</li>
        <li>All disputes are subject to Bhopal jurisdiction only.</li>
        <li>Interest @2% per month will be charged on overdue payments.</li>
      </ul></div>
    </div>
    <div class="ktp-sig-area">
      <div class="ktp-sig-box"><div class="ktp-sig-line"></div><div class="ktp-sig-label">Customer Signature</div><div style="font-size:7px;color:#999;margin-top:2px;">Received goods in good condition</div></div>
    </div>
  </div>
  <div class="ktp-footer-right">${footerRightContent}</div>
</div>
</div>
</div>
<script>function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}</script>
</body></html>`;
}

const apiGet = async url => { try { const r = await fetch(url); if (!r.ok) return { success: false, data: [] }; return r.json(); } catch { return { success: false, data: [] }; } };
const apiPost = async (url, body) => { try { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
const apiPatch = async (url, body) => { try { const r = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
const apiDelete = async (url, body) => { try { const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); } catch (e) { return { success: false, error: e.message }; } };
const openPDFView = html => { const w = window.open('', '_blank'); w.document.write(html); w.document.close(); };
const openPDFPrint = html => { const w = window.open('', '_blank'); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 600); };
const sortLatestFirst = (items, df) => [...items].sort((a, b) => new Date(b[df]) - new Date(a[df]));

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showChallanSuccess, setShowChallanSuccess] = useState(false);
  const [lastChallanHTML, setLastChallanHTML] = useState('');
  const [lastChallanNo, setLastChallanNo] = useState('');
  const [orderForm, setOrderForm] = useState({
    customerName: '', customerPhone: '', customerAddress: '', vehicleNo: '',
    orderDate: new Date().toISOString().split('T')[0],
    gstRate: 0, notes: '', poNumber: '', gstCustomerName: '', hidePrice: false,
  });
  const [orderGroups, setOrderGroups] = useState([createEmptyGroup()]);
  const [orderCharges, setOrderCharges] = useState([]);
  const [challanDate, setChallanDate] = useState(new Date().toISOString().split('T')[0]);
  const [challanItems, setChallanItems] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [hidePriceOnChallan, setHidePriceOnChallan] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [addingToSheet, setAddingToSheet] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('ktp-dark-mode');
    if (stored === 'true') setDarkMode(true);
    const handleStorage = e => { if (e.key === 'ktp-dark-mode') setDarkMode(e.newValue === 'true'); };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const T = darkMode ? DARK : LIGHT;

  function createEmptyItem(ov = {}) {
    return {
      uid: uid(), product: '', unit: '', lengthFeet: '', lengthInches: '',
      quantity: '', rate: '', amount: 0, calculatedQty: 0, skuCode: '',
      isWood: false, isSheet: false, width: 0, thickness: 0, size: '',
      materialType: '', category: '', subCategory: '', specification: '', areaPerPiece: null,
      ...ov,
    };
  }

  function createEmptyGroup() {
    return { groupId: uid(), filterMaterialType: '', filterCategory: '', filterSubCategory: '', items: [createEmptyItem()] };
  }

  function createEmptyCharge() {
    return { uid: uid(), chargeType: '', chargeName: '', chargeDescription: '', unit: 'Per Piece', quantity: '', rate: '', amount: 0 };
  }

  const getAllOrderItems = () => orderGroups.flatMap(g => g.items.map(i => ({ ...i, filterMaterialType: g.filterMaterialType, filterCategory: g.filterCategory, filterSubCategory: g.filterSubCategory })));
  const orderSubtotal = getAllOrderItems().reduce((s, i) => s + (i.amount || 0), 0);
  const chargesSubtotal = orderCharges.reduce((s, c) => s + (c.amount || 0), 0);
  const orderTax = orderForm.gstRate > 0 ? (orderSubtotal + chargesSubtotal) * (orderForm.gstRate / 100) : 0;
  const orderTotal = orderSubtotal + chargesSubtotal + orderTax;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [oR, cR, pR] = await Promise.all([
        apiGet('/api/billing-backend/orders'),
        apiGet('/api/billing-backend/challans'),
        apiGet('/api/dropdown-data'),
      ]);
      setOrders(oR.success ? oR.data : []);
      setChallans(cR.success ? cR.data : []);
      setProducts(pR.success && pR.data ? pR.data : []);
    } catch { setError('Data load problem'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const isWoodMaterial = item => /timber|wood|lakdi|railing/i.test(item?.materialType || item?.product || '');
  const isSheetMaterial = name => /mdf|hdhdr|hdmr|door|wpc|ply|block|flush|laminate|board/i.test(name);
  const isRailingMaterial = name => /railing/i.test(name);

  const getFilteredProductsForGroup = g => products.filter(p => (!g.filterMaterialType || p.materialType === g.filterMaterialType) && (!g.filterCategory || p.category === g.filterCategory) && (!g.filterSubCategory || p.subCategory === g.filterSubCategory));
  const getAllMaterialTypes = () => [...new Set(products.map(p => p.materialType).filter(Boolean))];
  const getCategoriesFor = mt => [...new Set(products.filter(p => !mt || p.materialType === mt).map(p => p.category).filter(Boolean))];
  const getSubCategoriesFor = (mt, cat) => [...new Set(products.filter(p => (!mt || p.materialType === mt) && (!cat || p.category === cat)).map(p => p.subCategory).filter(Boolean))];

  const updateGroupFilter = (gid, field, val) => setOrderGroups(prev => prev.map(g => g.groupId === gid ? { ...g, [field]: val } : g));
  const addItemToGroup = gid => setOrderGroups(prev => prev.map(g => g.groupId === gid ? { ...g, items: [...g.items, createEmptyItem()] } : g));
  const removeItemFromGroup = (gid, iuid) => setOrderGroups(prev => prev.map(g => g.groupId === gid && g.items.length > 1 ? { ...g, items: g.items.filter(i => i.uid !== iuid) } : g));
  const removeGroup = gid => { if (orderGroups.length > 1) setOrderGroups(prev => prev.filter(g => g.groupId !== gid)); };
  const addNewGroup = () => setOrderGroups(prev => [...prev, createEmptyGroup()]);

  const updateGroupItem = (gid, iuid, field, val) => {
    setOrderGroups(prev => prev.map(g => {
      if (g.groupId !== gid) return g;
      return {
        ...g,
        items: g.items.map(item => {
          if (item.uid !== iuid) return item;
          let u = { ...item, [field]: val };

          if (field === 'skuCode') {
            const found = products.find(p => p.skuCode === val);
            if (found) {
              const isSheet = isSheetMaterial(found.materialName);
              const isWood = isWoodMaterial(found) && !isSheet;
              u = {
                ...u, product: found.materialName, skuCode: found.skuCode,
                materialType: found.materialType, category: found.category,
                subCategory: found.subCategory, isWood, isSheet
              };
              if (isSheet) {
                u.unit = 'SQFT';
                const dims = parseSheetDimensions(found.materialName);
                if (dims) {
                  u.areaPerPiece = dims.areaPerPiece;
                  u.width = dims.widthFeet;
                  u.thickness = dims.thickness;
                  u.size = dims.isInches
                    ? `${dims.widthOrig}"×${dims.heightOrig}"`
                    : `${dims.widthFeet}'×${dims.heightFeet}'`;
                }
                u.lengthFeet = ''; u.lengthInches = '';
              } else if (isWood) {
                u.unit = isRailingMaterial(found.materialName) ? 'RFT' : 'CFT';
                const dims = parseWoodDimensions(found.materialName);
                if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
              } else {
                u.unit = found.unit || 'Pcs';
                u.width = 0; u.thickness = 0; u.size = ''; u.areaPerPiece = null;
              }
            } else if (!val) {
              u.product = ''; u.skuCode = '';
            }
          }

          if (field === 'customProductName' && val?.trim()) {
            const isSheet = isSheetMaterial(val);
            const isWood = isWoodMaterial({ product: val }) && !isSheet;
            u.product = val; u.skuCode = '';
            u.materialType = g.filterMaterialType || 'Custom';
            u.category = g.filterCategory || 'Custom';
            u.subCategory = g.filterSubCategory || '';
            u.isWood = isWood; u.isSheet = isSheet;
            if (isSheet) {
              u.unit = 'SQFT';
              const dims = parseSheetDimensions(val);
              if (dims) {
                u.areaPerPiece = dims.areaPerPiece;
                u.width = dims.widthFeet;
                u.thickness = dims.thickness;
                u.size = dims.isInches
                  ? `${dims.widthOrig}"×${dims.heightOrig}"`
                  : `${dims.widthFeet}'×${dims.heightFeet}'`;
              }
            } else if (isWood) {
              u.unit = isRailingMaterial(val) ? 'RFT' : 'CFT';
              const dims = parseWoodDimensions(val);
              if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
            } else {
              if (!u.unit) u.unit = 'Pcs';
            }
          }

          // These fields should NOT touch product/skuCode
          if (field === 'unit') u.unit = val;
          if (field === 'quantity') u.quantity = val;
          if (field === 'rate') u.rate = val;
          if (field === 'lengthFeet') u.lengthFeet = val;
          if (field === 'lengthInches') u.lengthInches = val;
          if (field === 'specification') u.specification = val;

          const calc = calculateByUnit(u);
          u.calculatedQty = calc.calculatedQty;
          u.amount = calc.amount;
          return u;
        }),
      };
    }));
  };

  const addCharge = () => setOrderCharges(prev => [...prev, createEmptyCharge()]);
  const removeCharge = cuid => setOrderCharges(prev => prev.filter(c => c.uid !== cuid));
  const updateCharge = (cuid, field, val) => {
    setOrderCharges(prev => prev.map(c => {
      if (c.uid !== cuid) return c;
      let u = { ...c, [field]: val };
      if (field === 'chargeType') {
        const ct = CHARGE_TYPES.find(t => t.value === val);
        if (ct) u.chargeName = ct.label;
      }
      if (field === 'unit' && val === 'Lump Sum') u.quantity = '';
      u.amount = calculateChargeAmount(u);
      return u;
    }));
  };

  const genOrderNo = () => {
    const y = new Date().getFullYear();
    const prefix = `ORD-${y}-`;
    const max = orders.filter(o => o.orderNo?.startsWith(prefix)).reduce((m, o) => Math.max(m, parseInt(o.orderNo.replace(prefix, '')) || 0), 0);
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
  };
  const genChallanNo = () => {
    const y = new Date().getFullYear();
    const prefix = `CHL-${y}-`;
    const max = challans.filter(c => c.challanNo?.startsWith(prefix)).reduce((m, c) => Math.max(m, parseInt(c.challanNo.replace(prefix, '')) || 0), 0);
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
  };
  const getExistingChallanForOrder = orderNo => challans.filter(c => c.orderNo === orderNo);

  const openEditOrder = order => {
    setIsEditMode(true);
    setEditingOrder(order);
    setOrderForm({
      customerName: order.customerName || '', customerPhone: order.customerPhone || '',
      customerAddress: order.customerAddress || '', vehicleNo: order.vehicleNo || '',
      orderDate: order.orderDate || new Date().toISOString().split('T')[0],
      gstRate: order.gstRate || 0, notes: order.notes || '',
      poNumber: order.poNumber || '', gstCustomerName: order.gstCustomerName || '',
      hidePrice: order.hidePrice || false,
    });
    const savedItems = order.items || [];
    const regularItems = savedItems.filter(i => !i.isCharge);
    const savedCharges = savedItems.filter(i => i.isCharge);
    if (regularItems.length === 0) {
      setOrderGroups([createEmptyGroup()]);
    } else {
      const groupsMap = {};
      regularItems.forEach(it => {
        const key = it.materialType || 'Other';
        if (!groupsMap[key]) groupsMap[key] = [];
        groupsMap[key].push(rebuildItemForEdit(it));
      });
      setOrderGroups(Object.entries(groupsMap).map(([mt, items]) => ({
        groupId: uid(), filterMaterialType: mt === 'Other' ? '' : mt,
        filterCategory: items[0]?.category || '', filterSubCategory: items[0]?.subCategory || '', items,
      })));
    }
    setOrderCharges(savedCharges.map(ch => {
      const rebuilt = {
        uid: uid(), chargeType: ch.chargeType || 'custom',
        chargeName: ch.product || ch.chargeName || '',
        chargeDescription: ch.chargeDescription || '',
        unit: ch.unit || 'Per Piece', quantity: ch.quantity || '', rate: ch.rate || '', amount: 0
      };
      rebuilt.amount = calculateChargeAmount(rebuilt);
      return rebuilt;
    }));
    setShowOrderForm(true);
  };

  const resetOrderForm = () => {
    setOrderForm({
      customerName: '', customerPhone: '', customerAddress: '', vehicleNo: '',
      orderDate: new Date().toISOString().split('T')[0], gstRate: 0, notes: '',
      poNumber: '', gstCustomerName: '', hidePrice: false
    });
    setOrderGroups([createEmptyGroup()]);
    setOrderCharges([]);
    setIsEditMode(false);
    setEditingOrder(null);
  };

  const handleAddToSheet = async (group, item) => {
    if (!item.product) { setError('Product name required'); return; }
    if (item.skuCode) { setError('Product already in sheet'); return; }
    setAddingToSheet(prev => ({ ...prev, [item.uid]: true }));
    try {
      const productData = {
        materialType: item.materialType || group.filterMaterialType || 'Custom',
        category: item.category || group.filterCategory || 'Custom',
        subCategory: item.subCategory || group.filterSubCategory || '',
        materialName: item.product,
        unit: item.unit || (item.isWood ? 'CFT' : item.isSheet ? 'SQFT' : 'Pcs')
      };
      const res = await apiPost('/api/dropdown-data', { products: [productData] });
      if (res.success && res.data?.length) {
        const newProduct = res.data[0];
        setProducts(prev => prev.some(p => p.skuCode === newProduct.skuCode) ? prev : [...prev, newProduct]);
        updateGroupItem(group.groupId, item.uid, 'skuCode', newProduct.skuCode);
      } else setError(res.error || 'Failed to add to sheet');
    } catch (err) { setError('Error adding to sheet: ' + err.message); }
    finally { setAddingToSheet(prev => ({ ...prev, [item.uid]: false })); }
  };

  const handleSubmitOrder = async () => {
    if (!orderForm.customerName || getAllOrderItems().filter(i => i.product).length === 0) {
      setError('Customer name aur items required'); return;
    }
    setSaving(true); setError(null);
    try {
      const validItems = getAllOrderItems().filter(i => i.product && (i.quantity || i.calculatedQty)).map(it => ({
        ...it,
        lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
        isCharge: false, specification: it.specification || ''
      }));
      const validCharges = orderCharges.filter(c => c.chargeName && c.amount > 0).map(ch => ({
        ...ch, product: ch.chargeName, isCharge: true,
        calculatedQty: ch.unit === 'Lump Sum' ? 1 : parseFloat(ch.quantity || 0),
        chargeIcon: CHARGE_TYPES.find(t => t.value === ch.chargeType)?.icon || '📋',
        specification: ''
      }));
      const allItems = [...validItems, ...validCharges];

      let orderNo, existingChallans = [];
      if (isEditMode && editingOrder) {
        orderNo = editingOrder.orderNo;
        existingChallans = getExistingChallanForOrder(orderNo);
        const r = await apiPatch('/api/billing-backend/orders', {
          orderNo, order: {
            ...orderForm, orderNo, subtotal: orderSubtotal, chargesTotal: chargesSubtotal,
            tax: orderTax, total: orderTotal, status: editingOrder.status,
            includeGST: orderForm.gstRate > 0, hidePrice: orderForm.hidePrice
          }, items: allItems
        });
        if (!r.success) throw new Error(r.error);
        for (const old of existingChallans) await apiDelete('/api/billing-backend/challans', { challanNo: old.challanNo });
      } else {
        orderNo = genOrderNo();
        const r = await apiPost('/api/billing-backend/orders', {
          order: {
            ...orderForm, orderNo, subtotal: orderSubtotal, chargesTotal: chargesSubtotal,
            tax: orderTax, total: orderTotal, status: 'Active',
            includeGST: orderForm.gstRate > 0, hidePrice: orderForm.hidePrice
          }, items: allItems
        });
        if (!r.success) throw new Error(r.error);
      }

      const challanNo = (isEditMode && existingChallans.length) ? existingChallans[0].challanNo : genChallanNo();
      const hidePrice = orderForm.hidePrice;
      const challanTotal = hidePrice ? 0 : (orderSubtotal + chargesSubtotal);

      // Challan items: only regular items (no charges in items array)
      const challanPayload = {
        challan: {
          challanNo, orderNo, customerName: orderForm.customerName,
          challanDate: orderForm.orderDate, deliveryNote: orderForm.notes || '',
          challanTotal, status: 'Delivered', hidePrice
        },
        items: validItems.map(it => ({
          product: it.product, unit: it.unit,
          orderedQty: it.calculatedQty || parseFloat(it.quantity || 0),
          pieces: parseFloat(it.quantity || 0),
          sentQty: parseFloat(it.quantity || 0),
          calculatedQty: it.calculatedQty || parseFloat(it.quantity || 0),
          rate: parseFloat(it.rate || 0), amount: it.amount || 0,
          size: it.size || '', lengthDisplay: it.lengthDisplay || '',
          specification: it.specification || '', isCharge: false,
          areaPerPiece: it.areaPerPiece, isSheet: it.isSheet,
          quantity: it.quantity
        }))
      };
      await apiPost('/api/billing-backend/challans', challanPayload);

      // Charges for print - separate from items
      const chargesForPrint = validCharges.map(ch => ({ name: ch.chargeName, amount: ch.amount }));
      const html = getChallanPrintHTML(
        { ...orderForm, orderNo }, { ...challanPayload.challan, items: challanPayload.items },
        hidePrice, chargesForPrint
      );
      setLastChallanHTML(html); setLastChallanNo(challanNo);
      await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Completed' });
      await fetchData();
      setShowOrderForm(false);
      resetOrderForm();
      setShowChallanSuccess(true);
    } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
  };

  const getOrderChallans = orderNo => challans.filter(c => c.orderNo === orderNo);
  const getDeliveryProgress = order => {
    const sentMap = {};
    challans.filter(c => c.orderNo === order.orderNo).forEach(ch =>
      ch.items?.filter(i => !i.isCharge).forEach(i => {
        sentMap[i.product] = (sentMap[i.product] || 0) + parseFloat(i.calculatedQty || i.sentQty || 0);
      })
    );
    const items = (order.items || []).filter(i => !i.isCharge);
    if (!items.length) return 0;
    const total = items.reduce((s, it) => s + parseFloat(it.calculatedQty || it.quantity || 0), 0);
    const sent = items.reduce((s, it) => s + Math.min(parseFloat(it.calculatedQty || it.quantity || 0), sentMap[it.product] || 0), 0);
    return total ? Math.round((sent / total) * 100) : 0;
  };

  const openChallanForm = order => {
    setSelectedOrder(order);
    const sentMap = {};
    challans.filter(c => c.orderNo === order.orderNo).forEach(ch =>
      ch.items?.filter(i => !i.isCharge).forEach(i => {
        sentMap[i.product] = (sentMap[i.product] || 0) + parseFloat(i.calculatedQty || i.sentQty || 0);
      })
    );
    setChallanItems((order.items || []).filter(i => !i.isCharge).map(it => ({
      uid: uid(), product: it.product, unit: it.unit, rate: parseFloat(it.rate || 0),
      orderedQty: parseFloat(it.calculatedQty || it.quantity || 0),
      alreadySent: sentMap[it.product] || 0,
      sendingPcs: '', sendingQty: 0,
      size: it.size || '', lengthFeet: it.lengthFeet || '', lengthInches: it.lengthInches || '',
      lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
      isWood: it.isWood || false, isSheet: it.isSheet || false,
      width: it.width || 0, thickness: it.thickness || 0, areaPerPiece: it.areaPerPiece || null
    })));
    setChallanDate(new Date().toISOString().split('T')[0]);
    setDeliveryNote('');
    setHidePriceOnChallan(order.hidePrice || false);
    setShowChallanForm(true);
  };

  const updateChallanItem = (iuid, field, value) => {
    setChallanItems(prev => prev.map(it => {
      if (it.uid !== iuid) return it;
      const u = { ...it, [field]: value };
      if (field === 'sendingPcs') {
        const pcs = parseFloat(value || 0);
        if (it.isSheet && it.areaPerPiece) u.sendingQty = it.areaPerPiece * pcs;
        else if (it.isWood) u.sendingQty = calculateByUnit({
          ...u, quantity: pcs, isWood: true, width: it.width, thickness: it.thickness,
          unit: it.unit, lengthFeet: it.lengthFeet, lengthInches: it.lengthInches
        }).calculatedQty;
        else u.sendingQty = pcs;
      }
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
        challan: {
          challanNo, orderNo: selectedOrder.orderNo, customerName: selectedOrder.customerName,
          challanDate, deliveryNote, challanTotal, status: 'Delivered', hidePrice: hidePriceOnChallan
        },
        items: valid.map(it => ({
          product: it.product, unit: it.unit, orderedQty: it.orderedQty,
          pieces: parseFloat(it.sendingPcs), sentQty: parseFloat(it.sendingPcs),
          calculatedQty: it.sendingQty, rate: it.rate, amount: it.sendingQty * it.rate,
          size: it.size, lengthDisplay: it.lengthDisplay, isCharge: false,
          areaPerPiece: it.areaPerPiece, isSheet: it.isSheet, quantity: it.sendingPcs
        }))
      };
      const r = await apiPost('/api/billing-backend/challans', payload);
      if (!r.success) throw new Error(r.error);
      await fetchData();
      const html = getChallanPrintHTML(selectedOrder, { ...payload.challan, items: payload.items }, hidePriceOnChallan, []);
      setLastChallanHTML(html); setLastChallanNo(challanNo);
      setShowChallanForm(false);
      setShowChallanSuccess(true);
    } catch (err) { setError('Error: ' + err.message); } finally { setSaving(false); }
  };

  const filteredOrders = sortLatestFirst(orders.filter(o =>
    (!searchQuery || o.customerName?.toLowerCase().includes(searchQuery) || o.orderNo?.toLowerCase().includes(searchQuery) || o.customerPhone?.toLowerCase().includes(searchQuery) || o.poNumber?.toLowerCase().includes(searchQuery)) &&
    (filterStatus === 'All' || o.status === filterStatus)
  ), 'orderDate');

  const filteredChallans = sortLatestFirst(challans.filter(ch =>
    !challanSearchQuery || ch.challanNo?.toLowerCase().includes(challanSearchQuery) ||
    ch.orderNo?.toLowerCase().includes(challanSearchQuery) || ch.customerName?.toLowerCase().includes(challanSearchQuery)
  ), 'challanDate');

  const STATUS = darkMode
    ? { Active: { bg: '#2a1a1a', color: '#e8a0a0', dot: '#f0b8b8', border: '#3a3a55' }, Completed: { bg: '#052e16', color: '#4ade80', dot: '#22c55e', border: '#166534' } }
    : { Active: { bg: '#FBF6F0', color: '#7B1E1E', dot: '#9a2828', border: '#E8DCC8' }, Completed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e', border: '#bbf7d0' } };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40, background: T.pageBg, minHeight: '100vh' }}>
      <Loader2 className="animate-spin" style={{ color: T.maroon }} size={32} />
      <span style={{ marginLeft: 12, color: T.textDark, fontSize: 16 }}>Loading...</span>
    </div>
  );

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <style jsx global>{`
        *{box-sizing:border-box}
        .kt-input{width:100%;padding:9px 13px;border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;background:${T.inputBg};color:${T.textDark};outline:none;transition:all 0.15s}
        .kt-input:focus{border-color:${T.maroon};box-shadow:0 0 0 3px ${darkMode ? 'rgba(232,160,160,0.15)' : 'rgba(123,30,30,0.12)'}}
        .btn-maroon{padding:9px 20px;background:linear-gradient(135deg,${T.maroonDark},${T.maroon});color:${darkMode ? '#1a1a2e' : '#fff'};border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;box-shadow:0 2px 8px ${T.shadowStrong}}
        .btn-maroon:hover{transform:translateY(-1px)}
        .btn-white{padding:9px 18px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:${T.textDark};display:inline-flex;align-items:center;gap:6px}
        .btn-white:hover{background:${T.hoverBg};border-color:${T.maroon};color:${T.maroon}}
        .btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
        .btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .btn-amber{padding:7px 14px;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;border:none;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:${T.textMuted}}
        .icon-btn:hover{background:${T.hoverBg};color:${T.maroon}}
        .kt-card{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:16px;box-shadow:0 1px 5px ${T.shadow}}
        .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;background:transparent;color:${T.textMuted};cursor:pointer;transition:all 0.15s}
        .kt-tab.active{background:linear-gradient(135deg,${darkMode ? T.maroonDark : LIGHT.maroon},${T.maroon});color:${darkMode ? '#1a1a2e' : '#fff'}}
        .material-group{border:2px solid ${T.borderSoft};border-radius:16px;margin-bottom:16px;overflow:visible;background:${T.cardBg}}
        .material-group-header{background:${darkMode ? T.accent : `linear-gradient(135deg,${LIGHT.cream},${LIGHT.creamDark})`};padding:14px 18px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;border-radius:14px 14px 0 0}
        .material-group-body{padding:18px 20px}
        .material-group-footer{padding:10px 18px;border-top:1px dashed ${T.borderSoft};background:${T.accent};display:flex;justify-content:space-between;align-items:center;border-radius:0 0 14px 14px}
        .item-subrow{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;padding:14px;margin-bottom:10px}
        .calc-display{background:${T.cream};border-radius:8px;padding:10px;margin-top:10px;font-size:13px}
        .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}
        .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
        .total-box{border-radius:12px;padding:14px 18px;border:1px solid ${T.borderSoft};background:${T.cream}}
        .searchable-select{position:relative;width:100%}
        .ss-input-wrap{position:relative;display:flex;align-items:center}
        .ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid ${T.borderSoft};border-radius:8px;font-size:13px;background:${T.inputBg};color:${T.textDark}}
        .ss-input:focus{border-color:${T.maroon};outline:none}
        .ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}
        .ss-clear{width:18px;height:18px;border-radius:50%;background:${T.creamDark};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .ss-arrow{width:14px;height:14px;transition:transform 0.2s}
        .ss-arrow.open{transform:rotate(180deg)}
        .ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;z-index:9999;max-height:250px;overflow:auto;box-shadow:0 4px 16px ${T.shadowStrong}}
        .ss-option{padding:10px 12px;cursor:pointer;border-bottom:1px solid ${T.accent}}
        .ss-option:hover{background:${T.hoverBg}}
        .ss-option.selected{background:${T.cream}}
        .ss-no-results{padding:10px;color:${T.textMuted};text-align:center}
        .unit-badge{display:inline-flex;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600}
        .wood-badge{background:${T.successBg};color:${T.successColor}}
        .custom-badge{background:${T.amberBg};color:${T.amberColor}}
        .length-group{display:flex;gap:4px;align-items:center}
        .length-input{width:60px;text-align:center}
      `}</style>

      {error && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: 12, background: T.errorBg, border: `1px solid ${T.errorBorder}`, color: T.errorColor }}>
          <AlertTriangle size={18} /><span style={{ flex: 1 }}>{error}</span>
          <button className="icon-btn" onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: T.maroon, margin: 0 }}>Order & Challan</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="kt-tab" onClick={() => setActiveTab('orders')} style={{ background: activeTab === 'orders' ? T.maroon : 'transparent', color: activeTab === 'orders' ? '#fff' : T.textMuted }}>Orders</button>
          <button className="kt-tab" onClick={() => setActiveTab('challans')} style={{ background: activeTab === 'challans' ? T.maroon : 'transparent', color: activeTab === 'challans' ? '#fff' : T.textMuted }}>Challans</button>
          <button className="btn-maroon" onClick={() => { resetOrderForm(); setShowOrderForm(true); }}><Plus size={16} /> New Order</button>
        </div>
      </div>

      {/* === ORDERS TAB === */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
              <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search order..." value={searchQuery} onChange={e => setSearchQuery(e.target.value.toLowerCase())} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Active', 'Completed'].map(s => (
                <button key={s} className={`kt-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>
          </div>
          {filteredOrders.map(order => {
            const progress = getDeliveryProgress(order);
            const st = STATUS[order.status] || STATUS.Active;
            const challanCount = getOrderChallans(order.orderNo).length;
            return (
              <div key={order.orderNo} className="kt-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: T.maroon }}>{order.orderNo}</span>
                      <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                        <span className="status-dot" style={{ background: st.dot }} />{order.status}
                      </span>
                      {order.hidePrice && <span className="status-pill" style={{ background: T.cream, color: T.maroon, borderColor: T.borderSoft }}><EyeOff size={12} /> Hidden</span>}
                      {order.gstRate > 0 && <span className="status-pill" style={{ background: T.infoBg, color: T.infoColor, borderColor: T.infoBorder }}>GST {order.gstRate}%</span>}
                    </div>
                    <p style={{ fontWeight: 'bold', fontSize: 18, margin: '4px 0', color: T.textDark }}>{order.customerName}</p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                      {order.customerPhone && `${order.customerPhone} • `}{new Date(order.orderDate).toLocaleDateString()} • {(order.items || []).filter(i => !i.isCharge).length} items
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ width: 128 }}>
                      <div style={{ height: 6, background: T.creamDark, borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', borderRadius: 99, background: T.maroon, transition: 'width 0.3s' }} />
                      </div>
                      <p style={{ fontSize: 11, marginTop: 4, textAlign: 'right', color: T.textMuted }}>{progress}% • {challanCount} challan(s)</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-blue" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEditOrder(order)}><Edit2 size={12} /> Edit</button>
                      <button className="btn-white" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openChallanForm(order)}><TruckIcon size={12} /> Partial</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredOrders.length === 0 && (
            <div className="kt-card" style={{ padding: 56, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: T.textMuted }}>No orders found</p>
            </div>
          )}
        </div>
      )}

      {/* === CHALLANS TAB === */}
      {activeTab === 'challans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search challan..." value={challanSearchQuery} onChange={e => setChallanSearchQuery(e.target.value.toLowerCase())} />
          </div>
          {filteredChallans.map(ch => {
            const order = orders.find(o => o.orderNo === ch.orderNo);
            return (
              <div key={ch.challanNo} className="kt-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: T.maroon }}>{ch.challanNo}</span>
                      <span style={{ fontSize: 12, color: T.textMuted }}>→ {ch.orderNo}</span>
                      <span className="status-pill" style={{ background: T.successBg, color: T.successColor }}>
                        <span className="status-dot" style={{ background: '#22c55e' }} />Delivered
                      </span>
                      {ch.hidePrice && <span className="status-pill" style={{ background: T.cream, color: T.maroon }}><EyeOff size={12} /> Hidden</span>}
                    </div>
                    <p style={{ fontWeight: 600, margin: '4px 0', color: T.textDark }}>{ch.customerName}</p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                      {new Date(ch.challanDate).toLocaleDateString()} • {(ch.items || []).length} items
                      {!ch.hidePrice && <span style={{ fontWeight: 600 }}> ₹{parseFloat(ch.challanTotal).toLocaleString()}</span>}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-white" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => {
                      if (order) {
                        const orderChargesFromItems = (order.items || []).filter(i => i.isCharge).map(c => ({ name: c.product || c.chargeName, amount: parseFloat(c.amount || 0) }));
                        openPDFView(getChallanPrintHTML(order, ch, ch.hidePrice, orderChargesFromItems));
                      }
                    }}><Eye size={12} /> View</button>
                    <button className="btn-maroon" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => {
                      if (order) {
                        const orderChargesFromItems = (order.items || []).filter(i => i.isCharge).map(c => ({ name: c.product || c.chargeName, amount: parseFloat(c.amount || 0) }));
                        openPDFPrint(getChallanPrintHTML(order, ch, ch.hidePrice, orderChargesFromItems));
                      }
                    }}><Printer size={12} /> Print</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === ORDER FORM MODAL === */}
      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, overflow: 'auto', padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ background: T.modalBg, border: `1px solid ${T.borderSoft}`, borderRadius: 16, maxWidth: 1024, width: '100%', margin: '32px 0', boxShadow: `0 8px 32px ${T.shadowStrong}` }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: 20, margin: 0, color: T.textDark }}>{isEditMode ? `Edit — ${editingOrder?.orderNo}` : 'New Order + Challan'}</h3>
              <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X size={24} /></button>
            </div>
            <div style={{ padding: 20, maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Customer Details */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.maroon, marginBottom: 8 }}>Customer Details</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <input className="kt-input" placeholder="Customer Name *" value={orderForm.customerName} onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
                  <input className="kt-input" placeholder="Phone" value={orderForm.customerPhone} onChange={e => setOrderForm({ ...orderForm, customerPhone: e.target.value })} />
                  <input className="kt-input" placeholder="Vehicle No." value={orderForm.vehicleNo} onChange={e => setOrderForm({ ...orderForm, vehicleNo: e.target.value })} />
                  <input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm({ ...orderForm, orderDate: e.target.value })} />
                  <select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm({ ...orderForm, gstRate: parseFloat(e.target.value) })}>
                    {GST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <input className="kt-input" placeholder="PO Number" value={orderForm.poNumber} onChange={e => setOrderForm({ ...orderForm, poNumber: e.target.value })} />
                  <input className="kt-input" placeholder="GST Customer Name" value={orderForm.gstCustomerName} onChange={e => setOrderForm({ ...orderForm, gstCustomerName: e.target.value })} />
                  <textarea className="kt-input" rows="2" placeholder="Address" value={orderForm.customerAddress} onChange={e => setOrderForm({ ...orderForm, customerAddress: e.target.value })} style={{ gridColumn: 'span 2' }} />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 20, color: T.textDark }}>
                <input type="checkbox" checked={orderForm.hidePrice} onChange={e => setOrderForm({ ...orderForm, hidePrice: e.target.checked })} />
                <EyeOff size={18} /> Hide Price on Challan
              </label>

              {/* Items Groups */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.maroon, marginBottom: 8 }}>Items</p>
                {orderGroups.map((group, gIdx) => {
                  const gp = getFilteredProductsForGroup(group);
                  const gc = getCategoriesFor(group.filterMaterialType);
                  const gsc = getSubCategoriesFor(group.filterMaterialType, group.filterCategory);
                  return (
                    <div key={group.groupId} className="material-group">
                      <div className="material-group-header">
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: T.maroon, fontWeight: 'bold', fontSize: 14 }}>{gIdx + 1}</div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: T.textDark }}>{group.filterMaterialType || 'Select Material'}</div>
                            <div style={{ fontSize: 12, color: T.textMuted }}>{group.items.length} items</div>
                          </div>
                        </div>
                        {orderGroups.length > 1 && <button className="icon-btn" onClick={() => removeGroup(group.groupId)}><Trash2 size={16} /></button>}
                      </div>
                      <div style={{ padding: 12, background: T.accent, display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: `1px solid ${T.borderSoft}` }}>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <SearchableSelect options={getAllMaterialTypes()} value={group.filterMaterialType} onChange={v => updateGroupFilter(group.groupId, 'filterMaterialType', v)} placeholder="Material Type" allowCustom T={T} />
                        </div>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <SearchableSelect options={gc} value={group.filterCategory} onChange={v => updateGroupFilter(group.groupId, 'filterCategory', v)} placeholder="Category" allowCustom T={T} />
                        </div>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <SearchableSelect key={group.filterCategory} options={gsc} value={group.filterSubCategory} onChange={v => updateGroupFilter(group.groupId, 'filterSubCategory', v)} placeholder="Sub Category" allowCustom T={T} />
                        </div>
                      </div>
                      <div className="material-group-body">
                        {group.items.map((item, idx) => (
                          <div key={item.uid} className="item-subrow">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ width: 24, height: 24, borderRadius: 4, background: T.creamDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: T.textDark }}>{idx + 1}</span>
                                {item.isWood && !item.isSheet && <span className="unit-badge wood-badge">Wood</span>}
                                {item.isSheet && <span className="unit-badge wood-badge">Sheet/Door</span>}
                                {!item.skuCode && item.product && <span className="unit-badge custom-badge">Custom</span>}
                                {item.isSheet && item.areaPerPiece && (
                                  <span style={{ fontSize: 10, color: T.textMuted, background: T.cream, padding: '2px 6px', borderRadius: 6 }}>
                                    {item.areaPerPiece.toFixed(2)} sqft/pc
                                  </span>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                {!item.skuCode && item.product && (
                                  <button className="btn-amber" onClick={() => handleAddToSheet(group, item)} disabled={addingToSheet[item.uid]}>
                                    {addingToSheet[item.uid] ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add to Sheet
                                  </button>
                                )}
                                <button className="icon-btn" onClick={() => removeItemFromGroup(group.groupId, item.uid)}><Trash2 size={14} /></button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                              <div style={{ gridColumn: 'span 2', minWidth: 200 }}>
                                <SearchableSelect
                                  options={gp.map(p => ({ value: p.skuCode, label: p.materialName }))}
                                  value={item.skuCode}
                                  displayValue={item.product || ''}
                                  onChange={val => {
                                    const matchedProduct = gp.find(p => p.skuCode === val);
                                    if (matchedProduct) {
                                      updateGroupItem(group.groupId, item.uid, 'skuCode', val);
                                    } else if (val) {
                                      updateGroupItem(group.groupId, item.uid, 'customProductName', val);
                                    } else {
                                      updateGroupItem(group.groupId, item.uid, 'skuCode', '');
                                    }
                                  }}
                                  placeholder="Search or type product name"
                                  allowCustom
                                  T={T}
                                />
                              </div>
                              <div>
                                {item.isSheet ? (
                                  <select className="kt-input" value={item.unit || 'SQFT'} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {SHEET_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                                  </select>
                                ) : item.isWood && !item.isSheet ? (
                                  <select className="kt-input" value={item.unit} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {WOOD_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                                  </select>
                                ) : item.skuCode ? (
                                  <select className="kt-input" value={item.unit || 'Pcs'} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {HARDWARE_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                                  </select>
                                ) : (
                                  <select className="kt-input" value={item.unit || 'Pcs'} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {CUSTOM_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                                  </select>
                                )}
                              </div>
                              {item.isWood && !item.isSheet && (
                                <div className="length-group">
                                  <input type="number" className="kt-input length-input" placeholder="Ft" value={item.lengthFeet} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthFeet', e.target.value)} />
                                  <span style={{ color: T.textMuted, fontSize: 12 }}>ft</span>
                                  <input type="number" className="kt-input length-input" placeholder="In" value={item.lengthInches} onChange={e => updateGroupItem(group.groupId, item.uid, 'lengthInches', e.target.value)} />
                                  <span style={{ color: T.textMuted, fontSize: 12 }}>in</span>
                                </div>
                              )}
                              <div>
                                <input type="number" className="kt-input"
                                  placeholder={item.isSheet && item.unit === 'SQFT' ? 'Pieces' : 'Qty'}
                                  value={item.quantity}
                                  onChange={e => updateGroupItem(group.groupId, item.uid, 'quantity', e.target.value)}
                                />
                              </div>
                              <div>
                                <input type="number" className="kt-input"
                                  placeholder={item.isSheet && item.unit === 'SQFT' ? 'Rate/SQFT' : 'Rate'}
                                  value={item.rate}
                                  onChange={e => updateGroupItem(group.groupId, item.uid, 'rate', e.target.value)}
                                />
                              </div>
                              <div>
                                <input className="kt-input" placeholder="Specification" value={item.specification || ''} onChange={e => updateGroupItem(group.groupId, item.uid, 'specification', e.target.value)} />
                              </div>
                            </div>
                            {item.product && !orderForm.hidePrice && (
                              <div className="calc-display">
                                {item.isSheet && item.unit === 'SQFT' ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      {item.quantity || 0} pcs × {item.areaPerPiece?.toFixed(2) || '?'} sqft = {item.calculatedQty.toFixed(2)} SQFT
                                    </span>
                                    {' • '}<span style={{ fontWeight: 'bold', color: T.maroon }}>₹{item.amount.toLocaleString()}</span>
                                  </>
                                ) : item.isWood && !item.isSheet ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>Total {item.unit}: {item.calculatedQty.toFixed(3)}</span>
                                    {' • '}<span style={{ fontWeight: 'bold', color: T.maroon }}>₹{item.amount.toLocaleString()}</span>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ fontWeight: 600 }}>Qty: {item.quantity || 0}</span>
                                    {' • '}<span style={{ fontWeight: 'bold', color: T.maroon }}>₹{item.amount.toLocaleString()}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="material-group-footer">
                        <button className="btn-white" style={{ fontSize: 13 }} onClick={() => addItemToGroup(group.groupId)}><Plus size={14} /> Add Item</button>
                        {!orderForm.hidePrice && <div style={{ fontWeight: 'bold', color: T.maroon, fontSize: 15 }}>₹{group.items.reduce((s, i) => s + i.amount, 0).toLocaleString()}</div>}
                      </div>
                    </div>
                  );
                })}
                <button className="btn-white" style={{ width: '100%', padding: 10, borderStyle: 'dashed', borderWidth: 2, marginTop: 8, justifyContent: 'center' }} onClick={addNewGroup}>
                  <Plus size={16} /> Add New Group
                </button>
              </div>

              {/* Charges */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.maroon, margin: 0 }}>Additional Charges</p>
                  <button className="btn-amber" style={{ padding: '6px 14px', fontSize: 13 }} onClick={addCharge}><Plus size={14} /> Add Charge</button>
                </div>
                {orderCharges.map((ch, idx) => {
                  const ct = CHARGE_TYPES.find(t => t.value === ch.chargeType);
                  return (
                    <div key={ch.uid} style={{ padding: 12, border: `1px solid ${T.borderSoft}`, borderRadius: 10, marginBottom: 8, background: T.accent }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, fontSize: 12, background: T.amberBg, color: T.amberColor, fontWeight: 600 }}>
                          {ct?.icon || '📋'} #{idx + 1} {ch.chargeName || 'New Charge'}
                        </span>
                        <button className="icon-btn" onClick={() => removeCharge(ch.uid)}><Trash2 size={14} /></button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                        <select className="kt-input" value={ch.chargeType} onChange={e => updateCharge(ch.uid, 'chargeType', e.target.value)}>
                          <option value="">Select type</option>
                          {CHARGE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                        </select>
                        <input className="kt-input" placeholder="Name" value={ch.chargeName} onChange={e => updateCharge(ch.uid, 'chargeName', e.target.value)} />
                        <select className="kt-input" value={ch.unit} onChange={e => updateCharge(ch.uid, 'unit', e.target.value)}>
                          {CHARGE_UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                        </select>
                        {ch.unit !== 'Lump Sum' && (
                          <input className="kt-input" type="number" placeholder="Qty" value={ch.quantity} onChange={e => updateCharge(ch.uid, 'quantity', e.target.value)} />
                        )}
                        <input className="kt-input" type="number" placeholder={ch.unit === 'Lump Sum' ? 'Amount' : 'Rate'} value={ch.rate} onChange={e => updateCharge(ch.uid, 'rate', e.target.value)} />
                      </div>
                      {ch.amount > 0 && <div style={{ textAlign: 'right', marginTop: 6, fontWeight: 600, color: T.maroon }}>₹{ch.amount.toLocaleString()}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              {!orderForm.hidePrice && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="total-box" style={{ width: 320 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark }}><span>Materials</span><span>₹{orderSubtotal.toLocaleString()}</span></div>
                    {chargesSubtotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark }}><span>Charges</span><span>₹{chargesSubtotal.toLocaleString()}</span></div>}
                    {orderForm.gstRate > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark }}><span>GST ({orderForm.gstRate}%)</span><span>₹{orderTax.toLocaleString()}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18, borderTop: `2px solid ${T.maroon}`, paddingTop: 8, marginTop: 8, color: T.maroon }}>
                      <span>Grand Total</span><span>₹{orderTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: 20, borderTop: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn-white" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}>Cancel</button>
              <button className="btn-maroon" disabled={saving} onClick={handleSubmitOrder}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : (isEditMode ? 'Update & Re-Generate' : 'Save & Generate Challan')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === PARTIAL CHALLAN MODAL === */}
      {showChallanForm && selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, overflow: 'auto', padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ background: T.modalBg, border: `1px solid ${T.borderSoft}`, borderRadius: 16, maxWidth: 900, width: '100%', margin: '32px 0', boxShadow: `0 8px 32px ${T.shadowStrong}` }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: 18, margin: 0, color: T.textDark }}>Additional Challan — {selectedOrder.orderNo}</h3>
              <button className="icon-btn" onClick={() => setShowChallanForm(false)}><X size={24} /></button>
            </div>
            <div style={{ padding: 20, maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <input type="date" className="kt-input" value={challanDate} onChange={e => setChallanDate(e.target.value)} />
                <input className="kt-input" placeholder="Note" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.textDark }}>
                  <input type="checkbox" checked={hidePriceOnChallan} onChange={e => setHidePriceOnChallan(e.target.checked)} /> Hide Price
                </label>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: T.cream }}>
                      <th style={{ padding: 8, textAlign: 'left', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Item</th>
                      <th style={{ padding: 8, textAlign: 'center', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Unit</th>
                      <th style={{ padding: 8, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Ordered</th>
                      <th style={{ padding: 8, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Sent</th>
                      <th style={{ padding: 8, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Left</th>
                      <th style={{ padding: 8, textAlign: 'center', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Sending</th>
                      <th style={{ padding: 8, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Total Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challanItems.map(it => {
                      const rem = it.orderedQty - it.alreadySent;
                      return (
                        <tr key={it.uid} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                          <td style={{ padding: 8, color: T.textDark }}>{it.product}</td>
                          <td style={{ padding: 8, textAlign: 'center', color: T.textMuted }}>{it.unit}</td>
                          <td style={{ padding: 8, textAlign: 'right', color: T.textDark }}>{it.orderedQty.toFixed(3)}</td>
                          <td style={{ padding: 8, textAlign: 'right', color: T.textMuted }}>{it.alreadySent.toFixed(3)}</td>
                          <td style={{ padding: 8, textAlign: 'right', color: rem > 0 ? T.maroon : T.successColor, fontWeight: 600 }}>{rem.toFixed(3)}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>
                            <input type="number" min="0" className="kt-input" style={{ width: 80, textAlign: 'center' }}
                              value={it.sendingPcs} disabled={rem <= 0}
                              onChange={e => updateChallanItem(it.uid, 'sendingPcs', e.target.value)} />
                          </td>
                          <td style={{ padding: 8, textAlign: 'right', fontWeight: 600, color: T.textDark }}>{it.sendingQty.toFixed(3)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ padding: 20, borderTop: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn-white" onClick={() => setShowChallanForm(false)}>Cancel</button>
              <button className="btn-maroon" onClick={handleSubmitChallan} disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Challan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === SUCCESS MODAL === */}
      {showChallanSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: T.modalBg, borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 420, width: '90%', boxShadow: `0 8px 40px ${T.shadowStrong}` }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16', background: T.successBg }}>
              <CheckCircle size={32} style={{ color: T.successColor }} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: T.textDark }}>Challan Generated!</h3>
            <p style={{ fontFamily: 'monospace', margin: '8px 0 20px', color: T.maroon, fontSize: 16, fontWeight: 600 }}>{lastChallanNo}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
              <button className="btn-teal" onClick={() => openPDFView(lastChallanHTML)}><Eye size={16} /> View</button>
              <button className="btn-maroon" onClick={() => openPDFPrint(lastChallanHTML)}><Printer size={16} /> Print</button>
              <button className="btn-blue" onClick={() => {
                const w = window.open('', '_blank');
                w.document.write(lastChallanHTML);
                w.document.close();
                setTimeout(() => {
                  const ab = w.document.querySelector('.action-bar');
                  if (ab) ab.style.display = 'none';
                  w.print();
                  setTimeout(() => { if (ab) ab.style.display = 'flex'; }, 1200);
                }, 600);
              }}><Download size={16} /> Save PDF</button>
            </div>
            <button className="btn-white" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowChallanSuccess(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}