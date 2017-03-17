'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');
var api = express.Router();

//api.get('/prueba/:nombre?', UsuarioController.prueba); //Si lleva ? es obligatorio
api.get('/usuario/:id?', UsuarioController.getUsuario);
api.post('/usuario', UsuarioController.saveUsuario);
api.put('/usuario', UsuarioController.updateUsuario);
api.delete('/usuario', UsuarioController.deleteUsuario);



module.exports = api;
