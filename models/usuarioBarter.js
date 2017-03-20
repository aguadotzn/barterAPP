//Esquema de como vamos a guardar a los usuarios
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//El usuario por defecto de barter
var usuarioSchema = Schema({
    name: String,
    surname: String,
    companyName: String
    //id: Integer,
    //data: String
});


//Este esquema actuara como modelo , que representara al esquema creado mas arriba
//Osea si hacemos un nuevo usuario sera con todas las caracteristicas de arriba 

//Exportar
module.exports = mongoose.model('Usuario', usuarioSchema);
