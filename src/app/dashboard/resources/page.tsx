"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Video,
  FileText,
  Code2,
  ExternalLink,
  Download,
  Search,
  BookOpen,
  Wrench,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Category = "all" | "videos" | "docs" | "tools" | "templates";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  week?: number;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categoryConfig: Record<Exclude<Category, "all">, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  videos: { label: "Videos", color: "text-amber", icon: Video },
  docs: { label: "Docs", color: "text-indigo", icon: FileText },
  tools: { label: "Tools", color: "text-success", icon: Wrench },
  templates: { label: "Templates", color: "text-amber", icon: Code2 },
};

const resources: Resource[] = [
  {
    id: "1",
    title: "Claude API Documentation",
    description: "Official docs for the Claude API — authentication, endpoints, streaming, and best practices.",
    category: "docs",
    url: "#",
    icon: BookOpen,
  },
  {
    id: "2",
    title: "Prompt Engineering Guide",
    description: "A comprehensive guide to writing effective prompts for LLMs with examples and patterns.",
    category: "docs",
    week: 1,
    url: "#",
    icon: FileText,
  },
  {
    id: "3",
    title: "Week 1: AI Foundations (Recording)",
    description: "Live session recording covering the history of AI, current landscape, and what's coming next.",
    category: "videos",
    week: 1,
    url: "#",
    icon: Video,
  },
  {
    id: "4",
    title: "Week 2: Python & APIs (Recording)",
    description: "Live session recording on working with Python, REST APIs, and the Claude SDK.",
    category: "videos",
    week: 2,
    url: "#",
    icon: Video,
  },
  {
    id: "5",
    title: "Week 3: Product Teardown (Recording)",
    description: "Live analysis of successful AI products — what makes them work and lessons for builders.",
    category: "videos",
    week: 3,
    url: "#",
    icon: Video,
  },
  {
    id: "6",
    title: "Next.js Starter Template",
    description: "A pre-configured Next.js + Tailwind + TypeScript template with dark mode and auth setup.",
    category: "templates",
    url: "#",
    icon: Code2,
  },
  {
    id: "7",
    title: "Streamlit AI App Template",
    description: "A ready-to-deploy Streamlit template with Claude API integration and session management.",
    category: "templates",
    url: "#",
    icon: Code2,
  },
  {
    id: "8",
    title: "VS Code Setup Guide",
    description: "Recommended extensions, settings, and shortcuts for productive development.",
    category: "tools",
    url: "#",
    icon: Wrench,
  },
  {
    id: "9",
    title: "Figma Design System",
    description: "UI components and design tokens used in Nextera projects — free to use in your builds.",
    category: "tools",
    url: "#",
    icon: Palette,
  },
  {
    id: "10",
    title: "Git & GitHub Cheatsheet",
    description: "Essential Git commands, branching strategies, and PR workflow for beginners.",
    category: "docs",
    url: "#",
    icon: FileText,
  },
  {
    id: "11",
    title: "Deployment Guide (Vercel & Render)",
    description: "Step-by-step guide to deploying your Next.js and Python apps to production.",
    category: "docs",
    url: "#",
    icon: FileText,
  },
  {
    id: "12",
    title: "Week 4: REST API Design (Recording)",
    description: "Live session on designing clean REST APIs with Express and best practices.",
    category: "videos",
    week: 4,
    url: "#",
    icon: Video,
  },
];

export default function ResourcesPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filtered = resources.filter((r) => {
    if (category !== "all" && r.category !== category) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo/10 flex items-center justify-center">
          <FolderOpen className="h-5 w-5 text-indigo" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-text-primary">Resources</h2>
          <p className="text-xs text-text-muted">Recordings, docs, templates & tools</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-background-card border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "videos", "docs", "tools", "templates"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                category === c
                  ? "bg-amber/15 text-amber"
                  : "bg-white/[0.03] text-text-muted hover:text-text-primary"
              )}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((resource, i) => {
          const cfg = categoryConfig[resource.category];
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="h-full flex flex-col group hover:border-amber/30 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", resource.category === "videos" ? "bg-amber/10" : resource.category === "docs" ? "bg-indigo/10" : resource.category === "tools" ? "bg-success/10" : "bg-amber/10")}>
                    <resource.icon className={cn("h-4 w-4", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="default" className="text-[10px]">{cfg.label}</Badge>
                      {resource.week && (
                        <span className="text-[10px] text-text-muted">Week {resource.week}</span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed flex-1 mb-4">
                  {resource.description}
                </p>
                <a
                  href={resource.url}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber hover:text-amber-hover transition-colors"
                >
                  {resource.category === "templates" ? (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      Use Template
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Resource
                    </>
                  )}
                </a>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted text-sm">No resources found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
