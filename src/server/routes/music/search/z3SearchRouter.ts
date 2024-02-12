import { Z3 } from "../../../models/Z3";
import express, { Request, Response } from "express";

const z3SearchRouter = express.Router();

z3SearchRouter.get("/", async (req: Request, res: Response) => {
  const { q } = req.query;
  try {
    if (q) {
      if (typeof q !== "string" || q.length < 2)
        return res
          .status(400)
          .json({ error: "q parameter has to be >=2 symbols length" });
      // await Z3.downloadAllSongs();
      const songs = await Z3.search(q);
      // return res.send("" + songs.length);
      return res.json(songs);
    }
    return res.status(400).json({ error: "q is required" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

export default z3SearchRouter;
