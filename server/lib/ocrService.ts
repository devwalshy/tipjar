/**
 * OCR Service - Abstraction layer for multiple OCR engines
 * Supports: Azure AI Document Intelligence, Tesseract, and more
 */

import { analyzeImageWithAzure } from '../api/azureOcr';
import { analyzeImage as analyzeWithTesseract } from '../api/ocr';
import { parseStarbucksReport, validateParseResult } from './tableParser';

export type OCREngine = 'azure' | 'tesseract' | 'auto';

interface OCRServiceResult {
  text: string | null;
  partnerData: Array<{ name: string; hours: number }>;
  confidence: number;
  engine: string;
  error?: string;
}

/**
 * Analyze image using the configured OCR engine
 * @param imageBuffer Image buffer to analyze
 * @param preferredEngine Preferred OCR engine (defaults to env var or 'auto')
 * @returns OCR result with partner data
 */
export async function analyzeImageWithService(
  imageBuffer: Buffer,
  preferredEngine?: OCREngine
): Promise<OCRServiceResult> {
  
  const engine = preferredEngine || (process.env.OCR_ENGINE as OCREngine) || 'auto';
  
  console.log(`OCR Service: Using engine strategy '${engine}'`);
  
  // Auto mode: Try Azure first, fallback to Tesseract
  if (engine === 'auto') {
    return await tryAutoMode(imageBuffer);
  }
  
  // Azure mode: Try Azure only
  if (engine === 'azure') {
    return await tryAzure(imageBuffer);
  }
  
  // Tesseract mode: Try Tesseract only
  if (engine === 'tesseract') {
    return await tryTesseract(imageBuffer);
  }
  
  // Default fallback
  return await tryTesseract(imageBuffer);
}

/**
 * Auto mode: Try Azure first, fallback to Tesseract
 */
async function tryAutoMode(imageBuffer: Buffer): Promise<OCRServiceResult> {
  console.log('Auto mode: Trying Azure first...');
  
  // Try Azure
  const azureResult = await tryAzure(imageBuffer);
  
    // If Azure succeeded with reasonable confidence, use it
    // Lower threshold for Azure since it's generally more accurate
    if (azureResult.partnerData.length > 0 && azureResult.confidence >= 15) {
      console.log(`Auto mode: Azure succeeded with confidence ${azureResult.confidence}%`);
      return azureResult;
    }
  
  // Otherwise, try Tesseract as fallback
  console.log('Auto mode: Azure confidence low or failed, trying Tesseract...');
  const tesseractResult = await tryTesseract(imageBuffer);
  
  // Return whichever has better results
  if (tesseractResult.confidence > azureResult.confidence) {
    console.log(`Auto mode: Tesseract won with confidence ${tesseractResult.confidence}%`);
    return tesseractResult;
  }
  
  console.log(`Auto mode: Using Azure result with confidence ${azureResult.confidence}%`);
  return azureResult;
}

/**
 * Try Azure AI Document Intelligence OCR
 */
async function tryAzure(imageBuffer: Buffer): Promise<OCRServiceResult> {
  try {
    const result = await analyzeImageWithAzure(imageBuffer);
    
    if (!result.text || result.error) {
      return {
        text: null,
        partnerData: [],
        confidence: 0,
        engine: 'azure',
        error: result.error || 'Azure OCR failed'
      };
    }
    
    // Parse the extracted text
    console.log(`\n${'='.repeat(80)}`);
    console.log(`AZURE OCR TEXT (${result.text.length} characters):`);
    console.log('='.repeat(80));
    console.log(result.text);
    console.log('='.repeat(80));
    
    const parseResult = parseStarbucksReport(result.text);
    
    console.log(`Azure parser found ${parseResult.partners.length} partners with ${parseResult.confidence}% confidence`);
    
    // For Azure Document Intelligence, accept results even if validation is borderline
    // Document Intelligence is specifically designed for tables and has 95-98% accuracy
    if (parseResult.partners.length > 0) {
      console.log(`Accepting Azure result with ${parseResult.partners.length} partners`);
      return {
        text: result.text,
        partnerData: parseResult.partners,
        confidence: parseResult.confidence,
        engine: 'azure'
      };
    }
    
    return {
      text: result.text,
      partnerData: [],
      confidence: parseResult.confidence,
      engine: 'azure',
      error: 'No partners found in Azure text'
    };
    
  } catch (error) {
    console.error('Azure OCR error:', error);
    return {
      text: null,
      partnerData: [],
      confidence: 0,
      engine: 'azure',
      error: `Azure exception: ${error instanceof Error ? error.message : 'Unknown'}`
    };
  }
}

/**
 * Try Tesseract OCR
 */
async function tryTesseract(imageBuffer: Buffer): Promise<OCRServiceResult> {
  try {
    const result = await analyzeWithTesseract(imageBuffer);
    
    if (!result.text || !result.partnerData || result.partnerData.length === 0) {
      return {
        text: result.text,
        partnerData: [],
        confidence: 0,
        engine: 'tesseract',
        error: result.error || 'Tesseract OCR failed'
      };
    }
    
    return {
      text: result.text,
      partnerData: result.partnerData,
      confidence: result.confidence || 0,
      engine: 'tesseract'
    };
    
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    return {
      text: null,
      partnerData: [],
      confidence: 0,
      engine: 'tesseract',
      error: `Tesseract exception: ${error instanceof Error ? error.message : 'Unknown'}`
    };
  }
}
