import React, { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface Props {
  mainImage: string;
}

export const GallerySection: React.FC<Props> = ({ mainImage }) => {
  // Gallery items with descriptions
  const galleryItems = [
    {
      url: mainImage,
      title: 'মেথি মিক্স বোতল ও মূল প্যাকেজিং',
      caption: 'ফুড-গ্রেড বায়ুরোধী জারে সিল করা খাঁটি মেথি মিক্স।'
    },
    {
      url: mainImage, // Uses high res product image
      title: 'বাছাইকৃত খাঁটি মেথি দানা ও উপাদান',
      caption: 'ধুলাবালি ও কৃত্রিম কেমিক্যালমুক্ত প্রাকৃতিক শস্য ও ভেষজ সংমিশ্রণ।'
    },
    {
      url: mainImage,
      title: 'দৈনন্দিন সেবনের জন্য প্রস্তুত',
      caption: 'সকালে পানিতে মিশিয়ে সহজে খাওয়ার জন্য পরিমিত দানা ও গুঁড়োর ভারসাম্য।'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-white border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
            পণ্য প্রদর্শনী
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926]">
            মেথি মিক্সের আসল ছবি ও মোড়ক
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            আমরা যেমন দেখাই, ঠিক তেমনই আসল এবং পরিচ্ছন্ন মোড়কে আপনার কাছে পৌঁছে দেব
          </p>
          <div className="w-16 h-1 bg-[#1F6E43] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Gallery View */}
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Active Main Viewer */}
          <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group">
            <img
              src={galleryItems[activeIndex].url}
              alt={galleryItems[activeIndex].title}
              className="w-full h-full object-cover transition-transform duration-300"
            />

            {/* Click to zoom overlay */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-xl backdrop-blur-xs transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="বড় করে দেখুন"
            >
              <ZoomIn className="w-4 h-4" />
              <span>বড় করে দেখুন</span>
            </button>

            {/* Caption bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5 text-white">
              <h4 className="font-bold text-sm sm:text-base">
                {galleryItems[activeIndex].title}
              </h4>
              <p className="text-xs text-stone-200 mt-0.5">
                {galleryItems[activeIndex].caption}
              </p>
            </div>

            {/* Mobile / Quick Prev & Next buttons */}
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-md transition-all cursor-pointer"
              aria-label="আগের ছবি"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-md transition-all cursor-pointer"
              aria-label="পরের ছবি"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 justify-center overflow-x-auto py-2">
            {galleryItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  activeIndex === idx
                    ? 'border-[#1F6E43] ring-2 ring-emerald-300 ring-offset-1 scale-105'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="text-center text-xs text-stone-500 pt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1F6E43]" />
            <span>আসল সিলযুক্ত বোতল ও সঠিক ওজনের নিশ্চয়তা</span>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center">
            <img
              src={galleryItems[activeIndex].url}
              alt={galleryItems[activeIndex].title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center text-white mt-4">
              <h4 className="font-bold text-lg">{galleryItems[activeIndex].title}</h4>
              <p className="text-sm text-stone-300 mt-1">{galleryItems[activeIndex].caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
