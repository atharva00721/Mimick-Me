import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { ACTIVE_PORTFOLIO_COOKIE } from "@/lib/active-portfolio";
import { getPortfolioByIdAndUserId } from "@/lib/db/portfolio";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let portfolioId: string | undefined;
    try {
        const body = await request.json() as { portfolioId?: string };
        portfolioId = body?.portfolioId;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    if (!portfolioId) {
        return NextResponse.json({ ok: false, error: "portfolioId is required" }, { status: 400 });
    }

    // Verify ownership — never let a user switch to someone else's portfolio
    const portfolio = await getPortfolioByIdAndUserId(portfolioId, session.user.id);
    if (!portfolio) {
        return NextResponse.json({ ok: false, error: "Portfolio not found" }, { status: 404 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ACTIVE_PORTFOLIO_COOKIE, portfolioId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
}
