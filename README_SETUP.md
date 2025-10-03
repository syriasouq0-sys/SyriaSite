# Syria Store - E-commerce Setup Guide

Welcome to Syria Store! This guide will help you set up the complete e-commerce platform.

## 🎨 What's Built

This is a **production-ready e-commerce website** built with:
- **React 18** + **Vite** (similar architecture to Next.js, optimized for performance)
- **TypeScript** for type safety
- **Tailwind CSS** with custom Syrian flag color design system
- **Framer Motion** for smooth animations
- **Zustand** for cart state management
- **Shadcn UI** components

### Current Features ✅
- ✅ Modern, responsive homepage with hero section
- ✅ Full product catalog with real Syrian products
- ✅ Product detail pages with multilingual support (EN/AR/SV)
- ✅ Shopping cart with persistent state
- ✅ Search and category filtering
- ✅ Mobile-responsive design
- ✅ Smooth animations and transitions
- ✅ SEO optimized

### Backend Features (Prepared but Not Connected) 🔧
- Database schema ready for Supabase
- Stripe integration code scaffolded
- Multilingual translation files structure
- Product seeding scripts

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:8080` to see your store!

## 📦 Backend Setup (When Ready)

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Run Database Schema**
   - Open the SQL Editor in your Supabase dashboard
   - Copy contents of `supabase/schema.sql`
   - Execute the SQL to create all tables

3. **Seed Products**
   - Copy contents of `scripts/seed.sql`
   - Execute in SQL Editor to populate products

4. **Upload Product Images**
   - Go to Storage in Supabase dashboard
   - The `product-images` bucket is already created by schema
   - Upload images from `src/assets/` to this bucket
   - Update image URLs in the products table

5. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create account and get API keys

2. **Configure Environment Variables**
   - Add Stripe keys to `.env`:
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Create Products in Stripe**
   - Create products in Stripe dashboard matching your catalog
   - Update product IDs in your code

## 🌍 Multilingual Support

Translation files are prepared in `public/locales/`:
- `en.json` - English
- `ar.json` - Arabic (RTL ready)
- `sv.json` - Swedish

To implement:
1. Install i18n library: `npm install react-i18next i18next`
2. Set up i18n configuration
3. Wrap app with i18n provider
4. Use translation hooks in components

## 📱 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel automatically detects Vite and configures build settings.

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables

## 🎨 Design System

The design uses Syrian flag colors throughout:
- **Primary (Green)**: `hsl(151 100% 28%)`
- **Secondary (Red)**: `hsl(354 82% 45%)`
- **Black**: `hsl(0 0% 0%)`
- **White**: `hsl(0 0% 100%)`

All colors are defined in `src/index.css` and referenced via Tailwind.

## 📁 Project Structure

```
src/
├── assets/         # Product images
├── components/     # Reusable components
│   ├── ui/        # Shadcn components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── CartDrawer.tsx
├── data/          # Product data
├── pages/         # Route pages
├── store/         # Zustand stores
├── types/         # TypeScript types
└── App.tsx        # Main app with routing

supabase/
└── schema.sql     # Database schema

scripts/
└── seed.sql       # Sample data

public/
└── locales/       # Translation files
```

## 🔐 Security Notes

- Never commit `.env` file
- Use Row Level Security (RLS) in Supabase
- Validate all user inputs
- Use server-side Stripe operations for payments

## 📊 Current Product Catalog

The store includes 7 authentic Syrian products:
1. Syrian Flag - Large (299 SEK)
2. Syrian Flag - Desk Size (149 SEK)
3. Syria Scarf - Official Edition (199 SEK)
4. Syria Mini Scarf (129 SEK)
5. Handmade Crochet Syria Scarf (249 SEK)
6. Syria Flag Bracelet (79 SEK)
7. Syria Woven Tote Bag (349 SEK)

All products include:
- High-quality images
- Multilingual descriptions (EN/AR/SV)
- Stock management
- Category tags

## 🛠 Next Steps

1. **Test the current site** - Browse, add to cart, check responsiveness
2. **Connect Supabase** - Set up backend when ready
3. **Add Stripe** - Implement checkout flow
4. **Implement i18n** - Activate multilingual support
5. **Deploy** - Go live on Vercel
6. **Add more products** - Expand your catalog

## 💡 Tips

- Use Visual Edits in Lovable for quick design tweaks
- Test on mobile devices early
- Monitor Stripe webhooks for payment events
- Set up proper error tracking (e.g., Sentry)

## 📞 Support

For questions about:
- **Lovable**: Check [docs.lovable.dev](https://docs.lovable.dev)
- **Supabase**: Check [supabase.com/docs](https://supabase.com/docs)
- **Stripe**: Check [stripe.com/docs](https://stripe.com/docs)

---

**Built with ❤️ for Syria**
