const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  const artifactDir = '/Users/ianropke/.gemini/antigravity/brain/743c5c39-dca3-4864-bbfd-5c97576f30e0';
  
  await page.goto('https://noraskokkeskole.vercel.app', { waitUntil: 'networkidle' });
  
  // Set stars to 10 in localStorage to unlock all recipes
  await page.evaluate(() => {
    localStorage.setItem('noras_stars', '10');
    location.reload();
  });
  
  await page.waitForTimeout(1000);
  
  // 1. Home View with all recipes unlocked
  await page.screenshot({ path: path.join(artifactDir, 'shot_7_cake_unlocked_home.png'), fullPage: true });
  console.log('Saved shot_7_cake_unlocked_home.png');
  
  // 2. Click Chocolate Cake start button / card
  await page.click('button:has-text("Start Nu 🍫")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'shot_8_cake_ingredients.png'), fullPage: true });
  console.log('Saved shot_8_cake_ingredients.png');
  
  // 3. Click Klar! Start ➡️
  await page.click('button:has-text("Klar! Start ➡️")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'shot_9_cake_step1.png'), fullPage: true });
  console.log('Saved shot_9_cake_step1.png');

  // 4. Click Næste Trin until Step 3 (Whisking butter & sugar video)
  await page.click('button:has-text("Næste Trin ➡️")'); // Step 2
  await page.waitForTimeout(500);
  await page.click('button:has-text("Næste Trin ➡️")'); // Step 3
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'shot_10_cake_step3_whisking.png'), fullPage: true });
  console.log('Saved shot_10_cake_step3_whisking.png');

  await browser.close();
})();
