// Controller: eventos
// Exporta los servicios
﻿var express = require('express');
var router = express.Router();
var eventService = require('../services/event.service.js');

module.exports.create_event =  function (req, res) {
    eventService.create(req.body)
        .then(function (event) {
        	 res.send(event);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.create_events =  function (req, res) {
  eventService.createAll(req.body)
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


module.exports.list_all_special_events = function (req, res){
    eventService.getSpecialByCompanyByWorker(req.params)
    .then(function (events) {
        res.send(events);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });



}

module.exports.list_all_events_by_company  = function (req, res) {
    eventService.getAllByCompany(req.params)
    .then(function (events) {
        res.send(events);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}


module.exports.list_all_events_by_company_by_worker = function (req, res) {
    eventService.getAllByCompanyByWorker(req.params)
        .then(function (schedule) {
            res.send(schedule);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



module.exports.list_all_free_events_by_company_by_day_by_shift_except_currentUser = function(req, res){
	//console.log("EVENTOS controller: parametros json : " + JSON.stringify(req.params));
	eventService.findFreeUsersByCompanyByDayByShift(req.params)
    .then(function (schedule) {
      res.send(schedule);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });

}

module.exports.update_event = function (req, res) {
    eventService.update(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.update_events = function (req, res) {
  eventService.update_events(req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

module.exports.delete_event = function (req, res) {
  // console.log("*****************event controller (eventos libres por empresa/usuario) " + JSON.stringify(req.params));
    eventService._delete(req.params)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.delete_events = function (req, res) {
  console.log("I am in event controller : req.ids : " + req.query.ids);
  eventService._delete_events(req.query.ids)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}
