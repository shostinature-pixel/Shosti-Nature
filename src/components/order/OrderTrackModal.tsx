import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../lib/api';

interface Props {
  onClose: () => void;
}

const statusTextMap: Record<string, { label: string; color: string; desc: string }> = {
  pending: {
    label: 'অপেক্ষমাণ (Pending)',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    desc: 'আপনার অর্ডারটি গ্রহণ করা হয়েছে। কাস্টমার কেয়ার থেকে শিগগিরই কল দেওয়া হবে।'
  },
  confirmed: {
    label: 'নিশ্চিত (Confirmed)',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'অর্ডার নিশ্চিত করা হয়েছে। পণ্য প্রস্তুত করা হচ্ছে।'
  },
  processing: {
    label: 'প্রক্রিয়াধীন (Processing)',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    desc: 'পণ্যটি ফুড-গ্রেড সিলড প্যাকেজিংয়ে মোড়কজাত করা হচ্ছে।'
  },
  shipped: {
    label: 'পাঠানো হয়েছে (Shipped)',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    desc: 'পার্সেলটি আপনার ঠিকানায় পৌঁছাতে কুরিয়ারে হস্তান্তর করা হয়েছে।'
  },
  delivered: {
    label: 'ডেলিভারি সম্পন্ন (Delivered)',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'পণ্যটি সফলভাবে গ্রাহকের কাছে হস্তান্তর করা হয়েছে।'
  },
  cancelled: {
    label: 'বাতিল (Cancelled)',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    desc: 'অর্ডারটি কোনো কারণে বাতিল করা হয়েছে।'
  }
};

export const OrderTrackModal: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    const res = await api.trackOrder(query.trim());
    setLoading(false);

    if (!res.success || !res.orders || res.orders.length === 0) {
      setError(res.error || 'এই নম্বর বা অর্ডার আইডিতে কোনো অর্ডার খুঁজে পাওয়া যায়নি।');
      setOrders([]);
    } else {
      setOrders(res.orders);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1F6E43] mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#133926]">
            আপনার অর্ডার ট্র্যাক করুন
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            আপনার মোবাইল নম্বর অথবা অর্ডার নম্বর লিখে সার্চ করুন
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="যেমন: 017XXXXXXXX অথবা SN-..."
              className="flex-1 px-4 py-3 text-sm rounded-xl border border-stone-300 focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-bold text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {loading ? 'খোঁজা হচ্ছে...' : 'সার্চ করুন'}
            </button>
          </div>
        </form>

        {/* Results */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {orders.map((ord) => {
              const statusInfo = statusTextMap[ord.status] || {
                label: ord.status,
                color: 'bg-stone-100 text-stone-800',
                desc: ''
              };

              return (
                <div
                  key={ord.id}
                  className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                    <div>
                      <span className="text-[11px] text-stone-500 block font-semibold">অর্ডার আইডি</span>
                      <span className="font-extrabold text-stone-900 text-base">{ord.orderNumber}</span>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 bg-white p-3 rounded-xl border border-stone-100">
                    {statusInfo.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                    <div>
                      <span className="text-stone-400 block">তারিখ:</span>
                      <span className="font-medium text-stone-800">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">মোট প্রদেয়:</span>
                      <span className="font-bold text-[#133926] text-sm">৳ {ord.totalAmount} (COD)</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">পরিমাণ:</span>
                      <span className="font-medium text-stone-800">{ord.items[0]?.quantity || 1} টি বোতল</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">ডেলিভারি এলাকা:</span>
                      <span className="font-medium text-stone-800">
                        {ord.city === 'inside_dhaka' ? 'ঢাকার ভেতরে' : `ঢাকার বাইরে (${ord.district || 'জেলা'})`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
