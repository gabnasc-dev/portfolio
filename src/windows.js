/**
 * Gerenciador mínimo de janelas flutuantes: cria, empilha, arrasta e fecha.
 */

const host = () => document.getElementById('windows');
let z = 100;
const open = new Map();

export function openWindow({ id, title, width = 460, height = 'auto', x, y, body, onClose }) {
  if (open.has(id)) {
    focusWindow(id);
    return open.get(id);
  }

  const w = typeof width === 'number' ? Math.min(width, window.innerWidth - 32) : width;

  const el = document.createElement('div');
  el.className = 'fwin win';
  el.dataset.winId = id;
  el.style.width = typeof w === 'number' ? `${w}px` : w;
  el.style.zIndex = String(++z);

  const left = Math.max(12, x ?? Math.round((window.innerWidth - (typeof w === 'number' ? w : 460)) / 2));
  const top = Math.max(12, y ?? Math.round(window.innerHeight * 0.16));
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;

  el.innerHTML = `
    <header class="win__bar">
      <div class="win__id">
        <span class="win__dot"></span>
        <span class="win__title">${title}</span>
      </div>
      <div class="win__ctrls">
        <button class="win__btn win__btn--close" data-close aria-label="Fechar">&#10005;</button>
      </div>
    </header>
    <div class="fwin__body"></div>`;

  const bodyEl = el.querySelector('.fwin__body');
  if (typeof body === 'string') bodyEl.innerHTML = body;
  else if (body instanceof Node) bodyEl.appendChild(body);

  if (height !== 'auto') {
    bodyEl.style.maxHeight = typeof height === 'number' ? `${height}px` : height;
  } else {
    // Cabe no que sobra abaixo do topo da janela, descontando barra de título,
    // a sysbar e uma folga — senão o conteúdo transborda da viewport.
    const HEADER = 38, SYSBAR = 30, GAP = 16;
    const available = window.innerHeight - top - HEADER - SYSBAR - GAP;
    bodyEl.style.maxHeight = `${Math.max(200, Math.min(Math.round(window.innerHeight * 0.62), available))}px`;
  }

  el.querySelector('[data-close]').addEventListener('click', () => closeWindow(id));
  el.addEventListener('pointerdown', () => focusWindow(id));
  makeDraggable(el, el.querySelector('.win__bar'));

  host().appendChild(el);
  open.set(id, { el, onClose });
  return { el, body: bodyEl };
}

export function closeWindow(id) {
  const entry = open.get(id);
  if (!entry) return;
  open.delete(id);
  entry.el.classList.add('is-closing');
  entry.onClose?.();
  setTimeout(() => entry.el.remove(), 260);
}

export function closeAllWindows() {
  for (const id of [...open.keys()]) closeWindow(id);
}

export function isWindowOpen(id) { return open.has(id); }

export function focusWindow(id) {
  const entry = open.get(id);
  if (entry) entry.el.style.zIndex = String(++z);
}

function makeDraggable(el, handle) {
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;

  handle.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    ox = el.offsetLeft; oy = el.offsetTop;
    el.classList.add('is-dragging');
    handle.setPointerCapture(e.pointerId);
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const nx = ox + (e.clientX - sx);
    const ny = oy + (e.clientY - sy);
    el.style.left = `${Math.max(-el.offsetWidth + 90, Math.min(window.innerWidth - 90, nx))}px`;
    el.style.top = `${Math.max(0, Math.min(window.innerHeight - 46, ny))}px`;
  });

  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('is-dragging');
    try { handle.releasePointerCapture(e.pointerId); } catch { /* já liberado */ }
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}
