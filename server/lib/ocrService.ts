/**
 * OCR Service - Abstraction layer for multiple OCR engines
 * Supports: Azure Document Intelligence (primary), Tesseract (fallback)
 */

import { analyzeImageWithAzureDocumentIntelligence } from '../api/azureDocumentIntelligence';
import { preprocessImage } from './imagePreprocessor';
import { performOCRDetailed } from './ocrConfig';
import { parseStarbucksReport } from './tableParser';

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
  const rawEngine =
    (preferredEngine as string | undefined) || process.env.OCR_ENGINE || 'auto';
  const engine = normalizeEngine(rawEngine);

  console.log(
    `OCR Service: Using engine strategy '${engine}' (normalized from '${rawEngine}')`
  );

  if (engine === 'auto') {
    return await tryAutoMode(imageBuffer);
  }

  if (engine === 'azure') {
    return await tryAzure(imageBuffer);
  }

  if (engine === 'tesseract') {
    return await tryTesseract(imageBuffer);
  }

  return await tryTesseract(imageBuffer);
}

function normalizeEngine(engine: string): OCREngine {
  const normalized = engine.trim().toLowerCase();

  if (normalized === 'auto') {
    return 'auto';
  }

  if (
    [
      'azure',
      'azure_document_intelligence',
      'azure-document-intelligence',
      'mindee',
      'deepseek',
      'cloud',
    ].includes(normalized)
  ) {
    if (normalized !== 'azure') {
      console.warn(
        `OCR Service: Normalizing legacy engine '${engine}' to 'azure'.`
      );
    }
    return 'azure';
  }

  if (['tesseract', 'local'].includes(normalized)) {
    return 'tesseract';
  }

  console.error(
    `OCR Service: Unrecognized OCR engine '${engine}', defaulting to Azure.`
  );
  return 'azure';
}

/**
 * Auto mode: Try Azure first, fallback to Tesseract
 */
async function tryAutoMode(imageBuffer: Buffer): Promise<OCRServiceResult> {
  console.log('Auto mode: Trying Azure Document Intelligence first...');

  const azureResult = await tryAzure(imageBuffer);

  if (azureResult.partnerData.length > 0 && azureResult.confidence >= 15) {
    console.log(
      `Auto mode: Azure succeeded with confidence ${azureResult.confidence}%`
    );
    return azureResult;
  }

  console.log('Auto mode: Azure confidence low or failed, trying Tesseract...');
  const tesseractResult = await tryTesseract(imageBuffer);

  if (tesseractResult.confidence > azureResult.confidence) {
    console.log(
      `Auto mode: Tesseract won with confidence ${tesseractResult.confidence}%`
    );
    return tesseractResult;
  }

  console.log(
    `Auto mode: Using Azure result with confidence ${azureResult.confidence}%`
  );
  return azureResult;
}

/**
 * Try Azure Document Intelligence OCR
 */
async function tryAzure(imageBuffer: Buffer): Promise<OCRServiceResult> {
  try {
    const result = await analyzeImageWithAzureDocumentIntelligence(imageBuffer);

    if (!result.text || result.error) {
      return {
        text: null,
        partnerData: [],
        confidence: 0,
        engine: 'azure',
        error: result.error || 'Azure Document Intelligence OCR failed',
      };
    }

    const parseResult = parseStarbucksReport(result.text);

    console.log(
      `Azure parser found ${parseResult.partners.length} partners with ${parseResult.confidence}% confidence`
    );

    if (parseResult.partners.length > 0) {
      return {
        text: result.text,
        partnerData: parseResult.partners,
        confidence: parseResult.confidence,
        engine: 'azure',
      };
    }

    return {
      text: result.text,
      partnerData: [],
      confidence: parseResult.confidence,
      engine: 'azure',
      error: 'No partners found in Azure OCR text',
    };
  } catch (error) {
    console.error('Azure OCR error:', error);
    return {
      text: null,
      partnerData: [],
      confidence: 0,
      engine: 'azure',
      error: `Azure exception: ${error instanceof Error ? error.message : 'Unknown'}`,
    };
  }
}

/**
 * Try Tesseract OCR
 */
async function tryTesseract(imageBuffer: Buffer): Promise<OCRServiceResult> {
  try {
    const processedBuffer = await preprocessImage(imageBuffer);
    const ocrResult = await performOCRDetailed(processedBuffer);
    const text = ocrResult.text?.trim();

    if (!text) {
      return {
        text: null,
        partnerData: [],
        confidence: 0,
        engine: 'tesseract',
        error: 'Tesseract OCR returned no text',
      };
    }

    const parseResult = parseStarbucksReport(text);

    if (parseResult.partners.length === 0) {
      return {
        text,
        partnerData: [],
        confidence: parseResult.confidence,
        engine: 'tesseract',
        error: 'No partners found in Tesseract OCR text',
      };
    }

    const combinedConfidence = Math.min(
      100,
      Math.round(((ocrResult.confidence || 0) + parseResult.confidence) / 2)
    );

    return {
      text,
      partnerData: parseResult.partners,
      confidence: combinedConfidence,
      engine: 'tesseract',
    };
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    return {
      text: null,
      partnerData: [],
      confidence: 0,
      engine: 'tesseract',
      error: `Tesseract exception: ${error instanceof Error ? error.message : 'Unknown'}`,
    };
  }
}
