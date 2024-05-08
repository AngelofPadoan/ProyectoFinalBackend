import fs from "fs";
import path from "path";
import __dirname from "../../utils.js";

class ProductManagerFile {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    /**
     * Recupera una lista de productos del archivo.
     * @returns {Promise<Array>} Una promesa que se refiere a una variedad de productos.
     */
    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    };

    /**
     * Agrega un nuevo producto al archivo.
     * @param {Object} product - El producto a agregar.
     * @returns {Promise<Array>} Una promesa que se traduce en una gama actualizada de productos.
     */
    addProduct = async (product) => {
        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        product.status = product.status ?? true;

        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products;
    };

    /**
     * Recupera un producto por su ID.
     * @param {number} id - El ID del producto.
     * @returns {Promise<Object|string>} Una promesa que resuelve al producto encontrado o "No encontrado".
     */
    async getProductById(id) {

        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);

        if (product) {
            return product;
        } else {
            return "Not found";
        }
    }

    /**
     * Actualiza un producto por su ID.
     * @param {number} id - El ID del producto a actualizar.
     * @param {Object} updatedProduct - Los datos del producto actualizados.
     * @returns {Promise<Object|undefined>} Una promesa que se resuelve en el producto actualizado o indefinido si no se encuentra.
     */
    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index !== -1) {
            updatedProduct.id = id;
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return updatedProduct;
        } else {
            return undefined;
        }
    }

    /**
     * Elimina un producto por su ID.
     * @param {number} id - El ID del producto a eliminar.
     * @returns {Promise<string>} Una promesa que se resuelve en un mensaje de éxito o error.
     */
    async deleteProduct(id) {
        const products = await this.getProducts();

        const updatedProducts = products.filter((p) => p.id !== id);

        if (products.length !== updatedProducts.length) {
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
            return updatedProducts;
        } else {
            return "Not found";
        }
    }
}

export {ProductManagerFile};