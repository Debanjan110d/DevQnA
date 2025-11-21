import { Permission, IndexType } from "node-appwrite";
import { db, usersCollection } from "../name";
import { databases } from "./config";

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const status = error && typeof error === "object" && "code" in error ? (error as { code: number }).code : undefined;
      if (status === 404 || status === 409) {
        throw error;
      }
      if (i === retries - 1) {
        throw error;
      }
      console.warn(`⚠️ Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error("Retry logic failed");
}

export default async function createUserTable() {
  try {
    await retryWithBackoff(() => databases.getCollection({ databaseId: db, collectionId: usersCollection }));
    console.log("✅ Users collection already exists");
  } catch (error: unknown) {
    const status = error && typeof error === "object" && ("code" in error ? (error as { code: number }).code : undefined);
    const message = error instanceof Error ? error.message : String(error);

    if (status === 404 || /not found/i.test(message)) {
      try {
        await retryWithBackoff(() => databases.createCollection({
          databaseId: db,
          collectionId: usersCollection,
          name: "Users",
          permissions: [
            Permission.read("any"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
          ],
          documentSecurity: true,
        }));

        console.log("✅ Users collection created");

        // User ID (matches Appwrite account ID)
        await retryWithBackoff(() => databases.createStringAttribute({
          databaseId: db,
          collectionId: usersCollection,
          key: "userId",
          size: 255,
          required: true,
        }));
        console.log("✅ userId attribute created");

        // Name
        await retryWithBackoff(() => databases.createStringAttribute({
          databaseId: db,
          collectionId: usersCollection,
          key: "name",
          size: 255,
          required: true,
        }));
        console.log("✅ name attribute created");

        // Email
        await retryWithBackoff(() => databases.createStringAttribute({
          databaseId: db,
          collectionId: usersCollection,
          key: "email",
          size: 255,
          required: true,
        }));
        console.log("✅ email attribute created");

        // Avatar URL
        await retryWithBackoff(() => databases.createStringAttribute({
          databaseId: db,
          collectionId: usersCollection,
          key: "avatar",
          size: 2000,
          required: false,
        }));
        console.log("✅ avatar attribute created");

        // Reputation
        await retryWithBackoff(() => databases.createIntegerAttribute({
          databaseId: db,
          collectionId: usersCollection,
          key: "reputation",
          required: false,
          xdefault: 0,
        }));
        console.log("✅ reputation attribute created");

        // Bio
        await retryWithBackoff(() => databases.createStringAttribute({
          databaseId: db,
          collectionId: usersCollection,
          key: "bio",
          size: 1000,
          required: false,
        }));
        console.log("✅ bio attribute created");

        // Create index on userId for faster lookups
        await retryWithBackoff(() => databases.createIndex({
          databaseId: db,
          collectionId: usersCollection,
          key: "userId_index",
          type: IndexType.Unique,
          attributes: ["userId"],
        }));
        console.log("✅ userId index created");

      } catch (createError: unknown) {
        console.error("❌ Error creating users collection:", createError);
        throw createError;
      }
    } else {
      console.error("❌ Error checking users collection:", error);
      throw error;
    }
  }
}

export { createUserTable };
