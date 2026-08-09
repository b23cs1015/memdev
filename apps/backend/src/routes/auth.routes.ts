import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { googleOAuth2Client } from "../config/google.js";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

router.post("/register", async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid registration data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const email = result.data.email.toLowerCase();
    const { password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: "An account with this email already exists",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid login data",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const email = result.data.email.toLowerCase();
    const { password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/me",
  requireAuth,
  async (req, res, next) => {
    try {
      const authenticatedRequest = req as AuthenticatedRequest;

      const user = await prisma.user.findUnique({
        where: {
          id: authenticatedRequest.user.id,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        res.status(401).json({
          message: "User account no longer exists",
        });
        return;
      }

      res.status(200).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/google", (_req, res) => {
  const authorizationUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
  });

  res.redirect(authorizationUrl);
});

router.get("/google/callback", async (req, res, next) => {
  try {
    const code =
      typeof req.query.code === "string"
        ? req.query.code
        : undefined;

    if (!code) {
      res.status(400).json({
        message: "Google authorization code is missing",
      });
      return;
    }

    const { tokens } = await googleOAuth2Client.getToken(code);

    if (!tokens.id_token) {
      res.status(401).json({
        message: "Google identity token was not provided",
      });
      return;
    }

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      res.status(401).json({
        message: "Google account information is incomplete",
      });
      return;
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    let user = await prisma.user.findUnique({
      where: {
        googleId,
      },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
    }

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        res.status(409).json({
          message: "This email is already linked to another Google account",
        });
        return;
      }

      if (!user.googleId) {
        user = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            googleId,
          },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          googleId,
        },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;