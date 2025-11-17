/**
 * OCR Service - Azure-only implementation using Computer Vision Read API
 */

import { analyzeImageWithAzure } from '../api/azureOcr';
import { parseStarbucksReport, validateParseResult } from './tableParser';

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
 * @returns OCR result with partner data
 */
export async function analyzeImageWithService(
  imageBuffer: Buffer
): Promise<OCRServiceResult> {
  return await tryAzure(imageBuffer);
}

/**
 * Analyze image with Azure Computer Vision
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

    // Validate parsed data to ensure table integrity
    const validation = validateParseResult(parseResult);
    if (!validation.valid) {
      console.warn('Azure OCR parse validation failed:', validation.errors);
    }

    console.log(`Azure parser found ${parseResult.partners.length} partners with ${parseResult.confidence}% confidence`);

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
