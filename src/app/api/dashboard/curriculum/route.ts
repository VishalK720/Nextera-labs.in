import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");
    const cohortId = request.nextUrl.searchParams.get("cohortId");

    if (!studentId || !cohortId) {
      return NextResponse.json({ error: "studentId and cohortId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Fetch all weeks with lessons
    const { data: weeks, error: weeksError } = await supabase
      .from("curriculum_weeks")
      .select(`
        id,
        week_number,
        title,
        is_locked,
        unlock_on_date,
        lessons (
          id,
          title,
          content_type,
          duration_minutes,
          points_on_complete,
          order_index
        )
      `)
      .eq("cohort_id", cohortId)
      .order("week_number");

    if (weeksError) {
      console.error("Weeks fetch error:", weeksError);
      return NextResponse.json({ error: "Failed to fetch curriculum" }, { status: 500 });
    }

    // Fetch student progress
    const { data: progress } = await supabase
      .from("student_progress")
      .select("lesson_id, completed")
      .eq("student_id", studentId);

    const completedSet = new Set(
      (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
    );

    // Get current week from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_week")
      .eq("id", studentId)
      .single();

    const currentWeek = profile?.current_week ?? 1;

    const result = (weeks ?? []).map((w) => {
      const lessons = ((w.lessons as Array<{
        id: string;
        title: string;
        content_type: string;
        duration_minutes: number | null;
        points_on_complete: number;
        order_index: number | null;
      }>) ?? [])
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((l) => ({
          id: l.id,
          title: l.title,
          contentType: l.content_type,
          duration: l.duration_minutes ? `${l.duration_minutes} min` : "—",
          points: l.points_on_complete,
          completed: completedSet.has(l.id),
        }));

      return {
        id: w.week_number,
        title: w.title,
        lessons,
        locked: w.is_locked,
        unlockDate: w.unlock_on_date,
        isCurrent: w.week_number === currentWeek,
      };
    });

    return NextResponse.json({ weeks: result });
  } catch (error) {
    console.error("Curriculum fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch curriculum" }, { status: 500 });
  }
}
