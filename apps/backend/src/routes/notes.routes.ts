import { Router } from "express";
import { z } from "zod";

import { prisma } from "../config/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
  sourceUrl: z.string().trim().url("Please provide a valid source URL").optional(),
  collectionId: z.string().trim().min(1).optional(),
});

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

    const authenticatedRequest = req as AuthenticatedRequest;
    const { title, content, sourceUrl, collectionId } = result.data;

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
    });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    next(error);
  }
});

export default router;