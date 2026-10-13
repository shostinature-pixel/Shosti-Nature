import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';
import { api } from '../../lib/api';

interface Props {
  onLoginSuccess: (token: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBackToStore }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    const res = await api.adminLogin(password);
    setLoading(false);

    if (res.success && res.token) {
      onLoginSuccess(res.token);
    } else {
      setError(res.error || 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 space-y-6">
        
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান</span>
        </button>

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
            Shosti Nature অ্যাডমিন প্যানেল
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            অর্ডার পরিচালনা ও স্টোর ব্যবস্থাপনার জন্য শুধু অনুমোদিত অ্যাডমিন লগইন করুন
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              অ্যাডমিন পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="গোপন পাসওয়ার্ড লিখুন"
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
            <p className="text-[11px] text-stone-400 mt-1.5 flex items-center gap-1">
              <Lock className="w-3 h-3 text-stone-400" />
              <span>অননুমোদিত প্রবেশ সম্পূর্ণ নিষিদ্ধ ও সুরক্ষিত।</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>যাচাই করা হচ্ছে...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-stone-400 border-t border-stone-100">
          Shosti Nature সুরক্ষিত প্রশাসন ব্যবস্থা
        </div>

      </div>
    </div>
  );
};
