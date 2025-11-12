/**
 * Quick test of the parser with the exact OCR output
 */

import { parseStarbucksReport } from './lib/tableParser';

const testText = `Calculation:

Total Tips: 523.00 Total Hours: 379.85  1.37 per hour

Bills Needed:

17x620,5 x 10, 12 x 6, 39 x 1

Altuogwernhe, Jodie O

9.22 hours.

9.22x1.37 2 1263 - 13

10

3x81

Brogan, Kim M

329 hours.

329 x 1.37 2 45.07 545

21520

nsS

Cole, Amanda M

122 hours

12.2x1.37 2 16.71 S17`;

console.log('Testing parser with real OCR output:\n');
console.log('='.repeat(60));

const result = parseStarbucksReport(testText);

console.log(`Partners found: ${result.partners.length}`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Total hours: ${result.totalHours}`);

console.log('\nPartners:');
result.partners.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.name}: ${p.hours} hours`);
});

console.log('\n' + '='.repeat(60));

// Test individual lines
console.log('\nTesting individual line patterns:\n');

const testLines = [
  'Altuogwernhe, Jodie O',
  'Brogan, Kim M',
  'Cole, Amanda M'
];

testLines.forEach(line => {
  const matches = line.match(/^[A-Za-z\s\.'-]+,\s+[A-Za-z\s\.'-]+$/);
  console.log(`Line: "${line}"`);
  console.log(`  Matches name pattern: ${!!matches}`);
  console.log(`  Cleaned: "${line.trim()}"`);
});

