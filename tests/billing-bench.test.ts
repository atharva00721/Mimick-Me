import { describe, expect, it, mock } from "bun:test";

// Mock date-fns
mock.module("date-fns", () => ({
  startOfMonth: mock(() => new Date()),
  endOfMonth: mock(() => new Date()),
}));

// Mock the db and schema
const mockSelect = mock(() => ({
  from: mock(() => ({
    where: mock(() => [{ value: 5 }]),
  })),
}));

const mockDb = {
  select: mockSelect,
};

mock.module("@/lib/db", () => ({
  db: mockDb,
  getProfileById: mock(() => Promise.resolve({ plan: "free" })),
}));

// We need to mock the schema as well
mock.module("@/lib/schema", () => ({
  agents: { userId: "userId", id: "agentId" },
  aiTelemetryEvents: { agentId: "agentId", eventType: "eventType", createdAt: "createdAt" },
  portfolios: { userId: "userId" },
  agentLeads: { agentId: "agentId", createdAt: "createdAt" },
}));

// Mock drizzle-orm
mock.module("drizzle-orm", () => ({
  eq: mock(),
  and: mock(),
  gte: mock(),
  lte: mock(),
  count: mock(),
  inArray: mock(),
}));

// Now import the function to test
const { checkAiMessageLimit } = await import("@/lib/billing");

describe("checkAiMessageLimit performance and safety", () => {
  it("should measure the number of queries in the optimized implementation", async () => {
    // Reset select mock to track calls
    mockSelect.mockClear();

    let callCount = 0;
    mockSelect.mockImplementation(() => {
      callCount++;
      return {
        from: () => ({
          where: () => {
             if (callCount === 1) {
                 return Promise.resolve([{ id: "agent-1" }, { id: "agent-2" }, { id: "agent-3" }]);
             }
             return Promise.resolve([{ value: 30 }]);
          }
        })
      } as any;
    });

    await checkAiMessageLimit("user-1");

    console.log(`Total DB select calls: ${callCount}`);
    // 1 call for agents + 1 call for ALL telemetry counts = 2 calls total
    expect(callCount).toBe(2);
  });

  it("should handle empty agents list gracefully without calling inArray", async () => {
    // Reset select mock to track calls
    mockSelect.mockClear();

    let callCount = 0;
    mockSelect.mockImplementation(() => {
      callCount++;
      return {
        from: () => ({
          where: () => {
             // Return no agents
             return Promise.resolve([]);
          }
        })
      } as any;
    });

    const result = await checkAiMessageLimit("user-empty");

    expect(callCount).toBe(1); // Only the agents query
    expect(result.currentCount).toBe(0);
    expect(result.allowed).toBe(true);
  });
});
