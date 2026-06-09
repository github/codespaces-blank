import { auth } from "./firebase";
import { getApiBaseUrl } from "./api-base";

export interface FetchApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: Record<string, any>;
  status?: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiErrorResponse
  ) {
    super(data.message || data.error);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchApiOptions = {}
): Promise<T> {
  try {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    console.log(`[API] ${options.method || "GET"} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: `HTTP ${response.status}`,
          message: response.statusText,
        };
      }

      const error = new ApiError(response.status, errorData);
      console.error(`[API Error] ${response.status}:`, error.message);
      throw error;
    }

    const data = await response.json();
    console.log(`[API] Response received for ${endpoint}`);
    return data as T;
  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      const networkError = new ApiError(0, {
        error: "Network Error",
        message: error.message || "Failed to connect to API",
      });
      console.error("[API Network Error]:", error);
      throw networkError;
    }

    // Handle unknown errors
    throw error;
  }
}
