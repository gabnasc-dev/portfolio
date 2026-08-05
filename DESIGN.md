---
name: NebulaOS
description: Sistema operacional fictício à deriva no espaço profundo — preto, azul-marinho e azul elétrico, JetBrains Mono + Archivo, terminal Win95 reinterpretado
colors:
  void: "#03050d"
  deep: "#060b1a"
  navy: "#0a1226"
  navy-2: "#0e1932"
  blue: "#2f7dff"
  blue-soft: "#4d93ff"
  ice: "#7fc4ff"
  fg: "#d3ddf0"
  fg-dim: "#8698b8"
  fg-faint: "#5a6b8a"
  fg-path: "#9db6e0"
  white: "#ffffff"
  ok: "#4fd39b"
  warn: "#e8b661"
  err: "#ef6a6a"
  err-soft: "#ffb9b9"
  glitch-warm: "#ff5f7a"
  glitch-cool: "#4ad6ff"
  edge: "rgba(120, 165, 235, 0.14)"
  edge-strong: "rgba(140, 185, 255, 0.28)"
  divider: "rgba(120, 165, 235, 0.09)"
  divider-soft: "rgba(120, 165, 235, 0.08)"
typography:
  root:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "1.6"
    letterSpacing: "normal"
  display-lg:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "1"
    letterSpacing: "normal"
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: "1.25"
    letterSpacing: "normal"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: "normal"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "1.5"
    letterSpacing: "0.02em"
  body:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: "1.72"
    letterSpacing: "normal"
  body-sm:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: "1.75"
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: "1.6"
    letterSpacing: "0.06em"
  caption:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0.14em"
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "9.5px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "0.24em"
rounded:
  hair: "2px"
  xxs: "3px"
  xs: "5px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  pill: "999px"
components:
  window:
    backgroundColor: "linear-gradient(170deg, rgba(14,25,50,.82), rgba(6,11,26,.92))"
    borderColor: "rgba(120,165,235,.14)"
    rounded: "{rounded.lg}"
  button:
    backgroundColor: "rgba(47,125,255,.12)"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  chip:
    backgroundColor: "rgba(47,125,255,.09)"
    textColor: "{colors.ice}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# NebulaOS — sistema de design

A premissa visual é a de um computador antigo encontrado a bordo de uma nave
abandonada: a máquina ainda liga, a tela ainda brilha, mas ninguém está a bordo
há muito tempo. Isso dita todas as decisões abaixo.

## Cor

A paleta é deliberadamente estreita: **preto profundo, azul-marinho e azul
elétrico**. Nada de neon saturado — o brilho vem de opacidade e sombra, não de
croma. `--blue` (#2f7dff) é o azul de trabalho; `--ice` (#7fc4ff) é o realce,
reservado a cursor, links, rótulos de destaque e estados de foco. As três cores
semânticas (`ok`, `warn`, `err`) aparecem apenas em status de projeto, mensagens
de erro e telas de fim de jogo.

Superfícies nunca são opacas: as janelas usam `backdrop-filter` sobre a nebulosa
para que o fundo continue presente por trás da interface.

Duas cores fogem do azul de propósito e só existem no glitch: `glitch-warm` e
`glitch-cool` são as camadas de separação RGB do texto com defeito. Elas nunca
aparecem em estado normal — se aparecessem, o glitch deixaria de significar
"algo deu errado".

## Tipografia

Duas famílias, com papéis fixos:

- **JetBrains Mono** — tudo que é "máquina": terminal, rótulos, metadados,
  chips, barras de status. É a voz padrão do sistema.
- **Archivo** — tudo que é "humano": títulos de projeto, nomes de estrela
  e de nó, títulos de janela de conteúdo. Aparece só onde há um texto redigido
  para ser lido, não executado.

A escala é densa e de passos curtos porque a interface imita um terminal, onde
a informação é compacta por natureza.

`root` (15px) é só a base herdada pelo documento — quase todo elemento a
sobrescreve. `display-lg` (28px) aparece uma única vez, no selo de permissão
concedida, e é glifo decorativo, não texto corrido.

## Contornos

Três níveis de linha, todos azul-acinzentado com opacidade baixa em vez de cor
sólida, para que a nebulosa continue visível através das bordas: `edge` nas
molduras de janela, `edge-strong` em estados de foco e hover, e
`divider`/`divider-soft` nas separações internas de listas.

## Movimento

Duas curvas apenas: `cubic-bezier(.22,1,.36,1)` para entradas e transições de
câmera (desaceleração longa, sensação cinematográfica) e
`cubic-bezier(.65,0,.35,1)` para saídas.

O **glitch é vocabulário semântico, não decoração**: só dispara em comando
inválido, operação negada (`rm`, `sudo rm`) e nos easter eggs. Se aparecesse em
transições normais, perderia o significado de "algo saiu errado".

Toda a animação respeita `prefers-reduced-motion`.

## Luz

A lanterna que segue o cursor é o único elemento que reage continuamente ao
usuário. Ela é sutil de propósito (opacidade máxima ~10%) — a leitura deve vir
do contraste do texto, não da luz. Em telas de toque ela é desligada, já que
não há cursor a seguir.

