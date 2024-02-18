import { Router } from "express";
import Z3 from "../../models/Z3";

const musicInfoRouter = Router();

musicInfoRouter.post("/", async (req, res) => {
  if (typeof req.body.id !== "string")
    return res.status(400).json({ error: '"id" is missing' });

  const id = req.body.id;

  return res.json(await Z3.getSongInfo(id));
});

export default musicInfoRouter;
