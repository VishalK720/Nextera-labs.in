"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Star,
  BookOpen,
  Rocket,
  Radio,
  MessageSquare,
  Presentation,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth-context";

const pointsBreakdown = [
  { label: "Lesson complete", points: "+10", icon: BookOpen, color: "#6366F1" },
  { label: "Quiz passed", points: "+25", icon: Zap, color: "#F5A623" },
  { label: "Project started", points: "+20", icon: Rocket, color: "#6366F1" },
  { label: "Project shipped", points: "+100", icon: Star, color: "#F5A623" },
  { label: "Live project", points: "+50 extra", icon: Radio, color: "#10B981" },
  { label: "7-day streak", points: "+50", icon: Flame, color: "#EF4444" },
  { label: "14-day streak", points: "+100", icon: Flame, color: "#F5A623" },
  { label: "Founder feedback", points: "+25", icon: MessageSquare, color: "#6366F1" },
  { label: "Demo Day", points: "+200", icon: Presentation, color: "#F5A623" },
  { label: "First project", points: "+50 bonus", icon: Award, color: "#10B981" },
];

const avatarColors = [
  "#F5A623", "#6366F1", "#10B981", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F59E0B", "#3B82F6", "#22C55E",
  "#E11D48", "#7C3AED", "#06B6D4", "#D946EF", "#84CC16",
];

interface StudentRow {
  id: string;
  name: string;
  city: string;
  week: number;
  projects: number;
  streak: number;
  points: number;
}

function getMedal(rank: number) {
  if (rank === 1) return "\u{1F947}";
  if (rank === 2) return "\u{1F948}";
  if (rank === 3) return "\u{1F949}";
  return null;
}

export default function LeaderboardPage() {
  const { user, profile } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.cohort_id) return;

    fetch(`/api/dashboard/leaderboard?cohortId=${profile.cohort_id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.students) setStudents(d.students);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile?.cohort_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* How points are earned */}
      <Card>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-0"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-amber" />
            </div>
            <div className="text-left">
              <h2 className="font-heading font-semibold text-text-primary">
                How points are earned
              </h2>
              <p className="text-sm text-text-muted">
                Earn points by completing lessons, projects, and maintaining streaks
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-text-muted shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-muted shrink-0" />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {pointsBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-border"
                    >
                      <item.icon
                        className="h-5 w-5"
                        style={{ color: item.color }}
                      />
                      <span className="text-xs text-text-muted text-center leading-tight">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-amber">
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Leaderboard Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 z-10 bg-background-card text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider w-16">
                  Rank
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Student
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">
                  City
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Week
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Projects
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Streak
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const rank = index + 1;
                const medal = getMedal(rank);
                const isCurrentUser = student.id === user?.id;

                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={
                      isCurrentUser
                        ? "bg-amber/10 border-l-2 border-l-amber"
                        : rank <= 3
                        ? "bg-white/[0.02]"
                        : "hover:bg-white/[0.02] transition-colors"
                    }
                  >
                    <td className="sticky left-0 z-10 px-4 py-3 bg-inherit">
                      <div className="flex items-center gap-1">
                        {medal ? (
                          <span className="text-lg leading-none">{medal}</span>
                        ) : (
                          <span className="text-sm text-text-muted font-medium w-6 text-center">
                            {rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={student.name}
                          size="sm"
                          color={avatarColors[index % avatarColors.length]}
                        />
                        <span
                          className={
                            isCurrentUser
                              ? "text-sm font-semibold text-amber"
                              : "text-sm font-medium text-text-primary"
                          }
                        >
                          {student.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-amber/70">(You)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted hidden sm:table-cell">
                      {student.city}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="default">{student.week}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-text-primary font-medium">
                        {student.projects}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <Flame
                          className="h-3.5 w-3.5"
                          style={{
                            color:
                              student.streak >= 14
                                ? "#F5A623"
                                : student.streak >= 7
                                ? "#EF4444"
                                : "rgba(255,255,255,0.3)",
                          }}
                        />
                        <span className="text-sm text-text-primary">
                          {student.streak}d
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          rank <= 3
                            ? "text-sm font-bold text-amber"
                            : "text-sm font-semibold text-text-primary"
                        }
                      >
                        {student.points.toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-sm">No students in leaderboard yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
