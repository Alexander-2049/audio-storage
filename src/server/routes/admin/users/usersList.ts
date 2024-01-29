import { Router } from "express";
import User from "../../../../models/User";

const usersListRouter = Router();

usersListRouter.get("/", async (req, res) => {
  try {
    const users = await User.collection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "MongoServerError") {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default usersListRouter;
