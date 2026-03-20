import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false as const, error: "Unauthorized", status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    !["founder", "admin"].includes(profile.role)
  ) {
    return { authorized: false as const, error: "Forbidden: admin access required", status: 403 };
  }

  return { authorized: true as const, userId: user.id };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const authCheck = await verifyAdmin(supabase);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    // Fetch student profile with joins
    const { data: student, error: studentError } = await supabase
      .from("profiles")
      .select(
        `
        *,
        cohort:cohorts(id, name, status, start_date, end_date),
        progress:student_progress(lesson_id, completed, completed_at),
        projects:projects(id, title, description, status, submitted_at)
      `
      )
      .eq("id", id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Admin get student error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = await createServerSupabaseClient();

    const authCheck = await verifyAdmin(supabase);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    // Extract allowed fields for profile update
    const allowedFields = [
      "full_name",
      "email",
      "phone",
      "class",
      "city",
      "school",
      "current_week",
      "current_project",
      "rank",
      "streak_days",
      "total_points",
      "role",
      "cohort_id",
      "status",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // If email is being changed, update auth email via admin client
    if (body.email) {
      const adminClient = createAdminClient();
      const { error: authUpdateError } =
        await adminClient.auth.admin.updateUserById(id, {
          email: body.email,
        });

      if (authUpdateError) {
        console.error("Auth email update error:", authUpdateError);
        return NextResponse.json(
          { error: "Failed to update auth email" },
          { status: 500 }
        );
      }
    }

    updateData.updated_at = new Date().toISOString();

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update student profile" },
        { status: 500 }
      );
    }

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Admin update student error:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}
