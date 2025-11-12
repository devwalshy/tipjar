/**
 * Debug why Goodell, Grace F is being skipped
 */

const testLines = [
  '69600    Goodell, Grace F             US2546161     25.27',
  '69600    Bradley, Kay M               US37148220    13.35',
  '69600    Dicen, Pablo                 US37183787    37.03',
];

console.log('Testing partner extraction patterns:\n');

testLines.forEach(line => {
  console.log(`Line: "${line}"`);
  
  // Pattern 1: Full format with 8-digit partner ID
  const pattern1 = /^\d{5}\s+([A-Za-z\s,\.'-]+?)\s+US\d{8}\s+(\d+\.?\d*)$/i;
  const match1 = line.match(pattern1);
  console.log(`  Pattern 1 (US########): ${match1 ? '✅ MATCH' : '❌ NO MATCH'}`);
  if (match1) {
    console.log(`    Name: "${match1[1].trim()}"  Hours: ${match1[2]}`);
  }
  
  // Pattern 2: With ANY length partner ID  
  const pattern2 = /^\d{5}\s+([A-Za-z\s,\.'-]+?)\s+US\d+\s+(\d+\.?\d*)$/i;
  const match2 = line.match(pattern2);
  console.log(`  Pattern 2 (US#...): ${match2 ? '✅ MATCH' : '❌ NO MATCH'}`);
  if (match2) {
    console.log(`    Name: "${match2[1].trim()}"  Hours: ${match2[2]}`);
  }
  
  console.log('');
});

