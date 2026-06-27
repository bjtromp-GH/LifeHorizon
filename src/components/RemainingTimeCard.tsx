import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface RemainingTimeCardProps {
  totalRemaining: number;
}

export default function RemainingTimeCard({ totalRemaining }: RemainingTimeCardProps) {
  const { t } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const [showHand, setShowHand] = useState(true);

  const slides = [
    { type: 'default' },
    { type: 'summers', count: Math.round(totalRemaining) },
    { type: 'coffees', count: Math.round(totalRemaining * 365.25) },
    { type: 'sunsets', count: Math.round(totalRemaining * 365.25) },
    { type: 'weekends', count: Math.round(totalRemaining * 52.17) },
  ];

  useEffect(() => {
    if (showHand) {
      const timer = setTimeout(() => setShowHand(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showHand]);

  const nextSlide = () => {
    setShowHand(false);
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[slideIndex];

  return (
    <div 
      className="relative flex flex-col items-center justify-center py-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs cursor-pointer overflow-hidden transition-all hover:bg-white/15"
      onClick={nextSlide}
    >
      <AnimatePresence>
        {showHand && slideIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 0.3 },
              y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
            }}
            className="absolute top-1 right-2 z-50 text-xl sm:text-2xl drop-shadow-lg pointer-events-none"
          >
            👇
          </motion.div>
        )}
      </AnimatePresence>

      <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-100 mb-1 text-center">
        {t('mobileContainer.conclusion.remainingTime')}
      </span>

      <div className="h-[56px] w-full flex items-center justify-center px-2">
        <AnimatePresence mode="wait">
          {slide.type === 'default' ? (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-extrabold font-mono tracking-tight text-white mb-0.5">
                {totalRemaining.toFixed(1)} {t('decadeGrid.yr')}
              </span>
              <span className="text-[10px] font-sans text-white/80 text-center">
                {t('mobileContainer.conclusion.weeksLeft').replace('{{weeks}}', Math.round(totalRemaining * 52.17).toLocaleString(t('dashboard.lang')))}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={slide.type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white text-center leading-tight">
                {t(`mobileContainer.conclusion.slides.${slide.type}`, { count: slide.count!.toLocaleString(t('dashboard.lang')) })}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex space-x-1.5 mt-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === slideIndex ? "bg-amber-100 scale-125" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
