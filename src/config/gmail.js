import nodemailer from "nodemailer";
import {options} from "./config.js";
import {emailSender} from "../utils.js";

const adminEmail = options.EMAIL;
const adminPass = options.PASS;

const transport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user:adminEmail,
        pass:adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})

export const sendPasswordRecovery = async (email, token) => {

    const link = `http://localhost:8080/resetPassword?token=${token}`;

    const template = `
    <div>
        <h1>Solicitud cambio de contraseña</h1>
        <p>Para restablecer tu contraseña haz click aquí</p>
        <a href="${link}">Restablecer contraseña</a>
    </div>
    `

    const subject = "Restablecer contraseña";
    return await emailSender(email, template, subject);
}


export const sendEmailInactiveUser = async (email) => {

    const link = `http://localhost:8080/register`
    const template = `
        <div>
            <h1>Tu cuenta ha sido eliminada</h1>
            <p>Si deseas volver a crear tu cuenta, haz click en el siguiente link</p>
            <a href="${link}">
                <button>Crear cuenta</button>
            </a>
        </div>`

    const subject = "Cuenta eliminada por inactividad";
    return await emailSender(email, template, subject);
}

export const sendEmailProductRemoved = async (email, productInfo) => {

    const { title, description, code, _id } = productInfo[0];
    const template = `
        <div>
            <h1>Su producto ha sido eliminado</h1>
            <p>Detalle del producto:</p>
            <p>Nombre: ${title}</p>
            <p>Descripcion:${description}</p>
            <p>Codigo:${code}</p>
            <p>ID: ${_id}</p>
        </div>`

    const subject = "Producto eliminado con exito";
    return await emailSender(email, template, subject);
}

export { transport };