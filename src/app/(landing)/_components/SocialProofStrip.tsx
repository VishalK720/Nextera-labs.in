"use client";

import { cn } from "@/lib/utils";

const MARQUEE_ITEMS = [
  "Applications from 12+ states",
  "Students from 8+ schools",
  "100% online",
  "Backed by real builders",
  "Peer-reviewed projects",
  "Live mentor sessions",
  "Ship-ready portfolios",
] as const;

/**
 * Duplicated items for seamless infinite scroll.
 * The marquee renders two identical sets side-by-side,
 * and the CSS animation translates by -50% so the loop is seamless.
 */
const DOUBLE_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function SocialProofStrip() {
  return (
    <section
      className="relative border-y border-border bg-background-card/50 py-4 overflow-hidden select-none"
      aria-label="Social proof"
    >
      {/* Left edge fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      {/* Right edge fade */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />

      <div className="flex items-center gap-8">
        {/* Static label */}
        <span className="shrink-0 pl-6 text-xs font-medium uppercase tracking-widest text-text-muted hidden sm:block">
          Trusted by students from
        </span>

        {/* Scrolling marquee track */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className={cn(
              "flex w-max gap-8",
              "animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]"
            )}
          >
            {DOUBLE_ITEMS.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-2 text-sm text-text-muted whitespace-nowrap"
              >
                <span className="h-1 w-1 rounded-full bg-amber/60" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes for the marquee animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `,
        }}
      />
    </section>
  );
}
