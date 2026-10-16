import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Search, Sparkles, Lock } from 'lucide-react';
import { StoreSettings } from '../../types';

interface Props {
  settings: StoreSettings;
  onTrackClick: () => void;
  onAdminClick: () => void;
  onOrderClick: () => void;
}

export const Header: React.FC<Props> = ({
  settings,
  onTrackClick,
  onAdminClick,
  onOrderClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'হোম', href: '#hero' },
    { label: 'পণ্য পরিচিতি', href: '#about' },
    { label: 'উপকারিতা', href: '#benefits' },
    { label: 'গ্যালারি', href: '#gallery' },
    { label: 'ব্যবহারবিধি', href: '#usage' },
    { label: 'প্রশ্ন-উত্তর', href: '#faq' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="https://res.cloudinary.com/c09ovevp/image/upload/v1791645620/WhatsApp_Image_2026-08-30_at_11.05.00_PM.jpg"
            alt={settings.storeName}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm border border-emerald-900/10 transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/logo.jpg';
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#133926] animate-bubble-gum inline-block">
                {settings.storeName}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block font-medium">
              {settings.tagline}
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-stone-700 hover:text-[#1F6E43] font-medium text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onTrackClick}
            className="flex items-center gap-1.5 text-stone-700 hover:text-[#1F6E43] font-medium text-sm transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-stone-500" />
            <span>অর্ডার ট্র্যাক</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onTrackClick}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            title="অর্ডার ট্র্যাকিং"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onAdminClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#133926] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-lg transition-all cursor-pointer shadow-2xs"
            title="অ্যাডমিন প্যানেল লগইন"
          >
            <Lock className="w-3.5 h-3.5 text-[#1F6E43]" />
            <span>অ্যাডমিন</span>
          </button>

          <button
            onClick={onOrderClick}
            className="hidden sm:inline-flex items-center gap-2 bg-[#1F6E43] hover:bg-[#133926] text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার করুন</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-5 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-stone-800 hover:text-[#1F6E43] hover:bg-emerald-50/50 rounded-md font-medium text-base transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTrackClick();
              }}
              className="flex items-center gap-2 text-left py-2 px-3 text-stone-800 hover:text-[#1F6E43] hover:bg-emerald-50/50 rounded-md font-medium text-base"
            >
              <Search className="w-4 h-4 text-stone-500" />
              <span>আপনার অর্ডার ট্র্যাক করুন</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="flex items-center gap-2 text-left py-2 px-3 text-[#133926] bg-emerald-100/70 border border-emerald-300 rounded-md font-bold text-base"
            >
              <Lock className="w-4 h-4 text-[#1F6E43]" />
              <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-200/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOrderClick();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#1F6E43] text-white py-3 rounded-lg font-semibold text-base shadow-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>এখনই অর্ডার করুন</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
