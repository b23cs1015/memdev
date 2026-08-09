import { Router } from "express";
import { z } from "zod";

import { prisma } from "../config/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Collection name is required"),
});

const updateCollectionSchema = z.object({
  name: z.string().trim().min(1, "Collection name is required"),
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const result = createCollectionSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid collection data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const name = result.data.name;

    const existingCollection = await prisma.collection.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (existingCollection) {
      res.status(409).json({
        message: "A collection with this name already exists",
      });
      return;
    }

    const collection = await prisma.collection.create({
      data: {
        userId,
        name,
      },
    });

    res.status(201).json({
      collection,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;

    const collections = await prisma.collection.findMany({
      where: {
        userId,
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

    res.status(200).json({
      collections,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const collectionId = String(req.params.id);

    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
      include: {
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!collection) {
      res.status(404).json({
        message: "Collection not found",
      });
      return;
    }

    res.status(200).json({
      collection,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const result = updateCollectionSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid collection update data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const collectionId = String(req.params.id);
    const name = result.data.name;

    const existingCollection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!existingCollection) {
      res.status(404).json({
        message: "Collection not found",
      });
      return;
    }

    const duplicateCollection = await prisma.collection.findFirst({
      where: {
        userId,
        name,
        id: {
          not: collectionId,
        },
      },
    });

    if (duplicateCollection) {
      res.status(409).json({
        message: "A collection with this name already exists",
      });
      return;
    }

    const collection = await prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      collection,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const userId = authenticatedRequest.user.id;
    const collectionId = String(req.params.id);

    const existingCollection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!existingCollection) {
      res.status(404).json({
        message: "Collection not found",
      });
      return;
    }

    await prisma.collection.delete({
      where: {
        id: collectionId,
      },
    });

    res.status(200).json({
      message: "Collection deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;