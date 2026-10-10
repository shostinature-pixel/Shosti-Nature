import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { ProductItem, StoreSettings } from '../../types';

interface Props {
  product: ProductItem;
  settings: StoreSettings;
  onSelectQuantity: (qty: number) => void;
}

export const PricingOffers: React.FC<Props> = ({
  product,
  settings,
  onSelectQuantity
}) => {
  const base = product.basePrice;

  const packages = [
    {
      qty: 1,
      title: '১ বোতল (ট্রায়াল প্যাক)',
      sub: 'একক ব্যবহার বা প্রথমবার চেষ্টা করার জন্য',
      price: base,
      original: product.originalPrice,
      savings: product.originalPrice > base ? product.originalPrice - base : 0,
      badge: 'জনপ্রিয়'
    },
    {
      qty: 2,
      title: '২ বোতল (কম্বো অফার)',
      sub: '১ মাসের সম্পূর্ণ রেগুলার যত্ন',
      price: base * 2 - 50,
      original: product.originalPrice * 2,
      savings: (product.originalPrice * 2) - (base * 2 - 50),
      badge: '৫০ টাকা বিশেষ ছাড়',
      recommended: true
    },
    {
      qty: 3,
      title: '৩ বোতল (ফ্যামিলি প্যাক)',
      sub: 'পরিবারের সকলের স্বাস্থ্য সুরক্ষায়',
      price: base * 3 - 150,
      original: product.originalPrice * 3,
      savings: (product.originalPrice * 3) - (base * 3 - 150),
      badge: '১৫০ টাকা সাশ্রয়'
    }
  ];

  return (
    <section id="pricing" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            স্বচ্ছ মূল্যতালিকা
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926]">
            অর্ডার ও প্যাকেজ নির্বাচন করুন
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            কোনো লুকানো খরচ নেই; ক্যাশ অন ডেলিভারিতে নিশ্চিন্তে সংগ্রহ করুন
          </p>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.qty}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                pkg.recommended
                  ? 'bg-white border-2 border-[#1F6E43] shadow-lg ring-4 ring-emerald-500/10'
                  : 'bg-white border border-stone-200/90 shadow-xs hover:shadow-md'
              }`}
            >
              {pkg.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
                    pkg.recommended
                      ? 'bg-[#1F6E43] text-white'
                      : 'bg-stone-800 text-stone-100'
                  }`}
                >
                  {pkg.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-[#133926] mt-2">
                  {pkg.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {pkg.sub}
                </p>

                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#133926]">
                      ৳ {pkg.price}
                    </span>
                    {pkg.original > pkg.price && (
                      <span className="text-base text-stone-400 line-through">
                        ৳ {pkg.original}
                      </span>
                    )}
                  </div>
                  {pkg.savings > 0 && (
                    <span className="inline-block mt-1 text-xs font-semibold text-[#1F6E43] bg-emerald-50 px-2.5 py-0.5 rounded">
                      মোট সাশ্রয়: ৳ {pkg.savings}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1F6E43] shrink-0" />
                    <span>পরিমাণ: {pkg.qty} টি সিলযুক্ত বোতল</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1F6E43] shrink-0" />
                    <span>ক্যাশ অন ডেলিভারি প্রযোজ্য</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1F6E43] shrink-0" />
                    <span>ডেলিভারি চার্জ: ঢাকা ৳ {settings.deliveryInsideDhaka} | বাইরে ৳ {settings.deliveryOutsideDhaka}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectQuantity(pkg.qty)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    pkg.recommended
                      ? 'bg-[#1F6E43] hover:bg-[#133926] text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>এই প্যাকেজটি সিলেক্ট করুন</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
