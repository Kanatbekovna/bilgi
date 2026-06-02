const BASE = "https://journal.oshsu.kg";

export function normalizeUrl(url?: string | null) {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return BASE + url;
}
