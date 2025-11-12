# Migration Guide: Gemini AI → Tesseract OCR

## Overview

This guide helps you migrate from the Gemini AI-based OCR to the new privacy-compliant Tesseract OCR implementation.

## What Changed

### Removed
- ❌ Google Gemini AI API dependency
- ❌ `GEMINI_API_KEY` environment variable
- ❌ External API calls to Google's servers
- ❌ AI-based "learning" text extraction

### Added
- ✅ Tesseract.js OCR engine
- ✅ Sharp image preprocessing library
- ✅ Advanced table parsing for Starbucks reports
- ✅ Confidence scoring system
- ✅ Multiple preprocessing strategies
- ✅ OCR testing script

## Migration Steps

### 1. Update Dependencies

```bash
# Remove old dependencies (if explicitly installed)
npm uninstall @google-generativeai

# Install new dependencies
npm install tesseract.js sharp --legacy-peer-deps
```

### 2. Remove Environment Variables

If you have a `.env` file, remove:
```bash
GEMINI_API_KEY=...
```

This is no longer needed.

### 3. Code Changes

No code changes required in your frontend! The API endpoints remain the same.

**API Endpoint (unchanged):**
```javascript
POST /api/ocr
```

**Response Format (unchanged):**
```json
{
  "extractedText": "...",
  "partnerHours": [
    { "name": "...", "hours": 27.10 }
  ]
}
```

**New Field Added:**
```json
{
  "confidence": 85  // New: OCR confidence score (0-100)
}
```

### 4. Update Server References

If you have custom code importing the old Gemini module:

**Before:**
```typescript
import { analyzeImage } from './api/gemini';
```

**After:**
```typescript
import { analyzeImage } from './api/ocr';
```

### 5. Test OCR Functionality

Run the test script to ensure OCR works:

```bash
npm run test:ocr
```

Expected results:
- Processing time: 2-5 seconds per image
- Confidence: 30-100% (higher is better)
- Partners extracted: Should match your report

### 6. Adjust OCR Settings (Optional)

If accuracy is poor, you can tune OCR settings in:

**`server/lib/ocrConfig.ts`** - Tesseract parameters
**`server/lib/imagePreprocessor.ts`** - Image enhancement settings
**`server/lib/tableParser.ts`** - Pattern matching rules

## Behavior Differences

### Gemini AI
- ✅ Very high accuracy (95%+)
- ✅ Handles messy/angled photos well
- ✅ Understands context
- ❌ Trains on your data (privacy concern)
- ❌ Costs money at scale
- ❌ Requires internet
- ❌ Slower (5-10 seconds)

### Tesseract OCR
- ✅ Privacy compliant (no data leaves server)
- ✅ 100% free
- ✅ Works offline
- ✅ Faster after initialization (2-3 seconds)
- ⚠️ Moderate accuracy (70-85%) - depends on image quality
- ⚠️ Sensitive to photo angles
- ⚠️ Requires decent image quality

## Improving Accuracy

### Image Quality Checklist

For best OCR results, ensure:

1. **Good Lighting**
   - Avoid shadows
   - Even lighting across document
   - No glare or reflections

2. **Camera Angle**
   - Photo taken straight-on (not angled)
   - Document fills most of frame
   - Minimal background

3. **Focus**
   - Text is sharp and clear
   - No motion blur
   - All text is readable

4. **Resolution**
   - Minimum 800x600 pixels
   - Recommended 1600x1200+
   - Higher resolution = better accuracy

### Preprocessing Adjustments

If consistently getting poor results, try adjusting in `server/lib/imagePreprocessor.ts`:

```typescript
// Make threshold more aggressive
pipeline = pipeline.threshold(140, {  // Try 130-150
  grayscale: true
});

// Increase sharpening
pipeline = pipeline.sharpen({
  sigma: 2,      // Try 1-3
  m1: 1,         // Try 0.5-1.5
});
```

## Fallback Strategy

If OCR accuracy is insufficient:

### Option 1: Manual Entry
The UI already includes manual entry as a fallback. Users can type in partner data if OCR fails.

### Option 2: Google Cloud Vision OCR
For better accuracy without AI training concerns:

```bash
npm install @google-cloud/vision
```

Update `server/api/ocr.ts` to add Vision API as fallback when Tesseract confidence is low.

**Note:** Google Cloud Vision OCR is traditional OCR, not generative AI like Gemini. It doesn't train on your data under enterprise agreements.

## Troubleshooting

### Issue: "No partners extracted"

**Causes:**
- Poor image quality
- Image doesn't show the report table
- Wrong document type

**Solutions:**
1. Check image shows the Tip Distribution Report
2. Improve lighting/angle
3. Use manual entry

### Issue: "Low confidence scores (< 50%)"

**Causes:**
- Angled or blurry photos
- Shadows or glare
- Low resolution

**Solutions:**
1. Retake photo with better quality
2. Adjust preprocessing settings
3. Use higher resolution camera

### Issue: "Wrong partners extracted"

**Causes:**
- OCR misreading text
- Picking up non-table text
- Pattern matching too loose

**Solutions:**
1. Check `server/lib/tableParser.ts` patterns
2. Make patterns more strict
3. Add filtering for common noise

## Performance Considerations

### First Request Slow

The first OCR request takes 4-5 seconds because it initializes the Tesseract worker. Subsequent requests are 2-3 seconds.

To warm up the worker on server start:

```typescript
// In server/index.ts
import { getOCRWorker } from './lib/ocrConfig';

// After server starts
getOCRWorker().then(() => {
  console.log('OCR worker pre-initialized');
});
```

### Memory Usage

Tesseract worker uses ~150MB RAM. For high-volume deployments:

1. Consider worker pooling
2. Implement request queuing
3. Monitor memory usage
4. Add worker recycling after N requests

## Rollback Plan

If you need to rollback to Gemini:

1. Restore old `server/api/gemini.ts` from git history
2. Update `server/routes.ts` to import from `gemini` instead of `ocr`
3. Add `GEMINI_API_KEY` back to environment
4. Reinstall dependencies

```bash
git checkout HEAD~1 server/api/gemini.ts
npm install node-fetch
```

## Testing Checklist

Before deploying:

- [ ] Test with 10+ sample reports
- [ ] Verify accuracy is acceptable (70%+)
- [ ] Check processing time (< 5 seconds)
- [ ] Test with poor quality images
- [ ] Verify manual entry fallback works
- [ ] Test at expected load volume
- [ ] Check memory usage
- [ ] Verify error handling

## Support

Issues with migration?

1. Run `npm run test:ocr` for diagnostics
2. Check console logs for detailed errors
3. Review OCR_IMPLEMENTATION.md for tuning
4. Test with different image preprocessing strategies

## Questions?

**Q: Is the new OCR as accurate as Gemini?**  
A: Generally 70-85% vs Gemini's 95%, but sufficient for most cases with good images.

**Q: Can I use both?**  
A: Yes! You can add Gemini as a fallback for low-confidence Tesseract results.

**Q: Will this work at scale?**  
A: Yes! No API rate limits, no costs, runs on your infrastructure.

**Q: What if accuracy is too low?**  
A: Consider Google Cloud Vision OCR (not AI) as a middle ground, or improve image capture guidelines.

