import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";

const mockRetainMemory = jest.fn<any>();
const mockRecallMemories = jest.fn<any>();
const mockFindMany = jest.fn<any>();
const mockUpsert = jest.fn<any>();
const mockInteractionCreate = jest.fn<any>();

jest.unstable_mockModule("../src/services/memory.service.js", () => ({
  initBank: jest.fn<any>(),
  retainMemory: mockRetainMemory,
  recallMemories: mockRecallMemories,
  reflectOnDeal: jest.fn<any>(),
}));

jest.unstable_mockModule("../src/utils/db.js", () => ({
  prisma: {
    deal: {
      findMany: mockFindMany,
      upsert: mockUpsert,
    },
    interaction: {
      create: mockInteractionCreate,
    }
  }
}));

const { default: app } = await import("../src/app.js");

describe("Deal API Endpoints", () => {
  it("GET /api/deals should return an array of deals", async () => {
    mockFindMany.mockResolvedValue([{ id: "1", dealId: "acme-001", dealName: "Acme Corp" }]);
    const res = await request(app).get("/api/deals");
    expect(res.status).toBe(200);
    expect(res.body.deals).toBeInstanceOf(Array);
    expect(res.body.deals[0].dealId).toBe("acme-001");
  });

  it("POST /api/interactions should fail validation if dealId is missing (Zod Test)", async () => {
    const res = await request(app).post("/api/interactions").send({
      note: "Test note without dealId",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");

  });

  it("POST /api/interactions should succeed with valid data", async () => {
    mockRetainMemory.mockResolvedValue(true);
    const res = await request(app).post("/api/interactions").send({
      dealId: "stark-002",
      dealName: "Stark Ind",
      note: "Valid note about the deal",
      stakeholder: "Tony Stark",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
