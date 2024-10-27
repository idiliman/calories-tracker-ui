"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const todayIntake = {
  calories: 1200,
  protein: 60,
  carbs: 150,
  fat: 40,
};

const calorieGoal = 2000;

export default function ProgressCard() {
  const [progress, setProgress] = useState((todayIntake.calories / calorieGoal) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              {todayIntake.calories} / {calorieGoal} kcal
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
