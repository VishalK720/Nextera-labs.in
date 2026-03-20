"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, CheckCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  "6 weeks · Live sessions with Vishal & Naman",
  "Personal dashboard + progress tracking",
  "AI Tutor 24/7 (powered by Claude)",
  "Build & ship a real AI product",
  "Demo Day — present to invited audience",
  "Cohort 1 Builder Certificate",
  "Lifetime access to Nextera alumni network",
  "Founder feedback on every project",
];

const comparisonRows = [
  {
    feature: "Taught by",
    nextera: "Founders who build AI products",
    other: "Random instructors reading slides",
  },
  {
    feature: "Selection",
    nextera: "Curated — 25 students max",
    other: "Anyone with a credit card",
  },
  {
    feature: "Batch size",
    nextera: "25 students",
    other: "500–5,000+",
  },
  {
    feature: "Price",
    nextera: "₹499 (Cohort 1)",
    other: "₹5,000–₹50,000+",
  },
  {
    feature: "You build",
    nextera: "A real AI product you ship",
    other: "A to-do app clone",
  },
  {
    feature: "AI Tutor",
    nextera: "24/7 personal Claude tutor",
    other: "❌ Not available",
  },
];

export default function PricingSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("FOUNDERS499");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = "FOUNDERS499";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      id="pricing"
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
            COHORT 1 PRICING — THIS NEVER COMES BACK
          </span>
          <h2 className="mt-4 font-heading font-[800] text-3xl sm:text-4xl text-text-primary max-w-3xl mx-auto">
            The most underpriced AI education on earth. Deliberately.
          </h2>
          <p className="mt-4 text-text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We priced Cohort 1 at ₹999. Then made it ₹499 with a code. Because
            we want the first 25 students to be here because they want to
            build — not because they can afford the most expensive option.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl bg-background-card border border-border overflow-hidden">
            {/* Top Badge */}
            <div className="bg-amber/10 border-b border-amber/20 px-6 py-3 text-center">
              <span className="text-xs font-mono font-semibold tracking-wider text-amber uppercase">
                COHORT 1 FOUNDING BATCH — LIMITED TO 25 STUDENTS
              </span>
            </div>

            <div className="p-8 sm:p-10">
              {/* Pricing */}
              <div className="text-center mb-8">
                <span className="text-lg text-text-muted line-through">
                  ₹999
                </span>
                <div className="mt-1">
                  <span className="text-6xl font-heading font-[800] text-amber">
                    ₹499
                  </span>
                </div>
              </div>

              {/* Coupon Area */}
              <div className="mb-8 rounded-xl bg-background-elevated border border-border p-5">
                <label className="block text-sm text-text-muted mb-2">
                  Apply coupon code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="FOUNDERS499"
                    readOnly
                    className="flex-1 rounded-lg bg-background border border-border px-4 py-2.5 text-sm font-mono text-text-primary select-all cursor-default focus:outline-none focus:ring-2 focus:ring-amber/40"
                  />
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      copied
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-amber text-background hover:bg-amber/90 border border-amber"
                    )}
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 text-sm text-success flex items-center gap-1.5">
                  🎉 Applied! You save ₹500
                </p>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-amber flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Seats Indicator */}
              <div className="flex items-center gap-2 mb-6 justify-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-sm text-text-muted font-mono">
                  17 of 25 seats claimed
                </span>
              </div>

              {/* CTA */}
              <a
                href="#apply"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber px-6 py-4 text-base font-semibold text-background hover:bg-amber/90 transition-colors"
              >
                Apply Free → Get Selected First
                <ArrowRight className="h-5 w-5" />
              </a>

              <p className="mt-3 text-sm text-text-muted text-center">
                Pay AFTER acceptance. Not now.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <h3 className="text-center font-heading font-[700] text-2xl text-text-primary mb-8">
            See the difference.
          </h3>

          <div className="rounded-2xl bg-background-card border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border bg-background-elevated">
              <span className="text-xs uppercase tracking-wider text-text-muted font-mono">
                Feature
              </span>
              <span className="text-xs uppercase tracking-wider text-amber font-mono text-center">
                Nextera Labs
              </span>
              <span className="text-xs uppercase tracking-wider text-text-muted font-mono text-center">
                Other EdTechs
              </span>
            </div>

            {/* Table Rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={cn(
                  "grid grid-cols-3 gap-4 px-6 py-4",
                  i < comparisonRows.length - 1 && "border-b border-border"
                )}
              >
                <span className="text-sm font-medium text-text-primary">
                  {row.feature}
                </span>
                <span className="text-sm text-amber text-center">
                  {row.nextera}
                </span>
                <span className="text-sm text-text-muted text-center">
                  {row.other}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Founder's Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <div className="border-l-4 border-amber bg-background-card rounded-r-xl p-6 sm:p-8">
            <p className="text-text-primary text-base sm:text-lg leading-relaxed italic">
              &ldquo;We could charge ₹15,000 for this. Buildspace charged $100
              + equity. We&apos;re charging ₹499 for Cohort 1 because we want
              word of mouth, not profit margins. After Cohort 1, the price goes
              up. That&apos;s a promise.&rdquo;
            </p>
            <p className="mt-4 text-amber font-medium text-sm">
              — Vishal Parashar, Founder
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
