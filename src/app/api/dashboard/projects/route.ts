import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Projects fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }

    return NextResponse.json({ projects: projects ?? [] });
  } catch (error) {
    console.error("Projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, cohortId, title, description, techStack, weekNumber, githubUrl } = body;

    if (!studentId || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        student_id: studentId,
        cohort_id: cohortId ?? null,
        title,
        description,
        tech_stack: techStack ?? [],
        week_number: weekNumber ? parseInt(weekNumber) : null,
        github_url: githubUrl || null,
        status: "idea",
        points_earned: 20,
      })
      .select()
      .single();

    if (error) {
      console.error("Project create error:", error);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    // Award points for starting a project
    await supabase.from("points_log").insert({
      student_id: studentId,
      cohort_id: cohortId ?? null,
      points: 20,
      reason: `Started project: ${title}`,
      reason_code: "bonus",
    });

    // Update total points
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_points")
      .eq("id", studentId)
      .single();

    await supabase
      .from("profiles")
      .update({ total_points: (profile?.total_points ?? 0) + 20 })
      .eq("id", studentId);

    return NextResponse.json({ project: data, pointsAwarded: 20 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
