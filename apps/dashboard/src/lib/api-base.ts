/**
 * Get API base URL based on environment
 * - Development: http://localhost:3001
 * - Production: Uses NEXT_PUBLIC_API_URL environment variable
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side: use internal service URL
    return process.env.API_URL || "http://localhost:3001";
  }

  // Client-side: use public API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }

  // Default to localhost for development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  // Fallback to relative path for production
  return "";
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
