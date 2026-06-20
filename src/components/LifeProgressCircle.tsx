import { motion } from "motion/react";

interface LifeProgressCircleProps {
  currentAge: number;
  projectedLifeExpectancy: number;
  className?: string;
}

export default function LifeProgressCircle({ currentAge, projectedLifeExpectancy, className = "" }: LifeProgressCircleProps) {
  const safeLife = Math.max(projectedLifeExpectancy, currentAge, 1);
  const percentage = Math.min(100, Math.max(0, (currentAge / safeLife) * 100));
  
  const r = 15.91549431; // Circumference = 100
  const dashArray = `${percentage} ${100 - percentage}`;
  
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative w-full aspect-square flex items-center justify-center">
        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90 overflow-visible drop-shadow-sm">
          {/* Background Circle */}
          <circle 
            cx="21" cy="21" r={r} 
            fill="transparent" 
            stroke="#F3F2F0" 
            strokeWidth="5" 
          />
          {/* Progress Circle */}
          <motion.circle 
            cx="21" cy="21" r={r} 
            fill="transparent" 
            stroke="#D56B45" 
            strokeWidth="5" 
            strokeDasharray={dashArray}
            strokeDashoffset="0"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 100` }}
            animate={{ strokeDasharray: dashArray }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-black text-[#2D2D2D] font-mono tracking-tighter">
            {Math.round(percentage)}%
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#767676] font-semibold uppercase tracking-widest mt-0.5">
            Voltooid
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-xs sm:text-sm font-bold text-[#2D2D2D] tracking-tight">Levensvoortgang</h4>
        <p className="text-[10px] sm:text-[11px] text-[#767676] mt-1 leading-relaxed">
          Je hebt al <strong className="text-[#D56B45]">{Math.round(percentage)}%</strong> van je voorspelde leven achter de rug. 
          Maak het beste van de resterende <strong className="text-[#D56B45]">{100 - Math.round(percentage)}%</strong>.
        </p>
      </div>
    </div>
  );
}
