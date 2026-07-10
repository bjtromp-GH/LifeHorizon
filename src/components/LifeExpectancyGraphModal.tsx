import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp } from 'lucide-react';
import { UserInputs } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  cbsBaseLife: number;
  projectedLifeExpectancy: number;
}

export default function LifeExpectancyGraphModal({ isOpen, onClose, inputs, cbsBaseLife, projectedLifeExpectancy }: Props) {
  if (!isOpen) return null;

  // Generate data points for the simplified curve
  // We'll create a curve that starts at cbsBaseLife (at age 0)
  // And passes through projectedLifeExpectancy (at currentAge)
  // And flattens out around 90-100
  
  const points = [];
  const startY = cbsBaseLife;
  const currentX = inputs.currentAge;
  const currentY = projectedLifeExpectancy;
  
  // Calculate a simple quadratic/logarithmic curve
  for (let age = 0; age <= 90; age += 10) {
    let y = startY;
    if (age > 0) {
      if (currentX > 0) {
         // Simple interpolation that curves upwards
         const progress = age / currentX;
         if (age <= currentX) {
           y = startY + (currentY - startY) * Math.pow(progress, 0.8);
         } else {
           // Diminishing returns after current age
           const extra = (age - currentX) / 40; // 40 years to max
           y = currentY + (8 - (currentY - startY) * 0.1) * extra; 
         }
      } else {
         y = startY + age * 0.15;
      }
    }
    points.push({ x: age, y });
  }

  // Ensure current age is plotted exactly
  if (!points.find(p => p.x === currentX)) {
    points.push({ x: currentX, y: currentY });
    points.sort((a, b) => a.x - b.x);
  }

  // SVG dimensions
  const width = 300;
  const height = 200;
  const padding = { top: 40, right: 20, bottom: 30, left: 30 };
  
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  // Scales
  const minX = 0;
  const maxX = 90;
  const minY = Math.floor(startY / 5) * 5 - 5; // e.g. 65
  const maxY = Math.ceil(points[points.length - 1].y / 5) * 5 + 5; // e.g. 95

  const getX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * innerWidth;
  const getY = (val: number) => height - padding.bottom - ((val - minY) / (maxY - minY)) * innerHeight;

  // Path definition
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.x)} ${getY(p.y)}`).join(' ');
  const areaD = `${pathD} L ${getX(points[points.length-1].x)} ${getY(minY)} L ${getX(points[0].x)} ${getY(minY)} Z`;

  const birthPoint = points[0];
  const currentPoint = points.find(p => p.x === currentX) || points[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center px-5 py-4 border-b border-[#EAE8E4] bg-[#FDFCFB]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#84A98C]" />
              <h3 className="font-bold text-[#2D2D2D]">Levensverwachting Curve</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 pb-6">
            <p className="text-xs text-gray-500 mb-6 font-medium">
              Verwachte leeftijd bij overlijden voor een {inputs.gender === 'man' ? 'man' : 'vrouw'} geboren in {inputs.birthYear}.
            </p>

            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84A98C" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#84A98C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[minY, minY + 10, minY + 20, minY + 30].filter(y => y <= maxY).map(y => (
                  <g key={y}>
                    <line x1={padding.left} y1={getY(y)} x2={width - padding.right} y2={getY(y)} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={padding.left - 8} y={getY(y) + 4} fontSize="10" fill="#9CA3AF" textAnchor="end">{y}</text>
                  </g>
                ))}
                
                {/* X Axis labels */}
                {[0, 30, 60, 90].map(x => (
                  <text key={x} x={getX(x)} y={height - padding.bottom + 16} fontSize="10" fill="#9CA3AF" textAnchor="middle">{x} jr</text>
                ))}

                {/* Area and Line */}
                <path d={areaD} fill="url(#areaGradient)" />
                <path d={pathD} fill="none" stroke="#84A98C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Birth Point */}
                <circle cx={getX(birthPoint.x)} cy={getY(birthPoint.y)} r="4" fill="#2D2D2D" />
                <rect x={getX(birthPoint.x) - 5} y={getY(birthPoint.y) - 35} width="50" height="26" rx="4" fill="white" stroke="#EAE8E4" />
                <text x={getX(birthPoint.x) + 20} y={getY(birthPoint.y) - 25} fontSize="8" fill="#767676" textAnchor="middle">Geboorte</text>
                <text x={getX(birthPoint.x) + 20} y={getY(birthPoint.y) - 13} fontSize="10" fontWeight="bold" fill="#2D2D2D" textAnchor="middle">{birthPoint.y.toFixed(1)}</text>

                {/* Current Age Point */}
                <circle cx={getX(currentPoint.x)} cy={getY(currentPoint.y)} r="5" fill="#84A98C" stroke="white" strokeWidth="2" />
                <line x1={getX(currentPoint.x)} y1={getY(currentPoint.y)} x2={getX(currentPoint.x)} y2={height - padding.bottom} stroke="#84A98C" strokeWidth="1" strokeDasharray="4 4" />
                
                <rect x={getX(currentPoint.x) - 25} y={getY(currentPoint.y) - 35} width="50" height="26" rx="4" fill="#84A98C" />
                <text x={getX(currentPoint.x)} y={getY(currentPoint.y) - 25} fontSize="8" fill="white" textAnchor="middle">Jij nu</text>
                <text x={getX(currentPoint.x)} y={getY(currentPoint.y) - 13} fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">{currentPoint.y.toFixed(1)}</text>
              </svg>
            </div>

            <div className="mt-6 bg-[#84A98C]/10 border border-[#84A98C]/20 rounded-xl p-4 text-sm text-[#2D2D2D] leading-relaxed">
              <strong>Hoe ouder je wordt, hoe hoger je verwachte leeftijd!</strong> Omdat je de risico's van jongere leeftijden al hebt overleefd, stijgt je verwachte leeftijd bij overlijden naarmate je ouder wordt. Jouw keuzes voegen hier nog extra jaren aan toe!
            </div>
            
            <button onClick={onClose} className="w-full mt-4 py-3 bg-[#2D2D2D] text-white font-bold rounded-xl shadow-md hover:bg-black uppercase tracking-wider text-sm transition-all cursor-pointer">
              Begrepen
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
