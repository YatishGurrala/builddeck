# BuildDeck Production Deploy Checklist

This checklist is for the current first-release scope:
- Landing page
- Waitlist form
- About page
- Admin waitlist leads view

## 1) Environment Variables

Set these in production:

- DATABASE_URL
- NEXTAUTH_SECRET
- NEXT_PUBLIC_APP_URL
- EMAIL_SERVER_HOST
- EMAIL_SERVER_PORT
- EMAIL_SERVER_SECURE
- EMAIL_SERVER_USER
- EMAIL_SERVER_PASSWORD
- EMAIL_FROM

Optional (only if used in your environment):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- HOSTINGER_API_TOKEN
- HOSTINGER_REACH_PROFILE_UUID
- HOSTINGER_REACH_WELCOME_MANAGED

## 2) Database

Run once during deploy:

```bash
npm run db:push
```

## 3) Build and Start

```bash
npm run build
npm run start
```

## 4) Smoke Test URLs

- /
- /about
- /api/waitlist
- /dashboard/waitlist (admin account)

## 5) Post-Deploy Checks

- Submit a new waitlist email and confirm it is stored.
- Submit the same email and confirm duplicate response message.
- Confirm admin can view leads table.
- Confirm header "Join Waitlist" scrolls to the waitlist email form.
- Confirm light/dark mode toggle works on home and login pages.

## 6) Local Dev Stability Note

When running locally, avoid deleting `.next` while `next dev` is running.
If dev gets corrupted:
1. Stop all `next dev` processes.
2. Delete `.next`.
3. Start `npm run dev -- --port 3002` once.
