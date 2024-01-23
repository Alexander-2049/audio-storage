import { Router } from "express";
import authRouter from "./auth";
import adminRouter from "./admin";

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

export default router;