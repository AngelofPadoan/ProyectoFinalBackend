import productsModel from "../models/products.model.js";

class ProductManagerMongo {

    /**
     * Recupera una lista paginada de productos basada en filtros y opciones específicos.
     * @param {number} limit - El número máximo de productos por página.
     * @param {number} page - El número de página que se va a recuperar.
     * @param {string} sort - El orden de clasificación de los productos (ya sea "asc" o "desc").
     * @param {string} category - La categoría de productos a filtrar.
     * @param {boolean} availability - Filtrar productos según la disponibilidad (true para los productos disponibles).
     * @param {string} query - La consulta de búsqueda para filtrar productos por título.
     * @returns {Promise<Object>} Un objeto que contiene la lista paginada de productos y enlaces de paginación.
     */
    getProducts = async (limit, page, sort, category, availability, query) => {

        if (page && (isNaN(page) || page <= 0)) {
            return {
                status: "error",
                msg: "Page not found"
            };
        }

        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (availability) {
            filter.stock = { $gt: 0 };
        }

        if (query) {
            filter.$or = [
                { title: { $regex: new RegExp(query, 'i') } },
            ];
        }

        const options = {
            limit: limit ?? 10,
            page: page ?? 1,
            sort: { price: sort === "asc" ? 1 : -1},
            lean: true
        }

        const products = await productsModel.paginate(filter, options);

        const queryParams = {
            limit,
            page: products.hasPrevPage && products.prevPage,
            sort,
            category,
            availability,
            query
        };

        // Eliminar propiedades indefinidas del enlace.
        Object.keys(queryParams).forEach(key => queryParams[key] === undefined && delete queryParams[key]);

        const baseLink = '/products';

        let prevLink = null
        let nextLink = null
        if (products.hasPrevPage) {
            prevLink = `${baseLink}?${new URLSearchParams(queryParams).toString()}`;
        }

        if (products.hasNextPage) {
            queryParams.page = products.nextPage;
            nextLink = `${baseLink}?${new URLSearchParams(queryParams).toString()}`;
        }

        products.prevLink = prevLink
        products.nextLink = nextLink
        return {
            status: "success",
            msg: products
        }
    };

    /**
     * Recupera todos los productos de la base de datos.
     * @returns {Promise<Array>} Una promesa que se resuelve en una gama de productos.
     */
    getProductsByHome = async () => {
        return await productsModel.find().lean();
    };


    /**
     * Agrega un nuevo producto a la base de datos.
     * @param {Object} product - El producto a agregar.
     * @returns {Promise<Object>} Una promesa que se refiere al producto creado.
     */
    addProduct = async (product) => {
        product.status = product.status ?? true;

        return await productsModel.create(product);
    };

    /**
     * Recupera un producto por su ID de la base de datos.
     * @param {string} id - El ID del producto que se va a recuperar.
     * @returns {Promise<Array>} Matriz que contiene el producto que coincide con el ID especificado.
     */
    async getProductById(id) {
        return await productsModel.find({_id: id});
    }

    /**
     * Actualiza un producto con nueva información.
     * @param {string} id - El ID del producto a actualizar.
     * @param {Object} updatedProduct - La información actualizada del producto.
     * @returns {Promise<Object>} Una promesa que se resuelve en el producto actualizado.
     */
    async updateProduct(id, updatedProduct) {
        return await productsModel.updateOne({_id: id}, {$set: updatedProduct});
    }

    /**
     * Elimina un producto de la base de datos.
     * @param {string} id - El ID del producto a eliminar.
     * @returns {Promise<string>} Una promesa que se traduce en un mensaje de éxito.
     */
    async deleteProduct(id) {
        await productsModel.deleteOne({_id:id});
        return "success";
    }

    async isInStock(amount, id){
        const product = await this.getProductById(id);

        return parseInt(amount) <= product[0].stock;
    }
}

export {ProductManagerMongo};