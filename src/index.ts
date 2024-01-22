import express from "express";
import runDb from "./db";

const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

runDb().catch(console.dir);
