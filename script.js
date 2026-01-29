/**
 * Syntropy Landing Page - Complete JavaScript
 * The Operating System for Your Life
 *
 * Vanilla JS, no dependencies. Production-ready.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAnalytics();
  initNavScrollEffect();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCounterAnimations();
  initMobileCTABar();
  initParticleBackground();
  initActiveNavHighlighting();
  initFAQAccordion();
  initCompareTableIndicator();

  console.log('Syntropy website initialized');
});

// ---------------------------------------------------------------------------
// 12. Analytics (placeholder)
// ---------------------------------------------------------------------------

function initAnalytics() {
  const trackEvent = (category, action, label) => {
    console.log(`[Syntropy Analytics] ${category} | ${action} | ${label}`);
  };

  window.syntropy = { trackEvent };

  // Track CTA clicks
  document.querySelectorAll('.store-button, .btn-primary, .btn-block').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent?.trim().slice(0, 60) || 'unknown';
      trackEvent('CTA', 'click', label);
    });
  });
}

// ---------------------------------------------------------------------------
// 13. Performance utilities
// ---------------------------------------------------------------------------

const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

// ---------------------------------------------------------------------------
// 1. Navigation Scroll Effect
// ---------------------------------------------------------------------------

function initNavScrollEffect() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  // Also apply the existing class name the CSS might use
  const onScrollLegacy = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  const handler = () => { onScroll(); onScrollLegacy(); };
  handler(); // apply on load
  window.addEventListener('scroll', handler, { passive: true });
}

// ---------------------------------------------------------------------------
// 2. Mobile Menu Toggle
// ---------------------------------------------------------------------------

function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger') || document.getElementById('navToggle');
  const mobileMenu = document.querySelector('.nav__mobile-menu') || document.getElementById('navLinks');
  if (!hamburger || !mobileMenu) return;

  const open = () => {
    hamburger.classList.add('open', 'active');
    mobileMenu.classList.add('open', 'active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('open', 'active');
    mobileMenu.classList.remove('open', 'active');
    document.body.style.overflow = '';
  };

  const isOpen = () => hamburger.classList.contains('open') || hamburger.classList.contains('active');

  hamburger.addEventListener('click', () => {
    isOpen() ? close() : open();
  });

  // Close on nav link click inside mobile menu
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });
}

// ---------------------------------------------------------------------------
// 3. Smooth Scroll
// ---------------------------------------------------------------------------

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      const hamburger = document.querySelector('.nav__hamburger') || document.getElementById('navToggle');
      const mobileMenu = document.querySelector('.nav__mobile-menu') || document.getElementById('navLinks');
      if (hamburger) {
        hamburger.classList.remove('open', 'active');
      }
      if (mobileMenu) {
        mobileMenu.classList.remove('open', 'active');
      }
      document.body.style.overflow = '';
    });
  });
}

// ---------------------------------------------------------------------------
// 4. Scroll-Triggered Animations (Intersection Observer)
// ---------------------------------------------------------------------------

function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  // Also observe common card elements that may not have data-animate
  const cardSelectors = [
    '.feature-card',
    '.problem-card',
    '.pillar-card',
    '.testimonial-card',
    '.pricing-card',
    '.journey-step',
    '.summary-card',
    '.explainer-card',
    '.tier-item',
    '.section-title',
    '.section-badge',
    '.hero-content',
    '.hero-phone',
    '.philosophy-content',
    '.pricing-quote',
    '.cta-content',
  ];
  const implicitElements = document.querySelectorAll(cardSelectors.join(','));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Determine delay
          const delayAttr = el.getAttribute('data-animate-delay');
          if (delayAttr) {
            el.classList.add(`animate-delay-${delayAttr}`);
          }

          el.classList.add('animate--visible');
          // Legacy class for existing CSS
          el.classList.add('animate-in');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach(el => observer.observe(el));

  // For implicit elements, add the base animation class then observe
  implicitElements.forEach(el => {
    if (!el.classList.contains('animate-on-scroll')) {
      el.classList.add('animate-on-scroll');
    }
    observer.observe(el);
  });

  // Inject animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.animate--visible,
    .animate-on-scroll.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    .animate-delay-1 { transition-delay: 0.1s !important; }
    .animate-delay-2 { transition-delay: 0.2s !important; }
    .animate-delay-3 { transition-delay: 0.3s !important; }
    .animate-delay-4 { transition-delay: 0.4s !important; }
    .animate-delay-5 { transition-delay: 0.5s !important; }
    .animate-delay-6 { transition-delay: 0.6s !important; }

    /* Stagger children inside grids */
    .features-grid .animate-in:nth-child(1),
    .features-grid .animate--visible:nth-child(1) { transition-delay: 0ms; }
    .features-grid .animate-in:nth-child(2),
    .features-grid .animate--visible:nth-child(2) { transition-delay: 100ms; }
    .features-grid .animate-in:nth-child(3),
    .features-grid .animate--visible:nth-child(3) { transition-delay: 200ms; }
    .features-grid .animate-in:nth-child(4),
    .features-grid .animate--visible:nth-child(4) { transition-delay: 300ms; }
    .features-grid .animate-in:nth-child(5),
    .features-grid .animate--visible:nth-child(5) { transition-delay: 400ms; }
    .features-grid .animate-in:nth-child(6),
    .features-grid .animate--visible:nth-child(6) { transition-delay: 500ms; }

    .pillars-grid .animate-in:nth-child(1),
    .pillars-grid .animate--visible:nth-child(1) { transition-delay: 0ms; }
    .pillars-grid .animate-in:nth-child(2),
    .pillars-grid .animate--visible:nth-child(2) { transition-delay: 100ms; }
    .pillars-grid .animate-in:nth-child(3),
    .pillars-grid .animate--visible:nth-child(3) { transition-delay: 200ms; }
    .pillars-grid .animate-in:nth-child(4),
    .pillars-grid .animate--visible:nth-child(4) { transition-delay: 300ms; }
    .pillars-grid .animate-in:nth-child(5),
    .pillars-grid .animate--visible:nth-child(5) { transition-delay: 400ms; }
    .pillars-grid .animate-in:nth-child(6),
    .pillars-grid .animate--visible:nth-child(6) { transition-delay: 500ms; }

    .journey-timeline .animate-in:nth-child(1),
    .journey-timeline .animate--visible:nth-child(1) { transition-delay: 0ms; }
    .journey-timeline .animate-in:nth-child(2),
    .journey-timeline .animate--visible:nth-child(2) { transition-delay: 150ms; }
    .journey-timeline .animate-in:nth-child(3),
    .journey-timeline .animate--visible:nth-child(3) { transition-delay: 300ms; }
    .journey-timeline .animate-in:nth-child(4),
    .journey-timeline .animate--visible:nth-child(4) { transition-delay: 450ms; }
    .journey-timeline .animate-in:nth-child(5),
    .journey-timeline .animate--visible:nth-child(5) { transition-delay: 600ms; }

    .testimonials-grid .animate-in:nth-child(1),
    .testimonials-grid .animate--visible:nth-child(1) { transition-delay: 0ms; }
    .testimonials-grid .animate-in:nth-child(2),
    .testimonials-grid .animate--visible:nth-child(2) { transition-delay: 150ms; }
    .testimonials-grid .animate-in:nth-child(3),
    .testimonials-grid .animate--visible:nth-child(3) { transition-delay: 300ms; }

    /* Mobile nav hamburger to X animation */
    @media (max-width: 768px) {
      .nav-links {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(255,255,255,0.98);
        backdrop-filter: blur(12px);
        flex-direction: column;
        padding: 24px;
        gap: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
      }
      .nav-links.active,
      .nav-links.open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      .nav-toggle.active span:nth-child(1),
      .nav-toggle.open span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      .nav-toggle.active span:nth-child(2),
      .nav-toggle.open span:nth-child(2) {
        opacity: 0;
      }
      .nav-toggle.active span:nth-child(3),
      .nav-toggle.open span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
      }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// 5. Counter Animation
// ---------------------------------------------------------------------------

function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter, .stat-number, .phil-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const text = el.textContent.trim();
  const dataTarget = el.getAttribute('data-target');

  // Use data-target if available, otherwise parse from text
  let targetText = dataTarget || text;

  // Extract numeric part and suffix
  // Handles: "13", "80%", "$2.99", "24/7", "5"
  const match = targetText.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return; // non-numeric like "24/7" stays as-is

  const prefix = match[1];  // e.g. "$"
  const target = parseFloat(match[2]);
  const suffix = match[3];  // e.g. "%", "/mo"
  const isFloat = match[2].includes('.');
  const decimals = isFloat ? (match[2].split('.')[1]?.length || 0) : 0;

  // Skip things like "24/7" that won't parse cleanly
  if (isNaN(target)) return;

  const duration = 2000;
  const startTime = performance.now();

  // Easing: ease-out cubic
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const current = easedProgress * target;

    if (isFloat) {
      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
    } else {
      el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Ensure final value is exact
      el.textContent = `${prefix}${isFloat ? target.toFixed(decimals) : target}${suffix}`;
    }
  };

  requestAnimationFrame(step);
}

// ---------------------------------------------------------------------------
// 6. Sticky Mobile CTA Bar
// ---------------------------------------------------------------------------

function initMobileCTABar() {
  const ctaBar = document.querySelector('.mobile-cta-bar');
  const hero = document.querySelector('.hero');
  if (!ctaBar || !hero) return;

  const handler = () => {
    if (window.innerWidth >= 768) {
      ctaBar.classList.remove('mobile-cta-bar--visible');
      return;
    }

    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      ctaBar.classList.add('mobile-cta-bar--visible');
    } else {
      ctaBar.classList.remove('mobile-cta-bar--visible');
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  window.addEventListener('resize', debounce(handler, 100), { passive: true });
}

// ---------------------------------------------------------------------------
// 7. Particle Background (Canvas)
// ---------------------------------------------------------------------------

function initParticleBackground() {
  const container = document.querySelector('.hero-particles') || document.getElementById('particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let animFrameId = null;
  let particles = [];

  const resize = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };

  const isMobile = () => window.innerWidth < 768;
  const particleCount = () => isMobile() ? 25 : 50;
  const connectionDistance = 100;

  const createParticles = () => {
    const count = particleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        // Teal or white with low opacity
        color: Math.random() > 0.5
          ? `rgba(42, 143, 143, ${Math.random() * 0.3 + 0.1})`
          : `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15;
          ctx.strokeStyle = `rgba(42, 143, 143, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and move particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(draw);
  };

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', debounce(() => {
    resize();
    createParticles();
  }, 200), { passive: true });
}

// ---------------------------------------------------------------------------
// 8. Active Nav Link Highlighting
// ---------------------------------------------------------------------------

function initActiveNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ---------------------------------------------------------------------------
// 9. FAQ Accordion
// ---------------------------------------------------------------------------

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item, .faq__item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question, .faq__question');
    const answer = item.querySelector('.faq-answer, .faq__answer');
    if (!question || !answer) return;

    // Set initial closed state
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
    answer.style.opacity = '0';

    question.style.cursor = 'pointer';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq--open');

      // Close all others first (only one open at a time)
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('faq--open');
          const otherAnswer = other.querySelector('.faq-answer, .faq__answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.opacity = '0';
          }
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('faq--open');
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
      } else {
        item.classList.add('faq--open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 10. Comparison Table Scroll Indicator
// ---------------------------------------------------------------------------

function initCompareTableIndicator() {
  const wrapper = document.querySelector('.compare-table-wrapper');
  if (!wrapper) return;

  // Only show on mobile
  if (window.innerWidth >= 768) return;

  // Create indicator element
  const indicator = document.createElement('div');
  indicator.className = 'table-scroll-indicator';
  indicator.textContent = 'scroll \u2192';
  indicator.style.cssText = `
    text-align: center;
    padding: 8px;
    font-size: 13px;
    color: rgba(42, 143, 143, 0.7);
    letter-spacing: 0.5px;
    transition: opacity 0.3s ease;
  `;
  wrapper.parentNode.insertBefore(indicator, wrapper);

  // Hide once user scrolls the table
  let hidden = false;
  wrapper.addEventListener('scroll', () => {
    if (!hidden && wrapper.scrollLeft > 20) {
      hidden = true;
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }, { passive: true });
}
