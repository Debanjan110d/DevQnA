// src/app/env.ts  (client-safe)
export const APPWRITE_HOST = process.env.NEXT_PUBLIC_APPWRITE_HOST_URI!;
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
export const APPWRITE_PROJECT_NAME = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME!;

if (!APPWRITE_HOST || !APPWRITE_PROJECT_ID) {
console.warn("Client env: NEXT_PUBLIC_APPWRITE_* not set");
}
