import React from 'react';
import { StoreSettings } from '../../types';
import { Phone, Mail, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface Props {
  settings: StoreSettings;
  onOpenPolicy: (policyKey: 'delivery' | 'return' | 'privacy' | 'terms') => void;
  onTrackClick: () => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<Props> = ({
  settings,
  onOpenPolicy,
  onTrackClick,
  onAdminClick
}) => {
  return (
    <footer className="bg-[#133926] text-stone-200 pt-14 pb-20 sm:pb-12 border-t border-emerald-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/c09ovevp/image/upload/v1791645620/WhatsApp_Image_2026-08-30_at_11.05.00_PM.jpg"
                alt={settings.storeName}
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-emerald-500/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/logo.jpg';
                }}
              />
              <span className="text-xl font-extrabold text-white tracking-wide animate-bubble-gum inline-block">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              প্রকৃতির শুদ্ধতায় সুস্থ জীবনের অঙ্গীকার। আমরা বাংলাদেশের প্রতিটি প্রান্তে খাঁটি ও মানসম্মত ভেষজ মেথি মিক্স নিরাপদ প্যাকেজিংয়ে পৌঁছে দিতে প্রতিজ্ঞাবদ্ধ।
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>১০০% ক্যাশ অন ডেলিভারি সুরক্ষা</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <a href="#about" className="hover:text-emerald-300 transition-colors">
                  পণ্য পরিচিতি ও উপাদান
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-300 transition-colors">
                  মেথি মিক্সের উপকারিতা
                </a>
              </li>
              <li>
                <a href="#usage" className="hover:text-emerald-300 transition-colors">
                  সেবনবিধি ও নিয়মাবলী
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-300 transition-colors">
                  সচরাচর জিজ্ঞাসিত প্রশ্ন
                </a>
              </li>
              <li>
                <button
                  onClick={onTrackClick}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  আপনার অর্ডার ট্র্যাক করুন
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              নীতিমালা ও শর্তাবলি
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <button
                  onClick={() => onOpenPolicy('delivery')}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  ডেলিভারি পলিসি ও চার্জ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('return')}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  রিটার্ন ও রিফান্ড নীতি
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  গ্রাহক তথ্যের গোপনীয়তা নীতি
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  ব্যবহারের শর্তাবলি (Terms of Use)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              যোগাযোগ ও সহায়তা
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>হেল্পলাইন: {settings.phone}</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ইমেইল: {settings.email}</span>
              </a>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white fill-white shrink-0" />
                <span>WhatsApp-এ সরাসরি চ্যাট</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings.storeName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onAdminClick}
              className="text-stone-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              প্রশাসক প্রবেশ (Admin)
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
