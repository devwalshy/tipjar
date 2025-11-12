/**
 * Test script for OCR functionality
 * Tests the new Tesseract-based OCR with sample Starbucks reports
 */

import fs from 'fs';
import path from 'path';
import { analyzeImage } from './api/ocr';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testOCR() {
  console.log('=== Testing Tesseract OCR Implementation ===\n');
  
  // Find sample images in attached_assets
  const assetsDir = path.join(__dirname, '..', 'attached_assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.error('attached_assets directory not found');
    return;
  }
  
  const imageFiles = fs.readdirSync(assetsDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file));
  
  console.log(`Found ${imageFiles.length} images to test\n`);
  
  for (const imageFile of imageFiles) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${imageFile}`);
    console.log('='.repeat(60));
    
    try {
      const imagePath = path.join(assetsDir, imageFile);
      const imageBuffer = fs.readFileSync(imagePath);
      
      console.log(`Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      const startTime = Date.now();
      const result = await analyzeImage(imageBuffer);
      const endTime = Date.now();
      
      console.log(`Processing time: ${((endTime - startTime) / 1000).toFixed(2)}s`);
      
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else if (result.partnerData && result.partnerData.length > 0) {
        console.log(`✅ Success!`);
        console.log(`Confidence: ${result.confidence}%`);
        console.log(`Partners extracted: ${result.partnerData.length}`);
        console.log('\nPartner Data:');
        
        let totalHours = 0;
        result.partnerData.forEach((partner, index) => {
          console.log(`  ${index + 1}. ${partner.name}: ${partner.hours} hours`);
          totalHours += partner.hours;
        });
        
        console.log(`\nTotal Hours: ${totalHours.toFixed(2)}`);
      } else {
        console.log('⚠️ No partner data extracted');
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Testing complete');
  console.log('='.repeat(60));
  
  // Terminate the OCR worker to allow graceful exit
  const { terminateOCRWorker } = await import('./lib/ocrConfig');
  await terminateOCRWorker();
}

// Run the test
testOCR().catch(error => {
  console.error('Test script error:', error);
  process.exit(1);
});

