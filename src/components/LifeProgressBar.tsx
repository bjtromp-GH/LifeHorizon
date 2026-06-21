import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface LifeProgressBarProps {
  currentAge: number;
  projectedLifeExpectancy: number;
  className?: string;
  hideLabels?: boolean;
}

export default function LifeProgressBar({ currentAge, projectedLifeExpectancy, className = "", hideLabels = false }: LifeProgressBarProps) {
  const { t } = useLanguage();
  const safeLife = Math.max(projectedLifeExpectancy, currentAge, 1);
  const percentage = Math.min(100, Math.max(0, (currentAge / safeLife) * 100));
  
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {!hideLabels && (
        <div className="flex justify-between items-end mb-2">
          <span className="text-xl sm:text-2xl font-black text-[#2D2D2D] font-mono tracking-tighter leading-none">
            {Math.round(percentage)}%
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#767676] font-semibold uppercase tracking-widest pb-0.5">
            {t('lifeProgress.completed')}
          </span>
        </div>
      )}
      
      <div className="h-3 sm:h-4 bg-[#F3F2F0] rounded-full overflow-hidden w-full relative shadow-inner">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-[#D56B45]"
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      {!hideLabels && (
        <div className="mt-4 text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-bold text-[#2D2D2D] tracking-tight">{t('lifeProgress.title')}</h4>
          <p 
            className="text-[10px] sm:text-[11px] text-[#767676] mt-1 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: t('lifeProgress.description')
                .replace('{{passed}}', Math.round(percentage).toString())
                .replace('{{remaining}}', (100 - Math.round(percentage)).toString())
            }}
          />
        </div>
      )}
    </div>
  );
}
