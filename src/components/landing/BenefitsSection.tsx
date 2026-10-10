import React from 'react';
import { Leaf, Activity, Sparkles, Scale, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { DEFAULT_BENEFITS } from '../../config/defaultStore';

const iconMap: Record<string, React.ReactNode> = {
  Leaf: <Leaf className="w-6 h-6 text-[#1F6E43]" />,
  Activity: <Activity className="w-6 h-6 text-[#1F6E43]" />,
  Sparkles: <Sparkles className="w-6 h-6 text-[#1F6E43]" />,
  Scale: <Scale className="w-6 h-6 text-[#1F6E43]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#1F6E43]" />,
  Truck: <Truck className="w-6 h-6 text-[#1F6E43]" />
};

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="py-14 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            স্বাস্থ্য ও উপকারিতা
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926]">
            মেথি মিক্সের প্রমাণসমর্থিত ও প্রকৃত স্বাস্থ্য উপকারিতা
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            অতিরিক্ত বা ভুয়া দাবি নয়; প্রাচীন ভেষজ জ্ঞান ও বিজ্ঞানের দৃষ্টিতে মেথির প্রমাণিত উপযোগিতা
          </p>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_BENEFITS.map((b, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/80">
                {iconMap[b.icon] || <Leaf className="w-6 h-6 text-[#1F6E43]" />}
              </div>
              <h3 className="text-lg font-bold text-[#133926]">
                {b.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>

        {/* Ethical Medical Disclaimer Banner */}
        <div className="mt-12 bg-white rounded-2xl p-5 sm:p-6 border-l-4 border-l-amber-500 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
          <div className="text-xs sm:text-sm text-stone-600 space-y-1">
            <span className="font-bold text-stone-900 block">
              স্বাস্থ্য সচেতনতামূলক সতকর্তা (Health Disclaimer):
            </span>
            <p>
              মেথি মিক্স একটি প্রাকৃতিক পরিপূরক খাদ্যপণ্য। এটি কোনো নির্দিষ্ট রোগ (যেমন ডায়াবেটিস, উচ্চ রক্তচাপ) সম্পূর্ণ নির্মূল বা ঔষধের বিকল্প হিসেবে দাবি করা হয় না। স্বাস্থ্য সংক্রান্ত জটিলতা থাকলে চিকিৎসকের পরামর্শ মেনে চলুন।
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
