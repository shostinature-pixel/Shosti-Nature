import React from 'react';
import { CheckCircle2, Copy, X, Phone, Check } from 'lucide-react';
import { Order, StoreSettings } from '../../types';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface Props {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<Props> = ({ order, settings, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `আসসালামু আলাইকুম Shosti Nature, আমার অর্ডার নাম্বার: ${order.orderNumber}। পরিমাণ: ${order.items[0]?.quantity} বোতল। মোট বিল: ৳ ${order.totalAmount}।`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1F6E43] mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#133926]">
            আলহামদুলিল্লাহ! আপনার অর্ডার সফল হয়েছে
          </h3>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            আমাদের কাস্টমার কেয়ার টিম শিগগিরই আপনার নম্বরে কল করে অর্ডারটি কনফার্ম করবে।
          </p>
        </div>

        {/* Order Number Box */}
        <div className="my-5 p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              আপনার অর্ডার নম্বর (Order ID)
            </span>
            <span className="text-lg sm:text-xl font-black text-[#133926] tracking-wide">
              {order.orderNumber}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
          </button>
        </div>

        {/* Order Summary */}
        <div className="space-y-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
          <div className="flex justify-between">
            <span className="text-stone-500">গ্রাহকের নাম:</span>
            <span className="font-semibold text-stone-900">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">মোবাইল নম্বর:</span>
            <span className="font-semibold text-stone-900">{order.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">ডেলিভারি ঠিকানা:</span>
            <span className="font-semibold text-stone-900 text-right max-w-[200px] truncate">
              {order.deliveryAddress}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">পরিমাণ:</span>
            <span className="font-semibold text-stone-900">
              {order.items[0]?.quantity || 1} টি বোতল ({order.items[0]?.productName})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">পেমেন্ট মেথড:</span>
            <span className="font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded text-xs">
              ক্যাশ অন ডেলিভারি (COD)
            </span>
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-base text-[#133926]">
            <span>মোট প্রদেয় বিল:</span>
            <span className="text-xl">৳ {order.totalAmount}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 text-white fill-white shrink-0" />
            <span>WhatsApp-এ বিস্তারিত পাঠান</span>
          </a>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#133926] hover:bg-[#1F6E43] text-white font-bold text-sm text-center transition-colors cursor-pointer"
          >
            সম্পন্ন হয়েছে
          </button>
        </div>

        <p className="text-center text-[11px] text-stone-400 mt-4 flex items-center justify-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-stone-500" />
          <span>যেকোনো প্রয়োজনে আমাদের ফোন করুন: {settings.phone}</span>
        </p>

      </div>
    </div>
  );
};
