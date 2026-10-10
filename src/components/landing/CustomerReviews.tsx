import React, { useState } from 'react';
import { Star, ShieldCheck, MessageSquarePlus } from 'lucide-react';
import { CustomerReview } from '../../types';
import { DEFAULT_REVIEWS } from '../../config/defaultStore';

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || 'বাংলাদেশ',
      rating,
      comment: comment.trim(),
      date: 'আজকে',
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setAuthor('');
      setLocation('');
      setComment('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1F6E43] uppercase block mb-1">
              গ্রাহক মূল্যায়ন
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#133926]">
              আমাদের সম্মানিত গ্রাহকদের বাস্তব অভিজ্ঞতা
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              প্রকৃত ভোক্তাদের অভিমত। কোনো কৃত্রিম বা সাজানো রেটিং প্রচার করা হয় না।
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-[#133926] border border-stone-300 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#1F6E43]" />
            <span>আপনার মতামত দিন</span>
          </button>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400' : 'text-stone-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400">{rev.date}</span>
                </div>

                <p className="text-stone-700 text-sm leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{rev.author}</h4>
                  <p className="text-xs text-stone-500">{rev.location}</p>
                </div>
                {rev.verified && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1F6E43]" />
                    <span>যাচাইকৃত</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write review modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-[#133926]">আপনার বাস্তব অভিজ্ঞতা শেয়ার করুন</h3>
            {submitted ? (
              <div className="p-4 bg-emerald-50 text-[#1F6E43] rounded-xl text-center text-sm font-semibold">
                ধন্যবাদ! আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="যেমন: হাসান মাহমুদ"
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">এলাকা / জেলা</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="যেমন: ধানমন্ডি, ঢাকা"
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">রেটিং</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`px-3 py-1 text-xs rounded-md border cursor-pointer ${
                          rating === num
                            ? 'bg-[#1F6E43] text-white border-[#1F6E43]'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {num} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">আপনার মন্তব্য</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="মেথি মিক্সের গুণমান ও আপনার অভিজ্ঞতা সংক্ষেপে লিখুন..."
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2 text-sm border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-sm bg-[#1F6E43] text-white font-semibold rounded-lg hover:bg-[#133926] cursor-pointer"
                  >
                    জমা দিন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
