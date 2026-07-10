import React, { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { UserInputs } from '../types';
import { useLanguage } from '../context/LanguageContext';
import Confetti from './Confetti';
import { ChevronRight } from 'lucide-react';
import { calculateFallbackLifeExpectancy } from '../api/cbs';

interface OnboardingLifeExpectancyRevealProps {
  inputs: UserInputs;
  cbsBaseLife: number;
  projectedLifeExpectancy: number;
  onComplete: () => void;
}

export default function OnboardingLifeExpectancyReveal({
  inputs,
  cbsBaseLife,
  projectedLifeExpectancy,
  onComplete
}: OnboardingLifeExpectancyRevealProps) {
  const { t } = useLanguage();
  
  const difference = projectedLifeExpectancy - cbsBaseLife;
  const isIncreased = difference > 0.5;
  const isDecreased = difference < -0.5;

  const lifeAtBirth = calculateFallbackLifeExpectancy(inputs.birthYear, inputs.gender, 0);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isIncreased) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isIncreased]);

  // Circle animation settings
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;

  return (
    <div className="absolute inset-0 w-full h-full overflow-y-auto bg-gradient-to-br from-[#E25C26] to-[#B84E29] text-white flex flex-col">
      {showConfetti && <Confetti color="#FFFFFF" />}
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 w-full max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full text-center space-y-8"
        >
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white/90">
              {t('onboarding.revealScreen.title')}
            </h2>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-md">
                <circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <div className="text-6xl sm:text-7xl font-black tabular-nums tracking-tighter drop-shadow-lg relative z-10">
                {Math.round(projectedLifeExpectancy)}
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-lg sm:text-xl font-medium text-amber-200 leading-relaxed pt-2"
            >
              {isIncreased ? t('onboarding.revealScreen.increased') : ''}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 mt-8 max-w-sm mx-auto text-left"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/80">{t('onboarding.revealScreen.birthYear')}</span>
              <span className="font-bold text-white">{inputs.birthYear}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/80">{t('onboarding.revealScreen.currentAge')}</span>
              <span className="font-bold text-white">{inputs.currentAge} {t('common.yr', { defaultValue: 'jr' })}</span>
            </div>
            <div className="w-full h-px bg-white/20 my-2" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/80 pr-4">{t('onboarding.revealScreen.expectancyAtBirth')}</span>
              <span className="font-bold text-amber-200 shrink-0">{Math.round(lifeAtBirth)} {t('common.yr', { defaultValue: 'jr' })}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="pt-8"
          >
            <button
              onClick={onComplete}
              className="w-full py-4 bg-white hover:bg-stone-100 text-[#D56B45] font-black text-sm sm:text-base tracking-widest uppercase rounded-2xl flex items-center justify-center space-x-3 shadow-xl transition-all duration-300 active:scale-95"
            >
              <span>{t('onboarding.revealScreen.openDashboard')}</span>
              <ChevronRight className="w-5 h-5" strokeWidth={3} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
