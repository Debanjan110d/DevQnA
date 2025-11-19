import { Avatars, Client, Databases, Storage, Users, TablesDB } from "node-appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URI!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

export const users = new Users(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);

export default client;