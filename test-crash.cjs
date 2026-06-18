const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000');
  
  try {
    // Click "Ga verder" (step 0 -> 1)
    await page.waitForSelector('#btn-orange-splash-continue', {timeout: 5000});
    await page.click('#btn-orange-splash-continue');
    await new Promise(r => setTimeout(r, 500));
    
    // Click "Start de Levensmeting" (step 1 -> 2)
    await page.waitForSelector('#btn-welcome-start');
    await page.click('#btn-welcome-start');
    await new Promise(r => setTimeout(r, 500));
    
    // Now on Step 2. Select Gender and Age to proceed
    await page.waitForSelector('#btn-onboarding-gender-man');
    await page.click('#btn-onboarding-gender-man');
    
    // Move age slider
    await page.evaluate(() => {
      const slider = document.querySelector('#slider-onboarding-birthyear');
      slider.value = 1980;
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Click "Volgende" (step 2 -> transition -> 3)
    console.log("Clicking Next to trigger transition");
    await page.click('#btn-onboarding-next');
    
    // Wait 2 seconds to let transition finish
    await new Promise(r => setTimeout(r, 3000));
    console.log("After transition wait");
  } catch (e) {
    console.log("SCRIPT ERROR:", e.toString());
  }
  
  await browser.close();
  console.log("Test finished.");
})();
