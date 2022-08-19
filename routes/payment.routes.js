const router = require('express').Router()
const { isAuthenticated } = require('../middlewares/jwt.middleware')
const Cart = require('../models/Cart.model')
const Product = require('../models/Product.model')

//payment process
router.put('/', isAuthenticated, (req, res) => {

    const { _id: user_id } = req.payload

    Cart
        .findOne({ user_id })
        .populate({
            path: 'items',
            populate: {
                path: 'product'
            }
        })
        .then(({ items }) => {

            const purchasePromises = []

            items.forEach(item => {

                const product_id = item.product._id

                purchasePromises.push(
                    Product
                        .findByIdAndUpdate(product_id, { $inc: { inStock: - item.quantity } }, { new: true }),
                )
            })
            purchasePromises.push(
                Cart
                    .findOneAndUpdate({ user_id }, { items: [] }, { new: true })
            )

            Promise
                .all(purchasePromises)
                .then(response => res.status(200).json({ items, response }))
        })
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

module.exports = router
