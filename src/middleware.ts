import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
   const token = await getToken({ req: request });
   const url = request.nextUrl;

   if (token) {
      // Redirect authenticated users away from auth pages
      if (
         url.pathname.startsWith("/signin") ||
         url.pathname.startsWith("/signup") ||
         url.pathname.startsWith("/verify") ||
         url.pathname === "/"
      ) {
         return NextResponse.redirect(new URL("/dashboard", url));
      }
   } else {
      // Redirect unauthenticated users away from protected pages
      if (url.pathname.startsWith("/dashboard")) {
         return NextResponse.redirect(new URL("/signin", url));
      }
   }

   // Continue to the requested page
   return NextResponse.next();
}

export const config = {
   matcher: ["/signin", "/signup", "/", "/dashboard/:path*", "/verify/:path*"],
};
