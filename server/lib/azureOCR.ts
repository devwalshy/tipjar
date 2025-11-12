/**
 * Azure Computer Vision OCR implementation
 * Uses Azure's Read API for text extraction from images
 */

import fetch from 'node-fetch';

interface AzureOCRResult {
  text: string;
  confidence: number;
  lines: Array<{
    text: string;
    boundingBox: number[];
  }>;
}

/**
 * Analyze an image using Azure Computer Vision Read API
 * @param imageBuffer The image buffer
 * @returns OCR result with extracted text and confidence
 */
export async function azureAnalyzeImage(imageBuffer: Buffer): Promise<{ text: string | null; confidence?: number; error?: string }> {
  try {
    const endpoint = process.env.AZURE_CV_ENDPOINT;
    const apiKey = process.env.AZURE_CV_KEY;
    
    if (!endpoint || !apiKey) {
      console.log('Azure credentials not configured, skipping Azure OCR');
      return { 
        text: null, 
        error: 'Azure Computer Vision not configured. Set AZURE_CV_ENDPOINT and AZURE_CV_KEY environment variables.' 
      };
    }
    
    console.log('Using Azure Computer Vision OCR...');
    
    // Step 1: Submit image for analysis
    const analyzeUrl = `${endpoint}/vision/v3.2/read/analyze`;
    
    const submitResponse = await fetch(analyzeUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    });
    
    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Azure OCR submission error:', submitResponse.status, errorText);
      return {
        text: null,
        error: `Azure OCR failed: ${submitResponse.status} ${submitResponse.statusText}`,
      };
    }
    
    // Get the operation location from response headers
    const operationLocation = submitResponse.headers.get('Operation-Location');
    if (!operationLocation) {
      return {
        text: null,
        error: 'Azure OCR: No operation location returned',
      };
    }
    
    // Step 2: Poll for results
    let result = null;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const resultResponse = await fetch(operationLocation, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
      });
      
      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        console.error('Azure OCR result error:', resultResponse.status, errorText);
        return {
          text: null,
          error: `Azure OCR result failed: ${resultResponse.status}`,
        };
      }
      
      const resultData = await resultResponse.json() as any;
      
      if (resultData.status === 'succeeded') {
        result = resultData;
        break;
      } else if (resultData.status === 'failed') {
        return {
          text: null,
          error: 'Azure OCR processing failed',
        };
      }
      
      attempts++;
    }
    
    if (!result) {
      return {
        text: null,
        error: 'Azure OCR timeout - processing took too long',
      };
    }
    
    // Step 3: Extract text from result
    const readResults = result.analyzeResult?.readResults || [];
    let extractedText = '';
    let totalConfidence = 0;
    let lineCount = 0;
    
    for (const page of readResults) {
      for (const line of page.lines) {
        extractedText += line.text + '\n';
        totalConfidence += line.confidence || 1.0;
        lineCount++;
      }
    }
    
    const avgConfidence = lineCount > 0 ? (totalConfidence / lineCount) * 100 : 0;
    
    if (!extractedText.trim()) {
      return {
        text: null,
        error: 'Azure OCR: No text extracted from image',
      };
    }
    
    console.log(`Azure OCR successful: ${extractedText.length} characters, ${avgConfidence.toFixed(1)}% confidence`);
    
    return {
      text: extractedText.trim(),
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error('Azure OCR error:', error);
    return {
      text: null,
      error: 'Azure OCR processing error',
    };
  }
}


