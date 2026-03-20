import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
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
