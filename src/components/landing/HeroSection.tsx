import React from 'react';
import { ShoppingBag, CheckCircle2, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { ProductItem, StoreSettings } from '../../types';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface Props {
  product: ProductItem;
  settings: StoreSettings;
  onOrderClick: () => void;
}

export const HeroSection: React.FC<Props> = ({ product, settings, onOrderClick }) => {
  return (
    <section id="hero" className="relative pt-6 pb-12 md:py-16 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6]/40 to-[#FAF8F5]">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-stone-200/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Meta label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-[#133926] text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-[#1F6E43]" />
              <span>১০০% প্রাকৃতিক ও ঐতিহ্যবাহী ভেষজ মিশ্রণ</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#133926] leading-tight sm:leading-tight animate-bubble-gum">
              প্রতিদিনের সুস্থতায় প্রকৃতির বিশুদ্ধ ছোঁয়া —{' '}
              <span className="text-[#1F6E43] underline decoration-emerald-300 decoration-wavy underline-offset-8">
                {product.name}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              বাছাইকৃত খাঁটি মেথি দানা ও প্রাকৃতিক ভেষজ উপাদানের সংমিশ্রণে প্রস্তুতকৃত পুষ্টিকর মেথি মিক্স। হজম শক্তি বৃদ্ধি, স্বাভাবিক মেটাবলিজম বজায় রাখা ও শারীরিক সুস্থতায় প্রতিদিনের বিশ্বস্ত সঙ্গী।
            </p>

            {/* Price Box & Quick Highlights */}
            <div className="bg-white/90 border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-wider block font-semibold">
                    বর্তমান অফার মূল্য
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#133926]">
                      ৳ {product.basePrice}
                    </span>
                    {product.originalPrice > product.basePrice && (
                      <span className="text-base sm:text-lg text-stone-400 line-through">
                        ৳ {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {product.inStock ? 'স্টকে উপলভ্য' : 'স্টক শেষ'}
                  </span>
                  <span className="text-xs text-stone-500 block mt-1">
                    ওজন: {product.weight}
                  </span>
                </div>
              </div>

              {/* Call to action buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onOrderClick}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-order-bounce"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>ক্যাশ অন ডেলিভারিতে অর্ডার করুন</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি Shosti Nature মেথি মিক্স অর্ডার করতে চাই।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white fill-white shrink-0" />
                  <span>হোয়াটসঅ্যাপে অর্ডার</span>
                </a>
              </div>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-stone-700">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F6E43] shrink-0" />
                <span>পণ্য দেখে পেমেন্ট</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F6E43] shrink-0" />
                <span>সারাদেশে হোম ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F6E43] shrink-0" />
                <span>১০০% প্রিজারভেটিভমুক্ত</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image with badges */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm sm:max-w-md w-full">
              
              {/* Product Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 sm:p-4 shadow-xl border border-stone-200/90 aspect-square group">
                <img
                  src={product.image || '/images/default-methi-mix.jpg'}
                  alt="মেথি মিক্স বোতল - Shosti Nature"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback if custom image fails to load
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/default-methi-mix.jpg') {
                      target.src = '/images/default-methi-mix.jpg';
                    }
                  }}
                />

                {/* Badge Overlay */}
                <div className="absolute top-6 left-6 bg-[#133926]/90 backdrop-blur-md text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  অরিজিনাল ভেষজ ফর্মুলা
                </div>

                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ক্যাশ অন ডেলিভারি</span>
                </div>
              </div>

              {/* Note about real packaging */}
              <p className="text-[12px] text-stone-500 text-center mt-3">
                * আসল বোতলের ফুড-গ্রেড প্যাকেজিং ও সিলসহ অক্ষত অবস্থায় সরবরাহ করা হয়।
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
