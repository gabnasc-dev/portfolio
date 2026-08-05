/**
 * Constelação de projetos: cada estrela é um projeto. Clicar leva a
 * câmera até ela e abre a janela de detalhes.
 */

import { projects, constellationEdges } from './data.js';
import { openWindow, closeWindow, isWindowOpen } from './windows.js';
import { escapeHTML } from './terminal.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

let space, starsHost, linksSvg;
let selected = null;
let built = false;

export function initConstellation() {
  space = document.getElementById('constellation');
  starsHost = document.getElementById('constellation-stars');
  linksSvg = document.getElementById('constellation-links');
  if (built) return;
  built = true;

  // Estrelas
  projects.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = `star star--${p.status}`;
    btn.dataset.projectId = p.id;
    btn.style.left = `${p.x}%`;
    btn.style.top = `${p.y}%`;
    btn.style.setProperty('--size', `${(p.mag * 11).toFixed(1)}px`);
    btn.style.setProperty('--tw', `${(2.4 + i * 0.42).toFixed(2)}s`);
    btn.style.animationDelay = `${0.15 + i * 0.09}s`;
    btn.setAttribute('aria-label', `Projeto ${p.name}`);
    btn.innerHTML = `
      <span class="star__halo"></span>
      <span class="star__core"></span>
      <span class="star__label">
        <span class="star__name">${escapeHTML(p.name)}</span>
        <span class="star__meta">${p.star} · ${p.status} · ${p.year}</span>
      </span>`;
    btn.addEventListener('click', () => selectStar(p.id));
    starsHost.appendChild(btn);
  });

  // Linhas entre estrelas
  drawLinks();
  window.addEventListener('resize', drawLinks);
}

function drawLinks() {
  if (!linksSvg) return;
  linksSvg.innerHTML = '';
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  constellationEdges.forEach(([a, b], i) => {
    const pa = byId[a], pb = byId[b];
    if (!pa || !pb) return;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', `${pa.x}%`);
    line.setAttribute('y1', `${pa.y}%`);
    line.setAttribute('x2', `${pb.x}%`);
    line.setAttribute('y2', `${pb.y}%`);
    line.style.animationDelay = `${0.4 + i * 0.1}s, 0s`;
    linksSvg.appendChild(line);
  });
}

/** Move a câmera até a estrela e abre o detalhe. */
export function selectStar(id) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;

  if (selected === id && isWindowOpen(`proj-${id}`)) return;
  if (selected) closeWindow(`proj-${selected}`);
  selected = id;

  starsHost.querySelectorAll('.star').forEach((s) => {
    const isIt = s.dataset.projectId === id;
    s.classList.toggle('is-selected', isIt);
    s.classList.toggle('is-dimmed', !isIt);
  });

  // A estrela vai para a esquerda da tela; a janela ocupa a direita.
  const wide = window.innerWidth > 900;
  const targetX = wide ? 28 : 50;
  const targetY = wide ? 44 : 26;
  const scale = wide ? 1.55 : 1.25;

  const dx = (targetX - p.x) * scale;
  const dy = (targetY - p.y) * scale;
  space.style.transform = `scale(${scale}) translate(${dx}%, ${dy}%)`;

  setTimeout(() => openProjectWindow(p), 420);
}

export function resetCamera() {
  if (!space) return;
  space.style.transform = '';
  starsHost?.querySelectorAll('.star').forEach((s) => {
    s.classList.remove('is-selected', 'is-dimmed');
  });
  if (selected) closeWindow(`proj-${selected}`);
  selected = null;
}

function openProjectWindow(p) {
  const wide = window.innerWidth > 900;
  const width = wide ? 480 : Math.min(440, window.innerWidth - 28);

  const html = `
    <div class="proj__head">
      <h2 class="proj__title">${escapeHTML(p.name)}</h2>
      <span class="badge badge--${p.status}">${p.status}</span>
    </div>
    <p class="proj__star">ESTRELA ${p.star.toUpperCase()} · CATÁLOGO ${p.year}</p>
    <p class="proj__tagline">${escapeHTML(p.tagline)}</p>
    <p class="proj__desc">${escapeHTML(p.desc)}</p>

    <p class="proj__section-title">DESTAQUES</p>
    <ul class="proj__list">
      ${p.highlights.map((h) => `<li>${escapeHTML(h)}</li>`).join('')}
    </ul>

    <p class="proj__section-title">STACK</p>
    <div class="chips">${p.tech.map((t) => `<span class="chip">${escapeHTML(t)}</span>`).join('')}</div>

    <div class="proj__actions">
      ${p.link
        ? `<a class="btn" href="${p.link}" target="_blank" rel="noopener noreferrer">Abrir repositório &#8599;</a>`
        : `<span class="btn" aria-disabled="true">Em desenvolvimento</span>`}
      <button class="btn btn--ghost" data-close-proj>Fechar</button>
    </div>`;

  const win = openWindow({
    id: `proj-${p.id}`,
    title: `~/projects/${p.id}.md`,
    width,
    x: wide ? Math.round(window.innerWidth * 0.54) : undefined,
    y: wide ? Math.round(window.innerHeight * 0.15) : Math.round(window.innerHeight * 0.42),
    body: html,
    onClose: () => {
      if (selected === p.id) {
        selected = null;
        space.style.transform = '';
        starsHost.querySelectorAll('.star').forEach((s) => {
          s.classList.remove('is-selected', 'is-dimmed');
        });
      }
    },
  });

  win?.el.querySelector('[data-close-proj]')?.addEventListener('click', () => {
    closeWindow(`proj-${p.id}`);
  });
}
