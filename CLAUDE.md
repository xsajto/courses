# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**tukej** is a Duolingo-style touch-typing tutor web app with Czech UI. Users progress through a structured course of 1200 typing lessons organized into sections, units, and lessons. Features include user authentication, XP/progress tracking, and an interactive typing game with real-time accuracy/WPM stats.

## Commands

- `pnpm dev` — Start Next.js dev server
- `pnpm build` — Production build
- `pnpm lint` — ESLint
- `pnpm db:push` — Push Prisma schema to SQLite database
- `pnpm db:seed` — Seed database with courses and test user (test@example.com / password)
- `npx prisma generate` — Regenerate Prisma client (runs automatically on `pnpm install`)
- `tsx scripts/parse-all-zav.ts` — Re-extract lesson content from PDF source files into `resources/raw/all-lessons.json`

## Tech Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **Prisma** with SQLite (`prisma/dev.db`)
- **NextAuth.js v5 beta** (Credentials provider, bcryptjs)
- **Tailwind CSS v4** (using `@theme` directive in `globals.css`, not `tailwind.config`)
- **pnpm** as package manager
- **Resend** for transactional emails (password reset)
- **framer-motion** for page transitions, **lucide-react** for icons

## Architecture

### Data Flow
- **Server Components** (`app/page.tsx`, `app/course/[slug]/page.tsx`, `app/profile/page.tsx`) fetch data via Prisma and pass it as props to Client Components
- **Server Actions** (`app/actions/auth.ts`, `app/actions/progress.ts`) handle mutations (register, forgot/reset password, save lesson progress, update profile)
- **Auth** is split: `auth.config.ts` has route-level authorization logic used by `middleware.ts` (edge-compatible, no DB); `auth.ts` adds the Credentials provider with Prisma/bcrypt

### Course Content Pipeline
PDF source files (`docs/`) → `scripts/parse-all-zav.ts` extracts lessons → `resources/raw/all-lessons.json` → `resources/courses/typing.ts` structures them into sections/units/lessons → `prisma/seed.ts` writes to DB. Lesson `content` and `criteria` are stored as JSON strings in the database and parsed at runtime.

### Route Structure
- `/` — Redirects to the first course
- `/course/[slug]` — Main course view with Duolingo-style journey map + typing game (managed by `CourseClient.tsx` state: `map` ↔ `playing`)
- `/courses` — Course listing
- `/profile` — User stats (XP, level, accuracy) and settings
- `/login`, `/register`, `/forgot-password`, `/reset-password` — Auth pages (public routes)
- `/api/auth/[...nextauth]` — NextAuth route handler

### Lesson Unlocking Logic
In `CourseClient.tsx`: the first lesson is always unlocked; completing a lesson unlocks the next one sequentially across all units/sections. Progress is saved via the `saveLessonProgress` server action and the page reloads to refetch.

### Styling
Custom Duolingo-inspired color palette defined as CSS theme variables (`--color-duo-*`) in `app/globals.css`. Reusable button classes: `.primary-btn`, `.secondary-btn`. Font: Nunito. Layout uses a fixed 240px sidebar (`components/Sidebar.tsx`) with `.main-layout` for content offset.

### Path Alias
`@/*` maps to project root (configured in `tsconfig.json`).
