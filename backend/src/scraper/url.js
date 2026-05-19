const BASE = "https://journal.oshsu.kg";

export function normalizeUrl(url) {
  if (!url) return null;

  // уже нормальная ссылка
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // относительная ссылка
  return BASE + url;
}