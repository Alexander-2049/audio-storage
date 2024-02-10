import { Router } from "express";
import uploadFileRouter from "./upload";

const filesRouter = Router();

filesRouter.use("/upload", uploadFileRouter);

export default filesRouter;
