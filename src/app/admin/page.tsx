"use client";

import { motion } from "framer-motion";
import {
  Users,
  FileText,
  TrendingUp,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

const stats = [
  { label: "Total Applications", value: "142", change: "+12 this week", icon: FileText, color: "text-indigo" },
  { label: "Accepted", value: "25", change: "Cohort full", icon: CheckCircle2, color: "text-success" },
  { label: "Enrolled & Paid", value: "23", change: "₹11,477 collected", icon: IndianRupee, color: "text-amber" },
  { label: "Active Students", value: "23", change: "2 at risk", icon: Users, color: "text-indigo" },
];

const recentApplications = [
  { name: "Ananya Sen", city: "Kolkata", class: "11", status: "pending", time: "2h ago" },
  { name: "Rohan Khanna", city: "Chandigarh", class: "12", status: "accepted", time: "5h ago" },
  { name: "Isha Verma", city: "Lucknow", class: "10", status: "rejected", time: "1d ago" },
  { name: "Aditya Raj", city: "Patna", class: "11", status: "pending", time: "1d ago" },
  { name: "Meera Nair", city: "Kochi", class: "12", status: "accepted", time: "2d ago" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber/15 text-amber",
  accepted: "bg-success/15 text-success",
  rejected: "bg-danger/15 text-danger",
};

const avatarColors = ["#F5A623", "#6366F1", "#10B981", "#EF4444", "#8B5CF6"];

const atRiskStudents = [
  { name: "Ishaan Bhat", streak: 0, lastActive: "5 days ago", week: 2 },
  { name: "Tanya Kapoor", streak: 0, lastActive: "4 days ago", week: 2 },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              </div>
              <p className="text-2xl font-bold font-heading text-text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
              <p className="text-[11px] text-text-muted mt-1">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Applications */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-0">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="font-heading font-bold text-text-primary">
                Recent Applications
              </h3>
              <Badge variant="default">{recentApplications.length} new</Badge>
            </div>
            <div className="mt-4">
              {recentApplications.map((app, i) => (
                <div
                  key={app.name}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors",
                    i < recentApplications.length - 1 && "border-b border-border"
                  )}
                >
                  <Avatar
                    name={app.name}
                    size="sm"
                    color={avatarColors[i % avatarColors.length]}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {app.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {app.city} · Class {app.class}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2 py-1 rounded-full capitalize",
                      statusStyles[app.status]
                    )}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-text-muted hidden sm:block">
                    {app.time}
                  </span>
                  <button className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* At-Risk Students */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <h3 className="font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-danger" />
                At-Risk Students
              </h3>
              <div className="space-y-3">
                {atRiskStudents.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-danger/5 border border-danger/10"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        Week {s.week} · Last active {s.lastActive}
                      </p>
                    </div>
                    <Badge variant="danger">0 streak</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3 className="font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Review pending applications", count: "4 pending" },
                  { label: "Schedule next live session", count: "Week 5" },
                  { label: "Send cohort notification", count: "23 students" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-border text-left hover:border-amber/30 transition-colors"
                  >
                    <span className="text-sm text-text-primary">
                      {action.label}
                    </span>
                    <span className="text-xs text-text-muted">{action.count}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
