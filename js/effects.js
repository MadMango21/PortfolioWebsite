(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll progress bar ────────────────────────────────────────────────────
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);

  // ── Back-to-top button ─────────────────────────────────────────────────────
  const btt = document.createElement('button');
  btt.id    = 'back-to-top';
  btt.title = 'Back to top';
  btt.innerHTML = '&#8679;'; // ↑
  document.body.appendChild(btt);
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    const ratio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (ratio * 100) + '%';
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // ── Scroll reveal (Intersection Observer) ─────────────────────────────────
  const TARGETS = [
    // selector,                         direction,    stagger?
    ['#about .col-md-5',                 'from-left',  false],
    ['#about .col-md-7',                 'from-right', false],
    ['.section h2',                      '',           false],
    ['.subHeading',                      '',           false],
    ['.skill-card',                      '',           true ],
    ['.squareItem',                      '',           true ],
    ['.resume-card',                     '',           true ],
    ['.timeline-item:not(.right) .timeline-card', 'from-left',  false],
    ['.timeline-item.right .timeline-card',       'from-right', false],
    ['.gallery-grid a',                  '',           true ],
    ['.product-info-grid',               '',           false],
    ['.product-section',                 '',           false],
  ];

  TARGETS.forEach(([sel, dir, stagger]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (reducedMotion) { return; } // skip reveal setup entirely
      el.classList.add('reveal');
      if (dir) el.classList.add(dir);
      if (stagger) el.style.transitionDelay = (i % 8) * 0.07 + 's';
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        // Clear stagger delay after reveal so hover transitions are instant
        const el = entry.target;
        const delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000;
        setTimeout(() => { el.style.transitionDelay = '0s'; }, delay);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Page transition fade-out on navigation ────────────────────────────────
  if (!reducedMotion) {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      // Only intercept same-site page navigations (not anchors, external, mailto)
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('//') ||
          link.target === '_blank' || link.hasAttribute('data-fancybox')) return;
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = href; }, 210);
    });
  }

  // ── Scroll-spy: highlight active nav link ─────────────────────────────────
  const navLinks = document.querySelectorAll('#navigation li a[href^="#"]');
  if (navLinks.length) {
    const spySections = Array.from(navLinks)
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('nav-active', active);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    spySections.forEach(s => spyObserver.observe(s));
  }

  // ── Vanilla-tilt on portfolio cards (index.html only) ─────────────────────
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.item-link'), {
      max:            8,
      speed:          400,
      glare:          true,
      'max-glare':    0.12,
      perspective:    800,
      transition:     true,
    });
  }

}());
