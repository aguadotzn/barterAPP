'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');
var api = express.Router();

//Rutas de acceso a mi app, muy importante atento a los nombres!!!
//Si lleva ? es obligatorio que se incluya en la ruta, sino es opcional 
api.get('/usuario/:id?', UsuarioController.getUsuario);
api.get('/usuarios', UsuarioController.getUsuarios);
api.post('/usuario', UsuarioController.saveUsuario);
api.put('/usuario/:id', UsuarioController.updateUsuario);
api.delete('/usuario/:id', UsuarioController.deleteUsuario);


//Exportar 
module.exports = api;
