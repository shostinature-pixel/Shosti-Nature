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
  UserCheck
} from 'lucide-react';

interface Props {
  token: string;
}

export const AdminSecuritySettings: React.FC<Props> = ({ token }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('দয়া করে বর্তমান পাসওয়ার্ডটি লিখুন।');
      return;
    }

    if (!newPassword) {
      setErrorMessage('দয়া করে নতুন পাসওয়ার্ড লিখুন।');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('নতুন পাসওয়ার্ডটি বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে।');
      return;
    }

    setLoading(true);

    try {
      const res = await api.changeAdminPassword(token, currentPassword, newPassword);
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
              অ্যাডমিন পাসওয়ার্ড ও সুরক্ষা ব্যবস্থাপনা
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              এই অ্যাডমিন প্যানেলটি সম্পূর্ণ পাসওয়ার্ড-সুরক্ষিত। আপনি ব্যতীত অন্য কেউ এখানে প্রবেশ করতে পারবে না। আপনার সুবিধামত যেকোনো সময় পাসওয়ার্ড পরিবর্তন করতে পারেন।
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs flex items-center gap-3 shrink-0">
            <KeyRound className="w-8 h-8 text-emerald-300" />
            <div className="text-left text-xs">
              <span className="block font-bold text-white">স্টোর সুরক্ষায় সক্রিয়</span>
              <span className="text-emerald-200 text-[11px]">একক মালিকানাধীন কন্ট্রোল</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Change Password Form (Left / Main) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1F6E43] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                পাসওয়ার্ড পরিবর্তন করুন
              </h3>
              <p className="text-xs text-stone-500">
                বর্তমান পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড নির্ধারণ করুন
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <strong className="block font-bold text-emerald-950">অভিনন্দন!</strong>
                <span>{successMessage} আপনার নতুন পাসওয়ার্ডটি তাৎক্ষণিকভাবে সংরক্ষিত হয়েছে।</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block font-bold text-rose-950">ত্রুটি!</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
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
                  placeholder="বর্তমান পাসওয়ার্ডটি লিখুন"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showCurrent ? 'লুকান' : 'দেখুন'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                  placeholder="নতুন শক্তিশালী পাসওয়ার্ড লিখুন"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showNew ? 'লুকান' : 'দেখুন'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড ব্যবহার করুন (সহজে মনে রাখতে পারেন এমন শক্তিশালী শব্দ)।
              </p>
            </div>

            {/* Confirm New Password */}
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
                  placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showConfirm ? 'লুকান' : 'দেখুন'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <div className="mt-1.5">
                  {newPassword === confirmPassword ? (
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
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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

        {/* Security Rules & Info Panel (Right) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>নিরাপত্তা নির্দেশিকা</span>
            </h4>
            
            <ul className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>শুধুমাত্র আপনিই প্রবেশ করতে পারবেন:</strong> সঠিক পাসওয়ার্ড ছাড়া এই ড্যাশবোর্ড, গ্রাহকের ফোন নম্বর, ঠিকানা বা কোনো তথ্য দেখার সুযোগ নেই।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>পাসওয়ার্ড পরিবর্তন হলে:</strong> নতুন পাসওয়ার্ড সংরক্ষণ করার সাথে সাথে আগের সমস্ত মেয়াদোত্তীর্ণ সেশন বন্ধ হয়ে যাবে এবং কেবল নতুন পাসওয়ার্ড দিয়েই পরবর্তী সময়ে লগইন করতে হবে।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>পাসওয়ার্ড সুরক্ষিত রাখুন:</strong> পাসওয়ার্ডটি কারো সাথে শেয়ার করবেন না এবং কোনো ডিভাইসে কাজ শেষে 'লগআউট' বাটনে চাপ দিন।
                </span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
              <UserCheck className="w-4 h-4 text-[#1F6E43]" />
              <span>স্টোর ডেটা সুরক্ষার নিশ্চয়তা</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Shosti Nature প্রশাসন ব্যবস্থায় সমস্ত ডেটা ব্যাকএন্ড এনক্রিপশন ও অথরাইজেশন যাচাইয়ের মাধ্যমে আদান-প্রদান করা হয়।
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
