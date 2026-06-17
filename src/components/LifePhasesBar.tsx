import { useState } from "react";
import { motion } from "motion/react";
import { Settings, Edit3 } from "lucide-react";
import { LifePhases, UserInputs } from "../types";

interface LifePhasesBarProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  phases: LifePhases;
  onInputChange?: (updates: Partial<UserInputs>) => void;
}

export default function LifePhasesBar({
  inputs,
  projectedLifeExpectancy,
  phases,
  onInputChange,
}: LifePhasesBarProps) {
  const { currentAge } = inputs;
  const [isEditingExpectancy, setIsEditingExpectancy] = useState(false);

  // Calculate current age percentage position relative to the entire life runway.
  const currentAgePercent = (currentAge / projectedLifeExpectancy) * 100;

  return (
    <div id="life-phases-bar-container" className="flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#767676]">
          Levensloop & Markering
        </h4>
        <div className="flex items-center space-x-2">
          {onInputChange && (
            <button
              onClick={() => setIsEditingExpectancy(!isEditingExpectancy)}
              className="px-2 py-1 rounded text-[10px] bg-[#D56B45]/10 hover:bg-[#D56B45]/15 border border-[#D56B45]/20 text-[#D56B45] font-bold flex items-center space-x-1 cursor-pointer transition-all shrink-0 shadow-3xs"
            >
              {inputs.customLifeExpectancy !== null ? (
                <>
                  <Edit3 className="w-3 h-3 text-[#D56B45]" />
                  <span>Zelf: {Math.round(projectedLifeExpectancy)} jr</span>
                </>
              ) : (
                <>
                  <Settings className="w-3 h-3 text-[#D56B45]" />
                  <span>Pas levensverwachting aan</span>
                </>
              )}
            </button>
          )}
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold font-sans rounded bg-[#FAF3F0] text-[#D56B45] border border-[#D56B45]/20 whitespace-nowrap flex items-center gap-1.5 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D56B45] animate-pulse" />
            Huidige Leeftijd: <span className="font-mono text-xs font-black">{currentAge} jaar</span>
          </span>
        </div>
      </div>

      {isEditingExpectancy && onInputChange && (
        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/40 text-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-700">Eigen levensverwachting overschrijven:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-black text-sm text-[#D56B45]">{Math.round(projectedLifeExpectancy)} jaar</span>
              {inputs.customLifeExpectancy !== null && (
                <button
                  onClick={() => onInputChange({ customLifeExpectancy: null })}
                  className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold transition-all cursor-pointer"
                  title="Herstel naar CBS model"
                >
                  Model herstellen
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] text-zinc-500 font-mono">{inputs.currentAge + 1} jr</span>
            <input
              type="range"
              min={Math.max(45, inputs.currentAge + 1)}
              max="115"
              value={Math.round(projectedLifeExpectancy)}
              onChange={(e) => onInputChange({ customLifeExpectancy: parseInt(e.target.value) })}
              className="flex-grow h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
            />
            <span className="text-[10px] text-zinc-500 font-mono">115 jr</span>
          </div>
          <p className="text-[9px] text-[#767676] leading-tight">
            {inputs.customLifeExpectancy === null 
              ? "Nu ingesteld op het dynamische CBS Cohortmodel + leefstijl modifiers." 
              : "Verwachte leeftijd met de hand ingesteld. Dit overschrijft de CBS prognose."}
          </p>
        </div>
      )}

      {/* Stacked Horizontal Bar with Integrated Age Ticks */}
      <div className="relative pt-6 pb-8">
        {/* Label and Segment Bars */}
        <div className="h-6 w-full rounded-md flex overflow-hidden bg-[#EAE8E4] relative shadow-inner border border-black/5">
          {/* Phase 1: Ontwikkeling */}
          <div
            id="phase-bar-basis"
            className="h-full bg-[#EAE8E4] transition-all duration-300 relative group"
            style={{ width: `${phases.basisPercent}%` }}
            title={`Ontwikkeling (0 - ${inputs.startWorkAge} jaar)`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {phases.basisPercent > 8 && (
                <span className="text-[10px] uppercase tracking-wider text-[#767676] font-medium hidden sm:inline">
                  Ontwikkeling
                </span>
              )}
            </div>
          </div>

          {/* Phase 2: Accumulatie */}
          <div
            id="phase-bar-accumulatie"
            className="h-full bg-[#C8C5C0] border-l border-[#FFFFFF]/30 transition-all duration-300 relative group"
            style={{ width: `${phases.accumulationPercent}%` }}
            title={`Accumulatie (${inputs.startWorkAge} - ${inputs.fireAge} jaar)`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {phases.accumulationPercent > 12 && (
                <span className="text-[10px] uppercase tracking-wider text-[#2D2D2D]/80 font-bold hidden sm:inline">
                  Accumulatie
                </span>
              )}
            </div>
          </div>

          {/* Phase 3: Vrijheid */}
          <div
            id="phase-bar-vrijheid"
            className="h-full bg-[#D56B45]/20 border-l border-[#FFFFFF]/30 transition-all duration-300 relative group"
            style={{ width: `${phases.freedomPercent}%` }}
            title={`Vrijheid (${inputs.fireAge} - ${projectedLifeExpectancy} jaar)`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {phases.freedomPercent > 12 && (
                <span className="text-[10px] uppercase tracking-wider text-[#D56B45] font-bold hidden sm:inline">
                  Vrijheid
                </span>
              )}
            </div>
          </div>
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
              className="w-3.5 h-3.5 bg-[#D56B45] rotate-45 border border-white shadow-md z-10"
            />
            {/* Visual indicator line extending through the bar */}
            <div className="w-[2px] h-7 bg-[#D56B45] mt-1 z-10" />
          </div>
        </div>

        {/* Dynamic Ticks and Labels underneath the bar */}
        <div className="absolute bottom-1 left-0 right-0 h-5 text-[10px] font-mono text-[#767676] select-none pointer-events-none">
          {/* Start tick (0) */}
          <div className="absolute left-0 bottom-0 flex flex-col items-start">
            <div className="w-[1.5px] h-2.5 bg-[#C8C5C0]" />
            <span className="mt-0.5 font-bold">0 jr</span>
          </div>

          {/* Start Work Age tick */}
          <div 
            className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${phases.basisPercent}%` }}
          >
            <div className="w-[1.5px] h-2.5 bg-[#8E8B87]" />
            <span className="mt-0.5 font-extrabold text-[#2D2D2D] bg-[#FDFDFD] px-1 rounded border border-[#EAEAEA] shadow-3xs whitespace-nowrap">
              {inputs.startWorkAge} jr <span className="font-normal text-[#767676] hidden sm:inline">(Start Werk)</span>
            </span>
          </div>

          {/* FIRE Age tick */}
          <div 
            className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${phases.basisPercent + phases.accumulationPercent}%` }}
          >
            <div className="w-[1.5px] h-2.5 bg-[#D56B45]" />
            <span className="mt-0.5 font-extrabold text-[#D56B45] bg-[#FDFDFD] px-1 rounded border border-[#D56B45]/20 shadow-3xs whitespace-nowrap">
              {inputs.fireAge} jr <span className="font-semibold text-[#D56B45]/80 hidden sm:inline">(FIRE)</span>
            </span>
          </div>

          {/* End Age tick */}
          <div className="absolute right-0 bottom-0 flex flex-col items-end">
            <div className="w-[1.5px] h-2.5 bg-[#D56B45]/40" />
            <span className="mt-0.5 font-bold text-[#D56B45] whitespace-nowrap">
              {Math.round(projectedLifeExpectancy)} jr
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Details */}
      <div id="life-phases-legend" className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAEAEA]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#767676]">
            1. Ontwikkeling
          </span>
          <span className="text-sm font-semibold text-[#2D2D2D] font-mono">
            {phases.basisYears} yr{" "}
            <span className="text-[11px] text-[#767676] font-normal">
              ({Math.round(phases.basisPercent)}%)
            </span>
          </span>
          <span className="text-[10px] text-[#767676]">0 - {inputs.startWorkAge} jr</span>
        </div>

        <div className="flex flex-col border-l border-[#EAEAEA] pl-3">
          <span className="text-[10px] uppercase tracking-wider text-[#767676]">
            2. Accumulatie
          </span>
          <span className="text-sm font-semibold text-[#2D2D2D] font-mono">
            {phases.accumulationYears} yr{" "}
            <span className="text-[11px] text-[#767676] font-normal">
              ({Math.round(phases.accumulationPercent)}%)
            </span>
          </span>
          <span className="text-[10px] text-[#767676]">
            {inputs.startWorkAge} - {inputs.fireAge} jr
          </span>
        </div>

        <div className="flex flex-col border-l border-[#EAEAEA] pl-3">
          <span className="text-[10px] uppercase tracking-wider text-[#767676]">
            3. Vrijheid
          </span>
          <span className="text-sm font-semibold text-[#D56B45] font-mono">
            {phases.freedomYears.toFixed(1)} yr{" "}
            <span className="text-[11px] text-[#767676] font-normal">
              ({Math.round(phases.freedomPercent)}%)
            </span>
          </span>
          <span className="text-[10px] text-[#767676]">
            {inputs.fireAge} - {projectedLifeExpectancy.toFixed(1)} jr
          </span>
        </div>
      </div>
    </div>
  );
}
