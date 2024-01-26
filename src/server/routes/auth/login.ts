import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { SECRET_JWT_TOKEN } from "../../../server";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_JWT_TOKEN, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      signed: true,
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default loginRouter;
