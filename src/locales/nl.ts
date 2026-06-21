export const nl = {
  common: {
    next: "Ga verder",
    step: "Stap",
    of: "van",
    required: "Vul dit a.u.b. in",
    man: "Man",
    woman: "Vrouw",
    prevStep: "Vorige",
    nextStep: "Volgende"
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
      modalTitle: "Genetica vs. Leefstijl",
      modalDesc1: "Het feit dat beide ouders aan een ziekte zijn overleden heeft invloed op je statistische levensverwachting, maar je eigen levensloop staat niet vast.",
      modalDesc2: "Onderzoek toont aan dat levensduur voor slechts 10% tot 25% genetisch bepaald is. De overige 75% tot 90% stuur je grotendeels zelf aan met leefstijl en omgeving. Conclusie: Je DNA is de blauwdruk, maar jij bent de regisseur."
    },
    career: {
      badge: "Stap 4: Carrière & Pensioen",
      title: "Wanneer begon u met werken en wat is uw pensioendoel?",
      desc: "De splitsing tussen verplichte werktijd en absolute tijdssoevereiniteit.",
      startWork: "Startleeftijd Carrière",
      fireAge: "Doelleeftijd Pensioen",
      ageYears: "{{val}} jaar",
      yearsDiff: "{{val}} jaar"
    },
    ready: {
      badge: "Klaar om te ontdekken!",
      title: "Klaar om te ontdekken!",
      desc: "Alle factoren zijn gecompileerd. We sturen uw demografische gegevens live door naar het CBS model om uw exacte overlevingscurve te bepalen.",
      button: "Bekijk Levensmatrix",
      generating: "Eerst nog even dit..."
    },
    revealText: "We worden gemiddeld ouder dan ooit tevoren. Onze levensverwachting blijft stijgen. Maar er is een verborgen realiteit. Onze 'gezonde' levensverwachting stijgt niet in hetzelfde tempo mee. Dit betekent dat we aan het einde van ons leven gemiddeld langer kampen met chronische ziekten, vermoeidheid of beperkingen. Je doel is niet simpelweg zo oud mogelijk worden. Je ware doel is zo lang mogelijk reëel, vitaal en onafhankelijk leven. Hier draait de Bio-Score om. Neem de regie over je gezonde jaren."
  }
};
export type Translations = typeof nl;
