import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname, search } = request.nextUrl;

  // 1) Protected pages → redirect to /login with next
  const protectedPrefixes = ["/dashboard", "/admin", "/submit", "/events/saved"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // 2) Logged-in users should not see /login or /register
  if (user && (pathname === "/login" || pathname === "/register")) {
    const next = request.nextUrl.searchParams.get("next");
    if (next && /^\/(?!\/)/.test(next)) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3) Logged-in users on public /leaderboard → real leaderboard
  if (user && pathname === "/leaderboard") {
    return NextResponse.redirect(new URL("/dashboard/community", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
