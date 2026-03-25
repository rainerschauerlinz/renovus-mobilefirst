
(function () {
  'use strict';

  /* ── YEAR ───────────────────────────────────────── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── HEADER SCROLL BEHAVIOUR ─────────────────────
     topbar hides after scrolling past it;
     main-header picks up a shadow                    */
  const topbar     = document.querySelector('.rv-topbar');
  const mainHeader = document.querySelector('.rv-header');
  const stripe     = document.querySelector('.rv-conversion-stripe');

  function onScroll() {
    const y = window.scrollY;
    if (!topbar || !mainHeader) return;

    const tbH = topbar.offsetHeight;
    if (y > tbH) {
      topbar.style.transform = 'translateY(-100%)';
      topbar.style.opacity   = '0';
    } else {
      topbar.style.transform = '';
      topbar.style.opacity   = '';
    }

    if (y > 60) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Add scrolled style once */
  const style = document.createElement('style');
  style.textContent = `
    .rv-topbar { transition: transform .35s ease, opacity .35s ease; }
    .rv-header.scrolled { box-shadow: 0 2px 24px rgba(0,0,0,.07); }
  `;
  document.head.appendChild(style);

  /* ── MOBILE DRAWER ───────────────────────────────── */
  const drawerToggle  = document.getElementById('rnvBurger');
  const mobileDrawer  = document.getElementById('rnvDrawer');
  const drawerOverlay = document.getElementById('rnvOverlay');
  const drawerClose   = document.getElementById('rnvDrawerClose');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    if (drawerOverlay) drawerOverlay.classList.add('is-on');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    if (drawerOverlay) drawerOverlay.classList.remove('is-on');
    document.body.style.overflow = '';
  }

  if (drawerToggle)  drawerToggle.addEventListener('click', openDrawer);
  if (drawerClose)   drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  /* Close drawer on nav link click */
  document.querySelectorAll('#rnvDrawer a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ── FAQ ACCORDION ───────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      const answer  = btn.nextElementSibling;

      /* Close all others */
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = b.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      /* Toggle clicked */
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });

  /* ── FADE-UP SCROLL ANIMATION ────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeStyle = document.createElement('style');
  fadeStyle.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .6s ease, transform .6s ease;
    }
    .fade-up.visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(fadeStyle);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => io.observe(el));
  } else {
    /* Fallback for old browsers */
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── SMOOTH SCROLL FOR HASH LINKS ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = (mainHeader ? mainHeader.offsetHeight : 0) + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── ROBUST DROPDOWN HOVER (replaces CSS-only) ──────── */
  document.querySelectorAll('.rnv-nav__item[aria-haspopup]').forEach(item => {
    let closeTimer;
    const drop = item.querySelector('.rnv-drop');
    if (!drop) return;

    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      // Close all others
      document.querySelectorAll('.rnv-drop').forEach(d => { if (d !== drop) d.style.display = 'none'; });
      drop.style.display = 'block';
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => { drop.style.display = 'none'; }, 120);
    });
    drop.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    drop.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => { drop.style.display = 'none'; }, 120);
    });
  });
  // Close dropdowns on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.rnv-nav__item')) {
      document.querySelectorAll('.rnv-drop').forEach(d => d.style.display = 'none');
    }
  });

  /* ── MULTI-PAGE NAVIGATION ───────────────────────────── */
  


  // FAQ accordion for LP pages
  window.toggleFaq = function(btn) {
    var item = btn.closest('.lp-faq__item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.lp-faq__item.open').forEach(function(i) { i.classList.remove('open'); });
    if (!wasOpen) item.classList.add('open');
  };

  ;

  // Browser Back / Forward
  window.addEventListener('popstate', function(e) {
    const pageId = (e.state && e.state.page) ? e.state.page : 'startseite';
    _renderPage(pageId);
  });

  // On load: check URL hash and show correct page
  (function() {
    const hash = window.location.hash.replace('#','');
    const validPages = [
      'startseite','verkaufen','leistungen','tippgeber','projektentwicklung','verkaufsaufbereitung',
      'ueber','impressum','agb','nebenkosten','datenschutz',
      'immobilienmakler','immobilienbewertung','haus-linz','wohnung-linz','linz-land','urfahr',
      'gewerbe','zinshaus-verkaufen','anlageimmobilien','zinshaus-kaufen',
      'immobilien-kaufen','wohnung-kaufen','haus-kaufen',
      'leonding','traun','ansfelden','pasching',
      'immobilienpreise','immobilienmarkt'
    ];
    if (hash && validPages.includes(hash)) {
      _renderPage(hash);
      history.replaceState({ page: hash }, '', '#' + hash);
    } else {
      history.replaceState({ page: 'startseite' }, '', window.location.pathname);
    }
  })();

  // Logo always goes back to startseite
  document.querySelectorAll('a.rnv-logo, a[href="#hero"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      
    });
  });


})();

