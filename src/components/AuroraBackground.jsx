export default function AuroraBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Top Left - Purple */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />

            {/* Bottom Right - Cyan */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />

            {/* Center/Random accents to fill space */}
            <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-indigo-900/20 rounded-full blur-[150px] animate-pulse delay-2000" />
        </div>
    );
}
