/**
 * Debug what Azure is actually extracting
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeImageWithAzure } from './api/azureOcr';
import { parseStarbucksReport } from './lib/tableParser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugAzure() {
  const assetsDir = path.join(__dirname, '..', 'attached_assets');
  const imageFiles = fs.readdirSync(assetsDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
    .filter(file => file.includes('report'));
  
  if (imageFiles.length === 0) {
    console.log('No report images found in attached_assets/');
    return;
  }
  
  const imagePath = path.join(assetsDir, imageFiles[0]);
  const imageBuffer = fs.readFileSync(imagePath);
  
  console.log(`Testing with: ${imageFiles[0]}\n`);
  console.log('='.repeat(70));
  
  const result = await analyzeImageWithAzure(imageBuffer);
  
  if (result.text) {
    console.log('AZURE OCR TEXT:');
    console.log('='.repeat(70));
    console.log(result.text);
    console.log('='.repeat(70));
    console.log(`\nLength: ${result.text.length} characters`);
    
    console.log('\n\nPARSING RESULT:');
    console.log('='.repeat(70));
    const parsed = parseStarbucksReport(result.text);
    console.log(`Partners found: ${parsed.partners.length}`);
    console.log(`Confidence: ${parsed.confidence}%`);
    
    if (parsed.partners.length > 0) {
      console.log('\nPartners:');
      parsed.partners.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name}: ${p.hours} hours`);
      });
    }
  } else {
    console.log('Error:', result.error);
  }
}

debugAzure().catch(console.error);

