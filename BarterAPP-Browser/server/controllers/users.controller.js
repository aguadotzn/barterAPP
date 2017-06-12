// Controller: usuarios
//Funciones de control de usuarios

﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// rutas
router.post('/authenticate', authenticate)
router.post('/register', register)
router.get('/', getAll)
router.get('/current', getCurrent)
router.put('/:_id', update)
router.delete('/:_id', _delete)

module.exports = router;
