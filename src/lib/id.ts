import "server-only";

import { generateRandomName } from "./randomName";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS } from "@/middleware";

export const ID_KEY = "calorie-tracker-id";

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
    console.error("Error managing ID:", error);
    return "";
  }
};
