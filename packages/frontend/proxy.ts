import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Roles } from "@/types/globals";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/customers(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  // 1️⃣ Auth sayfaları serbest
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }

  // 2️⃣ Login zorunlu
  if (isProtectedRoute(req) && !sessionClaims) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set(
      "redirect_url",
      pathname + req.nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }

  // ✅ ROLE OKUMA (DOĞRU YER)
  const role = sessionClaims?.metadata?.role as Roles | undefined;
  // console.log("Role: ", role);

  // 3️⃣ /admin erişimi (şimdilik moderator DA GİREBİLSİN dedin)
  if (pathname.startsWith("/admin")) {
    if (!role) {
      return NextResponse.redirect(
        new URL("/?unauthorized=1", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|sign-in|sign-up).*)",
  ],
};
