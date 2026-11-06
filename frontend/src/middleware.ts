import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret && process.env.NODE_ENV === "production") {
  console.error("FATAL: JWT_SECRET environment variable is missing in production.");
}
const JWT_SECRET = rawSecret || (process.env.NODE_ENV === "production" ? "" : "tangent_super_secret_jwt_key_development_32chars_min");
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

async function isValidAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return Boolean(payload && payload.role === "admin");
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Admin Panel UI subpages (protect subpages, allow /admin-panel for login form)
  if (pathname.startsWith("/admin-panel/") && pathname !== "/admin-panel") {
    const isAdmin = await isValidAdminSession(request);
    if (!isAdmin) {
      const loginUrl = new URL("/admin-panel", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Protected API Routes
  let requiresAdmin = false;

  // Settings: POST
  if (pathname === "/api/settings" && method === "POST") {
    requiresAdmin = true;
  }

  // Shipments (all management endpoints)
  if (pathname.startsWith("/api/shipments")) {
    requiresAdmin = true;
  }

  // Customers CRM
  if (pathname.startsWith("/api/customers")) {
    requiresAdmin = true;
  }

  // Coupons management (exclude customer-facing /api/coupons/validate)
  if (
    pathname === "/api/coupons" ||
    (pathname.startsWith("/api/coupons/") && !pathname.startsWith("/api/coupons/validate"))
  ) {
    requiresAdmin = true;
  }

  // Orders: GET list, or status/refund actions
  if (pathname === "/api/orders" && method === "GET") {
    requiresAdmin = true;
  }
  if (pathname.match(/^\/api\/orders\/[^\/]+\/(status|refund)$/)) {
    requiresAdmin = true;
  }

  // Products: POST, PATCH, DELETE
  if (pathname === "/api/products" && method === "POST") {
    requiresAdmin = true;
  }
  if (pathname.startsWith("/api/products/") && ["PATCH", "DELETE"].includes(method)) {
    requiresAdmin = true;
  }

  // Inquiries list: GET
  if (pathname === "/api/inquiries" && method === "GET") {
    requiresAdmin = true;
  }

  if (requiresAdmin) {
    const isAdmin = await isValidAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Valid admin session required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-panel/:path*",
    "/api/settings",
    "/api/shipments/:path*",
    "/api/customers/:path*",
    "/api/coupons/:path*",
    "/api/coupons",
    "/api/orders/:path*",
    "/api/orders",
    "/api/products/:path*",
    "/api/products",
    "/api/inquiries",
  ],
};
