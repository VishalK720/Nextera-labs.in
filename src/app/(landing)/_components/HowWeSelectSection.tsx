"use client";

import { motion } from "framer-motion";
import { FileText, Video, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: FileText,
    title: "Apply in 3 minutes",
    description:
      "Fill out a short application — no essays, no résumés. We want to know what excites you about AI, not your marks.",
    tag: "FREE",
    tagStyle: "bg-success/10 text-success border-success/20",
  },
  {
    icon: Video,
    title: "Join a free selection call",
    description:
      "A 20-minute Google Meet with our team. We assess curiosity, not credentials. No prep needed — just show up as yourself.",
    tag: "20-minute call · FREE",
    tagStyle: "bg-success/10 text-success border-success/20",
    showMeet: true,
  },
  {
    icon: Mail,
    title: "We decide in 48 hours",
    description:
      "You'll receive a personalised decision within 48 hours — with feedback, whether you're selected or not.",
    tag: "48-hour response",
    tagStyle: "bg-amber/10 text-amber border-amber/20",
  },
  {
    icon: Lock,
    title: "Pay only after acceptance",
    description:
      "No upfront fees. No hidden charges. You pay ₹499 only after you've been accepted into the cohort.",
    tag: "Pay after acceptance only",
    tagStyle: "bg-indigo/10 text-indigo border-indigo/20",
  },
];

export default function HowWeSelectSection() {
  return (
    <section
      id="how-we-select"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-amber font-mono">
            HOW WE SELECT
          </span>
          <h2 className="mt-4 font-heading font-[800] text-4xl text-text-primary">
            A selection process that actually respects you.
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — center on desktop, left on mobile */}
          <div
            className={cn(
              "absolute top-0 bottom-0 w-px bg-border",
              "left-6 lg:left-1/2 lg:-translate-x-px"
            )}
          />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={cn(
                    "relative flex items-start gap-6",
                    "pl-16 lg:pl-0",
                    "lg:grid lg:grid-cols-2 lg:gap-10"
                  )}
                >
                  {/* Dot on the line */}
                  <div
                    className={cn(
                      "absolute z-10 flex h-12 w-12 items-center justify-center rounded-full",
                      "bg-background-card border-2 border-amber",
                      "left-0 lg:left-1/2 lg:-translate-x-1/2"
                    )}
                  >
                    <Icon className="h-5 w-5 text-amber" />
                  </div>

                  {/* Card — alternating sides on desktop */}
                  <div
                    className={cn(
                      "lg:col-span-1",
                      isLeft
                        ? "lg:col-start-1 lg:text-right lg:pr-16"
                        : "lg:col-start-2 lg:pl-16"
                    )}
                  >
                    <div className="rounded-2xl bg-background-card border border-border p-6">
                      <div
                        className={cn(
                          "flex items-center gap-3 mb-3",
                          isLeft ? "lg:justify-end" : ""
                        )}
                      >
                        <h3 className="font-heading font-[700] text-lg text-text-primary">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-sm text-text-muted leading-relaxed mb-4">
                        {step.description}
                      </p>

                      <div
                        className={cn(
                          "flex items-center gap-2 flex-wrap",
                          isLeft ? "lg:justify-end" : ""
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono",
                            step.tagStyle
                          )}
                        >
                          {step.tag}
                        </span>

                        {step.showMeet && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-background-elevated border border-border px-3 py-1 text-xs text-text-muted">
                            <Video className="h-3 w-3" />
                            Google Meet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Empty column for alternating layout */}
                  {isLeft && <div className="hidden lg:block" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 rounded-2xl border border-border p-8 sm:p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(99,102,241,0.06) 100%)",
          }}
        >
          <h3 className="font-heading font-[700] text-2xl text-text-primary mb-2">
            Ready to apply?
          </h3>
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
            It takes 3 minutes. No fees until you&apos;re accepted.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-medium text-background hover:bg-amber-hover transition-colors"
          >
            Apply Free — Book Your Meet
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
