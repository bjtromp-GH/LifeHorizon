import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { UserInputs } from "../types";
import LifeProgressBar from "./LifeProgressBar";
import HealthyMatrixModal from "./HealthyMatrixModal";
import { useLanguage } from "../context/LanguageContext";

interface DecadeGridProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  compact?: boolean;
}

export default React.memo(function DecadeGrid({
  inputs,
  projectedLifeExpectancy,
  compact = false,
}: DecadeGridProps) {
  const { t } = useLanguage();
  const { currentAge, startWorkAge, fireAge } = inputs;
  const [isCurrentAgeModalOpen, setIsCurrentAgeModalOpen] = useState(false);
  const [isAnalyseModalOpen, setIsAnalyseModalOpen] = useState(false);
  const [isHealthyModalOpen, setIsHealthyModalOpen] = useState(false);
  const [activeSlice, setActiveSlice] = useState<"dev" | "work" | "free" | null>(null);
  const [use255025Model, setUse255025Model] = useState(false);
  
  // Total years in the runway (e.g. 82 years = 82 boxes)
  const totalYears = Math.max(1, Math.ceil(projectedLifeExpectancy));

  // Effective phases (25/50/25 is based on projected life expectancy)
  const effectiveStartWorkAge = use255025Model ? Math.round(totalYears * 0.25) : startWorkAge;
  const effectiveFireAge = use255025Model ? Math.round(totalYears * 0.75) : fireAge;

  // Determine which phase a given year falls into
  const getYearPhase = (year: number): "basis" | "accumulation" | "freedom" | "beyond" => {
    if (year < effectiveStartWorkAge) return "basis";
    if (year < effectiveFireAge) return "accumulation";
    if (year < totalYears) return "freedom";
    return "beyond";
  };

  // Organize years into decades (rows of 10 items)
  const decadesCount = useMemo(() => Math.ceil(totalYears / 10), [totalYears]);
  const decadesArray = useMemo(() => Array.from({ length: decadesCount }, (_, i) => i), [decadesCount]);

  return (
    <div id="decade-grid-container" className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#767676]">
            {t('decadeGrid.title')}
          </h4>
          <button 
            onClick={() => setUse255025Model(!use255025Model)}
            className={`text-[10px] px-3 py-1 rounded-md border transition-all font-bold flex items-center shadow-sm ${
              use255025Model 
                ? 'bg-[#D56B45] text-white border-[#D56B45]' 
                : 'bg-white text-[#2D2D2D] border-[#EAE8E4] hover:bg-gray-50'
            }`}
          >
            {use255025Model ? "✓ 25/50/25 Model" : "Toon 25/50/25 Model"}
          </button>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-[#767676] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#2D2D2D]" /> {t('decadeGrid.development')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#D56B45]" /> {t('decadeGrid.work')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#84A98C]" /> {t('decadeGrid.freedom')}
          </span>
        </div>
      </div>

      {/* Main Grid Card wrapper - borderless and transparent on mobile to support clean layout, with hidden scrollbar */}
      <div className="p-0 sm:p-5 bg-transparent sm:bg-white border-none sm:border sm:border-[#EAEAEA] sm:rounded-md shadow-none sm:shadow-3xs">
        <div className="flex flex-col space-y-2.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {decadesArray.map((decadeIndex) => {
            const startYearOfDecade = decadeIndex * 10;
            const yearsInThisDecade = Array.from({ length: 10 }, (_, i) => startYearOfDecade + i).filter(
              (y) => y < totalYears
            );

            return (
              <div key={decadeIndex} className="flex items-center space-x-3 min-w-[280px]">
                {/* Decade indicator label on the left */}
                <div className="w-10 text-right text-[11px] font-mono tracking-tight text-[#767676] select-none">
                  {startYearOfDecade} {t('decadeGrid.yr')}
                </div>

                {/* Grid row containing 10 column items representing years */}
                <div className="flex items-center gap-1.5 flex-1">
                  {yearsInThisDecade.map((year) => {
                    const phase = getYearPhase(year);
                    const isCurrentYear = year === currentAge;
                    const isPast = year < currentAge;

                    // Styles corresponding to phases
                    let bgStyle = "";
                    let borderStyle = "border-transparent";

                    if (phase === "basis") {
                      bgStyle = isPast ? "bg-[#2D2D2D]" : "bg-[#2D2D2D]/40";
                      borderStyle = isPast ? "border-[#2D2D2D]" : "border-transparent";
                    } else if (phase === "accumulation") {
                      bgStyle = isPast ? "bg-[#D56B45]" : "bg-[#D56B45]/40";
                      borderStyle = isPast ? "border-[#D56B45]" : "border-transparent";
                    } else {
                      // Freedom / Retirement phase
                      bgStyle = isPast ? "bg-[#84A98C]" : "bg-[#84A98C]/40";
                      borderStyle = isPast ? "border-[#84A98C]" : "border-transparent";
                    }

                    return (
                      <motion.div
                        key={year}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: year * 0.015,
                          ease: "easeOut"
                        }}
                        className="relative group flex-1"
                        style={{ aspectRatio: "1/1" }}
                      >
                        {isCurrentYear ? (
                          // Pulse animation wrapper for current year
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            onClick={() => setIsCurrentAgeModalOpen(true)}
                            className="absolute inset-0 z-10 w-full h-full rounded-[3px] bg-[#D56B45] shadow-xs flex items-center justify-center border border-white cursor-pointer hover:scale-110"
                          >
                            <span className="text-[11px] md:text-xs font-black text-white leading-none select-none">
                              {year}
                            </span>
                          </motion.div>
                        ) : (
                          <div
                            className={`w-full h-full rounded-[3px] transition-all duration-300 border ${borderStyle} ${bgStyle} hover:border-white/50 flex items-center justify-center cursor-default group/box`}
                          >
                            {/* Age label always visible but subtle, gets slightly larger and high contrast on hover */}
                            <span className={`text-[9px] md:text-[10px] font-mono transition-all duration-150 select-none font-medium ${isPast ? 'text-white/40 group-hover/box:text-white' : 'text-[#2D2D2D]/40 group-hover/box:text-[#2D2D2D]'} group-hover/box:font-extrabold group-hover/box:scale-110`}>
                              {year}
                            </span>
                          </div>
                        )}

                        {/* Custom Mini Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-1.5 hidden group-hover:block z-20 pointer-events-none">
                          <div className="bg-[#2D2D2D] text-[#FAF9F8] text-[9.5px] px-2 py-0.5 rounded shadow-lg font-mono whitespace-nowrap leading-none">
                            {t('decadeGrid.yr')} {year}: {phase === "basis" ? t('decadeGrid.development') : phase === "accumulation" ? t('decadeGrid.work') : t('decadeGrid.freedom')}
                            {isCurrentYear && t('decadeGrid.currentAgeMarker')}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Pad row if it has fewer than 10 blocks (the very last decade) */}
                  {yearsInThisDecade.length < 10 &&
                    Array.from({ length: 10 - yearsInThisDecade.length }).map((_, i) => {
                      const padYear = (yearsInThisDecade[yearsInThisDecade.length - 1] || startYearOfDecade) + i + 1;
                      return (
                        <motion.div
                          key={`pad-${i}`}
                          initial={{ opacity: 0, scale: 0.5, y: 10 }}
                          animate={{ opacity: 0.3, scale: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: padYear * 0.015,
                            ease: "easeOut"
                          }}
                          className="flex-1 border border-dashed border-gray-200 bg-transparent"
                          style={{ aspectRatio: "1/1" }}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!compact && (
        <div className="flex flex-col items-center justify-center pt-2 gap-3">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsAnalyseModalOpen(true)}
            className="px-4 py-2 bg-[#D56B45] text-white text-xs font-bold rounded-md hover:bg-[#C05D3A] transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
          >
            {t('decadeGrid.analysisBtn')}
          </button>
          <span className="text-[10px] text-gray-500 mt-2 text-center max-w-xs">
            {t('decadeGrid.analysisSubtitle')}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsHealthyModalOpen(true)}
            className="px-4 py-2 bg-white border border-[#D56B45] text-[#D56B45] text-xs font-bold rounded-md hover:bg-[#FAF3F0] transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
          >
            {t('decadeGrid.healthyMatrixBtn')}
          </button>
        </div>
        </div>
      )}
      <AnimatePresence>
        {isCurrentAgeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCurrentAgeModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-[#2D2D2D] tracking-tight">
                  {t('decadeGrid.currentPositionTitle')}
                </h3>
                <button
                  onClick={() => setIsCurrentAgeModalOpen(false)}
                  className="p-1 -mr-2 -mt-2 bg-[#D56B45] text-white hover:bg-[#B84E29] rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-[#767676] leading-relaxed">
                {t('decadeGrid.currentPositionDesc')}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAnalyseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center sm:p-4 overflow-y-auto bg-white sm:bg-transparent">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAnalyseModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer hidden sm:block"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white sm:rounded-xl shadow-none sm:shadow-xl w-full sm:max-w-md min-h-screen sm:min-h-0 p-6 sm:my-8 flex flex-col"
            >
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-lg font-bold text-[#2D2D2D] tracking-tight">
                  {t('decadeGrid.analysisBtn')}
                </h3>
                <button
                  onClick={() => setIsAnalyseModalOpen(false)}
                  className="p-1 -mr-2 -mt-2 bg-[#D56B45] text-white hover:bg-[#B84E29] rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pie Chart & Animated Bars */}
              {(() => {
                const devPct = (effectiveStartWorkAge / totalYears) * 100;
                const workPct = ((effectiveFireAge - effectiveStartWorkAge) / totalYears) * 100;
                const freePct = ((totalYears - effectiveFireAge) / totalYears) * 100;
                
                const r = 15.91549431; // Circumference = 100
                const workOffset = 100 - devPct;
                const freeOffset = 100 - (devPct + workPct);

                const getOpacity = (slice: "dev" | "work" | "free") => {
                  if (!activeSlice) return "opacity-100";
                  return activeSlice === slice ? "opacity-100 scale-[1.02]" : "opacity-40";
                };

                return (
                  <>
                    <div className="flex justify-center mb-6 mt-4">
                      <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90 drop-shadow-sm overflow-visible">
                          {/* Dev Slice */}
                          <circle 
                            cx="21" cy="21" r={r} 
                            fill="transparent" 
                            stroke="#2D2D2D" 
                            strokeWidth={activeSlice === "dev" ? 8 : 6} 
                            strokeDasharray={`${devPct} ${100 - devPct}`}
                            strokeDashoffset={0}
                            className="transition-all duration-300 ease-in-out cursor-pointer hover:stroke-[#4A4A4A]"
                            onMouseEnter={() => setActiveSlice("dev")}
                            onMouseLeave={() => setActiveSlice(null)}
                          />
                          {/* Work Slice */}
                          <circle 
                            cx="21" cy="21" r={r} 
                            fill="transparent" 
                            stroke="#D56B45" 
                            strokeWidth={activeSlice === "work" ? 8 : 6} 
                            strokeDasharray={`${workPct} ${100 - workPct}`}
                            strokeDashoffset={workOffset}
                            className="transition-all duration-300 ease-in-out cursor-pointer hover:stroke-[#E08565]"
                            onMouseEnter={() => setActiveSlice("work")}
                            onMouseLeave={() => setActiveSlice(null)}
                          />
                          {/* Free Slice */}
                          <circle 
                            cx="21" cy="21" r={r} 
                            fill="transparent" 
                            stroke="#84A98C" 
                            strokeWidth={activeSlice === "free" ? 8 : 6} 
                            strokeDasharray={`${freePct} ${100 - freePct}`}
                            strokeDashoffset={freeOffset}
                            className="transition-all duration-300 ease-in-out cursor-pointer hover:stroke-[#9BBAA2]"
                            onMouseEnter={() => setActiveSlice("free")}
                            onMouseLeave={() => setActiveSlice(null)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-28 h-28 bg-[#D56B45] rounded-full flex items-center justify-center shadow-sm border border-[#B84E29] z-10 transition-transform duration-300">
                            <motion.img 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                              transition={{ 
                                opacity: { duration: 0.5 },
                                scale: { type: "spring", stiffness: 200, damping: 15 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                              }}
                              src="/img/olifant-bril.png" 
                              alt="Olifant Mascotte" 
                              className="w-20 h-20 object-contain drop-shadow-md" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div 
                        className={`transition-all duration-300 cursor-default ${getOpacity("dev")}`}
                        onMouseEnter={() => setActiveSlice("dev")}
                        onMouseLeave={() => setActiveSlice(null)}
                      >
                        <div className="flex justify-between text-xs font-semibold text-[#767676] mb-1 uppercase tracking-wider">
                          <span>{t('decadeGrid.development')}</span>
                          <span>{effectiveStartWorkAge} {t('decadeGrid.yr')} ({(effectiveStartWorkAge / totalYears * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-[#2D2D2D]/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(effectiveStartWorkAge / totalYears) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-[#2D2D2D]"
                          />
                        </div>
                      </div>

                      <div 
                        className={`transition-all duration-300 cursor-default ${getOpacity("work")}`}
                        onMouseEnter={() => setActiveSlice("work")}
                        onMouseLeave={() => setActiveSlice(null)}
                      >
                        <div className="flex justify-between text-xs font-semibold text-[#767676] mb-1 uppercase tracking-wider">
                          <span>{t('decadeGrid.work')}</span>
                          <span>{effectiveFireAge - effectiveStartWorkAge} {t('decadeGrid.yr')} ({((effectiveFireAge - effectiveStartWorkAge) / totalYears * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-[#D56B45]/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((effectiveFireAge - effectiveStartWorkAge) / totalYears) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="h-full bg-[#D56B45]"
                          />
                        </div>
                      </div>

                      <div 
                        className={`transition-all duration-300 cursor-default ${getOpacity("free")}`}
                        onMouseEnter={() => setActiveSlice("free")}
                        onMouseLeave={() => setActiveSlice(null)}
                      >
                        <div className="flex justify-between text-xs font-semibold text-[#84A98C] mb-1 uppercase tracking-wider">
                          <span>{t('decadeGrid.freedom')}</span>
                          <span>{totalYears - effectiveFireAge} {t('decadeGrid.yr')} ({((totalYears - effectiveFireAge) / totalYears * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-[#84A98C]/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((totalYears - effectiveFireAge) / totalYears) * 100}%` }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="h-full bg-[#84A98C]"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="border-t border-[#EAE8E4] pt-6 mt-2 mb-6">
                <div className="text-center mb-6">
                  <h2 
                    className="text-[14px] sm:text-lg font-black text-[#2D2D2D] tracking-tight uppercase whitespace-nowrap overflow-hidden text-ellipsis"
                    dangerouslySetInnerHTML={{ __html: t('decadeGrid.livedPercentage').replace('{{pct}}', Math.min(100, Math.round((currentAge / Math.max(totalYears, currentAge, 1)) * 100)).toString()) }}
                  />
                </div>
                <LifeProgressBar 
                  currentAge={currentAge} 
                  projectedLifeExpectancy={totalYears} 
                  className="w-full"
                  hideLabels={true}
                />
              </div>

              <p 
                className="text-xs text-[#767676] leading-relaxed mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100"
                dangerouslySetInnerHTML={{
                  __html: t('decadeGrid.analysisDesc')
                    .replace('{{freePct}}', (((totalYears - effectiveFireAge) / totalYears) * 100).toFixed(0))
                    .replace('{{fireAge}}', String(effectiveFireAge))
                }}
              />

              <div className="py-6 mt-2 text-center sm:hidden">
                <button 
                  onClick={() => setIsAnalyseModalOpen(false)} 
                  className="w-full flex items-center justify-center bg-[#D56B45] hover:bg-[#B84E29] text-white py-4 rounded-xl font-sans font-extrabold transition-all active:scale-95 shadow-sm uppercase tracking-wider"
                >
                  {t('decadeGrid.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <HealthyMatrixModal 
        isOpen={isHealthyModalOpen} 
        onClose={() => setIsHealthyModalOpen(false)} 
      />
    </div>
  );
});
