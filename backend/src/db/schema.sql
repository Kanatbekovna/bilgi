CREATE TABLE IF NOT EXISTS journals (
  id SERIAL PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  url TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  source TEXT,
  issue_url TEXT,
  title TEXT,
  url TEXT UNIQUE,
  pdf TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);