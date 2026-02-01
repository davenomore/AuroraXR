import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import LanguageSwitcher from './components/LanguageSwitcher';
import KofiButton from './components/KofiButton';
import Aurora3D from './components/Aurora3D';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black relative">
      <Aurora3D />
      <LanguageSwitcher />
      <KofiButton />
      <Hero />

      {/* Featured Projects */}
      <section className="p-10 text-center relative z-10">
        <h2 className="text-3xl font-bold mb-10 text-slate-200">{t.projects.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {t.projects.items.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
