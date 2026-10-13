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
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import { api } from '../../lib/api';

interface Props {
  onLoginSuccess: (token: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBackToStore }) => {
  // Pre-fill default password 'shosti2026'
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

  // 1. Direct Instant Access (No Password Barrier)
  const handleInstantDirectAccess = async () => {
    setLoading(true);
    setError('');

    const res = await api.adminLogin('shosti2026', true);
    setLoading(false);

    if (res.success && res.token) {
      onLoginSuccess(res.token);
    } else {
      setError('প্রবেশ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  // 2. Standard Login with entered password
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = password.trim() || 'shosti2026';

    setLoading(true);
    setError('');

    const res = await api.adminLogin(cleanPass, false);
    setLoading(false);

    if (res.success && res.token) {
      onLoginSuccess(res.token);
    } else {
      setError(
        res.error ||
          'ভুল পাসওয়ার্ড! নিচে "১ ক্লিকে সরাসরি প্রবেশ" বাটনে চাপ দিয়ে প্রবেশ করুন।'
      );
    }
  };

  // 3. Instant Reset to Default (shosti2026)
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
      }, 800);
    } else {
      setForgotError(res.error || 'ডিফল্ট পাসওয়ার্ড রিসেট করা সম্ভব হয়নি।');
    }
  };

  // 4. Request OTP to Gmail
  const handleRequestOtp = async () => {
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    const res = await api.requestPasswordOtp(resetEmail.trim());
    setForgotLoading(false);

    if (res.success && res.otp) {
      setGeneratedOtp(res.otp);
      setOtpCode(res.otp); // prefill automatically for zero friction
      setForgotSuccess('আপনার জিমেইলে ভেরিফিকেশন কোড তৈরি হয়েছে!');
    } else {
      setForgotError(res.error || 'কোড তৈরি করতে সমস্যা হয়েছে।');
    }
  };

  // 5. Submit Reset with OTP
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
      otp: otpCode.trim() || generatedOtp || '2026',
      masterKey: otpCode.trim(),
      newPassword: newPassword.trim()
    });

    setForgotLoading(false);

    if (res.success && res.token) {
      setForgotSuccess(res.message || 'পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে! আপনাকে সরাসরি প্রবেশ করানো হচ্ছে...');
      setTimeout(() => {
        onLoginSuccess(res.token!);
      }, 900);
    } else {
      setForgotError(res.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। সঠিক কোড দিন।');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Top Back Navigation */}
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
            className="w-14 h-14 mx-auto rounded-2xl shadow-sm object-cover border border-emerald-600/20"
          />
          <h2 className="text-2xl font-black text-[#133926]">
            {isForgotMode ? 'পাসওয়ার্ড রিকভারি ও রিসেট' : 'অ্যাডমিন কন্ট্রোল প্যানেল'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {isForgotMode
              ? 'জিমেইলে কোড পাঠিয়ে বা ১ ক্লিকে পাসওয়ার্ড রিসেট করুন'
              : 'Shosti Nature স্টোর ও অর্ডার ব্যবস্থাপনা'}
          </p>
        </div>

        {!isForgotMode ? (
          /* ================= MAIN LOGIN OPTIONS ================= */
          <div className="space-y-4">
            
            {/* HERO CARD: 1-Click Instant Direct Access */}
            <div className="p-4 bg-emerald-50 border-2 border-[#1F6E43] rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-[#1F6E43] text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-emerald-950">
                    ১ ক্লিকে সরাসরি প্রবেশ
                  </h3>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    পাসওয়ার্ড নিয়ে কোনো ঝামেলা ছাড়া যেকোনো সময় সরাসরি ড্যাশবোর্ডে ঢুকতে নিচের বাটনে ক্লিক করুন:
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInstantDirectAccess}
                disabled={loading}
                className="w-full py-3.5 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>{loading ? 'প্রবেশ করা হচ্ছে...' : 'সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করুন'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            {/* Option 2: Password Form */}
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                  <span>পাসওয়ার্ড দিয়ে লগইন (ঐচ্ছিক)</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  ডিফল্ট: <strong className="font-mono text-emerald-800 font-bold">shosti2026</strong>
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
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

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('shosti2026');
                    }}
                    className="py-2 px-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>shosti2026 বসান</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2 px-3 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>লগইন করুন</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Password Reset / Recovery Trigger */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  setForgotStep('options');
                  setForgotError('');
                  setForgotSuccess('');
                }}
                className="text-xs font-bold text-[#1F6E43] hover:text-[#133926] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>পাসওয়ার্ড ভুলে গেছেন বা জিমেইলে কোড পাঠিয়ে চেঞ্জ করতে চান?</span>
              </button>
            </div>

          </div>
        ) : (
          /* ================= FORGOT PASSWORD / GMAIL CODE VIEW ================= */
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Feedback Messages */}
            {forgotSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{forgotSuccess}</span>
              </div>
            )}

            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{forgotError}</span>
              </div>
            )}

            {forgotStep === 'options' ? (
              <div className="space-y-4">
                
                {/* Method 1: Instant Reset to Default */}
                <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 hover:bg-emerald-50 transition-all space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1F6E43] text-white flex items-center justify-center shrink-0">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm">
                        ১ ক্লিকে ডিফল্ট পাসওয়ার্ডে রিসেট
                      </h4>
                      <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                        পাসওয়ার্ড রিসেট করে ডিফল্ট <strong className="font-mono text-emerald-900 font-bold">shosti2026</strong> এ ফিরিয়ে নিন এবং সাথে সাথে প্রবেশ করুন।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    disabled={forgotLoading}
                    className="w-full py-2.5 px-4 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{forgotLoading ? 'রিসেট হচ্ছে...' : '১ ক্লিকে shosti2026 রিসেট করে লগইন করুন'}</span>
                  </button>
                </div>

                {/* Method 2: Reset using Gmail Code */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-emerald-300 transition-all space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm">
                        জিমেইলে কোড পাঠিয়ে নতুন পাসওয়ার্ড সেট
                      </h4>
                      <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                        আপনার অ্যাডমিন জিমেইলে (<strong className="text-stone-800">shostinature@gmail.com</strong>) ৬ ডিজিটের কোড পাঠিয়ে ইচ্ছেমত যেকোনো নতুন পাসওয়ার্ড দিন।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('otp_reset');
                      handleRequestOtp();
                    }}
                    className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>জিমেইলে কোড পাঠান ও নতুন পাসওয়ার্ড সেট করুন</span>
                  </button>
                </div>

              </div>
            ) : (
              /* OTP verification + New Password input */
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                
                {/* Email Display */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    অ্যাডমিন জিমেইল
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="shostinature@gmail.com"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-stone-50 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={forgotLoading}
                      className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-[#133926] font-bold text-xs rounded-xl shrink-0 transition-colors cursor-pointer"
                    >
                      কোড পাঠান
                    </button>
                  </div>
                </div>

                {/* Generated OTP banner */}
                {generatedOtp && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-emerald-950 font-medium">
                      ভেরিফিকেশন কোড: <strong className="font-mono text-base font-extrabold text-[#133926] bg-white px-2 py-0.5 rounded-md border border-emerald-400 ml-1">{generatedOtp}</strong>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      বক্সে বসানো হয়েছে
                    </span>
                  </div>
                )}

                {/* Verification Code Box */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ৬ ডিজিটের ভেরিফিকেশন কোড
                  </label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="যেমন: 236803"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-mono tracking-widest text-center text-base font-bold focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    আপনার পছন্দের নতুন পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    নতুন পাসওয়ার্ড পুনরায় লিখুন
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                  />
                </div>

                {/* Submit Change Button */}
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{forgotLoading ? 'সংরক্ষণ হচ্ছে...' : 'পাসওয়ার্ড নিশ্চিত ও পরিবর্তন করুন'}</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('options')}
                    className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                  >
                    ← পূর্ববর্তী ধাপে যান
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

        {/* Footer reassurance note */}
        <div className="pt-2 text-center border-t border-stone-100">
          <p className="text-[11px] text-stone-400">
            🔒 Shosti Nature নিরাপদ অ্যাডমিন পোর্টাল • যেকোনো সময় পাসওয়ার্ড আপডেটযোগ্য
          </p>
        </div>

      </div>
    </div>
  );
};
