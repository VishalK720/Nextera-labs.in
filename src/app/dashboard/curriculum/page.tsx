"use client";

import { useState, useCallback, useMemo } from "react";
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

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ContentType =
  | "Video"
  | "Reading"
  | "Exercise"
  | "Quiz"
  | "LiveSession"
  | "Assignment";

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

const contentTypeIcons: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  Video: Play,
  Reading: FileText,
  Exercise: Code,
  Quiz: ClipboardCheck,
  LiveSession: Radio,
  Assignment: Edit3,
};

const contentTypeColors: Record<ContentType, string> = {
  Video: "text-amber",
  Reading: "text-indigo",
  Exercise: "text-success",
  Quiz: "text-amber",
  LiveSession: "text-danger",
  Assignment: "text-indigo",
};

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                  */
/* -------------------------------------------------------------------------- */

function makeLessons(weekNum: number, items: { title: string; type: ContentType; dur: string; pts: number; done: boolean }[]): Lesson[] {
  return items.map((item, i) => ({
    id: `w${weekNum}-l${i + 1}`,
    title: item.title,
    contentType: item.type,
    duration: item.dur,
    points: item.pts,
    completed: item.done,
  }));
}

const initialWeeks: Week[] = [
  {
    id: 1,
    title: "Foundations of AI & Prompt Engineering",
    isCurrent: false,
    locked: false,
    lessons: makeLessons(1, [
      { title: "Welcome to Nextera Labs", type: "Video", dur: "8 min", pts: 10, done: true },
      { title: "What is Artificial Intelligence?", type: "Video", dur: "15 min", pts: 15, done: true },
      { title: "History & Evolution of AI", type: "Reading", dur: "12 min", pts: 10, done: true },
      { title: "Setting Up Your Dev Environment", type: "Exercise", dur: "20 min", pts: 20, done: true },
      { title: "Introduction to Prompt Engineering", type: "Video", dur: "18 min", pts: 15, done: true },
      { title: "Prompt Patterns & Techniques", type: "Reading", dur: "15 min", pts: 10, done: true },
      { title: "Hands-On: Write Your First Prompts", type: "Exercise", dur: "25 min", pts: 25, done: true },
      { title: "Quiz: AI Fundamentals", type: "Quiz", dur: "10 min", pts: 20, done: true },
      { title: "Live Session: Q&A with Founder", type: "LiveSession", dur: "45 min", pts: 30, done: true },
      { title: "Assignment: Build a Simple Chatbot", type: "Assignment", dur: "60 min", pts: 50, done: true },
    ]),
  },
  {
    id: 2,
    title: "Python for AI Development",
    isCurrent: false,
    locked: false,
    lessons: makeLessons(2, [
      { title: "Python Refresher: Variables & Data Types", type: "Video", dur: "14 min", pts: 10, done: true },
      { title: "Control Flow & Functions", type: "Video", dur: "16 min", pts: 15, done: true },
      { title: "Working with APIs in Python", type: "Exercise", dur: "25 min", pts: 25, done: true },
      { title: "Introduction to the Claude API", type: "Video", dur: "20 min", pts: 15, done: true },
      { title: "Building API Wrappers", type: "Exercise", dur: "30 min", pts: 30, done: true },
      { title: "Error Handling & Debugging", type: "Reading", dur: "12 min", pts: 10, done: true },
      { title: "Data Processing with Python", type: "Exercise", dur: "25 min", pts: 25, done: true },
      { title: "Quiz: Python & APIs", type: "Quiz", dur: "10 min", pts: 20, done: true },
      { title: "Live Session: Code Review", type: "LiveSession", dur: "45 min", pts: 30, done: true },
      { title: "Assignment: AI Text Summarizer", type: "Assignment", dur: "90 min", pts: 60, done: true },
    ]),
  },
  {
    id: 3,
    title: "Building AI-Powered Applications",
    isCurrent: false,
    locked: false,
    lessons: makeLessons(3, [
      { title: "App Architecture for AI Products", type: "Video", dur: "18 min", pts: 15, done: true },
      { title: "Streamlit Crash Course", type: "Video", dur: "22 min", pts: 15, done: true },
      { title: "Building Interactive UIs", type: "Exercise", dur: "30 min", pts: 25, done: true },
      { title: "State Management in AI Apps", type: "Reading", dur: "10 min", pts: 10, done: true },
      { title: "Deploying to Render", type: "Video", dur: "15 min", pts: 15, done: true },
      { title: "Hands-On: Deploy Your First App", type: "Exercise", dur: "25 min", pts: 25, done: true },
      { title: "User Research for AI Products", type: "Reading", dur: "14 min", pts: 10, done: true },
      { title: "Quiz: Building AI Apps", type: "Quiz", dur: "10 min", pts: 20, done: true },
      { title: "Live Session: Product Teardown", type: "LiveSession", dur: "45 min", pts: 30, done: true },
      { title: "Assignment: Smart Study Planner", type: "Assignment", dur: "90 min", pts: 60, done: true },
      { title: "Bonus: CI/CD Basics", type: "Reading", dur: "10 min", pts: 10, done: true },
    ]),
  },
  {
    id: 4,
    title: "Advanced AI & Capstone Kickoff",
    isCurrent: true,
    locked: false,
    lessons: makeLessons(4, [
      { title: "Multi-Turn Conversations & Memory", type: "Video", dur: "20 min", pts: 15, done: true },
      { title: "RAG: Retrieval-Augmented Generation", type: "Video", dur: "25 min", pts: 20, done: true },
      { title: "Building a RAG Pipeline", type: "Exercise", dur: "35 min", pts: 30, done: true },
      { title: "Intro to Next.js for AI Apps", type: "Video", dur: "22 min", pts: 15, done: true },
      { title: "Tailwind CSS Essentials", type: "Reading", dur: "12 min", pts: 10, done: true },
      { title: "Capstone Planning: Ideation Workshop", type: "LiveSession", dur: "60 min", pts: 40, done: true },
      { title: "Hands-On: Build a Next.js Chat UI", type: "Exercise", dur: "40 min", pts: 30, done: false },
      { title: "Streaming Responses with Claude", type: "Video", dur: "18 min", pts: 15, done: false },
      { title: "Quiz: Advanced AI Concepts", type: "Quiz", dur: "12 min", pts: 20, done: false },
      { title: "Assignment: Capstone Milestone 1", type: "Assignment", dur: "120 min", pts: 80, done: false },
    ]),
  },
  {
    id: 5,
    title: "Capstone Development & Iteration",
    isCurrent: false,
    locked: true,
    unlockDate: "Apr 7, 2026",
    lessons: makeLessons(5, [
      { title: "Advanced Prompt Engineering Patterns", type: "Video", dur: "20 min", pts: 15, done: false },
      { title: "System Prompts & Personas", type: "Reading", dur: "14 min", pts: 10, done: false },
      { title: "Hands-On: Refine Your Capstone Prompt", type: "Exercise", dur: "30 min", pts: 25, done: false },
      { title: "Testing AI Applications", type: "Video", dur: "16 min", pts: 15, done: false },
      { title: "Performance Optimization", type: "Reading", dur: "12 min", pts: 10, done: false },
      { title: "Capstone Sprint: Feature Complete", type: "Exercise", dur: "90 min", pts: 50, done: false },
      { title: "Peer Code Review Session", type: "LiveSession", dur: "45 min", pts: 30, done: false },
      { title: "Quiz: Testing & Optimization", type: "Quiz", dur: "10 min", pts: 20, done: false },
      { title: "Assignment: Capstone Milestone 2", type: "Assignment", dur: "120 min", pts: 80, done: false },
    ]),
  },
  {
    id: 6,
    title: "Launch, Demo Day & Beyond",
    isCurrent: false,
    locked: true,
    unlockDate: "Apr 14, 2026",
    lessons: makeLessons(6, [
      { title: "Polishing Your Product", type: "Video", dur: "15 min", pts: 10, done: false },
      { title: "Writing a Killer README", type: "Reading", dur: "10 min", pts: 10, done: false },
      { title: "Recording Your Demo Video", type: "Exercise", dur: "30 min", pts: 25, done: false },
      { title: "Portfolio & Personal Branding", type: "Video", dur: "18 min", pts: 15, done: false },
      { title: "LinkedIn Optimization for Tech", type: "Reading", dur: "12 min", pts: 10, done: false },
      { title: "Final Capstone Submission", type: "Assignment", dur: "60 min", pts: 100, done: false },
      { title: "Demo Day Rehearsal", type: "LiveSession", dur: "60 min", pts: 40, done: false },
      { title: "Demo Day: Live Presentations", type: "LiveSession", dur: "90 min", pts: 50, done: false },
      { title: "What's Next: Career Paths in AI", type: "Video", dur: "20 min", pts: 15, done: false },
      { title: "Graduation & Certificates", type: "Reading", dur: "5 min", pts: 10, done: false },
      { title: "Feedback Survey", type: "Quiz", dur: "5 min", pts: 10, done: false },
      { title: "Bonus: Freelancing with AI Skills", type: "Reading", dur: "15 min", pts: 10, done: false },
    ]),
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function CurriculumPage() {
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks);
  const currentWeekId = weeks.find((w) => w.isCurrent)?.id ?? 1;
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(
    new Set([currentWeekId])
  );

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

  const toggleLesson = useCallback((weekId: number, lessonId: string) => {
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
  }, []);

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
          {completedLessons} of {totalLessons} lessons completed across 6 weeks
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
                {/* Week badge */}
                <Badge variant="amber" className="shrink-0 font-bold tracking-wider text-[11px]">
                  WEEK {week.id}
                </Badge>

                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {week.title}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0">
                  {week.locked ? (
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs">Unlocks {week.unlockDate}</span>
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
                        const Icon = contentTypeIcons[lesson.contentType];
                        return (
                          <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            Icon={Icon}
                            iconColor={contentTypeColors[lesson.contentType]}
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
      {/* Checkbox */}
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

      {/* Content type icon */}
      <Icon className={cn("h-4 w-4 shrink-0", lesson.completed ? "text-text-muted" : iconColor)} />

      {/* Title */}
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

      {/* Duration */}
      <span className="text-xs text-text-muted shrink-0 hidden sm:block">
        {lesson.duration}
      </span>

      {/* Points badge */}
      <Badge
        variant={lesson.completed ? "default" : "amber"}
        className="shrink-0 text-[10px]"
      >
        {lesson.points} pts
      </Badge>
    </motion.div>
  );
}
