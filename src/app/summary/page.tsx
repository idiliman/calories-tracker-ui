import { Suspense } from "react";
import Summary, { SummarySkeleton } from "../_components/summary";
import { getSummary } from "@/data/services/ai";

export default async function SummaryPage() {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <Summary summaryPromise={getSummary()} />
    </Suspense>
  );
}
