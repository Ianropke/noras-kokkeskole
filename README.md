# Noras Kokkeskole 🍕👩‍🍳

En pædagogisk, interaktiv og børnevenlig webapp designet til **Nora på 7 år** til brug på iPad og tablet. 

Appen introducerer børn til madlavningsglæde, køkkensikkerhed og simple opskrifter startende med den ultimative livret: **Pizza!**

---

## 🌟 Hjørnesten & Designfilosofi

- **Touch & iPad Optimeret**: Store og klare trykknapper (min. 64px tap targets) med sanselige farver og responsivt layout.
- **Pædagogisk Rejse**:
  1. **🧼 Håndvask & Sikkerhed**: Start altid med 20 sekunders håndvask med sæbebobler.
  2. **🛒 Ingrediens-tjekliste**: Gå på opdagelse i køkkenet og kryds ingredienser af.
  3. **🔢 Læsning & Matematik**: Simpel tekst tilpasset 7-årige med små tælle-opgaver (fx *"Smør 3 skefulde tomatsauce"*, *"Skær i 8 trekanter"*).
  4. **⏱️ In-App Bage-timer**: Børnevenligt nedtællings-ur til bage-trinet i ovnen med lyd-alarm.
  5. **⭐ Fejring & Belønning**: Konfetti-regn, lydeffekter (Web Audio API) og trofæ-mærker ved fuldførelse.

---

## 📽️ Google Flow Asset Production Guide

Appen er designet til at integrere direkte med grafik og videoer genereret via **Google Flow** (Veo / Imagen 3).

### Generel stil-prompt til Google Flow:
> *Vibrant 3D claymation Pixar-style animation with warm studio lighting, playful rounded edges, clean colorful background, child-friendly. No realistic mess.*

| Asset ID | Type | Beskrivelse / Prompt til Google Flow |
|---|---|---|
| `hero_pizza` | Billede | `A cute 3D claymation style delicious pepperoni and cheese pizza on a wooden board, sparkling, playful animation style` |
| `hand_wash` | Video/GIF (5s) | `3D claymation style hands washing with bubbly soap under clean water tap, cheerful and simple` |
| `video_step1` | Video (5s) | `3D claymation rolling out pizza dough with wooden rolling pin on flour covered table` |
| `video_step2` | Video (5s) | `3D claymation spoon spreading red tomato sauce in circles on pizza dough` |
| `video_step3` | Video (5s) | `3D claymation hands sprinkling shredded yellow cheese and pepperoni slices on pizza` |
| `video_step5` | Video (5s) | `3D claymation adult hands with oven mitts putting pizza in oven carefully` |
| `video_step6` | Video (5s) | `3D claymation pizza baking in warm oven with bubbling cheese, golden crust` |

---

## 🛠️ Teknisk Setup

Et simpelt, lynhurtigt og moderne Vanilla Web Stack:
- `index.html` - Semantisk og tilgængelig HTML5 til touch-enheder.
- `style.css` - Custom CSS tokens, glassmorphism, Google Fonts (`Fredoka` & `Quicksand`).
- `app.js` - Web Audio API lydsyntese, state management og konfetti-animationer.

---

## 🚀 Kør lokalt

```bash
# Start en lokal web-server
npx serve .
# eller
python3 -m http.server 8080
```
