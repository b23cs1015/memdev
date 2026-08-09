import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../src/config/env.js";

const mockPrisma = vi.hoisted(() => ({
  collection: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({
  prisma: mockPrisma,
}));

import app from "../src/app.js";

describe("Collections API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/collections", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app)
        .post("/api/collections")
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.collection.create).not.toHaveBeenCalled();
    });

    it("rejects invalid collection data", async () => {
      const response = await request(app)
        .post("/api/collections")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid collection data",
        errors: {
          name: ["Collection name is required"],
        },
      });

      expect(mockPrisma.collection.create).not.toHaveBeenCalled();
    });

    it("creates a collection for the authenticated user", async () => {
      mockPrisma.collection.findUnique.mockResolvedValue(null);

      const createdAt = new Date("2026-08-09T00:00:00.000Z");
      const updatedAt = new Date("2026-08-09T00:00:00.000Z");

      mockPrisma.collection.create.mockResolvedValue({
        id: "collection-1",
        userId: "user-1",
        name: "System Design",
        createdAt,
        updatedAt,
      });

      const response = await request(app)
        .post("/api/collections")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        collection: {
          id: "collection-1",
          userId: "user-1",
          name: "System Design",
          createdAt: "2026-08-09T00:00:00.000Z",
          updatedAt: "2026-08-09T00:00:00.000Z",
        },
      });

      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: {
          userId_name: {
            userId: "user-1",
            name: "System Design",
          },
        },
      });

      expect(mockPrisma.collection.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          name: "System Design",
        },
      });
    });

    it("rejects duplicate collection names for the same user", async () => {
      mockPrisma.collection.findUnique.mockResolvedValue({
        id: "existing-collection",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/collections")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "A collection with this name already exists",
      });

      expect(mockPrisma.collection.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/collections", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get("/api/collections");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.collection.findMany).not.toHaveBeenCalled();
    });

    it("returns an empty collection list", async () => {
      mockPrisma.collection.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/collections")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        collections: [],
      });

      expect(mockPrisma.collection.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });
    });

    it("returns only collections belonging to the authenticated user", async () => {
      mockPrisma.collection.findMany.mockResolvedValue([
        {
          id: "collection-1",
          userId: "user-1",
          name: "System Design",
          createdAt: new Date("2026-08-09T10:00:00.000Z"),
          updatedAt: new Date("2026-08-09T10:00:00.000Z"),
          _count: {
            notes: 3,
          },
        },
        {
          id: "collection-2",
          userId: "user-1",
          name: "Machine Learning",
          createdAt: new Date("2026-08-08T10:00:00.000Z"),
          updatedAt: new Date("2026-08-08T10:00:00.000Z"),
          _count: {
            notes: 5,
          },
        },
      ]);

      const response = await request(app)
        .get("/api/collections")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body.collections).toHaveLength(2);

      expect(response.body.collections[0]).toMatchObject({
        id: "collection-1",
        userId: "user-1",
        name: "System Design",
        _count: {
          notes: 3,
        },
      });

      expect(response.body.collections[1]).toMatchObject({
        id: "collection-2",
        userId: "user-1",
        name: "Machine Learning",
        _count: {
          notes: 5,
        },
      });

      expect(mockPrisma.collection.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });
    });
  });

  describe("GET /api/collections/:id", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get(
        "/api/collections/collection-1",
      );

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.collection.findFirst).not.toHaveBeenCalled();
    });

    it("returns a collection with its notes", async () => {
      const collection = {
        id: "collection-1",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
        notes: [
          {
            id: "note-1",
            userId: "user-1",
            collectionId: "collection-1",
            title: "Rate Limiting",
            content: "Rate limiting controls request frequency.",
            sourceUrl: null,
            summary: null,
            isFavorite: false,
            isArchived: false,
            createdAt: new Date("2026-08-09T10:00:00.000Z"),
            updatedAt: new Date("2026-08-09T10:00:00.000Z"),
          },
        ],
      };

      mockPrisma.collection.findFirst.mockResolvedValue(collection);

      const response = await request(app)
        .get("/api/collections/collection-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body.collection.id).toBe("collection-1");
      expect(response.body.collection.userId).toBe("user-1");
      expect(response.body.collection.name).toBe("System Design");
      expect(response.body.collection.notes).toHaveLength(1);

      expect(
        response.body.collection.notes[0].title,
      ).toBe("Rate Limiting");

      expect(mockPrisma.collection.findFirst).toHaveBeenCalledWith({
        where: {
          id: "collection-1",
          userId: "user-1",
        },
        include: {
          notes: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    });

    it("does not return a collection belonging to another user", async () => {
      mockPrisma.collection.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/collections/other-user-collection")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Collection not found",
      });

      expect(mockPrisma.collection.findFirst).toHaveBeenCalledWith({
        where: {
          id: "other-user-collection",
          userId: "user-1",
        },
        include: {
          notes: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    });
  });

  describe("PATCH /api/collections/:id", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app)
        .patch("/api/collections/collection-1")
        .send({
          name: "Updated Collection",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.collection.update).not.toHaveBeenCalled();
    });

    it("rejects invalid collection update data", async () => {
      const response = await request(app)
        .patch("/api/collections/collection-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid collection update data",
        errors: {
          name: ["Collection name is required"],
        },
      });

      expect(mockPrisma.collection.update).not.toHaveBeenCalled();
    });

    it("returns 404 when the collection belongs to another user", async () => {
      mockPrisma.collection.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/collections/other-user-collection")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "Updated Collection",
        });

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Collection not found",
      });

      expect(mockPrisma.collection.update).not.toHaveBeenCalled();
    });

    it("updates a collection belonging to the authenticated user", async () => {
      mockPrisma.collection.findFirst
        .mockResolvedValueOnce({
          id: "collection-1",
          userId: "user-1",
          name: "Old Name",
          createdAt: new Date("2026-08-09T00:00:00.000Z"),
          updatedAt: new Date("2026-08-09T00:00:00.000Z"),
        })
        .mockResolvedValueOnce(null);

      mockPrisma.collection.update.mockResolvedValue({
        id: "collection-1",
        userId: "user-1",
        name: "Updated Name",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T01:00:00.000Z"),
      });

      const response = await request(app)
        .patch("/api/collections/collection-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "Updated Name",
        });

      expect(response.status).toBe(200);

      expect(response.body.collection).toMatchObject({
        id: "collection-1",
        userId: "user-1",
        name: "Updated Name",
      });

      expect(mockPrisma.collection.update).toHaveBeenCalledWith({
        where: {
          id: "collection-1",
        },
        data: {
          name: "Updated Name",
        },
      });
    });

    it("rejects duplicate collection names during update", async () => {
      mockPrisma.collection.findFirst
        .mockResolvedValueOnce({
          id: "collection-1",
          userId: "user-1",
          name: "Old Name",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: "collection-2",
          userId: "user-1",
          name: "System Design",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const response = await request(app)
        .patch("/api/collections/collection-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "A collection with this name already exists",
      });

      expect(mockPrisma.collection.update).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/collections/:id", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).delete(
        "/api/collections/collection-1",
      );

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.collection.delete).not.toHaveBeenCalled();
    });

    it("returns 404 when the collection belongs to another user", async () => {
      mockPrisma.collection.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/collections/other-user-collection")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Collection not found",
      });

      expect(mockPrisma.collection.delete).not.toHaveBeenCalled();
    });

    it("deletes a collection belonging to the authenticated user", async () => {
      mockPrisma.collection.findFirst.mockResolvedValue({
        id: "collection-1",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      mockPrisma.collection.delete.mockResolvedValue({
        id: "collection-1",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .delete("/api/collections/collection-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Collection deleted successfully",
      });

      expect(mockPrisma.collection.findFirst).toHaveBeenCalledWith({
        where: {
          id: "collection-1",
          userId: "user-1",
        },
      });

      expect(mockPrisma.collection.delete).toHaveBeenCalledWith({
        where: {
          id: "collection-1",
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