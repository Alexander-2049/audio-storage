import { Router } from "express";
import Z3 from "../../models/Z3";
import filestorage from "../../models/FileStorage";
import Song_DB from "../../database/audio/Song";

const musicInfoRouter = Router();

musicInfoRouter.post("/", async (req, res) => {
  if (typeof req.body.id !== "string")
    return res.status(400).json({ error: '"id" is missing' });

  const id = req.body.id;

  const info = await Z3.getSongInfo(id);
  if (!info) return res.status(404).json({ error: "Song not found" });

  const { song_id, file_size } = info;
  res.json(info);

  // TODO: Check the logic here
  // File size has to be taken from source and then saved to DB
  // and then after that should be checked if filesize is similar
  // to size that is stored in DB
  if (filestorage.existsSync(song_id) && !file_size) {
    const file_size = filestorage.sizeSync(song_id);
    await Song_DB.findOneAndUpdate({ song_id }, { file_size });
    return;
  } else if (filestorage.existsSync(song_id)) return;

  if (song_id.startsWith("z3_")) {
    Z3.fetchSourceURL(song_id.slice(3))
      .then((source_url) => {
        if (source_url)
          Z3.downloadSong(source_url, song_id).then(({ file_size }) => {
            Song_DB.findOneAndUpdate({ song_id }, { file_size });
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

export default musicInfoRouter;
