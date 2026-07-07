import { useState, useEffect } from "react";
import { Compass, RefreshCw, HelpCircle, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserInputs, LifePhases } from "../types";
import OnboardingPanel from "./OnboardingPanel";
import BioScoreSection from "./BioScoreSection";
import AestheticFidelityCards from "./AestheticFidelityCards";
import LifePhasesBar from "./LifePhasesBar";
import DecadeGrid from "./DecadeGrid";
import StatsCard from "./StatsCard";
import SurvivalCurveCard from "./SurvivalCurveCard";
import { useLanguage } from "../context/LanguageContext";
import { StatusBar, Style } from "@capacitor/status-bar";

interface DesktopDashboardProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  cbsBaseLife: number;
  phases: LifePhases;
  apiSource: string;
  isLoadingCBS: boolean;
  onInputChange: (updates: Partial<UserInputs>) => void;
  onRefreshCBS: () => void;
  onRestartOnboarding: () => void;
  onResetApp?: () => void;
}

export default function DesktopDashboard({
  inputs,
  projectedLifeExpectancy,
  cbsBaseLife,
  phases,
  apiSource,
  isLoadingCBS,
  onInputChange,
  onRefreshCBS,
  onRestartOnboarding,
  onResetApp,
}: DesktopDashboardProps) {
  const { t } = useLanguage();

  // Update Status Bar for native Android experience
  useEffect(() => {
    const updateStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      } catch (e) {
        // Ignore on web
      }
    };
    updateStatusBar();
  }, []);

  const [showConfig, setShowConfig] = useState(false);
  const totalRemaining = Math.max(0, projectedLifeExpectancy - inputs.currentAge);
  const roundedRemaining = Math.round(totalRemaining * 10) / 10;

  return (
    <div id="desktop-dashboard-root" className="min-h-screen bg-[#F9F8F6] text-[#2D2D2D] py-8 px-6 md:px-12 xl:px-16 flex flex-col justify-between">
      {/* Container max width constraint */}
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        
        {/* Header section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAEAEA] pb-4">
          <div 
            className="flex items-center space-x-3 mb-2 sm:mb-0 cursor-pointer group"
            onClick={() => window.location.reload()}
          >
            <div className="p-1.5 bg-[#D56B45] rounded-full group-hover:bg-[#C0562F] transition-colors shadow-sm">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-sans text-xl font-bold tracking-tight text-[#2D2D2D] group-hover:text-[#D56B45] transition-colors">
                Life Horizon
              </h1>
              <p className="text-xs text-[#767676]">
                {t('desktopDashboard.subtitle', { name: inputs.name || 'Reiziger' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Rerun Onboarding Intro button */}
            <button
              type="button"
              id="btn-restart-onboarding"
              onClick={onRestartOnboarding}
              title={t('desktopDashboard.restartIntroTitle')}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-[#EAEAEA] bg-white text-xs text-[#767676] rounded hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#D56B45]" />
              <span>{t('desktopDashboard.intro')}</span>
            </button>



            {/* Config Button */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 border border-[#EAEAEA] text-xs rounded transition-all duration-200 cursor-pointer ${showConfig ? 'bg-[#D56B45] text-white border-[#D56B45]' : 'bg-white text-[#767676] hover:bg-gray-100'}`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configuratie</span>
            </button>

            {/* General countdown pill */}
            <div className="bg-[#D56B45]/10 text-[#D56B45] font-mono text-xs font-semibold px-3.5 py-1.5 rounded border border-[#D56B45]/10 shadow-xs select-none">
              {roundedRemaining} {t('desktopDashboard.yearsRemaining')}
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
          
          {/* Main Column */}
          <section className="lg:col-span-12 flex flex-col space-y-5 transition-all duration-300">
            {/* Top row: Mascot & Levensfasen */}
            <div className="flex flex-col md:flex-row gap-5">
              {/* Mascot Box */}
              <div className="w-full md:w-64 shrink-0 p-5 bg-white border border-[#EAEAEA] rounded-md flex items-center justify-center transition-all duration-300">
                <img src="/img/olifant-bril.png" alt="Olifant Mascotte" className="w-40 h-40 object-contain drop-shadow-sm hover:scale-105 transition-transform" />
              </div>

              {/* Custom Levensfasen Stacked Bar */}
              <div className="flex-1 p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300 overflow-hidden">
                <LifePhasesBar
                  inputs={inputs}
                  projectedLifeExpectancy={projectedLifeExpectancy}
                  phases={phases}
                  onInputChange={onInputChange}
                />
              </div>
            </div>

            {/* Survival Curve */}
            <div className="w-full">
              <SurvivalCurveCard 
                inputs={inputs}
                projectedLifeExpectancy={projectedLifeExpectancy}
              />
            </div>

            {/* Matrix and Fidelity Cards Side-by-Side */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-5">
              {/* Decade Square Grid */}
              <div className="xl:col-span-8 flex flex-col justify-between">
                <DecadeGrid
                  inputs={inputs}
                  projectedLifeExpectancy={projectedLifeExpectancy}
                />
              </div>

              {/* Detail Cards Vertical */}
              <div className="xl:col-span-4 flex flex-col">
                <AestheticFidelityCards
                  inputs={inputs}
                  projectedLifeExpectancy={projectedLifeExpectancy}
                  cbsBaseLife={cbsBaseLife}
                  apiSource={apiSource}
                  layout="vertical"
                  showOnly={["verbruikt", "vitaliteit", "carriere"]}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Horizon Card Full Width */}
        <div id="desktop-bottom-horizon" className="w-full pt-2">
          <AestheticFidelityCards
            inputs={inputs}
            projectedLifeExpectancy={projectedLifeExpectancy}
            cbsBaseLife={cbsBaseLife}
            apiSource={apiSource}
            layout="horizontal"
            showOnly={["horizon"]}
          />
        </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowConfig(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#FAFAFA] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAEAEA] rounded-t-xl">
                <h2 className="text-lg font-bold text-[#2D2D2D] font-sans flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#D56B45]" />
                  Configuratie
                </h2>
                <button
                  onClick={() => setShowConfig(false)}
                  className="p-1.5 text-[#767676] hover:bg-[#F3F2F0] rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Onboarding Sliders */}
                <div className="p-5 bg-white border border-[#EAEAEA] rounded-md shadow-sm">
                  <OnboardingPanel inputs={inputs} onChange={onInputChange} />
                </div>

                {/* Bio-Score Modifiers */}
                <div className="p-5 bg-white border border-[#EAEAEA] rounded-md shadow-sm">
                  <BioScoreSection
                    answers={inputs.bioAnswers}
                    onChange={(updates) =>
                      onInputChange({
                        bioAnswers: { ...inputs.bioAnswers, ...updates },
                      })
                    }
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* Modern, minimalist workspace footer */}
      <footer className="mt-8 pt-4 border-t border-[#EAEAEA]/85 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#767676] font-sans">
        <span>{t('desktopDashboard.footerText')}</span>
        <div className="flex space-x-4 mt-2 sm:mt-0 font-mono">
          <span>OData v3: Dataset 80333NED</span>
          <span>Dutch Life Expectancy Standard</span>
        </div>
      </footer>
    </div>
  );
}
