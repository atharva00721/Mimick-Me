import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/route-helpers";
import { DodoPayments } from "dodopayments";
import { getProfileById } from "@/lib/db";

const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
});

export async function POST() {
    const authResult = await requireUserId();
    if (!authResult.ok) {
        return authResult.response;
    }

    try {
        const profile = await getProfileById(authResult.userId);

        if (!profile?.billingCustomerId) {
            return NextResponse.json({ error: "No billing customer found" }, { status: 404 });
        }

        const session = await dodo.customers.customerPortal.create(profile.billingCustomerId);

        if (session.link) {
            return NextResponse.json({ url: session.link });
        } else {
            return NextResponse.json({ error: "Failed to generate portal link" }, { status: 500 });
        }
    } catch (error) {
        console.error("Portal error:", error);
        return NextResponse.json({ error: "An error occurred generating the portal link" }, { status: 500 });
    }
}
