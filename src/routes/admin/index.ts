import { Router } from "express";
import usersRouter from "./users/usersList";

const adminRouter = Router();

adminRouter.use("/users/list", usersRouter);

export default adminRouter;
