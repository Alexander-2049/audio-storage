import { Router } from "express";
import registerRouter from "./register";
import loginRouter from "./login";
import logoutRouter from "./logout";

const authRouter = Router();

authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);
authRouter.use("/logout", logoutRouter);

export default authRouter;
