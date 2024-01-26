import express from "express";
import { nextApp, nextHandler } from "./next-utils";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./server/routes";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;
if (!process.env.MONGO_DB_URI || !process.env.SECRET_JWT_TOKEN)
  throw new Error("MONGO_DB_URI and SECRET_JWT_TOKEN are required");
export const { MONGO_DB_URI, SECRET_JWT_TOKEN } = process.env;

const start = async () => {
  const connection = await mongoose.connect(MONGO_DB_URI);
  if (connection) {
    console.log("Successfully connected to MongoDB!");
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser(SECRET_JWT_TOKEN));
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
