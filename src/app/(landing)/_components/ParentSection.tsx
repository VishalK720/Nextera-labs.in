"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, PhoneCall, UsersRound, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TRUST_SIGNALS = [
  {
    Icon: PhoneCall,
    title: "Personal selection call",
    description:
      "We meet every student on Google Meet. You\u2019re welcome to join.",
  },
  {
    Icon: UsersRound,
    title: "Only 25 students",
    description:
      "Small batch = personal attention. Not a 500-student lecture.",
  },
  {
    Icon: Sparkles,
    title: "\u20B9499 for Cohort 1",
    description:
      "Less than a month of tuition. More than a year of value.",
  },
] as const;

const FAQS = [
  {
    q: "Will this affect my child\u2019s board exam preparation?",
    a: "Nextera requires 8\u201310 hours per week, mostly on weekends and evenings. Many students find it improves their focus and study habits.",
  },
  {
    q: "Is this safe? Who are the founders?",
    a: "Vishal Parashar (21, B.Tech CSE AI/ML) and Naman Sehwag run every session personally. All sessions are recorded and available.",
  },
  {
    q: "What if my child can\u2019t code?",
    a: "No coding experience needed. We teach from absolute scratch. The only requirement is curiosity.",
  },
  {
    q: "Can I attend the selection call?",
    a: "Absolutely. Parents are welcome to join the Google Meet selection call.",
  },
  {
    q: "What happens after 6 weeks?",
    a: "Students keep dashboard access, join the alumni network, and can apply to future advanced cohorts.",
  },
  {
    q: "Is there a refund policy?",
    a: "If your child hasn\u2019t attended any sessions within the first week, we offer a full refund. No questions asked.",
  },
] as const;

function TrustCard({
  Icon,
  title,
  description,
  index,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
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

function FAQAccordion() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Accordion.Root type="single" collapsible className="space-y-3">
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.1 + i * 0.07,
              ease: "easeOut",
            }}
          >
            <Accordion.Item
              value={`faq-${i}`}
              className="group border border-border rounded-2xl bg-background-card overflow-hidden transition-colors hover:border-amber/20"
            >
              <Accordion.Trigger className="flex w-full items-center gap-3 px-5 py-4 md:px-6 text-left cursor-pointer">
                <span className="flex-1 font-heading text-sm md:text-base font-medium text-text-primary leading-snug">
                  {faq.q}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>

              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
                  <p className="text-text-muted text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </motion.div>
        ))}
      </Accordion.Root>
    </motion.div>
  );
}

export default function ParentSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="parents" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.05),transparent)]" />

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
            For Parents
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            We get it. You have questions.
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            Here&rsquo;s everything you need to know before your child joins.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Trust signals */}
          <div className="space-y-4">
            {TRUST_SIGNALS.map((s, i) => (
              <TrustCard
                key={s.title}
                Icon={s.Icon}
                title={s.title}
                description={s.description}
                index={i}
              />
            ))}
          </div>

          {/* Right: FAQ accordion */}
          <FAQAccordion />
        </div>
      </div>
    </section>
  );
}
