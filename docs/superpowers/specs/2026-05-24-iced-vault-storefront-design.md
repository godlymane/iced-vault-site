# Iced Vault Storefront Design

## Goal

Build a premium, mobile-first jewelry storefront for Iced Vault that matches the requested dark luxury direction: black base, icy white-blue highlights, glassmorphism where useful, product photography up front, GRA certification visibility, and social links for `@shopicedvault`.

## Experience

The first screen presents the brand name, a concise luxury tagline, a high-impact jewelry image, quick social proof, and immediate paths into shopping and the cart. The shop section includes filters, product cards, GRA Certified badges, stock visibility, quick product detail views, and add-to-cart actions. The cart appears as a glass drawer with quantity controls and a checkout-style summary. A lightweight admin drawer lets the owner adjust stock and price in the browser, persisted with localStorage.

## Visual Direction

Use a black and charcoal foundation with platinum text, icy blue accents, chrome-like borders, and subtle glass surfaces. Keep the design minimal and premium, with restrained animation, jewelry imagery, strong spacing, and streetwear-luxury copy. Avoid loud gradients and keep glassmorphism purposeful: sticky navigation, drawers, badges, and selected overlays.

## Architecture

Use Vite, React, TypeScript, and CSS. Keep product seed data in `src/data.ts`, deterministic cart/inventory utilities in `src/store.ts`, and the UI in `src/App.tsx`. Tests cover the behavior-heavy cart and inventory helpers with Vitest.

## Requirements

- Homepage with Iced Vault logo/brand signal, tagline, luxury hero, GRA badge, and shop call to action.
- Shop listings with mobile-friendly product cards, product images, filters, prices, categories, stock, and certification.
- About section that positions Iced Vault as premium moissanite with a streetwear edge.
- Contact/social links for Instagram and TikTok using `@shopicedvault`.
- Cart drawer with add, remove, quantity, subtotal, reserve-style checkout summary, and stock limits.
- Admin/inventory drawer with editable price and stock values persisted locally.
- Responsive design for mobile buyers.
- Browser-verifiable build with no TypeScript errors.
