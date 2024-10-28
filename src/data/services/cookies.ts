"use server";

import { setCalorieGoal, setId } from "@/lib/cookies";

export async function updateCalorieGoalAction(goal: number): Promise<{ success: boolean; error?: string }> {
  try {
    await setCalorieGoal(goal);
    return { success: true };
  } catch (error) {
    console.error("Failed to update calorie goal:", error);
    return { success: false, error: "Failed to update calorie goal" };
  }
}

export async function updateUserNameAction(name: string): Promise<{ success: boolean; error?: string }> {
  try {
    await setId(name);
    return { success: true };
  } catch (error) {
    console.error("Failed to update user name:", error);
    return { success: false, error: "Failed to update user name" };
  }
}
