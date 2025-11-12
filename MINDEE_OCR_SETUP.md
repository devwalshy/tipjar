# Mindee OCR Setup Guide

This guide walks through setting up Mindee OCR API integration for TipJar.

## 1. Create a Mindee Account & Get API Key

1. Sign up for a free Mindee account at [https://mindee.com/](https://mindee.com/)
2. Navigate to your account settings or API section
3. Generate an **API Key** for your account
4. Copy the API key value – you will use it as `MINDEE_API_KEY`

## 2. Get Your Model ID

1. In the Mindee dashboard, navigate to your models
2. Find or create a document parsing model
3. Copy the **Model ID** (default: `bf2e64e3-efc1-43a6-8ac0-a57acc3104b9` for general OCR)
4. You can use this as `MINDEE_MODEL_ID` if you need a custom model

## 3. Collect Required Identifiers

The TipJar backend needs the following values:

| Variable             | Description                         | Where to find it                    |
|----------------------|-------------------------------------|-------------------------------------|
| `MINDEE_API_KEY`     | Your Mindee API key                 | Account settings → API Keys         |
| `MINDEE_MODEL_ID`    | Model ID (optional)                 | Model dashboard (defaults provided) |
| `MINDEE_ENDPOINT`    | Custom endpoint (optional)         | Only if using custom deployment     |

Optional overrides:
- `MINDEE_MODEL_ID` (defaults to `bf2e64e3-efc1-43a6-8ac0-a57acc3104b9`)
- `MINDEE_ENDPOINT` (defaults to Mindee's standard endpoint)

## 4. Update Environment Variables

```
MINDEE_API_KEY=your_api_key_here
OCR_ENGINE=auto
```

Optional variables:
```
MINDEE_MODEL_ID=bf2e64e3-efc1-43a6-8ac0-a57acc3104b9
MINDEE_ENDPOINT=
```

Set `OCR_ENGINE=auto` to try Mindee first and fall back to Tesseract when Mindee is unavailable.

## 5. Verify the Integration

1. Run `npm run test:mindee` to execute the Mindee-powered OCR tests
2. Upload a Starbucks report through the UI and confirm the extraction is clean
3. Review the server logs – they now report `MINDEE OCR TEXT` blocks

## 6. API Features

Mindee OCR provides:
- **High accuracy** document text extraction
- **Confidence scores** for extracted fields
- **Structured data** extraction from documents
- **Retry logic** with exponential backoff for reliability
- **Error handling** for network issues and API errors

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env` file
- Check that the API key has not expired
- Verify you have sufficient API credits/quota

### Model ID Issues
- Use the default model ID if unsure: `bf2e64e3-efc1-43a6-8ac0-a57acc3104b9`
- Ensure the model ID exists in your Mindee account

### Network/Timeout Issues
- The implementation includes automatic retry logic
- Check your internet connection
- Verify Mindee API status at [https://status.mindee.com/](https://status.mindee.com/)

That's it! Mindee OCR now powers TipJar's automatic extraction.

