import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProductItem, StoreSettings, Order, OrderSubmissionPayload } from '../../types';
import { api } from '../../lib/api';
import { analytics } from '../../lib/analytics';

interface Props {
  product: ProductItem;
  settings: StoreSettings;
  selectedQty?: number;
  onOrderSuccess: (order: Order) => void;
}

export const OrderForm: React.FC<Props> = ({
  product,
  settings,
  selectedQty = 1,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [district, setDistrict] = useState('ঢাকা');
  const [quantity, setQuantity] = useState(selectedQty);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [touchedForm, setTouchedForm] = useState(false);

  // Sync incoming selectedQty changes from pricing cards
  useEffect(() => {
    if (selectedQty) {
      setQuantity(selectedQty);
    }
  }, [selectedQty]);

  // Pricing calculations
  const unitPrice = product.basePrice;
  const subtotal = unitPrice * quantity;
  
  // Real combo discount:
  let discount = 0;
  if (quantity === 2) discount = 50;
  else if (quantity >= 3) discount = 150;

  const deliveryCharge = city === 'inside_dhaka'
    ? (settings.deliveryInsideDhaka ?? 70)
    : (settings.deliveryOutsideDhaka ?? 130);

  const totalAmount = subtotal + deliveryCharge - discount;

  // Track checkout initiation once
  const handleFieldFocus = () => {
    if (!touchedForm) {
      setTouchedForm(true);
      analytics.trackInitiateCheckout(totalAmount);
    }
  };

  // BD Phone validation helper
  const isPhoneValid = (val: string) => {
    const cleaned = val.replace(/[^\d+]/g, '').replace(/^(\+880|880)/, '0');
    return /^01[3-9]\d{8}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OrderForm submission triggered');
    setErrorMessage('');

    if (!product.inStock) {
      setErrorMessage('দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই।');
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('অনুগ্রহ করে আপনার সঠিক নাম লিখুন।');
      return;
    }

    if (!isPhoneValid(customerPhone)) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের সচল বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMessage('অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) লিখুন।');
      return;
    }

    setLoading(true);

    const payload: OrderSubmissionPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      city,
      district: city === 'inside_dhaka' ? 'ঢাকা' : district.trim(),
      quantity,
      notes: notes.trim(),
      idempotencyKey: `idmp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    };

    try {
      const response = await api.submitOrder(payload);

      if (!response.success || !response.order) {
        setErrorMessage(response.error || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        setLoading(false);
        return;
      }

      // Order succeeded on server!
      analytics.trackPurchase({
        orderNumber: response.order.orderNumber,
        totalAmount: response.order.totalAmount,
        quantity: quantity
      });

      setLoading(false);
      onOrderSuccess(response.order);

      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setNotes('');
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগে ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      setLoading(false);
    }
  };

  return (
    <section id="order-section" className="py-14 sm:py-20 bg-gradient-to-b from-white to-[#FAF8F5] border-t border-stone-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            ক্যাশ অন ডেলিভারি
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926] animate-bubble-gum">
            {product.name} অর্ডার ফর্ম
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            নিচের ফর্মটি পূরণ করে অর্ডার সম্পন্ন করুন। আমাদের প্রতিনিধি ফোন করে অর্ডার নিশ্চিত করবেন।
          </p>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Order Form Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#133926] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <h3 className="font-bold text-lg sm:text-xl">
                পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                কোনো অগ্রিম পেমেন্ট নেই | ১০০% নিরাপদ ডেলিভারি
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>নিরাপদ ও পরীক্ষিত</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                  আপনার নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="০১XXXXXXXXX (১১ ডিজিট)"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  * ডেলিভারি নিশ্চিত করতে আপনার সাথে এই নম্বরে যোগাযোগ করা হবে।
                </p>
              </div>

              {/* Delivery Zone / City */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                  ডেলিভারি এলাকা <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCity('inside_dhaka');
                      setDistrict('ঢাকা');
                    }}
                    className={`py-3 px-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      city === 'inside_dhaka'
                        ? 'border-[#1F6E43] bg-emerald-50/70 text-[#133926] shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>ঢাকার ভেতরে (৳ {settings.deliveryInsideDhaka})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCity('outside_dhaka');
                      if (district === 'ঢাকা') setDistrict('');
                    }}
                    className={`py-3 px-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      city === 'outside_dhaka'
                        ? 'border-[#1F6E43] bg-emerald-50/70 text-[#133926] shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>ঢাকার বাইরে (৳ {settings.deliveryOutsideDhaka})</span>
                  </button>
                </div>
              </div>

              {/* District if outside dhaka */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                  {city === 'inside_dhaka' ? 'জেলা' : 'আপনার জেলা'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={city === 'inside_dhaka' ? 'ঢাকা' : 'যেমন: চট্টগ্রাম, রাজশাহী, সিলেট'}
                  disabled={city === 'inside_dhaka'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all disabled:bg-stone-100"
                />
              </div>

            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                সম্পূর্ণ ঠিকানা (বাসা/রোড/মহল্লা/উপজেলা) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="যেমন: বাসা # ০৪, রোড # ০২, ব্লক # সি, মিরপুর-১, ঢাকা"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
              ></textarea>
            </div>

            {/* Quantity Selector */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-stone-800">
                পণ্য ও পরিমাণ নির্বাচন করুন:
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`py-3 px-3 rounded-xl border font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      quantity === qty
                        ? 'border-[#1F6E43] bg-[#1F6E43] text-white shadow-md'
                        : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>{qty} বোতল</span>
                    <span className={`text-[11px] font-normal ${quantity === qty ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {qty === 1 ? '৫০০ টাকা' : qty === 2 ? '৯৫০ টাকা (-৫০ ৳)' : '১৩৫০ টাকা (-১৫০ ৳)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                বিশেষ কোনো নির্দেশনা বা মন্তব্য (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: বিকাল ৫টার পর ডেলিভারি দেবেন"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            {/* Order Summary & Live Breakdown */}
            <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>পণ্যের মূল্য ({quantity} টি বোতল × ৳ {unitPrice}):</span>
                <span className="font-semibold text-stone-800">৳ {subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#1F6E43]">
                  <span>কম্বো ডিসকাউন্ট:</span>
                  <span className="font-semibold">- ৳ {discount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>ডেলিভারি চার্জ ({city === 'inside_dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):</span>
                <span className="font-semibold text-stone-800">৳ {deliveryCharge}</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-base sm:text-lg text-[#133926]">
                <span>সর্বমোট প্রদেয় মূল্য:</span>
                <span className="text-2xl text-[#133926]">৳ {totalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !product.inStock}
                className="w-full py-4 px-6 rounded-2xl bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-extrabold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>অর্ডার প্রক্রিয়াধীন... অনুগ্রহ করে অপেক্ষা করুন</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি - ৳ {totalAmount})</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[12px] text-stone-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6E43]" />
                  <span>কোনো অগ্রিম ফি নেই</span>
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#1F6E43]" />
                  <span>দ্রুত কুরিয়ার ডেলিভারি</span>
                </span>
              </div>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
