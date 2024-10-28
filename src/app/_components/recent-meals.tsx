"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import AddMealsModal from "./add-meals-modal";
import { DailyIntake } from "@/data/services/ai";
import { format, parseISO } from "date-fns";
import { use } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentMealsProps {
  dailyIntakePromise: Promise<DailyIntake[] | null>;
}

export default function RecentMeals({ dailyIntakePromise }: RecentMealsProps) {
  const dailyIntake = use(dailyIntakePromise);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Meals</CardTitle>
        <AddMealsModal />
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[200px]">
          {dailyIntake && dailyIntake.length > 0 ? (
            <div className="space-y-4">
              {dailyIntake.flatMap((intake) =>
                intake.foods.map((meal) => (
                  <div
                    key={`${intake.date}-${meal.name}`}
                    className="flex items-center"
                  >
                    <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{meal.name}</p>
                      <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                      <p className="text-sm text-muted-foreground">{meal.mealType}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{format(parseISO(intake.date), "HH:mm")}</div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">No meals found</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
