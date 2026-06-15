"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/shared/lib/i18n/LanguageContext";
import { slugNames, journalTitles } from "@/shared/lib/i18n/translations";
import scss from "./journals.module.scss";
import { CiSearch } from "react-icons/ci";

interface Journal {
  title: string;
  slug: string;
  url: string;
}

export default function Journals() {
  const { t, lang } = useLang();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/journals")
      .then((r) => r.json())
      .then((data) => {
        setJournals(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = journals.filter((j) =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    (slugNames[j.slug]?.[lang] ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      {/* ── HERO ── */}
      <section className={scss.hero}>
        <div className={scss.heroInner}>
          <h1 className={scss.heroTitle}>{t("journals.title")}</h1>

          <div className={scss.diamond}><span>◆</span></div>

          <p className={scss.heroSubtitle}>{t("journals.subtitle")}</p>

          <div className={scss.heroSearch}>
            <input
              type="text"
              placeholder={t("journals.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button><CiSearch/> {t("journals.countSuffix")}</button>
          </div>
        </div>
      </section>

      {/* ── CARDS ── */}
      <div className={scss.section}>
        <div className="container">

          {!loading && (
            <div className={scss.topRow}>
              <span className={scss.countBadge}>
                {filtered.length} {t("journals.countSuffix")}
              </span>
            </div>
          )}

          {loading ? (
            <div className={scss.skeletons}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={scss.skeleton}
                  style={{ animationDelay: `${i * 0.07}s` }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={scss.empty}>
              <span>✦</span>
              <p>{t("journals.noResults")}</p>
            </div>
          ) : (
            <div className={scss.grid}>
              {filtered.map((journal, i) => (
                <Link
                  key={journal.slug}
                  href={`/journals/${journal.slug}`}
                  className={scss.card}
                  style={{ animationDelay: `${Math.min(i * 0.04, 0.6)}s` }}
                >
                  <span className={scss.initial}>
                    {journal.title.charAt(0).toUpperCase()}
                  </span>

                  <div className={scss.cardBody}>
                    <span className={scss.cardName}>
                      {slugNames[journal.slug]?.[lang] ?? journal.slug}
                    </span>
                    <span className={scss.cardSub}>
                      {journalTitles[journal.slug]?.[lang] ?? journal.title}
                    </span>
                    <div className={scss.cardLine} />
                  </div>

                  <span className={scss.arrow}>→</span>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
