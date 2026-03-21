"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  Video,
  BookOpen,
  Phone,
  LogOut,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const navLinks = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: FileText, label: "Applications", href: "/admin/applications" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: Phone, label: "Cold Calls", href: "/admin/cold-call" },
  { icon: Video, label: "Meet Sessions", href: "/admin/meet-sessions" },
  { icon: BookOpen, label: "Cohorts", href: "/admin/cohorts" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-background-card border-r border-border">
      {/* Top Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber font-heading text-lg font-bold text-black">
          N
        </div>
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-semibold text-text-primary">
            Nextera
          </span>
          <Badge variant="amber">Admin</Badge>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-text-muted hover:text-text-primary lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber/10 text-amber"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5"
              )}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      <div className="border-t border-border px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo/20 text-sm font-medium text-indigo">
            VP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              Vishal Parashar
            </p>
            <Badge variant="indigo" className="mt-0.5">Founder</Badge>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-text-muted hover:text-amber transition-colors"
        >
          Back to Dashboard <ArrowRight size={12} />
        </Link>
        <button className="flex items-center gap-2 text-xs text-text-muted hover:text-danger transition-colors w-full">
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-[260px]">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="fixed top-0 right-0 left-0 lg:left-[260px] z-30 flex h-[60px] items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-text-muted hover:text-text-primary lg:hidden"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-heading text-sm font-semibold text-text-primary">
          Nextera Admin{" "}
          <span className="text-text-muted font-normal">· Cohort 1</span>
        </h1>
      </div>

      {/* Main Content */}
      <main className="lg:ml-[260px] pt-[60px] p-4 lg:p-6">{children}</main>
    </div>
  );
}
