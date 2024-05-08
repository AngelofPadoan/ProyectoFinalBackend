import messagesModel from "../models/messages.model.js";
class ChatMongoManager {

    /**
     * Agrega un nuevo mensaje o mensajes a la base de datos.
     * @param {Object|Array} messages - El mensaje o conjunto de mensajes que se agregarán.
     * @returns {Promise<Object>} El mensaje o conjunto de mensajes recién agregado.
     */
    addMessage = async (messages) => {
        return await messagesModel.create(messages);
    };
}

export {ChatMongoManager};