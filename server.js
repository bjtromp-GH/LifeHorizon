import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { inputs, netScore, name } = req.body;

    const prompt = `
Je bent een empathische, moderne en wetenschappelijk onderbouwde gezondheidscoach, gespecialiseerd in longevity en vitaliteit (vergelijkbaar met Andrew Huberman of Peter Attia).
Schrijf in direct, warm en motiverend Nederlands (je, jij). Gebruik geen lastig jargon zonder het kort uit te leggen.

De gebruiker heeft de volgende gegevens ingevuld in hun gezondheidsprofiel:
- Naam: ${name || 'Niet opgegeven'}
- Geslacht: ${inputs.gender}
- Leeftijd (geboortejaar): ${new Date().getFullYear() - parseInt(inputs.birthYear)} (geboren in ${inputs.birthYear})
- Verwachte startleeftijd met werken: ${inputs.startWorkAge}
- Geplande pensioenleeftijd (FIRE): ${inputs.fireAge}
- Leefstijl Bio-Score Netto Effect: ${netScore > 0 ? '+' : ''}${netScore} jaar
  - Slaap: ${inputs.sleep}
  - Fysieke Activiteit: ${inputs.activity}
  - Stressniveau: ${inputs.stress}
  - Roker: ${inputs.smoker === 'yes' ? 'Ja' : 'Nee'}
  - Alcohol: ${inputs.alcohol}
  - Dieet: ${inputs.diet}
- Genetica (leeftijd ouders):
  - Vader overleden op: ${inputs.fatherPassedAge || 'Niet ingevuld / in leven'}
  - Moeder overleden op: ${inputs.motherPassedAge || 'Niet ingevuld / in leven'}

Schrijf een persoonlijk rapport (maximaal 400 woorden) in Markdown formaat met de volgende structuur:
# Jouw Levensmatrix Analyse

Spreek de gebruiker persoonlijk aan met hun naam als deze is ingevuld (${name}).

## 1. Huidige Koers
Wat gaat er heel goed en wat valt op? Geef positieve bekrachtiging.

## 2. De Grootste Winstpakker
Wat is het ene ding dat ze vandaag kunnen veranderen om de grootste impact te maken op hun gezonde levensjaren (gebaseerd op hun zwakste leefstijlfactor)? Wees concreet.

## 3. Genetica vs. Leefstijl
Plaats de invloed van genetica (ouders) in perspectief tot hun eigen leefstijlkeuzes. Herinner ze eraan dat genetica maar voor ~20% bepalend is.

## 4. Micro-Habits voor Morgen
Geef 2 hele concrete, kleine dingen die ze morgen direct kunnen doen om hun zwakste factor te verbeteren.

Gebruik emojis waar passend en hou het overzichtelijk. Gebruik Markdown voor bolding, headers, en lijstjes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({ error: 'Er ging iets mis bij het genereren van de analyse.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
