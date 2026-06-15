"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type Lang } from "./translations";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <S extends string>(key: S) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "TR",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("TR");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  /* dot-path resolver: t("nav.makaleler") */
  const t = (key: string): string => {
    const parts = key.split(".");
    let val: unknown = translations[lang];
    for (const p of parts) val = (val as Record<string, unknown>)?.[p];
    return (val as string) ?? key;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
