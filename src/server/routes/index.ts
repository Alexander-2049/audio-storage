import { Router } from "express";
import adminRouter from "./admin";
import protectedRouter from "./protected";

const router = Router();

router.use("/admin", adminRouter);
router.use("/protected", protectedRouter);

export default router;
