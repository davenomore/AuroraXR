import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

export default function KofiButton() {
    const { t } = useLanguage();

    return (
        <motion.a
            href="https://ko-fi.com/auroraxr"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:border-cyan-500/50 transition-all group overflow-hidden"
        >
            {/* Aurora Gradient Background (Hidden by default, easier to read text on dark, but shows on hover or as border accent) */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 opacity-100 group-hover:opacity-100 transition-opacity" />

            {/* Animated Glow Line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

            <Coffee className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors relative z-10" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-100 to-purple-100 group-hover:from-cyan-300 group-hover:to-purple-300 relative z-10">
                {t.support.text}
            </span>
        </motion.a>
    );
}
