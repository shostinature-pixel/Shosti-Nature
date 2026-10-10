import { Order, OrderSubmissionPayload, ProductItem, StoreSettings, AdminStats } from '../types';
import { DEFAULT_PRODUCT, DEFAULT_SETTINGS } from '../config/defaultStore';

const BASE_URL = '';

export interface ProductApiResponse {
  product: ProductItem;
  settings: StoreSettings;
}

export interface OrderSubmitResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

export const api = {
  async getProductAndSettings(): Promise<ProductApiResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/product`);
      if (!res.ok) throw new Error('Failed to fetch from server');
      const data = await res.json();
      return {
        product: data.product || DEFAULT_PRODUCT,
        settings: data.settings || DEFAULT_SETTINGS
      };
    } catch {
      // Graceful local state if server has cold start or offline
      return {
        product: DEFAULT_PRODUCT,
        settings: DEFAULT_SETTINGS
      };
    }
  },

  async submitOrder(payload: OrderSubmissionPayload): Promise<OrderSubmitResponse> {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      };
    }

    return {
      success: true,
      order: data.order
    };
  },

  async trackOrder(query: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/track?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'অর্ডার তথ্য খুঁজে পাওয়া যায়নি' };
      }
      return { success: true, orders: data.orders };
    } catch {
      return { success: false, error: 'সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে' };
    }
  },

  async adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'ভুল পাসওয়ার্ড' };
      }
      return { success: true, token: data.token };
    } catch {
      return { success: false, error: 'লগইনে সমস্যা হয়েছে' };
    }
  },

  async getAdminDashboard(token: string): Promise<{
    success: boolean;
    stats?: AdminStats;
    orders?: Order[];
    product?: ProductItem;
    settings?: StoreSettings;
    error?: string;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'অনুমোদিত নয়' };
      }
      return {
        success: true,
        stats: data.stats,
        orders: data.orders,
        product: data.product,
        settings: data.settings
      };
    } catch {
      return { success: false, error: 'তথ্য লোড করতে ব্যর্থ হয়েছে' };
    }
  },

  async updateOrderStatus(token: string, orderId: string, status: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে' };
      }
      return { success: true, order: data.order };
    } catch {
      return { success: false, error: 'সার্ভারে সংযোগ ব্যর্থ হয়েছে' };
    }
  },

  async updateStoreSettings(
    token: string,
    payload: {
      basePrice?: number;
      inStock?: boolean;
      name?: string;
      weight?: string;
      deliveryInsideDhaka?: number;
      deliveryOutsideDhaka?: number;
      announcementText?: string;
      showAnnouncement?: boolean;
      phone?: string;
      whatsapp?: string;
    }
  ): Promise<{ success: boolean; product?: ProductItem; settings?: StoreSettings; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'সেটিংস আপডেট ব্যর্থ হয়েছে' };
      }
      return { success: true, product: data.product, settings: data.settings };
    } catch {
      return { success: false, error: 'সার্ভার সমস্যা' };
    }
  }
};
