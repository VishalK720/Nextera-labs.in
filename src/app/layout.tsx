import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

/* Google Fonts loaded via <link> in <head> to avoid build-time fetch issues.
   CSS variables are set on the body via style below. */

export const metadata: Metadata = {
  title: "Nextera Labs — Build AI. Not Just Learn It.",
  description:
    "India's first peer-led AI builder cohort for Class 11-12. Selected over a FREE Google Meet. Led by Vishal Parashar & Naman Sehwag. 25 seats. ₹499 for Cohort 1.",
  keywords: [
    "AI cohort India",
    "learn AI Class 11 12",
    "build AI products",
    "Nextera Labs",
  ],
  openGraph: {
    title: "Nextera Labs — Don't just learn AI. Build it.",
    description:
      "Selected over a FREE Google Meet. ₹499 for the founding batch of 25.",
    url: "https://nexteralabs.in",
    siteName: "Nextera Labs",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextera Labs",
    description: "Build AI. Not just learn it.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-text-primary"
        style={{
          ["--font-syne" as string]: "'Syne', system-ui, sans-serif",
          ["--font-dm-sans" as string]: "'DM Sans', system-ui, sans-serif",
          ["--font-dm-mono" as string]: "'DM Mono', monospace",
        }}
      >
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#0D0D1A",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#F0EFF8",
            },
          }}
        />
      </body>
    </html>
  );
}
