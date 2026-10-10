import React from 'react';
import { OrderStatus } from '../../types';

interface Props {
  status: OrderStatus;
  onChange?: (newStatus: OrderStatus) => void;
  disabled?: boolean;
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'অপেক্ষমাণ', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  confirmed: { label: 'নিশ্চিত', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  processing: { label: 'প্রক্রিয়াধীন', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  shipped: { label: 'পাঠানো হয়েছে', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  delivered: { label: 'ডেলিভারি সম্পন্ন', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  cancelled: { label: 'বাতিল', color: 'bg-rose-100 text-rose-900 border-rose-300' }
};

export const AdminStatusBadge: React.FC<Props> = ({ status, onChange, disabled }) => {
  const current = statusConfig[status] || { label: status, color: 'bg-stone-100 text-stone-800 border-stone-200' };

  if (!onChange) {
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.color}`}>
        {current.label}
      </span>
    );
  }

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer transition-colors ${current.color} disabled:opacity-50`}
    >
      <option value="pending">অপেক্ষমাণ (Pending)</option>
      <option value="confirmed">নিশ্চিত (Confirmed)</option>
      <option value="processing">প্রক্রিয়াধীন (Processing)</option>
      <option value="shipped">পাঠানো হয়েছে (Shipped)</option>
      <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
      <option value="cancelled">বাতিল (Cancelled)</option>
    </select>
  );
};
