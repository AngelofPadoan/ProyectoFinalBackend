import {cartService, productService, ticketService} from "../repository/index.repository.js";
import {emailSenderPurchase} from "../utils.js";
import {CustomError} from "../services/customError.services.js";
import ticketErrorOptions from "../services/ticketError.js";
import {ERRORS} from "../enums/error.js";
import {generateSendEmailError} from "../services/emailSenderError.js";

class CartController {
    static async getCarts(req, res) {
        try {
            const carts = await cartService.getCarts();
            res.send({
                status: "success",
                carts: carts
            });
        } catch (error) {
            req.logger.error("Error getting all carts");
            res.status(500).send({
                status: 'error',
                msg: 'error interno en el servidor',
            });
        }
    }

    static async getCartById(req, res) {
        try {
            const cid = req.params.cid;
            const carts = await cartService.getCartById(cid);

            if (carts !== "Not found") {
                res.send({
                    status: "success",
                    product: carts
                });
            } else {
                res.status(404).send({
                    status: "error",
                    msg: "Cart not found"
                });
            }
        } catch (error) {
            req.logger.error("Could not get the cart by its ID");
            res.status(500).send({
                status: 'error',
                msg: 'error interno en el servidor',
            });
        }
    }

    static async createCart(req, res) {
        try {
            const cart = await cartService.createCart(req.body);

            res.status(201).send({
                status: 'success',
                msg: 'Carrito creado',
                cart,
            });
        } catch (error) {
            req.logger.error("Could not create a new cart");
            res.status(500).send({
                status: 'error',
                msg: 'error interno en el servidor',
            });
        }
    }
    static async addProductToCart(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;

            const quantity = req.body.quantity;

            const product = await productService.getProductById(pid);

            if (product === undefined || product.length === 0) {
                // la matriz no existe o está vacía
                return res.status(400).send({
                    status: 'error',
                    msg: "Product does not exist",
                });
            }

            if (product[0].owner === req.user.email){
                return res.status(400).send({
                    status: 'error',
                    msg: "No es posible añadir ese producto",
                });
            }

            const productToCart = await cartService.addProductToCart(cid, pid, quantity);

            const carts = await cartService.getCartById(cid);

            if (productToCart) {
                res.status(201).send({
                    status: "success",
                    msg: 'El producto a sido añadido correctamente',
                    carts
                });
            } else {
                res.status(401).send({
                    status: "error",
                    msg: 'Error al añadir el producto'
                });
            }
        } catch (error) {
            req.logger.error(error);
            res.status(500).send({
                status: 'error',
                msg: 'error interno en el servidor',
            });
        }
    }

    static async removeProductFromCart(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;

            const cart = await cartService.removeProductFromCart(cid, pid);

            if (cart) {
                res.send({
                    status: "success",
                    msg: 'Producto removido del carrito exitosamente',
                    cart
                });
            } else {
                res.status(404).send({
                    status: "error",
                    msg: 'Producto o carrito no encontrado'
                });
            }
        } catch (error) {
            req.logger.error("Error when removing a product from the cart");
            res.status(500).send({
                status: 'error',
                msg: 'error interno en el servidor',
            });
        }
    }

    static async updateCart(req, res) {
        try {
            const cid = req.params.cid;
            const updatedCart = await cartService.updateCart(cid, req.body.products);

            res.send({
                status: "success",
                msg: 'Carrito cargado correctamente',
                cart: updatedCart
            });
        } catch (error) {
            req.logger.error("Error updating cart");
            res.status(500).send({
                status: 'error',
                msg: 'error interno en el servidor',
            });
        }
    }

    static async updateProductQuantity(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.body.quantity;

            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);

            if (updatedCart) {
                res.send({
                    status: "success",
                    msg: 'Cantidad de productos cargados correctamente al carrito',
                    cart: updatedCart
                });
            } else {
                res.status(404).send({
                    status: "error",
                    msg: 'Producto o carrito no encontrado'
                });
            }
        } catch (error) {
            req.logger.error("Error updating product quantity");
            res.status(500).send({
                status: 'error',
                msg: 'Error interno en el servidor',
            });
        }
    }

    static purchase = async (req, res) => {
        try {
            const cartId = req.params.cid;

            const result = await ticketService.createTicket(cartId);

            if (!result) {
                CustomError.createError({
                    name: " The ticket could not be created",
                    cause: ticketErrorOptions.generateCreateTicketError(),
                    message: "The purchase was not successful",
                    errorCode: ERRORS.TICKET_ERROR
                })
            }

            const respond = await emailSenderPurchase(req.session.user.email);

            if (!respond) {
                CustomError.createError({
                    name: "Error sending email",
                    cause: generateSendEmailError(req.session.user.email),
                    message: "La compra se realizó exitosamente, pero no se pudo enviar el correo electrónico.",
                    errorCode: ERRORS.EMAIL_SENDER_ERROR
                })
            }

            const carts = await cartService.getCartById(cartId);

            for (const product of carts[0].products) {

                for (const m of result.notStock) {

                    if (product.product._id.toString() !== m.id){
                        await cartService.removeProductFromCart(cartId, product.product._id);
                    }

                }
            }

            res.send({
                status: "success",
                payload: result
            })

        } catch (error) {
            req.logger.error(error.message);
        }
    }

    static async removeAllProductsFromCart(req, res) {
        try {
            const cid = req.params.cid;

            const cart = await cartService.removeAllProductsFromCart(cid);

            if (cart) {
                res.send({
                    status: "success",
                    msg: 'Todos los productos han sido eliminados del carrito',
                    cart
                });
            } else {
                res.status(404).send({
                    status: "error",
                    msg: 'Carrito no encontrado'
                });
            }
        } catch (error) {
            req.logger.error("Error removing all products from cart");
            res.status(500).send({
                status: 'error',
                msg: 'Error interno en el servidor',
            });
        }
    }
}
export default CartController;