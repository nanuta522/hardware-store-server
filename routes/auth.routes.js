const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('./../middlewares/jwt.middleware')
const saltRounds = 10


//SIGNUP
router.post('/signup', (req, res, next) => {

    const { email, password, username } = req.body

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
                .then((createdUser) => {

                    const { email, username, _id, role } = createdUser
                    const user = { email, username, _id, role }

                    res.status(201).json({ user })

                })
                .catch(err => res.status(500).json({ errorMessage: err.message }))
        })
        .catch(err => res.status(500).json({ errorMessage: err.message }))
})

//LOGIN
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




module.exports = router