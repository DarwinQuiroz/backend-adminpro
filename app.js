'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
const appRoutes = require('./routes/app')
const usuarioRoutes = require('./routes/usuario')
const loginRoutes = require('./routes/login')

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err
    console.log('Base de datos online...')
})

// Rutas
app.use('/', appRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/login', loginRoutes)

app.listen(3000, () => {
    console.log('Express server...')
})