import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Coffee,
  UsersRound,
  LayoutDashboard,
  SunMedium,
  Moon,
  ShieldCheck,
} from "lucide-react";
import { PropsWithChildren, useMemo } from "react";
import clsx from "clsx";
import { useAppTheme } from "@/components/providers/AppThemeProvider";

const NAVIGATION = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "My Store",
    icon: Coffee,
    path: "/store",
  },
  {
    label: "Team",
    icon: UsersRound,
    path: "/team",
  },
] as const;

export function AppLayout({ children }: PropsWithChildren) {
  const [location] = useLocation();
  const { theme, setTheme } = useAppTheme();

  const activeIndex = useMemo(() => {
    const normalized = location === "/" ? "/" : location.replace(/\/$/, "");
    return NAVIGATION.findIndex((item) => {
      if (item.path === "/") {
        return normalized === "/";
      }
      return normalized.startsWith(item.path);
    });
  }, [location]);

  const isDark = theme === "partner-dark";

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-text-default">
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 pb-2 pt-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="glass-panel flex h-12 w-12 items-center justify-center border border-white/30 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-brand-forest" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-text-muted">
              Starbucks Partner Tools
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-text-default">
              Tip Steward
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "partner-light" : "partner-dark")}
          className="glass-panel flex h-11 w-11 items-center justify-center transition-all hover:scale-[1.02]"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunMedium className="h-5 w-5 text-brand-cream" />
          ) : (
            <Moon className="h-5 w-5 text-brand-pine" />
          )}
        </button>
      </header>

      <main className="flex-1 px-5 pb-32 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-4xl flex-col gap-6"
        >
          {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-4 left-1/2 z-30 w-[min(420px,90%)] -translate-x-1/2 rounded-full bg-surface/95 p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <div className="relative grid grid-cols-3 gap-1">
          {NAVIGATION.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex || (index === 0 && activeIndex === -1);

            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={clsx(
                    "relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-medium transition-all",
                    isActive
                      ? "text-text-on-dark"
                      : "text-text-muted hover:text-text-default",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-brand-forest"
                      transition={{ type: "spring", stiffness: 420, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="hidden text-xs font-semibold sm:inline">
                      {item.label}
                    </span>
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
