"use server";

import { getId } from "@/lib/cookies";
import { revalidateTag } from "next/cache";

export interface LeaderboardData {
  rank: number;
  username: string;
  calories: string;
}

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

const REVALIDATE_TIME = 86400; // 24 hours

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

    if (response.status === 200) {
      revalidateTag(`summary-${id}`);
      revalidateTag(`daily-intake-${id}`);

      console.log("purge cached", `summary-${id}`, `daily-intake-${id}`);

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

    const response = await fetch(`${process.env.API_URL}/summary/${id}`, {
      // cache: "force-cache",
      next: {
        revalidate: REVALIDATE_TIME,
        tags: [`summary-${id}`],
      },
    });
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
      // cache: "force-cache",
      next: {
        revalidate: REVALIDATE_TIME,
        tags: [`daily-intake-${id}`],
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

export async function getLeaderboard(): Promise<LeaderboardData[] | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/leaderboard`, {
      // cache: "force-cache",
      next: {
        revalidate: 60,
        tags: [`leaderboard`],
      },
    });
    if (response.status === 200) {
      return response.json();
    }
    return null;
  } catch (error) {
    console.log("Error getting leaderboard:", JSON.stringify(error));
    return null;
  }
}

export async function deleteIntake(date: string): Promise<ApiResponse> {
  try {
    const id = await getId();

    const response = await fetch(`${process.env.API_URL}/intake/${id}/${date}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      // revalidateTag(`summary-${id}`);
      // revalidateTag(`daily-intake-${id}`);
      // revalidateTag(`leaderboard`);

      // console.log("purge cached", `summary-${id}`, `daily-intake-${id}`, `leaderboard`);

      return {
        status: response.status,
        message: null,
        error: null,
      };
    }
    return {
      status: response.status,
      message: null,
      error: "Failed to delete intake",
    };
  } catch (error) {
    console.log("Error deleting intake:", JSON.stringify(error));
    return {
      status: 500,
      message: null,
      error: "Internal server error",
    };
  }
}
