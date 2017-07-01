// Controller: usuarios
// Funciones de control de usuarios
﻿var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');

module.exports.authenticate = function(req, res) {
    userService.authenticate(req.body.email, req.body.password)
        .then(function (user) {
            if (user) {
              // autenticacion correcta
                res.send(user);
            } else {
              // autenticacion fallida
                res.status(401).send('Correo electrónico o contraseña incorrectos.');
                // res.alert("Contacte con soporte en caso de no poder iniciar sesión.");

            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.register = function(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.getAll = function(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.getCurrent =  function(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.update = function(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports._delete = function(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
