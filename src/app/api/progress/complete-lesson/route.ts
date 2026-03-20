import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const LESSON_COMPLETE_POINTS = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, lessonId } = body as {
      studentId: string;
      lessonId: string;
    };

    if (!studentId || !lessonId) {
      return NextResponse.json(
        { error: "studentId and lessonId are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Upsert student progress
    const { error: progressError } = await supabase
      .from("student_progress")
      .upsert(
        {
          student_id: studentId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "student_id,lesson_id" }
      );

    if (progressError) {
      console.error("Progress upsert error:", progressError);
      return NextResponse.json(
        { error: "Failed to update progress" },
        { status: 500 }
      );
    }

    // Award points - insert into points_log
    const { error: pointsLogError } = await supabase
      .from("points_log")
      .insert({
        student_id: studentId,
        reason_code: "lesson_complete",
        points: LESSON_COMPLETE_POINTS,
        lesson_id: lessonId,
      });

    if (pointsLogError) {
      console.error("Points log error:", pointsLogError);
      return NextResponse.json(
        { error: "Failed to award points" },
        { status: 500 }
      );
    }

    // Update student's total_points in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_points")
      .eq("id", studentId)
      .single();

    const currentPoints = profile?.total_points ?? 0;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ total_points: currentPoints + LESSON_COMPLETE_POINTS })
      .eq("id", studentId);

    if (updateError) {
      console.error("Profile points update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update total points" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: LESSON_COMPLETE_POINTS,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    return NextResponse.json(
      { error: "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
