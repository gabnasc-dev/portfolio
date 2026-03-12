import { RevealOnScroll } from "../RevealOnScroll";

export const Projects = () => {
  const projects = [
    {
      title: "Revenda de Carros + IA",
      status: "BETA",
      desc: "Sistema de revenda de carros em Python e Django com PostgreSQL, integrado a IA para otimizar processos.",
      tech: ["Django", "Python", "PostgreSQL"],
      link: "https://github.com/pombinhagab/carros",
    },
    {
      title: "Detecção de Alimentos com IA",
      status: "WIP",
      desc: "Aplicação em Python com OpenCV e IA para identificar alimentos pela câmera e sugerir refeições.",
      tech: ["Python", "OpenCV", "AI"],
      link: "#",
    },
    {
      title: "Flix API",
      status: "DONE",
      desc: "API REST de filmes construída com Django REST Framework, com autenticação, filtros e documentação.",
      tech: ["Django", "DRF", "Python"],
      link: "https://github.com/pombinhagab/flix_api",
    },
    {
      title: "Flix App",
      status: "DONE",
      desc: "Web app que consome a Flix API para exibir e gerenciar catálogo de filmes com interface moderna.",
      tech: ["React", "JavaScript", "API"],
      link: "https://github.com/pombinhagab/flix_app",
    },
    {
      title: "Análise de Dados",
      status: "DONE",
      desc: "Projeto de análise e visualização de dados com Python, explorando datasets e gerando insights.",
      tech: ["Python", "Pandas", "Matplotlib"],
      link: "https://github.com/pombinhagab/analise-dados",
    },
    {
      title: "Automação de Tarefas",
      status: "DONE",
      desc: "Scripts de automação de tarefas repetitivas com Python, aumentando produtividade e eficiência.",
      tech: ["Python", "Automation"],
      link: "https://github.com/pombinhagab/automacao-tarefas",
    },
  ];

  const statusConfig = {
    WIP:  { label: "WIP",  className: "text-red-400 bg-red-500/10 border border-red-500/20" },
    BETA: { label: "BETA", className: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20" },
    DONE: { label: "DONE", className: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" },
  };

  return (
    <section
      id="projects"
      className="py-20 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950"
    >
      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Projetos
          </h2>
          <p className="text-gray-400 text-center mb-10 text-sm tracking-wide">
            Alguns dos projetos que desenvolvi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, index) => {
              const status = statusConfig[project.status] ?? statusConfig.DONE;
              const isDisabled = project.link === "#";

              return (
                <div
                  key={index}
                  className="flex flex-col p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.12)] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-semibold text-white leading-snug">
                      {project.title}
                    </h3>
                    <span
                      className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Desc */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">
                    {project.desc}
                  </p>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((tech, key) => (
                      <span
                        key={key}
                        className="bg-blue-500/10 text-blue-400 py-0.5 px-2.5 rounded-full text-xs border border-blue-500/20 hover:bg-blue-500/20 transition"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <div className="flex justify-end">
                    {isDisabled ? (
                      <span className="text-gray-600 text-sm cursor-not-allowed select-none">
                        Em breve ⭢
                      </span>
                    ) : (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Ver Projeto ⭢
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
