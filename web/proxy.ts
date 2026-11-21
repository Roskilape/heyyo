import { clerkMiddleware } from "@clerk/nextjs/server";

// Register Clerk for web requests; protected resources must still check auth.
export default clerkMiddleware();

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for Clerk's auto-proxy path
		"/__clerk/:path*",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
