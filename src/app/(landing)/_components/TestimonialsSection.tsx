"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "I've never learned this much in 6 weeks. The AI tutor alone is worth 10x the price.",
    name: "Priya S.",
    detail: "Class 12, Mumbai",
  },
  {
    quote:
      "Vishal and Naman actually care. They reviewed my project at 11pm on a Sunday.",
    name: "Arjun M.",
    detail: "Class 11, Delhi",
  },
  {
    quote:
      "I shipped my first real AI product. My friends are still doing tutorial hell.",
    name: "Sneha K.",
    detail: "Class 12, Bangalore",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
            WHAT BUILDERS SAY
          </span>
          <h2 className="mt-4 font-heading font-[800] text-4xl text-text-primary">
            Don&apos;t take our word for it.
          </h2>
          <p className="mt-3 text-sm text-text-muted font-mono">
            Placeholder testimonials — Cohort 1 hasn&apos;t launched yet.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={cn(
                "rounded-2xl bg-background-card border border-border p-6",
                "flex flex-col justify-between"
              )}
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-amber text-amber"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-primary text-base leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t.name}
                </p>
                <p className="text-xs text-text-muted">{t.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
