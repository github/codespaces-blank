import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Allow all API requests to pass through
  // They will be handled by Next.js rewrites in next.config.ts
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
