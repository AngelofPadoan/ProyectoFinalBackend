import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts",
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin", "premium"],
            default: "user"
        },
        documents: [
            {
                name: {
                    type: String,
                },
                reference: {
                    type: String,
                },
            },
        ],
        last_connection: {
            type: Date,
        }
    })

const userModel = mongoose.model(collection, schema);

export default userModel;