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
//       // Close profile dropdown if clicked outside
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileOpen(false);
//       }
//       // Close notification dropdown if clicked outside
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

//   const tabs = [
//     { label: 'Purchase Order', path: '/dashboard/purchase', icon: <ShoppingCart className="w-4 h-4" /> },
//     { label: 'Inventory', path: '/dashboard/inventory', icon: <Package className="w-4 h-4" /> },
//     { label: 'Billing', path: '/dashboard/billing', icon: <FileText className="w-4 h-4" /> },
//   ];

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
//           <Link href="/dashboard/purchase" className="flex items-center gap-3">
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

//           {/* ── CENTER TABS (desktop) ── */}
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

//             {/* Mobile hamburger */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 rounded-lg hover:bg-amber-50 transition-colors md:hidden"
//             >
//               {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
//             </button>

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
//                         // Navigate to profile settings
//                       }}
//                       className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center gap-3"
//                     >
//                       <User className="w-4 h-4 text-gray-500" />
//                       Profile Settings
//                     </button>
                    
//                     <button 
//                       onClick={() => {
//                         setProfileOpen(false);
//                         // Navigate to account
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

//         {/* ── MOBILE DROPDOWN TABS ── */}
//         {mobileMenuOpen && (
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

//       {/* ── MOBILE BOTTOM TAB BAR ── */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden flex">
//         {tabs.map(tab => (
//           <Link
//             key={tab.path}
//             href={tab.path}
//             className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors
//               ${isActive(tab.path) ? 'text-amber-700' : 'text-gray-400'}`}
//           >
//             <span className={`p-1.5 rounded-lg transition-colors ${isActive(tab.path) ? 'bg-amber-100' : ''}`}>
//               {tab.icon}
//             </span>
//             {tab.label.split(' ')[0]}
//           </Link>
//         ))}
//       </div>

//       {/* ── PAGE CONTENT ── */}
//       <main className="pt-20 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {children}
//       </main>
//     </div>
//   );
// }




/////



'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Package, FileText, LogOut, Bell, ChevronDown,
  ShoppingCart, Menu, X, User, Settings
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Refs for dropdown containers
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

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

  // Close dropdowns on outside click
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

  // ✅ ONLY BILLING TAB - Purchase & Inventory HIDDEN
  const tabs = [
    { label: 'Billing', path: '/dashboard/billing', icon: <FileText className="w-4 h-4" /> },
  ];

  // 🔒 HIDDEN TABS (for reference - not shown in UI)
  // { label: 'Purchase Order', path: '/dashboard/purchase', icon: <ShoppingCart className="w-4 h-4" /> },
  // { label: 'Inventory', path: '/dashboard/inventory', icon: <Package className="w-4 h-4" /> },

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-40 h-16">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/dashboard/billing" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L8 8h3v4H8l4 6 4-6h-3V8h3L12 2z"/>
                <rect x="10" y="16" width="4" height="6" rx="1"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Krishna</h1>
              <p className="text-xs text-amber-600 uppercase tracking-widest">Timber</p>
            </div>
          </Link>

          {/* ── CENTER TABS (desktop) - Only Billing ── */}
          <div className="hidden md:flex items-center gap-5 bg-amber-50 rounded-xl p-1">
            {tabs.map(tab => (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive(tab.path)
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-200'
                    : 'text-amber-700 hover:bg-amber-100'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>

          {/* ── RIGHT: Bell + User + Mobile Menu ── */}
          <div className="flex items-center gap-2">

            {/* Mobile hamburger - Hidden if only 1 tab */}
            {tabs.length > 1 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-amber-50 transition-colors md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
            )}

            {/* Bell - Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-lg hover:bg-amber-50 transition-colors relative"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                      <p className="text-sm text-gray-800">Order #{100 + i} has been completed</p>
                      <p className="text-xs text-gray-500 mt-1">{i} hour(s) ago</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 text-center">
                    <button className="text-amber-600 text-sm font-medium hover:text-amber-700">View All</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-800">{userData?.name || 'User'}</p>
                  <p className="text-xs text-amber-600">{userData?.userType || 'Member'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{userData?.name || 'User Name'}</p>
                    <p className="text-xs text-gray-500">{userData?.email || 'email@example.com'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                      {userData?.userType || 'Member'}
                    </span>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center gap-3"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Profile Settings
                    </button>
                    
                    <button 
                      onClick={() => {
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Account
                    </button>
                  </div>
                  
                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
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

        {/* ── MOBILE DROPDOWN TABS - Only shows if more than 1 tab ── */}
        {mobileMenuOpen && tabs.length > 1 && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2 shadow-lg">
            {tabs.map(tab => (
              <Link
                key={tab.path}
                href={tab.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive(tab.path)
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                    : 'text-amber-700 hover:bg-amber-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── MOBILE BOTTOM TAB BAR - Only shows if more than 1 tab ── */}
      {tabs.length > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden flex">
          {tabs.map(tab => (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors
                ${isActive(tab.path) ? 'text-amber-700' : 'text-gray-400'}`}
            >
              <span className={`p-1.5 rounded-lg transition-colors ${isActive(tab.path) ? 'bg-amber-100' : ''}`}>
                {tab.icon}
              </span>
              {tab.label.split(' ')[0]}
            </Link>
          ))}
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}