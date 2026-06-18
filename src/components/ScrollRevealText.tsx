import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollRevealTextProps {
  onComplete: () => void;
}

export default function ScrollRevealText({ onComplete }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const text = "We worden gemiddeld ouder dan ooit tevoren. Onze levensverwachting blijft stijgen. Maar er is een verborgen realiteit. Onze 'gezonde' levensverwachting stijgt niet in hetzelfde tempo mee. Dit betekent dat we aan het einde van ons leven gemiddeld langer kampen met chronische ziekten, vermoeidheid of beperkingen. Je doel is niet simpelweg zo oud mogelijk worden. Je ware doel is zo lang mogelijk reëel, vitaal en onafhankelijk leven. Hier draait de Bio-Score om. Neem de regie over je gezonde jaren.";
  const words = text.split(" ");

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-[#111111] text-white"
      style={{ height: "300vh" }} // 3 screens tall to allow slow scrolling
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D56B45]/10 via-[#111111]/80 to-[#111111] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center text-center gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-5 relative z-10">
          {words.map((word, i) => {
            const start = (i / words.length) * 0.8; // finish text animation at 80% scroll
            const end = start + (1 / words.length);
            
            // Each word fades in as scroll passes its specific start/end window
            const opacity = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start, end], [0.15, 0.15, 1]);
            
            // Adding a blur effect for an extra cinematic feel
            const blur = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start, end], ["blur(8px)", "blur(8px)", "blur(0px)"]);

            return (
              <motion.span
                key={i}
                style={{ opacity, filter: blur }}
                className="text-2xl sm:text-4xl md:text-5xl font-black font-sans leading-tight tracking-tight text-white"
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        {/* Final Button reveals when scroll is almost at the end */}
        <motion.div
          style={{ 
            opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]),
            y: useTransform(scrollYProgress, [0.85, 0.95], [40, 0]),
            pointerEvents: useTransform(scrollYProgress, (v) => v > 0.9 ? "auto" : "none") as any
          }}
          className="absolute bottom-12 sm:bottom-24 w-full flex justify-center z-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(213,107,69,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="px-8 sm:px-12 py-4 sm:py-5 bg-[#D56B45] text-white font-black text-sm sm:text-lg tracking-widest uppercase rounded-2xl flex items-center space-x-4 transition-all duration-300"
          >
            <span>Open Interactief Dashboard</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
