# Ramiro Morales — Website

A fast, self-contained photography site: animated portfolio, services, and a fine-art **print store with real Stripe checkout**. No monthly platform fee — host it free on Netlify.

## What's inside

```
index.html        Home
portfolio.html    Animated portfolio (pinned zoom + reveal galleries)
services.html     Services & pricing
shop.html         Print store (22 prints, category filter, cart + checkout)
about.html        About + contact form (emails you via Netlify Forms)
success.html      Post-checkout thank-you
thanks.html       Post-contact-form thank-you
assets/css/       style.css  — all styling
assets/js/        data.js    — EDIT images, prints, prices & services here
                  main.js    — animations, nav, galleries
                  shop.js    — cart, filters, checkout
netlify/functions/create-checkout.js   — Stripe checkout (server-side)
netlify.toml / package.json
```

## 1. Preview locally
Open `index.html` in a browser. Everything works except live Stripe checkout and the Netlify contact form (both need to be deployed on Netlify — see below). Until Stripe is connected, the Checkout button falls back to emailing you the order.

## 2. Edit your content — `assets/js/data.js`
- **Prints:** the `PRINT_ITEMS` list — `[id, title, badge, imageSegment]`. Add/remove/reorder freely. `badge` also drives the category filter (Skyline / Cityscape / Aerial / Street / Portrait).
- **Print prices & sizes:** `PRINT_SIZES` — one line controls pricing for every print. Currently `12×18 $45 · 18×24 $85 · 24×36 $150`.
  - ⚠️ Your current Squarespace shop sells these at ~$79.99–$99.99. The new pricing is lower (the "accessible / volume" tier you picked) — bump `PRINT_SIZES` anytime if you'd rather keep premium pricing.
  - After changing prices, update `ALLOWED_PRICES` in `netlify/functions/create-checkout.js` to match (security guard).
- **Services:** the `SERVICES` array.
- **Images:** they load from your existing Squarespace CDN, so nothing breaks today. For a permanent home, replace the URL segments here (and hero `<img src>` in each page) with your own hosted, web-sized JPGs (~2000px long edge) exported from your Google Drive originals.

## 3. Connect payments (Stripe) — you do this part
1. Create a free account at **stripe.com**.
2. Copy your **Secret key** (`sk_live_…`, or `sk_test_…` while testing) from Stripe → Developers → API keys.
3. When you deploy, add it as an environment variable named **`STRIPE_SECRET_KEY`**. It lives only on the server — never in the website or browser.

Stripe hosts the payment page and handles cards, Apple Pay, receipts, and tax.

## 4. Contact form → your inbox (automatic)
The form uses **Netlify Forms** — zero code. Once deployed on Netlify:
1. Submit the form once yourself so Netlify registers it.
2. In Netlify: **Forms → contact → Settings & notifications → Add notification → Email** → your address.
Done — every inquiry now emails you. (Locally / before deploy the form won't send; the page also offers a direct "Email directly" link as backup.)

## 5. Deploy free on Netlify
1. Put this folder in a GitHub repo (or drag-and-drop the folder into Netlify).
2. Netlify → **Add new site → Import** (auto-detects `netlify.toml`).
3. **Site settings → Environment variables →** add `STRIPE_SECRET_KEY`.
4. **Domain settings →** point `ramiromorales.com` at the site.

See **launch-guide.html** for a friendlier click-by-click walkthrough.

## Notes
- Fully responsive, keyboard-friendly, respects reduced-motion.
- No backend to maintain beyond the one checkout function.
- Prefer no serverless function? The store can use **Stripe Payment Links** (one hosted link per print) instead — ask and I'll wire it that way.
