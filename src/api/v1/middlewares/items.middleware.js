const { author } = require("../constants");

class ItemsMiddleware{
    static sign(req, res, next){
        req.author = author
        next();
    }
}

module.exports = ItemsMiddleware