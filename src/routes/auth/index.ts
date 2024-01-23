import { Router } from "express";
import registerRouter from "./register";
import loginRouter from "./login";

const authRouter = Router();

authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);

export default authRouter;
