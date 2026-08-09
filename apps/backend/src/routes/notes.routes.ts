import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
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