import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "http://journal.vak.kg";

function extractPdf(url) {
  try {
    const match = url.match(/tnc_pvfw=([^&#]+)/);
    if (!match) return null;

    let decoded = Buffer.from(match[1], "base64").toString("utf-8");
    decoded = decoded.replace(/&amp;/g, "&");

    const fileMatch = decoded.match(/file=([^&]+)/);
    if (!fileMatch) return null;

    let pdf = decodeURIComponent(fileMatch[1]);

    if (!pdf.startsWith("http")) {
      pdf = BASE + pdf;
    }

    return pdf;
  } catch {
    return null;
  }
}

export async function getVakArticle(journalUrl) {
  const { data } = await axios.get(journalUrl);
  const $ = cheerio.load(data);

  const articles = [];

  $("a[href*='tnc_pvfw']").each((_, el) => {
    const href = $(el).attr("href");

    if (!href) return;

    const fullUrl = href.startsWith("http") ? href : BASE + href;

    const pdf = extractPdf(fullUrl);
    if (!pdf) return;

    // 🔥 TITLE FIX (берём h3.entry-title)
    const title =
      $(el).closest("div").find("h3.entry-title").first().text().trim() ||
      $("h3.entry-title").first().text().trim() ||
      "PDF Article";

    articles.push({
      issue_url: journalUrl,
      title,
      url: fullUrl,
      pdf,
    });
  });

  return articles;
}
