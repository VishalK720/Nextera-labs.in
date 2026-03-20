"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- data ---------- */

const quickLinks = [
  { label: "Program", href: "#program" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Pricing", href: "#pricing" },
  { label: "Apply", href: "#apply" },
  { label: "Login", href: "/login" },
] as const;

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/nexteralabs" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/nexteralabs" },
  { icon: Twitter, label: "Twitter / X", href: "https://x.com/nexteralabs" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@nexteralabs" },
] as const;

/* ---------- component ---------- */

export default function Footer() {
  return (
    <footer className="bg-background-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 md:grid-cols-3"
        >
          {/* Left: Logo + Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber text-background font-heading font-[800] text-lg select-none">
                N
              </div>
              <span className="font-heading font-[700] text-lg text-text-primary">
                Nextera Labs
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Build AI. Not just learn it.
            </p>
            <p className="text-xs text-text-muted/60">
              &copy; {new Date().getFullYear()} Nextera Labs. All rights reserved.
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-text-muted font-mono mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      "text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Social Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-text-muted font-mono mb-4">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    "bg-background-elevated border border-border",
                    "text-text-muted hover:text-amber hover:border-amber/30",
                    "transition-all duration-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-text-muted text-center">
            Made with ❤️ by Vishal &amp; Naman
          </p>
        </div>
      </div>
    </footer>
  );
}
