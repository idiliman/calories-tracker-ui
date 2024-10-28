import { getCalorieGoal, getId } from "@/lib/cookies";
import SettingsModal from "./settings-modal";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Header() {
  const id = await getId();
  const calorieGoalPromise = getCalorieGoal();

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Hello {id}</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center pl-3">
            <Skeleton className="h-4 w-4" />
          </div>
        }
      >
        <SettingsModal
          calorieGoalPromise={calorieGoalPromise}
          id={id}
        />
      </Suspense>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-8" />
    </div>
  );
}
