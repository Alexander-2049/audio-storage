import { Router } from "express";
import z3SearchRouter from "./z3SearchRouter";
import z3Mp3Router from "./z3Mp3Router";
import z3GetRouter from "./z3GetRouter";

const musicRouter = Router();

musicRouter.use("/z3/search", z3SearchRouter);
musicRouter.use("/z3/mp3", z3Mp3Router);
musicRouter.use("/z3/get", z3GetRouter);

export default musicRouter;
