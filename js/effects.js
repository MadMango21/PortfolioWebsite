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

  // ── Arabesque vine leaf glow on hover ────────────────────────────────────
  (function () {
    const borders = document.querySelectorAll('.arabesque-border');
    if (!borders.length) return;

    const TILE_H = 240, W = 90;
    const ORANGE = 'rgba(232,132,74,1)';
    const ROSE   = 'rgba(212,84,122,1)';

    // Each leaf: { path2d, cx, cy, r, color }
    // cx/cy = approximate centre in SVG tile space, r = hit radius
    const LEAVES = [
      { d: 'M 22,60 C 38,46 60,43 68,53 C 76,63 70,78 55,76 C 40,74 25,66 22,60 Z', cx: 45, cy: 60,  r: 28, color: ORANGE },
      { d: 'M 22,32 C 31,23 39,27 36,35 C 33,43 24,41 22,32 Z',                      cx: 29, cy: 32,  r: 13, color: ORANGE },
      { d: 'M 22,112 L 30,120 L 22,128 L 14,120 Z',                                   cx: 22, cy: 120, r: 12, color: ORANGE },
      { d: 'M 22,180 C 38,166 60,163 68,173 C 76,183 70,198 55,196 C 40,194 25,186 22,180 Z', cx: 45, cy: 180, r: 28, color: ROSE },
      { d: 'M 22,152 C 31,143 39,147 36,155 C 33,163 24,161 22,152 Z',                cx: 29, cy: 152, r: 13, color: ROSE },
    ].map(l => ({ ...l, path2d: new Path2D(l.d) }));

    borders.forEach(border => {
      const isRight = border.classList.contains('arabesque-right');

      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:3;';
      border.appendChild(canvas);

      let active = null;

      function resize() {
        canvas.width  = W;
        canvas.height = border.offsetHeight || 2000;
        draw();
      }

      function draw() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, W, canvas.height);
        if (!active) return;
        ctx.save();
        if (isRight) {
          ctx.translate(W, active.tileOffset);
          ctx.scale(-1, 1);
        } else {
          ctx.translate(0, active.tileOffset);
        }
        ctx.shadowColor = active.color;
        ctx.shadowBlur  = 22;
        ctx.strokeStyle = active.color;
        ctx.lineWidth   = 2.5;
        ctx.fillStyle   = active.color.replace('1)', '0.4)');
        ctx.fill(active.path2d);
        ctx.stroke(active.path2d);
        ctx.restore();
      }

      border.addEventListener('mousemove', e => {
        const rect  = border.getBoundingClientRect();
        const svgX  = isRight ? W - (e.clientX - rect.left) : (e.clientX - rect.left);
        const screenY = e.clientY - rect.top;
        const tileOffset = Math.floor(screenY / TILE_H) * TILE_H;
        const tileY = screenY - tileOffset;

        let best = null, bestDist = Infinity;
        for (const leaf of LEAVES) {
          const dx = svgX - leaf.cx, dy = tileY - leaf.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < leaf.r && dist < bestDist) {
            bestDist = dist;
            best = { path2d: leaf.path2d, color: leaf.color, tileOffset };
          }
        }

        if (best !== active) { active = best; draw(); }
      });

      border.addEventListener('mouseleave', () => { active = null; draw(); });

      new ResizeObserver(resize).observe(border);
      resize();
    });
  }());

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
