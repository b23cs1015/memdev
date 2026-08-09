import { Router } from "express";

import authRouter from "./auth.routes.js";
import collectionsRouter from "./collections.routes.js";
import notesRouter from "./notes.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/notes", notesRouter);
router.use("/collections", collectionsRouter);

export default router;