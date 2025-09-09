import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // Authentication will be handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/messages/:path*"],
};
