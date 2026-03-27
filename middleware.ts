import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/departments/:path*",
    "/profile/:path*",
    "/users/:path*",
  ],
};