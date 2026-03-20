import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const cohortId = request.nextUrl.searchParams.get("cohortId");
    const supabase = await createServerSupabaseClient();

    // Total applications
    const { count: totalApps } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true });

    // Accepted applications
    const { count: accepted } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in("status", ["accepted", "enrolled"]);

    // Enrolled & paid
    const { count: enrolled } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    // Total revenue
    const { data: payments } = await supabase
      .from("payments")
      .select("final_amount")
      .eq("status", "paid");

    const totalRevenue = (payments ?? []).reduce((sum, p) => sum + p.final_amount, 0);

    // Active students
    const { count: activeStudents } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")
      .eq("is_active", true);

    // Recent applications
    const { data: recentApps } = await supabase
      .from("applications")
      .select("id, full_name, city, class, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    // At-risk students (0 streak, inactive for >3 days)
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
    const { data: atRisk } = await supabase
      .from("profiles")
      .select("id, full_name, streak_days, last_active_at, current_week")
      .eq("role", "student")
      .eq("is_active", true)
      .lt("last_active_at", threeDaysAgo)
      .order("last_active_at")
      .limit(5);

    // Pending applications count
    const { count: pendingCount } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    return NextResponse.json({
      stats: {
        totalApplications: totalApps ?? 0,
        accepted: accepted ?? 0,
        enrolledPaid: enrolled ?? 0,
        totalRevenue,
        activeStudents: activeStudents ?? 0,
      },
      recentApplications: (recentApps ?? []).map((a) => ({
        id: a.id,
        name: a.full_name,
        city: a.city,
        class: a.class,
        status: a.status,
        time: a.created_at,
      })),
      atRiskStudents: (atRisk ?? []).map((s) => ({
        id: s.id,
        name: s.full_name,
        streak: s.streak_days,
        lastActive: s.last_active_at,
        week: s.current_week ?? 1,
      })),
      pendingCount: pendingCount ?? 0,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
