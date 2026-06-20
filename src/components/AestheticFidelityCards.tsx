import { Hourglass, ShieldCheck, Heart, Landmark, Info, HelpCircle } from "lucide-react";
import React from "react";
import { UserInputs } from "../types";
import { getBioScoreOffset } from "./BioScoreSection";

interface AestheticFidelityCardsProps {
  inputs: UserInputs;
  projectedLifeExpectancy: number;
  cbsBaseLife: number;
  apiSource: "CBS API" | "CBS Cohort Model";
  showOnly?: ("verbruikt" | "verwachting" | "carriere" | "vrijheid")[];
}

export default React.memo(function AestheticFidelityCards({
  inputs,
  projectedLifeExpectancy,
  cbsBaseLife,
  apiSource,
  showOnly,
}: AestheticFidelityCardsProps) {
  const { currentAge, startWorkAge, fireAge, fatherPassedAge, motherPassedAge, bioAnswers } = inputs;

  // Let's compute actual remaining life and other milestones
  const totalRemaining = Math.max(0, projectedLifeExpectancy - currentAge);
  const totalWorking = Math.max(1, fireAge - startWorkAge);
  const yearsWorked = Math.max(0, currentAge - startWorkAge);
  const yearsRemainingWork = Math.max(0, fireAge - currentAge);
  const totalFreedom = Math.max(0, projectedLifeExpectancy - fireAge);

  const workedPercentage = Math.round(Math.min(100, Math.max(0, (yearsWorked / totalWorking) * 100)));

  // Calculate CBS base life expectation relative to birth year (excluding offsets)
  // Use the actual CBS Base Life from props
  const cbsBaseExpectancy = cbsBaseLife;

  let hereditaryOffset = 0;
  if (fatherPassedAge !== null) {
    if (fatherPassedAge < 65) hereditaryOffset -= 1.5;
    else if (fatherPassedAge >= 85) hereditaryOffset += 1.5;
  }
  if (motherPassedAge !== null) {
    if (motherPassedAge < 65) hereditaryOffset -= 1.5;
    else if (motherPassedAge >= 85) hereditaryOffset += 1.5;
  }

  // Calculate dynamic bio offset using the shared function
  const bioOffset = getBioScoreOffset(bioAnswers);

  // Dynamic Vitality score calculation for ring progress (85% inside the image)
  const calculateVitalityScore = (): number => {
    let totalScore = 0;
    let counts = 0;

    // Activity
    counts++;
    if (bioAnswers.activity === "optimaal") totalScore += 100;
    else if (bioAnswers.activity === "actief") totalScore += 80;
    else if (bioAnswers.activity === "licht") totalScore += 55;
    else totalScore += 25; // zittend

    // Sleep
    counts++;
    if (bioAnswers.sleep === "optimaal") totalScore += 100;
    else if (bioAnswers.sleep === "goed") totalScore += 80;
    else if (bioAnswers.sleep === "matig") totalScore += 55;
    else totalScore += 25; // kort

    // Stress
    counts++;
    if (bioAnswers.stress === "laag") totalScore += 100;
    else if (bioAnswers.stress === "balans") totalScore += 80;
    else if (bioAnswers.stress === "gemiddeld") totalScore += 55;
    else totalScore += 25; // hoog

    return Math.round(totalScore / counts);
  };

  const vitalityPct = calculateVitalityScore();
  const circ = 2 * Math.PI * 26; // radius 26 circle
  const strokeDashoffset = circ - (vitalityPct / 100) * circ;

  const orbitalPassedPct = ((currentAge / projectedLifeExpectancy) * 100).toFixed(1);

  const showVerbruikt = !showOnly || showOnly.includes("verbruikt");
  const showVitaliteit = !showOnly || showOnly.includes("vitaliteit");
  const showCarriere = !showOnly || showOnly.includes("carriere");
  const showHorizon = !showOnly || showOnly.includes("horizon");

  const activeCountInRow1 = [showVerbruikt, showVitaliteit, showCarriere].filter(Boolean).length;
  const gridColsClass = activeCountInRow1 === 3 ? "md:grid-cols-3" : activeCountInRow1 === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <div id="fidelity-panels-container" className="space-y-5 w-full">
      
      {(showVerbruikt || showVitaliteit || showCarriere) && (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-5`}>
          
          {/* CARD 1: VERBRUIKT VS. RESTEREND */}
          {showVerbruikt && (
            <section className="p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Hourglass className="w-4 h-4 text-[#D56B45]" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                      Verbruikt vs. Resterend
                    </h3>
                  </div>
                  <div className="px-2 py-0.5 rounded text-[10px] font-semibold font-sans bg-[#FAF3F0] text-[#D56B45] border border-[#EAEAEA]">
                    Zwakste Schakel: Tijd
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Gerealiseerd */}
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-wider text-[#767676] uppercase font-semibold">
                      Gerealiseerd
                    </span>
                    <div className="flex items-baseline">
                      <span id="field-realised-years" className="text-3.5xl font-bold font-sans tracking-tight text-[#2D2D2D]">
                        {currentAge}
                      </span>
                      <span className="text-sm font-sans font-medium text-[#767676] ml-0.5">j.</span>
                    </div>
                    <div className="text-xs text-[#767676] space-y-0.5 leading-normal">
                      <div>{Math.round(currentAge * 52.177).toLocaleString("nl-NL")} weken</div>
                      <div>{Math.round(currentAge * 365.242).toLocaleString("nl-NL")} dagen</div>
                    </div>
                  </div>

                  {/* Resterend (Prognose) */}
                  <div className="space-y-1 border-l border-[#F3F2F0] pl-4">
                    <span className="text-[10px] tracking-wider text-[#767676] uppercase font-semibold">
                      Resterend (Prognose)
                    </span>
                    <div className="flex items-baseline">
                      <span id="field-remaining-years" className="text-3.5xl font-bold font-sans tracking-tight text-[#D56B45]">
                        {totalRemaining.toFixed(1)}
                      </span>
                      <span className="text-sm font-sans font-medium text-[#D56B45] ml-0.5">j.</span>
                    </div>
                    <div className="text-xs text-[#767676] space-y-0.5 leading-normal">
                      <div>{Math.round(totalRemaining * 52.177).toLocaleString("nl-NL")} weken</div>
                      <div>{Math.round(totalRemaining * 365.242).toLocaleString("nl-NL")} dagen</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F2F0] text-xs text-[#767676] leading-relaxed">
                Op basis van uw leeftijd is <span className="font-semibold text-[#2D2D2D]">{orbitalPassedPct}%</span> van uw statistische levensorbit verstreken.
              </div>
            </section>
          )}

          {/* CARD 2: VITALITEIT & LEVENSWINST */}
          {showVitaliteit && (
            <section className="p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-[#D56B45]" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                      Vitaliteit & Levenswinst
                    </h3>
                  </div>
                  <div className="px-2 py-0.5 rounded text-[10px] font-semibold font-sans bg-[#FAF3F0] text-[#D56B45] border border-[#EAEAEA]">
                    Bio-Score
                  </div>
                </div>

                <div className="flex items-center space-x-5 mb-5 bg-[#FAFCEE]/30 p-2.5 rounded-lg border border-[#FAFCEE]/70">
                  {/* Circle progress bar */}
                  <div className="relative flex items-center justify-center w-14 h-14 shrink-0 bg-[#FAF3F0]/60 rounded-full">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-gray-100 fill-none"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-[#D56B45] fill-none transition-all duration-500 ease-out"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 - (vitalityPct / 100) * (2 * Math.PI * 20)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-sans text-xs font-bold text-[#D56B45]">{vitalityPct}%</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] tracking-wider text-[#767676] uppercase font-semibold block">
                      Lifestyle Impact
                    </span>
                    <span id="field-lifestyle-impact" className="text-lg font-bold text-[#D56B45] block leading-tight">
                      {bioOffset >= 0 ? `+${bioOffset.toFixed(1)}` : bioOffset.toFixed(1)} jaar {bioOffset >= 0 ? "winst" : "verlies"}
                    </span>
                    <p className="text-[11px] text-[#767676] leading-tight">
                      Uw keuzes rond slaap, stress en sport veranderen de prognose ten opzichte van de CBS basis.
                    </p>
                  </div>
                </div>

                {/* List of variables contributing to Life expectancy */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#F3F2F0]">
                    <span className="text-[#767676]">Basis CBS cohort:</span>
                    <span className="font-mono text-[#2D2D2D] font-medium">{cbsBaseExpectancy.toFixed(1)} j.</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F3F2F0]">
                    <span className="text-[#767676]">Familiale genetica (vader/moeder):</span>
                    <span className="font-mono text-[#2D2D2D] font-medium">
                      {hereditaryOffset >= 0 ? `+${hereditaryOffset.toFixed(1)}` : hereditaryOffset.toFixed(1)} j.
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F3F2F0]">
                    <span className="text-[#767676]">Lifestyle (Bio-Score):</span>
                    <span className="font-mono text-[#2D2D2D] font-medium">
                      {bioOffset >= 0 ? `+${bioOffset.toFixed(1)}` : bioOffset.toFixed(1)} j.
                    </span>
                  </div>
                  {inputs.customLifeExpectancy !== null && inputs.customLifeExpectancy !== undefined && (
                    <div className="flex justify-between items-center py-1 border-b border-[#F3F2F0] text-[#D56B45]">
                      <span>Zelf aangepast (overrule):</span>
                      <span className="font-mono font-medium">
                        {(projectedLifeExpectancy - (cbsBaseExpectancy + hereditaryOffset + bioOffset)) >= 0 ? "+" : ""}
                        {(projectedLifeExpectancy - (cbsBaseExpectancy + hereditaryOffset + bioOffset)).toFixed(1)} j.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 px-2.5 bg-[#FAF3F0]/60 rounded border border-[#EAEAEA]/80 font-bold mt-4">
                <span className="text-[#2D2D2D] text-xs">Totale Verwachte Leeftijd:</span>
                <span id="field-total-projected-expectation" className="font-mono text-[#D56B45] text-sm">
                  {projectedLifeExpectancy.toFixed(1)} j.
                </span>
              </div>
            </section>
          )}

          {/* CARD 3: CARRIÈRE RUNWAY (Pensioen) */}
          {showCarriere && (
            <section className="p-5 bg-white border border-[#EAEAEA] rounded-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#F3F2F0] pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Landmark className="w-4 h-4 text-[#D56B45]" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                      Carrière Runway (Pensioen)
                    </h3>
                  </div>
                  <div className="px-2 py-0.5 rounded text-[10px] font-semibold font-sans bg-[#FAF3F0] text-[#D56B45] border border-[#EAEAEA]">
                    Actief Werk
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[11px] text-[#767676]">
                    <span>Start: {startWorkAge} jr</span>
                    <span className="font-bold text-[#D56B45]">{workedPercentage}% voltooid</span>
                    <span>Doel: {fireAge} jr</span>
                  </div>
                  {/* Horizontal progress */}
                  <div className="w-full h-2 bg-[#EAE8E4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D56B45] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${workedPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#767676] block text-[10px] uppercase font-semibold">Gewerkt</span>
                    <span className="text-base font-bold text-[#2D2D2D] font-mono">{yearsWorked} jaar</span>
                  </div>
                  <div className="border-l border-[#F3F2F0] pl-4">
                    <span className="text-[#767676] block text-[10px] uppercase font-semibold">Resterende werkjaren</span>
                    <span id="field-remaining-workyears" className="text-base font-bold text-[#D56B45] font-mono">
                      {yearsRemainingWork} jaar
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F2F0] text-xs text-[#767676] leading-relaxed">
                Nog <span className="font-semibold text-[#2D2D2D]">{yearsRemainingWork} jaar</span> verplichte tijdsallocatie tot uw pensioenleeftijd van {fireAge} jaar.
              </div>
            </section>
          )}

        </div>
      )}

      {/* CARD 4: DE ONGETEMDE HORIZON === */}
      {showHorizon && (
        <section className="p-5 bg-[#FAFCEE]/20 border border-[#D56B45]/20 rounded-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3F2F0] pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-base select-none">🔥</span>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                De Ongetemde Horizon (Vrijheidsoogst)
              </h3>
            </div>
            <span className="text-[10px] text-[#767676] font-medium italic mt-1 sm:mt-0">
              Maximale Tijdsonafhankelijkheid
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Totale levensvrijheid */}
            <div className="space-y-1 bg-white p-3 rounded border border-[#EAEAEA]/60">
              <span className="text-[9px] text-[#767676] uppercase font-bold tracking-wider block">
                Totale Levensvrijheid
              </span>
              <div className="flex items-baseline">
                <span id="field-total-levensvrijheid" className="text-2xl font-bold text-[#D56B45] font-mono">
                  {totalFreedom.toFixed(1)}
                </span>
                <span className="text-xs text-[#767676] ml-1 font-medium">actieve jaren</span>
              </div>
              <p className="text-[11px] text-[#767676] leading-snug">
                Het aantal jaren dat u soevereine beslissingen kunt nemen na uw geplande pensioenleeftijd.
              </p>
            </div>

            {/* Gereserveerde vrijheid */}
            <div className="space-y-1 bg-white p-3 rounded border border-[#EAEAEA]/60">
              <span className="text-[9px] text-[#767676] uppercase font-bold tracking-wider block">
                Gereserveerde Vrijheid
              </span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-[#2D2D2D] font-mono">
                  {Math.round(totalFreedom * 52.177).toLocaleString("nl-NL")}
                </span>
                <span className="text-xs text-[#767676] ml-1 font-medium">weken</span>
              </div>
              <p className="text-[11px] text-[#767676] leading-snug font-sans">
                De totale voorraad weken onvoorwaardelijke vrijheid die u statistisch in het verschiet heeft.
              </p>
            </div>

            {/* Noch te realiseren vrijheid */}
            <div className="space-y-1 bg-white p-3 rounded border border-[#EAEAEA]/60">
              <span className="text-[9px] text-[#767676] uppercase font-bold tracking-wider block">
                Noch te realiseren vrijheid
              </span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold font-mono text-[#D56B45]">
                  {Math.round(totalFreedom * 52.177).toLocaleString("nl-NL")}
                </span>
                <span className="text-xs text-[#767676] ml-1 font-medium">te gaan</span>
              </div>
              <p className="text-[11px] text-[#767676] leading-snug font-sans">
                Weken die nog volledig overstaan na pensionering (uitgaande van uw huidige leeftijd).
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
});
