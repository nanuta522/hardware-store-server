const router = require('express').Router()
const { isAuthenticated } = require('../middlewares/jwt.middleware')
const Cart = require('../models/Cart.model')
const User = require('../models/User.model')

//render cart
router.get('/', isAuthenticated, (req, res) => {

    const { _id: user_id } = req.payload

    Cart
        .findOne({ user_id })
        .populate('items')
        .then(cart => res.status(200).json(cart.items))
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

module.exports = router

//add product to cart
/* router.put('/:product_id/add-item', isAuthenticated, (req, res) => {

    const { product_id } = req.params
    const { _id: user_id } = req.payload

    let productIndex

    Cart
        .findOne({ user_id })
        .then(({ items }) => {
            const alreadyIn = items.some((item, index) => {
                if (item.product.equals(product_id)) {
                    productIndex = index
                    return true
                }
            })
            if (!alreadyIn) {
                return Cart
                    .findOneAndUpdate({ user_id }, { $push: { items: { product: product_id, quantity: 1 } } }, { new: true })
            }
            else {
                const newQuantity = items[productIndex].quantity + 1
                const editQuery = { $set: { [`items.${productIndex}`]: { quantity: newQuantity } } }
                return Cart
                    .findOneAndUpdate({ user_id }, editQuery, { new: true })
            }
        })
        .then(() => {
            res.json('yey')
        })
        .catch(err => res.status(500).json({ errorMessage: err.message }))
}) */

//test add item
router.put('/:product_id/add-item', isAuthenticated, (req, res) => {

    const { product_id } = req.params
    const { _id: user_id } = req.payload

    Cart
        .findOne({ user_id })
        .then(({ items }) => {
            const alreadyIn = items.some(item => {
                if (item.product.equals(product_id)) {
                    return true
                }
            })
            if (!alreadyIn) {
                return Cart
                    .findOneAndUpdate({ user_id }, { $push: { items: { product: product_id, quantity: 1 } } }, { new: true })
            }
            else {
                return Cart
                    .findOneAndUpdate({ user_id, 'items.product': product_id }, { $inc: { 'items.$.quantity': 1 } }, { new: true })
            }
        })
        .then(cart => res.json(cart))
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//delete one item
router.put('/:product_id/remove-item', isAuthenticated, (req, res) => {

    const { product_id } = req.params
    const { _id: user_id } = req.payload

    Cart
        // .findOneAndUpdate({ user_id, 'items.product': product_id }, { $subtract: [{ $cond: [{ $gt: ['items.$.quantity', 1] }, 1, 6/* { $pull: { user_id, 'items.product': product_id } }, { new: true } */] }] }, { new: true })
        .findOneAndUpdate({ user_id, 'items.product': product_id }, { $inc: { 'items.$.quantity': { $cond: { if: { $gt: ['items.$.quantity', 1] }, then: { 'items.$.quantity': -1 }, else: 6 } } } }, { new: true })
        .then(cart => res.json(cart))
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})


