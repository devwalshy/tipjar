/**
 * Azure AI Document Intelligence OCR implementation
 * Uses Azure's Document Intelligence (Form Recognizer) for superior table extraction
 */

interface AzureOCRResult {
  text: string | null;
  partnerData?: Array<{ name: string; hours: number }>;
  confidence?: number;
  error?: string;
}

interface TableCell {
  rowIndex: number;
  columnIndex: number;
  content: string;
}

interface DocumentTable {
  rowCount: number;
  columnCount: number;
  cells: TableCell[];
}

/**
 * Analyze an image using Azure AI Document Intelligence
 * @param imageBuffer The image buffer
 * @returns OCR result with extracted text and partner data
 */
export async function analyzeImageWithAzure(imageBuffer: Buffer): Promise<AzureOCRResult> {
  try {
    // Support both old (CV) and new (DI) environment variables
    const apiKey = process.env.AZURE_DI_KEY || process.env.AZURE_CV_KEY;
    const endpoint = process.env.AZURE_DI_ENDPOINT || process.env.AZURE_CV_ENDPOINT;
    
    if (!apiKey || !endpoint) {
      console.log('Azure credentials not configured, skipping Azure OCR');
      return {
        text: null,
        error: 'Azure Document Intelligence not configured'
      };
    }
    
    console.log('Starting Azure Document Intelligence OCR...');
    
    // Step 1: Submit document for analysis using prebuilt-layout model
    const analyzeUrl = `${endpoint}/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31`;
    
    const analyzeResponse = await fetch(analyzeUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: imageBuffer as any  // Buffer is compatible with fetch body
    });
    
    if (!analyzeResponse.ok) {
      const errorText = await analyzeResponse.text();
      console.error('Azure DI analyze error:', analyzeResponse.status, errorText);
      return {
        text: null,
        error: `Azure Document Intelligence failed: ${analyzeResponse.status}`
      };
    }
    
    // Get the operation location URL
    const operationLocation = analyzeResponse.headers.get('Operation-Location');
    if (!operationLocation) {
      return {
        text: null,
        error: 'No operation location returned from Azure'
      };
    }
    
    console.log('Azure DI: Analysis submitted, waiting for results...');
    
    // Step 2: Poll for results
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between polls
      
      const resultResponse = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });
      
      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        console.error('Azure DI result error:', resultResponse.status, errorText);
        return {
          text: null,
          error: `Azure DI result failed: ${resultResponse.status}`
        };
      }
      
      const result = await resultResponse.json();
      
      if (result.status === 'succeeded') {
        console.log('Azure DI: Analysis succeeded');
        
        // Extract tables and text
        const extractedData = extractTableData(result.analyzeResult);
        
        if (extractedData.text) {
          console.log(`Azure DI: Extracted ${extractedData.text.length} characters`);
          console.log(`Azure DI: Found ${extractedData.tableCount} tables`);
        }
        
        return {
          text: extractedData.text,
          confidence: 95 // Document Intelligence has very high confidence for structured documents
        };
      } else if (result.status === 'failed') {
        console.error('Azure DI failed:', result);
        return {
          text: null,
          error: 'Azure Document Intelligence analysis failed'
        };
      }
      
      attempts++;
    }
    
    return {
      text: null,
      error: 'Azure Document Intelligence timeout'
    };
    
  } catch (error) {
    console.error('Azure DI error:', error);
    return {
      text: null,
      error: `Azure DI exception: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Extract table data from Document Intelligence result
 * Converts structured tables into text format compatible with our parser
 */
function extractTableData(analyzeResult: any): { text: string; tableCount: number } {
  const lines: string[] = [];
  let tableCount = 0;
  
  // Extract tables first (priority for structured data)
  if (analyzeResult.tables && analyzeResult.tables.length > 0) {
    for (const table of analyzeResult.tables) {
      tableCount++;
      const tableText = convertTableToText(table);
      if (tableText) {
        lines.push(tableText);
      }
    }
  }
  
  // ALWAYS include full content as well to catch any data tables might miss
  if (analyzeResult.content) {
    lines.push(analyzeResult.content);
  } else if (analyzeResult.paragraphs) {
    // Fallback to paragraphs
    for (const paragraph of analyzeResult.paragraphs) {
      if (paragraph.content) {
        lines.push(paragraph.content);
      }
    }
  }
  
  return {
    text: lines.join('\n'),
    tableCount
  };
}

/**
 * Convert structured table to text format
 * Formats as: "StoreNumber  Name  PartnerID  Hours" per row
 */
function convertTableToText(table: DocumentTable): string {
  const rows: Map<number, Map<number, string>> = new Map();
  
  // Organize cells by row and column
  for (const cell of table.cells) {
    if (!rows.has(cell.rowIndex)) {
      rows.set(cell.rowIndex, new Map());
    }
    rows.get(cell.rowIndex)!.set(cell.columnIndex, cell.content.trim());
  }
  
  // Convert rows to text lines
  const textLines: string[] = [];
  const sortedRowIndices = Array.from(rows.keys()).sort((a, b) => a - b);
  
  for (const rowIndex of sortedRowIndices) {
    const rowData = rows.get(rowIndex)!;
    const sortedColIndices = Array.from(rowData.keys()).sort((a, b) => a - b);
    
    // Join columns with spaces (maintains structure)
    const rowText = sortedColIndices
      .map(colIndex => rowData.get(colIndex) || '')
      .join('    '); // Use 4 spaces to separate columns
    
    if (rowText.trim()) {
      textLines.push(rowText);
    }
  }
  
  return textLines.join('\n');
}

