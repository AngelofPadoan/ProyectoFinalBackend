import mongoose from 'mongoose'

const collection = "tickets";

const ticketsSchema = new mongoose.Schema({
    code : {
        type : String,
        require : true
    },
    purchase_datetime : {
        type : String,
        require : true
    },
    amount : {
        type : Number,
        require : true,
        default : 0
    },
    purchaser : {
        type : String,
        require : true
    }
})

const ticketsModel = mongoose.model(collection,ticketsSchema);

export default ticketsModel;