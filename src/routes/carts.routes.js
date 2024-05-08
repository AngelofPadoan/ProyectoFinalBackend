import { Router } from "express";
import CartController from "../controller/carts.controller.js";
import {checkRole} from "../middlewares/auth.js";

const router = Router();

router.get('/', CartController.getCarts);
router.get('/:cid', CartController.getCartById);
router.post('/', CartController.createCart);
router.post('/:cid/product/:pid', checkRole (["user","premium"]), CartController.addProductToCart);
router.post("/:cid/purchase", CartController.purchase);
router.delete('/:cid/products/:pid', CartController.removeProductFromCart);
router.put('/:cid', CartController.updateCart);
router.put('/:cid/products/:pid', CartController.updateProductQuantity);
router.delete('/:cid', CartController.removeAllProductsFromCart);

export { router as cartRouter };