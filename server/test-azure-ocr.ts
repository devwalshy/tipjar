/**
 * Test script for Azure Document Intelligence OCR
 * Tests both Azure and Tesseract engines
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeImageWithService } from './lib/ocrService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAzureOCR() {
  console.log('=== Testing Azure Document Intelligence OCR ===\n');
  
  // Check Azure configuration (supports both old and new variables)
  const hasAzure = !!((process.env.AZURE_DI_KEY && process.env.AZURE_DI_ENDPOINT) || 
                      (process.env.AZURE_CV_KEY && process.env.AZURE_CV_ENDPOINT));
  const usingDI = !!(process.env.AZURE_DI_KEY && process.env.AZURE_DI_ENDPOINT);
  
  console.log(`Azure configured: ${hasAzure ? '✅ YES' : '❌ NO'}`);
  if (hasAzure) {
    console.log(`Using: ${usingDI ? 'Document Intelligence (recommended)' : 'Computer Vision (legacy)'}`);
  }
  
  if (!hasAzure) {
    console.log('\n⚠️  Azure not configured.');
    console.log('Set AZURE_DI_KEY and AZURE_DI_ENDPOINT to test Azure Document Intelligence.');
    console.log('See AZURE_DOCUMENT_INTELLIGENCE.md for setup instructions.\n');
  }
  
  const assetsDir = path.join(__dirname, '..', 'attached_assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.error('attached_assets directory not found');
    return;
  }
  
  const imageFiles = fs.readdirSync(assetsDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
    .filter(file => file.includes('report')); // Only test actual reports
  
  console.log(`Found ${imageFiles.length} report images to test\n`);
  
  for (const imageFile of imageFiles) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Testing: ${imageFile}`);
    console.log('='.repeat(70));
    
    try {
      const imagePath = path.join(assetsDir, imageFile);
      const imageBuffer = fs.readFileSync(imagePath);
      
      console.log(`Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      const startTime = Date.now();
      const result = await analyzeImageWithService(imageBuffer, 'auto');
      const endTime = Date.now();
      
      console.log(`Processing time: ${((endTime - startTime) / 1000).toFixed(2)}s`);
      console.log(`OCR Engine used: ${result.engine.toUpperCase()}`);
      
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else if (result.partnerData && result.partnerData.length > 0) {
        console.log(`✅ Success!`);
        console.log(`Confidence: ${result.confidence}%`);
        console.log(`Partners extracted: ${result.partnerData.length}`);
        console.log('\nPartner Data:');
        
        let totalHours = 0;
        result.partnerData.forEach((partner, index) => {
          console.log(`  ${String(index + 1).padStart(2, ' ')}. ${partner.name.padEnd(30, ' ')} ${partner.hours} hours`);
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
  
  console.log('\n' + '='.repeat(70));
  console.log('Testing complete');
  console.log('='.repeat(70));
  
  // Terminate OCR workers
  const { terminateOCRWorker } = await import('./lib/ocrConfig');
  await terminateOCRWorker();
}

// Run the test
testAzureOCR().catch(error => {
  console.error('Test script error:', error);
  process.exit(1);
});

