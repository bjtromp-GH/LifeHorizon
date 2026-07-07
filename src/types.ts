export type Gender = "man" | "vrouw";

export type ActivityLevel = "zittend" | "licht" | "actief" | "optimaal";
export type SleepLevel = "kort" | "matig" | "goed" | "optimaal";
export type StressLevel = "hoog" | "gemiddeld" | "balans" | "laag";

export interface BioScoreAnswers {
  activity: ActivityLevel;
  sleep: SleepLevel;
  stress: StressLevel;
}

export interface UserInputs {
  name: string;
  birthYear: number;
  gender: Gender;
  currentAge: number;
  startWorkAge: number;
  fireAge: number;
  fatherPassedAge: number | null;
  motherPassedAge: number | null;
  bioAnswers: BioScoreAnswers;
  customLifeExpectancy: number | null;
}

export interface LifePhases {
  basisYears: number;
  accumulationYears: number;
  freedomYears: number;
  basisPercent: number;
  accumulationPercent: number;
  freedomPercent: number;
}
