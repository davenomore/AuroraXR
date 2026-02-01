import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* Content Container with Glass Effect */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="z-10 text-center flex flex-col items-center p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl max-w-2xl mx-4"
            >
                <div className="mb-2">
                    {/* Optional: Small accent icon or line here if needed */}
                </div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-sm pb-2"
                >
                    AuroraXR
                </motion.h1>

                <motion.p
                    className="mt-4 text-xl text-slate-200 font-medium tracking-wide"
                >
                    {t.hero.tagline}
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 z-10"
            >
                <ArrowDown className="text-cyan-400 w-8 h-8" />
            </motion.div>
        </section>
    );
}
