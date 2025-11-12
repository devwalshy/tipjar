/**
 * Tesseract OCR configuration and utilities
 */

import { createWorker, Worker, PSM } from 'tesseract.js';

// Tesseract worker singleton
let workerInstance: Worker | null = null;

/**
 * Get or create a Tesseract worker instance
 * @returns Initialized Tesseract worker
 */
export async function getOCRWorker(): Promise<Worker> {
  if (workerInstance) {
    return workerInstance;
  }
  
  try {
    console.log('Initializing Tesseract OCR worker...');
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    
    // Configure for optimal document/table recognition
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO, // Auto page segmentation
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-/() ',
      preserve_interword_spaces: '1',
    });
    
    workerInstance = worker;
    console.log('Tesseract OCR worker initialized successfully');
    return worker;
  } catch (error) {
    console.error('Failed to initialize Tesseract worker:', error);
    throw new Error('OCR initialization failed');
  }
}

/**
 * Terminate the OCR worker (cleanup)
 */
export async function terminateOCRWorker(): Promise<void> {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
    console.log('Tesseract OCR worker terminated');
  }
}

/**
 * Perform OCR on image buffer with optimized settings
 * @param imageBuffer Preprocessed image buffer
 * @returns Extracted text
 */
export async function performOCR(imageBuffer: Buffer): Promise<string> {
  const worker = await getOCRWorker();
  
  try {
    const { data } = await worker.recognize(imageBuffer);
    return data.text;
  } catch (error) {
    console.error('OCR recognition error:', error);
    throw new Error('Failed to perform OCR on image');
  }
}

/**
 * Perform OCR with detailed results including confidence
 * @param imageBuffer Preprocessed image buffer
 * @returns Detailed OCR result
 */
export async function performOCRDetailed(imageBuffer: Buffer) {
  const worker = await getOCRWorker();
  
  try {
    const result = await worker.recognize(imageBuffer);
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      words: result.data.words,
      lines: result.data.lines,
    };
  } catch (error) {
    console.error('OCR recognition error:', error);
    throw new Error('Failed to perform OCR on image');
  }
}

/**
 * Try OCR with multiple PSM modes for better results
 * @param imageBuffer Image buffer
 * @returns Best OCR result
 */
export async function performOCRWithFallback(imageBuffer: Buffer): Promise<string> {
  const worker = await getOCRWorker();
  
  // Try different page segmentation modes in order of likelihood
  const psmModes = [
    PSM.AUTO,              // Auto detection (default)
    PSM.SINGLE_BLOCK,      // Single uniform block of text
    PSM.SINGLE_COLUMN,     // Single column of text
  ];
  
  let bestResult = '';
  let bestConfidence = 0;
  
  for (const psm of psmModes) {
    try {
      await worker.setParameters({
        tessedit_pageseg_mode: psm,
      });
      
      const { data } = await worker.recognize(imageBuffer);
      
      // Keep the result with highest confidence
      if (data.confidence > bestConfidence) {
        bestConfidence = data.confidence;
        bestResult = data.text;
      }
      
      // If we get very high confidence, no need to try other modes
      if (data.confidence > 85) {
        break;
      }
    } catch (error) {
      console.warn(`OCR failed with PSM mode ${psm}:`, error);
      continue;
    }
  }
  
  // Reset to default mode
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO,
  });
  
  return bestResult;
}

