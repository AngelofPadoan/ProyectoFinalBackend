import {UsersRepository} from "./users.repository.js";
import {Users} from "../dao/mongoManagers/UserManager.js";
import {ProductManagerMongo} from "../dao/mongoManagers/ProductMongoManager.js";
import {ProductsRepository} from "./products.repository.js";
import {CartManagerMongo} from "../dao/mongoManagers/CartMongoManager.js";
import {CartsRepository} from "./carts.repository.js";
import {TicketManagerMongo} from "../dao/mongoManagers/TicketMongoManager.js";
import {TicketsRepository} from "./tickets.repository.js";

const User = new Users();

const Product = new ProductManagerMongo();
const Cart = new CartManagerMongo();
const Ticket = new TicketManagerMongo();
export const userService = new UsersRepository(User);
export const productService = new ProductsRepository(Product);
export const cartService = new CartsRepository(Cart);
export const ticketService = new TicketsRepository(Ticket);