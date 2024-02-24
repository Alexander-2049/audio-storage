import { Router } from "express";
import Song_DB from "../../database/audio/Song";
import filestorage from "../../models/FileStorage";

const musicChunksRouter = Router();

musicChunksRouter.post("/", async (req, res) => {
  if (typeof req.body.id !== "string")
    return res.status(400).json({ error: '"id" is missing' });

  try {
    const song = await Song_DB.findOne({ song_id: req.body.id });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    if (!song.song_id) {
      return res.status(500).json({ error: "Song file details missing" });
    }

    const fileName = song.song_id;

    if (!filestorage.existsSync(fileName)) {
      return res.status(500).json({ error: "Song file not found" });
    }

    const fileSize = filestorage.sizeSync(fileName);
    // const chunkSize = 300 * 1024; // 300 KB in bytes
    // const totalChunks = Math.ceil(fileSize / chunkSize);

    // Check if range header is present
    const rangeHeader = req.headers.range;
    if (!rangeHeader) {
      return res.status(400).json({ error: "Range header is missing" });
    }

    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const partialStart = parseInt(parts[0], 10);
    const partialEnd = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const start = Math.max(0, partialStart);
    const end = Math.min(fileSize - 1, partialEnd);

    const buffer = await filestorage.readFileChunk(fileName, start, end);
    res.setHeader("Content-Length", buffer.byteLength);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    res.setHeader("Accept-Ranges", "bytes");

    res.send(buffer);

    res.end();
  } catch (error) {
    console.error("Error streaming song:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default musicChunksRouter;
