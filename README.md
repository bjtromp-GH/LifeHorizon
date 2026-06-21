# Life Runway

Welkom bij **Life Runway**, een webapplicatie gebouwd met React, TypeScript en Tailwind CSS. De app is ontworpen om inzicht te geven in je levensverwachting, je gezonde levensjaren (Bio-Score) en hoe je je leven kunt inrichten via het **25 / 50 / 25 Model**.

## 🚀 Kenmerken & Functionaliteiten

De applicatie begeleidt gebruikers door een interactieve "onboarding" flow en een dashboard met visualisaties van hun leven.

- **Introductiescherm**: Een boeiende typmachine-animatie die de gebruiker bewust maakt van het verschil tussen levensverwachting en *gezonde* levensverwachting.
- **Interactieve Slider (Levensverwachting & Bio-Score)**: Gebruikers kunnen hun huidige leeftijd invullen en hun geprognotiseerde levensverwachting zien. 
- **De Levensmatrix (Decade Grid)**: Een visuele representatie van een heel leven in blokjes (weken/maanden/jaren), waarbij in één oogopslag te zien is welk deel van het leven al is voltooid en hoeveel gezonde versus ongezonde jaren er resteren.
- **Tussentijdse Conclusie & Reflectie**: Een overzichtspagina die stilstaat bij de Bio-Score en benadrukt hoe belangrijk het is om de regie te nemen over gezonde jaren.
- **Het 25 / 50 / 25 Model**: Een filosofie die stelt dat je je leven het beste in balans kunt brengen met 25% jeugd & ontwikkeling, 50% werken & opbouwen en 25% vrijheid & genieten. Dit wordt dynamisch berekend op basis van de levensverwachting.
- **Financiële Runway Promo**: Een verwijzing naar de vervolgapplicatie die helpt bij het financieel plannen van dit ideale model.

## 🛠 Tech Stack

- **React** (met Vite als bundler)
- **TypeScript** voor type-safety
- **Tailwind CSS** voor vlotte en responsieve styling
- **Framer Motion** (`motion/react`) voor soepele animaties en scherm-overgangen
- **Lucide React** voor schaalbare iconen

## 📂 Projectstructuur

De belangrijkste bestanden in de `src/` map zijn:

- `App.tsx`: Het hoofdbestand dat de applicatie laadt en de state beheert voor de verschillende flows (zoals onboarding en het hoofdmenu).
- `components/MobileContainer.tsx`: De "hart" van de applicatie. Dit bestand beheert de weergave van de verschillende slides/schermen in de interactieve flow (van de introductie tot de promotie van de Financiële Runway).
- `components/ScrollRevealText.tsx`: De geanimeerde openingsscherm-component.
- `components/DecadeGrid.tsx`: Een visueel en rekenkundig complexe component die de jaren en maanden in rasters (grids) en voortgangsbalken laat zien.
- `components/LifeProgressBar.tsx`: De voortgangsbalk van het leven.

## 🏃‍♂️ Lokaal Draaien

Om dit project lokaal te draaien, installeer je de afhankelijkheden en start je de development server:

```bash
# 1. Installeer dependencies
npm install

# 2. Start de development server
npm run dev

# 3. Bouw de applicatie voor productie
npm run build
```

## 🎨 Design en Layout

Het design is **mobile-first** opgezet maar ziet er ook op desktop prachtig uit dankzij responsieve Tailwind klassen (`sm:`, `md:`, `lg:`). De app maakt veel gebruik van warme, aardse kleuren (zoals oranje `#D56B45` en groen `#86A789`) gecombineerd met moderne, cleane lettertypes. Er is veel aandacht besteed aan soepele *scroll* en *fade* animaties met behulp van Framer Motion.