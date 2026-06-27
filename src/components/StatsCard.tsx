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
        <motion.div 
          onClick={() => setActivePopup("prognose")}
          className="relative overflow-hidden p-4 rounded-md flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group bg-white border border-[#EAEAEA]"
        >
          <motion.div 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-[#2D2D2D]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="relative z-10 flex flex-col h-full"
          >
            <div className="flex items-start justify-between min-h-[32px]">
              <span className="text-[11px] uppercase tracking-wider text-white/90 font-bold leading-tight">
                {t('statsCard.popups.prognosisTitle')}
              </span>
              <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
            </div>
            <div className="mt-2.5 flex-1">
              <span id="stat-life-expectancy" className="text-3xl font-bold text-white font-mono tracking-tight">
                {lifeVal}
              </span>
              <span className="text-xs text-white/80 ml-1 font-sans">{t('statsCard.years')}</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col items-center justify-center text-center gap-1.5 text-[11px] text-white/80">
              <span className="font-medium">{t('statsCard.calibratedWith')}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded font-sans text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-white border border-white/20 whitespace-nowrap">
                {apiSource}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* 2. Resterende Levensduur */}
        <motion.div 
          onClick={() => setActivePopup("resterend")}
          className="relative overflow-hidden p-4 rounded-md flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group bg-white border border-[#EAEAEA]"
        >
          <motion.div 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 bg-[#D56B45]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="relative z-10 flex flex-col h-full"
          >
            <div className="flex items-start justify-between min-h-[32px]">
              <span className="text-[11px] uppercase tracking-wider text-white/90 font-bold leading-tight">
                {t('statsCard.popups.remainingTitle')}
              </span>
              <Hourglass className="w-4 h-4 text-white shrink-0 mt-0.5" />
            </div>
            <div className="mt-2.5 flex-1">
              <span id="stat-remaining-years" className="text-3xl font-bold text-white font-mono tracking-tight">
                {remValue}
              </span>
              <span className="text-xs text-white/80 ml-1 font-sans">{t('statsCard.years')}</span>
            </div>
            <p className="text-[11px] text-white/80 mt-1 select-none leading-tight pt-2 border-t border-transparent">
              {t('statsCard.remainingBudget')}
            </p>
          </motion.div>
        </motion.div>

        {/* 3. Nog Werken tot Pensioen */}
        <motion.div 
          onClick={() => setActivePopup("werkend")}
          className="relative overflow-hidden p-4 rounded-md flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group bg-white border border-[#EAEAEA]"
        >
          <motion.div 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.7 }}
            className="absolute bottom-0 left-0 right-0 bg-[#D56B45]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="relative z-10 flex flex-col h-full"
          >
            <div className="flex items-start justify-between min-h-[32px]">
              <span className="text-[11px] uppercase tracking-wider text-white/90 font-bold leading-tight">
                {t('statsCard.popups.workingTitle')}
              </span>
              <Workflow className="w-4 h-4 text-white shrink-0 mt-0.5" />
            </div>
            <div className="mt-2.5 flex-1">
              <span id="stat-working-years" className="text-3xl font-bold text-white font-mono tracking-tight">
                {workValue}
              </span>
              <span className="text-xs text-white/80 ml-1 font-sans">{t('statsCard.years')}</span>
            </div>
            <span className="text-[11px] text-white/80 mt-1 leading-tight pt-2 border-t border-transparent">
              {currentAge >= fireAge
                ? t('statsCard.freedomAchieved')
                : t('statsCard.phaseEndsAt').replace('{{age}}', fireAge.toString())}
            </span>
          </motion.div>
        </motion.div>

        {/* 4. Totaal Vrijheid in Jaren */}
        <motion.div 
          onClick={() => setActivePopup("vrijheid")}
          className="relative overflow-hidden p-4 rounded-md flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group bg-white border border-[#EAEAEA]"
        >
          <motion.div 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.9 }}
            className="absolute bottom-0 left-0 right-0 bg-[#D56B45]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="relative z-10 flex flex-col h-full"
          >
            <div className="flex items-start justify-between min-h-[32px]">
              <span className="text-[11px] uppercase tracking-wider text-white/90 font-bold leading-tight">
                {t('statsCard.popups.freedomTitle')}
              </span>
              <Sun className="w-4 h-4 text-white shrink-0 mt-0.5" />
            </div>
            <div className="mt-2.5 flex-1">
              <span id="stat-freedom-years" className="text-3xl font-bold text-white font-mono tracking-tight">
                {freeValue}
              </span>
              <span className="text-xs text-white/80 ml-1">{t('statsCard.years')}</span>
            </div>
            <span className="text-[11px] text-white/80 mt-1 leading-tight pt-2 border-t border-transparent">
              {t('statsCard.harvestPhase')}
            </span>
          </motion.div>
        </motion.div>

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
