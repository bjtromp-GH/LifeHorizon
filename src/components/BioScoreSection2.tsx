import { BioScoreAnswers, SmokerLevel, AlcoholLevel, DietLevel } from "../types";
import NumberTicker from "./NumberTicker";
import { useLanguage } from "../context/LanguageContext";
import { getBioScoreOffset } from "./BioScoreSection";

interface BioScoreSection2Props {
  answers: BioScoreAnswers;
  onChange: (updates: Partial<BioScoreAnswers>) => void;
}

export default function BioScoreSection2({ answers, onChange }: BioScoreSection2Props) {
  const { t } = useLanguage();

  const smokerOptions: { value: SmokerLevel; label: string; offset: number; desc: string }[] = [
    { value: "nee", label: t('bioScore.smoker.no.label'), offset: 0.0, desc: t('bioScore.smoker.no.desc') },
    { value: "ja", label: t('bioScore.smoker.yes.label'), offset: -5.0, desc: t('bioScore.smoker.yes.desc') },
  ];

  const alcoholOptions: { value: AlcoholLevel; label: string; offset: number; desc: string }[] = [
    { value: "geen_af_en_toe", label: t('bioScore.alcohol.none.label'), offset: 0.5, desc: t('bioScore.alcohol.none.desc') },
    { value: "regelmatig", label: t('bioScore.alcohol.regular.label'), offset: -1.5, desc: t('bioScore.alcohol.regular.desc') },
  ];

  const dietOptions: { value: DietLevel; label: string; offset: number; desc: string }[] = [
    { value: "gezond", label: t('bioScore.diet.healthy.label'), offset: 1.5, desc: t('bioScore.diet.healthy.desc') },
    { value: "gemiddeld", label: t('bioScore.diet.average.label'), offset: -0.5, desc: t('bioScore.diet.average.desc') },
  ];

  const totalOffset = getBioScoreOffset(answers);

  return (
    <div id="bioscore-section-2" className="flex flex-col space-y-6">
      {/* Header with live feedback in Terracotta */}
      <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div>
          <h3 className="font-sans font-medium text-sm text-[#2D2D2D] uppercase tracking-wide">
            {t('onboarding.lifestyle2.title')}
          </h3>
          <p className="text-[11px] text-[#767676]">
            {t('onboarding.lifestyle2.desc')}
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

      {/* 4. Roker */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          {t('bioScore.smoker.title')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {smokerOptions.map((opt) => {
            const isSelected = answers.smoker === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ smoker: opt.value })}
                className={`flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
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

      {/* 5. Alcohol */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          {t('bioScore.alcohol.title')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {alcoholOptions.map((opt) => {
            const isSelected = answers.alcohol === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ alcohol: opt.value })}
                className={`flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
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

      {/* 6. Dieet */}
      <div className="space-y-2.5">
        <label className="text-sm sm:text-[11px] uppercase tracking-wider font-bold sm:font-semibold text-[#D56B45] sm:text-[#767676]">
          {t('bioScore.diet.title')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dietOptions.map((opt) => {
            const isSelected = answers.diet === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ diet: opt.value })}
                className={`flex flex-col text-left p-3 rounded border text-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#D56B45] bg-[#FAF3F0]"
                    : "border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
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
