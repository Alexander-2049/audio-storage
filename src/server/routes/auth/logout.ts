import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({ success: true }).end();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
  }
});

export default logoutRouter;
