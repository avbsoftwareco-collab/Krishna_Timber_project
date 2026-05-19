
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import {
//   Package, FileText, LogOut, Bell, ChevronDown,
//   ShoppingCart, Menu, X, User, Settings
// } from 'lucide-react';

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Refs for dropdown containers
//   const profileRef = useRef(null);
//   const notificationRef = useRef(null);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//       return;
//     }
//     const userStr = sessionStorage.getItem('user');
//     if (userStr) {
//       try {
//         setUserData(JSON.parse(userStr));
//       } catch (e) {
//         console.error('Error parsing user data:', e);
//       }
//     }
//     setLoading(false);
//   }, [router]);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileOpen(false);
//       }
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     router.push('/login');
//   };

//   const toggleProfile = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setProfileOpen(!profileOpen);
//     setNotificationsOpen(false);
//   };

//   const toggleNotifications = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setNotificationsOpen(!notificationsOpen);
//     setProfileOpen(false);
//   };

//   // ✅ ONLY BILLING TAB - Purchase & Inventory HIDDEN
//   const tabs = [
//     { label: 'Billing', path: '/dashboard/billing', icon: <FileText className="w-4 h-4" /> },
//   ];

//   // 🔒 HIDDEN TABS (for reference - not shown in UI)
//   // { label: 'Purchase Order', path: '/dashboard/purchase', icon: <ShoppingCart className="w-4 h-4" /> },
//   // { label: 'Inventory', path: '/dashboard/inventory', icon: <Package className="w-4 h-4" /> },

//   const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

//   // Show loading while checking auth
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">

//       {/* ── NAVBAR ── */}
//       <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-40 h-16">
//         <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

//           {/* Logo */}
//           <Link href="/dashboard/billing" className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-md">
//               <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2L8 8h3v4H8l4 6 4-6h-3V8h3L12 2z"/>
//                 <rect x="10" y="16" width="4" height="6" rx="1"/>
//               </svg>
//             </div>
//             <div className="hidden sm:block">
//               <h1 className="text-lg font-bold text-gray-800 leading-tight">Krishna</h1>
//               <p className="text-xs text-amber-600 uppercase tracking-widest">Timber</p>
//             </div>
//           </Link>

//           {/* ── CENTER TABS (desktop) - Only Billing ── */}
//           <div className="hidden md:flex items-center gap-5 bg-amber-50 rounded-xl p-1">
//             {tabs.map(tab => (
//               <Link
//                 key={tab.path}
//                 href={tab.path}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
//                   ${isActive(tab.path)
//                     ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-200'
//                     : 'text-amber-700 hover:bg-amber-100'
//                   }`}
//               >
//                 {tab.icon}
//                 {tab.label}
//               </Link>
//             ))}
//           </div>

//           {/* ── RIGHT: Bell + User + Mobile Menu ── */}
//           <div className="flex items-center gap-2">

//             {/* Mobile hamburger - Hidden if only 1 tab */}
//             {tabs.length > 1 && (
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="p-2 rounded-lg hover:bg-amber-50 transition-colors md:hidden"
//               >
//                 {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
//               </button>
//             )}

//             {/* Bell - Notifications */}
//             <div className="relative" ref={notificationRef}>
//               <button
//                 onClick={toggleNotifications}
//                 className="p-2 rounded-lg hover:bg-amber-50 transition-colors relative"
//               >
//                 <Bell className="w-6 h-6 text-gray-600" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>

//               {notificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
//                   <div className="px-4 py-2 border-b border-gray-100">
//                     <h3 className="font-semibold text-gray-800">Notifications</h3>
//                   </div>
//                   {[1, 2, 3].map(i => (
//                     <div key={i} className="px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
//                       <p className="text-sm text-gray-800">Order #{100 + i} has been completed</p>
//                       <p className="text-xs text-gray-500 mt-1">{i} hour(s) ago</p>
//                     </div>
//                   ))}
//                   <div className="px-4 py-2 text-center">
//                     <button className="text-amber-600 text-sm font-medium hover:text-amber-700">View All</button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* User Profile Dropdown */}
//             <div className="relative" ref={profileRef}>
//               <button
//                 onClick={toggleProfile}
//                 className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
//               >
//                 <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold text-sm">
//                     {userData?.name?.charAt(0).toUpperCase() || 'U'}
//                   </span>
//                 </div>
//                 <div className="hidden lg:block text-left">
//                   <p className="text-sm font-medium text-gray-800">{userData?.name || 'User'}</p>
//                   <p className="text-xs text-amber-600">{userData?.userType || 'Member'}</p>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {/* Profile Dropdown Menu */}
//               {profileOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
//                   {/* User Info */}
//                   <div className="px-4 py-3 border-b border-gray-100">
//                     <p className="text-sm font-medium text-gray-800">{userData?.name || 'User Name'}</p>
//                     <p className="text-xs text-gray-500">{userData?.email || 'email@example.com'}</p>
//                     <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
//                       {userData?.userType || 'Member'}
//                     </span>
//                   </div>
                  
//                   {/* Menu Items */}
//                   <div className="py-1">
//                     <button 
//                       onClick={() => {
//                         setProfileOpen(false);
//                       }}
//                       className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center gap-3"
//                     >
//                       <User className="w-4 h-4 text-gray-500" />
//                       Profile Settings
//                     </button>
                    
//                     <button 
//                       onClick={() => {
//                         setProfileOpen(false);
//                       }}
//                       className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center gap-3"
//                     >
//                       <Settings className="w-4 h-4 text-gray-500" />
//                       Account
//                     </button>
//                   </div>
                  
//                   {/* Logout */}
//                   <div className="border-t border-gray-100 pt-1">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       Sign Out
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── MOBILE DROPDOWN TABS - Only shows if more than 1 tab ── */}
//         {mobileMenuOpen && tabs.length > 1 && (
//           <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2 shadow-lg">
//             {tabs.map(tab => (
//               <Link
//                 key={tab.path}
//                 href={tab.path}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
//                   ${isActive(tab.path)
//                     ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
//                     : 'text-amber-700 hover:bg-amber-50'
//                   }`}
//               >
//                 {tab.icon}
//                 {tab.label}
//               </Link>
//             ))}
//           </div>
//         )}
//       </nav>

//       {/* ── MOBILE BOTTOM TAB BAR - Only shows if more than 1 tab ── */}
//       {tabs.length > 1 && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden flex">
//           {tabs.map(tab => (
//             <Link
//               key={tab.path}
//               href={tab.path}
//               className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors
//                 ${isActive(tab.path) ? 'text-amber-700' : 'text-gray-400'}`}
//             >
//               <span className={`p-1.5 rounded-lg transition-colors ${isActive(tab.path) ? 'bg-amber-100' : ''}`}>
//                 {tab.icon}
//               </span>
//               {tab.label.split(' ')[0]}
//             </Link>
//           ))}
//         </div>
//       )}

//       {/* ── PAGE CONTENT ── */}
//       <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {children}
//       </main>
//     </div>
//   );
// }




/////////  


'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import {
  Package, FileText, LogOut, Bell, ChevronDown,
  ShoppingCart, Menu, X, User, Settings, Sun, Moon,RotateCcw,Receipt         
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// THEME PALETTES
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

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Active theme
  const T = darkMode ? DARK : LIGHT;

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('ktp-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  // Save dark mode preference
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

 // ✅ YAHAN add karo - tabs array me
const tabs = [
  
  // { 
  //   label: 'Customer Summary',     // ✅ NEW
  //   path: '/dashboard/customer-summary',
  //   icon: <TrendingUp className="w-4 h-4" />
  // },
  { 
    label: 'Billing', 
    path: '/dashboard/billing', 
    icon: <FileText className="w-4 h-4" /> 
  },
  { 
    label: 'Goods Return',        // ✅ NEW
    path: '/dashboard/goods-return',         // ✅ NEW
    icon: <RotateCcw className="w-4 h-4" />  // ✅ NEW
  },

   { label: 'Customer Ledger', path: '/dashboard/customer-ledger', icon: <Receipt className="w-4 h-4" /> },

  
];

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  // ── KTP Fallback Logo SVG ──
  const KTPFallback = () => (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <text x="30" y="40" textAnchor="middle" fontSize="20" fontWeight="900"
        fontFamily="Georgia,serif" fill="#fff">KTP</text>
    </svg>
  );




  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: T.pageBg }}>

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        @keyframes nav-dropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-dropdown-anim {
          animation: nav-dropdown 0.18s ease-out;
        }

        /* Dark mode transition on all elements */
        .dm-transition,
        .dm-transition * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Dark mode toggle button animation */
        @keyframes sun-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(180deg); }
        }
        @keyframes moon-rise {
          from { transform: translateY(4px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .dark-toggle-icon {
          animation: moon-rise 0.3s ease-out;
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
  <div
    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
    // ← Yeh pura style object hata do ya background line delete kar do
    style={{
      background: 'transparent',        // ← Background transparent kar diya
      boxShadow: 'none'                 // ← Shadow bhi hataya (optional)
    }}
  >
    {!logoError ? (
      <Image
        src="/logo.jpeg"
        alt="Krishna Timber"
        width={32}          // thoda bada kar sakte ho
        height={32}
        style={{
          objectFit: 'contain',
          filter: 'none'    // ← filter bhi hata diya (agar logo colorful hai)
        }}
        onError={() => setLogoError(true)}
      />
    ) : (
      <KTPFallback />
    )}
  </div>
  
  {/* Text part same rahega */}
  <div className="hidden sm:block">
    <h1 style={{ color: T.textDark, fontFamily: 'Georgia, serif' }}>
      Krishna
    </h1>
    <p style={{ color: T.maroon }}>
      Timber & Plywoods
    </p>
  </div>
</Link>



          {/* ── CENTER TABS (desktop) ── */}
          <div
            className="hidden md:flex items-center gap-2 rounded-xl p-1 dm-transition"
            style={{ background: T.cream, border: `1px solid ${T.borderSoft}` }}
          >
            {tabs.map(tab => (
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
            ))}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="flex items-center gap-1.5">

            {/* Mobile hamburger */}
            {tabs.length > 1 && (
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
            )}

            {/* ── DARK MODE TOGGLE ── */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg relative overflow-hidden"
              style={{
                background: darkMode ? T.creamDark : 'transparent',
                border: `1px solid ${darkMode ? T.borderSoft : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="dark-toggle-icon" key={darkMode ? 'moon' : 'sun'}>
                {darkMode ? (
                  <Sun className="w-5 h-5" style={{ color: '#fbbf24' }} />
                ) : (
                  <Moon className="w-5 h-5" style={{ color: T.textMuted }} />
                )}
              </div>
            </button>

            {/* Bell - Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-lg relative"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Bell className="w-5 h-5" style={{ color: T.textMuted }} />
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 8, height: 8, top: 7, right: 7,
                    background: T.notifDot,
                    boxShadow: `0 0 0 2px ${T.navBg}`
                  }}
                />
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl py-0 z-50 nav-dropdown-anim overflow-hidden dm-transition"
                  style={{
                    background: T.dropdownBg,
                    border: `1px solid ${T.borderSoft}`,
                    boxShadow: `0 12px 48px ${T.shadowStrong}`
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${T.borderSoft}`,
                      background: T.cream
                    }}
                  >
                    <h3 className="font-bold text-sm m-0" style={{ color: T.textDark }}>
                      Notifications
                    </h3>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="px-4 py-3 cursor-pointer"
                      style={{
                        borderBottom: `1px solid ${T.accent}`,
                        transition: 'background 0.12s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <p className="text-sm m-0" style={{ color: T.textDark }}>
                        Order #{100 + i} has been completed
                      </p>
                      <p className="text-xs mt-1 m-0" style={{ color: T.textMuted }}>
                        {i} hour(s) ago
                      </p>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 text-center" style={{ background: T.cream }}>
                    <button
                      className="text-sm font-semibold border-none bg-transparent cursor-pointer"
                      style={{ color: T.maroon }}
                    >
                      View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 p-2 rounded-xl cursor-pointer"
                style={{
                  background: 'transparent',
                  border: 'none',
                  transition: 'all 0.15s'
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(135deg, #5a2020, #7B1E1E)'
                      : `linear-gradient(135deg, ${LIGHT.maroonDark}, ${LIGHT.maroon})`,
                    boxShadow: `0 2px 8px ${T.shadowStrong}`
                  }}
                >
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold m-0" style={{ color: T.textDark }}>
                    {userData?.name || 'User'}
                  </p>
                  <p className="text-xs m-0" style={{ color: T.maroon, fontWeight: 600 }}>
                    {userData?.userType || 'Member'}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  style={{ color: T.textMuted }}
                />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-xl py-0 z-50 nav-dropdown-anim overflow-hidden dm-transition"
                  style={{
                    background: T.dropdownBg,
                    border: `1px solid ${T.borderSoft}`,
                    boxShadow: `0 12px 48px ${T.shadowStrong}`
                  }}
                >
                  {/* User Info */}
                  <div
                    className="px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${T.borderSoft}`,
                      background: T.cream
                    }}
                  >
                    <p className="text-sm font-bold m-0" style={{ color: T.textDark }}>
                      {userData?.name || 'User Name'}
                    </p>
                    <p className="text-xs mt-0.5 m-0" style={{ color: T.textMuted }}>
                      {userData?.email || 'email@example.com'}
                    </p>
                    <span
                      className="inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full font-semibold"
                      style={{
                        background: T.creamDark,
                        color: T.maroon,
                        border: `1px solid ${T.borderSoft}`
                      }}
                    >
                      {userData?.userType || 'Member'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {[
                      { icon: <User className="w-4 h-4" />, label: 'Profile Settings' },
                      { icon: <Settings className="w-4 h-4" />, label: 'Account' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-none bg-transparent cursor-pointer"
                        style={{ color: T.textDark, transition: 'background 0.12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ color: T.textMuted }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Dark Mode Toggle in dropdown */}
                  <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                    <button
                      onClick={toggleDarkMode}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-none bg-transparent cursor-pointer"
                      style={{ color: T.textDark, transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ color: darkMode ? '#fbbf24' : T.textMuted }}>
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </span>
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                      <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: darkMode ? '#fbbf2420' : T.creamDark,
                          color: darkMode ? '#fbbf24' : T.textMuted
                        }}
                      >
                        {darkMode ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-none bg-transparent cursor-pointer"
                      style={{ color: T.logoutColor, transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.logoutHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
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
        {mobileMenuOpen && tabs.length > 1 && (
          <div
            className="md:hidden px-4 py-3 flex flex-col gap-2 nav-dropdown-anim dm-transition"
            style={{
              background: T.navBg,
              borderTop: `1px solid ${T.borderSoft}`,
              boxShadow: `0 8px 24px ${T.shadow}`
            }}
          >
            {tabs.map(tab => (
              <Link
                key={tab.path}
                href={tab.path}
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
                }
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      {tabs.length > 1 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex dm-transition"
          style={{
            background: T.navBg,
            borderTop: `1px solid ${T.borderSoft}`,
            boxShadow: `0 -2px 12px ${T.shadow}`
          }}
        >
          {tabs.map(tab => (
            <Link
              key={tab.path}
              href={tab.path}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold no-underline"
              style={{ color: isActive(tab.path) ? T.maroon : T.textMuted }}
            >
              <span
                className="p-1.5 rounded-lg"
                style={{ background: isActive(tab.path) ? T.creamDark : 'transparent' }}
              >
                {tab.icon}
              </span>
              {tab.label.split(' ')[0]}
            </Link>
          ))}
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <main
        className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto dm-transition"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {children}
      </main>
    </div>
  );
}