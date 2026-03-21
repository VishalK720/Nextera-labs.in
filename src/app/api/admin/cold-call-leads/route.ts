import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Tier 1 cities in India
const TIER_1_CITIES = [
  "mumbai",
  "delhi",
  "new delhi",
  "bangalore",
  "bengaluru",
  "hyderabad",
  "ahmedabad",
  "chennai",
  "kolkata",
  "pune",
  "jaipur",
  "lucknow",
  "kanpur",
  "nagpur",
  "indore",
  "thane",
  "bhopal",
  "visakhapatnam",
  "vizag",
  "patna",
  "vadodara",
  "ghaziabad",
  "ludhiana",
  "agra",
  "nashik",
  "faridabad",
  "meerut",
  "rajkot",
  "varanasi",
  "srinagar",
  "aurangabad",
  "dhanbad",
  "amritsar",
  "navi mumbai",
  "allahabad",
  "prayagraj",
  "howrah",
  "ranchi",
  "gwalior",
  "jabalpur",
  "coimbatore",
  "vijayawada",
  "jodhpur",
  "madurai",
  "raipur",
  "kota",
  "chandigarh",
  "guwahati",
  "solapur",
  "hubli",
  "tiruchirappalli",
  "trichy",
  "bareilly",
  "moradabad",
  "mysore",
  "mysuru",
  "tiruppur",
  "gurgaon",
  "gurugram",
  "noida",
  "greater noida",
];

// Tier 2 cities in India
const TIER_2_CITIES = [
  "dehradun",
  "udaipur",
  "shimla",
  "mangalore",
  "mangaluru",
  "belgaum",
  "belagavi",
  "ajmer",
  "bhilai",
  "gorakhpur",
  "jamshedpur",
  "bhiwandi",
  "amravati",
  "nanded",
  "kolhapur",
  "bikaner",
  "warangal",
  "siliguri",
  "bhubaneswar",
  "jamnagar",
  "bhavnagar",
  "tirunelveli",
  "tirupati",
  "guntur",
  "ujjain",
  "muzaffarpur",
  "bokaro",
  "rohtak",
  "panipat",
  "karnal",
  "hisar",
  "mathura",
  "aligarh",
  "bilaspur",
  "korba",
  "latur",
  "satara",
  "sangli",
  "jammu",
  "pondicherry",
  "puducherry",
  "thanjavur",
  "salem",
  "erode",
  "vellore",
  "durgapur",
  "asansol",
  "nellore",
  "anantapur",
  "kakinada",
  "rajahmundry",
  "kharagpur",
  "sambalpur",
  "cuttack",
  "rourkela",
  "bhilwara",
  "alwar",
  "bharatpur",
  "patiala",
  "bathinda",
  "jalandhar",
  "haldwani",
  "haridwar",
  "rishikesh",
  "muzaffarnagar",
  "saharanpur",
  "firozabad",
  "etawah",
  "mirzapur",
  "jhansi",
  "sultanpur",
  "silchar",
  "dibrugarh",
  "jorhat",
  "tezpur",
  "imphal",
  "aizawl",
  "shillong",
  "agartala",
  "gangtok",
  "itanagar",
  "kohima",
  "dhule",
  "jalgaon",
  "akola",
  "chandrapur",
  "ichalkaranji",
  "parbhani",
  "bhusawal",
  "ahmednagar",
  "ratnagiri",
  "karad",
  "anand",
  "junagadh",
  "navsari",
  "surendranagar",
  "mehsana",
  "godhra",
  "bharuch",
  "gandhidham",
  "porbandar",
  "hospet",
  "bellary",
  "ballari",
  "davangere",
  "davanagere",
  "hassan",
  "shimoga",
  "shivamogga",
  "tumkur",
  "tumakuru",
  "bidar",
  "raichur",
  "udupi",
  "karwar",
  "thrissur",
  "kozhikode",
  "calicut",
  "kochi",
  "ernakulam",
  "kollam",
  "trivandrum",
  "thiruvananthapuram",
  "palakkad",
  "kottayam",
  "alappuzha",
  "kannur",
  "malappuram",
];

function matchesCityTier(city: string, tier: string): boolean {
  const normalized = city.toLowerCase().trim();
  if (tier === "tier1") return TIER_1_CITIES.includes(normalized);
  if (tier === "tier2") return TIER_2_CITIES.includes(normalized);
  return TIER_1_CITIES.includes(normalized) || TIER_2_CITIES.includes(normalized);
}

function getCityTier(city: string): "Tier 1" | "Tier 2" | "Other" {
  const normalized = city.toLowerCase().trim();
  if (TIER_1_CITIES.includes(normalized)) return "Tier 1";
  if (TIER_2_CITIES.includes(normalized)) return "Tier 2";
  return "Other";
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["founder", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const tier = searchParams.get("tier") || "all"; // tier1, tier2, all
    const status = searchParams.get("status"); // filter by application status
    const format = searchParams.get("format") || "json"; // json or csv

    // Fetch all applications with phone numbers
    const { data: applications, error } = await supabase
      .from("applications")
      .select(
        "id, full_name, email, phone, whatsapp, class, city, state, school, age, status, heard_from, why_nextera, rating, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    // Filter leads
    let leads = (applications ?? []).filter((app) => {
      // Must have a phone number
      if (!app.phone) return false;

      // City tier filter
      if (app.city && tier !== "all") {
        if (!matchesCityTier(app.city, tier)) return false;
      } else if (!app.city && tier !== "all") {
        return false;
      }

      // Status filter - by default exclude already enrolled
      if (status) {
        if (app.status !== status) return false;
      } else {
        // For cold calling, target non-enrolled leads
        if (app.status === "enrolled") return false;
      }

      return true;
    });

    // Only keep tier 1 and tier 2 when tier=all (exclude "Other")
    if (tier === "all") {
      leads = leads.filter(
        (app) => app.city && getCityTier(app.city) !== "Other"
      );
    }

    // Enrich with tier info and sort by priority
    const priorityOrder: Record<string, number> = {
      meet_completed: 1, // Already had a meet - warm lead
      meet_scheduled: 2, // Scheduled but didn't complete
      accepted: 3, // Accepted but not enrolled - HOT
      waitlisted: 4, // Waitlisted - might convert with push
      pending: 5, // Fresh leads
      rejected: 6,
    };

    const enrichedLeads = leads
      .map((app) => ({
        id: app.id,
        name: app.full_name,
        phone: app.phone,
        whatsapp: app.whatsapp || app.phone,
        email: app.email,
        city: app.city,
        state: app.state,
        cityTier: app.city ? getCityTier(app.city) : "Unknown",
        class: app.class,
        school: app.school,
        age: app.age,
        status: app.status,
        heardFrom: app.heard_from,
        whyNextera: app.why_nextera,
        rating: app.rating,
        appliedAt: app.created_at,
        priority:
          priorityOrder[app.status as string] ?? 99,
        callScript: generateCallScript(app),
      }))
      .sort((a, b) => a.priority - b.priority);

    // CSV export
    if (format === "csv") {
      const csvHeader =
        "Priority,Name,Phone,WhatsApp,Email,City,State,Tier,Class,School,Status,Source,Applied Date\n";
      const csvRows = enrichedLeads
        .map(
          (l) =>
            `${l.priority},"${l.name}","${l.phone}","${l.whatsapp}","${l.email}","${l.city}","${l.state}","${l.cityTier}","${l.class}","${l.school}","${l.status}","${l.heardFrom}","${new Date(l.appliedAt).toLocaleDateString("en-IN")}"`
        )
        .join("\n");

      return new NextResponse(csvHeader + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="cold-call-leads-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Summary stats
    const summary = {
      totalLeads: enrichedLeads.length,
      tier1Count: enrichedLeads.filter((l) => l.cityTier === "Tier 1").length,
      tier2Count: enrichedLeads.filter((l) => l.cityTier === "Tier 2").length,
      byStatus: Object.entries(
        enrichedLeads.reduce(
          (acc, l) => {
            acc[l.status] = (acc[l.status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([status, count]) => ({ status, count })),
      hotLeads: enrichedLeads.filter((l) => l.priority <= 3).length,
      warmLeads: enrichedLeads.filter(
        (l) => l.priority > 3 && l.priority <= 5
      ).length,
    };

    return NextResponse.json({
      summary,
      leads: enrichedLeads,
      sessionTarget: {
        date: "2025-03-28",
        goal: "80-100 attendees → 25 paying students",
        conversionNeeded: "25-31%",
      },
    });
  } catch (error) {
    console.error("Cold call leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cold call leads" },
      { status: 500 }
    );
  }
}

interface ApplicationRow {
  full_name: string;
  status: string;
  city: string;
  class: string;
  why_nextera: string;
}

function generateCallScript(app: ApplicationRow): string {
  const name = app.full_name?.split(" ")[0] || "there";
  const statusScripts: Record<string, string> = {
    accepted: `Hi, am I speaking with ${name}'s parent? This is from Nextera Labs. ${name} was selected for our program! We have a free live session on March 28 where we'll show exactly what ${name} will build. Can I share the link?`,
    meet_completed: `Hi, this is Nextera Labs. We had a great session with ${name} earlier. We're hosting a special free session on March 28 — it would be amazing to have ${name} join. Are you available?`,
    meet_scheduled: `Hi, this is Nextera Labs calling about ${name}'s application. We noticed the meet was scheduled but couldn't happen. We have a free group session on March 28 — would that work better?`,
    waitlisted: `Hi, am I speaking with ${name}'s parent? Great news from Nextera Labs — we're opening a few spots and hosting a free session on March 28. ${name} had applied earlier and we'd love to have them join!`,
    pending: `Hi, this is Nextera Labs. ${name} had shown interest in learning to build apps. We're hosting a free live session on March 28 where students will see real projects built by teens. Would ${name} like to join?`,
  };

  return (
    statusScripts[app.status] ||
    `Hi, this is Nextera Labs. We're hosting a free session on March 28 for students interested in building tech projects. Would you like to join?`
  );
}
