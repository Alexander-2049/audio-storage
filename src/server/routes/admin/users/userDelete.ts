import { Router } from "express";
import User from "../../../../models/User";

const userDeleteRouter = Router();

userDeleteRouter.delete("/", async (req, res) => {
  try {
    const { id, username } = req.body;

    const deletedUser = id
      ? await User.findByIdAndDelete(id)
      : username
      ? await User.collection.findOneAndDelete({ username })
      : null;

    res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default userDeleteRouter;
