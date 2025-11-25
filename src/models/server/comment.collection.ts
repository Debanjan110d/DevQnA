import { Permission, IndexType } from "node-appwrite";
import { db, commentCollection } from "@/models/name";
import { databases } from "./config";

export async function createCommentTable() {
  try {
    await databases.createCollection(db, commentCollection, commentCollection, [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Comment Collection Created");

    await databases.createStringAttribute(db, commentCollection, "content", 10000, true);
    await databases.createStringAttribute(db, commentCollection, "authorId", 50, true);
    await databases.createStringAttribute(db, commentCollection, "typeId", 50, true);
    await databases.createStringAttribute(db, commentCollection, "type", 50, true);
    console.log("Comment Attributes Created");

    // Wait for attributes
    await new Promise(r => setTimeout(r, 2000));

    await databases.createIndex(db, commentCollection, "idx_type", IndexType.Key, ["type"]);
    await databases.createIndex(db, commentCollection, "idx_typeId", IndexType.Key, ["typeId"]);
    await databases.createIndex(db, commentCollection, "idx_authorId", IndexType.Key, ["authorId"]);

    console.log("Comment Indexes Created");
  } catch (error) {
    console.log("Comment Collection Error (or already exists):", error);
  }
}
