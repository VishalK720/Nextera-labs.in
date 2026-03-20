"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Rocket,
  Bot,
  Trophy,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { AuthProvider, useAuth } from "@/lib/auth-context";

const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/dashboard/projects", label: "Projects", icon: Rocket },
  { href: "/dashboard/ai-tutor", label: "AI Tutor", icon: Bot, badge: "NEW" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/cohort", label: "My Cohort", icon: Users },
];

const secondaryNav = [
  { href: "/dashboard/resources", label: "Resources", icon: FolderOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/curriculum": "Curriculum",
  "/dashboard/projects": "Projects",
  "/dashboard/ai-tutor": "AI Tutor",
  "/dashboard/leaderboard": "Leaderboard",
  "/dashboard/cohort": "My Cohort",
  "/dashboard/resources": "Resources",
  "/dashboard/settings": "Settings",
};

function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-white/5 text-amber"
          : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto text-[10px] font-bold tracking-wider bg-amber/15 text-amber px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const userName = profile?.full_name ?? "Student";
  const userSubtitle = profile
    ? `${profile.class ? `Class ${profile.class}` : ""} ${profile.city ? `· ${profile.city}` : ""}`.trim()
    : "";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="h-9 w-9 rounded-lg bg-amber flex items-center justify-center">
            <span className="text-background font-heading font-bold text-lg">N</span>
          </div>
          <span className="font-heading font-bold text-lg text-text-primary">
            Nextera Labs
          </span>
        </Link>
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            onClick={onNavigate}
          />
        ))}

        <div className="my-3 mx-1 h-px bg-border" />

        {secondaryNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-4 h-px bg-border" />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo/20 text-indigo flex items-center justify-center text-xs font-bold shrink-0">
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {userName}
            </p>
            <p className="text-xs text-text-muted truncate">{userSubtitle}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const pageTitle =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(
      ([key]) => pathname.startsWith(key) && key !== "/dashboard"
    )?.[1] ??
    "Dashboard";

  const userName = profile?.full_name ?? "Student";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 w-[240px] h-screen bg-background-card border-r border-border z-40 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-[240px] h-screen bg-background-card border-r border-border z-50 lg:hidden flex flex-col"
            >
              <SidebarContent onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="fixed top-0 right-0 left-0 lg:left-[240px] h-[60px] bg-background border-b border-border z-30 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-heading font-bold text-lg text-text-primary">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-indigo/20 text-indigo flex items-center justify-center text-xs font-bold cursor-pointer">
            {getInitials(userName)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-[240px] pt-[60px] min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
