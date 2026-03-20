import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const applicationSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  class: z.enum(["11", "12"], { message: "Class must be 11 or 12" }),
  city: z.string().min(2, "City must be at least 2 characters"),
  school: z.string().min(2, "School name must be at least 2 characters"),
  why_nextera: z
    .string()
    .min(50, "Please write at least 50 characters about why you want to join"),
  built_before: z.string().optional(),
  dream_project: z.string().optional(),
  heard_from: z.enum([
    "instagram",
    "twitter",
    "linkedin",
    "youtube",
    "friend",
    "school",
    "google",
    "other",
  ]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createServerSupabaseClient();

    // Check for duplicate email
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 409 }
      );
    }

    // Get current active cohort
    const { data: cohort, error: cohortError } = await supabase
      .from("cohorts")
      .select("id")
      .eq("status", "accepting_applications")
      .single();

    if (cohortError || !cohort) {
      return NextResponse.json(
        { error: "No active cohort accepting applications at this time" },
        { status: 404 }
      );
    }

    // Insert application
    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        class: data.class,
        city: data.city,
        school: data.school,
        why_nextera: data.why_nextera,
        built_before: data.built_before || null,
        dream_project: data.dream_project || null,
        heard_from: data.heard_from,
        cohort_id: cohort.id,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Application insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, applicationId: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply API error:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}
