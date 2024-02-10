import { Router } from "express";
import multer from "multer";
const upload = multer({ dest: "./storage" });

const uploadFileRouter = Router();

uploadFileRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file?.mimetype);
    const K = 1024000;
    if (req.file?.mimetype === "audio/mpeg" && req.file.size < 10 * K) {
      return res.status(200).json(req.file);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default uploadFileRouter;
