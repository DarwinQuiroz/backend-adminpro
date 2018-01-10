const express = require('express')
const app = express()
const fs = require('fs')

app.get('/:tipo/:imagen', (req, res) => {
    const tipo = req.params.tipo
    const imagen = req.params.imagen

    let path = `./uploads/${ tipo }/${ imagen }`
    fs.exists(path, existe => {
        if (!existe) path = './assets/no-img.jpg'

        res.sendfile(path)
    })
})

module.exports = app