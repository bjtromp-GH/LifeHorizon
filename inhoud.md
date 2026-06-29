# Life Horizon - App Inhoud & Functionaliteit

Dit document beschrijft de functionele inhoud, gegevensstromen en de primaire schermen van de **Life Horizon** applicatie.

## 1. Concept & Doel

**Life Horizon** (voorheen LifeRunway / Levensloop & Pensioen) is ontworpen als een interactief en licht-confronterend dashboard dat gebruikers inzicht geeft in hun levensverwachting. Het doel is bewustwording creëren rondom de tijdelijkheid van het leven, de resterende tijd tot het pensioen, en hoe levensstijl de levensverwachting kan beïnvloeden.

De app visualiseert een mensenleven in **weken** (als kleine stipjes/blokjes in een 'Matrix'), waardoor een mensenleven tastbaar en inzichtelijk wordt.

## 2. Gegevensbronnen & Modellen

De levensverwachting wordt berekend op basis van een mix van objectieve statistieken en persoonlijke inschattingen:

1. **CBS API (Centraal Bureau voor de Statistiek)**
   - De app haalt de actuele resterende levensverwachting op via het CBS Open Data Portaal.
   - Hiervoor wordt gebruik gemaakt van de dataset "Overledenen; levensverwachting; geslacht, leeftijd (periode)".
   - Gegevens die hiervoor nodig zijn: Geslacht (Man/Vrouw) en Huidige Leeftijd.
2. **BioScore (Levensstijl correctie)**
   - De ruwe CBS-data wordt gecorrigeerd via een `BioScore`.
   - Elementen:
     - **Activiteit:** Weinig (-0.5 jaar), Matig (+1 jaar), Veel (+2 jaar).
     - **Slaap:** Slecht (-1 jaar), Gemiddeld (0), Goed (+1 jaar).
     - **Stress:** Veel (-1.5 jaar), Gemiddeld (0), Weinig (+1 jaar).
   - Genetica (leeftijd overlijden ouders) telt momenteel mee als mentale reflectie in de onboarding, maar de BioScore rekent voornamelijk met leefstijl.
3. **Zelf Inschatten (Custom Life Expectancy)**
   - Gebruikers kunnen ervoor kiezen om het datamodel te overrulen en zelf een verwachte eindleeftijd in te voeren.

## 3. Schermen & Flow

### 3.1 Onboarding (Eerste keer openen)
De onboarding neemt de gebruiker bij de hand via een reeks elegante schermen, begeleid door animaties en geluid.

- **Stap 0 & 1: Welkom & Introductie**
  - Introductiescherm met de app-mascotte (de Olifant).
- **Stap 2: Demografie**
  - Gebruiker vult in: Biologisch Geslacht en Geboortejaar.
  - De app toont direct de huidige leeftijd.
- **Stap 3: Levensstijl (BioScore)**
  - Drie sliders voor Activiteit, Slaap en Stress.
- **Stap 4: Genetica (Familiehistorie)**
  - Leeftijd waarop ouders zijn overleden (indien van toepassing), als moment van bewustwording.
- **Stap 5: Carrière & Pensioen**
  - Startleeftijd werken.
  - Verwachte pensioenleeftijd (FIRE age).
- **Stap 6: Klaar / Recap**
  - Korte samenvatting van de invoer. Er schiet confetti over het scherm en de Matrix wordt klaargezet.

### 3.2 Dashboard (Mobile & Desktop)
Nadat de gebruiker is ingelogd, genereert de app de "Levens-Matrix". Dit scherm is responsive en optimaliseert zichzelf voor Desktop (Bento Grid) of Mobile (Swipable Cards).

**Hoofdcomponenten op het Dashboard:**

1. **De Matrix (DecadeGrid)**
   - Een veld van stippen/blokjes. Elke stip is één week van het leven.
   - De matrix is gegroepeerd per decennium (0-9, 10-19, etc.).
   - Gekleurde stippen (groen) = Geleefde weken.
   - Grijze stippen (met outline) = Resterende weken op basis van de projectie.
2. **Resterende Tijd (RemainingTimeCard)**
   - Toont in grote, impactvolle getallen het geschatte aantal *resterende dagen*.
   - Bevat een visuele zandloper / klok-animatie.
3. **Levensfasen Balk (LifePhasesBar)**
   - Een visuele tijdlijn-balk die het leven opdeelt in de fasen: *Kinderjaren, Werken, en Pensioen / Vrijheid*.
4. **BioScore Analyzer (BioScoreSection)**
   - Toont hoeveel jaar de gebruiker heeft gewonnen (of verloren) door zijn/haar leefstijl.
5. **Aesthetic Fidelity (Settings / Privacy)**
   - Toggles om over te schakelen naar "Zelf Inschatten", privacy-modus, of de koppeling met het CBS te bekijken.
   - Reset knop om alle lokale data op het toestel te wissen.

## 4. Lokale Data Opslag

De applicatie draait volledig lokaal in de browser of webview op het toestel van de gebruiker (Local-First).
- Alle antwoorden uit de onboarding worden opgeslagen via **Capacitor Preferences** (beveiligde local storage op mobiel, gewone local storage in de browser).
- Er is geen externe database of backend waarnaar persoonlijke levensdata wordt verzonden. Privacy is 100% gegarandeerd.
