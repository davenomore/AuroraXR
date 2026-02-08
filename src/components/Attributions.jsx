import React from 'react';
import { ArrowLeft, ExternalLink, Code2, Palette, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Attributions({ onBack }) {
    const credits = [
        {
            category: "Shader Art & Visuals",
            icon: <Palette className="w-5 h-5 text-purple-400" />,
            items: [
                {
                    title: "Aurora Borealis Shader",
                    author: "nimitz",
                    source: "ShaderToy: XtGGRt",
                    url: "https://www.shadertoy.com/view/XtGGRt",
                    description: "The core volumetric aurora effect used in the background is based on the incredible work by nimitz.",
                    license: "Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License"
                },
                {
                    title: "Simplex Noise (GLSL)",
                    author: "Ashima Arts / Ian McEwan",
                    source: "GitHub: webgl-noise",
                    url: "https://github.com/ashima/webgl-noise",
                    description: "The noise algorithm powering the organic movement of the aurora and other effects.",
                    license: "MIT License"
                },
                {
                    title: "Three.js Challenge #0",
                    author: "Bruno Simon / Community",
                    source: "threejs-challenge-0.netlify.app",
                    url: "https://threejs-challenge-0.netlify.app",
                    description: "Inspiration and reference for shader techniques and visual composition.",
                    license: "Open Source"
                }
            ]
        },
        {
            category: "Libraries & Core",
            icon: <Code2 className="w-5 h-5 text-blue-400" />,
            items: [
                {
                    title: "Three.js",
                    author: "Ricardo Cabello (mrdoob)",
                    source: "threejs.org",
                    url: "https://threejs.org/",
                    description: "The standard 3D library that makes WebGL possible in the browser.",
                    license: "MIT License"
                },
                {
                    title: "React Three Fiber",
                    author: "Poimandres",
                    source: "GitHub: pmndrs/react-three-fiber",
                    url: "https://github.com/pmndrs/react-three-fiber",
                    description: "React renderer for Three.js, enabling declarative 3D scenes.",
                    license: "MIT License"
                },
                {
                    title: "Lucide Icons",
                    author: "Lucide Contributors",
                    source: "lucide.dev",
                    url: "https://lucide.dev/",
                    description: "Beautiful & consistent icon set used throughout the UI.",
                    license: "ISC License"
                }
            ]
        }
    ];

    return (
        <div className="absolute inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-300 group-hover:text-white" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Credits & Resources</h1>
                        <p className="text-slate-400">Honoring the open-source creators and code that made this project possible.</p>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-12">
                    {credits.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                {section.icon}
                                <h2 className="text-xl font-semibold text-white">{section.category}</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {section.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl p-6 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <div className="text-sm text-cyan-300 mb-3 font-mono">
                                                    by {item.author}
                                                </div>
                                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                                    {item.description}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5">
                                                        {item.license}
                                                    </span>
                                                </div>
                                            </div>

                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                title="View Source"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
