# Iced Vault Special Experiences Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add high-memorability luxury experiences: vault unlock, 3D inspect, certificate viewer, VIP countdown, concierge overlay, and product theater.

**Architecture:** Preserve the existing storefront and cart. Add tested vault helper utilities, extend product metadata with certificate specs, render an unframed Three.js hero object, and layer modal/drawer experiences over the current product flow.

**Tech Stack:** Vite, React, TypeScript, CSS, Three.js, lucide-react, Vitest, Chrome automation.

---

### Task 1: Experience Helpers And Metadata

**Files:**
- Create: `src/vaultExperience.ts`
- Create: `src/vaultExperience.test.ts`
- Modify: `src/store.ts`
- Modify: `src/data.ts`

- [x] Add tests for certificate code formatting, countdown math, and concierge prompts.
- [x] Implement vault experience helpers.
- [x] Extend product metadata with certificate IDs, dates, carat, cut, and clarity.

### Task 2: Special UI Layers

**Files:**
- Create: `src/VaultGemCanvas.tsx`
- Modify: `src/App.tsx`
- Modify: `src/style.css`

- [x] Add vault unlock intro.
- [x] Add unframed Three.js diamond/chain canvas in unlock and hero.
- [x] Add VIP drop countdown.
- [x] Add GRA certificate viewer modal.
- [x] Add vault concierge drawer.
- [x] Upgrade product quick view into a product theater.

### Task 3: Verification

**Files:**
- Verify all source files.

- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Verify unlock, 3D canvas pixels, countdown, certificate viewer, concierge prompt, product theater, desktop/mobile layout, images, console, and mobile overflow in Chrome automation.
