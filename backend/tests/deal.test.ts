import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

// Mock the memory service and Prisma client so we don't hit real APIs during testing
jest.mock("../src/services/memory.service.js", () => ({
  retainMemory: jest.fn<any>().mockResolvedValue(true),
  recallMemories: jest.fn<any>().mockResolvedValue([]),
}));

jest.mock("../src/utils/db.js", () => ({
  prisma: {
    deal: {
      findMany: jest.fn<any>().mockResolvedValue([{ id: "1", dealId: "acme-001", dealName: "Acme Corp" }]),
      upsert: jest.fn<any>().mockResolvedValue({}),
    },
    interaction: {
      create: jest.fn<any>().mockResolvedValue({}),
    }
  }
}));

describe("Deal API Endpoints", () => {
  it("GET /api/deals should return an array of deals", async () => {
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
    expect(res.body.details[0].path[1]).toBe("dealId");
  });

  it("POST /api/interactions should succeed with valid data", async () => {
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
