export class ProductsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts(query, options){
        return await this.dao.getProducts(query, options);
    }

    async getProductById(id){
        return await this.dao.getProductById(id);
    }

    async addProduct(product){
        return await this.dao.addProduct(product);
    }

    async updateProduct(id, updatedProduct){
        return await this.dao.updateProduct(id, updatedProduct);
    }

    async deleteProduct(id){
        return await this.dao.deleteProduct(id);
    }
}