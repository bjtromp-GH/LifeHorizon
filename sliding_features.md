# Sliding Features Bar - Content & Icons

Voor een "marquee" of sliding features balk op de landingspagina (zoals in het screenshot) is het belangrijk om korte, krachtige steekwoorden te gebruiken. 

Hieronder vind je een overzicht van geschikte 'pills' (korte feature-teksten) inclusief suggesties voor de bijbehorende [Lucide React](https://lucide.dev/) iconen. Je kunt deze afwisselen in twee rijen die in tegengestelde richting over het scherm glijden.

## Optie A: Life Horizon (Focus op Tijd & Levensloop)
Gebruik deze set als de landingspagina puur over de *Life Horizon* app gaat.

1. **Jouw Levensmatrix** 
   - *Icoon:* `Grid` of `LayoutDashboard`
2. **Het 25/50/25 Model** 
   - *Icoon:* `PieChart`
3. **Persoonlijke Tijdlijn** 
   - *Icoon:* `Hourglass` of `Clock`
4. **Wetenschappelijk Onderbouwd** 
   - *Icoon:* `Dna` of `FlaskConical`
5. **Impact van Leefstijl** 
   - *Icoon:* `HeartPulse` of `Activity`
6. **Start je Vrijheid** 
   - *Icoon:* `Compass` of `Sun`
7. **100% Lokaal & Veilig** 
   - *Icoon:* `ShieldCheck`
8. **Geen Account Nodig** 
   - *Icoon:* `UserCheck` of `Fingerprint`

## Optie B: Financial Horizon (Focus op Financiële Onafhankelijkheid)
Gebaseerd op de teksten in jouw screenshot, perfect voor een 'Wealth Partner' of FIRE-georiënteerde app.

1. **Heldere grafieken** 
   - *Icoon:* `BarChart3` of `LineChart`
2. **Vind je genoeg** 
   - *Icoon:* `Wallet` of `Target`
3. **Plan je toekomst** 
   - *Icoon:* `Map` of `Compass`
4. **Impact van inflatie** 
   - *Icoon:* `TrendingDown` of `Activity`
5. **Balans werk & kapitaal** 
   - *Icoon:* `Scale` of `Briefcase`
6. **100% Lokaal & Veilig** 
   - *Icoon:* `ShieldCheck` of `Lock`

---

### 💡 Tip voor de implementatie (Tailwind & CSS):
Voor een soepele, oneindige animatie kun je de volgende CSS toevoegen aan je project:

```css
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}

.animate-marquee-reverse {
  animation: marquee 25s linear infinite reverse;
}
```

Maak de container breed genoeg (`w-[200%]`) en dupliceer de lijst met items erin zodat de loop naadloos is. Gebruik de primaire en secundaire kleuren uit het `design.md` document (bijv. lichtgroene icoontjes `#86A789` of oranje `#D56B45` op een witte achtergrond met een `#EAEAEA` border).
