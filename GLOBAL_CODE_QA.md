# 📄 GLOBAL CODE QA & LESSONS LEARNED
> **Projekt**: Noras Kokkeskole (`noras-kokkeskole`)  
> **Målgruppe**: Børn (7 år) på iPad/Tablet  
> **Dato**: 2026-07-25  

---

## 🎯 1. Børne-UX & Pædagogisk Ergometri (7-Årig iPad Bruger)

### 💡 Læringer:
* **Tekst-træthed & Tilgængelighed**: Børn på 7 år bliver hurtigt trætte af at læse lange instruktioner.
  * **Løsning**: Nativ, gratis oplæsning via HTML5 `window.speechSynthesis` (Web Speech API) med tilpasset hastighed (`rate = 0.92`) og venlig tonehøjde (`pitch = 1.08`).
  * **Vigtig faldgrube**: Emoji-tegn i teksten skal renses med regex (`replace(/[\u{1F300}-\u{1F9FF}]/gu, '')`), da browserens TTS ellers vil udtale e-mojis bogstaveligt (f.eks. *"tungt sort hjerte"*).
* **Visuelle Ingrediens-Størrelser**: Ingrediens-billeder på tjeklisten skal være mindst 90px x 90px for at barnet hurtigt kan genkende råvarerne på køkkenbordet uden at skulle læse teksten.
* **Touch-Flader**: Alle interaktive elementer skal have en minimumsstørrelse på 64px x 64px med tydelig aktiv tilstand (`:active { transform: translateY(2px); }`).

---

## 🎬 2. Google Flow 3D MP4 & Medie-Optimering

### 💡 Læringer:
* **3D Claymation Pixar Stil**: Børn reagerer med stor begejstring på 3D-modellerede animationer i stil med Pixar/Claymation frem for flade ikon-tegninger.
* **Autoplay på iOS Safari / WebKit**: `<video>` elementer afspiller kun automatisk på iPad/iPhone hvis følgende fire attributter er sat samtidigt: `autoplay loop muted playsinline`.
* **Preloading uden DOM-Blokering**: Videoer skal preloaded i baggrunden via `requestIdleCallback` eller en asynkron kø, så de ikke blokerer Core Web Vitals (LCP/FCP) under den indledende sideindlæsning.

---

## ⚡ 3. Performance & Visuel Skarphed (High-DPI / Retina)

### 💡 Læringer:
* **Krystalklar Tekst på iPad Retina**: 
  * Tilføj altid følgende til `html, body`:
    ```css
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    ```
* **Skarp Billed-Rendering**:
  * Forhindr slørede 3D-grafikker ved at sætte `image-rendering: -webkit-optimize-contrast;` og `decoding="async"`.
* **Fjernelse af 300ms Touch-Forsinkelse**:
  * Sæt `touch-action: manipulation;` og `-webkit-tap-highlight-color: transparent;` på alle knapper for at opnå øjeblikkelig touch-responsivitet.

---

## 🏆 4. Gamification, Quizzer & Physical Reward Loop

### 💡 Læringer:
* **Progressions-Lås**: Krav om optjente stjerner (0, 3, 6, 9 stjerner) skaber motivation til at fuldføre tidligere retter for at låse op for næste ret.
* **Efter-Ret Børne-Quiz**: Et simpelt 1-spørgsmåls quizmodul efter gennemført ret med +1 bonus-stjerne forstærker børnenes forståelse for råvarer og bagetider.
* **Printbart A4 Kokkediplom**: Muligheden for at udskrive eller gemme et A4-diplom (`@media print`) med barnets navn, optjente stjerner og mærker giver en værdifuld fysisk belønning til køleskabet.

---

## 🎵 5. Zero-Dependency Audio Synthesizer (Web Audio API)

### 💡 Læringer:
* **Audio uten Eksterne MP3-filer**: Ved at bygge en letvægts `SoundFX` klasse med Web Audio API `AudioContext` oscillatorkredsløb kan man skabe øjeblikkelige pop-lyde, chimes og fanfarer med 0 KB ekstern netværksbelastning.

---

## 🚀 6. Tjekliste for Fremtidige Børne-Webapps
1. ✅ **Brug altid `decoding="async"` og `loading="eager"` på vigtige heltebilleder.**
2. ✅ **Husk `playsinline muted` på alle løbende instruktionsvideoer.**
3. ✅ **Test altid touch-responsivitet på iPad/tablet.**
4. ✅ **Sørg for 100% gratis, native løsninger til voiceover (Web Speech API).**
5. ✅ **Indbyg en printbar belønning (A4-diplom/certifikat).**
