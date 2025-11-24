import { Permission } from "node-appwrite";
import { db, questionCollection } from "@/models/name";
import { databases } from "./config";

export async function createQuestionTable() {
  try {
    await databases.createCollection(db, questionCollection, questionCollection, [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Question Collection Created");

    await databases.createStringAttribute(db, questionCollection, "title", 100, true);
    await databases.createStringAttribute(db, questionCollection, "content", 10000, true);
    await databases.createStringAttribute(db, questionCollection, "authorId", 50, true);
    await databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true); // Array
    await databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false);
    console.log("Question Attributes Created");

    // Wait for attributes
    await new Promise(r => setTimeout(r, 2000));

    await databases.createIndex(db, questionCollection, "idx_title", "fulltext", ["title"]);
    await databases.createIndex(db, questionCollection, "idx_content", "fulltext", ["content"]);

    console.log("Question Indexes Created");
  } catch (error: any) {
    console.log("Question Collection Error (or already exists):", error.message);
  }
}

