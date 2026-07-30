# 📋 MASTER TESTPLAN: NORAS KOKKESKOLE
> **Projekt**: Noras Kokkeskole (`noras-kokkeskole`)  
> **Target Audience**: Børn (7 år) & Forældre (iPad / Touch Devices)  
> **Status**: Klar til Review & Executive Sign-off  
> **Live Deployed App**: [https://noraskokkeskole.vercel.app](https://noraskokkeskole.vercel.app)  

---

## 🎯 1. Test-Formål & Strategi

Formålet med denne testplan er at verificere og validere **Noras Kokkeskole** på tværs af funktionalitet, ydeevne, børnevenlig tilgængelighed (UX/PWA) og multimedie-afspilning før endelig overdragelse. 

Teststrategien følger princippet:  
> *"En matematisk perfekt kode er værdiløs, hvis den ikke overlever mødet med den fysiske virkelighed (et barn på 7 år med meldækkede fingre på en iPad)."*

---

## 💻 2. Testmiljø & Platform-Dækning

Testen skal udføres i følgende miljøer for at sikre 100% dækning:

| Platform / Enhed | Skærmstørrelse | Browser / OS | Formål |
|---|---|---|---|
| **Apple iPad (Standard / Air)** | 10.2" / 10.9" (Retina) | Safari (iOS 16+) | Primary Target (Touch, PWA, Voiceover) |
| **Apple iPhone (13 Pro / 14 / 15)** | 6.1" | Safari / Chrome | Mobile Portrait Responsive Test |
| **Android Tablet / Phone** | 10.5" / 6.7" | Chrome Mobile | Cross-platform WebSpeech & Touch |
| **Desktop / Laptop (Mac / Windows)** | 13" / 15" / 27" | Chrome, Safari, Edge | QA Control & A4 Print Testing |

---

## 🧪 3. Funktionel Test-Matrix (End-to-End User Journeys)

### 3.1 🍕 Opskrift 1: Sprød Pizza fra Bunden (11 Trin)
* [ ] **Tjekliste**: Verificer at alle 6 ingredienser kan afkrydses med 90px visuelle billeder og Web Audio pop-lyd.
* [ ] **Trin-Forløb**: Gennemgå trin 1 til 11. Kontroller at baggrundsvideoer afspiller i autoplay uden lag.
* [ ] **Hævetimer (30 min)**: Verificer at nedtællingstimer kan startes/stoppes, og at alarm-fanfare udløses ved 00:00.
* [ ] **Quiz & Belønning**: Verificer at 1-spørgsmåls bonusquiz udløser konfetti og +1 bonus-stjerne ved rigtigt svar.

### 3.2 🥞 Opskrift 2: Lækre Pandekager (9 Trin)
* [ ] **Låse-mekanisme**: Verificer at Pandekager er låst hvis stjerner < 3, og låses op når stjerner ≥ 3.
* [ ] **Hviletimer (10 min)**: Verificer at dejhvile-timer fungerer korrekt.
* [ ] **Google Flow MP4 Videoer**: Verificer at æggepiskning og vendings-videoer afspiller uden hak.

### 3.3 🍫 Opskrift 3: Noras Lækre Chokoladekage (8 Trin)
* [ ] **Låse-mekanisme**: Verificer at Chokoladekage er låst hvis stjerner < 6, og låses op når stjerner ≥ 6.
* [ ] **Bake-timer (25 min)**: Verificer at bagetimeren tæller korrekt ned.
* [ ] **Kage-Mester Mærke**: Verificer at trofæet *"Kage-Mester 🍫"* aktiveres i Trofæ-menuen efter gennemførelse.

---

## 🔊 4. Børne-UX & Pædagogisk Tilgængelighedstest

| Testområde | Kriterium / Forventet Adfærd | Testmetode |
|---|---|---|
| **Oplæsning ("Læs Højt 🔊")** | WebSpeech API afspiller dansk stemme (`da-DK`) i roligt tempo (`0.92`) og venlig pitch (`1.08`). | Manuel aktivering på alle opskriftstrin. |
| **Emoji Sanitization** | Emojis udtales **ikke** som ord (f.eks. *"tungt sort hjerte"*). Teksten renses før afspilning. | Lyt til opskriftstekst med emojis. |
| **Touch-Mål (64px+)** | Alle knapper og ingrediensflader er minimum 64px og nemme at ramme med små fingre. | Touch-test på iPad. |
| **Zero Tap Delay** | Ingen 300ms forsinkelse ved klik på knapper (`touch-action: manipulation`). | Responsivitetstest på WebKit. |

---

## ⚡ 5. Ydeevne & Core Web Vitals Test

* [ ] **First Contentful Paint (FCP)**: < 1.2 sekunder på 4G / Wi-Fi.
* [ ] **Largest Contentful Paint (LCP)**: < 2.2 sekunder (heltebilleder preloades med `fetchpriority="high"`).
* [ ] **Cumulative Layout Shift (CLS)**: **0.0** (alle billeder har eksplikte `width` og `height` attributter).
* [ ] **Zero-Dependency Audio**: Ingen eksterne MP3-filer. Web Audio API oscillatorkredsløb skaber 0 KB netværksbelastning.

---

## 📜 6. Printbart A4 Kokkediplom & PWA Test

* [ ] **A4 Print Layout**: Klik på *"🖨️ Print Mit Kokkediplom!"* i Trofæ-menuen åbner browserens print-dialog. 
* [ ] **Visuel Kvalitet**: Diplomet har guldramme, Noras navn, dags dato, optjente stjerner og opskriftsmærker smukt placeret uden sideskift.
* [ ] **PWA Standalone Installation**: Test "Tilføj til Hjemmeskærm" på iPad Safari. Verificer at appen åbner i fuldskærm uden adressebar med kokkemaskot-ikonet.

---

## ✍️ 7. Review & Sign-off Matrix

| Reviewer | Rolle | Sign-off Status | Dato |
|---|---|:---:|---|
| **Lead Developer / AI Operator** | Teknisk Arkitektur & QA | ✅ Godkendt | 2026-07-30 |
| **Product Owner (PO)** | Børne-UX & Kravopfyldelse | ⏳ Afventer Review | - |
| **Slutbruger (Nora & Forældre)** | Fysisk Brugstest på iPad | ⏳ Afventer Review | - |

---

### 🌐 Test-Link til Reviewers:
👉 **[https://noraskokkeskole.vercel.app](https://noraskokkeskole.vercel.app)**
