import axios from "axios";
import * as cheerio from "cheerio";

export async function getArticleData(url: string) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $(".page_title").text().trim();

  const description = $(".description").text().trim();

  const pdfUrl =
    $("a.pdf").attr("href") ||
    $("a[href*='download']").attr("href");

  return {
    title,
    description,
    pdf_url: pdfUrl,
  };
}
