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
  timerSeconds: 1800, // 30 min default
  timerRunning: false,
  checklist: {}
};

// RECIPE DATA STRUCTURE WITH DEDICATED GOOGLE FLOW / PIXAR ASSETS
const recipeData = {
  pizza: {
    id: 'pizza',
    title: 'Noras Hjemmelavede Pizza 🍕',
    subtitle: 'Lær at lave dej fra bunden, hæve den og bage den sprød!',
    ingredients: [
      { id: 'yeast', name: '25g Frisk Gær (eller 1 tsk tørgær)', img: 'assets/ingrediens_yeast.jpg' },
      { id: 'water', name: '2 dl Lunkent Vand (ca. 37°C)', img: 'assets/ingrediens_water.jpg' },
      { id: 'flour_oil_salt', name: '3 kopper Mel, 1 spsk Olie & 1 tsk Salt', img: 'assets/ingrediens_flour_salt_oil.jpg' },
      { id: 'sauce', name: '3 spiseskefulde Tomatsauce', img: 'assets/Bowl_with_tomato_sauce_spoon_202607221138.jpeg' },
      { id: 'cheese', name: '2 kopper Revet Mozzarella Ost', img: 'assets/Bowl_filled_with_mozzarella_cheese_202607221138.jpeg' },
      { id: 'topping', name: 'Favorit-fyld (Pepperoni / Skinke)', img: 'assets/Bowls_filled_with_toppings_2K_202607221137.jpeg' }
    ],
    steps: [
      {
        num: 1,
        title: 'Vask hænderne godt! 🧼',
        text: 'Før vi rører ved dejen, skal vi vaske hænder med varmt vand og sæbe. Tæl langsomt til 20 mens du vasker boblerne væk!',
        mathHint: '💡 Tæl: 1, 2, 3... helt til 20!',
        mediaType: 'video',
        mediaSrc: 'assets/Child_hands_washing_with_soap_202607221138.mp4',
        icon: '🧼'
      },
      {
        num: 2,
        title: 'Opløs gæren i lunkent vand 🥣',
        text: 'Hæld 2 dl lunkent vand i skålen. Vandet skal mærkes rart mod dit håndled (ca. 37°C - ikke for varmt!). Smuldr gæren i vandet og rør med en ske, indtil gæren er smeltet.',
        mathHint: '💡 Tæl 2 deciliter vand op i målebægeret.',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_crumbling_yeast_in_bowl_202607221143.mp4',
        icon: '🥣'
      },
      {
        num: 3,
        title: 'Tilsæt olie, salt og mel 🌾',
        text: 'Hæld 1 spiseskefuld olie og 1 teskefuld salt i vandet. Tilsæt derefter 3 kopper hvedemel – én kop ad gangen, mens du rører.',
        mathHint: '💡 Tæl kopperne mel: 1... 2... 3 kopper!',
        mediaType: 'image',
        mediaSrc: 'assets/ingrediens_flour_salt_oil.jpg',
        icon: '🌾'
      },
      {
        num: 4,
        title: 'Ælt dejen med hænderne 👐',
        text: 'Drys lidt mel på bordet. Tryk, fold og ælt dejen på bordet med dine hænder i 3 minutter, til den bliver en blød og glat dejbold!',
        mathHint: '💡 Ælt i 3 minutter til dejen slip-klistrer fra bordet!',
        mediaType: 'video',
        mediaSrc: 'assets/Child_hands_kneading_pizza_dough_202607221143.mp4',
        icon: '👐'
      },
      {
        num: 5,
        title: 'Hævetid! (Dejen skal vokse) ⏳',
        text: 'Læg dejen tilbage i skålen og læg et viskestykke over. Sæt timeren på 30 minutter og se gæren trylle dejen dobbelt så stor!',
        hasTimer: true,
        timerMinutes: 30,
        mathHint: '💡 30 minutters hævetid giver en dejlig luftig bund!',
        mediaType: 'video',
        mediaSrc: 'assets/Dough_ball_expanding_in_bowl_202607221143.mp4',
        icon: '⏳'
      },
      {
        num: 6,
        title: 'Tænd ovnen & Rul dejen ud 🫓🔥',
        text: 'Spørg en voksen om at tænde ovnen på 225°C varmluft NU, så den bliver rødglødende varm! Rul derefter din dej ud på et stykke bagepapir til den er rund som en sol.',
        mathHint: '⚠️ Vigtigt: Ovnen skal tændes nu, så den er varm!',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_kneading_pizza_dough_1080p_202607221138.mp4',
        icon: '🫓'
      },
      {
        num: 7,
        title: 'Smør tomatsauce på 🍅',
        text: 'Brug bagsiden af en stor ske. Tag 3 spiseskefulde tomatsauce og smør det ud i runde cirkler fra midten. Gem 1 cm kant uden sauce til skorpen!',
        mathHint: '💡 Tæl skefulde: 1... 2... 3 skefulde!',
        mediaType: 'video',
        mediaSrc: 'assets/Spoon_spreading_sauce_on_pizza_202607221138.mp4',
        icon: '🍅'
      },
      {
        num: 8,
        title: 'Drys ost og læg fyld 🧀',
        text: 'Drys osten ud over pizzaen som hvid og gul sne. Læg derefter dit yndlingsfyld ovenpå osten.',
        mathHint: '💡 Kan du lægge 6 stykker skinke eller pepperoni på pizzaen?',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_sprinkling_cheese_on_pizza_202607221138.mp4',
        icon: '🥓'
      },
      {
        num: 9,
        title: 'Spørg en voksen om hjælp! 👨‍👩‍👧',
        text: 'Ovnen er nu 225°C varm! Ræk op og spørg en voksen om at bære bagepladen med pizzaen ind i den varme ovn.',
        mathHint: '⚠️ Husk: Kun voksne bærer bagepladen ind i den varme ovn!',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_putting_pizza_in_oven_202607221138.mp4',
        icon: '🔥'
      },
      {
        num: 10,
        title: 'Bage-tid i ovnen! ⏱️',
        text: 'Pizzaen skal bage i ca. 10 minutter, indtil osten bobler og skorpen bliver gylden og sprød.',
        hasTimer: true,
        timerMinutes: 10,
        mediaType: 'video',
        mediaSrc: 'assets/Pizza_baking_inside_oven_1080p_202607221138.mp4',
        icon: '🍕'
      },
      {
        num: 11,
        title: 'Velbekomme, Nora! 🎉',
        text: 'Du har lavet en hel pizza fra bunden med ægte hjemmelavet dej! Skær den ud i trekanter og nyd dit sprøde mesterværk!',
        mathHint: '💡 Hvis du skærer pizzaen på tværs, får du 8 lækre stykker!',
        mediaType: 'video',
        mediaSrc: 'assets/Pizza_cutter_slicing_hot_pizza_202607221138.mp4',
        icon: '🌟',
        isFinal: true
      }
    ]
  },
  pancakes: {
    id: 'pancakes',
    title: 'Noras Lækre Pandekager 🥞',
    subtitle: 'Pisk dejen skummende, lad den hvile og steg gyldne pandekager!',
    ingredients: [
      { id: 'eggs', name: '3 Økologiske Æg', img: 'assets/3_brown_eggs_carton_2K_202607242300.jpeg' },
      { id: 'milk', name: '4 dl Frisk Mælk', img: 'assets/Glass_milk_pitcher_filled_milk_202607242300.jpeg' },
      { id: 'flour_sugar', name: '2 kopper Mel, 1 spsk Sukker & 1 knivspids Salt', img: 'assets/ingrediens_flour_salt_oil.jpg' },
      { id: 'butter', name: '2 spsk Smør til stegning', img: 'assets/Butter_on_ceramic_plate_2K_202607242300.jpeg' },
      { id: 'jam', name: 'Jordbærsyltetøj eller Sukker', img: 'assets/Jar_of_strawberry_jam_2K_202607242300.jpeg' }
    ],
    steps: [
      {
        num: 1,
        title: 'Vask hænderne godt! 🧼',
        text: 'Før vi pisker dejen, skal vi vaske hænder grundigt med varmt vand og sæbe. Tæl til 20 mens du vasker!',
        mathHint: '💡 Tæl: 1, 2, 3... helt til 20!',
        mediaType: 'video',
        mediaSrc: 'assets/Child_hands_washing_with_soap_202607221138.mp4',
        icon: '🧼'
      },
      {
        num: 2,
        title: 'Slå 3 æg ud i skålen 🥚',
        text: 'Slå forsigtigt de 3 æg ud i en stor skål. Pisk dem godt igennem med et piskeris, til æggene skummer rødt og gult!',
        mathHint: '💡 Tæl æggene når du slår dem ud: 1... 2... 3 æg!',
        mediaType: 'video',
        mediaSrc: 'assets/Child_hands_cracking_eggs_bowl_202607242301.mp4',
        icon: '🥚'
      },
      {
        num: 3,
        title: 'Tilsæt mælk, sukker og salt 🥛',
        text: 'Mål 4 dl mælk op i målebægeret. Hæld mælken i skålen sammen med 1 spiseskefuld sukker og en lille knivspids salt.',
        mathHint: '💡 Mål 4 deciliter mælk op i målebægeret.',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_pouring_milk_flour_bowl_202607242301.mp4',
        icon: '🥛'
      },
      {
        num: 4,
        title: 'Pisk melet i lidt ad gangen 🌾',
        text: 'Mål 2 kopper mel op. Hæld melet i skålen lidt ad gangen, mens du pisker flittigt, til alle klumper forsvinder og dejen er helt glat!',
        mathHint: '💡 Tæl 2 kopper mel.',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_pouring_milk_flour_bowl_202607242301.mp4',
        icon: '🌾'
      },
      {
        num: 5,
        title: 'Hviletid for dejen! (10 min) ⏳',
        text: 'Stil skålen med pandekagedej på bordet i 10 minutter. Så når melet at opsuge mælken, så pandekagerne bliver super bløde!',
        hasTimer: true,
        timerMinutes: 10,
        mathHint: '💡 10 minutters hvile gør dejen jævn og lækker!',
        mediaType: 'video',
        mediaSrc: 'assets/Pancake_batter_resting_in_bowl_202607242303.mp4',
        icon: '⏳'
      },
      {
        num: 6,
        title: 'Spørg en voksen om komfuret! 👨‍👩‍👧🔥',
        text: 'Komfuret og panden bliver MEGET varme. Spørg en voksen om at tænde komfuret på medium varme og smelte 1 tsk smør på panden.',
        mathHint: '⚠️ Husk: Kun voksne styrer det varme komfur!',
        mediaType: 'image',
        mediaSrc: 'assets/Butter_on_ceramic_plate_2K_202607242300.jpeg',
        icon: '🔥'
      },
      {
        num: 7,
        title: 'Hæld 1 øse dej på panden 🥄',
        text: 'Tag en stor suppeøse. Hæld 1 fuld øse pandekagedej midt på den varme pande og drej panden lidt, så dejen bliver en stor fin cirkel.',
        mathHint: '💡 1 suppeøse giver 1 flot rund pandekage!',
        mediaType: 'video',
        mediaSrc: 'assets/Batter_sizzling_in_frying_pan_202607242301.mp4',
        icon: '🍳'
      },
      {
        num: 8,
        title: 'Vend pandekagen! 🔄',
        text: 'Når pandekagen danner små bobler ovenpå og kanten bliver fin og gylden, skubber I forsigtigt en paletkniv ind under og vender den!',
        mathHint: '💡 Steg 1 minut på hver side!',
        mediaType: 'video',
        mediaSrc: 'assets/Batter_sizzling_in_frying_pan_202607242301.mp4',
        icon: '🔄'
      },
      {
        num: 9,
        title: 'Smør syltetøj & nyd! 🎉',
        text: 'Læg den varme gyldne pandekage på en tallerken. Smør et lækkert lag jordbærsyltetøj ud på pandekagen og rul den sammen til et pølserør!',
        mathHint: '💡 Rul pandekagen stramt fra kanten og ind!',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_spreading_jam_pancake_1080p_202607242303.mp4',
        icon: '🌟',
        isFinal: true
      }
    ]
  },
  chocolate_cake: {
    id: 'chocolate_cake',
    title: 'Noras Lækre Chokoladekage 🍫',
    subtitle: 'Rør en luftig chokoladedej, bag i ovnen og pynt med glade farver!',
    ingredients: [
      { id: 'butter', name: '100g Blødt Smør', img: 'assets/Butter_on_ceramic_plate_2K_202607242300.jpeg' },
      { id: 'sugar', name: '2 kopper Sukker', img: 'assets/ingrediens_flour_salt_oil.jpg' },
      { id: 'eggs', name: '2 Økologiske Æg', img: 'assets/3_brown_eggs_carton_2K_202607242300.jpeg' },
      { id: 'milk', name: '2 dl Frisk Mælk', img: 'assets/Glass_milk_pitcher_filled_milk_202607242300.jpeg' },
      { id: 'flour_cocoa', name: '3 kopper Mel, 4 spsk Kakao & 2 tsk Bagepulver', img: 'assets/Bowl_filled_with_cocoa_powder_202607250854.jpeg' },
      { id: 'sprinkles', name: 'Chokoladeglasur & Kulørt Krymmel', img: 'assets/Bowl_of_sprinkles_and_frosting_202607250854.jpeg' }
    ],
    steps: [
      {
        num: 1,
        title: 'Vask hænderne godt! 🧼',
        text: 'Før vi rører kagedejen sammen, skal vi vaske hænder med varmt vand og sæbe. Tæl til 20 mens du vasker!',
        mathHint: '💡 Tæl: 1, 2, 3... helt til 20!',
        mediaType: 'video',
        mediaSrc: 'assets/Child_hands_washing_with_soap_202607221138.mp4',
        icon: '🧼'
      },
      {
        num: 2,
        title: 'Tænd ovnen & smør formen 🥣🔥',
        text: 'Spørg en voksen om at tænde ovnen på 180°C varmluft. Smør derefter en rund kageform med en lille smule blødt smør.',
        mathHint: '⚠️ Husk: En voksen tænder ovnen på 180°C!',
        mediaType: 'image',
        mediaSrc: 'assets/Cake_baking_pan_butter_2K_202607250854.jpeg',
        icon: '🔥'
      },
      {
        num: 3,
        title: 'Pisk smør og sukker luftigt 🧈',
        text: 'Hæld 100g blødt smør og 2 kopper sukker i skålen. Pisk det godt sammen med elpiskere eller piskeris, til det bliver helt blødt og lyst!',
        mathHint: '💡 Tæl 2 kopper sukker op i skålen.',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_whisking_butter_sugar_1080p_202607250855.mp4',
        icon: '🧈'
      },
      {
        num: 4,
        title: 'Tilsæt æg og mælk 🥛🥚',
        text: 'Slå de 2 æg ud i skålen ét ad gangen. Hæld derefter 2 dl frisk mælk i og pisk dejen godt igennem.',
        mathHint: '💡 Tæl æggene: 1... 2 æg!',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_mixing_chocolate_batter_1080p_202607250855.mp4',
        icon: '🥛'
      },
      {
        num: 5,
        title: 'Sigt kakao, mel og bagepulver i 🌾🍫',
        text: 'Hæld 3 kopper mel, 4 spiseskefulde mørkt kakaopulver og 2 teskefulde bagepulver i skålen. Rør det hele sammen til dejen bliver helt mørkebrun og lækker!',
        mathHint: '💡 Tæl 4 store skefulde kakaopulver!',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_mixing_chocolate_batter_1080p_202607250855.mp4',
        icon: '🍫'
      },
      {
        num: 6,
        title: 'Hæld dejen i kageformen 🥧',
        text: 'Hæld den lækre mørke chokoladedej over i kageformen. Brug en dejskraber til at få det sidste dej ud af skålen!',
        mathHint: '💡 Glat overfladen ud så kagen bliver helt lige.',
        mediaType: 'video',
        mediaSrc: 'assets/Chocolate_cake_batter_poured_pan_202607250854.mp4',
        icon: '🥧'
      },
      {
        num: 7,
        title: 'Bag kagen i ovnen! (25 min) ⏱️🔥',
        text: 'Spørg en voksen om at sætte kagen midt i den varme ovn. Sæt timeren på 25 minutter og se kagen hæve op!',
        hasTimer: true,
        timerMinutes: 25,
        mathHint: '💡 25 minutters bagetid gør kagen dejlig svampet!',
        mediaType: 'video',
        mediaSrc: 'assets/Chocolate_cake_rising_in_oven_202607250855.mp4',
        icon: '🔥'
      },
      {
        num: 8,
        title: 'Pynt med glasur & krymmel! 🎉',
        text: 'Når kagen er afkølet, smører I et lækkert lag chokoladeglasur på toppen og drysser kulørt festkrymmel ud over! Velbekomme!',
        mathHint: '💡 Drys festkrymmel over hele kagen!',
        mediaType: 'video',
        mediaSrc: 'assets/Hands_spreading_frosting_on_cake_202607250854.mp4',
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

// HIGH-QUALITY DANISH WEBSPEECH VOICEOVER MANAGER (100% FREE & NATIVE)
class VoiceoverManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.danishVoice = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const findVoice = () => {
      const voices = this.synth.getVoices();
      this.danishVoice = voices.find(v => v.lang.includes('da-DK') || v.lang.includes('da_DK') || v.lang.startsWith('da')) || null;
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    const btn = document.getElementById('speechBtn');
    if (btn) {
      btn.classList.remove('speaking');
      btn.innerHTML = '🔊 Læs Højt for Mig!';
    }
  }

  toggleSpeak(text) {
    if (!this.synth) {
      alert('⚠️ Din browser understøtter ikke indbygget oplæsning.');
      return;
    }

    if (this.synth.speaking) {
      this.stop();
      return;
    }

    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.danishVoice) {
      utterance.voice = this.danishVoice;
    }
    utterance.lang = 'da-DK';
    utterance.rate = 0.92;
    utterance.pitch = 1.08;

    const btn = document.getElementById('speechBtn');
    
    utterance.onstart = () => {
      if (btn) {
        btn.classList.add('speaking');
        btn.innerHTML = '🛑 Stop Oplæsning';
      }
    };

    utterance.onend = () => {
      if (btn) {
        btn.classList.remove('speaking');
        btn.innerHTML = '🔊 Læs Højt for Mig!';
      }
    };

    utterance.onerror = () => {
      this.stop();
    };

    this.synth.speak(utterance);
  }
}

const voiceover = new VoiceoverManager();

// VIDEO PRELOADER FOR INSTANT PLAYBACK PERFORMANCE
function preloadRecipeVideos() {
  const steps = [...recipeData.pizza.steps, ...recipeData.pancakes.steps, ...recipeData.chocolate_cake.steps];
  steps.forEach(step => {
    if (step.mediaType === 'video' && step.mediaSrc) {
      const videoPreloader = document.createElement('video');
      videoPreloader.preload = 'auto';
      videoPreloader.src = step.mediaSrc;
      videoPreloader.muted = true;
      videoPreloader.style.display = 'none';
      document.body.appendChild(videoPreloader);
    }
  });
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  updateStarDisplay();
  renderHome();
  setTimeout(preloadRecipeVideos, 1000);
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
  voiceover.stop();
  sounds.playClick();
  state.currentView = 'home';
  renderHome();
}

function renderHome() {
  const isPancakesUnlocked = state.stars >= 3;
  const isCakeUnlocked = state.stars >= 6;

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div class="hero-banner">
      <div class="hero-text">
        <h2>Hej Nora! 👋</h2>
        <p>Er du klar til at lave lækker mad fra bunden i dag?</p>
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

      <!-- PANCAKES (Unlocked if >= 3 stars) -->
      ${isPancakesUnlocked ? `
        <div class="recipe-card active-card" onclick="openIngredients('pancakes')">
          <div class="recipe-img-box">
            <img src="assets/hero_pancake.jpg" alt="Pandekager" class="custom-card-img">
          </div>
          <div class="recipe-title">Lækre Pandekager</div>
          <div class="recipe-tags">
            <span class="tag">⏱️ 20 min</span>
            <span class="tag">⭐ Låst Op!</span>
          </div>
          <button class="start-recipe-btn" style="background: var(--primary-pink); box-shadow: 0 4px 0px #C53030;">Start Nu 🥞</button>
        </div>
      ` : `
        <div class="recipe-card locked-card" onclick="soundLocked()">
          <span class="lock-badge">🔒 Låses op ved 3 ⭐</span>
          <div class="recipe-img-box">
            <img src="assets/hero_pancake.jpg" alt="Pandekager" class="custom-card-img" style="filter: grayscale(60%);">
          </div>
          <div class="recipe-title">Lækre Pandekager</div>
          <div class="recipe-tags">
            <span class="tag">⏱️ 20 min</span>
            <span class="tag">⭐ Kræver 3 stjerner</span>
          </div>
        </div>
      `}

      <!-- CHOKOLADEKAGE (Unlocked if >= 6 stars) -->
      ${isCakeUnlocked ? `
        <div class="recipe-card active-card" onclick="openIngredients('chocolate_cake')">
          <div class="recipe-img-box">
            <img src="assets/hero_chocolate_cake.jpg" alt="Chokoladekage" class="custom-card-img">
          </div>
          <div class="recipe-title">Lækker Chokoladekage</div>
          <div class="recipe-tags">
            <span class="tag">⏱️ 30 min</span>
            <span class="tag">⭐ Låst Op!</span>
          </div>
          <button class="start-recipe-btn" style="background: var(--primary-purple); box-shadow: 0 4px 0px #5E17EB;">Start Nu 🍫</button>
        </div>
      ` : `
        <div class="recipe-card locked-card" onclick="soundLocked('Chokoladekage kræver 6 stjerner! ⭐')">
          <span class="lock-badge">🔒 Låses op ved 6 ⭐</span>
          <div class="recipe-img-box">
            <img src="assets/hero_chocolate_cake.jpg" alt="Chokoladekage" class="custom-card-img" style="filter: grayscale(40%);">
          </div>
          <div class="recipe-title">Lækker Chokoladekage</div>
          <div class="recipe-tags">
            <span class="tag">⏱️ 30 min</span>
            <span class="tag">⭐ Kræver 6 stjerner</span>
          </div>
        </div>
      `}
    </div>
  `;
}

function soundLocked(msg = '🔒 Lav Pizzaen først for at opnå stjerner og låse op!') {
  sounds.playClick();
  alert(msg);
}

// INGREDIENTS CHECKLIST VIEW
function openIngredients(recipeId) {
  voiceover.stop();
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
            <img src="${ing.img}" alt="${ing.name}" class="check-item-img">
            <span class="check-item-text">${ing.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="step-nav-bar">
        <button class="big-btn prev" onclick="goHome()">⬅️ Tilbage</button>
        <button class="big-btn next" onclick="openRecipeStep('${recipeId}', 0)">Klar! Start ➡️</button>
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
function openRecipeStep(recipeId = 'pizza', stepIdx = 0) {
  voiceover.stop();
  sounds.playClick();
  state.currentRecipe = recipeId;
  state.currentStepIndex = stepIdx;
  state.currentView = 'cooking';

  const recipe = recipeData[recipeId];
  const step = recipe.steps[stepIdx];

  if (step.hasTimer) {
    state.timerSeconds = (step.timerMinutes || 10) * 60;
  }

  const fullTextToRead = `${step.title}. ${step.text} ${step.mathHint ? step.mathHint.replace(/[\u{1F300}-\u{1F9FF}]/gu, '') : ''}`;

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <!-- STEP PROGRESS INDICATOR -->
    <div class="step-header">
      <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--primary-pink)">
        ${recipe.title} - Trin ${step.num} af ${recipe.steps.length}
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
        
        <!-- LEFT: OPTIMIZED INSTANT VIDEO / IMAGE DISPLAY -->
        <div class="media-wrapper">
          ${step.mediaType === 'video' ? `
            <video src="${step.mediaSrc}" preload="auto" autoplay loop muted playsinline style="width:100%; height:100%; object-fit:cover; border-radius:16px;"></video>
          ` : `
            <img src="${step.mediaSrc}" alt="${step.title}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">
          `}
        </div>

        <!-- RIGHT: INSTRUCTIONS & MATH HINTS -->
        <div class="step-instructions">
          <div>
            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:8px;">
              <div class="step-num-badge">Trin ${step.num}</div>
              <button id="speechBtn" class="speech-btn" onclick="voiceover.toggleSpeak(\`${fullTextToRead.replace(/`/g, '\\`')}\`)">
                🔊 Læs Højt for Mig!
              </button>
            </div>
            
            <h2 class="step-title">${step.title}</h2>
            <p class="step-text">${step.text}</p>

            ${step.mathHint ? `
              <div class="kid-math-box">
                <span class="math-icon">🔢</span>
                <span>${step.mathHint}</span>
              </div>
            ` : ''}
          </div>

          <!-- IN-APP TIMER -->
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
          <button class="big-btn prev" onclick="openRecipeStep('${recipeId}', ${stepIdx - 1})">⬅️ Forrige</button>
        ` : `
          <button class="big-btn prev" onclick="openIngredients('${recipeId}')">⬅️ Tjekliste</button>
        `}

        ${step.isFinal ? `
          <button class="big-btn finish" onclick="finishRecipe('${recipeId}')">Færdig! Få 3 Stjerner ⭐⭐⭐</button>
        ` : `
          <button class="big-btn next" onclick="openRecipeStep('${recipeId}', ${stepIdx + 1})">Næste Trin ➡️</button>
        `}
      </div>

    </div>
  `;

  const activeVideo = main.querySelector('video');
  if (activeVideo) {
    activeVideo.play().catch(() => {});
  }
}

// Backward compatibility helper
function openPizzaRecipe(stepIdx = 0) {
  openRecipeStep('pizza', stepIdx);
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
function finishRecipe(recipeId = 'pizza') {
  voiceover.stop();
  sounds.playFanfare();
  addStars(3);

  if (window.confetti) {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 }
    });
  }

  const recipe = recipeData[recipeId];
  let trophyImg = 'assets/pizza_trophy.jpg';
  let title = 'PIZZA-MESTER!';

  if (recipeId === 'pancakes') {
    trophyImg = 'assets/pancake_trophy.jpg';
    title = 'PANDEKAGE-MESTER!';
  } else if (recipeId === 'chocolate_cake') {
    trophyImg = 'assets/hero_chocolate_cake.jpg';
    title = 'KAGE-MESTER!';
  }

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 24px; border: 4px solid var(--primary-yellow);">
      <img src="${trophyImg}" alt="Trofæ" style="width:160px; height:160px; object-fit:cover; border-radius:24px; box-shadow:0 8px 24px rgba(0,0,0,0.15); animation: floatPizza 2s infinite ease-in-out;">
      <h1 style="font-family: var(--font-heading); font-size: 2.5rem; color: var(--primary-pink); margin: 16px 0;">
        SEJT GÅET, NORA! 🎉
      </h1>
      <p style="font-size: 1.4rem; font-weight: bold; color: var(--text-dark); margin-bottom: 24px;">
        Du er nu en ægte ${title} Du har optjent 3 nye stjerner! ⭐⭐⭐
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
  voiceover.stop();
  sounds.playClick();
  state.currentView = 'badges';
  const isPancakesCompleted = state.stars >= 6;
  const isCakeCompleted = state.stars >= 9;

  const main = document.getElementById('mainView');
  main.innerHTML = `
    <div class="checklist-container">
      <h2 class="step-title">Noras Trofæer & Diplomer 🏆</h2>
      <p class="step-text">Her er alle de seje kokke-mærker du har låst op for!</p>

      <div class="badges-grid">
        <div class="badge-card">
          <img src="assets/pizza_trophy.jpg" alt="Pizza Trofæ" class="custom-trophy-img">
          <div class="badge-title">Dej-Mester & Pizza-Mester</div>
          <span class="tag" style="background:#E6FFFA; color:#049A73;">Opnået! ⭐</span>
        </div>

        <div class="badge-card">
          <img src="assets/chef_mascot.jpg" alt="Kokke Mærke" class="custom-trophy-img">
          <div class="badge-title">Ren Vaskebjørn</div>
          <span class="tag" style="background:#E6FFFA; color:#049A73;">Opnået! 🧼</span>
        </div>

        <div class="badge-card" style="${isPancakesCompleted ? '' : 'opacity: 0.65;'}">
          <img src="assets/pancake_trophy.jpg" alt="Pandekage Trofæ" class="custom-trophy-img" style="${isPancakesCompleted ? '' : 'filter: grayscale(50%);'}">
          <div class="badge-title">Pandekage-Konge 🥞</div>
          ${isPancakesCompleted ? `<span class="tag" style="background:#E6FFFA; color:#049A73;">Opnået! ⭐</span>` : `<span class="tag">Lav Pandekager</span>`}
        </div>

        <div class="badge-card" style="${isCakeCompleted ? '' : 'opacity: 0.65;'}">
          <img src="assets/hero_chocolate_cake.jpg" alt="Chokoladekage Trofæ" class="custom-trophy-img" style="${isCakeCompleted ? '' : 'filter: grayscale(50%);'}">
          <div class="badge-title">Kage-Mester 🍫</div>
          ${isCakeCompleted ? `<span class="tag" style="background:#E6FFFA; color:#049A73;">Opnået! ⭐</span>` : `<span class="tag">Bage Chokoladekage</span>`}
        </div>
      </div>

      <div style="margin-top: 24px;">
        <button class="big-btn prev" onclick="goHome()">⬅️ Tilbage</button>
      </div>
    </div>
  `;
}
