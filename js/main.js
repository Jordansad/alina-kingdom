/* ============================================================
   ALINA KINGDOM – main.js
   Charge data.json → rendu dynamique programmes & galerie
   + Sticky nav · Hamburger · Scroll animations · Lightbox · Form
   ============================================================ */

let siteData     = null;
let galleryItems = [];   // populated after rendering

/* ── Helpers ── */
function getCurrentLang() {
  return localStorage.getItem('ak_lang') || 'fr';
}

function localT(obj, lang) {
  return (obj && (obj[lang] || obj['fr'])) || '';
}

/* ── SVG icons for program cards ── */
const ICON_CAL  = `<svg class="programme-card__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>`;
const ICON_PIN  = `<svg class="programme-card__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>`;
const ICON_GRP  = `<svg class="programme-card__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;

/* ── Render programs ── */
function renderPrograms(programs) {
  const container = document.getElementById('programmesContainer');
  if (!container || !programs) return;
  const lang = getCurrentLang();

  container.innerHTML = programs.map(p => {
    const featured     = p.featured;
    const badgeClass   = featured ? 'programme-card__badge--gold' : '';
    const cardClass    = featured ? 'programme-card programme-card--featured fade-in' : 'programme-card fade-in';
    const ctaLabel     = lang === 'en' ? 'Book this stay' : lang === 'it' ? 'Prenota questo soggiorno' : 'Réserver ce séjour';

    return `
    <article class="${cardClass}">
      <div class="programme-card__img-wrap">
        <img src="${p.image || ''}" alt="${localT(p.title, lang)}" class="programme-card__img" loading="lazy" />
        <span class="programme-card__badge ${badgeClass}">${localT(p.badge, lang)}</span>
      </div>
      <div class="programme-card__body">
        <h3 class="programme-card__title">${localT(p.title, lang)}</h3>
        <p class="programme-card__desc">${localT(p.description, lang)}</p>
        <ul class="programme-card__details">
          <li>${ICON_CAL}<span>${localT(p.dates, lang)}</span></li>
          <li>${ICON_PIN}<span>${localT(p.location, lang)}</span></li>
          <li>${ICON_GRP}<span>${localT(p.group, lang)}</span></li>
        </ul>
        <a href="#contact" class="btn btn--primary programme-card__btn">${ctaLabel}</a>
      </div>
    </article>`;
  }).join('');

  // Re-trigger fade-in observer for newly created elements
  container.querySelectorAll('.fade-in').forEach(el => {
    el.classList.remove('visible');
    fadeObserver.observe(el);
  });
}

/* ── Render gallery ── */
function renderGallery(gallery) {
  const grid = document.getElementById('galerieGrid');
  if (!grid || !gallery) return;

  grid.innerHTML = gallery.map(img => {
    const wideClass = img.wide ? 'galerie__item--wide' : '';
    const tallClass = img.tall ? 'galerie__item--tall' : '';
    return `
    <div class="galerie__item ${wideClass} ${tallClass} fade-in"
         data-src="${img.src || img.thumb}" data-caption="${img.caption || ''}">
      <img src="${img.thumb || img.src}" alt="${img.caption || ''}" loading="lazy" />
      <div class="galerie__item-overlay"><span>+</span></div>
    </div>`;
  }).join('');

  // Rebuild gallery items array for lightbox
  galleryItems = Array.from(grid.querySelectorAll('.galerie__item'));
  initGalleryEvents();

  // Re-trigger fade-in observer
  grid.querySelectorAll('.fade-in').forEach(el => {
    el.classList.remove('visible');
    fadeObserver.observe(el);
  });
}

/* ── Load data.json ── */
async function loadSiteData() {
  // Check for admin local preview
  const preview = localStorage.getItem('ak_preview_data');
  const isPreview = window.location.search.includes('preview=1');
  if (isPreview && preview) {
    try { siteData = JSON.parse(preview); } catch(e) {}
  }

  if (!siteData) {
    try {
      const resp = await fetch('data.json?t=' + Date.now());
      if (resp.ok) siteData = await resp.json();
    } catch(e) {}
  }

  if (siteData) {
    renderPrograms(siteData.programs);
    renderGallery(siteData.gallery);
  }
}

/* ── IntersectionObserver for fade-in (must be created before loadSiteData) ── */
let fadeObserver;

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky header ── */
  const header  = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');
  const linkObs   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active-link'));
        const a = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (a) a.classList.add('active-link');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => linkObs.observe(s));

  /* ── Hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Fade-in on scroll ── */
  fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* ── Load dynamic content ── */
  loadSiteData();

  /* ── Re-render programs on language change ── */
  document.addEventListener('langchange', () => {
    if (siteData) renderPrograms(siteData.programs);
  });

  /* ── Lightbox (static init; gallery items added after data load) ── */
  initLightbox();

  /* ── Contact form ── */
  initContactForm();

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

});

/* ── Lightbox ── */
function initLightbox() {
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxPrev    = document.getElementById('lightboxPrev');
  const lightboxNext    = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function openLightbox(index) {
    if (!galleryItems.length) return;
    currentIndex = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.src || item.querySelector('img').src;
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  window._openLightbox = openLightbox;

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click',  () => openLightbox(currentIndex - 1));
  lightboxNext.addEventListener('click',  () => openLightbox(currentIndex + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
}

function initGalleryEvents() {
  galleryItems.forEach((item, i) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.onclick = () => window._openLightbox && window._openLightbox(i);
    item.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window._openLightbox && window._openLightbox(i); }
    };
  });
}

/* ── Contact form ── */
function initContactForm() {
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  const fields = {
    nom:       { el: form.nom,       errEl: document.getElementById('nomError'),       key: 'form.err.name' },
    email:     { el: form.email,     errEl: document.getElementById('emailError'),     key: 'form.err.email' },
    pays:      { el: form.pays,      errEl: document.getElementById('paysError'),      key: 'form.err.country' },
    programme: { el: form.programme, errEl: document.getElementById('programmeError'), key: 'form.err.program' },
    message:   { el: form.message,   errEl: document.getElementById('messageError'),   key: 'form.err.message' },
  };

  function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

  function validateField(name) {
    const { el, errEl, key } = fields[name];
    const valid = name === 'email' ? validateEmail(el.value) : el.value.trim() !== '';
    const msg   = valid ? '' : (typeof t === 'function' ? t(key) : 'Champ requis');
    el.classList.toggle('error', !valid);
    errEl.textContent = msg;
    return valid;
  }

  Object.keys(fields).forEach(name => {
    fields[name].el.addEventListener('blur',  () => validateField(name));
    fields[name].el.addEventListener('input', () => { if (fields[name].el.classList.contains('error')) validateField(name); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!Object.keys(fields).map(validateField).every(Boolean)) return;
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = '…';
    setTimeout(() => {
      formSuccess.classList.add('visible');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = typeof t === 'function' ? t('form.submit') : 'Envoyer ma demande';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });
}
