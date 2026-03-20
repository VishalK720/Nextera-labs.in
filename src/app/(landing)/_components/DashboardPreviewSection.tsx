"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, TrendingUp, Rocket, Trophy, Video, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "AI Tutor 24/7",
    description:
      "Powered by Claude. Knows your curriculum, your week, your project. Ask anything.",
    Icon: Bot,
  },
  {
    title: "Progress Tracking",
    description:
      "See every lesson, every week, every milestone. Your journey, visualized.",
    Icon: TrendingUp,
  },
  {
    title: "Project Showcase",
    description:
      "Ship real projects. Get founder feedback. Feature on the landing page.",
    Icon: Rocket,
  },
  {
    title: "Leaderboard",
    description:
      "Compete with your cohort. Earn points. Climb the ranks.",
    Icon: Trophy,
  },
  {
    title: "Live Sessions",
    description:
      "Weekly Google Meet sessions with Vishal & Naman.",
    Icon: Video,
  },
  {
    title: "Cohort Community",
    description:
      "25 builders. One WhatsApp group. Lifetime network.",
    Icon: Users,
  },
] as const;

function FeatureCard({
  title,
  description,
  Icon,
  index,
}: {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="bg-background-card border border-border rounded-2xl p-6 transition-colors hover:border-amber/20"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 mb-4">
        <Icon className="h-5 w-5 text-amber" />
      </div>
      <h3 className="font-heading text-base font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ---------- Dashboard mockup ---------- */
function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const sidebarItems = [
    { label: "Dashboard", active: true },
    { label: "Lessons", active: false },
    { label: "Projects", active: false },
    { label: "Leaderboard", active: false },
    { label: "AI Tutor", active: false },
    { label: "Settings", active: false },
  ];

  const stats = [
    { label: "Week", value: "3 / 6" },
    { label: "XP Earned", value: "1,240" },
    { label: "Rank", value: "#4" },
    { label: "Projects", value: "2" },
  ];

  const progressBars = [
    { label: "Week 1 — First Principles of AI", pct: 100 },
    { label: "Week 2 — APIs & First Tool", pct: 100 },
    { label: "Week 3 — Problem Decomposition", pct: 45 },
    { label: "Week 4 — Capstone Design", pct: 0 },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mt-14 md:mt-16"
    >
      {/* Amber glow */}
      <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-amber/[0.04] blur-2xl" />
      <div className="pointer-events-none absolute -inset-px rounded-2xl shadow-[0_0_60px_rgba(245,166,35,0.08)]" />

      {/* Mock frame */}
      <div className="relative rounded-2xl border border-border bg-background-card overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background-elevated/60">
          <span className="h-3 w-3 rounded-full bg-[#EF4444]/60" />
          <span className="h-3 w-3 rounded-full bg-amber/50" />
          <span className="h-3 w-3 rounded-full bg-[#10B981]/50" />
          <span className="ml-3 text-xs text-text-muted font-mono">
            dashboard.nexteralabs.in
          </span>
        </div>

        <div className="flex min-h-[340px] md:min-h-[380px]">
          {/* Sidebar */}
          <div className="hidden sm:flex flex-col w-48 border-r border-border bg-background/60 py-4 px-3 gap-1">
            {/* Logo area */}
            <div className="flex items-center gap-2 px-2 mb-4">
              <div className="h-6 w-6 rounded bg-amber flex items-center justify-center">
                <span className="text-[10px] font-bold text-black font-heading">
                  N
                </span>
              </div>
              <span className="text-xs font-heading font-semibold text-text-primary">
                Nextera Labs
              </span>
            </div>
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs",
                  item.active
                    ? "bg-amber/10 text-amber font-medium"
                    : "text-text-muted"
                )}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 md:p-6 space-y-6 overflow-hidden">
            {/* Greeting */}
            <div>
              <h4 className="font-heading text-base md:text-lg font-semibold text-text-primary">
                Welcome back, Arjun
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Cohort 1 &middot; Week 3 in progress
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-background/40 px-3 py-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
                    {s.label}
                  </p>
                  <p className="text-lg font-heading font-bold text-text-primary mt-1">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-text-muted font-mono">
                Progress
              </p>
              {progressBars.map((bar) => (
                <div key={bar.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-primary truncate mr-3">
                      {bar.label}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono shrink-0">
                      {bar.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        bar.pct === 100
                          ? "bg-success"
                          : bar.pct > 0
                          ? "bg-amber"
                          : "bg-transparent"
                      )}
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPreviewSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(245,166,35,0.05),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-widest text-amber font-mono mb-4">
            The Platform
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Your personal AI-powered dashboard.
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            Not a generic LMS. A builder&rsquo;s cockpit.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              description={f.description}
              Icon={f.Icon}
              index={i}
            />
          ))}
        </div>

        {/* Dashboard mockup */}
        <DashboardMockup />
      </div>
    </section>
  );
}
