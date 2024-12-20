"use server";

import { getId } from "@/lib/cookies";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

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

const REVALIDATE_TIME = 60; // 1 minute

export async function postIntake({ prompt }: { prompt: string }): Promise<ApiResponse> {
  try {
    const id = await getId();

    const response = await fetch(`${process.env.API_URL}/intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SECRET_PASSWORD: process.env.SECRET_PASSWORD ?? "",
      },
      body: JSON.stringify({ prompt, userName: id }),
    });

    if (response.status === 200) {
      revalidatePath("/");
      revalidatePath("/summary");
      revalidateTag(`summary-${id}`);
      revalidateTag(`daily-intake-${id}`);
      revalidateTag(`leaderboard`);

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
      headers: {
        SECRET_PASSWORD: process.env.SECRET_PASSWORD ?? "",
      },
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
      headers: {
        SECRET_PASSWORD: process.env.SECRET_PASSWORD ?? "",
      },
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
      headers: {
        SECRET_PASSWORD: process.env.SECRET_PASSWORD ?? "",
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
        SECRET_PASSWORD: process.env.SECRET_PASSWORD ?? "",
      },
    });

    const headersList = await headers();
    const rateLimitLimit = headersList.get("X-RateLimit-Limit");
    const rateLimitRemaining = headersList.get("X-RateLimit-Remaining");

    console.log("rateLimitRemaining:", rateLimitRemaining);
    console.log("rateLimitLimit:", rateLimitLimit);

    if (response.status === 200) {
      revalidatePath("/");
      revalidatePath("/summary");
      revalidateTag(`summary-${id}`);
      revalidateTag(`daily-intake-${id}`);
      // revalidateTag(`leaderboard`);

      console.log("purge cached", `summary-${id}`, `daily-intake-${id}`);

      return {
        status: response.status,
        message: null,
        error: null,
      };
    }

    return {
      status: rateLimitRemaining === "0" ? 429 : response.status,
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
