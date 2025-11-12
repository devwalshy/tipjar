import { roundToNearestDollar } from "./utils";

// Available bill denominations - only using $20, $10, $5, $1 as requested
const DENOMINATIONS = [20, 10, 5, 1];

/**
 * Calculates the optimal bill breakdown for a given amount
 * @param amount The amount to break down into bills
 * @returns Array of {denomination, quantity} objects
 */
export function calculateBillBreakdown(amount: number): Array<{denomination: number, quantity: number}> {
  // First, round to the nearest dollar
  const roundedAmount = roundToNearestDollar(amount);
  
  let remaining = roundedAmount;
  const breakdown: Array<{denomination: number, quantity: number}> = [];
  
  // Calculate how many of each denomination are needed
  for (const denom of DENOMINATIONS) {
    if (remaining >= denom) {
      const quantity = Math.floor(remaining / denom);
      breakdown.push({
        denomination: denom,
        quantity
      });
      remaining -= denom * quantity;
    }
  }
  
  return breakdown;
}

/**
 * Rounds a payout to the nearest dollar and calculates bill breakdown
 * @param payout The exact payout amount
 * @returns Object with rounded amount and bill breakdown
 */
export function roundAndCalculateBills(payout: number): {
  rounded: number;
  billBreakdown: Array<{denomination: number, quantity: number}>;
} {
  const rounded = roundToNearestDollar(payout);
  const billBreakdown = calculateBillBreakdown(rounded);
  
  return {
    rounded,
    billBreakdown
  };
}
