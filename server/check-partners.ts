/**
 * Check how many partners are in the OCR output
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { preprocessForTable } from './lib/imagePreprocessor';
import { performOCR } from './lib/ocrConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkPartners() {
  const imagePath = path.join(__dirname, '..', 'attached_assets', 'image_1745970494367.png');
  const imageBuffer = fs.readFileSync(imagePath);
  
  console.log('Extracting OCR text from image...\n');
  const processed = await preprocessForTable(imageBuffer);
  const text = await performOCR(processed);
  
  console.log('FULL OCR TEXT:');
  console.log('='.repeat(80));
  console.log(text);
  console.log('='.repeat(80));
  
  console.log(`\nTotal characters: ${text.length}`);
  console.log(`Total lines: ${text.split('\n').length}`);
  
  // Count all lines that look like partner names (have comma format)
  const lines = text.split('\n');
  const nameLines = lines.filter(line => 
    /^[A-Za-z\s\.'-]+,\s+[A-Za-z\s\.'-]+$/.test(line.trim())
  );
  
  console.log(`\nLines matching name pattern: ${nameLines.length}`);
  console.log('\nAll name-like lines:');
  nameLines.forEach((line, i) => {
    console.log(`  ${i + 1}. ${line.trim()}`);
  });
  
  // Cleanup
  const { terminateOCRWorker } = await import('./lib/ocrConfig');
  await terminateOCRWorker();
}

checkPartners().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

