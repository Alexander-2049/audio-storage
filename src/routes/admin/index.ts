import { Router } from "express";
import usersListRouter from "./users/usersList";
import userDeleteRouter from "./users/userDelete";

const adminRouter = Router();

adminRouter.use("/users/list", usersListRouter);
adminRouter.use("/users/delete", userDeleteRouter);

export default adminRouter;
