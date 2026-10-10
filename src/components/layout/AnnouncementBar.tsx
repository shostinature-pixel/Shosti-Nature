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
    <div className="bg-[#133926] text-emerald-100 text-xs sm:text-sm py-2 px-4 border-b border-emerald-900/40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{settings.announcementText}</span>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
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
