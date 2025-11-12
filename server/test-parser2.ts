/**
 * Detailed test to see which partners are being skipped
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

12.2x1.37 2 16.71 S17

10

uss 281

Diforojas, Roxy G

2148 hours.

2148 x 1.37 2 529.43  29

w20

wuss ast

45

-

S29

Archibald, Traci
26.1 hours

261x81.37 2636.76 - 36

uS20 HS uss ns

Chhim, Tae S
26.82 hours

26.82 x 1.37 2 36.74 - 37

S20 us uss 281

Danh, Kayden
14.83 hours.

14.83 x 1.37  20.32  20

ns20

Dulong, Syd or Sydney A
2217 hours.

2217 x 1.37  30.37  30`;

console.log('All partner names found in text:');
console.log('─'.repeat(60));
const lines = testText.split('\n');
lines.forEach((line, i) => {
  if (line.match(/^[A-Za-z\s\.'-]+,\s+[A-Za-z\s\.'-]+$/)) {
    console.log(`Line ${i}: "${line}"`);
    // Check next few lines for hours
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const nextLine = lines[j].trim();
      const match = nextLine.match(/^(\d+\.?\d*)\s*hours?\.?/i);
      if (match) {
        const hours = parseFloat(match[1]);
        console.log(`  → Hours: ${hours} (valid: ${hours > 0 && hours < 200})`);
        break;
      }
    }
  }
});

console.log('\n\nParsing result:');
console.log('='.repeat(60));
const result = parseStarbucksReport(testText);
console.log(`Partners found: ${result.partners.length}`);
console.log(`Confidence: ${result.confidence}`);
result.partners.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.name}: ${p.hours} hours`);
});

