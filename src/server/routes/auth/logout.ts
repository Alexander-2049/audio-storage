import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("/?logout=true");
  } catch (error) {
    return res.redirect("/?logout=false");
  }
});

export default logoutRouter;
