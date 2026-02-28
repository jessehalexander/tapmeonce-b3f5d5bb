# AGENTS.md

## Cursor Cloud specific instructions

This is a **TapMeOnce** landing page — a static frontend-only React SPA (Vite + TypeScript + Tailwind CSS + shadcn/ui). No backend, database, or external services are needed.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 8080) |
| Lint | `npm run lint` |
| Test | `npm run test` |
| Build | `npm run build` |

### Notes

- The dev server listens on `::` (all interfaces), port **8080**, configured in `vite.config.ts`.
- Both `package-lock.json` (npm) and `bun.lockb` (bun) lockfiles exist; use **npm** per the README.
- ESLint has 4 pre-existing errors and 7 warnings in the generated shadcn/ui components and `tailwind.config.ts`. These are from the Lovable.dev code generator — not regressions.
- The test suite is a single placeholder test (`expect(true).toBe(true)`) via Vitest with jsdom.
- No secrets, `.env` files, or external API integrations are required.
