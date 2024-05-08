import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import {createHash, validatePassword} from "../utils.js";
import userModel from "../dao/models/users.model.js";
import cartsModel from "../dao/models/carts.model.js";
import {options} from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {

                let user = await userModel.findOne({email: username});
                if (user) {
                    req.logger.warning('El usuario ha sido registrado');
                    return done(null, false);
                }

                const newCart = new cartsModel({ products: [] });
                await newCart.save();

                req.logger.info('Nuevo Carrito:', newCart);

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    cart: newCart._id,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done(error);
            }

        }));

    passport.use("login", new LocalStrategy(
        {usernameField: "email"},
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username})
                if (!user) {
                    return done(null, false);
                }
                if (!validatePassword(password, user)) {
                    return done(null, false);
                }
                return done(null, user)
            } catch (error) {
                return done(error);
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id).populate("cart");
        done(null, user);
    });


    passport.use('github', new GitHubStrategy({
        clientID: options.CLIENT_ID,
        clientSecret: options.CLIENT_SECRET,
        callbackURL: options.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {

            const first_name = profile._json.login
            let email;
            if (!profile._json.email) {
                email = profile.username;
            }
            let user = await userModel.findOne({email: email});

            if (user) {
                return done(null, user)
            }

            const newCart = new cartsModel({ products: [] });
            await newCart.save();

            const newUser = {
                first_name: first_name,
                last_name: " ",
                email,
                age: 18,
                role: "user",
                cart: newCart._id,
                password: createHash((Math.random() + 1).toString(36).substring(7))
            }
            const result = await userModel.create(newUser);
            return done(null, result);

        } catch (error) {
            console.log(error)
            return done(error)
        }

    }))
}

export default initializePassport;