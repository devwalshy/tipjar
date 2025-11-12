/**
 * Table parser for Starbucks Tip Distribution Reports
 * Extracts partner names and hours from OCR text
 */

interface PartnerData {
  name: string;
  hours: number;
}

interface ParseResult {
  partners: PartnerData[];
  totalHours: number | null;
  confidence: number;
}

/**
 * Parse Starbucks Tip Distribution Report OCR text
 * @param ocrText Raw text from OCR
 * @returns Parsed partner data with confidence score
 */
export function parseStarbucksReport(ocrText: string): ParseResult {
  const partners: PartnerData[] = [];
  let totalHours: number | null = null;
  let confidence = 0;
  
  // Split into lines
  const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Find where the table data starts (after "Partner Name" header)
  let tableStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('partner name') && line.includes('tippable')) {
      tableStartIndex = i + 1;
      confidence += 20; // Found header = good sign
      break;
    }
  }
  
  // If we didn't find the header, try to find data anyway
  if (tableStartIndex === -1) {
    // Look for store number line as alternative starting point
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^\d{5}\s+[A-Z]/i)) {
        tableStartIndex = i;
        confidence += 10;
        break;
      }
    }
  }
  
  if (tableStartIndex === -1) {
    tableStartIndex = 0; // Start from beginning if no markers found
  }
  
  // Parse table rows
  for (let i = tableStartIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for total hours line (end of table) - must be at END, not in calculations
    // Only match if we've already found some partners OR it looks like a footer
    const totalMatch = line.match(/^total\s+(?:tippable\s+)?hours[\s:]+(\d+\.?\d*)$/i);
    if (totalMatch && (partners.length > 0 || i > 10)) {
      totalHours = parseFloat(totalMatch[1]);
      confidence += 15; // Found total = good validation
      break;
    }
    
    // Try to extract partner data from line
    const partner = extractPartnerFromLine(line);
    if (partner) {
      partners.push(partner);
      continue;
    }
    
    // Special case 1: Multi-line format from Azure Document Intelligence
    // Line 1: Store number (69600)
    // Line 2: Name (Lastname, Firstname M :unselected:)
    // Line 3: Partner ID (US12345678)
    // Line 4: Hours (27.10)
    if (line.match(/^\d{5}$/) && i + 3 < lines.length) {
      const nameLine = lines[i + 1].trim().replace(/:unselected:/gi, '').replace(/:selected:/gi, '');
      const idLine = lines[i + 2].trim();
      const hoursLine = lines[i + 3].trim();
      
      const name = cleanName(nameLine);
      const hasValidId = idLine.match(/^US\d{7,9}$/i);
      const hoursMatch = hoursLine.match(/^(\d+\.?\d*)$/);
      
      if (name && name.includes(',') && name.length >= 5 && hasValidId && hoursMatch) {
        let hours = parseFloat(hoursMatch[1]);
        
        // OCR error correction
        if (hours >= 100 && hours < 10000) {
          const hoursStr = hours.toString();
          if (hoursStr.length === 3) {
            hours = parseFloat(hoursStr.slice(0, 2) + '.' + hoursStr.slice(2));
          } else if (hoursStr.length === 4) {
            hours = parseFloat(hoursStr.slice(0, 2) + '.' + hoursStr.slice(2));
          }
        }
        
        if (!isNaN(hours) && hours > 0 && hours < 200) {
          partners.push({ name, hours });
          i += 3; // Skip the processed lines
          continue;
        }
      }
    }
    
    // Special case 2: Name on one line, hours on next line (or nearby)
    // "Lastname, Firstname M :unselected:"
    // "US12345678" (optional)
    // "27.10"
    if (line.match(/^[A-Za-z\s\.'-]+,\s+[A-Za-z\s\.'-]+/)) {
      const cleanedLine = line.replace(/:unselected:/gi, '').replace(/:selected:/gi, '');
      const name = cleanName(cleanedLine);
      if (name && name.length >= 5) {
        // Look at next 1-4 lines for hours
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim();
          
          // Skip partner ID lines
          if (nextLine.match(/^US\d{7,9}$/i)) {
            continue;
          }
          
          // Look for hours (just a number, possibly with "hours" suffix)
          const hoursMatch = nextLine.match(/^(\d+\.?\d*)\s*(?:hours)?\.?$/i);
          if (hoursMatch) {
            let hours = parseFloat(hoursMatch[1]);
            
            // OCR Error Correction
            if (hours >= 100 && hours < 10000) {
              const hoursStr = hours.toString();
              if (hoursStr.length === 3) {
                hours = parseFloat(hoursStr.slice(0, 2) + '.' + hoursStr.slice(2));
              } else if (hoursStr.length === 4) {
                hours = parseFloat(hoursStr.slice(0, 2) + '.' + hoursStr.slice(2));
              }
            }
            
            if (!isNaN(hours) && hours > 0 && hours < 200) {
              partners.push({ name, hours });
              i = j; // Skip to after the hours line
              break;
            }
          }
        }
      }
    }
  }
  
  // Remove duplicates (Azure Document Intelligence returns data twice: table + full text)
  // Keep the first occurrence of each partner name
  const uniquePartners: PartnerData[] = [];
  const seenNames = new Set<string>();
  
  for (const partner of partners) {
    // Normalize name for comparison (lowercase, trim spaces)
    const normalizedName = partner.name.toLowerCase().trim();
    
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      uniquePartners.push(partner);
    }
  }
  
  console.log(`Deduplication: ${partners.length} total -> ${uniquePartners.length} unique partners`);
  
  // Calculate confidence based on results
  if (uniquePartners.length > 0) {
    confidence += Math.min(50, uniquePartners.length * 5); // More partners = higher confidence
  }
  
  // Validate total hours if available
  if (totalHours && uniquePartners.length > 0) {
    const calculatedTotal = uniquePartners.reduce((sum, p) => sum + p.hours, 0);
    const difference = Math.abs(calculatedTotal - totalHours);
    
    // If calculated total is within 1% of reported total, boost confidence
    if (difference / totalHours < 0.01) {
      confidence += 15;
    } else if (difference / totalHours < 0.05) {
      confidence += 5;
    }
  }
  
  // Cap confidence at 100
  confidence = Math.min(100, confidence);
  
  return {
    partners: uniquePartners,
    totalHours,
    confidence
  };
}

/**
 * Extract partner name and hours from a table row
 * @param line A line from the OCR text
 * @returns Partner data or null if not a valid row
 */
function extractPartnerFromLine(line: string): PartnerData | null {
  // Clean the line
  line = line.trim();
  
  // Skip header lines and noise
  if (line.toLowerCase().includes('partner name') || 
      line.toLowerCase().includes('home store') ||
      line.toLowerCase().includes('store number') ||
      line.toLowerCase().includes('calculation') ||
      line.toLowerCase().includes('total tips') ||
      line.toLowerCase().includes('bills needed') ||
      line.includes('×') || // Calculation symbols
      line.includes('$') ||  // Currency symbols in calculations
      line.match(/^\d+x/i)) { // Pattern like "17x$20"
    return null;
  }
  
  // Pattern 1: Standard Starbucks format (7-9 digit partner IDs)
  // "69600    Ailuogwemhe, Jodie O    US37008498    9.22"
  // "69600    Goodell, Grace F        US2546161     25.27" (7 digits)
  // Format: StoreNumber  Name  PartnerNumber  Hours
  const pattern1 = /^\d{5}\s+([A-Za-z\s,\.'-]+?)\s+US\d{7,9}\s+(\d+\.?\d*)$/i;
  const match1 = line.match(pattern1);
  if (match1) {
    const name = cleanName(match1[1]);
    const hours = parseFloat(match1[2]);
    if (name && name.length >= 3 && !isNaN(hours) && hours > 0 && hours < 200) {
      return { name, hours };
    }
  }
  
  // Pattern 2: Name with hours at the end (may have extra text after hours)
  // "69600    Ailuogwemhe, Jodie O    US37008498    9.22 = 13"
  const pattern2 = /^\d{5}\s+([A-Za-z\s,\.'-]+?)\s+US\d{7,9}\s+(\d+\.?\d*)/i;
  const match2 = line.match(pattern2);
  if (match2) {
    const name = cleanName(match2[1]);
    const hours = parseFloat(match2[2]);
    if (name && name.length >= 3 && !isNaN(hours) && hours > 0 && hours < 200) {
      return { name, hours };
    }
  }
  
  // Pattern 3: Simpler format without store number at start
  // "Ailuogwemhe, Jodie O    US37008498    9.22"
  const pattern3 = /^([A-Za-z\s,\.'-]+?)\s+US\d{7,9}\s+(\d+\.?\d*)$/i;
  const match3 = line.match(pattern3);
  if (match3) {
    const name = cleanName(match3[1]);
    const hours = parseFloat(match3[2]);
    if (name && name.length >= 3 && !isNaN(hours) && hours > 0 && hours < 200) {
      return { name, hours };
    }
  }
  
  // Pattern 4: Name followed by partner ID and hours (very strict - must have comma in name)
  // "Lastname, Firstname    US12345678    9.22"
  const pattern4 = /^([A-Za-z\s,\.'-]+,\s+[A-Za-z\s\.'-]+?)\s+US\d{7,9}\s+(\d+\.?\d*)$/i;
  const match4 = line.match(pattern4);
  if (match4) {
    const name = cleanName(match4[1]);
    const hours = parseFloat(match4[2]);
    if (name && name.length >= 3 && !isNaN(hours) && hours > 0 && hours < 200) {
      return { name, hours };
    }
  }
  
  // Pattern 5: Very strict minimal format - name must have comma, followed by decimal hours
  // "Lastname, Firstname M    27.10"
  const pattern5 = /^([A-Za-z\s\.'-]+,\s+[A-Za-z\s\.'-]+)\s+(\d+\.?\d*)$/;
  const match5 = line.match(pattern5);
  if (match5) {
    const name = cleanName(match5[1]);
    const hours = parseFloat(match5[2]);
    // Very strict: must have comma and reasonable length
    if (name && name.includes(',') && name.length >= 5 && 
        !isNaN(hours) && hours > 0 && hours < 200) {
      return { name, hours };
    }
  }
  
  // Pattern 6: Name on one line, hours on next (common in OCR output)
  // This pattern is checked separately in the main parser
  
  return null;
}

/**
 * Clean and normalize partner name
 * @param rawName Raw name from OCR
 * @returns Cleaned name
 */
function cleanName(rawName: string): string {
  // Remove extra whitespace
  let name = rawName.replace(/\s+/g, ' ').trim();
  
  // Remove common OCR artifacts
  name = name.replace(/[|]/g, 'I'); // Pipe to I
  name = name.replace(/[`'']/g, "'"); // Fix apostrophes
  
  // Remove trailing/leading special characters
  name = name.replace(/^[^\w]+|[^\w]+$/g, '');
  
  // Fix common OCR mistakes in names
  name = fixCommonOCRErrors(name);
  
  return name;
}

/**
 * Fix common OCR errors in partner names
 * @param text Text to fix
 * @returns Fixed text
 */
function fixCommonOCRErrors(text: string): string {
  // Common OCR substitutions
  const corrections: Record<string, string> = {
    // Number/letter confusions
    '0': 'O', // In names, 0 is likely O
    '1': 'I', // In names, 1 is likely I
    '5': 'S', // Sometimes 5 looks like S
    '8': 'B', // Sometimes 8 looks like B
  };
  
  // Only apply corrections to alphabetic parts (not in commas, spaces, etc.)
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // Only correct digits when surrounded by letters
    if (/\d/.test(char) && i > 0 && i < text.length - 1) {
      const prevIsLetter = /[A-Za-z]/.test(text[i - 1]);
      const nextIsLetter = /[A-Za-z]/.test(text[i + 1]);
      if (prevIsLetter || nextIsLetter) {
        result += corrections[char] || char;
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Validate parsed results
 * @param result Parse result to validate
 * @returns True if results look valid
 */
export function validateParseResult(result: ParseResult): boolean {
  // Must have at least 1 partner
  if (result.partners.length === 0) {
    return false;
  }
  
  // All partners must have valid names
  for (const partner of result.partners) {
    if (!partner.name || partner.name.length < 3) {
      return false;
    }
    if (partner.hours <= 0 || partner.hours > 200) {
      return false;
    }
  }
  
  // Confidence should be reasonable - lowered threshold since we're getting good results
  // If we have multiple partners, lower threshold is acceptable
  const minConfidence = result.partners.length >= 3 ? 15 : 20;
  if (result.confidence < minConfidence) {
    return false;
  }
  
  return true;
}

