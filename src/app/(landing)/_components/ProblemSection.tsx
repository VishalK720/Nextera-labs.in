"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stats = [
  {
    number: "37%",
    description: "of coaching money is wasted on outdated curricula",
    source: "Source: NSSO Education Survey, 2023",
  },
  {
    number: "49%",
    description:
      "of Indian parents fear AI will replace their child's career",
    source: "Source: TeamLease EdTech Report, 2024",
  },
  {
    number: "0",
    description: "EdTechs are teaching students to actually BUILD AI products",
    source: "We checked. Seriously.",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="program"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-amber font-mono">
            THE PROBLEM
          </span>
          <h2 className="mt-4 font-heading font-[800] text-4xl text-text-primary">
            The system is broken. We&apos;re fixing it.
          </h2>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={cn(
                "rounded-2xl bg-background-card border border-border p-8",
                "flex flex-col items-start"
              )}
            >
              <span className="text-5xl font-heading font-[800] text-amber leading-none">
                {stat.number}
              </span>

              <p className="mt-4 text-base text-text-primary leading-relaxed">
                {stat.description}
              </p>

              <span className="mt-auto pt-6 text-xs text-text-muted font-mono">
                {stat.source}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
