import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  username: string;
  password: string;
  reg_ip: string;
  role: string;
  reg_date: Date;
  __v: number;
}

export default async function getCurrentUser() {
  const token = cookies().get("token");
  if (typeof token?.value !== "string") return null;

  const SECRET_TOKEN = process.env.SECRET_TOKEN;
  if (typeof SECRET_TOKEN !== "string") return null;

  try {
    const verifiedData = jwt.verify(token.value, SECRET_TOKEN) as JwtPayload;
    if (!verifiedData) return null;
    const user: IUser | null = await User.findById(verifiedData.userId);
    return user;
  } catch (error) {
    return null;
  }
}
