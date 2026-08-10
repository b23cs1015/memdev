import { Router } from "express";

import authRouter from "./auth.routes.js";
import collectionsRouter from "./collections.routes.js";
import dashboardRouter from "./dashboard.routes.js";
import notesRouter from "./notes.routes.js";
import tagsRouter from "./tags.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/notes", notesRouter);
router.use("/collections", collectionsRouter);
router.use("/tags", tagsRouter);
router.use("/dashboard", dashboardRouter);

export default router;