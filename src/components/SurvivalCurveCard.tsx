import React from 'react';
import { motion } from 'motion/react';
import { UserInputs } from '../types';
import { Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
}

export default function SurvivalCurveCard({ inputs, projectedLifeExpectancy }: Props) {
  const { t } = useLanguage();
  
  const currentAge = inputs.currentAge;
  // Mathematical model for survival curve (Gompertz-Makeham approximation)
  const L = Math.max(projectedLifeExpectancy, currentAge + 2); 
  const B = 0.085;
  const A = (B * Math.LN2) / (Math.exp(B * L) - 1);
  const S = (t: number) => Math.exp(-(A / B) * (Math.exp(B * t) - 1));
  const S_current = S(currentAge);
  
  const getProb = (age: number) => {
    if (age <= currentAge) return 100;
    if (age >= 120) return 0;
    const prob = (S(age) / S_current) * 100;
    return Math.max(0, Math.min(100, prob));
  };

  const endAge = 120;
  
  // Create SVG path
  let pathD = `M 0 100`;
  for (let age = currentAge; age <= endAge; age++) {
    const x = ((age - currentAge) / (endAge - currentAge)) * 100;
    const y = 100 - getProb(age); // 0 is top, 100 is bottom in SVG viewBox 0 0 100 100
    pathD += ` L ${x} ${y}`;
  }
  
  // Points to highlight
  const highlightAges = [68, 90, 100].filter(a => a > currentAge);
  if (!highlightAges.includes(68) && inputs.fireAge > currentAge) {
      highlightAges.unshift(inputs.fireAge); // Add fire age if 68 is already passed
  }

  // Helper to format prob
  const formatProb = (p: number) => (p < 1 ? p.toFixed(1) : Math.round(p * 10) / 10);

  const genderStr = inputs.gender === "man" ? t('common.man') || "man" : t('common.woman') || "vrouw";
  const title = t('dashboard.survivalCurveTitle') || `Kans voor een ${genderStr} van ${currentAge} jaar om te leven tot...`;

  return (
    <div className="bg-white p-4 rounded-xl border border-[#EAEAEA] shadow-3xs space-y-4">
      <div className="flex items-center space-x-2">
        <Activity className="w-4 h-4 text-[#D56B45]" />
        <h3 className="font-bold text-[#2D2D2D] text-sm leading-tight tracking-tight">
          {title}
        </h3>
      </div>
      
      {/* Highlight Stats */}
      <div className="flex justify-between items-end px-1 pt-2">
        {highlightAges.map((age, i) => {
          const prob = getProb(age);
          const colors = ['text-[#D56B45]', 'text-[#86A789]', 'text-[#2D2D2D]'];
          const dots = ['bg-[#D56B45]', 'bg-[#86A789]', 'bg-[#2D2D2D]'];
          const color = colors[i % colors.length];
          const dot = dots[i % dots.length];
          return (
            <div key={age} className="flex flex-col items-center">
              <div className="flex items-center space-x-1.5 mb-1">
                <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? 'border-[#D56B45] bg-white' : dot} box-content`} />
                <span className={`text-xl sm:text-2xl font-black font-sans ${color}`}>{age}</span>
                <span className={`text-xs font-bold ${color}`}>jaar</span>
              </div>
              <span className={`text-sm ${color} opacity-80 font-medium`}>{formatProb(prob)}% kans</span>
            </div>
          );
        })}
      </div>

      {/* Chart Area */}
      <div className="relative w-[calc(100%-1.5rem)] h-40 mt-6 ml-6 pt-2 border-l border-b border-[#EAEAEA]">
        {/* Y-axis labels */}
        <div className="absolute right-full pr-1.5 top-[100%] text-[10px] text-[#767676] -translate-y-1/2">0</div>
        <div className="absolute right-full pr-1.5 top-[50%] text-[10px] text-[#767676] -translate-y-1/2">50</div>
        <div className="absolute right-full pr-1.5 top-[0%] text-[10px] text-[#767676] -translate-y-1/2">100</div>

        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* 50% line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#EAEAEA" strokeWidth="0.5" strokeDasharray="2" vectorEffect="non-scaling-stroke" />
          
          {/* Average Life Expectancy Line (Vertical) */}
          {projectedLifeExpectancy > currentAge && projectedLifeExpectancy <= endAge && (
            <line 
              x1={((projectedLifeExpectancy - currentAge) / (endAge - currentAge)) * 100} 
              y1="0" 
              x2={((projectedLifeExpectancy - currentAge) / (endAge - currentAge)) * 100} 
              y2="100" 
              stroke="#D56B45" 
              strokeWidth="0.5" 
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Fill Area up to Average Life Expectancy */}
          {projectedLifeExpectancy > currentAge && projectedLifeExpectancy <= endAge && (
            <path
              d={`${pathD} L 100 100 L 0 100 Z`} // Full area under curve
              fill="#EAEAEA"
              opacity="0.5"
              // Clip path to only fill up to projectedLifeExpectancy
              clipPath="url(#fillClip)"
            />
          )}
          <clipPath id="fillClip">
            <rect x="0" y="0" width={((projectedLifeExpectancy - currentAge) / (endAge - currentAge)) * 100} height="100" />
          </clipPath>

          {/* The Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#111"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Highlight Points as Perfectly Round HTML Divs */}
        {highlightAges.map((age, i) => {
          const prob = getProb(age);
          const x = ((age - currentAge) / (endAge - currentAge)) * 100;
          const y = 100 - prob;
          const dots = ['bg-white border-[#D56B45]', 'bg-[#86A789] border-[#86A789]', 'bg-[#2D2D2D] border-[#2D2D2D]'];
          const styleClasses = dots[i % dots.length];
          return (
            <div 
              key={`pt-${age}`}
              className={`absolute w-3 h-3 rounded-full border-[2.5px] -translate-x-1/2 -translate-y-1/2 shadow-sm ${styleClasses}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}

        {/* X-axis labels */}
        <div className="absolute -bottom-5 left-0 w-full flex justify-between text-[10px] text-[#767676]">
          {[50, 60, 70, 80, 90, 100, 110, 120].filter(a => a >= currentAge).map(a => {
            const left = ((a - currentAge) / (endAge - currentAge)) * 100;
            return (
              <span key={a} className="absolute -translate-x-1/2" style={{ left: `${left}%` }}>{a}</span>
            );
          })}
        </div>

        {/* Average Life Expectancy Label */}
        {projectedLifeExpectancy > currentAge && projectedLifeExpectancy <= endAge && (
          <div 
            className="absolute top-1 text-[10px] leading-tight flex flex-col pointer-events-none"
            style={{ 
              left: `calc(${((projectedLifeExpectancy - currentAge) / (endAge - currentAge)) * 100}% + 4px)` 
            }}
          >
            <span className="font-bold text-[#D56B45]">{Math.round(projectedLifeExpectancy)} jaar</span>
            <span className="text-[#D56B45] opacity-80">Verwachte<br/>levensduur</span>
          </div>
        )}
        
        {/* Pension age label (if 68 is first highlight) */}
        {highlightAges[0] === 68 && (
          <div 
            className="absolute text-[10px] leading-tight flex flex-col items-center pointer-events-none -translate-x-1/2 text-[#D56B45]"
            style={{ 
              left: `${((68 - currentAge) / (endAge - currentAge)) * 100}%`,
              top: `calc(${100 - getProb(68)}% + 10px)`
            }}
          >
            <span className="font-bold">68 jaar</span>
            <span className="opacity-80 text-center">AOW<br/>leeftijd</span>
          </div>
        )}

      </div>
      <div className="text-right text-[10px] text-[#767676] pt-5 -mb-2">Leeftijd</div>
    </div>
  );
}
