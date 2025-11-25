import { Permission, IndexType } from "node-appwrite";
import { db, usersCollection } from "../name";
import { databases } from "./config";

export default async function createUserTable() {
  try {
    await databases.createCollection(db, usersCollection, "Users", [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ], true);
    console.log("User Collection Created");

    await databases.createStringAttribute(db, usersCollection, "userId", 50, true);
    await databases.createStringAttribute(db, usersCollection, "name", 50, true);
    await databases.createStringAttribute(db, usersCollection, "email", 50, true);
    await databases.createStringAttribute(db, usersCollection, "avatar", 2000, false);
    await databases.createIntegerAttribute(db, usersCollection, "reputation", false, 0, 1000000, 0);
    await databases.createStringAttribute(db, usersCollection, "bio", 1000, false);
    console.log("User Attributes Created");

    // Wait for attributes
    await new Promise(r => setTimeout(r, 2000));

    await databases.createIndex(db, usersCollection, "userId_index", IndexType.Unique, ["userId"]);
    console.log("User Indexes Created");
  } catch (error) {
    console.log("User Collection Error (or already exists):", error);
  }
}

export { createUserTable };
