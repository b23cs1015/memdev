import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../src/config/env.js";

const mockPrisma = vi.hoisted(() => ({
  note: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  collection: {
    findFirst: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({
  prisma: mockPrisma,
}));

import app from "../src/app.js";

describe("Notes API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/notes", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app)
        .post("/api/notes")
        .send({
          title: "Test note",
          content: "Test content",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.note.create).not.toHaveBeenCalled();
    });

    it("rejects invalid note data", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          title: "",
          content: "",
          sourceUrl: "not-a-url",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid note data",
        errors: {
          title: ["Title is required"],
          content: ["Content is required"],
          sourceUrl: ["Please provide a valid source URL"],
        },
      });

      expect(mockPrisma.note.create).not.toHaveBeenCalled();
    });

    it("creates a note for the authenticated user", async () => {
      const createdAt = new Date("2026-08-09T00:00:00.000Z");
      const updatedAt = new Date("2026-08-09T00:00:00.000Z");

      mockPrisma.note.create.mockResolvedValue({
        id: "note-1",
        userId: "user-1",
        collectionId: null,
        title: "System Design",
        content: "Rate limiting controls request frequency.",
        sourceUrl: "https://example.com/rate-limiting",
        summary: null,
        isFavorite: false,
        isArchived: false,
        createdAt,
        updatedAt,
      });

      const response = await request(app)
        .post("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          title: "System Design",
          content: "Rate limiting controls request frequency.",
          sourceUrl: "https://example.com/rate-limiting",
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        note: {
          id: "note-1",
          userId: "user-1",
          collectionId: null,
          title: "System Design",
          content: "Rate limiting controls request frequency.",
          sourceUrl: "https://example.com/rate-limiting",
          summary: null,
          isFavorite: false,
          isArchived: false,
          createdAt: "2026-08-09T00:00:00.000Z",
          updatedAt: "2026-08-09T00:00:00.000Z",
        },
      });

      expect(mockPrisma.note.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          title: "System Design",
          content: "Rate limiting controls request frequency.",
          sourceUrl: "https://example.com/rate-limiting",
          collectionId: undefined,
        },
      });
    });

    it("uses the authenticated user ID instead of a userId from the request body", async () => {
      mockPrisma.note.create.mockResolvedValue({
        id: "note-2",
        userId: "authenticated-user",
        collectionId: null,
        title: "Ownership Test",
        content: "This note must belong to the authenticated user.",
        sourceUrl: null,
        summary: null,
        isFavorite: false,
        isArchived: false,
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .post("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("authenticated-user")}`,
        )
        .send({
          userId: "another-user",
          title: "Ownership Test",
          content: "This note must belong to the authenticated user.",
        });

      expect(response.status).toBe(201);

      expect(mockPrisma.note.create).toHaveBeenCalledWith({
        data: {
          userId: "authenticated-user",
          title: "Ownership Test",
          content: "This note must belong to the authenticated user.",
          sourceUrl: undefined,
          collectionId: undefined,
        },
      });

      expect(
        mockPrisma.note.create.mock.calls[0][0].data.userId,
      ).toBe("authenticated-user");
    });

    it("rejects a collection that does not belong to the authenticated user", async () => {
      mockPrisma.collection.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          title: "Collection Test",
          content: "This should not be created.",
          collectionId: "other-users-collection",
        });

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Collection not found",
      });

      expect(mockPrisma.collection.findFirst).toHaveBeenCalledWith({
        where: {
          id: "other-users-collection",
          userId: "user-1",
        },
      });

      expect(mockPrisma.note.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/notes", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get("/api/notes");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.note.findMany).not.toHaveBeenCalled();
    });

    it("returns only notes belonging to the authenticated user", async () => {
      const createdAt = new Date("2026-08-09T00:00:00.000Z");
      const updatedAt = new Date("2026-08-09T00:00:00.000Z");

      mockPrisma.note.findMany.mockResolvedValue([
        {
          id: "note-1",
          userId: "user-1",
          collectionId: null,
          title: "My Note",
          content: "My content",
          sourceUrl: null,
          summary: null,
          isFavorite: false,
          isArchived: false,
          createdAt,
          updatedAt,
        },
      ]);

      const response = await request(app)
        .get("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        notes: [
          {
            id: "note-1",
            userId: "user-1",
            collectionId: null,
            title: "My Note",
            content: "My content",
            sourceUrl: null,
            summary: null,
            isFavorite: false,
            isArchived: false,
            createdAt: "2026-08-09T00:00:00.000Z",
            updatedAt: "2026-08-09T00:00:00.000Z",
          },
        ],
      });

      expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });
});

function createTestToken(userId: string): string {
  return jwt.sign(
    {
      userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
}