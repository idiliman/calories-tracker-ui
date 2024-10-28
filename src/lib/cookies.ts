import "server-only";

import { generateRandomName } from "./randomName";
import { cookies } from "next/headers";

export const ID_KEY = "calorie-tracker-id";
export const CALORIE_GOAL_KEY = "calorie-tracker-goal";

export const COOKIE_OPTIONS = {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const getId = async (): Promise<string> => {
  try {
    const cookie = await cookies();
    // Try to get existing ID from cookie
    let id = cookie.get(ID_KEY)?.value;

    // If no ID exists, create and store a new one
    if (!id) {
      id = generateRandomName();
      cookie.set(ID_KEY, id, COOKIE_OPTIONS);
    }

    return id;
  } catch (error) {
    return "";
  }
};

export const setId = async (id: string) => {
  const cookie = await cookies();
  cookie.set(ID_KEY, id, COOKIE_OPTIONS);
};

export const getCalorieGoal = async (): Promise<number> => {
  const cookie = await cookies();
  return parseInt(cookie.get(CALORIE_GOAL_KEY)?.value || "0");
};

export const setCalorieGoal = async (goal: number) => {
  const cookie = await cookies();
  cookie.set(CALORIE_GOAL_KEY, goal.toString(), COOKIE_OPTIONS);
};
