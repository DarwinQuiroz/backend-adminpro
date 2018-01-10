const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const fs = require('fs')

const Hospital = require('../models/hospital')
const Medico = require('../models/medico')
const Usuario = require('../models/usuario')

app.use(fileUpload())

app.put('/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo
    const id = req.params.id

    // Tipos de colecciones
    const tipos_validos = ['hospitales', 'medicos', 'usuarios']
    if (tipos_validos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo de colección no es válido.',
            errors: { message: 'Los tipos de colección válidos son: ' + tipos_validos.join(', ') }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionaste ninguna imagen.',
            errors: { message: 'Debe seleccionar una imagen para subir.' }
        })
    }
    // Obtener nombre y extensión de la imágen
    const archivo = req.files.imagen
    const archivo_split = archivo.name.split('.')
    const ext = archivo_split[archivo_split.length - 1]

    // Validar extensión
    const ext_validas = ['png', 'jpg', 'jgeg', 'gif']
    if (ext_validas.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida.',
            errors: { message: 'Debe seleccionar una imágen con una extensión válida. ' + ext_validas.join(', ') }
        })
    }

    // Crear nombre de archivo personalizado
    const nombreImagen = `${ id }-${new Date().getMilliseconds()}.${ ext }`;
    // Mover imágen
    const path = `./uploads/${ tipo }/${ nombreImagen }`
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover imágen.',
                errors: err
            })
        }
        subirPorTipo(tipo, id, nombreImagen, res)
    })
})


function subirPorTipo(tipo, id, nombreImagen, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe usuario.',
                    errors: { message: 'No existe usuario.' }
                })
            }

            const old_path = `./uploads/${tipo}/${usuario.imagen}`

            if (fs.existsSync(old_path)) fs.unlink(old_path)

            usuario.imagen = nombreImagen
            usuario.save((err, actualizado) => {
                usuario.clave = undefined
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen actualizada.',
                    usuario
                })
            })
        })
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe medico.',
                    errors: { message: 'No existe medico.' }
                })
            }

            const old_path = `./uploads/${tipo}/${medico.imagen}`

            if (fs.existsSync(old_path)) fs.unlink(old_path)

            medico.imagen = nombreImagen
            medico.save((err, actualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen actualizada.',
                    medico
                })
            })
        })
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe hospital.',
                    errors: { message: 'No existe hospital.' }
                })
            }

            const old_path = `./uploads/${tipo}/${hospital.imagen}`

            if (fs.existsSync(old_path)) fs.unlink(old_path)

            hospital.imagen = nombreImagen
            hospital.save((err, actualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen actualizada.',
                    hospital
                })
            })
        })
    }
}
// function capitaliza(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

module.exports = app