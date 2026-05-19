# Product Requirements Document (PRD)

- Product Name: BuildDeck
- Version: v1 (MVP)
- Date: 2026

## 1. Vision

BuildDeck is a platform for founders to build, launch, and grow products faster using AI-powered tools.

The platform focuses on reducing friction in early-stage product development by providing structured outputs, tools, and optional done-for-you services.

## 2. Target Audience

Primary:

- Non-technical founders
- Early-stage startup builders

Secondary:

- Indie hackers
- Developers building side projects

Tertiary:

- Small businesses needing automation

## 3. Core Value Proposition

"Turn your idea into a structured product in minutes."

Users can:

- Input an idea
- Get product structure (PRD, tech stack, UI plan)
- Optionally build faster using tools or services

## 4. MVP Scope (v1)

### 4.1 Core Feature: MVP Builder Tool

Input:

- Product idea (text input)

Output:

- Product overview
- Feature list
- Tech stack recommendation
- Basic UI/UX structure
- API/backend structure (high-level)

### 4.2 Authentication

- Email-based login (NextAuth)
- Magic link or OAuth (Google optional)

### 4.3 Dashboard

- View past generated builds
- Save/edit outputs
- Re-run generation

### 4.4 Email Flow

- Welcome email
- Build generation confirmation
- Optional follow-up email

(Using Resend)

### 4.5 Soft Service CTA

- "Need help building this?"
- Leads to contact form
- Stored in database

## 5. Future Features (Post-MVP)

- Code generation (partial/full)
- Chat widget tool
- Email automation setup tool
- Landing page generator
- Builder showcase / discovery platform

## 6. Tech Stack

Frontend:

- Next.js (App Router)
- React
- TypeScript

Backend:

- Next.js Server Actions
- API routes

Auth:

- NextAuth

Database:

- Supabase (Postgres)
- Prisma ORM

Email:

- Resend

Testing:

- Vitest

Styling:

- PostCSS + global CSS

## 7. Data Models

### User

- id
- email
- createdAt

### Build

- id
- userId
- idea
- output (JSON)
- createdAt

### Lead (Service Inquiry)

- id
- name
- email
- message
- createdAt

## 8. User Flow

1. User lands on homepage
2. Inputs idea
3. Generates build output
4. Saves to dashboard
5. Sees CTA: "Need help building this?"
6. Optional: submits service inquiry

## 9. Success Metrics

- # of builds generated
- user signups
- conversion to service inquiries
- repeat usage

## 10. Non-Goals (for v1)

- Full code generation
- Complex project management tools
- Marketplace features

## 11. Positioning

BuildDeck is NOT:

- a dev agency
- a no-code builder

BuildDeck IS:

- a product-building assistant for founders
