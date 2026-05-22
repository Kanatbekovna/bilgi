import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://journal.oshsu.kg";

export async function getJournals() {
  const { data } = await axios.get(`${BASE}/index.php/index`, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);

  const journals = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const title = $(el).text().trim();

    if (
      href &&
      href.includes("/index.php/") &&
      !href.includes("/issue/") &&
      !href.includes("/article/") &&
      !href.includes("setLocale") &&
      !href.includes("/about/") &&
      !href.includes("/user/") &&
      title &&
      title !== "Посмотреть журнал"
    ) {
      const slug = href.split("/").pop();

      if (
        slug &&
        slug !== "index" &&
        slug !== "about" &&
        slug !== "login" &&
        slug !== "search" &&
        !slug.includes("?")
      ) {
        journals.push({
          title,
          slug,
          url: href.startsWith("http") ? href : BASE + href,
        });
      }
    }
  });

  console.log("FOUND JOURNALS:", journals);

  return [...new Map(journals.map((j) => [j.slug, j])).values()];
}
