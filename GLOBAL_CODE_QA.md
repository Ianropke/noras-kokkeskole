# 📄 GLOBAL CODE QA & ARCHITECTURAL META-LEARNINGS
> **System Architecture**: Autonomous Executive & Agentic Coding System  
> **Key Thesis**: *"En matematisk perfekt kode er værdiløs, hvis den ikke overlever mødet med den fysiske virkelighed."*  
> **Status**: Living Knowledge Repository & Strategic Directives  

---

## 📜 0. ARKITEKTURMANIFEST

> **Mission**: Byg software, der fungerer under virkelige forhold, er let at ændre, let at forstå, sikker som udgangspunkt og observerbar i drift. Optimer ikke for teoretisk perfektion, men for langsigtet robusthed, vedligeholdelighed og dokumenterede kompromiser. Enhver beslutning skal kunne forklares, testes, måles og ændres uden unødig kompleksitet.

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

## 🎓 3. Domæneekspertise over Syntaks & Data Ownership

### 💡 Læringer & Fremtidige Agent-Regler:
* **Forretningslogik vs. Rå Kode**:
  * Den sværeste del af et system er sjældent frameworket (React, Next.js, Vanilla JS), men at forstå domænet (danske elafgiftsrefusioner, børns kognitive læseevner, abonnementsmodeller).
  * **Regel**: Agenten skal betragte domæne-research som en integreret del af kodningen. Priser, satser og konstanter skal trækkes ud i et dedikeret konfigurationsobjekt (`config/pricing.ts` eller `recipeData`), så markedsændringer ikke kræver omskrivning af komponenternes state.
* **Data Ownership (Single Source of Truth)**:
  * Hver information har én autoritativ kilde. Undgå at sprede variabler (`price`, `priceWithVat`, `displayPrice`) i fem komponenter. Alt læses fra samme centralt ejede modul (`Pricing Engine` eller `recipeData`).
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

## 📡 7. Observability First

> *"Et system, der ikke kan observeres, kan ikke vedligeholdes."*

En agent bør ikke blot skrive kode, men samtidig bygge den nødvendige instrumentation:
* **Struktureret Logging**: Struktureret JSON-logging frem for ad-hoc `console.log`.
* **Correlation IDs**: Unikke IDs til at spore kald på tværs af requests og baggrundsopgaver.
* **Performance & Error Metrics**: Måling af latency, cache hit rate, API-fejl og feature usage analytics.
* **Health Endpoints**: Eksplicitte helbredstjek-punkter for alle kritiske afhængigheder.

---

## 🔄 8. Idempotens som Standard

> *"Alle handlinger skal kunne udføres to gange uden katastrofe."*

Virkeligheden består af dobbeltklik, browser refresh, tab crashes, retry-mekanismer og ustabile netværk.
* **Idempotente Mutationer**: Alle skrivende handlinger (f.eks. `POST /order` med `Idempotency-Key` eller tilstandsopdateringer i UI) skal sikres mod utilsigtede gentagelser.

---

## 🧬 10. Evolvability over Perfection

> *"Den bedste kode er den kode, der er billigst at ændre."*

Optimér ikke for nutidig teoretisk perfektion, men for omkostningsfri tilpasning.
* **Spørg altid**: *"Hvad sker der, hvis kravene ændres om 6 måneder?"* Dette giver konsekvent simplere og mere langtidsholdbare løsninger end over-engineering.

---

## ⚖️ 11. Explicit Trade-offs

AI-agenter må aldrig skjule kompromiser.
* **Eksplicit Vurdering**: Dokumentér eksplicit hvornår en løsning vælges (f.eks. *"✓ 25% langsommere, til gengæld ✓ 80% simplere, lettere at teste og billigere at vedligeholde"*).

---

## 🛡️ 12. Security by Default

Sikkerhed er et fundament, ikke en eftertanke. Agenten skal automatisk implementere:
* Input-validering & HTML/SQL escaping
* Secrets management & miljøvariabel-beskyttelse
* Rate limiting & Content Security Policy (CSP)
* Protection mod CSRF, XSS, SQL injection & Least Privilege princippet

---

## ⚡ 13. Performance Budget

Performance er et eksplicit krav, som agenten skal overholde:
* **First Contentful Paint (FCP)** < 1.5 s
* **Largest Contentful Paint (LCP)** < 2.5 s
* **Cumulative Layout Shift (CLS)** < 0.1
* **JS Bundle Size** < 200 kB
* **API Latency** < 300 ms
* **Cache Hit Rate** > 80 %

---

## 🧘 14. Simplicity Wins

> *"Den mest komplekse kode er sjældent den mest intelligente."*

Kompleksitet er en direkte vedligeholdelsesomkostning. Foretræk:
* Færre eksterne afhængigheder
* Mindre abstraktionslag & kortere call stacks
* Færre komplekse design patterns og interfaces

---

## 👤 15. Human Override & Menneskelig Kontrol

AI må aldrig gøre sig selv ufejlbarlig.
* **Kontrolmekanismer**: Byg altid manuelle overrides, konfigurationsmuligheder, mulighed for at deaktivere automatisering, og tydelige begrundelser for AI-beslutninger. Mennesket er systemets endelige beslutningstager.

---

## 🧪 16. Test Behaviour, Not Implementation

Undgå brittle tests der tester interne kald (`expect(functionA).toHaveBeenCalled()`).
* **Adfærds-fokus**: Test altid ud fra brugerscenariet: *"Når brugeren gør X, skal resultatet være Y"*. Implementeringen må gerne ændres, så længe adfærden er stabil.

---

## 🩹 17. Graceful Degradation

Et system bør aldrig gå fra 100% til 0%.
* **Fallback-funktionalitet**: Hvis en komponent fejler, vis cached data, reduceret funktionalitet og informér brugeren. *"Noget virker"* er uendeligt bedre end *"Intet virker"*.

---

## 💰 18. Cost Awareness (Token & Cloud)

Cloud og AI er ikke gratis. Agenten skal løbende optimere:
* Antal API-kald, CPU/hukommelsesforbrug, databaseforespørgsler, egress og storage.
* **AI-Tokenforbrug**: Reducér unødige token-udsendelser ved præcise prompts og kompakt kontekststyring.

---

## 📝 19. Architecture Decision Records (ADR)

Store arkitektoniske beslutninger skal dokumenteres i et kort format:
* **Decision**: Valgte teknologi X over Y.
* **Why**: Begrundelse (f.eks. offline support eller zero-dependency).
* **Trade-offs**: Hvad opgives (f.eks. skalerbarhed).
* **Review Condition**: Hvornår beslutningen skal genovervejes.

---

## 🤖 20. AI-Specific Engineering & Confidence Management

> **Kritiske AI-Regler**: AI må ALDRIG opfinde API'er, opfinde dokumentation, opfinde biblioteker, opfinde parametre eller opfinde versionsnumre.

* **Synlig Usikkerhed**: Hvis usikkerheden er høj, skal agenten eksplicit deklarere:
  ```yaml
  Confidence: Medium
  Needs verification:
    - API endpoint
    - Pricing / Satser
    - Browser support
  ```
* Usikkerhed skal fremstå synligt og håndteres åbent, aldrig skjules bag usande påstande.
