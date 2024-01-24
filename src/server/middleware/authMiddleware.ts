import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_TOKEN } from "../../server";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, SECRET_TOKEN);
    console.log(decoded);
    // req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
}
