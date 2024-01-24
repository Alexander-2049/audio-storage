import express from "express";
import { nextApp, nextHandler } from "./next-utils";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import router from "./server/routes";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;
if (!process.env.DB_URI || !process.env.SECRET_TOKEN)
  throw new Error("DB_URI and SECRET_TOKEN are required");
export const { DB_URI, SECRET_TOKEN } = process.env;

const start = async () => {
  const connection = await mongoose.connect(DB_URI);
  if (connection) {
    console.log("Successfully connected to MongoDB!");
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api", router);

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    console.log(`API URL http://localhost:${PORT}/api`);
  });

  app.listen(PORT, () => {
    console.log(`Next.js App URL: http://localhost:${PORT}`);
  });
};

start();
