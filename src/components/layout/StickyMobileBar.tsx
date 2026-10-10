import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ProductItem } from '../../types';

interface Props {
  product: ProductItem;
  onOrderClick: () => void;
}

export const StickyMobileBar: React.FC<Props> = ({ product, onOrderClick }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-2.5 px-4 sm:hidden shadow-lg transition-transform">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-500 uppercase block font-semibold">
            মেথি মিক্স
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#133926]">
              ৳ {product.basePrice}
            </span>
            {product.originalPrice > product.basePrice && (
              <span className="text-xs text-stone-400 line-through">
                ৳ {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onOrderClick}
          disabled={!product.inStock}
          className="flex-1 py-3 px-4 rounded-xl bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-300 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{product.inStock ? 'অর্ডার করুন' : 'স্টক শেষ'}</span>
        </button>
      </div>
    </div>
  );
};
