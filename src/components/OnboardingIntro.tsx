import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserInputs, Gender, ActivityLevel, SleepLevel, StressLevel } from "../types";
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
  Cpu,
  Edit3
} from "lucide-react";

interface OnboardingIntroProps {
  inputs: UserInputs;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onComplete: () => void;
}

export default function OnboardingIntro({ inputs, onInputChange, onComplete }: OnboardingIntroProps) {
  const [step, setStep] = useState<number>(0);
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
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // List of step metadata including the new Intro Splash screen at index 0
  const stepsMeta = [
    { title: "Intro", icon: Sparkles },
    { title: "Welkom", icon: Sparkles },
    { title: "Profiel", icon: User },
    { title: "Leefstijl", icon: Heart },
    { title: "Genetica", icon: Dna },
    { title: "Carrière & FIRE", icon: Briefcase },
    { title: "Klaar", icon: CheckCircle2 }
  ];

  const titleLetters = Array.from("LifeRunway");
  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      }
    }
  };
  const letterVars = {
    hidden: { opacity: 0, y: 35, rotate: -4 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { type: "spring", damping: 11, stiffness: 180 } 
    }
  };

  let canProceed = true;
  if (step === 2) {
    canProceed = localGender !== null && ageInteracted;
  } else if (step === 3) {
    canProceed = localSleep !== null && localActivity !== null && localStress !== null;
  } else if (step === 4) {
    canProceed = geneticsInteracted;
  } else if (step === 5) {
    canProceed = localStartWorkAge !== "" && localFireAge !== "";
  }

  useEffect(() => {
    if (canProceed) setShowValidation(false);
  }, [canProceed]);

  const handleNext = () => {
    if (step < 6 && !canProceed) {
      setShowValidation(true);
      return;
    }
    if (step < 6 && canProceed) {
      setShowValidation(false);
      if (step === 0 || step === 1) {
        setStep((s) => s + 1);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setStep((s) => s + 1);
          setIsTransitioning(false);
        }, 1200);
      }
    } else if (step >= 6) {
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
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#FAF3F0] blur-3xl opacity-60 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#FAFCEE] blur-3xl opacity-60 pointer-events-none z-0" />

      {/* Top Header & Step Progress Bar */}
      <header className="w-full max-w-xl mx-auto flex flex-col items-center pt-1.5 sm:pt-6 z-10">
        <div className="flex items-center space-x-1.5 mb-1.5 sm:mb-3">
          <span className="text-xl">🔥</span>
          <h1 className="font-sans font-extrabold text-xs sm:text-base uppercase tracking-wider text-[#2D2D2D]">
            Levensloop & FIRE
          </h1>
        </div>

        {step > 0 && (
          <div className="w-full bg-[#EAE8E4] h-1 rounded-full relative overflow-hidden flex mb-1.5 sm:mb-2">
            <motion.div 
              className="h-full bg-[#D56B45]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / (stepsMeta.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        )}

        {step > 0 && (
          <div className="flex justify-between w-full px-1 text-[9px] sm:text-[10px] text-[#767676] font-medium uppercase tracking-wider">
            <span>Stap {step} van {stepsMeta.length - 1}</span>
            <span className="text-[#D56B45] font-semibold">{stepsMeta[step].title}</span>
          </div>
        )}
      </header>

      {/* Main Interactive Slides container */}
      <main className={`flex-grow flex items-center justify-center py-2 sm:py-8 z-10 w-full max-w-xl mx-auto pr-1 ${step <= 1 ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
            >
              <motion.img 
                src="/img/Olifant.png" 
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
                <h2 className="text-xl sm:text-3xl font-black text-[#D56B45] uppercase tracking-wider mb-2 drop-shadow-sm">Goed bezig!</h2>
                <p className="text-sm sm:text-lg font-bold text-[#767676]">Door naar stap {step}</p>
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
              
              {/* Logo/Badge at Top */}
              <div className="w-full flex justify-center pt-4 sm:pt-8 z-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full"
                >
                  <Target className="w-3.5 h-3.5 text-white" />
                  <span className="font-sans font-bold text-[10px] sm:text-[11px] tracking-widest uppercase text-white">
                    DE GOUDEN RUNWAY
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
                  className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 flex items-end justify-center bg-white/10 border border-white/25 rounded-xl pt-4 px-4 pb-0 sm:pt-5 sm:px-5 sm:pb-0 backdrop-blur-xs shadow-lg relative overflow-hidden group mb-1"
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
                  className="flex justify-center items-center space-x-[2px]"
                >
                  {titleLetters.map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letterVars}
                      className="text-[32px] min-[375px]:text-[38px] min-[415px]:text-[42px] sm:text-7xl font-sans font-black tracking-tight select-none inline-block text-white"
                      style={{
                        textShadow: "0 4px 12px rgba(0,0,0,0.15)"
                      }}
                    >
                      {char}
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
                    "Confronteer je schaarste. Visualiseer je vitaliteit en levensfases."
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
                  <span>Ga verder</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </motion.button>
                
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.5 }}
                  className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/80 font-mono"
                >
                  Bereken je overgebleven tijd &bull; CBS Cohort Model 2026
                </motion.span>
              </div>
            </motion.div>
          ) : step === 1 ? (
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
                className="mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-[#FAF3F0]/80 border border-[#E9E4E2] flex items-end justify-center shadow-sm relative overflow-hidden group pt-4 px-4 pb-0 sm:pt-5 sm:px-5 sm:pb-0 mb-0.5"
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
                  Welkom bij uw Levensloop
                </h2>
                <p className="text-xs sm:text-sm text-[#767676] leading-relaxed">
                  Hoeveel soevereine tijd heeft u echt te besteden? Ontdek uw statistische levensverwachting gebaseerd op het officiële CBS cohortmodel en zet dit af tegen uw FIRE ambities.
                </p>
              </div>

              <div className="p-2.5 sm:p-3.5 bg-gray-50 rounded-lg border border-[#EAEAEA] text-[11px] sm:text-xs text-left flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#D56B45] shrink-0 mt-0.5" />
                <p className="text-[#767676] leading-snug">
                  Dit model berekent uw prognose dynamisch overlevingsstatistieken, leefstijlfactoren en genetische hereditaire aanpassingen.
                </p>
              </div>

              <motion.button
                id="btn-intro-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full py-2.5 sm:py-3.5 font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center space-x-2 shadow-md transition-colors duration-200 bg-[#201F1D] hover:bg-[#1A1A1A] text-white cursor-pointer"
              >
                <span>Start de Levensmeting</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </motion.button>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-3 sm:space-y-5 px-1"
            >
              <div className="space-y-0.5 sm:space-y-1.5 text-center sm:text-left">
                <span className="text-[10px] bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Stap 1: Demografie
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#2D2D2D]">
                  Wat is uw biologische basisprofiel?
                </h2>
                <p className="text-[11px] sm:text-xs text-[#767676]">
                  Biologischer geslacht en geboortejaar bepalen de startprognose van het CBS cohortmodel.
                </p>
              </div>

              {/* Gender selection */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#767676]">
                  Biologisch Geslacht
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
                      <span>{g === "man" ? "Man" : "Vrouw"}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localGender === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">Vul dit a.u.b. in</p>
                )}
              </div>

              {/* Birth Year selection */}
              <div className="space-y-1 sm:space-y-3">
                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                  <span className="font-semibold text-[#767676] uppercase tracking-wider">Geboortejaar</span>
                  <span className="font-mono text-sm font-extrabold text-[#D56B45]">{inputs.birthYear}</span>
                </div>
                <div className={`flex items-center space-x-2 p-1.5 rounded-xl transition-all duration-300 ${showValidation && !ageInteracted ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  <input
                    type="range"
                    id="slider-onboarding-birthyear"
                    min="1940"
                    max="2024"
                    value={inputs.birthYear}
                    onChange={(e) => {
                      setAgeInteracted(true);
                      const bYear = parseInt(e.target.value);
                      const calculatedAge = 2026 - bYear;
                      setLocalBirthYear(bYear.toString());
                      setLocalAge(calculatedAge.toString());
                      onInputChange({ 
                        birthYear: bYear,
                        currentAge: Math.max(2, Math.min(100, calculatedAge))
                      });
                    }}
                    className="hidden sm:block w-full h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                  />
                  <input
                    type="number"
                    min="1940"
                    max="2024"
                    value={localBirthYear}
                    onChange={(e) => {
                      setAgeInteracted(true);
                      setLocalBirthYear(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        const bYear = Math.min(2024, Math.max(1940, val));
                        const calculatedAge = 2026 - bYear;
                        setLocalAge(calculatedAge.toString());
                        onInputChange({
                          birthYear: bYear,
                          currentAge: Math.max(2, Math.min(100, calculatedAge))
                        });
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) {
                        setLocalBirthYear(inputs.birthYear.toString());
                      } else {
                        const bYear = Math.min(2024, Math.max(1940, val));
                        setLocalBirthYear(bYear.toString());
                      }
                    }}
                    className="w-full sm:w-28 text-center border-2 border-[#D56B45]/40 focus:border-[#D56B45] focus:outline-none rounded-lg text-lg sm:text-2xl py-2 sm:py-2.5 font-mono font-bold text-[#2D2D2D] bg-white shadow-sm transition-colors"
                  />
                </div>
                {showValidation && !ageInteracted && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">Verplaats de schuifbalk a.u.b. om uw leeftijd in te stellen</p>
                )}
              </div>

              {/* Current Age display and tweak */}
              <div className="space-y-1 sm:space-y-3 pt-0.5 sm:pt-2 pb-1">
                <div className="flex justify-between items-center text-[10px] sm:text-xs bg-[#FAF3F0] p-2.5 rounded-lg border border-[#D56B45]/15">
                  <span className="font-semibold text-[#D56B45] uppercase tracking-wider">Huidige Leeftijd (in 2026)</span>
                  <span className="font-mono text-sm sm:text-base font-black text-[#D56B45]">{inputs.currentAge} jaar</span>
                </div>
              </div>

              {/* Own Expected Age Option */}
              <div className="space-y-1.5 sm:space-y-3 pt-1.5 sm:pt-2 border-t border-[#EAEAEA]/60 mt-1 sm:mt-2">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#767676] block">
                  Levensverwachting Instellen
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
                    <span>CBS model + Leefstijl</span>
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
                    <span>Zelf inschatten</span>
                  </button>
                </div>

                {inputs.customLifeExpectancy !== null && (
                  <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2 bg-amber-50/50 p-1.5 sm:p-2.5 rounded-lg border border-amber-200/50">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-[#666] font-medium">Hoe oud denkt u te worden?</span>
                      <span className="font-mono font-extrabold text-[#D56B45]">
                        {inputs.customLifeExpectancy} jaar
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        id="slider-onboarding-custom-expectancy"
                        min={Math.max(45, inputs.currentAge + 1)}
                        max="115"
                        value={inputs.customLifeExpectancy ?? 85}
                        onChange={(e) => onInputChange({ customLifeExpectancy: parseInt(e.target.value) })}
                        className="hidden sm:block w-full h-1 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                      />
                      <input
                        type="number"
                        min={Math.max(45, inputs.currentAge + 1)}
                        max="115"
                        value={inputs.customLifeExpectancy ?? 85}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 85;
                          const customLifeExpectancy = Math.min(115, Math.max(Math.max(45, inputs.currentAge + 1), val));
                          onInputChange({ customLifeExpectancy });
                        }}
                        className="w-full sm:w-20 text-center border border-[#EAEAEA] rounded-md text-xs sm:text-sm py-1 font-mono text-[#2D2D2D] bg-white shadow-3xs"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-[#767676] italic">
                      Deze waarde overschrijft het biologische/CBS cohort prognosemodel in de grafieken.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : step === 3 ? (
            <motion.div
              key="lifestyle"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-2 sm:space-y-6 px-1"
            >
              <div className="space-y-0.5 sm:space-y-2 text-center sm:text-left">
                <span className="hidden sm:inline-block text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">
                  Stap 2: Bio-Score Leefstijl
                </span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-[#2D2D2D] leading-tight">
                  Wat zijn uw dagelijkse gewoonten?
                </h2>
                <p className="text-[11px] sm:text-sm text-[#767676] leading-tight">
                  Leefstijlfactoren beïnvloeden de levensverwachting met jaren winst of verlies.
                </p>
              </div>

              {/* 1. Slaap */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#767676] flex items-center space-x-1.5">
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D56B45]" />
                  <span>Slaappatroon</span>
                </label>
                <div className={`grid grid-cols-2 gap-1.5 sm:gap-3 text-xs sm:text-sm p-1 rounded-xl transition-all duration-300 ${showValidation && localSleep === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {[
                    { key: "kort", label: "Kort (<6u)", detail: "-1.5 jr" },
                    { key: "matig", label: "Matig (onrustig)", detail: "-0.5 jr" },
                    { key: "goed", label: "Goed (7-8u)", detail: "+1.0 jr" },
                    { key: "optimaal", label: "Perfect (diep)", detail: "+2.0 jr" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      id={`btn-onboarding-sleep-${item.key}`}
                      onClick={() => { setLocalSleep(item.key as SleepLevel); updateBioAnswer("sleep", item.key as SleepLevel); }}
                      className={`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                        localSleep === item.key
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#2D2D2D] hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-extrabold text-[11px] sm:text-[14px] leading-tight">{item.label}</span>
                      <span className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1">{item.detail}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localSleep === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">Vul dit a.u.b. in</p>
                )}
              </div>

              {/* 2. Beweging */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#767676] flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D56B45]" />
                  <span>Fysieke Activiteit</span>
                </label>
                <div className={`grid grid-cols-2 gap-1.5 sm:gap-3 text-xs sm:text-sm p-1 rounded-xl transition-all duration-300 ${showValidation && localActivity === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {[
                    { key: "zittend", label: "Zittend (kantoor)", detail: "-1.5 jr" },
                    { key: "licht", label: "Lichte beweging", detail: "Neutraal" },
                    { key: "actief", label: "Actief (sportief)", detail: "+1.2 jr" },
                    { key: "optimaal", label: "Atleet / Optimaal", detail: "+2.5 jr" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      id={`btn-onboarding-activity-${item.key}`}
                      onClick={() => { setLocalActivity(item.key as ActivityLevel); updateBioAnswer("activity", item.key as ActivityLevel); }}
                      className={`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                        localActivity === item.key
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#2D2D2D] hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-extrabold text-[11px] sm:text-[14px] leading-tight">{item.label}</span>
                      <span className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1">{item.detail}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localActivity === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">Vul dit a.u.b. in</p>
                )}
              </div>

              {/* 3. Stress */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#767676] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D56B45]" />
                  <span>Stress / Werkdruk</span>
                </label>
                <div className={`grid grid-cols-2 gap-1.5 sm:gap-3 text-xs sm:text-sm p-1 rounded-xl transition-all duration-300 ${showValidation && localStress === null ? 'bg-red-50/80 ring-2 ring-red-400 animate-pulse' : ''}`}>
                  {[
                    { key: "hoog", label: "Veel stress", detail: "-1.8 jr" },
                    { key: "gemiddeld", label: "Gemiddeld", detail: "Neutraal" },
                    { key: "balans", label: "In balans", detail: "+0.8 jr" },
                    { key: "laag", label: "Grootmoedig / Zen", detail: "+1.5 jr" }
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
                      <span className="text-[9px] sm:text-xs font-semibold opacity-90 mt-0.5 sm:mt-1">{item.detail}</span>
                    </button>
                  ))}
                </div>
                {showValidation && localStress === null && (
                  <p className="text-red-500 text-xs font-bold mt-1 px-1">Vul dit a.u.b. in</p>
                )}
              </div>
            </motion.div>
          ) : step === 4 ? (
            <motion.div
              key="genetics"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-4 sm:space-y-6 px-1"
            >
              <div className="space-y-2 text-center sm:text-left">
                <span className="inline-block text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">
                  Stap 3: Erfelijkheid
                </span>
                <h2 className="text-[21px] sm:text-2xl font-black tracking-tight text-[#2D2D2D]">
                  Hoe oud zijn uw biologische ouders geworden?
                </h2>
                <p className="text-sm text-[#767676]">
                  Hereditaire factoren hebben een invloed op uw gezondheidstijdlijn (-1.5 tot +1.5 jaar per ouder).
                </p>
              </div>

              {/* Father */}
              <div className={`p-4 sm:p-5 bg-gray-50 border rounded-2xl space-y-3.5 shadow-3xs transition-all duration-300 ${
                showValidation && !geneticsInteracted ? "border-red-400 bg-red-50/50 ring-2 ring-red-400 animate-pulse" : "border-[#EAEAEA]"
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5">
                  <span className="font-black text-sm text-[#2D2D2D] uppercase tracking-wider">Vader</span>
                  <div className="grid grid-cols-2 sm:flex sm:space-x-1 gap-2">
                    <button
                      type="button"
                      id="onboarding-father-alive"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: null }); }}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap text-center ${
                        inputs.fatherPassedAge === null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      In leven / Neutraal
                    </button>
                    <button
                      type="button"
                      id="onboarding-father-passed"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: 75 }); }}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        inputs.fatherPassedAge !== null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      Overleden
                    </button>
                  </div>
                </div>

                {inputs.fatherPassedAge !== null && (
                  <div className="space-y-2.5 pt-1.5 border-t border-[#EAEAEA]/60">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#767676]">Geleefde leeftijd van vader:</span>
                      <span className="font-mono font-black text-sm text-[#D56B45] bg-[#FAF3F0] px-2 py-0.5 rounded border border-[#D56B45]/15">{inputs.fatherPassedAge} jaar</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-[#EAEAEA] shadow-3xs">
                      <input
                        type="range"
                        id="slider-onboarding-fatherpassed"
                        min="40"
                        max="100"
                        value={inputs.fatherPassedAge}
                        onChange={(e) => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: parseInt(e.target.value) }); }}
                        className="flex-grow h-2 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                      />
                      <input
                        type="number"
                        min="40"
                        max="100"
                        value={inputs.fatherPassedAge}
                        onChange={(e) => {
                          setGeneticsInteracted(true);
                          const val = parseInt(e.target.value) || 75;
                          const fatherPassedAge = Math.min(100, Math.max(40, val));
                          onInputChange({ fatherPassedAge });
                        }}
                        className="w-20 text-center border border-[#EAEAEA] rounded-lg text-sm py-1.5 font-mono font-bold text-[#2D2D2D] bg-white shrink-0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mother */}
              <div className={`p-4 sm:p-5 bg-gray-50 border rounded-2xl space-y-3.5 shadow-3xs transition-all duration-300 ${
                showValidation && !geneticsInteracted ? "border-red-400 bg-red-50/50 ring-2 ring-red-400 animate-pulse" : "border-[#EAEAEA]"
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5">
                  <span className="font-black text-sm text-[#2D2D2D] uppercase tracking-wider">Moeder</span>
                  <div className="grid grid-cols-2 sm:flex sm:space-x-1 gap-2">
                    <button
                      type="button"
                      id="onboarding-mother-alive"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ motherPassedAge: null }); }}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap text-center ${
                        inputs.motherPassedAge === null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      In leven / Neutraal
                    </button>
                    <button
                      type="button"
                      id="onboarding-mother-passed"
                      onClick={() => { setGeneticsInteracted(true); onInputChange({ motherPassedAge: 82 }); }}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        inputs.motherPassedAge !== null
                          ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45] shadow-3xs"
                          : "border-[#EAEAEA] bg-white text-[#767676]"
                      }`}
                    >
                      Overleden
                    </button>
                  </div>
                </div>

                {inputs.motherPassedAge !== null && (
                  <div className="space-y-2.5 pt-1.5 border-t border-[#EAEAEA]/60">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#767676]">Geleefde leeftijd van moeder:</span>
                      <span className="font-mono font-black text-sm text-[#D56B45] bg-[#FAF3F0] px-2 py-0.5 rounded border border-[#D56B45]/15">{inputs.motherPassedAge} jaar</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-[#EAEAEA] shadow-3xs">
                      <input
                        type="range"
                        id="slider-onboarding-motherpassed"
                        min="40"
                        max="100"
                        value={inputs.motherPassedAge}
                        onChange={(e) => { setGeneticsInteracted(true); onInputChange({ motherPassedAge: parseInt(e.target.value) }); }}
                        className="flex-grow h-2 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                      />
                      <input
                        type="number"
                        min="40"
                        max="100"
                        value={inputs.motherPassedAge}
                        onChange={(e) => {
                          setGeneticsInteracted(true);
                          const val = parseInt(e.target.value) || 78;
                          const motherPassedAge = Math.min(100, Math.max(40, val));
                          onInputChange({ motherPassedAge });
                        }}
                        className="w-20 text-center border border-[#EAEAEA] rounded-lg text-sm py-1.5 font-mono font-bold text-[#2D2D2D] bg-white shrink-0"
                      />
                    </div>
                  </div>
                )}
                {showValidation && !geneticsInteracted && (
                  <p className="text-red-500 text-xs font-bold px-1 mt-2">Vul a.u.b. iets in voor minstens één ouder</p>
                )}
              </div>
            </motion.div>
          ) : step === 5 ? (
            <motion.div
              key="career_fire"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-4 sm:space-y-6 px-1"
            >
              <div className="space-y-2 text-center sm:text-left">
                <span className="inline-block text-xs bg-[#FAF3F0] border border-[#E9E4E2] text-[#D56B45] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">
                  Stap 4: Carrière & FIRE
                </span>
                <h2 className="text-[21px] sm:text-2xl font-black tracking-tight text-[#2D2D2D]">
                  Wanneer begon u met werken en wat is uw FIRE doel?
                </h2>
                <p className="text-sm text-[#767676]">
                  De splitsing tussen verplichte werktijd en absolute tijdssoevereiniteit.
                </p>
              </div>

              {/* Start of working life */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#767676] uppercase tracking-wider">Startleeftijd Carrière</span>
                  <span className="font-mono text-sm font-black text-[#D56B45] bg-[#FAF3F0] px-2.5 py-0.5 rounded border border-[#D56B45]/15">{inputs.startWorkAge} jaar</span>
                </div>
                <div className={`flex items-center space-x-3 bg-white p-2.5 rounded-xl border shadow-3xs transition-all duration-300 ${
                  showValidation && localStartWorkAge === "" ? "border-red-400 bg-red-50 ring-2 ring-red-400 animate-pulse" : "border-[#EAEAEA]"
                }`}>
                  <input
                    type="range"
                    id="slider-onboarding-startwork"
                    min="15"
                    max="40"
                    value={inputs.startWorkAge}
                    onChange={(e) => { setLocalStartWorkAge(e.target.value); onInputChange({ startWorkAge: parseInt(e.target.value) }); }}
                    className="flex-grow h-2 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                  />
                  <input
                    type="number"
                    min="15"
                    max="40"
                    value={localStartWorkAge}
                    onChange={(e) => {
                      setLocalStartWorkAge(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        onInputChange({ startWorkAge: Math.min(40, Math.max(15, val)) });
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) {
                        setLocalStartWorkAge(inputs.startWorkAge.toString());
                      } else {
                        setLocalStartWorkAge(Math.min(40, Math.max(15, val)).toString());
                      }
                    }}
                    className="w-20 sm:w-28 text-center border-2 border-[#D56B45]/40 focus:border-[#D56B45] focus:outline-none rounded-lg text-lg sm:text-2xl py-1.5 sm:py-2.5 font-mono font-bold text-[#2D2D2D] bg-white shadow-sm transition-colors shrink-0"
                  />
                </div>
                {showValidation && localStartWorkAge === "" && (
                  <p className="text-red-500 text-xs font-bold px-1 mt-1">Vul dit a.u.b. in</p>
                )}
              </div>

              {/* FIRE Target Age */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#767676] uppercase tracking-wider">Doelleeftijd FIRE / Pensioen</span>
                  <span className="font-mono text-sm font-black text-[#D56B45] bg-[#FAF3F0] px-2.5 py-0.5 rounded border border-[#D56B45]/15">{inputs.fireAge} jaar</span>
                </div>
                <div className={`flex items-center space-x-3 bg-white p-2.5 rounded-xl border shadow-3xs transition-all duration-300 ${
                  showValidation && localFireAge === "" ? "border-red-400 bg-red-50 ring-2 ring-red-400 animate-pulse" : "border-[#EAEAEA]"
                }`}>
                  <input
                    type="range"
                    id="slider-onboarding-fireage"
                    min={Math.max(inputs.startWorkAge + 2, inputs.currentAge)}
                    max="90"
                    value={inputs.fireAge}
                    onChange={(e) => { setLocalFireAge(e.target.value); onInputChange({ fireAge: parseInt(e.target.value) }); }}
                    className="flex-grow h-2 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                  />
                  <input
                    type="number"
                    min={Math.max(inputs.startWorkAge + 2, inputs.currentAge)}
                    max="90"
                    value={localFireAge}
                    onChange={(e) => {
                      setLocalFireAge(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        const minVal = Math.max(inputs.startWorkAge + 2, inputs.currentAge);
                        onInputChange({ fireAge: Math.min(90, Math.max(minVal, val)) });
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) {
                        setLocalFireAge(inputs.fireAge.toString());
                      } else {
                        const minVal = Math.max(inputs.startWorkAge + 2, inputs.currentAge);
                        setLocalFireAge(Math.min(90, Math.max(minVal, val)).toString());
                      }
                    }}
                    className="w-20 sm:w-28 text-center border-2 border-[#D56B45]/40 focus:border-[#D56B45] focus:outline-none rounded-lg text-lg sm:text-2xl py-1.5 sm:py-2.5 font-mono font-bold text-[#2D2D2D] bg-white shadow-sm transition-colors shrink-0"
                  />
                </div>
                {showValidation && localFireAge === "" && (
                  <p className="text-red-500 text-xs font-bold px-1 mt-1">Vul dit a.u.b. in</p>
                )}
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-[#EAEAEA] text-xs space-y-2 shadow-3xs">
                <div className="flex justify-between font-extrabold text-sm text-[#2D2D2D]">
                  <span className="text-[#767676]">Actieve Accumulatie:</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-500/15">{inputs.fireAge - inputs.startWorkAge} jaar</span>
                </div>
                <p className="text-xs text-[#767676] leading-relaxed">
                  Dit is het aantal jaren verplichte kapitaalaccumulatie dat u heeft ingepland voor uw financiële onafhankelijkheid.
                </p>
              </div>
            </motion.div>
          ) : step === 6 ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4 sm:space-y-6 max-w-md w-full px-1"
            >
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F0FAF3] border border-[#EAEAEA] flex items-center justify-center shadow-sm">
                <Smile className="w-8 h-8 text-[#45D57C]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-[21px] sm:text-2xl font-black tracking-tight text-[#2D2D2D]">
                  Klaar om te ontdekken!
                </h2>
                <p className="text-sm text-[#767676]">
                  Alle factoren zijn gecompileerd. We sturen uw demografische gegevens live door naar het CBS model om uw exacte overlevingscurve te bepalen.
                </p>
              </div>

              <div className="bg-[#FAF3F0] p-4 sm:p-5 rounded-2xl border border-[#D56B45]/20 text-left grid grid-cols-2 gap-y-3.5 gap-x-4 shadow-3xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">Profiel</span>
                  <span className="text-sm font-black text-[#2D2D2D]">{inputs.gender === "man" ? "Man" : "Vrouw"}, {inputs.currentAge} jr</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">Geboortejaar</span>
                  <span className="text-sm font-black text-[#2D2D2D] font-mono">{inputs.birthYear}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">Accumulatie</span>
                  <span className="text-sm font-black text-[#2D2D2D] font-mono">{inputs.fireAge - inputs.startWorkAge} jaar</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#767676] block mb-0.5">FIRE Doel</span>
                  <span className="text-sm font-black text-[#2D2D2D] font-mono">{inputs.fireAge} jaar</span>
                </div>
              </div>

              <motion.button
                id="btn-onboarding-complete"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="w-full py-3.5 sm:py-4 bg-[#D56B45] hover:bg-[#C25B36] text-white font-black text-sm tracking-wide rounded-xl flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-colors duration-200"
              >
                <span>Open Interactief Dashboard</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="w-full max-w-xl mx-auto flex justify-between items-center pt-3 sm:pt-4 border-t border-[#F3F2F0] z-10">
        <div>
          {step > 0 && (
            <button
               type="button"
               id="btn-onboarding-back"
               onClick={handleBack}
               className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-extrabold text-[#767676] hover:text-[#2D2D2D] flex items-center space-x-1 transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Vorige</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {step > 0 && step < stepsMeta.length - 1 && (
            <motion.button
              type="button"
              id="btn-onboarding-next"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-5 sm:px-6 py-2.5 sm:py-3 font-extrabold text-xs sm:text-sm rounded-xl flex items-center space-x-1 shadow-sm transition-colors duration-150 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white cursor-pointer"
            >
              <span>Volgende</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </footer>
    </div>
  );
}
