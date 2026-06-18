import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollRevealTextProps {
  onComplete: () => void;
}

export default function ScrollRevealText({ onComplete }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const text = "We worden gemiddeld ouder dan ooit tevoren. Onze levensverwachting blijft stijgen. Maar er is een verborgen realiteit. Onze 'gezonde' levensverwachting stijgt niet in hetzelfde tempo mee. Dit betekent dat we aan het einde van ons leven gemiddeld langer kampen met chronische ziekten, vermoeidheid of beperkingen. Je doel is niet simpelweg zo oud mogelijk worden. Je ware doel is zo lang mogelijk reëel, vitaal en onafhankelijk leven. Hier draait de Bio-Score om. Neem de regie over je gezonde jaren.";
  const words = text.split(" ");

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-y-auto bg-black text-white"
    >
      <div style={{ height: "300vh" }} className="relative w-full">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center text-center gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-4 relative z-10">
            {words.map((word, i) => {
              const start = (i / words.length) * 0.85; 
              const end = start + (1 / words.length);
              
              const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

              return (
                <motion.span
                  key={i}
                  style={{ opacity }}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sans leading-snug tracking-tight text-white"
                >
                  {word}
                </motion.span>
              );
            })}
          </div>

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
    </div>
  );
}
