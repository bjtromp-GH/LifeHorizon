export type Gender = "man" | "vrouw";

export type ActivityLevel = "zittend" | "licht" | "actief" | "optimaal";
export type SleepLevel = "kort" | "matig" | "goed" | "optimaal";
export type StressLevel = "hoog" | "gemiddeld" | "balans" | "laag";

export type SmokerLevel = "ja" | "nee";
export type AlcoholLevel = "geen_af_en_toe" | "regelmatig";
export type DietLevel = "gezond" | "gemiddeld";

export interface BioScoreAnswers {
  activity: ActivityLevel;
  sleep: SleepLevel;
  stress: StressLevel;
  smoker: SmokerLevel;
  alcohol: AlcoholLevel;
  diet: DietLevel;
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
