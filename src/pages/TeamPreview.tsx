import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { UsersRound, Sparkles, MessageCircle } from "lucide-react";

export default function TeamPreview() {
  return (
    <div className="flex flex-col gap-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="card-base card-elevated overflow-hidden"
      >
        <div className="bg-brand-sky/90 px-6 py-8 text-brand-pine">
          <p className="text-xs uppercase tracking-[0.38em] text-brand-pine/60">
            Concept preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Team Rituals
          </h2>
          <p className="mt-3 text-sm text-brand-pine/70">
            Collaborative features to celebrate wins, nudge data hygiene, and keep
            partners aligned around weekly tip goals.
          </p>
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <PreviewCard
            icon={<UsersRound className="h-5 w-5" />}
            title="Partner Spotlights"
            description="Automatically recognize partners who deliver standout guest moments."
          />
          <PreviewCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Service Stories"
            description="Capture quick reflections from the floor and watch morale trends."
          />
          <PreviewCard
            icon={<MessageCircle className="h-5 w-5" />}
            title="Shift Check-ins"
            description="Pulse surveys keep tip splits grounded in partner sentiment."
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
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-forest/15 text-brand-forest">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-default">{title}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  );
}
