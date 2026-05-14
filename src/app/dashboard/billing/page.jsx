
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Trash2, Printer, Search, CheckCircle,
  AlertTriangle, Loader2, Download, Eye,
  X, TruckIcon, EyeOff, ChevronDown, Edit2
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

function parseSheetDimensions(name) {
  if (!name) return null;
  let thickness = null;
  const mmMatch = name.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mmMatch) thickness = parseFloat(mmMatch[1]);
  let cleanName = name.replace(/\d+(?:\.\d+)?\s*mm/gi, '').trim();
  const match = cleanName.match(/(\d+(?:\.\d+)?)\s*['"]?\s*[x×X]\s*['"]?\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  let w = parseFloat(match[1]);
  let h = parseFloat(match[2]);
  if (isNaN(w) || isNaN(h) || w === 0 || h === 0) return null;
  let wFeet, hFeet;
  let isInches = false;
  if (w > 12 || h > 12) { isInches = true; wFeet = w / 12; hFeet = h / 12; }
  else { wFeet = w; hFeet = h; }
  const areaSqft = wFeet * hFeet;
  return {
    widthFeet: Math.round(wFeet * 10000) / 10000,
    heightFeet: Math.round(hFeet * 10000) / 10000,
    areaPerPiece: Math.round(areaSqft * 1000) / 1000,
    thickness, isInches, widthOrig: w, heightOrig: h
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
  if (item.isSheet && item.areaPerPiece && item.unit === 'SQFT') {
    const totalSqft = item.areaPerPiece * qty;
    return { calculatedQty: Math.round(totalSqft * 1000) / 1000, amount: Math.round(totalSqft * rate * 100) / 100 };
  }
  if (item.isSheet && (item.unit === 'Per Piece' || item.unit === 'Pcs')) {
    return { calculatedQty: qty, amount: Math.round(qty * rate * 100) / 100 };
  }
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

function SearchableSelect({ options, value, onChange, placeholder = 'Search...', disabled = false, allowCustom = false, T, displayValue = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const wrapRef = useRef(null);
  const isInternalChange = useRef(false);

  const getVal = o => (typeof o === 'string' ? o : o.value ?? o.label ?? o);
  const getDisp = o => (typeof o === 'string' ? o : o.label ?? o.value ?? o);

  useEffect(() => {
    if (isInternalChange.current) { isInternalChange.current = false; return; }
    if (displayValue !== undefined && displayValue !== null && displayValue !== '') { setInputValue(displayValue); return; }
    if (!value) { setInputValue(''); return; }
    const match = options.find(o => getVal(o) === value);
    if (match) { setInputValue(getDisp(match)); }
    else if (allowCustom) { setInputValue(value); }
    else { setInputValue(''); }
  }, [value, displayValue, options, allowCustom]);

  const commit = (val, disp) => {
    isInternalChange.current = true;
    setInputValue(disp);
    setIsOpen(false);
    onChange(val);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
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
          onChange={e => { setInputValue(e.target.value); if (!isOpen) setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => {
            if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) { setIsOpen(true); e.preventDefault(); }
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
          {filtered.length > 0 && filtered.map((o, idx) => (
            <div
              key={`ss-opt-${getVal(o)}-${idx}`}
              className={`ss-option ${getVal(o) === value ? 'selected' : ''}`}
              onClick={() => commit(getVal(o), getDisp(o))}
              style={{ color: T?.textDark }}
            >
              {getDisp(o)}
            </div>
          ))}
          {allowCustom && inputValue.trim() && !exactMatch && (
            <div
              key="ss-custom-entry"
              className="ss-option"
              onClick={() => commit(inputValue.trim(), inputValue.trim())}
              style={{ color: T?.maroon, fontWeight: 600, borderTop: `1px dashed ${T?.borderSoft}` }}
            >
              ✏️ Use: &quot;{inputValue.trim()}&quot;
            </div>
          )}
          {filtered.length === 0 && !(allowCustom && inputValue.trim()) && (
            <div key="ss-no-results" className="ss-no-results" style={{ padding: '10px', color: T?.textMuted, textAlign: 'center' }}>
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page-wrapper{width:210mm;min-height:297mm;margin:10px auto;...}
.page-content{padding:0;flex:1;display:flex;flex-direction:column;}
.action-bar{display:flex;gap:12px;justify-content:center;padding:14px 20px;background:linear-gradient(135deg,#FBF6F0,#F0E6DA);border-bottom:2px solid #E8DCC8;}
.action-btn{padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;letter-spacing:0.3px;}
.btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
.btn-print:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(123,30,30,0.4)}
.btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,0.3)}
.btn-save:hover{transform:translateY(-1px)}
.btn-close{background:#fff;color:#333;border:1px solid #ddd;box-shadow:0 1px 4px rgba(0,0,0,0.1)}
.ktp-header{background:linear-gradient(135deg,#5a1515,#7B1E1E,#9a2828);color:#fff;padding:16px 24px 14px;display:flex;align-items:center;gap:20px;}
.ktp-logo-circle{width:62px;height:62px;border-radius:50%;border:3px solid rgba(255,255,255,0.9);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.2);}
.ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:34px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;text-shadow:1px 1px 2px rgba(0,0,0,0.2)}
.ktp-brand-sub{font-size:16px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:3px;opacity:0.95;margin-top:2px}
.ktp-brand-addr{font-size:9.5px;margin-top:6px;opacity:0.85;letter-spacing:0.3px}
.ktp-header-right-space{width:62px;flex-shrink:0}
.ktp-meta{display:flex;justify-content:space-between;align-items:center;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:6px 16px;background:#FBF6F0;}
.ktp-meta-left{display:flex;flex-direction:column;gap:1px}
.ktp-since{font-size:9px;font-style:italic;color:#6b5454}
.ktp-gstin{font-size:10.5px;font-weight:bold;color:#7B1E1E;letter-spacing:0.5px}
.ktp-dc-box{text-align:right}
.ktp-dc-title{font-size:16px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:2px;border:2px solid #7B1E1E;padding:2px 14px;display:inline-block;border-radius:4px;}
.ktp-dc-details{font-size:10px;margin-top:3px;color:#333}
.ktp-info{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:10px 16px;background:#fff;}
.ktp-info-title{font-size:9px;font-weight:bold;text-transform:uppercase;color:#7B1E1E;letter-spacing:1.5px;margin-bottom:6px;border-bottom:1px solid #E8DCC8;padding-bottom:3px;}
.ktp-info-grid{display:flex;flex-wrap:wrap;gap:6px 20px}
.ktp-field{display:flex;align-items:baseline;gap:5px;margin-bottom:3px}
.ktp-field-label{font-size:9.5px;font-weight:700;white-space:nowrap;color:#333}
.ktp-field-value{font-size:10.5px;border-bottom:1px dotted #999;padding-bottom:1px;min-width:80px;color:#000;}
.ktp-field-value.wide{min-width:220px;flex:1}
.ktp-field-value.medium{min-width:140px}
.ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;flex:1;}
table.items{width:100%;border-collapse:collapse}
table.items thead tr{background:linear-gradient(135deg,#5a1515,#7B1E1E)}
table.items th{padding:7px 8px;font-size:9.5px;font-weight:bold;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:0.5px;}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #ddd}
table.items tbody tr:nth-child(even){background:#FAFAFA}
table.items tbody tr:nth-child(odd){background:#fff}
table.items td{padding:5px 8px;font-size:10.5px;border-right:1px solid #e0e0e0;vertical-align:top;}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
table.items td.c{text-align:center}
table.items .item-detail{font-size:8.5px;color:#777;margin-top:1px}
table.items .erow td{height:22px;border-right:1px solid #e0e0e0}
table.items .erow td:last-child{border-right:none}
.ktp-words{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-top:2px solid #7B1E1E;padding:6px 16px;background:#FDF8F2;}
.ktp-words-label{font-size:8px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:1px}
.ktp-words-text{font-size:10px;font-weight:600;color:#333;margin-top:1px}
.ktp-footer{border:2px solid #7B1E1E;border-top:none;display:flex;background:#fff;}
.ktp-footer-left{flex:1;padding:10px 16px;border-right:2px solid #7B1E1E;display:flex;flex-direction:column;justify-content:space-between;}
.ktp-footer-cert{font-size:9px;color:#555;line-height:1.6}
.ktp-footer-for{font-size:10px;font-weight:bold;color:#7B1E1E;margin-top:6px}
.ktp-footer-terms{font-size:8px;color:#777;margin-top:8px;line-height:1.5}
.ktp-footer-terms li{margin-bottom:2px}
.ktp-sig-area{display:flex;justify-content:space-between;align-items:flex-end;margin-top:12px;padding-top:6px;}
.ktp-sig-box{text-align:center}
.ktp-sig-line{width:140px;border-top:1px solid #000;margin-bottom:3px}
.ktp-sig-label{font-size:8px;color:#555}
.ktp-footer-right{width:230px;display:flex;flex-direction:column;}
.ktp-charge-section{border-bottom:1.5px solid #7B1E1E}
.ktp-charge-header{padding:5px 12px;font-size:8.5px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:0.5px;background:#FDF8F2;border-bottom:1px solid #E8DCC8;}
.ktp-charge-row{display:flex;justify-content:space-between;padding:4px 12px;font-size:9.5px;color:#333;border-bottom:1px solid #f0e6da;}
.ktp-charge-row:last-child{border-bottom:none}
.ktp-charge-name{max-width:140px;overflow:hidden;text-overflow:ellipsis}
.ktp-charge-amt{font-weight:600;font-variant-numeric:tabular-nums}
.ktp-total-row{display:flex;justify-content:space-between;padding:5px 12px;font-size:10px;border-bottom:1px solid #E8DCC8;color:#333;}
.ktp-total-row .ktp-total-label{font-weight:500}
.ktp-total-row .ktp-total-val{font-weight:600;font-variant-numeric:tabular-nums}
.ktp-total-row.grand{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;font-size:12px;font-weight:bold;border-bottom:none;padding:8px 12px;}
.ktp-total-row.grand .ktp-total-val{letter-spacing:0.5px}
.ktp-sig-right{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:8px 12px;}
.ktp-sig-right .ktp-sig-line{width:120px;border-top:1px solid #000;margin-bottom:3px}
.ktp-sig-right .ktp-sig-label{font-size:8px;color:#555}
.ktp-eoe{padding:3px 12px;font-size:7.5px;color:#999;text-align:right;border-top:1px solid #E8DCC8;letter-spacing:0.5px;}
.ktp-no-price-box{padding:20px 12px;text-align:center;color:#7B1E1E;font-weight:bold;font-size:11px;flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;}
@media print{
html{margin:0!important;padding:0!important}
body{margin:0!important;padding:0!important;background:#fff!important}
.action-bar{display:none!important}
.page-wrapper{width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;box-shadow:none!important}
.page-content{min-height:100%!important}
.ktp-header{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
table.items thead tr{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
table.items th{color:#fff!important}
.ktp-total-row.grand{background:#7B1E1E!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ktp-charge-header{background:#FDF8F2!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ktp-table-wrap{flex:1!important}
}
@page{size:A4;margin:0}
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
  const minRows = hidePrice ? 27 : 21;
  const emptyCount = Math.max(0, minRows - itemRows.length);
  const colCount = hidePrice ? 3 : 5;
  let emptyRows = '';
  for (let i = 0; i < emptyCount; i++) {
    let cells = '';
    for (let j = 0; j < colCount; j++) cells += '<td>&nbsp;</td>';
    emptyRows += `<tr class="erow">${cells}</tr>`;
  }
  let chargesHtml = '';
  if (chargesList.length > 0 && !hidePrice) {
    chargesHtml = `<div class="ktp-charge-section"><div class="ktp-charge-header">Additional Charges</div>${chargesList.map(ch => `<div class="ktp-charge-row"><span class="ktp-charge-name">${ch.name}</span><span class="ktp-charge-amt">₹${ch.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>`).join('')}</div>`;
  }
  let footerRightContent = '';
  if (!hidePrice) {
    footerRightContent = `${chargesHtml}<div class="ktp-total-row"><span class="ktp-total-label">Items Total</span><span class="ktp-total-val">₹${itemsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>${chargesTotal > 0 ? `<div class="ktp-total-row"><span class="ktp-total-label">Charges Total</span><span class="ktp-total-val">₹${chargesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>` : ''}<div class="ktp-total-row grand"><span class="ktp-total-label">Grand Total</span><span class="ktp-total-val">₹${challanTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div><div class="ktp-sig-right"><div class="ktp-sig-line"></div><div class="ktp-sig-label">Authorised Signatory</div></div><div class="ktp-eoe">E. &amp; O.E.</div>`;
  } else {
    footerRightContent = `<div class="ktp-no-price-box"><div style="font-size:22px;">📋</div><div>DELIVERY CHALLAN</div><div style="font-size:9px;font-weight:normal;color:#999;">For Goods Reference Only</div></div><div class="ktp-sig-right"><div class="ktp-sig-line"></div><div class="ktp-sig-label">Authorised Signatory</div></div><div class="ktp-eoe">E. &amp; O.E.</div>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}</style></head><body><div class="action-bar"><button class="action-btn btn-print" onclick="window.print()">🖨️ Print Challan</button><button class="action-btn btn-save" onclick="savePDF()">💾 Save as PDF</button><button class="action-btn btn-close" onclick="window.close()">✕ Close</button></div><div class="page-wrapper"><div class="page-content"><div class="ktp-header"><div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div><div class="ktp-header-center"><div class="ktp-brand-name">Krishna</div><div class="ktp-brand-sub">Timber &amp; Plywoods</div><div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div></div><div class="ktp-header-right-space"></div></div><div class="ktp-meta"><div class="ktp-meta-left"><div class="ktp-since">Chhabra's Since 1979</div><div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div></div><div class="ktp-dc-box"><div class="ktp-dc-title">Delivery Challan</div><div class="ktp-dc-details">No.: <strong>${challan.challanNo}</strong> &nbsp;&nbsp;&nbsp; Date: <strong>${new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div></div></div><div class="ktp-info"><div class="ktp-info-title">Consignee Details (Receiver)</div><div class="ktp-info-grid"><div class="ktp-field"><span class="ktp-field-label">Name:</span><span class="ktp-field-value wide">${order.customerName}</span></div><div class="ktp-field"><span class="ktp-field-label">Vehicle No.:</span><span class="ktp-field-value medium">${order.vehicleNo || '_______________'}</span></div><div class="ktp-field"><span class="ktp-field-label">Address:</span><span class="ktp-field-value wide">${order.customerAddress || '_______________'}</span></div>${order.customerPhone ? `<div class="ktp-field"><span class="ktp-field-label">Phone:</span><span class="ktp-field-value medium">${order.customerPhone}</span></div>` : ''}${poLine}${gstLine}<div class="ktp-field"><span class="ktp-field-label">Ref Order:</span><span class="ktp-field-value medium">${order.orderNo || ''}</span></div>${challan.deliveryNote ? `<div class="ktp-field"><span class="ktp-field-label">Note:</span><span class="ktp-field-value medium">${challan.deliveryNote}</span></div>` : ''}</div></div><div class="ktp-table-wrap"><table class="items"><thead><tr><th style="width:35px">S.No.</th><th class="tl">Description of Goods</th>${!hidePrice ? `<th style="width:95px">Quantity</th><th style="width:80px">Rate</th><th style="width:95px">Amount</th>` : `<th style="width:100px">Quantity</th>`}</tr></thead><tbody>${itemRows.join('')}${emptyRows}</tbody></table></div>${!hidePrice ? `<div class="ktp-words"><div class="ktp-words-label">Amount in Words</div><div class="ktp-words-text">${numberToWords(challanTotal)}</div></div>` : ''}<div class="ktp-footer"><div class="ktp-footer-left"><div><div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div><div class="ktp-footer-for">For : Krishna Timber &amp; Plywoods</div><div class="ktp-footer-terms"><ul style="padding-left:12px;"><li>Goods once sold will not be taken back or exchanged.</li><li>All disputes are subject to Bhopal jurisdiction only.</li><li>Interest @2% per month will be charged on overdue payments.</li></ul></div></div><div class="ktp-sig-area"><div class="ktp-sig-box"><div class="ktp-sig-line"></div><div class="ktp-sig-label">Customer Signature</div><div style="font-size:7px;color:#999;margin-top:2px;">Received goods in good condition</div></div></div></div><div class="ktp-footer-right">${footerRightContent}</div></div></div></div><script>function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}</script></body></html>`;
}

const apiGet = async url => { 
 
  try { 
    const r = await fetch(url); 
    if (!r.ok) return { success: false, data: [] }; 
    return r.json(); 
  } catch { 
    return { success: false, data: [] }; 
  } 
};

const apiPost = async (url, body) => { 
  
  try { 
    const r = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    }); 
    const response = await r.json();
   
    return response;
  } catch (e) { 
    console.error('❌ API Error:', e);
    return { success: false, error: e.message }; 
  } 
};

const apiPatch = async (url, body) => { 

  try { 
    const r = await fetch(url, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    }); 
    const response = await r.json();
   
    return response;
  } catch (e) { 
    console.error('❌ API Error:', e);
    return { success: false, error: e.message }; 
  } 
};

const apiDelete = async (url, body) => { 
  
  try { 
    const r = await fetch(url, { 
      method: 'DELETE', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    }); 
    return r.json(); 
  } catch (e) { 
    return { success: false, error: e.message }; 
  } 
};

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

  // Debug: Log orderForm changes
  useEffect(() => {
  
  }, [orderForm]);

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
  const isSheetMaterialFn = name => /mdf|hdhdr|hdmr|door|wpc|ply|block|flush|laminate|board/i.test(name);
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
              const isSheet = isSheetMaterialFn(found.materialName);
              const isWood = isWoodMaterial(found) && !isSheet;
              u = { ...u, product: found.materialName, skuCode: found.skuCode, materialType: found.materialType, category: found.category, subCategory: found.subCategory, isWood, isSheet };
              if (isSheet) {
                u.unit = 'SQFT';
                const dims = parseSheetDimensions(found.materialName);
                if (dims) { u.areaPerPiece = dims.areaPerPiece; u.width = dims.widthFeet; u.thickness = dims.thickness; u.size = dims.isInches ? `${dims.widthOrig}"×${dims.heightOrig}"` : `${dims.widthFeet}'×${dims.heightFeet}'`; }
                u.lengthFeet = ''; u.lengthInches = '';
              } else if (isWood) {
                u.unit = isRailingMaterial(found.materialName) ? 'RFT' : 'CFT';
                const dims = parseWoodDimensions(found.materialName);
                if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
              } else {
                u.unit = found.unit || 'Pcs';
                u.width = 0; u.thickness = 0; u.size = ''; u.areaPerPiece = null;
              }
            } else if (!val) { u.product = ''; u.skuCode = ''; }
          }
          if (field === 'customProductName' && val?.trim()) {
            const isSheet = isSheetMaterialFn(val);
            const isWood = isWoodMaterial({ product: val }) && !isSheet;
            u.product = val; u.skuCode = '';
            u.materialType = g.filterMaterialType || 'Custom';
            u.category = g.filterCategory || 'Custom';
            u.subCategory = g.filterSubCategory || '';
            u.isWood = isWood; u.isSheet = isSheet;
            if (isSheet) {
              u.unit = 'SQFT';
              const dims = parseSheetDimensions(val);
              if (dims) { u.areaPerPiece = dims.areaPerPiece; u.width = dims.widthFeet; u.thickness = dims.thickness; u.size = dims.isInches ? `${dims.widthOrig}"×${dims.heightOrig}"` : `${dims.widthFeet}'×${dims.heightFeet}'`; }
            } else if (isWood) {
              u.unit = isRailingMaterial(val) ? 'RFT' : 'CFT';
              const dims = parseWoodDimensions(val);
              if (dims) { u.width = dims.width; u.thickness = dims.thickness; u.size = `${dims.width}×${dims.thickness}"`; }
            } else { if (!u.unit) u.unit = 'Pcs'; }
          }
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

  const openEditOrder = (order) => {
    setIsEditMode(true);
    setEditingOrder(order);
    setOrderForm({
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      customerAddress: order.customerAddress || '',
      vehicleNo: order.vehicleNo || '',
      orderDate: order.orderDate || new Date().toISOString().split('T')[0],
      gstRate: order.gstRate || 0,
      notes: order.notes || '',
      poNumber: order.poNumber || '',
      gstCustomerName: order.gstCustomerName || '',
      hidePrice: order.hidePrice || false,
    });
    const savedItems = order.items || [];
    const regularItems = savedItems.filter(i => !i.isCharge);
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
        groupId: uid(),
        filterMaterialType: mt === 'Other' ? '' : mt,
        filterCategory: items[0]?.category || '',
        filterSubCategory: items[0]?.subCategory || '',
        items,
      })));
    }
    const savedCharges = order.charges || [];
    setOrderCharges(savedCharges.map(ch => ({
      uid: ch.uid || uid(),
      chargeType: ch.chargeType || 'custom',
      chargeName: ch.chargeName || '',
      chargeDescription: ch.chargeDescription || '',
      unit: ch.unit || 'Per Piece',
      quantity: ch.quantity || '',
      rate: ch.rate || '',
      amount: ch.amount || 0
    })));
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
      setError('Customer name aur items required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const validItems = getAllOrderItems()
        .filter(i => i.product && (i.quantity || i.calculatedQty))
        .map(it => ({
          ...it,
          lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : '',
          isCharge: false,
          specification: it.specification || ''
        }));

      const validCharges = orderCharges
        .filter(c => c.chargeName && c.amount > 0)
        .map(ch => ({
          uid: ch.uid,
          chargeName: ch.chargeName,
          chargeType: ch.chargeType || 'custom',
          unit: ch.unit || 'Per Piece',
          quantity: ch.quantity || '',
          rate: ch.rate || '',
          amount: ch.amount || 0,
          chargeIcon: CHARGE_TYPES.find(t => t.value === ch.chargeType)?.icon || '📋'
        }));

      let orderNo, existingChallans = [];
      if (isEditMode && editingOrder) {
        orderNo = editingOrder.orderNo;
        existingChallans = getExistingChallanForOrder(orderNo);
        

        
        const r = await apiPatch('/api/billing-backend/orders', {
          orderNo,
          order: {
            ...orderForm, orderNo,
            subtotal: orderSubtotal,
            chargesTotal: chargesSubtotal,
            tax: orderTax,
            total: orderTotal,
            status: editingOrder.status,
            includeGST: orderForm.gstRate > 0,
            hidePrice: orderForm.hidePrice,
            vehicleNo: orderForm.vehicleNo
          },
          items: validItems,
          charges: validCharges
        });
        if (!r.success) throw new Error(r.error);
        for (const old of existingChallans) {
          await apiDelete('/api/billing-backend/challans', { challanNo: old.challanNo });
        }
      } else {
        orderNo = genOrderNo();
        
        
        
        const r = await apiPost('/api/billing-backend/orders', {
          order: {
            ...orderForm, orderNo,
            subtotal: orderSubtotal,
            chargesTotal: chargesSubtotal,
            tax: orderTax,
            total: orderTotal,
            status: 'Active',
            includeGST: orderForm.gstRate > 0,
            hidePrice: orderForm.hidePrice,
            vehicleNo: orderForm.vehicleNo
          },
          items: validItems,
          charges: validCharges
        });
        if (!r.success) throw new Error(r.error);
      }

      const challanNo = (isEditMode && existingChallans.length) ? existingChallans[0].challanNo : genChallanNo();
      const hidePrice = orderForm.hidePrice;
      const challanTotal = hidePrice ? 0 : (orderSubtotal + chargesSubtotal);
      
      // FIXED: Create challanPayloadItems properly
      const challanPayloadItems = validItems.map(it => ({
        product: it.product, 
        unit: it.unit,
        orderedQty: it.calculatedQty || parseFloat(it.quantity || 0),
        pieces: parseFloat(it.quantity || 0),
        sentQty: parseFloat(it.quantity || 0),
        calculatedQty: it.calculatedQty || parseFloat(it.quantity || 0),
        rate: parseFloat(it.rate || 0), 
        amount: it.amount || 0,
        size: it.size || '', 
        lengthDisplay: it.lengthDisplay || '',
        specification: it.specification || '', 
        isCharge: false,
        areaPerPiece: it.areaPerPiece, 
        isSheet: it.isSheet, 
        quantity: it.quantity,
      }));
      
      // FIXED: Complete challan payload structure
      const challanPayload = {
        challan: {
          challanNo, 
          orderNo,
          customerName: orderForm.customerName,
          challanDate: orderForm.orderDate,
          deliveryNote: orderForm.notes || '',
          challanTotal, 
          status: 'Delivered',
          hidePrice
        },
        items: challanPayloadItems,
        charges: validCharges.map(ch => ({
          name: ch.chargeName,
          type: ch.chargeType,
          unit: ch.unit,
          quantity: ch.quantity,
          rate: ch.rate,
          amount: ch.amount
        }))
      };
      

      
      // Send challan to API
      const challanResponse = await apiPost('/api/billing-backend/challans', challanPayload);
      if (!challanResponse.success) {
        throw new Error(challanResponse.error || 'Failed to create challan');
      }

      const chargesForPrint = validCharges.map(ch => ({ name: ch.chargeName, amount: ch.amount }));
      const html = getChallanPrintHTML(
        { ...orderForm, orderNo, vehicleNo: orderForm.vehicleNo },
        { ...challanPayload.challan, items: challanPayload.items },
        hidePrice,
        chargesForPrint
      );
      setLastChallanHTML(html);
      setLastChallanNo(challanNo);
      
      // Update order status to Completed
      await apiPatch('/api/billing-backend/orders', { orderNo, status: 'Completed' });
      await fetchData();
      setShowOrderForm(false);
      resetOrderForm();
      setShowChallanSuccess(true);
    } catch (err) {
      console.error('❌ Error in handleSubmitOrder:', err);
      setError('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
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
        else if (it.isWood) u.sendingQty = calculateByUnit({ ...u, quantity: pcs, isWood: true, width: it.width, thickness: it.thickness, unit: it.unit, lengthFeet: it.lengthFeet, lengthInches: it.lengthInches }).calculatedQty;
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
        challan: { challanNo, orderNo: selectedOrder.orderNo, customerName: selectedOrder.customerName, challanDate, deliveryNote, challanTotal, status: 'Delivered', hidePrice: hidePriceOnChallan },
        items: valid.map(it => ({
          product: it.product, unit: it.unit, orderedQty: it.orderedQty,
          pieces: parseFloat(it.sendingPcs), sentQty: parseFloat(it.sendingPcs),
          calculatedQty: it.sendingQty, rate: it.rate, amount: it.sendingQty * it.rate,
          size: it.size, lengthDisplay: it.lengthDisplay, isCharge: false,
          areaPerPiece: it.areaPerPiece, isSheet: it.isSheet, quantity: it.sendingPcs
        })),
        charges: []
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
      <style>{`
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
        .material-group-header{background:${darkMode ? T.accent : `linear-gradient(135deg, ${LIGHT.cream}, ${LIGHT.creamDark})`};padding:14px 18px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;border-radius:14px 14px 0 0}
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
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: T.maroon, margin: 0 }}>Order &amp; Challan</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`kt-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`kt-tab ${activeTab === 'challans' ? 'active' : ''}`}
            onClick={() => setActiveTab('challans')}
          >
            Challans
          </button>
          <button className="btn-maroon" onClick={() => { resetOrderForm(); setShowOrderForm(true); }}>
            <Plus size={16} /> New Order
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
              <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search order..." value={searchQuery} onChange={e => setSearchQuery(e.target.value.toLowerCase())} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Active', 'Completed'].map(s => (
                <button key={`filter-${s}`} className={`kt-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>
          </div>
          {filteredOrders.map(order => {
            const progress = getDeliveryProgress(order);
            const st = STATUS[order.status] || STATUS.Active;
            const challanCount = getOrderChallans(order.orderNo).length;
            return (
              <div key={`order-${order.orderNo}`} className="kt-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: T.maroon }}>{order.orderNo}</span>
                      <span className="status-pill" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                        <span className="status-dot" style={{ background: st.dot }} />{order.status}
                      </span>
                      {order.hidePrice && (
                        <span className="status-pill" style={{ background: T.cream, color: T.maroon, borderColor: T.borderSoft }}>
                          <EyeOff size={12} /> Hidden
                        </span>
                      )}
                      {order.gstRate > 0 && (
                        <span className="status-pill" style={{ background: T.infoBg, color: T.infoColor, borderColor: T.infoBorder }}>
                          GST {order.gstRate}%
                        </span>
                      )}
                    </div>
                    <p style={{ fontWeight: 'bold', fontSize: 18, margin: '4px 0', color: T.textDark }}>{order.customerName}</p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                      {order.customerPhone && `${order.customerPhone} • `}
                      {order.vehicleNo && `🚛 ${order.vehicleNo} • `}
                      {new Date(order.orderDate).toLocaleDateString()} • {(order.items || []).filter(i => !i.isCharge).length} items
                      {(order.charges || []).length > 0 && ` • ${(order.charges || []).length} charges`}
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
                      <button className="btn-blue" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEditOrder(order)}>
                        <Edit2 size={12} /> Edit
                      </button>
                      <button className="btn-white" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openChallanForm(order)}>
                        <TruckIcon size={12} /> Partial
                      </button>
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

      {activeTab === 'challans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input className="kt-input" style={{ paddingLeft: 36 }} placeholder="Search challan..." value={challanSearchQuery} onChange={e => setChallanSearchQuery(e.target.value.toLowerCase())} />
          </div>
          {filteredChallans.map(ch => {
            const order = orders.find(o => o.orderNo === ch.orderNo);
            const savedChallanCharges = (ch.charges || []).map(c => ({
              name: c.name || c.chargeName || '',
              amount: parseFloat(c.amount || 0)
            }));
            const regularItemsCount = (ch.items || []).filter(i => !i.isCharge).length;
            const chargesCount = savedChallanCharges.length;
            return (
              <div key={`challan-${ch.challanNo}`} className="kt-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: T.maroon }}>{ch.challanNo}</span>
                      <span style={{ fontSize: 12, color: T.textMuted }}>→ {ch.orderNo}</span>
                      <span className="status-pill" style={{ background: T.successBg, color: T.successColor }}>
                        <span className="status-dot" style={{ background: '#22c55e' }} />Delivered
                      </span>
                      {ch.hidePrice && (
                        <span className="status-pill" style={{ background: T.cream, color: T.maroon }}>
                          <EyeOff size={12} /> Hidden
                        </span>
                      )}
                    </div>
                    <p style={{ fontWeight: 600, margin: '4px 0', color: T.textDark }}>{ch.customerName}</p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                      {new Date(ch.challanDate).toLocaleDateString()} • {regularItemsCount} items
                      {chargesCount > 0 && ` • ${chargesCount} charge(s)`}
                      {!ch.hidePrice && <span style={{ fontWeight: 600 }}> ₹{parseFloat(ch.challanTotal || 0).toLocaleString()}</span>}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-white" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => {
                      if (order) openPDFView(getChallanPrintHTML(order, ch, ch.hidePrice, savedChallanCharges));
                    }}>
                      <Eye size={12} /> View
                    </button>
                    <button className="btn-maroon" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => {
                      if (order) openPDFPrint(getChallanPrintHTML(order, ch, ch.hidePrice, savedChallanCharges));
                    }}>
                      <Printer size={12} /> Print
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredChallans.length === 0 && (
            <div className="kt-card" style={{ padding: 56, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: T.textMuted }}>No challans found</p>
            </div>
          )}
        </div>
      )}

      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, overflow: 'auto', padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ background: T.modalBg, border: `1px solid ${T.borderSoft}`, borderRadius: 16, maxWidth: 1024, width: '100%', margin: '32px 0', boxShadow: `0 8px 32px ${T.shadowStrong}` }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: 20, margin: 0, color: T.textDark }}>
                {isEditMode ? `Edit — ${editingOrder?.orderNo}` : 'New Order + Challan'}
              </h3>
              <button className="icon-btn" onClick={() => { setShowOrderForm(false); resetOrderForm(); }}><X size={24} /></button>
            </div>
            <div style={{ padding: 20, maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.maroon, marginBottom: 8 }}>Customer Details</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <input className="kt-input" placeholder="Customer Name *" value={orderForm.customerName} onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
                  <input className="kt-input" placeholder="Phone" value={orderForm.customerPhone} onChange={e => setOrderForm({ ...orderForm, customerPhone: e.target.value })} />
                  <input 
                    className="kt-input" 
                    placeholder="Vehicle No." 
                    value={orderForm.vehicleNo} 
                    onChange={e => {
                      
                      setOrderForm({ ...orderForm, vehicleNo: e.target.value });
                    }} 
                  />
                  <input type="date" className="kt-input" value={orderForm.orderDate} onChange={e => setOrderForm({ ...orderForm, orderDate: e.target.value })} />
                  <select className="kt-input" value={orderForm.gstRate} onChange={e => setOrderForm({ ...orderForm, gstRate: parseFloat(e.target.value) })}>
                    {GST_OPTIONS.map(o => <option key={`gst-opt-${o.value}`} value={o.value}>{o.label}</option>)}
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

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.maroon, marginBottom: 8 }}>Items</p>
                {orderGroups.map((group, gIdx) => {
                  const gp = getFilteredProductsForGroup(group);
                  const gc = getCategoriesFor(group.filterMaterialType);
                  const gsc = getSubCategoriesFor(group.filterMaterialType, group.filterCategory);
                  return (
                    <div key={`group-${group.groupId}`} className="material-group">
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
                          <SearchableSelect options={gsc} value={group.filterSubCategory} onChange={v => updateGroupFilter(group.groupId, 'filterSubCategory', v)} placeholder="Sub Category" allowCustom T={T} />
                        </div>
                      </div>
                      <div className="material-group-body">
                        {group.items.map((item, idx) => (
                          <div key={`item-${item.uid}`} className="item-subrow">
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
                                    if (matchedProduct) updateGroupItem(group.groupId, item.uid, 'skuCode', val);
                                    else if (val) updateGroupItem(group.groupId, item.uid, 'customProductName', val);
                                    else updateGroupItem(group.groupId, item.uid, 'skuCode', '');
                                  }}
                                  placeholder="Search or type product name"
                                  allowCustom
                                  T={T}
                                />
                              </div>
                              <div>
                                {item.isSheet ? (
                                  <select className="kt-input" value={item.unit || 'SQFT'} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {SHEET_UNIT_OPTIONS.map(u => <option key={`sheet-u-${u}`} value={u}>{u}</option>)}
                                  </select>
                                ) : item.isWood && !item.isSheet ? (
                                  <select className="kt-input" value={item.unit} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {WOOD_UNIT_OPTIONS.map(u => <option key={`wood-u-${u}`} value={u}>{u}</option>)}
                                  </select>
                                ) : item.skuCode ? (
                                  <select className="kt-input" value={item.unit || 'Pcs'} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {HARDWARE_UNIT_OPTIONS.map(u => <option key={`hw-u-${u}`} value={u}>{u}</option>)}
                                  </select>
                                ) : (
                                  <select className="kt-input" value={item.unit || 'Pcs'} onChange={e => updateGroupItem(group.groupId, item.uid, 'unit', e.target.value)}>
                                    {CUSTOM_UNIT_OPTIONS.map(u => <option key={`cu-u-${u}`} value={u}>{u}</option>)}
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
                                    <span style={{ fontWeight: 600 }}>{item.quantity || 0} pcs × {item.areaPerPiece?.toFixed(2) || '?'} sqft = {item.calculatedQty.toFixed(2)} SQFT</span>
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
                        <button className="btn-white" style={{ fontSize: 13 }} onClick={() => addItemToGroup(group.groupId)}>
                          <Plus size={14} /> Add Item
                        </button>
                        {!orderForm.hidePrice && (
                          <div style={{ fontWeight: 'bold', color: T.maroon, fontSize: 15 }}>
                            ₹{group.items.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button className="btn-white" style={{ width: '100%', padding: 10, borderStyle: 'dashed', borderWidth: 2, marginTop: 8, justifyContent: 'center' }} onClick={addNewGroup}>
                  <Plus size={16} /> Add New Group
                </button>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: T.maroon, margin: 0 }}>Additional Charges</p>
                  <button className="btn-amber" style={{ padding: '6px 14px', fontSize: 13 }} onClick={addCharge}><Plus size={14} /> Add Charge</button>
                </div>
                {orderCharges.map((ch, idx) => {
                  const ct = CHARGE_TYPES.find(t => t.value === ch.chargeType);
                  return (
                    <div key={`charge-${ch.uid}`} style={{ padding: 12, border: `1px solid ${T.borderSoft}`, borderRadius: 10, marginBottom: 8, background: T.accent }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, fontSize: 12, background: T.amberBg, color: T.amberColor, fontWeight: 600 }}>
                          {ct?.icon || '📋'} #{idx + 1} {ch.chargeName || 'New Charge'}
                        </span>
                        <button className="icon-btn" onClick={() => removeCharge(ch.uid)}><Trash2 size={14} /></button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                        <select className="kt-input" value={ch.chargeType} onChange={e => updateCharge(ch.uid, 'chargeType', e.target.value)}>
                          <option value="">Select type</option>
                          {CHARGE_TYPES.map(t => <option key={`chtype-${t.value}`} value={t.value}>{t.icon} {t.label}</option>)}
                        </select>
                        <input className="kt-input" placeholder="Charge Name *" value={ch.chargeName} onChange={e => updateCharge(ch.uid, 'chargeName', e.target.value)} />
                        <select className="kt-input" value={ch.unit} onChange={e => updateCharge(ch.uid, 'unit', e.target.value)}>
                          {CHARGE_UNIT_OPTIONS.map(u => <option key={`chunit-${u}`} value={u}>{u}</option>)}
                        </select>
                        {ch.unit !== 'Lump Sum' && (
                          <input className="kt-input" type="number" placeholder="Quantity" value={ch.quantity} onChange={e => updateCharge(ch.uid, 'quantity', e.target.value)} />
                        )}
                        <input className="kt-input" type="number" placeholder={ch.unit === 'Lump Sum' ? 'Amount' : 'Rate'} value={ch.rate} onChange={e => updateCharge(ch.uid, 'rate', e.target.value)} />
                      </div>
                      {ch.amount > 0 && (
                        <div style={{ textAlign: 'right', marginTop: 6, fontWeight: 600, color: T.maroon }}>
                          Amount: ₹{ch.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!orderForm.hidePrice && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="total-box" style={{ width: 320 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark }}>
                      <span>Materials</span><span>₹{orderSubtotal.toLocaleString()}</span>
                    </div>
                    {chargesSubtotal > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark }}>
                        <span>Charges</span><span>₹{chargesSubtotal.toLocaleString()}</span>
                      </div>
                    )}
                    {orderForm.gstRate > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark }}>
                        <span>GST ({orderForm.gstRate}%)</span><span>₹{orderTax.toLocaleString()}</span>
                      </div>
                    )}
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
                        <tr key={`challan-item-${it.uid}`} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
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

      {showChallanSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: T.modalBg, borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 420, width: '90%', boxShadow: `0 8px 40px ${T.shadowStrong}` }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: T.successBg }}>
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