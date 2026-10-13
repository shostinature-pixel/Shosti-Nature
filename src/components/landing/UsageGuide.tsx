import React from 'react';
import { GlassWater, Sunrise, Clock, CheckCircle } from 'lucide-react';
import { ProductItem } from '../../types';

interface Props {
  product: ProductItem;
}

export const UsageGuide: React.FC<Props> = ({ product }) => {
  const defaultSteps = [
    {
      step: '০১',
      title: 'পানি প্রস্তুত করুন',
      desc: 'এক গ্লাস (২০০-২৫০ মি.লি.) সাধারণ তাপমাত্রা অথবা হালকা কুসুম গরম পানি নিন।',
      icon: GlassWater
    },
    {
      step: '০২',
      title: 'মেথি মিক্স যোগ করুন',
      desc: '১ চা চামচ মেথি মিক্স পানিতে দিয়ে ভালো করে নেড়ে মিশিয়ে নিন। রাতে ভিজিয়ে রেখে সকালেও খাওয়া যায়।',
      icon: Sunrise
    },
    {
      step: '০৩',
      title: 'সকালে খালি পেটে পান করুন',
      desc: 'প্রতিদিন সকালে নাস্তার ২০-৩০ মিনিট পূর্বে খালি পেটে পান করা সর্বাধিক কার্যকারী।',
      icon: Clock
    }
  ];

  const stepsList = (product.usageSteps && product.usageSteps.length > 0)
    ? product.usageSteps.map((st, i) => ({
        step: st.step || `০${i + 1}`,
        title: st.title,
        desc: st.desc,
        icon: defaultSteps[i % defaultSteps.length].icon
      }))
    : defaultSteps;

  return (
    <section id="usage" className="py-14 sm:py-20 bg-white border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            সঠিক সেবন পদ্ধতি
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926] animate-bubble-gum">
            {product.usageTitle || `${product.name} কীভাবে ও কখন খাবেন?`}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            {product.usageSubtitle || 'সর্বোচ্চ সুফল পেতে প্রস্তুতকারকের নির্দেশিত সহজ ধাপগুলো অনুসরণ করুন।'}
          </p>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {stepsList.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-stone-200/80 relative space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#133926] text-white flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-300" />
                  </div>
                  <span className="text-3xl font-extrabold text-stone-300">
                    {st.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#133926]">
                  {st.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Useful tips */}
        <div className="mt-10 bg-emerald-50/70 rounded-2xl p-5 sm:p-6 border border-emerald-200/60 max-w-3xl mx-auto">
          <h4 className="font-bold text-[#133926] text-sm sm:text-base mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#1F6E43]" />
            <span>ভালো ফলাফলের জন্য কিছু জরুরি পরামর্শ:</span>
          </h4>
          <ul className="text-xs sm:text-sm text-stone-700 space-y-1.5 list-disc list-inside">
            <li>নিয়মিত একই সময়ে খাওয়ার অভ্যাস গড়ে তুলুন।</li>
            <li>দিনে পর্যাপ্ত পরিমাণ বিশুদ্ধ পানি (২.৫ থেকে ৩ লিটার) পান করুন।</li>
            <li>{product.storageInstructions}</li>
          </ul>
        </div>

      </div>
    </section>
  );
};
