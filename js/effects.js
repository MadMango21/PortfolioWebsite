(function () {

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
