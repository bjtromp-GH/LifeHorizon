const fs = require('fs');

const nlPath = 'src/locales/nl.ts';
const enPath = 'src/locales/en.ts';

let nlContent = fs.readFileSync(nlPath, 'utf8');
let enContent = fs.readFileSync(enPath, 'utf8');

const nlDashboard = `
    dashboard: {
      swipeHint: "Tip: Swipe naar links of rechts om tussen de 4 schermen te wisselen, of klik op de navigatieknoppen.",
      ok: "OK",
      showMenu: "Toon Menu ☰",
      restoreMenuTitle: "Herstel navigatie bar",
      config: "Configuratie",
      yearsRemaining: "{{val}} jr restant",
      born: "Geb.",
      change: "Wijzig",
      tabs: {
        runway: "1. Runway",
        matrix: "2. Matrix",
        vitality: "3. Vitaliteit",
        overview: "4. Overzicht"
      },
      nav: {
        prev: "◀ Vorige",
        next: "Volgende ▶"
      },
      explorePhases: "Verken je fases",
      deepInsight: "Diepgaand inzicht in uw levensfases",
      elephantFactTitle: "Olifantenweetje!",
      matrixTitle: "Levensmatrix",
      matrixSubtitle: "Hoe verhouden levensverwachting en gezondheid zich tot elkaar?",
      matrixDetailsBtn: "Matrix details",
      healthVsLife: "Gezondheidsduur (Healthspan) vs Levensduur (Lifespan)"
    }
  }
};`;

const enDashboard = `
    dashboard: {
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
        prev: "◀ Previous",
        next: "Next ▶"
      },
      explorePhases: "Explore phases",
      deepInsight: "In-depth insight into your life phases",
      elephantFactTitle: "Elephant Fact!",
      matrixTitle: "Life Matrix",
      matrixSubtitle: "How do life expectancy and health relate?",
      matrixDetailsBtn: "Matrix details",
      healthVsLife: "Healthspan vs Lifespan"
    }
  }
};`;

nlContent = nlContent.replace('  }\n};\nexport type Translations = typeof nl;', nlDashboard + '\nexport type Translations = typeof nl;');
enContent = enContent.replace('  }\n};\n', enDashboard);

fs.writeFileSync(nlPath, nlContent);
fs.writeFileSync(enPath, enContent);
console.log("Locales updated with dashboard section.");
