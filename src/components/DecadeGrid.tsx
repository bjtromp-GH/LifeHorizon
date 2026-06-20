import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { UserInputs } from "../types";

interface DecadeGridProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
}

export default function DecadeGrid({
  inputs,
  projectedLifeExpectancy,
}: DecadeGridProps) {
  const { currentAge, startWorkAge, fireAge } = inputs;
  const [isCurrentAgeModalOpen, setIsCurrentAgeModalOpen] = useState(false);
  const [isAnalyseModalOpen, setIsAnalyseModalOpen] = useState(false);
  
  // Total years in the runway (e.g. 82 years = 82 boxes)
  const totalYears = Math.max(1, Math.ceil(projectedLifeExpectancy));

  // Determine which phase a given year falls into
  const getYearPhase = (year: number): "basis" | "accumulation" | "freedom" | "beyond" => {
    if (year < startWorkAge) return "basis";
    if (year < fireAge) return "accumulation";
    if (year < totalYears) return "freedom";
    return "beyond";
  };

  // Organize years into decades (rows of 10 items)
  const decadesCount = Math.ceil(totalYears / 10);
  const decadesArray = Array.from({ length: decadesCount }, (_, i) => i);

  return (
    <div id="decade-grid-container" className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#767676]">
          Levensmatrix
        </h4>
        <div className="flex items-center space-x-3 text-[10px] text-[#767676] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#EAE8E4]" /> Ontwikkeling
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C8C5C0]" /> Werk
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#D56B45]/20 border border-[#D56B45]/30" /> Vrijheid
          </span>
        </div>
      </div>

      {/* Main Grid Card wrapper - borderless and transparent on mobile to support clean layout, with hidden scrollbar */}
      <div className="p-0 sm:p-5 bg-transparent sm:bg-white border-none sm:border sm:border-[#EAEAEA] sm:rounded-md shadow-none sm:shadow-3xs">
        <div className="flex flex-col space-y-2.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {decadesArray.map((decadeIndex) => {
            const startYearOfDecade = decadeIndex * 10;
            const yearsInThisDecade = Array.from({ length: 10 }, (_, i) => startYearOfDecade + i).filter(
              (y) => y < totalYears
            );

            return (
              <div key={decadeIndex} className="flex items-center space-x-3 min-w-[280px]">
                {/* Decade indicator label on the left */}
                <div className="w-10 text-right text-[11px] font-mono tracking-tight text-[#767676] select-none">
                  {startYearOfDecade} jr
                </div>

                {/* Grid row containing 10 column items representing years */}
                <div className="flex items-center gap-1.5 flex-1">
                  {yearsInThisDecade.map((year) => {
                    const phase = getYearPhase(year);
                    const isCurrentYear = year === currentAge;
                    const isPast = year < currentAge;

                    // Styles corresponding to phases
                    let bgStyle = "";
                    let borderStyle = "border-transparent";

                    if (phase === "basis") {
                      bgStyle = isPast ? "bg-[#EAE8E4]" : "bg-[#F3F1ED]";
                    } else if (phase === "accumulation") {
                      bgStyle = isPast ? "bg-[#C8C5C0]" : "bg-[#E6E4E0]";
                    } else {
                      // Freedom / Retirement phase
                      bgStyle = isPast ? "bg-[#D56B45]/35" : "bg-[#D56B45]/15";
                      borderStyle = "border-[#D56B45]/20";
                    }

                    return (
                      <motion.div
                        key={year}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: year * 0.015,
                          ease: "easeOut"
                        }}
                        className="relative group flex-1"
                        style={{ aspectRatio: "1/1" }}
                      >
                        {isCurrentYear ? (
                          // Pulse animation wrapper for current year
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            onClick={() => setIsCurrentAgeModalOpen(true)}
                            className="absolute inset-0 z-10 w-full h-full rounded-[3px] bg-[#D56B45] shadow-xs flex items-center justify-center border border-white cursor-pointer hover:scale-110"
                          >
                            <span className="text-[11px] md:text-xs font-black text-white leading-none select-none">
                              {year}
                            </span>
                          </motion.div>
                        ) : (
                          <div
                            className={`w-full h-full rounded-[3px] transition-all duration-300 border ${borderStyle} ${bgStyle} hover:border-[#D56B45]/70 flex items-center justify-center cursor-default group/box`}
                          >
                            {/* Age label always visible but subtle, gets slightly larger and high contrast on hover */}
                            <span className="text-[9px] md:text-[10px] font-mono text-[#2D2D2D]/45 group-hover/box:text-[#D56B45] group-hover/box:font-extrabold group-hover/box:scale-110 transition-all duration-150 select-none font-medium">
                              {year}
                            </span>
                          </div>
                        )}

                        {/* Custom Mini Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-1.5 hidden group-hover:block z-20 pointer-events-none">
                          <div className="bg-[#2D2D2D] text-[#FAF9F8] text-[9.5px] px-2 py-0.5 rounded shadow-lg font-mono whitespace-nowrap leading-none">
                            yr {year}: {phase === "basis" ? "Ontwikkeling" : phase === "accumulation" ? "Accumulatie" : "Vrijheid"}
                            {isCurrentYear && " (Huidige leeftijd!)"}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Pad row if it has fewer than 10 blocks (the very last decade) */}
                  {yearsInThisDecade.length < 10 &&
                    Array.from({ length: 10 - yearsInThisDecade.length }).map((_, i) => {
                      const padYear = (yearsInThisDecade[yearsInThisDecade.length - 1] || startYearOfDecade) + i + 1;
                      return (
                        <motion.div
                          key={`pad-${i}`}
                          initial={{ opacity: 0, scale: 0.5, y: 10 }}
                          animate={{ opacity: 0.3, scale: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: padYear * 0.015,
                            ease: "easeOut"
                          }}
                          className="flex-1 border border-dashed border-gray-200 bg-transparent"
                          style={{ aspectRatio: "1/1" }}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={() => setIsAnalyseModalOpen(true)}
          className="px-4 py-2 bg-[#FAF3F0] text-[#D56B45] text-xs font-bold rounded-md border border-[#D56B45]/20 hover:bg-[#D56B45] hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
        >
          Levensmatrix Analyse
        </button>
      </div>

      <AnimatePresence>
        {isCurrentAgeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCurrentAgeModalOpen(false)}
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
                  Jouw Huidige Positie
                </h3>
                <button
                  onClick={() => setIsCurrentAgeModalOpen(false)}
                  className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-[#767676] leading-relaxed">
                Je bevindt je nu hier in de levensmatrix! Dit blokje markeert jouw huidige leeftijd. De kleur geeft aan in welke fase van je leven je je momenteel bevindt: Ontwikkeling, Accumulatie of Vrijheid.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAnalyseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAnalyseModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-lg font-bold text-[#2D2D2D] tracking-tight">
                  Levensmatrix Analyse
                </h3>
                <button
                  onClick={() => setIsAnalyseModalOpen(false)}
                  className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Animated Bars */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#767676] mb-1 uppercase tracking-wider">
                    <span>Ontwikkeling</span>
                    <span>{startWorkAge} jr ({(startWorkAge / totalYears * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-[#F3F1ED] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(startWorkAge / totalYears) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#D56B45]/40"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#767676] mb-1 uppercase tracking-wider">
                    <span>Werk</span>
                    <span>{fireAge - startWorkAge} jr ({((fireAge - startWorkAge) / totalYears * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-[#E6E4E0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((fireAge - startWorkAge) / totalYears) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full bg-[#D56B45]/70"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#D56B45] mb-1 uppercase tracking-wider">
                    <span>Vrijheid</span>
                    <span>{totalYears - fireAge} jr ({((totalYears - fireAge) / totalYears * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-[#D56B45]/15 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((totalYears - fireAge) / totalYears) * 100}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                      className="h-full bg-[#D56B45]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF9F8] p-4 rounded-lg text-sm text-[#767676] leading-relaxed border border-[#EAE8E4]">
                <p>
                  Uit deze analyse blijkt dat <strong>{((totalYears - fireAge) / totalYears * 100).toFixed(0)}%</strong> van je 
                  geprognotiseerde leven wordt besteed in volledige vrijheid, mits je op je <strong>{fireAge}e</strong> stopt met werken.
                  Dat betekent dat je na je opbouw- en werkfase nog een aanzienlijk deel van de matrix ter vrije besteding hebt.
                  Zorg ervoor dat je vitaliteit in deze laatste fase optimaal blijft door nu al de juiste leefstijlkeuzes te maken!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
