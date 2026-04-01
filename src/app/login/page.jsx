// app/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Splash Screen States
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  // Login Form States
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Splash Screen Progress
  useEffect(() => {
    if (!showSplash) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setShowSplash(false), 500);
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('token', data.token);
        const userData = {
          email: formData.email,
          userType: data.userType,
          name: data.name
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        setError(data.error || data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============ SPLASH SCREEN ============
  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-amber-50 to-white transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center">
          
          {/* Logo Container */}
          <div className="relative mb-8">
            {/* Animated Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-amber-200 animate-ping opacity-20"></div>
            </div>
            
            {/* Main Logo */}
            <div className="relative w-28 h-28 mx-auto bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce-slow">
              {/* Tree/Timber Icon */}
              <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L8 8h3v4H8l4 6 4-6h-3V8h3L12 2z"/>
                <rect x="10" y="16" width="4" height="6" rx="1"/>
              </svg>
            </div>
            
            {/* Decorative Leaf */}
            <div className="absolute -top-2 -right-2 w-8 h-8 text-green-500 animate-bounce">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
              </svg>
            </div>
          </div>

          {/* Shop Name */}
          <h1 className="text-4xl font-bold text-amber-900 mb-2 tracking-wide">
            Krishna
          </h1>
          <h2 className="text-2xl font-semibold text-amber-700 mb-1 tracking-widest uppercase">
            Timber
          </h2>
          <p className="text-amber-600 text-sm mb-8 tracking-wider">
            Quality Wood Solutions
          </p>

          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <p className="text-amber-600 text-sm font-medium">
                {progress < 100 ? 'Loading...' : 'Welcome!'}
              </p>
              <p className="text-amber-500 text-sm">
                {progress}%
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Wood Grain Line */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-50"></div>

        <style jsx>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0) rotate(3deg); }
            50% { transform: translateY(-10px) rotate(-3deg); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // ============ LOGIN PAGE ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L8 8h3v4H8l4 6 4-6h-3V8h3L12 2z"/>
              <rect x="10" y="16" width="4" height="6" rx="1"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Krishna Timber</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:from-amber-700 hover:to-amber-800 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Login
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 Krishna Timber. All rights reserved.
        </p>
      </div>
    </div>
  );
}