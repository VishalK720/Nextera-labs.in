import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, full_name, city, school, class: classYear, about_self, github_url, linkedin_url } = body;

    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const updates: Record<string, unknown> = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (city !== undefined) updates.city = city;
    if (school !== undefined) updates.school = school;
    if (classYear !== undefined) updates.class = classYear;
    if (about_self !== undefined) updates.about_self = about_self;
    if (github_url !== undefined) updates.github_url = github_url;
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url;
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", studentId);

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
