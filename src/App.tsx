import { useState, useEffect, useCallback, useMemo } from "react";
import { UserInputs, LifePhases } from "./types";
import { getCBSLifeExpectancy } from "./api/cbs";
import { getBioScoreOffset } from "./components/BioScoreSection";
import DesktopDashboard from "./components/DesktopDashboard";
import MobileContainer from "./components/MobileContainer";
import OnboardingIntro from "./components/OnboardingIntro";
import { setupGlobalClickListener } from "./utils/audio";
import { Preferences } from '@capacitor/preferences';

export default function App() {
  // 1. Core State
  // Default values coordinate to Born in 1980 -> Age 46 (as of local current time 2026)
  const [inputs, setInputs] = useState<UserInputs>({
    name: "",
    birthYear: 1980,
    gender: "man",
    currentAge: 46,
    startWorkAge: 22,
    fireAge: 62,
    fatherPassedAge: null,
    motherPassedAge: null,
    bioAnswers: {
      activity: "licht",
      sleep: "goed",
      stress: "gemiddeld",
      smoker: "nee",
      alcohol: "geen_af_en_toe",
      diet: "gemiddeld",
    },
    customLifeExpectancy: null,
  });

  const [cbsBaseLife, setCbsBaseLife] = useState<number>(80.5);
  const [apiSource, setApiSource] = useState<"CBS API" | "CBS Cohort Model">("CBS Cohort Model");
  const [isLoadingCBS, setIsLoadingCBS] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [initialOnboardingStep, setInitialOnboardingStep] = useState<number>(0);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState<boolean>(false);
  const [hasStoredData, setHasStoredData] = useState<boolean>(false);

  // 1b. Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { value: storedInputs } = await Preferences.get({ key: 'userInputs' });
        if (storedInputs) {
          setInputs(JSON.parse(storedInputs));
        }
        const { value: onboardingCompleted } = await Preferences.get({ key: 'onboardingCompleted' });
        if (onboardingCompleted === 'true') {
          setHasStoredData(true);
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      } finally {
        setIsPreferencesLoaded(true);
      }
    };
    loadPreferences();
  }, []);

  // 1c. Save preferences when inputs change
  useEffect(() => {
    if (isPreferencesLoaded) {
      Preferences.set({ key: 'userInputs', value: JSON.stringify(inputs) }).catch(console.error);
    }
  }, [inputs, isPreferencesLoaded]);

  // 2. Responsive viewport check and Global Audio
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Setup global button click sounds
    const cleanupAudio = setupGlobalClickListener();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanupAudio) cleanupAudio();
    };
  }, []);

  // 3. CBS Open Data Sync Function (Memoized to prevent recreation)
  const syncCBSLifeExpectancy = useCallback(
    async (bYear: number, gen: "man" | "vrouw", age: number) => {
      setIsLoadingCBS(true);
      try {
        const result = await getCBSLifeExpectancy(bYear, gen, age);
        // We subtract the bio-score offset from the returned final value since the api module
        // queries database and calculates base life.
        // Let's make sure we set the clean base life score!
        setCbsBaseLife(result.value);
        setApiSource(result.source);
      } catch (err) {
        console.error("Failed to fetch from CBS OData registry", err);
      } finally {
        setIsLoadingCBS(false);
      }
    },
    []
  );

  // 4. Trigger CBS Sync on key demographic changes
  // We extract primitives explicitly to respect the strict non-infinite-render useEffect guidelines
  const birthYearVal = inputs.birthYear;
  const genderVal = inputs.gender;
  const currentAgeVal = inputs.currentAge;

  useEffect(() => {
    syncCBSLifeExpectancy(birthYearVal, genderVal, currentAgeVal);
  }, [birthYearVal, genderVal, currentAgeVal, syncCBSLifeExpectancy]);

  // 5. Input update dispatch
  const handleInputChange = useCallback((updates: Partial<UserInputs>) => {
    setInputs((prev) => {
      const merged = { ...prev, ...updates };
      // Safeguard start work age and fire age limits
      if (merged.startWorkAge > merged.currentAge) {
        merged.startWorkAge = merged.currentAge;
      }
      if (merged.fireAge < merged.startWorkAge + 2) {
        merged.fireAge = merged.startWorkAge + 2;
      }
      return merged;
    });
  }, []);

  // 6. Realtime Calculations and Derived States
  const bioOffset = useMemo(() => getBioScoreOffset(inputs.bioAnswers), [inputs.bioAnswers]);
  
  // Calculate genetic hereditary offset based on parents' age of passing
  const hereditaryOffset = useMemo(() => {
    let offset = 0;
    if (inputs.fatherPassedAge !== null) {
      if (inputs.fatherPassedAge < 65) offset -= 1.5;
      else if (inputs.fatherPassedAge >= 85) offset += 1.5;
    }
    if (inputs.motherPassedAge !== null) {
      if (inputs.motherPassedAge < 65) offset -= 1.5;
      else if (inputs.motherPassedAge >= 85) offset += 1.5;
    }
    return offset;
  }, [inputs.fatherPassedAge, inputs.motherPassedAge]);

  // Total projected life is the CBS base life plus both the bio lifestyle and hereditary modifiers,
  // unless overridden by user's custom estimate.
  const projectedLifeExpectancy = useMemo(() => {
    const calculatedLifeExpectancy = cbsBaseLife + bioOffset + hereditaryOffset;
    return inputs.customLifeExpectancy !== null && inputs.customLifeExpectancy !== undefined
      ? Math.max(inputs.currentAge + 1, inputs.customLifeExpectancy)
      : calculatedLifeExpectancy;
  }, [cbsBaseLife, bioOffset, hereditaryOffset, inputs.customLifeExpectancy, inputs.currentAge]);

  const phases: LifePhases = useMemo(() => {
    const basisYears = inputs.startWorkAge;
    const accumulationYears = Math.max(0, inputs.fireAge - inputs.startWorkAge);
    const freedomYears = Math.max(0, projectedLifeExpectancy - inputs.fireAge);
    const totalYearsMax = basisYears + accumulationYears + freedomYears;

    return {
      basisYears,
      accumulationYears,
      freedomYears,
      basisPercent: (basisYears / totalYearsMax) * 100,
      accumulationPercent: (accumulationYears / totalYearsMax) * 100,
      freedomPercent: (freedomYears / totalYearsMax) * 100,
    };
  }, [inputs.startWorkAge, inputs.fireAge, projectedLifeExpectancy]);

  const handleRefreshCBSManual = useCallback(() => {
    syncCBSLifeExpectancy(inputs.birthYear, inputs.gender, inputs.currentAge);
  }, [inputs.birthYear, inputs.gender, inputs.currentAge, syncCBSLifeExpectancy]);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await Preferences.set({ key: 'onboardingCompleted', value: 'true' });
      setHasStoredData(true);
    } catch (err) {
      console.error("Failed to save onboarding state", err);
    }
    setShowOnboarding(false);
  }, []);

  const handleResetApp = useCallback(async () => {
    try {
      await Preferences.remove({ key: 'onboardingCompleted' });
      await Preferences.remove({ key: 'userInputs' });
      setHasStoredData(false);
      setInputs({
        name: "",
        birthYear: 1980,
        gender: "man",
        currentAge: 46,
        startWorkAge: 22,
        fireAge: 62,
        fatherPassedAge: null,
        motherPassedAge: null,
        bioAnswers: {
          activity: "licht",
          sleep: "goed",
          stress: "gemiddeld",
          smoker: "nee",
          alcohol: "geen_af_en_toe",
          diet: "gemiddeld",
        },
        customLifeExpectancy: null,
      });
      setInitialOnboardingStep(0);
      setShowOnboarding(true);
    } catch (err) {
      console.error("Failed to clear preferences", err);
    }
  }, []);

  // Prevent rendering until preferences are loaded
  if (!isPreferencesLoaded) {
    return (
      <div className="h-[100dvh] w-full bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D56B45]/20 border-t-[#D56B45] rounded-full animate-spin" />
      </div>
    );
  }

  // 7. Render Onboarding Screen if active
  if (showOnboarding) {
    return (
      <OnboardingIntro
        initialStep={initialOnboardingStep}
        inputs={inputs}
        hasStoredData={hasStoredData}
        onInputChange={handleInputChange}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // 8. Render Layouts based on Screen Width
  // Render Mobile Horizontally Swipeable Frame under mobile, Desktop Bento under wide screens
  if (isMobile) {
    return (
      <MobileContainer
        inputs={inputs}
        projectedLifeExpectancy={projectedLifeExpectancy}
        cbsBaseLife={cbsBaseLife}
        phases={phases}
        apiSource={apiSource}
        onInputChange={handleInputChange}
        onRestartOnboarding={(step = 0) => {
          setInitialOnboardingStep(step);
          setShowOnboarding(true);
        }}
        onResetApp={handleResetApp}
      />
    );
  }

  return (
    <DesktopDashboard
      inputs={inputs}
      projectedLifeExpectancy={projectedLifeExpectancy}
      cbsBaseLife={cbsBaseLife}
      phases={phases}
      apiSource={apiSource}
      isLoadingCBS={isLoadingCBS}
      onInputChange={handleInputChange}
      onRefreshCBS={handleRefreshCBSManual}
      onRestartOnboarding={() => setShowOnboarding(true)}
      onResetApp={handleResetApp}
    />
  );
}
