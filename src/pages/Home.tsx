import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, UsersRound, DollarSign, Calculator } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import { useTipContext } from "@/context/TipContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/utils/queryClient";
import { calculateHourlyRate, formatCurrency } from "@/utils/utils";

export default function Home() {
  const [tipAmount, setTipAmount] = useState<number | "">("");
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const { partnerHours, distributionData, setDistributionData } = useTipContext();

  const totalHours = useMemo(
    () => partnerHours.reduce((sum, partner) => sum + partner.hours, 0),
    [partnerHours],
  );

  const partnersSynced = partnerHours.length;
  const hourlyRate = distributionData?.hourlyRate ?? 0;

  const handleCalculate = async () => {
    if (!partnerHours.length) {
      toast({
        title: "Upload partner hours",
        description: "Drop in your report first so we can split tips accurately.",
        variant: "destructive",
      });
      return;
    }

    if (tipAmount === "") {
      toast({
        title: "Enter total tips",
        description: "Add the weekly total so we can calculate the split.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    try {
      const computedHourlyRate = calculateHourlyRate(
        Number(tipAmount),
        totalHours,
      );

      const res = await apiRequest("POST", "/api/distributions/calculate", {
        partnerHours,
        totalAmount: Number(tipAmount),
        totalHours,
        hourlyRate: computedHourlyRate,
      });

      const calculatedData = await res.json();
      setDistributionData(calculatedData);

      toast({
        title: "Distribution ready",
        description: "Review partner payouts before your end-of-shift huddle.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "We hit a snag",
        description: "Something went wrong while calculating. Try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel relative overflow-hidden px-6 py-7"
      >
        <span className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-brand-forest/10 blur-3xl" />
        <span className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-sky/20 blur-3xl" />
        <div className="relative flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.38em] text-text-muted">
              Weekly ritual
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-text-default">
              Reconcile tips with partner clarity
            </h2>
            <p className="max-w-xl text-sm text-text-muted">
              Tip Steward mirrors the calm, intentional flow of the Starbucks mobile app.
              Upload a shift report, confirm hours, and deliver equitable payouts in minutes.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-4">
            <HeroStat
              icon={<UsersRound className="h-4 w-4" />}
              label="Partners synced"
              value={partnersSynced.toString().padStart(2, "0")}
            />
            <HeroStat
              icon={<Clock className="h-4 w-4" />}
              label="Total hours"
              value={totalHours.toFixed(1).replace(/\.0$/, "")}
            />
            <HeroStat
              icon={<DollarSign className="h-4 w-4" />}
              label="Tip pool"
              value={
                tipAmount
                  ? formatCurrency(Number(tipAmount))
                  : distributionData
                    ? formatCurrency(distributionData.totalAmount)
                    : "$0"
              }
            />
            <HeroStat
              icon={<Sparkles className="h-4 w-4" />}
              label="Hourly rate"
              value={hourlyRate ? `$${hourlyRate.toFixed(2)}` : "—"}
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <div className="card-base card-elevated flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="section-title">Tip distribution</h3>
              <p className="text-xs text-text-muted">
                Upload the weekly labor report or enter hours manually.
              </p>
            </div>
            <span className="hidden rounded-full bg-brand-sky/50 px-3 py-1 text-xs font-medium text-brand-pine lg:inline-flex">
              OCR powered
            </span>
          </div>

          <FileDropzone />

          <div className="space-y-3">
            <label htmlFor="tipAmount" className="section-title text-sm">
              Total tip amount
            </label>
            <div className="relative rounded-2xl border border-border bg-surface-subtle/80 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest">
                  <Calculator className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <input
                    id="tipAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tipAmount}
                    onChange={(event) =>
                      setTipAmount(
                        event.target.value ? Number(event.target.value) : "",
                      )
                    }
                    className="w-full bg-transparent text-lg font-semibold tracking-tight text-text-default outline-none placeholder:text-text-muted"
                    placeholder="Enter weekly total"
                    inputMode="decimal"
                  />
                  <p className="text-xs text-text-muted">
                    Include card tips and cash to reflect the full partner experience.
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="brand-button w-full"
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating…" : "Calculate distribution"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card-base p-6">
            <h3 className="section-title">Best practices</h3>
            <ul className="mt-3 space-y-3 text-sm text-text-muted">
              <li>Verify partner names exactly as they appear on the schedule.</li>
              <li>Run the distribution before the weekly coffee tasting to celebrate wins.</li>
              <li>Use the Team tab to log service stories once it launches.</li>
            </ul>
          </div>
          {distributionData && (
            <ResultsSummaryCard
              totalAmount={distributionData.totalAmount}
              totalHours={distributionData.totalHours}
              hourlyRate={distributionData.hourlyRate}
            />
          )}
        </div>
      </motion.section>

      {distributionData && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <PartnerPayoutsList distributionData={distributionData} />
        </motion.section>
      )}
    </div>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card-base flex flex-col gap-1 rounded-2xl border border-border/60 bg-surface-subtle/80 p-4">
      <div className="flex items-center gap-2 text-text-muted">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.28em]">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-text-default">
        {value}
      </p>
    </div>
  );
}
