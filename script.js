// Gallery
const imgs = [
  "https://kittysupps.com/cdn/shop/files/1_cb7ff21b-1c25-4553-b6f1-aa54d3fa7799.png?v=1759582863&width=1946",
  "https://kittysupps.com/cdn/shop/files/2_f6472a3e-9740-4a7d-ad97-f68711c595db.png?v=1759582863&width=1946",
  "https://kittysupps.com/cdn/shop/files/3_ddb64aed-e068-4da8-812d-9ccc662270eb.png?v=1759582863&width=1946",
  "https://kittysupps.com/cdn/shop/files/4_a2f7b9ea-8200-4dfe-a877-7afbf4003f99.png?v=1759582863&width=1946",
  "https://kittysupps.com/cdn/shop/files/5_586f3ccb-b88d-47fa-9970-ca5216b361e9.png?v=1759582863&width=1946",
];
let cur = 0;
function setImg(i, el) {
  cur = i;
  document.getElementById("mainImg").src = imgs[i];
  document
    .querySelectorAll(".thumb")
    .forEach((t, idx) => t.classList.toggle("active", idx === i));
}
function prevImg() {
  setImg((cur - 1 + imgs.length) % imgs.length, null);
}
function nextImg() {
  setImg((cur + 1) % imgs.length, null);
}

// Bundle select
function selectBundle(el) {
  document
    .querySelectorAll(".bundle-option")
    .forEach((b) => b.classList.remove("selected"));
  el.classList.add("selected");
}

// Accordion
function toggleAcc(hdr) {
  const body = hdr.nextElementSibling;
  const arrow = hdr.querySelector(".acc-arrow");
  const open = body.classList.toggle("open");
  arrow.style.transform = open ? "rotate(90deg)" : "";
}

// FAQ
function toggleFaq(q) {
  const a = q.nextElementSibling;
  const arrow = q.querySelector(".faq-arrow");
  const open = a.classList.toggle("open");
  arrow.style.transform = open ? "rotate(90deg)" : "";
}

// STRIPE.js

// ══════════════════════════════════════════════════════
//  STRIPE SETUP
//  Replace STRIPE_PK with your real publishable key from
//  https://dashboard.stripe.com/apikeys
// ══════════════════════════════════════════════════════
const STRIPE_PK =
  "pk_test_51TGCFMRzUl6Ijd0Zsq7xF8wS7HUO4oFTepNDw1FP5jIORTp2xMUj8qofWKBzUwod2orhJvUr264edkZmpma2glvZ00BUCG09HJ";

let stripe, elements, cardNumber, cardExpiry, cardCvc;
let stripeReady = false;

function initStripe() {
  if (stripeReady) return;
  if (!window.Stripe) {
    useFallbackInputs();
    return;
  }

  if (STRIPE_PK.includes("REPLACE")) {
    // Demo mode — use plain HTML inputs
    useFallbackInputs();
    return;
  }

  stripe = Stripe(STRIPE_PK);
  elements = stripe.elements({ locale: "en" });

  const baseStyle = {
    base: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: "14px",
      color: "#1a1a1a",
      fontWeight: "400",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#e53935", iconColor: "#e53935" },
  };

  cardNumber = elements.create("cardNumber", {
    style: baseStyle,
    showIcon: true,
  });
  cardExpiry = elements.create("cardExpiry", { style: baseStyle });
  cardCvc = elements.create("cardCvc", { style: baseStyle });

  cardNumber.mount("#stripe-card-number");
  cardExpiry.mount("#stripe-card-expiry");
  cardCvc.mount("#stripe-card-cvc");

  stripeReady = true;
}

function useFallbackInputs() {
  // Demo: show styled plain inputs instead of Stripe Elements
  document.getElementById("stripe-card-number").innerHTML =
    '<input style="width:100%;border:none;outline:none;font-size:14px;font-family:inherit;color:#333" placeholder="Card number  1234 1234 1234 1234" id="demoCardNum">';
  document.getElementById("stripe-card-expiry").innerHTML =
    '<input style="width:100%;border:none;outline:none;font-size:14px;font-family:inherit;color:#333" placeholder="MM / YY">';
  document.getElementById("stripe-card-cvc").innerHTML =
    '<input style="width:100%;border:none;outline:none;font-size:14px;font-family:inherit;color:#333" placeholder="CVV">';
  stripeReady = true;
}

async function handlePayNow() {
  const btn = document.getElementById("payNowBtn");
  const errDiv = document.getElementById("payError");
  const successDiv = document.getElementById("paySuccess");
  errDiv.style.display = "none";

  // Demo / fallback mode
  if (STRIPE_PK.includes("REPLACE") || !stripe) {
    btn.disabled = true;
    btn.textContent = "Processing...";
    await new Promise((r) => setTimeout(r, 1800));
    btn.style.display = "none";
    successDiv.style.display = "block";
    successDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const email = (document.getElementById("coEmail").value || "").trim();
  const name = (document.getElementById("cardName").value || "").trim();

  if (!email) {
    errDiv.textContent = "Please enter your email address.";
    errDiv.style.display = "block";
    document.getElementById("coEmail").focus();
    return;
  }
  if (!name) {
    errDiv.textContent = "Please enter the name on your card.";
    errDiv.style.display = "block";
    document.getElementById("cardName").focus();
    return;
  }

  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    // 1) Create PaymentMethod with Stripe Elements
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: { name, email },
    });

    if (error) {
      errDiv.textContent = error.message;
      errDiv.style.display = "block";
      btn.disabled = false;
      btn.textContent = "Pay now";
      return;
    }

    // 2) Send paymentMethod.id to YOUR backend to create a PaymentIntent
    // ── Example backend call (uncomment and adapt) ──────────────────────
    // const res = await fetch('/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     paymentMethodId: paymentMethod.id,
    //     amount: 7598,     // amount in cents ($75.98)
    //     currency: 'php',
    //     email
    //   })
    // });
    // const { clientSecret, error: beError } = await res.json();
    // if (beError) throw new Error(beError);
    //
    // 3) Confirm the payment
    // const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
    // if (confirmError) throw new Error(confirmError.message);
    // ────────────────────────────────────────────────────────────────────

    // Show success (wire backend above to actually charge)
    btn.style.display = "none";
    successDiv.style.display = "block";
    successDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    errDiv.textContent =
      e.message || "An unexpected error occurred. Please try again.";
    errDiv.style.display = "block";
    btn.disabled = false;
    btn.textContent = "Pay now";
  }
}

// ── Cart ──────────────────────────────────────────────
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  startCountdown();
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Checkout ─────────────────────────────────────────
function openCheckout() {
  closeCart();
  document.getElementById("checkoutOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(initStripe, 300);
}
function closeCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Wire buttons ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-atc, .btn-sticky").forEach((btn) => {
    btn.addEventListener("click", openCart);
  });
  // Nav cart icon
  document.querySelectorAll(".nav-icon").forEach((icon, i) => {
    if (i === 1)
      ((icon.style.cursor = "pointer"),
        icon.addEventListener("click", openCart));
  });
});

// ── Qty stepper ───────────────────────────────────────
function changeQty(btn, delta) {
  const span = btn.parentElement.querySelector("span");
  let val = parseInt(span.textContent) + delta;
  if (val < 1) val = 1;
  span.textContent = val;
}

// ── Countdown timer ───────────────────────────────────
let countSec = 4 * 60 + 57;
let countInterval;
function startCountdown() {
  clearInterval(countInterval);
  countInterval = setInterval(() => {
    if (countSec <= 0) {
      clearInterval(countInterval);
      return;
    }
    countSec--;
    const m = Math.floor(countSec / 60);
    const s = countSec % 60;
    const el = document.getElementById("countdown");
    if (el)
      el.textContent =
        String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }, 1000);
}
