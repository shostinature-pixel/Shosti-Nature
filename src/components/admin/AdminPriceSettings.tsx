import React, { useState } from 'react';
import { ProductItem, StoreSettings } from '../../types';
import { api } from '../../lib/api';
import { Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  token: string;
  product: ProductItem;
  settings: StoreSettings;
  onUpdated: (product: ProductItem, settings: StoreSettings) => void;
}

export const AdminPriceSettings: React.FC<Props> = ({
  token,
  product,
  settings,
  onUpdated
}) => {
  const [basePrice, setBasePrice] = useState(product.basePrice.toString());
  const [inStock, setInStock] = useState(product.inStock);
  const [productName, setProductName] = useState(product.name);
  const [weight, setWeight] = useState(product.weight);

  const [deliveryDhaka, setDeliveryDhaka] = useState(settings.deliveryInsideDhaka.toString());
  const [deliveryOutside, setDeliveryOutside] = useState(settings.deliveryOutsideDhaka.toString());
  const [announcement, setAnnouncement] = useState(settings.announcementText);
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncement);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const parsedPrice = parseFloat(basePrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('অনুগ্রহ করে পণ্যের সঠিক মূল্য দিন');
      setSaving(false);
      return;
    }

    const res = await api.updateStoreSettings(token, {
      basePrice: parsedPrice,
      inStock,
      name: productName,
      weight,
      deliveryInsideDhaka: parseFloat(deliveryDhaka) || 70,
      deliveryOutsideDhaka: parseFloat(deliveryOutside) || 130,
      announcementText: announcement,
      showAnnouncement,
      phone,
      whatsapp
    });

    setSaving(false);

    if (res.success && res.product && res.settings) {
      setSuccessMsg('সেটিংস এবং পণ্যের মূল্য সফলভাবে ডাটাবেসে সেভ হয়েছে! ল্যান্ডিং পেজেও নতুন মূল্য কার্যকর হয়েছে।');
      onUpdated(res.product, res.settings);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.error || 'সেটিংস সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-[#133926]">
            মূল্য ও স্টোর সেটিংস ব্যবস্থাপনা
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            এখানে মূল্য বা স্টক পরিবর্তন করলে তা সরাসরি ডেটাবেসে ও ল্যান্ডিং পেজে হালনাগাদ হবে
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Section */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider">
            মেথি মিক্স (Methi Mix) পণ্য সেটিংস
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Price input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                বিক্রয় মূল্য (টাকা ৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="50"
                step="1"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-[#133926] text-base focus:border-[#1F6E43] outline-hidden"
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                প্রাথমিক মান: ৫০০ টাকা
              </span>
            </div>

            {/* In stock toggle */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                স্টক স্ট্যাটাস
              </label>
              <select
                value={inStock ? 'true' : 'false'}
                onChange={(e) => setInStock(e.target.value === 'true')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden cursor-pointer"
              >
                <option value="true">স্টকে পর্যাপ্ত রয়েছে (In Stock)</option>
                <option value="false">স্টক শেষ (Out of Stock)</option>
              </select>
            </div>

            {/* Product name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                পণ্যের নাম
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            {/* Net weight */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                নেট ওজন
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider">
            ডেলিভারি চার্জ ও কুরিয়ার কনফিগারেশন
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ঢাকার ভেতরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryDhaka}
                onChange={(e) => setDeliveryDhaka(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryOutside}
                onChange={(e) => setDeliveryOutside(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Contact & Announcements */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider">
            ঘোষণা বার ও কাস্টমার কেয়ার হেল্পলাইন
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                সাপোর্ট ফোন নম্বর
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="যেমন: 01700-000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোডসহ)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="যেমন: 8801700000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                শীর্ষ ঘোষণা বার টেক্সট (Announcement Bar)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="rounded text-[#1F6E43]"
                />
                <span>ঘোষণা বার দৃশ্যমান রাখুন</span>
              </label>
            </div>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
