"use client";
import { useLang } from "@/shared/lib/i18n/LanguageContext";
import { GiGraduateCap } from "react-icons/gi";
import { FaBookOpen } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import scss from "./banner.module.scss";
import { CiSearch } from "react-icons/ci";

export default function Banner() {
  const { t } = useLang();

  return (
    <section className={scss.hero}>
      <div className={scss.heroInner}>

        {/* Title */}
        <div className={scss.titleBlock}>
          <h1 className={scss.heroTitle}>BİLGİ</h1>

          <div className={scss.diamond}>
            <span>◆</span>
          </div>

          <p className={scss.subtitle}>{t("banner.subtitle")}</p>
        </div>

        {/* Search */}
        <div className={scss.search}>
          <input
            type="text"
            placeholder={t("banner.placeholder")}
          />
          <button><CiSearch/> {t("banner.searchBtn")}</button>
        </div>

        {/* Hero stats */}
        <div className={scss.heroStats}>
          <div className={scss.heroStatCard}>
            <GiGraduateCap className={scss.heroStatIcon} />
            <div className={scss.heroStatText}>
              <span className={scss.heroStatNum}>125</span>
              <span className={scss.heroStatLabel}>{t("banner.alim")}</span>
            </div>
          </div>

          <div className={scss.heroStatCard}>
            <FaBookOpen className={scss.heroStatIcon} />
            <div className={scss.heroStatText}>
              <span className={scss.heroStatNum}>430</span>
              <span className={scss.heroStatLabel}>{t("banner.eser")}</span>
            </div>
          </div>

          <div className={scss.heroStatCard}>
            <LuPenLine className={scss.heroStatIcon} />
            <div className={scss.heroStatText}>
              <span className={scss.heroStatNum}>89</span>
              <span className={scss.heroStatLabel}>{t("banner.tez")}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
