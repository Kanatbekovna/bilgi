import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "http://journal.vak.kg";

const PAGES = [`${BASE}/journal/`, `${BASE}/poslednie-zhurnaly/`];

export async function getVakJournals() {
  const journals = [];

  for (const page of PAGES) {
    const { data } = await axios.get(page);
    const $ = cheerio.load(data);

    $(".containerz h4 a").each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");

      if (!title || !link) return;

      journals.push({
        title,
        url: link.startsWith("http") ? link : BASE + link,
        slug: title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-а-яё0-9]/gi, ""),
      });
    });
  }

  return journals;
}
