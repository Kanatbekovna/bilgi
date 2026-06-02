import { saveArticle, saveJournal } from "../db/pool.js";
import { getJournals } from "../scraper/journals.js";
import { getArticles } from "../scraper/articles.js";

export async function crawlAll() {
  console.log("CRAWL STARTED");

  const journals = await getJournals();

  let stats = {
    journals: 0,
    articles: 0,
  };

  for (const journal of journals) {
    try {
      await saveJournal(journal);

      stats.journals++;

      console.log("JOURNAL:", journal.title);
    } catch (e: any) {
      console.log("Journal save error:", e.message);
    }

    try {
      const articles = await getArticles(journal.url);

      console.log("FOUND ARTICLES:", articles.length);

      for (const article of articles) {
        try {
          await saveArticle(journal.slug, article);

          stats.articles++;

          console.log("ARTICLE:", article.title);
        } catch (e: any) {
          console.log("Article save error:", e.message);
        }
      }
    } catch (e: any) {
      console.log("Get articles error:", e.message);
    }
  }

  console.log("DONE", stats);

  console.log("CRAWL FINISHED");

  return stats;
}
