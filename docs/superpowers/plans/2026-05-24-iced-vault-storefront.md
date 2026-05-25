# Iced Vault Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished React storefront for Iced Vault with shop listings, cart, local inventory management, and premium responsive styling.

**Architecture:** Product seed data lives in one module, cart and inventory behavior lives in pure utility functions, and the React app owns interaction state plus localStorage persistence. The UI is a single-page store with anchored sections and drawer overlays for cart, product detail, and admin.

**Tech Stack:** Vite, React, TypeScript, CSS, lucide-react, Vitest, Testing Library.

---

### Task 1: App Foundation

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `vite.config.ts`
- Replace: `index.html`
- Replace: `src/main.tsx`
- Replace: `src/style.css`

- [x] Configure React, JSX, test scripts, and Vite React plugin.
- [x] Replace the vanilla starter with a React root.
- [x] Add global CSS variables, responsive layout rules, and luxury base styling.

### Task 2: Product And Store Logic

**Files:**
- Create: `src/data.ts`
- Create: `src/store.ts`
- Create: `src/store.test.ts`
- Create: `src/setupTests.ts`

- [x] Define product, cart item, and filter types.
- [x] Add seed products with GRA certification metadata, stock, prices, categories, and jewelry imagery.
- [x] Write cart tests before implementation for add, stock clamping, quantity updates, totals, filtering, and inventory updates.
- [x] Implement pure functions for cart and inventory behavior.

### Task 3: Storefront UI

**Files:**
- Create: `src/App.tsx`
- Replace: `src/style.css`

- [x] Build sticky glass navigation with brand, section links, admin access, and cart count.
- [x] Build hero with brand-forward copy, GRA badge, social links, and jewelry image.
- [x] Build shop filters, product cards, quick view, and add-to-cart controls.
- [x] Build cart drawer with quantity steppers and subtotal.
- [x] Build admin drawer with stock and price editors.
- [x] Build about and contact sections for luxury positioning and `@shopicedvault`.

### Task 4: Verification

**Files:**
- Verify all source files.

- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Start dev server.
- [x] Open the local site in Chrome automation and check desktop/mobile visuals.
