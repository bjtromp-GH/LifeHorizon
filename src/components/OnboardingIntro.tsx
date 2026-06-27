import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { UserInputs, Gender, ActivityLevel, SleepLevel, StressLevel } from "../types";
import { playChimeSound } from "../utils/audio";
import AgeScrollPicker from "./AgeScrollPicker";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  User, 
  Heart, 
  Dna, 
  Briefcase, 
  CheckCircle2, 
  Info,
  Calendar,
  Smile,
  Target,
  Moon,
  Brain,
  X,
  Flame,
  Zap,
  Activity,
  Compass,
  Cpu,
  Edit3,
  UserRound,
  HeartPulse
} from "lucide-react";
import ScrollRevealText from "./ScrollRevealText";
import Confetti from "./Confetti";

interface OnboardingIntroProps {
  initialStep?: number;
  inputs: UserInputs;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onComplete: () => void;
}

export default function OnboardingIntro({ initialStep = 0, inputs, onInputChange, onComplete }: OnboardingIntroProps) {
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState<number>(initialStep);
  const [imgError, setImgError] = useState(false);
  
  const [localGender, setLocalGender] = useState<Gender | null>(null);
  const [localBirthYear, setLocalBirthYear] = useState<string>(inputs.birthYear.toString());
  const [localAge, setLocalAge] = useState<string>(inputs.currentAge.toString());
  const [ageInteracted, setAgeInteracted] = useState(false);
  const [localStartWorkAge, setLocalStartWorkAge] = useState<string>("");
  const [localFireAge, setLocalFireAge] = useState<string>("");
  const [localSleep, setLocalSleep] = useState<SleepLevel | null>(null);
  const [localActivity, setLocalActivity] = useState<ActivityLevel | null>(null);
  const [localStress, setLocalStress] = useState<StressLevel | null>(null);
  const [geneticsInteracted, setGeneticsInteracted] = useState(false);
  
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showHeredityInfo, setShowHeredityInfo] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const motherSectionRef = useRef<HTMLDivElement>(null);
  const fireAgeSectionRef = useRef<HTMLDivElement>(null);
  const [focusedYear, setFocusedYear] = useState<number>(inputs.birthYear);
  const yearsList = Array.from({ length: 2024 - 1940 + 1 }, (_, i) => 1940 + i);
  const ITEM_HEIGHT = 64;

  useEffect(() => {
    if (showYearPicker && scrollContainerRef.current) {
      const idx = yearsList.findIndex(y => y === inputs.birthYear);
      if (idx >= 0) {
        // slight delay to ensure render is complete
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = idx * ITEM_HEIGHT;
          }
        }, 50);
        setFocusedYear(inputs.birthYear);
      }
    }
  }, [showYearPicker]);

  const handleYearScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const idx = Math.round(scrollTop / ITEM_HEIGHT);
    const newYear = yearsList[Math.min(Math.max(0, idx), yearsList.length - 1)];
    if (newYear !== focusedYear) {
      setFocusedYear(newYear);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const confirmYearSelection = (selectedYear?: number) => {
    const yearToUse = selectedYear || focusedYear;
    setAgeInteracted(true);
    const calculatedAge = 2026 - yearToUse;
    setLocalBirthYear(yearToUse.toString());
    setLocalAge(calculatedAge.toString());
    onInputChange({ 
      birthYear: yearToUse,
      currentAge: Math.max(2, Math.min(100, calculatedAge))
    });
    setShowYearPicker(false);
  };
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const stepsMeta = [
    { title: t('onboarding.demographics.steps.intro'), icon: Sparkles },
    { title: t('onboarding.testimonials.badge'), icon: Sparkles },
    { title: t('common.welcome'), icon: Sparkles },
    { title: t('common.profile'), icon: User },
    { title: t('onboarding.demographics.steps.lifestyle'), icon: Heart },
    { title: t('onboarding.demographics.steps.genetics'), icon: Dna },
    { title: t('onboarding.demographics.steps.career'), icon: Briefcase },
    { title: t('onboarding.demographics.steps.ready'), icon: CheckCircle2 }
  ];

  const steps = [
    { title: t('onboarding.demographics.steps.intro'), icon: Play },
    { title: t('onboarding.demographics.steps.demographics'), icon: UserRound },
    { title: t('onboarding.demographics.steps.lifestyle'), icon: HeartPulse },
    { title: t('onboarding.demographics.steps.genetics'), icon: Dna },
    { title: t('onboarding.demographics.steps.career'), icon: Briefcase },
    { title: t('onboarding.demographics.steps.ready'), icon: CheckCircle2 }
  ];

  const titleLetters = Array.from("Life Horizon");
  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      }
    }
  };
  const letterVars = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 12, stiffness: 250, mass: 0.8 } 
    }
  };

  let canProceed = true;
  if (step === 3) {
    canProceed = localGender !== null && ageInteracted;
  } else if (step === 4) {
    canProceed = localSleep !== null && localActivity !== null && localStress !== null;
  } else if (step === 5) {
    canProceed = geneticsInteracted;
  } else if (step === 6) {
    canProceed = localStartWorkAge !== "" && localFireAge !== "";
  }

  useEffect(() => {
    if (canProceed) setShowValidation(false);
  }, [canProceed]);

  const mainScrollRef = useRef<HTMLElement>(null);
  const activitySectionRef = useRef<HTMLDivElement>(null);
  const stressSectionRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (step < 7 && !canProceed) {
      setShowValidation(true);
      return;
    }
    if (step < 8 && canProceed) {
      setShowValidation(false);
      if (step === 0 || step === 1 || step === 2) {
        if (step === 0) playChimeSound();
        setStep((s) => s + 1);
      } else {
        setIsTransitioning(true);
        playChimeSound();
        setTimeout(() => {
          setStep((s) => s + 1);
          setIsTransitioning(false);
        }, 1200);
      }
    } else if (step >= 8) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Helper to handle bio score answer changes
  const updateBioAnswer = (key: "activity" | "sleep" | "stress", value: any) => {
    onInputChange({
      bioAnswers: {
        ...inputs.bioAnswers,
        [key]: value
      }
    });
  };

  return (
    <div className="h-[100dvh] md:h-auto md:min-h-screen overflow-hidden bg-[#FDFDFD] flex flex-col justify-between p-3.5 sm:p-8 font-sans text-[#2D2D2D] select-none relative">
      {/* Abstract elegant background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#FAF3F0] blur-3xl pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#FAFCEE] blur-3xl pointer-events-none z-0" 
      />

      {/* Top Header & Step Progress Bar */}
      <AnimatePresence>
        {step >= 2 && step < 8 && (
          <motion.header 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xl mx-auto flex flex-col items-center pt-1.5 sm:pt-6 z-10"
          >
            <div className="flex items-center space-x-1.5 mb-1.5 sm:mb-3">
              <span className="text-xl">🔥</span>
              <h1 className="font-sans font-extrabold text-xs sm:text-base uppercase tracking-wider text-[#2D2D2D]">
                {t('onboarding.header')}
              </h1>
            </div>

            {step > 2 && (
              <div className="w-full bg-[#EAE8E4] h-1 rounded-full relative overflow-hidden flex mb-1.5 sm:mb-2">
                <motion.div 
                  className="h-full bg-[#D56B45]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step - 2) / (stepsMeta.length - 3)) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}

            {step > 2 && (
              <div className="flex justify-between w-full px-1 text-[9px] sm:text-[10px] text-[#767676] font-medium uppercase tracking-wider">
                <span>{t('common.step')} {step - 2} {t('common.of')} {stepsMeta.length - 3}</span>
                <span className="text-[#D56B45] font-semibold">{stepsMeta[step].title}</span>
              </div>
            )}
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Interactive Slides container */}
      <main ref={mainScrollRef} className={`flex-grow flex items-center justify-center pt-2 pb-24 sm:pt-8 sm:pb-32 z-10 w-full max-w-xl mx-auto px-1 ${step <= 1 ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <AnimatePresence 
          mode="wait" 
          onExitComplete={() => {
            if (mainScrollRef.current) {
              mainScrollRef.current.scrollTop = 0;
            }
          }}
        >
          {isTransitioning ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
            >
              <motion.img 
                src="/img/LR_Olifant_v2.png" 
                initial={{ scale: 0.8, rotate: -5, opacity: 0, y: 20 }}
                animate={{ scale: 1.1, rotate: 0, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-2xl mb-6"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center"
              >
                <h2 className="text-xl sm:text-3xl font-black text-[#D56B45] uppercase tracking-wider mb-2 drop-shadow-sm">{t('onboarding.transition.goodJob')}</h2>
                <p className="text-sm sm:text-lg font-bold text-[#767676]">{t('onboarding.transition.nextStep', { step: (step - 1).toString() })}</p>
              </motion.div>
            </motion.div>
          ) : step === 0 ? (
            <motion.div
              key="splash-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-gradient-to-br from-[#E25C26] via-[#D56B45] to-[#B84E29] flex flex-col justify-between p-6 select-none overflow-hidden z-50 text-white"
            >
              {/* Subtle animated light orb background */}
              <div className="absolute inset-x-0 top-0 h-96 bg-radial-gradient from-white/10 to-transparent blur-2xl pointer-events-none" />
              
              {/* Top Section: Language & Badge */}
              <div className="w-full flex flex-col items-center pt-4 sm:pt-6 z-10 relative space-y-3 sm:space-y-4">
                {/* Language Switch */}
                <div className="flex space-x-3">
                  <button onClick={() => setLanguage('nl')} className={`transition-opacity ${language === 'nl' ? 'opacity-100 grayscale-0 scale-110' : 'opacity-50 grayscale scale-100'} text-2xl sm:text-3xl cursor-pointer hover:opacity-100`}>🇳🇱</button>
                  <button onClick={() => setLanguage('en')} className={`transition-opacity ${language === 'en' ? 'opacity-100 grayscale-0 scale-110' : 'opacity-50 grayscale scale-100'} text-2xl sm:text-3xl cursor-pointer hover:opacity-100`}>🇬🇧</button>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full"
                >
                  <Compass className="w-3.5 h-3.5 text-white" />
                  <span className="font-sans font-bold text-[10px] sm:text-[11px] tracking-widest uppercase text-white">
                    {t('onboarding.splash.badge')}
                  </span>
                </motion.div>
              </div>

              {/* Core Body Container */}
              <div className="flex-grow flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4 z-10 space-y-4 sm:space-y-7">
                
                {/* De Olifant Logo Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, rotate: -15, y: 40 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  transition={{ duration: 1.2, type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="w-48 h-48 sm:w-60 sm:h-60 shrink-0 flex items-end justify-center bg-white/10 border border-white/25 rounded-xl pt-4 px-4 pb-0 sm:pt-5 sm:px-5 sm:pb-0 backdrop-blur-xs shadow-lg relative overflow-hidden group mb-6"
                >
                  <img
                    src="/img/Olifant.png"
                    alt="Olifant"
                    onError={() => setImgError(true)}
                    className={`w-full h-full object-contain object-bottom origin-bottom transition-all duration-500 hover:scale-105 ${imgError ? 'hidden' : 'block'}`}
                  />
                  {imgError && (
                    <div className="flex flex-col items-center justify-center text-white">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-10 h-10 sm:w-14 sm:h-14 stroke-current fill-none stroke-[1.5]"
                      >
                        <path d="M75,50 C75,35 60,25 45,25 C32,25 25,35 25,48 M25,48 C20,49 15,52 15,58 C15,65 22,66 25,66 M25,48 C26,56 28,62 30,75 M45,25 C50,25 55,30 55,38 C55,42 50,44 48,46 M48,46 C48,55 52,65 52,75 M38,48 C38,58 40,68 40,75 M75,40 C82,41 85,45 85,55 C85,68 72,75 72,75 M63,45 C63,55 64,65 64,75" />
                        <circle cx="34" cy="38" r="1.5" className="fill-current" />
                        <path d="M55,32 C58,31 62,32 64,35 C66,38 65,42 63,45" />
                      </svg>
                    </div>
                  )}
                </motion.div>

                {/* Animated Header */}
                <motion.div 
                  variants={containerVars}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center items-center"
                >
                  {titleLetters.map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letterVars}
                      className={`text-[32px] min-[375px]:text-[38px] min-[415px]:text-[42px] sm:text-7xl font-sans font-black tracking-tight select-none inline-block ${char === " " ? "w-2 sm:w-4" : "text-white"} ${index === 8 ? "ml-0.5 sm:ml-1" : ""}`}
                      style={{
                        textShadow: char === " " ? "none" : "0 4px 12px rgba(0,0,0,0.15)"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Slogan */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="space-y-2 sm:space-y-4"
                >
                  <p className="text-sm min-[375px]:text-base sm:text-2xl font-serif italic text-white/95 max-w-lg leading-relaxed font-semibold">
                    {t('onboarding.splash.quote')}
                  </p>
                  <div className="w-12 h-[2px] bg-white/30 mx-auto rounded" />
                </motion.div>
              </div>

              {/* Footer with Continuing button */}
              <div className="w-full max-w-md mx-auto pb-4 sm:pb-12 flex flex-col items-center z-10 space-y-2 sm:space-y-4">
                <motion.button
                  id="btn-orange-splash-continue"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="w-full py-3 px-5 sm:py-4 sm:px-6 bg-white hover:bg-[#FFF8F5] text-[#D56B45] font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-3 shadow-xl border border-white/10 cursor-pointer transition-all duration-200"
                >
                  <span>{t('common.next')}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </motion.button>
                
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.5 }}
                  className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/80 font-mono"
                >
                  {t('onboarding.splash.footer')}
                </motion.span>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-[#201F1D] flex flex-col justify-between p-6 select-none overflow-hidden z-50 text-white"
            >
              {/* Decorative elements */}
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-[#D56B45] blur-[120px] opacity-20 pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-20%] w-96 h-96 rounded-full bg-blue-500 blur-[120px] opacity-10 pointer-events-none" />
              
              <div className="w-full flex flex-col items-center pt-8 sm:pt-12 z-10 space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
                >
                  <span className="text-lg">💬</span>
                  <span className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white/90">
                    {t('onboarding.testimonials.badge')}
                  </span>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-center px-2 leading-snug whitespace-pre-wrap">
                  {Array.from(t('onboarding.testimonials.title1')).map((char, i) => (
                    <motion.span
                      key={`part1-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.04, duration: 0.05 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <br className="block sm:hidden" />
                  {Array.from(t('onboarding.testimonials.title2')).map((char, i) => (
                    <motion.span
                      key={`part2-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + (t('onboarding.testimonials.title1').length * 0.04) + i * 0.04, duration: 0.05 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h2>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center max-w-lg mx-auto z-10 space-y-4 sm:space-y-6 w-full mt-4">
                <div className="space-y-3 sm:space-y-4 w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative"
                  >
                    <p className="text-sm italic text-white/90 leading-relaxed">{t('onboarding.testimonials.t1_quote')}</p>
                    <p className="text-xs font-bold text-[#D56B45] mt-2">{t('onboarding.testimonials.t1_author')}</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative"
                  >
                    <p className="text-sm italic text-white/90 leading-relaxed">{t('onboarding.testimonials.t2_quote')}</p>
                    <p className="text-xs font-bold text-[#D56B45] mt-2">{t('onboarding.testimonials.t2_author')}</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative"
                  >
                    <p className="text-sm italic text-white/90 leading-relaxed">{t('onboarding.testimonials.t3_quote')}</p>
                    <p className="text-xs font-bold text-[#D56B45] mt-2">{t('onboarding.testimonials.t3_author')}</p>
                  </motion.div>
                </div>
              </div>
              
              <div className="w-full max-w-md mx-auto pb-8 sm:pb-12 flex flex-col items-center z-10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="w-full py-3.5 sm:py-4 bg-[#D56B45] hover:bg-[#C25B36] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-xl flex items-center justify-center space-x-3 shadow-lg cursor-pointer transition-all duration-200"
                >
                  <span>{t('onboarding.testimonials.button')}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </motion.button>
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-3.5 sm:space-y-6 max-w-md w-full px-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5, delay: 0.2 }}
                className="mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-[#FAF3F0]/80 border border-[#E9E4E2] flex items-end justify-center shadow-sm relative overflow-hidden group pt-4 px-4 pb-0 sm:pt-5 sm:px-5 sm:pb-0 mb-4 sm:mb-6"
              >
                <img
                  src="/img/Olifant.png"
                  alt="De Olifant"
                  onError={() => setImgError(true)}
                  className={`w-full h-full object-contain object-bottom origin-bottom transition-all duration-500 hover:scale-105 ${imgError ? 'hidden' : 'block'}`}
                />
                {imgError && (
                  <div className="flex flex-col items-center justify-center text-[#D56B45]">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-10 h-10 sm:w-14 sm:h-14 stroke-current fill-none stroke-[1.5]"
                    >
                      <path d="M75,50 C75,35 60,25 45,25 C32,25 25,35 25,48 M25,48 C20,49 15,52 15,58 C15,65 22,66 25,66 M25,48 C26,56 28,62 30,75 M45,25 C50,25 55,30 55,38 C55,42 50,44 48,46 M48,46 C48,55 52,65 52,75 M38,48 C38,58 40,68 40,75 M75,40 C82,41 85,45 85,55 C85,68 72,75 72,75 M63,45 C63,55 64,65 64,75" />
                      <circle cx="34" cy="38" r="1.5" className="fill-current" />
                      <path d="M55,32 C58,31 62,32 64,35 C66,38 65,42 63,45" />
                    </svg>
                  </div>
                )}
              </motion.div>

              <div className="space-y-1.5 sm:space-y-3">
                <h2 className="text-xl sm:text-3xl font-extrabold font-sans tracking-tight text-[#2D2D2D]">
                  {t('onboarding.welcome.title')}
                </h2>
                <p className="text-xs sm:text-sm text-[#767676] leading-relaxed">
                  {t('onboarding.welcome.desc')}
                </p>
              </div>

              <div className="p-2.5 sm:p-3.5 bg-gray-50 rounded-lg border border-[#EAEAEA] text-[11px] sm:text-xs text-left flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#D56B45] shrink-0 mt-0.5" />
                <p className="text-[#767676] leading-snug">
                  {t('onboarding.welcome.info')}
                </p>
              </div>

              <motion.button
                id="btn-intro-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full py-2.5 sm:py-3.5 font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center space-x-2 shadow-md transition-colors duration-200 bg-[#201F1D] hover:bg-[#1A1A1A] text-white cursor-pointer"
              >
                <span>{t('onboarding.welcome.button')}</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </motion.button>
            </motion.div>
          ) : step === 3 ? (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-3 sm:space-y-5 px-1"
            >
              <div className="space-y-0.5 sm:space-y-1.5 text-center sm:text-left">
                <span className="inline-block text-[11px] sm:text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-3 py-1 sm:py-1.5 rounded-md font-extrabold uppercase tracking-wider mb-1 sm:mb-2">
                  {t('onboarding.demographics.badge')}
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#2D2D2D]">
                  {t('onboarding.demographics.title')}
                </h2>
                <p className="text-[11px] sm:text-xs text-[#767676]">
                  {t('onboarding.demographics.desc')}
                </p>
              </div>

              {/* Gender selection */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#767676]">
                  {t('onboarding.demographics.gender')}
                </label>
                <div className={`grid grid-cols-2 gap-2 sm:gap-3 p-1 rounded-xl transition-all duration-300 ${showValidation && localGender === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {(["man", "vrouw"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      id={`btn-onboarding-gender-${g}`}
                      onClick={() => { setLocalGender(g as Gender); onInputChange({ gender: g as Gender }); }}
                      className={`py-2 sm:py-3 rounded-lg border font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${
                        localGender === g
                           ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                           : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-50"
                      }`}
                    >
                      <span>{g === "man" ? t('common.man') : t('common.woman')}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localGender === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">{t('common.required')}</p>
                )}
              </div>

              {/* Birth Year selection */}
              <div className="space-y-1 sm:space-y-3">
                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                  <span className="font-semibold text-[#767676] uppercase tracking-wider">{t('onboarding.demographics.birthYear')}</span>
                  <span className="font-mono text-sm font-extrabold text-[#D56B45]">{inputs.birthYear}</span>
                </div>
                <div 
                  onClick={() => setShowYearPicker(true)}
                  className={`flex items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer bg-white border-2 hover:border-[#D56B45] hover:bg-[#FAF3F0] transition-all duration-300 shadow-sm ${showValidation && !ageInteracted ? 'border-red-400 bg-red-50/80 ring-2 ring-red-400 animate-pulse' : 'border-[#EAEAEA]'}`}
                >
                  <span className="text-2xl sm:text-3xl font-mono font-black text-[#D56B45]">
                    {inputs.birthYear}
                  </span>
                  <span className="ml-3 text-xs sm:text-sm font-bold text-[#767676] uppercase tracking-wider">
                    {t('onboarding.demographics.tapToChange')}
                  </span>
                </div>
                {showValidation && !ageInteracted && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">{t('onboarding.demographics.selectYear')}</p>
                )}
              </div>

              {/* Current Age display and tweak */}
              <div className="space-y-1 sm:space-y-3 pt-0.5 sm:pt-2 pb-1">
                <div className="flex justify-between items-center text-[10px] sm:text-xs bg-[#FAF3F0] p-2.5 rounded-lg border border-[#D56B45]/15">
                  <span className="font-semibold text-[#D56B45] uppercase tracking-wider">{t('onboarding.demographics.currentAge')}</span>
                  <span className="font-mono text-sm sm:text-base font-black text-[#D56B45]">{t('onboarding.demographics.ageYears', { age: inputs.currentAge.toString() })}</span>
                </div>
              </div>

              {/* Own Expected Age Option */}
              <div className="space-y-1.5 sm:space-y-3 pt-1.5 sm:pt-2 border-t border-[#EAEAEA]/60 mt-1 sm:mt-2">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#767676] block">
                  {t('onboarding.demographics.lifeExpectancyTitle')}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    type="button"
                    id="btn-onboarding-life-calc"
                    onClick={() => onInputChange({ customLifeExpectancy: null })}
                    className={`py-1.5 sm:py-2 rounded-md border text-[11px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      inputs.customLifeExpectancy === null
                        ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                        : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-50"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{t('onboarding.demographics.cbsModel')}</span>
                  </button>
                  <button
                    type="button"
                    id="btn-onboarding-life-custom"
                    onClick={() => onInputChange({ customLifeExpectancy: 85 })}
                    className={`py-1.5 sm:py-2 rounded-md border text-[11px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      inputs.customLifeExpectancy !== null
                        ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                        : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-50"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t('onboarding.demographics.customModel')}</span>
                  </button>
                </div>

                {inputs.customLifeExpectancy !== null && (
                  <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2 bg-amber-50/50 p-1.5 sm:p-2.5 rounded-lg border border-amber-200/50">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-[#666] font-medium">{t('onboarding.demographics.customDesc')}</span>
                      <span className="font-mono font-extrabold text-[#D56B45]">
                        {t('onboarding.demographics.ageYears', { age: inputs.customLifeExpectancy.toString() })}
                      </span>
                    </div>
                    <div className="pt-2">
                      <AgeScrollPicker
                        min={Math.max(45, inputs.currentAge + 1)}
                        max={115}
                        value={inputs.customLifeExpectancy ?? 85}
                        onChange={(val) => onInputChange({ customLifeExpectancy: val })}
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-[#767676] italic">
                      {t('onboarding.demographics.customOverrideInfo')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : step === 4 ? (
            <motion.div
              key="lifestyle"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-2 sm:space-y-6 px-1"
            >
              <div className="space-y-0.5 sm:space-y-2 text-center sm:text-left">
                <span className="inline-block text-[11px] sm:text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-3 py-1 sm:py-1.5 rounded-md font-extrabold uppercase tracking-wider mb-1 sm:mb-2">
                  {t('onboarding.lifestyle.badge')}
                </span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-[#2D2D2D] leading-tight">
                  {t('onboarding.lifestyle.title')}
                </h2>
                <p className="text-[11px] sm:text-sm text-[#767676] leading-tight">
                  {t('onboarding.lifestyle.desc')}
                </p>
              </div>

              {/* 1. Slaap */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#D56B45] flex items-center space-x-1.5">
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D56B45]" />
                  <span>{t('onboarding.lifestyle.sleep.title')}</span>
                </label>
                <div className={`grid grid-cols-2 gap-1.5 sm:gap-3 text-xs sm:text-sm p-1 rounded-xl transition-all duration-300 ${showValidation && localSleep === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {[
                    { key: "kort", label: t('onboarding.lifestyle.sleep.short'), detail: "-1.5" },
                    { key: "matig", label: t('onboarding.lifestyle.sleep.moderate'), detail: "-0.5" },
                    { key: "goed", label: t('onboarding.lifestyle.sleep.good'), detail: "+1.0" },
                    { key: "optimaal", label: t('onboarding.lifestyle.sleep.optimal'), detail: "+2.0" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      id={`btn-onboarding-sleep-${item.key}`}
                      onClick={() => { 
                        setLocalSleep(item.key as SleepLevel); 
                        updateBioAnswer("sleep", item.key as SleepLevel);
                        if (activitySectionRef.current) {
                          activitySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                        localSleep === item.key
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#2D2D2D] hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-extrabold text-[11px] sm:text-[14px] leading-tight">{item.label}</span>
                      <span className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1">{item.detail} {t('onboarding.lifestyle.yearsOffset', { val: '' }).trim()}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localSleep === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">{t('common.required')}</p>
                )}
              </div>

              {/* 2. Beweging */}
              <div className="space-y-1.5 sm:space-y-2" ref={activitySectionRef}>
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#D56B45] flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D56B45]" />
                  <span>{t('onboarding.lifestyle.activity.title')}</span>
                </label>
                <div className={`grid grid-cols-2 gap-1.5 sm:gap-3 text-xs sm:text-sm p-1 rounded-xl transition-all duration-300 ${showValidation && localActivity === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {[
                    { key: "zittend", label: t('onboarding.lifestyle.activity.sedentary'), detail: "-1.5" },
                    { key: "licht", label: t('onboarding.lifestyle.activity.light'), detail: t('onboarding.lifestyle.neutral') },
                    { key: "actief", label: t('onboarding.lifestyle.activity.active'), detail: "+1.2" },
                    { key: "optimaal", label: t('onboarding.lifestyle.activity.optimal'), detail: "+2.5" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      id={`btn-onboarding-activity-${item.key}`}
                      onClick={() => { 
                        setLocalActivity(item.key as ActivityLevel); 
                        updateBioAnswer("activity", item.key as ActivityLevel);
                        if (stressSectionRef.current) {
                          stressSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                        localActivity === item.key
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#2D2D2D] hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-extrabold text-[11px] sm:text-[14px] leading-tight">{item.label}</span>
                      <span className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1">{item.key !== "licht" ? item.detail + " " + t('onboarding.lifestyle.yearsOffset', { val: '' }).trim() : item.detail}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localActivity === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">{t('common.required')}</p>
                )}
              </div>

              {/* 3. Stress */}
              <div className="space-y-1.5 sm:space-y-2" ref={stressSectionRef}>
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#D56B45] flex items-center space-x-1.5">
                  <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D56B45]" />
                  <span>{t('onboarding.lifestyle.stress.title')}</span>
                </label>
                <div className={`grid grid-cols-2 gap-1.5 sm:gap-3 text-xs sm:text-sm p-1 rounded-xl transition-all duration-300 ${showValidation && localStress === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {[
                    { key: "hoog", label: t('onboarding.lifestyle.stress.high'), detail: "-1.8" },
                    { key: "gemiddeld", label: t('onboarding.lifestyle.stress.moderate'), detail: t('onboarding.lifestyle.neutral') },
                    { key: "balans", label: t('onboarding.lifestyle.stress.balanced'), detail: "+0.8" },
                    { key: "laag", label: t('onboarding.lifestyle.stress.low'), detail: "+1.5" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      id={`btn-onboarding-stress-${item.key}`}
                      onClick={() => { setLocalStress(item.key as StressLevel); updateBioAnswer("stress", item.key as StressLevel); }}
                      className={`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                        localStress === item.key
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#2D2D2D] hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-extrabold text-[11px] sm:text-[14px] leading-tight">{item.label}</span>
                      <span className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1">{item.key !== "gemiddeld" ? item.detail + " " + t('onboarding.lifestyle.yearsOffset', { val: '' }).trim() : item.detail}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localStress === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">{t('common.required')}</p>
                )}
              </div>
            </motion.div>
          ) : step === 5 ? (
            <motion.div
              key="genetics"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-4 sm:space-y-6 px-1"
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-block text-[11px] sm:text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-3 py-1 sm:py-1.5 rounded-md font-extrabold uppercase tracking-wider mb-1 sm:mb-2">
                    {t('onboarding.genetics.badge')}
                  </span>
                </div>
                <h2 className="text-[21px] sm:text-2xl font-black tracking-tight text-[#2D2D2D]">
                  {t('onboarding.genetics.title1')} <br className="block sm:hidden" />{t('onboarding.genetics.title2')}
                </h2>
                <p className="text-sm text-[#767676]">
                  {t('onboarding.genetics.desc')}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowHeredityInfo(true)}
                    className="px-4 py-2 bg-[#D56B45] text-white text-xs font-bold rounded-md hover:bg-[#B84E29] transition-colors uppercase tracking-widest cursor-pointer shadow-sm inline-flex items-center mx-auto sm:mx-0"
                  >
                    <Info className="w-3.5 h-3.5 mr-1.5" />
                    {t('onboarding.genetics.readFirst')}
                  </button>
                </div>
              </div>

              {/* Father */}
              <div className={`p-4 sm:p-5 bg-gray-50 border rounded-2xl space-y-3.5 shadow-3xs transition-all duration-300 ${
                showValidation && !geneticsInteracted ? "border-red-400 bg-red-50/50 ring-2 ring-red-400 animate-pulse" : "border-[#EAEAEA]"
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5">
                  <span className="font-black text-sm text-[#2D2D2D] uppercase tracking-wider">{t('onboarding.genetics.father')}</span>
                  <div className="grid grid-cols-2 sm:flex sm:space-x-1 gap-2">
                    <button
                      type="button"
                      id="onboarding-father-alive"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: null }); }}
                      className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer whitespace-nowrap text-center ${
                        inputs.fatherPassedAge === null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      {t('onboarding.genetics.alive')}
                    </button>
                    <button
                      type="button"
                      id="onboarding-father-passed"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: 75 }); }}
                      className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center ${
                        inputs.fatherPassedAge !== null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      {t('onboarding.genetics.passed')}
                    </button>
                  </div>
                </div>

                {inputs.fatherPassedAge !== null && (
                  <div className="space-y-2.5 pt-1.5 border-t border-[#EAEAEA]/60">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#767676]">{t('onboarding.genetics.passedAge', { parent: t('onboarding.genetics.father').toLowerCase() })}</span>
                      <span className="font-mono font-black text-sm text-[#D56B45] bg-[#FAF3F0] px-2 py-0.5 rounded border border-[#D56B45]/15">{t('onboarding.career.ageYears', { val: inputs.fatherPassedAge.toString() })}</span>
                    </div>
                    <div className="pt-2">
                      <AgeScrollPicker
                        min={40}
                        max={100}
                        value={inputs.fatherPassedAge}
                        onChange={(val) => {
                          setGeneticsInteracted(true);
                          onInputChange({ fatherPassedAge: val });
                        }}
                        onSelect={() => {
                          if (motherSectionRef.current) {
                            motherSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mother */}
              <div 
                ref={motherSectionRef}
                className={`p-4 sm:p-5 bg-gray-50 border rounded-2xl space-y-3.5 shadow-3xs transition-all duration-300 ${
                showValidation && !geneticsInteracted ? "border-red-400 bg-red-50/50 ring-2 ring-red-400 animate-pulse" : "border-[#EAEAEA]"
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5">
                  <span className="font-black text-sm text-[#2D2D2D] uppercase tracking-wider">{t('onboarding.genetics.mother')}</span>
                  <div className="grid grid-cols-2 sm:flex sm:space-x-1 gap-2">
                    <button
                      type="button"
                      id="onboarding-mother-alive"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ motherPassedAge: null }); }}
                      className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer whitespace-nowrap text-center ${
                        inputs.motherPassedAge === null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      {t('onboarding.genetics.alive')}
                    </button>
                    <button
                      type="button"
                      id="onboarding-mother-passed"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ motherPassedAge: 82 }); }}
                      className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center ${
                        inputs.motherPassedAge !== null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      {t('onboarding.genetics.passed')}
                    </button>
                  </div>
                </div>

                {inputs.motherPassedAge !== null && (
                  <div className="space-y-2.5 pt-1.5 border-t border-[#EAEAEA]/60">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#767676]">{t('onboarding.genetics.passedAge', { parent: t('onboarding.genetics.mother').toLowerCase() })}</span>
                      <span className="font-mono font-black text-sm text-[#D56B45] bg-[#FAF3F0] px-2 py-0.5 rounded border border-[#D56B45]/15">{t('onboarding.career.ageYears', { val: inputs.motherPassedAge.toString() })}</span>
                    </div>
                    <div className="pt-2">
                      <AgeScrollPicker
                        min={40}
                        max={100}
                        value={inputs.motherPassedAge}
                        onChange={(val) => {
                          setGeneticsInteracted(true);
                          onInputChange({ motherPassedAge: val });
                        }}
                      />
                    </div>
                  </div>
                )}
                {showValidation && !geneticsInteracted && (
                  <p className="text-red-500 text-xs font-bold px-1 mt-2">Vul a.u.b. iets in voor minstens één ouder</p>
                )}
              </div>
            </motion.div>
          ) : step === 6 ? (
            <motion.div
              key="career_fire"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-4 sm:space-y-6 px-1"
            >
              <div className="space-y-2 text-center sm:text-left">
                <span className="inline-block text-[11px] sm:text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-3 py-1 sm:py-1.5 rounded-md font-extrabold uppercase tracking-wider mb-1 sm:mb-2">
                  {t('onboarding.career.badge')}
                </span>
                <h2 className="text-[21px] sm:text-2xl font-black tracking-tight text-[#2D2D2D]">
                  {t('onboarding.career.title')}
                </h2>
                <p className="text-sm text-[#767676]">
                  {t('onboarding.career.desc')}
                </p>
              </div>

              {/* Start of working life */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#767676] uppercase tracking-wider">{t('onboarding.career.startWork')}</span>
                  <span className="font-mono text-sm font-black text-[#D56B45] bg-[#FAF3F0] px-2.5 py-0.5 rounded border border-[#D56B45]/15">{t('onboarding.career.ageYears', { val: inputs.startWorkAge.toString() })}</span>
                </div>
                <div className="pt-2">
                  <AgeScrollPicker
                    min={15}
                    max={40}
                    value={inputs.startWorkAge}
                    onChange={(val) => {
                      setLocalStartWorkAge(val.toString());
                      onInputChange({ startWorkAge: val });
                    }}
                    onSelect={() => {
                      if (fireAgeSectionRef.current) {
                        fireAgeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  />
                </div>
                {showValidation && localStartWorkAge === "" && (
                  <p className="text-red-500 text-xs font-bold px-1 mt-1">{t('common.required')}</p>
                )}
              </div>

              {/* Pensioen Target Age */}
              <div className="space-y-2.5" ref={fireAgeSectionRef}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#767676] uppercase tracking-wider">{t('onboarding.career.fireAge')}</span>
                  <span className="font-mono text-sm font-black text-[#D56B45] bg-[#FAF3F0] px-2.5 py-0.5 rounded border border-[#D56B45]/15">{t('onboarding.career.ageYears', { val: inputs.fireAge.toString() })}</span>
                </div>
                <div className="pt-2">
                  <AgeScrollPicker
                    min={Math.max(inputs.startWorkAge + 2, inputs.currentAge)}
                    max={90}
                    value={inputs.fireAge}
                    onChange={(val) => {
                      setLocalFireAge(val.toString());
                      onInputChange({ fireAge: val });
                    }}
                  />
                </div>
                {showValidation && localFireAge === "" && (
                  <p className="text-red-500 text-xs font-bold px-1 mt-1">Vul dit a.u.b. in</p>
                )}
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-[#EAEAEA] text-xs space-y-2 shadow-3xs">
                <div className="flex justify-between font-extrabold text-sm text-[#2D2D2D]">
                  <span className="text-[#767676]">{t('common.work')}:</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-500/15">{t('onboarding.career.yearsDiff', { val: (inputs.fireAge - inputs.startWorkAge).toString() })}</span>
                </div>
                <p className="text-xs text-[#767676] leading-relaxed">
                  {t('onboarding.career.workDesc')}
                </p>
              </div>
            </motion.div>
          ) : step === 7 ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4 sm:space-y-6 max-w-md w-full px-1 relative"
            >
              <Confetti />
              
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F0FAF3] border border-[#EAEAEA] flex items-center justify-center shadow-sm relative z-10">
                <Smile className="w-8 h-8 text-[#45D57C]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-[21px] sm:text-2xl font-black tracking-tight text-[#2D2D2D]">
                  {t('onboarding.ready.title')}
                </h2>
                <p className="text-sm text-[#767676]">
                  {t('onboarding.ready.desc')}
                </p>
              </div>

              <div className="bg-[#FAF3F0] p-4 sm:p-5 rounded-2xl border border-[#D56B45]/20 text-left grid grid-cols-2 gap-y-3.5 gap-x-4 shadow-3xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">{t('common.profile')}</span>
                  <span className="text-sm font-black text-[#2D2D2D]">{inputs.gender === "man" ? t('common.man') : t('common.woman')}, {inputs.currentAge} jr</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">{t('onboarding.demographics.birthYear')}</span>
                  <span className="text-sm font-black text-[#2D2D2D] font-mono">{inputs.birthYear}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">{t('common.work')}</span>
                  <span className="text-sm font-black text-[#2D2D2D] font-mono">{inputs.fireAge - inputs.startWorkAge} jr</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">{t('common.retirementGoal')}</span>
                  <span className="text-sm font-black text-[#2D2D2D] font-mono">{inputs.fireAge} jr</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-6 sm:pt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep(8);
                  }}
                  className="w-full py-3.5 sm:py-4 bg-[#D56B45] hover:bg-[#C25B36] text-white font-black text-sm tracking-wide rounded-xl flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors duration-200"
                >
                  <span>{t('onboarding.ready.generating')}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          ) : step === 8 ? (
            <motion.div
              key="scroll-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[300] bg-[#111111]"
            >
              <ScrollRevealText onComplete={onComplete} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {step >= 2 && step < 7 && !showYearPicker && (
        <footer className={`w-full max-w-xl mx-auto flex justify-between items-center pt-3 sm:pt-4 ${step > 2 ? 'border-t border-[#F3F2F0]' : ''} relative z-10`}>
          <div>
            {step > 2 && (
              <button
                 type="button"
                 id="btn-onboarding-back"
                 onClick={handleBack}
                 className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-extrabold text-[#767676] hover:text-[#2D2D2D] flex items-center space-x-1 transition-colors duration-150 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('common.prevStep')}</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {step >= 2 && step < stepsMeta.length - 1 && (
              <motion.button
                type="button"
                id="btn-onboarding-next"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="px-5 sm:px-6 py-2.5 sm:py-3 font-extrabold text-xs sm:text-sm rounded-xl flex items-center space-x-1 shadow-sm transition-colors duration-150 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white cursor-pointer"
              >
                <span>{t('common.nextStep')}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </footer>
      )}

      {/* Modals placed outside of restricted stacking contexts */}
      <AnimatePresence>
        {showYearPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-gradient-to-br from-[#E25C26] to-[#B84E29] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
              <motion.img 
                src="/img/olifant-bril.png" 
                alt="Olifant" 
                className="w-32 sm:w-40 h-auto mb-6 drop-shadow-2xl"
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
              />
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-8">{t('onboarding.demographics.chooseBirthYear')}</h3>
              
              <div className="relative w-full h-64 mx-auto flex justify-center">
                {/* Selection Indicator overlay */}
                <div className="absolute top-1/2 left-0 w-full h-[64px] -translate-y-1/2 border-y-2 border-white/20 bg-white/5 pointer-events-none rounded-xl"></div>
                
                {/* Scrollable Container */}
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleYearScroll}
                  className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide relative z-10"
                  style={{ 
                    scrollbarWidth: "none",
                    paddingTop: "96px", 
                    paddingBottom: "96px",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)"
                  }}
                >
                  {yearsList.map((year) => {
                    const isFocused = year === focusedYear;
                    const dist = Math.abs(year - focusedYear);
                    const scale = isFocused ? 1 : Math.max(0.7, 1 - dist * 0.1);
                    const opacity = isFocused ? 1 : Math.max(0.2, 0.7 - dist * 0.2);
                    
                    return (
                      <div
                        key={year}
                        className="h-[64px] snap-center flex items-center justify-center cursor-pointer select-none"
                        onClick={() => {
                          if (year === focusedYear) {
                            confirmYearSelection(year);
                          } else {
                            const idx = yearsList.indexOf(year);
                            if (scrollContainerRef.current) {
                              scrollContainerRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
                            }
                            // Optionally auto-confirm after scrolling
                            setTimeout(() => confirmYearSelection(year), 300);
                          }
                        }}
                      >
                        <span 
                          className={`font-mono transition-all duration-200 ${isFocused ? 'text-4xl sm:text-5xl font-black text-white drop-shadow-lg' : 'text-3xl font-bold text-white'}`}
                          style={{ 
                            transform: `scale(${scale})`, 
                            opacity: opacity 
                          }}
                        >
                          {year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHeredityInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center sm:p-6"
          >
            <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:max-w-lg shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 pt-6 sm:pt-6 sm:p-6 flex justify-between items-center border-b border-gray-100">
                <h3 className="font-extrabold text-lg sm:text-xl text-[#2D2D2D] flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#D56B45]" />
                  {t('onboarding.genetics.modalTitle')}
                </h3>
                <button onClick={() => setShowHeredityInfo(false)} className="p-1 bg-[#D56B45] text-white hover:bg-[#B84E29] rounded-md transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto text-sm sm:text-base text-[#4a4a4a] space-y-4">
                <p>
                  {t('onboarding.genetics.modalDesc1')}
                </p>
                <p>
                  {t('onboarding.genetics.modalDesc2')}
                </p>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button onClick={() => setShowHeredityInfo(false)} className="px-5 py-2.5 bg-[#2D2D2D] hover:bg-black text-white font-bold rounded-xl transition-colors cursor-pointer text-sm">
                  {t('common.understood')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
