import { setTimeout as delay } from 'timers/promises';

interface AzureOCRResult {
  text: string | null;
  confidence: number;
  error?: string;
}

interface AnalyzeResult {
  content?: string;
  paragraphs?: Array<{ confidence?: number }>;
}

interface AnalyzeResponse {
  status?: string;
  analyzeResult?: AnalyzeResult;
  error?: { message?: string };
}

const DEFAULT_MODEL_ID = 'prebuilt-read';
const DEFAULT_API_VERSION = '2024-02-29-preview';
const MAX_POLL_ATTEMPTS = 12;
const DEFAULT_POLL_INTERVAL_MS = 1000;

export async function analyzeImageWithAzureDocumentIntelligence(
  imageBuffer: Buffer
): Promise<AzureOCRResult> {
  try {
    const endpoint =
      process.env.AZURE_DI_ENDPOINT ||
      process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT ||
      process.env.AZURE_DOCUMENT_INTELLIGENCE_URL ||
      '';
    const apiKey =
      process.env.AZURE_DI_KEY ||
      process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY ||
      process.env.AZURE_DOCUMENT_INTELLIGENCE_API_KEY;

    if (!endpoint || !apiKey) {
      return {
        text: null,
        confidence: 0,
        error: 'Azure Document Intelligence credentials are not configured.',
      };
    }

    const modelId = process.env.AZURE_DI_MODEL_ID || DEFAULT_MODEL_ID;
    const apiVersion = process.env.AZURE_DI_API_VERSION || DEFAULT_API_VERSION;
    const url = buildAnalyzeUrl(endpoint, modelId, apiVersion);

    const submitResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': apiKey,
      },
      body: imageBuffer,
    });

    if (submitResponse.status !== 202) {
      const errorBody = await safeParseJson(submitResponse);
      return {
        text: null,
        confidence: 0,
        error:
          errorBody?.error?.message ||
          `Azure Document Intelligence analyze call failed (${submitResponse.status}).`,
      };
    }

    const operationLocationHeader =
      submitResponse.headers.get('operation-location') ||
      submitResponse.headers.get('Operation-Location');

    if (!operationLocationHeader) {
      return {
        text: null,
        confidence: 0,
        error: 'Azure Document Intelligence did not return an operation location.',
      };
    }

    const operationLocation = toAbsoluteUrl(endpoint, operationLocationHeader);

    const pollInterval = Number(process.env.AZURE_DI_POLL_INTERVAL_MS || DEFAULT_POLL_INTERVAL_MS);
    const maxAttempts = Number(process.env.AZURE_DI_MAX_POLLS || MAX_POLL_ATTEMPTS);

    let analysis: AnalyzeResponse | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await delay(pollInterval);
      const pollResponse = await fetch(operationLocation, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
      });

      const pollBody = (await safeParseJson(pollResponse)) as AnalyzeResponse | null;

      if (!pollResponse.ok) {
        const message = pollBody?.error?.message || 'Azure Document Intelligence polling failed.';
        return {
          text: null,
          confidence: 0,
          error: message,
        };
      }

      if (pollBody?.status === 'succeeded') {
        analysis = pollBody;
        break;
      }

      if (pollBody?.status === 'failed') {
        return {
          text: null,
          confidence: 0,
          error: pollBody?.error?.message || 'Azure Document Intelligence analysis failed.',
        };
      }
    }

    if (!analysis || analysis.status !== 'succeeded') {
      return {
        text: null,
        confidence: 0,
        error: 'Azure Document Intelligence analysis timed out.',
      };
    }

    const textContent = (analysis.analyzeResult?.content || '').trim();
    if (!textContent) {
      return {
        text: null,
        confidence: 0,
        error: 'Azure Document Intelligence returned no text content.',
      };
    }

    const confidence = calculateConfidence(analysis.analyzeResult);

    return {
      text: textContent,
      confidence,
    };
  } catch (error) {
    return {
      text: null,
      confidence: 0,
      error: `Azure Document Intelligence exception: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
}

function buildAnalyzeUrl(endpoint: string, modelId: string, apiVersion: string): string {
  const normalizedEndpoint = endpoint.replace(/\/?$/, '');
  return `${normalizedEndpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=${apiVersion}`;
}

function toAbsoluteUrl(endpoint: string, location: string): string {
  if (location.startsWith('http://') || location.startsWith('https://')) {
    return location;
  }

  const normalizedEndpoint = endpoint.replace(/\/?$/, '');
  return `${normalizedEndpoint}/${location.replace(/^\/+/, '')}`;
}

async function safeParseJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function calculateConfidence(result?: AnalyzeResult): number {
  if (!result?.paragraphs || result.paragraphs.length === 0) {
    return 75;
  }

  const confidences = result.paragraphs
    .map(paragraph => (typeof paragraph.confidence === 'number' ? paragraph.confidence : null))
    .filter((value): value is number => value !== null);

  if (confidences.length === 0) {
    return 80;
  }

  const average = confidences.reduce((sum, value) => sum + value, 0) / confidences.length;
  const scaled = average <= 1 ? average * 100 : average;
  return Math.min(100, Math.max(0, Math.round(scaled)));
}
