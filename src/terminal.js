import { profile } from './data.js';

export class Terminal {
  constructor(root) {
    this.root = root;
    this.out = root.querySelector('#term-out');
    this.line = root.querySelector('#term-line');
    this.promptEl = root.querySelector('#term-prompt');
    this.typedEl = root.querySelector('#term-typed');
    this.ghostEl = root.querySelector('#term-ghost');
    this.input = document.getElementById('term-real');

    this.cwd = ['~'];
    this.history = [];
    this.histIdx = -1;
    this.draft = '';
    this.busy = false;
    this.completions = () => [];
    this.onCommand = async () => {};

    this._bind();
    this.renderPrompt();
  }

  get path() { return this.cwd.join('/').replace(/^~\/?/, '~/').replace(/\/$/, '') || '~'; }

  renderPrompt() {
    this.promptEl.innerHTML =
      `<span class="c-user">${profile.handle}</span>` +
      `<span class="c-dim">@</span>` +
      `<span class="c-accent">${profile.host}</span>` +
      `<span class="c-dim">:</span>` +
      `<span class="c-path">${this.path}</span>` +
      `<span class="c-prompt"> $ </span>`;
    const status = document.getElementById('status-path');
    if (status) status.textContent = this.path;
  }

  promptHTML() {
    return `<span class="c-user">${profile.handle}</span><span class="c-dim">@</span>` +
      `<span class="c-accent">${profile.host}</span><span class="c-dim">:</span>` +
      `<span class="c-path">${this.path}</span><span class="c-prompt"> $ </span>`;
  }

  _bind() {
    const focus = () => { if (!this.busy) this.input.focus({ preventScroll: true }); };

    this.root.addEventListener('mousedown', (e) => {
      if (window.getSelection()?.toString()) return;
      if (e.target.closest('a')) return;
      setTimeout(focus, 0);
    });

    this.input.addEventListener('input', () => {
      this.typedEl.textContent = this.input.value;
      this.updateGhost();
      this.scrollToEnd();
    });

    this.input.addEventListener('focus', () => this.root.classList.remove('is-blur'));
    this.input.addEventListener('blur', () => this.root.classList.add('is-blur'));

    this.input.addEventListener('keydown', (e) => this._onKey(e));

    window.addEventListener('keydown', (e) => {
      // Redireciona digitação para o terminal quando ele está visível
      const layer = document.getElementById('layer-terminal');
      if (!layer.classList.contains('is-active')) return;
      if (this.busy) return;
      if (document.activeElement === this.input) return;
      if (e.target.closest('input, textarea, button, a')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length === 1 || e.key === 'Backspace') focus();
    });
  }

  _onKey(e) {
    if (this.busy) { e.preventDefault(); return; }

    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        const raw = this.input.value;
        this.submit(raw);
        break;
      }
      case 'Tab': {
        e.preventDefault();
        this.complete();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        this.navHistory(-1);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.navHistory(1);
        break;
      }
      case 'ArrowRight': {
        if (this.input.selectionStart === this.input.value.length && this.ghostEl.dataset.rest) {
          e.preventDefault();
          this.setValue(this.input.value + this.ghostEl.dataset.rest);
        }
        break;
      }
      case 'l':
      case 'L': {
        if (e.ctrlKey) { e.preventDefault(); this.clear(); }
        break;
      }
      case 'c':
      case 'C': {
        if (e.ctrlKey && !window.getSelection()?.toString()) {
          e.preventDefault();
          this.echoLine(this.input.value + ' ^C');
          this.setValue('');
        }
        break;
      }
      case 'u':
      case 'U': {
        if (e.ctrlKey) { e.preventDefault(); this.setValue(''); }
        break;
      }
      case 'Escape': {
        this.setValue('');
        break;
      }
      default:
        break;
    }
  }

  setValue(v) {
    this.input.value = v;
    this.typedEl.textContent = v;
    this.updateGhost();
    requestAnimationFrame(() => {
      try { this.input.setSelectionRange(v.length, v.length); } catch { /* noop */ }
    });
  }

  updateGhost() {
    const v = this.input.value;
    this.ghostEl.textContent = '';
    this.ghostEl.dataset.rest = '';
    if (!v || v.endsWith(' ')) return;

    const matches = this.completions(v).filter((c) => c.startsWith(v) && c !== v);
    if (matches.length === 0) return;

    const rest = commonPrefix(matches).slice(v.length);
    if (!rest) return;
    this.ghostEl.textContent = v + rest;
    this.ghostEl.dataset.rest = rest;
  }

  complete() {
    const v = this.input.value;
    const matches = this.completions(v).filter((c) => c.startsWith(v));
    if (matches.length === 0) return;

    if (matches.length === 1) {
      this.setValue(matches[0] + (matches[0].endsWith('/') ? '' : ' '));
      return;
    }

    const prefix = commonPrefix(matches);
    if (prefix.length > v.length) {
      this.setValue(prefix);
      return;
    }

    this.echoLine(v);
    this.print(
      `<div class="term__block c-mute">${matches
        .map((m) => `<span class="c-key">${escapeHTML(m.split(' ').pop())}</span>`)
        .join('   ')}</div>`
    );
    this.setValue(v);
  }

  navHistory(dir) {
    if (this.history.length === 0) return;
    if (this.histIdx === -1) {
      this.draft = this.input.value;
      this.histIdx = this.history.length;
    }
    this.histIdx = Math.max(0, Math.min(this.history.length, this.histIdx + dir));
    const v = this.histIdx === this.history.length ? this.draft : this.history[this.histIdx];
    this.setValue(v);
    if (this.histIdx === this.history.length) this.histIdx = -1;
  }

  async submit(raw) {
    const cmd = raw.trim();
    this.echoLine(raw);
    this.setValue('');
    this.histIdx = -1;
    this.draft = '';

    if (cmd) {
      if (this.history[this.history.length - 1] !== cmd) this.history.push(cmd);
      this.busy = true;
      this.root.classList.add('is-busy');
      this.line.style.visibility = 'hidden';
      try {
        await this.onCommand(cmd);
      } finally {
        this.busy = false;
        this.root.classList.remove('is-busy');
        this.line.style.visibility = '';
        this.renderPrompt();
        this.scrollToEnd();
        this.input.focus({ preventScroll: true });
      }
    }
  }

  echoLine(value) {
    this.print(
      `<div class="term__block">${this.promptHTML()}<span class="c-cmd">${escapeHTML(value)}</span></div>`
    );
  }

  print(html) {
    const frag = document.createElement('div');
    frag.innerHTML = html;
    while (frag.firstChild) this.out.appendChild(frag.firstChild);
    this.scrollToEnd();
  }
  printText(text, cls = '') {
    this.print(`<div class="term__block ${cls}">${escapeHTML(text)}</div>`);
  }

  async printSlow(lines, { delay = 26, cls = '' } = {}) {
    const arr = Array.isArray(lines) ? lines : String(lines).split('\n');
    for (const l of arr) {
      this.print(`<div class="term__block ${cls}">${l === '' ? '&nbsp;' : l}</div>`);
      if (delay) await sleep(delay);
    }
  }

  async type(text, { speed = 16, cls = '' } = {}) {
    const el = document.createElement('div');
    el.className = `term__block ${cls}`;
    this.out.appendChild(el);
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      if (i % 2 === 0) this.scrollToEnd();
      await sleep(text[i] === ' ' ? speed * 0.4 : speed);
    }
    this.scrollToEnd();
  }

  spacer() { this.print('<div class="term__block">&nbsp;</div>'); }
  rule() { this.print('<div class="term__block term__rule"></div>'); }

  clear() { this.out.innerHTML = ''; }

  scrollToEnd() { this.root.scrollTop = this.root.scrollHeight; }

  glitch() {
    this.root.classList.remove('glitch');
    void this.root.offsetWidth;
    this.root.classList.add('glitch');
    setTimeout(() => this.root.classList.remove('glitch'), 400);
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function escapeHTML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function commonPrefix(list) {
  if (list.length === 0) return '';
  let p = list[0];
  for (const s of list) {
    let i = 0;
    while (i < p.length && i < s.length && p[i] === s[i]) i++;
    p = p.slice(0, i);
    if (!p) break;
  }
  return p;
}
