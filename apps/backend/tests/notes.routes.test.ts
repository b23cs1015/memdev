import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../src/config/env.js";

const mockPrisma = vi.hoisted(() => ({
  note: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

    it("returns an empty list when the user has no notes", async () => {
      mockPrisma.note.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        notes: [],
      });

      expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          noteTags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });

    it("returns only notes belonging to the authenticated user", async () => {
      const newestDate = new Date("2026-08-09T10:00:00.000Z");
      const olderDate = new Date("2026-08-08T10:00:00.000Z");

      mockPrisma.note.findMany.mockResolvedValue([
        {
          id: "note-new",
          userId: "user-1",
          collectionId: null,
          title: "Newest Note",
          content: "Newest content",
          sourceUrl: null,
          summary: null,
          isFavorite: false,
          isArchived: false,
          createdAt: newestDate,
          updatedAt: newestDate,
          noteTags: [],
        },
        {
          id: "note-old",
          userId: "user-1",
          collectionId: null,
          title: "Older Note",
          content: "Older content",
          sourceUrl: null,
          summary: null,
          isFavorite: false,
          isArchived: false,
          createdAt: olderDate,
          updatedAt: olderDate,
          noteTags: [],
        },
      ]);

      const response = await request(app)
        .get("/api/notes")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body.notes).toHaveLength(2);

      expect(response.body.notes[0]).toMatchObject({
        id: "note-new",
        userId: "user-1",
        title: "Newest Note",
        noteTags: [],
      });

      expect(response.body.notes[1]).toMatchObject({
        id: "note-old",
        userId: "user-1",
        title: "Older Note",
        noteTags: [],
      });

      expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          noteTags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });
  });

  describe("GET /api/notes/:id", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get("/api/notes/note-1");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.note.findFirst).not.toHaveBeenCalled();
    });

    it("returns a note belonging to the authenticated user", async () => {
      const note = createMockNote("note-1", "user-1");

      mockPrisma.note.findFirst.mockResolvedValue(note);

      const response = await request(app)
        .get("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body.note.id).toBe("note-1");
      expect(response.body.note.userId).toBe("user-1");

      expect(mockPrisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: "note-1",
          userId: "user-1",
        },
      });
    });

    it("does not return a note belonging to another user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/notes/other-user-note")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Note not found",
      });

      expect(mockPrisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: "other-user-note",
          userId: "user-1",
        },
      });
    });
  });

  describe("PATCH /api/notes/:id", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app)
        .patch("/api/notes/note-1")
        .send({
          title: "Updated title",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.note.update).not.toHaveBeenCalled();
    });

    it("rejects an empty update", async () => {
      const response = await request(app)
        .patch("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({});

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid note update data",
        errors: {},
      });

      expect(mockPrisma.note.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.note.update).not.toHaveBeenCalled();
    });

    it("rejects an invalid update", async () => {
      const response = await request(app)
        .patch("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          title: "",
          sourceUrl: "invalid-url",
          isFavorite: "yes",
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toBe(
        "Invalid note update data",
      );

      expect(mockPrisma.note.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.note.update).not.toHaveBeenCalled();
    });

    it("returns 404 when the note belongs to another user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          title: "Updated title",
        });

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Note not found",
      });

      expect(mockPrisma.note.update).not.toHaveBeenCalled();
    });

    it("updates a note belonging to the authenticated user", async () => {
      const existingNote = createMockNote("note-1", "user-1");

      const updatedNote = {
        ...existingNote,
        title: "Updated title",
        content: "Updated content",
        isFavorite: true,
      };

      mockPrisma.note.findFirst.mockResolvedValue(existingNote);
      mockPrisma.note.update.mockResolvedValue(updatedNote);

      const response = await request(app)
        .patch("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          title: "Updated title",
          content: "Updated content",
          isFavorite: true,
        });

      expect(response.status).toBe(200);

      expect(response.body.note).toMatchObject({
        id: "note-1",
        userId: "user-1",
        title: "Updated title",
        content: "Updated content",
        isFavorite: true,
      });

      expect(mockPrisma.note.update).toHaveBeenCalledWith({
        where: {
          id: "note-1",
        },
        data: {
          title: "Updated title",
          content: "Updated content",
          isFavorite: true,
        },
      });
    });

    it("rejects a collection that does not belong to the authenticated user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(
        createMockNote("note-1", "user-1"),
      );

      mockPrisma.collection.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
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

      expect(mockPrisma.note.update).not.toHaveBeenCalled();
    });

    it("can favorite and archive a note", async () => {
      const existingNote = createMockNote("note-1", "user-1");

      const updatedNote = {
        ...existingNote,
        isFavorite: true,
        isArchived: true,
      };

      mockPrisma.note.findFirst.mockResolvedValue(existingNote);
      mockPrisma.note.update.mockResolvedValue(updatedNote);

      const response = await request(app)
        .patch("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          isFavorite: true,
          isArchived: true,
        });

      expect(response.status).toBe(200);

      expect(response.body.note).toMatchObject({
        isFavorite: true,
        isArchived: true,
      });

      expect(mockPrisma.note.update).toHaveBeenCalledWith({
        where: {
          id: "note-1",
        },
        data: {
          isFavorite: true,
          isArchived: true,
        },
      });
    });
  });

  describe("DELETE /api/notes/:id", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).delete(
        "/api/notes/note-1",
      );

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.note.delete).not.toHaveBeenCalled();
    });

    it("returns 404 when the note belongs to another user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Note not found",
      });

      expect(mockPrisma.note.delete).not.toHaveBeenCalled();
    });

    it("deletes a note belonging to the authenticated user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(
        createMockNote("note-1", "user-1"),
      );

      mockPrisma.note.delete.mockResolvedValue(
        createMockNote("note-1", "user-1"),
      );

      const response = await request(app)
        .delete("/api/notes/note-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Note deleted successfully",
      });

      expect(mockPrisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: "note-1",
          userId: "user-1",
        },
      });

      expect(mockPrisma.note.delete).toHaveBeenCalledWith({
        where: {
          id: "note-1",
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

function createMockNote(id: string, userId: string) {
  const date = new Date("2026-08-09T00:00:00.000Z");

  return {
    id,
    userId,
    collectionId: null,
    title: "Test Note",
    content: "Test note content",
    sourceUrl: null,
    summary: null,
    isFavorite: false,
    isArchived: false,
    createdAt: date,
    updatedAt: date,
  };
}