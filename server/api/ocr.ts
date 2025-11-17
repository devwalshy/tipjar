/**
 * OCR API implementation using Azure Computer Vision Read API
 */

import { analyzeImageWithService } from '../lib/ocrService';

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
 * @returns OCR result with extracted text and partner data
 */
export async function analyzeImage(imageBuffer: Buffer): Promise<OCRResult> {
  try {
    console.log('Starting OCR analysis...');

    // Use OCR service layer
    const result = await analyzeImageWithService(imageBuffer);
    
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

