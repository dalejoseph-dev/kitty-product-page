# 🐱 KittySupps™ Clone — Product Page

A pixel-faithful, front-end-only clone of the [KittySupps™](https://kittysupps.com) product page. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools. Includes a fully interactive cart drawer, a multi-step checkout overlay, and a Stripe.js payment integration scaffold.

---

## 📸 Overview

This project replicates a modern DTC (direct-to-consumer) e-commerce product page for a cat supplement brand. It covers the full purchase flow from product discovery through payment:

**Announcement bar → Navigation → Product gallery → Bundle picker → Cart drawer → Checkout with Stripe**

---

## ✨ Features

| Feature | Description |
|---|---|
| **Image Gallery** | 5-image carousel with thumbnail strip, prev/next arrows, and active-state highlighting |
| **Bundle Selector** | Three purchasable bundles (1, 2, or 3 tubs) with per-unit pricing and discount badges |
| **Accordion Sections** | Expandable product detail blocks (Ingredients, How to Use, etc.) with animated arrows |
| **FAQ Section** | Independently toggleable Q&A items |
| **Cart Drawer** | Slide-in drawer with item list, quantity stepper, and urgency countdown timer |
| **Checkout Overlay** | Full-page overlay with contact info, Stripe card fields, and order summary |
| **Stripe.js Integration** | Card number, expiry, and CVC mounted as isolated Stripe Elements; falls back to plain inputs in demo mode |
| **Countdown Timer** | 4-minute 57-second urgency timer that starts when the cart is opened |
| **Sticky ATC Bar** | Fixed add-to-cart bar that appears on scroll |
| **Responsive Layout** | Mobile-friendly grid and flex layouts throughout |

---

## 🗂️ Project Structure

```
kittysupps-clone/
├── index.html    # Full page markup — nav, product section, cart drawer, checkout overlay
├── style.css     # All styles — layout, components, overlays, responsive rules
└── script.js     # All interactivity — gallery, bundles, cart, checkout, Stripe, timer
```

---

## 🚀 Getting Started

No installation required.

1. Clone or download the repository.
2. Open `index.html` in any modern browser.

```bash
git clone https://github.com/your-username/kittysupps-clone.git
cd kittysupps-clone
open index.html
```

The page runs in **demo mode** by default — the Stripe fields are replaced with plain HTML inputs and the "Pay now" button simulates a successful payment after a short delay.

---

## 💳 Enabling Real Stripe Payments

The checkout is wired to [Stripe.js](https://stripe.com/docs/js) and is ready to connect to a backend. To activate it:

### 1. Add your Publishable Key

In `script.js`, replace the placeholder key:

```js
// script.js
const STRIPE_PK = "pk_test_YOUR_KEY_HERE";
```

Get your key from the [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys).

### 2. Connect a Backend

After the user clicks **Pay now**, `handlePayNow()` creates a Stripe `PaymentMethod` and then needs to send it to your server. Uncomment and adapt the backend call block inside `handlePayNow()`:

```js
// Send paymentMethod.id to your backend
const res = await fetch('/api/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentMethodId: paymentMethod.id,
    amount: 7598,       // in cents — $75.98
    currency: 'usd',
    email
  })
});
const { clientSecret } = await res.json();

// Confirm the charge
await stripe.confirmCardPayment(clientSecret);
```

Your backend endpoint should create a `PaymentIntent` using the [Stripe SDK](https://stripe.com/docs/api/payment_intents/create) and return the `client_secret`.

### 3. Stripe Elements Behavior

| Condition | Behavior |
|---|---|
| `STRIPE_PK` contains `"REPLACE"` | Falls back to plain HTML inputs (demo mode) |
| `window.Stripe` is not loaded | Falls back to plain HTML inputs |
| Valid key + Stripe.js loaded | Mounts real isolated card fields |

---

## 🧩 JavaScript Reference

### Gallery

| Function | Description |
|---|---|
| `setImg(index)` | Sets the main image and highlights the matching thumbnail |
| `prevImg()` | Navigates to the previous image (wraps around) |
| `nextImg()` | Navigates to the next image (wraps around) |

### UI Components

| Function | Description |
|---|---|
| `selectBundle(el)` | Marks the clicked bundle option as selected, deselects others |
| `toggleAcc(hdr)` | Toggles an accordion section open/closed |
| `toggleFaq(q)` | Toggles a FAQ answer open/closed |
| `changeQty(btn, delta)` | Increments or decrements a quantity stepper (minimum 1) |

### Cart & Checkout

| Function | Description |
|---|---|
| `openCart()` | Opens the cart drawer and starts the countdown timer |
| `closeCart()` | Closes the cart drawer |
| `openCheckout()` | Closes cart, opens the checkout overlay, and initializes Stripe after 300ms |
| `closeCheckout()` | Closes the checkout overlay |

### Stripe

| Function | Description |
|---|---|
| `initStripe()` | Mounts Stripe Elements (card number, expiry, CVC); runs once |
| `useFallbackInputs()` | Replaces Stripe mounts with plain inputs for demo mode |
| `handlePayNow()` | Validates form, creates a PaymentMethod via Stripe, and handles success/error states |

### Timer

| Function | Description |
|---|---|
| `startCountdown()` | Starts (or resets) the 4:57 urgency countdown displayed in the cart drawer |

---

## 🌐 External Dependencies

| Resource | Purpose |
|---|---|
| [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter) | UI typography |
| [Stripe.js](https://js.stripe.com/v3/) | Secure card field rendering and PaymentMethod creation |

> Stripe.js is loaded via `<script src="https://js.stripe.com/v3/">` in `index.html`. It is **required** for real payments but the page degrades gracefully without it.

---

## ⚠️ Important Notes

- **This is a clone for educational/portfolio purposes.** Do not use it to sell products without replacing all brand assets and copy.
- The Stripe publishable key in `script.js` is a **test key** and cannot process real charges.
- All product images are loaded directly from `kittysupps.com` CDN URLs. Replace them with self-hosted assets for any production use.
- Pricing displayed in the checkout summary (`$75.98`) is hardcoded in the HTML. Wire it dynamically to whichever bundle the user has selected before going live.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).