import { Z3 } from "../../../models/Z3";
import express, { Request, Response } from "express";

const z3GetRouter = express.Router();

z3GetRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      if (typeof id !== "string" || id.length < 1) {
        return res
          .status(400)
          .json({ error: "id has to be >0 symbols length" });
      }

      const DB = Z3.getDB();
      const data = await DB.findOne({ id });
      if (!data) {
        return res.status(400).json({ error: "Soung not found" });
      } else {
        return res.json(data);
      }
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
});

export default z3GetRouter;
