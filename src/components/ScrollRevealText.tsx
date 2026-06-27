import React, { useEffect, useRef, useState } from 'react';
import { motion } from "motion/react";
import { useLanguage } from '../context/LanguageContext';

interface ScrollRevealTextProps {
  onComplete: () => void;
}

export default function ScrollRevealText({ onComplete }: ScrollRevealTextProps) {
  const { t } = useLanguage();
  const text = t('onboarding.revealText');
  const words = text.split(" ");
  
  const totalRevealTime = 4.5; // Spread the word reveal over 4.5 seconds
  const buttonRevealTime = totalRevealTime + 1; // Show button shortly after text finishes

  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    
    const t = setTimeout(() => setShowButton(true), buttonRevealTime * 1000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t);
    };
  }, [buttonRevealTime]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-y-auto bg-gradient-to-br from-[#E25C26] to-[#B84E29] text-white">
      <div className="relative w-full min-h-full flex flex-col items-center justify-center p-6 sm:p-12 md:p-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={
            isMobile && showButton 
              ? { opacity: 0, height: 0, marginBottom: 0, scale: 0.5 }
              : { opacity: 1, scale: 1, y: [-20, -10, -20], height: 'auto', marginBottom: isMobile ? 24 : 32 }
          }
          transition={
            isMobile && showButton 
              ? { duration: 0.8, ease: "easeInOut" }
              : { 
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  opacity: { duration: 1 },
                  scale: { duration: 1 }
                }
          }
          className="z-10 overflow-hidden shrink-0 mt-8"
        >
          <img src="/img/olifant-bril.png" alt="Olifant Mascotte" className="w-20 h-20 sm:w-28 sm:h-28 object-contain" />
        </motion.div>
        
        <motion.div 
          animate={isMobile && showButton ? { y: -20 } : { y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="max-w-4xl xl:max-w-5xl mx-auto flex flex-wrap justify-center text-center gap-x-2 sm:gap-x-2.5 relative z-10 w-full content-center"
        >
          {words.map((word, i) => {
            const delay = (i / words.length) * totalRevealTime;

            return (
              <React.Fragment key={i}>
                <motion.span
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay, ease: "easeOut" }}
                  className="text-lg sm:text-2xl md:text-3xl font-bold font-sans leading-snug tracking-tight text-white py-1"
                >
                  {word}
                </motion.span>
                {word === "ouder" && <div className="w-full sm:hidden" />}
              </React.Fragment>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, pointerEvents: "none" }}
          animate={{ opacity: 1, y: 0, pointerEvents: "auto" }}
          transition={{ duration: 1, delay: buttonRevealTime, ease: "easeOut" }}
          className="mt-12 sm:mt-16 w-full flex justify-center z-20 shrink-0 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-[#D56B45] font-black text-sm sm:text-base md:text-lg tracking-widest uppercase rounded-2xl flex items-center space-x-4 transition-all duration-300"
          >
            <span>{t('onboarding.ready.openDashboard')}</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
