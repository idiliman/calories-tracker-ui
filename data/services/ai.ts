"use server";

import { getId } from "@/lib/id";

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
    return response.json();
  } catch (error) {
    console.error("Error posting intake:", JSON.stringify(error));
    throw error;
  }
}

export async function getSummary(): Promise<SummaryData | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/summary`);
    return response.json();
  } catch (error) {
    console.error("Error getting summary:", JSON.stringify(error));
    return null;
  }
}

export async function getDailyIntake(): Promise<DailyIntake[] | null> {
  try {
    const id = await getId();
    const response = await fetch(`${process.env.API_URL}/daily_intake/${id}`);
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
