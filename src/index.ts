import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const port = 80;

const DB_URI: string | undefined = process.env.DB_URI;
export const SECRET_TOKEN: string = process.env.SECRET_TOKEN || "";

async function main() {
  try {
    console.log("Trying to connect to MongoDB Database...");
    if (!DB_URI) throw new Error("DB_URI is required");
    if (SECRET_TOKEN === "") throw new Error("SECRET_TOKEN is required");
    const connection = await mongoose.connect(DB_URI);
    if (connection) {
      console.log("Successfully connected to MongoDB!");
    }

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(router);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("main() error: " + error);
  }
}

main().catch(console.dir);
