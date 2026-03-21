"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Download,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Flame,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  cityTier: "Tier 1" | "Tier 2" | "Other";
  class: string;
  school: string;
  age: number | null;
  status: string;
  heardFrom: string;
  whyNextera: string;
  rating: number | null;
  appliedAt: string;
  priority: number;
  callScript: string;
}

interface LeadsSummary {
  totalLeads: number;
  tier1Count: number;
  tier2Count: number;
  byStatus: { status: string; count: number }[];
  hotLeads: number;
  warmLeads: number;
}

interface LeadsData {
  summary: LeadsSummary;
  leads: Lead[];
  sessionTarget: {
    date: string;
    goal: string;
    conversionNeeded: string;
  };
}

const statusColors: Record<string, string> = {
  accepted: "bg-success/15 text-success",
  meet_completed: "bg-indigo/15 text-indigo",
  meet_scheduled: "bg-amber/15 text-amber",
  waitlisted: "bg-purple-500/15 text-purple-400",
  pending: "bg-white/10 text-text-muted",
  rejected: "bg-danger/15 text-danger",
};

const priorityLabels: Record<number, { label: string; color: string }> = {
  1: { label: "HOT", color: "bg-danger/20 text-danger" },
  2: { label: "WARM", color: "bg-amber/20 text-amber" },
  3: { label: "HOT", color: "bg-danger/20 text-danger" },
  4: { label: "WARM", color: "bg-amber/20 text-amber" },
  5: { label: "FRESH", color: "bg-indigo/20 text-indigo" },
};

export default function ColdCallLeads() {
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "Tier 1" | "Tier 2">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [calledIds, setCalledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/cold-call-leads")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    return data.leads.filter((lead) => {
      if (tierFilter !== "all" && lead.cityTier !== tierFilter) return false;
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          lead.name.toLowerCase().includes(q) ||
          lead.city?.toLowerCase().includes(q) ||
          lead.phone.includes(q) ||
          lead.school?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data, search, tierFilter, statusFilter]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const markCalled = (id: string) => {
    setCalledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const downloadCSV = () => {
    window.open("/api/admin/cold-call-leads?format=csv", "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-text-muted">Failed to load leads. Check auth.</p>
      </div>
    );
  }

  const { summary } = data;
  const progress = calledIds.size;
  const progressPct =
    filteredLeads.length > 0
      ? Math.round((progress / filteredLeads.length) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary">
            Cold Call Dashboard
          </h2>
          <p className="text-sm text-text-muted mt-1">
            March 28 Free Session — Target: 80-100 attendees, 25 paying
          </p>
        </div>
        <Button onClick={downloadCSV} variant="ghost" size="sm">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          {
            label: "Total Leads",
            value: summary.totalLeads,
            icon: Users,
            color: "text-indigo",
          },
          {
            label: "Hot Leads",
            value: summary.hotLeads,
            icon: Flame,
            color: "text-danger",
          },
          {
            label: "Warm Leads",
            value: summary.warmLeads,
            icon: Target,
            color: "text-amber",
          },
          {
            label: "Tier 1 Cities",
            value: summary.tier1Count,
            icon: MapPin,
            color: "text-success",
          },
          {
            label: "Tier 2 Cities",
            value: summary.tier2Count,
            icon: MapPin,
            color: "text-indigo",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4">
              <stat.icon className={cn("h-4 w-4 mb-2", stat.color)} />
              <p className="text-2xl font-bold font-heading text-text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Call Progress
          </span>
          <span className="text-xs text-text-muted">
            {progress}/{filteredLeads.length} called ({progressPct}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, city, phone, school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg bg-background-card border border-border text-sm text-text-primary placeholder:text-text-muted focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={tierFilter}
            onChange={(e) =>
              setTierFilter(e.target.value as "all" | "Tier 1" | "Tier 2")
            }
            className="h-10 px-3 rounded-lg bg-background-card border border-border text-sm text-text-primary focus:border-amber/50 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-background-card border border-border text-sm text-text-primary focus:border-amber/50 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="meet_completed">Meet Completed</option>
            <option value="meet_scheduled">Meet Scheduled</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Lead Count */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-text-muted" />
        <span className="text-sm text-text-muted">
          Showing {filteredLeads.length} leads
        </span>
      </div>

      {/* Leads List */}
      <div className="space-y-2">
        {filteredLeads.map((lead, i) => {
          const isExpanded = expandedId === lead.id;
          const isCalled = calledIds.has(lead.id);
          const pInfo = priorityLabels[lead.priority];

          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
            >
              <Card
                className={cn(
                  "p-0 overflow-hidden transition-colors",
                  isCalled && "opacity-60"
                )}
              >
                {/* Main Row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02]"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : lead.id)
                  }
                >
                  {/* Priority Badge */}
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                      pInfo?.color ?? "bg-white/10 text-text-muted"
                    )}
                  >
                    {pInfo?.label ?? "LOW"}
                  </span>

                  {/* Name & City */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isCalled
                          ? "text-text-muted line-through"
                          : "text-text-primary"
                      )}
                    >
                      {lead.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {lead.city}
                      {lead.state ? `, ${lead.state}` : ""} ·{" "}
                      <span
                        className={
                          lead.cityTier === "Tier 1"
                            ? "text-success"
                            : "text-indigo"
                        }
                      >
                        {lead.cityTier}
                      </span>{" "}
                      · Class {lead.class}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2 py-1 rounded-full capitalize hidden sm:block",
                      statusColors[lead.status] ?? "bg-white/10 text-text-muted"
                    )}
                  >
                    {lead.status.replace("_", " ")}
                  </span>

                  {/* Phone */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(lead.phone, lead.id);
                    }}
                    className="flex items-center gap-1.5 text-sm text-amber hover:text-amber-hover transition-colors shrink-0"
                    title="Copy phone"
                  >
                    {copiedId === lead.id ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden md:inline font-mono">
                      {lead.phone}
                    </span>
                  </button>

                  {/* Call link */}
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors shrink-0"
                    title="Call now"
                  >
                    <Phone className="h-4 w-4" />
                  </a>

                  {/* Mark called */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markCalled(lead.id);
                    }}
                    className={cn(
                      "p-2 rounded-lg transition-colors shrink-0",
                      isCalled
                        ? "bg-success/20 text-success"
                        : "bg-white/5 text-text-muted hover:bg-white/10"
                    )}
                    title={isCalled ? "Unmark" : "Mark as called"}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>

                  {/* Expand */}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                    {/* Call Script */}
                    <div className="p-3 rounded-lg bg-amber/5 border border-amber/10">
                      <p className="text-xs font-semibold text-amber mb-1 uppercase tracking-wider">
                        Call Script
                      </p>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {lead.callScript}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(lead.callScript, `script-${lead.id}`)
                        }
                        className="mt-2 text-xs text-amber hover:text-amber-hover flex items-center gap-1"
                      >
                        {copiedId === `script-${lead.id}` ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy script
                          </>
                        )}
                      </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-text-muted">School</span>
                        <p className="text-text-primary font-medium mt-0.5">
                          {lead.school || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-muted">WhatsApp</span>
                        <p className="text-text-primary font-medium mt-0.5 font-mono">
                          {lead.whatsapp || lead.phone}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-muted">Email</span>
                        <p className="text-text-primary font-medium mt-0.5 truncate">
                          {lead.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-muted">Source</span>
                        <p className="text-text-primary font-medium mt-0.5 capitalize">
                          {lead.heardFrom || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Why Nextera */}
                    {lead.whyNextera && (
                      <div>
                        <span className="text-xs text-text-muted">
                          Why they applied
                        </span>
                        <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
                          {lead.whyNextera}
                        </p>
                      </div>
                    )}

                    {/* WhatsApp Link */}
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${(lead.whatsapp || lead.phone).replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-success hover:text-success/80 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open WhatsApp
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-indigo hover:text-indigo/80 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Send Email
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}

        {filteredLeads.length === 0 && (
          <Card className="py-12 text-center">
            <p className="text-text-muted">
              No leads match your filters.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
