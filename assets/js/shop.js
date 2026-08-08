/* ============================================================
   SHOP — cart drawer, quantities, totals, Stripe checkout.
   Cart persists via localStorage (falls back to memory).
   Checkout posts to a serverless function that creates a Stripe
   Checkout Session (see netlify/functions/create-checkout.js).
   ============================================================ */
(function () {
  'use strict';

  // ---- persistence (safe) ----
  var mem = [];
  function load() {
    try { var r = localStorage.getItem('rm_cart'); return r ? JSON.parse(r) : []; }
    catch (e) { return mem; }
  }
  function save(items) {
    mem = items;
    try { localStorage.setItem('rm_cart', JSON.stringify(items)); } catch (e) {}
  }
  var cart = load();

  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function key(id, size) { return id + '::' + size; }

  function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function total() { return cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0); }

  // ---- badge ----
  function syncBadge() {
    var b = document.querySelector('.nav__cart-count');
    if (!b) return;
    var c = count();
    b.textContent = c;
    b.classList.toggle('show', c > 0);
  }

  // ---- add ----
  window.addToCart = function (item) {
    var k = key(item.id, item.size);
    var found = cart.find(function (i) { return key(i.id, i.size) === k; });
    if (found) found.qty += 1; else cart.push({ id: item.id, title: item.title, img: item.img, size: item.size, price: item.price, qty: 1 });
    save(cart); syncBadge(); renderCart(); openCart(); toast('Added to cart');
  };

  function setQty(k, delta) {
    var it = cart.find(function (i) { return key(i.id, i.size) === k; });
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(function (i) { return key(i.id, i.size) !== k; });
    save(cart); syncBadge(); renderCart();
  }
  function removeItem(k) { cart = cart.filter(function (i) { return key(i.id, i.size) !== k; }); save(cart); syncBadge(); renderCart(); }

  // ---- render drawer ----
  function renderCart() {
    var box = document.querySelector('.cart__items');
    var foot = document.querySelector('.cart__foot');
    if (!box) return;
    if (!cart.length) {
      box.innerHTML = '<div class="cart__empty">Your cart is empty.<br>Browse the prints to get started.</div>';
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = 'block';
    box.innerHTML = cart.map(function (i) {
      var k = key(i.id, i.size);
      return '<div class="ci">' +
        '<img class="ci__img" src="' + i.img + '" alt="' + i.title + '">' +
        '<div class="ci__body">' +
          '<div class="ci__title">' + i.title + '</div>' +
          '<div class="ci__size">' + i.size + '"</div>' +
          '<div class="ci__row">' +
            '<span class="qty"><button data-q="-1" data-k="' + k + '">–</button><span>' + i.qty + '</span><button data-q="1" data-k="' + k + '">+</button></span>' +
            '<span class="ci__price">' + money(i.qty * i.price) + '</span>' +
          '</div>' +
          '<button class="ci__rm mono" data-rm="' + k + '">REMOVE</button>' +
        '</div></div>';
    }).join('');
    var tot = document.querySelector('.cart__total b');
    if (tot) tot.textContent = money(total());
    box.querySelectorAll('[data-q]').forEach(function (btn) {
      btn.addEventListener('click', function () { setQty(btn.getAttribute('data-k'), parseInt(btn.getAttribute('data-q'), 10)); });
    });
    box.querySelectorAll('[data-rm]').forEach(function (btn) {
      btn.addEventListener('click', function () { removeItem(btn.getAttribute('data-rm')); });
    });
  }

  // ---- drawer open/close ----
  function openCart() { var d = document.querySelector('.cart'), o = document.querySelector('.cart-overlay'); if (d) d.classList.add('open'); if (o) o.classList.add('open'); }
  function closeCart() { var d = document.querySelector('.cart'), o = document.querySelector('.cart-overlay'); if (d) d.classList.remove('open'); if (o) o.classList.remove('open'); }
  window.openCart = openCart; window.closeCart = closeCart;

  // ---- toast ----
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }

  // ---- checkout ----
  function checkout() {
    if (!cart.length) return;
    var btn = document.querySelector('[data-checkout]');
    if (btn) { btn.textContent = 'Redirecting…'; btn.disabled = true; }
    fetch('/.netlify/functions/create-checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.map(function (i) { return { title: i.title + ' — ' + i.size + '"', price: i.price, qty: i.qty, img: i.img }; }) })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.url) { window.location.href = data.url; }
        else throw new Error('no url');
      })
      .catch(function () {
        if (btn) { btn.textContent = 'Checkout'; btn.disabled = false; }
        // Fallback while Stripe isn't connected yet: email the order.
        var lines = cart.map(function (i) { return i.qty + '× ' + i.title + ' (' + i.size + '") — ' + money(i.qty * i.price); }).join('\n');
        var body = 'I would like to order:\n\n' + lines + '\n\nTotal: ' + money(total());
        toast('Checkout not connected — opening email');
        setTimeout(function () {
          window.location.href = 'mailto:' + (window.SITE ? window.SITE.contact.email : '') +
            '?subject=' + encodeURIComponent('Print order') + '&body=' + encodeURIComponent(body);
        }, 900);
      });
  }

  // ---- wire up on load ----
  document.addEventListener('DOMContentLoaded', function () {
    syncBadge(); renderCart();
    var open = document.querySelector('[data-open-cart]');
    if (open) open.addEventListener('click', function (e) { e.preventDefault(); openCart(); });
    var close = document.querySelector('.cart__close');
    if (close) close.addEventListener('click', closeCart);
    var ov = document.querySelector('.cart-overlay');
    if (ov) ov.addEventListener('click', closeCart);
    var co = document.querySelector('[data-checkout]');
    if (co) co.addEventListener('click', checkout);

    // Build category filter bar
    var filterBar = document.querySelector('[data-shop-filters]');
    if (filterBar && window.SITE && window.SITE.PRINT_CATEGORIES) {
      window.SITE.PRINT_CATEGORIES.forEach(function (cat, i) {
        var b = document.createElement('button');
        b.className = 'filter-btn' + (i === 0 ? ' sel' : '');
        b.setAttribute('data-cat', cat);
        b.textContent = cat;
        b.addEventListener('click', function () {
          filterBar.querySelectorAll('.filter-btn').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel');
          var pick = cat;
          document.querySelectorAll('[data-shop] .product').forEach(function (card) {
            var show = pick === 'All' || card.getAttribute('data-cat') === pick;
            card.style.display = show ? '' : 'none';
            if (show) { card.classList.remove('in'); requestAnimationFrame(function () { card.classList.add('in'); }); }
          });
        });
        filterBar.appendChild(b);
      });
    }

    // Build product cards if a shop grid exists
    var grid = document.querySelector('[data-shop]');
    if (grid && window.SITE) {
      window.SITE.PRINTS.forEach(function (p, idx) {
        var sizes = p.sizes;
        var el = document.createElement('div');
        el.className = 'product';
        el.setAttribute('data-cat', p.badge);
        el.style.transitionDelay = (idx % 3 * 0.06) + 's';
        el.innerHTML =
          '<div class="product__img"><span class="product__badge">' + p.badge + '</span>' +
            '<img loading="lazy" src="' + window.SITE.img(p.img, 900) + '" alt="' + p.title + '"></div>' +
          '<div class="product__title">' + p.title + '</div>' +
          '<div class="product__meta"><span class="dim mono" style="font-size:12px">FINE-ART PRINT</span>' +
            '<span class="product__price" data-price>' + money(sizes[0][1]) + '</span></div>' +
          '<div class="product__sizes">' + sizes.map(function (s, i) {
            return '<button class="size-btn' + (i === 0 ? ' sel' : '') + '" data-size="' + s[0] + '" data-p="' + s[1] + '">' + s[0] + '"</button>';
          }).join('') + '</div>' +
          '<button class="btn btn--accent btn--full" data-add>Add to cart</button>';
        // size selection
        var priceEl = el.querySelector('[data-price]');
        var sel = { size: sizes[0][0], price: sizes[0][1] };
        el.querySelectorAll('.size-btn').forEach(function (b) {
          b.addEventListener('click', function () {
            el.querySelectorAll('.size-btn').forEach(function (x) { x.classList.remove('sel'); });
            b.classList.add('sel');
            sel.size = b.getAttribute('data-size'); sel.price = parseInt(b.getAttribute('data-p'), 10);
            priceEl.textContent = money(sel.price);
          });
        });
        el.querySelector('[data-add]').addEventListener('click', function () {
          window.addToCart({ id: p.id, title: p.title, img: window.SITE.img(p.img, 600), size: sel.size, price: sel.price });
        });
        grid.appendChild(el);
      });
      // Reveal the freshly-built products. main.js's reveal observer runs on
      // DOMContentLoaded BEFORE these cards exist, so it never sees them —
      // without this the grid stays invisible until a filter is clicked.
      var pio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); pio.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      grid.querySelectorAll('.product').forEach(function (el) { pio.observe(el); });
    }
  });
})();
