import {generateProduct} from "../utils.js";
class MockingController{
    static getMockingProducts = async (req,res)=>{

        const amount = parseInt(req.query.amount) || 100;
        const result = [];

        for (let i = 0; i < amount; i++) {
            const newProduct = generateProduct();

            result.push(newProduct);
        }

        res.send({
            status : "success",
            payload : result
        })
    }
}

export {MockingController};