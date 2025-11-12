/**
 * OCR Service - Abstraction layer for multiple OCR engines
 * Supports: Mindee OCR (primary), Tesseract (fallback)
 */

import { analyzeImageWithMindee } from '../api/mindeeOcr';
import { analyzeImage as analyzeWithTesseract } from '../api/ocr';
import { parseStarbucksReport } from './tableParser';

export type OCREngine = 'mindee' | 'tesseract' | 'auto';

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

  const envEngine = (process.env.OCR_ENGINE as OCREngine | 'azure' | 'deepseek' | undefined) || 'auto';
  const selectedEngine = preferredEngine || envEngine;
  
  // Handle deprecated engine names
  let engine: OCREngine;
  if (selectedEngine === 'azure' || selectedEngine === 'deepseek') {
    console.warn(`OCR Service: OCR_ENGINE=${selectedEngine} is deprecated. Using mindee instead.`);
    engine = 'mindee';
  } else {
    engine = selectedEngine as OCREngine;
  }

  console.log(`OCR Service: Using engine strategy '${engine}'`);
  
  // Auto mode: Try Mindee first, fallback to Tesseract
  if (engine === 'auto') {
    return await tryAutoMode(imageBuffer);
  }

  // Mindee mode: Try Mindee only
  if (engine === 'mindee') {
    return await tryMindee(imageBuffer);
  }
  
  // Tesseract mode: Try Tesseract only
  if (engine === 'tesseract') {
    return await tryTesseract(imageBuffer);
  }
  
  // Default fallback
  return await tryTesseract(imageBuffer);
}

/**
 * Auto mode: Try Mindee first, fallback to Tesseract
 */
async function tryAutoMode(imageBuffer: Buffer): Promise<OCRServiceResult> {
  console.log('Auto mode: Trying Mindee first...');

  // Try Mindee
  const mindeeResult = await tryMindee(imageBuffer);

  // If Mindee succeeded with reasonable confidence, use it
  if (mindeeResult.partnerData.length > 0 && mindeeResult.confidence >= 15) {
    console.log(`Auto mode: Mindee succeeded with confidence ${mindeeResult.confidence}%`);
    return mindeeResult;
  }

  // Otherwise, try Tesseract as fallback
  console.log('Auto mode: Mindee confidence low or failed, trying Tesseract...');
  const tesseractResult = await tryTesseract(imageBuffer);

  // Return whichever has better results
  if (tesseractResult.confidence > mindeeResult.confidence) {
    console.log(`Auto mode: Tesseract won with confidence ${tesseractResult.confidence}%`);
    return tesseractResult;
  }

  console.log(`Auto mode: Using Mindee result with confidence ${mindeeResult.confidence}%`);
  return mindeeResult;
}

/**
 * Try Mindee OCR
 */
async function tryMindee(imageBuffer: Buffer): Promise<OCRServiceResult> {
  try {
    const result = await analyzeImageWithMindee(imageBuffer);

    if (!result.text || result.error) {
      return {
        text: null,
        partnerData: [],
        confidence: 0,
        engine: 'mindee',
        error: result.error || 'Mindee OCR failed'
      };
    }

    // Parse the extracted text
    console.log(`\n${'='.repeat(80)}`);
    console.log(`MINDEE OCR TEXT (${result.text.length} characters):`);
    console.log('='.repeat(80));
    console.log(result.text);
    console.log('='.repeat(80));

    const parseResult = parseStarbucksReport(result.text);

    console.log(`Mindee parser found ${parseResult.partners.length} partners with ${parseResult.confidence}% confidence`);

    // Mindee OCR provides high accuracy document extraction
    if (parseResult.partners.length > 0) {
      console.log(`Accepting Mindee result with ${parseResult.partners.length} partners`);
      return {
        text: result.text,
        partnerData: parseResult.partners,
        confidence: parseResult.confidence,
        engine: 'mindee'
      };
    }

    return {
      text: result.text,
      partnerData: [],
      confidence: parseResult.confidence,
      engine: 'mindee',
      error: 'No partners found in Mindee text'
    };

  } catch (error) {
    console.error('Mindee OCR error:', error);
    return {
      text: null,
      partnerData: [],
      confidence: 0,
      engine: 'mindee',
      error: `Mindee exception: ${error instanceof Error ? error.message : 'Unknown'}`
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
