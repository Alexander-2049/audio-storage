import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import dotenv from "dotenv";
// import {
//   createUserDocument,
//   findAllDocumentsFromCollection,
//   findUserById,
// } from "./db";
dotenv.config();

const app = express();
const port = 80;

const DB_URI: string | undefined = process.env.DB_URI;
if (!DB_URI) throw new Error("DB_URI is required");

const mongoClient = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const db = await mongoClient.db("audio-storage");

    const usersCollection = db.collection("users");

    // await createUserDocument(usersCollection, {
    //   username: "Demi Myrich",
    //   password: "ECMA Script 2024",
    //   token: "Cookie123"
    // });

    // console.log(await findUserById(usersCollection, "65aed5980bb2517ed5fddb48"));

    // console.log(await findAllDocumentsFromCollection(usersCollection));

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log("main() error: " + error);
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}

main().catch(console.dir);
