# 📄 GLOBAL CODE QA & ARCHITECTURAL META-LEARNINGS
> **System Architecture**: Autonomous Executive & Agentic Coding System  
> **Key Thesis**: *"En matematisk perfekt kode er værdiløs, hvis den ikke overlever mødet med den fysiske virkelighed."*  
> **Status**: Living Knowledge Repository & Strategic Directives  

---

## 🏛️ 1. Det Strategiske Paradigmeskift: Fra Isolering til Hyper-Lokalisering

`GLOBAL_CODE_QA.md` demonstrerer et klassisk paradigmeskift i softwareudvikling: **Overgangen fra en teoretisk, isoleret applikation til et hyper-lokaliseret, domænespecifikt system**, der tager højde for virkelige markedsforhold, defekte API'er og brugerens fysiske geografi.

### Core Meta-Principles:
1. **Den Fysiske Virkelighed som Facit**: Koden skal fungere i brugerens fysiske hverdag (f.eks. en 7-årigs iPad på et meldækket køkkenbord eller komplekse danske elafgifter/abonnementsmodeller).
2. **Defensiv Arkitektur**: Antag altid at netværk, tredjeparts-API'er og hardware vil svigte (f.eks. port-kollisioner, udfasede API'er eller mættede netværk).
3. **Hyper-Lokalisering som USP**: Økonomi og funktion skal underordnes praktisk infrastruktur og lokal kontekst.

---

## 🛠️ 2. Arkitektonisk Defensivitet som Standard

### 💡 Læringer & Fremtidige Agent-Regler:
* **Netværk og Miljø**:
  * Antag aldrig et "rent" lokalt miljø. Agenten skal proaktivt tjekke for port-kollisioner (fx dynamisk port-tildeling via script) og håndtere miljøvariabler defensivt.
* **API Fallback-Strategi (Stale-While-Revalidate + Sane Defaults)**:
  * Ved integration af tredjeparts-API'er skal agenten altid implementere caching (`stale-while-revalidate`) og en hardcodet *"sane default"* (som 0,85 DKK/kWh eller native browser-stemmer), før brugeren overhovedet beder om det.
* **Separation of Concerns & Testsuiter**:
  * Beregningslogik og forretningsregler skal isoleres i rene moduler (f.eks. `calculator.ts` / `app.js` state managers) beskyttet af automatiserede testsuiter.

---

## 🎓 3. Domæneekspertise over Syntaks

### 💡 Læringer & Fremtidige Agent-Regler:
* **Forretningslogik vs. Rå Kode**:
  * Den sværeste del af et system er sjældent frameworket (React, Next.js, Vanilla JS), men at forstå domænet (danske elafgiftsrefusioner, børns kognitive læseevner, abonnementsmodeller).
  * **Regel**: Agenten skal betragte domæne-research som en integreret del af kodningen. Priser, satser og konstanter skal trækkes ud i et dedikeret konfigurationsobjekt (`config/pricing.ts` eller `recipeData`), så markedsændringer ikke kræver omskrivning af komponenternes state.
* **Transparens i Antagelser**:
  * Når der kodes ud fra specifikke parametre (f.eks. bilmodeller som BMW iX1 eller iPad screen sizes), skal agenten per automatik bygge UI-elementer/badges, der klart deklarerer disse antagelser over for slutbrugeren for at minimere fejlkilder.

---

## 🧠 4. Kognitiv UX, "Af-AI'sering" & Menneskelig Ergometri

### 💡 Læringer & Fremtidige Agent-Regler:
* **Data-Visualisering for Mennesker ("Glanceability")**:
  * Hover-effekter (tooltips) svigter på mobile enheder og iPad-touchskærme. Agenten skal designe grafer og UI ud fra "Glanceability" – dvs. altid bruge direkte labels ved kritiske data frem for hover-states.
* **Børne- og Bruger-Ergometri**:
  * Børn (og travle brugere) oplever læsetræthed. Native stemmesyntese (HTML5 `window.speechSynthesis`), 90px+ ingrediensbilleder og store touch-flader (min 64px) gør systemet uafhængigt af kognitiv overbelastning.
  * **Emoji Sanitization**: Emojis skal renses fra TTS-tekst med regex (`replace(/[\u{1F300}-\u{1F9FF}]/gu, '')`) for at forhindre maskinelle fejluudtalelser.
* **Sproglig Disciplin & Ortografi**:
  * Agenten skal køre intern validering for dansk ortografi (undgå særskrivning / compound word errors og maskinoversatte vendinger). Sproget skal skifte fra beskrivende (3. person) til handlende (2. person, direkte tiltale).

---

## 🎵 5. Zero-Dependency & Multimedie Optimering

* **Zero-Dependency Sound Synthesizer**: Web Audio API oscillatorkredsløb (`SoundFX` klasse) skaber øjeblikkelig taktil lyd-feedback med 0 KB ekstern netværksbelastning.
* **iOS WebKit Video Autoplay**: Multimedie-videoer skal have `autoplay loop muted playsinline` samtidigt samt asynkron preloading (`requestIdleCallback`) for 0 CLS og 0 lagg.

---

## 🚀 6. Operationaliserings-Tjekliste for Kodeagenten
1. ✅ **Design altid defensivt**: Byg API-fallbacks og sane defaults som standard.
2. ✅ **Adskil konfigurationsdata**: Træk priser, satser og opskrifter ud i konfigurationsobjekter.
3. ✅ **Prioritér Glanceability**: Direkte synlige labels frem for hover-tooltips.
4. ✅ **Sikre sproglig kvalitet**: Danske sammensatte ord skrives i ét ord; brug direkte tiltale (2. person).
5. ✅ **Deklarér antagelser i UI**: Gør systemets forudsætninger synlige for brugeren.
