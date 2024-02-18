import Z3 from "../../models/Z3";
import { Router } from "express";

const musicSearchRouter = Router();

musicSearchRouter.post("/", async (req, res) => {
  if (typeof req.body.query !== "string")
    return res.status(400).json({ error: '"query" is missing' });

  const query = req.body.query;

  return res.json(await Z3.search(query));
});

export default musicSearchRouter;
