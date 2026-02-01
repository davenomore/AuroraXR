import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 hover:border-cyan-500/50 text-cyan-400 font-bold transition-colors flex items-center gap-2"
    >
      <span className={language === 'hu' ? 'text-white' : 'text-slate-500'}>HU</span>
      <span className="w-px h-4 bg-slate-700"></span>
      <span className={language === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
    </motion.button>
  );
}
