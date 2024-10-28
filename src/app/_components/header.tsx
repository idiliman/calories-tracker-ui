import { getCalorieGoal, getId } from "@/lib/cookies";
import SettingsModal from "./settings-modal";
import { Suspense } from "react";

export default async function Header() {
  const id = await getId();
  const calorieGoalPromise = getCalorieGoal();

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Hello {id}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SettingsModal
          calorieGoalPromise={calorieGoalPromise}
          id={id}
        />
      </Suspense>
    </div>
  );
}
