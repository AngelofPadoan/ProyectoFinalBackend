import userModel from "../dao/models/users.model.js";
import {createHash, generateEmailToken, validatePassword} from "../utils.js";
import {options} from "../config/config.js";
import {userService} from "../repository/index.repository.js";
import {sendPasswordRecovery} from "../config/gmail.js";

class SessionsController {
    static async register(req, res) {
        res.send({status: "success", message: "Usuario registrado"});
    }

    static async failRegister(req, res) {
        req.logger.error('Registration failure');
        res.send({error: 'Registration failure'});
    }

    static async login(req, res) {
        if (!req.user) {
            return res.status(400).send({status: "error"});
        }

        const isValidPassword = validatePassword(req.body.password, req.user);

        if (!isValidPassword) {
            return res.status(400).send({
                status: "error",
                error: "Datos incorrectos"
            });
        }

        let role = req.user.role;

        if (req.user.email === options.ADMIN_EMAIL) {
            role = "admin";
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: role,
            _id: req.user._id,
            last_connection: new Date().toLocaleString()
        };

        await userModel.updateOne({ _id: req.user._id }, { last_connection: new Date() });

        res.send({status: "success", payload: req.user});
    }

    static async failLogin(req, res) {
        res.status(301).send({error: "Fail login"});
    }

    static async githubCallback(req, res) {
    }

    static async githubCallbackRedirect(req, res) {
        req.session.user = req.user;
        res.redirect("/products");
    }

    static async current(req, res) {
        if (req.isAuthenticated()) {
            try {
                const userInfoDto = await userService.get(req.user);

                res.send({status: "success", user: userInfoDto});
            } catch (error) {
                req.logger.error("Could not get user data");
                res.status(500).send({status: "error", message: "Error interno en el servidor"});
            }
        } else {
            res.status(401).send({status: "error", message: "Usuario no autenticado"});
        }
    }


    static async logout(req, res) {
        await userModel.updateOne({ _id: req.user._id }, { last_connection: new Date() });

        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    error: 'Error al ingresar'
                });
            }
            res.redirect('/login');
        });
    }

    static async resetPassword(req, res) {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).send({
            status: "error",
            message: "Dato incorrecto"
        });

        const user = await userModel.findOne({email});
        if (!user) return res.status(400).send({
            status: "error",
            message: "Usuario inexistente"
        });

        const samePassword = await validatePassword(password, user);

        if (samePassword) {
            return res.status(400).send({
                status: "error",
                payload: "Ingrese una contraseña que no haya sido utilizada anteriormente"
            });
        }

        const newHashPassword = await createHash(password);

        user.password = newHashPassword;

        await userModel.updateOne({_id: user._id}, {$set: {password: newHashPassword}});
        res.send({
            status: "success",
            message: "Contraseña modificada"
        });
    }

    static recoverPassword = async (req, res) => {
        try {
            const {email} = req.body;
            const tokenEmail = generateEmailToken(email, 3600);
            const respond = await sendPasswordRecovery(email, tokenEmail);

            if (!respond) {
                return res.status(400).send({
                    status: "error",
                    payload: "Could not send email to reset password"
                })
            }

            res.send({
                status: "success",
                payload: "Email sent successfully"
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "User already register"
            })
        }
    }
}
export default SessionsController;