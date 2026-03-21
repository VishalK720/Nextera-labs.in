import { ApifyClient } from "apify-client";

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN!,
});

export default apifyClient;

// Target demographic configuration for lead generation
export const LEAD_GEN_CONFIG = {
  targetDemographic: {
    parentAge: { min: 35, max: 50 },
    childClass: [11, 12],
    regions: [
      "Gurugram",
      "Gurgaon",
      "Delhi",
      "Noida",
      "Faridabad",
      "Ghaziabad",
      "Greater Noida",
    ],
    tier: 1,
    label: "Delhi NCR Parents (Class 11-12)",
  },

  // Google Maps search queries to find schools, coaching centers, parent hubs
  googleMapsQueries: [
    "CBSE schools class 11 12 Gurugram",
    "CBSE schools class 11 12 Delhi",
    "CBSE schools class 11 12 Noida",
    "IIT JEE coaching Gurugram",
    "IIT JEE coaching Delhi NCR",
    "NEET coaching Gurugram",
    "NEET coaching Delhi",
    "Class 11 12 tuition Gurugram",
    "Class 11 12 tuition Delhi",
    "Board exam coaching Gurgaon",
    "Science coaching classes Gurugram",
    "Parent teacher association Delhi NCR",
    "Education consultants Gurugram",
    "Career counseling class 12 Delhi",
    "School supplies stores Gurugram",
  ],

  // Google Search queries for parent directories and forums
  googleSearchQueries: [
    "best schools class 11 12 Gurugram parents review",
    "parent groups class 11 12 Delhi NCR",
    "IIT JEE preparation parents Gurugram",
    "NEET preparation parents Delhi NCR",
    "class 11 12 admission Gurugram 2025 2026",
    "parent community school Gurgaon",
    "school admission class 11 Delhi NCR contact",
    "coaching center reviews parents Gurugram",
    "best coaching class 11 12 science Delhi NCR",
    "career guidance parents class 12 Delhi",
  ],
};

// Well-known Apify actor IDs
export const APIFY_ACTORS = {
  GOOGLE_MAPS_SCRAPER: "compass/crawler-google-places",
  GOOGLE_SEARCH_SCRAPER: "apify/google-search-scraper",
  CONTACT_INFO_SCRAPER: "lukaskrivka/contact-info-scraper",
} as const;

export type Lead = {
  id: string;
  name: string;
  source: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  category?: string;
  rating?: number;
  query: string;
  region: string;
  collectedAt: string;
};
