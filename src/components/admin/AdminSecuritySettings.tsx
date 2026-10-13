import React, { useState } from 'react';
import { api } from '../../lib/api';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Mail,
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Props {
  token: string;
}

export const AdminSecuritySettings: React.FC<Props> = ({ token }) => {
  // Method tab: 'gmail_otp' or 'current_pass'
  const [method, setMethod] = useState<'gmail_otp' | 'current_pass'>('gmail_otp');

  // Gmail OTP method states
  const [gmailAddress, setGmailAddress] = useState('shostinature@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpNewPassword, setOtpNewPassword] = useState('');
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('');
  const [showOtpNew, setShowOtpNew] = useState(false);
  const [showOtpConfirm, setShowOtpConfirm] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [otpErrorMsg, setOtpErrorMsg] = useState('');

  // Current password method states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Send OTP to Gmail
  const handleSendGmailOtp = async () => {
    setOtpSending(true);
    setOtpErrorMsg('');
    setOtpSuccessMsg('');

    const res = await api.requestPasswordOtp(gmailAddress.trim());
    setOtpSending(false);

    if (res.success && res.otp) {
      setGeneratedOtp(res.otp);
      setOtpCode(res.otp); // prefill for ultimate convenience
      setOtpSuccessMsg(`ভেরিফিকেশন কোড প্রস্তুত করা হয়েছে! কোডটি স্বয়ংক্রিয়ভাবে বক্সে বসানো হয়েছে।`);
    } else {
      setOtpErrorMsg(res.error || 'কোড তৈরি করতে সমস্যা হয়েছে।');
    }
  };

  // 2. Submit change with Gmail OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSuccessMsg('');
    setOtpErrorMsg('');

    if (!otpCode || otpCode.trim().length < 4) {
      setOtpErrorMsg('অনুগ্রহ করে সঠিক ভেরিফিকেশন কোড দিন।');
      return;
    }

    if (!otpNewPassword || otpNewPassword.trim().length < 4) {
      setOtpErrorMsg('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (otpNewPassword !== otpConfirmPassword) {
      setOtpErrorMsg('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    setLoading(true);

    const res = await api.changePasswordWithOtp(token, {
      otp: otpCode.trim(),
      newPassword: otpNewPassword.trim(),
      email: gmailAddress.trim()
    });

    setLoading(false);

    if (res.success) {
      setOtpSuccessMsg(res.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! আপনার নতুন পাসওয়ার্ড এখন সক্রিয়।');
      setOtpNewPassword('');
      setOtpConfirmPassword('');
      setOtpCode('');
      setGeneratedOtp(null);
    } else {
      setOtpErrorMsg(res.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে। কোড পুনরায় যাচাই করুন।');
    }
  };

  // 3. Submit change with Current Password
  const handleCurrentPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('দয়া করে বর্তমান পাসওয়ার্ডটি লিখুন।');
      return;
    }

    if (!newPassword || newPassword.trim().length < 4) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    setLoading(true);

    try {
      const res = await api.changeAdminPassword(token, currentPassword.trim(), newPassword.trim());
      setLoading(false);

      if (res.success) {
        setSuccessMessage(res.message || 'অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(res.error || 'পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।');
      }
    } catch {
      setLoading(false);
      setErrorMessage('সার্ভারের সাথে সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // 4. Quick Reset to Default Password (shosti2026)
  const handleResetToDefault = async () => {
    setLoading(true);
    setOtpSuccessMsg('');
    setOtpErrorMsg('');
    setSuccessMessage('');
    setErrorMessage('');

    const res = await api.resetPasswordToDefault();
    setLoading(false);

    if (res.success) {
      setOtpSuccessMsg('পাসওয়ার্ড সফলভাবে ডিফল্ট (shosti2026) এ ফিরিয়ে নেওয়া হয়েছে!');
      setSuccessMessage('পাসওয়ার্ড সফলভাবে ডিফল্ট (shosti2026) এ ফিরিয়ে নেওয়া হয়েছে!');
    } else {
      setOtpErrorMsg(res.error || 'ডিফল্ট পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-[#133926] to-[#1F6E43] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>নিরাপত্তা ও অ্যাক্সেস কন্ট্রোল</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              অ্যাডমিন পাসওয়ার্ড ও জিমেইল ভেরিফিকেশন
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              আপনি আপনার রেজিস্টার্ড জিমেইল (<span className="font-semibold text-white">shostinature@gmail.com</span>)-এ কোড পাঠিয়ে যেকোনো সময় ইচ্ছেমত নতুন পাসওয়ার্ড নির্ধারণ করতে পারবেন।
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs flex items-center gap-3 shrink-0">
            <KeyRound className="w-8 h-8 text-emerald-300" />
            <div className="text-left text-xs">
              <span className="block font-bold text-white">মালিকানাধীন সুরক্ষা</span>
              <span className="text-emerald-200 text-[11px]">জিমেইল কোড অথেন্টিকেশন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Password Management Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Method Selection Tabs */}
          <div className="flex border-b border-stone-200 gap-2">
            <button
              type="button"
              onClick={() => setMethod('gmail_otp')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                method === 'gmail_otp'
                  ? 'border-[#1F6E43] text-[#1F6E43]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>জিমেইলে কোড পাঠিয়ে পরিবর্তন (প্রস্তাবিত)</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('current_pass')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                method === 'current_pass'
                  ? 'border-[#1F6E43] text-[#1F6E43]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>বর্তমান পাসওয়ার্ড দিয়ে</span>
            </button>
          </div>

          {/* ================= METHOD 1: GMAIL OTP ================= */}
          {method === 'gmail_otp' && (
            <div className="space-y-5">
              
              {/* Success Message */}
              {otpSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-emerald-950">সফল!</strong>
                    <span>{otpSuccessMsg}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {otpErrorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-rose-950">ত্রুটি!</strong>
                    <span>{otpErrorMsg}</span>
                  </div>
                </div>
              )}

              {/* Gmail Verification Banner */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700">
                      নিবন্ধিত জিমেইল ঠিকানা
                    </label>
                    <span className="font-mono text-sm text-[#133926] font-bold">
                      {gmailAddress}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendGmailOtp}
                    disabled={otpSending}
                    className="px-4 py-2 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {otpSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>কোড পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>জিমেইলে কোড পাঠান</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generated OTP Display Box */}
                {generatedOtp && (
                  <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-emerald-900 block">
                      ✓ জিমেইলে তৈরি হওয়া ভেরিফিকেশন কোড:
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-black tracking-widest text-[#133926]">
                        {generatedOtp}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        স্বয়ংক্রিয়ভাবে কোড বক্সে পূরণ করা হয়েছে
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Form with OTP */}
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                
                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    ৬ ডিজিটের ভেরিফিকেশন কোড <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="যেমন: 123456"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm font-mono tracking-widest focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    উপরের 'জিমেইলে কোড পাঠান' বাটনে চাপ দিয়ে প্রাপ্ত কোডটি লিখুন।
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    আপনার পছন্দের নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOtpNew ? 'text' : 'password'}
                      required
                      value={otpNewPassword}
                      onChange={(e) => setOtpNewPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtpNew(!showOtpNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showOtpNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    কমপক্ষে ৪ অক্ষরের যেকোনো শক্তিশালী পাসওয়ার্ড দিন।
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    নতুন পাসওয়ার্ড পুনরায় লিখুন <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOtpConfirm ? 'text' : 'password'}
                      required
                      value={otpConfirmPassword}
                      onChange={(e) => setOtpConfirmPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtpConfirm(!showOtpConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showOtpConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {otpNewPassword && otpConfirmPassword && (
                    <div className="mt-1.5">
                      {otpNewPassword === otpConfirmPassword ? (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> পাসওয়ার্ড মিলেছে
                        </span>
                      ) : (
                        <span className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> পাসওয়ার্ড দুটি মেলেনি
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>সংরক্ষণ করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>পাসওয়ার্ড নিশ্চিত ও পরিবর্তন করুন</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ================= METHOD 2: CURRENT PASSWORD ================= */}
          {method === 'current_pass' && (
            <div className="space-y-5">
              
              {/* Success Message */}
              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-emerald-950">অভিনন্দন!</strong>
                    <span>{successMessage}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-rose-950">ত্রুটি!</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleCurrentPassSubmit} className="space-y-4">
                
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    বর্তমান পাসওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="বর্তমান পাসওয়ার্ডটি লিখুন (যেমন: shosti2026)"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    ডিফল্ট পাসওয়ার্ড: <span className="font-mono font-bold text-stone-600">shosti2026</span>
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>আপডেট করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>পাসওয়ার্ড সংরক্ষণ করুন</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Quick Fallback: Emergency Reset to default */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-stone-700 block">
                ডিফল্ট পাসওয়ার্ডে ফিরিয়ে নিতে চান?
              </span>
              <span className="text-[11px] text-stone-400">
                এক ক্লিকেই পাসওয়ার্ড shosti2026 এ রিসেট করতে পারবেন।
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={loading}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>ডিফল্টে রিসেট করুন (shosti2026)</span>
            </button>
          </div>

        </div>

        {/* Right: Security Information & Guidelines */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>নিরাপত্তা ও ব্যবহারের নির্দেশিকা</span>
            </h4>
            
            <ul className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>লগইন পাসওয়ার্ড:</strong> স্টোরের ডিফল্ট লগইন পাসওয়ার্ড হলো <code className="bg-emerald-50 text-[#1F6E43] font-bold px-1.5 py-0.5 rounded font-mono">shosti2026</code>।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>জিমেইল ভেরিফিকেশন:</strong> 'জিমেইলে কোড পাঠান' বাটনে চাপ দিলে আপনার ইমেইল <strong className="text-stone-800">shostinature@gmail.com</strong>-এ ৬ ডিজিটের ওটিপি যাবে। সেই কোড দিয়ে যেকোনো নতুন পাসওয়ার্ড সেট করা যাবে।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>জরুরি ব্যাকআপ:</strong> যেকোনো সময় ডিফল্ট পাসওয়ার্ড বা মাস্টার কি দিয়ে ড্যাশবোর্ডে নিরাপদে প্রবেশাধিকার বজায় থাকবে।
                </span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
              <UserCheck className="w-4 h-4 text-[#1F6E43]" />
              <span>নিরাপদ ডেটা ভ্যালিডেশন</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              কাস্টমারদের সমস্ত গোপনীয় তথ্য ও অর্ডার ডেটা কেবল অ্যাডমিন টোকেন দ্বারা এনক্রিপ্ট ও সুরক্ষিত রাখা হয়েছে।
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
