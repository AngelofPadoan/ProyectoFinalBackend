import { Router } from "express";
import passport from "passport";
import SessionsController from "../controller/sessions.controller.js";

const router = Router();

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), SessionsController.register);
router.get("/failregister", SessionsController.failRegister);
router.post("/login", passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }), SessionsController.login);
router.get("/faillogin", SessionsController.failLogin);
router.get("/github", passport.authenticate("github", { scope: ['user:email'] }), SessionsController.githubCallback);
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), SessionsController.githubCallbackRedirect);
router.get("/current", SessionsController.current);
router.get('/logout', SessionsController.logout);
router.post("/resetPassword", SessionsController.resetPassword);
router.post("/recoverPassword", SessionsController.recoverPassword);


export default router;