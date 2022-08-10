const router = require("express").Router()



router.use('/product', require('./product.routes'))

module.exports = router
