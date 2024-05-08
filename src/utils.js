import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";
import {transport} from "./config/gmail.js";
import {ticketService} from "./repository/index.repository.js";
import {en, Faker} from "@faker-js/faker";
import jwt from "jsonwebtoken";
import {options} from "./config/config.js";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const emailSenderPurchase = async (UserEmail) => {
    try {

        const ticket = await ticketService.getTicket(UserEmail);

        const {code,purchase_datetime,purchaser} = ticket;

        let emailTemplate = `<div>
            <h1>Gracias por tu compra!!</h1>
            <p>Código: ${code}</p>
            <p>Fecha de compra: ${purchase_datetime}</p>
            <p>Comprador: ${purchaser}</p>
            <img src="https://images8.alphacoders.com/580/thumb-1920-580282.jpg" style="width:250px"/>
            <p>Esperamos verte de nuevo</p>
            <a href="https://localhost:8080">Visitar</a>
</div>`;

        const content = await transport.sendMail({
            from: "Ecommerce",
            to: UserEmail,
            subject: "Conmfirmación de compra",
            html: emailTemplate
        })
        console.log("Contenido", content)
        return "ok";

    } catch (error) {
        console.log(error.message);
        return "fail";
    }
}
export const customFaker = new Faker({
    locale: [en]
});

const { commerce, image, database, string} = customFaker;

export const generateProduct = () => {
    return {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        code: string.alphanumeric(10),
        stock: parseInt(string.numeric(2)),
        category: commerce.department(),
        status: true,
        thumbnails: [image.url()]
    };
}

export const generateEmailToken = (email, expireTime) => {
    return jwt.sign({email}, options.CLIENT_SECRET, {expiresIn: expireTime});
}
export const emailSender = async (email, template, subject = "Customer Support") => {
    try {

        const content = await transport.sendMail({
            from: "E-commerce",
            to: email,
            subject,
            html: template
        })
        return true;

    } catch (error) {
        console.log(error.message);

        return false;
    }
}