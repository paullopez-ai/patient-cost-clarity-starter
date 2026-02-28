# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun run dev` — Start dev server (Next.js with Turbopack)
- `bun run build` — Production build
- `bun run lint` — ESLint (flat config with Next.js core-web-vitals + TypeScript rules)

## Tech Stack

- **Next.js 16** with App Router and React 19
- **Tailwind CSS v4** (uses `@import "tailwindcss"` syntax, not v3 config files)
- **shadcn/ui** (base-vega style) with Base UI React primitives — configured in `components.json`
- **Hugeicons** for icons (`@hugeicons/core-free-icons` + `@hugeicons/react`) — not Lucide
- **next-themes** for dark/light mode via `ThemeProvider` in layout
- **Framer Motion** for animations
- **bun** as the package manager (uses `bun.lock`)

## Architecture

- `app/` — Next.js App Router pages and layouts. RSC by default; add `"use client"` only when needed.
- `components/ui/` — shadcn/ui primitives (Button, Card, Input, Select, etc.). These are generated/managed by shadcn CLI — edit cautiously.
- `components/` — App-level components (ThemeProvider, ThemeToggle, etc.)
- `lib/utils.ts` — `cn()` helper using `clsx` + `tailwind-merge`

## Styling Conventions

- Tailwind v4 CSS variables defined in `app/globals.css` using oklch color space
- Uses semantic color tokens: `primary`, `secondary`, `muted`, `accent`, `destructive`, `brand`
- Custom `--brand` / `--brand-foreground` tokens for brand accent color
- `--radius: 0` — sharp corners by default
- Fonts: Raleway (`font-sans`), Playfair Display (`font-display`), Geist Mono (`font-mono`)
- Path alias: `@/*` maps to project root

## Icons

Use Hugeicons, not Lucide:
```tsx
import { HomeIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

<HugeiconsIcon icon={HomeIcon} className="h-4 w-4" />
```
