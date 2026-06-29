# Life Horizon - Design System

Dit document beschrijft de visuele identiteit, kleuren, typografie en UI-elementen van de **Life Horizon** applicatie.

## 1. Typografie

De applicatie maakt gebruik van twee primaire lettertypen, ingeladen via Google Fonts:

- **Primaire Font (Tekst & Koppen):** `Sora` (sans-serif)
  - Gekozen vanwege de moderne, strakke en licht geometrische uitstraling.
  - Gebruikte gewichten: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).
- **Secundaire Font (Getallen & Code):** `JetBrains Mono` (monospace)
  - Wordt gebruikt voor datums, leeftijden, en statistieken (zoals de aftel-timers en percentages).
  - Gebruikte gewichten: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).

## 2. Kleurenpalet

De app maakt gebruik van een warm, aards en contrasterend kleurenpalet om een serieuze, maar uitnodigende sfeer te creëren.

### Primaire Kleuren
- **Hoofdkleur (Accent):** `#D56B45` (Roest-oranje) 
  - Gebruikt voor primaire knoppen, actieve states, iconen en belangrijke highlights.
- **Donker Tekst & Elementen:** `#2D2D2D` (Zacht zwart/Donkergrijs)
  - Gebruikt voor de belangrijkste koppen en standaard tekst.

### Achtergronden
- **Standaard Achtergrond:** `#FDFDFD` (Sneeuwwit)
  - Gebruikt voor kaarten en modale vensters.
- **Secundaire Achtergrond:** `#F9F8F6` (Zeer licht crème/grijs)
  - Gebruikt als basis achtergrondkleur voor de mobiele weergave (mobile viewport root).
- **Accent Achtergrond:** `#FAF3F0` (Heel licht oranje-getint)
  - Gebruikt voor geselecteerde knoppen, actieve tabbladen of subtiele badges.

### Grijstinten (Tekst & Randen)
- **Secundaire Tekst:** `#767676` (Middengrijs)
  - Gebruikt voor omschrijvingen, labels en subtiele informatie.
- **Randen (Borders):** `#EAEAEA` of `#E9E4E2` (Lichtgrijs)
  - Gebruikt voor scheidingslijnen en randen van ongeselecterde knoppen.

### Matrix & Status Kleuren
In de Matrix en voortgangsbalken worden specifieke kleuren gebruikt voor de levensfasen:
- **Verleden (Geleefde tijd):** Groen-tinten (`#10B981` / Tailwind `emerald-500`)
- **Toekomst (Resterende tijd):** Grijstinten (`#E5E7EB` of leeg met een lichte border)
- **Specifieke Fasen:**
  - *Kinderjaren:* Pastelgroen / Blauw
  - *Werken:* Blauw (`#3B82F6` / Tailwind `blue-500`) of het Primaire oranje
  - *Pensioen:* Goud / Geel (`#F59E0B` / Tailwind `amber-500`)

## 3. Vormgeving & UI Componenten

- **Hoeken:** Er wordt veel gebruik gemaakt van afgeronde hoeken (`rounded-lg`, `rounded-xl`, `rounded-2xl` in Tailwind) voor een vriendelijke uitstraling.
- **Schaduwen:** Subtiele slagschaduwen (`shadow-sm`, `shadow-md`) zorgen voor diepte en hiërarchie, waardoor elementen (zoals de Bento-grid kaarten) zwevend aanvoelen.
- **Animaties:** De app maakt zwaar gebruik van `framer-motion` voor micro-animaties:
  - Spring-animaties (vering) voor het inladen van schermen.
  - Stagger-effecten voor lijsten.
  - Scale-effecten op knoppen bij hover (`scale: 1.02`) en tap (`scale: 0.98`).
- **Gevoel (Haptics):** Op mobiele apparaten vibreert de app kort (Haptic Feedback) bij het scrollen door de leeftijdkiezer of het indrukken van knoppen.
- **Geluid:** Een zachte 'chime' wordt afgespeeld bij het afronden van belangrijke stappen (zoals de onboarding) voor positieve bekrachtiging.

## 4. Mobile First vs. Desktop

- **Mobile:** Bestaat uit één naadloze "swipe" interface of een verticaal scrollende feed. Componenten nemen 100% breedte in beslag.
- **Desktop:** Maakt gebruik van een "Bento Box" grid layout. De componenten zijn verdeeld over verschillende kaarten die in een strak, asymmetrisch raster passen.
