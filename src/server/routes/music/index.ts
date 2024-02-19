import { Router } from "express";
import musicSearchRouter from "./search";
import musicInfoRouter from "./info";
import musicChunksRouter from "./chunks";

const musicRouter = Router();

musicRouter.use("/search", musicSearchRouter);
musicRouter.use("/info", musicInfoRouter);
musicRouter.use("/chunks", musicChunksRouter);

export default musicRouter;
