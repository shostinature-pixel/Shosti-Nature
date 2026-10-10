import React from 'react';
import { ShieldCheck, Truck, Headphones, ThumbsUp } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const points = [
    {
      title: 'বাস্তব ও দায়িত্বশীল সততা',
      desc: 'আমরা কোনো অবাস্তব রোগমুক্তির মিথ্যা প্রলোভন দিই না। পণ্যের খাঁটি মান ও প্রকৃত খাদ্যগুণ বজায় রাখাই আমাদের মূল দর্শন।',
      icon: ShieldCheck
    },
    {
      title: 'পণ্য দেখে পেমেন্টের সুযোগ',
      desc: 'ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই। কুরিয়ার কর্মীর কাছ থেকে পার্সেল বুঝে পেয়ে টাকা দিন।',
      icon: ThumbsUp
    },
    {
      title: 'সুরক্ষিত ফুড-গ্রেড সিল প্যাকেজিং',
      desc: 'প্রতিটি বোতল কঠোর স্বাস্থ্যবিধি মেনে বায়ুরোধী জারে সিল করা হয়, যাতে ভেতরের সতেজতা ও গুণাগুণ অক্ষুণ্ণ থাকে।',
      icon: Truck
    },
    {
      title: 'বন্ধুত্বপূর্ণ কাস্টমার সাপোর্ট',
      desc: 'অর্ডারের আগে কিংবা পণ্য পাওয়ার পরে যেকোনো পরামর্শ বা সহায়তার জন্য আমাদের ফোন ও হোয়াটসঅ্যাপ হেল্পলাইন সবসময় খোলা।',
      icon: Headphones
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            আমাদের প্রতিশ্রুতি
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926]">
            কেন Shosti Nature-এর ওপর আস্থা রাখবেন?
          </h2>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200/80 space-y-3 hover:border-emerald-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-[#133926] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#1F6E43]" />
                </div>
                <h3 className="font-bold text-base text-[#133926]">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
