# Builddeck

A product discovery platform where makers submit products, get discovered, and grow their audience.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes + Server Actions
- **Database:** SQLite + Prisma ORM
- **Auth:** NextAuth.js (Email/Password)
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

---

## Architecture

### Project Structure

```
builddeck/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (main)/              # Public pages (home, products, categories)
│   ├── dashboard/           # User dashboard
│   ├── admin/               # Admin panel
│   └── api/                 # API Routes
│       ├── auth/[...nextauth]/  # NextAuth endpoints
│       └── uploads/         # File upload endpoint
│
├── actions/                 # Server Actions (mutations)
│   ├── auth.ts             # Login, signup, logout
│   ├── products.ts         # CRUD products
│   └── newsletter.ts       # Newsletter subscription
│
├── lib/                     # Core utilities
│   ├── db/
│   │   ├── prisma.ts       # Prisma client singleton
│   │   └── queries/        # Database queries (read operations)
│   │       ├── products.ts
│   │       ├── categories.ts
│   │       └── users.ts
│   ├── auth/
│   │   ├── config.ts       # NextAuth configuration
│   │   └── utils.ts        # Auth helpers (getSession, requireAuth)
│   ├── email/
│   │   └── resend.ts       # Email sending
│   └── validations.ts      # Zod schemas
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data (categories)
│   └── dev.db              # SQLite database file
│
├── components/             # React components
├── types/                  # TypeScript types
└── middleware.ts           # Auth middleware (protect routes)
```

### Key Patterns

#### 1. Data Access Layer

```
Server Actions (mutations) → lib/db/prisma.ts
Server Components (reads) → lib/db/queries/*.ts
```

#### 2. Auth Flow

```
NextAuth.js handles:
├── Email/Password login
├── Session management (JWT)
├── Password hashing (bcrypt)
└── CSRF protection
```

#### 3. Request Flow

```
Request → Middleware (auth check) → Page/API → Prisma → SQLite
```

#### 4. File Structure Philosophy

- `actions/` = Write operations (create, update, delete)
- `lib/db/queries/` = Read operations (fetching data)
- `app/api/` = Only for webhooks & file uploads
- Everything else uses Server Actions

### Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  username      String?   @unique
  password      String    # Hashed with bcrypt
  role          Role      @default(USER)
  avatarUrl     String?
  bio           String?
  website       String?
  twitter       String?
  products      Product[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Product {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  tagline       String
  description   String?
  websiteUrl    String
  logoUrl       String?
  screenshots   String[]
  status        ProductStatus @default(PENDING)
  featured      Boolean       @default(false)
  viewCount     Int           @default(0)
  user          User          @relation(...)
  category      Category?     @relation(...)
  submissions   Submission[]
  createdAt     DateTime      @default(now())
}

model Category {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  description   String?
  icon          String?
  color         String?
  products      Product[]
}

model NewsletterSubscriber {
  id            String    @id @default(cuid())
  email         String    @unique
  confirmed     Boolean   @default(false)
  createdAt     DateTime  @default(now())
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Resend account (for emails, optional for dev)

### 1. Clone and Install

```bash
cd builddeck
npm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma db push

# Seed initial data (categories)
npx prisma db seed
```

### 3. Configure Environment

Create `.env.local`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Resend (optional for dev)
RESEND_API_KEY="re_your_key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. View Database (Prisma Studio)

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555) - visual database browser like Supabase dashboard.

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI
npx prisma db push   # Sync schema to database
npx prisma db seed   # Seed initial data
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Note: For SQLite on Vercel, the database resets on each deploy. For production, migrate to:

- **Turso** (SQLite edge) - Free tier
- **PlanetScale** (MySQL) - Free tier
- **Neon** (PostgreSQL) - Free tier

---

## Why This Stack?

| Technology             | Why                                                                  |
| ---------------------- | -------------------------------------------------------------------- |
| **SQLite + Prisma**    | Zero cost, no external deps, production-ready (WhatsApp uses SQLite) |
| **NextAuth.js**        | Industry standard auth, handles security automatically               |
| **Server Actions**     | Type-safe mutations, no API boilerplate                              |
| **Next.js full-stack** | Single deployment, shared types, used by Vercel, Netflix, TikTok     |

**Companies using this stack:** Cal.com, Dub.co, Documenso, thousands of startups.

---

## License

MIT

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
