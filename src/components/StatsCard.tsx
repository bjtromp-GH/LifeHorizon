import { Hourglass, ShieldCheck, Sun, Workflow } from "lucide-react";
import { UserInputs } from "../types";

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
  const { currentAge, fireAge } = inputs;

  const totalRemaining = Math.max(0, projectedLifeExpectancy - currentAge);
  const remainingWork = Math.max(0, fireAge - currentAge);
  const totalFreedom = Math.max(0, projectedLifeExpectancy - fireAge);

  // Translate to rounded values for clean layout
  const lifeVal = Math.round(projectedLifeExpectancy * 10) / 10;
  const remValue = Math.round(totalRemaining * 10) / 10;
  const workValue = Math.round(remainingWork * 10) / 10;
  const freeValue = Math.round(totalFreedom * 10) / 10;

  return (
    <div id="stats-dashboard-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Geprognosticeerde Levensverwachting */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
            Prognose Leeftijd
          </span>
          <ShieldCheck className="w-4 h-4 text-[#D56B45]/80" />
        </div>
        <div className="mt-2.5">
          <span id="stat-life-expectancy" className="text-3xl font-bold text-[#2D2D2D] font-mono tracking-tight">
            {lifeVal}
          </span>
          <span className="text-xs text-[#767676] ml-1 font-sans">jaar</span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#F8F7F5] flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#767676]">
          <span className="text-[#8E8C88] font-medium">Gecalibreerd met:</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded font-sans text-[8.5px] font-extrabold uppercase tracking-widest bg-[#FAF3F0] text-[#D56B45] border border-[#D56B45]/15 whitespace-nowrap">
            {apiSource}
          </span>
        </div>
      </div>

      {/* 2. Resterende Levensduur */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
            Resterende Tijd
          </span>
          <Hourglass className="w-4 h-4 text-[#D56B45]" />
        </div>
        <div className="mt-2.5">
          <span id="stat-remaining-years" className="text-3xl font-bold text-[#D56B45] font-mono tracking-tight">
            {remValue}
          </span>
          <span className="text-xs text-[#767676] ml-1 font-sans">jaar</span>
        </div>
        <p className="text-[9.5px] text-[#767676] mt-1 select-none leading-tight">
          Je resterende budget op aarde.
        </p>
      </div>

      {/* 3. Nog Werken tot FIRE */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
            Werkende Jaren
          </span>
          <Workflow className="w-4 h-4 text-[#767676]/80" />
        </div>
        <div className="mt-2.5">
          <span id="stat-working-years" className="text-3xl font-bold text-[#2D2D2D] font-mono tracking-tight">
            {workValue}
          </span>
          <span className="text-xs text-[#767676] ml-1 font-sans">jaar</span>
        </div>
        <span className="text-[9.5px] text-[#767676] mt-1 leading-tight">
          {currentAge >= fireAge
            ? "FIRE / Vrijheid reeds behaald!"
            : `Fase eindigt op ${fireAge} jarige leeftijd`}
        </span>
      </div>

      {/* 4. Totaal Vrijheid in Jaren */}
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#767676] font-semibold">
            Vleugels (Vrijheid)
          </span>
          <Sun className="w-4 h-4 text-amber-500/80" />
        </div>
        <div className="mt-2.5">
          <span id="stat-freedom-years" className="text-3xl font-bold text-[#2D2D2D] font-mono tracking-tight">
            {freeValue}
          </span>
          <span className="text-xs text-[#767676] ml-1">jaar</span>
        </div>
        <span className="text-[9.5px] text-[#767676] mt-1 leading-tight">
          Tijd te besteden buiten verplichtingen ({Math.round((freeValue / lifeVal) * 100)}% levensloop)
        </span>
      </div>
    </div>
  );
}
