import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { Sparkles, Settings, X, RefreshCw } from "lucide-react";
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

  const totalRemaining = Math.max(0, projectedLifeExpectancy - inputs.currentAge);
  const totalRoundedRemaining = Math.round(totalRemaining * 10) / 10;

  return (
    <div
      id="mobile-viewport-root"
      className="flex flex-col h-[100dvh] bg-[#F9F8F6] text-[#2D2D2D] overflow-hidden select-none"
    >
      {/* 1. Mobile Custom Header Bar */}
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
            className="p-1 px-2.5 bg-[#D56B45]/10 hover:bg-[#D56B45]/15 border border-[#D56B45]/20 text-[11px] font-extrabold text-[#D56B45] rounded-md transition-all cursor-pointer flex items-center space-x-1"
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

      {/* 2. Main Scrollable Dashboard Content */}
      <main className="flex-1 relative overflow-y-auto px-4 py-4 space-y-5">
        
        {/* Levensloop & Markering (StatsCard & LifePhasesBar) */}
        <div id="mobile-stats-wrapper" className="space-y-4">
          <StatsCard
            inputs={inputs}
            projectedLifeExpectancy={projectedLifeExpectancy}
            apiSource={apiSource}
          />
          
          <div className="bg-white p-3 border border-[#EAEAEA] rounded-md shadow-3xs">
            <LifePhasesBar
              inputs={inputs}
              projectedLifeExpectancy={projectedLifeExpectancy}
              phases={phases}
              onInputChange={onInputChange}
            />
          </div>
        </div>

        {/* Levensmatrix (DecadeGrid) */}
        <div id="mobile-matrix-wrapper" className="bg-white p-3 border border-[#EAEAEA] rounded-lg shadow-3xs">
          <div className="mb-2">
            <DecadeGrid
              inputs={inputs}
              projectedLifeExpectancy={projectedLifeExpectancy}
            />
          </div>
        </div>

        {/* Dynamic Analytics (AestheticFidelityCards) */}
        <div id="mobile-analytics-wrapper" className="pb-8">
          <AestheticFidelityCards
            inputs={inputs}
            projectedLifeExpectancy={projectedLifeExpectancy}
            apiSource={apiSource}
          />
        </div>

        {/* Floating Configuration Assist Button at the bottom for quick thumb reach */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onRestartOnboarding}
            className="flex items-center space-x-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-full text-xs font-semibold text-[#767676] transition-all cursor-pointer shadow-3xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Herstart Introductie</span>
          </button>
        </div>
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
