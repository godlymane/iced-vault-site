# Iced Vault Luxury Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained luxury motion layer that makes the storefront feel more premium without becoming flashy.

**Architecture:** Keep the commerce UI intact. Add a small tested motion capability helper, then wire React effects for scroll reveals and desktop cursor behavior. Use CSS for light sweeps, hover material effects, sparkle accents, and reduced-motion fallbacks.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, Chrome automation.

---

### Task 1: Motion Capability

**Files:**
- Create: `src/motion.ts`
- Create: `src/motion.test.ts`

- [x] Add tests for desktop, mobile, and reduced-motion profiles.
- [x] Implement `getMotionProfile`.

### Task 2: Luxury Interaction Layer

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/style.css`

- [x] Add desktop-only custom icy cursor with hover labels.
- [x] Add scroll reveal observer for major sections and product cards.
- [x] Add shimmer, light sweep, sparkle, modal rise, and floating vault-card effects.
- [x] Add reduced-motion fallbacks and mobile-safe behavior.

### Task 3: Verification

**Files:**
- Verify all source files.

- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run Chrome automation for cursor, reveal, image, console, and mobile overflow checks.
