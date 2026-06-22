import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { LifePhases, UserInputs } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface LifePhasesBarProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  phases: LifePhases;
  onInputChange?: (updates: Partial<UserInputs>) => void;
}

export default React.memo(function LifePhasesBar({
  inputs,
  projectedLifeExpectancy,
  phases,
  onInputChange,
}: LifePhasesBarProps) {
  const { t } = useLanguage();
  const { currentAge } = inputs;
  const [isEditingExpectancy, setIsEditingExpectancy] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHand, setShowHand] = useState(true);

  React.useEffect(() => {
    if (showHand) {
      const timer = setTimeout(() => setShowHand(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showHand]);

  // Calculate current age percentage position relative to the entire life runway.
  const currentAgePercent = (currentAge / projectedLifeExpectancy) * 100;

  return (
    <motion.div
      id="life-phases-bar-container"
      className={`relative flex flex-col space-y-4 p-3.5 -m-3.5 rounded-xl cursor-pointer bg-white`}
      style={{
        borderWidth: "1px",
        borderStyle: "solid"
      }}
      animate={isExpanded ? {
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(253, 230, 138, 0.6)",
        backgroundColor: "rgba(254, 243, 199, 1)"
      } : {
        boxShadow: [
          "0px 0px 15px rgba(213,107,69,0.12)",
          "0px 0px 25px rgba(213,107,69,0.7)",
          "0px 0px 15px rgba(213,107,69,0.12)",
          "0px 0px 25px rgba(213,107,69,0.7)",
          "0px 0px 15px rgba(213,107,69,0.12)"
        ],
        borderColor: [
          "rgba(253, 230, 138, 0.5)",
          "rgba(213, 107, 69, 0.9)",
          "rgba(253, 230, 138, 0.5)",
          "rgba(213, 107, 69, 0.9)",
          "rgba(253, 230, 138, 0.5)"
        ],
        backgroundColor: [
          "rgba(255, 255, 255, 1)",
          "rgba(254, 243, 199, 0.8)",
          "rgba(255, 255, 255, 1)",
          "rgba(254, 243, 199, 0.8)",
          "rgba(255, 255, 255, 1)"
        ]
      }}
      transition={isExpanded ? { duration: 0.3 } : {
        duration: 2.2,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        delay: 0.8
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("input")) return;
        setIsExpanded(!isExpanded);
        setShowHand(false);
      }}
    >
      <AnimatePresence>
        {showHand && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 0.3 },
              y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
            }}
            className="absolute -top-3 right-6 z-50 text-2xl sm:text-3xl drop-shadow-lg pointer-events-none"
          >
            👇
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#D56B45] flex items-center gap-1.5 drop-shadow-sm">
          {t('lifePhasesBar.title')}
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#D56B45]/70" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#D56B45]/70" />
          )}
        </h4>
        <div className="flex items-center space-x-2">
          {onInputChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingExpectancy(!isEditingExpectancy);
              }}
              className="px-2 py-1 rounded text-[10px] bg-[#D56B45]/10 hover:bg-[#D56B45]/15 border border-[#D56B45]/20 text-[#D56B45] font-bold flex items-center space-x-1 cursor-pointer transition-all shrink-0 shadow-3xs"
            >
              {inputs.customLifeExpectancy !== null ? (
                <>
                  <Edit3 className="w-3 h-3 text-[#D56B45]" />
                  <span>{t('lifePhasesBar.self')} {Math.round(projectedLifeExpectancy)} {t('lifePhasesBar.yr')}</span>
                </>
              ) : (
                <>
                  <Settings className="w-3 h-3 text-[#D56B45]" />
                  <span className="hidden sm:inline">{t('lifePhasesBar.adjustFull')}</span>
                  <span className="sm:hidden">{t('lifePhasesBar.adjustShort')}</span>
                </>
              )}
            </button>
          )}
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold font-sans rounded bg-[#FAF3F0] text-[#D56B45] border border-[#D56B45]/20 whitespace-nowrap flex items-center gap-1.5 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D56B45] animate-pulse shadow-[0_0_8px_rgba(213,107,69,0.8)]" />
            <span className="hidden min-[375px]:inline">{t('lifePhasesBar.currentAgeFull')}</span>
            <span className="min-[375px]:hidden">{t('lifePhasesBar.currentAgeShort')}</span>
            <span className="font-mono text-xs font-black">{currentAge} <span className="hidden sm:inline">{t('lifePhasesBar.years')}</span></span>
          </span>
        </div>
      </div>

      {isEditingExpectancy && onInputChange && (
        <div
          className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/40 text-xs space-y-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-700">{t('lifePhasesBar.overrideTitle')}</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-black text-sm text-[#D56B45]">{Math.round(projectedLifeExpectancy)} {t('lifePhasesBar.years')}</span>
              {inputs.customLifeExpectancy !== null && (
                <button
                  onClick={() => onInputChange({ customLifeExpectancy: null })}
                  className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold transition-all cursor-pointer"
                  title={t('lifePhasesBar.restoreModel')}
                >
                  {t('lifePhasesBar.restoreModel')}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] text-zinc-500 font-mono">{inputs.currentAge + 1} {t('lifePhasesBar.yr')}</span>
            <input
              type="range"
              min={Math.max(45, inputs.currentAge + 1)}
              max="115"
              value={Math.round(projectedLifeExpectancy)}
              onChange={(e) => onInputChange({ customLifeExpectancy: parseInt(e.target.value) })}
              className="flex-grow h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
            />
            <span className="text-[10px] text-zinc-500 font-mono">115 {t('lifePhasesBar.yr')}</span>
          </div>
          <p className="text-[9px] text-[#767676] leading-tight">
            {inputs.customLifeExpectancy === null 
              ? t('lifePhasesBar.cbsModelText')
              : t('lifePhasesBar.customModelText')}
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="horizontal"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            {/* Stacked Horizontal Bar with Integrated Age Ticks */}
            <div className="relative pt-6 pb-8">
              {/* Label and Segment Bars */}
              <div className="h-6 w-full rounded-md flex overflow-hidden bg-[#EAE8E4] relative shadow-inner border border-black/5">
                {/* Phase 1: Ontwikkeling */}
                <motion.div
                  id="phase-bar-basis"
                  className="h-full bg-[#EAE8E4] relative group"
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ width: `${phases.basisPercent}%`, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  title={`${t('lifePhasesBar.development')} (0 - ${inputs.startWorkAge} ${t('lifePhasesBar.years')})`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {phases.basisPercent > 8 && (
                      <span className="text-[10px] uppercase tracking-wider text-[#767676] font-medium hidden sm:inline">
                        {t('lifePhasesBar.development')}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Phase 2: Werk */}
                <motion.div
                  id="phase-bar-werk"
                  className="h-full bg-[#C8C5C0] border-l border-[#FFFFFF]/30 relative group"
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ width: `${phases.accumulationPercent}%`, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                  title={`${t('lifePhasesBar.work')} (${inputs.startWorkAge} - ${inputs.fireAge} ${t('lifePhasesBar.years')})`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {phases.accumulationPercent > 12 && (
                      <span className="text-[10px] uppercase tracking-wider text-[#2D2D2D]/80 font-bold hidden sm:inline">
                        {t('lifePhasesBar.work')}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Phase 3: Vrijheid */}
                <motion.div
                  id="phase-bar-vrijheid"
                  className="h-full bg-[#D56B45]/20 border-l border-[#FFFFFF]/30 relative group"
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ width: `${phases.freedomPercent}%`, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
                  title={`${t('lifePhasesBar.freedom')} (${inputs.fireAge} - ${projectedLifeExpectancy} ${t('lifePhasesBar.years')})`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {phases.freedomPercent > 12 && (
                      <span className="text-[10px] uppercase tracking-wider text-[#D56B45] font-bold hidden sm:inline">
                        {t('lifePhasesBar.freedom')}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Floating marker for Current Age */}
              <div
                className="absolute top-1 transition-all duration-300 ease-out"
                style={{ left: `calc(${currentAgePercent}% - 8px)` }}
              >
                <div className="flex flex-col items-center">
                  {/* Elegant tiny diamond or indicator */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="z-10"
                  >
                    <div className="w-3.5 h-3.5 bg-[#D56B45] rotate-45 border border-white" />
                  </motion.div>
                  {/* Visual indicator line extending through the bar */}
                  <div className="w-[2px] h-7 bg-[#D56B45] mt-1 z-10 shadow-sm" />
                </div>
              </div>

              {/* Dynamic Ticks and Labels underneath the bar */}
              <div className="absolute bottom-1 left-0 right-0 h-5 text-[10px] font-mono text-[#767676] select-none pointer-events-none">
                {/* Start tick (0) */}
                <div className="absolute left-0 bottom-0 flex flex-col items-start">
                  <div className="w-[1.5px] h-2.5 bg-[#C8C5C0]" />
                  <span className="mt-0.5 font-bold">0 {t('lifePhasesBar.yr')}</span>
                </div>

                {/* Start Work Age tick */}
                <div 
                  className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
                  style={{ left: `${phases.basisPercent}%` }}
                >
                  <div className="w-[1.5px] h-2.5 bg-[#8E8B87]" />
                  <span className="mt-0.5 font-extrabold text-[#2D2D2D] bg-[#FDFDFD] px-1 rounded border border-[#EAEAEA] shadow-3xs whitespace-nowrap">
                    {inputs.startWorkAge} {t('lifePhasesBar.yr')} <span className="font-normal text-[#767676] hidden sm:inline">({t('lifePhasesBar.startWork')})</span>
                  </span>
                </div>

                {/* Pensioen Age tick */}
                <div 
                  className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
                  style={{ left: `${phases.basisPercent + phases.accumulationPercent}%` }}
                >
                  <div className="w-[1.5px] h-2.5 bg-[#D56B45]" />
                  <span className="mt-0.5 font-extrabold text-[#D56B45] bg-[#FDFDFD] px-1 rounded border border-[#D56B45]/20 shadow-3xs whitespace-nowrap">
                    {inputs.fireAge} {t('lifePhasesBar.yr')} <span className="font-semibold text-[#D56B45]/80 hidden sm:inline">({t('lifePhasesBar.retirement')})</span>
                  </span>
                </div>

                {/* End Age tick */}
                <div className="absolute right-0 bottom-0 flex flex-col items-end">
                  <div className="w-[1.5px] h-2.5 bg-[#D56B45]/40" />
                  <span className="mt-0.5 font-bold text-[#D56B45] whitespace-nowrap">
                    {Math.round(projectedLifeExpectancy)} {t('lifePhasesBar.yr')}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend & Details */}
            <div id="life-phases-legend" className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAEAEA]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#767676]">
                  1. {t('lifePhasesBar.development')}
                </span>
                <span className="text-sm font-semibold text-[#2D2D2D] font-mono">
                  {phases.basisYears} {t('lifePhasesBar.years')}
                </span>
                <span className="text-[11px] text-[#767676]">
                  {Math.round(phases.basisPercent)}%
                </span>
                <span className="text-[10px] text-[#767676]">0 - {inputs.startWorkAge} {t('lifePhasesBar.yr')}</span>
              </div>

              <div className="flex flex-col border-l border-[#EAEAEA] pl-3">
                <span className="text-[10px] uppercase tracking-wider text-[#767676]">
                  2. {t('lifePhasesBar.work')}
                </span>
                <span className="text-sm font-semibold text-[#2D2D2D] font-mono">
                  {phases.accumulationYears} {t('lifePhasesBar.years')}
                </span>
                <span className="text-[11px] text-[#767676]">
                  {Math.round(phases.accumulationPercent)}%
                </span>
                <span className="text-[10px] text-[#767676]">
                  {inputs.startWorkAge} - {inputs.fireAge} {t('lifePhasesBar.yr')}
                </span>
              </div>

              <div className="flex flex-col border-l border-[#EAEAEA] pl-3">
                <span className="text-[10px] uppercase tracking-wider text-[#767676]">
                  3. {t('lifePhasesBar.freedom')}
                </span>
                <span className="text-sm font-semibold text-[#D56B45] font-mono">
                  {phases.freedomYears.toFixed(1)} {t('lifePhasesBar.years')}
                </span>
                <span className="text-[11px] text-[#767676]">
                  {Math.round(phases.freedomPercent)}%
                </span>
                <span className="text-[10px] text-[#767676]">
                  {inputs.fireAge} - {projectedLifeExpectancy.toFixed(1)} {t('lifePhasesBar.yr')}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="vertical"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col space-y-2 pt-3 overflow-hidden"
          >
            {/* Vertical Version */}
            {/* Phase 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-stretch group relative"
            >
              <div className="w-10 shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#EAE8E4] flex items-center justify-center text-xs font-bold text-[#767676] z-10 shadow-sm border border-white/50">1</div>
                <div className="w-[2px] h-full bg-gradient-to-b from-[#EAE8E4] to-[#C8C5C0] group-last:hidden mt-[-2px] mb-[-2px]" />
              </div>
              <div className="pb-5 pl-3 flex-1 relative">
                {currentAge < inputs.startWorkAge && (
                  <div className="absolute top-1.5 -left-10 w-2.5 h-2.5 rounded-full bg-[#D56B45] animate-pulse shadow-[0_0_8px_rgba(213,107,69,0.8)] border border-white z-20" />
                )}
                <h5 className="text-[13px] font-extrabold text-[#2D2D2D] uppercase tracking-wide">{t('lifePhasesBar.development')}</h5>
                <p className="text-[11px] font-mono text-[#767676] mb-1.5 bg-white/50 inline-block px-1.5 py-0.5 rounded shadow-3xs border border-[#EAEAEA]/50">
                  0 - {inputs.startWorkAge} {t('lifePhasesBar.yr')} <span className="font-sans ml-1 text-zinc-400">({phases.basisYears} {t('lifePhasesBar.years')}, {Math.round(phases.basisPercent)}%)</span>
                </p>
                <p className="text-[11px] text-[#767676] leading-relaxed bg-white/40 p-2 rounded-md border border-[#EAEAEA]/30">
                  {t('lifePhasesBar.phase1Desc')}
                </p>
              </div>
            </motion.div>

            {/* Phase 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-stretch group relative"
            >
              <div className="w-10 shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#C8C5C0] flex items-center justify-center text-xs font-bold text-[#2D2D2D] z-10 shadow-sm border border-white/50">2</div>
                <div className="w-[2px] h-full bg-gradient-to-b from-[#C8C5C0] to-[#D56B45]/40 group-last:hidden mt-[-2px] mb-[-2px]" />
              </div>
              <div className="pb-5 pl-3 flex-1 relative">
                {currentAge >= inputs.startWorkAge && currentAge < inputs.fireAge && (
                  <div className="absolute top-1.5 -left-10 w-2.5 h-2.5 rounded-full bg-[#D56B45] animate-pulse shadow-[0_0_8px_rgba(213,107,69,0.8)] border border-white z-20" />
                )}
                <h5 className="text-[13px] font-extrabold text-[#2D2D2D] uppercase tracking-wide">{t('lifePhasesBar.work')}</h5>
                <p className="text-[11px] font-mono text-[#767676] mb-1.5 bg-white/50 inline-block px-1.5 py-0.5 rounded shadow-3xs border border-[#EAEAEA]/50">
                  {inputs.startWorkAge} - {inputs.fireAge} {t('lifePhasesBar.yr')} <span className="font-sans ml-1 text-zinc-400">({phases.accumulationYears} {t('lifePhasesBar.years')}, {Math.round(phases.accumulationPercent)}%)</span>
                </p>
                <p className="text-[11px] text-[#767676] leading-relaxed bg-white/40 p-2 rounded-md border border-[#EAEAEA]/30">
                  {t('lifePhasesBar.phase2Desc')}
                </p>
              </div>
            </motion.div>

            {/* Phase 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="flex items-stretch group relative"
            >
              <div className="w-10 shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-[#D56B45] z-10 shadow-sm border border-amber-200/50">3</div>
                <div className="w-[2px] h-full bg-gradient-to-b from-amber-100 to-transparent group-last:hidden mt-[-2px] mb-[-2px]" />
              </div>
              <div className="pb-2 pl-3 flex-1 relative">
                {currentAge >= inputs.fireAge && (
                  <div className="absolute top-1.5 -left-10 w-2.5 h-2.5 rounded-full bg-[#D56B45] animate-pulse shadow-[0_0_8px_rgba(213,107,69,0.8)] border border-white z-20" />
                )}
                <h5 className="text-[13px] font-extrabold text-[#D56B45] uppercase tracking-wide flex items-center gap-1.5">
                  {t('lifePhasesBar.freedomRetirement')}
                  <span className="px-1.5 py-0.5 rounded bg-[#D56B45]/10 text-[#D56B45] text-[9px] border border-[#D56B45]/20">{t('lifePhasesBar.harvestPhase')}</span>
                </h5>
                <p className="text-[11px] font-mono text-[#D56B45]/80 mb-1.5 bg-amber-50/50 inline-block px-1.5 py-0.5 rounded shadow-3xs border border-amber-200/50 mt-1">
                  {inputs.fireAge} - {projectedLifeExpectancy.toFixed(1)} {t('lifePhasesBar.yr')} <span className="font-sans ml-1 opacity-70">({phases.freedomYears.toFixed(1)} {t('lifePhasesBar.years')}, {Math.round(phases.freedomPercent)}%)</span>
                </p>
                <p className="text-[11px] text-[#D56B45]/90 leading-relaxed bg-amber-50/40 p-2 rounded-md border border-amber-200/30">
                  {t('lifePhasesBar.phase3Desc')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

