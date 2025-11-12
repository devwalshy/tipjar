import { DistributionData } from "@shared/schema";
import PartnerCard from "./PartnerCard";
import { formatCurrency } from "@/utils/utils";

interface PartnerPayoutsListProps {
  distributionData: DistributionData;
}

export default function PartnerPayoutsList({
  distributionData,
}: PartnerPayoutsListProps) {
  const { partnerPayouts, hourlyRate, totalAmount, totalHours } = distributionData;
  const formattedHourlyRate = formatCurrency(
    Math.floor(hourlyRate * 100) / 100,
  );

  if (!partnerPayouts || partnerPayouts.length === 0) {
    return null;
  }

  const billsNeeded: Record<string, number> = {};
  partnerPayouts.forEach((partner) => {
    partner.billBreakdown.forEach((bill) => {
      const key = `$${bill.denomination}`;
      billsNeeded[key] = (billsNeeded[key] || 0) + bill.quantity;
    });
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="card-base card-elevated flex flex-col gap-5 rounded-2xl p-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-text-muted">
              Cash prep
            </p>
            <h3 className="text-lg font-semibold tracking-tight text-text-default">
              Bills required for this split
            </h3>
          </div>
          <div className="rounded-full bg-brand-sky/50 px-4 py-1 text-xs font-semibold text-brand-pine">
            {partnerPayouts.length} partners · {formatCurrency(totalAmount)}
          </div>
        </header>

        <div className="rounded-2xl border border-border/70 bg-surface-subtle/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-text-muted">
            Formula
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-default">
            <span className="rounded-full bg-brand-forest/10 px-3 py-1 font-semibold text-brand-forest">
              {formatCurrency(totalAmount)} tips
            </span>
            <span className="text-text-muted">÷</span>
            <span className="rounded-full bg-brand-sky/40 px-3 py-1 font-semibold text-brand-pine">
              {totalHours.toFixed(1)} hours
            </span>
            <span className="text-text-muted">=</span>
            <span className="rounded-full bg-brand-forest px-3 py-1 font-semibold text-brand-cream">
              {formattedHourlyRate} / hour
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(billsNeeded)
            .sort(([billA], [billB]) => parseInt(billB.slice(1)) - parseInt(billA.slice(1)))
            .map(([bill, quantity]) => (
              <span
                key={bill}
                className="rounded-full bg-brand-forest/10 px-4 py-2 text-sm font-semibold text-brand-forest"
              >
                {quantity} × {bill}
              </span>
            ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {partnerPayouts.map((partner, index) => (
          <div key={`${partner.name}-${index}`} className="animate-card-fade">
            <PartnerCard partner={partner} hourlyRate={hourlyRate} />
          </div>
        ))}
      </section>
    </div>
  );
}
