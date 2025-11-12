/**
 * OCR API implementation with multiple engine support
 * Supports: Azure Computer Vision (primary), Tesseract (fallback)
 */

import { analyzeImageWithService, OCREngine } from '../lib/ocrService';

interface OCRResult {
  text: string | null;
  partnerData?: Array<{ name: string; hours: number }>;
  confidence?: number;
  engine?: string;
  error?: string;
}

/**
 * Analyze an image using configured OCR engine
 * @param imageBuffer The image buffer
 * @param engine Which OCR engine to use (default: auto)
 * @returns OCR result with extracted text and partner data
 */
export async function analyzeImage(imageBuffer: Buffer, engine?: OCREngine): Promise<OCRResult> {
  try {
    console.log('Starting OCR analysis...');
    
    // Get OCR engine from environment or use parameter
    const selectedEngine: OCREngine = engine || (process.env.OCR_ENGINE as OCREngine) || 'auto';
    console.log(`Selected OCR engine: ${selectedEngine}`);
    
    // Use OCR service layer
    const result = await analyzeImageWithService(imageBuffer, selectedEngine);
    
    if (result.partnerData && result.partnerData.length > 0) {
      console.log(`OCR successful with ${result.engine}: ${result.partnerData.length} partners extracted`);
      return result;
    }
    
    // If no good results, return error
    console.log('OCR failed to extract partner data');
    return {
      text: result.text,
      error: result.error || 'Could not extract partner information from the image. Please ensure the image is clear and shows the Tip Distribution Report table.',
      engine: result.engine,
    };
  } catch (error) {
    console.error('OCR analysis error:', error);
    return {
      text: null,
      error: 'An error occurred during OCR processing. Please try again with a clearer image.',
    };
  }
}

/**
 * Extract just the text from an image (no structured parsing)
 * @param imageBuffer The image buffer
 * @returns Extracted text or error
 */
export async function extractTextOnly(imageBuffer: Buffer): Promise<{ text: string | null; error?: string }> {
  try {
    const processedBuffer = await preprocessImage(imageBuffer);
    const text = await performOCR(processedBuffer);
    
    if (!text || text.trim().length === 0) {
      return {
        text: null,
        error: 'No text could be extracted from the image',
      };
    }
    
    return { text };
  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      text: null,
      error: 'Failed to extract text from image',
    };
  }
}

