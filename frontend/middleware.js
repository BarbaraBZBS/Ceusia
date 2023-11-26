import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		//console.log("req next : ", req.nextUrl.pathname);
		//console.log("req token : ", req.nextauth.token.role);
		//if (
		//	req.nextUrl.pathname.startsWith("/CreateUser") &&
		//	req.nextauth.token.role !== "admin"
		//) {
		//	return NextResponse.rewrite(new URL("/Denied", req.url));
		//}
	},
	{
		pages: {
			signIn: "/auth/signIn",
			error: "/auth/signIn",
		},
	},
	{
		callbacks: {
			//authorized: ({ token }) => !!token,
			authorized(req, token) {
				if (token) return true;
			},
		},
	}
);

//export { default } from "next-auth/middleware";
//export const config = { matcher: ["/CreateUser"] };
//export const config = { matcher: "/((?!.*\\.|auth|api|about\\/).*)" };
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - auth (auth routes: log in & out, register)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - icon.ico (favicon file renamed to icon when next.js fails to load favicon)
		 * - robots.txt (robots file)
		 */
		"/((?!api|auth|about|.*\\.|_next/static|_next/image|assets|favicon.ico|icon.ico|$).*)",
	],
};
