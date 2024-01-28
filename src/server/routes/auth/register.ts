import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import { Code } from "../../../responseCodes";

const registerRouter = Router();

registerRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const reg_ip = req.socket.remoteAddress;

    const user = new User({ username, password: hashedPassword, reg_ip });
    await user.save();

    return res.status(201).json({
      success: true,
      username,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "MongoServerError") {
        return res.status(400).json({
          code: Code.REG_FAIL_USER_ALREADY_EXISTS,
          error: true,
          error_message: "Username is already taken",
        });
      }
    }

    return res.status(500).json({
      code: Code.INTERNAL_SERVER_ERROR,
      error: true,
      error_message: "Something went wrong",
    });
  }
});

export default registerRouter;
