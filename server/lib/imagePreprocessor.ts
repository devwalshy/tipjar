/**
 * Image preprocessing module for OCR optimization
 * Enhances image quality before passing to Tesseract OCR
 */

import sharp from 'sharp';

interface PreprocessOptions {
  grayscale?: boolean;
  enhanceContrast?: boolean;
  denoise?: boolean;
  sharpen?: boolean;
  threshold?: boolean;
  resize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

const DEFAULT_OPTIONS: PreprocessOptions = {
  grayscale: true,
  enhanceContrast: true,
  denoise: true,
  sharpen: true,
  threshold: true,
  resize: true,
  maxWidth: 2000,
  maxHeight: 3000
};

/**
 * Preprocess image buffer for optimal OCR results
 * @param imageBuffer The input image buffer
 * @param options Preprocessing options
 * @returns Processed image buffer
 */
export async function preprocessImage(
  imageBuffer: Buffer,
  options: PreprocessOptions = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    let pipeline = sharp(imageBuffer);
    
    // Get image metadata
    const metadata = await pipeline.metadata();
    
    // Rotate based on EXIF orientation
    pipeline = pipeline.rotate();
    
    // Resize if image is too large (improves processing speed)
    if (opts.resize && metadata.width && metadata.height) {
      if (metadata.width > opts.maxWidth! || metadata.height > opts.maxHeight!) {
        pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
    }
    
    // Convert to grayscale for better OCR
    if (opts.grayscale) {
      pipeline = pipeline.grayscale();
    }
    
    // Enhance contrast using normalization
    if (opts.enhanceContrast) {
      pipeline = pipeline.normalize();
    }
    
    // Apply slight blur to reduce noise, then sharpen
    if (opts.denoise) {
      pipeline = pipeline.median(3); // Median filter for noise reduction
    }
    
    // Sharpen edges for better text recognition
    if (opts.sharpen) {
      pipeline = pipeline.sharpen({
        sigma: 1,
        m1: 0.5,
        m2: 0.5,
        x1: 2,
        y2: 10
      });
    }
    
    // Apply threshold for better text/background separation
    if (opts.threshold) {
      pipeline = pipeline.threshold(128, {
        grayscale: true
      });
    }
    
    // Convert to PNG for lossless quality
    const processedBuffer = await pipeline
      .png({ compressionLevel: 9 })
      .toBuffer();
    
    return processedBuffer;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    // Return original buffer if preprocessing fails
    return imageBuffer;
  }
}

/**
 * Enhanced preprocessing for low-quality or angled images
 * @param imageBuffer The input image buffer
 * @returns Processed image buffer with aggressive enhancement
 */
export async function preprocessImageAggressive(imageBuffer: Buffer): Promise<Buffer> {
  try {
    let pipeline = sharp(imageBuffer);
    
    // Rotate based on EXIF
    pipeline = pipeline.rotate();
    
    // Convert to grayscale
    pipeline = pipeline.grayscale();
    
    // Aggressive contrast enhancement
    pipeline = pipeline.normalize();
    
    // More aggressive noise reduction
    pipeline = pipeline.median(5);
    
    // Linear contrast stretching
    pipeline = pipeline.linear(1.5, -(128 * 0.5));
    
    // Strong sharpening
    pipeline = pipeline.sharpen({
      sigma: 2,
      m1: 1,
      m2: 0.5,
      x1: 3,
      y2: 15
    });
    
    // Threshold with Otsu-like automatic threshold
    pipeline = pipeline.threshold(140, {
      grayscale: true
    });
    
    const processedBuffer = await pipeline
      .png({ compressionLevel: 9 })
      .toBuffer();
    
    return processedBuffer;
  } catch (error) {
    console.error('Aggressive preprocessing error:', error);
    return imageBuffer;
  }
}

/**
 * Create a version optimized specifically for table detection
 * @param imageBuffer The input image buffer
 * @returns Processed image buffer optimized for tables
 */
export async function preprocessForTable(imageBuffer: Buffer): Promise<Buffer> {
  try {
    let pipeline = sharp(imageBuffer);
    
    // Auto-rotate
    pipeline = pipeline.rotate();
    
    // Resize to consistent width for better table detection
    pipeline = pipeline.resize(1600, null, {
      fit: 'inside',
      withoutEnlargement: true
    });
    
    // Grayscale
    pipeline = pipeline.grayscale();
    
    // Normalize contrast
    pipeline = pipeline.normalize();
    
    // Light denoising
    pipeline = pipeline.median(2);
    
    // Moderate sharpening (tables need clear edges)
    pipeline = pipeline.sharpen();
    
    // Adaptive-like thresholding by boosting contrast first
    pipeline = pipeline.linear(1.3, -(128 * 0.3));
    
    const processedBuffer = await pipeline
      .png({ compressionLevel: 9 })
      .toBuffer();
    
    return processedBuffer;
  } catch (error) {
    console.error('Table preprocessing error:', error);
    return imageBuffer;
  }
}

