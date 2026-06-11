import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://journal.oshsu.kg";

export async function getOshsuJournals() {
  const { data } = await axios.get(`${BASE}/index.php/index`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);

  const journals = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const title = $(el).text().trim();
    // const title = $(el).find("h3 a").text().trim();

    if (
      href &&
      href.includes("/index.php/") &&
      !href.includes("/issue/") &&
      !href.includes("/article/") &&
      title &&
      title !== "Посмотреть журнал"
    ) {
      journals.push({
        title,
        url: href.startsWith("http") ? href : BASE + href,
      });
    }
  });

  return [...new Map(journals.map((j) => [j.url, j])).values()];
}
