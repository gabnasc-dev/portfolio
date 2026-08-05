import { defineConfig } from 'vite';

export default defineConfig({
  // O site é publicado numa subpasta (gabnasc-dev.github.io/portfolio/).
  // Sem este `base`, o build procura o CSS e o JS na raiz do domínio e a
  // página abre em branco. Ao trocar de hospedagem, ajuste aqui.
  base: '/portfolio/',
  build: {
    // Garante que builds antigos não se acumulem em dist/.
    emptyOutDir: true,
  },
});
