/* ============================================================
   ALINA KINGDOM – main.js
   Sticky nav · Hamburger · Scroll animations · Lightbox · Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky header ── */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const linkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active-link'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => linkObserver.observe(s));

  /* ── Hamburger menu ── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close on link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Fade-in on scroll ── */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ── Lightbox ── */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');
  const lightboxCaption= document.getElementById('lightboxCaption');
  const lightboxClose  = document.getElementById('lightboxClose');
  const lightboxPrev   = document.getElementById('lightboxPrev');
  const lightboxNext   = document.getElementById('lightboxNext');

  const galleryItems = Array.from(document.querySelectorAll('.galerie__item'));
  let currentIndex   = 0;

  function openLightbox(index) {
    currentIndex = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src       = item.dataset.src || item.querySelector('img').src;
    lightboxImg.alt       = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => openLightbox(currentIndex - 1));
  lightboxNext.addEventListener('click', () => openLightbox(currentIndex + 1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });

  /* ── Contact form validation ── */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess= document.getElementById('formSuccess');

  if (form) {
    const fields = {
      nom:       { el: form.nom,        errEl: document.getElementById('nomError'),       key: 'form.err.name' },
      email:     { el: form.email,      errEl: document.getElementById('emailError'),     key: 'form.err.email' },
      pays:      { el: form.pays,       errEl: document.getElementById('paysError'),      key: 'form.err.country' },
      programme: { el: form.programme,  errEl: document.getElementById('programmeError'), key: 'form.err.program' },
      message:   { el: form.message,    errEl: document.getElementById('messageError'),   key: 'form.err.message' },
    };

    function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

    function validateField(name) {
      const { el, errEl, key } = fields[name];
      let valid = true;
      let errMsg = '';

      if (name === 'email') {
        valid = validateEmail(el.value);
      } else {
        valid = el.value.trim() !== '';
      }

      if (!valid) {
        errMsg = (typeof t === 'function') ? t(key) : el.dataset.err || 'Champ requis';
        el.classList.add('error');
      } else {
        el.classList.remove('error');
      }

      errEl.textContent = errMsg;
      return valid;
    }

    // Live validation on blur
    Object.keys(fields).forEach(name => {
      fields[name].el.addEventListener('blur', () => validateField(name));
      fields[name].el.addEventListener('input', () => {
        if (fields[name].el.classList.contains('error')) validateField(name);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(validateField).every(Boolean);
      if (!allValid) return;

      // Simulate form submission (replace with real endpoint)
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = '…';

      setTimeout(() => {
        formSuccess.classList.add('visible');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent =
          (typeof t === 'function') ? t('form.submit') : 'Envoyer ma demande';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
