import { enrichLeadData } from "./lib/ai/enrichment";
import { sendLeadNotificationEmail } from "./lib/mail";

async function runTest() {
  if (process.env.RUN_MANUAL_SPY_TEST !== "true") {
    console.error("Set RUN_MANUAL_SPY_TEST=true to run this manual script.");
    process.exit(1);
  }

  const leadEmail = process.env.SPY_TEST_LEAD_EMAIL?.trim();
  const leadName = process.env.SPY_TEST_LEAD_NAME?.trim() || "Manual Test Lead";
  const notificationEmail = process.env.SPY_TEST_NOTIFICATION_EMAIL?.trim();

  if (!leadEmail || !notificationEmail) {
    throw new Error("SPY_TEST_LEAD_EMAIL and SPY_TEST_NOTIFICATION_EMAIL are required.");
  }

  const enrichment = await enrichLeadData(leadEmail, leadName);

  await sendLeadNotificationEmail(
    notificationEmail,
    {
      name: leadName,
      email: leadEmail,
      projectDetails: "Manual test lead notification.",
      budget: "N/A",
    },
    "Manual Test Script",
    enrichment
  );
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
