import { Router } from "express";
import { z } from "zod";
import { generateNoteSummary } from "../services/ai.service.js";

import { prisma } from "../config/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),

  sourceUrl: z
    .string()
    .trim()
    .url("Please provide a valid source URL")
    .optional(),

  sourceTitle: z
    .string()
    .trim()
    .max(500)
    .optional(),

  sourceTextBefore: z
    .string()
    .max(2000)
    .optional(),

  sourceTextAfter: z
    .string()
    .max(2000)
    .optional(),

  collectionId: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    content: z.string().trim().min(1, "Content is required").optional(),
    sourceUrl: z
      .string()
      .trim()
      .url("Please provide a valid source URL")
      .nullable()
      .optional(),
    collectionId: z.string().trim().min(1).nullable().optional(),
    isFavorite: z.boolean().optional(),
    isArchived: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const result = createNoteSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid note data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const authenticatedRequest =
        req as AuthenticatedRequest;

        const {
        title,
        content,
        sourceUrl,
        sourceTitle,
        sourceTextBefore,
        sourceTextAfter,
        collectionId,
        } = result.data;

    if (collectionId) {
      const collection = await prisma.collection.findFirst({
        where: {
          id: collectionId,
          userId: authenticatedRequest.user.id,
        },
      });

      if (!collection) {
        res.status(404).json({
          message: "Collection not found",
        });
        return;
      }
    }

    const note = await prisma.note.create({
        data: {
            userId: authenticatedRequest.user.id,
            title,
            content,
            sourceUrl,
            sourceTitle,
            sourceTextBefore,
            sourceTextAfter,
            collectionId,
        },
        });

    res.status(201).json({
      note,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;

    const notes = await prisma.note.findMany({
    where: {
        userId: authenticatedRequest.user.id,
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

    res.status(200).json({
      notes,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;

    const note = await prisma.note.findFirst({
      where: {
        id: String(req.params.id),
        userId: authenticatedRequest.user.id,
      },
      include: {
        collection: true,
        noteTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!note) {
      res.status(404).json({
        message: "Note not found",
      });
      return;
    }

    res.status(200).json({
      note,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const result = updateNoteSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid note update data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const authenticatedRequest = req as AuthenticatedRequest;

    const existingNote = await prisma.note.findFirst({
      where: {
        id: String(req.params.id),
        userId: authenticatedRequest.user.id,
      },
    });

    if (!existingNote) {
      res.status(404).json({
        message: "Note not found",
      });
      return;
    }

    const { collectionId } = result.data;

    if (collectionId) {
      const collection = await prisma.collection.findFirst({
        where: {
          id: collectionId,
          userId: authenticatedRequest.user.id,
        },
      });

      if (!collection) {
        res.status(404).json({
          message: "Collection not found",
        });
        return;
      }
    }

    const note = await prisma.note.update({
      where: {
        id: existingNote.id,
      },
      data: result.data,
    });

    res.status(200).json({
      note,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;

    const existingNote = await prisma.note.findFirst({
      where: {
        id: String(req.params.id),
        userId: authenticatedRequest.user.id,
      },
    });

    if (!existingNote) {
      res.status(404).json({
        message: "Note not found",
      });
      return;
    }

    await prisma.note.delete({
      where: {
        id: existingNote.id,
      },
    });

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/summarize",
  requireAuth,
  async (req, res, next) => {
    try {
      const authenticatedRequest =
        req as AuthenticatedRequest;

      const noteId = String(req.params.id);

      const note = await prisma.note.findFirst({
        where: {
          id: noteId,
          userId: authenticatedRequest.user.id,
        },
      });

      if (!note) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }

      try {
        const summary = await generateNoteSummary(
          note.title,
          note.content,
        );

        if (!summary) {
          res.status(503).json({
            message:
              "AI summarization is currently unavailable",
          });
          return;
        }

        const updatedNote = await prisma.note.update({
          where: {
            id: note.id,
          },
          data: {
            summary,
          },
        });

        res.status(200).json({
          note: updatedNote,
        });
      } catch (error) {
        console.error(
          "AI summarization failed:",
          error,
        );

        res.status(503).json({
          message: "AI summarization failed",
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

export default router;