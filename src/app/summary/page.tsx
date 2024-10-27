import { Suspense } from "react";
import Summary from "../_components/summary";
import { getSummary } from "@/data/services/ai";
import SummarySkeleton from "../_components/summary-skeleton";

export default function SummaryPage() {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <Summary summaryPromise={getSummary()} />
    </Suspense>
  );
}
