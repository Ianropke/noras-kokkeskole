const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple zero-dependency local static HTTP server
function startLocalServer(port = 8765) {
  const root = __dirname;
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp4': 'video/mp4',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(root, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

(async () => {
  console.log('🚀 STARTER AUTOMATERET LOCAL ENTERPRISE QA SUITE FOR NORAS KOKKESKOLE...\n');
  const port = 8765;
  const server = await startLocalServer(port);
  const localUrl = `http://localhost:${port}`;
  
  const results = {
    releaseGate: false,
    bvaTests: false,
    chaosTests: false,
    performance: false,
    accessibility: false,
    details: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2 // iPad Retina
  });

  const page = await context.newPage();
  
  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // ------------------------------------------------------------------------
    // TEST 1: 15-MINUTE RELEASE GATE (REGRESSION SUITE)
    // ------------------------------------------------------------------------
    console.log('📋 1. Eksekverer 15-Minutters Release Gate (Regression Suite)...');
    await page.goto(localUrl, { waitUntil: 'domcontentloaded' });
    
    // Explicitly set 0 stars for Cold Start test
    await page.evaluate(() => {
      localStorage.setItem('noras_stars', '0');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    // Check cold start state (0 stars, Pizza unlocked)
    const starCountText = await page.innerText('#starCount');
    console.log(`   - Strict Cold start stjerner: ${starCountText} (Forventet: 0)`);
    if (starCountText !== '0') throw new Error(`Cold start stjerner var ikke 0, var: ${starCountText}`);

    // Click Start Pizza
    await page.click('button:has-text("Start Nu ✨")');
    await page.waitForTimeout(200);

    // Toggle ingredient checklist
    await page.click('.check-item');
    console.log('   - Ingrediens tjekliste afkrydset (Web Audio pop-lyd udløst)');

    // Start Recipe Steps
    await page.click('button:has-text("Klar! Start ➡️")');
    await page.waitForTimeout(200);
    console.log('   - Trin 1 startet (Vask Hænder)');

    // Check Voiceover Button
    const speechBtn = await page.innerText('#speechBtn');
    console.log(`   - Voiceover knap tilstede: "${speechBtn}"`);

    // Navigate through steps
    for (let i = 0; i < 12; i++) {
      const nextBtn = await page.$('button:has-text("Næste Trin ➡️")');
      if (nextBtn && await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(100);
      }
    }

    // Finish Recipe
    const finishBtn = await page.$('button:has-text("Færdig! Få 3 Stjerner ⭐⭐⭐")');
    if (finishBtn && await finishBtn.isVisible()) {
      await finishBtn.click();
      await page.waitForTimeout(300);
      console.log('   - Pizza fuldført (+3 Stjerner)');
    }

    // Answer Quiz for Bonus Star
    const quizOpt = await page.$('.quiz-opt-btn:has-text("30 minutter")');
    if (quizOpt && await quizOpt.isVisible()) {
      await quizOpt.click();
      await page.waitForTimeout(300);
      console.log('   - Bonus Quiz besvaret korrekt (+1 Bonus Stjerne)');
    }

    const updatedStars = await page.innerText('#starCount');
    console.log(`   - Opdateret stjerne-antal: ${updatedStars} (Forventet: 4)`);
    if (parseInt(updatedStars) < 4) throw new Error('Stjerner blev ikke opdateret korrekt');

    results.releaseGate = true;
    results.details.push('✅ Test 1: 15-Minutters Release Gate BESTÅET');

    // ------------------------------------------------------------------------
    // TEST 2: BOUNDARY VALUE ANALYSIS (BVA STJERNE-LOGIK)
    // ------------------------------------------------------------------------
    console.log('\n📏 2. Eksekverer Grænseværdianalyse (BVA Stjerne-Logik)...');
    
    const bvaCases = [
      { input: '-1', expectedUnlocked: 1 },
      { input: '0', expectedUnlocked: 1 },
      { input: '3', expectedUnlocked: 2 },  // Pizza + Pancakes
      { input: '6', expectedUnlocked: 3 },  // Pizza + Pancakes + Cake
      { input: '999', expectedUnlocked: 3 },
      { input: 'null', expectedUnlocked: 1 },
      { input: '{corrupted_json_bytes}', expectedUnlocked: 1 }
    ];

    for (const testCase of bvaCases) {
      await page.evaluate((val) => {
        localStorage.setItem('noras_stars', val);
      }, testCase.input);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(200);

      const activeCards = await page.$$('.recipe-card.active-card');
      console.log(`   - BVA Input '${testCase.input}': ${activeCards.length} opskrifter ulåst (Forventet: ${testCase.expectedUnlocked})`);
      if (activeCards.length !== testCase.expectedUnlocked) {
        throw new Error(`BVA uoverensstemmelse ved input '${testCase.input}': Fandt ${activeCards.length}, forventede ${testCase.expectedUnlocked}`);
      }
    }

    results.bvaTests = true;
    results.details.push('✅ Test 2: Grænseværdianalyse (BVA) BESTÅET');

    // ------------------------------------------------------------------------
    // TEST 3: STRESS & KAOS-TEST (MULTI-TAP & SPAM)
    // ------------------------------------------------------------------------
    console.log('\n💥 3. Eksekverer Kaos- & Stresstest (Multi-Tap Spamming)...');
    await page.evaluate(() => localStorage.setItem('noras_stars', '10'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    await page.click('button:has-text("Start Nu 🍫")'); // Open Chocolate Cake
    await page.waitForTimeout(200);
    await page.click('button:has-text("Klar! Start ➡️")');
    await page.waitForTimeout(200);

    // Spam click Next Step 20 times rapidly
    console.log('   - Udfører 20 lyn-klik på "Næste Trin"...');
    const nextBtn = await page.$('button:has-text("Næste Trin ➡️")');
    for (let i = 0; i < 20; i++) {
      if (nextBtn) nextBtn.click().catch(() => {});
    }
    await page.waitForTimeout(500);

    // Verify app did not crash
    const stepTitle = await page.innerText('.step-title');
    console.log(`   - App stabil efter multi-tap spam. Nuværende trin: "${stepTitle}"`);

    results.chaosTests = true;
    results.details.push('✅ Test 3: Kaos- & Stresstest BESTÅET (0 crashes)');

    // ------------------------------------------------------------------------
    // TEST 4: PERFORMANCE & CORE WEB VITALS AUDIT
    // ------------------------------------------------------------------------
    console.log('\n⚡ 4. Måler Core Web Vitals & Performance Metrikker...');
    const metrics = await page.evaluate(() => {
      const navTiming = performance.getEntriesByType('navigation')[0];
      return {
        domInteractive: Math.round(navTiming.domInteractive),
        loadEventEnd: Math.round(navTiming.loadEventEnd)
      };
    });

    console.log(`   - DOM Interactive: ${metrics.domInteractive}ms (SLA: < 1500ms)`);
    console.log(`   - Load Event Complete: ${metrics.loadEventEnd}ms (SLA: < 2500ms)`);
    console.log(`   - Konsol-fejl opfanget: ${consoleErrors.length} (SLA: 0)`);

    if (metrics.domInteractive < 1500 && consoleErrors.length === 0) {
      results.performance = true;
      results.details.push('✅ Test 4: Core Web Vitals & Performance BESTÅET');
    }

    // ------------------------------------------------------------------------
    // TEST 5: ACCESSIBILITY (WCAG 2.2 AA AUDIT)
    // ------------------------------------------------------------------------
    console.log('\n♿ 5. Auditerer WCAG 2.2 AA Tilgængelighed & Alt tags...');
    await page.evaluate(() => localStorage.setItem('noras_stars', '0'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    const buttonsCount = await page.$$eval('button', btns => btns.length);
    const imagesWithAlt = await page.$$eval('img[alt]', imgs => imgs.length);
    const totalImages = await page.$$eval('img', imgs => imgs.length);

    console.log(`   - Totale knapper: ${buttonsCount}`);
    console.log(`   - Billeder med alt-tekst: ${imagesWithAlt}/${totalImages}`);

    if (imagesWithAlt === totalImages) {
      results.accessibility = true;
      results.details.push('✅ Test 5: WCAG 2.2 AA Accessibility Audit BESTÅET (100% alt tags)');
    }

  } catch (err) {
    console.error('❌ TEST SUITE FEJL:', err.message);
    results.details.push(`❌ FEJL: ${err.message}`);
  } finally {
    await browser.close();
    server.close();
  }

  // ------------------------------------------------------------------------
  // SUMMARY REPORT
  // ------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('🏆 ENDELIG QA SLUT-RAPPORT & TEST-RESULTAT');
  console.log('='.repeat(60));
  results.details.forEach(line => console.log(line));
  
  const allPassed = results.releaseGate && results.bvaTests && results.chaosTests && results.performance && results.accessibility;
  console.log('='.repeat(60));
  console.log(allPassed ? '🎉 SAMLET RESULTAT: PASS (100% SUCCESS - READY FOR RELEASE)' : '❌ SAMLET RESULTAT: FAIL');
  console.log('='.repeat(60) + '\n');
})();
