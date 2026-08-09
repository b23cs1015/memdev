import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "string"
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: payload.userId,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};