import { Router } from "express";
import z3Router from "./z3";

const musicRouter = Router();

musicRouter.use("/search/z3", z3Router);

export default musicRouter;
