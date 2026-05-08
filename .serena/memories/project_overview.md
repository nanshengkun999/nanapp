# Project Overview

- Purpose: mobile-first Store Discovery App named Tanmap, originally exported from a Figma Make project. It helps users discover stores/services by category, view details, save/share stores, open a placeholder map view, browse services/forum/more/settings pages.
- Main domain concepts: `Store`, `Category`, `stores`, `categories`, tags, saved stores, service categories, forum posts, language translations.
- Product shape: TikTok-style mobile discovery home screen with full-screen imagery, vertical swipe between stores, horizontal swipe between categories, bottom dock navigation, search overlay, favorites sheet, and booking modal for medical beauty category.
- Current data layer: static in-memory TypeScript data in `src/app/data/stores.ts`; no backend API, persistence only for language via `localStorage`. Home page saved stores are local component state only.
- Routing: `src/app/routes.tsx` uses `createBrowserRouter` from `react-router` with routes `/`, `/map`, `/store/:id`, `/saved`, `/services`, `/forum`, `/settings`, `/more`, and placeholder `/orders`.
- App shell: `src/app/App.tsx` wraps routes with `LanguageProvider` and global `Toaster`.
- Build health: `npm run build` completed successfully on 2026-05-08, with a Vite warning that the main JS chunk is larger than 500 kB after minification.