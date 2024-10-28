import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDailyIntake } from "@/data/services/ai";
import { getCalorieGoal } from "@/lib/cookies";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProgressCard() {
  const calorieGoal = await getCalorieGoal();
  const dailyIntake = await getDailyIntake();

  const totalCalories = dailyIntake?.reduce((acc, intake) => acc + parseInt(intake.summary.calories), 0) ?? 0;

  const progress = (totalCalories / calorieGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              {totalCalories} / {calorieGoal} kcal
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[40px]" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
