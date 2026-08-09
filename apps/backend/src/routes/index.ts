import { Router } from "express";

import authRouter from "./auth.routes.js";
import notesRouter from "./notes.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "memdev-backend",
  });
});

router.use("/auth", authRouter);
router.use("/notes", notesRouter);

export default router;