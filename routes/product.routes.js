const router = require('express').Router()
const Product = require('../models/Product.model')
const { isAuthenticated } = require('./../middlewares/jwt.middleware')

//create new product
router.post('/create', isAuthenticated, (req, res) => {

    const { name, description, price, images, category } = req.body

    Product
        .create(...req.body)
        .then(product => {
            res.status(200).json(product)
        })
        .catch(err => res.status(500).json({ errorMessage: err.message }))

})

//all products
router.get('/all', (req, res) => {

    Product
        .find()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//get product by id
router.get('/:product_id', (req, res) => {

    const { product_id } = req.params

    Product
        .findById(product_id)
        .then(product => res.status(200).json(product))
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//edit product
router.put('/:product_id/edit', (req, res) => {

    const { product_id } = req.params
    const { name, description, price, images, category } = req.body

    Product
        .findByIdAndUpdate(product_id, { name, description, price, images, category })
        .then(product => res.status(200).json(product))
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//delete car
router.delete('/:product_id/delete', (req, res) => {

    const { product_id } = req.params

    Car
        .findByIdAndDelete(product_id)
        .then(() => res.status(200).json())
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

module.exports = router