// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Loader2, PlusCircle, Search } from 'lucide-react';

// // ========== THEMES ==========
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

// export default function CustomerLedger() {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [customerInput, setCustomerInput] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   const [ledger, setLedger] = useState([]);
//   const [totals, setTotals] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const T = darkMode ? DARK : LIGHT;

//   // Payment modal (per challan)
//   const [showModal, setShowModal] = useState(false);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentNotes, setPaymentNotes] = useState('');
//   const [saving, setSaving] = useState(false);

//   // Bulk payment modal
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
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
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
//     } catch (err) {
//       console.error(err);
//       setCustomers([]);
//       setFilteredCustomers([]);
//     }
//   };

//   const fetchLedger = async (customer) => {
//     if (!customer) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/billing-backend/customer-ledger?customerName=${encodeURIComponent(customer)}`);
//       const data = await res.json();
//       if (data.success && data.data) {
//         setLedger(Array.isArray(data.data.ledger) ? data.data.ledger : []);
//         setTotals(data.data.totals || null);
//       } else {
//         setLedger([]);
//         setTotals(null);
//       }
//     } catch (err) {
//       console.error(err);
//       setLedger([]);
//       setTotals(null);
//     }
//     setLoading(false);
//   };

//   const handleCustomerInputChange = (e) => {
//     const val = e.target.value;
//     setCustomerInput(val);
//     setSelectedCustomer('');
//     const filtered = customers.filter(c => c.customerName.toLowerCase().includes(val.toLowerCase()));
//     setFilteredCustomers(filtered);
//     setShowDropdown(true);
//   };

//   const selectCustomer = (customerName) => {
//     setCustomerInput(customerName);
//     setSelectedCustomer(customerName);
//     setShowDropdown(false);
//     fetchLedger(customerName);
//   };

//   const openPaymentModal = (challan) => {
//     if (!challan || !challan.challanNo) {
//       alert('Error: Challan number is missing. Cannot record payment.');
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
//     if (!selectedChallan || !selectedChallan.challanNo) {
//       alert('Challan number missing. Cannot proceed.');
//       return;
//     }
//     const amount = parseFloat(paymentAmount);
//     if (isNaN(amount) || amount <= 0) {
//       alert('Enter valid amount');
//       return;
//     }
//     setSaving(true);
//     try {
//       const payload = {
//         payment: {
//           challanNo: selectedChallan.challanNo,
//           customerName: selectedCustomer,
//           amount,
//           paymentDate,
//           mode: paymentMode,
//           notes: paymentNotes,
//         }
//       };
//       const res = await fetch('/api/billing-backend/payments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.error);
//       alert(`✅ Payment recorded for challan ${selectedChallan.challanNo}`);
//       setShowModal(false);
//       fetchLedger(selectedCustomer);
//     } catch (err) {
//       alert('Error: ' + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const recordBulkPayment = async () => {
//     if (!selectedCustomer) {
//       alert('Please select a customer first');
//       return;
//     }
//     const amount = parseFloat(bulkAmount);
//     if (isNaN(amount) || amount <= 0) {
//       alert('Enter valid amount');
//       return;
//     }
//     setBulkSaving(true);
//     try {
//       const payload = {
//         payment: {
//           challanNo: '',
//           customerName: selectedCustomer,
//           amount,
//           paymentDate: bulkDate,
//           mode: bulkMode,
//           notes: `Bulk payment - ${bulkNotes || 'No notes'}`,
//         }
//       };
//       const res = await fetch('/api/billing-backend/payments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.error);
//       alert(`✅ Bulk payment of ₹${amount} recorded for ${selectedCustomer}`);
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

//   // Safe render
//   if (loading && ledger.length === 0) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', padding: 40, background: T.pageBg }}>
//         <Loader2 className="animate-spin" size={40} style={{ color: T.maroon }} />
//       </div>
//     );
//   }

//   return (
//     <div style={{ background: T.pageBg, minHeight: '100vh', padding: 20 }}>
//       <h1 style={{ color: T.maroon, marginBottom: 20 }}>Customer Ledger</h1>

//       {/* Search + Bulk Payment */}
//       <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
//         <div style={{ position: 'relative', flex: 1, minWidth: 250 }} ref={dropdownRef}>
//           <div style={{ position: 'relative' }}>
//             <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
//             <input
//               type="text"
//               value={customerInput}
//               onChange={handleCustomerInputChange}
//               onFocus={() => setShowDropdown(true)}
//               placeholder="Type customer name..."
//               style={{
//                 width: '100%',
//                 padding: '10px 10px 10px 34px',
//                 borderRadius: 12,
//                 border: `1px solid ${T.borderSoft}`,
//                 background: T.cardBg,
//                 color: T.textDark,
//                 outline: 'none'
//               }}
//             />
//           </div>
//           {showDropdown && filteredCustomers.length > 0 && (
//             <div style={{
//               position: 'absolute',
//               top: '100%',
//               left: 0,
//               right: 0,
//               background: T.cardBg,
//               border: `1px solid ${T.borderSoft}`,
//               borderRadius: 12,
//               maxHeight: 250,
//               overflowY: 'auto',
//               zIndex: 10,
//               marginTop: 4,
//             }}>
//               {filteredCustomers.map(c => (
//                 <div
//                   key={c.customerName}
//                   onClick={() => selectCustomer(c.customerName)}
//                   style={{
//                     padding: '8px 12px',
//                     cursor: 'pointer',
//                     borderBottom: `1px solid ${T.borderSoft}`,
//                     color: T.textDark,
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
//                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                 >
//                   {c.customerName}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         {selectedCustomer && (
//           <button
//             onClick={() => setShowBulkModal(true)}
//             style={{
//               background: T.maroon,
//               color: '#fff',
//               padding: '8px 16px',
//               borderRadius: 10,
//               border: 'none',
//               cursor: 'pointer',
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: 6,
//             }}
//           >
//             <PlusCircle size={16} /> Bulk Payment
//           </button>
//         )}
//       </div>

//       {/* Ledger Table */}
//       {selectedCustomer && ledger.length > 0 ? (
//         <>
//           <div style={{ background: T.cardBg, borderRadius: 16, overflowX: 'auto', marginBottom: 24 }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ background: T.maroon, color: '#fff' }}>
//                   <th style={{ padding: 12, textAlign: 'left' }}>Challan No</th>
//                   <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
//                   <th style={{ padding: 12, textAlign: 'right' }}>Amount (₹)</th>
//                   <th style={{ padding: 12, textAlign: 'right' }}>Returns (₹)</th>
//                   <th style={{ padding: 12, textAlign: 'right' }}>Received (₹)</th>
//                   <th style={{ padding: 12, textAlign: 'right' }}>Balance (₹)</th>
//                   <th style={{ padding: 12, textAlign: 'center' }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ledger.map(row => (
//                   <tr key={row.challanNo} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
//                     <td style={{ padding: 10 }}>{row.challanNo}</td>
//                     <td style={{ padding: 10 }}>{new Date(row.date).toLocaleDateString()}</td>
//                     <td style={{ padding: 10, textAlign: 'right' }}>₹{row.amount.toFixed(2)}</td>
//                     <td style={{ padding: 10, textAlign: 'right', color: '#B91C1C' }}>₹{row.returns.toFixed(2)}</td>
//                     <td style={{ padding: 10, textAlign: 'right', color: T.successColor }}>₹{row.payments.toFixed(2)}</td>
//                     <td style={{ padding: 10, textAlign: 'right', fontWeight: 'bold', color: row.due > 0 ? '#B91C1C' : T.successColor }}>
//                       ₹{row.due.toFixed(2)}
//                     </td>
//                     <td style={{ padding: 10, textAlign: 'center' }}>
//                       {row.due > 0 && (
//                         <button
//                           onClick={() => openPaymentModal(row)}
//                           style={{
//                             background: T.maroon,
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: 8,
//                             padding: '6px 12px',
//                             cursor: 'pointer',
//                             display: 'inline-flex',
//                             alignItems: 'center',
//                             gap: 6,
//                             fontSize: 12,
//                           }}
//                         >
//                           <PlusCircle size={14} /> Receive
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {totals && (
//             <div style={{ background: T.cardBg, padding: 20, borderRadius: 16, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between' }}>
//               <div><strong>Total Billed:</strong> ₹{totals.totalBilled.toFixed(2)}</div>
//               <div><strong>Total Returns:</strong> <span style={{ color: '#B91C1C' }}>₹{totals.totalReturns.toFixed(2)}</span></div>
//               <div><strong>Total Payments:</strong> <span style={{ color: T.successColor }}>₹{totals.totalPayments.toFixed(2)}</span></div>
//               <div><strong>Outstanding:</strong> <span style={{ fontWeight: 'bold', color: totals.totalDue > 0 ? '#B91C1C' : T.successColor }}>₹{totals.totalDue.toFixed(2)}</span></div>
//             </div>
//           )}
//         </>
//       ) : selectedCustomer && !loading ? (
//         <div style={{ textAlign: 'center', padding: 40, background: T.cardBg, borderRadius: 16 }}>
//           No challans found for this customer.
//         </div>
//       ) : null}

//       {/* Per‑challan Payment Modal */}
//       {showModal && selectedChallan && (
//         <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
//           <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
//             <h3>Record Payment for {selectedChallan.challanNo}</h3>
//             <div style={{ marginBottom: 12 }}>
//               <label>Amount (₹)</label>
//               <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} />
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label>Date</label>
//               <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} />
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label>Mode</label>
//               <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }}>
//                 <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
//               </select>
//             </div>
//             <div style={{ marginBottom: 20 }}>
//               <label>Notes</label>
//               <input type="text" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} />
//             </div>
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
//               <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: T.creamDark, border: `1px solid ${T.borderSoft}`, borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
//               <button onClick={recordPayment} disabled={saving} style={{ padding: '8px 16px', background: T.maroon, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
//                 {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Payment'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk Payment Modal */}
//       {showBulkModal && selectedCustomer && (
//         <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowBulkModal(false)}>
//           <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
//             <h3>Bulk Payment for {selectedCustomer}</h3>
//             <div style={{ marginBottom: 12 }}>
//               <label>Amount (₹)</label>
//               <input type="number" value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} />
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label>Date</label>
//               <input type="date" value={bulkDate} onChange={e => setBulkDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} />
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label>Mode</label>
//               <select value={bulkMode} onChange={e => setBulkMode(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }}>
//                 <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
//               </select>
//             </div>
//             <div style={{ marginBottom: 20 }}>
//               <label>Notes</label>
//               <input type="text" value={bulkNotes} onChange={e => setBulkNotes(e.target.value)} placeholder="Optional remark" style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} />
//             </div>
//             <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
//               <button onClick={() => setShowBulkModal(false)} style={{ padding: '8px 16px', background: T.creamDark, border: `1px solid ${T.borderSoft}`, borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
//               <button onClick={recordBulkPayment} disabled={bulkSaving} style={{ padding: '8px 16px', background: T.maroon, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
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

import { useState, useEffect, useRef } from 'react';
import { Loader2, PlusCircle, Search, ChevronDown, ChevronUp, Download } from 'lucide-react';

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

// ========== PDF GENERATION ==========
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
.ktp-header{background:linear-gradient(135deg,#5a1515,#7B1E1E,#9a2828);color:#fff;padding:22px 30px 20px;display:flex;align-items:center;gap:24px;}
.ktp-logo-circle{width:100px;height:100px;border-radius:50%;border:4px solid rgba(255,255,255,0.95);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 3px 12px rgba(0,0,0,0.3);}
.ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:54px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;text-shadow:2px 2px 3px rgba(0,0,0,0.25);letter-spacing:1px}
.ktp-brand-sub{font-size:26px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:4px;opacity:0.98;margin-top:4px}
.ktp-brand-addr{font-size:12.5px;margin-top:8px;opacity:1;letter-spacing:0.2px;font-weight:600;white-space:nowrap;}
.ktp-header-right-space{width:100px;flex-shrink:0}
.ktp-meta{display:flex;justify-content:space-between;align-items:flex-start;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:7px 18px;background:#FBF6F0;}
.ktp-meta-left{display:flex;flex-direction:column;gap:2px}
.ktp-since{font-size:11.5px;font-style:italic;color:#5a4040;font-weight:500}
.ktp-gstin{font-size:13.5px;font-weight:bold;color:#7B1E1E;letter-spacing:0.5px}
.ktp-dc-box{text-align:right}
.ktp-dc-title{font-size:20px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:2px;padding:2px 12px;display:inline-block;}
.ktp-dc-details{font-size:13px;margin-top:3px;color:#222;font-weight:500}
.ktp-info{padding:8px 14px;background:#fff;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;}
.ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;flex:1;}
table.items{width:100%;border-collapse:collapse}
table.items thead tr{background:linear-gradient(135deg,#5a1515,#7B1E1E)}
table.items th{padding:8px 10px;font-size:13px;font-weight:bold;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:0.5px;}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #ddd}
table.items tbody tr:nth-child(even){background:#FAFAFA}
table.items tbody tr:nth-child(odd){background:#fff}
table.items td{padding:6px 10px;font-size:14px;border-right:1px solid #d8d8d8;vertical-align:top;line-height:1.4;color:#000;font-weight:500}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
table.items td.c{text-align:center}
.ktp-footer{border:2px solid #7B1E1E;border-top:none;display:flex;background:#fff;padding:12px 18px;justify-content:space-between}
.ktp-footer-left{flex:1}
.ktp-footer-right{text-align:right}
@media print{
.action-bar{display:none!important}
.page-wrapper{width:100%!important;margin:0!important}
.ktp-header{background:#7B1E1E!important;-webkit-print-color-adjust:exact}
table.items thead tr{background:#7B1E1E!important}
}
@page{size:A4;margin:0}
`;

// Updated PDF generator: second column shows mode along with challan/bulk
function getCustomerLedgerPrintHTML(customerName, transactions, totals) {
  const rows = transactions.map(t => {
    // t.refDisplay is built in downloadLedgerPDF (contains challan or bulk + mode)
    return `<tr>
      <td class="c">${new Date(t.date).toLocaleDateString('en-IN')}</td>
      <td class="tl">${t.refDisplay || ''}</td>
      <td class="r">${t.paymentAmount ? '₹' + t.paymentAmount.toFixed(2) : ''}</td>
      <td class="r">${t.billedAmount ? '₹' + t.billedAmount.toFixed(2) : ''}</td>
      <td class="r"><strong>₹${t.runningBalance.toFixed(2)}</strong></td>
    </tr>`;
  }).join('');

  const totalRow = `
    <tr style="background:#f0e6da; font-weight:bold;">
      <td colspan="2" class="tl">Totals</td>
      <td class="r">₹${totals.totalPayments.toFixed(2)}</td>
      <td class="r">₹${totals.totalBilled.toFixed(2)}</td>
      <td class="r">₹${totals.outstanding.toFixed(2)}</td>
    </tr>
  `;

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <title>Ledger - ${customerName}</title>
    <style>${PRINT_CSS}</style>
  </head>
  <body>
    <div class="action-bar">
      <button class="action-btn btn-print" onclick="window.print()">🖨️ Print</button>
      <button class="action-btn btn-save" onclick="savePDF()">💾 Save PDF</button>
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
            <div class="ktp-dc-title">CUSTOMER LEDGER</div>
            <div class="ktp-dc-details">Customer: <strong>${customerName}</strong></div>
            <div class="ktp-dc-details">Period: All Transactions</div>
          </div>
        </div>
        <div class="ktp-table-wrap">
          <table class="items">
            <thead>
              <tr>
                <th style="width:90px">Date</th>
                <th class="tl">Challan No / Payment Ref (Mode)</th>
                <th style="width:110px">Payment (₹)</th>
                <th style="width:110px">Billed (₹)</th>
                <th style="width:110px">Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              ${totalRow}
            </tbody>
          </table>
        </div>
        <div class="ktp-footer">
          <div class="ktp-footer-left">
            Certified that the above particulars are true and correct.
          </div>
          <div class="ktp-footer-right">
            For Krishna Timber & Plywoods<br/>
            Authorised Signatory
          </div>
        </div>
      </div>
    </div>
    <script>
      function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}
    </script>
  </body>
  </html>`;
}

export default function CustomerLedger() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerInput, setCustomerInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [ledger, setLedger] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPayments, setShowPayments] = useState(true);
  const T = darkMode ? DARK : LIGHT;

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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
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
    } catch (err) {
      console.error(err);
      setCustomers([]);
      setFilteredCustomers([]);
    }
  };

  const fetchLedger = async (customer) => {
    if (!customer) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/billing-backend/customer-ledger?customerName=${encodeURIComponent(customer)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setLedger(Array.isArray(data.data.ledger) ? data.data.ledger : []);
        setPaymentsList(Array.isArray(data.data.payments) ? data.data.payments : []);
        setTotals(data.data.totals || null);
      } else {
        setLedger([]);
        setPaymentsList([]);
        setTotals(null);
      }
    } catch (err) {
      console.error(err);
      setLedger([]);
      setPaymentsList([]);
      setTotals(null);
    }
    setLoading(false);
  };

  const handleCustomerInputChange = (e) => {
    const val = e.target.value;
    setCustomerInput(val);
    setSelectedCustomer('');
    const filtered = customers.filter(c => c.customerName.toLowerCase().includes(val.toLowerCase()));
    setFilteredCustomers(filtered);
    setShowDropdown(true);
  };

  const selectCustomer = (customerName) => {
    setCustomerInput(customerName);
    setSelectedCustomer(customerName);
    setShowDropdown(false);
    fetchLedger(customerName);
  };

  const openPaymentModal = (challan) => {
    if (!challan || !challan.challanNo) {
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
    if (!selectedChallan || !selectedChallan.challanNo) {
      alert('Challan number missing');
      return;
    }
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid amount');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        payment: {
          challanNo: selectedChallan.challanNo,
          customerName: selectedCustomer,
          amount,
          paymentDate,
          mode: paymentMode,
          notes: paymentNotes,
        }
      };
      const res = await fetch('/api/billing-backend/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    if (!selectedCustomer) {
      alert('Select a customer first');
      return;
    }
    const amount = parseFloat(bulkAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid amount');
      return;
    }
    setBulkSaving(true);
    try {
      const payload = {
        payment: {
          challanNo: '',
          customerName: selectedCustomer,
          amount,
          paymentDate: bulkDate,
          mode: bulkMode,
          notes: `Bulk - ${bulkNotes || ''}`,
        }
      };
      const res = await fetch('/api/billing-backend/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  // Updated PDF generation: includes mode in reference column
  const downloadLedgerPDF = () => {
    if (!selectedCustomer || !ledger.length) {
      alert('No customer selected or no data');
      return;
    }
    let allEntries = [];
    // Add challans (billed entries) – no mode needed
    ledger.forEach(ch => {
      allEntries.push({
        date: ch.date,
        refDisplay: ch.challanNo, // just challan number
        billedAmount: ch.amount,
        paymentAmount: 0,
      });
    });
    // Add payment entries with mode
    paymentsList.forEach(p => {
      let refDisplay = '';
      if (p.challanNo) {
        // per‑challan payment: show "CHL-123 (Cash)"
        refDisplay = `${p.challanNo} (${p.mode})`;
      } else {
        // bulk payment: show "Bulk - Cash"
        refDisplay = `${p.mode}`;
      }
      allEntries.push({
        date: p.paymentDate,
        refDisplay,
        billedAmount: 0,
        paymentAmount: p.amount,
      });
    });
    // Sort by date
    allEntries.sort((a,b) => new Date(a.date) - new Date(b.date));
    let balance = 0;
    const transactions = allEntries.map(entry => {
      balance += entry.billedAmount - entry.paymentAmount;
      return {
        date: entry.date,
        refDisplay: entry.refDisplay,
        billedAmount: entry.billedAmount,
        paymentAmount: entry.paymentAmount,
        runningBalance: balance,
      };
    });
    const totalsForPDF = {
      totalBilled: totals?.totalBilled || 0,
      totalPayments: totals?.totalPayments || 0,
      outstanding: totals?.totalDue || 0,
    };
    const html = getCustomerLedgerPrintHTML(selectedCustomer, transactions, totalsForPDF);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  };

  if (loading && ledger.length === 0 && paymentsList.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40, background: T.pageBg }}>
        <Loader2 className="animate-spin" size={40} style={{ color: T.maroon }} />
      </div>
    );
  }

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', padding: 20 }}>
      <h1 style={{ color: T.maroon, marginBottom: 20 }}>Customer Ledger</h1>

      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }} ref={dropdownRef}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input
              type="text"
              value={customerInput}
              onChange={handleCustomerInputChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Type customer name..."
              style={{
                width: '100%',
                padding: '10px 10px 10px 34px',
                borderRadius: 12,
                border: `1px solid ${T.borderSoft}`,
                background: T.cardBg,
                color: T.textDark,
                outline: 'none'
              }}
            />
          </div>
          {showDropdown && filteredCustomers.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: T.cardBg,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 12,
              maxHeight: 250,
              overflowY: 'auto',
              zIndex: 10,
              marginTop: 4,
            }}>
              {filteredCustomers.map(c => (
                <div
                  key={c.customerName}
                  onClick={() => selectCustomer(c.customerName)}
                  style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: `1px solid ${T.borderSoft}`, color: T.textDark }}
                  onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {c.customerName}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedCustomer && (
          <>
            <button onClick={() => setShowBulkModal(true)} style={{ background: T.maroon, color: '#fff', padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <PlusCircle size={16} /> Bulk Payment
            </button>
            <button onClick={downloadLedgerPDF} style={{ background: T.maroon, color: '#fff', padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Download size={16} /> Download PDF
            </button>
          </>
        )}
      </div>

      {selectedCustomer && (
        <>
          {totals && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ background: T.cardBg, padding: 16, borderRadius: 16, border: `1px solid ${T.borderSoft}` }}>
                <div style={{ fontSize: 14, color: T.textMuted }}>Total Billed</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: T.textDark }}>₹{totals.totalBilled.toFixed(2)}</div>
              </div>
              <div style={{ background: T.cardBg, padding: 16, borderRadius: 16, border: `1px solid ${T.borderSoft}` }}>
                <div style={{ fontSize: 14, color: T.textMuted }}>Total Payment Received</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: T.successColor }}>₹{totals.totalPayments.toFixed(2)}</div>
              </div>
              <div style={{ background: T.cardBg, padding: 16, borderRadius: 16, border: `1px solid ${T.borderSoft}` }}>
                <div style={{ fontSize: 14, color: T.textMuted }}>Outstanding</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: totals.totalDue > 0 ? '#B91C1C' : T.successColor }}>₹{totals.totalDue.toFixed(2)}</div>
              </div>
            </div>
          )}

          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Challan Summary</h2>
          {ledger.length > 0 ? (
            <div style={{ background: T.cardBg, borderRadius: 16, overflowX: 'auto', marginBottom: 32 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: T.maroon, color: '#fff' }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>Challan No</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Amount (₹)</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Returns (₹)</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Received (₹)</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Balance (₹)</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map(row => (
                    <tr key={row.challanNo} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                      <td style={{ padding: 10 }}>{row.challanNo}</td>
                      <td style={{ padding: 10 }}>{new Date(row.date).toLocaleDateString()}</td>
                      <td style={{ padding: 10, textAlign: 'right' }}>₹{row.amount.toFixed(2)}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#B91C1C' }}>₹{row.returns.toFixed(2)}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: T.successColor }}>₹{row.payments.toFixed(2)}</td>
                      <td style={{ padding: 10, textAlign: 'right', fontWeight: 'bold', color: row.due > 0 ? '#B91C1C' : T.successColor }}>
                        ₹{row.due.toFixed(2)}
                      </td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        {row.due > 0 && (
                          <button onClick={() => openPaymentModal(row)} style={{ background: T.maroon, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>
                            <PlusCircle size={14} /> Receive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, background: T.cardBg, borderRadius: 16, marginBottom: 32 }}>No challans found for this customer.</div>
          )}

          <div style={{ marginBottom: 32 }}>
            <button onClick={() => setShowPayments(!showPayments)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: T.cream, border: `1px solid ${T.borderSoft}`, borderRadius: 12, cursor: 'pointer', fontWeight: 'bold', color: T.textDark }}>
              <span>💸 Payment Receipts ({paymentsList.length})</span>
              {showPayments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {showPayments && (
              <div style={{ marginTop: 12, background: T.cardBg, borderRadius: 16, overflowX: 'auto' }}>
                {paymentsList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: T.maroon, color: '#fff' }}>
                        <th style={{ padding: 10, textAlign: 'left' }}>Payment ID</th>
                        <th style={{ padding: 10, textAlign: 'left' }}>Date</th>
                        <th style={{ padding: 10, textAlign: 'left' }}>Challan No</th>
                        <th style={{ padding: 10, textAlign: 'right' }}>Amount (₹)</th>
                        <th style={{ padding: 10, textAlign: 'left' }}>Mode</th>
                        <th style={{ padding: 10, textAlign: 'left' }}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsList.map(p => (
                        <tr key={p.paymentId} style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
                          <td style={{ padding: 8 }}>{p.paymentId}</td>
                          <td style={{ padding: 8 }}>{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td style={{ padding: 8 }}>{p.challanNo || 'Bulk Payment'}</td>
                          <td style={{ padding: 8, textAlign: 'right', color: T.successColor }}>₹{p.amount.toFixed(2)}</td>
                          <td style={{ padding: 8 }}>{p.mode}</td>
                          <td style={{ padding: 8 }}>{p.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: T.textMuted }}>No payments recorded yet.</div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Payment Modals (unchanged) */}
      {showModal && selectedChallan && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
            <h3>Record Payment for {selectedChallan.challanNo}</h3>
            <div style={{ marginBottom: 12 }}><label>Amount (₹)</label><input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} /></div>
            <div style={{ marginBottom: 12 }}><label>Date</label><input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} /></div>
            <div style={{ marginBottom: 12 }}><label>Mode</label><select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }}><option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option></select></div>
            <div style={{ marginBottom: 20 }}><label>Notes</label><input type="text" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} /></div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: T.creamDark, border: `1px solid ${T.borderSoft}`, borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={recordPayment} disabled={saving} style={{ padding: '8px 16px', background: T.maroon, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Payment'}</button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && selectedCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlayBg, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowBulkModal(false)}>
          <div style={{ background: T.cardBg, borderRadius: 20, padding: 24, width: 400, maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
            <h3>Bulk Payment for {selectedCustomer}</h3>
            <div style={{ marginBottom: 12 }}><label>Amount (₹)</label><input type="number" value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} /></div>
            <div style={{ marginBottom: 12 }}><label>Date</label><input type="date" value={bulkDate} onChange={e => setBulkDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} /></div>
            <div style={{ marginBottom: 12 }}><label>Mode</label><select value={bulkMode} onChange={e => setBulkMode(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }}><option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option></select></div>
            <div style={{ marginBottom: 20 }}><label>Notes</label><input type="text" value={bulkNotes} onChange={e => setBulkNotes(e.target.value)} placeholder="Remark" style={{ width: '100%', padding: 8, borderRadius: 8, border: `1px solid ${T.borderSoft}`, background: T.inputBg, color: T.textDark }} /></div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBulkModal(false)} style={{ padding: '8px 16px', background: T.creamDark, border: `1px solid ${T.borderSoft}`, borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={recordBulkPayment} disabled={bulkSaving} style={{ padding: '8px 16px', background: T.maroon, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{bulkSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Bulk Payment'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}