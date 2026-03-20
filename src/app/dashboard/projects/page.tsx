"use client";

import { useState, useEffect } from "react";
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
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import type { Project } from "@/types";

type ProjectStatus = "shipped" | "in_progress" | "idea" | "featured" | "demo_day_ready";

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  shipped: { label: "Shipped", color: "bg-success/15 text-success", icon: CheckCircle2 },
  featured: { label: "Featured", color: "bg-success/15 text-success", icon: Star },
  demo_day_ready: { label: "Demo Ready", color: "bg-amber/15 text-amber", icon: Star },
  in_progress: { label: "In Progress", color: "bg-amber/15 text-amber", icon: Clock },
  idea: { label: "Idea", color: "bg-indigo/15 text-indigo", icon: Circle },
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/dashboard/projects?studentId=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.projects) setProjects(d.projects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const totalPoints = projects.reduce((s, p) => s + p.points_earned, 0);
  const shippedCount = projects.filter((p) => p.status === "shipped" || p.status === "featured").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

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
          const cfg = statusConfig[project.status] ?? statusConfig.idea;
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
                      {project.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {project.week_number ? `Week ${project.week_number}` : ""}
                      {project.is_capstone ? " · Capstone" : ""}
                    </p>
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
                  {(project.tech_stack ?? []).map((t) => (
                    <Badge key={t} variant="default" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Star className="h-3.5 w-3.5 text-amber" />
                    <span>{project.points_earned} pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                        aria-label="GitHub repo"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
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

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Rocket className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="font-heading font-bold text-text-primary mb-2">No projects yet</h3>
          <p className="text-text-muted text-sm mb-4">Start building your first project!</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber-hover text-background font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      )}
    </div>
  );
}
