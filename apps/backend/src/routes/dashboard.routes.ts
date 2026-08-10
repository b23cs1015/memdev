import { Router } from "express";

import { prisma } from "../config/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;

    const [
      totalNotes,
      favoriteNotes,
      archivedNotes,
      totalCollections,
      totalTags,
      recentNotes,
    ] = await Promise.all([
      prisma.note.count({
        where: {
          userId,
        },
      }),

      prisma.note.count({
        where: {
          userId,
          isFavorite: true,
        },
      }),

      prisma.note.count({
        where: {
          userId,
          isArchived: true,
        },
      }),

      prisma.collection.count({
        where: {
          userId,
        },
      }),

      prisma.tag.count({
        where: {
          userId,
        },
      }),

      prisma.note.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    res.status(200).json({
      stats: {
        totalNotes,
        favoriteNotes,
        archivedNotes,
        totalCollections,
        totalTags,
        recentNotes,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;