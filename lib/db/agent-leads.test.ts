import { describe, expect, it } from "bun:test";
import { buildLeadLookup, mergeLeadData, type ExistingLead, type SaveLeadInput } from "@/lib/db/agent-leads";

describe("agent lead dedupe helpers", () => {
  it("normalizes contact channels for lookup", () => {
    const lookup = buildLeadLookup({
      email: " Test@Example.com ",
      phone: "(555) 101-2020",
      website: "https://Example.com/",
    });

    expect(lookup).toEqual({
      email: "test@example.com",
      phone: "5551012020",
      website: "example.com",
    });
  });

  it("merges new fields while retaining existing provenance", () => {
    const existing: ExistingLead = {
      id: "lead-1",
      name: "Alex",
      email: "alex@example.com",
      phone: null,
      website: null,
      budget: null,
      projectDetails: "Need website refresh",
      meetingTime: null,
      confidence: 61,
      sessionId: "session-1",
      captureTurn: 2,
      notificationSent: false,
    };

    const incoming: SaveLeadInput = {
      agentId: "agent-1",
      portfolioId: null,
      name: null,
      email: "alex@example.com",
      phone: "+1 555 222 1111",
      website: "https://alexsite.io/",
      budget: "$8k",
      projectDetails: "",
      meetingTime: null,
      confidence: 74,
      sessionId: "session-2",
      captureTurn: 5,
    };

    const merged = mergeLeadData(existing, incoming, buildLeadLookup(incoming));

    expect(merged.phone).toBe("+15552221111");
    expect(merged.website).toBe("alexsite.io");
    expect(merged.budget).toBe("$8k");
    expect(merged.captureTurn).toBe(2);
    expect(merged.confidence).toBe(74);
  });
});
