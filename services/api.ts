import { Platform } from "react-native";

const host =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export const API_BASE_URL = host;

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  throw new Error("Unexpected response format from backend");
}

export async function fetchJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      const errorBody = await parseJsonResponse<{ message?: string }>(
        response,
      ).catch(() => ({ message: response.statusText }));
      throw new Error(
        errorBody.message || `Request failed with status ${response.status}`,
      );
    }

    return parseJsonResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - server không phản hồi");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
