import { initBackground } from './background.js';
import { initTorch } from './torch.js';
import { Terminal, sleep } from './terminal.js';
import { runCommand, buildCompleter, printBanner } from './commands.js';
import { initConstellation, selectStar, resetCamera } from './constellation.js';
import { initSkillTree } from './skilltree.js';
import { closeAllWindows } from './windows.js';
import { launchKonami } from './games.js';
import { profile } from './data.js';

let bg = { shockwave() {}, destroy() {} };
try {
  bg = initBackground(
    document.getElementById('space'),
    document.getElementById('space-fx')
  );
} catch (e) {
  console.warn('NebulaOS: fundo indisponível —', e);
}
initTorch(document.getElementById('torch'));

const worldEl = document.getElementById('world');
const layerTerminal = document.getElementById('layer-terminal');
const layerConstellation = document.getElementById('layer-constellation');
const layerSkills = document.getElementById('layer-skills');
const termWindow = document.getElementById('terminal-window');

let view = 'terminal';

const camera = {
  toConstellation() {
    if (view === 'constellation') return;
    view = 'constellation';
    initConstellation();
    layerTerminal.classList.add('is-receding');
    layerTerminal.classList.remove('is-active');
    layerTerminal.setAttribute('aria-hidden', 'true');
    layerConstellation.classList.add('is-active');
    layerConstellation.removeAttribute('aria-hidden');
  },

  toSkills() {
    if (view === 'skills') return;
    view = 'skills';
    initSkillTree();
    layerTerminal.classList.add('is-receding');
    layerTerminal.classList.remove('is-active');
    layerTerminal.setAttribute('aria-hidden', 'true');
    layerSkills.classList.add('is-active');
    layerSkills.removeAttribute('aria-hidden');
  },

  toTerminal() {
    if (view === 'terminal') return;
    view = 'terminal';
    closeAllWindows();
    resetCamera();
    layerConstellation.classList.remove('is-active');
    layerConstellation.setAttribute('aria-hidden', 'true');
    layerSkills.classList.remove('is-active');
    layerSkills.setAttribute('aria-hidden', 'true');
    layerTerminal.classList.remove('is-receding');
    layerTerminal.classList.add('is-active');
    layerTerminal.removeAttribute('aria-hidden');
    setTimeout(() => term.input.focus({ preventScroll: true }), 320);
  },

  selectProject(id) { selectStar(id); },

  shutdown() {
    worldEl.style.transition = 'opacity .9s cubic-bezier(.65,0,.35,1), filter .9s';
    worldEl.style.opacity = '0';
    worldEl.style.filter = 'blur(10px)';
    closeAllWindows();
    setTimeout(() => {
      worldEl.style.opacity = '';
      worldEl.style.filter = '';
      term.clear();
      printBanner(term);
      term.spacer();
      term.printText('Sessão restaurada. O sistema não permite ficar sozinho por muito tempo.', 'c-dim');
      term.spacer();
    }, 2200);
  },
};

const world = {
  glitch() {
    worldEl.classList.remove('is-glitching');
    void worldEl.offsetWidth;
    worldEl.classList.add('is-glitching');
    bg.shockwave();
    setTimeout(() => worldEl.classList.remove('is-glitching'), 650);
  },
};

const term = new Terminal(document.getElementById('term'));
term.completions = buildCompleter(term);
term.onCommand = (cmd) => runCommand(cmd, { term, camera, world, bg });

document.getElementById('terminal-bar').addEventListener('click', (e) => {
  const action = e.target.closest('[data-win-action]')?.dataset.winAction;
  if (!action) return;

  if (action === 'minimize') {
    termWindow.classList.toggle('is-minimized');
    termWindow.classList.remove('is-maximized');
  } else if (action === 'maximize') {
    termWindow.classList.toggle('is-maximized');
    termWindow.classList.remove('is-minimized');
  } else if (action === 'close') {
    term.submit('exit');
  }
});

document.querySelectorAll('[data-back]').forEach((b) => {
  b.addEventListener('click', () => camera.toTerminal());
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && view !== 'terminal') {
    camera.toTerminal();
  }
});

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];
let konamiIdx = 0;
window.addEventListener('keydown', (e) => {
  const expected = KONAMI[konamiIdx];
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === expected) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      world.glitch();
      launchKonami();
    }
  } else {
    konamiIdx = key === KONAMI[0] ? 1 : 0;
  }
});

const clock = document.getElementById('status-clock');
function tickClock() {
  clock.textContent = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit',
  });
}
tickClock();
setInterval(tickClock, 20000);

const BOOT_LINES = [
  'NebulaOS BIOS v2.5.0 — Nebula Systems',
  'Verificando integridade do núcleo…  <i>ok</i>',
  'Montando /home/gabriel…  <i>ok</i>',
  'Calibrando sensores de longo alcance…  <i>ok</i>',
  'Carregando catálogo estelar (setor 07)…  <i>ok</i>',
  'Restaurando sessão de <b>' + profile.handle + '</b>…',
  'Iniciando shell <b>nsh</b>…',
];

async function boot() {
  const bootEl = document.getElementById('boot');
  const logEl = document.getElementById('boot-log');
  const barEl = document.getElementById('boot-bar-fill');

  if (sessionStorage.getItem('nebula.booted')) {
    bootEl.classList.add('is-done');
    await welcome({ fast: true });
    return;
  }
  sessionStorage.setItem('nebula.booted', '1');

  for (let i = 0; i < BOOT_LINES.length; i++) {
    logEl.innerHTML += BOOT_LINES[i] + '\n';
    barEl.style.transform = `scaleX(${((i + 1) / BOOT_LINES.length).toFixed(3)})`;
    await sleep(190 + Math.random() * 150);
  }
  await sleep(340);
  bootEl.classList.add('is-done');
  await sleep(420);
  await welcome({ fast: false });
}

async function welcome({ fast }) {
  printBanner(term);
  term.spacer();

  const lines = [
    `<span class="c-mute">Bem-vindo, visitante. Você encontrou o terminal de bordo de <span class="c-title">${profile.name}</span>.</span>`,
    `<span class="c-mute">${profile.role} · ${profile.location}</span>`,
    '',
    `<span class="c-dim">Digite <span class="c-key">help</span> para ver os comandos. Comece por <span class="c-key">neofetch</span>, <span class="c-key">projects</span> ou <span class="c-key">skills</span>.</span>`,
  ];
  await term.printSlow(lines, { delay: fast ? 0 : 150 });
  term.spacer();
  term.input.focus({ preventScroll: true });
}

boot();

window.NebulaOS = { camera, term, world };
