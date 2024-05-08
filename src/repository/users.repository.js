import { GetUserDTO} from "../dao/dto/userDto.js";

export class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(){
        const users = await this.dao.getAllUsers();
        return users.map(user => new GetUserDTO(user));
    }

    async getUser(id){
        return await this.dao.getUser(id)
    }

    async create(user){
        return await this.dao.saveUser(user);
    }

    async get(user){
        const {email} = user;
        const userInfo = await this.dao.getUser({email});
        return new GetUserDTO(userInfo);
    }

    async updateUser(id, user){
        return await this.dao.updateUser(id, user);
    }

    async deleteUser(id){
        return this.dao.deleteUser(id)
    }
}