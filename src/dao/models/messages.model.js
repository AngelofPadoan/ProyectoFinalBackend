import mongoose from "mongoose";

const collection = "messages";

const userSchema = new mongoose.Schema({
    user: String,
    message: String,
})

const messagesModel = mongoose.model(collection,userSchema);

export default messagesModel;