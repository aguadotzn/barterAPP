/* Servicios: este servicio afecta a los "shifts" o eventos del calendario*/
var config = require('config.json')
var _ = require('lodash')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var Q = require('q')
var mongo = require('mongoskin')
var db = mongo.db(config.connectionString, {
})
db.bind('schedule')

var service = {}

service.getAll = getAll
service.create = create
service.move = move
service.delete = _delete

module.exports = service

//Obtener todos
function getAll (scheduleParam) {
  var deferred = Q.defer()
  if (scheduleParam.company === 'ADMIN') {
    db.schedule.find({ 'start': { "$gt": scheduleParam.start }, 'end': { "$lt": scheduleParam.end }}).toArray(function (err, schedule) {
      if (err) deferred.reject(err.name + ': ' + err.message)
      deferred.resolve(schedule)
    })
  }
    else
        db.schedule.find( {'company' : scheduleParam.company , 'start' : { "$gt": scheduleParam.start } , 'end' : { "$lt": scheduleParam.end }} ).toArray(function (err, schedule) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(schedule)
        })
    return deferred.promise
}
//Crear evento
function create(scheduleParam) {
    var deferred = Q.defer()

    db.schedule.insert(
        scheduleParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message)
            deferred.resolve()
        })
    return deferred.promise
}

// Mover evento
function move (text, company, start, end) {
  var deferred = Q.defer()
  var set = {
    start: start,
    end: end
  }

  db.schedule.update(
        { text: text, company: company },
        { $set: set },
        function (err, doc) {
          if (err) deferred.reject(err.name + ': ' + err.message)
          deferred.resolve()
        })
  return deferred.promise
}

// Eliminar
function _delete (text, company) {
  var deferred = Q.defer()

  db.schedule.remove(
        { text: text, company: company },
        function (err) {
          if (err) deferred.reject(err.name + ': ' + err.message)
          deferred.resolve()
        })
  ∫return deferred.promise
}
