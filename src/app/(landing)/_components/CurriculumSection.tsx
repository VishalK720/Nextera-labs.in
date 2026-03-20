"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKS = [
  {
    week: 1,
    title: "First Principles of AI",
    description:
      "What is an LLM, tokens, context windows, attention, prompt engineering.",
    build:
      "Your first chatbot using Claude API.",
    tags: ["Python", "LLMs", "Prompt Engineering", "Claude API"],
  },
  {
    week: 2,
    title: "APIs & First Tool",
    description:
      "REST APIs, HTTP, JSON, Claude API integration, Streamlit, deployment.",
    build:
      "A live tool deployed publicly.",
    tags: ["REST APIs", "JSON", "Streamlit", "Deployment"],
  },
  {
    week: 3,
    title: "Problem Decomposition",
    description:
      "Breaking complex problems, debugging methodology, systems thinking.",
    build:
      "Solve 3 real-world problems.",
    tags: ["Systems Thinking", "Debugging", "Problem Solving"],
  },
  {
    week: 4,
    title: "Capstone Design",
    description:
      "Product thinking, user research, MVP scoping, architecture.",
    build:
      "Your capstone plan, approved by founders.",
    tags: ["Product Thinking", "MVP", "Architecture", "User Research"],
  },
  {
    week: 5,
    title: "Build Sprint",
    description:
      "Daily standups, unblocking yourself, rapid iteration.",
    build:
      "80% of your capstone product.",
    tags: ["Agile", "Iteration", "Standups", "Shipping"],
  },
  {
    week: 6,
    title: "Demo Day",
    description:
      "Presenting technical work, production deployment, demo videos.",
    build:
      "Final capstone at Demo Day.",
    tags: ["Presentation", "Production", "Demo Video", "Portfolio"],
  },
] as const;

function AccordionItem({
  week,
  title,
  description,
  build,
  tags,
  index,
}: {
  week: number;
  title: string;
  description: string;
  build: string;
  tags: readonly string[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Accordion.Item
        value={`week-${week}`}
        className="group border border-border rounded-2xl bg-background-card overflow-hidden transition-colors hover:border-amber/20"
      >
        <Accordion.Trigger className="flex w-full items-center gap-4 px-5 py-5 md:px-6 md:py-6 text-left cursor-pointer">
          <span className="shrink-0 inline-flex items-center justify-center rounded-lg bg-amber/10 text-amber text-xs font-mono font-semibold tracking-wider uppercase px-3 py-1.5">
            Week {week}
          </span>
          <span className="flex-1 font-heading text-base md:text-lg font-semibold text-text-primary">
            {title}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-text-muted transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>

        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 space-y-4">
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              {description}
            </p>

            {/* Build callout */}
            <div className="border-l-2 border-amber pl-4 bg-amber/5 rounded-r-lg p-4">
              <p className="text-sm font-semibold text-amber mb-1">
                {week === 6 ? "You\u2019ll ship:" : "You\u2019ll build:"}
              </p>
              <p className="text-sm text-text-primary">{build}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-indigo/10 text-indigo px-3 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </motion.div>
  );
}

export default function CurriculumSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section
      id="curriculum"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.06),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-widest text-amber font-mono mb-4">
            The Curriculum
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            6 weeks. Zero fluff. All building.
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            Every week is designed to move you from concept to shipped product.
          </p>
        </motion.div>

        {/* Accordion */}
        <Accordion.Root type="single" collapsible className="space-y-3">
          {WEEKS.map((w, i) => (
            <AccordionItem
              key={w.week}
              week={w.week}
              title={w.title}
              description={w.description}
              build={w.build}
              tags={w.tags}
              index={i}
            />
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
