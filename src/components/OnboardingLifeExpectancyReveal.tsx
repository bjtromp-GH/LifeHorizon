import React, { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { UserInputs } from '../types';
import { useLanguage } from '../context/LanguageContext';
import Confetti from './Confetti';
import { ChevronRight } from 'lucide-react';

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

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isIncreased) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isIncreased]);

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
            <div className="text-6xl sm:text-7xl font-black tabular-nums tracking-tighter drop-shadow-lg">
              {Math.round(projectedLifeExpectancy)}
            </div>
            
            <p className="text-lg sm:text-xl font-medium text-amber-200 leading-relaxed pt-2">
              {isIncreased 
                ? t('onboarding.revealScreen.increased') 
                : isDecreased 
                  ? t('onboarding.revealScreen.decreased') 
                  : t('onboarding.revealScreen.neutral')}
            </p>
            
            <p className="text-sm text-white/70">
              {t('onboarding.revealScreen.explanation').replace('{{year}}', inputs.birthYear.toString()).replace('{{gender}}', inputs.gender === 'man' ? 'man' : 'vrouw')}
            </p>
          </div>

          {/* Animated Bar Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-6 mt-8">
            {/* Base Expectancy */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-white/80">{t('onboarding.revealScreen.baseDesc')}</span>
                <span>{Math.round(cbsBaseLife)}</span>
              </div>
              <div className="h-4 bg-black/20 rounded-full overflow-hidden w-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (cbsBaseLife / 100) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-white/40 rounded-full"
                />
              </div>
            </div>

            {/* Projected Expectancy */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-amber-100">
                <span>{t('onboarding.revealScreen.personalDesc')}</span>
                <span>{Math.round(projectedLifeExpectancy)}</span>
              </div>
              <div className="h-4 bg-black/20 rounded-full overflow-hidden w-full flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (cbsBaseLife / 100) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-amber-300 rounded-l-full"
                />
                {difference > 0 && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (difference / 100) * 100)}%` }}
                    transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
                    className="h-full bg-green-400 rounded-r-full"
                  />
                )}
                {difference < 0 && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (Math.abs(difference) / 100) * 100)}%` }}
                    transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
                    className="h-full bg-red-400 rounded-r-full"
                  />
                )}
              </div>
            </div>
          </div>

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
