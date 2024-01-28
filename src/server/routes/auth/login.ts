import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { SECRET_JWT_TOKEN } from "../../../server";
import { Code } from "../../../responseCodes";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        code: Code.LOGIN_FAIL_WRONG_USERNAME,
        error: true,
        error_message: "Wrong username",
      });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({
        code: Code.LOGIN_FAIL_WRONG_PASSWORD,
        error: true,
        error_message: "Wrong password",
      });
    const token = jwt.sign({ userId: user._id }, SECRET_JWT_TOKEN, {
      expiresIn: "48h",
    });
    return res.status(200).json({ code: Code.LOGIN_SUCCESS, token: token });
  } catch (error) {
    return res.status(401).json({
      code: Code.LOGIN_FAIL,
      error: true,
      error_message: "Authorization failed",
    });
  }
});

export default loginRouter;
