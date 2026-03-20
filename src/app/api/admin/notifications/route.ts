import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, cohortId, title, message, type } = body as {
      studentId?: string;
      cohortId?: string;
      title: string;
      message: string;
      type: string;
    };

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "title, message, and type are required" },
        { status: 400 }
      );
    }

    if (!studentId && !cohortId) {
      return NextResponse.json(
        { error: "Either studentId or cohortId is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Verify requester is founder or admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: requesterProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !requesterProfile ||
      !["founder", "admin"].includes(requesterProfile.role)
    ) {
      return NextResponse.json(
        { error: "Forbidden: admin access required" },
        { status: 403 }
      );
    }

    const notifications: Array<{
      student_id: string;
      title: string;
      message: string;
      type: string;
    }> = [];

    if (studentId) {
      // Send notification to a single student
      notifications.push({
        student_id: studentId,
        title,
        message,
        type,
      });
    } else if (cohortId) {
      // Get all enrolled students in the cohort
      const { data: students, error: studentsError } = await supabase
        .from("profiles")
        .select("id")
        .eq("cohort_id", cohortId)
        .eq("status", "enrolled");

      if (studentsError) {
        console.error("Fetch students error:", studentsError);
        return NextResponse.json(
          { error: "Failed to fetch cohort students" },
          { status: 500 }
        );
      }

      if (!students || students.length === 0) {
        return NextResponse.json(
          { error: "No enrolled students found in this cohort" },
          { status: 404 }
        );
      }

      for (const student of students) {
        notifications.push({
          student_id: student.id,
          title,
          message,
          type,
        });
      }
    }

    // Insert all notifications
    const { error: insertError } = await supabase
      .from("notifications")
      .insert(notifications);

    if (insertError) {
      console.error("Notification insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to send notifications" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: notifications.length,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
