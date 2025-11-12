import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/utils/utils";
import { BadgeCheck } from "lucide-react";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

const billColors: Record<number, string> = {
  20: "bg-brand-forest/10 text-brand-forest",
  10: "bg-brand-sky/60 text-brand-pine",
  5: "bg-brand-latte/60 text-brand-pine",
  1: "bg-brand-cream/80 text-brand-pine",
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {
  const calculated = partner.hours * hourlyRate;

  return (
    <article className="card-base card-elevated flex flex-col gap-4 rounded-2xl p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-forest/12 text-brand-forest">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-text-default">
              {partner.name}
            </h4>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              {partner.hours} hours
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-brand-forest px-3 py-2 text-right text-brand-cream">
          <span className="block text-[10px] uppercase tracking-[0.35em] opacity-70">
            Payout
          </span>
          <span className="text-lg font-semibold">{formatCurrency(partner.rounded)}</span>
        </div>
      </header>

      <section className="rounded-2xl border border-border/70 bg-surface-subtle/80 p-4 text-sm text-text-muted">
        <p className="flex flex-wrap items-baseline gap-1">
          <span className="font-semibold text-text-default">{partner.hours}</span>
          <span>hours ×</span>
          <span className="font-semibold text-text-default">
            {formatCurrency(Math.floor(hourlyRate * 100) / 100)}
          </span>
          <span>= {formatCurrency(calculated)}</span>
          <span className="rounded-full bg-brand-forest/10 px-2 py-0.5 text-xs font-semibold text-brand-forest">
            rounded to {formatCurrency(partner.rounded)}
          </span>
        </p>
      </section>

      <footer className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
          Bill breakdown
        </span>
        <div className="flex flex-wrap gap-2">
          {[...partner.billBreakdown]
            .sort((a, b) => b.denomination - a.denomination)
            .map((bill, index) => (
              <span
                key={`${partner.name}-${bill.denomination}-${index}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  billColors[bill.denomination] ?? "bg-brand-sky/40 text-brand-pine"
                }`}
              >
                {bill.quantity} × ${bill.denomination}
              </span>
            ))}
        </div>
      </footer>
    </article>
  );
}
