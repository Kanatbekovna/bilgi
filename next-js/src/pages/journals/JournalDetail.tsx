"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/shared/lib/i18n/LanguageContext";
import scss from "./journalDetail.module.scss";

interface Article {
  title: string;
  url: string;
  pdf: string | null;
}

interface Journal {
  title: string;
  slug: string;
  url: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default function JournalDetail({ params }: Props) {
  const { slug } = use(params);
  const { t } = useLang();

  const [journal, setJournal] = useState<Journal | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/journals/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(t("journals.notFound"));
        return r.json();
      })
      .then((data) => {
        setJournal(data.journal);
        setArticles(Array.isArray(data.articles) ? data.articles : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [slug]);

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) {
    return (
      <div className={scss.container}>
        <div className="container">
          <div className={scss.skeletons}>
            <div className={scss.skeletonTitle} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={scss.skeleton}
                style={{ animationDelay: `${i * 0.07}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className={scss.container}>
        <div className="container">
          <div className={scss.empty}>
            <span>—</span>
            <p>{error || t("journals.notFound")}</p>
            <Link href="/journals" className={scss.backBtn}>
              {t("journals.backToList")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.container}>
      <div className="container">
        {/* Шапка */}
        <div className={scss.header}>
          <Link href="/journals" className={scss.back}>
            {t("journals.back")}
          </Link>
          <div className={scss.titleRow}>
            <span className={scss.line} />
            <h1>{journal.title}</h1>
            <span className={scss.line} />
          </div>
          <div className={scss.meta}>
            <span className={scss.slug}>{journal.slug}</span>
            <a
              href={journal.url}
              target="_blank"
              rel="noopener noreferrer"
              className={scss.externalLink}
            >
              {t("journals.officialSite")}
            </a>
          </div>
        </div>

        {/* Строка поиска */}
        <div className={scss.searchRow}>
          <div className={scss.inputWrap}>
            <svg
              className={scss.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t("journals.articleSearch")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className={scss.count}>
            {filtered.length} {t("journals.articleSuffix")}
          </span>
        </div>

        {/* Список статей */}
        {filtered.length === 0 ? (
          <div className={scss.empty}>
            <span>—</span>
            <p>{t("journals.noArticles")}</p>
          </div>
        ) : (
          <div className={scss.list}>
            {filtered.map((article, i) => (
              <div
                key={i}
                className={scss.item}
                style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
              >
                <div className={scss.itemIndex}>{i + 1}</div>
                <div className={scss.itemBody}>
                  <p className={scss.itemTitle}>{article.title}</p>
                  <div className={scss.itemLinks}>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={scss.linkBtn}
                      >
                        {t("journals.articleLink")}
                      </a>
                    )}
                    {article.pdf && (
                      <a
                        href={article.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${scss.linkBtn} ${scss.pdfBtn}`}
                      >
                        {t("journals.pdfLink")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
