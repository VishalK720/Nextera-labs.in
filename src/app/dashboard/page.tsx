"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Rocket,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Video,
  Star,
  MessageSquare,
  Code2,
  GitPullRequest,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                               Mock data                                    */
/* -------------------------------------------------------------------------- */

const studentName = "Arjun";
const dayStreak = 7;

const stats = [
  { label: "Weeks Complete", value: "4/6", icon: BookOpen, color: "text-indigo" },
  { label: "Projects Shipped", value: "2", icon: Rocket, color: "text-amber" },
  { label: "Cohort Rank", value: "#3", icon: Trophy, color: "text-amber" },
  { label: "Day Streak", value: `${dayStreak} 🔥`, icon: Flame, color: "text-danger" },
];

const weeks = [
  { week: 1, title: "HTML & CSS Foundations", done: 8, total: 8 },
  { week: 2, title: "JavaScript Essentials", done: 7, total: 8 },
  { week: 3, title: "React & Component Thinking", done: 6, total: 8 },
  { week: 4, title: "Backend with Node & Express", done: 3, total: 8 },
  { week: 5, title: "Databases & Auth", done: 0, total: 8 },
  { week: 6, title: "Capstone Project", done: 0, total: 8 },
];

const projects = [
  {
    name: "Personal Portfolio",
    status: "Shipped",
    statusColor: "bg-success/15 text-success",
    tech: "Next.js · Tailwind",
  },
  {
    name: "Task Tracker API",
    status: "Shipped",
    statusColor: "bg-success/15 text-success",
    tech: "Express · MongoDB",
  },
  {
    name: "AI Study Planner",
    status: "In Progress",
    statusColor: "bg-amber/15 text-amber",
    tech: "React · OpenAI API",
  },
];

const activityFeed = [
  { icon: CheckCircle2, text: "Completed lesson: React Hooks Deep Dive", time: "2h ago", color: "text-success" },
  { icon: GitPullRequest, text: "Submitted PR for Task Tracker API", time: "5h ago", color: "text-indigo" },
  { icon: Star, text: "Earned badge: 7-Day Streak", time: "1d ago", color: "text-amber" },
  { icon: MessageSquare, text: "Asked a question in AI Tutor", time: "1d ago", color: "text-indigo" },
  { icon: Code2, text: "Started project: AI Study Planner", time: "2d ago", color: "text-amber" },
];

const leaderboard = [
  { rank: 1, name: "Priya Sharma", points: 2480 },
  { rank: 2, name: "Rahul Verma", points: 2350 },
  { rank: 3, name: "Arjun Mehta", points: 2210, isYou: true },
  { rank: 4, name: "Sneha Iyer", points: 2080 },
  { rank: 5, name: "Dev Kapoor", points: 1960 },
];

const nextSession = {
  title: "Week 4 Live: REST API Design",
  date: "Sat, 22 Mar · 11:00 AM IST",
  mentor: "Karan Taneja",
};

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

/* -------------------------------------------------------------------------- */
/*                              Overview Page                                 */
/* -------------------------------------------------------------------------- */

export default function DashboardOverview() {
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
            Hey {studentName} 👋
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
              {weeks.map((w) => (
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
              ))}
            </div>
          </Card>

          {/* My Projects */}
          <Card delay={0.2} className="p-5">
            <h3 className="font-heading font-bold text-base text-text-primary mb-4">
              My Projects
            </h3>
            <div className="space-y-3">
              {projects.map((p) => (
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
                      "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                      p.statusColor
                    )}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
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
              {activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon
                    className={cn("h-4 w-4 mt-0.5 shrink-0", item.color)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary leading-snug">
                      {item.text}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mini Leaderboard */}
          <Card delay={0.2} className="p-5">
            <h3 className="font-heading font-bold text-base text-text-primary mb-4">
              Mini Leaderboard
            </h3>
            <div className="space-y-2.5">
              {leaderboard.map((entry) => (
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
              ))}
            </div>
          </Card>

          {/* Next Session */}
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
                <span>{nextSession.date}</span>
              </div>
              <p className="text-xs text-text-muted">
                Mentor: {nextSession.mentor}
              </p>
            </div>
            <a
              href="#"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-hover text-background font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors"
            >
              <Video className="h-4 w-4" />
              Join Google Meet
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
