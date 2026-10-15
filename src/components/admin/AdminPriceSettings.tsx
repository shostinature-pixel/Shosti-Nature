import React, { useState } from 'react';
import { ProductItem, StoreSettings } from '../../types';
import { api } from '../../lib/api';
import {
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Image,
  Package,
  Truck,
  Sparkles,
  Heart,
  HelpCircle,
  Layers,
  Check,
  ShieldCheck,
  Clock
} from 'lucide-react';

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
  // Navigation sub-tab inside settings
  const [subTab, setSubTab] = useState<'basic' | 'about_benefits' | 'usage_faq' | 'delivery'>('basic');

  // 1. Basic product info
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

  // 2. About Section CMS
  const [aboutTitle, setAboutTitle] = useState(product.aboutTitle || `${product.name} কী এবং কেন এটি বিশেষ?`);
  const [aboutDesc1, setAboutDesc1] = useState(
    product.aboutDesc1 ||
    'শতাব্দীপ্রাচীন ভারতীয় উপমহাদেশীয় ভেষজ ঐতিহ্য এবং আধুনিক স্বাস্থ্য সচেতনতার এক মেলবন্ধন। মেথি প্রাকৃতিকভাবেই খাদ্যনালী ও মেটাবলিজমের সুরক্ষায় অনন্য এক উপাদান হিসেবে স্বীকৃত।'
  );
  const [aboutDesc2, setAboutDesc2] = useState(
    product.aboutDesc2 ||
    'বাজারে সাধারণ ভেষজ উপাদান গ্রহণের ক্ষেত্রে যে অসুবিধা দেখা যায়, আমাদের এই বিশেষ মিক্সে তা পরিশোধিত অনুপাত ও মৃদু ভেষজ উপাদানের সমন্বয়ে সহজে গ্রহণোপযোগী করা হয়েছে।'
  );

  // 3. Benefits Section CMS
  const [benefitsTitle, setBenefitsTitle] = useState(
    product.benefitsTitle || `${product.name}ের প্রমাণসমর্থিত ও প্রকৃত স্বাস্থ্য উপকারিতা`
  );
  const [benefitsSubtitle, setBenefitsSubtitle] = useState(
    product.benefitsSubtitle ||
    'অতিরিক্ত বা ভুয়া দাবি নয়; প্রাচীন ভেষজ জ্ঞান ও বিজ্ঞানের দৃষ্টিতে মেথির প্রমাণিত উপযোগিতা।'
  );

  // Default benefits from product or defaults
  const initialBenefits = product.benefitsList && product.benefitsList.length >= 4
    ? product.benefitsList
    : [
        { title: 'হজমে প্রাকৃতিক সহায়তা', description: 'মেথির প্রাকৃতিক দ্রবণীয় ফাইবার পরিপাকতন্ত্র সচল রাখতে ও পেট ফাঁপা ভাব কমাতে সাহায্য করে।' },
        { title: 'স্বাভাবিক শর্করা ভারসাম্য', description: 'প্রাকৃতিক অ্যামিনো অ্যাসিড ও ফাইবার রক্তের গ্লুকোজ বিপাককে স্বাভাবিক নিয়মে রাখতে সহায়তা জোগায়।' },
        { title: 'চুল ও ত্বকের পুষ্টি', description: 'ভিটামিন ও খনিজ উপাদানের প্রাকৃতিক উৎস হিসেবে চুল পড়া রোধে ও ত্বকের স্বাভাবিক উজ্জ্বলতায় সহায়ক।' },
        { title: 'মেটাবলিজম ও ওজন নিয়ন্ত্রণ', description: 'দীর্ঘক্ষণ পেট ভরা রাখতে সাহায্য করায় অপ্রয়োজনীয় ক্যালরি গ্রহণের ইচ্ছা নিয়ন্ত্রণে কার্যকর ভূমিকা রাখে।' }
      ];

  const [b1Title, setB1Title] = useState(initialBenefits[0]?.title || 'হজমে প্রাকৃতিক সহায়তা');
  const [b1Desc, setB1Desc] = useState(initialBenefits[0]?.description || '');
  const [b2Title, setB2Title] = useState(initialBenefits[1]?.title || 'স্বাভাবিক শর্করা ভারসাম্য');
  const [b2Desc, setB2Desc] = useState(initialBenefits[1]?.description || '');
  const [b3Title, setB3Title] = useState(initialBenefits[2]?.title || 'চুল ও ত্বকের পুষ্টি');
  const [b3Desc, setB3Desc] = useState(initialBenefits[2]?.description || '');
  const [b4Title, setB4Title] = useState(initialBenefits[3]?.title || 'মেটাবলিজম ও ওজন নিয়ন্ত্রণ');
  const [b4Desc, setB4Desc] = useState(initialBenefits[3]?.description || '');

  // 4. Usage Guide CMS
  const [usageTitle, setUsageTitle] = useState(product.usageTitle || `${product.name} কীভাবে ও কখন খাবেন?`);
  const [usageSubtitle, setUsageSubtitle] = useState(
    product.usageSubtitle || 'সর্বোচ্চ সুফল পেতে প্রস্তুতকারকের নির্দেশিত ৩টি সহজ ধাপ অনুসরণ করুন'
  );

  const initialSteps = product.usageSteps && product.usageSteps.length >= 3
    ? product.usageSteps
    : [
        { step: '০১', title: 'পানি প্রস্তুত করুন', desc: 'এক গ্লাস (২০০-২৫০ মি.লি.) সাধারণ তাপমাত্রা অথবা হালকা কুসুম গরম পানি নিন।' },
        { step: '০২', title: 'মেথি মিক্স যোগ করুন', desc: '১ চা চামচ মেথি মিক্স পানিতে দিয়ে ভালো করে নেড়ে মিশিয়ে নিন। রাতে ভিজিয়ে রেখে সকালেও খাওয়া যায়।' },
        { step: '০৩', title: 'সকালে খালি পেটে পান করুন', desc: 'প্রতিদিন সকালে নাস্তার ২০-৩০ মিনিট পূর্বে খালি পেটে পান করা সর্বাধিক কার্যকারী।' }
      ];

  const [step1Title, setStep1Title] = useState(initialSteps[0]?.title || 'পানি প্রস্তুত করুন');
  const [step1Desc, setStep1Desc] = useState(initialSteps[0]?.desc || '');
  const [step2Title, setStep2Title] = useState(initialSteps[1]?.title || 'মেথি মিক্স যোগ করুন');
  const [step2Desc, setStep2Desc] = useState(initialSteps[1]?.desc || '');
  const [step3Title, setStep3Title] = useState(initialSteps[2]?.title || 'সকালে খালি পেটে পান করুন');
  const [step3Desc, setStep3Desc] = useState(initialSteps[2]?.desc || '');

  // 5. Warnings & Instructions
  const [usageInstructions, setUsageInstructions] = useState(product.usageInstructions || '');
  const [storageInstructions, setStorageInstructions] = useState(product.storageInstructions || '');
  const [warningNotice, setWarningNotice] = useState(product.warningNotice || '');

  // 6. FAQ CMS
  const [faqTitle, setFaqTitle] = useState(product.faqTitle || 'সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর');
  const [faqSubtitle, setFaqSubtitle] = useState(
    product.faqSubtitle || 'পণ্য, ডেলিভারি এবং ব্যবহার নিয়ে আপনার মনের সাধারণ প্রশ্নগুলোর উত্তর।'
  );

  // 7. Delivery & Helpline settings
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

  const handleMainImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setImage(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64 = uploadEvent.target.result as string;
          setGalleryImagesInput((prev) => (prev ? `${prev}\n${base64}` : base64));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Quick preset loader helper for ANY product
  const handleLoadPreset = (type: 'methi' | 'honey' | 'kalojira' | 'moringa') => {
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
      setAboutTitle('মেথি মিক্স (Methi Mix) কী এবং কেন এটি বিশেষ?');
      setAboutDesc1('শতাব্দীপ্রাচীন ভারতীয় উপমহাদেশীয় ভেষজ ঐতিহ্য এবং আধুনিক স্বাস্থ্য সচেতনতার এক মেলবন্ধন। মেথি প্রাকৃতিকভাবেই খাদ্যনালী ও মেটাবলিজমের সুরক্ষায় অনন্য এক উপাদান হিসেবে স্বীকৃত।');
      setAboutDesc2('বাজারে সাধারণ মেথির দানা খাওয়ার ক্ষেত্রে যে তিতা স্বাদ বা হজমের অসুবিধা দেখা যায়, আমাদের এই বিশেষ মিক্সে তা পরিশোধিত অনুপাত ও মৃদু ভেষজ উপাদানের সমন্বয়ে সহজে গ্রহণোপযোগী করা হয়েছে।');
      setBenefitsTitle('মেথি মিক্সের প্রমাণসমর্থিত ও প্রকৃত স্বাস্থ্য উপকারিতা');
      setBenefitsSubtitle('অতিরিক্ত বা ভুয়া দাবি নয়; প্রাচীন ভেষজ জ্ঞান ও বিজ্ঞানের দৃষ্টিতে মেথির প্রমাণিত উপযোগিতা।');
      setB1Title('হজমে প্রাকৃতিক সহায়তা');
      setB1Desc('মেথির প্রাকৃতিক দ্রবণীয় ফাইবার পরিপাকতন্ত্র সচল রাখতে ও পেট ফাঁপা ভাব কমাতে সাহায্য করে।');
      setB2Title('স্বাভাবিক শর্করা ভারসাম্য');
      setB2Desc('প্রাকৃতিক অ্যামিনো অ্যাসিড ও ফাইবার রক্তের গ্লুকোজ বিপাককে স্বাভাবিক নিয়মে রাখতে সহায়তা জোগায়।');
      setB3Title('চুল ও ত্বকের পুষ্টি');
      setB3Desc('ভিটামিন ও খনিজ উপাদানের প্রাকৃতিক উৎস হিসেবে চুল পড়া রোধে ও ত্বকের স্বাভাবিক উজ্জ্বলতায় সহায়ক।');
      setB4Title('মেটাবলিজম ও ওজন নিয়ন্ত্রণ');
      setB4Desc('দীর্ঘক্ষণ পেট ভরা রাখতে সাহায্য করায় অপ্রয়োজনীয় ক্যালরি গ্রহণের ইচ্ছা নিয়ন্ত্রণে কার্যকর ভূমিকা রাখে।');
      setUsageTitle('মেথি মিক্স কীভাবে ও কখন খাবেন?');
      setUsageSubtitle('সর্বোচ্চ সুফল পেতে প্রস্তুতকারকের নির্দেশিত ৩টি সহজ ধাপ অনুসরণ করুন');
      setStep1Title('পানি প্রস্তুত করুন');
      setStep1Desc('এক গ্লাস (২০০-২৫০ মি.লি.) সাধারণ তাপমাত্রা অথবা হালকা কুসুম গরম পানি নিন।');
      setStep2Title('মেথি মিক্স যোগ করুন');
      setStep2Desc('১ চা চামচ মেথি মিক্স পানিতে দিয়ে ভালো করে নেড়ে মিশিয়ে নিন। রাতে ভিজিয়ে রেখে সকালেও খাওয়া যায়।');
      setStep3Title('সকালে খালি পেটে পান করুন');
      setStep3Desc('প্রতিদিন সকালে নাস্তার ২০-৩০ মিনিট পূর্বে খালি পেটে পান করা সর্বাধিক কার্যকারী।');
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
      setAboutTitle('হানি নাটস কী এবং কেন এটি শরীরের জন্য সেরা?');
      setAboutDesc1('প্রাকৃতিক শক্তির এক অনন্য পাওয়ারহাউস। এতে রয়েছে সুন্দরবনের আসল কাঁচা মধু এবং গ্রেড-১ মানের প্রিমিয়াম ড্রাই ফ্রুটস ও সিডস।');
      setAboutDesc2('প্রতিদিনের পুষ্টির ঘাটতি পূরণ ও তাৎক্ষণিক এনার্জি বৃদ্ধির জন্য এটি শতভাগ প্রাকৃতিক একটি সুস্বাদু খাবার।');
      setBenefitsTitle('হানি নাটসের অতুলনীয় স্বাস্থ্য উপকারিতা');
      setBenefitsSubtitle('প্রাকৃতিক ভিটামিন, অ্যান্টিঅক্সিডেন্ট এবং ওমেগা ফ্যাটি অ্যাসিডের অসাধারণ উৎস।');
      setB1Title('প্রাকৃতিক স্ট্যামিনা ও এনার্জি বৃদ্ধি');
      setB1Desc('ক্লান্তি দূর করে তাৎক্ষণিক প্রাণশক্তি ফিরিয়ে আনে এবং শারীরিক দুর্বলতা কমাতে সাহায্য করে।');
      setB2Title('রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি');
      setB2Desc('খাঁটি মধু ও বাদামের অ্যান্টিঅক্সিডেন্ট দেহের রোগ প্রতিরোধ ক্ষমতাকে বহু গুণে শক্তিশালী করে।');
      setB3Title('স্মৃতিশক্তি ও ব্রেইনের পুষ্টি');
      setB3Desc('আখরোট ও কাঠবাদামের ওমেগা-৩ ফ্যাটি অ্যাসিড মস্তিষ্ক সতেজ রাখতে দারুণ কার্যকর ভূমিকা রাখে।');
      setB4Title('হার্টের সুস্থতা ও পুষ্টিসাধন');
      setB4Desc('স্বাস্থ্যকর ফ্যাট রক্ত চলাচল স্বাভাবিক রাখতে ও কোলেস্টেরল নিয়ন্ত্রণে সহায়তা করে।');
      setUsageTitle('হানি নাটস কীভাবে ও কখন খাবেন?');
      setUsageSubtitle('প্রতিদিনের খাদ্যতালিকায় সহজ ২টি উপায়ে গ্রহণ করতে পারেন');
      setStep1Title('সকালে খালি পেটে');
      setStep1Desc('প্রতিদিন সকালে নাস্তার আগে ১-২ চামচ চিবিয়ে খান।');
      setStep2Title('দুধ বা স্মুদির সাথে');
      setStep2Desc('কুসুম গরম দুধের সাথে মিশিয়ে খেলে চমৎকার পুষ্টি পাওয়া যায়।');
      setStep3Title('বিকেলের হেলদি স্ন্যাকস');
      setStep3Desc('বিকেলে ক্লান্ত লাগলে চিপস বা জাঙ্ক ফুডের পরিবর্তে ২ চামচ হানি নাটস সেবন করুন।');
    } else if (type === 'kalojira') {
      setProductName('কোল্ড প্রেসড খাঁটি কালোজিরা তেল (Black Seed Oil)');
      setSubtitle('হাজার রোগের মহৌষধ খ্যাত শতভাগ বিশুদ্ধ প্রথম চাপের কালোজিরা');
      setCategory('হার্বাল হেলথ কেয়ার');
      setImage('/images/default-methi-mix.jpg');
      setBasePrice('600');
      setOriginalPrice('750');
      setWeight('২৫০ মিলি');
      setManufacturer('Shosti Nature অর্গানিক ল্যাব');
      setIngredients('প্রথম চাপের খাঁটি কালোজিরা তেল, প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট থাইমোকুইনোন');
      setAboutTitle('কালোজিরা তেল কী এবং কেন এটি সর্বজনস্বীকৃত মহৌষধ?');
      setAboutDesc1('কালোজিরা শতাব্দীর পর শতাব্দী ধরে প্রাকৃতিক নিরাময়কারী হিসেবে বিশ্বজুড়ে সমাদৃত। আমাদের তেলটি কাঠের ঘানিতে তৈরি কোল্ড প্রেসড।');
      setAboutDesc2('তাপ ছাড়া প্রাকৃতিক উপায়ে নিংড়ে নেওয়া হওয়ায় এর সমস্ত পুষ্টিগুণ ও কার্যকারিতা অক্ষুণ্ণ থাকে।');
      setBenefitsTitle('খাঁটি কালোজিরা তেলের পরীক্ষিত উপকারিতা');
      setBenefitsSubtitle('প্রাকৃতিক নিরাময় ও জীবনীশক্তি বৃদ্ধিতে অদ্বিতীয় ভেষজ তেল।');
      setB1Title('রোগ প্রতিরোধ ব্যবস্থা জোরদার');
      setB1Desc('শরীরের ক্ষতিকর জীবাণু ও ইনফেকশন প্রতিহত করতে সহায়তা করে।');
      setB2Title('শ্বাসকষ্ট ও ঠান্ডায় আরাম');
      setB2Desc('কাশি, হাঁপানি ও ঠান্ডা লাগার সমস্যা উপশমে নিয়মিত সেবন খুবই কার্যকর।');
      setB3Title('বাত ব্যথা ও জয়েন্টের যত্ন');
      setB3Desc('ব্যথাযুক্ত স্থানে মালিশে এবং সেবনে ব্যথা লাঘবে দ্রুত সাহায্য করে।');
      setB4Title('হৃদযন্ত্র ও রক্তচাপ নিয়ন্ত্রণ');
      setB4Desc('রক্তের স্বাভাবিক সঞ্চালন বজায় রাখতে ও রক্তনালী পরিষ্কার রাখতে সহায়ক।');
      setUsageTitle('কালোজিরা তেল ব্যবহারের নিয়ম');
      setUsageSubtitle('সহজ নিয়মে সেবন করে সর্বোচ্চ উপকার পান');
      setStep1Title('কুসুম গরম পানির সাথে');
      setStep1Desc('আধা চা চামচ তেল কুসুম গরম পানিতে মিশিয়ে সকালে পান করুন।');
      setStep2Title('মধুর সাথে মিশ্রণ');
      setStep2Desc('১ চামচ মধুর সাথে আধা চা চামচ তেল মিশিয়ে খেলে স্বাদ ও পুষ্টি দুটিই বাড়ে।');
      setStep3Title('বাহ্যিক মালিশ');
      setStep3Desc('মাথাব্যথা বা জয়েন্টের ব্যথায় হালকা গরম করে আলতোভাবে মালিশ করুন।');
    } else if (type === 'moringa') {
      setProductName('প্রিমিয়াম অর্গানিক মোরিঙ্গা পাউডার (Moringa Leaf Powder)');
      setSubtitle('সুপারফুড খ্যাত সজিনা পাতার শতভাগ খাঁটি ও পুষ্টিকর পাউডার');
      setCategory('সুপারফুড ও ভেষজ পুষ্টি');
      setImage('/images/default-methi-mix.jpg');
      setBasePrice('450');
      setOriginalPrice('600');
      setWeight('২০০ গ্রাম');
      setManufacturer('Shosti Nature অর্গানিক ফার্ম');
      setIngredients('ছায়ায় শুকানো বাছাইকৃত কচি সজিনা পাতার শতভাগ খাঁটি মিহি গুঁড়ো');
      setAboutTitle('মোরিঙ্গা পাউডার কী এবং কেন এটিকে অলৌকিক বৃক্ষ বলা হয়?');
      setAboutDesc1('সজিনা পাতা বা মোরিঙ্গাকে পুষ্টিবিজ্ঞানে পৃথিবীর সবচেয়ে পুষ্টিকর গাছের একটি হিসেবে গণ্য করা হয়। এতে দুধের চেয়ে বেশি ক্যালসিয়াম এবং কমলার চেয়ে বেশি ভিটামিন সি রয়েছে।');
      setAboutDesc2('আমাদের পাউডার সরাসরি রোদ ছাড়া প্রাকৃতিক ছায়ায় শুকিয়ে গুঁড়ো করা, যাতে সম্পূর্ণ সবুজ রং ও পুষ্টি সংরক্ষিত থাকে।');
      setBenefitsTitle('মোরিঙ্গা পাউডারের বিস্ময়কর উপকারিতা');
      setBenefitsSubtitle('প্রকৃতির পুষ্টিভাণ্ডার যা আপনার শরীরকে রাখবে সতেজ ও রোগমুক্ত।');
      setB1Title('মাল্টিভিটামিন ও খনিজের ঘাটতি পূরণ');
      setB1Desc('ভিটামিন এ, সি, ক্যালসিয়াম ও আয়রনের প্রাকৃতিক উৎস হিসেবে পুষ্টির অভাব দূর করে।');
      setB2Title('রক্তে শর্করা ও কোলেস্টেরল নিয়ন্ত্রণ');
      setB2Desc('ডায়াবেটিস ও হৃদরোগের ঝুঁকি কমাতে অত্যন্ত কার্যকর প্রাকৃতিক উপাদান।');
      setB3Title('ত্বক ও চোখের উজ্জ্বলতা বৃদ্ধি');
      setB3Desc('উচ্চমাত্রার অ্যান্টিঅক্সিডেন্ট ত্বক টানটান রাখতে এবং চোখের দৃষ্টিশক্তি ভালো রাখতে সহায়ক।');
      setB4Title('হজম শক্তি ও ইমিউনিটি বৃদ্ধি');
      setB4Desc('পরিপাক প্রক্রিয়া মসৃণ করে এবং শরীরে রোগ প্রতিরোধ ক্ষমতা বহু গুণ বাড়িয়ে দেয়।');
      setUsageTitle('মোরিঙ্গা পাউডার সেবন বিধি');
      setUsageSubtitle('দৈনিক খাওয়ার ৩টি সহজ পদ্ধতি');
      setStep1Title('কুসুম গরম পানিতে');
      setStep1Desc('১ চা চামচ পাউডার কুসুম গরম পানিতে মিশিয়ে সকালে খালি পেটে খান।');
      setStep2Title('জুস বা লেবুর শরবতে');
      setStep2Desc('লেবুর শরবত বা গ্রিন জুসের সাথে মিশিয়ে চমৎকার রিফ্রেশিং ড্রিংক তৈরি করুন।');
      setStep3Title('স্যুপ বা ডালে মিশিয়ে');
      setStep3Desc('রান্নার শেষে স্যুপ বা ডালের ওপর ছিটিয়ে দিয়েও পুষ্টি নেওয়া যায়।');
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

    const updatedBenefits = [
      { title: b1Title, description: b1Desc, icon: 'Leaf' },
      { title: b2Title, description: b2Desc, icon: 'Activity' },
      { title: b3Title, description: b3Desc, icon: 'Sparkles' },
      { title: b4Title, description: b4Desc, icon: 'Scale' }
    ];

    const updatedSteps = [
      { step: '০১', title: step1Title, desc: step1Desc },
      { step: '০২', title: step2Title, desc: step2Desc },
      { step: '০৩', title: step3Title, desc: step3Desc }
    ];

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
      aboutTitle,
      aboutDesc1,
      aboutDesc2,
      benefitsTitle,
      benefitsSubtitle,
      benefitsList: updatedBenefits,
      usageTitle,
      usageSubtitle,
      usageSteps: updatedSteps,
      faqTitle,
      faqSubtitle,
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
      setSuccessMsg('অভিনন্দন! আপনার প্রোডাক্ট এবং সমস্ত সেকশনের লেখা সফলভাবে ডাটাবেসে সেভ হয়েছে এবং পুরো ওয়েবসাইটে কার্যকর হয়েছে!');
      onUpdated(res.product, res.settings);
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(res.error || 'সেটিংস সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-xs space-y-6">
      
      {/* Header & Quick Product Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <h3 className="text-xl font-extrabold text-[#133926] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#1F6E43]" />
            <span>যেকোনো প্রোডাক্টের ল্যান্ডিং পেজ কনটেন্ট ও সেটিংস কন্ট্রোল</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            এখানে মেথি মিক্স ছাড়াও যেকোনো নতুন প্রোডাক্টের নাম, ছবি, উপকারিতা, ব্যবহারবিধি ও সমস্ত তথ্য স্বাধীনভাবে পরিবর্তন করতে পারবেন।
          </p>
        </div>

        {/* 1-Click Universal Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-stone-400 mr-1">দ্রুত প্রিসেট রূপান্তর:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('methi')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
          >
            মেথি মিক্স
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('honey')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
          >
            হানি নাটস
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('kalojira')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors cursor-pointer"
          >
            কালোজিরা তেল
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('moringa')}
            className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
          >
            মোরিঙ্গা পাউডার
          </button>
        </div>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setSubTab('basic')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            subTab === 'basic'
              ? 'bg-[#133926] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>১. মূল প্রোডাক্ট, দাম ও ছবি (৮০০x৮০০)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('about_benefits')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            subTab === 'about_benefits'
              ? 'bg-[#133926] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>২. পরিচিতি ও স্বাস্থ্য উপকারিতা</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('usage_faq')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            subTab === 'usage_faq'
              ? 'bg-[#133926] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>৩. সেবন পদ্ধতি ও সচরাচর প্রশ্ন</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('delivery')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            subTab === 'delivery'
              ? 'bg-[#133926] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>৪. ডেলিভারি, হেল্পলাইন ও ঘোষণা</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ==================== SUB-TAB 1: BASIC INFO, PRICING & PHOTOS ==================== */}
        {subTab === 'basic' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Identity & Main Image */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1F6E43]" />
                <span>প্রোডাক্ট পরিচিতি ও ছবি (৮০০x৮০০ পিক্সেল)</span>
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
                        placeholder="যেমন: মেথি মিক্স (Methi Mix) বা যেকোনো পণ্য"
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
                      উপশিরোনাম / ট্যাগলাইন (Tagline)
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
                      প্রোডাক্টের প্রধান ছবি (Image URL / Direct Upload)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/images/default-methi-mix.jpg অথবা অনলাইন ক্লাউড ইমেজ লিংক"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs font-mono focus:border-[#1F6E43] outline-hidden"
                      />
                      <label className="px-4 py-2.5 rounded-xl bg-[#1F6E43] hover:bg-[#133926] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs">
                        <span>ছবি আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-1 font-medium">
                      * আদর্শ সাইজ: <strong className="text-[#1F6E43]">৮০০ × ৮০০ পিক্সেল (800x800 px)</strong> বর্গাকার হাই-কোয়ালিটি ছবি আপলোড করুন। কম্পিউটার বা মোবাইল থেকে সরাসরি সিলেক্ট করা যাবে।
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Exhibition */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                  <Image className="w-4 h-4 text-[#1F6E43]" />
                  <span>পণ্য প্রদর্শনী গ্যালারি (আসল ছবি ও মোড়ক)</span>
                </h4>
                <span className="text-[11px] text-stone-500 font-medium">
                  ল্যান্ডিং পেজের "পণ্য প্রদর্শনী" সেকশনে দেখাবে
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    গ্যালারির ছবির লিংকসমূহ (প্রতি লাইনে একটি করে)
                  </label>
                  <label className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1">
                    <span>+ একাধিক ছবি গ্যালারিতে আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageFile}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                      <div className="text-[10px] font-bold text-stone-500 uppercase">ছবি {idx + 1}</div>
                      {galleryImagesList[idx] ? (
                        <>
                          <img
                            src={galleryImagesList[idx]}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/default-methi-mix.jpg';
                            }}
                          />
                          <div className="flex gap-2">
                            <label className="flex-1 text-center py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-bold cursor-pointer">
                              পরিবর্তন
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = (uploadEvent) => {
                                    const newImages = [...galleryImagesList];
                                    newImages[idx] = uploadEvent.target?.result as string;
                                    setGalleryImagesInput(newImages.join('\n'));
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                            <a
                              href={galleryImagesList[idx]}
                              download={`gallery_image_${idx + 1}.png`}
                              className="flex-1 text-center py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                            >
                              ডাউনলোড
                            </a>
                          </div>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-[#1F6E43]">
                          <span className="text-[10px] text-stone-500">ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                const newImages = [...galleryImagesList];
                                newImages[idx] = uploadEvent.target?.result as string;
                                setGalleryImagesInput(newImages.join('\n'));
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 font-medium">
                  * আদর্শ সাইজ: <strong className="text-[#1F6E43]">৮০০ × ৮০০ পিক্সেল (800x800 px)</strong> বর্গাকার ছবি। ডিভাইস বা মোবাইল থেকে একাধিক ছবি একসাথে সিলেক্ট করে আপলোড করতে পারবেন।
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

            {/* Price & Stock */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider">
                মূল্য, ওজন ও স্টক ব্যবস্থাপনা
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    প্রস্তুতকারক বা ব্র্যান্ড পার্টনার
                  </label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="যেমন: Shosti Nature / এম এইচ ন্যাচারাল প্রডাক্টস লিঃ"
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
                    placeholder="যেমন: তাজা উপাদান, ভেষজ সংমিশ্রণ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 2: ABOUT & HEALTH BENEFITS CMS ==================== */}
        {subTab === 'about_benefits' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* About Section */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1F6E43]" />
                <span>পণ্য পরিচিতি সেকশন (About Section)</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  পরিচিতি সেকশনের শিরোনাম
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="যেমন: মেথি মিক্স (Methi Mix) কী এবং কেন এটি বিশেষ?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold text-sm focus:border-[#1F6E43] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  বিস্তারিত বিবরণ: ১ম অনুচ্ছেদ
                </label>
                <textarea
                  rows={2}
                  value={aboutDesc1}
                  onChange={(e) => setAboutDesc1(e.target.value)}
                  placeholder="পণ্যটির বিশেষত্ব ও উৎপত্তি সম্পর্কে প্রথম অনুচ্ছেদ লিখুন..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-900 focus:border-[#1F6E43] outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  বিস্তারিত বিবরণ: ২য় অনুচ্ছেদ
                </label>
                <textarea
                  rows={2}
                  value={aboutDesc2}
                  onChange={(e) => setAboutDesc2(e.target.value)}
                  placeholder="বাজারে অন্যান্য পণ্যের চেয়ে এটি কেন আলাদা এবং খাঁটি তার বর্ণনা..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-900 focus:border-[#1F6E43] outline-hidden"
                ></textarea>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#1F6E43]" />
                <span>স্বাস্থ্য ও উপকারিতা সেকশন (Benefits Section)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    উপকারিতা সেকশনের মূল শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={benefitsTitle}
                    onChange={(e) => setBenefitsTitle(e.target.value)}
                    placeholder="যেমন: মেথি মিক্সের প্রমাণসমর্থিত ও প্রকৃত স্বাস্থ্য উপকারিতা"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    উপশিরোনাম / সাব-হেডিং
                  </label>
                  <input
                    type="text"
                    value={benefitsSubtitle}
                    onChange={(e) => setBenefitsSubtitle(e.target.value)}
                    placeholder="যেমন: অতিরিক্ত বা ভুয়া দাবি নয়; প্রাচীন ভেষজ জ্ঞান ও বিজ্ঞানের দৃষ্টিতে..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>
              </div>

              {/* 4 Detailed Benefit Cards */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-stone-700 block">
                  প্রধান ৪টি উপকারিতা কার্ড সম্পাদন করুন:
                </span>

                {/* Card 1 */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">উপকারিতা ০১:</span>
                  <input
                    type="text"
                    value={b1Title}
                    onChange={(e) => setB1Title(e.target.value)}
                    placeholder="উপকারিতার শিরোনাম (যেমন: হজমে প্রাকৃতিক সহায়তা)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={b1Desc}
                    onChange={(e) => setB1Desc(e.target.value)}
                    placeholder="বিস্তারিত বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                {/* Card 2 */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">উপকারিতা ০২:</span>
                  <input
                    type="text"
                    value={b2Title}
                    onChange={(e) => setB2Title(e.target.value)}
                    placeholder="উপকারিতার শিরোনাম (যেমন: স্বাভাবিক শর্করা ভারসাম্য)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={b2Desc}
                    onChange={(e) => setB2Desc(e.target.value)}
                    placeholder="বিস্তারিত বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                {/* Card 3 */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">উপকারিতা ০৩:</span>
                  <input
                    type="text"
                    value={b3Title}
                    onChange={(e) => setB3Title(e.target.value)}
                    placeholder="উপকারিতার শিরোনাম (যেমন: চুল ও ত্বকের পুষ্টি)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={b3Desc}
                    onChange={(e) => setB3Desc(e.target.value)}
                    placeholder="বিস্তারিত বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                {/* Card 4 */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">উপকারিতা ০৪:</span>
                  <input
                    type="text"
                    value={b4Title}
                    onChange={(e) => setB4Title(e.target.value)}
                    placeholder="উপকারিতার শিরোনাম (যেমন: মেটাবলিজম ও ওজন নিয়ন্ত্রণ)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={b4Desc}
                    onChange={(e) => setB4Desc(e.target.value)}
                    placeholder="বিস্তারিত বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 3: USAGE STEPS & FAQ CMS ==================== */}
        {subTab === 'usage_faq' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Usage Guide */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1F6E43]" />
                <span>সঠিক সেবন পদ্ধতি (Usage Guide Section)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    সেবন পদ্ধতি সেকশনের মূল শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={usageTitle}
                    onChange={(e) => setUsageTitle(e.target.value)}
                    placeholder="যেমন: মেথি মিক্স কীভাবে ও কখন খাবেন?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    উপশিরোনাম
                  </label>
                  <input
                    type="text"
                    value={usageSubtitle}
                    onChange={(e) => setUsageSubtitle(e.target.value)}
                    placeholder="যেমন: সর্বোচ্চ সুফল পেতে প্রস্তুতকারকের নির্দেশিত ৩টি সহজ ধাপ অনুসরণ করুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>
              </div>

              {/* 3 Usage Steps */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-stone-700 block">
                  সেবনের ৩টি ধাপ সম্পাদনা করুন:
                </span>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">ধাপ ০১:</span>
                  <input
                    type="text"
                    value={step1Title}
                    onChange={(e) => setStep1Title(e.target.value)}
                    placeholder="ধাপের নাম (যেমন: পানি প্রস্তুত করুন)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={step1Desc}
                    onChange={(e) => setStep1Desc(e.target.value)}
                    placeholder="ধাপের বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">ধাপ ০২:</span>
                  <input
                    type="text"
                    value={step2Title}
                    onChange={(e) => setStep2Title(e.target.value)}
                    placeholder="ধাপের নাম (যেমন: মেথি মিক্স যোগ করুন)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={step2Desc}
                    onChange={(e) => setStep2Desc(e.target.value)}
                    placeholder="ধাপের বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">ধাপ ০৩:</span>
                  <input
                    type="text"
                    value={step3Title}
                    onChange={(e) => setStep3Title(e.target.value)}
                    placeholder="ধাপের নাম (যেমন: সকালে খালি পেটে পান করুন)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold focus:border-[#1F6E43] outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={step3Desc}
                    onChange={(e) => setStep3Desc(e.target.value)}
                    placeholder="ধাপের বিবরণ..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Storage & Disclaimer */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1F6E43]" />
                <span>সংরক্ষণ ও স্বাস্থ্য সতর্কতা</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    সংরক্ষণ পদ্ধতি
                  </label>
                  <textarea
                    rows={2}
                    value={storageInstructions}
                    onChange={(e) => setStorageInstructions(e.target.value)}
                    placeholder="যেমন: শুষ্ক, শীতল ও ছায়াযুক্ত স্থানে বায়ুরোধী জারে সংরক্ষণ করুন..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-900 focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    স্বাস্থ্য সচেতনতামূলক সতর্কতা (Health Disclaimer)
                  </label>
                  <textarea
                    rows={2}
                    value={warningNotice}
                    onChange={(e) => setWarningNotice(e.target.value)}
                    placeholder="যেমন: এটি সাধারণ শারীরিক সুস্থতায় সহায়ক প্রাকৃতিক খাদ্য উপাদান; কোনো রোগের সরাসরি প্রতিষেধক নয়..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 text-stone-900 focus:border-[#1F6E43] outline-hidden"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* FAQ Section Titles */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#1F6E43]" />
                <span>সচরাচর জিজ্ঞাসিত প্রশ্ন সেকশন (FAQ Section)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    FAQ সেকশনের মূল শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={faqTitle}
                    onChange={(e) => setFaqTitle(e.target.value)}
                    placeholder="যেমন: সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    FAQ উপশিরোনাম
                  </label>
                  <input
                    type="text"
                    value={faqSubtitle}
                    onChange={(e) => setFaqSubtitle(e.target.value)}
                    placeholder="যেমন: পণ্য, ডেলিভারি এবং ব্যবহার নিয়ে আপনার মনের সাধারণ প্রশ্নগুলোর উত্তর"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-[#1F6E43] outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 4: DELIVERY & STORE SETTINGS ==================== */}
        {subTab === 'delivery' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-stone-200/80 space-y-4">
              <h4 className="font-bold text-[#133926] text-sm uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1F6E43]" />
                <span>ডেলিভারি চার্জ ও কাস্টমার হেল্পলাইন</span>
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
                    সাপোর্ট ফোন নম্বর
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
                    শীর্ষ স্ক্রলিং ঘোষণা বার টেক্সট
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
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-4 border-t border-stone-100">
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
                <span>সমস্ত তথ্য ও সেটিংস সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
