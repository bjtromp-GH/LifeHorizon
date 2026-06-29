import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { Compass, Settings, X, RefreshCw, Minimize2, Target, Lightbulb, Info, Grid } from "lucide-react";
import { UserInputs, LifePhases } from "../types";
import OnboardingPanel from "./OnboardingPanel";
import BioScoreSection from "./BioScoreSection";
import AestheticFidelityCards from "./AestheticFidelityCards";
import LifePhasesBar from "./LifePhasesBar";
import DecadeGrid from "./DecadeGrid";
import StatsCard from "./StatsCard";
import RemainingTimeCard from "./RemainingTimeCard";
import { useLanguage } from "../context/LanguageContext";

interface MobileContainerProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  cbsBaseLife: number;
  phases: LifePhases;
  apiSource: string;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onRestartOnboarding: (step?: number) => void;
  onResetApp?: () => void;
}

export default function MobileContainer({
  inputs,
  projectedLifeExpectancy,
  cbsBaseLife,
  phases,
  apiSource,
  onInputChange,
  onRestartOnboarding,
  onResetApp,
}: MobileContainerProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isSwipedFullscreen, setIsSwipedFullscreen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [showElephantFact, setShowElephantFact] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 9000); // hint visible slightly longer
    return () => clearTimeout(timer);
  }, []);

  // Update theme-color in page meta headers dynamically to ensure perfect mobile styling matching app's branding
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', '#D56B45');
  }, []);

  const totalRemaining = Math.max(0, projectedLifeExpectancy - inputs.currentAge);
  const totalRoundedRemaining = Math.round(totalRemaining * 10) / 10;

  // Ensure scroll is reset to top when switching slides
  useEffect(() => {
    const mainEl = document.getElementById('mobile-main-scroll');
    if (mainEl) {
      // Instant scroll to top feels much better during page transitions than smooth scrolling
      mainEl.scrollTop = 0;
    }
    // Force fullscreen on the hero image slide
    if (activeSlide === 6) {
      setIsSwipedFullscreen(true);
    }
  }, [activeSlide]);

  const goToSlide = (newIndex: number) => {
    if (newIndex < 0 || newIndex > 7) return;
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
        if (activeSlide < 7) {
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
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-48 left-4 right-4 z-40 bg-[#2D2D2D]/95 text-white p-3.5 rounded-lg border border-white/10 shadow-lg flex items-center justify-between backdrop-blur-xs"
          >
            <div className="flex items-center space-x-2.5">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs font-medium leading-tight text-white">
                {t('dashboard.swipeHint')}
              </span>
            </div>
            <button
              onClick={() => setShowSwipeHint(false)}
              className="text-white/70 hover:text-white p-1 px-2.5 bg-white/10 hover:bg-white/20 rounded-md text-[10px] font-black cursor-pointer transition-all uppercase shrink-0 ml-2"
            >
              {t('dashboard.ok')}
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
            title={t('dashboard.restoreMenuTitle')}
          >
            <Minimize2 className="w-4 h-4 mr-0.5 text-[#D56B45]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide">{t('dashboard.showMenu')}</span>
          </button>
        </div>
      )}

      {/* 1. Mobile Custom Header Bar */}
      {!isSwipedFullscreen && (
        <>
          <header className="px-4 py-3 bg-white border-b border-[#EAEAEA] flex items-center justify-between shrink-0">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => window.location.reload()}
            >
              <div className="p-1.5 bg-[#D56B45] rounded-full group-hover:scale-110 transition-transform shadow-sm">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-sans font-bold text-sm tracking-tight text-[#2D2D2D] group-hover:text-[#D56B45] transition-colors whitespace-nowrap">
                Life Horizon
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                id="btn-mobile-config"
                onClick={() => onRestartOnboarding(1)}
                className="p-1.5 px-3 bg-[#D56B45]/10 hover:bg-[#D56B45]/15 border border-[#D56B45]/20 text-xs font-extrabold text-[#D56B45] rounded-md transition-all cursor-pointer flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>{t('dashboard.config')}</span>
              </button>
              {onResetApp && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Weet je zeker dat je alle opgeslagen gegevens wilt wissen?")) {
                      onResetApp();
                    }
                  }}
                  className="p-1.5 px-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-md transition-all cursor-pointer"
                  title="Reset App"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </header>

          {/* Quick Info bar triggering configuration */}
          <div className="bg-white border-b border-[#EAEAEA]/80 px-4 py-2 flex items-center justify-between text-xs text-[#5c5c5c] shrink-0">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-[#2D2D2D]">{t('common.profile')}:</span>
              <span>{inputs.gender === "man" ? t('common.man') : t('common.woman')} &bull; {t('dashboard.born')} {inputs.birthYear} &bull; {t('common.work')}: {inputs.startWorkAge} - {inputs.fireAge}</span>
            </div>
            <button
              onClick={() => onRestartOnboarding(1)}
              className="text-[#D56B45] font-bold hover:underline cursor-pointer"
            >
              {t('dashboard.change')}
            </button>
          </div>

          {/* 1.5 Custom Dashboard Segmented Navigation Tabs */}
          <div className="px-4 py-2 bg-white border-b border-[#EAEAEA] flex justify-between gap-1 overflow-x-auto shrink-0 scrollbar-none select-none">
            {[
              { id: 0, name: t('dashboard.tabs.runway') },
              { id: 1, name: t('dashboard.tabs.matrix') },
              { id: 2, name: t('dashboard.tabs.vitality') },
              { id: 3, name: t('dashboard.tabs.overview') },
            ].map((s) => {
              const isActive = activeSlide === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(s.id)}
                  className={`flex-1 min-w-0 py-2 px-0.5 min-[380px]:px-1 rounded-md text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
                    isActive
                      ? s.id === 3
                        ? "bg-amber-100 border-[#D56B45] text-amber-900 font-black"
                        : "bg-[#D56B45]/10 border-[#D56B45]/30 text-[#D56B45] font-black"
                      : "bg-zinc-50 border-zinc-100 text-[#767676] hover:bg-zinc-100 font-medium"
                  }`}
                >
                  <span className="text-[9.5px] min-[380px]:text-[10px] sm:text-[11px] uppercase tracking-wide sm:tracking-wider leading-none whitespace-nowrap">{s.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 2. Main Scrollable Dashboard Content */}
      <main
        id="mobile-main-scroll"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          // If already in fullscreen, nothing to do
          if (isSwipedFullscreen) return;

          // Check if user clicked on any interactive elements like buttons, inputs, links, sliders etc.
          const target = e.target as HTMLElement;
          const interactiveSelector = "button, input, select, textarea, a, svg, path, [role='button']";
          if (target.closest(interactiveSelector)) {
            return; // let standard interactive events perform naturally
          }

          // Otherwise, activate immersive fullscreen mode!
          setIsSwipedFullscreen(true);
        }}
        className={`flex-1 relative overflow-y-auto px-4 pb-4 transition-colors duration-300 cursor-pointer ${
          isSwipedFullscreen ? "pt-14" : "pt-4"
        } ${
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
                  <div className="bg-white p-3.5 border border-[#EAEAEA] rounded-md shadow-3xs text-[#2D2D2D]">
                    <LifePhasesBar
                      inputs={inputs}
                      projectedLifeExpectancy={projectedLifeExpectancy}
                      phases={phases}
                      onInputChange={onInputChange}
                      onFullscreen={() => setIsSwipedFullscreen(true)}
                    />
                  </div>
                  
                  <StatsCard
                    inputs={inputs}
                    projectedLifeExpectancy={projectedLifeExpectancy}
                    apiSource={apiSource}
                  />
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
                    {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
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
                    <span>{t('dashboard.nav.next')}</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 2: Matrix & Verbruikt */}
            {activeSlide === 1 && (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  {/* Levensmatrix (DecadeGrid) - outer box borders removed for clean layout */}
                  <div id="mobile-matrix-wrapper" className="text-[#2D2D2D] py-1 bg-transparent border-0 shadow-none">
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
                      cbsBaseLife={cbsBaseLife}
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
                    ◀ {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
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
                    <span>{t('dashboard.nav.next')}</span>
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
                      cbsBaseLife={cbsBaseLife}
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
                    ◀ {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
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
                    <span>{t('dashboard.nav.next')}</span>
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
                    <button 
                      onClick={() => setShowElephantFact(true)}
                      className="block mx-auto cursor-pointer focus:outline-none focus:ring-0 active:scale-95 transition-transform"
                    >
                      <motion.img 
                        src="/img/olifant-bril.png" 
                        alt="Olifant" 
                        className="w-28 h-28 object-contain"
                        animate={{ filter: ['drop-shadow(0 0 4px rgba(255,255,255,0.2))', 'drop-shadow(0 0 25px rgba(255,255,255,1))', 'drop-shadow(0 0 4px rgba(255,255,255,0.2))'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </button>
                    <h3 className="text-[17px] sm:text-lg font-black font-sans uppercase tracking-tight text-white">
                      {t('mobileContainer.conclusion.title')}
                    </h3>
                    <p 
                      className="text-[11px] text-white/80 max-w-xs mx-auto leading-normal"
                      dangerouslySetInnerHTML={{ __html: t('mobileContainer.conclusion.subtitle') }}
                    />
                  </div>

                  {/* Highlights */}
                  <div className="max-w-sm mx-auto w-full space-y-2.5">
                    <div className="flex flex-col items-center justify-center py-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs">
                      <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-100 mb-1 text-center">
                        {t('mobileContainer.conclusion.estLifeSpan')}
                      </span>
                      <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                        {projectedLifeExpectancy.toFixed(1)} {t('decadeGrid.yr')}
                      </span>
                    </div>

                    <RemainingTimeCard totalRemaining={totalRemaining} />
                  </div>

                  {/* Phase blocks */}
                  <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto w-full pt-2">
                    <div className="bg-white/10 border border-white/20 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center text-center backdrop-blur-xs shadow-sm">
                      <span className="text-[10px] sm:text-xs font-sans font-extrabold uppercase tracking-widest text-amber-100">{t('mobileContainer.conclusion.youth')}</span>
                      <span className="text-lg sm:text-2xl font-black font-mono text-white mt-1 whitespace-nowrap">20 {t('decadeGrid.yr')}</span>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center text-center backdrop-blur-xs shadow-sm">
                      <span className="text-[10px] sm:text-xs font-sans font-extrabold uppercase tracking-widest text-amber-100">{t('mobileContainer.conclusion.work')}</span>
                      <span className="text-lg sm:text-2xl font-black font-mono text-white mt-1 whitespace-nowrap">{Math.max(0, inputs.fireAge - 20)} {t('decadeGrid.yr')}</span>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center text-center backdrop-blur-xs shadow-sm">
                      <span className="text-[10px] sm:text-xs font-sans font-extrabold uppercase tracking-widest text-amber-100">{t('mobileContainer.conclusion.freedom')}</span>
                      <span className="text-lg sm:text-2xl font-black font-mono text-white mt-1 whitespace-nowrap">{(projectedLifeExpectancy - inputs.fireAge).toFixed(1)} {t('decadeGrid.yr')}</span>
                    </div>
                  </div>

                  {/* Button to show Matrix again */}
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto w-full pt-1 pb-1">
                    <button
                      onClick={() => setShowMatrixModal(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-white/90 py-3.5 rounded-xl font-sans font-bold text-[#D56B45] transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      <Grid className="w-5 h-5" />
                      <span>{t('mobileContainer.conclusion.viewMatrix')}</span>
                    </button>
                    <span className="text-[11px] font-sans text-white/80 mt-2 text-center">
                      {t('mobileContainer.conclusion.viewMatrixDesc')}
                    </span>
                  </div>

                  {/* Quick summary statistics */}
                  <div className="bg-white/10 border border-white/15 rounded-xl p-4 space-y-4 max-w-sm mx-auto w-full backdrop-blur-xs text-[13px] font-mono">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2.5 gap-4">
                      <span className="text-amber-100 leading-tight">{t('mobileContainer.conclusion.currentAge')}</span>
                      <span className="font-extrabold text-white text-[15px] whitespace-nowrap shrink-0">{inputs.currentAge} {t('decadeGrid.yr')}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2.5 gap-4">
                      <span className="text-amber-100 leading-tight" dangerouslySetInnerHTML={{ __html: t('mobileContainer.conclusion.activeCareer').replace('{{age}}', inputs.fireAge.toString()) }} />
                      <span className="font-extrabold text-white text-[15px] whitespace-nowrap shrink-0">{t('mobileContainer.conclusion.yearsLeft').replace('{{years}}', Math.max(0, inputs.fireAge - inputs.currentAge).toString())}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 gap-4">
                      <span className="text-white font-sans font-extrabold uppercase tracking-wide text-xs leading-tight">{t('mobileContainer.conclusion.freeHorizon')}</span>
                      <span className="font-extrabold text-white text-[15px] text-right bg-white/20 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                        {(projectedLifeExpectancy - inputs.fireAge).toFixed(1)} {t('decadeGrid.yr')}
                      </span>
                    </div>
                  </div>

                  {/* Dutch insights summary */}
                  <div className="bg-[#5c2411]/20 p-4 rounded-xl border border-white/10 text-[13px] text-stone-50 max-w-sm mx-auto w-full leading-relaxed space-y-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t('mobileContainer.overviewTitle')
                          .replace('{{years}}', Math.round(projectedLifeExpectancy).toString())
                          .replace('{{weeks}}', Math.round(projectedLifeExpectancy * 52.17).toLocaleString(t('dashboard.lang')))
                      }}
                    />
                    <div className="flex items-start space-[#767676] space-x-2 pt-1 text-left">
                      <Lightbulb className="w-4 h-4 text-amber-200 mt-0.5 shrink-0" />
                      <p className="text-white">
                        {t('mobileContainer.overviewDesc')}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="flex justify-center max-w-sm mx-auto w-full pt-4 pb-2">
                  <button
                    onClick={() => goToSlide(4)}
                    className="w-full flex items-center justify-center bg-[#86A789] hover:bg-[#729275] text-white py-4 rounded-xl font-sans font-extrabold transition-all active:scale-95 shadow-sm uppercase tracking-wider cursor-pointer"
                  >
                    {t('mobileContainer.continueBtn')}
                  </button>
                </div>

                {/* Scroll Bottom Navigation controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-6 max-w-sm mx-auto w-full shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-white/30 text-white hover:bg-white/10 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
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
                    onClick={() => onRestartOnboarding(1)}
                    className="px-4 py-2 bg-white text-[#D56B45] hover:bg-zinc-50 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('mobileContainer.adjustBtn')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 5: Modellen (White Screen) */}
            {activeSlide === 4 && (
              <div className="space-y-6 flex flex-col justify-between h-full text-[#2D2D2D] pb-4">
                <div className="space-y-6">
                  <div className="mt-4">
                    <h3 className="text-xl font-black font-sans uppercase tracking-tight text-[#D56B45]">
                      {t('mobileContainer.modelsTitle')}
                    </h3>
                    <p className="text-sm mt-4 text-[#767676] leading-relaxed">
                      {t('mobileContainer.modelsDesc')}
                    </p>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#EAEAEA] bg-white shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[300px]">
                      <thead>
                        <tr className="bg-[#FAF9F8] border-b border-[#EAEAEA] text-xs uppercase tracking-wider text-[#767676]">
                          <th className="p-2 sm:p-3 font-bold">{t('mobileContainer.tablePhase')}</th>
                          <th className="p-2 sm:p-3 font-bold">{t('mobileContainer.tableAge')}</th>
                          <th className="p-2 sm:p-3 font-bold">{t('mobileContainer.tableYears')}</th>
                          <th className="p-2 sm:p-3 font-bold text-right whitespace-nowrap">{t('mobileContainer.tableTotal')}</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs sm:text-sm">
                        <tr className="border-b border-[#EAEAEA]">
                          <td className="p-2 sm:p-3 font-semibold text-[#2D2D2D]">{t('mobileContainer.youthPhase')}</td>
                          <td className="p-2 sm:p-3 text-[#767676]">0 {t('mobileContainer.working').toLowerCase().replace('werkend', 'tot')} 20</td>
                          <td className="p-2 sm:p-3 font-mono font-medium">20</td>
                          <td className="p-2 sm:p-3 font-mono font-medium text-right">25%</td>
                        </tr>
                        <tr className="border-b border-[#EAEAEA]">
                          <td className="p-2 sm:p-3 font-semibold text-[#2D2D2D]">{t('mobileContainer.workPhase')}</td>
                          <td className="p-2 sm:p-3 text-[#767676]">20 {t('mobileContainer.working').toLowerCase().replace('werkend', 'tot')} 69</td>
                          <td className="p-2 sm:p-3 font-mono font-medium">49</td>
                          <td className="p-2 sm:p-3 font-mono font-medium text-right">61,25%</td>
                        </tr>
                        <tr className="border-b border-[#EAEAEA]">
                          <td className="p-2 sm:p-3 font-semibold text-[#2D2D2D]">{t('mobileContainer.freePhase')}</td>
                          <td className="p-2 sm:p-3 text-[#767676]">69 {t('mobileContainer.working').toLowerCase().replace('werkend', 'tot')} 80</td>
                          <td className="p-2 sm:p-3 font-mono font-medium">11</td>
                          <td className="p-2 sm:p-3 font-mono font-medium text-right">13,75%</td>
                        </tr>
                        <tr className="bg-[#FAF9F8] font-bold">
                          <td className="p-2 sm:p-3 text-[#2D2D2D]">{t('mobileContainer.totalLabel')}</td>
                          <td className="p-2 sm:p-3 text-[#767676]">0 {t('mobileContainer.working').toLowerCase().replace('werkend', 'tot')} 80</td>
                          <td className="p-2 sm:p-3 font-mono text-[#2D2D2D]">80</td>
                          <td className="p-2 sm:p-3 font-mono text-[#2D2D2D] text-right">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-4 bg-gradient-to-br from-[#FFF5F0] to-[#FAF3F0] p-5 sm:p-6 rounded-2xl border-2 border-[#D56B45]/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-[-10px] right-[-10px] text-[#D56B45]/10 text-7xl rotate-12 pointer-events-none">✨</div>
                    <p 
                      className="text-base sm:text-lg font-black text-[#D56B45] leading-snug"
                      dangerouslySetInnerHTML={{ __html: t('mobileContainer.modelInspiration') }}
                    />
                    <ul className="text-base sm:text-lg text-[#D56B45]/90 space-y-2.5 list-disc list-outside font-semibold ml-5 relative z-10">
                      <li><strong className="text-[#D56B45]">25%</strong> {t('mobileContainer.modelYouth')}</li>
                      <li><strong className="text-[#D56B45]">50%</strong> {t('mobileContainer.modelWork')}</li>
                      <li><strong className="text-[#D56B45]">25%</strong> {t('mobileContainer.modelFree')}</li>
                    </ul>
                  </div>

                  {/* Visual Comparison */}
                  <div className="space-y-6 pt-4 pb-2">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-[#2D2D2D] mb-2">
                        <span className="uppercase tracking-wider">{t('mobileContainer.normalLife')}</span>
                        <span className="text-[#5c5c5c] font-mono">(61,25% {t('mobileContainer.working')})</span>
                      </div>
                      <div className="h-10 w-full rounded-xl flex overflow-hidden shadow-inner border border-[#EAEAEA]">
                        <div className="bg-[#EAE8E4] w-[25%] flex items-center justify-center text-[10px] font-bold text-[#5c5c5c]">25%</div>
                        <div className="bg-[#2D2D2D]/80 w-[61.25%] flex items-center justify-center text-[10px] font-bold text-white">61%</div>
                        <div className="bg-[#86A789] w-[13.75%] flex items-center justify-center text-[10px] font-bold text-white">13%</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-bold text-[#D56B45] mb-2">
                        <span className="uppercase tracking-wider">{t('mobileContainer.optimalModel')}</span>
                        <span className="font-mono">(50% {t('mobileContainer.working')})</span>
                      </div>
                      <div className="h-10 w-full rounded-xl flex overflow-hidden shadow-inner border border-[#D56B45]/20 ring-2 ring-[#D56B45]/20">
                        <div className="bg-[#FAF3F0] w-[25%] flex items-center justify-center text-[10px] font-bold text-[#D56B45]">25%</div>
                        <div className="bg-[#D56B45] w-[50%] flex items-center justify-center text-[10px] font-bold text-white">50%</div>
                        <div className="bg-[#86A789] w-[25%] flex items-center justify-center text-[10px] font-bold text-white">25%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <button
                    onClick={() => goToSlide(5)}
                    className="w-full flex items-center justify-center bg-[#D56B45] hover:bg-[#C0562F] text-white py-4 rounded-xl font-sans font-extrabold transition-all active:scale-95 shadow-sm uppercase tracking-wider"
                  >
                    {t('dashboard.nav.next')}
                  </button>
                </div>

                {/* Scroll Bottom Navigation controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA] mt-6 shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#767676] hover:bg-zinc-50 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-[#D56B45]" : "bg-[#D56B45]/30"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => onRestartOnboarding(1)}
                    className="px-4 py-2 bg-zinc-50 text-[#D56B45] hover:bg-zinc-100 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 border border-[#EAEAEA]"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('mobileContainer.adjustBtn')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 6: 25/50/25 Model Uitleg */}
            {activeSlide === 5 && (
              <div className="space-y-6 flex flex-col justify-between h-full text-[#2D2D2D] pb-4">
                <div className="space-y-6">
                  <div className="mt-4">
                    <h3 className="text-xl font-black font-sans uppercase tracking-tight text-[#86A789]">
                      {t('mobileContainer.optimalModel')} Uitgelegd
                    </h3>
                    <p className="text-sm mt-4 text-[#767676] leading-relaxed">
                      {t('mobileContainer.modelExplainedDesc').replace('{{age}}', projectedLifeExpectancy.toString())}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-[#2D2D2D]/[0.03] border border-[#2D2D2D]/10 p-5 rounded-2xl shadow-sm flex items-start justify-between gap-4 border-l-4 border-l-[#2D2D2D] relative overflow-hidden">
                      <div className="z-10 flex-1">
                        <h4 className="font-black text-[#2D2D2D] text-base uppercase tracking-wider">{t('mobileContainer.youthPhase')}</h4>
                        <p className="text-[15px] text-[#5c5c5c] mt-1 font-mono font-bold tracking-wide">0 <span className="lowercase font-sans text-sm font-medium opacity-70">tot</span> {Math.round(projectedLifeExpectancy * 0.25)} {t('onboardingPanel.years')}</p>
                        <p className="text-sm text-[#5c5c5c] mt-2.5 leading-relaxed">
                          {t('mobileContainer.youthDesc')}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#2D2D2D]/10 flex items-center justify-center shrink-0 z-10 mt-1">
                        <span className="font-black text-[#2D2D2D] text-xl">25%</span>
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-[#D56B45]/[0.04] border border-[#D56B45]/20 p-5 rounded-2xl shadow-sm flex items-start justify-between gap-4 border-l-4 border-l-[#D56B45] relative overflow-hidden">
                      <div className="z-10 flex-1">
                        <h4 className="font-black text-[#D56B45] text-base uppercase tracking-wider">{t('mobileContainer.workTitle')}</h4>
                        <p className="text-[15px] text-[#D56B45] mt-1 font-mono font-bold tracking-wide">{Math.round(projectedLifeExpectancy * 0.25)} <span className="lowercase font-sans text-sm font-medium opacity-70">tot</span> {Math.round(projectedLifeExpectancy * 0.75)} {t('onboardingPanel.years')}</p>
                        <p className="text-sm text-[#5c5c5c] mt-2.5 leading-relaxed">
                          {t('mobileContainer.workDesc')}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#D56B45]/20 flex items-center justify-center shrink-0 z-10 mt-1">
                        <span className="font-black text-[#D56B45] text-xl">50%</span>
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-[#86A789]/[0.06] border border-[#86A789]/30 p-5 rounded-2xl shadow-sm flex items-start justify-between gap-4 border-l-4 border-l-[#86A789] relative overflow-hidden">
                      <div className="z-10 flex-1">
                        <h4 className="font-black text-[#86A789] text-base uppercase tracking-wider">{t('mobileContainer.freeTitle')}</h4>
                        <p className="text-[15px] text-[#86A789] mt-1 font-mono font-bold tracking-wide">{Math.round(projectedLifeExpectancy * 0.75)} <span className="lowercase font-sans text-sm font-medium opacity-70">tot</span> {Number.isInteger(projectedLifeExpectancy) ? projectedLifeExpectancy : projectedLifeExpectancy.toFixed(1)} {t('onboardingPanel.years')}</p>
                        <p className="text-sm text-[#5c5c5c] mt-2.5 leading-relaxed">
                          {t('mobileContainer.freeDesc')}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#86A789]/30 flex items-center justify-center shrink-0 z-10 mt-1">
                        <span className="font-black text-[#86A789] text-xl">25%</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <button
                    onClick={() => goToSlide(6)}
                    className="w-full flex items-center justify-center bg-[#D56B45] hover:bg-[#C0562F] text-white py-4 rounded-xl font-sans font-extrabold transition-all active:scale-95 shadow-sm uppercase tracking-wider"
                  >
                    {t('dashboard.nav.next')}
                  </button>
                </div>

                {/* Scroll Bottom Navigation controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA] mt-6 shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#767676] hover:bg-zinc-50 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-[#86A789]" : "bg-[#86A789]/30"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => onRestartOnboarding(1)}
                    className="px-4 py-2 bg-zinc-50 text-[#D56B45] hover:bg-zinc-100 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 border border-[#EAEAEA]"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('mobileContainer.adjustBtn')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Screen 7: Hero Image */}
            {activeSlide === 6 && (
              <div 
                className="flex flex-col justify-end bg-black relative -mx-4 -mb-4"
                style={{ 
                  marginTop: isSwipedFullscreen ? '-56px' : '-16px', 
                  minHeight: isSwipedFullscreen ? '100dvh' : 'calc(100dvh - 140px)' 
                }}
              >
                <img 
                  src="/img/elephant-hero.jpg" 
                  alt="Hero Elephant" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                
                {/* Navigation Controls overlay */}
                <div className="relative z-10 w-full px-4 pb-8 pt-32 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white shadow-2xl max-w-sm mx-auto">
                    <button
                      onClick={() => goToSlide(activeSlide - 1)}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      ◀ {t('dashboard.nav.prev')}
                    </button>
                    
                    <div className="flex space-x-1.5">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => goToSlide(idx)}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            activeSlide === idx ? "w-4 bg-white" : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => goToSlide(activeSlide + 1)}
                      className="px-4 py-3 bg-[#D56B45] hover:bg-[#B84E29] text-white shadow-lg text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      {t('dashboard.nav.next')} ▶
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Screen 8: Financiële Runway Promo */}
            {activeSlide === 7 && (
              <div className="space-y-6 flex flex-col justify-between h-full text-[#2D2D2D] pb-4">
                <div className="space-y-6">
                  <div className="mt-4">
                    <div className="mb-8 p-5 bg-[#D56B45]/5 border-l-4 border-[#D56B45] rounded-r-xl">
                      <p className="text-sm font-serif italic text-[#2D2D2D] leading-relaxed">
                        {t('mobileContainer.financialRunwayQuote')}
                      </p>
                      <p className="text-xs font-bold text-[#D56B45] mt-2">
                        {t('mobileContainer.financialRunwayAuthor')}
                      </p>
                    </div>

                    <h3 className="text-xl font-black font-sans uppercase tracking-tight text-[#D56B45]">
                      {t('mobileContainer.financialRunwayTitle')}
                    </h3>
                    <p className="text-sm mt-4 text-[#2D2D2D] font-bold leading-relaxed">
                      {t('mobileContainer.financialRunwayQuestion')}
                    </p>
                    <p className="text-sm mt-3 text-[#767676] leading-relaxed">
                      {t('mobileContainer.financialRunwayDesc')}
                    </p>
                  </div>

                  <div className="bg-[#FAF9F8] border border-[#EAEAEA] p-6 rounded-xl shadow-sm text-center">
                    <p className="text-sm text-[#767676] mb-4">
                      {t('mobileContainer.financialRunwayPromo')}
                    </p>
                    <a
                      href="https://financiele-horizon-promo.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center bg-[#86A789] hover:bg-[#729275] text-white py-4 rounded-xl font-sans font-extrabold transition-all active:scale-95 shadow-sm uppercase tracking-wider"
                    >
                      {t('mobileContainer.visitWebsite')}
                    </a>
                  </div>
                </div>

                {/* Scroll Bottom Navigation controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA] mt-6 shrink-0">
                  <button
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="px-4 py-2 border border-[#EAEAEA] text-[#767676] hover:bg-zinc-50 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ {t('dashboard.nav.prev')}
                  </button>
                  
                  <div className="flex space-x-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? "w-4 bg-[#86A789]" : "bg-[#86A789]/30"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => onRestartOnboarding(1)}
                    className="px-4 py-2 bg-zinc-50 text-[#D56B45] hover:bg-zinc-100 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 border border-[#EAEAEA]"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('mobileContainer.adjustBtn')}</span>
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
                      {t('mobileContainer.configTitle')}
                    </h3>
                    <p className="text-[10px] text-[#767676]">
                      {t('mobileContainer.configSubtitle')}
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
                      {t('mobileContainer.basicProfile')}
                    </h4>
                  </div>
                  <OnboardingPanel inputs={inputs} onChange={onInputChange} />
                </div>

                {/* Part 2: Lifestyle / Vitality modifiers */}
                <div className="bg-white p-4 rounded-xl border border-[#EAEAEA] shadow-3xs space-y-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs">🌱</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D56B45]">
                      {t('mobileContainer.modifiersTitle')}
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
                  <span className="text-xs text-[#767676]">{t('mobileContainer.cbsPrognosis')}</span>
                  <div className="text-xl font-black text-[#D56B45]">
                    {projectedLifeExpectancy.toFixed(1)} <span className="text-xs font-normal text-[#2D2D2D]">{t('mobileContainer.yearsOld')}</span>
                  </div>
                  <p className="text-[10px] text-[#767676] max-w-xs mx-auto leading-normal">
                    {t('mobileContainer.compiledBasedOn')}
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
                  {t('mobileContainer.showMatrix')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Elephant Fact Modal */}
      <AnimatePresence>
        {showElephantFact && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowElephantFact(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ y: "100%", borderTopLeftRadius: "2rem", borderTopRightRadius: "2rem" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full bg-[#1C1C1E] p-6 pb-12 overflow-y-auto max-h-[85vh] shadow-2xl rounded-t-3xl border-t border-white/10 text-white"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-sans tracking-tight text-[#D56B45]">
                  {t('mobileContainer.mascotTitle')}
                </h3>
                <button 
                  onClick={() => setShowElephantFact(false)} 
                  className="absolute right-4 sm:right-6 top-4 sm:top-6 p-1 bg-[#D56B45] hover:bg-[#B84E29] text-white rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-5 text-sm text-white/80 leading-relaxed font-sans">
                <p>
                  {t('mobileContainer.mascotDesc')}
                </p>
                <div className="flex justify-center mt-6">
                  <img src="/img/olifant-bril.png" alt="Olifant" className="w-32 h-32 object-contain drop-shadow-lg" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Matrix Popup Modal */}
      <AnimatePresence>
        {showMatrixModal && (
          <div className="fixed inset-0 z-50 flex flex-col pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#FAFCEE]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full flex flex-col bg-[#FAFCEE]"
            >
              <div className="flex justify-between items-center px-5 py-4 bg-white border-b border-[#EAE8E4] shrink-0 shadow-sm z-20">
                <h3 className="text-lg font-black font-sans tracking-tight text-[#2D2D2D] uppercase">
                  {t('mobileContainer.matrixTitle')}
                </h3>
                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="p-1 -mr-2 -mt-2 bg-[#D56B45] text-white hover:bg-[#B84E29] rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative px-4 pt-4 pb-8 flex flex-col">
                <DecadeGrid inputs={inputs} projectedLifeExpectancy={projectedLifeExpectancy} />
                <div className="mt-8 flex justify-center pb-8">
                  <button onClick={() => setShowMatrixModal(false)} className="w-full max-w-xs py-3.5 bg-white border border-[#EAEAEA] text-[#767676] font-bold rounded-xl shadow-sm hover:bg-gray-50 uppercase tracking-wider text-sm transition-all cursor-pointer">
                    {t('common.close') || "Sluiten"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
