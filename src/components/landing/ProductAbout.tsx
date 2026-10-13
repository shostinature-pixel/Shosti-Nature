import React from 'react';
import { ProductItem } from '../../types';
import { Check, Info, HeartHandshake, ShieldCheck } from 'lucide-react';

interface Props {
  product: ProductItem;
}

export const ProductAbout: React.FC<Props> = ({ product }) => {
  return (
    <section id="about" className="py-14 sm:py-18 bg-white border-t border-stone-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            প্রকৃতির খাঁটি উপাদান
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926] animate-bubble-gum">
            {product.aboutTitle || `${product.name} কী এবং কেন এটি বিশেষ?`}
          </h2>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Detailed Narrative */}
          <div className="space-y-5 text-stone-700 leading-relaxed">
            <p className="text-base sm:text-lg">
              <strong className="text-[#133926]">Shosti Nature {product.name}</strong> হলো {product.aboutDesc1 || 'শতাব্দীপ্রাচীন ভারতীয় উপমহাদেশীয় ভেষজ ঐতিহ্য এবং আধুনিক স্বাস্থ্য সচেতনতার এক মেলবন্ধন।'}
            </p>
            <p className="text-stone-600">
              {product.aboutDesc2 || 'বাজারে সাধারণ ভেষজ উপাদান গ্রহণের ক্ষেত্রে যে অসুবিধা দেখা যায়, আমাদের এই বিশেষ মিক্সে তা পরিশোধিত অনুপাত ও মৃদু ভেষজ উপাদানের সমন্বয়ে সহজে গ্রহণোপযোগী করা হয়েছে।'}
            </p>

            {/* Ingredients List */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/80">
              <h3 className="font-bold text-[#133926] text-base mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1F6E43]" />
                <span>যাচাইকৃত প্রধান উপাদানসমূহ:</span>
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                {product.ingredients.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#1F6E43] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Honest Sourcing & Manufacturing Transparency Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-0.5">স্বচ্ছতা ও প্রস্তুতকারক পরিচিতি:</p>
                <p className="text-stone-700 leading-normal">
                  পণ্যটি প্রস্তুত ও মোড়কজাতকরণে সহযোগী প্রতিষ্ঠান এম এইচ ন্যাচারাল প্রডাক্টস লিঃ (M H Natural Product Ltd.)। Shosti Nature দায়িত্বশীল ডিস্ট্রিবিউটর হিসেবে কোয়ালিটি ও বিশুদ্ধতা নিশ্চিত করে সরাসরি গ্রাহকের কাছে সরবরাহ করে।
                </p>
              </div>
            </div>

          </div>

          {/* Highlights Box */}
          <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F3EDE3] p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#133926] pb-2 border-b border-stone-200">
              কেন আপনি প্রতিদিন মেথি মিক্স খাবেন?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#133926] text-white flex items-center justify-center font-bold shrink-0">
                  ০১
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">১০০% প্রাকৃতিক পরিচ্ছন্নতা</h4>
                  <p className="text-sm text-stone-600 mt-1">
                    ধুলাবালি ও ক্ষতিকর উপাদানমুক্ত পরিষ্কার শস্য থেকে স্বাস্থ্যসম্মত উপায়ে প্রস্তুত।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1F6E43] text-white flex items-center justify-center font-bold shrink-0">
                  ০২
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">সহজ ও আরামদায়ক সেবনযোগ্য</h4>
                  <p className="text-sm text-stone-600 mt-1">
                    নিয়মিত সকালে ১ গ্লাস পানির সাথে গ্রহণ করা যায়, কোনো জটিল প্রস্তুতি ছাড়া।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C98A2C] text-white flex items-center justify-center font-bold shrink-0">
                  ০৩
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">সততা ও বাস্তব ফলাফল</h4>
                  <p className="text-sm text-stone-600 mt-1">
                    কোনো অবাস্তব বা অলৌকিক দাবি নয়; শারীরিক সুস্থতায় প্রমাণিত প্রাকৃতিক পুষ্টি উপাদান।
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-center gap-3">
                <HeartHandshake className="w-6 h-6 text-[#1F6E43] shrink-0" />
                <div className="text-xs text-stone-600">
                  <span className="font-semibold text-stone-900 block">ক্যাশ অন ডেলিভারি নিশ্চয়তা:</span>
                  পার্সেল রিসিভ করে বোতলের সিল ও প্যাকেজিং দেখে ডেলিভারিম্যানকে বিল দিন।
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
