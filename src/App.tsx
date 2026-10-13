import React, { useState, useEffect } from 'react';
import { ProductItem, StoreSettings, Order } from './types';
import { DEFAULT_PRODUCT, DEFAULT_SETTINGS } from './config/defaultStore';
import { api } from './lib/api';
import { analytics } from './lib/analytics';

// Layout & Landing components
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StickyMobileBar } from './components/layout/StickyMobileBar';
import { FloatingSupportBubble } from './components/layout/FloatingSupportBubble';
import { HeroSection } from './components/landing/HeroSection';
import { ProductAbout } from './components/landing/ProductAbout';
import { BenefitsSection } from './components/landing/BenefitsSection';
import { GallerySection } from './components/landing/GallerySection';
import { ProductSpecs } from './components/landing/ProductSpecs';
import { UsageGuide } from './components/landing/UsageGuide';
import { PricingOffers } from './components/landing/PricingOffers';
import { WhyUsSection } from './components/landing/WhyUsSection';
import { CustomerReviews } from './components/landing/CustomerReviews';
import { FAQSection } from './components/landing/FAQSection';
import { OrderForm } from './components/landing/OrderForm';

// Modals & Admin
import { OrderSuccessModal } from './components/order/OrderSuccessModal';
import { OrderTrackModal } from './components/order/OrderTrackModal';
import { PolicyModal, PolicyKey } from './components/policies/PolicyModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [product, setProduct] = useState<ProductItem>(DEFAULT_PRODUCT);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [selectedQty, setSelectedQty] = useState<number>(1);

  // Modals & Views
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [policyModalKey, setPolicyModalKey] = useState<PolicyKey | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Admin routing state
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('shosti_admin_token') || null;
  });

  // Fetch initial product and settings from server
  useEffect(() => {
    const initData = async () => {
      const data = await api.getProductAndSettings();
      setProduct(data.product);
      setSettings(data.settings);

      // Track view content
      analytics.trackViewContent({
        id: data.product.id,
        name: data.product.name,
        price: data.product.basePrice
      });
    };
    initData();

    // Check if URL hash is #admin
    if (window.location.hash === '#admin') {
      setIsAdminView(true);
    }
  }, []);

  const handleScrollToOrder = () => {
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackageQuantity = (qty: number) => {
    setSelectedQty(qty);
    handleScrollToOrder();
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('shosti_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('shosti_admin_token');
    setIsAdminView(false);
    window.location.hash = '';
  };

  const handleProductUpdatedInAdmin = (newProd: ProductItem, newSet: StoreSettings) => {
    setProduct(newProd);
    setSettings(newSet);
  };

  // Render Admin View if requested
  if (isAdminView) {
    if (!adminToken) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToStore={() => {
            setIsAdminView(false);
            window.location.hash = '';
          }}
        />
      );
    }

    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleAdminLogout}
        onBackToStore={() => {
          setIsAdminView(false);
          window.location.hash = '';
        }}
        onProductUpdatedInParent={handleProductUpdatedInAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* 1. Announcement Bar */}
      <AnnouncementBar
        settings={settings}
        onOpenOrder={handleScrollToOrder}
      />

      {/* 2. Header */}
      <Header
        settings={settings}
        onTrackClick={() => setTrackModalOpen(true)}
        onAdminClick={() => {
          setIsAdminView(true);
          window.location.hash = '#admin';
        }}
        onOrderClick={handleScrollToOrder}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* 3. Hero Section */}
        <HeroSection
          product={product}
          settings={settings}
          onOrderClick={handleScrollToOrder}
        />

        {/* 4. Product About */}
        <ProductAbout product={product} />

        {/* 5. Benefits Section */}
        <BenefitsSection product={product} />

        {/* 6. Gallery Section */}
        <GallerySection product={product} />

        {/* 7. Product Specs */}
        <ProductSpecs product={product} />

        {/* 8. Usage Guide */}
        <UsageGuide product={product} />

        {/* 9. Pricing & Offers */}
        <PricingOffers
          product={product}
          settings={settings}
          onSelectQuantity={handleSelectPackageQuantity}
        />

        {/* 10. Why Us */}
        <WhyUsSection />

        {/* 11. Customer Reviews */}
        <CustomerReviews />

        {/* 12. FAQ Section */}
        <FAQSection product={product} />

        {/* 13. Order Form */}
        <OrderForm
          product={product}
          settings={settings}
          selectedQty={selectedQty}
          onOrderSuccess={(order) => setConfirmedOrder(order)}
        />

      </main>

      {/* 14. Footer */}
      <Footer
        settings={settings}
        onOpenPolicy={(policy) => setPolicyModalKey(policy)}
        onTrackClick={() => setTrackModalOpen(true)}
        onAdminClick={() => {
          setIsAdminView(true);
          window.location.hash = '#admin';
        }}
      />

      {/* 15. Floating Support & WhatsApp Bubble Button */}
      <FloatingSupportBubble settings={settings} />

      {/* 16. Mobile Sticky Order Bar */}
      <StickyMobileBar
        product={product}
        onOrderClick={handleScrollToOrder}
      />

      {/* Modals */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          settings={settings}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {trackModalOpen && (
        <OrderTrackModal
          onClose={() => setTrackModalOpen(false)}
        />
      )}

      {policyModalKey && (
        <PolicyModal
          policyKey={policyModalKey}
          settings={settings}
          onClose={() => setPolicyModalKey(null)}
        />
      )}

    </div>
  );
}
