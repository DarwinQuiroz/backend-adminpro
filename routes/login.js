const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const SEED = require('../config/config').SEED
const app = express()

app.post('/', (req, res) => {
    const body = req.body

    Usuario.findOne({'correo': body.correo}, (err, usuarioLogin) => {
        if(err)
        {
            return res.status(500).json({ 
                ok: false, 
                mensaje: 'Error al buscar usuarios...',
                errors: err
            })
        }        
        if(!usuarioLogin || !bcrypt.compareSync(body.clave, usuarioLogin.clave))
        {
            return res.status(400).json({ 
                ok: false, 
                mensaje: 'Login inválido, el correo o la contraseña son incorrectas.',
                errors: err
            })
        }
        usuarioLogin.clave = undefined
        const token = jwt.sign({usuario: usuarioLogin}, SEED, {expiresIn: 14400})
        
        res.status(200).json({
            ok: true,
            usuarioLogin,
            token
        })
    })
});

module.exports = app