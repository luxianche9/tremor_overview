# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 dashboard application template built with Tremor components, showcasing data visualization and management interfaces for support, retention, workflow, and agent analytics. The template uses TypeScript, Tailwind CSS, and React 19.

## Development Commands

**Start development server:**
```bash
pnpm run dev
```
Access at http://localhost:3000

**Build for production:**
```bash
pnpm run build
```

**Start production server:**
```bash
pnpm start
```

**Linting:**
```bash
pnpm run lint
```

**Data generation scripts:**
```bash
pnpm run generate:agents      # Generate mock agent data
pnpm run generate:workflow    # Generate mock workflow data
pnpm run generate:support     # Generate mock support tickets
pnpm run generate:retention   # Generate mock retention cohorts
```

These scripts use Faker.js to generate TypeScript files with mock data in `src/data/*/` directories.

## Architecture

### Application Structure

- **Route Groups**: Uses Next.js 15 route groups with `(dashboard)` for main app pages
- **Pages**: Four main dashboard sections accessible via tab navigation:
  - `/support` - Support ticket management and volume tracking
  - `/retention` - User retention cohort analysis
  - `/workflow` - Workflow metrics and analytics
  - `/agents` - Agent performance data table

### Layout Hierarchy

1. **Root Layout** (`src/app/layout.tsx`): Provides theme support (light/dark) via `next-themes` and Geist Sans font
2. **Dashboard Layout** (`src/app/(dashboard)/layout.tsx`): Wraps pages with Navigation component and centered container (max-w-7xl)
3. **Navigation** (`src/components/ui/Navigation.tsx`): Sticky header with logo, tab navigation, notifications, and user profile dropdown

### Data Pattern

Each dashboard section follows a consistent pattern:
- `src/data/{section}/schema.ts` - Zod schemas and TypeScript types
- `src/data/{section}/generator.ts` - Faker.js data generation script
- `src/data/{section}/*.ts` - Generated data files (imported by pages)

### Components

**Tremor Components** (`src/components/`): Custom-built UI primitives (Badge, Button, Card, Chart, Input, Table, etc.) using Radix UI primitives and Tailwind variants

**UI Components** (`src/components/ui/`):
- `Navigation.tsx` - Main app navigation with tabs
- `DataTable` components - TanStack Table implementation with filtering, sorting, pagination
- `TicketDrawer.tsx` - Slide-out panel for detailed views
- `UserProfile.tsx`, `Notifications.tsx` - Header utilities

**Data Tables**: Two implementations in `src/components/ui/data-table/` and `data-table-support/` using TanStack Table with fuzzy search filtering

### Styling

- **Tailwind CSS** with custom animations defined in `tailwind.config.ts`
- **Dark mode**: Class-based via `next-themes` (system default)
- **@tailwindcss/forms** plugin for form styling
- **Utility functions**: `src/lib/utils.ts` contains `cx` (clsx wrapper) and `focusRing` helper

### Key Libraries

- **Charts**: Recharts for data visualization
- **Tables**: TanStack Table v8 with match-sorter for fuzzy filtering
- **Date handling**: date-fns and React Aria datepicker
- **Validation**: Zod schemas
- **Icons**: Remix Icon React

## Configuration Notes

- **TypeScript configs**: Separate configs for app (`tsconfig.json`) and data generation scripts (`tsconfig.scripts.json`)
- **Package manager**: Uses pnpm with React 19 type overrides
- **Next.js config**: Located in `next.config.ts`

## Site Configuration

Global site metadata and URLs are defined in `src/app/siteConfig.ts`.
