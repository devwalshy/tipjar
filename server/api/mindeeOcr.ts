/**
 * Mindee OCR implementation using Mindee SDK
 * Provides high-accuracy OCR for document extraction
 */

import * as mindee from 'mindee';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

interface MindeeOCRResult {
  text: string | null;
  confidence?: number;
  error?: string;
}


/**
 * Analyze an image using Mindee OCR API
 * @param imageBuffer The image buffer
 * @returns OCR result with extracted text and confidence
 */
export async function analyzeImageWithMindee(imageBuffer: Buffer): Promise<MindeeOCRResult> {
  try {
    const apiKey = process.env.MINDEE_API_KEY;
    const endpoint = process.env.MINDEE_ENDPOINT;
    const modelId = process.env.MINDEE_MODEL_ID || 'bf2e64e3-efc1-43a6-8ac0-a57acc3104b9';

    if (!apiKey) {
      console.log('Mindee API key not configured, skipping Mindee OCR');
      return {
        text: null,
        error: 'Mindee API key not configured',
      };
    }

    // Initialize Mindee client
    const mindeeClient = new mindee.ClientV2({ apiKey: apiKey });

    // Set inference parameters
    const inferenceParams = {
      modelId: modelId,
      rag: true, // Enhance extraction accuracy with Retrieval-Augmented Generation.
      rawText: true, // Extract the full text content from the document as strings.
      polygon: true, // Calculate bounding box polygons for all fields.
      confidence: true, // Boost the precision and accuracy of all extractions. Calculate confidence scores for all fields.
    };

    // Write buffer to temporary file (Mindee SDK requires file path)
    const tempFilePath = join(tmpdir(), `mindee-${randomUUID()}.tmp`);
    fs.writeFileSync(tempFilePath, imageBuffer);

    try {
      console.log('Starting Mindee OCR...');

      // Load file from disk
      const inputSource = new mindee.PathInput({ inputPath: tempFilePath });

      // Send for processing with retry logic
      const response = await retryWithBackoff(
        () => mindeeClient.enqueueAndGetInference(inputSource, inferenceParams),
        3, // max retries
        1000 // initial delay in ms
      );

      // Extract text from response using the pattern from Mindee docs
      // Primary method: use toString() for string summary
      let extractedText: string | null = null;
      
      if (response?.inference?.toString) {
        extractedText = response.inference.toString();
      }
      
      // Fallback: try to get rawText or extract from fields
      if (!extractedText || extractedText.trim().length === 0) {
        extractedText = extractTextFromMindeeResponse(response);
      }
      
      // Log the inference summary if available
      if (response?.inference) {
        console.log('Mindee inference summary:', response.inference.toString());
      }
      
      // Access result fields if needed for structured data
      const fields = response?.inference?.result?.fields;
      if (fields) {
        console.log('Mindee extracted fields:', Object.keys(fields));
      }

      if (!extractedText || extractedText.trim().length === 0) {
        console.error('Mindee OCR: no text extracted', response);
        return {
          text: null,
          error: 'Mindee OCR extracted no text from the image',
        };
      }

      // Calculate confidence score
      const confidence = calculateConfidenceFromResponse(response);

      console.log(
        `Mindee OCR successful: ${extractedText.length} characters, confidence ${confidence}%`
      );

      return {
        text: extractedText,
        confidence,
      };
    } finally {
      // Clean up temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  } catch (error) {
    console.error('Mindee OCR error:', error);
    return {
      text: null,
      error: `Mindee OCR exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Extract text from Mindee inference response
 */
function extractTextFromMindeeResponse(response: any): string | null {
  try {
    // Try to get raw text from the response
    if (response?.inference?.result?.rawText) {
      return response.inference.result.rawText;
    }

    // Fallback: try to extract from document fields
    if (response?.inference?.result?.fields) {
      const fields = response.inference.result.fields;
      const textParts: string[] = [];

      // Extract text from all fields
      for (const [key, value] of Object.entries(fields)) {
        if (value && typeof value === 'object' && 'value' in value) {
          const fieldValue = (value as any).value;
          if (typeof fieldValue === 'string' && fieldValue.trim()) {
            textParts.push(fieldValue);
          }
        } else if (typeof value === 'string' && value.trim()) {
          textParts.push(value);
        }
      }

      if (textParts.length > 0) {
        return textParts.join('\n');
      }
    }

    // Last resort: use toString() method if available
    if (response?.inference?.toString) {
      return response.inference.toString();
    }

    return null;
  } catch (error) {
    console.error('Error extracting text from Mindee response:', error);
    return null;
  }
}

/**
 * Calculate confidence score from Mindee response
 */
function calculateConfidenceFromResponse(response: any): number {
  try {
    const confidences: number[] = [];

    // Extract confidence from fields
    if (response?.inference?.result?.fields) {
      const fields = response.inference.result.fields;
      for (const [key, value] of Object.entries(fields)) {
        if (value && typeof value === 'object') {
          const field = value as any;
          if (typeof field.confidence === 'number') {
            // Convert 0-1 scale to 0-100
            const conf = field.confidence <= 1 ? field.confidence * 100 : field.confidence;
            confidences.push(conf);
          }
        }
      }
    }

    // Extract overall confidence if available
    if (response?.inference?.result?.confidence) {
      const conf = response.inference.result.confidence;
      const normalized = conf <= 1 ? conf * 100 : conf;
      confidences.push(normalized);
    }

    if (confidences.length === 0) {
      // Default confidence if none found
      return 75;
    }

    const average = confidences.reduce((sum, value) => sum + value, 0) / confidences.length;
    return Math.round(Math.min(Math.max(average, 0), 100));
  } catch (error) {
    console.error('Error calculating confidence from Mindee response:', error);
    return 75; // Default confidence
  }
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  initialDelay: number
): Promise<T> {
  let lastError: Error | unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors (e.g., authentication, bad request)
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes('unauthorized') ||
          errorMessage.includes('forbidden') ||
          errorMessage.includes('bad request') ||
          errorMessage.includes('not found')
        ) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        console.log(`Mindee OCR attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
}

