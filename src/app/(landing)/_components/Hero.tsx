"use client";

import { motion } from "framer-motion";
import { Users, Phone, CalendarDays, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

/* ---------- animation variants ---------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const containerVariantsLine2 = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.55 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.7 + i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const cardFadeIn = {
  hidden: { opacity: 0, scale: 0.92, x: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { delay: 0.6, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

/* ---------- data ---------- */

const SOCIAL_PROOF = [
  { icon: Users, label: "25 seats" },
  { icon: Phone, label: "Free Selection Call" },
  { icon: CalendarDays, label: "6 weeks" },
  { icon: Rocket, label: "Ship real AI" },
] as const;

/* ---------- component ---------- */

export default function Hero() {
  const line1Words = ["Don't", "just", "learn", "AI."];
  const line2Words = ["Build", "it."];

  function smoothScrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative min-h-[calc(100vh-60px)] flex items-center overflow-hidden">
      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 85% 15%, rgba(245,166,35,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 70% 10%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8 px-4 md:px-6 py-16 lg:py-0">
        {/* ---- Left column ---- */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background-card/60 px-4 py-1.5 text-sm text-text-muted backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Cohort 1&nbsp;&middot;&nbsp;25 seats&nbsp;&middot;&nbsp;Applications
              Open
            </span>
          </motion.div>

          {/* Headline */}
          <div>
            {/* Line 1: "Don't just learn AI." */}
            <motion.h1
              className="flex flex-wrap gap-x-3 md:gap-x-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              aria-label="Don't just learn AI. Build it."
            >
              {line1Words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="text-5xl md:text-6xl lg:text-7xl font-heading font-[800] text-text-primary leading-[1.1]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Line 2: "Build it." — slightly larger, amber */}
            <motion.span
              className="flex flex-wrap gap-x-3 md:gap-x-4 mt-1"
              variants={containerVariantsLine2}
              initial="hidden"
              animate="visible"
              aria-hidden="true"
            >
              {line2Words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="text-5xl md:text-7xl lg:text-8xl font-heading font-[800] text-amber leading-[1.1]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </div>

          {/* Subtext */}
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-lg text-text-muted leading-relaxed"
          >
            India&rsquo;s first peer-led AI cohort. Selected over a FREE Google
            Meet. Led by two 21-year-olds who lived this problem.
          </motion.p>

          {/* CTA row */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            <Button
              variant="amber"
              size="lg"
              onClick={() => smoothScrollTo("apply")}
            >
              Apply Free&nbsp;&rarr;&nbsp;Get Selected
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => smoothScrollTo("demo")}
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Social proof pills */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 pt-2"
          >
            {SOCIAL_PROOF.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-card/40 px-3 py-1.5 text-xs text-text-muted backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-amber/70" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ---- Right column (floating dashboard mockup) ---- */}
        <div className="hidden lg:flex w-full lg:w-[40%] justify-center">
          <motion.div
            variants={cardFadeIn}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-[340px] rounded-2xl border border-border bg-background-card p-6 shadow-2xl">
                {/* Student header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo/20 text-indigo font-heading font-[800] text-sm select-none">
                    AM
                  </div>
                  <div>
                    <p className="font-heading font-[700] text-text-primary text-sm leading-tight">
                      Arjun Mehta
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-2 py-0.5 text-[11px] font-medium text-amber mt-0.5">
                      Week 4&nbsp;&middot;&nbsp;Builder
                    </span>
                  </div>
                </div>

                {/* Progress rows */}
                <div className="space-y-4">
                  <ProgressRow label="Week 3" value={100} color="success" />
                  <ProgressRow label="Week 4" value={65} color="amber" />
                  <ProgressRow
                    label="Projects"
                    value={40}
                    color="indigo"
                    valueLabel="2"
                  />
                </div>

                {/* Streak badge */}
                <div className="mt-5 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 border border-amber/20 px-4 py-1.5 text-sm font-medium text-amber">
                    7-day streak 🔥
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- sub-component ---------- */

function ProgressRow({
  label,
  value,
  color,
  valueLabel,
}: {
  label: string;
  value: number;
  color: "amber" | "indigo" | "success";
  valueLabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-text-muted">{label}</span>
        <span className="text-xs font-medium text-text-primary">
          {valueLabel ?? `${value}%`}
        </span>
      </div>
      <ProgressBar value={value} size="sm" color={color} />
    </div>
  );
}
