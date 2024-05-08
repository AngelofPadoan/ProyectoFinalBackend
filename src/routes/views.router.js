import { Router } from "express";
import ViewsController from "../controller/views.controller.js";
import {checkRole, verifyEmailTokenMW} from "../middlewares/auth.js";

const router = Router();

router.get('/register', ViewsController.publicAccess, ViewsController.renderRegister);
router.get('/login', ViewsController.publicAccess, ViewsController.renderLogin);
router.get('/', ViewsController.privateAccess, ViewsController.renderHome);
router.get("/resetPassword", verifyEmailTokenMW(), ViewsController.renderResetPassword);
router.get("/recoverPassword", ViewsController.renderRecoverPassword);
router.get('/products', ViewsController.privateAccess, ViewsController.renderProducts);
router.get('/products/:productId', ViewsController.privateAccess, ViewsController.renderProductDetails);
router.get('/carts/:cartId', ViewsController.privateAccess, ViewsController.renderCartDetails);
router.get("/chat", checkRole(["user"]),ViewsController.renderChat);
router.get("/realtimeproducts", checkRole(["admin", "premium"]), ViewsController.renderRealtimeProducts);
router.get("/usersView",checkRole(["admin"]),ViewsController.getUsers)

export default router;