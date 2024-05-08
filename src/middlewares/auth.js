import jwt from "jsonwebtoken";
import {options} from "../config/config.js";

export const checkRole = (roles)=>{
    return (req,res,next)=>{
        if(!req.session.user.role){
            return res.json({status:"error", message:"You need to be authenticated"});
        }
        if(!roles.includes(req.session.user.role)){
            return res.json({status:"error", message:"Unauthorized user"});
        }
        next();
    }
}

export const verifyEmailTokenMW = () => {
    return (req, res, next) => {
        try {
            const emailToken = req.query.token;
            const isValidToken = isValidEmailToken(emailToken);

            if (!isValidToken) {
                res.render("recoverPassword",{message : "JWT expired"});
            }

        } catch (error) {
            return res.json({ status: "error", message: "Error processing email token" });
        }
        next();
    }
}

function isValidEmailToken(emailToken) {
    try {
        const info = jwt.verify(emailToken, options.CLIENT_SECRET);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}