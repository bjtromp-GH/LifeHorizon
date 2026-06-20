import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollRevealTextProps {
  onComplete: () => void;
}

export default function ScrollRevealText({ onComplete }: ScrollRevealTextProps) {
  const text = "We worden gemiddeld ouder dan ooit tevoren. Onze levensverwachting blijft stijgen. Maar er is een verborgen realiteit. Onze 'gezonde' levensverwachting stijgt niet in hetzelfde tempo mee. Dit betekent dat we aan het einde van ons leven gemiddeld langer kampen met chronische ziekten, vermoeidheid of beperkingen. Je doel is niet simpelweg zo oud mogelijk worden. Je ware doel is zo lang mogelijk reëel, vitaal en onafhankelijk leven. Hier draait de Bio-Score om. Neem de regie over je gezonde jaren.";
  const words = text.split(" ");
  
  const totalRevealTime = 4.5; // Spread the word reveal over 4.5 seconds
  const buttonRevealTime = totalRevealTime + 1; // Show button shortly after text finishes

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-[#E25C26] to-[#B84E29] text-white">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8 sm:p-16 md:p-24 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8 sm:mb-12 z-10"
        >
          <img src="/img/olifant-bril.png" alt="Olifant Mascotte" className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
        </motion.div>
        
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center text-center gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 relative z-10 w-full content-center">
          {words.map((word, i) => {
            const delay = (i / words.length) * totalRevealTime;

            return (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay, ease: "easeOut" }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-sans leading-tight tracking-tight text-white drop-shadow-sm"
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, pointerEvents: "none" }}
          animate={{ opacity: 1, y: 0, pointerEvents: "auto" }}
          transition={{ duration: 1, delay: buttonRevealTime, ease: "easeOut" }}
          className="absolute bottom-8 sm:bottom-16 w-full flex justify-center z-20"
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
