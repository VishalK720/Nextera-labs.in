"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Save,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

type Tab = "profile" | "notifications" | "account";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [name, setName] = useState("Arjun Mehta");
  const [bio, setBio] = useState("Curious builder exploring the intersection of AI and education.");
  const [city, setCity] = useState("Delhi");
  const [school, setSchool] = useState("Delhi Public School");
  const [classYear, setClassYear] = useState("11");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Notification state
  const [emailNewLesson, setEmailNewLesson] = useState(true);
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(true);
  const [emailMentor, setEmailMentor] = useState(true);
  const [pushLiveSession, setPushLiveSession] = useState(true);
  const [pushLeaderboard, setPushLeaderboard] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Settings className="h-5 w-5 text-text-muted" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-text-primary">Settings</h2>
          <p className="text-xs text-text-muted">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Tab Row */}
      <div className="flex gap-1 bg-background-card border border-border rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center",
              activeTab === tab.id
                ? "bg-white/[0.06] text-text-primary"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "profile" && (
          <Card className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <SettingsField label="Full Name" value={name} onChange={setName} />
              <SettingsField label="City" value={city} onChange={setCity} />
              <SettingsField label="School" value={school} onChange={setSchool} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Class</label>
                <select
                  value={classYear}
                  onChange={(e) => setClassYear(e.target.value)}
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-amber/50 transition-colors appearance-none"
                >
                  {["8", "9", "10", "11", "12"].map((c) => (
                    <option key={c} value={c} className="bg-background">
                      Class {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={200}
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors resize-none"
              />
              <p className="text-xs text-text-muted text-right">{bio.length}/200</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <SettingsField label="GitHub Username" value={github} onChange={setGithub} placeholder="username" />
              <SettingsField label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            </div>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Email Notifications</h3>
              <div className="space-y-3">
                <Toggle label="New lessons & content" checked={emailNewLesson} onChange={setEmailNewLesson} />
                <Toggle label="Weekly progress digest" checked={emailWeeklyDigest} onChange={setEmailWeeklyDigest} />
                <Toggle label="Mentor messages" checked={emailMentor} onChange={setEmailMentor} />
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Push Notifications</h3>
              <div className="space-y-3">
                <Toggle label="Live session reminders" checked={pushLiveSession} onChange={setPushLiveSession} />
                <Toggle label="Leaderboard updates" checked={pushLeaderboard} onChange={setPushLeaderboard} />
              </div>
            </div>
          </Card>
        )}

        {activeTab === "account" && (
          <Card className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input
                type="email"
                value="arjun.mehta@example.com"
                disabled
                className="w-full bg-white/[0.02] border border-border rounded-lg px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
              />
              <p className="text-xs text-text-muted">Contact support to change your email</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Cohort</label>
              <input
                type="text"
                value="Cohort 1 — Jan 2025"
                disabled
                className="w-full bg-white/[0.02] border border-border rounded-lg px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
              />
            </div>
            <div className="h-px bg-border" />
            <div>
              <h3 className="text-sm font-semibold text-danger mb-2">Danger Zone</h3>
              <p className="text-xs text-text-muted mb-3">
                Deleting your account will permanently remove all your data, projects, and progress. This action cannot be undone.
              </p>
              <button className="px-4 py-2 text-sm font-medium text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={cn(
            "inline-flex items-center gap-2 font-semibold text-sm rounded-lg px-6 py-2.5 transition-all",
            saved
              ? "bg-success text-white"
              : "bg-amber hover:bg-amber-hover text-background"
          )}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function SettingsField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-amber/50 transition-colors"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-primary">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-amber" : "bg-white/10"
        )}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
