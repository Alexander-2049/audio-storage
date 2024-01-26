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
    if (!user) return res.redirect("/auth/login?login=false");
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.redirect("/auth/login?login=false");
    const token = jwt.sign({ userId: user._id }, SECRET_JWT_TOKEN, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      signed: true,
    });
    return res.redirect("/?login=true");
  } catch (error) {
    return res.redirect("/?login=false");
  }
});

export default loginRouter;
