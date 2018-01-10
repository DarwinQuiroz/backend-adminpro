const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const MedicoSchema = new Schema({
    usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    hospital: { type: Schema.ObjectId, ref: 'Hospital' },
    nombre: { 
        type: String, required: 'El nombre es requerido.'
    },
    imagen: {
        type: String, default: null
    }
})

module.exports = mongoose.model('Medico', MedicoSchema)