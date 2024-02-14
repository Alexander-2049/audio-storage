import express from "express";
import { nextApp, nextHandler } from "./next-utils";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./server/routes";
import Stack from "./server/models/Stack";
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;
if (!process.env.MONGODB_URI || !process.env.SECRET_TOKEN)
  throw new Error("MONGODB_URI and SECRET_TOKEN are required");
export const { MONGODB_URI, SECRET_TOKEN } = process.env;

const MAX_SIMULTANEOUS_REQUESTS = 10;
export const Z3DownloadStack = new Stack(MAX_SIMULTANEOUS_REQUESTS);

const start = async () => {
  const connection = await mongoose.connect(MONGODB_URI);
  if (connection) {
    console.log("Successfully connected to MongoDB!");
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser(SECRET_TOKEN));
  app.use("/api", router);

  app.use((req, res) => nextHandler(req, res));

  await nextApp.prepare().then(() => {
    console.log(`API URL http://localhost:${PORT}/api`);
  });

  app.listen(PORT, () => {
    console.log(`Next.js App URL: http://localhost:${PORT}`);
  });
};

start();
