import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { and, eq, lte, sql, type SQL } from "drizzle-orm";

import {
  releaseUserSubdomains,
  disconnectUserIntegrations,
  PAST_DUE_GRACE_DAYS
} from "@/lib/billing-utils";

function normalizePlan(plan: string | null | undefined): "free" | "pro" | "business" | null {
  if (!plan) return null;

  const normalized = plan.toLowerCase();
  if (normalized === "agency") return "business";
  if (normalized === "free" || normalized === "pro" || normalized === "business") {
    return normalized;
  }

  return null;
}

function parseSignature(headerValue: string | null): string | null {
  if (!headerValue) return null;

  if (headerValue.includes("=")) {
    const [, value] = headerValue.split("=", 2);
    return value?.trim() ?? null;
  }

  return headerValue.trim();
}

function verifyDodoSignature(body: string, signatureHeader: string | null): boolean {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing DODO_PAYMENTS_WEBHOOK_SECRET.");
    return false;
  }

  const signature = parseSignature(signatureHeader);
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

async function downgradeIfPastDueExceeded(userId: string) {
  const threshold = new Date(Date.now() - PAST_DUE_GRACE_DAYS * 24 * 60 * 60 * 1000);

  const [downgraded] = await db
    .update(users)
    .set({
      plan: "free",
      billingSubscriptionId: null,
      billingPastDueSince: null,
    })
    .where(and(eq(users.id, userId), lte(users.billingPastDueSince, threshold)))
    .returning({ id: users.id });

  if (downgraded?.id) {
    await releaseUserSubdomains(downgraded.id);
    await disconnectUserIntegrations(downgraded.id);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature =
    request.headers.get("x-dodo-signature") ??
    request.headers.get("dodo-signature") ??
    request.headers.get("x-webhook-signature");

  if (!verifyDodoSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventType = payload.type;

  try {
    if (eventType === "subscription.created" || eventType === "subscription.updated") {
      const { metadata, id, customer_id } = payload.data;
      const userId = metadata?.userId;
      const plan = normalizePlan(metadata?.plan);

      if (userId && plan) {
        await db
          .update(users)
          .set({
            plan,
            billingSubscriptionId: id,
            billingCustomerId: customer_id,
            billingPastDueSince: null,
          })
          .where(eq(users.id, userId));

        if (plan === "free") {
          await releaseUserSubdomains(userId);
          await disconnectUserIntegrations(userId);
        }
      }
    }

    if (eventType === "subscription.past_due" || eventType === "payment.failed") {
      const { metadata, customer_id } = payload.data;
      const userId = metadata?.userId;

      if (userId) {
        const updatePayload: { billingPastDueSince: SQL; billingCustomerId?: string } = {
          billingPastDueSince: sql`COALESCE(${users.billingPastDueSince}, NOW())`,
        };

        if (customer_id) {
          updatePayload.billingCustomerId = customer_id;
        }

        await db
          .update(users)
          .set(updatePayload)
          .where(eq(users.id, userId));

        await downgradeIfPastDueExceeded(userId);
      }
    }

    if (eventType === "invoice.paid" || eventType === "payment.succeeded") {
      const { metadata } = payload.data;
      const userId = metadata?.userId;

      if (userId) {
        await db
          .update(users)
          .set({ billingPastDueSince: null })
          .where(eq(users.id, userId));
      }
    }

    if (eventType === "subscription.cancelled") {
      const { id } = payload.data;
      const [updatedUser] = await db
        .update(users)
        .set({
          plan: "free",
          billingSubscriptionId: null,
          billingPastDueSince: null,
        })
        .where(eq(users.billingSubscriptionId, id))
        .returning({ id: users.id });

      if (updatedUser?.id) {
        await releaseUserSubdomains(updatedUser.id);
        await disconnectUserIntegrations(updatedUser.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
