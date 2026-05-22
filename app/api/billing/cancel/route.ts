import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/route-helpers";
import { DodoPayments } from "dodopayments";
import { getProfileById } from "@/lib/db";

const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
});

export async function POST(request: Request) {
    const authResult = await requireUserId();
    if (!authResult.ok) {
        return authResult.response;
    }

    try {
        const profile = await getProfileById(authResult.userId);

        if (!profile?.billingSubscriptionId) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        // Cancel at the end of the billing period
        await dodo.subscriptions.update(profile.billingSubscriptionId, {
            cancel_at_next_billing_date: true,
        });

        // Update local database to reflect cancellation state if needed
        // Or wait for webhook. For now, we'll rely on the webhook to update the 'plan' status
        // but we can log it here.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
}
