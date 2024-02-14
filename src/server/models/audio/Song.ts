import mongoose from "mongoose";
import { Document } from "mongoose";

interface Database_Song extends Document {
  song_id: string;
  title: string;
  artist: string;
  file_name: string | null;
  duration: string | null;
  chunks: string | null;
  total_size: string | null;
  storage_name: string;
  storage_song_id: string;
}

const songSchema = new mongoose.Schema<Database_Song>({
  song_id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  file_name: { type: String, default: null },
  duration: { type: String, default: null },
  chunks: { type: String, default: null },
  total_size: { type: String, default: null },
  storage_name: { type: String, required: true },
  storage_song_id: { type: String, required: true },
});

export default mongoose.models?.Song || mongoose.model("Song", songSchema);
