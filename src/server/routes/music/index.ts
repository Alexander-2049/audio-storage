import { Router } from "express";
import musicSearchRouter from "./search";
import musicInfoRouter from "./info";

const musicRouter = Router();

musicRouter.use("/search", musicSearchRouter);
musicRouter.use("/info", musicInfoRouter);

export default musicRouter;
