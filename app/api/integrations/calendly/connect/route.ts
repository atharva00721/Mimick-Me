import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getCalendlyOAuthUrl } from "@/lib/integrations/calendly";
import { requireUserId } from "@/lib/api/route-helpers";

const OAUTH_STATE_COOKIE = "calendly_oauth_state";

export async function GET(request: Request) {
    const authResult = await requireUserId();
    if (!authResult.ok) {
        return authResult.response;
    }

    const clientId = process.env.CALENDLY_CLIENT_ID;
    const { origin } = new URL(request.url);

    if (!clientId) {
        return NextResponse.json({ error: "Calendly OAuth not configured" }, { status: 500 });
    }

    const state = crypto.randomUUID();
    const response = NextResponse.redirect(getCalendlyOAuthUrl(state, origin));

    response.cookies.set(OAUTH_STATE_COOKIE, state, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
    });

    return response;
}
