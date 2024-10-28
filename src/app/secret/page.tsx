import { notFound } from "next/navigation";
import SettingsModal from "../_components/settings-modal";
import { getCalorieGoal, getId } from "@/lib/cookies";

export default async function Page({ searchParams }: { searchParams: Promise<{ password: string }> }) {
  const { password } = await searchParams;

  const id = await getId();
  const calorieGoalPromise = getCalorieGoal();

  if (password !== process.env.SECRET_PASSWORD) return notFound();

  return (
    <div className="flex items-center justify-center">
      <SettingsModal
        admin={true}
        calorieGoalPromise={calorieGoalPromise}
        id={id}
      />
    </div>
  );
}
