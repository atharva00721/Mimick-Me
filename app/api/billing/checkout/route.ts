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
        const { plan } = await request.json();
        const normalizedPlan = plan === "agency" ? "business" : plan;

        let productId = "";
        if (normalizedPlan === "pro") {
            productId = process.env.DODO_PRO_PRODUCT_ID!;
        } else if (normalizedPlan === "business") {
            productId = process.env.DODO_BUSINESS_PRODUCT_ID!;
        } else {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        if (!productId || productId.includes("placeholder")) {
            return NextResponse.json(
                { error: "Billing is not correctly configured. Missing valid Product ID." },
                { status: 400 }
            );
        }

        const profile = await getProfileById(authResult.userId);
        if (!profile?.email) {
            return NextResponse.json({ error: "Unable to resolve user email for checkout" }, { status: 400 });
        }

        const session = await dodo.checkoutSessions.create({
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                },
            ],
            customer: {
                email: profile.email,
            },
            metadata: {
                userId: authResult.userId,
                plan: normalizedPlan,
            },
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing?status=success`,
        });

        return NextResponse.json({ url: session.checkout_url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}
