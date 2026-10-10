/**
 * Safe, privacy-first analytics helper for e-commerce events.
 * Does NOT transmit customer PII (phone number, address) to third-party pixels.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export const analytics = {
  // Triggered when user views product page
  trackViewContent: (product: { id: string; name: string; price: number }) => {
    try {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: {
            items: [{
              item_id: product.id,
              item_name: product.name,
              price: product.price,
              currency: 'BDT'
            }]
          }
        });
      }
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: product.price,
          currency: 'BDT'
        });
      }
    } catch {
      // Ignore tracker errors
    }
  },

  // Triggered when customer starts interacting with checkout form
  trackInitiateCheckout: (value: number) => {
    try {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'begin_checkout',
          ecommerce: {
            value: value,
            currency: 'BDT'
          }
        });
      }
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          value: value,
          currency: 'BDT'
        });
      }
    } catch {
      // Ignore
    }
  },

  // Triggered ONLY after server validates and confirms order
  trackPurchase: (order: { orderNumber: string; totalAmount: number; quantity: number }) => {
    try {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: order.orderNumber,
            value: order.totalAmount,
            currency: 'BDT',
            items: [{
              item_id: 'methi-mix',
              item_name: 'মেথি মিক্স (Methi Mix)',
              quantity: order.quantity
            }]
          }
        });
      }
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          value: order.totalAmount,
          currency: 'BDT',
          content_type: 'product',
          num_items: order.quantity
        });
      }
    } catch {
      // Ignore
    }
  }
};
