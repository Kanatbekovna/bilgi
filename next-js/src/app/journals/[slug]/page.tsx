import JournalDetail from "@/pages/journals/JournalDetail";
import React from "react";

export default function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <JournalDetail params={params} />;
}
