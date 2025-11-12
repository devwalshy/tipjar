# Azure Computer Vision OCR Setup Guide

This guide will help you set up Azure Computer Vision for OCR in TipJar.

## Why Azure for Starbucks?

- ✅ **Already Approved** - Starbucks uses Azure for POS systems
- ✅ **FREE Tier** - 5,000 transactions/month (likely covers all usage)
- ✅ **Privacy Compliant** - No AI training on your data
- ✅ **High Accuracy** - 88-92% accuracy on printed documents
- ✅ **Fast Processing** - 1-2 seconds per image

##

 Step-by-Step Setup

### 1. Create Azure Account

If your store/organization doesn't have Azure:
1. Go to [portal.azure.com](https://portal.azure.com)
2. Sign up or log in with your organization account
3. Starbucks likely already has Azure - contact IT

### 2. Create Computer Vision Resource

1. In Azure Portal, click **"Create a resource"**
2. Search for **"Computer Vision"**
3. Click **"Create"**
4. Fill in the details:
   - **Subscription:** Your Azure subscription
   - **Resource Group:** Create new or use existing (e.g., "tipjar-resources")
   - **Region:** Choose closest region (e.g., "West US 2")
   - **Name:** e.g., "tipjar-ocr"
   - **Pricing Tier:** **"Free F0"** (5,000 transactions/month)
5. Click **"Review + Create"**
6. Click **"Create"**

### 3. Get Your API Key and Endpoint

1. After creation, go to your Computer Vision resource
2. In the left menu, click **"Keys and Endpoint"**
3. Copy:
   - **KEY 1** (your API key)
   - **Endpoint** (e.g., `https://westus2.api.cognitive.microsoft.com/`)

### 4. Configure TipJar

Create or update your `.env` file:

```bash
# Azure Computer Vision Configuration
OCR_ENGINE=azure
AZURE_CV_KEY=your_key_here
AZURE_CV_ENDPOINT=https://your-region.api.cognitive.microsoft.com/

# Optional: Fallback to Tesseract if Azure unavailable
# OCR_ENGINE=auto
```

**Environment Variable Options:**

- `OCR_ENGINE=azure` - Use Azure only
- `OCR_ENGINE=tesseract` - Use Tesseract only (free, offline)
- `OCR_ENGINE=auto` - Try Azure first, fallback to Tesseract

### 5. Test the Setup

```bash
# Start the application
npm run dev

# Upload a test Starbucks Tip Distribution Report
# The console will show which OCR engine was used
```

You should see in the logs:
```
OCR Service: Using engine strategy 'azure'
Azure Computer Vision OCR...
Azure OCR: Extracted 1234 characters
Partners found: 13
Confidence: 95%
```

## Free Tier Limits

**Azure Computer Vision Free Tier (F0):**
- **5,000 transactions per month**
- **20 transactions per minute**

**Usage Estimation:**
- 1 tip distribution report = 1 transaction
- Weekly distributions = ~4 reports/month per store
- **Can support ~1,000 stores on free tier!**

If you exceed free tier:
- Standard tier: $1 per 1,000 transactions
- Very affordable even at scale

## Pricing Tiers

| Tier | Transactions/Month | Cost | Best For |
|------|-------------------|------|----------|
| **Free (F0)** | 5,000 | $0 | Single store or testing |
| **Standard (S1)** | Unlimited | $1 per 1,000 | Multiple stores |

## Troubleshooting

### Error: "Azure credentials not configured"

**Solution:** Make sure `.env` file has:
```bash
AZURE_CV_KEY=your_actual_key
AZURE_CV_ENDPOINT=your_actual_endpoint
```

### Error: "401 Unauthorized"

**Solution:** 
- Check your API key is correct
- Verify the key hasn't been regenerated in Azure Portal
- Make sure you're using KEY 1 or KEY 2 from the portal

### Error: "Rate limit exceeded"

**Solution:**
- Free tier: 20 requests/minute
- Wait a minute or upgrade to Standard tier
- Use `OCR_ENGINE=auto` to fallback to Tesseract

### Low Accuracy Results

**Tips for better OCR:**
- Take photos in good lighting
- Hold camera straight over document
- Avoid shadows and glare
- Ensure text is in focus
- Higher resolution = better accuracy

## Security Best Practices

1. **Never commit `.env` to git**
   - Already in `.gitignore`
   - Keep API keys secret

2. **Rotate keys periodically**
   - Azure Portal > Keys and Endpoint > Regenerate KEY 2
   - Update your `.env` file
   - Then regenerate KEY 1

3. **Use separate keys per environment**
   - Development: One key
   - Production: Different key
   - Easy to revoke if compromised

## Multi-Store Deployment

For deploying to multiple Starbucks stores:

**Option 1: Shared Azure Resource**
- All stores use same API key
- Centralized billing and management
- Easy to monitor usage

**Option 2: Individual Resources**
- Each store/region has own resource
- Separate free tiers (5,000 each)
- Better for isolation

## Support

- **Azure Documentation:** [Azure Computer Vision Docs](https://learn.microsoft.com/en-us/azure/cognitive-services/computer-vision/)
- **Azure Support:** Through Azure Portal
- **TipJar Issues:** Check [OCR_IMPLEMENTATION.md](OCR_IMPLEMENTATION.md)

## Cost Calculator

Estimate your monthly costs:

```
Monthly Reports = Stores × 4 reports/month
Cost = (Reports - 5000) × $0.001

Examples:
- 1 store:     4 reports = FREE
- 10 stores:  40 reports = FREE  
- 100 stores: 400 reports = FREE
- 1000 stores: 4000 reports = FREE
- 2000 stores: 8000 reports = $3/month
```

The free tier is generous enough for most use cases!
