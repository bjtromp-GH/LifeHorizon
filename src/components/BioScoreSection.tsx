import { ActivityLevel, BioScoreAnswers, SleepLevel, StressLevel } from "../types";
import NumberTicker from "./NumberTicker";

interface BioScoreSectionProps {
  answers: BioScoreAnswers;
  onChange: (updates: Partial<BioScoreAnswers>) => void;
}

export default function BioScoreSection({ answers, onChange }: BioScoreSectionProps) {
  // Option lists with labels, years, description
  const activityOptions: { value: ActivityLevel; label: string; offset: number; desc: string }[] = [
    { value: "zittend", label: "Zittend", offset: -2.0, desc: "Minimaal bewegen, kantoorbaan" },
    { value: "licht", label: "Licht Actief", offset: 0.0, desc: "Dagelijkse wandeling of milde beweging" },
    { value: "actief", label: "Actief", offset: 1.0, desc: "3x per week matige sport of fysiek werk" },
    { value: "optimaal", label: "Optimaal/Kracht", offset: 2.0, desc: "Frequente krachttraining & cardio" },
  ];

  const sleepOptions: { value: SleepLevel; label: string; offset: number; desc: string }[] = [
    { value: "kort", label: "< 6 uur", offset: -1.5, desc: "Chronisch slaaptekort of slechte kwaliteit" },
    { value: "matig", label: "6 - 7 uur", offset: -0.5, desc: "Regelmatig te weinig, vaak gejaagd" },
    { value: "goed", label: "7 - 8 uur", offset: 0.5, desc: "Wisselend voldoende rust en kwaliteit" },
    { value: "optimaal", label: "Consistent goed", offset: 1.5, desc: "8 uur diepe herstellende slaap" },
  ];

  const stressOptions: { value: StressLevel; label: string; offset: number; desc: string }[] = [
    { value: "hoog", label: "Hoog", offset: -1.5, desc: "Chronische druk, wekelijkse overprikkeling" },
    { value: "gemiddeld", label: "Gemiddeld", offset: -0.5, desc: "Gezonde stress met pieken, prima herstel" },
    { value: "balans", label: "Goede balans", offset: 0.5, desc: "Gevoel van controle en ontspanning" },
    { value: "laag", label: "Laag / Zen", offset: 1.5, desc: "Diepe rust, weinig externe druk" },
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
            Lifestyle Bio-Score
          </h3>
          <p className="text-[11px] text-[#767676]">
            Modifiers beïnvloeden de prognose met -5 tot +5 jaar
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider text-[#767676] font-mono leading-none">
            Netto effect
          </span>
          <NumberTicker
            value={totalOffset}
            decimals={1}
            duration={1}
            prefix={totalOffset >= 0 ? "+" : ""}
            suffix=" jaar"
            className={`text-base font-bold font-mono mt-1 ${
              totalOffset > 0 ? "text-[#D56B45]" : totalOffset < 0 ? "text-amber-700" : "text-[#767676]"
            }`}
          />
        </div>
      </div>

      {/* 1. Beweging (Movement) */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          1. Fysieke Activiteit
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activityOptions.map((opt) => {
            const isSelected = answers.activity === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`btn-activity-${opt.value}`}
                onClick={() => onChange({ activity: opt.value })}
                className={`flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-[#2D2D2D]">{opt.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
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
                <span className="text-[10px] text-[#767676] mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slaap (Sleep) */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          2. Slaappatroon
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sleepOptions.map((opt) => {
            const isSelected = answers.sleep === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`btn-sleep-${opt.value}`}
                onClick={() => onChange({ sleep: opt.value })}
                className={`flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-[#2D2D2D]">{opt.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
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
                <span className="text-[10px] text-[#767676] mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Stress */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          3. Stress / Werkdruk
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stressOptions.map((opt) => {
            const isSelected = answers.stress === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`btn-stress-${opt.value}`}
                onClick={() => onChange({ stress: opt.value })}
                className={`flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-[#2D2D2D]">{opt.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
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
                <span className="text-[10px] text-[#767676] mt-0.5 leading-tight">{opt.desc}</span>
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

  return movementMap[answers.activity] + sleepMap[answers.sleep] + stressMap[answers.stress];
}
