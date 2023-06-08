const controller = require('../controllers/items.controller')
const middleware = require('../middlewares/items.middleware')
const router = require('express').Router()

router.use(middleware.sign)

router
    .get('/api/items', controller.search)
    .get('/api/items/:id', controller.item)

module.exports = router