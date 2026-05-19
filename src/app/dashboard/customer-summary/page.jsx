'use client';

import { useState, useEffect } from 'react';
import { Loader2, Download } from 'lucide-react';

const LIGHT = {
  maroon: '#7B1E1E', maroonDark: '#5a1515', cream: '#FBF6F0',
  creamDark: '#F0E6DA', textDark: '#2a1010', textMuted: '#6b5454',
  borderSoft: '#E8DCC8', cardBg: '#ffffff', pageBg: '#FBF6F0',
  successColor: '#166534', errorColor: '#dc2626',
};

const DARK = {
  maroon: '#e8a0a0', maroonDark: '#c47070', cream: '#1a1a2e',
  creamDark: '#2a2a45', textDark: '#f0e8e8', textMuted: '#a89999',
  borderSoft: '#3a3a55', cardBg: '#1e1e35', pageBg: '#0f0f1e',
  successColor: '#4ade80', errorColor: '#fca5a5',
};

export default function CustomerSummary() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [summary, setSummary] = useState(null);
  const [allSummaries, setAllSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const T = darkMode ? DARK : LIGHT;

  useEffect(() => {
    const saved = localStorage.getItem('ktp-dark-mode');
    if (saved === 'true') setDarkMode(true);
    fetchAllSummaries();
  }, []);

  const fetchAllSummaries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing-backend/customer-summary');
      const data = await res.json();
      if (data.success) {
        setAllSummaries(data.data);
        setCustomers(data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchSingleSummary = async (customer) => {
    if (!customer) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/billing-backend/customer-summary?customerName=${encodeURIComponent(customer)}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSummary(data.data[0]);
      } else {
        setSummary(null);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCustomerChange = (e) => {
    const cust = e.target.value;
    setSelectedCustomer(cust);
    if (cust) fetchSingleSummary(cust);
    else setSummary(null);
  };

  const exportToCSV = () => {
    const headers = ['Customer Name', 'Total Billed (₹)', 'Total Returns (₹)', 'Net Billed (₹)', 'Total Payments (₹)', 'Outstanding (₹)'];
    const rows = allSummaries.map(c => [
      c.customerName,
      c.totalBilled.toFixed(2),
      c.totalReturns.toFixed(2),
      c.netBilled.toFixed(2),
      c.totalPayments.toFixed(2),
      c.outstanding.toFixed(2),
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && allSummaries.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', background: T.pageBg }}>
        <Loader2 className="animate-spin" size={40} style={{ color: T.maroon }} />
      </div>
    );
  }

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', padding: '20px', transition: 'background 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: T.maroon, margin: 0 }}>Customer Financial Summary</h1>
        <button onClick={exportToCSV} style={{ padding: '8px 16px', background: T.maroon, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={selectedCustomer} onChange={handleCustomerChange} style={{ padding: '10px 14px', borderRadius: 12, border: `1px solid ${T.borderSoft}`, background: T.cardBg, color: T.textDark, fontSize: 14, minWidth: 250 }}>
          <option value="">-- All Customers --</option>
          {allSummaries.map(c => (<option key={c.customerName} value={c.customerName}>{c.customerName}</option>))}
        </select>
        {selectedCustomer && (<button onClick={() => { setSelectedCustomer(''); setSummary(null); fetchAllSummaries(); }} style={{ padding: '8px 16px', background: T.creamDark, border: `1px solid ${T.borderSoft}`, borderRadius: 10, cursor: 'pointer', color: T.textDark }}>Show All</button>)}
      </div>

      {selectedCustomer ? (
        summary ? (
          <div style={{ background: T.cardBg, padding: 24, borderRadius: 20, border: `1px solid ${T.borderSoft}`, marginBottom: 24 }}>
            <h2 style={{ color: T.maroon, marginBottom: 16 }}>{summary.customerName}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ background: T.cream, padding: 16, borderRadius: 16 }}><div style={{ fontSize: 14, color: T.textMuted }}>Total Billed</div><div style={{ fontSize: 24, fontWeight: 'bold', color: T.textDark }}>₹{summary.totalBilled.toFixed(2)}</div></div>
              <div style={{ background: T.cream, padding: 16, borderRadius: 16 }}><div style={{ fontSize: 14, color: T.textMuted }}>Total Returns (Credit)</div><div style={{ fontSize: 24, fontWeight: 'bold', color: '#B91C1C' }}>- ₹{summary.totalReturns.toFixed(2)}</div></div>
              <div style={{ background: T.cream, padding: 16, borderRadius: 16 }}><div style={{ fontSize: 14, color: T.textMuted }}>Net Billed</div><div style={{ fontSize: 24, fontWeight: 'bold', color: T.textDark }}>₹{summary.netBilled.toFixed(2)}</div></div>
              <div style={{ background: T.cream, padding: 16, borderRadius: 16 }}><div style={{ fontSize: 14, color: T.textMuted }}>Total Payments</div><div style={{ fontSize: 24, fontWeight: 'bold', color: T.successColor }}>₹{summary.totalPayments.toFixed(2)}</div></div>
              <div style={{ background: T.cream, padding: 16, borderRadius: 16 }}><div style={{ fontSize: 14, color: T.textMuted }}>Outstanding</div><div style={{ fontSize: 28, fontWeight: 'bold', color: summary.outstanding > 0 ? '#B91C1C' : T.successColor }}>₹{summary.outstanding.toFixed(2)}</div></div>
            </div>
            <h3 style={{ color: T.textDark, marginBottom: 12 }}>Challan-wise Details</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: T.maroon, color: '#fff' }}><th style={{ padding: 10, textAlign: 'left' }}>Challan No</th><th style={{ padding: 10, textAlign: 'left' }}>Date</th><th style={{ padding: 10, textAlign: 'right' }}>Amount (₹)</th></tr></thead>
                <tbody>{summary.challans.map(ch => (<tr key={ch.challanNo} style={{ borderBottom: `1px solid ${T.borderSoft}` }}><td style={{ padding: 8 }}>{ch.challanNo}</td><td style={{ padding: 8 }}>{new Date(ch.date).toLocaleDateString()}</td><td style={{ padding: 8, textAlign: 'right' }}>₹{ch.amount.toFixed(2)}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        ) : (<div style={{ textAlign: 'center', padding: 40, background: T.cardBg, borderRadius: 20 }}><p>No data for selected customer.</p></div>)
      ) : (
        <div style={{ overflowX: 'auto', background: T.cardBg, borderRadius: 20, padding: '0 0 20px 0', boxShadow: `0 1px 8px ${T.shadow}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: T.maroon, color: '#fff' }}><th style={{ padding: 14, textAlign: 'left' }}>Customer Name</th><th style={{ padding: 14, textAlign: 'right' }}>Total Billed</th><th style={{ padding: 14, textAlign: 'right' }}>Total Returns</th><th style={{ padding: 14, textAlign: 'right' }}>Net Billed</th><th style={{ padding: 14, textAlign: 'right' }}>Total Payments</th><th style={{ padding: 14, textAlign: 'right' }}>Outstanding</th></tr></thead>
            <tbody>{allSummaries.map(c => (<tr key={c.customerName} style={{ borderBottom: `1px solid ${T.borderSoft}` }}><td style={{ padding: 12, fontWeight: 600, color: T.textDark }}>{c.customerName}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{c.totalBilled.toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right', color: '#B91C1C' }}>₹{c.totalReturns.toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{c.netBilled.toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{c.totalPayments.toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right', fontWeight: 'bold', color: c.outstanding > 0 ? '#B91C1C' : T.successColor }}>₹{c.outstanding.toFixed(2)}</td></tr>))}</tbody>
            <tfoot><tr style={{ background: T.creamDark, fontWeight: 'bold' }}><td style={{ padding: 12 }}>Grand Total</td><td style={{ padding: 12, textAlign: 'right' }}>₹{allSummaries.reduce((s,c)=>s+c.totalBilled,0).toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{allSummaries.reduce((s,c)=>s+c.totalReturns,0).toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{allSummaries.reduce((s,c)=>s+c.netBilled,0).toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{allSummaries.reduce((s,c)=>s+c.totalPayments,0).toFixed(2)}</td><td style={{ padding: 12, textAlign: 'right' }}>₹{allSummaries.reduce((s,c)=>s+c.outstanding,0).toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      )}
    </div>
  );
}