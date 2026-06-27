const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'img');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

async function optimize() {
  console.log('Optimizing images...');
  for (const file of files) {
    const filePath = path.join(dir, file);
    const tmpPath = filePath + '.tmp.png';
    const oldSize = fs.statSync(filePath).size;
    
    await sharp(filePath)
      .png({ quality: 80, compressionLevel: 9, effort: 10, palette: true })
      .toFile(tmpPath);
      
    const newSize = fs.statSync(tmpPath).size;
    fs.renameSync(tmpPath, filePath);
    
    console.log(`Optimized ${file}: ${(oldSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (-${((oldSize - newSize) / oldSize * 100).toFixed(1)}%)`);
  }
}

optimize().catch(console.error);
