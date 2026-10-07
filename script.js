/* Marrow & Malt: page behavior (vanilla JS)
   Modules: DATA -> helpers -> age gate -> products -> science -> cart -> init */

/* ================= DATA ================= */
// Placeholder nutrition values per 12 oz can. Verify before launch.
const PRODUCTS = [
  { id: 'choc-espresso', name: 'Chocolate Espresso Stout', infusion: 'Vitamin B Complex', price: 18, abv: '5.5%', color: '#6b3a22',
    notes: 'Dark cocoa, cold-brew coffee, a clean roasted finish.',
    benefits: ['Supports steady energy metabolism', 'B6, B12, niacin, and folate in every can'],
    nutrition: { calories: 110, addedSugar: '0 g', carbs: '6 g',
      nutrients: [['Vitamin B6', '1.7 mg', 100], ['Vitamin B12', '2.4 mcg', 100], ['Niacin', '8 mg', 50], ['Folate', '100 mcg DFE', 25]] } },
  { id: 'vanilla-zinc', name: 'Vanilla Bean Stout', infusion: 'Zinc', price: 18, abv: '5.0%', color: '#b9852f',
    notes: 'Madagascar vanilla, toasted oak, a creamy, smooth body.',
    benefits: ['Zinc supports normal immune function', 'Smooth, lower-bitterness finish'],
    nutrition: { calories: 105, addedSugar: '0 g', carbs: '5 g',
      nutrients: [['Zinc', '5.5 mg', 50], ['Vitamin C', '18 mg', 20]] } },
  { id: 'pb-magnesium', name: 'Peanut Butter Stout', infusion: 'Magnesium', price: 19, abv: '5.8%', color: '#8a4a1c',
    notes: 'Roasted peanut, malted milk, a hint of dark chocolate.',
    benefits: ['Magnesium supports muscle and nerve function', 'Rich, dessert-like body'],
    nutrition: { calories: 125, addedSugar: '0 g', carbs: '7 g',
      nutrients: [['Magnesium', '105 mg', 25], ['Potassium', '235 mg', 5]] } }
];

/* ================= HELPERS ================= */
const $ = (sel) => document.querySelector(sel);
const money = (n) => '$' + n.toFixed(2);

// Inline SVG can illustration. Replace with real product photography later.
function canSVG(color) {
  return `<svg viewBox="0 0 120 200" class="w-full h-auto" role="img" aria-label="Stout can">
    <rect x="18" y="14" width="84" height="172" rx="14" fill="#1a1a1a" stroke="${color}" stroke-width="3"/>
    <rect x="18" y="62" width="84" height="76" fill="${color}"/>
    <text x="60" y="94" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="15" fill="#111">MARROW</text>
    <text x="60" y="112" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="15" fill="#111">&amp; MALT</text>
    <text x="60" y="130" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="7" fill="#111">STOUT + VITAMINS</text>
    <rect x="30" y="8" width="60" height="10" rx="4" fill="#555"/>
  </svg>`;
}

/* ================= AGE GATE ================= */
function initAgeGate() {
  const gate = $('#age-gate');
  let verified = false;
  try { verified = localStorage.getItem('mm_age_ok') === '1'; } catch (e) {} // storage may be blocked
  if (verified) return;

  gate.classList.remove('hidden'); gate.classList.add('flex');
  document.body.style.overflow = 'hidden'; // lock scroll behind the modal

  $('#age-yes').addEventListener('click', () => {
    try { localStorage.setItem('mm_age_ok', '1'); } catch (e) {}
    gate.classList.add('hidden'); gate.classList.remove('flex');
    document.body.style.overflow = '';
  });
  $('#age-no').addEventListener('click', () => $('#age-denied').classList.remove('hidden'));
}

/* ================= PRODUCTS ================= */
function renderProducts() {
  $('#hero-can').innerHTML = canSVG(PRODUCTS[0].color);
  $('#product-grid').innerHTML = PRODUCTS.map((p) => `
    <article class="flex flex-col bg-cocoa border border-mocha rounded-lg overflow-hidden">
      <div class="px-10 pt-8 pb-4 bg-gradient-to-b from-roast to-cocoa"><div class="w-32 mx-auto">${canSVG(p.color)}</div></div>
      <div class="p-6 flex flex-col flex-1">
        <p class="text-teal text-sm font-medium">+ ${p.infusion}</p>
        <h3 class="font-serif text-2xl mt-1">${p.name}</h3>
        <p class="text-sm text-cream/60 mt-1">${p.abv} ABV &middot; 12 oz</p>
        <p class="mt-4 text-cream/80">${p.notes}</p>
        <ul class="mt-4 space-y-2 text-sm">
          ${p.benefits.map((b) => `<li class="flex gap-2"><svg class="w-4 h-4 mt-0.5 shrink-0 text-teal" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>${b}</li>`).join('')}
        </ul>
        <div class="mt-auto pt-6 flex items-center justify-between gap-3">
          <span class="font-serif text-xl">${money(p.price)} <span class="text-xs font-sans text-cream/50">4-pack</span></span>
          <button class="btn-primary !py-2.5 !px-5 text-sm" data-add="${p.id}">Add to Cart</button>
        </div>
      </div>
    </article>`).join('');
  $('#product-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (btn) { Cart.add(btn.dataset.add); Cart.open(); }
  });
}

/* ================= SCIENCE (tabs + nutrition label) ================= */
function renderScience(id = PRODUCTS[0].id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const n = p.nutrition;
  $('#science-tabs').innerHTML = PRODUCTS.map((x) =>
    `<button class="tab-btn" role="tab" data-tab="${x.id}" aria-selected="${x.id === id}">${x.infusion}</button>`).join('');
  $('#nutrition-label').innerHTML = `
    <h3 class="font-serif text-3xl font-black">Nutrition Facts</h3>
    <p class="text-sm">${p.name} &middot; 1 can (12 fl oz)</p>
    <div class="border-t-8 border-espresso mt-2 pt-2 flex justify-between items-end">
      <span class="font-bold">Calories</span><span class="font-serif text-4xl font-black">${n.calories}</span>
    </div>
    <div class="border-t border-espresso mt-2 py-1 flex justify-between text-sm"><span>Total Carbohydrate</span><span>${n.carbs}</span></div>
    <div class="border-t border-espresso py-1 flex justify-between text-sm"><span>Added Sugars</span><span class="font-bold">${n.addedSugar}</span></div>
    <div class="border-t-4 border-espresso pt-3 space-y-3">
      <p class="text-xs font-bold text-right">% Daily Value*</p>
      ${n.nutrients.map(([name, amt, dv]) => `
        <div>
          <div class="flex justify-between text-sm"><span class="font-bold">${name} <span class="font-normal">${amt}</span></span><span class="font-bold">${dv}%</span></div>
          <div class="dv-bar mt-1"><div class="dv-fill" style="width:${Math.min(dv, 100)}%"></div></div>
        </div>`).join('')}
    </div>
    <p class="border-t border-espresso mt-4 pt-2 text-[11px] leading-snug">*Percent Daily Values are based on a 2,000 calorie diet. ${p.abv} alcohol by volume. Placeholder values for demonstration.</p>`;
}
$('#science-tabs').addEventListener('click', (e) => {
  const t = e.target.closest('[data-tab]');
  if (t) renderScience(t.dataset.tab);
});

/* ================= CART ================= */
const Cart = {
  items: {}, // { productId: quantity }

  load() { try { this.items = JSON.parse(localStorage.getItem('mm_cart')) || {}; } catch (e) { this.items = {}; } },
  save() { try { localStorage.setItem('mm_cart', JSON.stringify(this.items)); } catch (e) {} },

  add(id) { this.items[id] = (this.items[id] || 0) + 1; this.update(); },
  change(id, delta) {
    this.items[id] = (this.items[id] || 0) + delta;
    if (this.items[id] <= 0) delete this.items[id];
    this.update();
  },

  open() {
    $('#cart-drawer').classList.remove('translate-x-full');
    $('#cart-drawer').setAttribute('aria-hidden', 'false');
    $('#cart-overlay').classList.remove('opacity-0', 'pointer-events-none');
  },
  close() {
    $('#cart-drawer').classList.add('translate-x-full');
    $('#cart-drawer').setAttribute('aria-hidden', 'true');
    $('#cart-overlay').classList.add('opacity-0', 'pointer-events-none');
  },

  // Re-render badge, line items, and total
  update() {
    this.save();
    const entries = Object.entries(this.items);
    const count = entries.reduce((s, [, q]) => s + q, 0);
    const total = entries.reduce((s, [id, q]) => s + PRODUCTS.find((p) => p.id === id).price * q, 0);
    $('#cart-count').textContent = count;
    $('#cart-total').textContent = money(total);
    $('#checkout-btn').disabled = count === 0;
    $('#cart-items').innerHTML = count === 0
      ? '<li class="text-cream/60 text-center mt-10">Your cart is empty. Add a 4-pack to get started.</li>'
      : entries.map(([id, q]) => {
          const p = PRODUCTS.find((x) => x.id === id);
          return `<li class="flex gap-4 items-center bg-roast/60 rounded-lg p-3">
            <div class="w-12 shrink-0">${canSVG(p.color)}</div>
            <div class="flex-1 min-w-0">
              <p class="font-serif leading-tight">${p.name}</p>
              <p class="text-xs text-cream/60">${money(p.price)} &middot; 4-pack</p>
              <div class="mt-2 flex items-center gap-3 text-sm">
                <button class="w-6 h-6 rounded border border-mocha hover:border-amber" data-qty="${id}" data-d="-1" aria-label="Decrease quantity">&minus;</button>
                <span>${q}</span>
                <button class="w-6 h-6 rounded border border-mocha hover:border-amber" data-qty="${id}" data-d="1" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <span class="font-bold">${money(p.price * q)}</span>
          </li>`;
        }).join('');
  }
};

function initCart() {
  Cart.load(); Cart.update();
  $('#cart-toggle').addEventListener('click', () => Cart.open());
  $('#cart-close').addEventListener('click', () => Cart.close());
  $('#cart-overlay').addEventListener('click', () => Cart.close());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') Cart.close(); });
  $('#cart-items').addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty]');
    if (b) Cart.change(b.dataset.qty, Number(b.dataset.d));
  });
  $('#checkout-btn').addEventListener('click', () => alert('Demo only: connect Shopify, Stripe, or your checkout of choice here.'));
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  initAgeGate();
  renderProducts();
  renderScience();
  initCart();
});
