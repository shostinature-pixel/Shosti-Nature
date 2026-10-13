import React from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../../types';

interface Props {
  settings: StoreSettings;
  onOpenOrder: () => void;
}

export const AnnouncementBar: React.FC<Props> = ({ settings }) => {
  if (!settings.showAnnouncement) return null;

  return (
    <div className="bg-[#133926] text-emerald-100 text-xs sm:text-sm py-2 px-4 border-b border-emerald-900/40 overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Marquee sliding text container */}
        <div className="flex items-center gap-2 font-medium overflow-hidden relative flex-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 z-10 bg-[#133926] pr-0.5" />
          <div className="overflow-hidden whitespace-nowrap w-full relative">
            <div className="animate-marquee inline-block font-semibold">
              {settings.announcementText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🌿 সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 📞 হটলাইন: {settings.phone}
            </div>
          </div>
        </div>

        {/* Support Phone shortcut */}
        <div className="hidden sm:flex items-center gap-4 text-xs shrink-0 z-10 bg-[#133926] pl-2">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>সাপোর্ট: {settings.phone}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
