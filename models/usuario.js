const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: 'El nombre es requerido.'
    },
    correo: {
        type: String,
        unique: true,
        required: 'El correo es requerido.'
    },
    clave: {
        type: String,
        required: 'La contraseña es requerida.'
    },
    imagen: {
        type: String,
        default: null
    },
    rol: {
        type: String,
        default: 'USER_ROL',
        enum: { values: ['USER_ADMIN', 'USER_ROL'], message: "El rol no es válido." }
    },
    google: {
        type: Boolean,
        default: false
    }
})

UsuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya está en uso, por favor elige otro.' })
module.exports = mongoose.model('Usuario', UsuarioSchema)