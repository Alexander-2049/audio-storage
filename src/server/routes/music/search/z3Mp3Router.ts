import { Z3 } from "../../../models/Z3";
import express, { Request, Response } from "express";

const z3Mp3Router = express.Router();

z3Mp3Router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      if (typeof id !== "string" || id.length < 1) {
        return res
          .status(400)
          .json({ error: "id has to be >0 symbols length" });
      }

      await Z3.getSongStreamHandler(id, res);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

export default z3Mp3Router;
