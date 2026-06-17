import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { Sparkles, Settings, X, RefreshCw, Minimize2 } from "lucide-react";
import { UserInputs, LifePhases } from "../types";
import OnboardingPanel from "./OnboardingPanel";
import BioScoreSection from "./BioScoreSection";
import AestheticFidelityCards from "./AestheticFidelityCards";
import LifePhasesBar from "./LifePhasesBar";
import DecadeGrid from "./DecadeGrid";
import StatsCard from "./StatsCard";

interface MobileContainerProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  phases: LifePhases;
  apiSource: string;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onRestartOnboarding: () => void;
}

export default function MobileContainer({
  inputs,
  projectedLifeExpectancy,
  phases,
  apiSource,
  onInputChange,
  onRestartOnboarding,
}: MobileContainerProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isSwipedFullscreen, setIsSwipedFullscreen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 6000); // hint visible slightly longer
    return () => clearTimeout(timer);
  }, []);

  const totalRemaining = Math.max(0, projectedLifeExpectancy - inputs.currentAge);
  const totalRoundedRemaining = Math.round(totalRemaining * 10) / 10;

  const goToSlide = (newIndex: number) => {
    if (newIndex < 0 || newIndex > 3) return;
    setSlideDirection(newIndex > activeSlide ? 1 : -1);
    setActiveSlide(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.x;
    const diffY = touch.clientY - touchStart.y;
    setTouchStart(null);

    // Filter out simple vertical scroll gestures, focus on clear horizontal swipes
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe Right -> previous slide
        if (activeSlide > 0) {
          goToSlide(activeSlide - 1);
          setIsSwipedFullscreen(true);
        }
      } else {
        // Swipe Left -> next slide
        if (activeSlide < 3) {
          goToSlide(activeSlide + 1);
          setIsSwipedFullscreen(true);
        }
      }
    }
  };

  return (
    <div
      id="mobile-viewport-root"
      className="flex flex-col h-[100dvh] bg-[#F9F8F6] text-[#2D2D2D] overflow-hidden select-none relative"
    >
      {/* Absolute hint of swiping gesture */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute bottom-20 left-4 right-4 z-40 bg-[#2D2D2D]/95 text-white p-3.5 rounded-lg border border-white/10 shadow-lg flex items-center justify-between backdrop-blur-xs"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-base animate-bounce">👆</span>
              <span className="text-xs font-medium leading-tight">
                Tip: Swipe naar links of rechts om tussen de 4 schermen te wisselen, of klik op de navigatieknoppen.
              </span>
            </div>
            <button
              onClick={() => setShowSwipeHint(false)}
              className="text-white/70 hover:text-white p-1 px-2.5 bg-white/10 hover:bg-white/20 rounded-md text-[10px] font-black cursor-pointer transition-all uppercase shrink-0 ml-2"
            >
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Restore Navigation button when in immersive swiped view */}
      {isSwipedFullscreen && (
        <div className="absolute top-3 right-3 z-50 flex items-center space-x-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsSwipedFullscreen(false)}
            className="py-1.5 px-3 bg-zinc-900/90 hover:bg-zinc-900 text-white border border-white/10 rounded-full shadow-lg flex items-center space-x-1 transition-all cursor-pointer active:scale-95"
            title="Herstel navigatie bar"
          >
            <Minimize2 className="w-3.5 h-3.5 mr-0.5 text-[#D56B45]" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">Toon Menu ☰</span>
          </button>
        </div>
      )}

      {/* 1. Mobile Custom Header Bar */}
      {!isSwipedFullscreen && (
        <>
          <header className="px-4 py-3 bg-white border-b border-[#EAEAEA] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D56B45]" />
              <span className="font-sans font-bold text-sm tracking-tight text-[#2D2D2D]">
                LifeRunway
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                id="btn-mobile-config"
                onClick={() => setShowConfig(true)}
                className="p-1 px-2.5 bg-[#D56B45]/10 hover:bg-[#D56B45]/15 border border-[#D56B45]/20 text-[11px] font-extrabold text-[#D56B45] rounded-md transition-all cursor-pointer flex items-center space-x-1 animate-pulse"
              >
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Configuratie</span>
              </button>
              <div className="font-mono text-[11px] text-[#D56B45] font-semibold bg-[#D56B45]/10 px-2.5 py-1 rounded-full">
                {totalRoundedRemaining} jr restant
              </div>
            </div>
          </header>

          {/* Quick Info bar triggering configuration */}
          <div className="bg-white border-b border-[#EAEAEA]/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-[#767676] shrink-0">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-[#2D2D2D]">Profiel:</span>
              <span>{inputs.gender === "man" ? "Man" : "Vrouw"} &bull; Geb. {inputs.birthYear} &bull; Work: {inputs.startWorkAge} - {inputs.fireAge} jr</span>
            </div>
            <button
              onClick={() => setShowConfig(true)}
              className="text-[#D56B45] font-bold hover:underline cursor-pointer"
            >
              Wijzig
            </button>
          </div>

          {/* 1.5 Custom Dashboard Segmented Navigation Tabs */}
          <div className="px-4 py-2 bg-white border-b border-[#EAEAEA] flex justify-between gap-1 overflow-x-auto shrink-0 scrollbar-none select-none">
            {[
              { id: 0, name: "1. Runway" },
              { id: 1, name: "2. Matrix" },
              { id: 2, name: "3. Vitaliteit" },
              { id: 3, name: "4. Overzicht" },
            ].map((s) => {
              const isActive = activeSlide === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(s.id)}
                  className={`flex-1 min-w-[70px] py-2 px-1 rounded-md text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
                    isActive
                      ? s.id === 3
                        ? "bg-amber-100 border-[#D56B45] text-amber-900 font-black"
                        : "bg-[#D56B45]/10 border-[#D56B45]/30 text-[#D56B45] font-black"
                      : "bg-zinc-50 border-zinc-100 text-[#767676] hover:bg-zinc-100 font-medium"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider leading-none">{s.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 2. Main Scrollable Dashboard Content */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 relative overflow-y-auto px-4 py-4 transition-colors duration-300 ${
          activeSlide === 3 ? "bg-[#D56B45] text-white" : "bg-[#F9F8F6] text-[#2D2D2D]"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: slideDirection * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideDirection * 60 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full min-h-full flex flex-col justify-between"
          >
            {/* Screen 1: Runway */}
            {activeSlide === 0 && (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <StatsCard
                    inputs={inputs}
                    projectedLifeExpectancy={projectedLifeExpectancy}
                    apiSource={apiSource}
                  />
                  
                  <div className="bg-white p-3.5 border border-[#EAEAEA] rounded-md shadow-3xs text-[#2D2D2D]">
                    <LifePhasesBar
                      inputs={inputs}
                      projectedLifeExpectancy={projectedLifeExpectancy}
                      phases={phases}
                      onInputChange={onInputChange}
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA]/80 mt-6 bg-white/50 p-2.5 rounded-lg text-[#2D2D2D] shrink-0">
                  <button
                    disabled={activeSlide === 0}
                    onClick={() => goToSlide(activeSlide - 1)}
                    className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                      activeSlide === 0
                        ? "opacity-30 border-zinc-200 text-zinc-400 cursor-not-allowed"
                        : "border-zinc-200 text-[#2D2D2D] hover:bg-zinc-50 cursor-pointer"
                    }`}
                  >
                    ◀ Vorige
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-[#D56B45]" : "bg-zinc-200"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goToSlide(activeSlide + 1)}
                    className="px-4 py-2 bg-[#D56B45] text-white text-xs font-extrabold rounded-lg hover:bg-[#C0562F] transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>Volgende</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 2: Matrix & Verbruikt */}
            {activeSlide === 1 && (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  {/* Levensmatrix (DecadeGrid) */}
                  <div id="mobile-matrix-wrapper" className="bg-white p-3.5 border border-[#EAEAEA] rounded-lg shadow-3xs text-[#2D2D2D]">
                    <div className="mb-1">
                      <DecadeGrid
                        inputs={inputs}
                        projectedLifeExpectancy={projectedLifeExpectancy}
                      />
                    </div>
                  </div>

                  {/* Verbruikt vs Resterend */}
                  <div id="mobile-verbruikt-wrapper">
                    <AestheticFidelityCards
                      inputs={inputs}
                      projectedLifeExpectancy={projectedLifeExpectancy}
                      apiSource={apiSource}
                      showOnly={["verbruikt"]}
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA]/80 mt-6 bg-white/50 p-2.5 rounded-lg text-[#2D2D2D] shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-zinc-200 text-[#2D2D2D] hover:bg-zinc-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    ◀ Vorige
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-[#D56B45]" : "bg-zinc-200"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goToSlide(activeSlide + 1)}
                    className="px-4 py-2 bg-[#D56B45] text-white text-xs font-extrabold rounded-lg hover:bg-[#C0562F] transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>Volgende</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 3: Vitaliteit, Carriere & Horizon */}
            {activeSlide === 2 && (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div id="mobile-analytics-wrapper" className="space-y-4">
                    <AestheticFidelityCards
                      inputs={inputs}
                      projectedLifeExpectancy={projectedLifeExpectancy}
                      apiSource={apiSource}
                      showOnly={["vitaliteit", "carriere", "horizon"]}
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA]/80 mt-6 bg-white/50 p-2.5 rounded-lg text-[#2D2D2D] shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-zinc-200 text-[#2D2D2D] hover:bg-zinc-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    ◀ Vorige
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-[#D56B45]" : "bg-zinc-200"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goToSlide(activeSlide + 1)}
                    className="px-4 py-2 bg-[#D56B45] text-white text-xs font-extrabold rounded-lg hover:bg-[#C0562F] transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>Conclusie</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 4: Conclusie (Orange Screen) */}
            {activeSlide === 3 && (
              <div className="space-y-5 flex flex-col justify-between h-full text-white">
                <div className="space-y-5">
                  <div className="text-center space-y-2 mt-2">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-white/20 rounded-full border border-white/35 backdrop-blur-xs shadow-3xs">
                      <span className="text-xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-black font-sans uppercase tracking-tight text-white">
                      Eindconclusie & Reflectie
                    </h3>
                    <p className="text-[11px] text-white/80 max-w-xs mx-auto leading-normal">
                      Jouw CBS Levensrunway samengevat op een soevereine rij.
                    </p>
                  </div>

                  {/* Highlights circle: Swap titles vertically */}
                  <div className="flex flex-col items-center justify-center py-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs shrink-0 max-w-sm mx-auto w-full">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-100 mb-1.5 text-center">
                      resterende tijdsperspectief
                    </span>
                    <span className="text-4xl font-extrabold font-mono tracking-tight text-white mb-0.5">
                      {totalRemaining.toFixed(1)} jaar
                    </span>
                    <span className="text-[9px] font-sans text-white/70 mt-1">
                      ca. {Math.round(totalRemaining * 52.17).toLocaleString("nl-NL")} betekenisvolle weken over
                    </span>
                  </div>

                  {/* Quick summary statistics */}
                  <div className="bg-white/10 border border-white/15 rounded-xl p-4 space-y-3.5 max-w-sm mx-auto w-full backdrop-blur-xs text-xs font-mono">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-amber-100">Huidige Leeftijd:</span>
                      <span className="font-extrabold text-white text-sm">{inputs.currentAge} jaar</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-amber-100">Prognose Levensduur:</span>
                      <span className="font-extrabold text-white text-sm">{Math.round(projectedLifeExpectancy)} jaar</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-amber-100">Actieve Carrière (tot {inputs.fireAge} jr):</span>
                      <span className="font-extrabold text-white text-sm">Nog {Math.max(0, inputs.fireAge - inputs.currentAge)} jaar</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-white font-sans font-extrabold uppercase tracking-wide text-[10px]">Vrije Horizon (Vrijheidsoogst):</span>
                      <span className="font-extrabold text-white text-sm text-right bg-white/20 px-2 py-0.5 rounded">
                        {(projectedLifeExpectancy - inputs.fireAge).toFixed(1)} jr
                      </span>
                    </div>
                  </div>

                  {/* Dutch insights summary */}
                  <div className="bg-[#5c2411]/20 p-4 rounded-xl border border-white/10 text-xs text-stone-100 max-w-sm mx-auto w-full leading-relaxed space-y-2">
                    <p>
                      Jouw verwachte leefduur van <span className="font-bold text-white">{Math.round(projectedLifeExpectancy)} jaar</span> telt ca. <span className="font-bold text-white">{Math.round(projectedLifeExpectancy * 52.17).toLocaleString("nl-NL")} weken</span>. Elk hokje in de matrix vertegenwoordigt een unieke week.
                    </p>
                    <p className="font-bold text-white">
                      💡 Tip: Met gezonde slaap, sport en gerichte stressreductie kun je actief jaren aan levenskwaliteit (Levenswinst) toevoegen!
                    </p>
                  </div>
                </div>

                {/* Scroll Bottom Navigation controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-6 max-w-sm mx-auto w-full shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-white/30 text-white hover:bg-white/10 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ Vorige
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setShowConfig(true)}
                    className="px-4 py-2 bg-white text-[#D56B45] hover:bg-zinc-50 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>⚙️ Pas aan</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Sliding Configuration Bottom Sheet Modal */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfig(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "15%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "25%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl bg-[#FDFDFD] rounded-t-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden border-t border-[#EAEAEA]"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-white border-b border-[#EAEAEA] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-[#D56B45]/10 rounded-lg text-[#D56B45]">
                    <Settings className="w-4 h-4 animate-spin-slow" />
                  </span>
                  <div>
                    <h3 className="font-sans font-bold text-sm text-[#2D2D2D]">
                      Onboarding Configuratie
                    </h3>
                    <p className="text-[10px] text-[#767676]">
                      Wijzig hier uw ingevoerde levensloopparameters
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="p-1 px-1.5 hover:bg-gray-100 rounded-md text-[#767676] hover:text-[#2D2D2D] cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable inputs Container */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                
                {/* Part 1: Basic Demographics Form */}
                <div className="bg-white p-4 rounded-xl border border-[#EAEAEA] shadow-3xs space-y-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs">👤</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D56B45]">
                      1. Basis Profiel
                    </h4>
                  </div>
                  <OnboardingPanel inputs={inputs} onChange={onInputChange} />
                </div>

                {/* Part 2: Lifestyle / Vitality modifiers */}
                <div className="bg-white p-4 rounded-xl border border-[#EAEAEA] shadow-3xs space-y-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs">🌱</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D56B45]">
                      2. Vitaliteit & Leefstijl Modifiers
                    </h4>
                  </div>
                  <BioScoreSection
                    answers={inputs.bioAnswers}
                    onChange={(u) =>
                      onInputChange({
                        bioAnswers: { ...inputs.bioAnswers, ...u },
                      })
                    }
                  />
                </div>

                {/* Custom genetic overview widget */}
                <div className="bg-[#FAF9F6] p-3.5 rounded-lg border border-[#EAEAEA] space-y-1 text-center font-mono">
                  <span className="text-xs text-[#767676]">Actuele CBS Cohort prognose:</span>
                  <div className="text-xl font-black text-[#D56B45]">
                    {projectedLifeExpectancy.toFixed(1)} <span className="text-xs font-normal text-[#2D2D2D]">jaar oud</span>
                  </div>
                  <p className="text-[10px] text-[#767676] max-w-xs mx-auto leading-normal">
                    Gecompileerd op basis van jouw actieve leefstijlscore en erfelijke parameters.
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="px-5 py-4 bg-white border-t border-[#EAEAEA] flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="w-full py-3.5 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer text-center"
                >
                  Toon Levensmatrix
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
