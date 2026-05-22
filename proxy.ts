import { type NextRequest, NextResponse } from "next/server";
import { authInstance } from "@/lib/auth/config";

const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/api/chat",
  "/api/onboarding",
  "/api/profile",
  "/api/leads",
  "/api/analytics",
];

const authRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
];

function normalizeHost(hostname: string) {
  return hostname.split(":")[0].toLowerCase();
}

function normalizeBaseDomain(input: string) {
  return input
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/"/g, "")
    .replace(/'/g, "")
    .toLowerCase()
    .replace(/^www\./, "");
}

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  const rawHost = request.headers.get("host") || "";
  const hostname = normalizeHost(rawHost);
  const baseDomain = normalizeBaseDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.NEXT_PUBLIC_APP_URL || "localhost");

  const isSubdomain =
    hostname.endsWith(`.${baseDomain}`) &&
    hostname !== baseDomain &&
    hostname !== `www.${baseDomain}`;

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${baseDomain}`, "");
    if (subdomain && !pathname.startsWith("/subdomain/")) {
      return NextResponse.rewrite(new URL(`/subdomain/${subdomain}`, request.url));
    }
  }

  const session = await authInstance.api.getSession({ headers: request.headers });
  const isAuthenticated = !!session?.user?.id;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
