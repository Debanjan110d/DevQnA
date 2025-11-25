import { db } from "../name";
import { createAnswerTable } from "./answer.collection";
import { createQuestionTable } from "./question.collection";
import { createVotesTable } from "./votes.collection";
import { createCommentTable } from "./comment.collection";
import { createUserTable } from "./user.collection";
import createQuestionAttachmentBucket from "./storageSetup";

import { databases } from "./config";

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const status = error && typeof error === "object" && "code" in error ? (error as { code: number }).code : undefined;
      // Don't retry on 404 (not found) or 409 (conflict/already exists)
      if (status === 404 || status === 409) {
        throw error;
      }
      // On 502 Bad Gateway or other network errors, retry
      if (i === retries - 1) {
        throw error; // Last attempt failed
      }
      console.warn(`⚠️ Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error("Retry logic failed");
}

export default async function createDB() {
  try {
    await retryWithBackoff(() => databases.get(db));
    console.log("Database connected");
  } catch (error: any) {
    try {
      await retryWithBackoff(() => databases.create(db, db));
      console.log("Database created");
    } catch (err) {
      console.log("Database creation failed or already exists", err);
    }
  }

  await Promise.all([
    createUserTable(),
    createQuestionTable(),
    createAnswerTable(),
    createVotesTable(),
    createCommentTable(),
    createQuestionAttachmentBucket(),
  ]);

  console.log("Collection creation tasks initiated");
}

if (require.main === module) {
  createDB().catch((err) => {
    console.error("Fatal error during setup:", err);
    process.exit(1);
  });
}
