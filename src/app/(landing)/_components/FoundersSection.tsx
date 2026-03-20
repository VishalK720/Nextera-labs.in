"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const founders = [
  {
    initials: "VP",
    name: "Vishal Parashar",
    title: "Founder · 21 · B.Tech CSE AI/ML",
    tags: ["Builder", "Product Thinker", "Curriculum Designer"],
    bio: "21. Built his first AI project at 19. Dropped out of the 'learn, don't build' cycle. Now building the cohort he wished existed in Class 12. Vishal designs every week of curriculum, leads every live session, and personally reviews every student's project.",
    accent: "amber" as const,
  },
  {
    initials: "NS",
    name: "Naman Sehwag",
    title: "Co-Founder",
    tags: ["Engineer", "Platform Builder", "Community"],
    bio: "The reason the platform works. Naman builds the dashboard, the AI tutor, the infrastructure. If Vishal is the face, Naman is the engine. Together, they're building something no EdTech in India has attempted.",
    accent: "indigo" as const,
  },
];

const accentMap = {
  amber: {
    border: "border-amber/20",
    bg: "bg-amber",
    text: "text-amber",
    badge: "bg-amber/10 text-amber border-amber/20",
  },
  indigo: {
    border: "border-indigo/20",
    bg: "bg-indigo",
    text: "text-indigo",
    badge: "bg-indigo/10 text-indigo border-indigo/20",
  },
};

export default function FoundersSection() {
  return (
    <section
      id="founders"
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
            YOUR MENTORS
          </span>
          <h2 className="mt-4 font-heading font-[800] text-4xl text-text-primary">
            Built by two people who lived this problem.
          </h2>
        </motion.div>

        {/* Founder Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {founders.map((founder, i) => {
            const colors = accentMap[founder.accent];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={cn(
                  "rounded-2xl bg-background-card border p-8",
                  colors.border
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full mb-5",
                    colors.bg
                  )}
                >
                  <span className="text-xl font-heading font-[800] text-background">
                    {founder.initials}
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="font-heading font-[700] text-xl text-text-primary">
                  {founder.name}
                </h3>
                <p className={cn("text-sm mt-1", colors.text)}>
                  {founder.title}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {founder.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono",
                        colors.badge
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="mt-5 text-sm text-text-muted leading-relaxed">
                  {founder.bio}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
