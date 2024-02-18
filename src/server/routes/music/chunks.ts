import { Router } from "express";

const musicChunksRouter = Router();

musicChunksRouter.post("/", (req, res) => {
  console.log(req.body);
  return res.json(req.body);
});

export default musicChunksRouter;
