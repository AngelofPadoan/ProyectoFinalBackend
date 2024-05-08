import mongoose from "mongoose";
import { options } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(options.MONGO_URL);
    } catch (error) {
        console.log(`Hubo un error al tratar de conectar a la BD el error es: ${error}`);
    }
}