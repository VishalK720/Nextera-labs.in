"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Program", href: "#program" },
  { label: "How We Select", href: "#how-we-select" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "For Parents", href: "#for-parents" },
  { label: "Pricing", href: "#pricing" },
] as const;

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- animation variants ---------- */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const drawerLinkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i, duration: 0.25, ease: "easeOut" },
  }),
};

/* ---------- component ---------- */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Track scroll position for shadow */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleNavClick = useCallback(
    (href: string) => {
      const id = href.replace("#", "");
      smoothScrollTo(id);
      setDrawerOpen(false);
    },
    []
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[60px] backdrop-blur-xl bg-background/80 border-b border-border transition-shadow duration-300",
          scrolled && "shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
        )}
      >
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
          {/* ---- Logo ---- */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber transition-transform duration-200 group-hover:scale-105">
              <span className="font-heading text-sm font-[800] text-black leading-none select-none">
                N
              </span>
            </div>
            <span className="font-heading text-lg font-[700] text-text-primary tracking-tight">
              Nextera Labs
            </span>
          </Link>

          {/* ---- Center links (desktop) ---- */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="relative rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ---- Right actions (desktop) ---- */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Student Login
            </Button>
            <Button
              variant="amber"
              size="sm"
              onClick={() => smoothScrollTo("apply")}
            >
              Apply Free&nbsp;&rarr;
            </Button>
          </div>

          {/* ---- Hamburger (mobile) ---- */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* ---- Mobile drawer ---- */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="drawer-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer-panel"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-[300px] bg-background-elevated border-l border-border flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-[60px] px-5 border-b border-border shrink-0">
                <span className="font-heading text-base font-[700] text-text-primary">
                  Menu
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center h-9 w-9 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer navigation links */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={drawerLinkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="w-full text-left rounded-lg px-4 py-3 text-base text-text-muted transition-colors hover:text-text-primary hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                      >
                        {link.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Drawer footer actions */}
              <div className="px-4 pb-6 pt-2 flex flex-col gap-3 shrink-0 border-t border-border">
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    setDrawerOpen(false);
                    window.location.href = "/login";
                  }}
                >
                  Student Login
                </Button>
                <Button
                  variant="amber"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => handleNavClick("#apply")}
                >
                  Apply Free&nbsp;&rarr;
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
