const express = require('express')
const mdAuth = require('../middlewares/auth')

const Hospital = require('../models/hospital')
const app = express()

// Listado de hospitales
app.get('/', (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)

    Hospital.find({}).populate('usuario', 'nombre correo').skip(desde).limit(5)
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los Hospitales...',
                    errors: err
                })
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    paginas: Math.ceil(conteo / 5),
                    hospitales
                })
            })
        })
})

// Crear listado de hopitales
app.post('/', mdAuth.verificaToken, (req, res) => {
    const body = req.body
    const hospital = new Hospital({
        usuario: req.usuario._id,
        nombre: body.nombre
    })

    hospital.save((err, hospitalBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar el Hospital...',
                errors: err
            })
        }
        res.status(200).json({ ok: true, hospital: hospitalBD })
    })
})

// Mostrar un hospital 
app.get('/:id', mdAuth.verificaToken, (req, res) => {
    Hospital.findOne({ '_id': req.params.id }).populate('usuario', 'nombre correo').exec((err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar el Hospital...',
                errors: err
            })
        }
        res.status(200).json({ ok: true, hospital })
    })
})

// Editar un hospital
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    const body = req.body
    Hospital.findByIdAndUpdate(req.params.id, body, { new: true }, (err, hospitalActualizado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar el Hospital...',
                errors: err
            })
        }
        res.status(200).json({ ok: true, hospital: hospitalActualizado })
    })
})

// Eliminar hospital
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    Hospital.findByIdAndRemove(req.params.id, (err, hospitalEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el Hospital...',
                errors: err
            })
        }
        res.status(200).json({ ok: true, hospital: hospitalEliminado })
    })
})

module.exports = app