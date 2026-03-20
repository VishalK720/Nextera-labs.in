"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Rocket,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Video,
  Star,
  Code2,
  GitPullRequest,
} from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

/* -------------------------------------------------------------------------- */
/*                            Helper components                               */
/* -------------------------------------------------------------------------- */

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 w-full rounded-full bg-white/5">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          pct === 100 ? "bg-success" : pct > 0 ? "bg-indigo" : "bg-white/10"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Card({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "bg-background-card border border-border rounded-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

const activityIcons: Record<string, typeof CheckCircle2> = {
  lesson_complete: CheckCircle2,
  project_shipped: Rocket,
  streak_7day: Star,
  streak_14day: Star,
  quiz_passed: Trophy,
  bonus: Code2,
  first_project: Rocket,
  default: GitPullRequest,
};

const activityColors: Record<string, string> = {
  lesson_complete: "text-success",
  project_shipped: "text-amber",
  streak_7day: "text-amber",
  streak_14day: "text-amber",
  quiz_passed: "text-indigo",
  bonus: "text-amber",
  first_project: "text-amber",
  default: "text-indigo",
};

const statusColorMap: Record<string, string> = {
  shipped: "bg-success/15 text-success",
  featured: "bg-success/15 text-success",
  in_progress: "bg-amber/15 text-amber",
  idea: "bg-indigo/15 text-indigo",
  demo_day_ready: "bg-amber/15 text-amber",
};

/* -------------------------------------------------------------------------- */
/*                              Overview Page                                 */
/* -------------------------------------------------------------------------- */

interface DashboardData {
  profile: { name: string; streak: number; rank: number | null; totalPoints: number; currentWeek: number };
  completedLessons: number;
  shippedProjects: number;
  weeklyProgress: { week: number; title: string; done: number; total: number }[];
  projects: { name: string; status: string; tech: string }[];
  activity: { text: string; time: string; code: string; points: number }[];
  leaderboard: { rank: number; name: string; points: number; isYou: boolean }[];
  nextSession: { title: string; date: string; link: string } | null;
}

export default function DashboardOverview() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/dashboard/stats?studentId=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Fallback to profile data if API hasn't loaded or no data
  const studentName = data?.profile?.name ?? profile?.full_name ?? "Builder";
  const dayStreak = data?.profile?.streak ?? profile?.streak_days ?? 0;
  const currentWeek = data?.profile?.currentWeek ?? profile?.current_week ?? 1;

  const stats = [
    { label: "Weeks Complete", value: `${currentWeek}/6`, icon: BookOpen, color: "text-indigo" },
    { label: "Projects Shipped", value: `${data?.shippedProjects ?? 0}`, icon: Rocket, color: "text-amber" },
    { label: "Cohort Rank", value: data?.profile?.rank ? `#${data.profile.rank}` : "—", icon: Trophy, color: "text-amber" },
    { label: "Day Streak", value: `${dayStreak} 🔥`, icon: Flame, color: "text-danger" },
  ];

  const weeks = data?.weeklyProgress ?? [];
  const projects = data?.projects ?? [];
  const activityFeed = data?.activity ?? [];
  const leaderboard = data?.leaderboard ?? [];
  const nextSession = data?.nextSession;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* ---- Welcome Banner ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl p-[1px] bg-gradient-to-r from-amber to-indigo"
      >
        <div className="bg-background-card rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-text-primary">
            Hey {studentName.split(" ")[0]} 👋
          </h2>
          <p className="text-text-muted mt-1 text-sm">
            You&apos;re on a <span className="text-amber font-semibold">{dayStreak}-day streak</span>. Keep building.
          </p>
        </div>
      </motion.div>

      {/* ---- Stats Row ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} delay={0.05 * (i + 1)} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-2xl font-bold font-heading text-text-primary">
              {stat.value}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* ---- Main Grid ---- */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column — 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* Weekly Progress */}
          <Card delay={0.15} className="p-5">
            <h3 className="font-heading font-bold text-base text-text-primary mb-4">
              Weekly Progress
            </h3>
            <div className="space-y-4">
              {weeks.length > 0 ? weeks.map((w) => (
                <div key={w.week}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text-primary font-medium">
                      Week {w.week}: {w.title}
                    </span>
                    <span className="text-xs text-text-muted">
                      {w.done}/{w.total}
                    </span>
                  </div>
                  <ProgressBar value={w.done} max={w.total} />
                </div>
              )) : (
                <p className="text-sm text-text-muted">No curriculum data yet.</p>
              )}
            </div>
          </Card>

          {/* My Projects */}
          <Card delay={0.2} className="p-5">
            <h3 className="font-heading font-bold text-base text-text-primary mb-4">
              My Projects
            </h3>
            <div className="space-y-3">
              {projects.length > 0 ? projects.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {p.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{p.tech}</p>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize",
                      statusColorMap[p.status] ?? "bg-white/10 text-text-muted"
                    )}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-text-muted">No projects yet. Start building!</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Feed */}
          <Card delay={0.15} className="p-5">
            <h3 className="font-heading font-bold text-base text-text-primary mb-4">
              Activity Feed
            </h3>
            <div className="space-y-3">
              {activityFeed.length > 0 ? activityFeed.map((item, i) => {
                const IconComp = activityIcons[item.code] ?? activityIcons.default;
                const iconColor = activityColors[item.code] ?? activityColors.default;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <IconComp className={cn("h-4 w-4 mt-0.5 shrink-0", iconColor)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary leading-snug">
                        {item.text} (+{item.points} pts)
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {formatRelativeDate(item.time)}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-text-muted">No activity yet.</p>
              )}
            </div>
          </Card>

          {/* Mini Leaderboard */}
          <Card delay={0.2} className="p-5">
            <h3 className="font-heading font-bold text-base text-text-primary mb-4">
              Mini Leaderboard
            </h3>
            <div className="space-y-2.5">
              {leaderboard.length > 0 ? leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg",
                    entry.isYou && "bg-amber/5 border border-amber/15"
                  )}
                >
                  <span
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      entry.rank === 1
                        ? "bg-amber/20 text-amber"
                        : entry.rank === 2
                          ? "bg-white/10 text-text-primary"
                          : entry.rank === 3
                            ? "bg-amber/10 text-amber"
                            : "bg-white/5 text-text-muted"
                    )}
                  >
                    {entry.rank}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-sm font-medium",
                      entry.isYou ? "text-amber" : "text-text-primary"
                    )}
                  >
                    {entry.name}
                    {entry.isYou && (
                      <span className="text-xs text-text-muted ml-1.5">(You)</span>
                    )}
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    {entry.points.toLocaleString()} pts
                  </span>
                </div>
              )) : (
                <p className="text-sm text-text-muted">No leaderboard data yet.</p>
              )}
            </div>
          </Card>

          {/* Next Session */}
          {nextSession && (
            <Card delay={0.25} className="p-5">
              <h3 className="font-heading font-bold text-base text-text-primary mb-3">
                Next Session
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-primary">
                  {nextSession.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {new Date(nextSession.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    ·{" "}
                    {new Date(nextSession.date).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <a
                href={nextSession.link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-hover text-background font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors"
              >
                <Video className="h-4 w-4" />
                Join Google Meet
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
