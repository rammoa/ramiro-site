/* ============================================================
   MAIN — shared behaviors: nav, mobile menu, hero intro,
   scroll reveals, hero parallax, pinned zoom, marquee, gallery build.
   ============================================================ */
(function () {
  'use strict';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  document.addEventListener('DOMContentLoaded', function () {
    var S = window.SITE || {};

    /* ---- NAV scroll state + mobile menu ---- */
    var nav = document.querySelector('.nav');
    var burger = document.querySelector('.nav__burger');
    var links = document.querySelector('.nav__links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        nav.classList.toggle('menu-open', open);
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); nav.classList.remove('menu-open'); });
      });
    }

    /* ---- Hero: word-by-word title + intro ---- */
    var heroTitle = document.querySelector('[data-hero-title]');
    if (heroTitle) {
      var words = heroTitle.getAttribute('data-hero-title').split(' ');
      heroTitle.innerHTML = '';
      words.forEach(function (word, i) {
        var s = document.createElement('span'); s.className = 'w'; s.textContent = word;
        s.style.transitionDelay = (0.15 + i * 0.12) + 's';
        heroTitle.appendChild(s);
        if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
      });
    }
    var hero = document.querySelector('.hero');
    if (hero) requestAnimationFrame(function () { hero.classList.add('in'); });

    /* ---- Build galleries from data (data-gallery="AERIAL|ESTATE|PORTRAIT") ---- */
    document.querySelectorAll('[data-gallery]').forEach(function (el) {
      var key = el.getAttribute('data-gallery');
      var list = S[key] || [];
      var tall = el.classList.contains('g-4');
      list.forEach(function (it, i) {
        var c = document.createElement('a');
        c.className = 'cell' + (tall ? ' cell--tall' : '');
        c.href = el.getAttribute('data-link') || '#';
        c.style.transitionDelay = (i % 6 * 0.07) + 's';
        var im = document.createElement('img'); im.loading = 'lazy';
        im.src = S.img(it[0], tall ? 900 : 1400); im.alt = it[1];
        var tag = document.createElement('span'); tag.className = 'tag mono'; tag.textContent = it[1];
        c.appendChild(im); c.appendChild(tag); el.appendChild(c);
      });
    });

    /* ---- Pinned zoom showcase ---- */
    var pinImg = document.querySelector('[data-pin-img]');
    if (pinImg && S.img) pinImg.src = S.img(pinImg.getAttribute('data-pin-img'), 2000);

    /* ---- Marquee ---- */
    document.querySelectorAll('[data-marquee]').forEach(function (track) {
      var words = track.getAttribute('data-marquee').split('|');
      var line = words.concat(words);
      line.forEach(function (wd, i) {
        var s = document.createElement('span'); if (i % 2) s.className = 'fill'; s.textContent = wd;
        track.appendChild(s);
      });
    });

    /* ---- Reveal on scroll ---- */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .cell, .product').forEach(function (el) { io.observe(el); });

    /* ---- Scroll-linked: nav bg, hero parallax, pinned scale ---- */
    var heroMedia = document.querySelector('.hero__media');
    var pin = document.querySelector('.pin');
    var pinFrame = document.querySelector('.pin__frame');
    var pinCap = document.querySelector('.pin__cap');
    var ticking = false;
    function update() {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 40);
      if (heroMedia) heroMedia.style.transform = 'translateY(' + (y * 0.26) + 'px) scale(' + (1 + y * 0.00012) + ')';
      if (pin && pinFrame) {
        var r = pin.getBoundingClientRect();
        var total = pin.offsetHeight - window.innerHeight;
        var prog = clamp((-r.top) / total, 0, 1);
        var scale = clamp(0.5 + prog * 1.15, 0.5, 1.65);
        pinFrame.style.transform = 'scale(' + scale + ')';
        pinFrame.style.borderRadius = clamp(22 - prog * 22, 0, 22) + 'px';
        if (pinCap) {
          var capO = clamp((prog - 0.62) / 0.28, 0, 1);
          pinCap.style.opacity = capO;
          pinCap.style.transform = 'translateY(' + (1 - capO) * 20 + 'px)';
        }
      }
      ticking = false;
    }
    function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    /* ---- Contact / inquiry forms: mailto fallback (no backend needed) ---- */
    document.querySelectorAll('form[data-mailto]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var to = form.getAttribute('data-mailto');
        var fd = new FormData(form);
        var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Website inquiry');
        var body = '';
        fd.forEach(function (v, k) { body += k + ': ' + v + '\n'; });
        window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + encodeURIComponent(body);
      });
    });
  });
})();
