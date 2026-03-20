import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, total_points, streak_days, cohort_rank, cohort_id, current_week")
      .eq("id", studentId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Count completed lessons
    const { count: completedLessons } = await supabase
      .from("student_progress")
      .select("*", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("completed", true);

    // Count projects
    const { count: shippedProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("status", "shipped");

    // Get weekly progress (lessons per week)
    const { data: weeks } = await supabase
      .from("curriculum_weeks")
      .select("id, week_number, title, lessons(id)")
      .eq("cohort_id", profile.cohort_id)
      .order("week_number");

    const { data: progress } = await supabase
      .from("student_progress")
      .select("lesson_id")
      .eq("student_id", studentId)
      .eq("completed", true);

    const completedLessonIds = new Set((progress ?? []).map((p) => p.lesson_id));

    const weeklyProgress = (weeks ?? []).map((w) => {
      const lessonIds = (w.lessons as { id: string }[]) ?? [];
      return {
        week: w.week_number,
        title: w.title,
        done: lessonIds.filter((l) => completedLessonIds.has(l.id)).length,
        total: lessonIds.length,
      };
    });

    // Get student's projects
    const { data: projects } = await supabase
      .from("projects")
      .select("title, status, tech_stack, updated_at")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false })
      .limit(5);

    // Get activity feed (points log as activity)
    const { data: activity } = await supabase
      .from("points_log")
      .select("reason, reason_code, points, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Mini leaderboard (top 5 in cohort)
    const { data: leaderboard } = await supabase
      .from("profiles")
      .select("id, full_name, total_points")
      .eq("cohort_id", profile.cohort_id)
      .eq("role", "student")
      .eq("is_active", true)
      .order("total_points", { ascending: false })
      .limit(5);

    // Next live session
    const { data: nextSession } = await supabase
      .from("meet_sessions")
      .select("*")
      .eq("status", "scheduled")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at")
      .limit(1)
      .single();

    return NextResponse.json({
      profile: {
        name: profile.full_name,
        streak: profile.streak_days,
        rank: profile.cohort_rank,
        totalPoints: profile.total_points,
        currentWeek: profile.current_week,
      },
      completedLessons: completedLessons ?? 0,
      shippedProjects: shippedProjects ?? 0,
      weeklyProgress,
      projects: (projects ?? []).map((p) => ({
        name: p.title,
        status: p.status,
        tech: (p.tech_stack ?? []).join(" · "),
      })),
      activity: (activity ?? []).map((a) => ({
        text: a.reason ?? a.reason_code,
        time: a.created_at,
        code: a.reason_code,
        points: a.points,
      })),
      leaderboard: (leaderboard ?? []).map((l, i) => ({
        rank: i + 1,
        name: l.full_name,
        points: l.total_points,
        isYou: l.id === studentId,
      })),
      nextSession: nextSession
        ? {
            title: nextSession.notes ?? "Live Session",
            date: nextSession.scheduled_at,
            link: nextSession.google_meet_link,
          }
        : null,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
