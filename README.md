# NebulaOS

Portfólio de **Gabriel do Nascimento Rodrigues** em formato de sistema
operacional fictício: um terminal de bordo encontrado numa nave abandonada,
à deriva numa nebulosa azul.

## Rodando

```bash
npm install
```

```bash
npm run dev
```

Build de produção em `dist/`:

```bash
npm run build
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `help` | Lista os comandos visíveis |
| `ls [-a] [dir]` | Lista o diretório (`-a` mostra ocultos) |
| `cd <dir>` | Navega entre diretórios |
| `cat <arquivo>` | Exibe um arquivo |
| `pwd` | Caminho atual |
| `tree [-a]` | Árvore de diretórios |
| `projects` | Recua a câmera e abre a constelação de projetos |
| `skills` | Abre a árvore de habilidades em grafo |
| `contact` | Canais de contato |
| `about` · `timeline` · `whoami` · `resume` | Conteúdo do portfólio |
| `neofetch` | Ficha do sistema e do desenvolvedor |
| `echo` · `date` · `history` · `clear` · `banner` · `open <id>` · `exit` | Utilitários |

O terminal tem histórico (`↑`/`↓`), autocomplete por `TAB` com sugestão
fantasma inline (`→` aceita), e os atalhos `Ctrl+L` (limpar), `Ctrl+U` (apagar
linha) e `Ctrl+C` (cancelar).

### Comandos secretos

Não aparecem no `help`. A pista está em `~/.void/transmissao.log` — acessível
via `ls -a`.

`sudo hire gabriel` · `snake` · `tetris` · `coffee` · `konami` · `matrix`

O código Konami (`↑ ↑ ↓ ↓ ← → ← → B A`) também funciona pelo teclado em
qualquer tela.

## Estrutura

```
src/
  main.js          orquestração: boot, câmera, atalhos globais
  data.js          TODO o conteúdo do portfólio (perfil, projetos, skills, FS)
  terminal.js      motor do terminal: entrada, cursor, histórico, autocomplete
  commands.js      registro de comandos e sistema de arquivos virtual
  constellation.js constelação de projetos + transição de câmera
  skilltree.js     grafo de habilidades
  background.js    nebulosa em canvas, estrelas, partículas, meteoros
  torch.js         lanterna que segue o cursor
  windows.js       janelas flutuantes arrastáveis
  games.js         Snake, Tetris e as animações dos easter eggs
  styles.css       sistema de design (ver DESIGN.md)
```

**Para atualizar o conteúdo, edite apenas `src/data.js`.** Projetos, skills,
contatos, linha do tempo e o sistema de arquivos virtual saem todos de lá — o
resto do código só renderiza.

## Notas de implementação

- Sem dependências em runtime. Vite é usado apenas para dev/build.
- A nebulosa é pintada uma única vez num canvas offscreen e redesenhada só em
  `resize`; por frame só rodam estrelas, partículas e meteoros.
- O loop de fundo pausa quando a aba fica oculta e degrada silenciosamente se o
  canvas não estiver disponível — o terminal continua utilizável.
- Toda animação respeita `prefers-reduced-motion`.

## Deploy

Site estático: `npm run build` gera tudo em `dist/`. Sem servidor, sem banco,
sem variáveis de ambiente.

### GitHub Pages (substituindo o portfólio atual)

O destino é o repositório `gabnasc-dev/portfolio`, que já publica pelo Pages a
partir da branch `gh-pages`. A URL continua
`https://gabnasc-dev.github.io/portfolio/`.

Duas coisas que fazem esse deploy funcionar e não podem ser alteradas sem
ajuste correspondente:

- **`base: '/portfolio/'`** no `vite.config.js`. O site vive numa subpasta; sem
  isso o build procura o CSS e o JS na raiz do domínio e a página abre em
  branco. Se um dia mudar de hospedagem (ou for para a raiz do domínio),
  ajuste esse valor.
- **`public/Curriculo.pdf`**. Ele é publicado junto e mantém a URL
  `.../portfolio/Curriculo.pdf`, que já circula por aí. O comando `resume` do
  terminal aponta para ele via `import.meta.env.BASE_URL`.

Passos, a partir da pasta do projeto:

```bash
git clone https://github.com/gabnasc-dev/portfolio.git repo-portfolio
```

Guarde a versão antiga antes de trocar (dentro de `repo-portfolio`):

```bash
git branch portfolio-react-v1 && git push origin portfolio-react-v1
```

Substitua o conteúdo da `main` pelos arquivos deste projeto (mantendo a pasta
`.git`), instale e publique:

```bash
npm install
```

```bash
npm run deploy
```

O `deploy` roda o build e envia `dist/` para a branch `gh-pages`. O Pages
atualiza em cerca de um minuto.

Para voltar ao portfólio antigo, basta fazer checkout de `portfolio-react-v1`
e rodar o `npm run deploy` de lá.

### Vercel

Alternativa: o `vercel.json` já aponta para `npm run build` → `dist`. Nesse
caso troque o `base` do `vite.config.js` para `'/'`.
