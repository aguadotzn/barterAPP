// Schema's for mongoDB
// @author aaguado
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// *******************************************USUARIOS
// El usuario por defecto de barter
var usuarioSchema = Schema({
  name: String,
  surname: String,
  companyName: String
  // id: Integer,
  // data: String
})

// Este esquema anterior actuara como modelo , que representara al esquema creado mas arriba
// Osea si hacemos un nuevo usuario sera con todas las caracteristicas de arriba

// *******************************************INFO CALENDARIOS
var calenarioUsuario = Schema({
})

// Exportar
module.exports = mongoose.model('Usuario', usuarioSchema)
