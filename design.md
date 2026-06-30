# Life Horizon - Design System

Dit document beschrijft de visuele identiteit, kleuren, typografie en UI-elementen van de **Life Horizon** applicatie.

## 1. Typografie

De applicatie maakt gebruik van twee primaire lettertypen, ingeladen via Google Fonts:

- **Primaire Font (Tekst & Koppen):** `Sora` (sans-serif)
  - Gekozen vanwege de moderne, strakke en licht geometrische uitstraling.
  - Gebruikte gewichten: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black).
- **Secundaire Font (Getallen & Code):** `JetBrains Mono` (monospace)
  - Wordt gebruikt voor datums, leeftijden, en statistieken (zoals de aftel-timers en percentages).
  - Gebruikte gewichten: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).

## 2. Kleurenpalet

De app maakt gebruik van een warm, aards en contrasterend kleurenpalet om een serieuze, maar uitnodigende sfeer te creëren.

### Primaire Kleuren
- **Hoofdkleur (Accent):** `#D56B45` (Roest-oranje) 
  - Gebruikt voor primaire knoppen, actieve states, iconen en de "Werken & Opbouwen" fase.
- **Donker Tekst & Elementen:** `#2D2D2D` (Zacht zwart/Donkergrijs)
  - Gebruikt voor de belangrijkste koppen, standaard tekst en de "Jeugd & Ontwikkeling" fase.

### Secundaire & Themakleuren
- **Vrijheid & Genieten (Fase 3):** `#86A789` (Saliegroen)
  - Gebruikt voor teksten, percentages en highlights gerelateerd aan de pensioen/vrijheidsfase.
- **Oranje Gradiënt (Hero):** `from-[#E25C26] via-[#D56B45] to-[#B84E29]`
  - Gebruikt als opvallende achtergrond voor welkomst- of quote schermen.

### Achtergronden
- **Standaard Achtergrond:** `#FDFDFD` (Sneeuwwit) of puur wit `bg-white`
  - Gebruikt voor kaarten en modale vensters.
- **Secundaire Achtergrond:** `#F9F8F6` (Zeer licht crème/grijs) of `#FAFAFA`
  - Gebruikt als basis achtergrondkleur voor de mobiele weergave.
- **Accent Achtergrond:** `#FAF3F0` (Heel licht oranje-getint)
  - Gebruikt voor geselecteerde knoppen, actieve tabbladen of subtiele badges.
- **Vrijheid Achtergrond:** `#86A789/[0.06]`
  - Subtiele groene achtergrond voor de vrijheidsfase kaarten.

### Grijstinten (Tekst & Randen)
- **Secundaire Tekst:** `#767676` (Middengrijs)
  - Gebruikt voor omschrijvingen, labels en subtiele informatie.
- **Randen (Borders):** `#EAEAEA` of `#E9E4E2` (Lichtgrijs)
  - Gebruikt voor scheidingslijnen en randen van ongeselecterde knoppen.

## 3. Vormgeving & UI Componenten

- **Hoeken:** Er wordt veel gebruik gemaakt van afgeronde hoeken (`rounded-xl`, `rounded-2xl` in Tailwind) voor een vriendelijke, speelse maar moderne uitstraling.
- **Schaduwen:** Subtiele slagschaduwen (`shadow-sm`, `shadow-md`, `shadow-3xs`) zorgen voor diepte en hiërarchie, waardoor elementen (zoals de onboarding kaarten) zwevend aanvoelen.
- **Animaties:** De app maakt zwaar gebruik van `framer-motion` voor micro-animaties:
  - Spring-animaties (vering) voor het inladen van schermen en modale vensters.
  - Stagger-effecten voor lijsten en tekst (zoals de "woord-voor-woord" quotes).
  - Scale-effecten op knoppen en kaarten bij hover (`scale: 1.02`) en tap (`scale: 0.98`).
- **Gevoel (Haptics):** Op mobiele apparaten vibreert de app kort (Haptic Feedback) bij het scrollen door de leeftijdkiezer of het indrukken van actieknoppen.
- **Geluid:** Een zachte 'chime' wordt afgespeeld bij het afronden van belangrijke stappen voor positieve bekrachtiging.
- **Afbeeldingen:** Iconografie uit `lucide-react` (met zachte lijnen) en sfeervolle, geoptimaliseerde `.webp` illustraties (zoals de olifant mascotte).

## 4. Layout Strategie

- **Mobile First:** De app is primair ontworpen voor mobiel gebruik. Het onboarding proces voelt als een naadloze "swipe" interface (Stories-achtig). Componenten nemen 100% breedte in beslag met royale padding (`px-4`, `px-6`).
- **Desktop:** Maakt gebruik van een "Bento Box" grid layout. De componenten zijn verdeeld over verschillende kaarten die in een strak, asymmetrisch raster passen op grote schermen.
