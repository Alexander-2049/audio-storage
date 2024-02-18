import { HTMLElement, parse } from "node-html-parser";
import Song_DB, { Database_Song } from "../database/audio/Song";

interface Song {
  _id: string | null;
  song_name: string;
  artist: string;
  duration: number;
  song_id: string;
}

export default class Z3 {
  public static async search(query: string): Promise<Song[]> {
    const url = getSearchUrl(query);
    try {
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      const html = await response.text();
      const songs = parseSearchPage(html);

      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const { song_name, artist, duration, song_id } = song;
        const songFromSongDB: Database_Song | null = await Song_DB.findOne({
          song_id: "z3_" + song_id,
        });
        if (!songFromSongDB) {
          const saved: Database_Song | null = await this.saveSongToDB({
            artist,
            chunks: null,
            duration,
            file_size: null,
            song_id,
            title: song_name,
          });
          if (!saved) continue;
          song._id = saved._id.toString();
        } else {
          song._id = songFromSongDB._id.toString();
        }
      }

      return songs.map((e) => ({ ...e, song_id: "z3_" + e.song_id }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public static async getSongInfo(id: string) {
    const song = await this.findSongInDB(id);
    return song;
  }

  public static async findSongInDB(song_id: string) {
    try {
      const song: Database_Song | null = await Song_DB.findOne({
        song_id: "z3_" + song_id,
      });
      return song;
    } catch (error) {
      return null;
    }
  }

  public static async fetchSourceURL(id: string) {
    const downloadUrl = (
      await fetch(getUrlBase() + "/download/" + id, {
        headers: getHeaders(),
        redirect: "manual",
      })
    ).headers.get("location");

    return downloadUrl || null;
  }

  static async saveSongToDB({
    title,
    artist,
    duration,
    chunks,
    file_size,
    song_id,
  }: {
    title: string;
    artist: string;
    duration: number;
    chunks: number | null;
    file_size: number | null;
    song_id: string;
  }) {
    try {
      return await new Song_DB({
        title,
        artist,
        duration,
        chunks,
        file_size,
        song_id: "z3_" + song_id,
      }).save();
    } catch (error) {
      return null;
    }
  }
}

function getUrlBase() {
  return (
    "h" + "t" + "t" + "p" + "s" + ":" + "/" + "/" + "z" + "3" + "." + "f" + "m"
  );
}

function getHeaders() {
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

function getSearchUrl(query: string) {
  const base = getUrlBase();
  const url = new URL(base);
  url.pathname = "mp3/search";
  url.searchParams.set("sort", "views");
  url.searchParams.set("keywords", query);
  return url.toString();
}

function parseSearchPage(html: string) {
  const document = parse(html);

  const divList = Array.from(
    document.querySelectorAll("div.whb_wrap div.songs-list div.song-wrap")
  );
  const songs: Song[] = divList.map((e) => {
    return {
      _id: null,
      song_name: querySelector(e, "div.song-name"),
      artist: querySelector(e, "div.song-artist"),
      duration: timeStringToMilliseconds(querySelector(e, "span.song-time")),
      song_id:
        e.querySelector("span.song-download")?.attributes["data-sid"].trim() ||
        "",
    };
  });

  return songs;
}

function querySelector(e: HTMLElement, selector: string) {
  return e.querySelector(selector)?.innerText.trim() || "";
}

function timeStringToMilliseconds(time: string): number {
  const [minutes, seconds] = time.split(":").map(Number);
  return (minutes * 60 + seconds) * 1000;
}
