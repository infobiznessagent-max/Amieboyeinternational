/* ═══════════════════════════════════════════════════════════
   AMIEBOYE INTERNATIONAL — HOMEPAGE JAVASCRIPT
   Navigation behavior | Mobile menu | Scroll effects
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM References ─────────────────────────────── */
  const navHeader    = document.getElementById('nav-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');
  const mobileLinks  = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');
  const navLinks     = document.querySelectorAll('.nav-link');

  /* ─── 1. NAV: Transparent ↔ Scrolled ────────────── */
  function updateNavState() {
    const scrolled = window.scrollY > 30;
    navHeader.classList.toggle('nav-scrolled',     scrolled);
    navHeader.classList.toggle('nav-transparent', !scrolled);
  }

  // Set initial state
  navHeader.classList.add('nav-transparent');
  updateNavState();

  window.addEventListener('scroll', updateNavState, { passive: true });

  /* ─── 2. Active Nav Link on Scroll ──────────────── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ─── 3. Mobile Menu Toggle ──────────────────────── */
  function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    // Make links focusable
    mobileLinks.forEach(link => link.setAttribute('tabindex', '0'));
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    // Remove focusability
    mobileLinks.forEach(link => link.setAttribute('tabindex', '-1'));
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      hamburgerBtn.focus();
    }
  });

  /* ─── 4. Smooth Scroll for anchor links ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 80;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 5. Scroll-triggered Fade-In for future sections ─ */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

})();
