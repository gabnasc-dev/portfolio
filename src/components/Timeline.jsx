import { motion } from "framer-motion";
import { GraduationCap, Code2, Car, Layers, Zap } from "lucide-react";

export const Timeline = () => {
  const events = [
    {
      year: "2024",
      label: "UniAcademia",
      title: "Início da Graduação",
      desc: "Iniciei minha graduação em Engenharia de Software na UniAcademia. Atualmente estou no 5º período.",
      Icon: GraduationCap,
    },
    {
      year: "2024",
      label: "Fundamentos",
      title: "Primeiros Passos",
      desc: "Me aprofundei em Python, lógica de programação e desenvolvimento web.",
      Icon: Code2,
    },
    {
      year: "2025",
      label: "Primeiro Grande Projeto",
      title: "Revenda de Carros",
      desc: "Desenvolvi um sistema de revenda de carros com Django e integração de IA.",
      Icon: Car,
    },
    {
      year: "2025",
      label: "Expansão de Portfólio",
      title: "Projetos Python",
      desc: "Desenvolvi a Flix API (REST com Django), o Flix App (web app que consome a API), um projeto de análise de dados com Pandas e um sistema de automação de tarefas em Python.",
      Icon: Layers,
    },
    {
      year: "2025",
      label: "Atualmente",
      title: "Aprendendo Java + Spring",
      desc: "Estou expandindo meu stack backend aprendendo Java com Spring Boot, aprofundando conhecimentos em desenvolvimento de APIs robustas e arquitetura de software.",
      Icon: Zap,
      current: true,
    },
  ];

  return (
    <section
      id="timeline"
      className="py-20 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative">

        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-400/70 mb-3 font-medium">Trajetória</p>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Minha Jornada
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-[27px] w-px h-full bg-gradient-to-b from-blue-500/30 via-white/10 to-transparent" />

          <div className="space-y-8">
            {events.map((event, index) => {
              const { Icon } = event;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex gap-5 group"
                >
                  {/* Marcador */}
                  <div className="shrink-0">
                    <div
                      className={`w-[54px] h-[54px] rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        event.current
                          ? "bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.25)] group-hover:shadow-[0_0_24px_rgba(6,182,212,0.4)]"
                          : "bg-white/5 border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/5"
                      }`}
                    >
                      <Icon
                        size={22}
                        className={event.current ? "text-cyan-400" : "text-blue-400"}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className={`flex-1 ${index === events.length - 1 ? "pb-0" : "pb-8"}`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        event.current
                          ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
                          : "text-blue-400 bg-blue-500/10 border-blue-500/20"
                      }`}>
                        {event.year}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{event.label}</span>
                    </div>

                    <h3 className={`text-base font-semibold mb-1 ${event.current ? "text-cyan-300" : "text-white"}`}>
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{event.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
