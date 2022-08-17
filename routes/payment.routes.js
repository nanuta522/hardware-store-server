const router = require('express').Router()
const { isAuthenticated } = require('../middlewares/jwt.middleware')
const Cart = require('../models/Cart.model')
const Product = require('../models/Product.model')

//payment process

module.exports = router