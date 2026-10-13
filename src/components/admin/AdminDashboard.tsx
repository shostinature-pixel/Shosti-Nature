import React, { useState, useEffect } from 'react';
import { ProductItem, StoreSettings, Order, AdminStats, OrderStatus } from '../../types';
import { api } from '../../lib/api';
import { AdminOrderList } from './AdminOrderList';
import { AdminPriceSettings } from './AdminPriceSettings';
import { AdminSecuritySettings } from './AdminSecuritySettings';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  TrendingUp,
  LogOut,
  ExternalLink,
  Settings,
  ListOrdered,
  Database,
  RefreshCw,
  AlertTriangle,
  KeyRound
} from 'lucide-react';

interface Props {
  token: string;
  onLogout: () => void;
  onBackToStore: () => void;
  onProductUpdatedInParent: (product: ProductItem, settings: StoreSettings) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  token,
  onLogout,
  onBackToStore,
  onProductUpdatedInParent
}) => {
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'settings' | 'security' | 'database'>('orders');

  const fetchData = async () => {
    setLoading(true);
    const res = await api.getAdminDashboard(token);
    setLoading(false);

    if (res.success) {
      if (res.stats) setStats(res.stats);
      if (res.orders) setOrders(res.orders);
      if (res.product) setProduct(res.product);
      if (res.settings) setSettings(res.settings);
      if (res.isBackendConnected !== undefined) setIsBackendConnected(res.isBackendConnected);
    }
  };

  const fetchDataQuietly = async () => {
    const res = await api.getAdminDashboard(token);
    if (res.success) {
      if (res.stats) setStats(res.stats);
      if (res.orders) setOrders(res.orders);
      if (res.product) setProduct(res.product);
      if (res.settings) setSettings(res.settings);
      if (res.isBackendConnected !== undefined) setIsBackendConnected(res.isBackendConnected);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchDataQuietly();
    }, 6000);
    return () => clearInterval(interval);
  }, [token]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    // Refresh stats
    fetchData();
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    fetchData();
  };

  const handleProductSettingsUpdated = (newProd: ProductItem, newSet: StoreSettings) => {
    setProduct(newProd);
    setSettings(newSet);
    onProductUpdatedInParent(newProd, newSet);
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-600 font-semibold">
          <RefreshCw className="w-5 h-5 animate-spin text-[#1F6E43]" />
          <span>অ্যাডমিন তথ্য লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-16">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/c09ovevp/image/upload/v1791645620/WhatsApp_Image_2026-08-30_at_11.05.00_PM.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-xs border border-emerald-900/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/logo.jpg';
              }}
            />
            <div>
              <h1 className="font-extrabold text-[#133926] text-lg">
                Shosti Nature অ্যাডমিন প্যানেল
              </h1>
              <p className="text-[11px] text-stone-500 font-medium">
                প্রোডাক্ট: {product?.name || 'মেথি মিক্স (Methi Mix)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>স্টোর দেখুন</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Real-time Backend & Database Connection Indicator */}
        <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div>
              <span className="font-bold text-emerald-900 block sm:inline mr-2">
                লাইভ ফুল-স্ট্যাক এক্সপ্রেস ব্যাকএন্ড ও ডাটাবেস সক্রিয়
              </span>
              <span className="text-stone-600 text-xs">
                সকল অর্ডার এবং মূল্য পরিবর্তন সরাসরি সার্ভার ডাটাবেসে (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px] text-emerald-800">data/store.json</code>) স্থায়ীভাবে সংরক্ষিত হচ্ছে।
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-2xs">
              ✓ ডাটাবেস সংযুক্ত
            </span>
          </div>
        </div>
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>মোট অর্ডার</span>
              <Package className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900">
              {stats?.totalOrders || orders.length}
            </div>
            <span className="text-[11px] text-stone-400">সর্বমোট জমা হওয়া অর্ডার</span>
          </div>

          {/* Pending */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span>অপেক্ষমাণ (Pending)</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900">
              {stats?.pendingOrders || 0}
            </div>
            <span className="text-[11px] text-amber-700">কনফার্মেশনের অপেক্ষায়</span>
          </div>

          {/* Confirmed / Shipped */}
          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
              <span>প্রক্রিয়াধীন / কুরিয়ারে</span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-900">
              {(stats?.confirmedOrders || 0) + (stats?.shippedOrders || 0)}
            </div>
            <span className="text-[11px] text-blue-700">ডেলিভারির পথে</span>
          </div>

          {/* Delivered */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
              <span>সম্পন্ন ডেলিভারি</span>
              <CheckCircle className="w-4 h-4 text-[#1F6E43]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900">
              {stats?.deliveredOrders || 0}
            </div>
            <span className="text-[11px] text-emerald-700">সফলভাবে প্রাপ্ত</span>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>মোট রাজস্ব (Revenue)</span>
              <TrendingUp className="w-4 h-4 text-[#1F6E43]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#133926]">
              ৳ {stats?.totalRevenue || 0}
            </div>
            <span className="text-[11px] text-stone-400">ক্যাশ অন ডেলিভারি হিসাব</span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#133926] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>অর্ডারের তালিকা ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#133926] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>প্রোডাক্ট ও স্টোর সেটিংস (৳ {product?.basePrice || 500})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#133926] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-300" />
            <span>পাসওয়ার্ড পরিবর্তন ও নিরাপত্তা</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-[#133926] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>সিস্টেম ডেটাবেস</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'orders' && (
          <AdminOrderList
            token={token}
            orders={orders}
            onStatusChange={handleStatusChange}
            onOrderDeleted={handleOrderDeleted}
          />
        )}

        {activeTab === 'settings' && product && settings && (
          <AdminPriceSettings
            token={token}
            product={product}
            settings={settings}
            onUpdated={handleProductSettingsUpdated}
          />
        )}

        {activeTab === 'security' && (
          <AdminSecuritySettings token={token} />
        )}

        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#133926]">
                ডেটাবেস ও নিরাপত্তা নির্দেশিকা
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Shosti Nature অ্যাপ্লিকেশনটি বর্তমানে ফুল-স্ট্যাক এক্সপ্রেস ব্যাকএন্ড এবং পারসিস্টেন্ট স্টোরেজে সক্রিয়।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                <h4 className="font-bold text-[#133926] text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>বর্তমান অ্যাক্টিভ ব্যাকএন্ড স্টোরেজ:</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  বর্তমান অর্ডার ও সেটিংস <code className="bg-stone-200/70 px-1.5 py-0.5 rounded text-stone-800">data/store.json</code> ফাইলে সংরক্ষিত হচ্ছে। অ্যাডমিন প্যানেল থেকে মূল্য পরিবর্তন বা অর্ডার স্ট্যাটাস আপডেট করলে তা সরাসরি সংরক্ষিত থাকে।
                </p>
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  ✓ সার্ভার সাইড প্রাইস ভ্যালিডেশন কার্যকর
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                <h4 className="font-bold text-[#133926] text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#1F6E43]" />
                  <span>Supabase প্রোডাকশন ডেটাবেস স্কিমা:</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Supabase ক্লাউডে ডেপ্লয় করার জন্য <code className="bg-stone-200/70 px-1.5 py-0.5 rounded text-stone-800">supabase/schema.sql</code> এবং <code className="bg-stone-200/70 px-1.5 py-0.5 rounded text-stone-800">supabase/seed.sql</code> প্রস্তুত করা হয়েছে। এতে Row Level Security (RLS) ও সার্ভিস-রোল প্রটেকশন অন্তর্ভুক্ত।
                </p>
                <div className="text-xs font-semibold text-stone-700 bg-stone-100 p-2.5 rounded-lg border border-stone-200">
                  SQL ফাইল ডিরেক্টরি: <span className="font-mono text-[11px]">/supabase/schema.sql</span>
                </div>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>নিরাপত্তা টিপস:</strong> প্রোডাকশনে চালানোর সময় <code className="bg-amber-100 px-1 rounded font-mono">ADMIN_PASSWORD</code> এনভায়রনমেন্ট ভেরিয়েবলে নিজস্ব গোপন পাসওয়ার্ড ব্যবহার করুন। কাস্টমারের মোবাইল নম্বর ও ঠিকানা কখনোই পাবলিকলি উন্মুক্ত করা হয় না।
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
