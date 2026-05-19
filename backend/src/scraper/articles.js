import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://journal.oshsu.kg";

export async function getArticles(issueUrl) {
  const { data } = await axios.get(issueUrl);

  const $ = cheerio.load(data);

  const articles = [];

  $(".obj_article_summary").each((_, el) => {
    const title = $(el).find(".title").text().trim();

    const link = $(el).find(".title a").attr("href");

    const authors = $(el).find(".authors").text().trim();

    const pdf =
      $("a.obj_galley_link.pdf").attr("href") ||
      $('a[href*="pdf"]').attr("href") ||
      $("a.download").attr("href");

    if (!link) return;

    articles.push({
      title,

      authors,

      url: link.startsWith("http") ? link : BASE + link,

      pdf: pdf ? (pdf.startsWith("http") ? pdf : BASE + pdf) : null,
    });
  });

  console.log("FOUND ARTICLES:", articles);

  return articles;
}
