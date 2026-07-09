import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputs, netScore, name } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || process.env["Gemini API Key"] || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "De GEMINI_API_KEY is niet geconfigureerd op de server. Vul deze in via de Vercel Environment Variables." 
      });
    }

    // Lazy-initialize client
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'vercel-serverless-function',
        }
      }
    });

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
  - Roker: ${inputs.smoker === 'ja' ? 'Ja' : 'Nee'}
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
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    let errorMessage = "Er ging iets mis bij het genereren van de analyse.";
    
    if (typeof error.message === 'string' && (error.message.includes("503") || error.message.includes("high demand") || error.message.includes("UNAVAILABLE"))) {
      errorMessage = "De AI service heeft het momenteel erg druk. Wacht een paar seconden en probeer het opnieuw.";
    }
    
    return res.status(500).json({ error: errorMessage });
  }
}
