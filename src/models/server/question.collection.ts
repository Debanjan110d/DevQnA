// src/models/server/question.collection.ts
import dotenv from "../env";
dotenv.config(); // ensures process.env is loaded when running as a script

import { Client, Databases, Permission, Role, IndexType } from "node-appwrite";
import { db, questionCollection } from "@/lib/name"; // adjust path if necessary

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_HOST_URI;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const SERVER_KEY = process.env.APPWRITE_API_KEY; // must be set in .env (server-only)
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || db; // fallback to db constant

if (!ENDPOINT || !PROJECT_ID) {
  console.error("Missing NEXT_PUBLIC_APPWRITE_HOST_URI or NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  process.exit(1);
}
if (!SERVER_KEY) {
  console.error("Missing APPWRITE_API_KEY (server-only). Set APPWRITE_API_KEY in .env");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(SERVER_KEY);

const databases = new Databases(client);

function isAlreadyExistsError(err: any) {
  // Appwrite typically returns code 409 for "already exists" (collection/attribute/index)
  return err && (err.code === 409 || String(err).toLowerCase().includes("already"));
}

async function safeCall(fn: () => Promise<any>, description = "") {
  try {
    return await fn();
  } catch (err: any) {
    if (isAlreadyExistsError(err)) {
      console.warn(`${description} already exists — skipping.`);
      return null;
    }
    console.error(`Error during ${description}:`, err?.message ?? err);
    throw err;
  }
}

export async function createQuestionCollection() {
  console.log("Starting creation of collection:", questionCollection);

  // 1) Create collection
  await safeCall(
    () =>
      databases.createCollection({
        databaseId: DATABASE_ID,
        collectionId: questionCollection,
        name: questionCollection,
        permissions: [
          Permission.read(Role.any()), // public read
          Permission.create(Role.users()), // logged-in users can create
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        documentSecurity: false,
      }),
    "createCollection"
  );

  // 2) Create attributes
  await Promise.all([
    safeCall(
      () =>
        databases.createStringAttribute({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "title",
          size: 200,
          required: true,
        }),
      "createStringAttribute:title"
    ),
    safeCall(
      () =>
        databases.createStringAttribute({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "content",
          size: 5000,
          required: true,
        }),
      "createStringAttribute:content"
    ),
    safeCall(
      () =>
        databases.createStringAttribute({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "authorId",
          size: 64,
          required: true,
        }),
      "createStringAttribute:authorId"
    ),
    safeCall(
      () =>
        databases.createStringAttribute({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "tags",
          size: 100,
          required: false,
          array: true,
        }),
      "createStringAttribute:tags"
    ),
    safeCall(
      () =>
        databases.createStringAttribute({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "attachmentId",
          size: 64,
          required: false,
        }),
      "createStringAttribute:attachmentId"
    ),
  ]);

  // 3) Create indexes
  await Promise.all([
    safeCall(
      () =>
        databases.createIndex({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "idx_title_fulltext",
          type: IndexType.FullText,
          attributes: ["title"],
        }),
      "createIndex:idx_title_fulltext"
    ),
    safeCall(
      () =>
        databases.createIndex({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "idx_authorid_key",
          type: IndexType.Key,
          attributes: ["authorId"],
        }),
      "createIndex:idx_authorid_key"
    ),
    safeCall(
      () =>
        databases.createIndex({
          databaseId: DATABASE_ID,
          collectionId: questionCollection,
          key: "idx_tags_key",
          type: IndexType.Key,
          attributes: ["tags"],
        }),
      "createIndex:idx_tags_key"
    ),
  ]);

  console.log("Question collection setup complete. Check Appwrite console.");
}

// If executed directly from node/ts-node, run:
if (require.main === module) {
  createQuestionCollection().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
