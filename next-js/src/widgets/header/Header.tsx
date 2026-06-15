"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { RiGlobalLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { useLang } from "@/shared/lib/i18n/LanguageContext";
import type { Lang } from "@/shared/lib/i18n/translations";
import scss from "./header.module.scss";

const LANGS: { code: Lang; label: string }[] = [
  { code: "TR", label: "Türkçe"   },
  { code: "KY", label: "Кыргызча" },
  { code: "RU", label: "Русский"  },
  { code: "EN", label: "English"  },
];

export default function Header() {
  const { push } = useRouter();
  const { lang, setLang, t } = useLang();

  const [langOpen, setLangOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const chooseLang = (l: Lang) => { setLang(l); setLangOpen(false); };

  return (
    <header className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>

          <div className={scss.logo} onClick={() => push("/")}>
            <span className={scss.star}>✦</span>
            <h1>BİLGİ</h1>
          </div>

          <nav className={scss.nav}>
            <p>{t("nav.proje")}</p>
            <p>{t("nav.alimler")}</p>
            <p>{t("nav.eserler")}</p>
            <p>{t("nav.yazmalar")}</p>
            <p>{t("nav.makaleler")}</p>
            <p>{t("nav.kavramlar")}</p>
            <p onClick={() => push("/journals")}>{t("nav.dergiler")}</p>
            <p>{t("nav.istatistik")}</p>
          </nav>

          <div className={scss.actions}>
            <button className={scss.bagisBtn}>
              <FaHeart />
              {t("actions.bagis")}
            </button>

            <div className={scss.langWrap} ref={langRef}>
              <button className={scss.language} onClick={() => setLangOpen((o) => !o)}>
                <RiGlobalLine />
                {lang}
              </button>
              {langOpen && (
                <div className={scss.langDropdown}>
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => chooseLang(l.code)}
                      className={`${scss.langOption} ${lang === l.code ? scss.langActive : ""}`}
                    >
                      <span className={scss.langCode}>{l.code}</span>
                      <span className={scss.langLabel}>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className={scss.userChip}>
                {user.avatar
                  ? <img src={user.avatar} className={scss.userAvatar} alt="avatar" />
                  : <span className={scss.userInitial}>{user.name.charAt(0).toUpperCase()}</span>}
                <span className={scss.userName}>{user.name}</span>
              </div>
            ) : (
              <button className={scss.girisBtn} onClick={() => push("/login")}>
                <FiUser />
                {t("actions.giris")}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
