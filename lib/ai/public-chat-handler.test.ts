import { describe, expect, it } from "bun:test";
import { hasSufficientLeadFields, parseLeadChannelsFromText } from "@/lib/ai/public-chat/lead-parsing";

describe("lead persistence guardrails", () => {
  it("suppresses consultative false positives without viable contact or details", () => {
    expect(
      hasSufficientLeadFields("consultative", {
        email: null,
        phone: null,
        website: null,
        projectDetails: "Need some help",
        budget: null,
      })
    ).toBe(false);
  });

  it("allows sales capture with alternate channel and project context", () => {
    expect(
      hasSufficientLeadFields("sales", {
        email: null,
        phone: "+1 (555) 111-2222",
        website: null,
        projectDetails: "We need a redesign and booking flow launch this quarter.",
        budget: null,
      })
    ).toBe(true);
  });

  it("extracts optional phone and website channels from a message", () => {
    const channels = parseLeadChannelsFromText(
      "You can reach me at +1 555 444 3333 and details are on https://Example.com/services"
    );

    expect(channels.phone).toBe("+1 555 444 3333");
    expect(channels.website).toBe("example.com/services");
  });
});
