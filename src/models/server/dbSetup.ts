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
    await retryWithBackoff(() => databases.get({ databaseId: db }));
    // Database already exists, tables will be created if needed

    await createUserTable();
    await createQuestionTable();
    await createAnswerTable();
    await createVotesTable();
    await createCommentTable();
    await createQuestionAttachmentBucket();


  } catch (error: unknown) {
    const status = error && typeof error === "object" && ("code" in error ? (error as { code: number }).code : 
                   "response" in error && error.response && typeof error.response === "object" && "status" in error.response ? 
                   (error.response as { status: number }).status : 
                   "status" in error ? (error as { status: number }).status : undefined);
    const message = error instanceof Error ? error.message : String(error);

    if (status === 404 || /not found/i.test(message)) {
      try {
        const created = await retryWithBackoff(() => databases.create({
          databaseId: db,
          name: "StackOverflow Database",
          enabled: true,
        }));

        // Database created successfully

        await createUserTable();
        await createQuestionTable();
        await createAnswerTable();
        await createVotesTable();
        await createCommentTable();
        await createQuestionAttachmentBucket();


      } catch (createError: unknown) {
        const createMessage = createError instanceof Error ? createError.message : String(createError);
        console.error("❌ Error creating database:", createMessage);
        throw createError;
      }
    } else {
      console.error("❌ Error checking database:", error);
      console.error("💡 If you see 502 Bad Gateway, check:");
      console.error("   1. Appwrite server is running and accessible");
      console.error("   2. NEXT_PUBLIC_APPWRITE_HOST_URI is correct in .env");
      console.error("   3. Your network connection");
      throw error;
    }
  }
}

if (require.main === module) {
  createDB().catch((err) => {
    console.error("Fatal error during setup:", err);
    process.exit(1);
  });
}
