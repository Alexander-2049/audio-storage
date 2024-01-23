import express, { Request, Response } from "express";
import verifyToken from "../middleware/authMiddleware";

const protectedRouter = express.Router();

protectedRouter.get("/", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Protected route accessed" });
});

export default protectedRouter;
