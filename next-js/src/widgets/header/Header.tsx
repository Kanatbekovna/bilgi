"use client";
import { useRouter } from "next/navigation";
import scss from "./header.module.scss";
import { FiSun, FiMoon } from "react-icons/fi";
import { RiGlobalLine } from "react-icons/ri";
import { useEffect, useState } from "react";

export default function Header() {
  const { push } = useRouter();
  const [theme, setTheme] = useState<string>("light");
  useEffect(() => {
    const saveTheme = localStorage.getItem("theme") || "light";
    setTheme(saveTheme);
    document.documentElement.setAttribute("data-theme", saveTheme);
  }, []);
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";

      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);

      return newTheme;
    });
  };
  return (
    <header className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <h1 onClick={() => push("/")}>IZDENGo</h1>

          <nav className={scss.nav}>
            <p>Proje</p>
            <p>Âlimler</p>
            <p>İlahiyatçılar</p>
            <p>Eserler</p>
            <p>Yazmalar</p>
            <p>Tezler</p>
            <p>Makaleler</p>
            <p>Kavramlar</p>
            <p>Sempozyumlar</p>
            <p>İstatistik</p>
          </nav>

          <div className={scss.actions}>
            <span className={scss.bagis}>Bağış</span>
            <button onClick={toggleTheme} className={scss.topic}>
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
            <button className={scss.language}>
              <span>
                <RiGlobalLine />
              </span>
              TR
            </button>
            <button onClick={() => push("/login")} className={scss.giris}>
              КИРҮҮ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
