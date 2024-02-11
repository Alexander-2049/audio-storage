import { Z3 } from "../../../models/Z3";
import express, { Request, Response } from "express";

const z3Router = express.Router();

z3Router.get("/", async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    // await Z3.downloadAllSongs();
    return res.status(400).json({ error: "q param is required" });
  } else if (q.length < 2) {
    return res
      .status(400)
      .json({ error: "Song name has to be more than 2 symbols length" });
  }
  const songs = await Z3.search(q);
  // return res.send("" + songs.length);
  return res.json(songs);
});

export default z3Router;
