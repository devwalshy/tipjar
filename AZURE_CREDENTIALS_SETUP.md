# Azure Credentials Setup

## Your Azure Computer Vision Credentials

You've been provided with Azure Computer Vision credentials. Here's how to configure them:

### Step 1: Create .env File

Create a file named `.env` in the root directory (`e:\projectTipjar - Copy\.env`):

```bash
# OCR Engine Configuration
OCR_ENGINE=auto

# Azure Computer Vision Credentials
AZURE_CV_KEY=YOUR_COMPUTER_VISION_API_KEY_HERE
AZURE_CV_ENDPOINT=YOUR_COMPUTER_VISION_ENDPOINT_HERE
```

### Step 2: Verify .env is in .gitignore

Make sure `.env` is listed in your `.gitignore` file (it should already be there):

```
.env
.env.local
.env.*.local
```

### Step 3: Test Azure OCR

Run the test script to verify Azure is working:

```bash
npm run test:azure
```

You should see output like:

```
Azure configured: ✅ YES
OCR Engine used: AZURE
✅ Success!
Confidence: 92%
Partners extracted: 13
```

### Step 4: Start Development Server

```bash
npm run dev
```

Then upload a Starbucks Tip Distribution Report through the UI at `http://localhost:5000`

## Security Notes

⚠️ **IMPORTANT:**
- ✅ .env file is already in .gitignore (won't be committed)
- ✅ Never share your API key publicly
- ✅ If key is compromised, regenerate it in Azure Portal
- ✅ Use different keys for development and production

## Configuration Options

### Auto Mode (Recommended)
```bash
OCR_ENGINE=auto
```
Tries Azure first, falls back to Tesseract if Azure fails

### Azure Only
```bash
OCR_ENGINE=azure
```
Uses Azure only, fails if Azure unavailable

### Tesseract Only
```bash
OCR_ENGINE=tesseract
```
Uses free Tesseract OCR, works offline

## Quick Test

To quickly test if Azure is configured correctly:

```bash
# This will test with any report images in attached_assets/
npm run test:azure
```

## Troubleshooting

### "Azure credentials not configured"
- Make sure `.env` file exists in the root directory
- Check that AZURE_CV_KEY and AZURE_CV_ENDPOINT are set correctly
- Restart the development server after creating .env

### "401 Unauthorized"
- Verify your API key is correct
- Make sure there are no extra spaces in the key
- Check if key has been regenerated in Azure Portal

### "Resource not found"
- Verify the endpoint URL is correct
- Make sure the endpoint includes `https://` and trailing `/`

## Your Azure Resource

**Resource Name:** walshy-tipjar  
**Endpoint:** https://walshy-tipjar.cognitiveservices.azure.com/  
**Region:** (based on endpoint)  
**Tier:** Check Azure Portal for your tier (F0 = Free)

## Next Steps

1. ✅ Create `.env` file with your credentials
2. ✅ Run `npm run test:azure` to verify setup
3. ✅ Upload real Starbucks reports to test accuracy
4. ✅ Compare Azure vs Tesseract results

The system is ready to use Azure Computer Vision for high-accuracy OCR! 🚀

