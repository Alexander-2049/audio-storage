import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_TOKEN } from "../../server";
import User from "../database/user/User";

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const token = req.header("authorization");
  const token = req.signedCookies.token;
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, SECRET_TOKEN) as JwtPayload;
    res.locals.userId = decoded.userId;

    const user = await User.findById(res.locals.userId);
    if (!user)
      throw new Error("User not found");
    res.locals.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
