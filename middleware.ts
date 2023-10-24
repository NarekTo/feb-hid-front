import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const url = new URL(`/`, req.url);

  if (req.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}