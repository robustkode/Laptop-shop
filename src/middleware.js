export const config = {
  matcher: "/admin/:path*",
};

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { adminRole, moderatorRole } from "./config";

export default withAuth(
  function middleware(request) {
    // console.log(request.nextUrl.pathname)
    // console.log(request.nextauth.token)
    if (
      request.nextauth.token?.role !== adminRole &&
      request.nextauth.token?.role !== moderatorRole
    ) {
      return Response.redirect(new URL("/denied", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);