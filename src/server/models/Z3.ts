import mongoose from "mongoose";
import { parse } from "node-html-parser";
import fs, { mkdirSync } from "fs";
import path from "path";
import https from "https";
import { IncomingMessage } from "http";
import { Document } from "mongoose";
import { Response } from "express";
import { Z3DownloadStack } from "../../server";

interface Song {
  song_name: string;
  artist: string;
  duration: string;
  id: string;
  source_url: string | null;
}

interface Z3_Database_Song extends Document {
  id: string;
  artist: string;
  song_name: string;
  duration: string;
  source_url: string | null;
}

const z3Schema = new mongoose.Schema<Z3_Database_Song>({
  id: { type: String, unique: true, required: true },
  artist: { type: String, required: true },
  duration: { type: String, required: true },
  source_url: { type: String, default: null },
  song_name: { type: String, required: true },
});

export default mongoose.models?.Z3 || mongoose.model("Z3", z3Schema);

export class Z3 {
  static getDB() {
    return mongoose.models?.Z3 || mongoose.model("Z3", z3Schema);
  }

  static async search(songName: string, page = "1") {
    const BASE = "ht" + "tps://" + "z" + "3" + ".f" + "m";
    const url =
      page === "1"
        ? BASE + "/mp3/search?sort=views&keywords=" + songName
        : BASE +
          "/mp3/search?sort=views&keywords=" +
          songName +
          "&page=" +
          page;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    const html = await response.text();
    const document = parse(html);

    const divList = document.querySelectorAll(
      "div.whb_wrap div.songs-list div.song-wrap"
    );
    const songs: Song[] = [];

    const promises = Array.from(divList).map(async (element) => {
      const song_name =
        element.querySelector("div.song-name")?.innerText.trim() || "";
      const artist =
        element.querySelector("div.song-artist")?.innerText.trim() || "";
      const duration =
        element.querySelector("span.song-time")?.innerText.trim() || "";
      const id =
        element
          .querySelector("span.song-download")
          ?.attributes["data-sid"].trim() || "";

      // const source_url = await this.fetchDownloadURL(id);

      const SongDB = this.getDB();
      const songFromDb = await SongDB.find({ id });
      if (songFromDb.length < 1) {
        const song = new SongDB({
          id,
          artist,
          duration,
          // source_url,
          song_name,
        });
        await song.save();
      }

      songs.push({
        song_name,
        artist,
        duration,
        id,
        source_url: "null",
      });
    });

    await Promise.all(promises);

    // const nextBtn = document.querySelector(".next.next-btn");
    // if (!document.querySelector(".next.next-btn.disabled") && nextBtn) {
    //   const urlObj = new URL(BASE + nextBtn.getAttribute("href"));
    //   const page = urlObj.searchParams.get("page");
    //   if (page) await this.search(songName, page);
    // }

    // return mongoose.models.Z3?.collection.find({}).toArray();
    return songs;
  }

  static async downloadSong(url: string, fileName: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await Z3DownloadStack.acquire(); // Acquire stack

        const options = {
          headers: this.getHeaders(), // Assuming this function returns headers
          rejectUnauthorized: false, // Ignore SSL certificate verification
        };

        if (fs.existsSync("storage/z3/" + fileName)) {
          Z3DownloadStack.release(); // Release stack if file exists
          return reject("File " + fileName + " already exists");
        }

        const request = https.get(url, options, (response: IncomingMessage) => {
          if (!fs.existsSync("storage/z3"))
            mkdirSync("storage/z3", { recursive: true }); //Optional if you already have downloads directory
          const destination = path.resolve("./storage/z3", fileName);
          const fileStream = fs.createWriteStream(destination, { flags: "wx" });

          response.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close(() => {
              Z3DownloadStack.release(); // Release stack after download is complete
              return resolve(fileName);
            });
          });

          fileStream.on("error", (err) => {
            fs.unlink(destination, () => {}); // Delete the file async, don't wait for it to finish
            Z3DownloadStack.release(); // Release stack on error
            return reject(err);
          });
        });

        request.on("error", (error) => {
          Z3DownloadStack.release(); // Release stack on error
          return reject(error);
        });
      } catch (error) {
        Z3DownloadStack.release(); // Release stack on error
        return reject(error);
      }
    });
  }

  static async getSongStreamHandler(song_id: string, res: Response) {
    const SongDB = this.getDB();
    let fileName: string = song_id + ".mp3";
    if (fs.existsSync("storage/z3/" + fileName)) {
      // STREAM SONG
      res.setHeader("content-type", "audio/mpeg");
      fs.createReadStream("storage/z3/" + fileName).pipe(res);
    }
    const songData: Z3_Database_Song | null = await SongDB.findOne({
      id: song_id,
    });
    if (!songData) return res.status(400).json({ error: "Not found" });
    if (!songData.source_url) {
      const downloadUrl = await this.fetchDownloadURL(song_id);
      if (!downloadUrl)
        return res.status(500).json({ error: "Stream not found" });
      await SongDB.findOneAndUpdate({ id: song_id }, { source_url: downloadUrl });
      await this.downloadSong(downloadUrl, song_id + ".mp3");
    } else {
      console.log(songData.source_url, song_id + ".mp3");
      await this.downloadSong(songData.source_url, song_id + ".mp3");
    }

    if (fs.existsSync("storage/z3/" + fileName)) {
      // STREAM SONG
      res.setHeader("content-type", "audio/mpeg");
      fs.createReadStream("storage/z3/" + fileName).pipe(res);
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchDownloadURL(id: string) {
    const BASE = "ht" + "tps://" + "z" + "3" + ".f" + "m";
    const downloadUrl = (
      await fetch(BASE + "/download/" + id, {
        headers: this.getHeaders(),
        redirect: "manual",
      })
    ).headers.get("location");

    return downloadUrl || null;
  }

  static getHeaders() {
    return {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7",
      "cache-control": "max-age=0",
      "if-modified-since": "Sat, 10 Feb 2024 23:56:00 GMT",
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie:
        "zvApp=detect2; PHPSESSID=032tgtiumlo0akapd54anf8tk4; zvAuth=1; zvLang=0; YII_CSRF_TOKEN=301a3fa2830ffebbd95f24c4bcfb621786daf627; zv=tak-tak-tak; _ga=GA1.1.1211557563.1707509205; ZvcurrentVolume=13.5; z1_n=5; _ga_4QVWK2LSTX=GS1.1.1707659684.4.0.1707659684.0.0.0",
    };
  }
}
