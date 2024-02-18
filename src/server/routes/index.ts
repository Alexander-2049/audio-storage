import { Router } from "express";
import adminRouter from "./admin";
import protectedRouter from "./protected";
import filesRouter from "./files";
import musicRouter from "./music";

const router = Router();

router.use("/admin", adminRouter);
router.use("/protected", protectedRouter);
router.use("/files", filesRouter);
router.use("/music", musicRouter);

export default router;
