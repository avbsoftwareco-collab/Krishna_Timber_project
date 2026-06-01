
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import {
  Package, FileText, LogOut, Bell, ChevronDown,
  ShoppingCart, Menu, X, User, Settings, Sun, Moon, RotateCcw, Receipt
} from 'lucide-react';

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
  navBg: '#ffffff',
  cardBg: '#ffffff',
  dropdownBg: '#ffffff',
  pageBg: '#FBF6F0',
  inputBg: '#ffffff',
  hoverBg: '#F0E6DA',
  shadow: 'rgba(123,30,30,0.06)',
  shadowStrong: 'rgba(123,30,30,0.18)',
  notifDot: '#dc2626',
  logoutColor: '#dc2626',
  logoutHover: '#fef2f2',
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
  navBg: '#141425',
  cardBg: '#1e1e35',
  dropdownBg: '#1e1e35',
  pageBg: '#0f0f1e',
  inputBg: '#222240',
  hoverBg: '#2a2a45',
  shadow: 'rgba(0,0,0,0.3)',
  shadowStrong: 'rgba(0,0,0,0.5)',
  notifDot: '#ef4444',
  logoutColor: '#f87171',
  logoutHover: '#2a1a1a',
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [billingDropdownOpen, setBillingDropdownOpen] = useState(false); // ← NEW

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const billingDropdownRef = useRef(null); // ← NEW

  const T = darkMode ? DARK : LIGHT;

  useEffect(() => {
    const saved = localStorage.getItem('ktp-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('ktp-dark-mode', String(next));
      return next;
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        setUserData(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      // ← NEW: Billing dropdown close on outside click
      if (billingDropdownRef.current && !billingDropdownRef.current.contains(event.target)) {
        setBillingDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    router.push('/login');
  };

  const toggleProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  // ── TABS with Billing Dropdown ──
  const BILLING_CHILDREN = [
    { label: 'Challan', path: '/dashboard/billing', icon: <FileText className="w-4 h-4" /> },
    { label: 'Quotation', path: '/dashboard/quotation', icon: <FileText className="w-4 h-4" /> },
  ];

  const tabs = [
    {
      label: 'Billing',
      path: '/dashboard/billing',
      icon: <FileText className="w-4 h-4" />,
      hasDropdown: true,
      children: BILLING_CHILDREN,
    },
    {
      label: 'Goods Return',
      path: '/dashboard/goods-return',
      icon: <RotateCcw className="w-4 h-4" />,
    },
    {
      label: 'Customer Ledger',
      path: '/dashboard/customer-ledger',
      icon: <Receipt className="w-4 h-4" />,
    },
  ];

  // Check if any billing child is active
  const isBillingActive = BILLING_CHILDREN.some(c => pathname === c.path || pathname.startsWith(c.path + '/'));
  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const KTPFallback = () => (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <text x="30" y="40" textAnchor="middle" fontSize="20" fontWeight="900"
        fontFamily="Georgia,serif" fill="#fff">KTP</text>
    </svg>
  );

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: T.pageBg }}>

      <style jsx global>{`
        @keyframes nav-dropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-dropdown-anim {
          animation: nav-dropdown 0.18s ease-out;
        }
        .dm-transition,
        .dm-transition * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        @keyframes moon-rise {
          from { transform: translateY(4px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .dark-toggle-icon {
          animation: moon-rise 0.3s ease-out;
        }
        /* Billing sub-dropdown arrow rotation */
        .billing-arrow {
          transition: transform 0.2s ease;
        }
        .billing-arrow.open {
          transform: rotate(180deg);
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 h-16 dm-transition"
        style={{
          background: T.navBg,
          borderBottom: `1px solid ${T.borderSoft}`,
          boxShadow: `0 1px 8px ${T.shadow}`
        }}
      >
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/dashboard/billing" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: 'transparent', boxShadow: 'none' }}>
              {!logoError ? (
                <Image src="/logo.jpeg" alt="Krishna Timber" width={32} height={32}
                  style={{ objectFit: 'contain', filter: 'none' }}
                  onError={() => setLogoError(true)} />
              ) : (
                <KTPFallback />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 style={{ color: T.textDark, fontFamily: 'Georgia, serif' }}>Krishna</h1>
              <p style={{ color: T.maroon }}>Timber & Plywoods</p>
            </div>
          </Link>

          {/* ── CENTER TABS (desktop) ── */}
          <div
            className="hidden md:flex items-center gap-2 rounded-xl p-1 dm-transition"
            style={{ background: T.cream, border: `1px solid ${T.borderSoft}` }}
          >
            {tabs.map(tab => {
              // ── Billing Tab with Dropdown ──
              if (tab.hasDropdown) {
                return (
                  <div key={tab.path} className="relative" ref={billingDropdownRef}>
                    <button
                      onClick={() => setBillingDropdownOpen(prev => !prev)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
                      style={
                        isBillingActive
                          ? {
                              background: darkMode
                                ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                                : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                              color: '#fff',
                              boxShadow: `0 2px 8px ${T.shadowStrong}`,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }
                          : {
                              color: T.maroon,
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }
                      }
                    >
                      {tab.icon}
                      {tab.label}
                      <ChevronDown
                        className={`w-3 h-3 billing-arrow ${billingDropdownOpen ? 'open' : ''}`}
                        style={{ color: isBillingActive ? '#fff' : T.maroon }}
                      />
                    </button>

                    {/* Billing Dropdown Menu */}
                    {billingDropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 w-44 rounded-xl overflow-hidden nav-dropdown-anim z-50"
                        style={{
                          background: T.dropdownBg,
                          border: `1px solid ${T.borderSoft}`,
                          boxShadow: `0 12px 40px ${T.shadowStrong}`,
                        }}
                      >
                        {tab.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={() => setBillingDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold no-underline"
                            style={
                              isActive(child.path)
                                ? {
                                    background: darkMode
                                      ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                                      : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                                    color: '#fff',
                                  }
                                : {
                                    color: T.textDark,
                                    transition: 'background 0.15s',
                                  }
                            }
                            onMouseEnter={e => {
                              if (!isActive(child.path))
                                e.currentTarget.style.background = T.hoverBg;
                            }}
                            onMouseLeave={e => {
                              if (!isActive(child.path))
                                e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <span style={{ color: isActive(child.path) ? '#fff' : T.maroon }}>
                              {child.icon}
                            </span>
                            {child.label}
                            {isActive(child.path) && (
                              <span
                                className="ml-auto w-2 h-2 rounded-full"
                                style={{ background: '#fff' }}
                              />
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // ── Normal Tab ──
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold no-underline"
                  style={
                    isActive(tab.path)
                      ? {
                          background: darkMode
                            ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                            : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                          color: '#fff',
                          boxShadow: `0 2px 8px ${T.shadowStrong}`,
                          transition: 'all 0.2s'
                        }
                      : {
                          color: T.maroon,
                          background: 'transparent',
                          transition: 'all 0.2s'
                        }
                  }
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="flex items-center gap-1.5">

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" style={{ color: T.textDark }} />
                : <Menu className="w-5 h-5" style={{ color: T.textDark }} />
              }
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg relative overflow-hidden"
              style={{
                background: darkMode ? T.creamDark : 'transparent',
                border: `1px solid ${darkMode ? T.borderSoft : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="dark-toggle-icon" key={darkMode ? 'moon' : 'sun'}>
                {darkMode
                  ? <Sun className="w-5 h-5" style={{ color: '#fbbf24' }} />
                  : <Moon className="w-5 h-5" style={{ color: T.textMuted }} />
                }
              </div>
            </button>

            {/* Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-lg relative"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Bell className="w-5 h-5" style={{ color: T.textMuted }} />
                <span className="absolute rounded-full"
                  style={{ width: 8, height: 8, top: 7, right: 7, background: T.notifDot, boxShadow: `0 0 0 2px ${T.navBg}` }} />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl py-0 z-50 nav-dropdown-anim overflow-hidden dm-transition"
                  style={{ background: T.dropdownBg, border: `1px solid ${T.borderSoft}`, boxShadow: `0 12px 48px ${T.shadowStrong}` }}>
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.borderSoft}`, background: T.cream }}>
                    <h3 className="font-bold text-sm m-0" style={{ color: T.textDark }}>Notifications</h3>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="px-4 py-3 cursor-pointer"
                      style={{ borderBottom: `1px solid ${T.accent}`, transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <p className="text-sm m-0" style={{ color: T.textDark }}>Order #{100 + i} has been completed</p>
                      <p className="text-xs mt-1 m-0" style={{ color: T.textMuted }}>{i} hour(s) ago</p>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 text-center" style={{ background: T.cream }}>
                    <button className="text-sm font-semibold border-none bg-transparent cursor-pointer" style={{ color: T.maroon }}>
                      View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={toggleProfile}
                className="flex items-center gap-2 p-2 rounded-xl cursor-pointer"
                style={{ background: 'transparent', border: 'none', transition: 'all 0.15s' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                      : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                    boxShadow: `0 2px 8px ${T.shadowStrong}`
                  }}>
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold m-0" style={{ color: T.textDark }}>{userData?.name || 'User'}</p>
                  <p className="text-xs m-0" style={{ color: T.maroon, fontWeight: 600 }}>{userData?.userType || 'Member'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  style={{ color: T.textMuted }} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl py-0 z-50 nav-dropdown-anim overflow-hidden dm-transition"
                  style={{ background: T.dropdownBg, border: `1px solid ${T.borderSoft}`, boxShadow: `0 12px 48px ${T.shadowStrong}` }}>
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.borderSoft}`, background: T.cream }}>
                    <p className="text-sm font-bold m-0" style={{ color: T.textDark }}>{userData?.name || 'User Name'}</p>
                    <p className="text-xs mt-0.5 m-0" style={{ color: T.textMuted }}>{userData?.email || 'email@example.com'}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full font-semibold"
                      style={{ background: T.creamDark, color: T.maroon, border: `1px solid ${T.borderSoft}` }}>
                      {userData?.userType || 'Member'}
                    </span>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: <User className="w-4 h-4" />, label: 'Profile Settings' },
                      { icon: <Settings className="w-4 h-4" />, label: 'Account' },
                    ].map((item, idx) => (
                      <button key={idx} onClick={() => setProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-none bg-transparent cursor-pointer"
                        style={{ color: T.textDark, transition: 'background 0.12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: T.textMuted }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                    <button onClick={toggleDarkMode}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-none bg-transparent cursor-pointer"
                      style={{ color: T.textDark, transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ color: darkMode ? '#fbbf24' : T.textMuted }}>
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </span>
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: darkMode ? '#fbbf2420' : T.creamDark, color: darkMode ? '#fbbf24' : T.textMuted }}>
                        {darkMode ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                  <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                    <button onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-none bg-transparent cursor-pointer"
                      style={{ color: T.logoutColor, transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.logoutHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN TABS ── */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 flex flex-col gap-2 nav-dropdown-anim dm-transition"
            style={{ background: T.navBg, borderTop: `1px solid ${T.borderSoft}`, boxShadow: `0 8px 24px ${T.shadow}` }}>
            
            {/* Billing Section in Mobile */}
            <div style={{ borderBottom: `1px dashed ${T.borderSoft}`, paddingBottom: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px 4px' }}>
                Billing
              </p>
              {BILLING_CHILDREN.map(child => (
                <Link key={child.path} href={child.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline mb-1"
                  style={
                    isActive(child.path)
                      ? {
                          background: darkMode
                            ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                            : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                          color: '#fff',
                          boxShadow: `0 2px 8px ${T.shadowStrong}`
                        }
                      : { color: T.maroon, background: 'transparent' }
                  }>
                  {child.icon}
                  {child.label}
                </Link>
              ))}
            </div>

            {/* Other tabs */}
            {tabs.filter(t => !t.hasDropdown).map(tab => (
              <Link key={tab.path} href={tab.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline"
                style={
                  isActive(tab.path)
                    ? {
                        background: darkMode
                          ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                          : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                        color: '#fff',
                        boxShadow: `0 2px 8px ${T.shadowStrong}`
                      }
                    : { color: T.maroon, background: 'transparent' }
                }>
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex dm-transition"
        style={{ background: T.navBg, borderTop: `1px solid ${T.borderSoft}`, boxShadow: `0 -2px 12px ${T.shadow}` }}>
        
        {/* Billing tab (shows challan active or quotation active) */}
        <Link href="/dashboard/billing"
          className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold no-underline"
          style={{ color: isBillingActive ? T.maroon : T.textMuted }}>
          <span className="p-1.5 rounded-lg" style={{ background: isBillingActive ? T.creamDark : 'transparent' }}>
            <FileText className="w-4 h-4" />
          </span>
          Billing
        </Link>

        {/* Other tabs */}
        {tabs.filter(t => !t.hasDropdown).map(tab => (
          <Link key={tab.path} href={tab.path}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold no-underline"
            style={{ color: isActive(tab.path) ? T.maroon : T.textMuted }}>
            <span className="p-1.5 rounded-lg" style={{ background: isActive(tab.path) ? T.creamDark : 'transparent' }}>
              {tab.icon}
            </span>
            {tab.label.split(' ')[0]}
          </Link>
        ))}
      </div>

      {/* ── PAGE CONTENT ── */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto dm-transition"
        style={{ minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </main>
    </div>
  );
}