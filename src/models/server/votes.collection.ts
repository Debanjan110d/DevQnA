import { Permission } from "node-appwrite";
import { db, votesCollection } from "@/models/name";
import { databases } from "./config";

export async function createVotesTable() {
  try {
    await databases.createCollection(db, votesCollection, votesCollection, [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Votes Collection Created");

    await databases.createStringAttribute(db, votesCollection, "voteStatus", 50, true);
    await databases.createStringAttribute(db, votesCollection, "votedById", 50, true);
    await databases.createStringAttribute(db, votesCollection, "typeId", 50, true);
    await databases.createStringAttribute(db, votesCollection, "type", 50, true);
    console.log("Votes Attributes Created");
    
    // Wait for attributes
    await new Promise(r => setTimeout(r, 2000));

    await databases.createIndex(db, votesCollection, "idx_type", "key", ["type"]);
    await databases.createIndex(db, votesCollection, "idx_typeId", "key", ["typeId"]);
    await databases.createIndex(db, votesCollection, "idx_votedById", "key", ["votedById"]);

    console.log("Votes Indexes Created");
  } catch (error: any) {
    console.log("Votes Collection Error (or already exists):", error.message);
  }
}
