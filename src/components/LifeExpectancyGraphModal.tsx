import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInputs } from '../types';
import { getHistoricalLifeExpectancyAtBirth } from '../api/cbs';
import { Info, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  cbsBaseLife: number; // CBS expectancy at CURRENT AGE
  projectedLifeExpectancy: number; // The final calculated life expectancy
}

export default function LifeExpectancyGraphModal({ isOpen, onClose, inputs, cbsBaseLife, projectedLifeExpectancy }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const currentAge = inputs.currentAge;
  const birthYear = inputs.birthYear;
  
  // 1. Calculate values
  const yBirth = getHistoricalLifeExpectancyAtBirth(birthYear, inputs.gender);
  const yNow = projectedLifeExpectancy;
  const difference = yNow - yBirth;

  // Generate points
  const points = useMemo(() => {
    const pts = [];
    const maxX = 90;
    
    // We add points for every 5 years for a smooth curve
    for (let age = 0; age <= maxX; age += 5) {
      let y = yBirth;
      if (age === 0) {
        y = yBirth;
      } else if (age === currentAge) {
        y = yNow;
      } else if (age < currentAge) {
        const progress = age / currentAge;
        // Exponential curve: starts slow, rises faster later
        y = yBirth + (yNow - yBirth) * Math.pow(progress, 2.5); 
      } else {
        const extra = age - currentAge;
        y = yNow + extra * 0.15; // Slow rise after current age
      }
      pts.push({ x: age, y });
    }

    // Ensure current age is precisely in the array
    if (!pts.find(p => p.x === currentAge)) {
      pts.push({ x: currentAge, y: yNow });
      pts.sort((a, b) => a.x - b.x);
    }
    return pts;
  }, [yBirth, yNow, currentAge]);

  const currentPoint = points.find(p => p.x === currentAge) || points[0];
  const birthPoint = points[0];
  
  // 2. SVG Setup
  const width = 360;
  const height = 280;
  // Make left padding smaller if needed, but 40 is good. We will draw a Y-axis line at x=0
  const padding = { top: 60, right: 90, bottom: 40, left: 40 };
  
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  // Scales
  const minX = 0;
  const maxX = 85; 
  const minY = 70; // Fixed as requested: 70, 75, 80, 85
  const maxY = 85;

  const getX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * innerWidth;
  const getY = (val: number) => {
    // clamp for drawing so it doesn't overflow
    const clampedVal = Math.max(minY, Math.min(maxY + 2, val));
    return height - padding.bottom - ((clampedVal - minY) / (maxY - minY)) * innerHeight;
  };

  // Draw smooth line
  let pathD = `M ${getX(points[0].x)} ${getY(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x <= maxX + 5) {
      pathD += ` L ${getX(points[i].x)} ${getY(points[i].y)}`;
    }
  }

  // Y-axis grid lines (70, 75, 80, 85)
  const yTicks = [70, 75, 80, 85];
  // X-axis labels: Geboorte, 20, 40, Nu, 60, 80
  const xTicks = [
    { val: 0, label: '0' },
    { val: 20, label: '20' },
    { val: 40, label: '40' },
    { val: currentAge, label: 'Nu' },
    { val: 60, label: '60' },
    { val: 80, label: '80' }
  ].filter(t => t.val <= maxX);

  // Colors
  const strokeColor = "#6E9E7A"; // Requested green
  const gridColor = "#E5E5EA"; // Apple Health light gray
  const textColor = "#8E8E93"; // Apple Health text gray
  const darkTextColor = "#1C1C1E";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] bg-white sm:bg-[#D56B45]/80 sm:backdrop-blur-sm flex justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 sm:flex-none w-full max-w-md sm:h-auto sm:max-h-[90vh] flex flex-col bg-white sm:rounded-2xl sm:shadow-2xl overflow-hidden"
          >
          {/* Header */}
          <div className="flex justify-between items-start px-4 py-4 pt-[calc(env(safe-area-inset-top)+16px)]">
            <h2 className="text-[20px] font-semibold text-[#1C1C1E] tracking-tight leading-snug">
              Je levensverwachting <br /> groeit mee
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <button 
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-[#8E8E93] hover:text-[#1C1C1E] transition-colors p-1"
              >
                <Info className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose} 
                className="text-[#6E9E7A] text-[17px] font-medium active:opacity-50 transition-opacity shrink-0"
              >
                Gereed
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pb-10">
            {/* Tooltip inline expansion */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="px-4 overflow-hidden"
                >
                  <div className="bg-[#F2F2F7] rounded-xl p-4 text-[14px] text-[#1C1C1E] leading-relaxed relative">
                    <button 
                      onClick={() => setShowTooltip(false)}
                      className="absolute top-2 right-2 p-1 text-[#8E8E93]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    De levensverwachting bij geboorte is een periodelevensverwachting. Naarmate je ouder wordt, stijgt je verwachte leeftijd bij overlijden omdat je eerdere sterfterisico's al hebt overleefd.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-4 pt-2 pb-6">
              <p className="text-[15px] text-[#8E8E93] leading-snug">
                Verwachte leeftijd bij overlijden voor een {inputs.gender === 'man' ? 'man' : 'vrouw'} geboren in {birthYear} in Nederland.
              </p>
            </div>

            {/* Chart Area */}
            <div className="w-full relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-sans">
                
                {/* Vertical Y-axis line at x=0 */}
                <line
                  x1={getX(0)}
                  y1={padding.top - 20}
                  x2={getX(0)}
                  y2={height - padding.bottom}
                  stroke={gridColor}
                  strokeWidth="1"
                />

                {/* Horizontal Grid Lines & Y-axis labels */}
                {yTicks.map(y => (
                  <g key={`y-${y}`}>
                    <line 
                      x1={padding.left} 
                      y1={getY(y)} 
                      x2={width - padding.right + 20} 
                      y2={getY(y)} 
                      stroke={gridColor} 
                      strokeWidth="1" 
                    />
                    <text 
                      x={padding.left - 8} 
                      y={getY(y) + 4} 
                      fontSize="11" 
                      fill={textColor} 
                      textAnchor="end"
                    >
                      {y}
                    </text>
                  </g>
                ))}

                {/* Vertical Guideline for Current Age */}
                <line 
                  x1={getX(currentPoint.x)} 
                  y1={padding.top - 10} 
                  x2={getX(currentPoint.x)} 
                  y2={height - padding.bottom} 
                  stroke={strokeColor} 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />

                {/* Data Line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke={strokeColor} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Highlight Point (Current Age) */}
                <circle 
                  cx={getX(currentPoint.x)} 
                  cy={getY(currentPoint.y)} 
                  r="5" 
                  fill={strokeColor} 
                />

                {/* X-axis labels */}
                {xTicks.map(t => {
                  // Prevent overlapping if Nu is too close to 20, 40, 60
                  const isNu = t.label === 'Nu';
                  const closeToNu = !isNu && Math.abs(t.val - currentAge) < 10;
                  if (closeToNu) return null; // Hide grid label if it overlaps with Nu

                  return (
                    <text 
                      key={`x-${t.label}`} 
                      x={getX(t.val)} 
                      y={height - padding.bottom + 18} 
                      fontSize="11" 
                      fill={isNu ? strokeColor : textColor} 
                      fontWeight={isNu ? "600" : "400"}
                      textAnchor={t.val === 0 ? "start" : "middle"}
                    >
                      {t.label}
                    </text>
                  );
                })}

                {/* Current Age Highlight Label */}
                <g transform={`translate(${getX(currentPoint.x)}, ${padding.top - 20})`}>
                  <rect x="-38" y="-35" width="76" height="62" rx="8" fill="white" stroke={strokeColor} strokeWidth="1.5" />
                  <text x="0" y="-18" fontSize="11" fill={textColor} textAnchor="middle">Jij nu</text>
                  <text x="0" y="0" fontSize="14" fontWeight="700" fill={strokeColor} textAnchor="middle">{currentAge} jaar</text>
                  <line x1="-25" y1="8" x2="25" y2="8" stroke={gridColor} strokeWidth="1" />
                  <text x="0" y="21" fontSize="12" fontWeight="600" fill={strokeColor} textAnchor="middle">{yNow.toFixed(1).replace('.', ',')}</text>
                </g>

                {/* Highlight Point (Birth) */}
                <circle 
                  cx={getX(0)} 
                  cy={getY(birthPoint.y)} 
                  r="4" 
                  fill="white"
                  stroke={strokeColor}
                  strokeWidth="2"
                />

                {/* Label Left (At Birth) */}
                <g transform={`translate(${getX(0)}, ${getY(birthPoint.y) - 25})`}>
                  <rect x="-35" y="-20" width="70" height="36" rx="6" fill="white" stroke={strokeColor} strokeWidth="1" />
                  <text x="0" y="-7" fontSize="10" fill={textColor} textAnchor="middle">Bij geboorte</text>
                  <text x="0" y="8" fontSize="12" fontWeight="600" fill={strokeColor} textAnchor="middle">{yBirth.toFixed(1).replace('.', ',')} jaar</text>
                </g>

                {/* Right Arrow Label for Difference */}
                <g transform={`translate(${width - padding.right + 4}, ${getY(yNow)})`}>
                  {/* Vertical dashed arrow showing increase */}
                  <line x1="0" y1="0" x2="0" y2={getY(yBirth) - getY(yNow)} stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" />
                  {/* Arrow heads */}
                  <polyline points="-3,3 0,0 3,3" fill="none" stroke={strokeColor} strokeWidth="1.5" />
                  <polyline points={`-3,${getY(yBirth) - getY(yNow) - 3} 0,${getY(yBirth) - getY(yNow)} 3,${getY(yBirth) - getY(yNow) - 3}`} fill="none" stroke={strokeColor} strokeWidth="1.5" />
                  
                  <rect x="5" y={(getY(yBirth) - getY(yNow)) / 2 - 28} width="75" height="56" rx="8" fill="white" stroke={strokeColor} strokeWidth="1.5" />
                  <text x="42" y={(getY(yBirth) - getY(yNow)) / 2 - 10} fontSize="12" fontWeight="700" fill={strokeColor} textAnchor="middle">+{difference.toFixed(1).replace('.', ',')} jaar</text>
                  <text x="42" y={(getY(yBirth) - getY(yNow)) / 2 + 6} fontSize="9" fill={textColor} textAnchor="middle">sinds je</text>
                  <text x="42" y={(getY(yBirth) - getY(yNow)) / 2 + 18} fontSize="9" fill={textColor} textAnchor="middle">geboorte</text>
                </g>

              </svg>
            </div>

            {/* Explanation Text */}
            <div className="px-4 mt-8">
              <p className="text-[15px] text-[#1C1C1E] leading-relaxed">
                Je statistische levensverwachting neemt toe naarmate je ouder wordt, omdat je de grootste sterfterisico's van eerdere levensjaren al hebt overleefd.
              </p>
            </div>

            {/* Source Info */}
            <div className="px-4 mt-8 mb-8 space-y-1">
              <p className="text-[11px] text-[#8E8E93]">
                Bron: CBS – Periodelevensverwachting Nederland en actuele sterftetafels.
              </p>
              <p className="text-[11px] text-[#8E8E93]">
                Illustratieve visualisatie gebaseerd op CBS-gegevens.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
