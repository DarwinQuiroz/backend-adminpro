const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const HospitalSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    nombre: {
        type: String, required: 'El nombre son requerido.', unique: true
    },
    imagen: {
        type: String, defult: null
    }
}, {collection: 'hospitales'})

HospitalSchema.plugin(uniqueValidator, {message: 'El nombre del hospital ya ha sido registrado.'})
module.exports = mongoose.model('Hospital', HospitalSchema)