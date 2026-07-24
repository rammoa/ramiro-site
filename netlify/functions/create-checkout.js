/* ============================================================
   Stripe Checkout — serverless function (Netlify / Vercel-compatible)
   Creates a Stripe Checkout Session from the cart and returns { url }.

   SECURITY: prices are validated server-side against ALLOWED_PRICES
   so a tampered cart can't set its own price. Keep your print prices
   in sync here (or better, map product IDs -> prices).

   SETUP:
   1. Create a Stripe account (stripe.com) — you do this yourself.
   2. In Netlify: Site settings -> Environment variables ->
      STRIPE_SECRET_KEY = sk_live_...   (or sk_test_... while testing)
   3. Deploy. Done — Stripe hosts the payment page; your secret key
      never touches the browser.
   ============================================================ */

const Stripe = require('stripe');

// Prices (in whole USD) that the store is allowed to charge.
// Must include every size price you offer in assets/js/data.js (PRINT_SIZES).
const ALLOWED_PRICES = [45, 85, 150];
const MAX_QTY = 25;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Stripe not configured (missing STRIPE_SECRET_KEY).' }) };
  }
  const stripe = Stripe(secret);

  let items;
  try {
    items = JSON.parse(event.body).items;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request body.' }) };
  }
  if (!Array.isArray(items) || !items.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Cart is empty.' }) };
  }

  // Validate + build Stripe line items
  const line_items = [];
  for (const it of items) {
    const price = Math.round(Number(it.price));
    const qty = Math.max(1, Math.min(MAX_QTY, Math.round(Number(it.qty) || 1)));
    if (!ALLOWED_PRICES.includes(price)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid price for ' + (it.title || 'item') + '.' }) };
    }
    line_items.push({
      quantity: qty,
      price_data: {
        currency: 'usd',
        unit_amount: price * 100, // cents
        product_data: {
          name: String(it.title || 'Fine-art print').slice(0, 120),
          images: it.img && /^https:\/\//.test(it.img) ? [it.img] : undefined
        }
      }
    });
  }

  const origin = event.headers.origin || ('https://' + (event.headers.host || ''));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      phone_number_collection: { enabled: true },
      success_url: origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/shop.html'
    });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
