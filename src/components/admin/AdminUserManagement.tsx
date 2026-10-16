
import React, { useState } from 'react';
import { UserPlus, Trash2, ShieldCheck, Mail } from 'lucide-react';

interface Props {
  token: string;
}

export const AdminUserManagement: React.FC<Props> = ({ token }) => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    setAdding(true);
    // Add API call logic here to add new admin
    // This requires backend support
    alert('নতুন অ্যাডমিন যোগ করার ফাংশনটি ব্যাকএন্ডে যুক্ত করতে হবে।');
    setAdding(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
      <h3 className="text-lg font-black text-[#133926] flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#1F6E43]" />
        অ্যাডমিন ইউজার ম্যানেজমেন্ট
      </h3>
      
      <div className="flex gap-2">
        <input 
          type="email"
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
          placeholder="নতুন অ্যাডমিন ইমেইল"
          className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:border-[#1F6E43] outline-hidden"
        />
        <button 
          onClick={handleAddAdmin}
          disabled={adding}
          className="px-4 py-2 bg-[#1F6E43] text-white rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          যোগ করুন
        </button>
      </div>

      <div className="space-y-2">
         {/* List of admins will go here */}
         <p className="text-xs text-stone-500">বর্তমানে আপনার সিস্টেমে অ্যাডমিন ম্যানেজমেন্ট সক্রিয় করার জন্য ব্যাকএন্ডে API সাপোর্ট প্রয়োজন।</p>
      </div>
    </div>
  );
};
