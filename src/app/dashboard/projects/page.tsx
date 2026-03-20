"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Plus,
  ExternalLink,
  Github,
  Clock,
  CheckCircle2,
  Circle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type ProjectStatus = "shipped" | "in_progress" | "idea";

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  status: ProjectStatus;
  week: number;
  liveUrl?: string;
  repoUrl?: string;
  points: number;
  updatedAt: string;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  shipped: { label: "Shipped", color: "bg-success/15 text-success", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "bg-amber/15 text-amber", icon: Clock },
  idea: { label: "Idea", color: "bg-indigo/15 text-indigo", icon: Circle },
};

const projects: Project[] = [
  {
    id: "1",
    name: "Personal Portfolio",
    description: "A responsive portfolio website with dark mode and smooth animations, showcasing projects and skills.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    status: "shipped",
    week: 2,
    liveUrl: "#",
    repoUrl: "#",
    points: 150,
    updatedAt: "Mar 10, 2026",
  },
  {
    id: "2",
    name: "AI Text Summarizer",
    description: "A Python-powered web app that summarizes long articles using the Claude API with adjustable length settings.",
    tech: ["Python", "Streamlit", "Claude API"],
    status: "shipped",
    week: 3,
    liveUrl: "#",
    repoUrl: "#",
    points: 160,
    updatedAt: "Mar 15, 2026",
  },
  {
    id: "3",
    name: "Smart Study Planner",
    description: "An AI-powered study planner that creates personalized schedules based on exam dates and learning pace.",
    tech: ["React", "Node.js", "Claude API"],
    status: "in_progress",
    week: 4,
    repoUrl: "#",
    points: 80,
    updatedAt: "Mar 18, 2026",
  },
  {
    id: "4",
    name: "Capstone: QuizMaster Pro",
    description: "An interactive quiz platform that generates questions from any topic using AI, tracks progress, and adapts difficulty.",
    tech: ["Next.js", "Supabase", "Claude API", "Tailwind"],
    status: "idea",
    week: 6,
    points: 0,
    updatedAt: "Mar 20, 2026",
  },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const totalPoints = projects.reduce((s, p) => s + p.points, 0);
  const shippedCount = projects.filter((p) => p.status === "shipped").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber/10 flex items-center justify-center">
            <Rocket className="h-5 w-5 text-amber" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-text-primary">My Projects</h2>
            <p className="text-xs text-text-muted">
              {shippedCount} shipped &middot; {totalPoints} points earned
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 bg-amber hover:bg-amber-hover text-background font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "shipped", "in_progress", "idea"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              filter === f
                ? "bg-amber/15 text-amber"
                : "bg-white/[0.03] text-text-muted hover:text-text-primary"
            )}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((project, i) => {
          const cfg = statusConfig[project.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-text-primary truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">Week {project.week}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full shrink-0", cfg.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>

                <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <Badge key={t} variant="default" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Star className="h-3.5 w-3.5 text-amber" />
                    <span>{project.points} pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                        aria-label="GitHub repo"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                        aria-label="Live demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
