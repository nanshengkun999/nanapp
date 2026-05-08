# Code Style And Conventions

- Language/framework: TypeScript + React 18 + Vite 6, ESM modules.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`; global app styling in `src/styles/*`. Project-specific classes use `tan-*` prefixes such as `tan-mobile-frame`, `tan-soft-page`, `tan-card`, `tan-glass`, `tan-pressable`, and `tan-bottom-dock`.
- UI components: many shadcn/Radix-style components live under `src/app/components/ui`; use local components and utilities before introducing new UI primitives.
- Icons/animation: uses `lucide-react` for icons and `motion` for animations.
- Routing: imports from `react-router`; pages use `useNavigate`, `useParams`, and `useSearchParams`.
- Data: static typed objects in `src/app/data/stores.ts`. `Category` currently equals `'美食' | '医美' | '夜生活'`; `Store` includes id/name/category/tags/address/distance/hours/description/images/videoUrl/lat/lng/saved.
- i18n: `src/app/contexts/LanguageContext.tsx` supports `'中文'`, `'한국어'`, and `'English'`. `t(key)` falls back to the key when missing.
- File organization: pages in `src/app/pages`, shared feature components in `src/app/components`, context providers in `src/app/contexts`, app data in `src/app/data`, styles in `src/styles`.
- Comments: existing code is mostly self-documenting with few comments; keep comments technical and concise when needed.