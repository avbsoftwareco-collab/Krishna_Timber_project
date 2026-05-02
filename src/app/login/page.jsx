
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const THEME = {
  maroon:      '#7B1E1E',
  maroonDark:  '#5a1515',
  maroonLight: '#9a2828',
  cream:       '#FBF6F0',
  creamLight:  '#FFFBF5',
  creamDark:   '#F0E6DA',
  textDark:    '#2a1010',
  textMuted:   '#6b5454',
  borderSoft:  '#E8DCC8',
  shadow:      'rgba(123,30,30,0.06)',
  shadowStrong:'rgba(123,30,30,0.18)',
};

export default function LoginPage() {
  const router = useRouter();

  const [showSplash, setShowSplash]     = useState(true);
  const [progress, setProgress]         = useState(0);
  const [fadeOut, setFadeOut]           = useState(false);
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible]   = useState(false);
  const [logoError, setLogoError]       = useState(false);

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setShowSplash(false);
              setTimeout(() => setFormVisible(true), 80);
            }, 500);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [showSplash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify({
          email:    formData.email,
          userType: data.userType,
          name:     data.name,
        }));
        router.push('/dashboard');
      } else {
        setError(data.error || data.message || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FallbackLogo = () => (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${THEME.maroonDark}, ${THEME.maroon})` }}
    >
      <span className="text-white font-black text-xl"
        style={{ fontFamily: 'Georgia, serif' }}>KT</span>
      <span className="text-white text-xs" style={{ opacity: 0.8 }}>&amp;P</span>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SPLASH SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (showSplash) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${THEME.creamLight} 0%, ${THEME.cream} 50%, ${THEME.creamDark} 100%)`,
          opacity:    fadeOut ? 0 : 1,
          transform:  fadeOut ? 'scale(1.03)' : 'scale(1)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${THEME.maroon} 1px, transparent 1px)`,
            backgroundSize:  '28px 28px',
          }}
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg,${THEME.maroonDark},${THEME.maroon},${THEME.maroonLight},${THEME.maroon},${THEME.maroonDark})` }}
        />

        <div className="relative z-10 flex flex-col items-center px-8">
          {/* Logo */}
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute rounded-full animate-ping"
              style={{ width: 120, height: 120, border: `2px solid ${THEME.maroon}`, opacity: 0.1 }}
            />
            <div className="absolute rounded-full animate-pulse"
              style={{ width: 104, height: 104, border: `1px solid ${THEME.maroon}`, opacity: 0.12 }}
            />
            <div
              className="relative flex items-center justify-center rounded-2xl overflow-hidden"
              style={{
                width: 80, height: 80,
                background: THEME.creamLight,
                border:     `2px solid ${THEME.borderSoft}`,
                boxShadow:  `0 8px 32px ${THEME.shadowStrong}`,
                animation:  'logo-float 3s ease-in-out infinite',
              }}
            >
              {!logoError ? (
                <Image src="/logo.jpeg" alt="Krishna Timber" width={68} height={68}
                  style={{ objectFit: 'contain' }} onError={() => setLogoError(true)} priority />
              ) : <FallbackLogo />}
            </div>
          </div>

          <h1 className="text-4xl font-black m-0 leading-tight"
            style={{ color: THEME.maroon, fontFamily: 'Georgia,serif', animation: 'slide-up 0.8s ease-out both' }}>
            Krishna
          </h1>
          <h2 className="text-xl font-bold m-0 tracking-widest uppercase mt-0.5"
            style={{ color: THEME.maroonLight, fontFamily: 'Georgia,serif', animation: 'slide-up 0.8s 0.15s ease-out both' }}>
            Timber
          </h2>

          <div className="flex items-center gap-3 my-3"
            style={{ animation: 'fade-in 1s 0.3s ease-out both' }}>
            <div className="h-px w-10"
              style={{ background: `linear-gradient(to right,transparent,${THEME.maroon})` }} />
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: THEME.maroon, opacity: 0.6 }} />
            <div className="h-px w-10"
              style={{ background: `linear-gradient(to left,transparent,${THEME.maroon})` }} />
          </div>

          <p className="text-xs uppercase tracking-widest m-0 mb-8"
            style={{ color: THEME.textMuted, fontFamily: 'Georgia,serif', animation: 'fade-in 1s 0.45s ease-out both' }}>
            &amp; Plywoods
          </p>

          {/* Progress */}
          <div style={{ width: 260, animation: 'fade-in 0.8s 0.5s ease-out both' }}>
            <div className="rounded-full overflow-hidden"
              style={{ height: 5, background: THEME.creamDark, border: `1px solid ${THEME.borderSoft}` }}>
              <div className="h-full rounded-full transition-all duration-100 ease-out"
                style={{
                  width:     `${progress}%`,
                  background:`linear-gradient(90deg,${THEME.maroonDark},${THEME.maroon},${THEME.maroonLight})`,
                  boxShadow: `0 0 8px ${THEME.maroon}60`,
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm font-semibold m-0"
                style={{ color: THEME.maroon, fontFamily: 'Georgia,serif' }}>
                {progress < 30 ? 'Initializing...'
                  : progress < 60 ? 'Loading...'
                  : progress < 90 ? 'Almost ready...'
                  : progress < 100 ? 'Finalizing...'
                  : '✓ Welcome!'}
              </p>
              <p className="text-sm font-bold m-0 font-mono" style={{ color: THEME.textMuted }}>
                {progress}%
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg,${THEME.maroonDark},${THEME.maroon},${THEME.maroonLight},${THEME.maroon},${THEME.maroonDark})` }}
        />

        <style jsx>{`
          @keyframes logo-float {
            0%,100% { transform:translateY(0) rotate(1deg); }
            50%      { transform:translateY(-10px) rotate(-1deg); }
          }
          @keyframes slide-up {
            from { opacity:0; transform:translateY(20px); }
            to   { opacity:1; transform:translateY(0); }
          }
          @keyframes fade-in {
            from { opacity:0; }
            to   { opacity:1; }
          }
        `}</style>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN PAGE
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style jsx global>{`
        html, body {
          overflow: hidden !important;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          15%,45%,75% { transform:translateX(-4px); }
          30%,60%,90% { transform:translateX(4px); }
        }
        input::placeholder {
          color: ${THEME.textMuted};
          opacity: 0.6;
        }
      `}</style>

      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg,${THEME.creamLight} 0%,${THEME.cream} 60%,${THEME.creamDark} 100%)`,
        }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle,${THEME.maroon} 1px,transparent 1px)`,
            backgroundSize:  '28px 28px',
          }}
        />

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: THEME.maroon, transform: 'translate(40%,-40%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: THEME.maroon, transform: 'translate(-40%,40%)' }} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{ background: `linear-gradient(90deg,${THEME.maroonDark},${THEME.maroon},${THEME.maroonLight},${THEME.maroon},${THEME.maroonDark})` }}
        />

        {/* Main wrapper */}
        <div
          className="relative z-10 w-full"
          style={{
            maxWidth:   420,
            padding:    '0 16px',
            opacity:    formVisible ? 1 : 0,
            transform:  formVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >

          {/* ─── FORM CARD ─── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#ffffff',
              border:     `1px solid ${THEME.borderSoft}`,
              boxShadow:  `0 8px 40px ${THEME.shadowStrong}, 0 2px 8px ${THEME.shadow}`,
            }}
          >
            {/* Top accent line */}
            <div className="h-1"
              style={{ background: `linear-gradient(90deg,${THEME.maroonDark},${THEME.maroon},${THEME.maroonLight})` }}
            />

            {/* ── LOGO + BRAND — all together inside card top ── */}
            <div
              className="flex flex-col items-center pt-7 pb-5 px-6"
              style={{ borderBottom: `1px solid ${THEME.borderSoft}`, background: THEME.creamLight }}
            >
              {/* Logo image */}
              <div
                className="rounded-2xl overflow-hidden flex items-center justify-center mb-3"
                style={{
                  width:     64,
                  height:    64,
                  background: '#fff',
                  border:    `2px solid ${THEME.borderSoft}`,
                  boxShadow: `0 4px 16px ${THEME.shadowStrong}`,
                  flexShrink: 0,
                }}
              >
                {!logoError ? (
                  <Image
                    src="/logo.jpeg"
                    alt="Krishna Timber"
                    width={54}
                    height={54}
                    style={{ objectFit: 'contain' }}
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : <FallbackLogo />}
              </div>

              {/* Brand name — below logo, centered */}
              <h1
                className="text-xl font-black m-0 leading-tight text-center"
                style={{ color: THEME.maroon, fontFamily: 'Georgia,serif' }}
              >
                Krishna Timber
              </h1>

              {/* Divider + Plywoods — same line */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-px w-8"
                  style={{ background: `linear-gradient(to right,transparent,${THEME.maroon}80)` }} />
                <p
                  className="text-xs uppercase tracking-widest m-0 font-semibold"
                  style={{ color: THEME.textMuted, fontFamily: 'Georgia,serif' }}
                >
                  &amp; Plywoods
                </p>
                <div className="h-px w-8"
                  style={{ background: `linear-gradient(to left,transparent,${THEME.maroon}80)` }} />
              </div>
            </div>

            {/* ── FORM BODY ── */}
            <div className="p-6">

              {/* Heading */}
              <div className="mb-5">
                <h2 className="text-base font-bold m-0"
                  style={{ color: THEME.textDark, fontFamily: 'Georgia,serif' }}>
                  Sign in to your account
                </h2>
                <p className="text-xs mt-0.5 m-0" style={{ color: THEME.textMuted }}>
                  Enter your credentials to continue
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="mb-4 px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm"
                  style={{
                    background: '#fef2f2',
                    border:     '1px solid #fecaca',
                    color:      '#dc2626',
                    animation:  'shake 0.45s ease',
                  }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#fee2e2' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-xs">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5"
                    style={{ color: THEME.textDark, fontFamily: 'Georgia,serif' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: THEME.cream }}>
                      <Mail className="w-3.5 h-3.5" style={{ color: THEME.maroon }} />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full rounded-xl text-sm disabled:opacity-60"
                      style={{
                        paddingTop:    11,
                        paddingBottom: 11,
                        paddingLeft:   44,
                        paddingRight:  14,
                        background:    THEME.cream,
                        border:        `1.5px solid ${THEME.borderSoft}`,
                        color:         THEME.textDark,
                        outline:       'none',
                        fontFamily:    'inherit',
                        transition:    'all 0.2s',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = THEME.maroon;
                        e.target.style.background  = '#fff';
                        e.target.style.boxShadow   = `0 0 0 3px ${THEME.maroon}18`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = THEME.borderSoft;
                        e.target.style.background  = THEME.cream;
                        e.target.style.boxShadow   = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5"
                    style={{ color: THEME.textDark, fontFamily: 'Georgia,serif' }}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: THEME.cream }}>
                      <Lock className="w-3.5 h-3.5" style={{ color: THEME.maroon }} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full rounded-xl text-sm disabled:opacity-60"
                      style={{
                        paddingTop:    11,
                        paddingBottom: 11,
                        paddingLeft:   44,
                        paddingRight:  48,
                        background:    THEME.cream,
                        border:        `1.5px solid ${THEME.borderSoft}`,
                        color:         THEME.textDark,
                        outline:       'none',
                        fontFamily:    'inherit',
                        transition:    'all 0.2s',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = THEME.maroon;
                        e.target.style.background  = '#fff';
                        e.target.style.boxShadow   = `0 0 0 3px ${THEME.maroon}18`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = THEME.borderSoft;
                        e.target.style.background  = THEME.cream;
                        e.target.style.boxShadow   = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: THEME.cream, border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = THEME.creamDark}
                      onMouseLeave={e => e.currentTarget.style.background = THEME.cream}
                    >
                      {showPassword
                        ? <EyeOff className="w-3.5 h-3.5" style={{ color: THEME.textMuted }} />
                        : <Eye    className="w-3.5 h-3.5" style={{ color: THEME.textMuted }} />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded"
                      style={{ accentColor: THEME.maroon, width: 14, height: 14 }} />
                    <span className="text-xs" style={{ color: THEME.textMuted }}>Remember me</span>
                  </label>
                  <button type="button"
                    className="text-xs font-semibold border-none bg-transparent cursor-pointer p-0"
                    style={{ color: THEME.maroon }}>
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  style={{
                    paddingTop:    13,
                    paddingBottom: 13,
                    background:    loading
                      ? THEME.textMuted
                      : `linear-gradient(135deg,${THEME.maroonDark},${THEME.maroon})`,
                    color:         '#fff',
                    border:        'none',
                    cursor:        loading ? 'not-allowed' : 'pointer',
                    boxShadow:     `0 4px 18px ${THEME.maroon}40`,
                    fontFamily:    'Georgia,serif',
                    letterSpacing: 0.5,
                    transition:    'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${THEME.maroon}50`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 18px ${THEME.maroon}40`;
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security badges */}
              {/* <div className="mt-5 pt-4 flex items-center justify-center gap-5"
                style={{ borderTop: `1px solid ${THEME.borderSoft}` }}>
                {[
                  {
                    icon: (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    ),
                    label: 'Secure Login', color: '#16a34a', bg: '#f0fdf4',
                  },
                  {
                    icon: (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ),
                    label: '256-bit SSL', color: '#2563eb', bg: '#eff6ff',
                  },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: badge.bg, color: badge.color }}>
                      {badge.icon}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: THEME.textMuted }}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs mt-4 m-0"
            style={{ color: THEME.textMuted, fontFamily: 'Georgia,serif' }}>
            © 2024 Krishna Timber &amp; Plywoods · All rights reserved
          </p>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg,${THEME.maroonDark},${THEME.maroon},${THEME.maroonLight},${THEME.maroon},${THEME.maroonDark})` }}
        />
      </div>
    </>
  );
}