import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const url = new URL(`/`, req.url);

  // console.log("token", token);
  // If there's no token or the token is invalid, redirect to the login page

  if (!token) {
    return NextResponse.redirect("/login");
  }
  if (token) {
    const currentDate = new Date();
    const expirationDate = new Date((token.exp as number) * 1000);
    // console.log(expirationDate);
    if (currentDate >= expirationDate) {
      return NextResponse.redirect("/login");
    }
  }
  if (req.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
