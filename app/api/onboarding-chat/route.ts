// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { refineOnboardingAnswer } from "@/lib/ai/refine-onboarding";
import { getPortfolioByHandle } from "@/lib/db/portfolio";
import { getNextStep, getQuestionForStep } from "@/lib/onboarding/state-machine";
import type { OnboardingChatRequest, OnboardingStep } from "@/lib/onboarding/types";
import { validateStepInput } from "@/lib/onboarding/validation";
import { consumeCredits, getCredits } from "@/lib/credits";

const CREDIT_COST = 1;

function badRequest(message: string) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    { status: 400 }
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: OnboardingChatRequest;
  try {
    body = (await request.json()) as OnboardingChatRequest;
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const currentStep = body.step as OnboardingStep;
  if (!currentStep || !body.answer || typeof body.answer !== "string") {
    return badRequest("Missing step or answer.");
  }

  const validation = validateStepInput(currentStep, body.answer);
  if (!validation.ok) {
    return badRequest(validation.message);
  }

  if (currentStep === "handle") {
    try {
      const existing = await getPortfolioByHandle(validation.value as string);
      if (existing) {
        return badRequest("This handle is already taken. Please choose another one.");
      }
    } catch (error) {
      console.error("Failed while checking handle availability", error);
      return NextResponse.json(
        { ok: false, error: "Unable to validate handle right now." },
        { status: 500 }
      );
    }
  }

  const shouldRefine = ["name", "title", "bio", "sections", "services", "projects"].includes(currentStep);

  let finalValue: unknown = validation.value;
  let refinedAnswer = String(validation.value);

  if (shouldRefine) {
    const currentCredits = await getCredits(session.user.id);
    if (currentCredits < CREDIT_COST) {
      return NextResponse.json({ ok: false, error: "Not enough credits" }, { status: 402 });
    }

    refinedAnswer = await refineOnboardingAnswer(currentStep, body.answer);
    const refinedValidation = validateStepInput(currentStep, refinedAnswer);
    if (refinedValidation.ok) {
      finalValue = refinedValidation.value;
    }

    const creditsConsumed = await consumeCredits(session.user.id, CREDIT_COST);
    if (!creditsConsumed) {
      return NextResponse.json({ ok: false, error: "Not enough credits" }, { status: 402 });
    }
  }

  const mergedState = {
    ...(body?.state ?? {}),
    [currentStep]: finalValue,
  };

  const nextStep = getNextStep(currentStep, mergedState);
  const nextQuestionConfig = nextStep ? getQuestionForStep(nextStep) : null;
  const nextAssistantMessage = nextQuestionConfig?.blocks[0]?.prompt
    ?? "Perfect. You are done with onboarding. Saving your portfolio now.";

  return NextResponse.json({
    ok: true,
    step: currentStep,
    nextStep,
    assistantMessage: nextAssistantMessage,
    assistantBlocks: nextQuestionConfig?.blocks ?? [],
    state: mergedState,
    refinedAnswer,
    completed: nextStep === null,
  });
}
