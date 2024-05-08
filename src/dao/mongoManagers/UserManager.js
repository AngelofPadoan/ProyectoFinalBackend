import userModel from '../models/users.model.js';
import {CartManagerMongo} from "./CartMongoManager.js";

const Cart = new CartManagerMongo();

export class Users {
    constructor() {
    }

    getAllUsers = async () => {
        return await userModel.find();
    }

    saveUser = async (user) => {
        const newCart = await Cart.createCart(user);

        const newUser = {
            ...user,
            cart : newCart._id
        }

        return await userModel.create(newUser);
    }

    getUser = async (params) => {
        return await userModel.findOne(params);
    }

    updateUser = async (id, user) => {
        delete user._id;

        return await userModel.updateOne({_id: id}, {$set: user});
    }

    async deleteUser(id) {
        await userModel.deleteOne({_id:id});
        return "success";
    }
}