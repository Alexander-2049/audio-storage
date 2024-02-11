import mongoose from "mongoose";
import { parse } from "node-html-parser";
import fs, { mkdirSync } from "fs";
import path from "path";
import https from "https";
import { IncomingMessage } from "http";
// import Semaphore from "./Semaphore";

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
  downloaded: boolean;
  duration: string;
  source_url: string | null;
}

const z3Schema = new mongoose.Schema<Z3_Database_Song>({
  id: { type: String, unique: true, required: true },
  artist: { type: String, required: true },
  duration: { type: String, required: true },
  source_url: { type: String, default: null },
  song_name: { type: String, required: true },
  downloaded: { type: Boolean, default: false },
});

export default mongoose.models?.Z3 || mongoose.model("Z3", z3Schema);

export class Z3 {
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

      const source_url = await this.fetchDownloadURL(id);

      if (mongoose.models.Z3) {
        const songFromDb = await mongoose.models.Z3.find({ id });
        if (songFromDb.length < 1) {
          const song = new mongoose.models.Z3({
            id,
            artist,
            duration,
            source_url,
            song_name,
          });
          await song.save();
        }
      }

      songs.push({
        song_name,
        artist,
        duration,
        id,
        source_url,
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
        const options = {
          headers: this.getHeaders(), // Assuming this function returns headers
          rejectUnauthorized: false, // Ignore SSL certificate verification
        };

        if (fs.existsSync("storage/z3/" + fileName)) {
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
              return resolve(fileName);
            });
          });

          fileStream.on("error", (err) => {
            fs.unlink(destination, () => {}); // Delete the file async, don't wait for it to finish
            return reject(err);
          });
        });

        request.on("error", (error) => {
          return reject(error);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  // static async downloadAllSongs() {
  //   if (!mongoose.models.Z3) return;

  //   try {
  //     // Fetch all documents from the collection
  //     const allSongs = await mongoose.models.Z3.find({});
  //     const MAX_CONCURRENT_DOWNLOADS = 10;
  //     const semaphore = new Semaphore(MAX_CONCURRENT_DOWNLOADS);

  //     // Extract source_url from each document and download the song
  //     const downloadPromises = allSongs.map(async (songDoc) => {
  //       if (songDoc.source_url) {
  //         await semaphore.acquire();
  //         const fileName = `${songDoc.id}.mp3`;
  //         try {
  //           console.log(await this.downloadSong(songDoc.source_url, fileName));
  //         } catch (error) {
  //           console.error("Error downloading song:", error);
  //         } finally {
  //           semaphore.release();
  //         }
  //       }
  //     });

  //     // Wait for all songs to be queued and downloaded
  //     await Promise.all(downloadPromises);

  //     console.log("All songs downloaded successfully.");
  //   } catch (error) {
  //     console.error("Error downloading songs:", error);
  //   }
  // }

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
