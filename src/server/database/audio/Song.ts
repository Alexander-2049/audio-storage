import mongoose from "mongoose";
import { Document } from "mongoose";

export interface Database_Song extends Document {
  title: string;
  artist: string;
  file_name: string | null;
  duration: number | null;
  chunks: number | null;
  file_size: number | null;
  song_id: string;
}

const songSchema = new mongoose.Schema<Database_Song>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  file_name: { type: String, default: null },
  duration: { type: Number, default: null },
  chunks: { type: Number, default: null },
  file_size: { type: Number, default: null },
  song_id: { type: String, required: true },
});

const Song_DB = mongoose.models?.Song || mongoose.model("Song", songSchema);
export default Song_DB;
