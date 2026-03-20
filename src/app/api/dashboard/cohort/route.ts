import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const cohortId = request.nextUrl.searchParams.get("cohortId");
    if (!cohortId) {
      return NextResponse.json({ error: "cohortId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Get cohort info
    const { data: cohort } = await supabase
      .from("cohorts")
      .select("name, enrolled_count, start_date")
      .eq("id", cohortId)
      .single();

    // Get students in cohort
    const { data: students, error } = await supabase
      .from("profiles")
      .select("id, full_name, city, class, about_self, streak_days, cohort_rank, total_points, last_active_at, avatar_color")
      .eq("cohort_id", cohortId)
      .eq("role", "student")
      .eq("is_active", true)
      .order("total_points", { ascending: false });

    if (error) {
      console.error("Cohort fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch cohort" }, { status: 500 });
    }

    // Get active projects for each student
    const studentIds = (students ?? []).map((s) => s.id);
    const { data: projects } = await supabase
      .from("projects")
      .select("student_id, title, status")
      .in("student_id", studentIds)
      .in("status", ["in_progress", "shipped", "featured"]);

    const studentProjects: Record<string, string> = {};
    (projects ?? []).forEach((p) => {
      if (!studentProjects[p.student_id]) {
        studentProjects[p.student_id] = p.title;
      }
    });

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();

    const result = (students ?? []).map((s, i) => ({
      id: s.id,
      name: s.full_name,
      city: s.city ?? "",
      classYear: s.class ? `Class ${s.class}` : "",
      bio: s.about_self ?? "",
      project: studentProjects[s.id] ?? "None yet",
      streak: s.streak_days,
      rank: i + 1,
      online: s.last_active_at ? s.last_active_at > fiveMinutesAgo : false,
    }));

    return NextResponse.json({
      cohort: cohort ? {
        name: cohort.name,
        enrolled: cohort.enrolled_count,
        startDate: cohort.start_date,
      } : null,
      students: result,
    });
  } catch (error) {
    console.error("Cohort error:", error);
    return NextResponse.json({ error: "Failed to fetch cohort" }, { status: 500 });
  }
}
