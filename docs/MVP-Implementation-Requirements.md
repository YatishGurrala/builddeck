# BuildDeck MVP Implementation Requirements

You are a senior full-stack engineer helping build BuildDeck MVP.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- NextAuth (authentication)
- Prisma ORM
- Supabase (Postgres)
- Resend (email)
- Vitest (testing)

## Goal

Build an MVP web app where users can input a product idea and receive a structured product output.

## Core Features to Implement

### 1. Homepage

- Simple landing page
- Input textarea for "Enter your product idea"
- Submit button: "Generate Build"

### 2. Build Generation API

Create a server action or API route:

POST /api/generate-build

Input:

- idea (string)

Output (mock for now, later AI integration):

- overview
- features (array)
- techStack (array)
- uiPlan
- backendPlan

Store output as JSON

### 3. Authentication

- Implement NextAuth
- Email login (magic link)
- Protect dashboard routes

### 4. Dashboard

Route: /dashboard

Features:

- List of previous builds
- View details
- Save builds in DB

### 5. Database Schema (Prisma)

Models:

User:

- id
- email
- createdAt

Build:

- id
- userId
- idea
- output (JSON)
- createdAt

Lead:

- id
- name
- email
- message
- createdAt

### 6. Service Inquiry CTA

- Add section below generated output:
  "Need help building this?"

- Form fields:
  - name
  - email
  - message

- Store in Lead table

### 7. Email Integration (Resend)

- Send email when:
  - user signs up
  - build is generated
  - lead form submitted

### 8. UI Structure

- Minimal clean UI
- Focus on usability
- Sections:
  - Input
  - Output display
  - CTA

### 9. Testing

- Use Vitest
- Write tests for:
  - API route
  - DB functions

## Implementation Order

1. Setup project structure
2. Setup Prisma + Supabase
3. Setup NextAuth
4. Build homepage UI
5. Build API route (mock response)
6. Save data to DB
7. Build dashboard
8. Add email integration
9. Add service CTA

## Important Notes

- Keep everything simple and modular
- Use server actions where possible
- Avoid over-engineering
- Focus on MVP delivery
