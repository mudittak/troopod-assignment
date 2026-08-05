# Purelane — Shopify Homepage Build

A production Shopify Dawn theme implementation of the Purelane homepage
prototype, built as five merchant-editable sections rather than a static
HTML reproduction.

## Live sections

| Section | File | Purpose |
|---|---|---|
| Hero | `sections/purelane-hero.liquid` | Rotating product spotlight, CTAs, trust badges |
| Shop grid | `sections/purelane-shop.liquid` | Product grid pulled from a merchant-selected collection |
| Best-selling combos | `sections/purelane-combos.liquid` | Multi-product bundles with live savings math |
| Bundles | `sections/purelane-bundles.liquid` | Tiered "build your box" pricing cards |
| Reviews rail | `sections/purelane-reviews.liquid` | Auto-scrolling, pausable, accessible testimonial marquee |

Shared reusable snippet: `snippets/purelane-product-card.liquid`
Shared styles/behaviour: `assets/purelane-sections.css`, `assets/purelane-sections.js`

## Design decisions

- **Real Shopify data, not hardcoded content.** The prototype encoded every
  product name, price and image as inline SVG data URIs. Every section here
  is rebuilt around native Shopify objects — `product`, `collection`,
  `block.settings.product` — so prices, images, and availability always
  reflect the store's actual catalog.
- **Merchant-editable via blocks.** Hero slides, combo bundles, bundle
  tiers, and reviews are all section blocks, so a marketing team can add,
  remove, or reorder them from the theme editor without touching code.
- **Computed, not typed-in, pricing.** Combo and bundle "savings" figures
  are calculated live from each product's compare-at price, so they can't
  drift out of sync with the catalog.
- **Edge cases handled by design.** The shared product card correctly
  renders a sold-out product (disabled button + pill), a product with no
  image (placeholder, no broken layout), and a long title (clamped to two
  lines without breaking the grid).
- **Scope.** The prototype's full-page scroll-driven background, cinematic
  water/bubble layer, sticky mobile CTA, and side progress rail were
  decorative rather than functional, so they were left out of this pass in
  favor of getting the five required sections production-ready. A
  lightweight CSS-only ambient gradient is included instead, so sections
  don't read as flat.
- **Reviews** are theme-editor blocks rather than a reviews-app integration,
  since Dawn has no native review object — swappable for a reviews app's
  Liquid objects if one is installed.

## Setup

1. Copy `sections/`, `snippets/`, and `assets/` files into a Dawn-based theme.
2. Reference the five sections from `templates/index.json`.
3. In the theme editor: pick a collection for the Shop grid, and select
   products for the Hero slides and Combo blocks.

## Accessibility & performance

- Full keyboard navigation with visible focus states (`:focus-visible`).
- `prefers-reduced-motion` respected throughout (hero rotator, reviews
  marquee, ambient background).
- Lazy-loaded, responsive product images (`image_url` + `widths`).
- No layout shift from missing images or long titles.
