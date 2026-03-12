// About.jsx
import { RevealOnScroll } from "../RevealOnScroll";
import { Timeline } from "../Timeline";

const SkillBadge = ({ tech }) => (
  <span className="bg-white/5 border border-white/10 text-gray-300 py-1.5 px-3 rounded-lg text-sm font-medium hover:border-blue-500/40 hover:text-blue-300 hover:bg-blue-500/10 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all duration-200 cursor-default">
    {tech}
  </span>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition-all duration-300">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</h3>
    </div>
    {children}
  </div>
);

export const About = () => {
  const backendSkills = ["Python", "Django", "Django REST Framework", "PostgreSQL", "MySQL", "AWS", "Git"];
  const frontendSkills = ["HTML", "CSS", "React"];

  return (
    <section
      id="about"
      className="py-24 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <RevealOnScroll>
        <div className="max-w-3xl mx-auto px-4 relative">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400/70 mb-3 font-medium">Conheça mais</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Sobre mim
            </h2>
          </div>

          {/* Bio + Skills card */}
          <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.03] mb-6">
            <p className="text-gray-300 leading-relaxed">
              Desenvolvedor apaixonado por backend e desenvolvimento web, criando soluções inovadoras com Python, Django e React. Sempre buscando aprender novas tecnologias e entregar código limpo e eficiente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">Frontend</p>
                <div className="flex flex-wrap gap-2">
                  {frontendSkills.map((tech, key) => <SkillBadge key={key} tech={tech} />)}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">Backend</p>
                <div className="flex flex-wrap gap-2">
                  {backendSkills.map((tech, key) => <SkillBadge key={key} tech={tech} />)}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 mt-8 pt-6">
              <a
                href="https://pombinhagab.github.io/portfolio/Curriculo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-2.5 px-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Baixar Currículo
              </a>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Educação" icon="">
              <ul className="space-y-3 text-sm">
                <li className="flex flex-col gap-0.5">
                  <span className="text-white font-semibold">Engenharia de Software</span>
                  <span className="text-gray-500 text-xs">UniAcademia · 5º Período</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="text-white font-semibold">Django Master</span>
                  <span className="text-gray-500 text-xs">Felipe Azambuja · Em andamento</span>
                </li>
              </ul>
            </SectionCard>

            <SectionCard title="Atualmente" icon="">
              <ul className="space-y-3 text-sm">
                <li className="flex flex-col gap-0.5">
                  <span className="text-white font-semibold">Aprendendo Java + Spring Boot</span>
                  <span className="text-gray-500 text-xs">Expandindo o stack backend</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="text-white font-semibold">Projetos Python</span>
                  <span className="text-gray-500 text-xs">APIs, análise de dados e automação</span>
                </li>
              </ul>
            </SectionCard>
          </div>

        </div>
        <Timeline />
      </RevealOnScroll>
    </section>
  );
};
