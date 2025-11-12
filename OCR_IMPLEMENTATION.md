# OCR Implementation Documentation

## Overview

This project has been updated to replace Google Gemini AI with **Tesseract OCR** for extracting partner data from Starbucks Tip Distribution Reports. This change ensures:

- ✅ **100% Privacy Compliant** - No data sent to external AI services
- ✅ **No AI Training** - Tesseract doesn't learn from your data
- ✅ **Completely Free** - No API costs at any scale
- ✅ **Scalable** - Runs on your own infrastructure
- ✅ **Offline Capable** - Works without internet connection

## Architecture

### 1. Image Preprocessing (`server/lib/imagePreprocessor.ts`)

Before OCR, images are enhanced using Sharp library:
- **Grayscale conversion** - Removes color noise
- **Contrast enhancement** - Makes text more readable
- **Noise reduction** - Removes artifacts from phone photos
- **Sharpening** - Clarifies text edges
- **Thresholding** - Separates text from background

Three preprocessing strategies are tried in sequence:
1. **Table-optimized** - Best for structured documents
2. **Standard** - Balanced approach
3. **Aggressive** - For low-quality or angled photos

### 2. OCR Processing (`server/lib/ocrConfig.ts`)

Uses Tesseract.js configured for:
- English language recognition
- Document/table mode (PSM.AUTO)
- Character whitelist (letters, numbers, punctuation)
- Optimized for structured data

### 3. Table Parsing (`server/lib/tableParser.ts`)

Extracts partner data from OCR text using pattern matching:

**Expected Starbucks Report Format:**
```
Home Store | Partner Name          | Partner Number | Total Tippable Hours
69600     | Lastname, Firstname M  | US12345678    | 27.10
69600     | Smith, John A         | US87654321    | 35.50
```

**Parsing Strategy:**
1. Detect table header ("Partner Name", "Total Tippable Hours")
2. Extract rows with pattern: `StoreNumber Name PartnerID Hours`
3. Clean OCR errors (0/O confusion, etc.)
4. Validate data (reasonable hour ranges, proper name format)
5. Calculate confidence score

### 4. API Integration (`server/api/ocr.ts`)

Main entry point for OCR operations:
- Tries multiple preprocessing strategies
- Keeps best result based on confidence score
- Returns structured partner data with confidence metrics

## Usage

### Running the Application

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Test OCR with sample images
npm run test:ocr
```

### API Endpoint

**POST `/api/ocr`**

Upload an image of a Starbucks Tip Distribution Report:

```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/ocr', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

**Response Format:**
```json
{
  "extractedText": "Full OCR text...",
  "partnerHours": [
    { "name": "Lastname, Firstname", "hours": 27.10 },
    { "name": "Smith, John", "hours": 35.50 }
  ],
  "confidence": 85
}
```

## Testing

### Test Script

Run `npm run test:ocr` to test OCR with all images in `attached_assets/` directory.

**Test Output:**
- Processing time per image
- Number of partners extracted
- Confidence score
- Detailed partner data

### Sample Test

```bash
npm run test:ocr
```

Example output:
```
Testing: sample_report.png
✅ Success!
Confidence: 85%
Partners extracted: 15
Processing time: 3.2s

Partner Data:
  1. Lastname, Firstname M: 27.10 hours
  2. Smith, John A: 35.50 hours
  ...
```

## Image Requirements

For best results, images should:
- Show the complete Tip Distribution Report table
- Have good lighting (avoid shadows)
- Be reasonably straight (minor angles OK)
- Have clear, readable text
- Be at least 800x600 pixels

**Supported Formats:**
- PNG
- JPEG/JPG
- GIF

## Troubleshooting

### Low Accuracy

If OCR accuracy is poor:

1. **Check image quality** - Ensure good lighting and focus
2. **Try different angles** - Straight-on photos work best
3. **Increase resolution** - Higher resolution = better OCR
4. **Use manual entry** - Fallback option in the UI

### Performance

- **First request** takes 4-5 seconds (initializes Tesseract worker)
- **Subsequent requests** take 2-3 seconds
- Worker is reused across requests for efficiency

### Confidence Score

- **80-100%** - Excellent, data is very likely correct
- **50-79%** - Good, but review partner list
- **30-49%** - Fair, verify data carefully
- **< 30%** - Poor, consider manual entry

## File Structure

```
server/
├── api/
│   └── ocr.ts                    # Main OCR API (replaces gemini.ts)
├── lib/
│   ├── imagePreprocessor.ts      # Image enhancement
│   ├── tableParser.ts            # Starbucks report parser
│   └── ocrConfig.ts              # Tesseract configuration
├── routes.ts                     # Updated to use new OCR
└── test-ocr.ts                   # Testing script

client/src/lib/
└── formatUtils.ts                # Enhanced formatting (updated)
```

## Dependencies

- **tesseract.js** (v5.1.1) - OCR engine
- **sharp** (v0.33.5) - Image processing
- **multer** (existing) - File uploads

## Configuration

### Tesseract Settings

In `server/lib/ocrConfig.ts`:

```typescript
await worker.setParameters({
  tesseract_pageseg_mode: PSM.AUTO,
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-/() ',
  preserve_interword_spaces: '1',
});
```

### Image Preprocessing

Adjust preprocessing in `server/lib/imagePreprocessor.ts`:

```typescript
const DEFAULT_OPTIONS = {
  grayscale: true,
  enhanceContrast: true,
  denoise: true,
  sharpen: true,
  threshold: true,
  resize: true,
  maxWidth: 2000,
  maxHeight: 3000
};
```

## Starbucks Compliance

This implementation meets Starbucks' requirements:
- ✅ No AI training on partner data
- ✅ No data sent to third-party AI services
- ✅ Traditional OCR technology (no "learning")
- ✅ Partner privacy maintained
- ✅ Data stays on your servers

## Future Enhancements

Potential improvements:
1. **Caching** - Cache OCR results to avoid reprocessing
2. **Batch Processing** - Process multiple reports at once
3. **Auto-rotation** - Detect and correct image orientation
4. **Quality Validation** - Pre-check image quality before OCR
5. **Alternative OCR** - Add Google Cloud Vision OCR as fallback (non-AI version)

## Support

For issues or questions:
1. Run `npm run test:ocr` to diagnose OCR performance
2. Check console logs for detailed error messages
3. Verify image quality meets requirements
4. Use manual entry as fallback

