'use strict'

const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err
    console.log('Base de datos online...')
})

app.get('/', (req, res) => {
    res.status(200).json({ok: true, mensaje: 'Petición realizada...'})
})

app.listen(3000, () => {
    console.log('Express server...')
})