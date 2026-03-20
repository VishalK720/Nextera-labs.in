"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Plus, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const weekOptions = [
  { value: "1", label: "Week 1 — Foundations" },
  { value: "2", label: "Week 2 — Python for AI" },
  { value: "3", label: "Week 3 — AI Apps" },
  { value: "4", label: "Week 4 — Advanced AI" },
  { value: "5", label: "Week 5 — Capstone Dev" },
  { value: "6", label: "Week 6 — Launch" },
];

const suggestedTech = [
  "Next.js", "React", "Python", "Claude API", "Streamlit",
  "Tailwind CSS", "Node.js", "Supabase", "MongoDB", "Express",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [week, setWeek] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [techTags, setTechTags] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addTech = (tag: string) => {
    const t = tag.trim();
    if (t && !techTags.includes(t)) {
      setTechTags((prev) => [...prev, t]);
    }
    setCustomTech("");
  };

  const removeTech = (tag: string) => {
    setTechTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !week) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dashboard/projects");
  };

  const isValid = name.trim() && description.trim() && week;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-background-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-amber/10 flex items-center justify-center">
            <Rocket className="h-5 w-5 text-amber" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-text-primary">New Project</h2>
            <p className="text-xs text-text-muted">Start building something awesome</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Study Planner"
              className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors"
              maxLength={60}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your project do? What problem does it solve?"
              rows={3}
              className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors resize-none"
              maxLength={300}
            />
            <p className="text-xs text-text-muted text-right">{description.length}/300</p>
          </div>

          {/* Week */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Associated Week</label>
            <select
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-amber/50 transition-colors appearance-none"
            >
              <option value="" className="bg-background">Select a week</option>
              {weekOptions.map((w) => (
                <option key={w.value} value={w.value} className="bg-background">
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Tech Stack</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {techTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-amber/10 text-amber px-2 py-1 rounded-md"
                >
                  {tag}
                  <button type="button" onClick={() => removeTech(tag)} className="hover:text-danger">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech(customTech);
                  }
                }}
                placeholder="Add technology..."
                className="flex-1 bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => addTech(customTech)}
                className="px-3 py-2 rounded-lg bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestedTech
                .filter((t) => !techTags.includes(t))
                .slice(0, 6)
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTech(t)}
                    className="text-[11px] px-2 py-1 rounded-md bg-white/[0.03] border border-border text-text-muted hover:text-text-primary hover:border-amber/30 transition-colors"
                  >
                    + {t}
                  </button>
                ))}
            </div>
          </div>

          {/* GitHub Repo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">
              GitHub Repo URL <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 font-semibold text-sm rounded-lg px-4 py-3 transition-all",
              isValid && !submitting
                ? "bg-amber hover:bg-amber-hover text-background"
                : "bg-white/5 text-text-muted cursor-not-allowed"
            )}
          >
            {submitting ? (
              <span className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
