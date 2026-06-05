'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Loader2, X, Eye, Printer, Download,
  CheckCircle, AlertTriangle, ChevronDown, Package,
  RotateCcw, Trash2
} from 'lucide-react';

// ════════════════════════════════════════
// SHOP INFO & CONSTANTS
// ════════════════════════════════════════

const SHOP_INFO = {
  name: 'Krishna Timber & Plywoods',
  address: 'Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)',
  phone: '9826700196',
  phone2: '9826275577',
  gstin: '23ADCPC2098K1ZQ',
};

const RETURN_REASONS = [
  { value: 'damaged', label: 'Damaged / Defective', icon: '💔' },
  { value: 'extra', label: 'Extra Material', icon: '📦' },
  { value: 'wrong', label: 'Wrong Item Sent', icon: '❌' },
  { value: 'size_mismatch', label: 'Size Mismatch', icon: '📐' },
  { value: 'quality', label: 'Quality Issue', icon: '⚠️' },
  { value: 'order_cancelled', label: 'Order Cancelled', icon: '🚫' },
  { value: 'other', label: 'Other Reason', icon: '📋' },
];

const LIGHT = {
  maroon: '#7B1E1E', maroonDark: '#5a1515', maroonLight: '#9a2828',
  cream: '#FBF6F0', creamLight: '#FFFBF5', creamDark: '#F0E6DA',
  accent: '#FDF8F2', textDark: '#2a1010', textMuted: '#6b5454',
  borderSoft: '#E8DCC8', cardBg: '#ffffff', pageBg: '#FBF6F0',
  inputBg: '#ffffff', hoverBg: '#F0E6DA', modalBg: '#ffffff',
  overlayBg: 'rgba(42,16,16,0.5)', shadow: 'rgba(123,30,30,0.05)',
  shadowStrong: 'rgba(123,30,30,0.18)', tableEven: '#FDF8F2',
  successBg: '#dcfce7', successColor: '#166534', successBorder: '#bbf7d0',
  infoBg: '#dbeafe', infoColor: '#1e40af', infoBorder: '#bfdbfe',
  errorBg: '#fef2f2', errorBorder: '#fecaca', errorColor: '#dc2626',
  purpleBg: '#f3e8ff', purpleColor: '#6b21a8', purpleBorder: '#e9d5ff',
  amberBg: '#fef3c7', amberColor: '#92400e', amberBorder: '#fde68a',
};

const DARK = {
  maroon: '#e8a0a0', maroonDark: '#c47070', maroonLight: '#f0b8b8',
  cream: '#1a1a2e', creamLight: '#222240', creamDark: '#2a2a45',
  accent: '#1e1e35', textDark: '#f0e8e8', textMuted: '#a89999',
  borderSoft: '#3a3a55', cardBg: '#1e1e35', pageBg: '#0f0f1e',
  inputBg: '#222240', hoverBg: '#2a2a45', modalBg: '#1e1e35',
  overlayBg: 'rgba(0,0,0,0.65)', shadow: 'rgba(0,0,0,0.3)',
  shadowStrong: 'rgba(0,0,0,0.5)', tableEven: '#1a1a2e',
  successBg: '#052e16', successColor: '#4ade80', successBorder: '#166534',
  infoBg: '#172554', infoColor: '#93c5fd', infoBorder: '#1e40af',
  errorBg: '#450a0a', errorBorder: '#7f1d1d', errorColor: '#fca5a5',
  purpleBg: '#2e1065', purpleColor: '#c4b5fd', purpleBorder: '#6b21a8',
  amberBg: '#451a03', amberColor: '#fbbf24', amberBorder: '#92400e',
};

function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

const apiGet = async url => {
  try { const r = await fetch(url); if (!r.ok) return { success: false, data: [] }; return r.json(); }
  catch { return { success: false, data: [] }; }
};

const apiPost = async (url, body) => {
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return await r.json();
  } catch (e) { return { success: false, error: e.message }; }
};

const apiDelete = async (url, body) => {
  try {
    const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json();
  } catch (e) { return { success: false, error: e.message }; }
};

// ════════════════════════════════════════
// GOODS RETURN PRINT HTML
// ════════════════════════════════════════

// const PRINT_CSS = `
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// .page-wrapper{width:210mm;min-height:297mm;margin:10px auto;background:#fff;box-shadow:0 0 10px rgba(0,0,0,0.1);display:flex;flex-direction:column;}
// .page-content{padding:0;flex:1;display:flex;flex-direction:column;}
// .action-bar{display:flex;gap:12px;justify-content:center;padding:14px 20px;background:linear-gradient(135deg,#FBF6F0,#F0E6DA);border-bottom:2px solid #E8DCC8;}
// .action-btn{padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;letter-spacing:0.3px;}
// .btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
// .btn-print:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(123,30,30,0.4)}
// .btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,0.3)}
// .btn-save:hover{transform:translateY(-1px)}
// .btn-close{background:#fff;color:#333;border:1px solid #ddd;box-shadow:0 1px 4px rgba(0,0,0,0.1)}
// .ktp-header{background:linear-gradient(135deg,#5a1515,#7B1E1E,#9a2828);color:#fff;padding:22px 30px 20px;display:flex;align-items:center;gap:24px;}
// .ktp-logo-circle{width:100px;height:100px;border-radius:50%;border:4px solid rgba(255,255,255,0.95);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 3px 12px rgba(0,0,0,0.3);}
// .ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
// .ktp-header-center{flex:1;text-align:center}
// .ktp-brand-name{font-size:54px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;text-shadow:2px 2px 3px rgba(0,0,0,0.25);letter-spacing:1px}
// .ktp-brand-sub{font-size:26px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:4px;opacity:0.98;margin-top:4px}
// .ktp-brand-addr{font-size:12.5px;margin-top:8px;opacity:1;letter-spacing:0.2px;font-weight:600;white-space:nowrap;}
// .ktp-header-right-space{width:100px;flex-shrink:0}
// .ktp-meta{display:flex;justify-content:space-between;align-items:flex-start;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:7px 18px;background:#FBF6F0;}
// .ktp-meta-left{display:flex;flex-direction:column;gap:2px}
// .ktp-since{font-size:11.5px;font-style:italic;color:#5a4040;font-weight:500}
// .ktp-gstin{font-size:13.5px;font-weight:bold;color:#7B1E1E;letter-spacing:0.5px}
// .ktp-dc-box{text-align:right}
// /* ✅ AB - Border hataya */
// .ktp-dc-title{font-size:20px;font-weight:bold;color:#B91C1C;text-transform:uppercase;letter-spacing:2px;padding:2px 12px;display:inline-block;border:none;background:transparent;}
// .ktp-dc-details{font-size:13px;margin-top:3px;color:#222;font-weight:500}
// .ktp-ref-challan{font-size:12px;color:#7B1E1E;font-weight:600;margin-top:2px;}
// .ktp-info{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:8px 14px 10px;background:#fff;}
// .ktp-info-title-box{font-size:13px;font-weight:bold;color:#7B1E1E;letter-spacing:0.3px;display:inline-block;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;padding:2px 10px;white-space:nowrap;}
// .ktp-compact-row{display:flex;align-items:baseline;gap:18px;margin-bottom:7px;}
// .ktp-compact-row:last-child{margin-bottom:0;}
// .ktp-compact-field{display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;}
// .ktp-compact-field.flex-name{flex:2;}
// .ktp-compact-label{font-size:12.5px;font-weight:600;color:#555;white-space:nowrap;}
// .ktp-compact-value{font-size:13.5px;font-weight:700;color:#000;border-bottom:1px solid #777;flex:1;padding-bottom:1px;min-width:60px;line-height:1.3;min-height:16px;word-break:break-word;padding-left:3px;}
// .ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;flex:1;}
// table.items{width:100%;border-collapse:collapse}
// table.items thead tr{background:linear-gradient(135deg,#5a1515,#7B1E1E)}
// table.items th{padding:8px 10px;font-size:13px;font-weight:bold;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:0.5px;}
// table.items th:last-child{border-right:none}
// table.items th.tl{text-align:left}
// table.items tbody tr{border-bottom:1px solid #ddd}
// table.items tbody tr:nth-child(even){background:#FAFAFA}
// table.items tbody tr:nth-child(odd){background:#fff}
// table.items td{padding:6px 10px;font-size:14px;border-right:1px solid #d8d8d8;vertical-align:top;line-height:1.4;color:#000;font-weight:500}
// table.items td:last-child{border-right:none}
// table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
// table.items td.c{text-align:center}
// table.items .item-detail{font-size:11.5px;color:#444;font-style:italic;font-weight:400;display:inline !important;}
// table.items .erow td{height:18px;border-right:1px solid #e0e0e0}
// table.items .erow td:last-child{border-right:none}
// .ktp-footer{border:2px solid #7B1E1E;border-top:none;display:flex;background:#fff;}
// .ktp-footer-left{flex:1;padding:8px 18px;border-right:2px solid #7B1E1E;display:flex;flex-direction:column;justify-content:space-between;}
// .ktp-footer-cert{font-size:12px;color:#000;line-height:1.4;font-weight:700;margin-bottom:5px;}
// .ktp-terms-list{list-style:none;padding:0;margin:5px 0 0 0;}
// .ktp-terms-list li{font-size:10.5px;color:#222;line-height:1.4;padding-left:12px;position:relative;font-weight:600;letter-spacing:0.2px;margin-bottom:3px;}
// .ktp-terms-list li:before{content:"•";color:#7B1E1E;font-weight:bold;font-size:13px;position:absolute;left:2px;top:-1px;}
// .ktp-sig-area{display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;gap:20px;padding-bottom:18px;}
// .ktp-sig-box{text-align:center;flex:1;}
// .ktp-sig-line{width:100%;max-width:160px;border-top:1.5px solid #000;margin:0 auto 2px;}
// .ktp-sig-label{font-size:10.5px;color:#222;font-weight:700;}
// .ktp-footer-for-inline{font-size:11px;font-weight:bold;color:#7B1E1E;margin-bottom:32px;text-align:center;}
// .ktp-footer-right{width:250px;display:flex;flex-direction:column;}
// .ktp-total-row{display:flex;justify-content:space-between;padding:6px 14px;font-size:13.5px;border-bottom:1px solid #E8DCC8;color:#222;}
// .ktp-total-row .ktp-total-label{font-weight:600}
// .ktp-total-row .ktp-total-val{font-weight:700;font-variant-numeric:tabular-nums}
// .ktp-total-row.grand{background:linear-gradient(135deg,#B91C1C,#DC2626);color:#fff;font-size:16px;font-weight:bold;border-bottom:none;padding:9px 14px;}
// .ktp-total-row.grand .ktp-total-val{letter-spacing:0.5px}
// .ktp-return-badge{background:#FEF2F2;border:2px solid #B91C1C;color:#B91C1C;padding:4px 14px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;display:inline-block;margin-top:4px;}
// .ktp-reason-box{padding:8px 14px;background:#FEF2F2;border-bottom:1px solid #FECACA;font-size:12px;color:#991B1B;font-weight:600;}
// .ktp-eoe-line{padding:3px 14px;font-size:9.5px;color:#666;text-align:right;border-top:1px solid #E8DCC8;letter-spacing:0.5px;font-weight:500}
// @media print{
// html{margin:0!important;padding:0!important}
// body{margin:0!important;padding:0!important;background:#fff!important}
// .action-bar{display:none!important}
// .page-wrapper{width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;box-shadow:none!important}
// .ktp-header{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// table.items thead tr{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// table.items th{color:#fff!important}
// .ktp-total-row.grand{background:#B91C1C!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
// }
// @page{size:A4;margin:0}
// `;


const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page-wrapper{width:210mm;min-height:297mm;margin:10px auto;background:#fff;box-shadow:0 0 10px rgba(0,0,0,0.1);display:flex;flex-direction:column;}
.page-content{padding:0;flex:1;display:flex;flex-direction:column;}
.action-bar{display:flex;gap:12px;justify-content:center;padding:14px 20px;background:linear-gradient(135deg,#FBF6F0,#F0E6DA);border-bottom:2px solid #E8DCC8;}
.action-btn{padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;letter-spacing:0.3px;}
.btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
.btn-print:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(123,30,30,0.4)}
.btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,0.3)}
.btn-save:hover{transform:translateY(-1px)}
.btn-close{background:#fff;color:#333;border:1px solid #ddd;box-shadow:0 1px 4px rgba(0,0,0,0.1)}

/* ===== HEADER - White BG, Black Text, Krishna Red ===== */
.ktp-header{background:#fff;color:#000;padding:14px 24px 12px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #000;}
.ktp-logo-circle{width:80px;height:80px;border-radius:50%;border:3px solid #000;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
.ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:54px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;letter-spacing:1px;color:#7B1E1E;}
.ktp-brand-sub{font-size:26px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:4px;margin-top:4px;color:#000;}
.ktp-brand-addr{font-size:12.5px;margin-top:8px;letter-spacing:0.2px;font-weight:600;white-space:nowrap;color:#000;}
.ktp-header-right-space{width:80px;flex-shrink:0}

/* ===== META ===== */
.ktp-meta{display:flex;justify-content:space-between;align-items:flex-start;border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:7px 18px;background:#fff;}
.ktp-meta-left{display:flex;flex-direction:column;gap:2px}
.ktp-since{font-size:11.5px;font-style:italic;color:#555;font-weight:500}
.ktp-gstin{font-size:13.5px;font-weight:bold;color:#000;letter-spacing:0.5px}
.ktp-dc-box{text-align:right}
.ktp-dc-title{font-size:20px;font-weight:bold;color:#B91C1C;text-transform:uppercase;letter-spacing:2px;padding:2px 12px;display:inline-block;border:none;background:transparent;}
.ktp-dc-details{font-size:13px;margin-top:3px;color:#000;font-weight:500}
.ktp-ref-challan{font-size:12px;color:#000;font-weight:600;margin-top:2px;}

/* ===== CUSTOMER INFO - No underlines ===== */
.ktp-info{border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:8px 14px 10px;background:#fff;}
.ktp-info-title-box{font-size:13px;font-weight:bold;color:#000;letter-spacing:0.3px;display:inline-block;border-left:2px solid #000;border-right:2px solid #000;padding:2px 10px;white-space:nowrap;}
.ktp-compact-row{display:flex;align-items:baseline;gap:18px;margin-bottom:7px;}
.ktp-compact-row:last-child{margin-bottom:0;}
.ktp-compact-field{display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;}
.ktp-compact-field.flex-name{flex:2;}
.ktp-compact-label{font-size:12.5px;font-weight:600;color:#555;white-space:nowrap;}
.ktp-compact-value{font-size:13.5px;font-weight:700;color:#000;flex:1;padding-bottom:1px;min-width:60px;line-height:1.3;min-height:16px;word-break:break-word;padding-left:3px;border-bottom:none !important;}

/* ===== TABLE - White header, Black text, Black borders ===== */
.ktp-table-wrap{border-left:2px solid #000;border-right:2px solid #000;flex:1;}
table.items{width:100%;border-collapse:collapse}
table.items thead tr{background:#fff !important;}
table.items th{padding:9px 10px;font-size:14px;font-weight:bold;color:#000;text-align:center;border-right:1.5px solid #000;border-bottom:2px solid #000;border-top:1.5px solid #000;text-transform:uppercase;letter-spacing:0.5px;background:#fff;}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #000}
table.items tbody tr:nth-child(even){background:#FAFAFA}
table.items tbody tr:nth-child(odd){background:#fff}
table.items td{padding:7px 10px;font-size:15.5px;border-right:1px solid #000;vertical-align:top;line-height:1.4;color:#000;font-weight:500}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
table.items td.c{text-align:center}
table.items .item-detail{font-size:13px;color:#444;font-style:italic;font-weight:400;display:inline !important;}
table.items .erow td{height:38px;border-right:1px solid #000}
table.items .erow td:last-child{border-right:none}
table.items .spacer-row td{height:100%;border-right:1px solid #000;border-bottom:none!important;}
table.items .spacer-row td:last-child{border-right:none!important;}

/* ===== FOOTER ===== */
.ktp-footer{border:2px solid #000;display:flex;background:#fff;page-break-inside:avoid;}
.ktp-footer-left{flex:1;padding:8px 18px;border-right:2px solid #000;display:flex;flex-direction:column;justify-content:space-between;}
.ktp-footer-cert{font-size:12px;color:#000;line-height:1.4;font-weight:700;margin-bottom:5px;}
.ktp-terms-list{list-style:none;padding:0;margin:5px 0 0 0;}
.ktp-terms-list li{font-size:10.5px;color:#222;line-height:1.4;padding-left:12px;position:relative;font-weight:600;letter-spacing:0.2px;margin-bottom:3px;}
.ktp-terms-list li:before{content:"•";color:#000;font-weight:bold;font-size:13px;position:absolute;left:2px;top:-1px;}
.ktp-sig-area{display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;gap:20px;padding-bottom:18px;}
.ktp-sig-box{text-align:center;flex:1;}
.ktp-sig-line{width:100%;max-width:160px;border-top:1.5px solid #000;margin:0 auto 2px;}
.ktp-sig-label{font-size:10.5px;color:#222;font-weight:700;}
.ktp-footer-for-inline{font-size:11px;font-weight:bold;color:#000;margin-bottom:32px;text-align:center;}
.ktp-footer-right{width:250px;display:flex;flex-direction:column;}

/* ===== TOTALS - White BG, Black Text (Grand keeps red for visibility - return PDF) ===== */
.ktp-total-row{display:flex;justify-content:space-between;padding:6px 14px;font-size:13.5px;border-bottom:1px solid #ccc;color:#000;}
.ktp-total-row .ktp-total-label{font-weight:600}
.ktp-total-row .ktp-total-val{font-weight:700;font-variant-numeric:tabular-nums}
.ktp-total-row.grand{background:#fff;color:#000;font-size:16px;font-weight:bold;border-bottom:none;padding:9px 14px;border-top:2px solid #000;}
.ktp-total-row.grand .ktp-total-val{letter-spacing:0.5px;color:#B91C1C;}

/* ===== Return-specific badges ===== */
.ktp-return-badge{background:#FEF2F2;border:2px solid #B91C1C;color:#B91C1C;padding:4px 14px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;display:inline-block;margin-top:4px;}
.ktp-reason-box{padding:8px 14px;background:#FEF2F2;border-bottom:1px solid #FECACA;font-size:12px;color:#991B1B;font-weight:600;}
.ktp-eoe-line{padding:3px 14px;font-size:9.5px;color:#666;text-align:right;border-top:1px solid #ccc;letter-spacing:0.5px;font-weight:500}

@media print{
html,body{margin:0!important;padding:0!important;background:#fff!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
.action-bar{display:none!important}
.page-wrapper{width:195mm!important;min-height:auto!important;margin:0!important;padding:0!important;box-shadow:none!important;}

*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important;}

.ktp-header{background:#fff!important;border-bottom:2px solid #000!important;}
.ktp-brand-name{color:#7B1E1E!important;}
.ktp-meta{border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;background:#fff!important;}
.ktp-info{border-left:2px solid #000!important;border-right:2px solid #000!important;border-bottom:2px solid #000!important;background:#fff!important;}
.ktp-info-title-box{border-left:2px solid #000!important;border-right:2px solid #000!important;}
.ktp-table-wrap{border-left:2px solid #000!important;border-right:2px solid #000!important;}
.ktp-footer{border:2px solid #000!important;page-break-inside:avoid!important;}
.ktp-footer-left{border-right:2px solid #000!important;}

table.items thead tr{background:#fff!important;}
table.items th{background:#fff!important;color:#000!important;border-right:1.5px solid #000!important;border-bottom:2px solid #000!important;border-top:1.5px solid #000!important;font-size:14px!important;}
table.items th:last-child{border-right:none!important;}
table.items td{border-right:1px solid #000!important;font-size:15.5px!important;padding:7px 10px!important;line-height:1.4!important;}
table.items td:last-child{border-right:none!important;}
table.items tbody tr{border-bottom:1px solid #000!important;}

.ktp-total-row.grand{background:#fff!important;color:#000!important;border-top:2px solid #000!important;}
.ktp-total-row.grand .ktp-total-val{color:#B91C1C!important;}
.ktp-reason-box{background:#FEF2F2!important;}
.ktp-logo-circle{border:3px solid #000!important;}
.ktp-dc-title{color:#B91C1C!important;}
}
@page{size:A4;margin:5mm 10mm 10mm 5mm;}
`;


// function getGoodsReturnPrintHTML(returnData, returnItemsList, challan, order) {
//   const hidePrice = challan?.hidePrice || false;
//   const returnTotal = returnData.returnTotal || 0;
//   const reasonObj = RETURN_REASONS.find(r => r.value === returnData.reason);

//   let sno = 0;
//   const itemRows = returnItemsList.map(it => {
//     sno++;

//     const formatQty = (val) => {
//       const num = parseFloat(val || 0);
//       if (isNaN(num)) return val || '0';
//       return num % 1 === 0 ? num.toString() : parseFloat(num.toFixed(3)).toString();
//     };

//     let qtyVal = formatQty(it.returnQty);
//     let qtyWithUnit = it.unit ? `${qtyVal} ${it.unit}` : qtyVal;

//     if (it.returnPcs && parseFloat(it.returnPcs) !== parseFloat(it.returnQty)) {
//       qtyWithUnit = `${qtyVal} ${it.unit} <span class="item-detail">(${formatQty(it.returnPcs)} pcs)</span>`;
//     }

//     let descText = `<strong>${it.product}</strong>`;
//     let details = [];
//     if (it.size) details.push(it.size);
//     if (it.lengthDisplay && it.lengthDisplay !== "0'-0\"") details.push(it.lengthDisplay);
//     if (details.length) descText += ` <span class="item-detail">${details.join(' · ')}</span>`;

//     return `<tr>
//       <td class="c">${sno}</td>
//       <td class="tl">${descText}</td>
//       ${!hidePrice ? `
//         <td class="r">${qtyWithUnit}</td>
//         <td class="r">₹${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//         <td class="r"><strong>₹${parseFloat(it.returnAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
//       ` : `<td class="r">${qtyWithUnit}</td>`}
//     </tr>`;
//   });

//   const minRows = 12;
//   const emptyCount = Math.max(0, minRows - itemRows.length);
//   const colCount = hidePrice ? 3 : 5;
//   let emptyRows = '';
//   for (let i = 0; i < emptyCount; i++) {
//     let cells = '';
//     for (let j = 0; j < colCount; j++) cells += `<td>&nbsp;</td>`;
//     emptyRows += `<tr class="erow">${cells}</tr>`;
//   }

//   let footerRightContent = '';
//   if (!hidePrice) {
//     footerRightContent = `
//       ${reasonObj ? `<div class="ktp-reason-box">📋 Reason: ${reasonObj.icon} ${reasonObj.label}</div>` : ''}
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Items Returned</span>
//         <span class="ktp-total-val">${returnItemsList.length}</span>
//       </div>
//       <div class="ktp-total-row grand">
//         <span class="ktp-total-label">CREDIT TOTAL</span>
//         <span class="ktp-total-val">₹${returnTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//       </div>
//       <div class="ktp-eoe-line">E. &amp; O.E.</div>
//     `;
//   } else {
//     footerRightContent = `
//       ${reasonObj ? `<div class="ktp-reason-box">📋 Reason: ${reasonObj.icon} ${reasonObj.label}</div>` : ''}
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Items Returned</span>
//         <span class="ktp-total-val">${returnItemsList.length}</span>
//       </div>
//       <div class="ktp-eoe-line">E. &amp; O.E.</div>
//     `;
//   }

// const consigneeHTML = `
//   <div class="ktp-compact-row">
//     <span class="ktp-info-title-box">RETURNED BY (CUSTOMER DETAILS)</span>
//     <div class="ktp-compact-field">
//       <span class="ktp-compact-label">Phone No.:</span>
//       <span class="ktp-compact-value">${order?.customerPhone || challan?.customerPhone || ''}</span>
//     </div>
//   </div>
//   <div class="ktp-compact-row">
//     <div class="ktp-compact-field flex-name">
//       <span class="ktp-compact-label">Name:</span>
//       <span class="ktp-compact-value">${returnData.customerName || ''}</span>
//     </div>
//     <div class="ktp-compact-field">
//     <span class="ktp-compact-label">GST No.:</span>
//       <span class="ktp-compact-value">${challan?.gstCustomerName || ''}</span>
//     </div>
//   </div>
//   <div class="ktp-compact-row">
//     <div class="ktp-compact-field" style="flex:1;">
//       <span class="ktp-compact-label">Address:</span>
//       <span class="ktp-compact-value">${order?.customerAddress || challan?.customerAddress || ''}</span>
//     </div>
//   </div>
// `;

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Goods Return ${returnData.returnNo}</title><style>${PRINT_CSS}</style></head><body>
// <div class="action-bar">
//   <button class="action-btn btn-print" onclick="window.print()">🖨️ Print Return</button>
//   <button class="action-btn btn-save" onclick="savePDF()">💾 Save as PDF</button>
//   <button class="action-btn btn-close" onclick="window.close()">✕ Close</button>
// </div>
// <div class="page-wrapper"><div class="page-content">
//   <div class="ktp-header">
//     <div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div>
//     <div class="ktp-header-center">
//       <div class="ktp-brand-name">Krishna</div>
//       <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
//       <div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div>
//     </div>
//     <div class="ktp-header-right-space"></div>
//   </div>
//   <div class="ktp-meta">
//     <div class="ktp-meta-left">
//       <div class="ktp-since">Chhabra's Since 1979</div>
//       <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
//     </div>
//     <div class="ktp-dc-box">
//       <div class="ktp-dc-title"> GOODS RETURN</div>
//       <div class="ktp-dc-details">No.: <strong>${returnData.returnNo}</strong> &nbsp;&nbsp;&nbsp; Date: <strong>${new Date(returnData.returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
//       <div class="ktp-ref-challan">Ref. Challan: <strong>${returnData.challanNo}</strong></div>
//     </div>
//   </div>
//   <div class="ktp-info">${consigneeHTML}</div>
//   <div class="ktp-table-wrap">
//     <table class="items">
//       <thead><tr>
//         <th style="width:35px">S.No.</th>
//         <th class="tl">Description of Goods (Returned)</th>
//         ${!hidePrice ? `<th style="width:95px">Return Qty</th><th style="width:80px">Rate</th><th style="width:95px">Credit Amt</th>` : `<th style="width:100px">Return Qty</th>`}
//       </tr></thead>
//       <tbody>${itemRows.join('')}${emptyRows}</tbody>
//     </table>
//   </div>
//   <div class="ktp-footer">
//     <div class="ktp-footer-left">
//       <div>
//         <div class="ktp-footer-cert">Certified that the above goods have been received back in good condition.</div>
//         ${returnData.notes ? `<div style="font-size:12px;color:#555;margin-top:4px;">📝 Note: ${returnData.notes}</div>` : ''}
//       </div>
//       <div class="ktp-sig-area">
//         <div class="ktp-sig-box">
//           <div class="ktp-sig-line"></div>
//           <div class="ktp-sig-label">Customer Signature</div>
//         </div>
//         <div class="ktp-sig-box">
//           <div class="ktp-footer-for-inline">For : Krishna Timber &amp; Plywoods</div>
//           <div class="ktp-sig-line"></div>
//           <div class="ktp-sig-label">Authorised Signatory</div>
//         </div>
//       </div>
//     </div>
//     <div class="ktp-footer-right">${footerRightContent}</div>
//   </div>
// </div></div>
// <script>function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}</script>
// </body></html>`;
// }

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════



function getGoodsReturnPrintHTML(returnData, returnItemsList, challan, order) {
  const hidePrice = challan?.hidePrice || false;
  const returnTotal = returnData.returnTotal || 0;
  const reasonObj = RETURN_REASONS.find(r => r.value === returnData.reason);

  let sno = 0;
  const itemRows = returnItemsList.map(it => {
    sno++;

    const formatQty = (val) => {
      const num = parseFloat(val || 0);
      if (isNaN(num)) return val || '0';
      return num % 1 === 0 ? num.toString() : parseFloat(num.toFixed(3)).toString();
    };

    let qtyVal = formatQty(it.returnQty);
    let qtyWithUnit = it.unit ? `${qtyVal} ${it.unit}` : qtyVal;

    if (it.returnPcs && parseFloat(it.returnPcs) !== parseFloat(it.returnQty)) {
      qtyWithUnit = `${qtyVal} ${it.unit} <span class="item-detail">(${formatQty(it.returnPcs)} pcs)</span>`;
    }

    let descText = `<strong>${it.product}</strong>`;
    let details = [];
    if (it.size) {
      const sizeWithoutSpaces = it.size.replace(/\s/g, '').toLowerCase();
      const productLower = (it.product || '').replace(/\s/g, '').toLowerCase();
      const sizeAlreadyInName = productLower.includes(sizeWithoutSpaces);
      if (!sizeAlreadyInName) details.push(it.size);
    }
    if (it.lengthDisplay && it.lengthDisplay !== "0'-0\"") details.push(it.lengthDisplay);
    if (details.length) descText += ` <span class="item-detail">${details.join(' · ')}</span>`;

    return `<tr>
      <td class="c">${sno}</td>
      <td class="tl">${descText}</td>
      ${!hidePrice ? `
        <td class="r">${qtyWithUnit}</td>
        <td class="r">₹${parseFloat(it.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td class="r"><strong>₹${parseFloat(it.returnAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
      ` : `<td class="r">${qtyWithUnit}</td>`}
    </tr>`;
  });

  const minRows = 12;
  const emptyCount = Math.max(0, minRows - itemRows.length);
  const colCount = hidePrice ? 3 : 5;
  let emptyRows = '';
  for (let i = 0; i < emptyCount; i++) {
    let cells = '';
    for (let j = 0; j < colCount; j++) cells += `<td>&nbsp;</td>`;
    emptyRows += `<tr class="erow">${cells}</tr>`;
  }

  let footerRightContent = '';
  if (!hidePrice) {
    footerRightContent = `
      ${reasonObj ? `<div class="ktp-reason-box">📋 Reason: ${reasonObj.icon} ${reasonObj.label}</div>` : ''}
      <div class="ktp-total-row">
        <span class="ktp-total-label">Items Returned</span>
        <span class="ktp-total-val">${returnItemsList.length}</span>
      </div>
      <div class="ktp-total-row grand">
        <span class="ktp-total-label">CREDIT TOTAL</span>
        <span class="ktp-total-val">-₹${returnTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="ktp-eoe-line">E. &amp; O.E.</div>
    `;
  } else {
    footerRightContent = `
      ${reasonObj ? `<div class="ktp-reason-box">📋 Reason: ${reasonObj.icon} ${reasonObj.label}</div>` : ''}
      <div class="ktp-total-row">
        <span class="ktp-total-label">Items Returned</span>
        <span class="ktp-total-val">${returnItemsList.length}</span>
      </div>
      <div class="ktp-eoe-line">E. &amp; O.E.</div>
    `;
  }

  const consigneeHTML = `
    <div class="ktp-compact-row">
      <span class="ktp-info-title-box">RETURNED BY (CUSTOMER DETAILS)</span>
      <div class="ktp-compact-field">
        <span class="ktp-compact-label">Phone No.:</span>
        <span class="ktp-compact-value">${order?.customerPhone || challan?.customerPhone || ''}</span>
      </div>
    </div>
    <div class="ktp-compact-row">
      <div class="ktp-compact-field flex-name">
        <span class="ktp-compact-label">Name:</span>
        <span class="ktp-compact-value">${returnData.customerName || ''}</span>
      </div>
      <div class="ktp-compact-field">
        <span class="ktp-compact-label">GST No.:</span>
        <span class="ktp-compact-value">${challan?.gstCustomerName || ''}</span>
      </div>
    </div>
    <div class="ktp-compact-row">
      <div class="ktp-compact-field" style="flex:1;">
        <span class="ktp-compact-label">Address:</span>
        <span class="ktp-compact-value">${order?.customerAddress || challan?.customerAddress || ''}</span>
      </div>
    </div>
  `;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Goods Return ${returnData.returnNo}</title><style>${PRINT_CSS}</style></head><body>
<div class="action-bar">
  <button class="action-btn btn-print" onclick="window.print()">🖨️ Print Return</button>
  <button class="action-btn btn-save" onclick="savePDF()">💾 Save as PDF</button>
  <button class="action-btn btn-close" onclick="window.close()">✕ Close</button>
</div>
<div class="page-wrapper"><div class="page-content">
  <!-- HEADER - white BG, black text, Krishna red -->
  <div class="ktp-header">
    <div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div>
    <div class="ktp-header-center">
      <div class="ktp-brand-name">Krishna</div>
      <div class="ktp-brand-sub">Timber &amp; Plywoods</div>
      <div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div>
    </div>
    <div class="ktp-header-right-space"></div>
  </div>

  <!-- META -->
  <div class="ktp-meta">
    <div class="ktp-meta-left">
      <div class="ktp-since">Chhabra's Since 1979</div>
      <div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div>
    </div>
    <div class="ktp-dc-box">
      <div class="ktp-dc-title">GOODS RETURN</div>
      <div class="ktp-dc-details">No.: <strong>${returnData.returnNo}</strong> &nbsp;&nbsp;&nbsp; Date: <strong>${new Date(returnData.returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
      <div class="ktp-ref-challan">Ref. Challan: <strong>${returnData.challanNo}</strong></div>
    </div>
  </div>

  <!-- CUSTOMER INFO - no underlines -->
  <div class="ktp-info">${consigneeHTML}</div>

  <!-- TABLE - white header, black text, black borders -->
  <div class="ktp-table-wrap">
    <table class="items">
      <thead><tr>
        <th style="width:35px">S.No.</th>
        <th class="tl">Description of Goods (Returned)</th>
        ${!hidePrice ? `<th style="width:95px">Return Qty</th><th style="width:80px">Rate</th><th style="width:95px">Credit Amt</th>` : `<th style="width:100px">Return Qty</th>`}
      </tr></thead>
      <tbody>${itemRows.join('')}${emptyRows}</tbody>
    </table>
  </div>

  <!-- FOOTER - black borders -->
  <div class="ktp-footer">
    <div class="ktp-footer-left">
      <div>
        <div class="ktp-footer-cert">Certified that the above goods have been received back in good condition.</div>
        ${returnData.notes ? `<div style="font-size:12px;color:#555;margin-top:4px;">📝 Note: ${returnData.notes}</div>` : ''}
        <ul class="ktp-terms-list">
          <li>This is a Goods Return Note acknowledging receipt of returned items.</li>
          <li>Credit will be adjusted in customer's account.</li>
          <li>All disputes are subject to Bhopal jurisdiction only.</li>
        </ul>
      </div>
      <div class="ktp-sig-area">
        <div class="ktp-sig-box">
          <div class="ktp-sig-line"></div>
          <div class="ktp-sig-label">Customer Signature</div>
        </div>
        <div class="ktp-sig-box">
          <div class="ktp-footer-for-inline">For : Krishna Timber &amp; Plywoods</div>
          <div class="ktp-sig-line"></div>
          <div class="ktp-sig-label">Authorised Signatory</div>
        </div>
      </div>
    </div>
    <div class="ktp-footer-right">${footerRightContent}</div>
  </div>
</div></div>
<script>function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}</script>
</body></html>`;
}



export default function GoodsReturnPage() {
  const [challans, setChallans] = useState([]);

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Return Form States
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnReason, setReturnReason] = useState('');
  const [returnNotes, setReturnNotes] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [challanSearch, setChallanSearch] = useState('');
  const [showChallanPicker, setShowChallanPicker] = useState(false);

  // Success Modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastReturnNo, setLastReturnNo] = useState('');
  const [lastReturnHTML, setLastReturnHTML] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('new-return');

  useEffect(() => {
    const stored = localStorage.getItem('ktp-dark-mode');
    if (stored === 'true') setDarkMode(true);
    const handleStorage = e => { if (e.key === 'ktp-dark-mode') setDarkMode(e.newValue === 'true'); };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const T = darkMode ? DARK : LIGHT;

  // ── Fetch Data ──
  const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null); // Clear previous error
  try {
    let challansData = [];
    let returnsData = [];

    // Challans API
    try {
      const cR = await apiGet('/api/billing-backend/challans');
      if (cR.success) challansData = cR.data;
      else console.warn('Challans API failed:', cR.error);
    } catch (err) {
      console.error('Challans fetch error:', err);
    }

    // Returns API
    try {
      const rR = await apiGet('/api/billing-backend/returns');
      if (rR.success) returnsData = rR.data;
      else console.warn('Returns API failed:', rR.error);
    } catch (err) {
      console.error('Returns fetch error:', err);
    }

    setChallans(challansData);
    setReturns(returnsData);

    // Only set error if both APIs failed (no data at all)
    if (challansData.length === 0 && returnsData.length === 0) {
      setError('Unable to load data. Check your connection.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    setError('Something went wrong');
  }
  setLoading(false);
}, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Helper Functions ──
  const genReturnNo = () => {
    const y = new Date().getFullYear();
    const prefix = `RTN-${y}-`;
    const max = returns.filter(r => r.returnNo?.startsWith(prefix))
      .reduce((m, r) => Math.max(m, parseInt(r.returnNo.replace(prefix, '')) || 0), 0);
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
  };


const getReturnedQtyForChallanItem = (challanNo, product) => {
  return returns
    .filter(r => r.challanNo === challanNo)
    .flatMap(r => r.items || [])
    .filter(i => i.product === product)
    .reduce((sum, i) => {
      // returnPcs = actual pcs returned
      // agar returnPcs nahi hai to returnQty fallback
      const pcs = parseFloat(i.returnPcs) || parseFloat(i.returnQty) || 0;
      return sum + pcs;
    }, 0);
};




  const getReturnsForChallan = (challanNo) => returns.filter(r => r.challanNo === challanNo);

  // ── Select Challan for Return ──



const selectChallanForReturn = (challan) => {
  setSelectedChallan(challan);
  const regularItems = (challan.items || []).filter(i => !i.isCharge);

  setReturnItems(regularItems.map(it => {

    // ✅ D column - actual qty (pcs)
    const sentQty = parseFloat(it.quantity || it.sentQty || 0);

    // ✅ G column - calculated measurement (sqft/cft/rft)
    const calculatedQty = parseFloat(it.calculatedQty || 0);

    // Already returned (D column basis)
    const alreadyReturned = getReturnedQtyForChallanItem(
      challan.challanNo, 
      it.product
    );

    // Max returnable in actual qty
    const maxReturnable = Math.max(0, sentQty - alreadyReturned);

    return {
      uid: uid(),
      product: it.product || '',
      unit: it.unit || '',
      sentQty,            // ✅ D column actual qty
      calculatedQty,      // ✅ G column calc qty
      alreadyReturned,
      maxReturnable,
      returnPcs: '',      // user input - actual qty return
      returnQty: 0,       // calculated return measurement
      rate: parseFloat(it.rate || 0),
      returnAmount: 0,
      size: it.size || '',
      lengthDisplay: it.lengthDisplay || '',
      isSheet: it.isSheet || false,
      areaPerPiece: it.areaPerPiece || null,
    };
  }));

  setReturnDate(new Date().toISOString().split('T')[0]);
  setReturnReason('');
  setReturnNotes('');
  setShowChallanPicker(false);
  setShowReturnForm(true);
};

  // ── Update Return Item ──
  

const updateReturnItem = (iuid, field, value) => {
  setReturnItems(prev => prev.map(it => {
    if (it.uid !== iuid) return it;
    const u = { ...it, [field]: value };

    if (field === 'returnPcs') {
      const pcs = parseFloat(value || 0);
      const unit = (it.unit || '').trim().toLowerCase();
      const isMeasureUnit = ['sqft', 'rft', 'cft'].includes(unit);

      // Max check - D column qty se zyada nahi
      let actualReturn = pcs;
      if (actualReturn > it.maxReturnable) {
        actualReturn = it.maxReturnable;
        u.returnPcs = it.maxReturnable;
      }

      if (isMeasureUnit && it.sentQty > 0 && it.calculatedQty > 0) {
        // Per piece measurement nikalo
        // G column / D column = per piece sqft/cft/rft
        const perPieceMeasure = it.calculatedQty / it.sentQty;
        u.returnQty = actualReturn * perPieceMeasure;
      } else {
        // Normal unit - direct
        u.returnQty = actualReturn;
      }

      // Amount calculate (rate calculated qty pe lagta hai)
      u.returnAmount = Math.round(u.returnQty * u.rate * 100) / 100;
    }

    return u;
  }));
};

  
  // ── Submit Return ──
 // ── Submit Return ──
const handleSubmitReturn = async () => {
  const validItems = returnItems.filter(i => parseFloat(i.returnPcs) > 0);
  if (!validItems.length) { setError('Kam se kam ek item ki return qty daalo'); return; }
  if (!returnReason) { setError('Return reason select karo'); return; }

  setSaving(true);
  setError(null);

  try {
    const returnNo = genReturnNo();
    const returnTotal = validItems.reduce((s, it) => s + (it.returnAmount || 0), 0);
    // ❌ REMOVE this line: const order = orders.find(o => o.orderNo === selectedChallan.orderNo);
    // ✅ No need to fetch order – we will pass null

    const payload = {
      returnData: {
        returnNo,
        challanNo: selectedChallan.challanNo,
        orderNo: selectedChallan.orderNo || '',   // keep if exists, else empty
        customerName: selectedChallan.customerName,
        returnDate,
        returnTotal,
        reason: returnReason,
        notes: returnNotes,
        status: 'Returned',
      },
      items: validItems.map(it => ({
        product: it.product,
        unit: it.unit,
        returnQty: it.returnQty,
        returnPcs: parseFloat(it.returnPcs),
        rate: it.rate,
        returnAmount: it.returnAmount,
        reason: returnReason,
        size: it.size,
        lengthDisplay: it.lengthDisplay,
      })),
    };

    const r = await apiPost('/api/billing-backend/returns', payload);
    if (!r.success) throw new Error(r.error);

    // ✅ Pass null as order (4th argument)
    const html = getGoodsReturnPrintHTML(payload.returnData, payload.items, selectedChallan, null);
    setLastReturnHTML(html);
    setLastReturnNo(returnNo);

    await fetchData();
    setShowReturnForm(false);
    setShowSuccess(true);
  } catch (err) {
    setError('Error: ' + err.message);
  } finally {
    setSaving(false);
  }
};

  // ── Delete Return ──
  const handleDeleteReturn = async (returnNo) => {
    if (!confirm(`Delete return ${returnNo}?`)) return;
    try {
      const r = await apiDelete('/api/billing-backend/returns', { returnNo });
      if (r.success) await fetchData();
      else setError(r.error);
    } catch (err) { setError(err.message); }
  };

  // ── View Return Print ──
const viewReturnPrint = (ret) => {
  const challan = challans.find(c => c.challanNo === ret.challanNo);
  const html = getGoodsReturnPrintHTML(ret, ret.items || [], challan, null);
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
};

const printReturnPrint = (ret) => {
  const challan = challans.find(c => c.challanNo === ret.challanNo);
  const html = getGoodsReturnPrintHTML(ret, ret.items || [], challan, null);
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 600);
};

  // ── Filtered Challans for Picker ──
  const filteredChallansForPicker = challans.filter(ch =>
    !challanSearch ||
    ch.challanNo?.toLowerCase().includes(challanSearch.toLowerCase()) ||
    ch.customerName?.toLowerCase().includes(challanSearch.toLowerCase()) ||
    ch.orderNo?.toLowerCase().includes(challanSearch.toLowerCase())
  );

  // ── Filtered Returns for List ──
  const filteredReturns = returns.filter(r =>
    !searchQuery ||
    r.returnNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.challanNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPDFView = html => { const w = window.open('', '_blank'); w.document.write(html); w.document.close(); };
  const openPDFPrint = html => { const w = window.open('', '_blank'); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 600); };

  // ── Loading ──
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40, background: T.pageBg, minHeight: '100vh' }}>
      <Loader2 className="animate-spin" style={{ color: T.maroon }} size={32} />
      <span style={{ marginLeft: 12, color: T.textDark, fontSize: 16 }}>Loading...</span>
    </div>
  );

  // ════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════

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
        .btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
        .btn-red{padding:7px 14px;background:linear-gradient(135deg,#B91C1C,#DC2626);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:${T.textMuted}}
        .icon-btn:hover{background:${T.hoverBg};color:${T.maroon}}
        .kt-card{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:16px;box-shadow:0 1px 5px ${T.shadow}}
        .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;background:transparent;color:${T.textMuted};cursor:pointer;transition:all 0.15s}
        .kt-tab.active{background:linear-gradient(135deg,${darkMode ? T.maroonDark : LIGHT.maroon},${T.maroon});color:${darkMode ? '#1a1a2e' : '#fff'}}
        .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}
        .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
        .total-box{border-radius:12px;padding:14px 18px;border:1px solid ${T.borderSoft};background:${T.cream}}
        .challan-pick-card{padding:14px;border:1px solid ${T.borderSoft};border-radius:12px;cursor:pointer;transition:all 0.15s;background:${T.cardBg}}
        .challan-pick-card:hover{background:${T.hoverBg};border-color:${T.maroon};transform:translateY(-1px)}
      `}</style>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: 12, background: T.errorBg, border: `1px solid ${T.errorBorder}`, color: T.errorColor }}>
          <AlertTriangle size={18} /><span style={{ flex: 1 }}>{error}</span>
          <button className="icon-btn" onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* ══════ HEADER ══════ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, #B91C1C, #DC2626)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RotateCcw size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 'bold', color: T.maroon, margin: 0 }}>Goods Return</h2>
            <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>Return maal & generate credit note</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`kt-tab ${activeTab === 'new-return' ? 'active' : ''}`} onClick={() => setActiveTab('new-return')}>
            🔄 New Return
          </button>
          <button className={`kt-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            📋 Return History {returns.length > 0 && `(${returns.length})`}
          </button>
        </div>
      </div>

      {/* ══════ NEW RETURN TAB ══════ */}
      {activeTab === 'new-return' && !showReturnForm && (
        <div>
          {/* Challan Search */}
          <div className="kt-card" style={{ padding: 24, marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.textDark, marginBottom: 12 }}>
              🔍 Select Challan for Return
            </p>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
              <input
                className="kt-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search by challan no, customer name, order no..."
                value={challanSearch}
                onChange={e => setChallanSearch(e.target.value)}
              />
            </div>

            {/* Challan List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 500, overflowY: 'auto' }}>
              {filteredChallansForPicker.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: T.textMuted }}>
                  <Package size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p>No challans found</p>
                </div>
              ) : (
                filteredChallansForPicker.map(ch => {
                  const existingReturns = getReturnsForChallan(ch.challanNo);
                  const itemCount = (ch.items || []).filter(i => !i.isCharge).length;
                  return (
                    <div
                      key={`pick-${ch.challanNo}`}
                      className="challan-pick-card"
                      onClick={() => selectChallanForReturn(ch)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: T.maroon, fontSize: 14 }}>
                              {ch.challanNo}
                            </span>
                            <span style={{ fontSize: 12, color: T.textMuted }}>→ {ch.orderNo}</span>
                            <span className="status-pill" style={{ background: T.successBg, color: T.successColor }}>
                              <span className="status-dot" style={{ background: '#22c55e' }} />
                              Delivered
                            </span>
                            {existingReturns.length > 0 && (
                              <span className="status-pill" style={{ background: T.amberBg, color: T.amberColor, borderColor: T.amberBorder }}>
                                🔄 {existingReturns.length} return(s)
                              </span>
                            )}
                          </div>
                          <p style={{ fontWeight: 600, margin: '2px 0', color: T.textDark, fontSize: 15 }}>
                            {ch.customerName}
                          </p>
                          <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                            {new Date(ch.challanDate).toLocaleDateString()} • {itemCount} items
                            {!ch.hidePrice && ` • ₹${parseFloat(ch.challanTotal || 0).toLocaleString()}`}
                          </p>
                        </div>
                        <button className="btn-red" style={{ flexShrink: 0 }}>
                          <RotateCcw size={14} /> Return
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════ RETURN FORM ══════ */}
      {activeTab === 'new-return' && showReturnForm && selectedChallan && (
        <div className="kt-card" style={{ overflow: 'hidden' }}>
          {/* Form Header */}
          <div style={{ padding: 20, borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.accent }}>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: 18, margin: 0, color: T.textDark }}>
                🔄 Goods Return — {selectedChallan.challanNo}
              </h3>
              <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
                {selectedChallan.customerName} • {selectedChallan.orderNo} • {new Date(selectedChallan.challanDate).toLocaleDateString()}
              </p>
            </div>
            <button className="icon-btn" onClick={() => setShowReturnForm(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Form Body */}
          <div style={{ padding: 20 }}>
            {/* Return Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, display: 'block', marginBottom: 4 }}>Return Date *</label>
                <input type="date" className="kt-input" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, display: 'block', marginBottom: 4 }}>Reason *</label>
                <select className="kt-input" value={returnReason} onChange={e => setReturnReason(e.target.value)}>
                  <option value="">-- Select Reason --</option>
                  {RETURN_REASONS.map(r => (
                    <option key={`reason-${r.value}`} value={r.value}>{r.icon} {r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, display: 'block', marginBottom: 4 }}>Notes</label>
                <input className="kt-input" placeholder="Optional notes..." value={returnNotes} onChange={e => setReturnNotes(e.target.value)} />
              </div>
            </div>

            {/* Warning */}
            <div style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 12, color: T.amberColor, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} />
              Sirf utni qty daalo jitna maal actually return ho raha hai. Max limit se zyada nahi dal sakte.
            </div>

            {/* Items Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: T.cream }}>
                    <th style={{ padding: 10, textAlign: 'left', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Item</th>
                    <th style={{ padding: 10, textAlign: 'center', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Unit</th>
                    <th style={{ padding: 10, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Sent Qty</th>
                    <th style={{ padding: 10, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Already Returned</th>
                    <th style={{ padding: 10, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Max Returnable</th>
                    <th style={{ padding: 10, textAlign: 'center', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Return Qty</th>
                    <th style={{ padding: 10, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Return Qty</th>
                    <th style={{ padding: 10, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Rate</th>
                    <th style={{ padding: 10, textAlign: 'right', borderBottom: `2px solid ${T.borderSoft}`, color: T.textDark }}>Credit ₹</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.map(it => (
                    <tr key={`return-row-${it.uid}`} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                      <td style={{ padding: 10, color: T.textDark }}>
                        <div style={{ fontWeight: 600 }}>{it.product}</div>
                        {it.size && <div style={{ fontSize: 11, color: T.textMuted }}>{it.size}</div>}
                        {it.lengthDisplay && it.lengthDisplay !== "0'-0\"" && (
                          <div style={{ fontSize: 11, color: T.textMuted }}>{it.lengthDisplay}</div>
                        )}
                      </td>
                      <td style={{ padding: 10, textAlign: 'center', color: T.textMuted }}>{it.unit}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: T.textDark, fontWeight: 500 }}>
                        {it.sentQty.toFixed(3)}
                        {it.isSheet && it.sentPcs !== it.sentQty && (
                          <div style={{ fontSize: 10, color: T.textMuted }}>({it.sentPcs} pcs)</div>
                        )}
                      </td>
                      <td style={{ padding: 10, textAlign: 'right', color: it.alreadyReturned > 0 ? T.amberColor : T.textMuted, fontWeight: it.alreadyReturned > 0 ? 600 : 400 }}>
                        {it.alreadyReturned > 0 ? it.alreadyReturned.toFixed(3) : '—'}
                      </td>
                      <td style={{ padding: 10, textAlign: 'right', fontWeight: 600, color: it.maxReturnable > 0 ? T.successColor : T.errorColor }}>
                        {it.maxReturnable.toFixed(3)}
                      </td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="kt-input"
                          style={{ width: 80, textAlign: 'center' }}
                          value={it.returnPcs}
                          disabled={it.maxReturnable <= 0}
                          placeholder={it.maxReturnable <= 0 ? '—' : '0'}
                          onChange={e => updateReturnItem(it.uid, 'returnPcs', e.target.value)}
                        />
                      </td>
                      <td style={{ padding: 10, textAlign: 'right', fontWeight: 600, color: it.returnQty > 0 ? T.maroon : T.textMuted }}>
                        {it.returnQty > 0 ? it.returnQty.toFixed(3) : '—'}
                      </td>
                      <td style={{ padding: 10, textAlign: 'right', color: T.textDark }}>
                        ₹{it.rate.toLocaleString()}
                      </td>
                      <td style={{ padding: 10, textAlign: 'right', fontWeight: 'bold', color: it.returnAmount > 0 ? '#B91C1C' : T.textMuted }}>
                        {it.returnAmount > 0 ? `-₹${it.returnAmount.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Return Total */}
            {returnItems.some(i => i.returnAmount > 0) && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <div className="total-box" style={{ width: 300, background: T.errorBg, borderColor: T.errorBorder }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: T.textDark, fontSize: 13 }}>
                    <span>Items Being Returned</span>
                    <span>{returnItems.filter(i => parseFloat(i.returnPcs) > 0).length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 20, borderTop: `2px solid #B91C1C`, paddingTop: 8, marginTop: 8, color: '#B91C1C' }}>
                    <span>Credit Total</span>
                    <span>-₹{returnItems.reduce((s, i) => s + (i.returnAmount || 0), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div style={{ padding: 20, borderTop: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <button className="btn-white" onClick={() => setShowReturnForm(false)}>
              ← Back to Challans
            </button>
            <button className="btn-maroon" onClick={handleSubmitReturn} disabled={saving} style={{ background: 'linear-gradient(135deg, #B91C1C, #DC2626)' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
              {saving ? 'Saving...' : 'Save & Generate Goods Return'}
            </button>
          </div>
        </div>
      )}

      {/* ══════ RETURN HISTORY TAB ══════ */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input
              className="kt-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search returns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredReturns.length === 0 ? (
            <div className="kt-card" style={{ padding: 56, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.textDark }}>No Returns Yet</p>
              <p style={{ fontSize: 13, color: T.textMuted }}>Jab koi maal return hoga, yahan dikhega</p>
            </div>
          ) : (
            filteredReturns.map(ret => {
              const reasonObj = RETURN_REASONS.find(r => r.value === ret.reason);
              return (
                <div key={`history-${ret.returnNo}`} className="kt-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#B91C1C', fontSize: 14 }}>
                          {ret.returnNo}
                        </span>
                        <span style={{ fontSize: 12, color: T.textMuted }}>← {ret.challanNo}</span>
                        <span className="status-pill" style={{ background: T.amberBg, color: T.amberColor, borderColor: T.amberBorder }}>
                          <span className="status-dot" style={{ background: T.amberColor }} />
                          Returned
                        </span>
                        {reasonObj && (
                          <span className="status-pill" style={{ background: T.purpleBg, color: T.purpleColor, borderColor: T.purpleBorder }}>
                            {reasonObj.icon} {reasonObj.label}
                          </span>
                        )}
                      </div>
                      <p style={{ fontWeight: 600, margin: '4px 0', color: T.textDark, fontSize: 15 }}>
                        {ret.customerName}
                      </p>
                      <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                        {new Date(ret.returnDate).toLocaleDateString()} • {(ret.items || []).length} item(s) • Order: {ret.orderNo}
                      </p>
                      {ret.notes && (
                        <p style={{ fontSize: 12, color: T.textMuted, margin: '4px 0 0', fontStyle: 'italic' }}>📝 {ret.notes}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#B91C1C' }}>
                        -₹{ret.returnTotal.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-white" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => viewReturnPrint(ret)}>
                          <Eye size={12} /> View
                        </button>
                        <button className="btn-maroon" style={{ padding: '5px 12px', fontSize: 12, background: 'linear-gradient(135deg,#B91C1C,#DC2626)' }} onClick={() => printReturnPrint(ret)}>
                          <Printer size={12} /> Print
                        </button>
                        <button className="icon-btn" style={{ color: T.errorColor }} onClick={() => handleDeleteReturn(ret.returnNo)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Items detail */}
                  <div style={{ marginTop: 12, overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: T.cream }}>
                          <th style={{ padding: 6, textAlign: 'left', borderBottom: `1px solid ${T.borderSoft}`, color: T.textMuted }}>Product</th>
                          <th style={{ padding: 6, textAlign: 'center', borderBottom: `1px solid ${T.borderSoft}`, color: T.textMuted }}>Unit</th>
                          <th style={{ padding: 6, textAlign: 'right', borderBottom: `1px solid ${T.borderSoft}`, color: T.textMuted }}>Return Qty</th>
                          <th style={{ padding: 6, textAlign: 'right', borderBottom: `1px solid ${T.borderSoft}`, color: T.textMuted }}>Rate</th>
                          <th style={{ padding: 6, textAlign: 'right', borderBottom: `1px solid ${T.borderSoft}`, color: T.textMuted }}>Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(ret.items || []).map((item, idx) => (
                          <tr key={`hist-item-${idx}`} style={{ borderBottom: `1px solid ${T.accent}` }}>
                            <td style={{ padding: 6, color: T.textDark, fontWeight: 500 }}>
                              {item.product}
                              {item.size && <span style={{ fontSize: 10, color: T.textMuted }}> ({item.size})</span>}
                            </td>
                            <td style={{ padding: 6, textAlign: 'center', color: T.textMuted }}>{item.unit}</td>
                            <td style={{ padding: 6, textAlign: 'right', color: '#B91C1C', fontWeight: 600 }}>
                              {parseFloat(item.returnQty).toFixed(3)}
                              {item.returnPcs && parseFloat(item.returnPcs) !== parseFloat(item.returnQty) && (
                                <span style={{ fontSize: 10, color: T.textMuted }}> ({item.returnPcs} pcs)</span>
                              )}
                            </td>
                            <td style={{ padding: 6, textAlign: 'right', color: T.textDark }}>₹{parseFloat(item.rate).toLocaleString()}</td>
                            <td style={{ padding: 6, textAlign: 'right', fontWeight: 600, color: '#B91C1C' }}>
                              -₹{parseFloat(item.returnAmount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══════ SUCCESS MODAL ══════ */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: T.modalBg, borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 440, width: '90%', boxShadow: `0 8px 40px ${T.shadowStrong}` }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: T.successBg }}>
              <CheckCircle size={32} style={{ color: T.successColor }} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: T.textDark }}>Goods Return Created!</h3>
            <p style={{ fontFamily: 'monospace', margin: '8px 0 20px', color: '#B91C1C', fontSize: 16, fontWeight: 600 }}>{lastReturnNo}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
              <button className="btn-teal" onClick={() => openPDFView(lastReturnHTML)}>
                <Eye size={16} /> View
              </button>
              <button className="btn-maroon" style={{ background: 'linear-gradient(135deg,#B91C1C,#DC2626)' }} onClick={() => openPDFPrint(lastReturnHTML)}>
                <Printer size={16} /> Print
              </button>
              <button className="btn-blue" onClick={() => {
                const w = window.open('', '_blank');
                w.document.write(lastReturnHTML);
                w.document.close();
                setTimeout(() => {
                  const ab = w.document.querySelector('.action-bar');
                  if (ab) ab.style.display = 'none';
                  w.print();
                  setTimeout(() => { if (ab) ab.style.display = 'flex'; }, 1200);
                }, 600);
              }}>
                <Download size={16} /> Save PDF
              </button>
            </div>
            <button className="btn-white" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSuccess(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}