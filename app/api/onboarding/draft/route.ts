import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { onboardingDrafts } from "@/lib/schema";
import {
  withDefaultSelectedSections,
  type OnboardingData,
  type OnboardingSelectedSections,
} from "@/lib/onboarding/types";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [draft] = await db
      .select()
      .from(onboardingDrafts)
      .where(eq(onboardingDrafts.userId, session.user.id))
      .limit(1);

    const state = withDefaultSelectedSections((draft?.state as Partial<OnboardingData>) ?? null);
    return NextResponse.json({ ok: true, state });
  } catch (error) {
    console.error("Failed to fetch onboarding draft", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch draft" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { selectedSections?: OnboardingSelectedSections } = {};
  try {
    body = (await request.json()) as { selectedSections?: OnboardingSelectedSections };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (!body.selectedSections || body.selectedSections.hero !== true) {
    return NextResponse.json({ ok: false, error: "Invalid selectedSections payload" }, { status: 400 });
  }

  try {
    const [draft] = await db
      .select()
      .from(onboardingDrafts)
      .where(eq(onboardingDrafts.userId, session.user.id))
      .limit(1);

    const merged = withDefaultSelectedSections({
      ...((draft?.state as Partial<OnboardingData>) ?? {}),
      selectedSections: body.selectedSections,
    });

    await db
      .insert(onboardingDrafts)
      .values({ userId: session.user.id, state: (merged ?? {}) as Record<string, unknown>, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: onboardingDrafts.userId,
        set: {
          state: (merged ?? {}) as Record<string, unknown>,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ ok: true, state: merged });
  } catch (error) {
    console.error("Failed to update onboarding draft", error);
    return NextResponse.json({ ok: false, error: "Failed to update draft" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.delete(onboardingDrafts).where(eq(onboardingDrafts.userId, session.user.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to clear onboarding draft", error);
    return NextResponse.json({ ok: false, error: "Failed to clear draft" }, { status: 500 });
  }
}
