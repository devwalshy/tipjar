/**
 * Debug script to see exactly what Azure Document Intelligence returns
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugAzureTable() {
  const apiKey = process.env.AZURE_DI_KEY || process.env.AZURE_CV_KEY;
  const endpoint = process.env.AZURE_DI_ENDPOINT || process.env.AZURE_CV_ENDPOINT;
  
  if (!apiKey || !endpoint) {
    console.error('Azure credentials not found');
    return;
  }
  
  // Read the most recent uploaded image
  const uploadsDir = path.join(__dirname, '..', 'attached_assets');
  if (!fs.existsSync(uploadsDir)) {
    console.error('No attached_assets directory found');
    return;
  }
  
  const files = fs.readdirSync(uploadsDir).filter(f => /\.(jpg|png|jpeg)$/i.test(f));
  if (files.length === 0) {
    console.error('No images in uploads directory');
    return;
  }
  
  // Use the most recent file
  const latestFile = files.sort((a, b) => {
    const statA = fs.statSync(path.join(uploadsDir, a));
    const statB = fs.statSync(path.join(uploadsDir, b));
    return statB.mtimeMs - statA.mtimeMs;
  })[0];
  
  console.log(`\n📄 Analyzing: ${latestFile}\n`);
  
  const imagePath = path.join(uploadsDir, latestFile);
  const imageBuffer = fs.readFileSync(imagePath);
  
  // Step 1: Submit for analysis
  const analyzeUrl = `${endpoint}/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31`;
  
  console.log('Submitting to Azure Document Intelligence...');
  const analyzeResponse = await fetch(analyzeUrl, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/octet-stream'
    },
    body: imageBuffer as any
  });
  
  if (!analyzeResponse.ok) {
    console.error('Error:', analyzeResponse.status, await analyzeResponse.text());
    return;
  }
  
  const operationLocation = analyzeResponse.headers.get('Operation-Location');
  if (!operationLocation) {
    console.error('No operation location');
    return;
  }
  
  // Step 2: Poll for results
  console.log('Waiting for results...\n');
  let attempts = 0;
  
  while (attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const resultResponse = await fetch(operationLocation, {
      headers: { 'Ocp-Apim-Subscription-Key': apiKey }
    });
    
    const result = await resultResponse.json();
    
    if (result.status === 'succeeded') {
      console.log('✅ Analysis complete!\n');
      
      // Show table structure
      if (result.analyzeResult?.tables) {
        console.log(`Found ${result.analyzeResult.tables.length} table(s)\n`);
        
        for (let tableIdx = 0; tableIdx < result.analyzeResult.tables.length; tableIdx++) {
          const table = result.analyzeResult.tables[tableIdx];
          console.log(`\n${'='.repeat(80)}`);
          console.log(`TABLE ${tableIdx + 1}: ${table.rowCount} rows × ${table.columnCount} columns`);
          console.log('='.repeat(80));
          
          // Organize by row
          const rows = new Map<number, Map<number, string>>();
          
          for (const cell of table.cells) {
            if (!rows.has(cell.rowIndex)) {
              rows.set(cell.rowIndex, new Map());
            }
            rows.get(cell.rowIndex)!.set(cell.columnIndex, cell.content);
          }
          
          // Print each row
          const sortedRowIndices = Array.from(rows.keys()).sort((a, b) => a - b);
          
          for (const rowIndex of sortedRowIndices) {
            const rowData = rows.get(rowIndex)!;
            const sortedColIndices = Array.from(rowData.keys()).sort((a, b) => a - b);
            
            const rowText = sortedColIndices
              .map(colIndex => {
                const content = rowData.get(colIndex) || '';
                return content.padEnd(25, ' ');
              })
              .join(' | ');
            
            console.log(`Row ${String(rowIndex).padStart(2, '0')}: ${rowText}`);
          }
          
          console.log('\n' + '='.repeat(80));
          console.log(`Total cells: ${table.cells.length}`);
          console.log('='.repeat(80));
        }
      } else {
        console.log('❌ No tables found in response');
      }
      
      // Also show content
      if (result.analyzeResult?.content) {
        console.log('\n\n📝 Full Text Content:\n');
        console.log(result.analyzeResult.content);
      }
      
      break;
    } else if (result.status === 'failed') {
      console.error('Analysis failed:', result);
      break;
    }
    
    attempts++;
  }
}

debugAzureTable().catch(console.error);

