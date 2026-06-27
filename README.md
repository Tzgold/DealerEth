# DealerEth

DealerEth is a modern creator-brand collaboration platform built for Ethiopian TikTok creators and local businesses. The product helps creators present themselves professionally, helps brands discover relevant talent, and keeps campaign applications, direct requests, and conversations organized in one workspace.

## Overview

DealerEth brings the early stages of influencer collaboration into a structured, professional workflow. Instead of scattered DMs, unclear briefs, and disconnected profile links, the platform gives both sides a focused dashboard:

- Creators can build a public media-kit style profile, apply to campaigns, manage direct requests, and continue campaign conversations.
- Brands can create a company profile, post campaign briefs, discover creators, review applications, message creators, and track deal progress.

The application is designed around clarity, trust, and fast decision-making for local creator campaigns.

## Key features

### Creator experience

- Creator onboarding and profile setup
- Public creator profile page
- TikTok-style identity fields, avatar support, portfolio links, niche, audience size, and rate range
- Campaign discovery
- Campaign applications with proposed budget and cover letter
- Message threads connected to applications
- Direct brand request inbox
- Creator dashboard with profile readiness, activity, and next-step guidance

### Brand experience

- Brand onboarding and company profile setup
- Campaign posting and campaign management
- Creator discovery with search, niche, follower, portfolio, rate, and profile-quality filters
- Application review with status updates
- Client-side messaging workspace
- Direct creator request tracking
- Dashboard notifications for messages, requests, and pending actions

### Shared platform features

- Role-based authentication for creators and clients
- Public profile routing by username
- Avatar upload and fallback image handling
- Notification read-state behavior
- Responsive dashboard navigation
- Clean editorial-style landing page and dashboard UI

## Tech stack

- Next.js App Router
- React
- TypeScript
- Prisma ORM
- SQLite for local development
- Tailwind CSS
- Zod validation
- JWT-based session cookies

## Project structure

```text
app/                    Application routes and API endpoints
components/             Reusable UI, dashboard, form, profile, and landing components
lib/                    Auth, Prisma, validation, dashboard context, and integration helpers
prisma/                 Database schema and migrations
public/                 Static assets
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-secure-secret"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI=""

TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""
TIKTOK_REDIRECT_URI=""
```

OAuth values are only required when using Google or TikTok sign-in locally.

### 3. Prepare the database

```bash
npx prisma migrate dev
```

### 4. Run the development server

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

## Quality checks

Before shipping changes, run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Deployment

DealerEth can be deployed to any platform that supports Next.js applications. For production, configure:

- A production database connection
- A secure session secret
- OAuth callback URLs that match the deployed domain
- File/image storage strategy if avatar uploads need to persist outside the local filesystem

## Product direction

DealerEth is built to become the operating layer for local creator collaborations: professional creator profiles, reliable campaign briefs, organized communication, and clearer deal progress for both brands and creators.
