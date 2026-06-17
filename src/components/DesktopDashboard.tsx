import { Sparkles, RefreshCw, HelpCircle } from "lucide-react";
import { UserInputs, LifePhases } from "../types";
import OnboardingPanel from "./OnboardingPanel";
import BioScoreSection from "./BioScoreSection";
import AestheticFidelityCards from "./AestheticFidelityCards";
import LifePhasesBar from "./LifePhasesBar";
import DecadeGrid from "./DecadeGrid";
import StatsCard from "./StatsCard";

interface DesktopDashboardProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  phases: LifePhases;
  apiSource: string;
  isLoadingCBS: boolean;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onRefreshCBS: () => void;
  onRestartOnboarding: () => void;
}

export default function DesktopDashboard({
  inputs,
  projectedLifeExpectancy,
  phases,
  apiSource,
  isLoadingCBS,
  onInputChange,
  onRefreshCBS,
  onRestartOnboarding,
}: DesktopDashboardProps) {
  const totalRemaining = Math.max(0, projectedLifeExpectancy - inputs.currentAge);
  const roundedRemaining = Math.round(totalRemaining * 10) / 10;

  return (
    <div id="desktop-dashboard-root" className="min-h-screen bg-[#F9F8F6] text-[#2D2D2D] py-8 px-6 md:px-12 xl:px-16 flex flex-col justify-between">
      {/* Container max width constraint */}
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        
        {/* Header section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAEAEA] pb-4">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <div className="p-1.5 bg-[#D56B45]/10 rounded-md">
              <Sparkles className="w-5 h-5 text-[#D56B45]" />
            </div>
            <div>
              <h1 className="font-sans text-xl font-bold tracking-tight text-[#2D2D2D]">
                LifeRunway
              </h1>
              <p className="text-xs text-[#767676]">
                Confronteer je schaarste. Visualiseer je vitaliteit en levensfases.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Rerun Onboarding Intro button */}
            <button
              type="button"
              id="btn-restart-onboarding"
              onClick={onRestartOnboarding}
              title="Start de geanimeerde introductie opnieuw"
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-[#EAEAEA] bg-white text-xs text-[#767676] rounded hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#D56B45]" />
              <span>Introductie</span>
            </button>

            {/* CBS Sync Indicator */}
            <button
              type="button"
              id="btn-sync-cbs"
              onClick={onRefreshCBS}
              title="Synchroniseer met CBS Open Data"
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-[#EAEAEA] bg-white text-xs text-[#767676] rounded hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCBS ? "animate-spin" : ""}`} />
              <span>Sync CBS</span>
            </button>

            {/* General countdown pill */}
            <div className="bg-[#D56B45]/10 text-[#D56B45] font-mono text-xs font-semibold px-3.5 py-1.5 rounded border border-[#D56B45]/10 shadow-xs select-none">
              {roundedRemaining} Jaren Resterend
            </div>
          </div>
        </header>

        {/* Dynamic Key Counters Overview */}
        <div id="desktop-overview-counters" className="w-full">
          <StatsCard
            inputs={inputs}
            projectedLifeExpectancy={projectedLifeExpectancy}
            apiSource={apiSource}
          />
        </div>

        {/* Bento Grid */}
        <div id="bento-grid-root" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column: Inputs & Modifiers (Width 5 on Large) */}
          <section className="lg:col-span-5 flex flex-col space-y-5">
            {/* Onboarding Sliders */}
            <div className="p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300">
              <OnboardingPanel inputs={inputs} onChange={onInputChange} />
            </div>

            {/* Bio-Score Modifiers */}
            <div className="p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300">
              <BioScoreSection
                answers={inputs.bioAnswers}
                onChange={(updates) =>
                  onInputChange({
                    bioAnswers: { ...inputs.bioAnswers, ...updates },
                  })
                }
              />
            </div>
          </section>

          {/* Right Column: Visualisations and decade grids (Width 7 on Large) */}
          <section className="lg:col-span-7 flex flex-col space-y-5">
            {/* Custom Levensfasen Stacked Bar */}
            <div className="p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300">
              <LifePhasesBar
                inputs={inputs}
                projectedLifeExpectancy={projectedLifeExpectancy}
                phases={phases}
              />
            </div>

            {/* Decade Square Grid */}
            <div className="flex-1 flex flex-col justify-between">
              <DecadeGrid
                inputs={inputs}
                projectedLifeExpectancy={projectedLifeExpectancy}
              />
            </div>
          </section>
        </div>

        {/* AestheticFidelityCards at the bottom */}
        <div id="desktop-bottom-stats" className="w-full pt-2">
          <AestheticFidelityCards
            inputs={inputs}
            projectedLifeExpectancy={projectedLifeExpectancy}
            apiSource={apiSource}
          />
        </div>
      </div>

      {/* Modern, minimalist workspace footer */}
      <footer className="mt-8 pt-4 border-t border-[#EAEAEA]/85 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#767676] font-sans">
        <span>© 2026 LifeRunway — Tijd, Lucht & Vitaliteit</span>
        <div className="flex space-x-4 mt-2 sm:mt-0 font-mono">
          <span>OData v3: Dataset 80333NED</span>
          <span>Dutch Life Expectancy Standard</span>
        </div>
      </footer>
    </div>
  );
}
