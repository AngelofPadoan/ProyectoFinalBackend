import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

class CartManagerMongo {

    /**
     * Recupera todos los carros de la base de datos.
     * @returns {Promise<Array>} Conjunto de carros.
     */
    getCarts = async () => {
        return await cartsModel.find();
    };

    /**
     * Crea un nuevo carrito en la base de datos.
     * @param {Object} body - Los detalles del carrito que se crearán.
     * @returns {Promise<Object>} El carrito recién creado.
     */
    createCart = async body => {
        const payload = { "products": [body]}
        return await cartsModel.create(payload);
    };

    /**
     * Recupera un carrito por su ID.
     * @param {string} id - El ID del carrito.
     * @returns {Promise<Array>} Array que contiene el carrito.
     */
    async getCartById(id) {
        return await cartsModel.find({_id: id});
    }

    /**
     * Recupera un carrito por su ID en formato JSON.
     * @param {string} id - El ID del carrito.
     * @returns {Promise<Object>} El carrito en formato JSON.
     */
    async getCartByIdJson(id) {
        return await cartsModel.find({_id: id}).lean();
    }

    /**
     * Agrega un producto a un carrito con la cantidad especificada.
     * @param {string} cartId - El ID del carrito.
     * @param {string} productId - El ID del producto que se agregará.
     * @param {number} quantity - La cantidad del producto a agregar.
     * @returns {Promise<Object>} El carrito actualizado.
     */
    async addProductToCart(cartId, productId, quantity) {
        const cart = await cartsModel.findOne({_id:cartId});
        if (!cart){
            return {
                status: "error",
                msg: `El carrito con el id ${cartId} no existe`
            }
        }
        const product = await productsModel.findOne({_id:productId});
        if (!product){
            return {
                status: "error",
                msg: `El producto con el id ${productId} no existe`
            }
        }

        let productsToCart = cart.products;

        const indexProduct = productsToCart.findIndex((product)=> product._id.toString() === productId )

        if(indexProduct === -1){
            const newProduct = {
                product: productId,
                quantity: quantity
            }
            cart.products.push(newProduct);
        }else{
            cart.products[indexProduct].quantity += quantity;
        }

        await cart.save();

        return cart;
    }

    /**
     * Elimina un producto del carrito.
     * @param {string} cartId - El ID del carrito.
     * @param {string} productId - El ID del producto que se va a eliminar.
     * @returns {Promise<Object|null>} El carrito actualizado o nulo si el carrito no existe.
     */
    async removeProductFromCart(cartId, productId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = cart.products.filter((product) => product.product.toString() !== productId);

        await cart.save();

        return cart;
    }

    /**
     * Actualiza los productos de un carrito con detalles de nuevos productos.
     * @param {string} cartId - El ID del carrito a actualizar.
     * @param {Array} products - La nueva gama de productos para sustituir a los existentes.
     * @returns {Promise<Object|null>} El carrito actualizado o nulo si el carrito no existe.
     */
    async updateCart(cartId, products) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = products;
        await cart.save();

        return cart;
    }

    /**
     * Actualiza la cantidad de un producto específico en un carrito.
     * @param {string} cartId - El ID del carrito que contiene el producto.
     * @param {string} productId - El ID del producto que se va a actualizar.
     * @param {number} quantity - La nueva cantidad del producto.
     * @returns {Promise<Object|null>} El carrito actualizado o nulo si el carrito o producto no existe.
     */
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        const productIndex = cart.products.findIndex((product) => product.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
        }

        return cart;
    }

    /**
     * Elimina todos los productos de un carrito, dejándolo vacío.
     * @param {string} cartId - El ID del carrito a actualizar.
     * @returns {Promise<Object|null>} El carrito actualizado o nulo si el carrito no existe.
     */
    async removeAllProductsFromCart(cartId) {
        const cart = await cartsModel.findById(cartId);

        if (!cart) {
            return null;
        }

        cart.products = [];
        await cart.save();

        return cart;
    }
}

export {CartManagerMongo};