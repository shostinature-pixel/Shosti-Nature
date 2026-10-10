import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { AdminStatusBadge } from './AdminStatusBadge';
import { Search, Download, Phone, MapPin, Calendar, Eye, X, Filter } from 'lucide-react';
import { api } from '../../lib/api';

interface Props {
  token: string;
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const AdminOrderList: React.FC<Props> = ({ token, orders, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await api.updateOrderStatus(token, orderId, newStatus);
    setUpdatingId(null);
    if (res.success) {
      onStatusChange(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const handleExportCsv = () => {
    // Trigger download via auth headers or direct fetch blob
    fetch('/api/admin/export', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shosti_orders_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((err) => console.error('Export error:', err));
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
      
      {/* Search & Filter Header */}
      <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="অর্ডার নম্বর, নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:border-[#1F6E43] focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
          />
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-stone-800 outline-none cursor-pointer"
            >
              <option value="all">সকল অর্ডার ({orders.length})</option>
              <option value="pending">অপেক্ষমাণ (Pending)</option>
              <option value="confirmed">নিশ্চিত (Confirmed)</option>
              <option value="processing">প্রক্রিয়াধীন (Processing)</option>
              <option value="shipped">পাঠানো হয়েছে (Shipped)</option>
              <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
              <option value="cancelled">বাতিল (Cancelled)</option>
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>CSV এক্সপোর্ট</span>
          </button>
        </div>

      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAF8F5] text-stone-600 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">অর্ডার নং ও সময়</th>
              <th className="py-3.5 px-4">গ্রাহকের নাম ও ফোন</th>
              <th className="py-3.5 px-4">ঠিকানা ও এলাকা</th>
              <th className="py-3.5 px-4">পরিমাণ</th>
              <th className="py-3.5 px-4">সর্বমোট বিল</th>
              <th className="py-3.5 px-4">বর্তমান স্ট্যাটাস</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">কার্যক্রম</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-stone-400 text-sm">
                  কোনো অর্ডার পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-extrabold text-[#133926] block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-stone-900 block">{ord.customerName}</span>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-xs text-[#1F6E43] font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{ord.customerPhone}</span>
                    </a>
                  </td>

                  <td className="py-4 px-4 max-w-[200px]">
                    <span className="text-xs text-stone-700 block truncate" title={ord.deliveryAddress}>
                      {ord.deliveryAddress}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {ord.city === 'inside_dhaka' ? 'ঢাকার ভেতরে' : `ঢাকার বাইরে (${ord.district || 'জেলা'})`}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md">
                      {ord.items[0]?.quantity || 1} বোতল
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-extrabold text-[#133926] text-sm">
                      ৳ {ord.totalAmount}
                    </span>
                    <span className="text-[10px] text-stone-400 block">ক্যাশ অন ডেলিভারি</span>
                  </td>

                  <td className="py-4 px-4">
                    <AdminStatusBadge
                      status={ord.status}
                      disabled={updatingId === ord.id}
                      onChange={(newStatus) => handleStatusUpdate(ord.id, newStatus)}
                    />
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-[#133926] hover:bg-stone-100 transition-colors cursor-pointer"
                      title="বিস্তারিত দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200 space-y-4">
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase">অর্ডার বিবরণী</span>
              <h3 className="text-xl font-extrabold text-[#133926]">
                {selectedOrder.orderNumber}
              </h3>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-stone-700">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">গ্রাহকের নাম:</span>
                <span className="font-bold text-stone-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">মোবাইল নম্বর:</span>
                <a href={`tel:${selectedOrder.customerPhone}`} className="font-bold text-[#1F6E43]">
                  {selectedOrder.customerPhone}
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">ডেলিভারি ঠিকানা:</span>
                <span className="font-medium text-stone-900 text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">এলাকা ও জেলা:</span>
                <span className="font-medium text-stone-900">
                  {selectedOrder.city === 'inside_dhaka' ? 'ঢাকার ভেতরে' : `ঢাকার বাইরে - ${selectedOrder.district}`}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">পণ্যের পরিমাণ:</span>
                <span className="font-bold text-stone-900">{selectedOrder.items[0]?.quantity || 1} বোতল</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">ডেলিভারি চার্জ:</span>
                <span className="font-medium text-stone-900">৳ {selectedOrder.deliveryCharge}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between py-1 border-b border-stone-50 text-emerald-700">
                  <span>ডিসকাউন্ট:</span>
                  <span>- ৳ {selectedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-stone-50 font-extrabold text-[#133926] text-base">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span>৳ {selectedOrder.totalAmount} (COD)</span>
              </div>
              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-xs mt-2">
                  <strong>গ্রাহকের নোট:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-600 block mb-1">স্ট্যাটাস পরিবর্তন:</span>
                <AdminStatusBadge
                  status={selectedOrder.status}
                  onChange={(newStatus) => handleStatusUpdate(selectedOrder.id, newStatus)}
                />
              </div>

              <a
                href={`tel:${selectedOrder.customerPhone}`}
                className="px-4 py-2 bg-[#1F6E43] hover:bg-[#133926] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>কল করুন</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
