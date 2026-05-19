"use client";
import Header from "@/widgets/header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type ChildrenProps = {
  children: React.ReactNode;
};
const layout = ({ children }: ChildrenProps) => {
  const qc = new QueryClient();
  return (
    <QueryClientProvider client={qc}>
      <div className="layout">
        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </div>
    </QueryClientProvider>
  );
};

export default layout;
