import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import apifyClient, {
  LEAD_GEN_CONFIG,
  APIFY_ACTORS,
  type Lead,
} from "@/lib/apify";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["founder", "admin"].includes(profile.role)) return null;
  return { user, supabase };
}

// GET: Fetch stored leads
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const source = searchParams.get("source");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = auth.supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("collected_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (region) query = query.eq("region", region);
    if (source) query = query.eq("source", source);

    const { data: leads, error, count } = await query;

    if (error) {
      console.error("Leads fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads, total: count, page, limit });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Trigger a new lead generation run
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { type } = body as { type: "google_maps" | "google_search" | "contact_info" };

    if (!type) {
      return NextResponse.json(
        { error: "type is required (google_maps | google_search | contact_info)" },
        { status: 400 }
      );
    }

    let runResult;

    if (type === "google_maps") {
      // Scrape Google Maps for schools, coaching centers, etc.
      const run = await apifyClient
        .actor(APIFY_ACTORS.GOOGLE_MAPS_SCRAPER)
        .call({
          searchStringsArray: LEAD_GEN_CONFIG.googleMapsQueries,
          maxCrawledPlacesPerSearch: 50,
          language: "en",
          deeperCityScrape: false,
        });

      const { items } = await apifyClient
        .dataset(run.defaultDatasetId)
        .listItems();

      const leads: Lead[] = items.map((item: Record<string, unknown>, i: number) => ({
        id: `gm_${Date.now()}_${i}`,
        name: (item.title as string) || (item.name as string) || "Unknown",
        source: "google_maps",
        phone: (item.phone as string) || (item.phoneUnformatted as string) || undefined,
        email: (item.email as string) || undefined,
        website: (item.website as string) || (item.url as string) || undefined,
        address: (item.address as string) || (item.street as string) || undefined,
        category: (item.categoryName as string) || (item.category as string) || undefined,
        rating: (item.totalScore as number) || (item.rating as number) || undefined,
        query: (item.searchString as string) || "",
        region: extractRegion((item.address as string) || (item.city as string) || ""),
        collectedAt: new Date().toISOString(),
      }));

      // Store leads in Supabase
      if (leads.length > 0) {
        const { error: insertError } = await auth.supabase
          .from("leads")
          .upsert(
            leads.map((l) => ({
              id: l.id,
              name: l.name,
              source: l.source,
              phone: l.phone,
              email: l.email,
              website: l.website,
              address: l.address,
              category: l.category,
              rating: l.rating,
              query: l.query,
              region: l.region,
              collected_at: l.collectedAt,
            })),
            { onConflict: "id" }
          );

        if (insertError) console.error("Lead insert error:", insertError);
      }

      runResult = {
        actorRunId: run.id,
        leadsCollected: leads.length,
        type: "google_maps",
      };
    } else if (type === "google_search") {
      // Scrape Google Search for parent communities, school directories
      const run = await apifyClient
        .actor(APIFY_ACTORS.GOOGLE_SEARCH_SCRAPER)
        .call({
          queries: LEAD_GEN_CONFIG.googleSearchQueries.join("\n"),
          maxPagesPerQuery: 3,
          resultsPerPage: 20,
          languageCode: "en",
          countryCode: "in",
        });

      const { items } = await apifyClient
        .dataset(run.defaultDatasetId)
        .listItems();

      const leads: Lead[] = items.map((item: Record<string, unknown>, i: number) => ({
        id: `gs_${Date.now()}_${i}`,
        name: (item.title as string) || "Unknown",
        source: "google_search",
        website: (item.url as string) || (item.link as string) || undefined,
        address: (item.displayedUrl as string) || undefined,
        query: (item.searchQuery as string) || "",
        region: "Delhi NCR",
        collectedAt: new Date().toISOString(),
      }));

      if (leads.length > 0) {
        const { error: insertError } = await auth.supabase
          .from("leads")
          .upsert(
            leads.map((l) => ({
              id: l.id,
              name: l.name,
              source: l.source,
              phone: l.phone,
              email: l.email,
              website: l.website,
              address: l.address,
              category: l.category,
              query: l.query,
              region: l.region,
              collected_at: l.collectedAt,
            })),
            { onConflict: "id" }
          );

        if (insertError) console.error("Lead insert error:", insertError);
      }

      runResult = {
        actorRunId: run.id,
        leadsCollected: leads.length,
        type: "google_search",
      };
    } else if (type === "contact_info") {
      // Extract contact info from websites already collected
      const { data: existingLeads } = await auth.supabase
        .from("leads")
        .select("id, website")
        .not("website", "is", null)
        .is("email", null)
        .is("phone", null)
        .limit(100);

      if (!existingLeads || existingLeads.length === 0) {
        return NextResponse.json(
          { error: "No leads with websites to enrich. Run google_maps or google_search first." },
          { status: 400 }
        );
      }

      const urls = existingLeads
        .map((l: { website: string }) => l.website)
        .filter(Boolean);

      const run = await apifyClient
        .actor(APIFY_ACTORS.CONTACT_INFO_SCRAPER)
        .call({
          startUrls: urls.map((url: string) => ({ url })),
          maxRequestsPerStartUrl: 5,
        });

      const { items } = await apifyClient
        .dataset(run.defaultDatasetId)
        .listItems();

      // Update existing leads with contact info
      let enrichedCount = 0;
      for (const item of items) {
        const typedItem = item as Record<string, unknown>;
        const matchingLead = existingLeads.find(
          (l: { website: string }) =>
            l.website && (typedItem.url as string || "").includes(new URL(l.website).hostname)
        );
        if (matchingLead) {
          const emails = typedItem.emails as string[] | undefined;
          const phones = typedItem.phones as string[] | undefined;
          await auth.supabase
            .from("leads")
            .update({
              email: emails?.[0] || undefined,
              phone: phones?.[0] || undefined,
            })
            .eq("id", matchingLead.id);
          enrichedCount++;
        }
      }

      runResult = {
        actorRunId: run.id,
        leadsEnriched: enrichedCount,
        type: "contact_info",
      };
    }

    return NextResponse.json({ success: true, ...runResult });
  } catch (error) {
    console.error("Lead generation error:", error);
    return NextResponse.json(
      { error: "Failed to run lead generation" },
      { status: 500 }
    );
  }
}

function extractRegion(address: string): string {
  const lower = address.toLowerCase();
  if (lower.includes("gurugram") || lower.includes("gurgaon")) return "Gurugram";
  if (lower.includes("noida")) return "Noida";
  if (lower.includes("greater noida")) return "Greater Noida";
  if (lower.includes("faridabad")) return "Faridabad";
  if (lower.includes("ghaziabad")) return "Ghaziabad";
  if (lower.includes("delhi")) return "Delhi";
  return "Delhi NCR";
}
