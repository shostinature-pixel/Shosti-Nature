import React from 'react';
import { ProductItem } from '../../types';
import { Package, ShieldAlert, Sparkles, Clock, MapPin, Building2 } from 'lucide-react';

interface Props {
  product: ProductItem;
}

export const ProductSpecs: React.FC<Props> = ({ product }) => {
  const specs = [
    { label: 'পণ্যের নাম', value: product.name, icon: Sparkles },
    { label: 'নেট ওজন', value: product.weight, icon: Package },
    { label: 'উৎপাদন ও উৎস', value: `${product.origin} (প্রাকৃতিক ফার্মিং)`, icon: MapPin },
    { label: 'মোড়কজাতকারী সহযোগী', value: product.manufacturer, icon: Building2 },
    { label: 'সংরক্ষণ মেয়াদ', value: product.shelfLife, icon: Clock },
    { label: 'সংরক্ষণ পদ্ধতি', value: product.storageInstructions, icon: Package },
    { label: 'প্রধান উপাদান', value: product.ingredients.join(', '), icon: Sparkles },
    { label: 'সতর্কতা', value: product.warningNotice, icon: ShieldAlert, highlight: true }
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FAF8F5] border-t border-stone-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            টেকনিক্যাল স্পেসিফিকেশন
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#133926]">
            মেথি মিক্সের সম্পূর্ণ বিবরণ ও তথ্যাবলি
          </h2>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="divide-y divide-stone-100">
            {specs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 ${
                    item.highlight ? 'bg-amber-50/50' : idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:w-1/3 shrink-0">
                    <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-700' : 'text-[#1F6E43]'}`} />
                    <span className="text-xs sm:text-sm font-bold text-stone-700">
                      {item.label}
                    </span>
                  </div>
                  <div className={`text-xs sm:text-sm ${item.highlight ? 'text-amber-900 font-medium' : 'text-stone-800'} sm:w-2/3`}>
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
