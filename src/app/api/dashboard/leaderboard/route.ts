import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const cohortId = request.nextUrl.searchParams.get("cohortId");
    if (!cohortId) {
      return NextResponse.json({ error: "cohortId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: students, error } = await supabase
      .from("profiles")
      .select("id, full_name, city, current_week, streak_days, total_points")
      .eq("cohort_id", cohortId)
      .eq("role", "student")
      .eq("is_active", true)
      .order("total_points", { ascending: false });

    if (error) {
      console.error("Leaderboard fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }

    // Count projects per student
    const studentIds = (students ?? []).map((s) => s.id);
    const { data: projects } = await supabase
      .from("projects")
      .select("student_id, status")
      .in("student_id", studentIds);

    const projectCounts: Record<string, number> = {};
    (projects ?? []).forEach((p) => {
      if (p.status === "shipped" || p.status === "featured" || p.status === "demo_day_ready") {
        projectCounts[p.student_id] = (projectCounts[p.student_id] ?? 0) + 1;
      }
    });

    const result = (students ?? []).map((s) => ({
      id: s.id,
      name: s.full_name,
      city: s.city ?? "",
      week: s.current_week ?? 1,
      projects: projectCounts[s.id] ?? 0,
      streak: s.streak_days,
      points: s.total_points,
    }));

    return NextResponse.json({ students: result });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
