import React, { useState } from 'react';
import { ProductItem, StoreSettings } from '../../types';
import { api } from '../../lib/api';
import { Save, CheckCircle, AlertCircle, RefreshCw, Image, Package, Truck, Bell, Sparkles } from 'lucide-react';

interface Props {
  token: string;
  product: ProductItem;
  settings: StoreSettings;
  onUpdated: (product: ProductItem, settings: StoreSettings) => void;
}

export const AdminPriceSettings: React.FC<Props> = ({
  token,
  product,
  settings,
  onUpdated
}) => {
  // Product details
  const [productName, setProductName] = useState(product.name);
  const [subtitle, setSubtitle] = useState(product.subtitle || '');
  const [category, setCategory] = useState(product.category || 'প্রাকৃতিক ও ভেষজ পণ্য');
  const [image, setImage] = useState(product.image || '/images/default-methi-mix.jpg');
  const [basePrice, setBasePrice] = useState(product.basePrice.toString());
  const [originalPrice, setOriginalPrice] = useState((product.originalPrice || 650).toString());
  const [weight, setWeight] = useState(product.weight || '২০০ গ্রাম (নেট ওজন)');
  const [inStock, setInStock] = useState(product.inStock);
  const [manufacturer, setManufacturer] = useState(product.manufacturer || 'এম এইচ ন্যাচারাল প্রডাক্টস লিঃ');
  const [ingredients, setIngredients] = useState(product.ingredients?.join(', ') || '');
  const [galleryImagesInput, setGalleryImagesInput] = useState(
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages.join('\n')
      : product.image || '/images/default-methi-mix.jpg'
  );
  const [usageInstructions, setUsageInstructions] = useState(product.usageInstructions || '');
  const [storageInstructions, setStorageInstructions] = useState(product.storageInstructions || '');
  const [warningNotice, setWarningNotice] = useState(product.warningNotice || '');

  // Delivery & Store settings
  const [deliveryDhaka, setDeliveryDhaka] = useState(settings.deliveryInsideDhaka.toString());
  const [deliveryOutside, setDeliveryOutside] = useState(settings.deliveryOutsideDhaka.toString());
  const [announcement, setAnnouncement] = useState(settings.announcementText);
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncement);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Parsed gallery images list for preview
  const galleryImagesList = galleryImagesInput
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Quick preset loader helper
  const handleLoadPreset = (type: 'methi' | 'honey' | 'kalojira') => {
    if (type === 'methi') {
      setProductName('মেথি মিক্স (Methi Mix)');
      setSubtitle('প্রতিদিনের সুস্থতায় খাঁটি ও প্রাকৃতিক ভেষজ উপাদানের ভারসাম্য');
      setCategory('প্রাকৃতিক ও ভেষজ পণ্য');
      setImage('/images/default-methi-mix.jpg');
      setBasePrice('500');
      setOriginalPrice('650');
      setWeight('২০০ গ্রাম (নেট ওজন)');
      setManufacturer('এম এইচ ন্যাচারাল প্রডাক্টস লিঃ');
      setIngredients('বাছাইকৃত তাজা মেথি দানা, প্রাকৃতিক মেথি গুঁড়ো, পরিপাক সহায়ক মৃদু ভেষজ উপাদান');
      setUsageInstructions('১ চা চামচ মেথি মিক্স স্বাভাবিক বা কুসুম গরম পানিতে মিশিয়ে প্রতিদিন সকালে খালি পেটে সেব্য।');
    } else if (type === 'honey') {
      setProductName('ন্যাচারাল হানি নাটস ও সিডস মিক্স (Honey Nuts Mix)');
      setSubtitle('খাঁটি সুন্দরবনের মধু ও প্রিমিয়াম কাজু, কাঠবাদাম ও আখরোটের পুষ্টি');
      setCategory('স্বাস্থ্যকর অর্গানিক ফুড');
      setImage('/images/default-methi-mix.jpg');
      setBasePrice('850');
      setOriginalPrice('1050');
      setWeight('৫০০ গ্রাম');
      setManufacturer('Shosti Nature প্রিমিয়াম কালেকশন');
      setIngredients('সুন্দরবনের খাঁটি মধু, কাঠবাদাম, কাজুবাদাম, পেস্তাবাদাম, কুমড়ার বীজ, সূর্যমুখী বীজ, কালোজিরা');
      setUsageInstructions('প্রতিদিন সকালে বা বিকেলে ১-২ চামচ চিবিয়ে খাওয়ার উপযোগী।');
    } else if (type === 'kalojira') {
      setProductName('কোল্ড প্রেসড খাঁটি কালোজিরা তেল ও মিশ্রণ (Black Seed Mix)');
      setSubtitle('হাজার রোগের মহৌষধ খ্যাত শতভাগ বিশুদ্ধ কোল্ড প্রেসড কালোজিরা');
      setCategory('হার্বাল হেলথ কেয়ার');
      setImage('/images/default-methi-mix.jpg');
      setBasePrice('600');
      setOriginalPrice('750');
      setWeight('২৫০ মিলি');
      setManufacturer('Shosti Nature অর্গানিক ল্যাব');
      setIngredients('প্রথম চাপের খাঁটি কালোজিরা তেল, প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট উপাদান');
      setUsageInstructions('আধা চা চামচ তেল কুসুম গরম পানি বা মধুর সাথে নিয়মিত সেবন করুন।');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const parsedPrice = parseFloat(basePrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('অনুগ্রহ করে পণ্যের সঠিক বিক্রয় মূল্য দিন');
      setSaving(false);
      return;
    }

    const res = await api.updateStoreSettings(token, {
      basePrice: parsedPrice,
      originalPrice: parseFloat(originalPrice) || parsedPrice + 150,
      inStock,
      name: productName,
      subtitle,
      category,
      image,
      galleryImages: galleryImagesList,
      weight,
      manufacturer,
      ingredients,
      usageInstructions,
      storageInstructions,
      warningNotice,
      deliveryInsideDhaka: parseFloat(deliveryDhaka) || 70,
      deliveryOutsideDhaka: parseFloat(deliveryOutside) || 130,
      announcementText: announcement,
      showAnnouncement,
      phone,
      whatsapp
    });

    setSaving(false);

    if (res.success && res.product && res.settings) {
      setSuccessMsg('প্রোডাক্ট এবং স্টোর সেটিংস সফলভাবে সেভ হয়েছে! ল্যান্ডিং পেজের হিরো, পরিচিতি, স্পেসিফিকেশন ও অর্ডার ফর্মে নতুন প্রোডাক্ট তথ্য কার্যকর হয়েছে।');
      onUpdated(res.product, res.settings);
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(res.error || 'সেটিংস সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <h3 className="text-xl font-extrabold text-[#133926] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#1F6E43]" />
            <span>প্রোডাক্ট পরিবর্তন ও স্টোর সেটিংস ব্যবস্থাপনা</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            এখানে মেথি মিক্স ছাড়াও যেকোনো নতুন প্রোডাক্টের নাম, ছবি, দাম, উপাদান ও ব্যবহারবিধি পরিবর্তন করতে পারবেন
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-stone-400 mr-1">কুইক প্রিসেট:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('methi')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
          >
            মেথি মিক্স
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('honey')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
          >
            হানি নাটস
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('kalojira')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors cursor-pointer"
          >
            কালোজিরা তেল
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Main Product Identity & Photo */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1F6E43]" />
            <span>প্রোডাক্ট পরিচিতি ও ছবি পরিবর্তন</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Image Preview Box */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 mb-2">লাইভ প্রোডাক্ট ছবি</span>
              <img
                src={image}
                alt="Product preview"
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl border border-stone-100 shadow-2xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/default-methi-mix.jpg';
                }}
              />
              <span className="text-[10px] text-stone-400 mt-2 text-center">ওয়েবসাইটে প্রদর্শিত প্রিভিউ</span>
            </div>

            {/* Inputs */}
            <div className="md:col-span-9 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    পণ্যের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="যেমন: মেথি মিক্স (Methi Mix)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="যেমন: প্রাকৃতিক ও ভেষজ পণ্য"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  উপশিরোনাম / সংক্ষিপ্ত বিবরণ (Tagline)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="যেমন: প্রতিদিনের সুস্থতায় খাঁটি ও প্রাকৃতিক ভেষজ উপাদানের ভারসাম্য"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  প্রোডাক্টের ছবির লিংক বা পাথ (Image URL / Path)
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/default-methi-mix.jpg অথবা অনলাইন ক্লাউড ইমেজ লিংক"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs font-mono focus:border-[#1F6E43] outline-hidden"
                />
                <span className="text-[11px] text-stone-400 block mt-1">
                  * ডিফল্ট ছবি: <code className="bg-stone-100 px-1 py-0.5 rounded">/images/default-methi-mix.jpg</code> অথবা যেকোনো অনলাইন ইমেজ লিংক পেস্ট করতে পারেন।
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 1.5 Gallery Exhibition Photos Management */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
              <Image className="w-4 h-4 text-[#1F6E43]" />
              <span>পণ্য প্রদর্শনী গ্যালারি (মেথি মিক্সের আসল ছবি ও মোড়ক)</span>
            </h4>
            <span className="text-[11px] text-stone-500 font-medium">
              ল্যান্ডিং পেজের "পণ্য প্রদর্শনী" সেকশনে দেখাবে
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              গ্যালারির ছবির লিংকসমূহ (প্রতি লাইনে একটি করে ছবির লিংক বা পাথ লিখুন)
            </label>
            <textarea
              rows={3}
              value={galleryImagesInput}
              onChange={(e) => setGalleryImagesInput(e.target.value)}
              placeholder={`/images/default-methi-mix.jpg\nhttps://res.cloudinary.com/.../bottle.jpg`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs font-mono focus:border-[#1F6E43] outline-hidden leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-stone-400 mt-1">
              * একাধিক ছবি দিতে প্রতি লাইনে একটি করে ছবির লিংক লিখুন। গ্রাহক প্রদর্শনীতে ক্লিক করে বড় করে দেখতে পারবেন।
            </p>
          </div>

          {/* Live Gallery Previews */}
          {galleryImagesList.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-stone-700 block mb-2">
                গ্যালারিতে লাইভ প্রদর্শিত ছবি ({galleryImagesList.length}টি):
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImagesList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-white shadow-2xs group"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery item ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-methi-mix.jpg';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded font-bold">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Price, Stock & Weight */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
            <span>মূল্য ও স্টক ব্যবস্থাপনা</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                বিক্রয় অফার মূল্য (টাকা ৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="10"
                step="1"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-black text-xl text-[#133926] focus:border-[#1F6E43] outline-hidden"
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                গ্রাহকের প্রদেয় ইউনিট মূল্য
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                পূর্বের রেগুলার মূল্য (টাকা ৳)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-bold text-lg focus:border-[#1F6E43] outline-hidden"
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                কাটা দাগসহ পূর্বমূল্য হিসেবে দেখাবে
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                নেট ওজন / সাইজ
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="যেমন: ২০০ গ্রাম (নেট ওজন)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                স্টক অবস্থা (Stock Status)
              </label>
              <select
                value={inStock ? 'true' : 'false'}
                onChange={(e) => setInStock(e.target.value === 'true')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-sm focus:border-[#1F6E43] outline-hidden cursor-pointer"
              >
                <option value="true">স্টকে পর্যাপ্ত রয়েছে (In Stock)</option>
                <option value="false">স্টক শেষ (Stock Out)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Detailed Specifications & Ingredients */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider">
            উপাদান, প্রস্তুতকারক ও নির্দেশিকা
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                প্রস্তুতকারক বা ব্র্যান্ড পার্টনার
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="যেমন: এম এইচ ন্যাচারাল প্রডাক্টস লিঃ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                প্রধান উপাদানসমূহ (কমা দিয়ে আলাদা করুন)
              </label>
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="যেমন: মেথি দানা, মেথি গুঁড়ো, ভেষজ উপাদান"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ব্যবহারবিধি ও সেবন নিয়ম
              </label>
              <textarea
                rows={2}
                value={usageInstructions}
                onChange={(e) => setUsageInstructions(e.target.value)}
                placeholder="যেমন: ১ চা চামচ মেথি মিক্স কুসুম গরম পানিতে মিশিয়ে প্রতিদিন সকালে খালি পেটে সেব্য।"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-900 focus:border-[#1F6E43] outline-hidden"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                সংরক্ষণ পদ্ধতি
              </label>
              <textarea
                rows={2}
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                placeholder="যেমন: শুষ্ক ও শীতল স্থানে রাখুন, সরাসরি রোদ থেকে দূরে রাখুন।"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-900 focus:border-[#1F6E43] outline-hidden"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 4. Delivery & Helpline */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1F6E43]" />
            <span>ডেলিভারি চার্জ ও হেল্পলাইন</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ঢাকার ভেতরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryDhaka}
                onChange={(e) => setDeliveryDhaka(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryOutside}
                onChange={(e) => setDeliveryOutside(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                সাপোর্ট ফোন
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="যেমন: 01700-000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp নম্বর
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="যেমন: 8801700000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                শীর্ষ ঘোষণা বার টেক্সট
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="rounded text-[#1F6E43]"
                />
                <span>ঘোষণা বার প্রদর্শন করুন</span>
              </label>
            </div>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-[#1F6E43] hover:bg-[#133926] disabled:bg-stone-400 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>প্রোডাক্ট ও সেটিংস সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
