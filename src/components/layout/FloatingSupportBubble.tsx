import React, { useState } from 'react';
import { Phone, MessageCircle, X, Headphones, Sparkles } from 'lucide-react';
import { StoreSettings } from '../../types';

interface Props {
  settings: StoreSettings;
}

export const FloatingSupportBubble: React.FC<Props> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp prefilled message
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম Shosti Nature, মেথি মিক্স সম্পর্কে জানতে চাচ্ছি।')}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 select-none">
      
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Card Header */}
          <div className="bg-[#133926] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700/80 flex items-center justify-center text-emerald-300">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Shosti Nature সাপোর্ট</h4>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>আমরা সহায়তায় প্রস্তুত আছি</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="p-4 space-y-2.5 bg-[#FAF8F5]">
            
            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all hover:shadow-md cursor-pointer group"
            >
              <MessageCircle className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
              <span>WhatsApp-এ মেসেজ দিন</span>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${settings.phone}`}
              className="w-full py-3 px-4 rounded-2xl bg-[#133926] hover:bg-[#1F6E43] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all hover:shadow-md cursor-pointer group"
            >
              <Phone className="w-4 h-4 text-emerald-300 transition-transform group-hover:scale-110" />
              <div className="text-left">
                <span className="block text-[11px] font-normal text-emerald-200">সরাসরি কথা বলুন</span>
                <span>কল: {settings.phone}</span>
              </div>
            </a>

            <div className="pt-1 text-center">
              <span className="text-[10px] text-stone-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#1F6E43]" />
                <span>সকাল ৯টা - রাত ১১টা পর্যন্ত কাস্টমার হেল্পলাইন খোলা</span>
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Floating Toggle Bubble Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-stone-800 text-white rotate-90 scale-95'
              : 'bg-[#25D366] hover:bg-[#20ba59] text-white hover:scale-105 ring-4 ring-[#25D366]/20 shadow-[#25D366]/30'
          }`}
          aria-label="কাস্টমার সাপোর্ট ও হোয়াটসঅ্যাপ"
          title="সাপোর্ট ও হোয়াটসঅ্যাপ"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white fill-white" />
              {/* Online Ping Dot */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-200 rounded-full border-2 border-[#25D366] animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-100 rounded-full border-2 border-[#25D366]"></span>
            </div>
          )}
        </button>
      </div>

    </div>
  );
};
