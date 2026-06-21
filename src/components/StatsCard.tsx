import { useState } from "react";
import { Hourglass, ShieldCheck, Sun, Workflow, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserInputs } from "../types";
import LifeProgressBar from "./LifeProgressBar";
import { useLanguage } from "../context/LanguageContext";

interface StatsCardProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  apiSource: string;
}

export default function StatsCard({
  inputs,
  projectedLifeExpectancy,
  apiSource,
}: StatsCardProps) {
  const { t } = useLanguage();
  const { currentAge, fireAge } = inputs;
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const totalRemaining = Math.max(0, projectedLifeExpectancy - currentAge);
  const remainingWork = Math.max(0, fireAge - currentAge);
  const totalFreedom = Math.max(0, projectedLifeExpectancy - fireAge);

  // Translate to rounded values for clean layout
  const lifeVal = Math.round(projectedLifeExpectancy * 10) / 10;
  const remValue = Math.round(totalRemaining * 10) / 10;
  const workValue = Math.round(remainingWork * 10) / 10;
  const freeValue = Math.round(totalFreedom * 10) / 10;

  const popups: Record<string, { title: string; content: string }> = {
    prognose: {
      title: t('statsCard.popups.prognosisTitle'),
      content: t('statsCard.popups.prognosisDesc')
    },
    resterend: {
      title: t('statsCard.popups.remainingTitle'),
      content: t('statsCard.popups.remainingDesc')
    },
    werkend: {
      title: t('statsCard.popups.workingTitle'),
      content: t('statsCard.popups.workingDesc')
    },
    vrijheid: {
      title: t('statsCard.popups.freedomTitle'),
      content: t('statsCard.popups.freedomDesc')
    },
    voortgang: {
      title: t('statsCard.popups.progressTitle'),
      content: t('statsCard.popups.progressDesc')
    }
  };

  return (
    <>
      <div id="stats-dashboard-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Geprognosticeerde Levensverwachting */}
        <div 
          onClick={() => setActivePopup("prognose")}
          className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between cursor-pointer hover:border-[#D56B45]/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
              {t('statsCard.popups.prognosisTitle')}
            </span>
            <ShieldCheck className="w-4 h-4 text-[#D56B45]/80" />
          </div>
          <div className="mt-2.5">
            <span id="stat-life-expectancy" className="text-3xl font-bold text-[#2D2D2D] font-mono tracking-tight">
              {lifeVal}
            </span>
            <span className="text-xs text-[#767676] ml-1 font-sans">{t('statsCard.years')}</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F8F7F5] flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#767676]">
            <span className="text-[#8E8C88] font-medium">{t('statsCard.calibratedWith')}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded font-sans text-[8.5px] font-extrabold uppercase tracking-widest bg-[#FAF3F0] text-[#D56B45] border border-[#D56B45]/15 whitespace-nowrap">
              {apiSource}
            </span>
          </div>
        </div>

        {/* 2. Resterende Levensduur */}
        <div 
          onClick={() => setActivePopup("resterend")}
          className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between cursor-pointer hover:border-[#D56B45]/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
              {t('statsCard.popups.remainingTitle')}
            </span>
            <Hourglass className="w-4 h-4 text-[#D56B45]" />
          </div>
          <div className="mt-2.5">
            <span id="stat-remaining-years" className="text-3xl font-bold text-[#D56B45] font-mono tracking-tight">
              {remValue}
            </span>
            <span className="text-xs text-[#767676] ml-1 font-sans">{t('statsCard.years')}</span>
          </div>
          <p className="text-[9.5px] text-[#767676] mt-1 select-none leading-tight">
            {t('statsCard.remainingBudget')}
          </p>
        </div>

        {/* 3. Nog Werken tot Pensioen */}
        <div 
          onClick={() => setActivePopup("werkend")}
          className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between cursor-pointer hover:border-[#D56B45]/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
              {t('statsCard.popups.workingTitle')}
            </span>
            <Workflow className="w-4 h-4 text-[#767676]/80" />
          </div>
          <div className="mt-2.5">
            <span id="stat-working-years" className="text-3xl font-bold text-[#2D2D2D] font-mono tracking-tight">
              {workValue}
            </span>
            <span className="text-xs text-[#767676] ml-1 font-sans">{t('statsCard.years')}</span>
          </div>
          <span className="text-[9.5px] text-[#767676] mt-1 leading-tight">
            {currentAge >= fireAge
              ? t('statsCard.freedomAchieved')
              : t('statsCard.phaseEndsAt').replace('{{age}}', fireAge.toString())}
          </span>
        </div>

        {/* 4. Totaal Vrijheid in Jaren */}
        <div 
          onClick={() => setActivePopup("vrijheid")}
          className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between cursor-pointer hover:border-[#D56B45]/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
              {t('statsCard.popups.freedomTitle')}
            </span>
            <Sun className="w-4 h-4 text-amber-500/80" />
          </div>
          <div className="mt-2.5">
            <span id="stat-freedom-years" className="text-3xl font-bold text-[#2D2D2D] font-mono tracking-tight">
              {freeValue}
            </span>
            <span className="text-xs text-[#767676] ml-1">{t('statsCard.years')}</span>
          </div>
          <span className="text-[9.5px] text-[#767676] mt-1 leading-tight">
            {t('statsCard.harvestPhase')}
          </span>
        </div>

        {/* 5. Levensvoortgang (Bar) */}
        <div 
          onClick={() => setActivePopup("voortgang")}
          className="col-span-2 lg:col-span-1 p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-center items-center cursor-pointer hover:border-[#D56B45]/40 hover:shadow-sm transition-all"
        >
          <LifeProgressBar 
            currentAge={currentAge} 
            projectedLifeExpectancy={projectedLifeExpectancy} 
            className="w-full"
          />
        </div>
      </div>

      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePopup(null)}
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
                  {popups[activePopup].title}
                </h3>
                <button
                  onClick={() => setActivePopup(null)}
                  className="p-1 -mr-2 -mt-2 bg-[#D56B45] text-white hover:bg-[#B84E29] rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-[#767676] leading-relaxed">
                {popups[activePopup].content}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
