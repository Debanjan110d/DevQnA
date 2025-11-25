import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "@/models/name";
import { storage } from "./config";

export default async function createQuestionAttachmentBucket() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Bucket Connected");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read("any"),
          Permission.create("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,
        true,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );
      console.log("Storage Bucket Created");
    } catch (error) {
      console.log("Storage Bucket creation failed or already exists", error);
    }
  }
}



