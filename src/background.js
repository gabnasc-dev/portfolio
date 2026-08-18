const STAR_DENSITY = 1 / 5200;
const PARTICLE_DENSITY = 1 / 30000;
const MAX_PARTICLES = 58;
const MAX_LIVE_STARS = 70;
const LINK_DIST = 132;
const LINK_TIERS = 3;

export function initBackground(canvas, fxCanvas) {
  const nctx = canvas.getContext('2d', { alpha: false });
  const ctx = fxCanvas.getContext('2d');

  let w = 0, h = 0, dpr = 1;
  let liveStars = [];
  let bakedStars = [];
  let particles = [];
  let meteors = [];
  let raf = 0;
  let t = 0;
  let paused = false;
  const pointer = { x: -9999, y: -9999 };

  const rand = (a, b) => a + Math.random() * (b - a);

  const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;

  function seed() {
    const total = Math.min(340, Math.floor(w * h * STAR_DENSITY));
    const all = Array.from({ length: total }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.pow(Math.random(), 2.4) * 1.5 + 0.35,
      base: rand(0.25, 0.9),
      sp: rand(0.4, 1.7),
      ph: rand(0, Math.PI * 2),
      hue: Math.random() < 0.8 ? 'rgba(200, 224, 255,' : 'rgba(150, 195, 255,',
    }));

    all.sort((a, b) => b.r - a.r);
    liveStars = all.slice(0, MAX_LIVE_STARS);
    bakedStars = all.slice(MAX_LIVE_STARS);

    const cap = lowPower ? 34 : MAX_PARTICLES;
    const nPart = Math.min(cap, Math.floor(w * h * PARTICLE_DENSITY));
    particles = Array.from({ length: nPart }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.12, 0.12),
      vy: rand(-0.09, 0.09),
      r: rand(0.6, 1.5),
      a: rand(0.2, 0.55),
    }));
  }

  function paintNebula() {
    const base = nctx.createLinearGradient(0, 0, w * 0.4, h);
    base.addColorStop(0, '#04060f');
    base.addColorStop(0.55, '#050914');
    base.addColorStop(1, '#03050d');
    nctx.fillStyle = base;
    nctx.fillRect(0, 0, w, h);

    nctx.globalCompositeOperation = 'screen';
    const clouds = [
      { x: 0.24, y: 0.30, r: 0.62, c: [30, 62, 140], a: 0.30 },
      { x: 0.74, y: 0.24, r: 0.50, c: [22, 48, 118], a: 0.24 },
      { x: 0.55, y: 0.72, r: 0.68, c: [16, 38, 96],  a: 0.26 },
      { x: 0.10, y: 0.80, r: 0.44, c: [26, 56, 128], a: 0.18 },
      { x: 0.88, y: 0.66, r: 0.42, c: [34, 70, 150], a: 0.16 },
      { x: 0.45, y: 0.42, r: 0.30, c: [58, 108, 200], a: 0.13 },
    ];
    const diag = Math.hypot(w, h);
    for (const c of clouds) {
      const g = nctx.createRadialGradient(
        c.x * w, c.y * h, 0,
        c.x * w, c.y * h, c.r * diag * 0.5
      );
      g.addColorStop(0, `rgba(${c.c[0]},${c.c[1]},${c.c[2]},${c.a})`);
      g.addColorStop(0.45, `rgba(${c.c[0]},${c.c[1]},${c.c[2]},${c.a * 0.35})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      nctx.fillStyle = g;
      nctx.fillRect(0, 0, w, h);
    }

    nctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 22; i++) {
      const x0 = rand(-0.1, 1.1) * w;
      const y0 = rand(-0.1, 1.1) * h;
      const len = rand(0.12, 0.42) * diag;
      const ang = rand(0, Math.PI * 2);
      nctx.beginPath();
      nctx.moveTo(x0, y0);
      nctx.bezierCurveTo(
        x0 + Math.cos(ang) * len * 0.4, y0 + Math.sin(ang) * len * 0.4 - rand(20, 90),
        x0 + Math.cos(ang) * len * 0.7, y0 + Math.sin(ang) * len * 0.7 + rand(20, 90),
        x0 + Math.cos(ang) * len,       y0 + Math.sin(ang) * len
      );
      nctx.strokeStyle = `rgba(70, 120, 210, ${rand(0.02, 0.055)})`;
      nctx.lineWidth = rand(12, 46);
      nctx.filter = 'blur(9px)';
      nctx.stroke();
    }
    nctx.filter = 'none';

    const dust = Math.floor(w * h / 2400);
    for (let i = 0; i < dust; i++) {
      const a = rand(0.015, 0.09);
      nctx.fillStyle = `rgba(180, 210, 255, ${a})`;
      nctx.fillRect(rand(0, w), rand(0, h), 1, 1);
    }

    for (const s of bakedStars) {
      nctx.fillStyle = `${s.hue}${s.base.toFixed(2)})`;
      nctx.beginPath();
      nctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      nctx.fill();
    }

    nctx.globalCompositeOperation = 'source-over';
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = Math.max(1, window.innerWidth || canvas.clientWidth);
    h = Math.max(1, window.innerHeight || canvas.clientHeight);
    for (const c of [canvas, fxCanvas]) {
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = w + 'px';
      c.style.height = h + 'px';
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
    paintNebula();
  }

  const tiers = Array.from({ length: LINK_TIERS }, () => []);

  let emaDt = 16.7;
  let degraded = false;
  let lastT = performance.now();
  let skipAcc = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (paused) { lastT = now; return; }

    const dt = now - lastT;
    lastT = now;
    if (dt > 0 && dt < 200) emaDt = emaDt * 0.92 + dt * 0.08;
    if (!degraded && emaDt > 24) degraded = true;
    else if (degraded && emaDt < 15) degraded = false;

    if (degraded) {
      skipAcc += dt;
      if (skipAcc < 33) return;
      skipAcc = 0;
    }

    syncSize();

    t += Math.min(dt, 50) / 1000;

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    for (const s of liveStars) {
      const tw = s.base + Math.sin(t * s.sp + s.ph) * 0.28;
      const a = Math.max(0.05, Math.min(1, tw));
      ctx.fillStyle = `${s.hue}${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.r > 1.25) {
        ctx.fillStyle = `rgba(120, 175, 255, ${a * 0.1})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

      const dxp = pointer.x - p.x;
      const dyp = pointer.y - p.y;
      const dp2 = dxp * dxp + dyp * dyp;
      if (dp2 < 40000) {
        const f = (1 - dp2 / 40000) * 0.0016;
        p.vx += dxp * f;
        p.vy += dyp * f;
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
      }

      ctx.fillStyle = `rgba(150, 200, 255, ${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!degraded) {
      for (const bucket of tiers) bucket.length = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const k = 1 - Math.sqrt(d2) / LINK_DIST;
            const tier = Math.min(LINK_TIERS - 1, (k * LINK_TIERS) | 0);
            tiers[tier].push(p.x, p.y, q.x, q.y);
          }
        }
      }

      ctx.lineWidth = 0.6;
      for (let tier = 0; tier < LINK_TIERS; tier++) {
        const pts = tiers[tier];
        if (pts.length === 0) continue;
        ctx.strokeStyle = `rgba(90, 150, 245, ${(0.045 + tier * 0.042).toFixed(3)})`;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i += 4) {
          ctx.moveTo(pts[i], pts[i + 1]);
          ctx.lineTo(pts[i + 2], pts[i + 3]);
        }
        ctx.stroke();
      }
    }

    if (Math.random() < 0.0035 && meteors.length < 2) {
      const fromLeft = Math.random() < 0.5;
      meteors.push({
        x: fromLeft ? rand(-100, w * 0.5) : rand(w * 0.5, w + 100),
        y: rand(-80, h * 0.45),
        vx: fromLeft ? rand(3.2, 5.6) : rand(-5.6, -3.2),
        vy: rand(1.6, 3.1),
        life: 1,
        len: rand(60, 150),
      });
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.008;
      if (m.life <= 0 || m.x < -220 || m.x > w + 220 || m.y > h + 220) {
        meteors.splice(i, 1);
        continue;
      }
      const nx = m.x - m.vx * (m.len / 6);
      const ny = m.y - m.vy * (m.len / 6);
      const g = ctx.createLinearGradient(m.x, m.y, nx, ny);
      g.addColorStop(0, `rgba(210, 232, 255, ${0.7 * m.life})`);
      g.addColorStop(1, 'rgba(120, 170, 255, 0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 140);
  });

  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) syncSize();
  });

  function syncSize() {
    const vw = window.innerWidth, vh = window.innerHeight;
    if (vw > 1 && vh > 1 && (Math.abs(vw - w) > 1 || Math.abs(vh - h) > 1)) resize();
  }

  resize();
  frame(performance.now());

  return {
    shockwave() {
      for (const p of particles) {
        p.vx += rand(-1.2, 1.2);
        p.vy += rand(-1.2, 1.2);
      }
      for (let i = 0; i < 3; i++) {
        meteors.push({
          x: rand(0, w), y: rand(-60, 0),
          vx: rand(-5, 5), vy: rand(3, 6),
          life: 1, len: rand(80, 170),
        });
      }
    },
    destroy() { cancelAnimationFrame(raf); },
  };
}
