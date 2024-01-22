import { Collection, ObjectId } from "mongodb";
import IUser from "./types/IUser";

export async function createUserDocument(collection: Collection, user: IUser) {
  const result = await collection.insertOne(user);
  console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

export async function findUserById(collection: Collection, id: string) {
  const result = await collection.findOne({_id: new ObjectId(id)});
  return result;
}

export async function findAllDocumentsFromCollection(collection: Collection) {
  const result = await collection.find({}).toArray();
  return result;
}
