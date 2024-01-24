import express, { Request, Response } from "express";
import verifyToken from "../middleware/authMiddleware";

const protectedRouter = express.Router();

protectedRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  if (res.locals.userId) {
    const user = res.locals.user;
    return res.status(200).json({ message: "Route accessed by " + user?.username });
  }

  return res.status(200).json({ message: "Protected route accessed" });
});

export default protectedRouter;
