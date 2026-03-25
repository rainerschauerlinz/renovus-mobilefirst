// Renovus Cookie Consent — DSGVO-konform, Österreich
// Version 2.0 — GA + Google Ads + Meta Pixel nach Zustimmung
(function() {
  'use strict';

  var COOKIE_NAME = 'renovus_consent';
  var COOKIE_DAYS = 365;

  // ── IDs — werden von Rainer befüllt ──────────────────
  var GA_ID      = 'G-XXXXXXXXXX';        // Google Analytics
  var GADS_ID    = 'AW-XXXXXXXXX';        // Google Ads Conversion ID
  var META_PIXEL = 'XXXXXXXXXXXXXXX';     // Meta Pixel ID (15 Ziffern)
  // ─────────────────────────────────────────────────────

  function getCookie(name) {
    var v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : null;
  }

  function setCookie(name, val, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + val + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;Secure';
  }

  // ── Google Analytics laden ────────────────────────────
  function loadGA() {
    if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return;
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    // Google Ads Remarketing Tag (nutzt selben gtag-Stream)
    if (GADS_ID && GADS_ID !== 'AW-XXXXXXXXX') {
      gtag('config', GADS_ID);
    }
  }

  // ── Meta Pixel laden ─────────────────────────────────
  function loadMetaPixel() {
    if (!META_PIXEL || META_PIXEL === 'XXXXXXXXXXXXXXX') return;
    if (window.__meta_loaded) return;
    window.__meta_loaded = true;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL);
    fbq('track', 'PageView');
  }

  // ── Alle Marketing-Pixel laden ────────────────────────
  function loadMarketing() {
    loadGA();
    loadMetaPixel();
  }

  function removeBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) { b.style.transform = 'translateY(100%)'; setTimeout(function(){ b.remove(); }, 300); }
  }

  function acceptAll() {
    setCookie(COOKIE_NAME, 'all', COOKIE_DAYS);
    loadMarketing();
    removeBanner();
    // Consent-Modus an GA melden (Google Consent Mode v2)
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  }

  function acceptEssential() {
    setCookie(COOKIE_NAME, 'essential', COOKIE_DAYS);
    removeBanner();
    // Consent-Modus: nur Essential (kein Tracking)
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.setAttribute('aria-modal', 'true');
    banner.innerHTML = [
      '<div class="cb-inner">',
        '<div class="cb-text">',
          '<p class="cb-title">Cookies &amp; Datenschutz</p>',
          '<p class="cb-desc">Wir verwenden technisch notwendige Cookies. Mit Ihrer Zustimmung nutzen wir Google Analytics (anonymisiert), Google Ads Remarketing und Meta Pixel — ausschließlich zur Verbesserung unseres Angebots. Alle Daten bleiben in der EU. <a href="/datenschutz" class="cb-link">Datenschutzerklärung</a></p>',
        '</div>',
        '<div class="cb-btns">',
          '<button id="cb-accept-all" class="cb-btn cb-btn-gold">Alle akzeptieren</button>',
          '<button id="cb-essential" class="cb-btn cb-btn-outline">Nur notwendige</button>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(banner);
    document.getElementById('cb-accept-all').addEventListener('click', acceptAll);
    document.getElementById('cb-essential').addEventListener('click', acceptEssential);
    setTimeout(function() {
      var btn = document.getElementById('cb-accept-all');
      if (btn) btn.focus();
    }, 100);
  }

  // ── Google Consent Mode v2 Default (vor Einwilligung) ─
  // Wird benötigt damit Google Ads überhaupt läuft
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  window.gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });

  // ── Init ──────────────────────────────────────────────
  var consent = getCookie(COOKIE_NAME);
  if (consent === 'all') {
    loadMarketing();
    // Consent Mode updaten für schon eingewilligte User
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });
  } else if (!consent) {
    var show = function() { setTimeout(showBanner, 600); };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', show);
    } else {
      show();
    }
  }
  // 'essential' = kein Banner, kein Tracking — bleibt wie es ist

  // ── Öffentliche API für spezifische Conversion Events ─
  window.renovusTrack = function(event, data) {
    // Google Ads Conversion
    if (window.gtag && GADS_ID && GADS_ID !== 'AW-XXXXXXXXX') {
      if (event === 'lead' && data && data.sendTo) {
        window.gtag('event', 'conversion', { 'send_to': data.sendTo });
      }
    }
    // Meta Pixel Event
    if (window.fbq) {
      if (event === 'lead') window.fbq('track', 'Lead');
      if (event === 'contact') window.fbq('track', 'Contact');
      if (event === 'pageview') window.fbq('track', 'PageView');
    }
    // GA Event
    if (window.gtag && GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
      window.gtag('event', event, data || {});
    }
  };

})();
