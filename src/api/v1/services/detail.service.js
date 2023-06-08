const detailHandler = require('../handlers/detail.handler');
const Error = require('../models/error.model');

const detail = async (req)  => {
    const id = req?.params?.id;


    if (id == undefined) return new Error(400, 'Bad Request'); 

    const result = await detailHandler.detail(id)

    if (result instanceof Error) return result;


    const author = req.author;
    const item = result.item;
    const condition = result.condition;
    const free_shipping = result.free_shipping;
    const sold_quantity = result.sold_quantity;
    const description = result.description;
    const path_from_root = result.path_from_root;

    const response = {
        author: author,
        item: item,
        condition: condition,
        free_shipping: free_shipping,
        sold_quantity: sold_quantity,
        description: description,
        path_from_root: path_from_root,    
    }
    return response;
}

module.exports = {
    detail,
}
