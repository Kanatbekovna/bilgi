"use client";
import Header from "@/widgets/header/Header";
import { LanguageProvider } from "@/shared/lib/i18n/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

type ChildrenProps = { children: React.ReactNode };

const layout = ({ children }: ChildrenProps) => {
  const qc = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <QueryClientProvider client={qc}>
        <LanguageProvider>
          <div className="layout">
            <Header />
            <main>{children}</main>
          </div>
        </LanguageProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default layout;
