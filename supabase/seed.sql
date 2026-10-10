-- Initial Seed Data for Shosti Nature

INSERT INTO public.products (
    id,
    name,
    subtitle,
    category,
    base_price,
    original_price,
    weight,
    in_stock,
    image_url,
    ingredients,
    manufacturer,
    origin,
    shelf_life,
    storage_instructions,
    usage_instructions,
    warning_notice,
    disclaimer
) VALUES (
    'methi-mix-01',
    'মেথি মিক্স (Methi Mix)',
    'প্রতিদিনের সুস্থতায় খাঁটি ও প্রাকৃতিক ভেষজ উপাদানের ভারসাম্য',
    'প্রাকৃতিক ও ভেষজ পণ্য',
    500.00,
    650.00,
    '২০০ গ্রাম (নেট ওজন)',
    TRUE,
    '/images/default-methi-mix.jpg',
    '["বাছাইকৃত তাজা মেথি দানা (Fenugreek Seed)", "প্রাকৃতিক মেথি গুঁড়ো (Pure Fenugreek Powder)", "পরিপাক সহায়ক মৃদু ভেষজ উপাদান"]'::jsonb,
    'এম এইচ ন্যাচারাল প্রডাক্টস লিঃ / লোকাল অথেনটিক পার্টনার',
    'বাংলাদেশ',
    '১২ মাস',
    'শুষ্ক ও শীতল স্থানে রাখুন, সরাসরি রোদ থেকে দূরে রাখুন।',
    '১ চা চামচ মেথি মিক্স স্বাভাবিক বা কুসুম গরম পানিতে মিশিয়ে প্রতিদিন সকালে খালি পেটে সেব্য।',
    'সাধারণ শারীরিক সুস্থতায় সহায়ক; কোনো রোগের সরাসরি চিকিৎসার বিকল্প নয়।',
    'স্বাস্থ্যঝুঁকি এড়াতে বিশেষজ্ঞ চিকিৎসকের মতামত গ্রহণ করুন।'
) ON CONFLICT (id) DO UPDATE SET
    base_price = EXCLUDED.base_price,
    name = EXCLUDED.name;

INSERT INTO public.store_settings (
    id,
    store_name,
    tagline,
    phone,
    whatsapp,
    email,
    address,
    announcement_text,
    show_announcement,
    delivery_inside_dhaka,
    delivery_outside_dhaka,
    delivery_time_dhaka,
    delivery_time_outside,
    cod_available
) VALUES (
    'default_settings',
    'Shosti Nature',
    'প্রকৃতির শুদ্ধতায় সুস্থ জীবনের অঙ্গীকার',
    '01700-000000',
    '8801700000000',
    'contact@shostinature.com',
    'ঢাকা, বাংলাদেশ',
    '🌿 সারাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা | প্রোডাক্ট দেখে মূল্য পরিশোধের সুযোগ',
    TRUE,
    70.00,
    130.00,
    '২৪ থেকে ৪৮ ঘণ্টা',
    '২ থেকে ৪ কার্যদিবস',
    TRUE
) ON CONFLICT (id) DO NOTHING;
