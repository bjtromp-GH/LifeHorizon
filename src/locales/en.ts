import { Translations } from "./nl";

export const en: Translations = {
  common: {
    next: "Continue",
    step: "Step",
    of: "of",
    required: "Please fill this in",
    man: "Man",
    woman: "Woman",
    prevStep: "Previous",
    nextStep: "Next",
    close: "Close",
    understood: "Understood",
    work: "Work",
    profile: "Profile",
    profileOf: "{{name}}'s Profile",
    retirementGoal: "Retirement Goal",
    welcome: "Welcome",
    to: "to",
    about: "Info",
    aboutApp: "About Life Horizon",
    aboutDesc: "Discover your healthy years, freedom date, and life course. Gain in-depth insight into your personal development, work phase, and total freedom.",
    privacyPolicy: "Privacy Policy",
    version: "Version"
  },
  lifeProgress: {
    completed: "Completed",
    title: "Life Progress",
    description: "You have already completed <strong className=\"text-[#D56B45]\">{{passed}}%</strong> of your predicted life. Make the best of the remaining <strong className=\"text-[#D56B45]\">{{remaining}}%</strong>."
  },
  onboarding: {
    header: "Life Course & Retirement",
    transition: {
      goodJob: "Good job!",
      goodJobName: "Good job {{name}}!",
      nextStep: "Moving to step {{step}}"
    },
    splash: {
      badge: "CHART YOUR COURSE",
      quote: "\"Discover your healthy years, freedom date and life course.\"",
      footer: "Calculate your remaining time • CBS Model 2026",
      startBtn: "Discover Your Life Course"
    },
    name: {
      badge: "Your Name",
      title: "Hello, I am the\nLife Horizon Elephant!",
      desc: "What is your first name?",
      placeholder: "Enter your name...",
      button: "Nice to meet you",
      greeting: "Hi {{name}}!",
      greetingSub1: "Nice to meet you!",
      greetingSub2: "Let's explore your life course..."
    },
    privacy: {
      badge: "100% Private",
      title: "Your data is yours",
      desc1: "All your data is stored locally on this device only. You don't need an account and nothing goes to a server.",
      desc2: "This app is completely free of ads and tracking. Your time is precious and personal.",
      button: "Start introduction"
    },
    why: {
      badge: "Why",
      title: "Why we built this?",
      desc1: "People often live as if they have infinite time.",
      desc2: "We postpone our dreams until 'later', until that magical moment of retirement.",
      desc3: "But when does that actually begin, and how vital will you still be?",
      button: "Continue"
    },
    testimonials: {
      badge: "Experiences",
      title1: "What users say ",
      title2: "about our app",
      t1_quote: "\"Life is short. The Life Horizon app really gave me the insights to make the right choices before it's too late.\"",
      t1_author: "- Jan-Willem (42)",
      t2_quote: "\"Wow, this is a genuinely useful app. Serious, but very cool and interesting to gain insight into your life course.\"",
      t2_author: "- Mark (50)",
      t3_quote: "\"By combining the CBS model with my lifestyle factors, I have a much better picture of my future. I started exercising right away.\"",
      t3_author: "- Sophie (35)",
      button: "Start introduction"
    },
    welcome: {
      quote: "It is not that we have a short time to live, but that we waste a lot of it.",
      author: "- Seneca",
      button: "Continue"
    },
    demographics: {
      steps: {
        intro: "Intro",
        demographics: "Demographics",
        lifestyle: "Bio-Score",
        lifestyle2: "Habits",
        genetics: "Genetics",
        career: "Career",
        ready: "Ready"
      },
      badge: "Step 1: Demographics",
      title: "What is your biological profile?",
      desc: "Biological gender and birth year determine the starting prognosis of the CBS cohort model.",
      gender: "Biological Gender",
      birthYear: "Birth Year",
      tapToChange: "Tap to change",
      selectYear: "Please select your birth year",
      chooseBirthYear: "Choose Birth Year",
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
    lifestyle2: {
      badge: "Step 3: Bio-Score Continued",
      title: "What are your other habits?",
      desc: "Smoking, alcohol, and diet strongly influence life expectancy.",
      smoker: {
        title: "Smoker",
        no: "No",
        yes: "Yes"
      },
      alcohol: {
        title: "Alcohol",
        none: "None / Occasionally",
        regular: "Regularly"
      },
      diet: {
        title: "Diet",
        healthy: "Healthy and varied",
        average: "Average / Less healthy"
      }
    },
    genetics: {
      badge: "Step 4: Heredity",
      title1: "How old did your biological",
      title2: "parents get?",
      desc: "Hereditary factors influence your health timeline <span class=\"whitespace-nowrap\">-1.5 to +1.5 years per parent.</span>",
      readFirst: "Read this first",
      father: "Father",
      mother: "Mother",
      alive: "Alive / Neutral",
      passed: "Passed away",
      passedAge: "Lived age of {{parent}}:",
      modalTitle: "Genetics vs. Lifestyle",
      modalDesc1: "Although genetics plays a role—acting as a baseline for your life expectancy—your destiny is absolutely not set in stone. Your DNA is merely the first chapter of your book; you write the rest yourself.",
      modalDesc2: "Scientific research shows that lifespan is only 10% to 25% genetically determined. This means that you are in control of the remaining 75% to 90%. With the right choices regarding lifestyle, sleep, and stress management, you can make a massive impact. Conclusion: Your DNA is the blueprint, but you are and remain the director!"
    },
    career: {
      badge: "Step 5: Career & Retirement",
      title: "When did you start working and what is your retirement goal?",
      desc: "The split between mandatory working time and absolute time sovereignty.",
      startWork: "Career Start Age",
      fireAge: "Target Retirement Age",
      ageYears: "{{val}} years",
      yearsDiff: "{{val}} years",
      workDesc: "This is the number of mandatory work years you have planned for your financial independence or retirement.",
      calcAow: "Calculate State Pension age"
    },
    ready: {
      badge: "Ready to explore!",
      interesting: "Your life course is interesting {{name}}",
      title: "Ready to explore!",
      desc: "All factors are compiled. We will route your demographic data live into the CBS model to determine your exact survival curve.",
      button: "View Life Matrix",
      generating: "Just one more thing...",
      openDashboard: "Open Dashboard"
    },
    revealText: "We are living longer than ever before. Our life expectancy continues to rise. But there is a hidden reality. Our 'healthy' life expectancy is not increasing at the same pace. This means that at the end of our lives, we suffer from chronic diseases, fatigue, or disabilities for a longer average time. Your goal is not simply to live as long as possible. Your true goal is to live a real, vital, and independent life for as long as possible. This is what the Bio-Score is all about. Take control of your healthy years."
  },
  dashboard: {
    lang: "en-US",
    swipeHint: "Tip: Swipe left or right to switch between the 4 screens, or click the navigation buttons.",
    ok: "OK",
    showMenu: "Show Menu ☰",
    restoreMenuTitle: "Restore navigation bar",
    config: "Configuration",
    yearsRemaining: "{{val}} yrs remaining",
    born: "Born",
    change: "Edit",
    tabs: {
      runway: "1. Runway",
      matrix: "2. Matrix",
      vitality: "3. Vitality",
      overview: "4. Overview"
    },
    nav: {
      prev: "Previous",
      next: "Next"
    },
    explorePhases: "Explore phases",
    deepInsight: "In-depth insight into your life phases",
    elephantFactTitle: "Elephant Fact!",
    matrixTitle: "Life Matrix",
    matrixSubtitle: "How do life expectancy and health relate?",
    matrixDetailsBtn: "Matrix details",
    healthVsLife: "Healthspan vs Lifespan",
    survivalCurveTitle: "Survival Probability Curve",
    survivalCurveDesc: "This graph shows the statistical probability of reaching certain ages, based on actuarial data. As time progresses, the curve declines faster. Every day is unique, but this gives a nice indication of the statistical expectation."
  },
  bioScore: {
    title: "Lifestyle Bio-Score",
    subtitle: "Modifiers influence prognosis by -5 to +5 years",
    netEffect: "Net effect",
    years: "years",
    activity: {
      title: "1. Physical Activity",
      sedentary: { label: "Sedentary", desc: "Minimal movement, desk job" },
      light: { label: "Lightly Active", desc: "Daily walk or mild movement" },
      active: { label: "Active", desc: "3x per week moderate sports or physical work" },
      optimal: { label: "Optimal/Strength", desc: "Frequent strength training & cardio" }
    },
    sleep: {
      title: "2. Sleep Pattern",
      short: { label: "< 6 hours", desc: "Chronic sleep deprivation or poor quality" },
      moderate: { label: "6 - 7 hours", desc: "Regularly too little, often rushed" },
      good: { label: "7 - 8 hours", desc: "Variably adequate rest and quality" },
      optimal: { label: "Consistently good", desc: "8 hours deep restorative sleep" }
    },
    stress: {
      title: "3. Stress / Workload",
      high: { label: "High", desc: "Chronic pressure, weekly overstimulation" },
      moderate: { label: "Average", desc: "Healthy stress with peaks, good recovery" },
      balanced: { label: "Good balance", desc: "Sense of control and relaxation" },
      low: { label: "Low / Zen", desc: "Deep rest, little external pressure" }
    },
    smoker: {
      title: "4. Smoker",
      no: { label: "No", desc: "Non-smoker or quit" },
      yes: { label: "Yes", desc: "Regular smoker" }
    },
    alcohol: {
      title: "5. Alcohol",
      none: { label: "None / Occasional", desc: "Rarely up to max 1-2 per week" },
      regular: { label: "Regularly", desc: "Regularly, multiple glasses per week" }
    },
    diet: {
      title: "6. Diet",
      healthy: { label: "Healthy", desc: "Fresh, unprocessed, lots of vegetables" },
      average: { label: "Average", desc: "Often processed food or high sugar" }
    }
  },
  cards: {
    consumedVsRemaining: {
      title: "Consumed / Remaining",
      badge: "Focus: Time",
      realised: "Realised",
      remaining: "Remaining (Prog.)",
      yr: "yr.",
      weeks: "weeks",
      days: "days",
      orbitPassed: "Based on your age, <span class=\"font-semibold text-[#2D2D2D]\">{{pct}}%</span> of your statistical life orbit has passed."
    },
    vitality: {
      title: "Vitality & Life Gain",
      badge: "Bio-Score",
      lifestyleImpact: "Lifestyle Impact",
      yearsGain: "years gained",
      yearsLoss: "years lost",
      description: "Your choices regarding sleep, stress, and sports alter the prognosis compared to the CBS baseline.",
      cbsBase: "CBS cohort baseline:",
      genetics: "Familial genetics (father/mother):",
      lifestyle: "Lifestyle (Bio-Score):",
      custom: "Customized (overrule):",
      totalExpected: "Total Expected Age:"
    },
    career: {
      title: "Career Runway",
      badge: "Active",
      start: "Start:",
      completed: "completed",
      goal: "Goal:",
      worked: "Worked",
      years: "years",
      remaining: "Remaining",
      description: "<span class=\"font-semibold text-[#2D2D2D]\">{{remaining}} years</span> left working until your chosen retirement age of {{fireAge}} years."
    },
    horizon: {
      title: "The Untamed Horizon (Freedom Harvest)",
      badge: "Maximum Time Independence",
      totalFreedom: "Total Life Freedom",
      activeYears: "active years",
      freedomDesc: "The number of years you can make sovereign decisions after your planned retirement age.",
      reservedFreedom: "Reserved Freedom",
      reservedDesc: "The total stock of unconditional freedom weeks you statistically have ahead.",
      unrealized: "Freedom yet to be realized",
      toGo: "to go",
      unrealizedDesc: "Weeks fully remaining after retirement (based on your current age)."
    }
  },
  lifePhasesBar: {
    title: "Life Course & Marker",
    self: "Custom:",
    yr: "yr",
    adjustFull: "Adjust life expectancy",
    adjustShort: "Adjust",
    currentAgeFull: "Current Age:",
    currentAgeShort: "Age:",
    years: "years",
    overrideTitle: "Override custom life expectancy:",
    restoreModel: "Restore model",
    cbsModelText: "Currently set to the dynamic CBS Cohort model + lifestyle modifiers.",
    customModelText: "Expected age set manually. This overrides the CBS prognosis.",
    development: "Development",
    work: "Work",
    freedom: "Freedom",
    startWork: "Start Work",
    retirement: "Retirement",
    harvestPhase: "HARVEST PHASE",
    freedomRetirement: "Freedom (Retirement)",
    phase1Desc: "The phase of physical and mental growth, education, and discovering talents. Time is primarily invested in learning and development, with relatively few financial obligations or income.",
    phase2Desc: "The active working life. The focus is on building a career, accumulating wealth (money, network, skills), and bearing responsibilities. This lays the foundation for financial independence.",
    phase3Desc: "The harvest phase. Work has become optional thanks to accumulated wealth (pension). The emphasis shifts to meaning, enjoyment, spending time with loved ones, and pursuing personal passions in good health."
  },
  decadeGrid: {
    title: "{{name}}'s Life Matrix",
    development: "Development",
    work: "Work",
    freedom: "Freedom",
    yr: "yr",
    currentAgeMarker: " (Current age!)",
    analysisBtn: "Life Matrix Analysis",
    analysisSubtitle: "View the insights and meaning behind your matrix",
    healthyMatrixBtn: "Healthy Life Expectancy Matrix",
    currentPositionTitle: "Your Current Position",
    currentPositionDesc: "You are here in the life matrix! This block marks your current age. The color indicates which phase of your life you are currently in: Development, Work, or Freedom.",
    livedPercentage: "You have lived <span class=\"font-mono\">{{pct}}%</span> of your life!",
    analysisDesc: "This analysis shows that <strong>{{freePct}}%</strong> of your projected life is spent in complete freedom, provided you stop working at <strong>{{fireAge}}</strong>. This means that after your building and working phase, you still have a significant part of the matrix at your free disposal. Make sure your vitality remains optimal in this final phase by making the right lifestyle choices now!",
    close: "Close"
  },
  healthyMatrixModal: {
    title: "Healthy Life Expectancy Matrix",
    subtitle: "The difference between lifespan and 'healthspan'. We are living longer on average, but unfortunately our healthy years are not growing at the same rate.",
    men: "Men",
    women: "Women",
    yearsTotal: "years total",
    healthyYears: "Healthy years",
    yearsWithComplaints: "Years with complaints",
    hiddenRealityTitle: "The hidden reality",
    hiddenRealityDesc: "We are living longer on average, but our <em>healthy</em> life expectancy is not increasing as fast. This means that at the end of our lives we average about 15 to 18 years struggling with chronic diseases and limitations. <strong>With the Life Horizon Bio-Score you can take action yourself to close that gap!</strong>",
    close: "Close"
  },
  desktopDashboard: {
    subtitle: "Discover your healthy years, freedom date and life course.",
    restartIntroTitle: "Restart the animated introduction",
    intro: "Introduction",
    syncTitle: "Synchronize with CBS Open Data",
    sync: "Sync CBS",
    yearsRemaining: "Years Remaining",
    footerText: "© 2026 Life Horizon — Time, Air & Vitality"
  },
  statsCard: {
    popups: {
      prognosisTitle: "Prognosis Age",
      prognosisDesc: "This is your statistical life expectancy. It starts with a base expectation from the CBS cohort model, including a survival bonus for your current age. Then it is corrected based on your personal Bio-Score (lifestyle) and any genetics.",
      remainingTitle: "Remaining Time",
      remainingDesc: "This is the time you statistically have left on earth, calculated from your current age to your prognosis age. Think of this as your remaining 'budget' of time to do the things you find important.",
      workingTitle: "Working Years",
      workingDesc: "This is the time you will still spend on the building and working phase of your life. This ends at your chosen retirement age.",
      freedomTitle: "Freedom",
      freedomDesc: "This is your free time (the 'harvest phase') without financial obligations, calculated from your retirement age to your prognosis age. In this phase you can spend your time completely at your own discretion.",
      progressTitle: "Life Progress",
      progressDesc: "This shows what percentage of your expected life has already been completed. It helps to put your time into perspective and be conscious of the time you have left."
    },
    years: "years",
    calibratedWith: "Calibrated with:",
    remainingBudget: "Your remaining budget on earth.",
    freedomAchieved: "Retirement / Freedom already achieved!",
    phaseEndsAt: "Phase ends at age {{age}}",
    harvestPhase: "The ultimate harvest phase of your life."
  },
  mobileContainer: {
    overviewTitle: "{{name}}Your expected lifespan of <span class=\"font-bold text-white\">{{years}} years</span> contains approx. <span class=\"font-bold text-white\">{{weeks}} weeks</span>. Each block in the matrix represents a unique week.",
    overviewDesc: "The color distribution (Development, Work, Freedom) shifts along with your personal Bio-Score!",
    continueBtn: "Let's continue",
    adjustBtn: "Adjust",
    nextBtn: "Continue",
    conclusion: {
      title: "Intermediate Conclusion & Reflection",
      subtitle: "Your CBS Life Runway summarized in a<br />sovereign way.",
      estLifeSpan: "Estimated Life Expectancy",
      remainingTime: "Remaining Time Perspective",
      weeksLeft: "approx. {{weeks}} meaningful weeks left",
      youth: "Youth",
      work: "Work",
      freedom: "Freedom",
      viewMatrix: "View Life Matrix",
      viewMatrixDesc: "View your personal life course in detail",
      currentAge: "Current Age:",
      activeCareer: "Active Career<br/>until {{age}} yr:",
      yearsLeft: "{{years}} years left",
      freeHorizon: "Free Horizon (Freedom Harvest):",
      slides: {
        summers: "{{count}} summers left",
        coffees: "{{count}} morning coffees left",
        sunsets: "{{count}} sunsets left",
        weekends: "{{count}} weekends left"
      }
    },
    modelsTitle: "Normal Life vs. The Optimal Model",
    modelsDesc: "Let's take a look at the life progress bar of a normal life. You start working at 20, you work until 69 and die at 80 years. This is your life:",
    tablePhase: "Life Phase",
    tableAge: "Age",
    tableYears: "Years",
    tableTotal: "Total",
    youthPhase: "Youth & Development",
    workPhase: "Working life",
    freePhase: "Free time / Retirement",
    totalLabel: "Total",
    modelInspiration1: "As inspiration, we propose an optimal model: ",
    modelInspiration2: "The 25 / 50 / 25 model.",
    modelYouth: "of your life youth & development",
    modelWork: "of your life working",
    modelFree: "life in freedom",
    normalLife: "Normal Life",
    optimalModel: "The 25 / 50 / 25 Model",
    working: "Working",
    modelExplainedTitle: "The 25 / 50 / 25 Model Explained",
    modelExplainedDesc: "This model suggests dividing your life into three clear and balanced phases. Assuming a projected life expectancy of {{age}} years, this looks like this for you:",
    youthTitle: "Youth & Development",
    youthDesc: "The first quarter of your life is all about playing, learning and developing yourself. Here you lay the foundation for the rest of your journey.",
    workTitle: "Working & Building",
    workDesc: "The core phase. You work on your career, build wealth and invest. This 50% must be used efficiently so that you can live the last phase in freedom.",
    freeTitle: "Freedom & Enjoyment",
    freeDesc: "Complete financial independence. Time for yourself, family, travel and passions, without the obligation to work for money anymore.",
    financialRunwayTitle: "Your Financial Horizon",
    financialRunwayQuote: "\"It is not that we have a short time to live, but that we waste a lot of it.\"",
    financialRunwayAuthor: "- Seneca",
    financialRunwayQuestion: "Want to know how to achieve the 25 / 50 / 25 model or better?",
    financialRunwayDesc: "We have built another app that helps you map out your financial horizon and achieve your goals: the Financial Horizon app.",
    financialRunwayPromo: "Discover how you build the necessary years to be able to retire earlier and experience more freedom in your life.",
    visitWebsite: "Visit the website",
    configTitle: "Onboarding Configuration",
    configSubtitle: "Change your entered life course parameters here",
    basicProfile: "1. Basic Profile",
    modifiersTitle: "2. Vitality & Lifestyle Modifiers",
    cbsPrognosis: "Current CBS Cohort prognosis:",
    yearsOld: "years old",
    compiledBasedOn: "Compiled based on your active lifestyle score and hereditary parameters.",
    showMatrix: "Show Life Matrix",
    mascotTitle: "Mascot",
    mascotDesc: "Did you know that an elephant normally has a life expectancy of 50-70 but in ideal conditions such as in a zoo can live up to 80 years? Hence the mascot for our app!",
    matrixTitle: "Your Life Matrix",
    freedomHeroTitle: "Freedom",
    freedomHeroQuote1: "Freedom is not stopping work,",
    freedomHeroQuote2: "but starting to choose."
  },
  onboardingPanel: {
    personalYardstick: "Personal Yardstick",
    calibrateLifeSpan: "Set your basic parameters to calibrate your lifespan",
    birthYear: "Birth Year",
    gender: "Gender",
    manStat: "Man (Statistically shorter)",
    womanStat: "Woman (Statistically longer)",
    currentAge: "Current Age (Corrected)",
    calculated: "calculated:",
    startWorkAge: "Start Age Working",
    whenDidYouStart: "When did you start working?",
    targetRetirementAge: "Target Retirement Age",
    whenStartsFreedom: "When does the freedom phase start?",
    hereditaryFactors: "6. Heredity (Parents' Lifespan)",
    hereditaryDesc: "Hereditary factors adjust the prognosis by -1.5 to +1.5 years per parent.",
    father: "Father",
    mother: "Mother",
    aliveNeutral: "Alive / Neutral",
    passedAway: "Passed Away",
    ageOfPassing: "Age of passing:",
    years: "years",
    yr: "yr",
    neutral: "Neutral"
  }
};
