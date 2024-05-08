import path from "path";
import winston from "winston";
import {options} from "../config/config.js";

import __dirname from "../utils.js";

const currentEnv = options.NODE_ENV || "development";

const customLevels = {
    levels : {
        fatal : 0,
        error : 1,
        warning : 2,
        info : 3,
        http : 4,
        debug : 5
    },
    colors : {
        fatal : "red",
        error : "orange",
        warning : "yellow",
        info : "green",
        http : "blue",
        debug : "purple"
    }
}

const devLogger = winston.createLogger({
    levels : customLevels.levels,
    transports : [
        new winston.transports.Console({level : "debug"}),
    ]
})

const prodLogger = winston.createLogger({
    levels : customLevels.levels,
    transports : [
        new winston.transports.Console({level : "info"}),
        new winston.transports.File({filename : path.join(__dirname, "/logs/errors.log"), level : "info"})
    ]
})

const addLogger = (req,res,next)=>{
    if (currentEnv === "development") {
        req.logger = devLogger
    }
    else{
        req.logger = prodLogger
    }
    req.logger.debug(`${req.url} - method : ${req.method}`);
    next();
}

export {addLogger};