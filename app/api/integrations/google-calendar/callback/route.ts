import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { getAgentByUserId } from "@/lib/agent/configure";
import {
  exchangeCodeForTokens,
  getCurrentUserEmail,
  updateAgentCalendarConnection,
} from "@/lib/integrations/google-calendar";

const OAUTH_STATE_COOKIE = "google_oauth_state";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");
  const cookieState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  console.log("OAuth Callback Hit", { hasCode: !!code, error });

  const clearStateCookie = (response: NextResponse) => {
    response.cookies.set(OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(0),
      path: "/",
    });
    return response;
  };

  if (!returnedState || !cookieState || returnedState !== cookieState) {
    return clearStateCookie(
      NextResponse.redirect(new URL("/dashboard/agent?calendar_error=invalid_state", request.url))
    );
  }

  if (error) {
    console.error("Google OAuth error:", error);
    return clearStateCookie(
      NextResponse.redirect(new URL(`/dashboard/agent?calendar_error=${error}`, request.url))
    );
  }

  if (!code) {
    console.error("No code provided in callback");
    return clearStateCookie(
      NextResponse.redirect(new URL("/dashboard/agent?calendar_error=missing_code", request.url))
    );
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return clearStateCookie(
      NextResponse.redirect(new URL("/auth/signin?redirect=/dashboard/agent", request.url))
    );
  }

  try {
    const { origin } = new URL(request.url);
    const tokens = await exchangeCodeForTokens(code, origin);
    const accountEmail = await getCurrentUserEmail(tokens.access_token);

    const agent = await getAgentByUserId(session.user.id);

    if (!agent) {
      return clearStateCookie(
        NextResponse.redirect(new URL("/dashboard/agent?calendar_error=no_agent", request.url))
      );
    }

    await updateAgentCalendarConnection(agent.id, tokens, accountEmail);

    return clearStateCookie(
      NextResponse.redirect(new URL("/dashboard/agent?calendar=connected", request.url))
    );
  } catch (err) {
    console.error("Google Calendar OAuth error:", err);
    return clearStateCookie(
      NextResponse.redirect(new URL("/dashboard/agent?calendar_error=auth_failed", request.url))
    );
  }
}
