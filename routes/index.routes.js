const router = require("express").Router()

router.use('/product', require('./product.routes'))
router.use("/user", require('./user.routes'))
router.use("/auth", require('./auth.routes'))
router.use("/cart", require('./cart.routes'))
router.use("/payment", require('./payment.routes'))

module.exports = router
