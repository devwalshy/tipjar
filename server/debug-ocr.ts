/**
 * Debug script to see raw OCR output
 * Shows exactly what text Tesseract extracts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { preprocessImage, preprocessForTable } from './lib/imagePreprocessor';
import { performOCR } from './lib/ocrConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugOCR() {
  console.log('=== OCR Debug Mode ===\n');
  
  const assetsDir = path.join(__dirname, '..', 'attached_assets');
  const imageFiles = fs.readdirSync(assetsDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file));
  
  console.log(`Found ${imageFiles.length} images\n`);
  
  for (const imageFile of imageFiles) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`File: ${imageFile}`);
    console.log('='.repeat(60));
    
    try {
      const imagePath = path.join(assetsDir, imageFile);
      const imageBuffer = fs.readFileSync(imagePath);
      
      // Try table-optimized preprocessing
      console.log('\n--- Table-Optimized Preprocessing ---');
      const processed = await preprocessForTable(imageBuffer);
      const text = await performOCR(processed);
      
      console.log('\nRaw OCR Text:');
      console.log('─'.repeat(60));
      console.log(text);
      console.log('─'.repeat(60));
      
      console.log(`\nText Length: ${text.length} characters`);
      console.log(`Line Count: ${text.split('\n').length} lines`);
      
      // Show each line with line numbers
      console.log('\nLine-by-Line Output:');
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        if (line.trim()) {
          console.log(`${String(index + 1).padStart(3, ' ')}: ${line}`);
        }
      });
      
      // Look for key patterns
      console.log('\n\nPattern Analysis:');
      console.log('─'.repeat(60));
      
      const hasPartnerName = /partner\s+name/i.test(text);
      const hasTippableHours = /tippable\s+hours/i.test(text);
      const hasStoreNumbers = /\d{5}/.test(text);
      const hasPartnerIDs = /US\d{8}/i.test(text);
      const hasCommaNames = /[A-Za-z]+,\s+[A-Za-z]+/.test(text);
      const hasDecimalNumbers = /\d+\.\d+/.test(text);
      
      console.log(`✓ Contains "Partner Name": ${hasPartnerName}`);
      console.log(`✓ Contains "Tippable Hours": ${hasTippableHours}`);
      console.log(`✓ Contains Store Numbers (5 digits): ${hasStoreNumbers}`);
      console.log(`✓ Contains Partner IDs (US########): ${hasPartnerIDs}`);
      console.log(`✓ Contains Names with Comma: ${hasCommaNames}`);
      console.log(`✓ Contains Decimal Hours: ${hasDecimalNumbers}`);
      
      // Find lines that look like they might be partner data
      console.log('\n\nPossible Partner Lines:');
      console.log('─'.repeat(60));
      lines.forEach((line, index) => {
        if (line.trim() && (
          /[A-Za-z]+,\s+[A-Za-z]+/.test(line) || // Has comma name format
          /US\d{8}/.test(line) || // Has partner ID
          (/\d+\.\d+/.test(line) && line.length > 20) // Has decimal and is long enough
        )) {
          console.log(`Line ${index + 1}: ${line}`);
        }
      });
      
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Cleanup
  const { terminateOCRWorker } = await import('./lib/ocrConfig');
  await terminateOCRWorker();
  
  console.log('\n\n' + '='.repeat(60));
  console.log('Debug complete');
  console.log('='.repeat(60));
}

debugOCR().catch(error => {
  console.error('Debug script error:', error);
  process.exit(1);
});

