import { motion } from 'framer-motion';

export default function ProjectCard({ title, description, image, tags, demoUrl, status }) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 group cursor-pointer overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="h-48 bg-black/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-white/5">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                ) : (
                    <div className="text-slate-500 flex flex-col items-center">
                        <span className="text-4xl mb-2">🚀</span>
                        <span className="text-xs uppercase tracking-widest opacity-50">Preview</span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-30 transition-opacity" />

                {/* Status Badge */}
                {status && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-sm">
                        <span className="text-xs text-amber-300 font-medium">{status}</span>
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{description}</p>

            <div className="flex gap-2 flex-wrap mb-4">
                {tags?.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Demo Button */}
            {demoUrl && (
                <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 hover:border-cyan-400 transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span>Launch Demo</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            )}
        </motion.div>
    );
}
