import { Permission, IndexType } from "node-appwrite";
import { db, answerCollection } from "@/models/name";
import { databases } from "./config";

export async function createAnswerTable() {
  try {
    await databases.createCollection(db, answerCollection, answerCollection, [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Answer Collection Created");

    await databases.createStringAttribute(db, answerCollection, "content", 10000, true);
    await databases.createStringAttribute(db, answerCollection, "authorId", 50, true);
    await databases.createStringAttribute(db, answerCollection, "questionId", 50, true);
    console.log("Answer Attributes Created");

    // Wait for attributes
    await new Promise(r => setTimeout(r, 2000));

    await databases.createIndex(db, answerCollection, "idx_questionId", IndexType.Key, ["questionId"]);
    await databases.createIndex(db, answerCollection, "idx_authorId", IndexType.Key, ["authorId"]);

    console.log("Answer Indexes Created");
  } catch (error) {
    console.log("Answer Collection Error (or already exists):", error);
  }
}
