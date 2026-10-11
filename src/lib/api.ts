import { Order, OrderSubmissionPayload, ProductItem, StoreSettings, AdminStats, OrderStatus } from '../types';
import { DEFAULT_PRODUCT, DEFAULT_SETTINGS } from '../config/defaultStore';

const BASE_URL = '';

export interface ProductApiResponse {
  product: ProductItem;
  settings: StoreSettings;
  isBackendConnected: boolean;
}

export interface OrderSubmitResponse {
  success: boolean;
  order?: Order;
  error?: string;
  isDemoMode?: boolean;
}

// Local storage keys for standalone React client mode
const STORAGE_ORDERS_KEY = 'shosti_local_orders';
const STORAGE_PRODUCT_KEY = 'shosti_local_product';
const STORAGE_SETTINGS_KEY = 'shosti_local_settings';

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage quota
  }
}

function getLocalProduct(): ProductItem {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCT_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PRODUCT;
  } catch {
    return DEFAULT_PRODUCT;
  }
}

function getLocalSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const api = {
  // Public: Get product and store configuration
  async getProductAndSettings(): Promise<ProductApiResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/product`);
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error('Backend not available');
      }
      const data = await res.json();
      return {
        product: data.product || DEFAULT_PRODUCT,
        settings: data.settings || DEFAULT_SETTINGS,
        isBackendConnected: true
      };
    } catch {
      // Standalone React Client Fallback
      return {
        product: getLocalProduct(),
        settings: getLocalSettings(),
        isBackendConnected: false
      };
    }
  },

  // Public: Submit new COD order
  async submitOrder(payload: OrderSubmissionPayload): Promise<OrderSubmitResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return { success: true, order: data.order, isDemoMode: false };
      } else if (!res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return { success: false, error: data.error };
      }
      throw new Error('Falling back to local client processor');
    } catch {
      // Bulletproof local processor for pure React client
      const product = getLocalProduct();
      const settings = getLocalSettings();

      if (!product.inStock) {
        return { success: false, error: 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই।' };
      }

      const unitPrice = product.basePrice;
      const subtotal = unitPrice * payload.quantity;
      let discount = 0;
      if (payload.quantity === 2) discount = 50;
      else if (payload.quantity >= 3) discount = 150;

      const deliveryCharge =
        payload.city === 'inside_dhaka'
          ? (settings.deliveryInsideDhaka ?? 70)
          : (settings.deliveryOutsideDhaka ?? 130);

      const totalAmount = subtotal + deliveryCharge - discount;

      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `SN-${datePart}-${randomPart}`;

      const newOrder: Order = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderNumber,
        customerName: payload.customerName.trim(),
        customerPhone: payload.customerPhone.trim(),
        deliveryAddress: payload.deliveryAddress.trim(),
        city: payload.city,
        district: payload.district || (payload.city === 'inside_dhaka' ? 'ঢাকা' : ''),
        items: [
          {
            productId: product.id,
            productName: product.name,
            unitPrice: unitPrice,
            quantity: payload.quantity,
            totalPrice: subtotal
          }
        ],
        subtotal,
        deliveryCharge,
        discount,
        totalAmount,
        paymentMethod: 'cod',
        status: 'pending',
        notes: payload.notes?.trim() || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingOrders = getLocalOrders();
      existingOrders.unshift(newOrder);
      saveLocalOrders(existingOrders);

      return {
        success: true,
        order: newOrder,
        isDemoMode: true
      };
    }
  },

  // Public: Track order by phone or order number
  async trackOrder(query: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/track?query=${encodeURIComponent(query.trim())}`);
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return { success: true, orders: data.orders };
      }
      throw new Error('Falling back to local order tracker');
    } catch {
      const localOrders = getLocalOrders();
      const q = query.trim().toLowerCase();
      const matches = localOrders.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customerPhone.includes(q)
      );
      if (matches.length === 0) {
        return { success: false, error: 'এই নম্বর বা অর্ডার আইডিতে কোনো অর্ডার খুঁজে পাওয়া যায়নি।' };
      }
      return { success: true, orders: matches };
    }
  },

  // Admin: Login
  async adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok) return { success: true, token: data.token };
        return { success: false, error: data.error };
      }
      throw new Error('Fallback to local authentication');
    } catch {
      // Local client auth
      if (password === 'shosti2026' || password === 'admin') {
        return { success: true, token: `local_token_${Date.now()}` };
      }
      return { success: false, error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।' };
    }
  },

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Admin: Dashboard stats and orders
  async getAdminDashboard(token: string): Promise<{
    success: boolean;
    stats?: AdminStats;
    orders?: Order[];
    product?: ProductItem;
    settings?: StoreSettings;
    isBackendConnected?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        return {
          success: false,
          error: 'সেশন মেয়াদোত্তীর্ণ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।'
        };
      }
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return {
          success: true,
          stats: data.stats,
          orders: data.orders,
          product: data.product,
          settings: data.settings,
          isBackendConnected: true
        };
      }
      throw new Error('Backend failed');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('সেশন')) {
        return { success: false, error: errorMessage };
      }

      // Check if backend is actually reachable via health endpoint
      let isAlive = false;
      try {
        const healthRes = await fetch(`${BASE_URL}/api/health`);
        isAlive = healthRes.ok;
      } catch {
        isAlive = false;
      }

      const orders = getLocalOrders();
      const product = getLocalProduct();
      const settings = getLocalSettings();

      const stats: AdminStats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        confirmedOrders: orders.filter((o) => o.status === 'confirmed').length,
        shippedOrders: orders.filter((o) => o.status === 'shipped').length,
        deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
        cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        recentOrdersCount: orders.length
      };

      return {
        success: true,
        stats,
        orders,
        product,
        settings,
        isBackendConnected: isAlive
      };
    }
  },

  // Admin: Update order status
  async updateOrderStatus(token: string, orderId: string, status: OrderStatus): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return { success: true, order: data.order };
      }
      throw new Error('Fallback to local order update');
    } catch {
      const orders = getLocalOrders();
      const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
      if (idx !== -1) {
        orders[idx].status = status;
        orders[idx].updatedAt = new Date().toISOString();
        saveLocalOrders(orders);
        return { success: true, order: orders[idx] };
      }
      return { success: false, error: 'অর্ডার পাওয়া যায়নি' };
    }
  },

  // Admin: Delete order
  async deleteOrder(token: string, orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        return { success: true };
      }
      throw new Error('Fallback to local delete');
    } catch {
      const orders = getLocalOrders();
      const filtered = orders.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
      saveLocalOrders(filtered);
      return { success: true };
    }
  },

  // Admin: Update store settings & product
  async updateStoreSettings(
    token: string,
    payload: {
      basePrice?: number;
      originalPrice?: number;
      inStock?: boolean;
      name?: string;
      subtitle?: string;
      category?: string;
      image?: string;
      galleryImages?: string[] | string;
      weight?: string;
      manufacturer?: string;
      ingredients?: string[] | string;
      usageInstructions?: string;
      storageInstructions?: string;
      warningNotice?: string;
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
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return { success: true, product: data.product, settings: data.settings };
      }
      throw new Error('Fallback to local storage settings update');
    } catch {
      const product = getLocalProduct();
      const settings = getLocalSettings();

      if (payload.basePrice !== undefined) product.basePrice = payload.basePrice;
      if (payload.originalPrice !== undefined) product.originalPrice = payload.originalPrice;
      if (payload.inStock !== undefined) product.inStock = payload.inStock;
      if (payload.name) product.name = payload.name;
      if (payload.subtitle !== undefined) product.subtitle = payload.subtitle;
      if (payload.category !== undefined) product.category = payload.category;
      if (payload.image !== undefined && payload.image) product.image = payload.image;
      if (payload.galleryImages !== undefined) {
        if (Array.isArray(payload.galleryImages)) {
          product.galleryImages = payload.galleryImages;
        } else if (typeof payload.galleryImages === 'string') {
          product.galleryImages = payload.galleryImages.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      if (payload.weight) product.weight = payload.weight;
      if (payload.manufacturer !== undefined) product.manufacturer = payload.manufacturer;
      if (payload.usageInstructions !== undefined) product.usageInstructions = payload.usageInstructions;
      if (payload.storageInstructions !== undefined) product.storageInstructions = payload.storageInstructions;
      if (payload.warningNotice !== undefined) product.warningNotice = payload.warningNotice;

      if (payload.ingredients !== undefined) {
        if (Array.isArray(payload.ingredients)) {
          product.ingredients = payload.ingredients;
        } else if (typeof payload.ingredients === 'string') {
          product.ingredients = payload.ingredients.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }

      if (payload.deliveryInsideDhaka !== undefined) settings.deliveryInsideDhaka = payload.deliveryInsideDhaka;
      if (payload.deliveryOutsideDhaka !== undefined) settings.deliveryOutsideDhaka = payload.deliveryOutsideDhaka;
      if (payload.announcementText !== undefined) settings.announcementText = payload.announcementText;
      if (payload.showAnnouncement !== undefined) settings.showAnnouncement = payload.showAnnouncement;
      if (payload.phone !== undefined) settings.phone = payload.phone;
      if (payload.whatsapp !== undefined) settings.whatsapp = payload.whatsapp;

      try {
        localStorage.setItem(STORAGE_PRODUCT_KEY, JSON.stringify(product));
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // Ignore
      }

      return { success: true, product, settings };
    }
  }
};
