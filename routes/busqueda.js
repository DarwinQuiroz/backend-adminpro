const express = require('express')
const app = express()

const Hospital = require('../models/hospital')
const Medico = require('../models/medico')
const Usuario = require('../models/usuario')

app.get('/todo/:busqueda', (req, res) => {
    const busqueda = req.params.busqueda
    const regex = new RegExp(busqueda, 'i')

    Promise.all([
        buscarColeccion(Hospital, busqueda, regex),
        buscarColeccion(Medico, busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then((respuestas) => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    })
})

function buscarColeccion(modelo, busqueda, regex) {
    return new Promise((resolve, reject) => {
        modelo.find({ nombre: regex })
            .populate('usuario', 'nombre correo imagen')
            .populate('hospital')
            .exec((err, resultado) => {
                if (err) {
                    reject('Error en la búsqueda, ' + err)
                } else {
                    resolve(resultado)
                }
            })
    })
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre correo imagen')
            .or([{ 'nombre': regex }, { 'correo': regex }]).exec((err, usuarios) => {
                if (err) {
                    reject('Error en la búsqueda de usuarios, ' + err)
                } else {
                    resolve(usuarios)
                }
            })
    })
}


module.exports = app