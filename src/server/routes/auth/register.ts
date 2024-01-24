import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";

const registerRouter = Router();

registerRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const reg_ip = req.socket.remoteAddress;

    const user = new User({ username, password: hashedPassword, reg_ip });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "MongoServerError") {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default registerRouter;
