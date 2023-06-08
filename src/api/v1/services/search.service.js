const Error = require('../models/error.model') 
const searchHandler = require('../handlers/search.handler')

const search = async (req) => {
    const query = req.query;
    const q = query.q;

    if (q == undefined) return new Error(400, 'Bad Request'); 

    const result = await searchHandler.search(q)

    if (result instanceof Error) return result;


    const author = req.author;
    const items = result.items;
    const categories = result.categories;
    const path_from_root = result.path_from_root;

    const response = {
        author: author,
        categories: categories,
        items: items,
        path_from_root: path_from_root,    
    }
    return response;
}




module.exports = {
    search,
}