# Iced Vault God Tier Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing Iced Vault storefront from polished to a cinematic luxury drop experience.

**Architecture:** Preserve the existing React/Vite storefront, cart, and inventory utilities. Add small typed product metadata and stock urgency helpers, then upgrade the presentation layer with a featured drop, stronger product cards, trust signals, testimonials, concierge contact, and mobile conversion affordances.

**Tech Stack:** Vite, React, TypeScript, CSS, lucide-react, Vitest, Playwright-driven Chrome verification.

---

### Task 1: Product Metadata And Stock Urgency

**Files:**
- Modify: `src/store.ts`
- Modify: `src/store.test.ts`
- Modify: `src/data.ts`

- [x] Add a failing test for stock status labels.
- [x] Implement `getStockStatus`.
- [x] Add a failing test for merging saved inventory edits into upgraded seed data.
- [x] Implement `mergeSavedProducts`.
- [x] Expand product seed data with drop, finish, and specs metadata.

### Task 2: Cinematic Storefront Upgrade

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/style.css`

- [x] Build a stronger hero with drop code, featured floating vault card, and premium proof chips.
- [x] Add a featured drop section with specs, metrics, and reserve CTA.
- [x] Upgrade product cards with stock urgency badges, quick view affordance, richer metadata, and stronger hover states.
- [x] Add trust, testimonial, and concierge sections.
- [x] Add mobile sticky shop CTA and responsive refinements.

### Task 3: Verification

**Files:**
- Verify all source files.

- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run Chrome automation for desktop/mobile render checks.
- [x] Confirm no console errors, no failed images, no horizontal mobile overflow, cart works, and inventory opens.
