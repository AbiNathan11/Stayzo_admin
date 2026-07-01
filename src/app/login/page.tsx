"use client";

import Cookies from 'js-cookie';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../components/Footer';

export default function AdminLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const lowerEmail = email.trim().toLowerCase();
    const isAdminEmail = lowerEmail === 'stayzoavp@gmail.com' || lowerEmail.startsWith('admin@');
    
    if (!isAdminEmail) {
      toast.error('Access denied. This portal is only for authorized Stayzo administrators.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lowerEmail, mode: 'login', role: 'admin' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      
      toast.success('Secure verification code sent to your admin email!');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');

      const token = data.stayzo_token || data.token;
      if (token) {
        Cookies.set('stayzo_token', token, { expires: 7 });
      }
      if (data.stayzo_refresh_token) {
        Cookies.set('stayzo_refresh_token', data.stayzo_refresh_token, { expires: 30 });
      }
      toast.success('Access granted. Welcome back, Administrator!');
      
      setTimeout(() => {
        window.location.href = '/dashboard/admin';
      }, 1000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col justify-between">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '12px' } }} />

      {/* Simple Header matching the navbar branding */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sm:px-8 flex justify-between items-center z-50 shrink-0">
        <Link href="http://localhost:3000" className="flex items-center space-x-2 group">
          <div className="flex items-end space-x-1 h-5">
            <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
        </Link>
      </header>

      {/* Main Content Container with centered card layout */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] border border-gray-100 p-8 sm:p-12 shadow-sm">
          
          {step === 'email' ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
                Welcome back
              </h2>
              <p className="text-gray-400 text-xs font-semibold mb-8 leading-relaxed">
                Enter your email to log in to your admin account. We'll send you a secure login code via email.
              </p>

              <form onSubmit={handleSendCode} noValidate className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F5F7F8] border border-transparent rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#1A1A1A] transition text-sm text-gray-800 font-semibold"
                    placeholder="admin@stayzo.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-sm mt-4 select-none cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Send Login Code'}
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
              <button
                onClick={() => { setStep('email'); setOtp(''); }}
                className="flex items-center text-gray-400 hover:text-[#1A1A1A] transition text-[10px] font-extrabold tracking-wider uppercase mb-8"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back
              </button>

              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">Check your email</h2>
              <div className="flex items-center space-x-2 text-[#1A1A1A] mb-8">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p className="text-xs font-semibold text-gray-400">
                  We've sent a 6-digit code to <span className="font-extrabold text-[#1A1A1A] break-all">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">Secure Login Code</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full bg-[#F5F7F8] border border-transparent rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#1A1A1A] transition text-2xl tracking-[0.5em] text-center text-[#1A1A1A] font-extrabold"
                    placeholder="••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-sm mt-4 select-none cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
