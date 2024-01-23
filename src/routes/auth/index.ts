import { Router } from "express";
import registerRouter from "./register";

const authRouter = Router();

authRouter.use("/register", registerRouter);

export default authRouter;
