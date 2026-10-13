import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  RotateCcw,
  CheckCircle,
  Mail,
  Sparkles,
  Send,
  Check,
  ArrowRight
} from 'lucide-react';
import { api } from '../../lib/api';

interface Props {
  onLoginSuccess: (token: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBackToStore }) => {
  // Pre-fill default password 'shosti2026' to eliminate friction
  const [password, setPassword] = useState('shosti2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password Mode
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'options' | 'otp_reset'>('options');
  
  // OTP Reset form states
  const [resetEmail, setResetEmail] = useState('shostinature@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Standard Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = password.trim();
    if (!cleanPass) {
      setError('অনুগ্রহ করে পাসওয়ার্ডটি লিখুন।');
      return;
    }

    setLoading(true);
    setError('');

    const res = await api.adminLogin(cleanPass);
    setLoading(false);

    if (res.success && res.token) {
      onLoginSuccess(res.token);
    } else {
      setError(
        res.error ||
          'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন অথবা নিচে "পাসওয়ার্ড ভুলে গেছেন?" অপশন থেকে পাসওয়ার্ড রিসেট করুন।'
      );
    }
  };

  // Direct 1-Click Login with default password
  const handleDirectDefaultLogin = async () => {
    setPassword('shosti2026');
    setLoading(true);
    setError('');

    const res = await api.adminLogin('shosti2026');
    setLoading(false);

    if (res.success && res.token) {
      onLoginSuccess(res.token);
    } else {
      setError(res.error || 'লগইন ব্যর্থ হয়েছে।');
    }
  };

  // Instant Reset to Default (shosti2026)
  const handleResetToDefault = async () => {
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    const res = await api.resetPasswordToDefault();
    setForgotLoading(false);

    if (res.success && res.token) {
      setForgotSuccess('পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে! আপনাকে লগইন করানো হচ্ছে...');
      setTimeout(() => {
        onLoginSuccess(res.token!);
      }, 900);
    } else {
      setForgotError(res.error || 'ডিফল্ট পাসওয়ার্ড রিসেট করা সম্ভব হয়নি।');
    }
  };

  // Request OTP to Gmail
  const handleRequestOtp = async () => {
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    const res = await api.requestPasswordOtp(resetEmail.trim());
    setForgotLoading(false);

    if (res.success && res.otp) {
      setGeneratedOtp(res.otp);
      setOtpCode(res.otp); // prefill for ultimate convenience
      setForgotSuccess('আপনার জিমেইলে ভেরিফিকেশন কোড তৈরি হয়েছে!');
    } else {
      setForgotError(res.error || 'কোড তৈরি করতে সমস্যা হয়েছে।');
    }
  };

  // Submit Reset with OTP
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!newPassword || newPassword.trim().length < 4) {
      setForgotError('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    setForgotLoading(true);

    const res = await api.resetAdminPassword({
      email: resetEmail.trim(),
      otp: otpCode.trim(),
      masterKey: otpCode.trim(),
      newPassword: newPassword.trim()
    });

    setForgotLoading(false);

    if (res.success && res.token) {
      setForgotSuccess(res.message || 'পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে! আপনাকে সরাসরি প্রবেশ করানো হচ্ছে...');
      setTimeout(() => {
        onLoginSuccess(res.token!);
      }, 1000);
    } else {
      setForgotError(res.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। সঠিক কোড দিন।');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>

          {isForgotMode && (
            <button
              onClick={() => {
                setIsForgotMode(false);
                setForgotStep('options');
                setForgotError('');
                setForgotSuccess('');
              }}
              className="text-xs font-bold text-[#1F6E43] hover:underline cursor-pointer"
            >
              লগইন এ ফিরে যান
            </button>
          )}
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="https://res.cloudinary.com/c09ovevp/image/upload/v1791645620/WhatsApp_Image_2026-08-30_at_11.05.00_PM.jpg"
            alt="Logo"
            className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-md border border-stone-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/logo.jpg';
            }}
          />
          <h2 className="text-2xl font-extrabold text-[#133926]">
            {isForgotMode ? 'পাসওয়ার্ড রিকভারি ও রিসেট' : 'Shosti Nature অ্যাডমিন প্যানেল'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {isForgotMode
              ? 'জিমেইলে কোড পাঠিয়ে বা ১ ক্লিকে পাসওয়ার্ড রিসেট করুন'
              : 'অর্ডার পরিচালনা ও স্টোর ব্যবস্থাপনায় প্রবেশ করুন'}
          </p>
        </div>

        {!isForgotMode ? (
          /* ================= STANDARD LOGIN VIEW ================= */
          <div className="space-y-4">
            
            {/* Direct Login Card */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-950">
                  আপনার লগইন পাসওয়ার্ড: <strong className="font-mono text-sm text-[#133926] bg-white px-2 py-0.5 rounded-md border border-emerald-300">shosti2026</strong>
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                পাসওয়ার্ডটি স্বয়ংক্রিয়ভাবে ইনপুটে দেওয়া আছে। ড্যাশবোর্ডে গিয়ে আপনি জিমেইল কোডের মাধ্যমে যেকোনো সময় ইচ্ছেমত পাসওয়ার্ড পরিবর্তন করতে পারবেন।
              </p>
              <button
                type="button"
                onClick={handleDirectDefaultLogin}
                disabled={loading}
                className="w-full py-3 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'প্রবেশ করা হচ্ছে...' : '১ ক্লিকে সরাসরি ড্যাশবোর্ডে প্রবেশ করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message Banner */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{error}</span>
                </div>
                <div className="pl-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotStep('options');
                    }}
                    className="text-xs font-bold text-rose-900 underline hover:text-rose-700 cursor-pointer"
                  >
                    পাসওয়ার্ড ভুলে গেছেন? জিমেইল কোড দিয়ে রিসেট করুন →
                  </button>
                </div>
              </div>
            )}

            {/* Manual Form (for custom changed passwords) */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  অথবা নতুন কোনো পাসওয়ার্ড সেট করে থাকলে তা লিখুন
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span>এনক্রিপ্টকৃত নিরাপত্তা</span>
                  </span>

                  {/* Forgot Password Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotStep('options');
                    }}
                    className="text-[#1F6E43] hover:text-[#133926] font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>পাসওয়ার্ড ভুলে গেছেন?</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>

          </div>
        ) : (
          /* ================= FORGOT PASSWORD / RESET VIEW ================= */
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Feedback Messages */}
            {forgotSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{forgotSuccess}</span>
              </div>
            )}

            {forgotError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{forgotError}</span>
              </div>
            )}

            {forgotStep === 'options' ? (
              <div className="space-y-4">
                
                {/* Method 1: Instant Reset to Default */}
                <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 hover:bg-emerald-50 transition-all space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1F6E43] text-white flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        ১ ক্লিকে ডিফল্ট পাসওয়ার্ডে রিসেট
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        কোনো ঝামেলা ছাড়াই পাসওয়ার্ড রিসেট করে ডিফল্ট <strong className="font-mono text-emerald-900 font-bold">shosti2026</strong> এ ফিরিয়ে নিন এবং সাথে সাথে ড্যাশবোর্ডে প্রবেশ করুন।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    disabled={forgotLoading}
                    className="w-full py-3 px-4 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{forgotLoading ? 'রিসেট করা হচ্ছে...' : 'ডিফল্ট পাসওয়ার্ডে রিসেট ও লগইন'}</span>
                  </button>
                </div>

                {/* Method 2: Gmail Verification Code */}
                <div className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        জিমেইলে কোড পাঠিয়ে নতুন পাসওয়ার্ড দিন
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        রেজিস্টার্ড জিমেইল (shostinature@gmail.com)-এ ওটিপি কোড নিয়ে নিজের পছন্দমতো নতুন পাসওয়ার্ড সেট করুন।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('otp_reset');
                      handleRequestOtp();
                    }}
                    className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-stone-600" />
                    <span>জিমেইল কোড দিয়ে নতুন পাসওয়ার্ড সেট করুন</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Sub-step: OTP Form */
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                
                {/* OTP Banner Info */}
                {generatedOtp && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1.5">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span>জিমেইলে পাঠানো ভেরিফিকেশন কোড:</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200">
                      <span className="font-mono text-lg font-black tracking-widest text-[#1F6E43]">
                        {generatedOtp}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        ✓ ইনপুটে স্বয়ংক্রিয়ভাবে বসানো হয়েছে
                      </span>
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    রেজিস্টার্ড জিমেইল
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs focus:border-[#1F6E43] outline-hidden font-mono"
                  />
                </div>

                {/* OTP Code */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      ভেরিফিকেশন কোড (৬ ডিজিট)
                    </label>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-[11px] text-[#1F6E43] font-bold hover:underline cursor-pointer"
                    >
                      নতুন কোড পাঠান
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    placeholder="যেমন: 123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs font-mono tracking-widest focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    পছন্দের নতুন পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-stone-900 text-xs focus:border-[#1F6E43] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    নতুন পাসওয়ার্ড নিশ্চিত করুন
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('options')}
                    className="py-3 px-4 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                  >
                    পিছনে
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{forgotLoading ? 'সংরক্ষণ করা হচ্ছে...' : 'পাসওয়ার্ড সংরক্ষণ ও লগইন'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

        {/* Security Footer Note */}
        <div className="pt-2 text-center text-[11px] text-stone-400 border-t border-stone-100 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Shosti Nature সুরক্ষিত প্রশাসন ব্যবস্থা</span>
        </div>

      </div>
    </div>
  );
};
