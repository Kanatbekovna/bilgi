import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";
import LayoutGlobal from "./layout.c";

/* Display / heading font — ultra-refined academic serif */
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Body font — warm, readable serif */
const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BİLGİ",
  description: "Bilgi ve Hikmetin Hazinesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${cormorant.variable} ${lora.variable}`}>
        <LayoutGlobal>{children}</LayoutGlobal>
      </body>
    </html>
  );
}
