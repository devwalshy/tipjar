/**
 * Test with the real Starbucks report format from the image
 */

import { parseStarbucksReport } from './lib/tableParser';

// This is what the OCR should extract from a real report
const realReportText = `Tip Distribution Report

Store Number: 69600
Time Period: 10/13/2025 - 10/19/2025
Executed By: US2934752
Executed On: 10/21/2025 06:23:08
Data Disclaimer Includes all updates made at least 15 minutes before the report

Home Store    Partner Name                Partner Number    Total Tippable Hours

69600    Ailuogwemhe, Jodie O         US37008498    27.10
69600    Bradley, Kay M               US37148220    13.35
69600    Dicen, Pablo                 US37183787    37.03
69600    Goodell, Grace F             US2546161     25.27
69600    Hernandez, Helky D           US37081323    16.08
69600    Lizama, Jayclyn              US37142795    30.72
69600    Mayerick, Aidan S            US37123655    23.73
69600    Moore, Shealyn Moore         US37086274    16.12
69600    Olowu, Adeyinka C            US37087528    25.03
69600    Ovalle Merida, Keily         US37149136    20.15
69600    Sloan, Haley M               US36940406    40.28
69600    Tremblay, Jenna L            US36917878    38.22
69600    Walsh, William P             US36931959    33.68

Total Tippable Hours:    346.76`;

console.log('Testing parser with REAL Starbucks report format:\n');
console.log('='.repeat(70));

const result = parseStarbucksReport(realReportText);

console.log(`✓ Partners found: ${result.partners.length}`);
console.log(`✓ Confidence: ${result.confidence}%`);
console.log(`✓ Total hours: ${result.totalHours || 'not detected'}`);

console.log('\n' + '='.repeat(70));
console.log('Extracted Partners:');
console.log('='.repeat(70));

let totalExtracted = 0;
result.partners.forEach((p, i) => {
  console.log(`${String(i + 1).padStart(2, ' ')}. ${p.name.padEnd(30, ' ')} ${p.hours} hours`);
  totalExtracted += p.hours;
});

console.log('='.repeat(70));
console.log(`Total Hours Extracted: ${totalExtracted.toFixed(2)}`);
console.log(`Expected Total: 346.76`);
console.log(`Match: ${Math.abs(totalExtracted - 346.76) < 0.1 ? '✅ YES' : '❌ NO'}`);

