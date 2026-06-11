import { getVakJournals } from "../scraper/vak.kg/journals.js";
import { getVakArticle } from "../scraper/vak.kg/articles.js";
import { getOshsuJournals } from "../scraper/oshmu/journals.js";
import { getOshsuArticles } from "../scraper/oshmu/articles.js";
import { saveJournal } from "../db/journal.model.js";
import { saveArticle } from "../db/articles.model.js";
import { log } from "./logger.js";

export async function crawlAll(site = "all") {
  log("CRAWL START");

  let stats = {
    journals: 0,
    articles: 0,
  };

  // =========================
  // 🟢 VAK PARSER
  // =========================
  if (site === "all" || site === "vak") {
    log("START VAK");

    const journals = await getVakJournals();

    for (const journal of journals) {
      try {
        await saveJournal({ ...journal, source: "vak" });
        stats.journals++;

        log(`VAK JOURNAL: ${journal.title}`);
      } catch (e) {
        log(`VAK journal error: ${e.message}`);
      }

      try {
        const articles = await getVakArticle(journal.url);

        for (const article of articles) {
          await saveArticle("vak", {
            title: article.title,
            url: article.url,
            pdf: article.pdf,
            issue_url: journal.url,
          });

          stats.articles++;
          log(`VAK ARTICLE: ${article.title}`);
        }
      } catch (e) {
        log(`VAK articles error: ${e.message}`);
      }
    }
  }

  // =========================
  // 🔵 OSHSU PARSER (ТВОЙ СТАРЫЙ)
  // =========================
  if (site === "all" || site === "oshsu") {
    log("START OSHSU");

    const journals = await getOshsuJournals();

    for (const journal of journals) {
      try {
        await saveJournal({ ...journal, source: "oshsu" });
        stats.journals++;

        log(`OSHSU JOURNAL: ${journal.title}`);
      } catch (e) {
        log(`OSHSU journal error: ${e.message}`);
      }

      try {
        const articles = await getOshsuArticles(journal.url);

        for (const article of articles) {
          try {
            await saveArticle("oshsu", article);
            stats.articles++;

            log(`OSHSU ARTICLE: ${article.title}`);
          } catch (e) {
            log(`OSHSU article error: ${e.message}`);
          }
        }
      } catch (e) {
        log(`OSHSU issue error: ${e.message}`);
      }
    }
  }

  log(`DONE: ${JSON.stringify(stats)}`);

  return stats;
}
