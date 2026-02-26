# Campaign Landing Page Builder

A full-stack campaign landing page builder with drag-and-drop editor, real-time preview, and one-click H5 page publishing.

**Live Demo:** https://campaign-landing-page.vercel.app/

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Campaign    │  │  Drag & Drop │  │   H5 Page     │  │
│  │  Dashboard   │  │  Editor      │  │   Preview     │  │
│  │  (/)         │  │  (/editor)   │  │   (/h5)       │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│         │                │                  │           │
│         └────────────────┼──────────────────┘           │
│                          │                              │
│                    Zustand Store                         │
│                  (Editor State)                          │
└──────────────────────────┬──────────────────────────────┘
                           │
                      REST API
                           │
┌──────────────────────────┴──────────────────────────────┐
│                     Backend (API Routes)                 │
│                                                         │
│  /api/campaigns    CRUD for campaigns                   │
│  /api/pages        CRUD for pages                       │
│  /api/pages/publish One-click publish to H5             │
│  /api/tracking     User behavior tracking               │
│  /api/poster       Poster generation                    │
│  /api/products     Product data                         │
└──────────────────────────┬──────────────────────────────┘
                           │
                     Prisma ORM
                           │
┌──────────────────────────┴──────────────────────────────┐
│                  Turso (Cloud SQLite)                    │
│                                                         │
│  Campaign  ──1:N──  Page  ──1:N──  TrackingEvent        │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| Drag & Drop | @dnd-kit |
| ORM | Prisma 7 |
| Database | Turso (libSQL, cloud SQLite) |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Campaign dashboard
│   ├── editor/[campaignId]/     # Drag-and-drop page editor
│   ├── preview/[pageId]/        # Page preview (SSR)
│   ├── h5/[pageId]/             # Published H5 page (public)
│   └── api/
│       ├── campaigns/           # Campaign CRUD
│       ├── pages/               # Page CRUD + publish
│       ├── tracking/            # Event tracking
│       ├── poster/              # Poster generation
│       └── products/            # Product data
├── components/
│   ├── editor/                  # Editor UI components
│   │   ├── EditorCanvas.tsx     # Main canvas with drag-and-drop
│   │   ├── ComponentPanel.tsx   # Component palette
│   │   ├── PropertyPanel.tsx    # Property editor sidebar
│   │   └── Toolbar.tsx          # Editor toolbar
│   └── h5/                      # H5 renderers (17 component types)
│       ├── PageRenderer.tsx     # Page layout renderer
│       └── components/          # Banner, Button, Countdown, etc.
├── store/                       # Zustand editor store
├── types/                       # TypeScript type definitions
├── lib/                         # Database client & utilities
└── mock/                        # Templates & product mock data
```

## Available Components

The editor supports 17 drag-and-drop component types:

Banner, Button, ContactBar, Countdown, Coupon, Divider, FlashDeal, ImageBlock, NavBar, PriceTable, ProductCard, ProductGrid, ProductList, PromoSection, RechargeCard, Spacer, TextBlock

## Getting Started

### Prerequisites

- Node.js 18+
- A [Turso](https://turso.tech) account (free tier)

### Setup

```bash
# Install dependencies
npm install

# Set up Turso database
brew install tursodatabase/tap/turso
turso auth login
turso db create campaign-landing-page

# Get credentials and add to .env
turso db show campaign-landing-page --url
turso db tokens create campaign-landing-page
```

Create a `.env` file:

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

```bash
# Push database schema
turso db shell campaign-landing-page < prisma/migrations/20260220100437_init/migration.sql

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

Open http://localhost:3000 to see the app.

## Deploy

Deploy to Vercel and set environment variables `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the project settings.

## License

MIT
