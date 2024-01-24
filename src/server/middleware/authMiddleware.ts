import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_JWT_TOKEN } from "../../server";
import User from "../models/User";

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, SECRET_JWT_TOKEN) as JwtPayload;
    res.locals.userId = decoded.userId;

    const user = await User.findById(res.locals.userId);
    res.locals.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
