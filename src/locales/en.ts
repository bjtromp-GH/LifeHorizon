import { Translations } from "./nl";

export const en: Translations = {
  common: {
    next: "Continue",
    step: "Step",
    of: "of",
    required: "Please fill this in",
    man: "Man",
    woman: "Woman"
  },
  onboarding: {
    header: "Life Course & Retirement",
    transition: {
      goodJob: "Great job!",
      nextStep: "On to step {{step}}"
    },
    splash: {
      badge: "CHART YOUR COURSE",
      quote: "\"Confront your scarcity. Visualize your vitality and life phases.\"",
      footer: "Calculate your remaining time • CBS Cohort Model 2026"
    },
    testimonials: {
      badge: "Experiences",
      title1: "What users say ",
      title2: "about our app",
      t1_quote: "\"Life is short. The LifeRunway app really gave me the insights to make the right choices before it's too late.\"",
      t1_author: "- Jan-Willem (42)",
      t2_quote: "\"Wow, this is a genuinely useful app. Serious, but very cool and interesting to gain insight into your life course.\"",
      t2_author: "- Mark (50)",
      t3_quote: "\"By combining the CBS model with my lifestyle factors, I have a much better picture of my future. I started exercising right away.\"",
      t3_author: "- Sophie (35)",
      button: "Start introduction"
    },
    welcome: {
      title: "Welcome to your Life Course",
      desc: "How much sovereign time do you really have left? Discover your statistical life expectancy based on the official CBS cohort model and compare it against your retirement ambitions.",
      info: "This model dynamically calculates your prognosis based on survival statistics, lifestyle factors, and hereditary adjustments.",
      button: "Start the Measurement"
    },
    demographics: {
      badge: "Step 1: Demographics",
      title: "What is your biological profile?",
      desc: "Biological gender and birth year determine the starting prognosis of the CBS cohort model.",
      gender: "Biological Gender",
      birthYear: "Birth Year",
      tapToChange: "Tap to change",
      selectYear: "Please select your birth year",
      currentAge: "Current Age (in 2026)",
      ageYears: "{{age}} years",
      lifeExpectancyTitle: "Set Life Expectancy",
      cbsModel: "CBS model + Lifestyle",
      customModel: "Estimate yourself",
      customDesc: "How old do you think you'll get?",
      customOverrideInfo: "This value overrides the biological/CBS cohort prognosis model in the charts."
    },
    lifestyle: {
      badge: "Step 2: Bio-Score Lifestyle",
      title: "What are your daily habits?",
      desc: "Lifestyle factors influence life expectancy by adding or subtracting years.",
      sleep: {
        title: "Sleep Pattern",
        short: "Short (<6h)",
        moderate: "Moderate (restless)",
        good: "Good (7-8h)",
        optimal: "Perfect (deep)"
      },
      activity: {
        title: "Physical Activity",
        sedentary: "Sedentary (desk)",
        light: "Light activity",
        active: "Active (sports)",
        optimal: "Athlete / Optimal"
      },
      stress: {
        title: "Stress / Workload",
        high: "High stress",
        moderate: "Average",
        balanced: "Balanced",
        low: "Zen / Low"
      },
      neutral: "Neutral",
      yearsOffset: "{{val}} yr"
    },
    genetics: {
      badge: "Step 3: Heredity",
      title1: "How old did your biological",
      title2: "parents get?",
      desc: "Hereditary factors influence your health timeline (-1.5 to +1.5 years per parent).",
      readFirst: "Read this first",
      father: "Father",
      mother: "Mother",
      alive: "Alive / Neutral",
      passed: "Passed away",
      passedAge: "Lived age of {{parent}}:",
      modalTitle: "Heredity & CBS",
      modalDesc1: "The baseline CBS Cohort model assumes averages. For individual accuracy, we apply a compensation factor for the age at which biological parents (naturally) passed away.",
      modalDesc2: "We understand this can be confronting or sensitive. You can leave this at 'Alive / Neutral'. Parents passing away younger than 65 yields a slight penalty (-1.5yr), parents living past 85 give a bonus (+1.5yr)."
    },
    career: {
      badge: "Step 4: Career",
      title: "When are you financially free?",
      desc: "At what age did you start working full-time, and at what age do you hope to retire (early)?",
      startWork: "Start Working Life",
      fireAge: "Goal: Retirement / F.I.R.E.",
      ageYears: "{{val}} years",
      yearsDiff: "{{val}} working years"
    },
    ready: {
      badge: "Analysis Complete",
      title: "Your life plan is ready.",
      desc: "We have calculated your prognosis. Continue to the dashboard for your personalized insights.",
      button: "View Life Matrix",
      generating: "Generating Matrix..."
    }
  }
};
