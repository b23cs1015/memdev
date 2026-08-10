import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../src/config/env.js";

const mockPrisma = vi.hoisted(() => ({
  note: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
  collection: {
    count: vi.fn(),
  },
  tag: {
    count: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({
  prisma: mockPrisma,
}));

import app from "../src/app.js";

describe("Dashboard API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/dashboard/stats", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get("/api/dashboard/stats");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.note.count).not.toHaveBeenCalled();
      expect(mockPrisma.note.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.collection.count).not.toHaveBeenCalled();
      expect(mockPrisma.tag.count).not.toHaveBeenCalled();
    });

    it("returns dashboard statistics for the authenticated user", async () => {
      const recentNotes = [
        {
          id: "note-1",
          userId: "user-1",
          collectionId: null,
          title: "System Design",
          content: "Rate limiting controls request frequency.",
          sourceUrl: null,
          summary: null,
          isFavorite: true,
          isArchived: false,
          createdAt: new Date("2026-08-10T10:00:00.000Z"),
          updatedAt: new Date("2026-08-10T10:00:00.000Z"),
        },
        {
          id: "note-2",
          userId: "user-1",
          collectionId: null,
          title: "Database Indexing",
          content: "Indexes improve query performance.",
          sourceUrl: null,
          summary: null,
          isFavorite: false,
          isArchived: false,
          createdAt: new Date("2026-08-09T10:00:00.000Z"),
          updatedAt: new Date("2026-08-09T10:00:00.000Z"),
        },
      ];

      mockPrisma.note.count
        .mockResolvedValueOnce(12)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(2);

      mockPrisma.collection.count.mockResolvedValue(3);
      mockPrisma.tag.count.mockResolvedValue(8);
      mockPrisma.note.findMany.mockResolvedValue(recentNotes);

      const response = await request(app)
        .get("/api/dashboard/stats")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        stats: {
          totalNotes: 12,
          favoriteNotes: 4,
          archivedNotes: 2,
          totalCollections: 3,
          totalTags: 8,
          recentNotes: [
            {
              id: "note-1",
              userId: "user-1",
              collectionId: null,
              title: "System Design",
              content: "Rate limiting controls request frequency.",
              sourceUrl: null,
              summary: null,
              isFavorite: true,
              isArchived: false,
              createdAt: "2026-08-10T10:00:00.000Z",
              updatedAt: "2026-08-10T10:00:00.000Z",
            },
            {
              id: "note-2",
              userId: "user-1",
              collectionId: null,
              title: "Database Indexing",
              content: "Indexes improve query performance.",
              sourceUrl: null,
              summary: null,
              isFavorite: false,
              isArchived: false,
              createdAt: "2026-08-09T10:00:00.000Z",
              updatedAt: "2026-08-09T10:00:00.000Z",
            },
          ],
        },
      });

      expect(mockPrisma.note.count).toHaveBeenNthCalledWith(1, {
        where: {
          userId: "user-1",
        },
      });

      expect(mockPrisma.note.count).toHaveBeenNthCalledWith(2, {
        where: {
          userId: "user-1",
          isFavorite: true,
        },
      });

      expect(mockPrisma.note.count).toHaveBeenNthCalledWith(3, {
        where: {
          userId: "user-1",
          isArchived: true,
        },
      });

      expect(mockPrisma.collection.count).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mockPrisma.tag.count).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
    });

    it("returns zero counts and an empty recent notes list", async () => {
      mockPrisma.note.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockPrisma.collection.count.mockResolvedValue(0);
      mockPrisma.tag.count.mockResolvedValue(0);
      mockPrisma.note.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/dashboard/stats")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        stats: {
          totalNotes: 0,
          favoriteNotes: 0,
          archivedNotes: 0,
          totalCollections: 0,
          totalTags: 0,
          recentNotes: [],
        },
      });
    });

    it("uses the authenticated user ID for every database query", async () => {
      mockPrisma.note.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      mockPrisma.collection.count.mockResolvedValue(2);
      mockPrisma.tag.count.mockResolvedValue(3);
      mockPrisma.note.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/dashboard/stats")
        .set(
          "Authorization",
          `Bearer ${createTestToken("authenticated-user")}`,
        );

      expect(response.status).toBe(200);

      expect(mockPrisma.note.count).toHaveBeenNthCalledWith(1, {
        where: {
          userId: "authenticated-user",
        },
      });

      expect(mockPrisma.note.count).toHaveBeenNthCalledWith(2, {
        where: {
          userId: "authenticated-user",
          isFavorite: true,
        },
      });

      expect(mockPrisma.note.count).toHaveBeenNthCalledWith(3, {
        where: {
          userId: "authenticated-user",
          isArchived: true,
        },
      });

      expect(mockPrisma.collection.count).toHaveBeenCalledWith({
        where: {
          userId: "authenticated-user",
        },
      });

      expect(mockPrisma.tag.count).toHaveBeenCalledWith({
        where: {
          userId: "authenticated-user",
        },
      });

      expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: "authenticated-user",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
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