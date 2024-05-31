import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value as string;
  const refreshToken = req.cookies.get("refreshToken")?.value as string;

  if (!accessToken || !refreshToken) {
    const redirectUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  } else if (req.nextUrl.pathname === "/") {
    const redirectUrl = new URL('/dashboard', req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return null;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next|login).*)", "/", "/(api|trpc)(.*)"],
};