"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Globe,
  Star,
  Play,
  RefreshCw,
  Download,
  Filter,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Lead {
  id: string;
  name: string;
  source: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  category?: string;
  rating?: number;
  query: string;
  region: string;
  collected_at: string;
}

type RunType = "google_maps" | "google_search" | "contact_info";

const sourceLabels: Record<string, string> = {
  google_maps: "Google Maps",
  google_search: "Google Search",
};

const regions = [
  "All Regions",
  "Gurugram",
  "Delhi",
  "Noida",
  "Faridabad",
  "Ghaziabad",
  "Greater Noida",
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<RunType | null>(null);
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [lastRunResult, setLastRunResult] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (regionFilter !== "All Regions") params.set("region", regionFilter);
    if (sourceFilter) params.set("source", sourceFilter);

    try {
      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();
      if (!data.error) {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error("Failed to fetch leads:", e);
    } finally {
      setLoading(false);
    }
  }, [page, regionFilter, sourceFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const runScraper = async (type: RunType) => {
    setRunning(type);
    setLastRunResult(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        const count = data.leadsCollected ?? data.leadsEnriched ?? 0;
        setLastRunResult(
          `${type === "contact_info" ? "Enriched" : "Collected"} ${count} leads via ${type.replace("_", " ")}`
        );
        fetchLeads();
      } else {
        setLastRunResult(`Error: ${data.error}`);
      }
    } catch (e) {
      setLastRunResult(`Failed: ${e}`);
    } finally {
      setRunning(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Phone", "Email", "Website", "Address", "Category", "Rating", "Region", "Source", "Query"];
    const rows = leads.map((l) => [
      l.name, l.phone || "", l.email || "", l.website || "",
      l.address || "", l.category || "", l.rating?.toString() || "",
      l.region, l.source, l.query,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${regionFilter.toLowerCase().replace(/\s/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-amber" />
            Lead Generation
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Delhi NCR Parents (Age 35-50) · Class 11-12 · Tier 1 Cities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">{total} leads</Badge>
          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-border text-sm text-text-muted hover:text-text-primary hover:border-amber/30 transition-colors disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Scraper Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([
          {
            type: "google_maps" as RunType,
            icon: MapPin,
            label: "Google Maps Scraper",
            desc: "Schools, coaching centers, education hubs",
            color: "text-success",
          },
          {
            type: "google_search" as RunType,
            icon: Search,
            label: "Google Search Scraper",
            desc: "Parent communities, school directories",
            color: "text-indigo",
          },
          {
            type: "contact_info" as RunType,
            icon: Phone,
            label: "Contact Enrichment",
            desc: "Extract emails & phones from websites",
            color: "text-amber",
          },
        ]).map((scraper) => (
          <motion.div
            key={scraper.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <scraper.icon className={cn("h-5 w-5", scraper.color)} />
                <h3 className="font-heading font-bold text-sm text-text-primary">
                  {scraper.label}
                </h3>
              </div>
              <p className="text-xs text-text-muted mb-4 flex-1">
                {scraper.desc}
              </p>
              <button
                onClick={() => runScraper(scraper.type)}
                disabled={running !== null}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-all",
                  running === scraper.type
                    ? "bg-amber/20 text-amber cursor-wait"
                    : "bg-amber/10 text-amber hover:bg-amber/20 disabled:opacity-40"
                )}
              >
                {running === scraper.type ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run
                  </>
                )}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      {lastRunResult && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "px-4 py-3 rounded-lg text-sm",
            lastRunResult.startsWith("Error") || lastRunResult.startsWith("Failed")
              ? "bg-danger/10 text-danger border border-danger/20"
              : "bg-success/10 text-success border border-success/20"
          )}
        >
          {lastRunResult}
        </motion.div>
      )}

      {/* Filters */}
      <Card className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-text-muted" />
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => { setRegionFilter(r); setPage(1); }}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                regionFilter === r
                  ? "bg-amber/15 text-amber"
                  : "bg-white/5 text-text-muted hover:text-text-primary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-border mx-1" />
        <div className="flex gap-2">
          {["", "google_maps", "google_search"].map((s) => (
            <button
              key={s}
              onClick={() => { setSourceFilter(s); setPage(1); }}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                sourceFilter === s
                  ? "bg-indigo/15 text-indigo"
                  : "bg-white/5 text-text-muted hover:text-text-primary"
              )}
            >
              {s ? sourceLabels[s] : "All Sources"}
            </button>
          ))}
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="p-0 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-8 w-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm">
              No leads yet. Run a scraper above to start collecting.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Region</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Rating</th>
                <th className="px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr
                  key={lead.id}
                  className={cn(
                    "hover:bg-white/[0.02] transition-colors",
                    i < leads.length - 1 && "border-b border-border"
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary truncate max-w-[200px]">
                      {lead.name}
                    </p>
                    {lead.address && (
                      <p className="text-xs text-text-muted truncate max-w-[200px] mt-0.5">
                        {lead.address}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-amber transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </a>
                      )}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-amber transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </a>
                      )}
                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-amber transition-colors"
                        >
                          <Globe className="h-3 w-3" />
                          Website
                        </a>
                      )}
                      {!lead.phone && !lead.email && !lead.website && (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {lead.category ? (
                      <Badge variant="default">{lead.category}</Badge>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      {lead.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {lead.rating ? (
                      <span className="flex items-center gap-1 text-xs text-amber">
                        <Star className="h-3 w-3 fill-current" />
                        {lead.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={lead.source === "google_maps" ? "success" : "indigo"}
                    >
                      {sourceLabels[lead.source] || lead.source}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {total > 50 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Page {page} of {Math.ceil(total / 50)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded-lg text-xs bg-white/5 text-text-muted hover:text-text-primary disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 50)}
                className="px-3 py-1 rounded-lg text-xs bg-white/5 text-text-muted hover:text-text-primary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
