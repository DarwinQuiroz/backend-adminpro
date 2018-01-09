const express = require('express')
const bcrypt = require('bcryptjs')
const mdAuth = require('../middlewares/auth')

const Usuario = require('../models/usuario')
const app = express()

// Listar usuario
app.get('/', (req, res) => {
    Usuario.find({}, 'nombre correo imagen rol').exec(
        (err, usuarios) => {
            if(err)
            {
                return res.status(500).json({ 
                    ok: false, 
                    mensaje: 'Error al cargar los Usuarios...',
                    errors: err
                 })            
            }
            res.status(200).json({ ok: true, usuarios })
        }
    )
})

// Crear usuario
app.post('/', mdAuth.verificaToken,(req, res) => {
    const body = req.body
    const usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        clave: bcrypt.hashSync(body.clave, 10),
        imagen: body.imagen,
        rol: body.rol
    })

    usuario.save((err, usuarioBD) => {
        if(err)
        {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Error al crear el Usuario...',
                errors: err
            })            
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioBD
        })
    })    
})

// Actualizar usuario
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    const id = req.params.id
    const body = req.body

    Usuario.findById(id, (err, usuario) => {
        if(err)
        {
            return res.status(500).json({ 
                ok: false, 
                mensaje: 'Error al buscar el Usuario...',
                errors: err
            })      
        }
        if(!usuario)
        {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'El usuario con id: ' + id + ' no existe.',
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }
        usuario.nombre = body.nombre
        usuario.correo = body.correo
        usuario.rol = body.rol
        usuario.save((err, usuarioBD) => {
            if(err)
            {
                return res.status(400).json({ 
                    ok: false, 
                    mensaje: 'Error al actualizar el Usuario...',
                    errors: err
                })            
            }
            usuarioBD.clave = undefined
            res.status(200).json({
                ok: true,
                usuario: usuarioBD
            })
        })
    })
})

// Eliminar usuario
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    const id = req.params.id

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if(err)
        {
            return res.status(500).json({ 
                ok: false, 
                mensaje: 'Error al tratar de eliminar el Usuario...',
                errors: err
            })            
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        })
    })
});

module.exports = app