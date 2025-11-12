import { formatCurrency, formatDate } from "@/utils/utils";

type ResultsSummaryCardProps = {
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
};

export default function ResultsSummaryCard({
  totalHours,
  hourlyRate,
  totalAmount,
}: ResultsSummaryCardProps) {
  const currentDate = formatDate(new Date());

  return (
    <section className="card-base card-elevated flex flex-col gap-5 rounded-2xl p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-text-muted">
            Summary
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-text-default">
            Distribution snapshot
          </h3>
        </div>
        <span className="rounded-full bg-brand-forest/10 px-3 py-1 text-xs font-medium text-brand-forest">
          {currentDate}
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryMetric label="Total hours" value={totalHours.toFixed(1)} />
        <SummaryMetric
          label="Hourly rate"
          value={hourlyRate ? `$${hourlyRate.toFixed(2)}` : "—"}
        />
        <SummaryMetric label="Total distributed" value={formatCurrency(totalAmount)} />
      </div>

      <div className="rounded-2xl border border-border/80 bg-surface-subtle/70 p-4 text-sm text-text-muted">
        Tip Steward keeps your partners aligned with consistent, transparent math.
        Share this summary during pre-close or attach it to the partner log for
        accountability.
      </div>
    </section>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
