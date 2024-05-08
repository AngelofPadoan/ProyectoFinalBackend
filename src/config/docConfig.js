import __dirname from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentación api ",
            version: "1.0.0",
            description:"Definicion de endpoints para la API"
        }
    },
    apis:[`${path.join(__dirname,"/docs/**/*.yaml")}`],
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);