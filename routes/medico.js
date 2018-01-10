const express = require('express')
const mdAuth = require('../middlewares/auth')

const Medico = require('../models/medico')
const app = express()

// Cargar listado de medicos
app.get('/', (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)

    Medico.find({}).populate('usuario', 'nombre correo').skip(desde).limit(5)
        .populate('hospital').exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los Medicos...',
                    errors: err
                })
            }
            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    paginas: Math.ceil(conteo / 5),
                    medicos
                })
            })
        })
})

// Mostrar un medico
app.get('/:id', (req, res) => {
    Medico.findOne({ '_id': req.params.id }).populate('usuario', 'nombre correo')
        .populate('hospital').exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar el Medico...',
                    errors: err
                })
            }
            res.status(200).json({ ok: true, medico })
        })
})

// Guardar un medico
app.post('/', mdAuth.verificaToken, (req, res) => {
    const body = req.body

    const medico = new Medico({
        usuario: req.usuario._id,
        hospital: body.hospital,
        nombre: body.nombre
    })

    medico.save((err, medicoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar el Medico...',
                errors: err
            })
        }
        res.status(200).json({ ok: true, medico: medicoBD })
    })
})

// Actualzar un medico
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    const body = req.body
    Medico.findByIdAndUpdate(req.params.id, body, { new: true }, (err, medicoActualizado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar el Medico...',
                errors: err
            })
        }
        res.status(200).json({ ok: true, medico: medicoActualizado })
    })
})

// eliminar medico
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    Medico.findOne({ '_id': req.params.id }, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el Medico...',
                errors: err
            })
        }
        if (medico.usuario != req.usuario._id) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No tienes permiso para eliminar este medico',
                errors: err
            })
        }
        medico.remove((err, medicoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al eliminar el Medico...',
                    errors: err
                })
            }
            res.status(200).json({ ok: true, medico: medicoEliminado })
        })
    })
})

module.exports = app