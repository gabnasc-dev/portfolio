import { openWindow, closeWindow } from './windows.js';
import { profile, contacts } from './data.js';

const BLUE = '#2f7dff';
const ICE = '#7fc4ff';
const DIM = 'rgba(120, 165, 235, 0.14)';

export function launchSnake() {
  const CELL = 18;
  const COLS = 20;
  const ROWS = 20;
  const W = COLS * CELL;
  const H = ROWS * CELL;

  const wrap = document.createElement('div');
  wrap.className = 'game';
  wrap.innerHTML = `
    <div class="game__hud">
      <span>PONTOS <b id="snake-score">0</b></span>
      <span>RECORDE <b id="snake-best">${localStorage.getItem('nebula.snake') ?? 0}</b></span>
    </div>
    <canvas class="game__canvas" width="${W}" height="${H}"></canvas>
    <p class="game__hint">setas ou WASD para mover · espaço pausa · R reinicia</p>`;

  const canvas = wrap.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = wrap.querySelector('#snake-score');
  const bestEl = wrap.querySelector('#snake-best');

  let snake, dir, nextDir, food, score, dead, paused, tick, acc, last, raf;

  function reset() {
    snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    dead = false;
    paused = false;
    tick = 130;
    acc = 0;
    last = performance.now();
    placeFood();
    scoreEl.textContent = '0';
  }

  function placeFood() {
    do {
      food = { x: (Math.random() * COLS) | 0, y: (Math.random() * ROWS) | 0 };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
  }

  function step() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS ||
        snake.some((s) => s.x === head.x && s.y === head.y)) {
      dead = true;
      const best = Math.max(score, Number(localStorage.getItem('nebula.snake') ?? 0));
      localStorage.setItem('nebula.snake', String(best));
      bestEl.textContent = String(best);
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreEl.textContent = String(score);
      tick = Math.max(62, tick - 3);
      placeFood();
    } else {
      snake.pop();
    }
  }

  function draw() {
    ctx.fillStyle = 'rgba(3, 6, 16, 1)';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = DIM;
    ctx.lineWidth = 0.5;
    for (let i = 1; i < COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
    }

    // Comida: uma pequena estrela pulsante
    const pulse = 0.6 + Math.sin(performance.now() / 220) * 0.25;
    ctx.fillStyle = ICE;
    ctx.shadowColor = ICE;
    ctx.shadowBlur = 14 * pulse;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    snake.forEach((s, i) => {
      const t = 1 - i / (snake.length + 3);
      ctx.fillStyle = i === 0 ? '#dceaff' : `rgba(47, 125, 255, ${0.35 + t * 0.6})`;
      if (i === 0) { ctx.shadowColor = ICE; ctx.shadowBlur = 12; }
      roundRect(ctx, s.x * CELL + 2, s.y * CELL + 2, CELL - 4, CELL - 4, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (dead || paused) {
      ctx.fillStyle = 'rgba(3, 6, 16, 0.82)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = dead ? '#ef6a6a' : ICE;
      ctx.font = '600 20px "Archivo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dead ? 'SINAL PERDIDO' : 'PAUSADO', W / 2, H / 2 - 8);
      ctx.fillStyle = 'rgba(134, 152, 184, 1)';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(dead ? `${score} pontos · R para reiniciar` : 'espaço para continuar', W / 2, H / 2 + 18);
    }
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = now - last;
    last = now;
    if (!dead && !paused) {
      acc += dt;
      while (acc >= tick) { acc -= tick; step(); if (dead) break; }
    }
    draw();
  }

  function onKey(e) {
    const k = e.key.toLowerCase();
    const map = {
      arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
      arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
      arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
      arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
    };
    if (map[k]) {
      e.preventDefault();
      const n = map[k];
      if (n.x !== -dir.x || n.y !== -dir.y) nextDir = n;
    } else if (k === ' ') {
      e.preventDefault();
      if (!dead) paused = !paused;
    } else if (k === 'r') {
      e.preventDefault();
      reset();
    }
  }

  window.addEventListener('keydown', onKey);
  reset();
  raf = requestAnimationFrame(loop);

  openWindow({
    id: 'snake',
    title: 'nebula://games/snake',
    width: W + 52,
    body: wrap,
    onClose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    },
  });
}

export function launchTetris() {
  const CELL = 22;
  const COLS = 10;
  const ROWS = 18;
  const W = COLS * CELL;
  const H = ROWS * CELL;

  const SHAPES = {
    I: { cells: [[0, 1], [1, 1], [2, 1], [3, 1]], w: 4, c: '#7fc4ff' },
    O: { cells: [[1, 0], [2, 0], [1, 1], [2, 1]], w: 4, c: '#4d93ff' },
    T: { cells: [[1, 0], [0, 1], [1, 1], [2, 1]], w: 3, c: '#9db6e0' },
    S: { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], w: 3, c: '#4fd39b' },
    Z: { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], w: 3, c: '#e8b661' },
    J: { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], w: 3, c: '#2f7dff' },
    L: { cells: [[2, 0], [0, 1], [1, 1], [2, 1]], w: 3, c: '#b9d4ff' },
  };
  const KEYS = Object.keys(SHAPES);

  const wrap = document.createElement('div');
  wrap.className = 'game';
  wrap.innerHTML = `
    <div class="game__hud">
      <span>LINHAS <b id="tt-lines">0</b></span>
      <span>PONTOS <b id="tt-score">0</b></span>
      <span>NÍVEL <b id="tt-level">1</b></span>
    </div>
    <canvas class="game__canvas" width="${W}" height="${H}"></canvas>
    <p class="game__hint">← → move · ↑ gira · ↓ desce · espaço solta · R reinicia</p>`;

  const canvas = wrap.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const linesEl = wrap.querySelector('#tt-lines');
  const scoreEl = wrap.querySelector('#tt-score');
  const levelEl = wrap.querySelector('#tt-level');

  let grid, piece, score, lines, level, dead, acc, last, raf;

  const emptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  function spawn() {
    const k = KEYS[(Math.random() * KEYS.length) | 0];
    const s = SHAPES[k];
    piece = {
      cells: s.cells.map(([x, y]) => [x, y]),
      size: s.w,
      color: s.c,
      x: Math.floor((COLS - s.w) / 2),
      y: -1,
    };
    if (collides(piece.cells, piece.x, piece.y)) dead = true;
  }

  function reset() {
    grid = emptyGrid();
    score = 0; lines = 0; level = 1;
    dead = false;
    acc = 0;
    last = performance.now();
    linesEl.textContent = '0'; scoreEl.textContent = '0'; levelEl.textContent = '1';
    spawn();
  }

  const dropInterval = () => Math.max(90, 620 - (level - 1) * 55);

  function collides(cells, px, py) {
    return cells.some(([cx, cy]) => {
      const x = px + cx, y = py + cy;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y < 0) return false;
      return grid[y][x] !== null;
    });
  }

  function rotate() {
    const n = piece.size - 1;
    const rotated = piece.cells.map(([x, y]) => [n - y, x]);
    for (const dx of [0, -1, 1, -2, 2]) {
      if (!collides(rotated, piece.x + dx, piece.y)) {
        piece.cells = rotated;
        piece.x += dx;
        return;
      }
    }
  }

  function move(dx) {
    if (!collides(piece.cells, piece.x + dx, piece.y)) piece.x += dx;
  }

  function drop() {
    if (!collides(piece.cells, piece.x, piece.y + 1)) {
      piece.y++;
      return true;
    }
    lock();
    return false;
  }

  function hardDrop() {
    while (!collides(piece.cells, piece.x, piece.y + 1)) { piece.y++; score += 2; }
    syncScore();
    lock();
  }

  function syncScore() { scoreEl.textContent = String(score); }

  function lock() {
    for (const [cx, cy] of piece.cells) {
      const x = piece.x + cx, y = piece.y + cy;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) grid[y][x] = piece.color;
    }
    clearLines();
    spawn();
  }

  function clearLines() {
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (grid[y].every((c) => c !== null)) {
        grid.splice(y, 1);
        grid.unshift(Array(COLS).fill(null));
        cleared++;
        y++;
      }
    }
    if (cleared) {
      lines += cleared;
      score += [0, 100, 300, 500, 800][cleared] * level;
      level = Math.floor(lines / 8) + 1;
      linesEl.textContent = String(lines);
      levelEl.textContent = String(level);
      syncScore();
    }
  }

  function ghostY() {
    let y = piece.y;
    while (!collides(piece.cells, piece.x, y + 1)) y++;
    return y;
  }

  function draw() {
    ctx.fillStyle = 'rgba(3, 6, 16, 1)';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = DIM;
    ctx.lineWidth = 0.5;
    for (let x = 1; x < COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 1; y < ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (grid[y][x]) block(x, y, grid[y][x], 1);
      }
    }

    if (!dead && piece) {
      const gy = ghostY();
      for (const [cx, cy] of piece.cells) block(piece.x + cx, gy + cy, piece.color, 0.14);
      for (const [cx, cy] of piece.cells) block(piece.x + cx, piece.y + cy, piece.color, 1, true);
    }

    if (dead) {
      ctx.fillStyle = 'rgba(3, 6, 16, 0.85)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ef6a6a';
      ctx.font = '600 18px "Archivo", sans-serif';
      ctx.fillText('MEMÓRIA CHEIA', W / 2, H / 2 - 8);
      ctx.fillStyle = 'rgba(134, 152, 184, 1)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`${score} pontos · R para reiniciar`, W / 2, H / 2 + 16);
    }
  }

  function block(x, y, color, alpha, glow = false) {
    if (y < 0) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
    roundRect(ctx, x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = now - last;
    last = now;
    if (!dead) {
      acc += dt;
      if (acc >= dropInterval()) { acc = 0; drop(); }
    }
    draw();
  }

  function onKey(e) {
    if (dead && e.key.toLowerCase() !== 'r') return;
    switch (e.key) {
      case 'ArrowLeft':  e.preventDefault(); move(-1); break;
      case 'ArrowRight': e.preventDefault(); move(1); break;
      case 'ArrowUp':    e.preventDefault(); rotate(); break;
      case 'ArrowDown':  e.preventDefault(); if (drop()) { score += 1; syncScore(); } break;
      case ' ':          e.preventDefault(); hardDrop(); break;
      default:
        if (e.key.toLowerCase() === 'r') { e.preventDefault(); reset(); }
    }
  }

  window.addEventListener('keydown', onKey);
  reset();
  raf = requestAnimationFrame(loop);

  openWindow({
    id: 'tetris',
    title: 'nebula://games/tetris',
    width: W + 52,
    body: wrap,
    onClose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    },
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const COFFEE_LINES = [
  'Combustível recarregado. Compilação em 3, 2, 1…',
  'A cafeína é o único runtime que nunca falha.',
  'Café servido. Bugs tremem de medo.',
  'Uma xícara para o dev, um salto para o deploy.',
  'Sem café não há commit. É física básica.',
];

export function launchCoffee() {
  const wrap = document.createElement('div');
  wrap.className = 'coffee';
  wrap.innerHTML = `
    <div class="coffee__steam"><i></i><i></i><i></i></div>
    <div class="coffee__cup">&#9749;</div>
    <p class="coffee__txt">${COFFEE_LINES[(Math.random() * COFFEE_LINES.length) | 0]}</p>
    <p class="coffee__sub">CAFEÍNA: 100% · MORAL: RESTAURADA</p>`;

  openWindow({ id: 'coffee', title: 'nebula://sys/coffee.exe', width: 340, body: wrap });
  setTimeout(() => closeWindow('coffee'), 7000);
}

export function launchHire() {
  const wrap = document.createElement('div');
  wrap.className = 'hire';
  wrap.innerHTML = `
    <div class="hire__seal">&#10003;</div>
    <h2 class="hire__title">Permissão concedida</h2>
    <p class="hire__sub">
      Você tem autorização de nível root para contratar
      <b style="color:var(--white)">${profile.short}</b>. Os canais abaixo estão abertos.
    </p>
    <div class="hire__rows">
      <div class="hire__row"><span>CARGO</span><span>${profile.role}</span></div>
      <div class="hire__row"><span>LOCAL</span><span>${profile.location}</span></div>
      <div class="hire__row"><span>STATUS</span><span style="color:var(--ok)">disponível</span></div>
      <div class="hire__row"><span>STACK</span><span>Python · Django · Docker</span></div>
    </div>
    <div class="proj__actions" style="justify-content:center">
      <a class="btn" href="${contacts[0].href}">Enviar e-mail</a>
      <a class="btn btn--ghost" href="${contacts[2].href}" target="_blank" rel="noopener noreferrer">LinkedIn &#8599;</a>
    </div>`;

  openWindow({ id: 'hire', title: 'nebula://sys/authorize', width: 400, body: wrap });
}


export function launchKonami() {
  const wrap = document.createElement('div');
  wrap.className = 'coffee';
  wrap.innerHTML = `
    <svg class="gamepad" viewBox="0 0 100 68" role="img" aria-label="Controle de videogame">
      <defs>
        <linearGradient id="gp-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="var(--ice)" />
          <stop offset="1" stop-color="var(--blue)" />
        </linearGradient>
      </defs>
      <path class="gamepad__body"
        d="M34 16h32c14 0 25 9 28 22l3 13c2 8-6 14-13 10l-14-9H30l-14 9c-7 4-15-2-13-10l3-13C9 25 20 16 34 16Z" />
      <path class="gamepad__dpad" d="M30 34v14M23 41h14" />
      <circle class="gamepad__btn" cx="66" cy="36" r="3.4" />
      <circle class="gamepad__btn gamepad__btn--b" cx="75" cy="45" r="3.4" />
    </svg>
    <p class="coffee__txt">
      <b style="color:var(--white)">MODO DESENVOLVEDOR ATIVADO</b><br>
      Vidas infinitas concedidas. Use com responsabilidade.
    </p>
    <p class="coffee__sub">↑ ↑ ↓ ↓ ← → ← → B A</p>
    <div class="proj__actions" style="justify-content:center">
      <button class="btn" data-go="snake">Jogar Snake</button>
      <button class="btn btn--ghost" data-go="tetris">Jogar Tetris</button>
    </div>`;

  const win = openWindow({ id: 'konami', title: 'nebula://sys/cheatcode', width: 360, body: wrap });
  win?.el.querySelector('[data-go="snake"]')?.addEventListener('click', () => {
    closeWindow('konami'); launchSnake();
  });
  win?.el.querySelector('[data-go="tetris"]')?.addEventListener('click', () => {
    closeWindow('konami'); launchTetris();
  });
}

