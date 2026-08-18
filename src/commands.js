import { profile, contacts, projects, skills, timeline, fs } from './data.js';
import { escapeHTML, sleep } from './terminal.js';
import { launchSnake, launchTetris, launchCoffee, launchHire, launchKonami } from './games.js';


export function resolve(cwd, target) {
  const parts = [];
  if (!target || target === '.') {
    parts.push(...cwd);
  } else if (target.startsWith('~') || target.startsWith('/')) {
    parts.push('~', ...target.replace(/^[~/]+/, '').split('/').filter(Boolean));
  } else {
    parts.push(...cwd, ...target.split('/').filter(Boolean));
  }

  const out = [];
  for (const p of parts) {
    if (p === '.' || p === '') continue;
    if (p === '..') { if (out.length > 1) out.pop(); continue; }
    out.push(p);
  }
  if (out.length === 0 || out[0] !== '~') out.unshift('~');
  return out;
}

export function nodeAt(path) {
  let node = fs;
  for (const seg of path.slice(1)) {
    if (node.type !== 'dir' || !node.children?.[seg]) return null;
    node = node.children[seg];
  }
  return node;
}

function listing(node, { all = false } = {}) {
  if (!node?.children) return [];
  return Object.entries(node.children)
    .filter(([name, child]) => all || (!child.hidden && !name.startsWith('.')))
    .sort(([a, ca], [b, cb]) => {
      if (ca.type !== cb.type) return ca.type === 'dir' ? -1 : 1;
      return a.localeCompare(b);
    });
}

export const registry = {};

function cmd(name, { desc, usage, hidden = false, run }) {
  registry[name] = { name, desc, usage, hidden, run };
}

export const visibleCommands = () =>
  Object.values(registry).filter((c) => !c.hidden);

cmd('help', {
  desc: 'Lista os comandos disponíveis',
  run: async (args, { term }) => {
    term.spacer();
    term.print('<div class="term__block c-title">COMANDOS DISPONÍVEIS</div>');
    term.rule();
    const rows = visibleCommands()
      .map((c) => `<dt>${escapeHTML(c.usage ?? c.name)}</dt><dd>${escapeHTML(c.desc)}</dd>`)
      .join('');
    term.print(`<div class="term__block"><dl class="helpgrid">${rows}</dl></div>`);
    term.rule();
    term.print(
      '<div class="term__block c-dim">Há comandos que não estão nesta lista. ' +
      'Quem explora o suficiente acaba encontrando.</div>'
    );
    term.spacer();
  },
});

cmd('ls', {
  desc: 'Lista o conteúdo do diretório',
  usage: 'ls [-a] [dir]',
  run: async (args, { term }) => {
    const all = args.includes('-a');
    const target = args.find((a) => !a.startsWith('-'));
    const path = resolve(term.cwd, target);
    const node = nodeAt(path);

    if (!node) return err(term, `ls: ${target}: diretório não encontrado`);
    if (node.type === 'file') return term.printText(target ?? '', 'c-file');

    const items = listing(node, { all });
    if (items.length === 0) return term.printText('(vazio)', 'c-dim');

    const cells = items.map(([name, child]) =>
      child.type === 'dir'
        ? `<span class="c-dir">${escapeHTML(name)}/</span>`
        : `<span class="c-file">${escapeHTML(name)}</span>`
    );
    term.print(`<div class="term__block">${cells.join('   ')}</div>`);
  },
});

cmd('cd', {
  desc: 'Entra em um diretório',
  usage: 'cd <dir>',
  run: async (args, { term }) => {
    const target = args[0] ?? '~';
    const path = resolve(term.cwd, target);
    const node = nodeAt(path);
    if (!node) return err(term, `cd: ${target}: diretório não encontrado`);
    if (node.type !== 'dir') return err(term, `cd: ${target}: não é um diretório`);
    term.cwd = path;
    term.renderPrompt();
  },
});

cmd('pwd', {
  desc: 'Mostra o caminho atual',
  run: async (_a, { term }) => {
    term.printText(term.cwd.join('/').replace('~', '/home/gabriel'), 'c-path');
  },
});

cmd('cat', {
  desc: 'Exibe o conteúdo de um arquivo',
  usage: 'cat <arquivo>',
  run: async (args, { term }) => {
    if (args.length === 0) return err(term, 'cat: informe um arquivo');
    const path = resolve(term.cwd, args[0]);
    const node = nodeAt(path);
    if (!node) return err(term, `cat: ${args[0]}: arquivo não encontrado`);
    if (node.type === 'dir') return err(term, `cat: ${args[0]}: é um diretório`);
    term.spacer();
    await term.printSlow(
      node.content.split('\n').map((l) => `<span class="c-mute">${escapeHTML(l)}</span>`),
      { delay: 14 }
    );
    term.spacer();
  },
});

cmd('tree', {
  desc: 'Mostra a árvore de diretórios',
  usage: 'tree [-a]',
  run: async (args, { term }) => {
    const all = args.includes('-a');
    term.spacer();
    term.print('<div class="term__block c-dir">~</div>');
    const lines = [];
    walk(nodeAt(['~']), '', lines, all);
    await term.printSlow(lines, { delay: 12 });
    const counts = lines.reduce((acc, l) => {
      if (l.includes('c-dir')) acc.d++; else acc.f++;
      return acc;
    }, { d: 0, f: 0 });
    term.print(`<div class="term__block c-dim">${counts.d} diretórios, ${counts.f} arquivos</div>`);
    term.spacer();
  },
});

function walk(node, prefix, lines, all) {
  const items = listing(node, { all });
  items.forEach(([name, child], i) => {
    const last = i === items.length - 1;
    const branch = last ? '└── ' : '├── ';
    const cls = child.type === 'dir' ? 'c-dir' : 'c-file';
    const suffix = child.type === 'dir' ? '/' : '';
    lines.push(
      `<span class="c-dim">${escapeHTML(prefix + branch)}</span>` +
      `<span class="${cls}">${escapeHTML(name + suffix)}</span>`
    );
    if (child.type === 'dir') {
      walk(child, prefix + (last ? '    ' : '│   '), lines, all);
    }
  });
}

cmd('projects', {
  desc: 'Abre a constelação interativa de projetos',
  run: async (_a, { term, camera }) => {
    term.printText('Recuando câmera…', 'c-dim');
    await sleep(140);
    term.print(`<div class="term__block c-mute">Mapeando setor 07 · ${projects.length} corpos catalogados</div>`);
    await sleep(320);
    camera.toConstellation();
  },
});

cmd('skills', {
  desc: 'Abre a árvore de habilidades',
  run: async (_a, { term, camera }) => {
    term.printText('Carregando núcleo de habilidades…', 'c-dim');
    await sleep(140);
    term.print(`<div class="term__block c-mute">${skills.length - 1} tecnologias · ${skills.length} nós no grafo</div>`);
    await sleep(320);
    camera.toSkills();
  },
});

cmd('contact', {
  desc: 'Mostra os canais de contato',
  run: async (_a, { term }) => {
    term.spacer();
    term.print('<div class="term__block c-title">CANAIS ABERTOS</div>');
    term.rule();
    await term.printSlow(
      contacts.map((c) =>
        `<span class="c-key">${escapeHTML(c.label.padEnd(10))}</span>` +
        `<a href="${c.href}" target="_blank" rel="noopener noreferrer">${escapeHTML(c.value)}</a>`
      ),
      { delay: 60 }
    );
    term.rule();
    term.print('<div class="term__block c-dim">Resposta típica em até 24h. Sinal estável.</div>');
    term.spacer();
  },
});

cmd('about', {
  desc: 'Sobre o desenvolvedor',
  run: async (_a, ctx) => registry.cat.run(['about.txt'], { ...ctx, term: rooted(ctx.term) }),
});

cmd('timeline', {
  desc: 'Linha do tempo da trajetória',
  run: async (_a, { term }) => {
    term.spacer();
    term.print('<div class="term__block c-title">REGISTRO DE BORDO</div>');
    term.rule();
    for (const t of timeline) {
      term.print(
        `<div class="term__block"><span class="c-key">${t.year}</span>  ` +
        `<span class="c-title">${escapeHTML(t.title)}</span></div>` +
        `<div class="term__block c-mute">      ${escapeHTML(t.desc)}</div>`
      );
      await sleep(70);
    }
    term.rule();
    term.spacer();
  },
});

cmd('whoami', {
  desc: 'Identifica o usuário atual',
  run: async (_a, { term }) => {
    term.print(
      `<div class="term__block"><span class="c-user">${profile.handle}</span>` +
      `<span class="c-dim"> — ${escapeHTML(profile.role)}</span></div>`
    );
  },
});

cmd('resume', {
  desc: 'Abre o currículo em PDF',
  run: async (_a, { term }) => {
    term.print(
      `<div class="term__block c-mute">Abrindo <a href="${profile.resume}" target="_blank" rel="noopener noreferrer">Curriculo.pdf</a>…</div>`
    );
    window.open(profile.resume, '_blank', 'noopener');
  },
});

/* ── neofetch ──────────────────────────────────────────────────────── */

const NEO_ART = String.raw`
        .:-==+**+==-:.
     .=*#%@@@@@@@@@%#*=.
   -*%@@@@%#*++**#%@@@@%*-
  =%@@@%+:          :+%@@@%=
 =@@@%=      .::.      =%@@@=
.%@@@:     :*%@@%*:     :@@@%.
=@@@+     -@@@@@@@@-     +@@@=
+@@@:     %@@@@@@@@%     :@@@+
=@@@+     -@@@@@@@@-     +@@@=
.%@@@:     :*%@@%*:     :@@@%.
 =@@@%=      .::.      =%@@@=
  =%@@@%+:          :+%@@@%=
   -*%@@@@%#*++**#%@@@@%*-
     .=*#%@@@@@@@@@%#*=.
        .:-==+**+==-:.`;

cmd('neofetch', {
  desc: 'Informações do sistema e do desenvolvedor',
  run: async (_a, { term }) => {
    const rows = [
      ['OS', 'NebulaOS 2.5.0 (deep-space edition)'],
      ['Host', `${profile.name}`],
      ['Kernel', 'python-3.12 · django-5.x'],
      ['Uptime', profile.uptime],
      ['Shell', 'nsh 1.0'],
      ['Resolução', `${window.innerWidth}x${window.innerHeight}`],
      ['DE', 'Constelação 07'],
      ['Terminal', 'nebula-term'],
      ['CPU', 'Café Arábica @ 4.2GHz'],
      ['GPU', 'Curiosidade Integrada'],
      ['Memória', 'Documentação parcialmente carregada'],
      ['Local', profile.location],
      ['Cargo', profile.role],
      ['Formação', 'Engenharia de Software · UniAcademia'],
      ['Contato', contacts[0].value],
    ];

    term.spacer();
    term.print(`
      <div class="term__block neofetch">
        <pre class="neofetch__art">${NEO_ART}</pre>
        <div class="neofetch__info">
          <div class="neofetch__row">
            <span class="neofetch__v"><span class="c-user">${profile.handle}</span><span class="c-dim">@</span><span class="c-accent">${profile.host}</span></span>
          </div>
          <div class="neofetch__row"><span class="c-dim">${'-'.repeat(28)}</span></div>
          ${rows.map(([k, v]) =>
            `<div class="neofetch__row"><span class="neofetch__k">${escapeHTML(k)}</span>` +
            `<span class="neofetch__v">${escapeHTML(v)}</span></div>`
          ).join('')}
          <div class="neofetch__palette">
            <i style="background:#03050d"></i>
            <i style="background:#0a1226"></i>
            <i style="background:#0e1932"></i>
            <i style="background:#2f7dff"></i>
            <i style="background:#4d93ff"></i>
            <i style="background:#7fc4ff"></i>
            <i style="background:#d3ddf0"></i>
          </div>
        </div>
      </div>`);
    term.spacer();
  },
});

cmd('clear', {
  desc: 'Limpa a tela',
  run: async (_a, { term }) => term.clear(),
});

cmd('echo', {
  desc: 'Repete o texto informado',
  usage: 'echo <texto>',
  run: async (args, { term }) => term.printText(args.join(' '), 'c-mute'),
});

cmd('date', {
  desc: 'Data e hora de bordo',
  run: async (_a, { term }) => {
    const d = new Date();
    term.printText(
      d.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' }),
      'c-mute'
    );
  },
});

cmd('history', {
  desc: 'Mostra o histórico de comandos',
  run: async (_a, { term }) => {
    if (term.history.length === 0) return term.printText('(histórico vazio)', 'c-dim');
    term.print(
      `<div class="term__block">${term.history
        .map((h, i) => `<span class="c-dim">${String(i + 1).padStart(3)}</span>  <span class="c-mute">${escapeHTML(h)}</span>`)
        .join('<br>')}</div>`
    );
  },
});

cmd('open', {
  desc: 'Abre um projeto pelo id',
  usage: 'open <projeto>',
  run: async (args, { term, camera }) => {
    const id = args[0];
    const p = projects.find((x) => x.id === id || x.name.toLowerCase() === args.join(' ').toLowerCase());
    if (!p) {
      return err(term, `open: projeto '${id ?? ''}' não encontrado. Use \`ls projects\`.`);
    }
    term.printText(`Traçando rota até ${p.star}…`, 'c-dim');
    await sleep(280);
    camera.toConstellation();
    setTimeout(() => camera.selectProject(p.id), 900);
  },
});

cmd('exit', {
  desc: 'Encerra a sessão',
  run: async (_a, { term, camera }) => {
    await term.printSlow([
      '<span class="c-dim">Encerrando sessão…</span>',
      '<span class="c-dim">Desmontando /home/gabriel</span>',
      '<span class="c-warn">Conexão perdida.</span>',
    ], { delay: 260 });
    await sleep(500);
    camera.shutdown();
  },
});

cmd('banner', {
  desc: 'Reexibe o cabeçalho do sistema',
  run: async (_a, { term }) => printBanner(term),
});

cmd('sudo', {
  desc: 'Executa como superusuário',
  hidden: true,
  run: async (args, { term, world }) => {
    const rest = args.join(' ').toLowerCase();

    if (rest === 'hire gabriel' || rest === 'hire') {
      await term.printSlow([
        '<span class="c-dim">[sudo] senha para visitante: <span class="c-faint">••••••••</span></span>',
        '<span class="c-dim">Verificando credenciais…</span>',
        '<span class="c-ok">Acesso root concedido.</span>',
      ], { delay: 340 });
      await sleep(320);
      launchHire();
      return;
    }

    if (rest.startsWith('rm')) {
      world.glitch();
      return err(term, 'sudo: nice try. Este sistema é somente leitura.');
    }

    return err(term, `sudo: ${rest || '(vazio)'}: operação não permitida`);
  },
});

cmd('snake', {
  desc: 'Minigame Snake',
  hidden: true,
  run: async (_a, { term }) => {
    term.printText('Carregando módulo de recreação: snake…', 'c-dim');
    await sleep(260);
    launchSnake();
  },
});

cmd('tetris', {
  desc: 'Minigame Tetris',
  hidden: true,
  run: async (_a, { term }) => {
    term.printText('Carregando módulo de recreação: tetris…', 'c-dim');
    await sleep(260);
    launchTetris();
  },
});

cmd('coffee', {
  desc: 'Prepara um café',
  hidden: true,
  run: async (_a, { term }) => {
    await term.printSlow([
      '<span class="c-dim">Aquecendo água a 92°C…</span>',
      '<span class="c-dim">Moendo grãos…</span>',
      '<span class="c-ok">Pronto.</span>',
    ], { delay: 380 });
    launchCoffee();
  },
});

cmd('konami', {
  desc: 'Código secreto',
  hidden: true,
  run: async (_a, { term, world }) => {
    world.glitch();
    await term.printSlow([
      '<span class="c-key">↑ ↑ ↓ ↓ ← → ← → B A</span>',
      '<span class="c-ok">Cheat code aceito.</span>',
    ], { delay: 300 });
    launchKonami();
  },
});

cmd('matrix', {
  desc: 'Chuva de caracteres',
  hidden: true,
  run: async (_a, { term, world }) => {
    world.glitch();
    const chars = 'アイウエオカキクケコ01アくらしノハヒフヘホ<>/\\|=+*';
    for (let i = 0; i < 12; i++) {
      const line = Array.from({ length: 54 }, () =>
        chars[(Math.random() * chars.length) | 0]
      ).join('');
      term.print(`<div class="term__block" style="color:rgba(79,211,155,${0.25 + Math.random() * 0.6})">${escapeHTML(line)}</div>`);
      await sleep(55);
    }
    term.printText('…acorde, Neo. Ou apenas rode `help`.', 'c-dim');
  },
});

cmd('rm', {
  desc: 'Remove arquivos',
  hidden: true,
  run: async (_a, { term, world }) => {
    world.glitch();
    err(term, 'rm: sistema de arquivos montado como somente leitura.');
  },
});

function err(term, msg) {
  term.glitch();
  term.print(
    `<div class="term__block c-err glitch-text" data-text="${escapeHTML(msg)}">${escapeHTML(msg)}</div>`
  );
}

/** Terminal com cwd temporariamente na raiz (para `about`). */
function rooted(term) {
  return new Proxy(term, {
    get(t, k) {
      if (k === 'cwd') return ['~'];
      const v = t[k];
      return typeof v === 'function' ? v.bind(t) : v;
    },
  });
}

export const BANNER = String.raw`
 ███╗   ██╗███████╗██████╗ ██╗   ██╗██╗      █████╗  ██████╗ ███████╗
 ████╗  ██║██╔════╝██╔══██╗██║   ██║██║     ██╔══██╗██╔═══██╗██╔════╝
 ██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║     ███████║██║   ██║███████╗
 ██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║     ██╔══██║██║   ██║╚════██║
 ██║ ╚████║███████╗██████╔╝╚██████╔╝███████╗██║  ██║╚██████╔╝███████║
 ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝`;

export function printBanner(term) {
  term.print(`<pre class="term__block term__banner">${BANNER}</pre>`);
  term.print(
    `<div class="term__block c-dim">  v2.5.0 · terminal de bordo · sessão de visitante</div>`
  );
}

export async function runCommand(input, ctx) {
  const parts = input.trim().split(/\s+/);
  const name = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = registry[name];
  if (!command) {
    ctx.world.glitch();
    err(ctx.term, `nsh: comando não encontrado: ${name}`);
    const hint = suggest(name);
    if (hint) {
      ctx.term.print(`<div class="term__block c-dim">você quis dizer <span class="c-key">${hint}</span>?</div>`);
    } else {
      ctx.term.print('<div class="term__block c-dim">rode <span class="c-key">help</span> para ver os comandos.</div>');
    }
    return;
  }

  const bar = document.getElementById('sysbar-cmd');
  if (bar) bar.textContent = name;

  await command.run(args, ctx);
}

function suggest(name) {
  let best = null, bestD = Infinity;
  for (const c of Object.keys(registry)) {
    const d = levenshtein(name, c);
    if (d < bestD) { bestD = d; best = c; }
  }
  return bestD <= 2 ? best : null;
}

function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return m[a.length][b.length];
}

export function buildCompleter(term) {
  return (value) => {
    const parts = value.split(/\s+/);
    if (parts.length <= 1) {
      return Object.keys(registry).filter((c) => !registry[c].hidden || c === parts[0]).sort();
    }

    const name = parts[0].toLowerCase();
    const partial = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join(' ') + ' ';

    if (name === 'cd' || name === 'ls' || name === 'cat' || name === 'tree') {
      const slash = partial.lastIndexOf('/');
      const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : '';
      const filePart = slash >= 0 ? partial.slice(slash + 1) : partial;
      const node = nodeAt(resolve(term.cwd, dirPart || '.'));
      if (!node?.children) return [];
      return Object.entries(node.children)
        .filter(([n, c]) => {
          if (!n.startsWith(filePart)) return false;
          if (name === 'cd') return c.type === 'dir';
          if (name === 'cat') return c.type === 'file';
          return true;
        })
        .map(([n, c]) => prefix + dirPart + n + (c.type === 'dir' ? '/' : ''));
    }

    if (name === 'open') {
      return projects.map((p) => prefix + p.id).filter((s) => s.startsWith(value));
    }

    if (name === 'sudo') {
      return ['sudo hire gabriel'].filter((s) => s.startsWith(value));
    }

    return [];
  };
}
