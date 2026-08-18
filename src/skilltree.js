import { skills, skillEdges } from './data.js';
import { escapeHTML } from './terminal.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const R = 46;
const R_CORE = 58;

const GROUP_LABEL = {
  core: 'NÚCLEO',
  backend: 'BACKEND',
  frontend: 'FRONTEND',
  data: 'DADOS',
  infra: 'INFRAESTRUTURA',
};

let built = false;
let svg, tip, wrap;

export function initSkillTree() {
  if (built) return;
  built = true;

  svg = document.getElementById('skilltree-svg');
  tip = document.getElementById('skilltip');
  wrap = document.getElementById('skilltree');

  const byId = Object.fromEntries(skills.map((s) => [s.id, s]));
  const gEdges = document.createElementNS(SVG_NS, 'g');
  svg.appendChild(gEdges);
  const gNodes = document.createElementNS(SVG_NS, 'g');
  svg.appendChild(gNodes);

  const edgeEls = [];
  skillEdges.forEach(([a, b], i) => {
    const na = byId[a], nb = byId[b];
    if (!na || !nb) return;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'sk-edge');
    path.setAttribute('d', curve(na, nb));
    path.dataset.a = a;
    path.dataset.b = b;

    const len = path.getTotalLength?.() ?? 400;
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1), stroke .3s, stroke-width .3s, opacity .3s';
    requestAnimationFrame(() => {
      setTimeout(() => { path.style.strokeDashoffset = '0'; }, 120 + i * 55);
    });

    gEdges.appendChild(path);
    edgeEls.push(path);
  });

  const nodeEls = [];
  skills.forEach((s, i) => {
    const isCore = s.tier === 0;
    const r = isCore ? R_CORE : R;

    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', `sk-node${isCore ? ' sk-node--core' : ''}`);
    g.setAttribute('transform', `translate(${s.x} ${s.y})`);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `${s.name}${isCore ? '' : ` — ${s.level}%`}`);
    g.dataset.id = s.id;
    g.style.opacity = '0';
    g.style.transition = 'opacity .5s cubic-bezier(.22,1,.36,1), transform .35s cubic-bezier(.22,1,.36,1)';

    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('class', 'sk-node__ring');
    ring.setAttribute('r', String(r));
    g.appendChild(ring);

    if (!isCore) {
      const arc = document.createElementNS(SVG_NS, 'circle');
      arc.setAttribute('class', 'sk-node__arc');
      arc.setAttribute('r', String(r));
      const c = 2 * Math.PI * r;
      arc.setAttribute('transform', 'rotate(-90)');
      arc.style.strokeDasharray = `${c} ${c}`;
      arc.style.strokeDashoffset = String(c);
      arc.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)';
      setTimeout(() => {
        arc.style.strokeDashoffset = String(c * (1 - s.level / 100));
      }, 420 + i * 60);
      g.appendChild(arc);

      const pct = document.createElementNS(SVG_NS, 'text');
      pct.setAttribute('class', 'sk-node__pct');
      pct.setAttribute('y', '15');
      pct.textContent = `${s.level}%`;
      g.appendChild(pct);
    } else {
      const pulse = document.createElementNS(SVG_NS, 'circle');
      pulse.setAttribute('class', 'sk-pulse');
      pulse.setAttribute('r', '3.5');
      pulse.setAttribute('cy', String(-R_CORE));
      const anim = document.createElementNS(SVG_NS, 'animateTransform');
      anim.setAttribute('attributeName', 'transform');
      anim.setAttribute('type', 'rotate');
      anim.setAttribute('from', '0 0 0');
      anim.setAttribute('to', '360 0 0');
      anim.setAttribute('dur', '9s');
      anim.setAttribute('repeatCount', 'indefinite');
      pulse.appendChild(anim);
      g.appendChild(pulse);
    }

    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('class', 'sk-node__label');
    label.setAttribute('y', isCore ? '5' : '-3');
    label.textContent = s.name;
    g.appendChild(label);

    setTimeout(() => { g.style.opacity = '1'; }, 260 + i * 55);

    const enter = (e) => {
      highlight(s.id, edgeEls, nodeEls, byId);
      if (e?.clientX != null) moveTip(e);
      else placeTipAtNode(g);
    };
    const leave = () => clearHighlight(edgeEls, nodeEls);

    g.addEventListener('pointerenter', enter);
    g.addEventListener('pointerleave', leave);
    g.addEventListener('focus', enter);
    g.addEventListener('blur', leave);
    g.addEventListener('pointermove', (e) => moveTip(e));

    gNodes.appendChild(g);
    nodeEls.push(g);
  });
}

function curve(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const bow = Math.min(46, d * 0.13);
  const cx = mx + (-dy / d) * bow;
  const cy = my + (dx / d) * bow;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function highlight(id, edgeEls, nodeEls, byId) {
  const neighbors = new Set([id]);
  for (const e of edgeEls) {
    if (e.dataset.a === id) neighbors.add(e.dataset.b);
    if (e.dataset.b === id) neighbors.add(e.dataset.a);
  }

  for (const e of edgeEls) {
    const lit = e.dataset.a === id || e.dataset.b === id;
    e.classList.toggle('is-lit', lit);
    e.classList.toggle('is-dim', !lit);
  }
  for (const n of nodeEls) {
    n.classList.toggle('is-dim', !neighbors.has(n.dataset.id));
  }

  const s = byId[id];
  if (!s) return;
  tip.innerHTML = `
    <div class="skilltip__name">${escapeHTML(s.name)}</div>
    <div class="skilltip__group">${GROUP_LABEL[s.group] ?? s.group.toUpperCase()}</div>
    <div class="skilltip__desc">${escapeHTML(s.desc)}</div>
    ${s.tier === 0 ? '' : `<div class="skilltip__meter"><i style="width:${s.level}%"></i></div>`}`;
  tip.classList.add('is-on');
}

function clearHighlight(edgeEls, nodeEls) {
  for (const e of edgeEls) e.classList.remove('is-lit', 'is-dim');
  for (const n of nodeEls) n.classList.remove('is-dim');
  tip.classList.remove('is-on');
}

function placeTipAtNode(g) {
  const box = wrap.getBoundingClientRect();
  const nb = g.getBoundingClientRect();
  placeTip(nb.right - box.left + 14, nb.top - box.top, box);
}

function moveTip(e) {
  const box = wrap.getBoundingClientRect();
  placeTip(e.clientX - box.left + 20, e.clientY - box.top + 16, box);
}

function placeTip(rawX, rawY, box) {
  let x = rawX;
  let y = rawY;
  const tw = tip.offsetWidth || 260;
  const th = tip.offsetHeight || 120;
  if (x + tw > box.width) x = rawX - tw - 40;
  if (y + th > box.height) y = rawY - th - 32;
  x = Math.max(0, Math.min(x, Math.max(0, box.width - tw)));
  y = Math.max(0, Math.min(y, Math.max(0, box.height - th)));
  tip.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
}
