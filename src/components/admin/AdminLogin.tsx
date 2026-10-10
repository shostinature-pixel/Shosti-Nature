import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

interface Props {
  onLoginSuccess: (token: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBackToStore }) => {
  const [password, setPassword] = useState('');
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
          <div className="w-14 h-14 rounded-2xl bg-[#133926] text-emerald-300 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#133926]">
            Shosti Nature অ্যাডমিন প্যানেল
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            অর্ডার পরিচালনা ও প্রোডাক্টের মূল্য পরিবর্তনের জন্য লগইন করুন
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
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              * সিস্টেম অ্যাডমিন পাসওয়ার্ড: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">shosti2026</code> (এনভায়রনমেন্ট ভেরিয়েবল ADMIN_PASSWORD দিয়ে পরিবর্তনযোগ্য)
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
