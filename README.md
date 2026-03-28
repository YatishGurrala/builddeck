# Builddeck

A product discovery platform where makers submit products, get discovered, and grow their audience.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Email:** Resend
- **Hosting:** Vercel

## Features

- 🚀 Product submission and discovery
- 🔐 User authentication (sign up, login, protected routes)
- 📊 User dashboard to manage products
- 👨‍💼 Admin panel for moderation
- 📧 Newsletter subscription with email confirmation
- 🎨 Dark theme with modern SaaS design
- 📱 Fully responsive

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Resend account (for emails)

### 1. Clone and Install

```bash
cd builddeck
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL files in order:
   - `supabase/schema.sql` - Creates tables, types, and RLS policies
   - `supabase/storage.sql` - Sets up storage bucket for images
   - `supabase/admin-policies.sql` - Adds admin-specific policies

3. Go to **Storage** and create a bucket named `products` (if not created automatically), make it **public**

4. Get your credentials from **Settings > API**:
   - Project URL
   - Anon/Public key
   - Service Role key

### 3. Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. (Optional) Add and verify your domain for production

### 4. Configure Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your-resend-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Create Admin User

1. Sign up for an account on your app
2. Go to Supabase **Table Editor** > `profiles`
3. Find your user and change `role` from `user` to `admin`
4. Now you can access `/admin` route

## Project Structure

```
builddeck/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── categories/         # Category pages
│   ├── dashboard/          # User dashboard
│   ├── login/              # Login page
│   ├── products/           # Product listing & details
│   ├── signup/             # Signup page
│   ├── submit/             # Product submission
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── actions/                # Server actions
│   ├── auth.ts
│   ├── newsletter.ts
│   └── products.ts
├── components/             # React components
│   ├── forms/
│   ├── layout/
│   ├── product/
│   └── ui/
├── lib/                    # Utilities
│   ├── supabase/
│   ├── resend.ts
│   ├── utils.ts
│   └── validations.ts
├── supabase/               # Database schema
│   ├── schema.sql
│   ├── storage.sql
│   └── admin-policies.sql
├── types/                  # TypeScript types
└── middleware.ts           # Auth middleware
```

## Database Schema

### Tables

- **profiles** - User profiles (extends Supabase auth)
- **products** - Product listings
- **categories** - Product categories
- **newsletter_subscribers** - Newsletter signups

### Product Status Flow

1. User submits product → Status: `pending`
2. Admin reviews → Status: `approved` or `rejected`
3. Approved products visible on public pages
4. Admin can mark products as `featured`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Customization

### Adding Categories

Insert new categories directly in Supabase Table Editor or SQL:

```sql
INSERT INTO categories (name, slug) VALUES ('Your Category', 'your-category');
```

### Modifying Email Templates

Edit email templates in `lib/resend.ts`

### Styling

- Global styles: `app/globals.css`
- Component styles: Tailwind classes in components
- Theme colors: Primarily using `zinc` and `violet` color scales

## License

MIT
