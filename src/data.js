/**
 * Conteúdo do portfólio. Tudo que é "sobre o Gabriel" mora aqui —
 * o resto do sistema apenas renderiza.
 */

export const profile = {
  name: 'Gabriel do Nascimento Rodrigues',
  short: 'Gabriel',
  handle: 'gabriel',
  host: 'nebula',
  role: 'Desenvolvedor Backend & Web',
  location: 'Juiz de Fora, MG — Brasil',
  bio:
    'Desenvolvedor apaixonado por backend e desenvolvimento web. Construo APIs e ' +
    'sistemas de gestão com Python, Django e Django REST, sobre PostgreSQL e Docker, ' +
    'com foco em código limpo, alto desempenho e ambientes reprodutíveis.',
  education: [
    { title: 'Engenharia de Software', org: 'UniAcademia', detail: '6º período' },
    { title: 'Django Master', org: 'Felipe Azambuja', detail: 'concluído' },
  ],
  now: [
    'Aprendendo Java + Spring Boot para expandir o stack backend',
    'Construindo APIs, análise de dados e automações em Python',
  ],
  // Resolvido a partir do `base` do Vite: o PDF vive em public/ e é
  // publicado junto com o site, então o link acompanha a hospedagem.
  resume: `${import.meta.env.BASE_URL}Curriculo.pdf`,
  uptime: 'desde 2024 · ~2 anos de órbita',
};

export const contacts = [
  { id: 'email',    label: 'E-mail',   value: 'gabrielnascimento12t@gmail.com', href: 'mailto:gabrielnascimento12t@gmail.com' },
  { id: 'github',   label: 'GitHub',   value: 'github.com/gabnasc-dev',          href: 'https://github.com/gabnasc-dev' },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/gabriel-do-nascimento-rodrigues', href: 'https://www.linkedin.com/in/gabriel-do-nascimento-rodrigues-b96177323/' },
  { id: 'resume',   label: 'Currículo', value: 'Curriculo.pdf',                  href: profile.resume },
];

/**
 * Projetos. `x`/`y` são coordenadas relativas (0–100) no céu da constelação.
 * `mag` é a magnitude aparente — estrelas maiores = projetos de maior peso.
 */
export const projects = [
  {
    id: 'sge',
    name: 'Sistema de Gestão de Estoque',
    star: 'Vega',
    status: 'DONE',
    year: '2026',
    x: 30, y: 24, mag: 1.6,
    tagline: 'ERP de estoque em Django, com API REST, JWT, dashboard e Docker.',
    desc:
      'Aplicação web completa para gestão de estoque: produtos, fornecedores, categorias, ' +
      'marcas e movimentações de entrada e saída. Reúne interface administrativa, uma API ' +
      'RESTful com autenticação JWT e um dashboard com métricas de estoque e vendas. ' +
      'Todo o ambiente sobe por Docker Compose com PostgreSQL.',
    highlights: [
      'API RESTful com Django REST Framework e autenticação JWT (Simple JWT)',
      'Dashboard com métricas de estoque e vendas calculadas no backend',
      'Módulos separados por domínio: produtos, marcas, categorias, fornecedores e movimentações',
      'Ambiente reprodutível com Docker Compose e PostgreSQL 17',
      'Exportação de relatórios em planilha com openpyxl',
    ],
    tech: ['Python', 'Django', 'Django REST', 'JWT', 'PostgreSQL', 'Docker'],
    link: 'https://github.com/gabnasc-dev/sge',
  },
  {
    id: 'carros',
    name: 'Revenda de Carros + IA',
    star: 'Antares',
    status: 'DONE',
    year: '2025',
    x: 14, y: 52, mag: 1.45,
    tagline: 'Plataforma de revenda automotiva que escreve os próprios anúncios.',
    desc:
      'Sistema de revenda de carros em Django (padrão MVT) sobre PostgreSQL, com CRUD ' +
      'completo de veículos: cadastro, listagem, detalhe, atualização e exclusão. ' +
      'O diferencial é a integração com a Mistral AI, que gera automaticamente a descrição ' +
      'do veículo quando ela não é informada no cadastro.',
    highlights: [
      'CRUD completo de veículos com marca, modelo, ano, preço e descrição',
      'Geração automática de descrições com Mistral AI quando o campo fica vazio',
      'Modelagem relacional em PostgreSQL e templates Django (MVT)',
    ],
    tech: ['Python', 'Django', 'PostgreSQL', 'Mistral AI'],
    link: 'https://github.com/gabnasc-dev/carros',
  },
  {
    id: 'flix-api',
    name: 'Flix API',
    star: 'Altair',
    status: 'DONE',
    year: '2026',
    x: 52, y: 34, mag: 1.3,
    tagline: 'API REST de filmes construída com Django REST Framework.',
    desc:
      'Backend de catálogo de filmes em Django REST Framework, servindo os endpoints ' +
      'consumidos pelo Flix App. Cobre os recursos de filmes, gêneros e atores, com ' +
      'serializers, autenticação e as regras de negócio do catálogo.',
    highlights: [
      'Endpoints REST para filmes, gêneros e atores',
      'Serializers com validação e autenticação de acesso',
      'Serve como backend real de um cliente próprio, integrado ponta a ponta',
    ],
    tech: ['Python', 'Django', 'Django REST'],
    link: 'https://github.com/gabnasc-dev/flix_api',
  },
  {
    id: 'flix-app',
    name: 'Flix App',
    star: 'Deneb',
    status: 'DONE',
    year: '2026',
    x: 70, y: 20, mag: 1.15,
    tagline: 'Cliente em Streamlit que consome a Flix API.',
    desc:
      'Web app em Streamlit que consome a Flix API para exibir e gerenciar o catálogo ' +
      'de filmes. Fecha o ciclo com o backend próprio: a API é construída de um lado e ' +
      'consumida por uma interface do outro.',
    highlights: [
      'Interface em Streamlit conectada à API Django/DRF',
      'Consumo de endpoints REST com tratamento das respostas',
      'Integração ponta a ponta entre backend e cliente próprios',
    ],
    tech: ['Python', 'Streamlit', 'API REST'],
    link: 'https://github.com/gabnasc-dev/flix_app',
  },
  {
    id: 'cassandra',
    name: 'Gestão de Estoque em Cassandra',
    star: 'Capella',
    status: 'DONE',
    year: '2026',
    x: 84, y: 44, mag: 1.2,
    tagline: 'Modelagem NoSQL distribuída com Apache Cassandra.',
    desc:
      'Trabalho acadêmico de Banco de Dados Não Relacionais, feito em grupo: um sistema ' +
      'de gestão de estoque modelado sobre Apache Cassandra 4.1, banco NoSQL orientado a ' +
      'colunas e distribuído. O cluster sobe por Docker e o schema é aplicado via CQL.',
    highlights: [
      'Modelagem orientada a colunas em Apache Cassandra 4.1',
      'Schema versionado em CQL, aplicado sobre cluster em container',
      'Cluster provisionado com Docker Compose',
      'Camada de aplicação em Python conversando com o cluster',
    ],
    tech: ['Cassandra', 'CQL', 'Python', 'Docker'],
    link: 'https://github.com/gabnasc-dev/Trabalho-Marcos-Miguel',
  },
  {
    id: 'analise-dados',
    name: 'Análise de Cancelamento de Clientes',
    star: 'Spica',
    status: 'DONE',
    year: '2025',
    x: 58, y: 68, mag: 1.15,
    tagline: 'Por que 800 mil clientes cancelaram — e o que reduziria isso.',
    desc:
      'Análise exploratória sobre a base de uma empresa com mais de 800 mil clientes, ' +
      'buscando entender os principais motivos de cancelamento e quais ações teriam mais ' +
      'efeito para reduzi-los. Desenvolvido em Jupyter Notebook com Pandas.',
    highlights: [
      'Limpeza e tratamento de uma base com mais de 800 mil registros',
      'Identificação dos fatores mais associados ao cancelamento',
      'Conclusões traduzidas em ações práticas de retenção',
    ],
    tech: ['Python', 'Pandas', 'Jupyter'],
    link: 'https://github.com/gabnasc-dev/analise-dados',
  },
  {
    id: 'automacao',
    name: 'Automação de Cadastros',
    star: 'Mizar',
    status: 'DONE',
    year: '2025',
    x: 22, y: 76, mag: 1.05,
    tagline: 'Robô que preenche formulários web no lugar de uma pessoa.',
    desc:
      'Script em Python que automatiza o cadastro de produtos numa plataforma web: abre o ' +
      'navegador, faz login, lê os produtos de um CSV e preenche os formulários simulando ' +
      'cliques e digitação com PyAutoGUI. Inclui um utilitário para mapear as coordenadas ' +
      'de tela usadas pela automação.',
    highlights: [
      'Automação de login e cadastro em plataforma web com PyAutoGUI',
      'Leitura e manipulação da base de produtos com Pandas',
      'Utilitário auxiliar para capturar coordenadas de tela',
    ],
    tech: ['Python', 'PyAutoGUI', 'Pandas'],
    link: 'https://github.com/gabnasc-dev/automacao-tarefas',
  },
];

/** Ligações da constelação (por id) — desenham as linhas entre estrelas. */
export const constellationEdges = [
  ['sge', 'carros'],
  ['sge', 'flix-api'],
  ['flix-api', 'flix-app'],
  ['flix-app', 'cassandra'],
  ['sge', 'cassandra'],
  ['analise-dados', 'cassandra'],
  ['carros', 'automacao'],
  ['automacao', 'analise-dados'],
];

/**
 * Skill tree. `tier` controla a camada (0 = núcleo).
 * `x`/`y` no espaço 1000×640 do SVG.
 */
export const skills = [
  { id: 'core', name: 'Gabriel', group: 'core', x: 500, y: 320, level: 0, tier: 0,
    desc: 'Núcleo do sistema. Backend em primeiro lugar, web de ponta a ponta.' },

  { id: 'python', name: 'Python', group: 'backend', x: 300, y: 200, level: 90, tier: 1,
    desc: 'Linguagem principal. APIs, automações, análise de dados e visão computacional.' },
  { id: 'django', name: 'Django', group: 'backend', x: 150, y: 130, level: 85, tier: 2,
    desc: 'Framework do dia a dia. ORM, admin, autenticação e arquitetura de apps.' },
  { id: 'drf', name: 'Django REST', group: 'backend', x: 90, y: 265, level: 80, tier: 3,
    desc: 'APIs REST com serializers, viewsets, permissões, filtros e paginação.' },

  { id: 'js', name: 'JavaScript', group: 'frontend', x: 700, y: 200, level: 75, tier: 1,
    desc: 'ES6+, manipulação de DOM, async/await e consumo de APIs.' },
  { id: 'react', name: 'React', group: 'frontend', x: 860, y: 135, level: 70, tier: 2,
    desc: 'Componentes, hooks, estado e integração com APIs REST.' },
  { id: 'html', name: 'HTML5', group: 'frontend', x: 905, y: 270, level: 85, tier: 2,
    desc: 'Marcação semântica, acessibilidade e estrutura de documento.' },
  { id: 'css', name: 'CSS3', group: 'frontend', x: 830, y: 390, level: 80, tier: 2,
    desc: 'Flexbox, grid, animações e design responsivo.' },

  { id: 'postgres', name: 'PostgreSQL', group: 'data', x: 355, y: 480, level: 78, tier: 2,
    desc: 'Banco relacional de produção. Modelagem, queries e integridade.' },
  { id: 'mysql', name: 'MySQL', group: 'data', x: 200, y: 425, level: 70, tier: 2,
    desc: 'Modelagem relacional, joins e otimização de consultas.' },
  { id: 'cassandra', name: 'Cassandra', group: 'data', x: 520, y: 545, level: 58, tier: 2,
    desc: 'NoSQL distribuído orientado a colunas. Modelagem em CQL sobre cluster em Docker.' },

  { id: 'docker', name: 'Docker', group: 'infra', x: 690, y: 480, level: 70, tier: 2,
    desc: 'Docker e Compose em produção nos projetos: PostgreSQL, cluster Cassandra e ambientes reprodutíveis.' },
  { id: 'git', name: 'Git', group: 'infra', x: 500, y: 145, level: 82, tier: 1,
    desc: 'Versionamento, branches, resolução de conflitos e fluxo colaborativo.' },
  { id: 'aws', name: 'AWS', group: 'infra', x: 810, y: 570, level: 45, tier: 3,
    desc: 'Fundamentos de nuvem e hospedagem de aplicações.' },
];

export const skillEdges = [
  ['core', 'python'], ['core', 'js'], ['core', 'git'], ['core', 'postgres'], ['core', 'docker'],
  ['python', 'django'], ['django', 'drf'], ['python', 'postgres'],
  ['js', 'react'], ['js', 'html'], ['html', 'css'], ['react', 'css'],
  ['postgres', 'mysql'], ['postgres', 'cassandra'], ['django', 'postgres'],
  ['docker', 'aws'], ['docker', 'postgres'], ['drf', 'react'],
  ['docker', 'cassandra'],
];

export const timeline = [
  { year: '2024', title: 'Início da graduação', desc: 'Engenharia de Software na UniAcademia.' },
  { year: '2024', title: 'Fundamentos', desc: 'Python, lógica de programação e desenvolvimento web.' },
  { year: '2025', title: 'Revenda de Carros', desc: 'Primeiro grande projeto: Django, PostgreSQL e integração com Mistral AI.' },
  { year: '2025', title: 'Dados e automação', desc: 'Análise de cancelamento sobre 800 mil clientes e automação de cadastros com PyAutoGUI.' },
  { year: '2026', title: 'API própria, cliente próprio', desc: 'Flix API em Django REST e o Flix App em Streamlit consumindo ela.' },
  { year: '2026', title: 'Java no backend', desc: 'Web Backend em Java, testando os endpoints com Postman.' },
  { year: '2026', title: 'Sistema de Gestão de Estoque', desc: 'Projeto mais completo até aqui: DRF, JWT, dashboard de métricas, PostgreSQL e Docker Compose.' },
  { year: '2026', title: 'NoSQL distribuído', desc: 'Modelagem em Apache Cassandra sobre cluster em Docker.', current: true },
];

/** Sistema de arquivos virtual usado por ls / cd / cat / tree. */
export const fs = {
  name: '~',
  type: 'dir',
  children: {
    'about.txt': { type: 'file', content: [
      `${profile.name}`,
      `${profile.role} · ${profile.location}`,
      '',
      profile.bio,
      '',
      'FORMAÇÃO',
      ...profile.education.map((e) => `  · ${e.title} — ${e.org} (${e.detail})`),
      '',
      'AGORA',
      ...profile.now.map((n) => `  · ${n}`),
    ].join('\n') },
    'contact.txt': { type: 'file', content:
      contacts.map((c) => `${c.label.padEnd(10)} ${c.value}`).join('\n') },
    'skills.txt': { type: 'file', content: [
      'BACKEND   Python · Django · Django REST · JWT · Git',
      'FRONTEND  HTML5 · CSS3 · JavaScript · React',
      'DADOS     PostgreSQL · MySQL · MongoDB · Cassandra',
      'INFRA     Docker · Docker Compose · AWS',
      '',
      'Rode `skills` para abrir a árvore interativa.',
    ].join('\n') },
    'timeline.txt': { type: 'file', content:
      timeline.map((t) => `${t.year}  ${t.title}\n      ${t.desc}`).join('\n\n') },
    projects: {
      type: 'dir',
      children: Object.fromEntries(projects.map((p) => [
        `${p.id}.md`,
        { type: 'file', content: [
          `# ${p.name}   [${p.status}]`,
          '',
          p.desc,
          '',
          `stack: ${p.tech.join(', ')}`,
          `repo:  ${p.link ?? '— em desenvolvimento —'}`,
        ].join('\n') },
      ])),
    },
    '.void': {
      type: 'dir',
      hidden: true,
      children: {
        'transmissao.log': { type: 'file', content: [
          '[ 00:04:12 ] sinal recebido de origem desconhecida',
          '[ 00:04:19 ] decodificando…',
          '[ 00:04:31 ] "quem chega até aqui costuma gostar de café"',
          '[ 00:04:44 ] tente: coffee',
          '[ 00:05:02 ] tente: konami',
          '[ 00:05:20 ] tente: sudo hire gabriel',
        ].join('\n') },
      },
    },
  },
};
