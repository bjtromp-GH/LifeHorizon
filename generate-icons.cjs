const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }

  // 1. Create the App Icon (1024x1024)
  const elephantIcon = await sharp('public/img/olifant-bril.png')
    .resize(700, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  
  const iconSvgText = `
    <svg width="1024" height="1024">
      <rect x="0" y="0" width="1024" height="1024" fill="#D56B45" />
      <text x="512" y="940" font-family="sans-serif" font-weight="900" font-size="160" fill="#FFFFFF" text-anchor="middle">LH</text>
    </svg>
  `;

  await sharp(Buffer.from(iconSvgText))
    .composite([
      { input: elephantIcon, top: 80, left: 162 }
    ])
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
    
  console.log('Generated assets/icon.png');

  // 2. Create the Splash Screen (2732x2732)
  const splashSvgText = `
    <svg width="2732" height="2732">
      <rect x="0" y="0" width="2732" height="2732" fill="#D56B45" />
      <text x="1366" y="2100" font-family="sans-serif" font-weight="900" font-size="280" fill="#FFFFFF" text-anchor="middle">LifeHorizon</text>
    </svg>
  `;
  const elephantSplash = await sharp('public/img/olifant-bril.png')
    .resize(1200, 1200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
    
  await sharp(Buffer.from(splashSvgText))
    .composite([
      { input: elephantSplash, top: 600, left: 766 }
    ])
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
    
  console.log('Generated assets/splash.png');
}

createIcon().catch(console.error);
