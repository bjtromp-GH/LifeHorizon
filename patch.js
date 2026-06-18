const fs = require('fs');
let code = fs.readFileSync('src/components/OnboardingIntro.tsx', 'utf8');

// 1. Replace states
code = code.replace(
  /const \[localBirthYear, setLocalBirthYear\] = useState\(inputs\.birthYear\.toString\(\)\);\n  const \[localAge, setLocalAge\] = useState\(inputs\.currentAge\.toString\(\)\);\n  const \[localStartWorkAge, setLocalStartWorkAge\] = useState\(inputs\.startWorkAge\.toString\(\)\);\n  const \[localFireAge, setLocalFireAge\] = useState\(inputs\.fireAge\.toString\(\)\);\n\n  useEffect\(\(\) => \{ setLocalBirthYear\(inputs\.birthYear\.toString\(\)\); \}, \[inputs\.birthYear\]\);\n  useEffect\(\(\) => \{ setLocalAge\(inputs\.currentAge\.toString\(\)\); \}, \[inputs\.currentAge\]\);\n  useEffect\(\(\) => \{ setLocalStartWorkAge\(inputs\.startWorkAge\.toString\(\)\); \}, \[inputs\.startWorkAge\]\);\n  useEffect\(\(\) => \{ setLocalFireAge\(inputs\.fireAge\.toString\(\)\); \}, \[inputs\.fireAge\]\);/,
  `const [localGender, setLocalGender] = useState<Gender | null>(null);
  const [localBirthYear, setLocalBirthYear] = useState<string>("");
  const [localAge, setLocalAge] = useState<string>("");
  const [localStartWorkAge, setLocalStartWorkAge] = useState<string>("");
  const [localFireAge, setLocalFireAge] = useState<string>("");
  const [localSleep, setLocalSleep] = useState<SleepLevel | null>(null);
  const [localActivity, setLocalActivity] = useState<ActivityLevel | null>(null);
  const [localStress, setLocalStress] = useState<StressLevel | null>(null);
  const [geneticsInteracted, setGeneticsInteracted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);`
);

// 2. Add canProceed and handleNext
code = code.replace(
  /const handleNext = \(\) => \{\n    if \(step < 6\) setStep\(\(s\) => s \+ 1\);\n  \};/,
  `let canProceed = true;
  if (step === 2) {
    canProceed = localGender !== null && localBirthYear !== "" && localAge !== "";
  } else if (step === 3) {
    canProceed = localSleep !== null && localActivity !== null && localStress !== null;
  } else if (step === 4) {
    canProceed = geneticsInteracted;
  } else if (step === 5) {
    canProceed = localStartWorkAge !== "" && localFireAge !== "";
  }

  const handleNext = () => {
    if (step < 6 && canProceed) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setIsTransitioning(false);
      }, 700);
    }
  };`
);

// 3. Step 2 Gender
code = code.replace(
  /onClick=\{\(\) => onInputChange\(\{ gender: g \}\)\}\n\s+className=\{`py-2 sm:py-3 rounded-lg border font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer \$\{\n\s+inputs\.gender === g/g,
  `onClick={() => { setLocalGender(g as Gender); onInputChange({ gender: g }); }}\n                      className={\`py-2 sm:py-3 rounded-lg border font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer \${
                        localGender === g`
);

// 4. Step 2 BirthYear slider
code = code.replace(
  /const calculatedAge = 2026 - bYear;\n\s+onInputChange\(\{/,
  `const calculatedAge = 2026 - bYear;
                      setLocalBirthYear(bYear.toString());
                      setLocalAge(calculatedAge.toString());
                      onInputChange({`
);

// 5. Step 2 BirthYear input onChange
code = code.replace(
  /const calculatedAge = 2026 - bYear;\n\s+onInputChange\(\{/,
  `const calculatedAge = 2026 - bYear;
                        setLocalAge(calculatedAge.toString());
                        onInputChange({`
);

// 6. Step 2 CurrentAge slider
code = code.replace(
  /onChange=\{\(e\) => onInputChange\(\{ currentAge: parseInt\(e\.target\.value\) \}\)\}/,
  `onChange={(e) => {
                      const cAge = parseInt(e.target.value);
                      setLocalAge(cAge.toString());
                      setLocalBirthYear((2026 - cAge).toString());
                      onInputChange({ currentAge: cAge, birthYear: 2026 - cAge });
                    }}`
);

// 7. Step 2 CurrentAge input onChange
code = code.replace(
  /const currentAge = Math\.min\(100, Math\.max\(2, val\)\);\n\s+onInputChange\(\{ currentAge \}\);/,
  `const currentAge = Math.min(100, Math.max(2, val));
                        setLocalBirthYear((2026 - currentAge).toString());
                        onInputChange({ currentAge, birthYear: 2026 - currentAge });`
);

// 8. Step 3 Sleep
code = code.replace(
  /onClick=\{\(\) => updateBioAnswer\("sleep", item\.key as SleepLevel\)\}\n\s+className=\{`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer \$\{\n\s+inputs\.bioAnswers\.sleep === item\.key/g,
  `onClick={() => { setLocalSleep(item.key as SleepLevel); updateBioAnswer("sleep", item.key as SleepLevel); }}\n                      className={\`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer \${
                        localSleep === item.key`
);

// 9. Step 3 Activity
code = code.replace(
  /onClick=\{\(\) => updateBioAnswer\("activity", item\.key as ActivityLevel\)\}\n\s+className=\{`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer \$\{\n\s+inputs\.bioAnswers\.activity === item\.key/g,
  `onClick={() => { setLocalActivity(item.key as ActivityLevel); updateBioAnswer("activity", item.key as ActivityLevel); }}\n                      className={\`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer \${
                        localActivity === item.key`
);

// 10. Step 3 Stress
code = code.replace(
  /onClick=\{\(\) => updateBioAnswer\("stress", item\.key as StressLevel\)\}\n\s+className=\{`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer \$\{\n\s+inputs\.bioAnswers\.stress === item\.key/g,
  `onClick={() => { setLocalStress(item.key as StressLevel); updateBioAnswer("stress", item.key as StressLevel); }}\n                      className={\`p-2 sm:p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all duration-150 cursor-pointer \${
                        localStress === item.key`
);

// 11. Step 4 Genetics
code = code.replace(
  /onClick=\{\(\) => onInputChange\(\{ customLifeExpectancy: 85 \}\)\}/,
  `onClick={() => { setGeneticsInteracted(true); onInputChange({ customLifeExpectancy: 85 }); }}`
);
code = code.replace(
  /onClick=\{\(\) => onInputChange\(\{ fatherPassedAge: null, motherPassedAge: null, customLifeExpectancy: null \}\)\}/,
  `onClick={() => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: null, motherPassedAge: null, customLifeExpectancy: null }); }}`
);
code = code.replace(
  /onChange=\{\(e\) => onInputChange\(\{ customLifeExpectancy: parseInt\(e\.target\.value\) \}\)\}/,
  `onChange={(e) => { setGeneticsInteracted(true); onInputChange({ customLifeExpectancy: parseInt(e.target.value) }); }}`
);
code = code.replace(
  /onChange=\{\(e\) => \{\n\s+const val = parseInt\(e\.target\.value\)/,
  `onChange={(e) => {
                          setGeneticsInteracted(true);
                          const val = parseInt(e.target.value)`
);
code = code.replace(
  /onChange=\{\(e\) => onInputChange\(\{ fatherPassedAge: parseInt\(e\.target\.value\) \}\)\}/,
  `onChange={(e) => { setGeneticsInteracted(true); onInputChange({ fatherPassedAge: parseInt(e.target.value) }); }}`
);
code = code.replace(
  /onChange=\{\(e\) => \{\n\s+const val = parseInt\(e\.target\.value\) \|\| 78;\n\s+const fatherPassedAge/,
  `onChange={(e) => {
                          setGeneticsInteracted(true);
                          const val = parseInt(e.target.value) || 78;
                          const fatherPassedAge`
);
code = code.replace(
  /onChange=\{\(e\) => onInputChange\(\{ motherPassedAge: parseInt\(e\.target\.value\) \}\)\}/,
  `onChange={(e) => { setGeneticsInteracted(true); onInputChange({ motherPassedAge: parseInt(e.target.value) }); }}`
);
code = code.replace(
  /onChange=\{\(e\) => \{\n\s+const val = parseInt\(e\.target\.value\) \|\| 78;\n\s+const motherPassedAge/,
  `onChange={(e) => {
                          setGeneticsInteracted(true);
                          const val = parseInt(e.target.value) || 78;
                          const motherPassedAge`
);

// 12. Step 5 Career
code = code.replace(
  /onChange=\{\(e\) => onInputChange\(\{ startWorkAge: parseInt\(e\.target\.value\) \}\)\}/,
  `onChange={(e) => { setLocalStartWorkAge(e.target.value); onInputChange({ startWorkAge: parseInt(e.target.value) }); }}`
);
code = code.replace(
  /onChange=\{\(e\) => onInputChange\(\{ fireAge: parseInt\(e\.target\.value\) \}\)\}/,
  `onChange={(e) => { setLocalFireAge(e.target.value); onInputChange({ fireAge: parseInt(e.target.value) }); }}`
);

// 13. Elephant Transition
code = code.replace(
  /\{step === 0 && \(/,
  `{isTransitioning ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <motion.img 
                src="/img/Olifant.png" 
                initial={{ scale: 0.8, rotate: -5, opacity: 0, y: 20 }}
                animate={{ scale: 1.1, rotate: 0, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                className="w-40 h-40 object-contain drop-shadow-xl"
              />
            </motion.div>
          ) : step === 0 && (`
);

// 14. Disable Sla over button and Volgende button styles
code = code.replace(
  /\{step > 1 && step < 6 && \(\n\s+<button\n\s+type="button"\n\s+id="btn-onboarding-skip"\n\s+onClick=\{onComplete\}\n\s+className="text-xs sm:text-sm font-bold text-\[\#767676\] hover:text-\[\#2D2D2D\] transition-colors duration-150 cursor-pointer"\n\s+>\n\s+Sla over\n\s+<\/button>\n\s+\)\}/,
  ``
);
code = code.replace(
  /className=\{`px-5 sm:px-6 py-2\.5 sm:py-3 text-white font-black text-sm tracking-wide rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1\.5 \$\{\n\s+step === 0 \n\s+\? "bg-white text-\[\#D56B45\]" \n\s+: "bg-\[\#2D2D2D\] hover:bg-\[\#1A1A1A\]"\n\s+\}`\}/,
  `disabled={!canProceed}
              className={\`px-5 sm:px-6 py-2.5 sm:py-3 text-white font-black text-sm tracking-wide rounded-xl shadow-md transition-all flex items-center space-x-1.5 \${
                !canProceed 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : step === 0 
                    ? "bg-white text-[#D56B45] cursor-pointer" 
                    : "bg-[#2D2D2D] hover:bg-[#1A1A1A] cursor-pointer"
              }\`}`
);

fs.writeFileSync('src/components/OnboardingIntro.tsx', code);
console.log('Patched OnboardingIntro.tsx successfully!');
