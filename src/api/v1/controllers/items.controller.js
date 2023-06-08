const searchService = require('../services/search.service')
const detailService = require('../services/detail.service')
const Error = require('../models/error.model')

const search = async (req, res) => {
    const response = await searchService.search(req)
    if (response instanceof Error) {
        return res.status(response.status).send(response)
    }
    res.send(response)
}


const item = async (req, res) => {
    const response = await detailService.detail(req)
    if (response instanceof Error) {
        return res.status(response.status).send(response)
    }
    res.send(response)
}

module.exports = {
    search,
    item,
}