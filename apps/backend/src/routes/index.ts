import { Router } from "express";
import notesRouter from "./notes.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "memdev-backend",
  });
});

router.use("/notes", notesRouter);

export default router;