import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";

const mockFindMany = jest.fn<any>();
const mockCreate = jest.fn<any>();
const mockFindUnique = jest.fn<any>();

jest.unstable_mockModule("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      deal: {
        findMany: mockFindMany,
        create: mockCreate,
        findUnique: mockFindUnique,
      },
      organization: {
        findUnique: jest.fn<any>().mockResolvedValue({ id: "default-org", vectorBankId: "bank-1" }),
        create: jest.fn<any>().mockResolvedValue({ id: "default-org" }),
      }
    }))
  };
});

jest.unstable_mockModule("@clerk/express", () => {
  return {
    clerkMiddleware: () => (req: any, res: any, next: any) => {
      req.auth = { userId: "test-user-id" };
      next();
    },
    requireAuth: () => (req: any, res: any, next: any) => next()
  };
});

const mockRetain = jest.fn<any>();

jest.unstable_mockModule("@vectorize-io/hindsight-client", () => {
  return {
    HindsightClient: jest.fn().mockImplementation(() => ({
      retain: mockRetain,
      createBank: jest.fn<any>().mockResolvedValue(true),
    }))
  };
});

const { default: app } = await import("../server.ts");

describe("Deal API Endpoints", () => {
  it("GET /api/deals should return an array of deals", async () => {
    mockFindMany.mockResolvedValue([{ id: "acme-001", name: "Acme Corp", clerkUserId: "test-user-id" }]);
    const res = await request(app).get("/api/deals");
    expect(res.status).toBe(200);
    expect(res.body.deals).toBeInstanceOf(Array);
    expect(res.body.deals[0].dealId).toBe("acme-001");
  });

  it("POST /api/interactions should fail validation if dealId is missing", async () => {
    const res = await request(app).post("/api/interactions").send({
      note: "Test note without dealId",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("dealId and note are required");
  });

  it("POST /api/interactions should succeed with valid data", async () => {
    mockRetain.mockResolvedValue(true);
    mockFindUnique.mockResolvedValue({ id: "stark-002", clerkUserId: "test-user-id" });

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
