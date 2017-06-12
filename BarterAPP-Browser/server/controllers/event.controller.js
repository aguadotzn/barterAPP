// Controller: eventos
//Exporta los servicios

var config = require('config.json')
var express = require('express')
var router = express.Router()
var eventService = require('services/event.service')

//Crear evento
module.exports.create_event =  function (req, res) {
    eventService.create(req.body)
        .then(function (event) {
        	 res.send(event);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.list_all_events = function (req, res) {
    eventService.getAll()
        .then(function (events) {
            res.send(events);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}