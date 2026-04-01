(function () {
  // Skip on touch devices (no cursor to style)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // ── Elements ───────────────────────────────────────────────────────────────
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  // Trail canvas (screen-blended so sparks glow over everything)
  const tc = document.createElement('canvas');
  tc.id = 'cursor-trail';
  document.body.appendChild(tc);
  const ctx = tc.getContext('2d');

  function resizeTrail() {
    tc.width  = window.innerWidth;
    tc.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail, { passive: true });

  // ── Mouse state ────────────────────────────────────────────────────────────
  let mx = -200, my = -200;
  let rx = -200, ry = -200;   // ring lerp position
  let ringRot = 0;
  let isHovering = false;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // ── Hover state ────────────────────────────────────────────────────────────
  const HOVER_SEL = 'a, button, .item, .skill-card, .squareItem, .timeline-card, .resume-card, .cta-btn, .contactButton, input, textarea, #filters li';

  function addHoverListeners() {
    document.querySelectorAll(HOVER_SEL).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hovering');
        ring.classList.add('is-hovering');
        isHovering = true;
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
        isHovering = false;
      });
    });
  }
  // Run after DOM is ready (script is at bottom of body so it's immediate)
  addHoverListeners();

  // ── Trail sparks ───────────────────────────────────────────────────────────
  const palette = [[232,132,74],[212,84,122],[255,190,80],[255,120,50]];
  const sparks  = [];
  let lastSx = -999, lastSy = -999;

  function emitSpark() {
    const c = palette[Math.floor(Math.random() * palette.length)];
    sparks.push({
      x:  mx + (Math.random() - 0.5) * 6,
      y:  my + (Math.random() - 0.5) * 6,
      r:  Math.random() * 1.8 + 0.6,
      c,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(Math.random() * 1.8 + 0.4),
      a:  0.9,
    });
  }

  // ── Click burst ────────────────────────────────────────────────────────────
  const ripples = [];  // expanding ring waves
  const burst   = [];  // radial spark burst

  document.addEventListener('mousedown', () => {
    // Two concentric ripple rings staggered slightly
    ripples.push({ x: mx, y: my, r: 4,  a: 0.9, delay: 0  });
    ripples.push({ x: mx, y: my, r: 4,  a: 0.6, delay: 6  });

    // 16 sparks fired radially outward
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      const c     = palette[Math.floor(Math.random() * palette.length)];
      burst.push({
        x:  mx,
        y:  my,
        r:  Math.random() * 2.2 + 0.8,
        c,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        a:  1.0,
      });
    }
  });

  // ── Animation loop ─────────────────────────────────────────────────────────
  function animate() {
    // Position dot instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Lazy ring follow
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    // Only rotate when not hovering — hover state uses CSS pulse instead
    if (!isHovering) ringRot += 0.6;
    ring.style.left      = rx + 'px';
    ring.style.top       = ry + 'px';
    ring.style.transform = `translate(-50%, -50%) rotate(${ringRot}deg)`;

    // Emit spark when cursor has moved enough
    const dx = mx - lastSx, dy = my - lastSy;
    if (dx*dx + dy*dy > 25) {
      emitSpark();
      lastSx = mx; lastSy = my;
    }

    // Draw + age everything
    ctx.clearRect(0, 0, tc.width, tc.height);

    // Ripple rings
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      if (rp.delay > 0) { rp.delay--; continue; }
      rp.r += 3.5;
      rp.a -= 0.028;
      if (rp.a <= 0) { ripples.splice(i, 1); continue; }
      const [rr, rg, rb] = isHovering ? [212, 84, 122] : [232, 132, 74];
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${rp.a.toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Burst sparks
    for (let i = burst.length - 1; i >= 0; i--) {
      const b = burst[i];
      b.x  += b.vx;
      b.y  += b.vy;
      b.vx *= 0.93;   // friction
      b.vy *= 0.93;
      b.vy += 0.08;   // gravity
      b.a  -= 0.025;
      if (b.a <= 0) { burst.splice(i, 1); continue; }

      const [r, g, bl] = b.c;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 4);
      grad.addColorStop(0, `rgba(${r},${g},${bl},${b.a.toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${bl},${Math.min(b.a * 2, 1).toFixed(3)})`;
      ctx.fill();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.04;    // gentle gravity
      s.a  -= 0.032;
      if (s.a <= 0) { sparks.splice(i, 1); continue; }

      const [r, g, b] = s.c;
      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      grad.addColorStop(0, `rgba(${r},${g},${b},${s.a.toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(s.a * 1.5, 1).toFixed(3)})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}());
