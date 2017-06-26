// Controller: intercambio
// Funciones de control de cambio de turno
var express = require('express');
var router = express.Router();
var interchangeService = require('../services/interchange.service');
module.exports.accept_shift = function (req, res) {
    // console.log("-----Cambio aceptado (interchange controller)-----");
    // console.log(JSON.stringify(req.body));
    interchangeService.accept_shift(req.body)
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        console.log("error : " + err);
        res.status(400).send(err);
    });
};
module.exports.decline = function (req, res) {
    // console.log("-----Cambio rechazado (interchange controller)-----");
    // console.log(JSON.stringify(req.params));
    interchangeService.decline(req.params)
        .then(function (result) {
        res.send(result);
    })
        .catch(function (err) {
        res.status(400).send(err);
    });
};
module.exports.activate_shift = function (req, res) {
    // console.log("-----Cambio Activado(interchange controller)-----");
    // console.log('STATUS: ' + req.statusCode);
    // console.log(JSON.stringify(req.body));
    // console.log('HEADERS JSON: ' + JSON.stringify(req.headers));
    // console.log("---------------------------------------");
    interchangeService.activateShift(req.body)
        .then(function (result) {
        // console.log("Resuultado a devolver : " +JSON.stringify(result));
        var emptyObject = {};
        res.send(emptyObject);
    })
        .catch(function (err) {
        console.log("error : " + err);
        res.status(400).send(err);
    });
};
//# sourceMappingURL=interchange.controller.js.map