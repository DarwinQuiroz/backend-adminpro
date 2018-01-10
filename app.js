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
const hospitalRoutes = require('./routes/hospital')
const medicoRoutes = require('./routes/medico')
const busquedaRoutes = require('./routes/busqueda')
const uploadRoutes = require('./routes/upload')
const imagenesRoutes = require('./routes/imagenes')

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err
    console.log('Base de datos online...')
})

// Server index config
// var serveIndex = require('serve-index')
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'))

// Rutas
app.use('/', appRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/login', loginRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/medico', medicoRoutes)
app.use('/buscar', busquedaRoutes)
app.use('/uploads', uploadRoutes)
app.use('/img', imagenesRoutes)

app.listen(3000, () => {
    console.log('Express server...')
})