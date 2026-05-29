# Project: GPX Activity Map Editor

## Stack

- React 19, TypeScript, Vite, SASS
- State: Zustand | Data fetching: TanStack Query | Router: React Router v6

## Commands

- Dev: `npm run dev`
- Type check: `npm run typecheck`
- Test: `npm run test`
- Build: `npm run build`

## Conventions

- Components in `src/components/`, pages in `src/pages/`
- Co-locate component tests: `Button.tsx` → `Button.test.tsx`
- Never use `any` — use `unknown` and narrow properly
- Prefer named exports over default exports

## Do not

- Do not bypass TypeScript with `// @ts-ignore`
- Do not use relative paths — use `@/` path alias
- Do not write inline styles — use files in `@/styles/`
