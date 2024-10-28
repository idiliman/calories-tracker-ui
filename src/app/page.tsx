import { Suspense } from "react";
import { getDailyIntake } from "@/data/services/ai";
import ProgressCard, { ProgressCardSkeleton } from "./_components/progress-card";
import RecentMeals, { RecentMealsSkeleton } from "./_components/recent-meals";
import Header, { HeaderSkeleton } from "./_components/header";

export const experimental_ppr = true;

export default async function HomePage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ProgressCardSkeleton />}>
        <ProgressCard />
      </Suspense>
      <Suspense fallback={<RecentMealsSkeleton />}>
        <RecentMeals dailyIntakePromise={getDailyIntake()} />
      </Suspense>
    </div>
  );
}
