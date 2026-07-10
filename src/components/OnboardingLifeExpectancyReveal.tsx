import React, { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { UserInputs } from '../types';
import { useLanguage } from '../context/LanguageContext';
import Confetti from './Confetti';
import { ChevronRight, BarChart2 } from 'lucide-react';
import { getHistoricalLifeExpectancyAtBirth } from '../api/cbs';
import LifeExpectancyGraphModal from './LifeExpectancyGraphModal';

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

  const lifeAtBirth = getHistoricalLifeExpectancyAtBirth(inputs.birthYear, inputs.gender);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

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
  const progressPercentage = Math.min(1, inputs.currentAge / projectedLifeExpectancy);
  const progressOffset = circumference - (progressPercentage * circumference);

  return (
    <div className="absolute inset-0 w-full h-full overflow-y-auto bg-gradient-to-br from-[#E25C26] to-[#B84E29] text-white flex flex-col">
      {showConfetti && <Confetti />}
      
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
                <motion.circle
                  cx="96"
                  cy="96"
                  r={circleRadius}
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: progressOffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                />
              </svg>
              <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                <div className="text-6xl sm:text-7xl font-black tabular-nums tracking-tighter drop-shadow-lg leading-none">
                  {Math.round(projectedLifeExpectancy)}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80 mt-1">
                  {t('onboarding.revealScreen.years')}
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex items-center justify-center space-x-2 mt-4"
            >
              <span className="w-3 h-3 rounded-full bg-[#FCD34D] shadow-sm inline-block"></span>
              <span className="text-sm sm:text-base font-medium text-white/90">
                {t('onboarding.revealScreen.alreadyLived', { percent: Math.round(progressPercentage * 100).toString() })}
              </span>
            </motion.div>
            
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
            className="relative mt-8 max-w-sm mx-auto w-full"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 pr-8 sm:pr-12 space-y-4 text-left">
              <div className="flex justify-between items-center text-base sm:text-lg">
                <span className="text-white/80">{t('onboarding.revealScreen.birthYear')}</span>
                <span className="font-bold text-white relative z-10">{inputs.birthYear}</span>
              </div>
              <div className="flex justify-between items-center text-base sm:text-lg">
                <span className="text-white/80">{t('onboarding.revealScreen.currentAge')}</span>
                <span className="font-bold text-white relative z-10">{inputs.currentAge} {t('onboarding.revealScreen.years')}</span>
              </div>
              <div className="w-full h-px bg-white/20 my-3 relative z-10" />
              <div className="flex justify-between items-center text-base sm:text-lg relative z-10">
                <span className="text-white/80 pr-4">{t('onboarding.revealScreen.expectancyAtBirth')}</span>
                <span className="font-bold text-amber-200 shrink-0">{Math.round(lifeAtBirth)} {t('onboarding.revealScreen.years')}</span>
              </div>
            </div>
            
            <img 
              src="/img/Olifant.png" 
              alt="Olifant Mascotte" 
              className="absolute left-4 sm:left-8 bottom-full w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-xl z-20 pointer-events-none" 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
            className="pt-6"
          >
            <button
              onClick={() => setShowGraph(true)}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/95 hover:text-white mx-auto text-sm font-medium transition-all active:scale-95 shadow-sm"
            >
              <BarChart2 className="w-4 h-4 opacity-80" />
              <span>Bekijk grafiek overlevingsleeftijd</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="pt-6"
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
      
      <LifeExpectancyGraphModal 
        isOpen={showGraph} 
        onClose={() => setShowGraph(false)} 
        inputs={inputs} 
        cbsBaseLife={cbsBaseLife} 
        projectedLifeExpectancy={projectedLifeExpectancy} 
      />
    </div>
  );
}
