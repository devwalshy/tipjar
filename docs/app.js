// Global state
let partnerHours = [];
let distributionData = null;

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function calculateHourlyRate(totalAmount, totalHours) {
  if (totalHours === 0) return 0;
  const hourlyRate = totalAmount / totalHours;
  const hourlyRateStr = hourlyRate.toString();
  const decimalIndex = hourlyRateStr.indexOf('.');
  if (decimalIndex === -1) return hourlyRate;
  const twoDecimalPlaces = hourlyRateStr.substring(0, decimalIndex + 3);
  return parseFloat(twoDecimalPlaces);
}

function showToast(title, description, variant = 'default') {
  alert(`${title}\n${description}`);
}

// File upload handling
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Invalid file type', 'Please select an image file', 'error');
    return;
  }

  const dropzone = document.getElementById('dropzone');
  dropzone.innerHTML = `
    <div class="w-full">
      <div class="mb-4 h-16 w-16 mx-auto" style="color: var(--spring-blue);">
        <div class="h-full w-full rounded-full p-3" style="background-color: var(--app-input);">
          <svg class="h-full w-full animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <p style="color: var(--text-white);" class="mb-2 text-base font-medium">Processing report...</p>
      <div class="w-48 h-2 rounded-full overflow-hidden mt-2 mx-auto" style="background-color: var(--app-input);">
        <div class="h-full animate-pulse" style="background-color: var(--spring-blue);"></div>
      </div>
    </div>
  `;

  try {
    const text = await performOCR(file);
    const partners = extractPartnerHours(text);
    
    if (partners.length > 0) {
      partnerHours = partners;
      dropzone.innerHTML = `
        <div class="animate-scaleIn w-full">
          <div class="mb-4 h-16 w-16 mx-auto" style="color: var(--spring-green);">
            <div class="h-full w-full rounded-full p-3" style="background-color: var(--app-input);">
              <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p style="color: var(--text-white);" class="mb-2 text-base font-medium">File processed successfully!</p>
          <div class="flex items-center justify-center rounded-full px-4 py-2 mx-auto max-w-max" style="background-color: var(--app-input);">
            <svg class="h-4 w-4 mr-2" style="color: var(--text-yellow);" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm m-0" style="color: var(--text-yellow);">${file.name}</p>
          </div>
        </div>
      `;
      showToast('Report processed', `Successfully extracted ${partners.length} partners`);
      
      setTimeout(() => {
        resetDropzone();
      }, 3000);
    } else {
      throw new Error('No partner information detected');
    }
  } catch (error) {
    console.error(error);
    dropzone.innerHTML = `
      <div class="animate-scaleIn w-full">
        <div class="mb-4 h-16 w-16 mx-auto" style="color: #ef4444;">
          <div class="h-full w-full rounded-full p-3" style="background-color: var(--app-input);">
            <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <p style="color: var(--text-white);" class="mb-2 text-base font-medium">Processing failed</p>
        <div class="rounded-lg p-3 mb-3 max-w-xs mx-auto" style="background-color: var(--app-input);">
          <p class="text-sm m-0" style="color: var(--text-yellow);">
            ${error.message || 'Please try again with a different report'}
          </p>
        </div>
        <button onclick="resetDropzone()" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    `;
    showToast('Processing failed', error.message, 'error');
  }
}

function resetDropzone() {
  const dropzone = document.getElementById('dropzone');
  dropzone.innerHTML = `
    <div class="w-full">
      <div class="flex flex-col items-center">
        <div class="mb-4 h-16 w-16 mx-auto" style="color: var(--spring-green);">
          <div class="h-full w-full rounded-full p-3" style="background-color: var(--app-input);">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        <p style="color: var(--text-yellow);" class="mb-4 text-sm opacity-80">Upload your partner hours report</p>
        <button class="btn-primary" onclick="document.getElementById('fileInput').click()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload Report</span>
        </button>
      </div>
      <div class="text-xs mt-4 opacity-70" style="color: var(--spring-blue);">
        Supported formats: PNG, JPG, JPEG, GIF
      </div>
    </div>
  `;
}

// OCR Processing
async function performOCR(file) {
  const { createWorker } = Tesseract;
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
}

// Extract partner hours from OCR text
function extractPartnerHours(text) {
  const partners = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pattern: Name followed by hours (e.g., "John Doe 8.5" or "Jane Smith: 7.25")
    const match = line.match(/^([A-Za-z\s]+?)[\s:]+(\d+\.?\d*)$/);
    
    if (match) {
      const name = match[1].trim();
      const hours = parseFloat(match[2]);
      
      if (name.length > 2 && hours > 0 && hours < 24) {
        partners.push({ name, hours });
      }
    }
  }
  
  return partners;
}

// Calculate distribution
function handleCalculate() {
  const tipAmountInput = document.getElementById('tipAmount');
  const tipAmount = parseFloat(tipAmountInput.value);
  
  if (!partnerHours.length) {
    showToast('No partner data', 'Please upload a report with partner information', 'error');
    return;
  }
  
  if (!tipAmount || tipAmount <= 0) {
    showToast('Missing tip amount', 'Please enter the total tip amount', 'error');
    return;
  }
  
  const totalHours = partnerHours.reduce((sum, p) => sum + p.hours, 0);
  const hourlyRate = calculateHourlyRate(tipAmount, totalHours);
  
  const partnerPayouts = partnerHours.map(partner => {
    const exactAmount = partner.hours * hourlyRate;
    const rounded = Math.round(exactAmount);
    const billBreakdown = calculateBillBreakdown(rounded);
    
    return {
      name: partner.name,
      hours: partner.hours,
      exactAmount,
      rounded,
      billBreakdown
    };
  });
  
  distributionData = {
    totalHours,
    hourlyRate,
    totalAmount: tipAmount,
    partnerPayouts
  };
  
  renderResults();
  showToast('Distribution calculated', 'Tip distribution calculated successfully');
}

// Calculate bill breakdown
function calculateBillBreakdown(amount) {
  const bills = [20, 10, 5, 1];
  const breakdown = [];
  let remaining = amount;
  
  for (const bill of bills) {
    if (remaining >= bill) {
      const quantity = Math.floor(remaining / bill);
      breakdown.push({ denomination: bill, quantity });
      remaining -= quantity * bill;
    }
  }
  
  return breakdown;
}

// Get bill color class
function getBillClass(denomination) {
  switch(denomination) {
    case 20: return 'bg-[#d2b0e3] text-[#364949]';
    case 10: return 'bg-[#dd7895] text-[#364949]';
    case 5: return 'bg-[#ffd1ba] text-[#364949]';
    case 1: return 'bg-[#ffeed6] text-[#364949]';
    default: return 'bg-[#93ec93] text-[#364949]';
  }
}

// Render results
function renderResults() {
  if (!distributionData) return;
  
  const { totalHours, hourlyRate, totalAmount, partnerPayouts } = distributionData;
  const currentDate = formatDate(new Date());
  
  // Calculate total bills needed
  const billsNeeded = {};
  partnerPayouts.forEach(partner => {
    partner.billBreakdown.forEach(bill => {
      const key = bill.denomination;
      billsNeeded[key] = (billsNeeded[key] || 0) + bill.quantity;
    });
  });
  
  const billsHtml = Object.entries(billsNeeded)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .map(([bill, count]) => {
      const billClass = getBillClass(parseInt(bill));
      return `
        <div class="px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 ${billClass}">
          <div class="flex items-center">
            <span class="font-bold mr-1">${count}</span> × $${bill}
          </div>
        </div>
      `;
    }).join('');
  
  const partnerCardsHtml = partnerPayouts.map(partner => {
    const billsBreakdownHtml = partner.billBreakdown
      .sort((a, b) => b.denomination - a.denomination)
      .map(bill => {
        const billClass = getBillClass(bill.denomination);
        return `
          <div class="px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 ${billClass}">
            ${bill.quantity}×$${bill.denomination}
          </div>
        `;
      }).join('');
    
    return `
      <div class="card animate-fadeUp overflow-hidden gradient-border">
        <div class="card-header flex flex-row justify-between items-center py-3">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border-2" style="background-color: var(--app-input); border-color: var(--spring-green);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" style="color: var(--spring-green);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-medium text-lg m-0 truncate pr-2">${partner.name}</h3>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-xs" style="color: var(--text-yellow);">Payout</span>
            <span class="text-2xl font-bold animate-pulse" style="color: var(--spring-accent);">$${partner.rounded}</span>
          </div>
        </div>
        
        <div class="card-body p-4">
          <div class="flex justify-between items-center mb-3 rounded-md p-2" style="background-color: var(--app-input);">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" style="color: var(--spring-blue);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium" style="color: var(--text-yellow);">Hours:</span>
            </div>
            <span class="px-3 py-1 rounded-full text-sm font-medium" style="background-color: var(--app-darker);">${partner.hours}</span>
          </div>
          
          <div class="rounded-md p-3 mb-2" style="background-color: var(--app-darker);">
            <div class="text-xs mb-1" style="color: var(--spring-blue);">Calculation</div>
            <div class="text-sm flex flex-wrap items-center break-words">
              <span class="mr-1 font-medium">${partner.hours}</span> 
              <span style="color: var(--text-yellow);" class="mx-1">×</span> 
              <span class="mx-1 font-medium" style="color: var(--spring-blue);">$${hourlyRate.toFixed(2)}</span>
              <span style="color: var(--text-yellow);" class="mx-1">=</span>
              <span class="mx-1 font-medium" style="color: var(--text-yellow);">$${partner.exactAmount.toFixed(2)}</span>
              <span style="color: var(--text-yellow);" class="mx-1">→</span>
              <span class="ml-1 font-bold" style="color: var(--spring-accent);">$${partner.rounded}</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer p-3">
          <div class="w-full">
            <div class="mb-2 text-sm font-medium flex items-center" style="color: var(--text-yellow);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Bill Breakdown:
            </div>
            <div class="flex flex-wrap gap-2">
              ${billsBreakdownHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const resultsHtml = `
    <div class="animate-fadeIn">
      <!-- Summary Card -->
      <div class="card animate-scaleIn mb-8">
        <div class="card-header">
          <div class="flex items-center justify-center w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" style="color: var(--spring-green);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div class="text-2xl font-semibold tracking-tight">Distribution Summary</div>
          </div>
        </div>
        
        <div class="card-body p-5">
          <div class="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div class="summary-box gradient-border animate-fadeUp">
              <p class="text-sm mb-1 m-0 flex items-center" style="color: var(--text-yellow);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total Hours
              </p>
              <p class="text-2xl font-bold m-0">${totalHours}</p>
            </div>
            <div class="summary-box gradient-border animate-fadeUp">
              <p class="text-sm mb-1 m-0 flex items-center" style="color: var(--spring-blue);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hourly Rate
              </p>
              <p class="text-2xl font-bold m-0 animate-pulse" style="color: var(--spring-blue);">
                $${hourlyRate.toFixed(2)}
              </p>
            </div>
            <div class="summary-box gradient-border animate-fadeUp">
              <p class="text-sm mb-1 m-0 flex items-center" style="color: var(--spring-accent);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Total Distributed
              </p>
              <p class="text-2xl font-bold m-0" style="color: var(--spring-accent);">${formatCurrency(totalAmount)}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-3 mt-2 rounded-md animate-fadeUp" style="background-color: var(--app-darker);">
            <h3 class="text-base font-medium m-0 flex items-center" style="color: var(--text-yellow);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Distribution Date
            </h3>
            <p class="m-0 px-3 py-1 rounded-full text-sm" style="background-color: var(--app-input);">${currentDate}</p>
          </div>
        </div>
      </div>

      <!-- Calculation Details -->
      <div class="card mb-8">
        <div class="card-header">
          <div class="flex items-center justify-center w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" style="color: var(--spring-green);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-xl font-semibold tracking-tight">Calculation Details</div>
          </div>
        </div>
        
        <div class="card-body">
          <div class="p-5 rounded-lg mb-5 gradient-border animate-fadeUp" style="background-color: var(--app-input);">
            <div class="text-xs mb-2" style="color: var(--spring-blue);">Formula</div>
            <div class="flex flex-wrap items-center">
              <div class="px-4 py-2 rounded-md mr-3 mb-2" style="background-color: var(--app-darker);">
                <span class="text-sm mr-1" style="color: var(--text-yellow);">Total Tips:</span> 
                <span class="font-bold" style="color: var(--spring-accent);">$${totalAmount.toFixed(2)}</span>
              </div>
              
              <span class="mx-2 text-lg mb-2" style="color: var(--text-yellow);">÷</span>
              
              <div class="px-4 py-2 rounded-md mr-3 mb-2" style="background-color: var(--app-darker);">
                <span class="text-sm mr-1" style="color: var(--text-yellow);">Total Hours:</span>
                <span class="font-bold">${totalHours}</span>
              </div>
              
              <span class="mx-2 text-lg mb-2" style="color: var(--text-yellow);">=</span>
              
              <div class="px-4 py-2 rounded-md mb-2" style="background-color: var(--app-darker);">
                <span class="font-bold" style="color: var(--spring-blue);">
                  $${hourlyRate.toFixed(2)}
                </span>
                <span class="text-sm ml-1" style="color: var(--text-yellow);">per hour</span>
              </div>
            </div>
          </div>
          
          <div class="animate-fadeUp">
            <h3 class="flex items-center font-medium mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" style="color: var(--spring-green);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Total Bills Needed:
            </h3>
            <div class="p-5 rounded-lg" style="background-color: var(--app-input);">
              <div class="flex flex-wrap gap-3">
                ${billsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Partner Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
        ${partnerCardsHtml}
      </div>
    </div>
  `;
  
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = resultsHtml;
  resultsContainer.classList.remove('hidden');
  
  // Scroll to results on mobile
  if (window.innerWidth < 768) {
    setTimeout(() => {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
}

// Drag and drop handlers
const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('active');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('active');
});

dropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropzone.classList.remove('active');
  
  if (e.dataTransfer.files.length) {
    const fileInput = document.getElementById('fileInput');
    fileInput.files = e.dataTransfer.files;
    await handleFileUpload({ target: fileInput });
  }
});
