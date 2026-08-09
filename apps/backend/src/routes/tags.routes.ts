import { Router } from "express";
import { z } from "zod";

import { prisma } from "../config/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

const createTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required"),
});

const updateTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required"),
});

const noteTagParamsSchema = z.object({
  noteId: z.string().trim().min(1),
  tagId: z.string().trim().min(1),
});

/**
 * POST /api/tags
 *
 * Create a tag for the authenticated user.
 */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const result = createTagSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid tag data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const name = result.data.name;

    const existingTag = await prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (existingTag) {
      res.status(409).json({
        message: "A tag with this name already exists",
      });
      return;
    }

    const tag = await prisma.tag.create({
      data: {
        userId,
        name,
      },
    });

    res.status(201).json({
      tag,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tags
 *
 * Return all tags belonging to the authenticated user.
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;

    const tags = await prisma.tag.findMany({
      where: {
        userId,
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

    res.status(200).json({
      tags,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tags/:id
 *
 * Rename a tag owned by the authenticated user.
 */
router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const result = updateTagSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid tag update data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const tagId = String(req.params.id);
    const name = result.data.name;

    const existingTag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });

    if (!existingTag) {
      res.status(404).json({
        message: "Tag not found",
      });
      return;
    }

    const duplicateTag = await prisma.tag.findFirst({
      where: {
        userId,
        name,
        id: {
          not: tagId,
        },
      },
    });

    if (duplicateTag) {
      res.status(409).json({
        message: "A tag with this name already exists",
      });
      return;
    }

    const tag = await prisma.tag.update({
      where: {
        id: tagId,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      tag,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tags/:id
 *
 * Delete a tag owned by the authenticated user.
 *
 * NoteTag records are automatically removed because the
 * Prisma relation uses onDelete: Cascade.
 */
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const tagId = String(req.params.id);

    const existingTag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });

    if (!existingTag) {
      res.status(404).json({
        message: "Tag not found",
      });
      return;
    }

    await prisma.tag.delete({
      where: {
        id: tagId,
      },
    });

    res.status(200).json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tags/notes/:noteId/:tagId
 *
 * Attach a tag to a note.
 */
router.post(
  "/notes/:noteId/:tagId",
  requireAuth,
  async (req, res, next) => {
    try {
      const result = noteTagParamsSchema.safeParse({
        noteId: req.params.noteId,
        tagId: req.params.tagId,
      });

      if (!result.success) {
        res.status(400).json({
          message: "Invalid note or tag ID",
        });
        return;
      }

      const authenticatedRequest = req as AuthenticatedRequest;
      const userId = authenticatedRequest.user.id;
      const { noteId, tagId } = result.data;

      const note = await prisma.note.findFirst({
        where: {
          id: noteId,
          userId,
        },
      });

      if (!note) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }

      const tag = await prisma.tag.findFirst({
        where: {
          id: tagId,
          userId,
        },
      });

      if (!tag) {
        res.status(404).json({
          message: "Tag not found",
        });
        return;
      }

      const existingNoteTag = await prisma.noteTag.findUnique({
        where: {
          noteId_tagId: {
            noteId,
            tagId,
          },
        },
      });

      if (existingNoteTag) {
        res.status(409).json({
          message: "Tag is already attached to this note",
        });
        return;
      }

      const noteTag = await prisma.noteTag.create({
        data: {
          noteId,
          tagId,
        },
        include: {
          tag: true,
        },
      });

      res.status(201).json({
        noteTag,
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * DELETE /api/tags/notes/:noteId/:tagId
 *
 * Remove a tag from a note.
 */
router.delete(
  "/notes/:noteId/:tagId",
  requireAuth,
  async (req, res, next) => {
    try {
      const result = noteTagParamsSchema.safeParse({
        noteId: req.params.noteId,
        tagId: req.params.tagId,
      });

      if (!result.success) {
        res.status(400).json({
          message: "Invalid note or tag ID",
        });
        return;
      }

      const authenticatedRequest = req as AuthenticatedRequest;
      const userId = authenticatedRequest.user.id;
      const { noteId, tagId } = result.data;

      const note = await prisma.note.findFirst({
        where: {
          id: noteId,
          userId,
        },
      });

      if (!note) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }

      const tag = await prisma.tag.findFirst({
        where: {
          id: tagId,
          userId,
        },
      });

      if (!tag) {
        res.status(404).json({
          message: "Tag not found",
        });
        return;
      }

      const existingNoteTag = await prisma.noteTag.findUnique({
        where: {
          noteId_tagId: {
            noteId,
            tagId,
          },
        },
      });

      if (!existingNoteTag) {
        res.status(404).json({
          message: "Tag is not attached to this note",
        });
        return;
      }

      await prisma.noteTag.delete({
        where: {
          noteId_tagId: {
            noteId,
            tagId,
          },
        },
      });

      res.status(200).json({
        message: "Tag removed from note successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;