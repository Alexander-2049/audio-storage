"use server";
import User from "@/models/User";
import getIp from "@/utils/getIp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function createUser(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username");
    const password = formData.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
      return {
        message: "Username and password are required",
      };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const reg_ip = getIp();
    const user = new User({
      username,
      password: hashedPassword,
      reg_ip,
    });
    await user.save();

    return {
      message: "Account has been created",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "MongoServerError") {
        return {
          message: "Username is already taken",
        };
      }
    }

    console.log(error);
    return {
      message: "Something went wrong",
    };
  }
}

export async function signInUser(prevState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string") {
    return {
      message: "Username and password are required",
    };
  }
  const user = await User.findOne({ username });
  if (!user)
    return {
      message: "Wrong username",
    };
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    return {
      message: "Wrong password",
    };
  const SECRET_TOKEN = process.env.SECRET_TOKEN;
  if (!SECRET_TOKEN) {
    return {
      message: "Internal Server Error",
    };
  }
  const token = jwt.sign({ userId: user._id }, SECRET_TOKEN, {
    expiresIn: "48h",
  });

  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set("token", token, { expires: Date.now() + oneDay * 7 });
}

export async function logout() {
  cookies().delete("token");
}
