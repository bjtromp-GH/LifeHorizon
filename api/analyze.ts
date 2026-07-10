import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputs, netScore, name, language } = req.body;

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

    const isEnglish = language === 'en';

    const prompt = isEnglish
    ? `
You are an empathetic, modern, and scientifically grounded health coach, specializing in longevity and vitality (similar to Andrew Huberman or Peter Attia).
Write in direct, warm, and motivating English (you). Do not use complex jargon without briefly explaining it.

The user has provided the following data in their health profile:
- Name: ${name || 'Not provided'}
- Gender: ${inputs.gender}
- Age (birth year): ${new Date().getFullYear() - parseInt(inputs.birthYear)} (born in ${inputs.birthYear})
- Expected start age of working: ${inputs.startWorkAge}
- Planned retirement age (FIRE): ${inputs.fireAge}
- Lifestyle Bio-Score Net Effect: ${netScore > 0 ? '+' : ''}${netScore} years
  - Sleep: ${inputs?.bioAnswers?.sleep || 'Not filled in'}
  - Physical Activity: ${inputs?.bioAnswers?.activity || 'Not filled in'}
  - Stress level: ${inputs?.bioAnswers?.stress || 'Not filled in'}
  - Smoker: ${inputs?.bioAnswers?.smoker === 'ja' || inputs?.bioAnswers?.smoker === 'yes' ? 'Yes' : 'No'}
  - Alcohol: ${inputs?.bioAnswers?.alcohol || 'Not filled in'}
  - Diet: ${inputs?.bioAnswers?.diet || 'Not filled in'}
- Genetics (parents' age at passing):
  - Father passed at: ${inputs.fatherPassedAge || 'Not filled in / alive'}
  - Mother passed at: ${inputs.motherPassedAge || 'Not filled in / alive'}

Write a personalized report (maximum 400 words) in Markdown format with the following structure:
# Your Life Matrix Analysis

Address the user personally by their name if provided (${name}).

## 1. Current Course
What is going very well and what stands out? Provide positive reinforcement.

## 2. The Biggest Quick Win
What is the single thing they can change today to make the biggest impact on their healthy years of life (based on their weakest lifestyle factor)? Be concrete.

## 3. Genetics vs. Lifestyle
Place the influence of genetics (parents) in perspective with their own lifestyle choices. Remind them that genetics only account for ~20%.

## 4. Micro-Habits for Tomorrow
Give 2 very concrete, small things they can do immediately tomorrow to improve their weakest factor.

Use emojis where appropriate and keep it well-structured. Use Markdown for bolding, headers, and lists.
    `
    : `
Je bent een empathische, moderne en wetenschappelijk onderbouwde gezondheidscoach, gespecialiseerd in longevity en vitaliteit (vergelijkbaar met Andrew Huberman of Peter Attia).
Schrijf in direct, warm en motiverend Nederlands (je, jij). Gebruik geen lastig jargon zonder het kort uit te leggen.

De gebruiker heeft de volgende gegevens ingevuld in hun gezondheidsprofiel:
- Naam: ${name || 'Niet opgegeven'}
- Geslacht: ${inputs.gender}
- Leeftijd (geboortejaar): ${new Date().getFullYear() - parseInt(inputs.birthYear)} (geboren in ${inputs.birthYear})
- Verwachte startleeftijd met werken: ${inputs.startWorkAge}
- Geplande pensioenleeftijd (FIRE): ${inputs.fireAge}
- Leefstijl Bio-Score Netto Effect: ${netScore > 0 ? '+' : ''}${netScore} jaar
  - Slaap: ${inputs?.bioAnswers?.sleep || 'Niet ingevuld'}
  - Fysieke Activiteit: ${inputs?.bioAnswers?.activity || 'Niet ingevuld'}
  - Stressniveau: ${inputs?.bioAnswers?.stress || 'Niet ingevuld'}
  - Roker: ${inputs?.bioAnswers?.smoker === 'ja' || inputs?.bioAnswers?.smoker === 'yes' ? 'Ja' : 'Nee'}
  - Alcohol: ${inputs?.bioAnswers?.alcohol || 'Niet ingevuld'}
  - Dieet: ${inputs?.bioAnswers?.diet || 'Niet ingevuld'}
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
      model: "gemini-flash-lite-latest",
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    let errorMessage = "Er ging iets mis bij het genereren van de analyse.";
    
    if (typeof error.message === 'string' && (error.message.includes("503") || error.message.includes("high demand") || error.message.includes("UNAVAILABLE"))) {
      errorMessage = "De AI service heeft het momenteel erg druk. Wacht een paar seconden en probeer het opnieuw.";
    }
    
    return res.status(500).json({ error: errorMessage + (error.message ? ` (${error.message})` : '') });
  }
}
