import { Router } from "express";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  async (req, res, next) => {
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
  },
);

export default router;