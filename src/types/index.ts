export type OrderStatus =
  | 'pending'      // অপেক্ষমাণ
  | 'confirmed'    // নিশ্চিত
  | 'processing'   // প্রক্রিয়াধীন
  | 'shipped'      // পাঠানো হয়েছে
  | 'delivered'    // ডেলিভারি সম্পন্ন
  | 'cancelled';   // বাতিল

export interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
}

export interface UsageStepItem {
  step: string;
  title: string;
  desc: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  basePrice: number;
  originalPrice: number;
  weight: string;
  inStock: boolean;
  image: string;
  galleryImages: string[];
  ingredients: string[];
  manufacturer: string;
  origin: string;
  shelfLife: string;
  storageInstructions: string;
  usageInstructions: string;
  warningNotice: string;
  disclaimer: string;

  // Universal CMS Section Content Fields
  aboutTitle?: string;
  aboutDesc1?: string;
  aboutDesc2?: string;
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefitsList?: BenefitItem[];
  usageTitle?: string;
  usageSubtitle?: string;
  usageSteps?: UsageStepItem[];
  faqTitle?: string;
  faqSubtitle?: string;
  faqList?: FaqItem[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  announcementText: string;
  showAnnouncement: boolean;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  deliveryTimeDhaka: string;
  deliveryTimeOutside: string;
  codAvailable: boolean;
  fbPageUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderSubmissionPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: 'inside_dhaka' | 'outside_dhaka';
  district?: string;
  quantity: number;
  notes?: string;
  idempotencyKey?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SN-20261010-8492
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: 'inside_dhaka' | 'outside_dhaka';
  district: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'cod';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrdersCount: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
