import { Gender, UserInputs } from "../types";

interface OnboardingPanelProps {
  inputs: UserInputs;
  onChange: (updates: Partial<UserInputs>) => void;
}

export default function OnboardingPanel({ inputs, onChange }: OnboardingPanelProps) {
  const currentYear = 2026;

  // Handle Birth Year change
  const handleBirthYearChange = (year: number) => {
    const validYear = Math.max(1945, Math.min(currentYear, year));
    // Automatically recalculate current age base on birth year
    const autoAge = Math.max(0, currentYear - validYear);
    
    // Ensure retirement and start work ages stay logically valid
    const newStartWork = Math.min(inputs.startWorkAge, autoAge);
    const newFireAge = Math.max(newStartWork + 5, inputs.fireAge);

    onChange({
      birthYear: validYear,
      currentAge: autoAge,
      startWorkAge: newStartWork,
      fireAge: newFireAge
    });
  };

  return (
    <div id="onboarding-panel" className="flex flex-col space-y-5">
      {/* Title */}
      <div className="border-b border-[#EAEAEA] pb-3">
        <h3 className="font-sans font-medium text-sm text-[#2D2D2D] uppercase tracking-wide">
          Persoonlijke Meetlat
        </h3>
        <p className="text-[11px] text-[#767676]">
          Stel je basis parameters in om je levensduur te calibreren
        </p>
      </div>

      {/* 1. Geboortejaar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label className="font-medium text-[#2D2D2D]">Geboortejaar</label>
          <span className="font-mono text-[#D56B45] font-semibold">{inputs.birthYear}</span>
        </div>
        <div className="flex space-x-2 items-center">
          <input
            type="range"
            id="slider-birthyear"
            min="1945"
            max={currentYear - 1}
            value={inputs.birthYear}
            onChange={(e) => handleBirthYearChange(parseInt(e.target.value))}
            className="hidden sm:block w-full h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
          />
          <input
            type="number"
            id="input-birthyear"
            min="1945"
            max={currentYear - 1}
            value={inputs.birthYear}
            onChange={(e) => handleBirthYearChange(parseInt(e.target.value) || 1980)}
            className="w-full sm:w-16 text-center border border-[#EAEAEA] rounded text-sm sm:text-xs py-1.5 sm:py-0.5 font-mono text-[#2D2D2D]"
          />
        </div>
      </div>

      {/* 2. Geslacht (Gender Selector) */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#2D2D2D]">Geslacht</label>
        <div id="gender-button-group" className="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-gender-man"
            onClick={() => onChange({ gender: "man" })}
            className={`py-2 rounded text-xs font-medium border transition-all duration-200 cursor-pointer ${
              inputs.gender === "man"
                ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            Man (Statistisch korter)
          </button>
          <button
            type="button"
            id="btn-gender-vrouw"
            onClick={() => onChange({ gender: "vrouw" })}
            className={`py-2 rounded text-xs font-medium border transition-all duration-200 cursor-pointer ${
              inputs.gender === "vrouw"
                ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            Vrouw (Statistisch langer)
          </button>
        </div>
      </div>

      {/* 3. Huidige Leeftijd (autocalculated but slider manual override) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label className="font-medium text-[#2D2D2D]">Huidige Leeftijd (Gecorrigeerd)</label>
          <span className="font-mono text-[#D56B45] font-semibold">{inputs.currentAge} jaar</span>
        </div>
        <div className="flex items-center space-x-2 w-full">
          <input
            type="range"
            id="slider-current-age"
            min="0"
            max="100"
            value={inputs.currentAge}
            onChange={(e) => {
              const newAge = Math.min(100, Math.max(0, parseInt(e.target.value)));
              const bYear = currentYear - newAge;

              // Keep startWork valid
              const startWork = Math.min(inputs.startWorkAge, newAge);
              onChange({
                currentAge: newAge,
                birthYear: bYear,
                startWorkAge: startWork
              });
            }}
            className="hidden sm:block w-full h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={inputs.currentAge}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              const newAge = Math.min(100, Math.max(0, val));
              const bYear = currentYear - newAge;
              const startWork = Math.min(inputs.startWorkAge, newAge);
              onChange({
                currentAge: newAge,
                birthYear: bYear,
                startWorkAge: startWork
              });
            }}
            className="w-full sm:w-16 text-center border border-[#EAEAEA] rounded text-sm sm:text-xs py-1.5 sm:py-0.5 font-mono text-[#2D2D2D]"
          />
          <span className="text-[10px] text-[#767676] font-mono whitespace-nowrap">
            berekend: {currentYear - inputs.birthYear} jr
          </span>
        </div>
      </div>

      {/* 4. Startleeftijd Werken */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <div className="flex flex-col">
            <span className="font-medium text-[#2D2D2D]">Startleeftijd Werken</span>
            <span className="text-[10px] text-[#767676]">Wanneer begon de accumulatie?</span>
          </div>
          <span className="font-mono text-[#D56B45] font-semibold">{inputs.startWorkAge} jr</span>
        </div>
        <div className="flex space-x-2 items-center">
          <input
            type="range"
            id="slider-startwork"
            min="12"
            max={Math.min(45, inputs.currentAge)}
            value={inputs.startWorkAge}
            onChange={(e) => {
              const startAge = parseInt(e.target.value);
              const fireAge = Math.max(startAge + 5, inputs.fireAge);
              onChange({ startWorkAge: startAge, fireAge: fireAge });
            }}
            className="hidden sm:block w-full h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
          />
          <input
            type="number"
            min="12"
            max={Math.min(45, inputs.currentAge)}
            value={inputs.startWorkAge}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 12;
              const startAge = Math.min(Math.min(45, inputs.currentAge), Math.max(12, val));
              const fireAge = Math.max(startAge + 5, inputs.fireAge);
              onChange({ startWorkAge: startAge, fireAge: fireAge });
            }}
            className="w-full sm:w-16 text-center border border-[#EAEAEA] rounded text-sm sm:text-xs py-1.5 sm:py-0.5 font-mono text-[#2D2D2D]"
          />
        </div>
      </div>

      {/* 5. Doel Leeftijd FIRE / Pensioen */}
      <div className="space-y-1.5 pb-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex flex-col">
            <span className="font-medium text-[#2D2D2D]">Doel Leeftijd FIRE</span>
            <span className="text-[10px] text-[#767676]">Wanneer start de vrijheid-fase?</span>
          </div>
          <span className="font-mono text-[#D56B45] font-semibold">{inputs.fireAge} jr</span>
        </div>
        <div className="flex space-x-2 items-center">
          <input
            type="range"
            id="slider-fire-age"
            min={inputs.startWorkAge + 2}
            max="85"
            value={inputs.fireAge}
            onChange={(e) => onChange({ fireAge: parseInt(e.target.value) })}
            className="hidden sm:block w-full h-1.5 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
          />
          <input
            type="number"
            min={inputs.startWorkAge + 2}
            max="85"
            value={inputs.fireAge}
            onChange={(e) => {
              const val = parseInt(e.target.value) || (inputs.startWorkAge + 5);
              const fireAge = Math.min(85, Math.max(inputs.startWorkAge + 2, val));
              onChange({ fireAge });
            }}
            className="w-full sm:w-16 text-center border border-[#EAEAEA] rounded text-sm sm:text-xs py-1.5 sm:py-0.5 font-mono text-[#2D2D2D]"
          />
        </div>
      </div>

      {/* 6. Erfelijkheid (Ouders) */}
      <div className="pt-3 border-t border-[#EAEAEA] space-y-3">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#767676]">
            6. Erfelijkheid (Levensduur Ouders)
          </span>
          <span className="text-[10px] text-[#767676]">
            Hereditaire factoren passen de prognose aan met -1.5 tot +1.5 jaar per ouder.
          </span>
        </div>

        {/* Father Section */}
        <div className="space-y-1.5 p-2 bg-gray-50 rounded border border-[#EAEAEA]/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-[#2D2D2D]">Vader</span>
            <div className="flex space-x-1">
              <button
                type="button"
                id="btn-father-status-alive"
                onClick={() => onChange({ fatherPassedAge: null })}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-200 cursor-pointer ${
                  inputs.fatherPassedAge === null
                    ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                    : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-100"
                }`}
              >
                In leven / Neutraal
              </button>
              <button
                type="button"
                id="btn-father-status-passed"
                onClick={() => onChange({ fatherPassedAge: 75 })}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-200 cursor-pointer ${
                  inputs.fatherPassedAge !== null
                    ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                    : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-100"
                }`}
              >
                Overleden
              </button>
            </div>
          </div>

          {inputs.fatherPassedAge !== null && (
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#767676]">Leeftijd van overlijden:</span>
                <span className="font-mono text-[#D56B45] font-semibold">
                  {inputs.fatherPassedAge} jaar{" "}
                  <span className="text-[9px] text-[#767676] font-normal">
                    ({inputs.fatherPassedAge < 65 ? "-1.5 jr" : inputs.fatherPassedAge >= 85 ? "+1.5 jr" : "Neutraal"})
                  </span>
                </span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="range"
                  id="slider-father-passed-age"
                  min="40"
                  max="100"
                  value={inputs.fatherPassedAge}
                  onChange={(e) => onChange({ fatherPassedAge: parseInt(e.target.value) })}
                  className="hidden sm:block w-full h-1 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                />
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={inputs.fatherPassedAge}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 75;
                    const fatherPassedAge = Math.min(100, Math.max(40, val));
                    onChange({ fatherPassedAge });
                  }}
                  className="w-full sm:w-16 text-center border border-[#EAEAEA] rounded text-sm sm:text-xs py-1.5 sm:py-0.5 font-mono text-[#2D2D2D]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mother Section */}
        <div className="space-y-1.5 p-2 bg-gray-50 rounded border border-[#EAEAEA]/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-[#2D2D2D]">Moeder</span>
            <div className="flex space-x-1">
              <button
                type="button"
                id="btn-mother-status-alive"
                onClick={() => onChange({ motherPassedAge: null })}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-200 cursor-pointer ${
                  inputs.motherPassedAge === null
                    ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                    : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-100"
                }`}
              >
                In leven / Neutraal
              </button>
              <button
                type="button"
                id="btn-mother-status-passed"
                onClick={() => onChange({ motherPassedAge: 78 })}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-200 cursor-pointer ${
                  inputs.motherPassedAge !== null
                    ? "border-[#D56B45] bg-[#FAF3F0] text-[#D56B45]"
                    : "border-[#EAEAEA] bg-white text-[#767676] hover:bg-gray-100"
                }`}
              >
                Overleden
              </button>
            </div>
          </div>

          {inputs.motherPassedAge !== null && (
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#767676]">Leeftijd van overlijden:</span>
                <span className="font-mono text-[#D56B45] font-semibold">
                  {inputs.motherPassedAge} jaar{" "}
                  <span className="text-[9px] text-[#767676] font-normal">
                    ({inputs.motherPassedAge < 65 ? "-1.5 jr" : inputs.motherPassedAge >= 85 ? "+1.5 jr" : "Neutraal"})
                  </span>
                </span>
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="range"
                  id="slider-mother-passed-age"
                  min="40"
                  max="100"
                  value={inputs.motherPassedAge}
                  onChange={(e) => onChange({ motherPassedAge: parseInt(e.target.value) })}
                  className="hidden sm:block w-full h-1 bg-[#EAE8E4] rounded-lg appearance-none cursor-pointer accent-[#D56B45]"
                />
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={inputs.motherPassedAge}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 78;
                    const motherPassedAge = Math.min(100, Math.max(40, val));
                    onChange({ motherPassedAge });
                  }}
                  className="w-full sm:w-16 text-center border border-[#EAEAEA] rounded text-sm sm:text-xs py-1.5 sm:py-0.5 font-mono text-[#2D2D2D]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
