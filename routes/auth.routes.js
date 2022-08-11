const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('./../middlewares/jwt.middleware')
const saltRounds = 10
const Cart = require('../models/Cart.model')


//signup
router.post('/signup', (req, res) => {

    const { email, password, username } = req.body
    let user
    User
        .findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: 'El usuario ya existe.' })
                return
            }
            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            User
                .create({ email, password: hashedPassword, username })

                .then(newUser => {
                    user = newUser
                    return Cart.create({ user: newUser._id })
                })
                .then(newCartUser => res.status(200).json({ newCartUser, user }))
                .catch(err => res.status(500).json({ errorMessage: err.message }))
        })
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//login
router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (email === '' || password === '') {
        res.status(400).json({ message: 'Indique email y contraseña' })
        return
    }

    User
        .findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(401).json({ message: "Usuario no encontrado." })
                return;
            }

            if (bcrypt.compareSync(password, foundUser.password)) {

                const { _id, email, username, role } = foundUser
                const payload = { _id, email, username, role }
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                )
                res.status(200).json({ authToken: authToken })
            }
            else {
                res.status(200).json({ message: 'No se ha podido autentificar el usuario' })
            }

        })
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//verify
router.get('/verify', isAuthenticated, (req, res) => {

    res.status(200).json(req.payload)

})

module.exports = router