import fs from "fs";
import path from "path";
import __dirname from "../utils.js";
import { ProductManagerFile } from "./ProductManagerFile.js";

const productsManagerFile = new ProductManagerFile( "products.json");
class CartManagerFile {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    /**
     * Recupera una lista de carros del archivo.
     * @returns {Promise<Array>} Una promesa que se resuelve en una serie de carros.
     */
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error: ', error);
            return [];
        }
    };

    /**
     * Agrega un nuevo carrito al archivo.
     * @param {Array} [product] - Array de productos para añadir al carrito.
     * @returns {Promise<Array>} Una promesa que se resuelve en un array actualizado de carritos.
     */
    addCart = async (product) => {
        try {
            const carts = await this.getCarts();
            let generatedId;

            if (carts.length === 0) {
                generatedId = 1;
            } else {
                generatedId = carts[carts.length - 1].id + 1;
            }

            const newCart = {
                id: generatedId,
                products: product || []
            };

            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return carts;
        } catch (error) {
            console.error('Error: ', error);
            return [];
        }
    };

    /**
     * Recupera un carrito por su ID.
     * @param {number} id - El ID del carrito.
     * @returns {Promise<Object|string>} Una promesa que se resuelve en el carrito encontrado o "No encontrado".
     */
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((p) => p.id === id);

            if (cart) {
                return cart;
            } else {
                return "Not found";
            }
        } catch (error) {
            console.error('Error: ', error);
            return "Not found";
        }
    }

    /**
     * Agrega un producto a un carrito.
     * @param {number} cartId - El ID del carrito.
     * @param {number} productId - El ID del producto a agregar.
     * @param {number} quantity - La cantidad del producto a agregar.
     * @returns {Promise<boolean>} Una promesa que se resuelve como verdadera si el producto se agrega correctamente; de lo contrario, es falsa.
     */
    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                return false;
            }

            const existingProductIndex = carts[cartIndex].products.findIndex(product => product.id === productId);

            if (existingProductIndex === -1) {
                // Añadir nuevo producto al carrito
                const product = await productsManagerFile.getProductById(productId);

                if (product === "Not found") {
                    return false; // Producto no encontrado
                }

                carts[cartIndex].products.push({ id: productId, quantity: quantity });
            } else {
                // Aumentar la cantidad de producto existente.
                if(carts[cartIndex].products[existingProductIndex].quantity){
                    carts[cartIndex].products[existingProductIndex].quantity += quantity;
                }else{
                    carts[cartIndex].products[existingProductIndex].quantity = quantity;
                }

            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return true;
        } catch (error) {
            console.error('Error: ', error);
            return false;
        }
    }
}

export { CartManagerFile };