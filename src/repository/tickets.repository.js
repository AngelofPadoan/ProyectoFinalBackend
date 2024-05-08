export class TicketsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getTicket(email){
        return await this.dao.getTicket(email);
    }

    async amount(arrayProducts){
        return await this.dao.calculateAmount(arrayProducts);
    }

    async purchesedProducts(cartId,arrayProducts){
        return await this.dao.purchesedProducts(cartId, arrayProducts);
    }

    async createTicket(cartId){
        return await this.dao.createTicket(cartId);
    }
}