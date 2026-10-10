import React from 'react';
import { X, Truck, RotateCcw, Shield, FileText } from 'lucide-react';
import { StoreSettings } from '../../types';

export type PolicyKey = 'delivery' | 'return' | 'privacy' | 'terms';

interface Props {
  policyKey: PolicyKey | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const PolicyModal: React.FC<Props> = ({ policyKey, settings, onClose }) => {
  if (!policyKey) return null;

  const contentMap: Record<PolicyKey, { title: string; icon: React.ElementType; content: React.ReactNode }> = {
    delivery: {
      title: 'ডেলিভারি পলিসি ও চার্জ',
      icon: Truck,
      content: (
        <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
          <p>
            <strong>Shosti Nature</strong> গ্রাহকদের জন্য নিরাপদ ও দ্রুত ডেলিভারি ব্যবস্থা পরিচালনা করে। আমাদের পণ্য ডেলিভারির নিয়মাবলী নিচে তুলে ধরা হলো:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>ডেলিভারি এলাকা:</strong> বাংলাদেশের যেকোনো প্রান্ত (৬৪ জেলা ও উপজেলা পর্যায়)।</li>
            <li><strong>ডেলিভারি চার্জ:</strong> ঢাকার ভেতরে ৳ {settings.deliveryInsideDhaka} এবং ঢাকার বাইরে ৳ {settings.deliveryOutsideDhaka}।</li>
            <li><strong>ডেলিভারি সময়সীমা:</strong> ঢাকার ভেতরে {settings.deliveryTimeDhaka} এবং ঢাকার বাইরে {settings.deliveryTimeOutside}।</li>
            <li><strong>ক্যাশ অন ডেলিভারি:</strong> পার্সেল ডেলিভারিম্যান থেকে গ্রহণের সময় পণ্য চেক করে নগদ মূল্যে বিল পরিশোধের সুযোগ রয়েছে।</li>
            <li><strong>অর্ডার কনফার্মেশন:</strong> অর্ডার সাবমিট করার পর আমাদের সাপোর্ট প্রতিনিধি গ্রাহকের মোবাইল নম্বরে কল করে ঠিকানা ও অর্ডার কনফার্ম করবেন।</li>
          </ul>
        </div>
      )
    },
    return: {
      title: 'রিটার্ন ও রিফান্ড নীতি (Return & Refund Policy)',
      icon: RotateCcw,
      content: (
        <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
          <p>
            আমাদের প্রধান লক্ষ্য গ্রাহকের পূর্ণ সন্তুষ্টি। মেথি মিক্সের গুণমান ও নিরাপত্তা বিষয়ে আমরা সর্বোচ্চ সতর্কতা অবলম্বন করি।
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>ডেলিভারির সময় যাচাই:</strong> কুরিয়ার কর্মী পার্সেল বুঝিয়ে দেওয়ার সময় বোতলের সিল, কোনো লিক বা বাহ্যিক ক্ষতি রয়েছে কি না তা চেক করে নিন।</li>
            <li><strong>ত্রুটিপূর্ণ পণ্য ফেরত:</strong> পার্সেল ভাঙা বা সিল খোলা অবস্থায় পেলে তৎক্ষণাৎ ডেলিভারিম্যানকে পণ্য ফেরত দিয়ে দিন এবং কোনো টাকা দিতে হবে না।</li>
            <li><strong>রিপ্লেসমেন্ট সুবিধা:</strong> অনাকাঙ্ক্ষিত কোনো সমস্যা থাকলে আমাদের হেল্পলাইন নম্বরে ২৪ ঘণ্টার মধ্যে জানালে আমরা বিনা খরচে পুনরায় সঠিক পণ্য সরবরাহ করব।</li>
            <li><strong>রিফান্ড নীতি:</strong> কোনো কারণে গ্রাহক ইতোমধ্যে ক্যাশ প্রদান করে থাকেন এবং পণ্য অমিল বা অযোগ্য প্রমাণিত হয়, তবে ৩ কার্যদিবসের মধ্যে মোবাইল ব্যাংকিং (বিকাশ/নগদ) এর মাধ্যমে সম্পূর্ণ অর্থ ফেরত প্রদান করা হবে।</li>
          </ul>
        </div>
      )
    },
    privacy: {
      title: 'গ্রাহকের তথ্যের গোপনীয়তা নীতি (Privacy Policy)',
      icon: Shield,
      content: (
        <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
          <p>
            Shosti Nature আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে সর্বোচ্চ শ্রদ্ধা করে।
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>সংগৃহীত তথ্য:</strong> অর্ডার সম্পন্ন করতে আমরা কেবল আপনার নাম, যোগাযোগের মোবাইল নম্বর এবং ডেলিভারির সম্পূর্ণ ঠিকানা সংগ্রহ করি।</li>
            <li><strong>তথ্যের ব্যবহার:</strong> আপনার দেওয়া ফোন নম্বর ও ঠিকানা শুধুমাত্র আপনার পার্সেল ডেলিভারি এবং অর্ডার সংক্রান্ত আপডেটের জন্য ব্যবহৃত হয়।</li>
            <li><strong>তথ্য সুরক্ষা:</strong> আমরা আপনার কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষ বা বিজ্ঞাপনী সংস্থার কাছে বিক্রি বা উন্মুক্ত করি না।</li>
            <li><strong>নিরাপত্তা ব্যবস্থা:</strong> আমাদের ডাটাবেস ও সার্ভার এনক্রিপ্টেড সংযোগে পরিচালিত।</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: 'ব্যবহারের শর্তাবলি (Terms & Conditions)',
      icon: FileText,
      content: (
        <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
          <p>
            Shosti Nature ওয়েবসাইট ও সেবা ব্যবহারের সাধারণ শর্তাবলি:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>অর্ডার করার জন্য গ্রাহককে সঠিক নাম, সক্রিয় ফোন নম্বর ও সঠিক ঠিকানা দিতে হবে।</li>
            <li>মেথি মিক্স প্রাকৃতিক সম্পূরক খাদ্যপণ্য। এটি কোনো রোগের সরাসরি ফার্মাসিউটিক্যাল প্রতিষেধক নয়।</li>
            <li>যেকোনো সন্দেহভাজন ভুয়া অর্ডার বা অসৎ উদ্দেশ্যে করা অর্ডার ব্যবসায়ী বাতিল করার অধিকার সংরক্ষণ করেন।</li>
            <li>পণ্যের মূল্য ও অফার সংক্রান্ত তথ্য পরিবর্তনশীল, তবে কোনো অর্ডারের মূল্য কনফার্মেশনের পর তা অপরিবর্তিত থাকে।</li>
          </ul>
        </div>
      )
    }
  };

  const current = contentMap[policyKey];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F6E43] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#133926]">
            {current.title}
          </h3>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {current.content}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#133926] hover:bg-[#1F6E43] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            বুঝেছি / বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
