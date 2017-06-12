// Controller: intercambio
// Funciones de control de cambio de turno

var config = require('config.json')
var express = require('express')
var router = express.Router()
var interchangeService = require('services/interchange.service')

module.exports.test_mongoskin = function (req, res) {
  interchangeService.testMongoskin(req.body)
        .then(function (interchanges) {
          res.send(interchanges)
        })
        .catch(function (err) {
          res.status(400).send(err)
        })
}

// Aceptar cambio
module.exports.accept_shift = function (req, res) {
// console.log("-----Cambio aceptado (interchange controller)-----");
// console.log(JSON.stringify(req.body));
  interchangeService.accept_shift(req.body)
        .then(function (result) {
          res.send(result)
        })
        .catch(function (err) {
        // console.log("error : " +err)
          res.status(400).send(err)
        })
}

// Rechazar intercambio
module.exports.decline = function (req, res) {
// console.log("-----Cambio rechazado (interchange controller)-----");
// console.log(JSON.stringify(req.params));
  interchangeService.decline(req.params)
        .then(function (result) {
          res.send(result)
        })
        .catch(function (err) {
          res.status(400).send(err)
        })
}

// Activar intercambio
module.exports.activate_shift = function (req, res) {
// console.log("-----Cambio Activado(interchange controller)-----");
// console.log('Estado: ' + req.statusCode);
// console.log(JSON.stringify(req.body));
// console.log('Cabeceras JSON: ' + JSON.stringify(req.headers));
// console.log("---------------------------------------");
  interchangeService.activateShift(req.body)
    .then(function (result) {
    // console.log("Resuultado a devolver : " +JSON.stringify(result));
      var emptyObject = {}
      res.send(emptyObject)
    })
    .catch(function (err) {
    // console.log("error : " +err);
      res.status(400).send(err)
    })
}
