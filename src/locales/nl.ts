export const nl = {
  common: {
    next: "Ga verder",
    step: "Stap",
    of: "van",
    required: "Vul dit a.u.b. in",
    man: "Man",
    woman: "Vrouw"
  },
  onboarding: {
    header: "Levensloop & Pensioen",
    transition: {
      goodJob: "Goed bezig!",
      nextStep: "Door naar stap {{step}}"
    },
    splash: {
      badge: "BEPAAL JE KOERS",
      quote: "\"Confronteer je schaarste. Visualiseer je vitaliteit en levensfases.\"",
      footer: "Bereken je overgebleven tijd • CBS Cohort Model 2026"
    },
    testimonials: {
      badge: "Ervaringen",
      title1: "Wat gebruikers zeggen ",
      title2: "over onze app",
      t1_quote: "\"Het leven is kort. De LifeRunway app heeft mij echt inzicht gegeven zodat ik de juiste keuzes kan maken voordat het te laat is.\"",
      t1_author: "- Jan-Willem (42)",
      t2_quote: "\"Wow, dit is echt een nuttige app. Serieus, maar heel gaaf en interessant om inzicht te krijgen in je levensloop.\"",
      t2_author: "- Mark (50)",
      t3_quote: "\"Door het CBS model en mijn eigen leefstijlfactoren te combineren heb ik een veel beter beeld van mijn toekomst. Ik ben direct actiever gaan sporten.\"",
      t3_author: "- Sophie (35)",
      button: "Start de introductie"
    },
    welcome: {
      title: "Welkom bij uw Levensloop",
      desc: "Hoeveel soevereine tijd heeft u echt te besteden? Ontdek uw statistische levensverwachting gebaseerd op het officiële CBS cohortmodel en zet dit af tegen uw pensioenambities.",
      info: "Dit model berekent uw prognose dynamisch overlevingsstatistieken, leefstijlfactoren en genetische hereditaire aanpassingen.",
      button: "Start de Levensmeting"
    },
    demographics: {
      badge: "Stap 1: Demografie",
      title: "Wat is uw biologische basisprofiel?",
      desc: "Biologischer geslacht en geboortejaar bepalen de startprognose van het CBS cohortmodel.",
      gender: "Biologisch Geslacht",
      birthYear: "Geboortejaar",
      tapToChange: "Tik om te wijzigen",
      selectYear: "Kies a.u.b. uw geboortejaar",
      currentAge: "Huidige Leeftijd (in 2026)",
      ageYears: "{{age}} jaar",
      lifeExpectancyTitle: "Levensverwachting Instellen",
      cbsModel: "CBS model + Leefstijl",
      customModel: "Zelf inschatten",
      customDesc: "Hoe oud denkt u te worden?",
      customOverrideInfo: "Deze waarde overschrijft het biologische/CBS cohort prognosemodel in de grafieken."
    },
    lifestyle: {
      badge: "Stap 2: Bio-Score Leefstijl",
      title: "Wat zijn uw dagelijkse gewoonten?",
      desc: "Leefstijlfactoren beïnvloeden de levensverwachting met jaren winst of verlies.",
      sleep: {
        title: "Slaappatroon",
        short: "Kort (<6u)",
        moderate: "Matig (onrustig)",
        good: "Goed (7-8u)",
        optimal: "Perfect (diep)"
      },
      activity: {
        title: "Fysieke Activiteit",
        sedentary: "Zittend (kantoor)",
        light: "Lichte beweging",
        active: "Actief (sportief)",
        optimal: "Atleet / Optimaal"
      },
      stress: {
        title: "Stress / Werkdruk",
        high: "Veel stress",
        moderate: "Gemiddeld",
        balanced: "In balans",
        low: "Grootmoedig / Zen"
      },
      neutral: "Neutraal",
      yearsOffset: "{{val}} jr"
    },
    genetics: {
      badge: "Stap 3: Erfelijkheid",
      title1: "Hoe oud zijn uw biologische",
      title2: "ouders geworden?",
      desc: "Hereditaire factoren hebben een invloed op uw gezondheidstijdlijn (-1.5 tot +1.5 jaar per ouder).",
      readFirst: "Lees dit eerst",
      father: "Vader",
      mother: "Moeder",
      alive: "In leven / Neutraal",
      passed: "Overleden",
      passedAge: "Geleefde leeftijd van {{parent}}:",
      modalTitle: "Erfelijkheid & CBS",
      modalDesc1: "Het basale CBS Cohort model gaat uit van gemiddelden. Voor individuele nauwkeurigheid rekenen wij een compensatiefactor voor de leeftijd waarop biologische ouders (natuurlijk) zijn overleden.",
      modalDesc2: "We snappen dat dit confronterend of gevoelig kan zijn. U kunt dit ook op 'In leven / Neutraal' laten staan. Ouders jonger overleden dan 65 jaar geeft een lichte penalty (-1.5jr), ouders ouder dan 85 een bonus (+1.5jr)."
    },
    career: {
      badge: "Stap 4: Carrière",
      title: "Wanneer bent u financieel vrij?",
      desc: "Vanaf welke leeftijd ging u fulltime werken en vanaf welke leeftijd hoopt u (vroeg) met pensioen te kunnen?",
      startWork: "Start Werkend Leven",
      fireAge: "Doel: Pensioen / F.I.R.E.",
      ageYears: "{{val}} jaar",
      yearsDiff: "{{val}} werkende jaren"
    },
    ready: {
      badge: "Analyse Compleet",
      title: "Uw levensplan staat klaar.",
      desc: "Wij hebben uw prognose berekend. Ga door naar het dashboard voor uw gepersonaliseerde inzichten.",
      button: "Bekijk Levensmatrix",
      generating: "Matrix Genereren..."
    }
  }
};
export type Translations = typeof nl;
