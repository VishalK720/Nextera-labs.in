-- Lead generation table for Apify scraped data
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL, -- google_maps, google_search
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  category TEXT,
  rating NUMERIC,
  query TEXT,
  region TEXT,
  collected_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_leads_region ON leads(region);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_collected_at ON leads(collected_at DESC);
