import { Suspense } from "react";
import { getDailyIntake } from "@/data/services/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProgressCard from "./_components/progress-card";
import RecentMeals from "./_components/recent-meals";
import Header from "./_components/header";

export const experimental_ppr = true;

export default function HomePage() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <ProgressCard />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <RecentMeals dailyIntakePromise={getDailyIntake()} />
        </Suspense>
      </div>
    </ScrollArea>
  );
}
