import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const NODE_ENV = process.env.NODE_ENV;
export const options = {
    PORT,
    MONGO_URL,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    EMAIL,
    PASS,
    NODE_ENV
}