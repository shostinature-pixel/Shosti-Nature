import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Order, OrderItem, ProductItem, StoreSettings } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data store path
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Initial baseline product & settings
const INITIAL_DATA = {
  product: {
    id: 'methi-mix-01',
    name: 'মেথি মিক্স (Methi Mix)',
    subtitle: 'প্রতিদিনের সুস্থতায় খাঁটি ও প্রাকৃতিক ভেষজ উপাদানের ভারসাম্য',
    category: 'প্রাকৃতিক ও ভেষজ পণ্য',
    basePrice: 500, // প্রাথমিক দাম ৫০০ টাকা
    originalPrice: 650,
    weight: '২০০ গ্রাম (নেট ওজন)',
    inStock: true,
    image: '/images/default-methi-mix.jpg',
    galleryImages: ['/images/default-methi-mix.jpg'],
    ingredients: [
      'বাছাইকৃত তাজা মেথি দানা (Fenugreek Seed)',
      'প্রাকৃতিক মেথি গুঁড়ো (Pure Fenugreek Powder)',
      'পরিপাক সহায়ক মৃদু ভেষজ উপাদান',
      'কোনো কৃত্রিম রাসায়নিক, রং বা প্রিজারভেটিভ নেই'
    ],
    manufacturer: 'এম এইচ ন্যাচারাল প্রডাক্টস লিঃ / অথেনটিক পার্টনার',
    origin: 'বাংলাদেশ',
    shelfLife: '১২ মাস',
    storageInstructions: 'শুষ্ক ও শীতল স্থানে রাখুন, সরাসরি রোদ থেকে দূরে রাখুন।',
    usageInstructions: '১ চা চামচ মেথি মিক্স স্বাভাবিক বা কুসুম গরম পানিতে মিশিয়ে প্রতিদিন সকালে খালি পেটে সেব্য।',
    warningNotice: 'সাধারণ শারীরিক সুস্থতায় সহায়ক; চিকিৎসার বিকল্প নয়। গর্ভবতী নারীদের ক্ষেত্রে চিকিৎসকের পরামর্শ বাঞ্ছনীয়।',
    disclaimer: 'স্বাস্থ্যঝুঁকি এড়াতে চিকিৎসকের মতামতকে প্রাধান্য দিন।'
  },
  settings: {
    storeName: 'Shosti Nature',
    tagline: 'প্রকৃতির শুদ্ধতায় সুস্থ জীবনের অঙ্গীকার',
    phone: '01700-000000',
    whatsapp: '8801700000000',
    email: 'contact@shostinature.com',
    address: 'ঢাকা, বাংলাদেশ',
    announcementText: '🌿 সারাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা | প্রোডাক্ট হাতে পেয়ে মূল্য পরিশোধের সুযোগ',
    showAnnouncement: true,
    deliveryInsideDhaka: 70,
    deliveryOutsideDhaka: 130,
    deliveryTimeDhaka: '২৪ থেকে ৪৮ ঘণ্টা',
    deliveryTimeOutside: '২ থেকে ৪ কার্যদিবস',
    codAvailable: true
  },
  adminPassword: process.env.ADMIN_PASSWORD || 'shosti2026',
  orders: [
    {
      id: 'ord-init-1',
      orderNumber: 'SN-26101-1001',
      customerName: 'মো. রফিকুল ইসলাম',
      customerPhone: '01711223344',
      deliveryAddress: 'বাড়ি ১২, রোড ৩, মিরপুর ১০',
      city: 'inside_dhaka',
      district: 'ঢাকা',
      items: [
        {
          productId: 'methi-mix-01',
          productName: 'মেথি মিক্স (Methi Mix)',
          unitPrice: 500,
          quantity: 1,
          totalPrice: 500
        }
      ],
      subtotal: 500,
      deliveryCharge: 70,
      discount: 0,
      totalAmount: 570,
      paymentMethod: 'cod',
      status: 'confirmed',
      notes: 'অফিস টাইমে ডেলিভারি দিলে ভালো হয়',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ]
};

// Helper to read and write database
function loadStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Ensure backwards-compatible shape
    if (!parsed.product) parsed.product = INITIAL_DATA.product;
    if (!parsed.settings) parsed.settings = INITIAL_DATA.settings;
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.adminPassword) parsed.adminPassword = INITIAL_DATA.adminPassword;
    return parsed;
  } catch (err) {
    console.error('Error reading store file:', err);
    return INITIAL_DATA;
  }
}

function saveStore(data: typeof INITIAL_DATA) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store file:', err);
  }
}

// In-memory admin session storage
const activeTokens = new Set<string>();

// Normalize BD Phone
function cleanBdPhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+880')) {
    cleaned = cleaned.replace('+880', '0');
  } else if (cleaned.startsWith('880')) {
    cleaned = cleaned.replace('880', '0');
  }
  return cleaned;
}

function isValidBdPhone(phone: string): boolean {
  const cleaned = cleanBdPhone(phone);
  // BD mobile: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
  return /^01[3-9]\d{8}$/.test(cleaned);
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // 1. Public API: Get product and store settings
  app.get('/api/product', (req, res) => {
    const store = loadStore();
    res.json({
      product: store.product,
      settings: store.settings
    });
  });

  // 2. Public API: Create new COD order
  app.post('/api/orders', (req, res) => {
    try {
      const store = loadStore();
      const {
        customerName,
        customerPhone,
        deliveryAddress,
        city = 'inside_dhaka',
        district = '',
        quantity = 1,
        notes = ''
      } = req.body;

      // Validation
      if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
        return res.status(400).json({ error: 'অনুগ্রহ করে আপনার সঠিক নাম লিখুন' });
      }

      if (!customerPhone || !isValidBdPhone(customerPhone)) {
        return res.status(400).json({
          error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
        });
      }

      if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 5) {
        return res.status(400).json({ error: 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা দিন' });
      }

      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ error: 'সঠিক পরিমাণ নির্বাচন করুন (১-২০)' });
      }

      if (!store.product.inStock) {
        return res.status(400).json({ error: 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই' });
      }

      const formattedPhone = cleanBdPhone(customerPhone);

      // Duplicate submission protection (prevent same phone within 45 seconds)
      const now = Date.now();
      const recentDuplicate = store.orders.find((o: Order) => {
        const orderTime = new Date(o.createdAt).getTime();
        return o.customerPhone === formattedPhone && now - orderTime < 45000;
      });

      if (recentDuplicate) {
        return res.status(200).json({
          success: true,
          order: recentDuplicate,
          duplicateNotice: true
        });
      }

      // STRICT Server-side price calculation
      const unitPrice = store.product.basePrice;
      const subtotal = unitPrice * qty;

      // Bundle savings if 2 or more
      let discount = 0;
      if (qty === 2) discount = 50; // ২ বোতলে ৫০ টাকা ছাড়
      else if (qty >= 3) discount = 150; // ৩ বা ততোধিকে ১৫০ টাকা ছাড়

      const deliveryCharge =
        city === 'inside_dhaka'
          ? (store.settings.deliveryInsideDhaka ?? 70)
          : (store.settings.deliveryOutsideDhaka ?? 130);

      const totalAmount = subtotal + deliveryCharge - discount;

      // Generate unique order ID
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `SN-${datePart}-${randomPart}`;

      const newOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: formattedPhone,
        deliveryAddress: deliveryAddress.trim(),
        city: city === 'inside_dhaka' ? 'inside_dhaka' : 'outside_dhaka',
        district: district.trim(),
        items: [
          {
            productId: store.product.id,
            productName: store.product.name,
            unitPrice: unitPrice,
            quantity: qty,
            totalPrice: subtotal
          }
        ],
        subtotal,
        deliveryCharge,
        discount,
        totalAmount,
        paymentMethod: 'cod' as const,
        status: 'pending' as const, // নতুন অর্ডার অপেক্ষমাণ
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.orders.unshift(newOrder);
      saveStore(store);

      return res.status(201).json({
        success: true,
        order: newOrder
      });
    } catch (err) {
      console.error('Order creation error:', err);
      return res.status(500).json({ error: 'অর্ডার প্রক্রিয়া করার সময় অভ্যন্তরীণ ত্রুটি হয়েছে' });
    }
  });

  // 3. Public API: Track order by phone or order number
  app.get('/api/orders/track', (req, res) => {
    const query = String(req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'অনুগ্রহ করে অর্ডার নম্বর বা ফোন নম্বর লিখুন' });
    }

    const store = loadStore();
    const cleanedQueryPhone = cleanBdPhone(query);

    const matches = store.orders.filter((o: Order) => {
      return (
        o.orderNumber.toLowerCase() === query.toLowerCase() ||
        o.customerPhone === cleanedQueryPhone ||
        o.customerPhone.includes(query)
      );
    });

    res.json({
      success: true,
      orders: matches
    });
  });

  // 4. Admin API: Login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const store = loadStore();

    const expectedPassword = process.env.ADMIN_PASSWORD || store.adminPassword || 'shosti2026';
    if (!password || password !== expectedPassword) {
      return res.status(401).json({ error: 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' });
    }

    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    activeTokens.add(token);

    res.json({
      success: true,
      token
    });
  });

  // Middleware: Auth check
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'প্রবেশাধিকার সংরক্ষিত' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeTokens.has(token)) {
      return res.status(401).json({ error: 'সেশন মেয়াদোত্তীর্ণ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।' });
    }
    next();
  };

  // 5. Admin API: Dashboard stats & order list
  app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
    const store = loadStore();
    const orders = store.orders;

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o: Order) => o.status === 'pending').length,
      confirmedOrders: orders.filter((o: Order) => o.status === 'confirmed').length,
      shippedOrders: orders.filter((o: Order) => o.status === 'shipped').length,
      deliveredOrders: orders.filter((o: Order) => o.status === 'delivered').length,
      cancelledOrders: orders.filter((o: Order) => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter((o: Order) => o.status !== 'cancelled')
        .reduce((sum: number, o: Order) => sum + (o.totalAmount || 0), 0),
      recentOrdersCount: orders.filter((o: Order) => {
        const orderTime = new Date(o.createdAt).getTime();
        return Date.now() - orderTime < 86400000;
      }).length
    };

    res.json({
      success: true,
      stats,
      orders,
      product: store.product,
      settings: store.settings
    });
  });

  // 6. Admin API: Update order status
  app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'অবৈধ স্ট্যাটাস' });
    }

    const store = loadStore();
    const orderIndex = store.orders.findIndex((o: Order) => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'অর্ডার পাওয়া যায়নি' });
    }

    store.orders[orderIndex].status = status;
    store.orders[orderIndex].updatedAt = new Date().toISOString();
    saveStore(store);

    res.json({
      success: true,
      order: store.orders[orderIndex]
    });
  });

  // 7. Admin API: Update price and store settings
  app.post('/api/admin/settings', requireAdmin, (req, res) => {
    try {
      const store = loadStore();
      const {
        basePrice,
        inStock,
        name,
        weight,
        deliveryInsideDhaka,
        deliveryOutsideDhaka,
        announcementText,
        showAnnouncement,
        phone,
        whatsapp
      } = req.body;

      if (basePrice !== undefined) {
        const parsedPrice = Number(basePrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          return res.status(400).json({ error: 'সঠিক মূল্য দিন' });
        }
        store.product.basePrice = parsedPrice;
      }

      if (inStock !== undefined) store.product.inStock = Boolean(inStock);
      if (name) store.product.name = String(name);
      if (weight) store.product.weight = String(weight);

      if (deliveryInsideDhaka !== undefined) {
        store.settings.deliveryInsideDhaka = Number(deliveryInsideDhaka);
      }
      if (deliveryOutsideDhaka !== undefined) {
        store.settings.deliveryOutsideDhaka = Number(deliveryOutsideDhaka);
      }
      if (announcementText !== undefined) {
        store.settings.announcementText = String(announcementText);
      }
      if (showAnnouncement !== undefined) {
        store.settings.showAnnouncement = Boolean(showAnnouncement);
      }
      if (phone !== undefined) store.settings.phone = String(phone);
      if (whatsapp !== undefined) store.settings.whatsapp = String(whatsapp);

      saveStore(store);

      res.json({
        success: true,
        product: store.product,
        settings: store.settings
      });
    } catch (err) {
      console.error('Update settings error:', err);
      res.status(500).json({ error: 'সেটিংস সেভ করতে সমস্যা হয়েছে' });
    }
  });

  // 8. Admin API: Export CSV
  app.get('/api/admin/export', requireAdmin, (req, res) => {
    const store = loadStore();
    const orders = store.orders;

    // Build CSV with BOM for UTF-8 Excel support
    let csv = '\uFEFF';
    csv += 'Order Number,Customer Name,Phone,Address,City,District,Quantity,Subtotal,Delivery Charge,Discount,Total,Status,Date\n';

    orders.forEach((o: Order) => {
      const qty = o.items.reduce((acc: number, it: OrderItem) => acc + it.quantity, 0);
      const row = [
        `"${o.orderNumber}"`,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.customerPhone}"`,
        `"${o.deliveryAddress.replace(/"/g, '""')}"`,
        `"${o.city}"`,
        `"${(o.district || '').replace(/"/g, '""')}"`,
        qty,
        o.subtotal,
        o.deliveryCharge,
        o.discount,
        o.totalAmount,
        `"${o.status}"`,
        `"${o.createdAt}"`
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=shosti_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csv);
  });

  // Vite middleware in dev or static files in production
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProd && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
