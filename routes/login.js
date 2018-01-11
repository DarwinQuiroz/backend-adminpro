const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const SEED = require('../config/config').SEED
const app = express()

const GoogleAuth = require('google-auth-library')
const auth = new GoogleAuth()

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID
const GOOGLE_SECRET_KEY = require('../config/config').GOOGLE_SECRET_KEY

// Autenticatión vía Google
app.post('/google', (req, res) => {
    const token = req.body.token || 'XXxS'
    let client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, '')
        // const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, '')

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        (e, login) => {
            if (e) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Token inválido.',
                    errors: e.message
                })
            }
            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            Usuario.findOne({ 'correo': payload.email }, (err, usuarioLogin) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario.',
                        errors: err
                    })
                }
                if (usuarioLogin && !usuarioLogin.google) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Debe utilizar su autenticación vía correo y contraseña.'
                    })
                } else if (!usuarioLogin) {
                    const usuario = new Usuario()

                    usuario.nombre = payload.name
                    usuario.correo = payload.email
                    usuario.clave = 'google-password'
                    usuario.imagen = payload.picture
                    usuario.google = true

                    usuario.save((err, usuarioGuardado) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al crear usuario.',
                                errors: err
                            })
                        }
                        // usuarioGuardado.clave = undefined
                        const token = jwt.sign({ 'usuario': usuarioGuardado }, SEED, { expiresIn: 14400 })

                        res.status(200).json({
                            ok: true,
                            usuarioLogin: usuarioGuardado,
                            token
                        })
                    })

                } else {
                    usuarioLogin.clave = undefined
                    const token = jwt.sign({ 'usuario': usuarioLogin }, SEED, { expiresIn: 14400 })

                    res.status(200).json({
                        ok: true,
                        usuarioLogin,
                        token
                    })
                }
            })
        })
})

// Autenticación vía correo y contraseña
app.post('/', (req, res) => {
    const body = req.body

    Usuario.findOne({ 'correo': body.correo }, (err, usuarioLogin) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios...',
                errors: err
            })
        }
        if (!usuarioLogin || !bcrypt.compareSync(body.clave, usuarioLogin.clave)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Login inválido, el correo o la contraseña son incorrectas.',
                errors: err
            })
        }
        usuarioLogin.clave = undefined
        const token = jwt.sign({ usuario: usuarioLogin }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuarioLogin,
            token
        })
    })
})

module.exports = app