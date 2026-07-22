/* ==========================================================================
   NORAS KOKKESKOLE - APPLICATION LOGIC & AUDIO SYNTHESIZER
   ========================================================================== */

// STATE MANAGEMENT
const state = {
  stars: parseInt(localStorage.getItem('noras_stars') || '3'),
  currentView: 'home', // home | ingredients | cooking | badges
  currentRecipe: 'pizza',
  currentStepIndex: 0,
  timerInterval: null,
  timerSeconds: 1800, // 30 min default til hævning
  timerRunning: false,
  checklist: {}
};

// RECIPE DATA STRUCTURE
const recipeData = {
  pizza: {
    id: 'pizza',
    title: 'Noras Hjemmelavede Pizza 🍕',
    subtitle: 'Lær at lave dej fra bunden, hæve den og bage den sprød!',
    ingredients: [
      { id: 'yeast', name: '25g Frisk Gær (eller 1 tsk tørgær)', icon: '🧊' },
      { id: 'water', name: '2 dl Lunkent Vand', icon: '💧' },
      { id: 'flour', name: '3 kopper Hvedemel', icon: '🌾' },
      { id: 'salt_oil', name: '1 tsk Salt & 1 spsk Olie', icon: '🧂' },
      { id: 'sauce', name: '3 spiseskefulde Tomatsauce', icon: '🍅' },
      { id: 'cheese', name: '2 kopper Revet Ost', icon: '🧀' },
      { id: 'topping', name: 'Favorit-fyld (Skinke/Pepperoni)', icon: '🥓' }
    ],
    steps: [
      {
        num: 1,
        title: 'Vask hænderne godt! 🧼',
        text: 'Før vi rører ved dejen, skal vi vaske hænder med vand og sæbe. Tæl langsomt til 20 mens du vasker!',
        mathHint: '💡 Tæl: 1, 2, 3... helt til 20!',
        mediaType: 'video',
        mediaSrc: 'hand_wash.mp4',
        assetId: 'hand_wash',
        icon: '🧼',
        flowPrompt: '3D claymation hands washing under running tap with soapy bubbles'
      },
      {
        num: 2,
        title: 'Opløs gæren i vand 🥣',
        text: 'Hæld 2 dl lunkent vand i en stor skål. Smuldr gæren i vandet og rør med en ske, indtil gæren er helt smeltet og væk!',
        mathHint: '💡 Tæl: 2 deciliter vand i målebægeret.',
        mediaType: 'video',
        mediaSrc: 'video_yeast.mp4',
        assetId: 'video_yeast',
        icon: '🥣',
        flowPrompt: '3D claymation hands crumbling fresh yeast into a bowl of warm water and stirring with a spoon'
      },
      {
        num: 3,
        title: 'Tilsæt olie, salt og mel 🌾',
        text: 'Hæld 1 spiseskefuld olie og 1 teskefuld salt i skålen. Tilsæt derefter 3 kopper mel én ad gangen.',
        mathHint: '💡 Tæl kopperne mel: 1... 2... 3 kopper!',
        mediaType: 'video',
        mediaSrc: 'video_add_flour.mp4',
        assetId: 'video_add_flour',
        icon: '🌾',
        flowPrompt: '3D claymation hands pouring flour cups, salt and oil into a bowl with yeast water'
      },
      {
        num: 4,
        title: 'Ælt dejen flittigt! 👐',
        text: 'Brug dine hænder! Tryk, fold og ælt dejen i skålen eller på bordet, til den bliver en glat, blød og dejlig bold.',
        mathHint: '💡 Ælt dejen i ca. 3 minutter til den ikke klistrer mere!',
        mediaType: 'video',
        mediaSrc: 'video_knead.mp4',
        assetId: 'video_knead',
        icon: '👐',
        flowPrompt: '3D claymation child hands actively kneading a smooth pizza dough ball on a floured wooden table'
      },
      {
        num: 5,
        title: 'Hævetid! (Dejen skal vokse) ⏳',
        text: 'Læg dejen tilbage i skålen og læg et rent viskestykke over. Sæt timeren på 30 minutter og se dejen vokse sig dobbelt så stor!',
        hasTimer: true,
        timerMinutes: 30,
        mathHint: '💡 30 minutter giver dejen tid til at blive luftig!',
        mediaType: 'video',
        mediaSrc: 'video_rising.mp4',
        assetId: 'video_rising',
        icon: '⏳',
        flowPrompt: '3D claymation dough ball inside a bowl under a tea towel slowly expanding to twice its size, time lapse effect'
      },
      {
        num: 6,
        title: 'Rul dejen ud på bagepapir 🫓',
        text: 'Tag den luftige dej ud. Læg den på bagepapir. Tryk den flad med dine hænder eller rul med kagerullen, til den er rund som en sol!',
        mathHint: '💡 Gør dejen stor og rund som en tallerken.',
        mediaType: 'video',
        mediaSrc: 'video_step1.mp4',
        assetId: 'video_step1',
        icon: '🫓',
        flowPrompt: '3D claymation rolling out pizza dough with rolling pin'
      },
      {
        num: 7,
        title: 'Smør tomatsauce på 🍅',
        text: 'Brug bagsiden af en stor ske. Tag 3 spiseskefulde tomatsauce og smør det ud i runde cirkler fra midten. Gem 1 cm kant uden sauce!',
        mathHint: '💡 Tæl skefulde: 1... 2... 3 skefulde!',
        mediaType: 'video',
        mediaSrc: 'video_step2.mp4',
        assetId: 'video_step2',
        icon: '🍅',
        flowPrompt: '3D claymation spoon spreading red tomato sauce on dough'
      },
      {
        num: 8,
        title: 'Drys ost og læg fyld 🧀',
        text: 'Drys osten ud over pizzaen som hvid og gul sne. Læg derefter dit yndlingsfyld ovenpå.',
        mathHint: '💡 Kan du lægge 6 stykker skinke eller pepperoni på pizzaen?',
        mediaType: 'video',
        mediaSrc: 'video_step3.mp4',
        assetId: 'video_step3',
        icon: '🥓',
        flowPrompt: '3D claymation hands sprinkling shredded cheese and toppings'
      },
      {
        num: 9,
        title: 'Spørg en voksen om hjælp! 👨‍👩‍👧',
        text: 'Ovnen er MEGET varm. Spørg en voksen om at sætte pizzaen ind i den varme ovn for dig!',
        mathHint: '⚠️ Husk: Kun voksne rører ved den varme ovn!',
        mediaType: 'video',
        mediaSrc: 'video_step5.mp4',
        assetId: 'video_step5',
        icon: '🔥',
        flowPrompt: '3D claymation adult with oven mitts putting pizza in oven'
      },
      {
        num: 10,
        title: 'Bage-tid i ovnen! ⏱️',
        text: 'Pizzaen skal bage i ca. 10 minutter indtil osten bobler og skorpen er sprød og gylden.',
        hasTimer: true,
        timerMinutes: 10,
        mediaType: 'video',
        mediaSrc: 'video_step6.mp4',
        assetId: 'video_step6',
        icon: '🍕',
        flowPrompt: '3D claymation pizza baking in oven bubbling deliciously'
      },
      {
        num: 11,
        title: 'Velbekomme, Nora! 🎉',
        text: 'Du har lavet en hel pizza fra bunden med ægte hjemmelavet dej! Skær den ud i trekanter og nyd dit mesterværk!',
        mathHint: '💡 Hvis du skærer pizzaen på tværs, får du 8 lækre stykker!',
        mediaType: 'image',
        mediaSrc: 'assets/hero_pizza.jpg',
        assetId: 'hero_pizza',
        icon: '🌟',
        isFinal: true
      }
    ]
  }
};

// AUDIO SYNTHESIZER (Web Audio API)
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSuccess() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + index * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + index * 0.1);
      osc.stop(this.ctx.currentTime + index * 0.1 + 0.2);
    });
  }

  playFanfare() {
    this.init();
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.2, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.4);
    });
  }
}

const sounds = new SoundFX();

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  updateStarDisplay();
  renderHome();
});

function updateStarDisplay() {
  document.getElementById('starCount').innerText = state.stars;
  localStorage.setItem('noras_stars', state.stars);
}

function addStars(num) {
  state.stars += num;
  updateStarDisplay();
}

// ROUTING & VIEW RENDERERS
function goHome() {
  sounds.playClick();
  state.currentView = 'home';
  renderHome();
}

function renderHome() {
  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div class="hero-banner">
      <div class="hero-text">
        <h2>Hej Nora! 👋</h2>
        <p>Er du klar til at lave ægte pizzadej fra bunden i dag?</p>
        <button class="hero-btn" onclick="openIngredients('pizza')">Start Pizza-eventyr 🍕</button>
      </div>
      <img src="assets/hero_pizza.jpg" alt="Glad pizza" class="custom-hero-img">
    </div>

    <div class="section-title">
      <span>📖</span> Vælg hvad du vil lave:
    </div>

    <div class="recipes-grid">
      <!-- PIZZA (Unlocked) -->
      <div class="recipe-card active-card" onclick="openIngredients('pizza')">
        <div class="recipe-img-box">
          <img src="assets/hero_pizza.jpg" alt="Pizza" class="custom-card-img">
        </div>
        <div class="recipe-title">Sprød Pizza fra Bunden</div>
        <div class="recipe-tags">
          <span class="tag">⏱️ 45 min (inkl. hævning)</span>
          <span class="tag">⭐ Superkok</span>
        </div>
        <button class="start-recipe-btn">Start Nu ✨</button>
      </div>

      <!-- PANCAKES (Locked preview) -->
      <div class="recipe-card locked-card" onclick="soundLocked()">
        <span class="lock-badge">🔒 Låses op snart</span>
        <div class="recipe-img-box" style="display:flex; align-items:center; justify-content:center; background:#FFF5F5; font-size:3.5rem;">🥞</div>
        <div class="recipe-title">Lækre Pandekager</div>
        <div class="recipe-tags">
          <span class="tag">⏱️ 15 min</span>
          <span class="tag">⭐ Kræver 5 stjerner</span>
        </div>
      </div>

      <!-- SMOOTHIE (Locked preview) -->
      <div class="recipe-card locked-card" onclick="soundLocked()">
        <span class="lock-badge">🔒 Låses op snart</span>
        <div class="recipe-img-box" style="display:flex; align-items:center; justify-content:center; background:#FFF5F5; font-size:3.5rem;">🍓</div>
        <div class="recipe-title">Frugt Smoothie</div>
        <div class="recipe-tags">
          <span class="tag">⏱️ 5 min</span>
          <span class="tag">⭐ Kræver 10 stjerner</span>
        </div>
      </div>
    </div>
  `;
}

function soundLocked() {
  sounds.playClick();
  alert('🔒 Du skal lave Pizzaen først for at låse op for flere opskrifter!');
}

// INGREDIENTS CHECKLIST VIEW
function openIngredients(recipeId) {
  sounds.playClick();
  state.currentRecipe = recipeId;
  state.currentView = 'ingredients';
  const recipe = recipeData[recipeId];

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div class="checklist-container">
      <div class="step-num-badge">Trin 0 / ${recipe.steps.length}</div>
      <h2 class="step-title">Find ingredienserne frem 🛒</h2>
      <p class="step-text">Tjek dit køkken og sæt et flueben ud for hver ting, når du har fundet den!</p>

      <div class="checklist-grid">
        ${recipe.ingredients.map(ing => `
          <div class="check-item ${state.checklist[ing.id] ? 'checked' : ''}" onclick="toggleCheck('${ing.id}')">
            <div class="check-box">${state.checklist[ing.id] ? '✓' : ''}</div>
            <span class="check-item-icon">${ing.icon}</span>
            <span class="check-item-text">${ing.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="step-nav-bar">
        <button class="big-btn prev" onclick="goHome()">⬅️ Tilbage</button>
        <button class="big-btn next" onclick="openPizzaRecipe()">Klar! Lav dej ➡️</button>
      </div>
    </div>
  `;
}

function toggleCheck(ingId) {
  sounds.playClick();
  state.checklist[ingId] = !state.checklist[ingId];
  openIngredients(state.currentRecipe);
}

// COOKING STEP VIEW
function openPizzaRecipe(stepIdx = 0) {
  sounds.playClick();
  state.currentRecipe = 'pizza';
  state.currentStepIndex = stepIdx;
  state.currentView = 'cooking';

  const recipe = recipeData.pizza;
  const step = recipe.steps[stepIdx];

  // Set default timer duration depending on step
  if (step.hasTimer) {
    state.timerSeconds = (step.timerMinutes || 10) * 60;
  }

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <!-- STEP PROGRESS INDICATOR -->
    <div class="step-header">
      <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--primary-pink)">
        Trin ${step.num} af ${recipe.steps.length}
      </div>
      <div class="step-indicator">
        ${recipe.steps.map((s, idx) => `
          <div class="dot ${idx === stepIdx ? 'active' : (idx < stepIdx ? 'completed' : '')}"></div>
        `).join('')}
      </div>
    </div>

    <!-- MAIN STEP CARD -->
    <div class="recipe-step-card">
      <div class="step-content-grid">
        
        <!-- LEFT: VISUAL MEDIA / GOOGLE FLOW PLACEHOLDER -->
        <div class="media-wrapper">
          <div class="placeholder-box">
            <span class="placeholder-icon">${step.icon}</span>
            <div class="placeholder-text">Google Flow Video / Grafik</div>
            <div class="asset-tag">Asset ID: ${step.assetId}</div>
            <p style="font-size:0.8rem; margin-top:6px; color:#718096">
              Prompt: "${step.flowPrompt}"
            </p>
          </div>
        </div>

        <!-- RIGHT: INSTRUCTIONS & MATH HINTS -->
        <div class="step-instructions">
          <div>
            <div class="step-num-badge">Trin ${step.num}</div>
            <h2 class="step-title">${step.title}</h2>
            <p class="step-text">${step.text}</p>

            ${step.mathHint ? `
              <div class="kid-math-box">
                <span class="math-icon">🔢</span>
                <span>${step.mathHint}</span>
              </div>
            ` : ''}
          </div>

          <!-- IN-APP TIMER (For dough rising & oven steps) -->
          ${step.hasTimer ? `
            <div class="timer-container">
              <div style="font-family: var(--font-heading); color: #718096;">Nedtællings-Timer ⏱️</div>
              <div class="timer-display" id="timerDisplay">${formatSeconds(state.timerSeconds)}</div>
              <div class="timer-controls">
                <button class="timer-btn start" onclick="startTimer()">Start Timer 🚀</button>
                <button class="timer-btn stop" onclick="stopTimer()">Stop 🛑</button>
              </div>
            </div>
          ` : ''}
        </div>

      </div>

      <!-- BOTTOM NAVIGATION BUTTONS FOR STEP -->
      <div class="step-nav-bar">
        ${stepIdx > 0 ? `
          <button class="big-btn prev" onclick="openPizzaRecipe(${stepIdx - 1})">⬅️ Forrige</button>
        ` : `
          <button class="big-btn prev" onclick="openIngredients('pizza')">⬅️ Tjekliste</button>
        `}

        ${step.isFinal ? `
          <button class="big-btn finish" onclick="finishRecipe()">Færdig! Få 3 Stjerner ⭐⭐⭐</button>
        ` : `
          <button class="big-btn next" onclick="openPizzaRecipe(${stepIdx + 1})">Næste Trin ➡️</button>
        `}
      </div>

    </div>
  `;
}

// TIMER LOGIC
function formatSeconds(totalSecs) {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
  sounds.playClick();
  if (state.timerRunning) return;
  state.timerRunning = true;

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerDisplay();

    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      state.timerRunning = false;
      sounds.playFanfare();
      alert('⏰ DING DING DING! Tiden er gået! Klar til næste skridt!');
    }
  }, 1000);
}

function stopTimer() {
  sounds.playClick();
  clearInterval(state.timerInterval);
  state.timerRunning = false;
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (!display) return;
  display.innerText = formatSeconds(state.timerSeconds);
}

// FINISH RECIPE CELEBRATION
function finishRecipe() {
  sounds.playFanfare();
  addStars(3);

  // Trigger confetti
  if (window.confetti) {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 24px; border: 4px solid var(--primary-yellow);">
      <img src="assets/pizza_trophy.jpg" alt="Pizza Trofæ" style="width:160px; height:160px; object-fit:cover; border-radius:24px; box-shadow:0 8px 24px rgba(0,0,0,0.15); animation: floatPizza 2s infinite ease-in-out;">
      <h1 style="font-family: var(--font-heading); font-size: 2.5rem; color: var(--primary-pink); margin: 16px 0;">
        SEJT GÅET, NORA! 🎉
      </h1>
      <p style="font-size: 1.4rem; font-weight: bold; color: var(--text-dark); margin-bottom: 24px;">
        Du har lavet en hel pizza helt fra bunden af! Du har optjent 3 nye stjerner! ⭐⭐⭐
      </p>

      <div style="display: flex; gap: 16px; justify-content: center;">
        <button class="big-btn next" onclick="goHome()">Gå til Forsiden 🏠</button>
        <button class="big-btn finish" onclick="openBadges()">Se Mine Trofæer 🏆</button>
      </div>
    </div>
  `;
}

// BADGES VIEW
function openBadges() {
  sounds.playClick();
  state.currentView = 'badges';
  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div class="checklist-container">
      <h2 class="step-title">Noras Trofæer & Diplomer 🏆</h2>
      <p class="step-text">Her er alle de seje kokke-mærker du har låst op for!</p>

      <div class="badges-grid">
        <div class="badge-card">
          <img src="assets/pizza_trophy.jpg" alt="Pizza Trofæ" class="custom-trophy-img">
          <div class="badge-title">Dej-Mester & Pizza-Mester</div>
          <span class="tag" style="background:#E6FFFA; color:#049A73;">Opnået!</span>
        </div>

        <div class="badge-card">
          <img src="assets/chef_mascot.jpg" alt="Kokke Mærke" class="custom-trophy-img">
          <div class="badge-title">Ren Vaskebjørn</div>
          <span class="tag" style="background:#E6FFFA; color:#049A73;">Opnået!</span>
        </div>

        <div class="badge-card" style="opacity: 0.5;">
          <div class="badge-icon">🥞</div>
          <div class="badge-title">Pandekage-Konge</div>
          <span class="tag">Låst</span>
        </div>
      </div>

      <div style="margin-top: 24px;">
        <button class="big-btn prev" onclick="goHome()">⬅️ Tilbage</button>
      </div>
    </div>
  `;
}
