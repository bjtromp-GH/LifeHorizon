# Life Runway - Design Systeem

Dit document beschrijft de visuele identiteit, kleuren, typografie en UI-componenten die gebruikt zijn in de **Life Runway** applicatie. Het doel van dit design systeem is om een consistente, rustige en tegelijkertijd overtuigende gebruikerservaring (UX) te bieden.

## 🎨 Kleurenpalet

De applicatie maakt gebruik van aardse, warme kleuren die rust uitstralen maar toch activerend werken. Er wordt gewerkt met hard-coded HEX-waarden in Tailwind-klassen.

### Primaire Kleuren
- **Oranje (Actie & Energie):** `#D56B45`
  - *Hover status:* `#C0562F`
  - *Wordt gebruikt voor:* Hoofdknoppen (Ga verder), voortgangsbalken, accentkleuren, "Werk" of "Actie" labels.
- **Groen (Vrijheid & Gezondheid):** `#86A789`
  - *Hover status:* `#729275`
  - *Wordt gebruikt voor:* Knoppen ("Ontwerp mijn plan", "Bezoek de website"), "Vrijheid / Pensioen" aanduidingen, vitale onderdelen.

### Achtergronden
- **Sand / Off-White (Basis Achtergrond):** `#F9F8F6`
  - *Wordt gebruikt voor:* De primaire achtergrond van de mobiele weergave en kaarten. Het voorkomt de hardheid van spierwit en geeft een zachte 'papieren' uitstraling.
- **Card Achtergrond (Zeer Licht):** `#FAF9F8` of `bg-white`
- **Border Kleur:** `#EAEAEA` of `#EAE8E4`

### Tekstkleuren
- **Zwart / Donkergrijs (Primaire Tekst):** `#2D2D2D`
  - *Wordt gebruikt voor:* Koppen (H1, H2, H3) en belangrijke platte tekst.
- **Middengrijs (Secundaire Tekst):** `#767676`
  - *Wordt gebruikt voor:* Ondertitels, uitleg, kleine labels en data.

### Gradients
- **Introductie Animatie Gradient:** `from-[#E25C26] to-[#B84E29]`
  - *Wordt gebruikt voor:* Het allereerste opstartscherm met de typmachine-tekst, om onmiddellijk impact te maken.

## 🔤 Typografie

De typografie leunt op twee specifieke, geïmporteerde Google Fonts. We gebruiken deze via de standaard Tailwind font-families die we in `index.css` hebben overschreven:

- **Primaire Font (Sora):** `font-sans` is gekoppeld aan de **Sora** font-family. Dit is een uiterst moderne, vriendelijke en goed leesbare schreefloze letter die overal in de app wordt gebruikt voor een heldere uitstraling.
- **Cijfers & Percentages (JetBrains Mono):** `font-mono` is gekoppeld aan **JetBrains Mono**. We gebruiken dit lettertype voor datagedreven getallen, percentages en de "levensvoortgangsbalk" voor een strakke, technische en betrouwbare look.
- **Koppen:** Vaak in **Sora** met `font-black` of `font-extrabold` in combinatie met `tracking-tight` of `tracking-tighter`.
- **Knoppen (Buttons):** Vaak in **Sora** met `font-black uppercase tracking-widest` voor maximale leesbaarheid en een premium "app" gevoel.

## 📐 Vormgeving & Spacing

- **Rondingen (Border Radius):** Grote, zachte rondingen. We gebruiken veelal `rounded-xl` (kaarten, invoervelden) en `rounded-2xl` of `rounded-3xl` voor grotere containers en knoppen.
- **Schaduwen:** Subtiel (`shadow-sm`, `shadow-md`) om diepte te creëren tussen de lichtgrijze/zandkleurige achtergrond en de witte cards. Geen harde, donkere schaduwen.
- **Spacing:** Ruime paddings (`p-6`, `p-8`) om de elementen "lucht" te geven en de content niet te benauwend over te laten komen.

## ✨ Animaties & Interacties

**Framer Motion** vormt de basis van alle animaties in de app:
- **Pagina Transities:** Schermen glijden soepel in en uit met een `AnimatePresence` `x`-as slide animatie en een vleugje opaciteit.
- **Scroll Reveal:** Op het startscherm lichten woorden één voor één op om de aandacht vast te houden (typemachine / fade-in effect).
- **Micro-interacties:** Knoppen schalen licht mee bij een hover (`scale: 1.05`) of klik (`whileTap={{ scale: 0.95 }}`) voor directe feedback.

## 📱 Responsiviteit

Het design is in de kern **Mobile First**.
- Op telefoons toont het design zich als een full-screen app-ervaring met fixed bottom-bars en dots-navigatie.
- Op grotere schermen (Desktop) centreert de weergave zich rond flexibele kolommen en worden lettergroottes responsief geschaald (`sm:text-lg`, `md:text-2xl`), zonder de leesbaarheid te verliezen in oneindig brede tekstblokken (`max-w-4xl`).
