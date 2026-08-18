export function initTorch(el) {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;
  let running = false;
  let on = false;

  function apply() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

    if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
      requestAnimationFrame(apply);
    } else {
      running = false;
    }
  }

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!on) { on = true; el.classList.add('is-on'); }
    if (!running) { running = true; requestAnimationFrame(apply); }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    on = false;
    el.classList.remove('is-on');
  });
}
