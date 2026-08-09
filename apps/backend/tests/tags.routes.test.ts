import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "../src/config/env.js";

const mockPrisma = vi.hoisted(() => ({
  tag: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  note: {
    findFirst: vi.fn(),
  },
  noteTag: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({
  prisma: mockPrisma,
}));

import app from "../src/app.js";

describe("Tags API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/tags", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app)
        .post("/api/tags")
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.tag.create).not.toHaveBeenCalled();
    });

    it("rejects invalid tag data", async () => {
      const response = await request(app)
        .post("/api/tags")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid tag data",
        errors: {
          name: ["Tag name is required"],
        },
      });

      expect(mockPrisma.tag.create).not.toHaveBeenCalled();
    });

    it("creates a tag for the authenticated user", async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(null);

      const createdAt = new Date("2026-08-09T00:00:00.000Z");

      mockPrisma.tag.create.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
        createdAt,
      });

      const response = await request(app)
        .post("/api/tags")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        tag: {
          id: "tag-1",
          userId: "user-1",
          name: "System Design",
          createdAt: "2026-08-09T00:00:00.000Z",
        },
      });

      expect(mockPrisma.tag.findUnique).toHaveBeenCalledWith({
        where: {
          userId_name: {
            userId: "user-1",
            name: "System Design",
          },
        },
      });

      expect(mockPrisma.tag.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          name: "System Design",
        },
      });
    });

    it("rejects duplicate tag names for the same user", async () => {
      mockPrisma.tag.findUnique.mockResolvedValue({
        id: "tag-existing",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date(),
      });

      const response = await request(app)
        .post("/api/tags")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "A tag with this name already exists",
      });

      expect(mockPrisma.tag.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/tags", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get("/api/tags");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });

      expect(mockPrisma.tag.findMany).not.toHaveBeenCalled();
    });

    it("returns only tags belonging to the authenticated user", async () => {
      mockPrisma.tag.findMany.mockResolvedValue([
        {
          id: "tag-1",
          userId: "user-1",
          name: "System Design",
          createdAt: new Date("2026-08-09T00:00:00.000Z"),
          _count: {
            noteTags: 2,
          },
        },
        {
          id: "tag-2",
          userId: "user-1",
          name: "Machine Learning",
          createdAt: new Date("2026-08-08T00:00:00.000Z"),
          _count: {
            noteTags: 4,
          },
        },
      ]);

      const response = await request(app)
        .get("/api/tags")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body.tags).toHaveLength(2);

      expect(response.body.tags[0]).toMatchObject({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
        _count: {
          noteTags: 2,
        },
      });

      expect(response.body.tags[1]).toMatchObject({
        id: "tag-2",
        userId: "user-1",
        name: "Machine Learning",
        _count: {
          noteTags: 4,
        },
      });

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              noteTags: true,
            },
          },
        },
      });
    });
  });

  describe("PATCH /api/tags/:id", () => {
    it("rejects invalid tag update data", async () => {
      const response = await request(app)
        .patch("/api/tags/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid tag update data",
        errors: {
          name: ["Tag name is required"],
        },
      });

      expect(mockPrisma.tag.update).not.toHaveBeenCalled();
    });

    it("rejects a tag belonging to another user", async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/tags/other-user-tag")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "Updated Tag",
        });

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Tag not found",
      });

      expect(mockPrisma.tag.update).not.toHaveBeenCalled();
    });

    it("renames a tag belonging to the authenticated user", async () => {
      mockPrisma.tag.findFirst
        .mockResolvedValueOnce({
          id: "tag-1",
          userId: "user-1",
          name: "Old Name",
          createdAt: new Date(),
        })
        .mockResolvedValueOnce(null);

      mockPrisma.tag.update.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "Updated Tag",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .patch("/api/tags/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "Updated Tag",
        });

      expect(response.status).toBe(200);

      expect(response.body.tag).toMatchObject({
        id: "tag-1",
        userId: "user-1",
        name: "Updated Tag",
      });

      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: {
          id: "tag-1",
        },
        data: {
          name: "Updated Tag",
        },
      });
    });

    it("rejects duplicate names during rename", async () => {
      mockPrisma.tag.findFirst
        .mockResolvedValueOnce({
          id: "tag-1",
          userId: "user-1",
          name: "Old Name",
          createdAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: "tag-2",
          userId: "user-1",
          name: "System Design",
          createdAt: new Date(),
        });

      const response = await request(app)
        .patch("/api/tags/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        )
        .send({
          name: "System Design",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "A tag with this name already exists",
      });

      expect(mockPrisma.tag.update).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/tags/:id", () => {
    it("rejects a tag belonging to another user", async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/tags/other-user-tag")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Tag not found",
      });

      expect(mockPrisma.tag.delete).not.toHaveBeenCalled();
    });

    it("deletes a tag belonging to the authenticated user", async () => {
      mockPrisma.tag.findFirst.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date(),
      });

      mockPrisma.tag.delete.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
        createdAt: new Date(),
      });

      const response = await request(app)
        .delete("/api/tags/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Tag deleted successfully",
      });

      expect(mockPrisma.tag.delete).toHaveBeenCalledWith({
        where: {
          id: "tag-1",
        },
      });
    });
  });

  describe("POST /api/tags/notes/:noteId/:tagId", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).post(
        "/api/tags/notes/note-1/tag-1",
      );

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });
    });

    it("rejects a note belonging to another user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/tags/notes/other-user-note/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Note not found",
      });

      expect(mockPrisma.tag.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.noteTag.create).not.toHaveBeenCalled();
    });

    it("rejects a tag belonging to another user", async () => {
      mockPrisma.note.findFirst.mockResolvedValue({
        id: "note-1",
        userId: "user-1",
      });

      mockPrisma.tag.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/tags/notes/note-1/other-user-tag")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Tag not found",
      });

      expect(mockPrisma.noteTag.create).not.toHaveBeenCalled();
    });

    it("attaches a tag to a note", async () => {
      mockPrisma.note.findFirst.mockResolvedValue({
        id: "note-1",
        userId: "user-1",
      });

      mockPrisma.tag.findFirst.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
      });

      mockPrisma.noteTag.findUnique.mockResolvedValue(null);

      mockPrisma.noteTag.create.mockResolvedValue({
        noteId: "note-1",
        tagId: "tag-1",
        tag: {
          id: "tag-1",
          userId: "user-1",
          name: "System Design",
        },
      });

      const response = await request(app)
        .post("/api/tags/notes/note-1/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        noteTag: {
          noteId: "note-1",
          tagId: "tag-1",
          tag: {
            id: "tag-1",
            userId: "user-1",
            name: "System Design",
          },
        },
      });

      expect(mockPrisma.noteTag.create).toHaveBeenCalledWith({
        data: {
          noteId: "note-1",
          tagId: "tag-1",
        },
        include: {
          tag: true,
        },
      });
    });

    it("rejects attaching the same tag twice", async () => {
      mockPrisma.note.findFirst.mockResolvedValue({
        id: "note-1",
        userId: "user-1",
      });

      mockPrisma.tag.findFirst.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
      });

      mockPrisma.noteTag.findUnique.mockResolvedValue({
        noteId: "note-1",
        tagId: "tag-1",
      });

      const response = await request(app)
        .post("/api/tags/notes/note-1/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "Tag is already attached to this note",
      });

      expect(mockPrisma.noteTag.create).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/tags/notes/:noteId/:tagId", () => {
    it("rejects removing a tag from another user's note", async () => {
      mockPrisma.note.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/tags/notes/other-user-note/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Note not found",
      });

      expect(mockPrisma.noteTag.delete).not.toHaveBeenCalled();
    });

    it("rejects removing a tag that is not attached", async () => {
      mockPrisma.note.findFirst.mockResolvedValue({
        id: "note-1",
        userId: "user-1",
      });

      mockPrisma.tag.findFirst.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
      });

      mockPrisma.noteTag.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/tags/notes/note-1/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "Tag is not attached to this note",
      });

      expect(mockPrisma.noteTag.delete).not.toHaveBeenCalled();
    });

    it("removes a tag from a note", async () => {
      mockPrisma.note.findFirst.mockResolvedValue({
        id: "note-1",
        userId: "user-1",
      });

      mockPrisma.tag.findFirst.mockResolvedValue({
        id: "tag-1",
        userId: "user-1",
        name: "System Design",
      });

      mockPrisma.noteTag.findUnique.mockResolvedValue({
        noteId: "note-1",
        tagId: "tag-1",
      });

      mockPrisma.noteTag.delete.mockResolvedValue({
        noteId: "note-1",
        tagId: "tag-1",
      });

      const response = await request(app)
        .delete("/api/tags/notes/note-1/tag-1")
        .set(
          "Authorization",
          `Bearer ${createTestToken("user-1")}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Tag removed from note successfully",
      });

      expect(mockPrisma.noteTag.delete).toHaveBeenCalledWith({
        where: {
          noteId_tagId: {
            noteId: "note-1",
            tagId: "tag-1",
          },
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