import mongoose from "mongoose";
import { Document } from "mongoose";

interface Database_Z3 extends Document {
  source_url: string;
  storage_song_id: string;
}

const Z3Schema = new mongoose.Schema<Database_Z3>({
  source_url: { type: String, required: true },
  storage_song_id: { type: String, required: true, unique: true },
});

const Z3_DB = mongoose.models?.Z3 || mongoose.model("Z3", Z3Schema);
export default Z3_DB;
