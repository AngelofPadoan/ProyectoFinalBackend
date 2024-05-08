export class CartsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts(){
        return await this.dao.getCarts();
    }

    async createCart(){
        return await this.dao.createCart();
    }

    async getCartById(id){
        return await this.dao.getCartById(id);
    }

    async addProductToCart(cartId, productId, quantity){
        return await this.dao.addProductToCart(cartId, productId, quantity);
    }

    async updateCart(cartId, products){
        return await this.dao.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity){
        return await this.dao.updateProductQuantity(cartId, productId, quantity);
    }

    async removeAllProductsFromCart(cartId){
        return await this.dao.removeAllProductsFromCart(cartId);
    }

    async removeProductFromCart(cartId, productId){
        return await this.dao.removeProductFromCart(cartId, productId);
    }
}