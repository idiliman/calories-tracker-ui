"use server";

import { getId } from "@/lib/cookies";
import { revalidatePath, revalidateTag } from "next/cache";

interface Food {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  amount: string;
  mealType?: string;
}

interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface DailyIntake {
  date: string;
  foods: Food[];
  summary: Nutrition;
}

interface OverallSummary {
  total: Nutrition;
  average: Nutrition;
}

export interface SummaryData {
  month: string;
  dailyIntakes: DailyIntake[];
  overallSummary: OverallSummary;
}

interface ApiResponse {
  status: number;
  message: string | null;
  error: string | null;
}

export async function postIntake({ prompt }: { prompt: string }): Promise<ApiResponse> {
  try {
    const id = await getId();

    const response = await fetch(`${process.env.API_URL}/intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, userName: id }),
    });

    revalidatePath("/");
    // revalidateTag("summary");
    // revalidateTag("daily");

    if (response.status === 200) {
      return {
        status: response.status,
        message: null,
        error: null,
      };
    }
    return {
      status: response.status,
      message: null,
      error: "Failed to post intake",
    };
  } catch (error) {
    console.log("Error posting intake:", JSON.stringify(error));
    return {
      status: 500,
      message: null,
      error: "Internal server error",
    };
  }
}

export async function getSummary(): Promise<SummaryData | null> {
  try {
    const id = await getId();

    const response = await fetch(`${process.env.API_URL}/summary/${id}`);
    if (response.status === 200) {
      return response.json();
    }
    return null;
  } catch (error) {
    console.log("Error getting summary:", JSON.stringify(error));
    return null;
  }
}

export async function getDailyIntake(): Promise<DailyIntake[] | null> {
  try {
    const id = await getId();

    const response = await fetch(`${process.env.API_URL}/daily_intake/${id}`, {
      cache: "force-cache",
      next: {
        tags: ["daily"],
      },
    });
    if (response.status === 200) {
      return response.json();
    }
    return null;
  } catch (error) {
    console.log("Error getting daily intake:", JSON.stringify(error));
    return null;
  }
}
