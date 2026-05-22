import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { betterAuth } from "@/lib/auth/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string }
    | null;

  const email = String(body?.email ?? "").toLowerCase().trim();
  const password = String(body?.password ?? "");
  const name = body?.name ? String(body.name).trim() : "";

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (min 8 chars) are required." },
      { status: 400 }
    );
  }

  try {
    const headersList = await headers();
    const { headers: resHeaders } = await betterAuth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: headersList,
      returnHeaders: true,
    });

    const response = NextResponse.json({ ok: true }, { status: 201 });
    const setCookie = resHeaders?.get?.("set-cookie");
    if (setCookie) {
      response.headers.append("set-cookie", setCookie);
    }
    return response;
  } catch (error: unknown) {
    console.error("Signup error", error);
    const err = error as { code?: string };
    if (err.code === "USER_ALREADY_EXISTS") {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

}
