import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { DEFAULT_FAQS } from '../../config/defaultStore';
import { ProductItem } from '../../types';

interface Props {
  product: ProductItem;
}

export const FAQSection: React.FC<Props> = ({ product }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqList = (product.faqList && product.faqList.length > 0)
    ? product.faqList
    : DEFAULT_FAQS;

  return (
    <section id="faq" className="py-14 sm:py-20 bg-white border-t border-stone-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            সাধারণ জিজ্ঞাসাবলী
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926] animate-bubble-gum">
            {product.faqTitle || 'সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            {product.faqSubtitle || 'পণ্য, ডেলিভারি এবং ব্যবহার নিয়ে আপনার মনের সাধারণ প্রশ্নগুলোর উত্তর।'}
          </p>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#133926] hover:text-[#1F6E43] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#1F6E43] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#1F6E43]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-200/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
