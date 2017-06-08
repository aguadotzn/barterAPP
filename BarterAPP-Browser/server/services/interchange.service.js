/* Servicios: intercambio de los turnos
    "personaHacePeticion" : "Admin",   // el que quiere cambiar
    "personaRecibePeticion" : "Adrian", // el que puede cambiar
    "personaHacePeticion_event_id" : ObjectId("592d4adef23ef815709076a3"),  //  desde que evento cambiar
    "personaRecibePeticion_event_id" : ObjectId("592d79b077ece519bc534034") //  por el evento que voy a cambiar
*/
var config = require('config.json')
var _ = require('lodash')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var Q = require('q')
var mongo = require('mongoskin')
var db = mongo.db(config.connectionString, {
})

// Se especifica que colecciones estamos usando
db.bind('interchange')
db.bind('event')

var service = {}
