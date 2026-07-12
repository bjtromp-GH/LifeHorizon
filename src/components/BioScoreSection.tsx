import { useState } from "react";
import { ActivityLevel, BioScoreAnswers, SleepLevel, StressLevel } from "../types";
import NumberTicker from "./NumberTicker";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface BioScoreSectionProps {
  answers: BioScoreAnswers;
  onChange: (updates: Partial<BioScoreAnswers>) => void;
}

export default function BioScoreSection({ answers, onChange }: BioScoreSectionProps) {
  const { t } = useLanguage();
  const [activeToast, setActiveToast] = useState<{ id: string; category: string; optValue: string; text: string } | null>(null);

  const handleSelect = (category: keyof BioScoreAnswers, value: string, offset: number) => {
    onChange({ [category]: value } as any);
    const sign = offset > 0 ? "+" : "";
    const text = `${sign}${offset.toFixed(1).replace('.', ',')} jr`;
    setActiveToast({ id: Date.now().toString(), category, optValue: value, text });
    setTimeout(() => setActiveToast(null), 1500);
  };

  // Option lists with labels, years, description
  const activityOptions: { value: ActivityLevel; label: string; offset: number; desc: string }[] = [
    { value: "zittend", label: t('bioScore.activity.sedentary.label'), offset: -2.0, desc: t('bioScore.activity.sedentary.desc') },
    { value: "licht", label: t('bioScore.activity.light.label'), offset: 0.0, desc: t('bioScore.activity.light.desc') },
    { value: "actief", label: t('bioScore.activity.active.label'), offset: 1.0, desc: t('bioScore.activity.active.desc') },
    { value: "optimaal", label: t('bioScore.activity.optimal.label'), offset: 2.0, desc: t('bioScore.activity.optimal.desc') },
  ];

  const sleepOptions: { value: SleepLevel; label: string; offset: number; desc: string }[] = [
    { value: "kort", label: t('bioScore.sleep.short.label'), offset: -1.5, desc: t('bioScore.sleep.short.desc') },
    { value: "matig", label: t('bioScore.sleep.moderate.label'), offset: -0.5, desc: t('bioScore.sleep.moderate.desc') },
    { value: "goed", label: t('bioScore.sleep.good.label'), offset: 0.5, desc: t('bioScore.sleep.good.desc') },
    { value: "optimaal", label: t('bioScore.sleep.optimal.label'), offset: 1.5, desc: t('bioScore.sleep.optimal.desc') },
  ];

  const stressOptions: { value: StressLevel; label: string; offset: number; desc: string }[] = [
    { value: "hoog", label: t('bioScore.stress.high.label'), offset: -1.5, desc: t('bioScore.stress.high.desc') },
    { value: "gemiddeld", label: t('bioScore.stress.moderate.label'), offset: -0.5, desc: t('bioScore.stress.moderate.desc') },
    { value: "balans", label: t('bioScore.stress.balanced.label'), offset: 0.5, desc: t('bioScore.stress.balanced.desc') },
    { value: "laag", label: t('bioScore.stress.low.label'), offset: 1.5, desc: t('bioScore.stress.low.desc') },
  ];

  // Calculate cumulative local score
  const totalOffset =
    (activityOptions.find((o) => o.value === answers.activity)?.offset || 0) +
    (sleepOptions.find((o) => o.value === answers.sleep)?.offset || 0) +
    (stressOptions.find((o) => o.value === answers.stress)?.offset || 0);

  return (
    <div id="bioscore-section" className="flex flex-col space-y-6">
      {/* Header with live feedback in Terracotta */}
      <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div>
          <h3 className="font-sans font-medium text-sm text-[#2D2D2D] uppercase tracking-wide">
            {t('bioScore.title')}
          </h3>
          <p className="text-[11px] text-[#767676]">
            {t('bioScore.subtitle')}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider text-[#767676] font-mono leading-none">
            {t('bioScore.netEffect')}
          </span>
          <NumberTicker
            value={totalOffset}
            decimals={1}
            duration={1}
            prefix={totalOffset >= 0 ? "+" : ""}
            suffix={` ${t('bioScore.years')}`}
            className={`text-base font-bold font-mono mt-1 ${
              totalOffset > 0 ? "text-[#D56B45]" : totalOffset < 0 ? "text-amber-700" : "text-[#767676]"
            }`}
          />
        </div>
      </div>

      {/* 1. Beweging (Movement) */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          {t('bioScore.activity.title')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activityOptions.map((opt) => {
            const isSelected = answers.activity === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`btn-activity-${opt.value}`}
                onClick={() => handleSelect('activity', opt.value, opt.offset)}
                className={`relative flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <AnimatePresence>
                  {activeToast?.category === 'activity' && activeToast.optValue === opt.value && (
                    <motion.div
                      key={activeToast.id}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute right-4 -top-2 pointer-events-none z-10"
                    >
                      <span className={`text-sm font-black font-mono drop-shadow-md ${opt.offset > 0 ? "text-[#D56B45]" : opt.offset < 0 ? "text-amber-700" : "text-zinc-500"}`}>
                        {activeToast.text}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-sm text-[#2D2D2D]">{opt.label}</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                      opt.offset > 0
                        ? "text-[#D56B45] bg-[#D56B45]/10"
                        : opt.offset < 0
                        ? "text-amber-800 bg-amber-50"
                        : "text-zinc-500 bg-zinc-100"
                    }`}
                  >
                    {opt.offset >= 0 ? `+${opt.offset}` : opt.offset} jr
                  </span>
                </div>
                <span className="text-[11px] text-[#767676] mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slaap (Sleep) */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          {t('bioScore.sleep.title')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sleepOptions.map((opt) => {
            const isSelected = answers.sleep === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`btn-sleep-${opt.value}`}
                onClick={() => handleSelect('sleep', opt.value, opt.offset)}
                className={`relative flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <AnimatePresence>
                  {activeToast?.category === 'sleep' && activeToast.optValue === opt.value && (
                    <motion.div
                      key={activeToast.id}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute right-4 -top-2 pointer-events-none z-10"
                    >
                      <span className={`text-sm font-black font-mono drop-shadow-md ${opt.offset > 0 ? "text-[#D56B45]" : opt.offset < 0 ? "text-amber-700" : "text-zinc-500"}`}>
                        {activeToast.text}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-sm text-[#2D2D2D]">{opt.label}</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                      opt.offset > 0
                        ? "text-[#D56B45] bg-[#D56B45]/10"
                        : opt.offset < 0
                        ? "text-amber-800 bg-amber-50"
                        : "text-zinc-500 bg-zinc-100"
                    }`}
                  >
                    {opt.offset >= 0 ? `+${opt.offset}` : opt.offset} jr
                  </span>
                </div>
                <span className="text-[11px] text-[#767676] mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Stress */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          {t('bioScore.stress.title')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stressOptions.map((opt) => {
            const isSelected = answers.stress === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`btn-stress-${opt.value}`}
                onClick={() => handleSelect('stress', opt.value, opt.offset)}
                className={`relative flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <AnimatePresence>
                  {activeToast?.category === 'stress' && activeToast.optValue === opt.value && (
                    <motion.div
                      key={activeToast.id}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute right-4 -top-2 pointer-events-none z-10"
                    >
                      <span className={`text-sm font-black font-mono drop-shadow-md ${opt.offset > 0 ? "text-[#D56B45]" : opt.offset < 0 ? "text-amber-700" : "text-zinc-500"}`}>
                        {activeToast.text}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-sm text-[#2D2D2D]">{opt.label}</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                      opt.offset > 0
                        ? "text-[#D56B45] bg-[#D56B45]/10"
                        : opt.offset < 0
                        ? "text-amber-800 bg-amber-50"
                        : "text-zinc-500 bg-zinc-100"
                    }`}
                  >
                    {opt.offset >= 0 ? `+${opt.offset}` : opt.offset} jr
                  </span>
                </div>
                <span className="text-[11px] text-[#767676] mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export function getBioScoreOffset(answers: BioScoreAnswers): number {
  const movementMap = { zittend: -2.0, licht: 0.0, actief: 1.0, optimaal: 2.0 };
  const sleepMap = { kort: -1.5, matig: -0.5, goed: 0.5, optimaal: 1.5 };
  const stressMap = { hoog: -1.5, gemiddeld: -0.5, balans: 0.5, laag: 1.5 };
  const smokerMap = { nee: 0.0, ja: -5.0 };
  const alcoholMap = { geen_af_en_toe: 0.5, regelmatig: -1.5 };
  const dietMap = { gezond: 1.5, gemiddeld: -0.5 };

  return movementMap[answers.activity] + sleepMap[answers.sleep] + stressMap[answers.stress] + smokerMap[answers.smoker] + alcoholMap[answers.alcohol] + dietMap[answers.diet];
}
