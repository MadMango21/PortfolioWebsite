(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  // ── Shared state declared first ────────────────────────────────────────────
  let maskedRects = [];
  let dirty = true;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    dirty = true;
  }
  resize();
  window.addEventListener('resize',  () => resize(),              { passive: true });
  window.addEventListener('scroll',  () => { dirty = true; },     { passive: true });

  // ── Elements particles must never appear over ──────────────────────────────
  // Covers: all text content blocks, all cards, all interactive elements
  const MASK_SELECTORS = [
    // Navigation
    '.navbar',
    // Portfolio cards
    '.item',
    '#filters',
    // About section text block
    '#about .col-md-7',
    // Skills & stats
    '.skill-card',
    '.squareItem',
    // Background/experience cards
    '.resume-card',
    // Timeline cards
    '.timeline-card',
    // All section heading blocks (subheading + h2 container)
    '.section .col-md-12',
    '.section .heading',
    // Contact form
    '.contact-form-wrap',
    // Copyright text
    '.copyrightSection',
    // All images
    'img',
    // All interactive elements
    'a',
    'button',
    'input',
    'textarea',
    // Decorative borders (they have their own SVG content)
    '.arabesque-border',
  ].join(', ');

  function updateRects() {
    maskedRects = [];
    document.querySelectorAll(MASK_SELECTORS).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      // Small padding so particles clear element edges cleanly
      maskedRects.push({
        x: r.left  - 10,
        y: r.top   - 10,
        w: r.width  + 20,
        h: r.height + 20,
      });
    });
  }

  // Full canvas with holes punched out using evenodd fill rule
  function applyMask() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    for (const r of maskedRects) {
      ctx.rect(r.x, r.y, r.w, r.h);
    }
    ctx.clip('evenodd');
  }

  // ── Sunset / Arabian colour palette ────────────────────────────────────────
  const palette = [
    [232, 132,  74],
    [212,  84, 122],
    [255, 190,  80],
    [200,  80, 160],
    [255, 120,  50],
  ];

  // ── Ember particles ────────────────────────────────────────────────────────
  const EMBER_COUNT = 75;
  const embers = [];

  function makeEmber(init) {
    const c    = palette[Math.floor(Math.random() * palette.length)];
    const maxA = Math.random() * 0.45 + 0.15;
    return {
      x:      Math.random() * window.innerWidth,
      y:      init ? Math.random() * window.innerHeight : window.innerHeight + 6,
      r:      Math.random() * 1.6 + 0.4,
      c,
      speed:  Math.random() * 0.45 + 0.12,
      drift:  (Math.random() - 0.5) * 0.3,
      alpha:  Math.random() * maxA,
      dAlpha: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      maxA,
      minA:   0.04,
    };
  }

  for (let i = 0; i < EMBER_COUNT; i++) embers.push(makeEmber(true));

  // ── Geometric star watermarks (Islamic / Arabian motif) ────────────────────
  function drawGeomStar(cx, cy, size, points, alpha, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    const outer = size, inner = size * 0.42, step = Math.PI / points;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = i * step - Math.PI / 2;
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
              : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(232, 140, 74, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  const geoStars = [];
  for (let i = 0; i < 7; i++) {
    geoStars.push({
      x:        Math.random() * window.innerWidth,
      y:        Math.random() * window.innerHeight,
      size:     Math.random() * 55 + 35,
      points:   Math.random() > 0.5 ? 8 : 6,
      alpha:    Math.random() * 0.055 + 0.02,
      rot:      Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.0008,
      dx:       (Math.random() - 0.5) * 0.08,
      dy:       (Math.random() - 0.5) * 0.04,
    });
  }

  // ── Animation loop ─────────────────────────────────────────────────────────
  function animate() {
    if (dirty) { updateRects(); dirty = false; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    applyMask();

    // Geometric stars
    for (const s of geoStars) {
      s.rot += s.rotSpeed;
      s.x   += s.dx;
      s.y   += s.dy;
      if (s.x < -s.size)                 s.x = canvas.width  + s.size;
      if (s.x >  canvas.width  + s.size) s.x = -s.size;
      if (s.y < -s.size)                 s.y = canvas.height + s.size;
      if (s.y >  canvas.height + s.size) s.y = -s.size;
      drawGeomStar(s.x, s.y, s.size, s.points, s.alpha, s.rot);
    }

    // Ember particles
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.y     -= e.speed;
      e.x     += e.drift;
      e.alpha += e.dAlpha;
      if (e.alpha >= e.maxA || e.alpha <= e.minA) e.dAlpha *= -1;
      if (e.y < -10) { embers[i] = makeEmber(false); continue; }

      const [r, g, b] = e.c;

      const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6);
      grad.addColorStop(0, `rgba(${r},${g},${b},${(e.alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(e.alpha * 2.2, 1).toFixed(3)})`;
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(animate);
  }

  animate();
}());
