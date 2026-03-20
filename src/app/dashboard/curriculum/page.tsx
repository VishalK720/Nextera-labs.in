"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Lock,
  Play,
  FileText,
  Code,
  ClipboardCheck,
  Radio,
  Edit3,
  Check,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAuth } from "@/lib/auth-context";
import { showToast } from "@/components/ui/Toast";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ContentType =
  | "Video"
  | "Reading"
  | "Exercise"
  | "Quiz"
  | "LiveSession"
  | "Assignment"
  | "video"
  | "reading"
  | "exercise"
  | "quiz"
  | "live_session"
  | "assignment";

interface Lesson {
  id: string;
  title: string;
  contentType: ContentType;
  duration: string;
  points: number;
  completed: boolean;
}

interface Week {
  id: number;
  title: string;
  lessons: Lesson[];
  locked: boolean;
  unlockDate?: string;
  isCurrent: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Icon mapping                                                               */
/* -------------------------------------------------------------------------- */

const contentTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Video: Play,
  video: Play,
  Reading: FileText,
  reading: FileText,
  Exercise: Code,
  exercise: Code,
  Quiz: ClipboardCheck,
  quiz: ClipboardCheck,
  LiveSession: Radio,
  live_session: Radio,
  Assignment: Edit3,
  assignment: Edit3,
};

const contentTypeColors: Record<string, string> = {
  Video: "text-amber",
  video: "text-amber",
  Reading: "text-indigo",
  reading: "text-indigo",
  Exercise: "text-success",
  exercise: "text-success",
  Quiz: "text-amber",
  quiz: "text-amber",
  LiveSession: "text-danger",
  live_session: "text-danger",
  Assignment: "text-indigo",
  assignment: "text-indigo",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function CurriculumPage() {
  const { user, profile } = useAuth();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !profile?.cohort_id) return;

    fetch(`/api/dashboard/curriculum?studentId=${user.id}&cohortId=${profile.cohort_id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.weeks) setWeeks(d.weeks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id, profile?.cohort_id]);

  const currentWeekId = weeks.find((w) => w.isCurrent)?.id ?? 1;
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentWeekId) {
      setExpandedWeeks(new Set([currentWeekId]));
    }
  }, [currentWeekId]);

  /* derived stats */
  const totalLessons = useMemo(() => weeks.reduce((s, w) => s + w.lessons.length, 0), [weeks]);
  const completedLessons = useMemo(
    () => weeks.reduce((s, w) => s + w.lessons.filter((l) => l.completed).length, 0),
    [weeks]
  );
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const toggleWeek = useCallback((weekId: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) next.delete(weekId);
      else next.add(weekId);
      return next;
    });
  }, []);

  const toggleLesson = useCallback(async (weekId: number, lessonId: string) => {
    if (!user?.id) return;

    // Optimistic update
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId
          ? {
              ...w,
              lessons: w.lessons.map((l) =>
                l.id === lessonId ? { ...l, completed: !l.completed } : l
              ),
            }
          : w
      )
    );

    try {
      const res = await fetch("/api/progress/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id, lessonId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.pointsAwarded) {
          showToast(`+${data.pointsAwarded} points!`, "success");
        }
      }
    } catch {
      // Revert on error
      setWeeks((prev) =>
        prev.map((w) =>
          w.id === weekId
            ? {
                ...w,
                lessons: w.lessons.map((l) =>
                  l.id === lessonId ? { ...l, completed: !l.completed } : l
                ),
              }
            : w
        )
      );
      showToast("Failed to update progress", "error");
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24">
        <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" />
        <h2 className="font-heading text-xl font-bold text-text-primary mb-2">No Curriculum Yet</h2>
        <p className="text-text-muted">Your curriculum will appear here once your cohort starts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-background-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber" />
            <h2 className="font-heading font-semibold text-text-primary">
              Overall Progress
            </h2>
          </div>
          <span className="text-sm font-medium text-amber">
            {overallPercent}% complete
          </span>
        </div>
        <ProgressBar value={overallPercent} size="lg" color="amber" />
        <p className="mt-2 text-xs text-text-muted">
          {completedLessons} of {totalLessons} lessons completed across {weeks.length} weeks
        </p>
      </motion.div>

      {/* Weeks */}
      <div className="space-y-3">
        {weeks.map((week, idx) => {
          const weekCompleted = week.lessons.filter((l) => l.completed).length;
          const weekTotal = week.lessons.length;
          const weekPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
          const isExpanded = expandedWeeks.has(week.id);

          return (
            <motion.div
              key={week.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className={cn(
                "bg-background-card border border-border rounded-xl overflow-hidden",
                week.isCurrent && "border-l-4 border-l-amber"
              )}
            >
              {/* Week header row */}
              <button
                onClick={() => !week.locked && toggleWeek(week.id)}
                disabled={week.locked}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4 text-left transition-colors",
                  !week.locked && "hover:bg-white/[0.02] cursor-pointer",
                  week.locked && "opacity-60 cursor-not-allowed"
                )}
              >
                <Badge variant="amber" className="shrink-0 font-bold tracking-wider text-[11px]">
                  WEEK {week.id}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {week.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {week.locked ? (
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs">
                        {week.unlockDate
                          ? `Unlocks ${new Date(week.unlockDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
                          : "Locked"}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {weekCompleted}/{weekTotal} lessons
                      </span>
                      <div className="w-24 hidden sm:block">
                        <ProgressBar
                          value={weekPercent}
                          size="sm"
                          color={weekPercent === 100 ? "success" : "amber"}
                        />
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-text-muted" />
                      </motion.div>
                    </>
                  )}
                </div>
              </button>

              {/* Expanded lessons */}
              <AnimatePresence initial={false}>
                {isExpanded && !week.locked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-5 py-3 space-y-1">
                      {week.lessons.map((lesson) => {
                        const Icon = contentTypeIcons[lesson.contentType] ?? FileText;
                        const iconColor = contentTypeColors[lesson.contentType] ?? "text-text-muted";
                        return (
                          <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            Icon={Icon}
                            iconColor={iconColor}
                            onToggle={() => toggleLesson(week.id, lesson.id)}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lesson row                                                                 */
/* -------------------------------------------------------------------------- */

function LessonRow({
  lesson,
  Icon,
  iconColor,
  onToggle,
}: {
  lesson: Lesson;
  Icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors hover:bg-white/[0.02] group"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          lesson.completed
            ? "bg-success border-success"
            : "border-white/20 hover:border-amber group-hover:border-white/30"
        )}
        aria-label={lesson.completed ? "Mark incomplete" : "Mark complete"}
      >
        <AnimatePresence>
          {lesson.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <Icon className={cn("h-4 w-4 shrink-0", lesson.completed ? "text-text-muted" : iconColor)} />
      <span
        className={cn(
          "flex-1 text-sm truncate transition-colors",
          lesson.completed
            ? "text-text-muted line-through"
            : "text-text-primary"
        )}
      >
        {lesson.title}
      </span>
      <span className="text-xs text-text-muted shrink-0 hidden sm:block">
        {lesson.duration}
      </span>
      <Badge
        variant={lesson.completed ? "default" : "amber"}
        className="shrink-0 text-[10px]"
      >
        {lesson.points} pts
      </Badge>
    </motion.div>
  );
}
