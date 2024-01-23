import { Router } from "express";
import authRouter from "./auth";
import adminRouter from "./admin";
import protectedRouter from "./protected";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/protected", protectedRouter);

export default router;
