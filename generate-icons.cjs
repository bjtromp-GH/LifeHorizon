const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }

  // Create the extracted elephant image
  const elephantIcon = await sharp('public/img/olifant-bril.png')
    .extract({ left: 5, top: 5, width: 790, height: 715 })
    .resize(800, 800, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  
  // 1. Create standard icon.png (1024x1024)
  const iconSvgText = `
    <svg width="1024" height="1024">
      <rect x="0" y="0" width="1024" height="1024" fill="#FAF3F0" />
    </svg>
  `;

  await sharp(Buffer.from(iconSvgText))
    .composite([
      { input: elephantIcon, top: 112, left: 112 }
    ])
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('Generated assets/icon.png');

  // 2. Create Adaptive Icon Background (1024x1024)
  await sharp(Buffer.from(iconSvgText))
    .png()
    .toFile(path.join(assetsDir, 'icon-background.png'));
  console.log('Generated assets/icon-background.png');

  // 3. Create Adaptive Icon Foreground (1024x1024)
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: elephantIcon, top: 112, left: 112 }
    ])
    .png()
    .toFile(path.join(assetsDir, 'icon-foreground.png'));
  console.log('Generated assets/icon-foreground.png');

  // 4. Create the Splash Screen (2732x2732)
  const splashSvgText = `
    <svg width="2732" height="2732">
      <rect x="0" y="0" width="2732" height="2732" fill="#D56B45" />
      <text x="1366" y="2100" font-family="sans-serif" font-weight="900" font-size="280" fill="#FFFFFF" text-anchor="middle">LifeHorizon</text>
    </svg>
  `;
  const elephantSplash = await sharp('public/img/olifant-bril.png')
    .extract({ left: 5, top: 5, width: 790, height: 715 })
    .resize(1300, 1300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
    
  await sharp(Buffer.from(splashSvgText))
    .composite([
      { input: elephantSplash, top: 550, left: 716 }
    ])
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
    
  console.log('Generated assets/splash.png');
}

createIcon().catch(console.error);
