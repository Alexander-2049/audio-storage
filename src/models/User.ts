import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  reg_date: { type: Date, default: Date.now },
  reg_ip: { type: String, required: true },
  role: { type: String, default: "user" },
});

export default mongoose.models?.User || mongoose.model("User", userSchema);
