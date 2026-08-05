/**
 * Lanterna que segue o cursor.
 *
 * Implementada como um elemento de tamanho fixo movido por `transform`,
 * e não como um gradiente de viewport inteira reposicionado por variáveis
 * CSS. A diferença é grande: mudar `--mx/--my` obriga o navegador a
 * repintar um gradiente do tamanho da tela a cada frame — no Firefox isso
 * sozinho derruba o frame rate. Movendo uma camada já pintada, o trabalho
 * por frame vira só composição.
 */
export function initTorch(el) {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;
  let running = false;
  let on = false;

  function apply() {
    // Amortecimento leve: a luz "arrasta" um pouco atrás do cursor
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
