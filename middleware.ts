import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.SECRET;

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret });
  const url = new URL("/", req.url);
  const loginUrl = new URL("/login", req.url);

  // If the user is authenticated and trying to access the login page, redirect them to the home page
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(url);
  }

  if (token) {
    const currentDate = new Date();
    const expirationDate = new Date((token.exp as number) * 1000);
    if (currentDate >= expirationDate) {
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next(); // Pass control to the next Middleware or route handler
};
