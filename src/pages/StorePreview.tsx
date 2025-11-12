import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ClipboardList, MapPin, CalendarDays } from "lucide-react";

export default function StorePreview() {
  return (
    <div className="flex flex-col gap-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="card-base card-elevated overflow-hidden"
      >
        <div className="bg-brand-forest/90 px-6 py-8 text-brand-cream">
          <p className="text-xs uppercase tracking-[0.38em] text-brand-cream/80">
            Coming soon
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Store Insights
          </h2>
          <p className="mt-3 text-sm text-brand-cream/80">
            This section will surface store-level insights including partner mix,
            weekly tip velocity, and schedule-aware forecasts.
          </p>
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <PreviewCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Weekly Playbook"
            description="Standardize tip handling rituals and share store best practices."
          />
          <PreviewCard
            icon={<MapPin className="h-5 w-5" />}
            title="Community Pulse"
            description="Track neighborhood events that impact your tip totals."
          />
          <PreviewCard
            icon={<CalendarDays className="h-5 w-5" />}
            title="Shift Planning"
            description="Bring schedules and tip projections together for equitable splits."
          />
        </div>
      </motion.section>
    </div>
  );
}

function PreviewCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-base flex h-full flex-col gap-3 rounded-2xl border-dashed border-border/60 bg-surface-subtle/70 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sky/60 text-brand-pine">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-default">{title}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  );
}
