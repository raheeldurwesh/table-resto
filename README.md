# TableServe - Modern Restaurant POS & SaaS Platform

**TableServe** is a premium, multi-tenant SaaS ecosystem designed to revolutionize the dining experience. It features a sophisticated "Gold & Onyx" aesthetic and provides a seamless, real-time bridge between restaurant owners, staff, and customers.

## 🚀 Key Features

### 🏢 Super Admin Panel (Platform Command Center)
- **Tenant Management**: Onboard and manage multiple restaurants from a single dashboard.
- **Direct Staff Onboarding**: Super Admins can now add **Admins** and **Waiters** directly to any restaurant profile.
- **Admin Impersonation**: Securely "Login as Admin" to any restaurant to troubleshoot or configure settings instantly.
- **Platform Health**: Monitor active vs. disabled restaurants and track global activity.

### ⚙️ Restaurant Admin Panel
- **Menu Management**: Dynamic, category-based menu editor with image support and food-type indicators (Veg/Non-Veg).
- **Team Management**: Toggle staff status, reset passwords, and force-logout users with absolute control.
- **Branding & QR Generation**: Configure tax rates, restaurant details, and generate high-definition QR assets for every table.
- **Live Analytics**: Real-time revenue tracking and order volume insights.

### 👨‍🍳 Waiter Dashboard
- **Instant Order Sync**: Orders placed by customers appear instantly via Supabase Realtime—zero refresh required.
- **Workflow Control**: Manage order lifecycles (Pending → Preparing → Done) with a mobile-first interface.
- **Dynamic Notifications**: Instant visual and audio cues for arriving orders.

### 📱 Customer Experience
- **Frictionless QR Ordering**: Scan a table QR and order instantly. No app installation required.
- **Premium Interface**: Smooth "Gold & Onyx" cart experience with special instruction support.
- **Security Checkpoints**: Intelligent 40-second device lockouts to prevent accidental duplicate orders.
- **PDF Invoicing**: One-click digital bill downloads immediately after placing an order.

### 🌟 Shared Sandbox Demo (Trial Experience)
- **Instant Access**: Potential customers can try the system with one click—no account creation required.
- **Pre-seeded Content**: Automatically boots into a "Demo Cafe" with high-quality menu items and active orders.
- **Safety Layer**: Strictly restricted for guest users—deletions, settings changes, and destructive edits are blocked.
- **Onboarding Guide**: Includes a real-time floating "System Tour" to guide trial users through placing and managing orders.
- **Auto-Maintenance**: Self-cleaning database logic resets the demo environment daily at 2:00 AM UTC.

---

## 🎨 Design Philosophy
The platform utilizes a **Premium Dark Aesthetic** (Gold & Onyx) with:
- **Glassmorphic Components**: Layered, translucent UI for a modern glass feel.
- **Micro-animations**: Subtle transitions and hover effects to guide user interaction.
- **Branded Touchpoints**: Unified "Digital Excellence" branding by **Raheel Durwesh** across all footers.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + Vanilla CSS (Aesthetics)
- **Backend/Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Broadcast & Postgres Changes
- **Auth**: Role-based JWT Auth with Service Role Administrative Actions
- **Logic**: Supabase Edge Functions (Deno/TypeScript)
- **Assets**: jsPDF for dynamic invoicing & qrcode.react for asset generation.

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Edge Function Deployment
To enable administrative actions (Create User, Delete, etc.), deploy the Edge Functions:
```bash
# Deploy with --no-verify-jwt for manual role-based verification
npx supabase functions deploy superadmin-actions --no-verify-jwt
npx supabase functions deploy impersonate-admin --no-verify-jwt
```

### 4. Run Locally
```bash
npm run dev
```

---

## 🤝 Contact & Support
Developed and maintained by **Raheel Durwesh**.  
Elevating hospitality through high-end digital solutions.

- **WhatsApp**: [+91 93593 00613](https://wa.me/919359300613)
- **Instagram**: [@raheeldurwesh](https://www.instagram.com/raheeldurwesh)
- **Portfolio**: [Raheel Durwesh](https://www.instagram.com/raheeldurwesh)

© 2026 TableServe POS Systems. All rights reserved.
